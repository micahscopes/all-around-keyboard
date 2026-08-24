# Performance and responsiveness wishlist

**Status:** implemented and release-audited for `v1.9.0`; see
[`PERFORMANCE-AUDIT.md`](PERFORMANCE-AUDIT.md), 2026-08-25
**Target:** preserve the current component's appearance and semantics while
making warm musical interaction fit comfortably inside one browser frame.

This is deliberately more specific than a general TODO list. It records the
costs seen in a real consumer, separates library work from consumer mistakes,
and proposes APIs, algorithms, tests, and budgets an implementation agent can
work through without guessing what “make it faster” means.

## Desired experience

- Pressed/lit/hovered key state should update in the current frame whenever the
  caller changes state before the frame deadline.
- An overlay add/remove should take at most one animation-frame boundary, not
  an unconditional two-frame delay.
- A burst of related state or indicator changes should produce one scheduled
  render and one geometry-read phase.
- Assigning state which is already current should produce no DOM mutation.
- An unchanged keyed overlay should retain its DOM node and SVG path.
- Indicator frequency/pitch updates should not alternate DOM writes with
  forced layout reads for every changed attribute and every indicator.
- The declarative HTML attribute API must remain supported, but high-frequency
  callers need a typed, batched JavaScript API which is difficult to misuse.

The keyboard is a DOM renderer and should remain on the main thread. A worker
can keep an application's model, storage, crypto, or materialization work off
that thread, but moving a 12-key SVG calculation through worker messages would
not solve this component's scheduling and layout problems.

## Integration invariant: a projection, never a serial dependency

`all-around-keyboard` must be usable as a passive projection of application
state. An application publishes a snapshot or revision to the renderer; its
command, validation, persistence, synchronization, and replica-notification
paths continue without waiting for DOM work or paint.

In particular:

- `updateState`, `setOverlays`, and `setIndicator` enqueue/coalesce rendering;
  they do not make a caller await layout or animation.
- `updateComplete` is an optional observation/testing boundary. It must never be
  required to submit the next application command or network record.
- A slow renderer converges toward the latest supplied state. It may coalesce
  superseded intermediate revisions when the application says that is lawful.
- A revision-aware adapter retains a last-applied revision. If it falls behind
  or loses incremental continuity, it requests/applies one current reset
  snapshot instead of backpressuring the application's source of truth.
- Rendering failures are reported through an error/debug channel. They do not
  roll back durable state or prevent dissemination.
- User input emitted by the component is an intent. The application decides
  whether to optimistically project it and routes the authoritative command
  through its own validation/authority boundary.
- MIDI/audio feedback and DOM presentation may subscribe to the same projected
  model, but neither subscriber calls or waits for the other.

A useful downstream boundary is therefore:

```text
durable/realtime model revision
          |
          +--> keyboard adapter --coalesces--> all-around-keyboard
          +--> MIDI/audio adapter
          +--> other UI projections
```

The component should make that architecture easy, but it must not absorb the
application's replica, transport, worker, or optimistic-state policy.

### Slim interaction feedback

The reverse interface should carry user intent, not mirrored component state.
Consolidate the current overlapping mouse/touch/pointer/custom events into a
small stable vocabulary such as:

```ts
type KeyboardIntent =
  | {
      type: 'press' | 'release' | 'activate';
      interactionId: number;
      key: number;       // absolute keyboard key
      note: number;      // pitch class in the configured layout
      source: 'pointer' | 'keyboard' | 'midi';
      pointerId?: number;
      pressure?: number;
      timeStamp: number;
    }
  | {
      type: 'focus' | 'blur' | 'hover' | 'unhover';
      key: number;
      note: number;
      source: 'pointer' | 'keyboard';
      timeStamp: number;
    };
```

Keep this interface intentionally narrow:

- emit each semantic press/release/activation once;
- always include both explicitly named absolute `key` and pitch-class `note`;
- let the application define “toggle,” command creation, capability use,
  optimistic feedback, and durable confirmation;
- never include a full keyboard-state echo in each event;
- never mutate application state or await a command handler;
- do not make render-completion or diagnostic events part of the musical input
  stream;
- offer ordinary composed `CustomEvent`s for web users, while adapters may
  expose the same events as an `AsyncIterator`, futures stream, signal, or
  framework callback;
- document event ordering and pointer-cancellation behavior, but do not promise
  that an `activate` is a durable application commit.

`interactionId` is local correlation only. A host may use it to associate an
optimistic projection with later authoritative confirmation/correction; it is
not a globally unique operation ID or replica identity.

### Later integration lane: Possibly Solfège and musical graphs

After the rendering and interaction contracts are stable, shore up the
integration with Possibly Solfège and graph-based musical interfaces. This
should be an adapter/projection layer over the same normalized keyboard model,
not solfège rules or a graph database embedded in the custom element.

First make the coordinate vocabulary explicit and shared:

```ts
type KeyboardLocation =
  | { key: number }                       // absolute key in this layout
  | { note: number }                      // pitch class / period-relative step
  | { pitch: number };                    // continuous position

type KeyboardLabel = {
  id: string;
  at: { key: number } | { note: number };
  text: string;
  ariaLabel?: string;
  className?: string;
};
```

- A solfège adapter owns tonic, mode, fixed-do versus movable-do, chromatic
  syllables, enharmonic spelling, locale, and octave-display policy. It projects
  the result through keyed labels; the keyboard only places and diffs them.
- Do not bake twelve-tone note names into the typed API. `notesInOctave` and a
  caller-supplied label provider must work for other equal divisions and custom
  layouts. The current built-in note names can remain a convenience default.
- Give every projected label, graph node, overlay, and indicator a stable
  application ID. Revisions update those objects in place rather than replacing
  their DOM nodes.
- A graph adapter maps application vertices to keyboard locations and vertex
  state to labels, overlays, or indicators. It consumes snapshots/diffs; it does
  not make the keyboard query a graph, replica, index, or store.
- For edges and other relationships, expose a read-only, revisioned anchor API
  such as `getAnchor({ key })` / `getAnchor({ note })`. An external SVG/canvas
  graph layer can then connect keys without reaching into the shadow DOM. Batch
  anchor reads after geometry changes and never perform one layout read per
  edge.
- Keep graph topology and layout policy outside the component. A small graph may
  use the keyboard's radial positions directly; a large graph can use its own
  sparse-matrix, force, or indexed projection and render only the visible
  keyboard annotations.
- Route graph/solfège interaction back through `KeyboardIntent` plus stable
  application IDs supplied by the adapter. Do not add replica records, graph
  mutations, or full-state echoes to component events.
- Support both current snapshots and incremental patches with a monotonic
  projection revision. A missed patch causes one reset snapshot, not a blocked
  input path or an unbounded replay through the DOM.

Integration tests should cover tonic/mode changes without key reconstruction,
non-12-note layouts, label/ARIA agreement, stable node identity, graph-node
selection feedback, edge-anchor updates after geometry changes, and recovery
from a skipped projection revision.

## Evidence and current cost model

### What is the library, and what is its consumer?

A historical Walkie Songie trace from 2026-08-08 captured a piece-drop path,
not the current ordinary toggle path. Its approximately 146 ms `pointerup`
microtask contained roughly 122 ms in repeated consumer/WASM callbacks and
about 10 ms in two `all-around-keyboard` MutationObserver callbacks. Within the
keyboard callbacks, roughly 5.7 ms was layout work and about 2 ms was debug
logging. Treat these numbers as localization evidence, not a current benchmark
or a claim that the component caused the entire interaction delay.

The consumer also had a concrete identity-unit bug: it stored absolute key
indices such as `36..47` in `data-key-overlay`, but compared those values with a
pitch-class set `0..11`. It therefore removed and recreated every active toggle
overlay on every sync. That is a consumer bug, but the component's untyped
integer/light-DOM API made it easy and amplified it through the most expensive
update path. The library should make absolute keys and pitch classes distinct
in its public vocabulary.

### Library costs visible in the current source

1. `_updateOverlays()` and `_updateIndicators()` each schedule nested
   `requestAnimationFrame` callbacks. A mutation may therefore be delayed by
   approximately two frames even when the browser is idle.
2. Every direct light-DOM `childList` mutation marks both all indicators and all
   overlays dirty. Overlay-only changes needlessly run indicator placement;
   indicator-only child changes needlessly scan overlays.
3. Indicator attribute mutations call `_updateIndicator(target)` immediately.
   A caller which sets `data-pitch`, `data-radius`, and wave parameters in one
   turn can position the same element repeatedly.
4. `_updateIndicator()` calls `getScreenCTM()` and
   `getBoundingClientRect()` per target after style writes. Across several
   indicators this interleaves reads and writes and can force repeated layout.
5. `_updateIndicators()` rescans all light-DOM children and calls
   `_observeIndicatorChildren()` again after every full refresh.
6. `_updateOverlays()` rescans all children and writes every overlay path's `d`
   even when neither the overlay specification nor key geometry changed.
7. Each pressed/lit/hovered property setter immediately calls
   `_applyKeyStates()`, which scans every key. Sequential assignments multiply
   this work and expose intermediate visual states.
8. Geometry/configuration setters schedule setup even when the normalized value
   did not change.
9. `_updateIndicator()` contains a debug `console.log` which materializes
   `[...this._keyElements.keys()]` for every absolute-key indicator update.
10. `connectedCallback()` initializes a global `AudioContext` even when synth is
    disabled. Audio setup should be lazy and user-gesture-bound.
11. The distributed bundle used by the consumer was a copied, unpinned artifact
    whose provenance was not recoverable from a committed `dist` file. This is
    a reproducibility and profiling problem: source lines, bundle behavior, and
    version metadata can disagree.

At 12–24 keys, a single linear key scan is normally cheap. The primary problem
is repeated scans, forced scheduling delay, DOM churn, and repeated layout—not
the asymptotic cost of the arc generator itself.

## P0: remove avoidable work and make measurements trustworthy

### Remove production debug work

- Delete the `_updateIndicator` console log and any construction of key arrays
  used only by that log.
- Add a lint or browser test which fails on unexpected `console.log`,
  `console.warn`, or `console.error` during ordinary rendering.
- If diagnostics are useful, put them behind an explicit instance-level debug
  hook which is off by default and receives structured counters after a frame.

Suggested optional diagnostics:

```js
keyboard.onRenderStats = ({
  reason,
  dirtyKeys,
  dirtyIndicators,
  dirtyOverlays,
  geometryReads,
  domWrites,
  durationMs,
}) => { /* development tooling only */ };
```

### Make builds reproducible

- Restore a clean build from committed source and make `npm run build`
  deterministic.
- Generate source maps for readable performance captures.
- Embed or export the package version/commit in a non-enumerable diagnostic
  field, for example `AllAroundKeyboard.version`.
- Test the actual built ESM artifact, not only `src/main.js`.
- Consumers should pin an immutable release/tag or content hash. Do not require
  copying an unexplained minified file into application assets.
- Do not overwrite the current checkout's dirty source or deleted `dist` files
  without first reviewing them; they may be active user work.

### Establish a browser benchmark before changing scheduling

Add a Playwright-based harness using real Chromium. Record both stable work
counters and wall-clock distributions:

- 12, 48, and 128 keys;
- zero, 1, 8, and 32 indicators;
- zero, 1, 8, and 32 overlays;
- one state change, six sequential state-property changes, and a 100-update
  burst;
- geometry resize/configuration, ordinary key-state change, continuous pitch
  change, overlay add/remove, and no-op assignment;
- p50/p95/p99 scripting time, request-to-DOM-mutation latency, style/layout
  duration, scheduled frames, layout reads, key visits, node additions/removals,
  and long tasks.

Use `PerformanceObserver` and browser tracing for wall time. Add internal
counters in the unminified test build for deterministic assertions. Run a warm
iteration before collecting samples and keep page load/audio initialization out
of steady-state interaction numbers.

## P1: one coalesced renderer

Replace independent nested-rAF paths with one instance-owned scheduler. Every
mutation or property setter should only normalize input, mark precise dirty
state, and request at most one frame.

Candidate state:

```js
this._renderRequest = 0;
this._dirty = {
  geometry: false,
  keyState: new Set(),
  labels: new Set(),
  indicators: new Set(),
  overlays: new Set(),
  overlayRegistry: false,
};
```

Candidate scheduling rule:

```js
_invalidate(kind, value) {
  // Add the exact target/key or set the structural flag.
  this._markDirty(kind, value);
  if (this._renderRequest === 0) {
    this._renderRequest = requestAnimationFrame(() => this._flushRender());
  }
}
```

`_flushRender()` should have explicit phases:

1. snapshot and clear the dirty sets;
2. recompute structural geometry only if geometry is dirty;
3. perform all necessary layout reads once;
4. compute key/indicator/overlay outputs in JavaScript without touching DOM;
5. apply DOM writes in a batch;
6. if callbacks dirtied more state, schedule one subsequent frame.

Never call a layout-reading renderer synchronously from a MutationObserver.
Never use nested rAF as a general “layout should be ready” mechanism. If a
specific browser condition genuinely requires an extra frame, detect and
document that condition and keep it outside the normal path.

### Dirty routing

- A `data-key-overlay` or overlay-pattern change dirties only that overlay key.
- An indicator position attribute dirties only that indicator element.
- Adding/removing an indicator changes the indicator registry, not overlays.
- Adding/removing an overlay changes the overlay registry, not indicators.
- Geometry changes dirty keys, indicators, overlays, and labels because their
  positions depend on geometry.
- Pressed/lit/hovered changes dirty only keys whose derived visual state changed.
- ResizeObserver callbacks mark geometry/transform caches dirty; they do not
  render synchronously.

Mutation records from one microtask must be collected into `Set`s so three
attribute changes to one indicator result in one position computation.

## P1: batch and diff key state

Keep the current properties and observed attributes for compatibility, but add
one atomic high-frequency API:

```js
keyboard.updateState({
  pressedKeys,
  pressedNotes,
  litKeys,
  litNotes,
  hoveredKeys,
  hoveredNotes,
});
```

Requirements:

- Omitted fields remain unchanged; an explicit empty iterable clears a field.
- Normalize iterables to sets once.
- Compare each normalized set with the previous set. Equal input is a no-op.
- Compute the union of keys whose derived pressed/lit/hovered state may have
  changed and visit only those keys.
- Apply all classes and `aria-pressed` values in one flush, with no visible
  intermediate state.
- Property and attribute setters feed the same pending patch/scheduler, so six
  assignments in one task still coalesce.
- Return nothing or a small result synchronously; do not imply that paint has
  happened. Provide `updateComplete`/`whenRendered()` if a caller needs an
  awaitable frame boundary.

Example completion contract:

```js
keyboard.updateState({ litNotes: [0, 4, 7] });
await keyboard.updateComplete;
```

Avoid rebuilding synth nodes from the visual state diff. Separate visual state
from explicit note-on/note-off audio commands so unchanged key scans cannot
retrigger audio work.

## P1: typed, stable overlay ownership

The light-DOM `data-key-overlay="36"` protocol conflates an absolute key with a
pitch class and makes node identity the caller's problem. Add an imperative,
keyed API while retaining the declarative adapter:

```js
keyboard.setOverlay({
  id: 'selection:pc-0',
  at: { key: 36 },       // or: { note: 0 }
  patterns: ['toggle-lines'],
});
keyboard.removeOverlay('selection:pc-0');
keyboard.updateOverlays([
  { id: 'piece:a', at: { key: 40 }, patterns: ['piece-dots'] },
  { id: 'voice:me', at: { note: 7 }, patterns: ['voice-waves'] },
]);
```

Requirements:

- `{ key }` and `{ note }` are different shapes. Reject ambiguous or out-of-range
  locations instead of silently interpreting a bare integer.
- `id` supplies stable logical identity independent of location. Moving an
  overlay updates the existing object rather than removing/recreating it.
- Repeating the same specification is a no-op and preserves SVG node identity.
- Diff `updateOverlays()` by ID, location, and patterns.
- Maintain direct maps from overlay ID and key to rendered paths. Do not scan
  every light-DOM child on ordinary updates.
- Copy a key path's `d` only when the overlay is new, moves, changes pattern
  count, or the key's geometry revision changes.
- Define deterministic z-order and multi-overlay behavior. The current map by
  key can silently collapse multiple light-DOM sources at the same key.
- Validate pattern IDs once when specifications enter the registry.

The existing slotted/light-DOM representation can become a compatibility
adapter which parses changed nodes into the same registry. It should not be the
internal source of truth for high-rate updates.

## P1: indicator registry, geometry cache, and read/write separation

### Coalesce indicator changes

MutationObserver should add changed elements to `_dirty.indicators`. It should
not call `_updateIndicator()` immediately. A burst changing pitch, radius,
wave-number, amplitude, and phase on one element must position it once.

Provide an optional typed API for applications with continuous controllers:

```js
keyboard.setIndicator('voice:self', {
  at: { pitch: 6.42 },
  radius: 0.67,
  wave: { number: 2, amplitude: 0.1, phase: 0.2 },
});
keyboard.removeIndicator('voice:self');
```

As with overlays, the light-DOM attributes remain a declarative adapter over
the internal registry.

### Cache frame geometry once

For one flush, read at most:

- one current SVG group CTM;
- one host bounding rectangle;
- any explicitly necessary viewport/resize value.

Pass that immutable frame geometry into the pure indicator-position function.
Do not call `getScreenCTM()` and `getBoundingClientRect()` per indicator.

Split calculation from effects:

```js
const placement = calculateIndicatorPlacement(
  indicatorSpec,
  keyboardGeometry,
  keyParams,
  frameTransform,
);
applyIndicatorPlacement(element, placement);
```

Make `calculateIndicatorPlacement` pure and unit-test it across partial and
circular sweeps, boundary pitches, raised/lower keys, wave offsets, and missing
key geometry.

Read CTM/rect before writing any indicator styles. Apply all CSS properties
after every placement is calculated. If geometry and transforms did not change,
reuse the cached transform for subsequent state-only frames. Invalidate it on
resize, geometry rebuild, connection, or a documented ancestor-transform
change.

Prefer one CSS transform or `style.cssText`/Typed OM update over many individual
`style.setProperty` calls if measurement shows a benefit, but keep semantic CSS
custom properties which consumers actually use. Do not micro-optimize property
writes before eliminating repeated layout.

## P2: separate structural geometry from ordinary interaction

- Normalize and equality-check `notesInOctave`, `raisedNotes`, octaves, sweep,
  depth, width, overlap, pie, base tone/key, leftmost key, labels, and transition
  settings before invalidating.
- Assign each structural rebuild a monotonically increasing `geometryRevision`.
  Keys and overlays remember the revision of their last path.
- Preserve SVG key/text nodes when the key set is unchanged; update only changed
  paths/classes/labels.
- Do not re-append every raised key and every label solely to restore z-order on
  every setup. Maintain stable layer groups (`lower`, `upper`, `overlays`,
  `labels`) or re-order only when classification changes.
- Do not schedule a `setTimeout(..., 1)` per unchanged key. Toggle final classes
  synchronously when no transition is running.
- Cancel or supersede old geometry animations when a newer configuration
  arrives. One key must not have multiple concurrent rAF animation loops.
- Respect `prefers-reduced-motion`. Make transition latency opt-in for geometry
  changes; pressed/lit musical feedback should never inherit a long transition.

The D3 arc calculation can remain the reference geometry engine unless the
browser benchmark shows it dominates a structural rebuild. Ordinary pressed,
indicator, and overlay updates should not invoke it.

## P2: event and audio cleanup

### One semantic activation

The component currently exposes legacy mouse/touch behavior alongside pointer
events. Audit for duplicate activation on browsers which synthesize mouse events
after pointer/touch events.

- Use Pointer Events as the primary path with pointer capture for drag/release.
- Preserve keyboard Enter/Space activation and accessible focus behavior.
- Define `keyactivate`, `keydown`, or the existing `keyclick` semantics exactly:
  once per deliberate activation, with stable `{ index, note }` units.
- Tests should cover mouse, touch emulation, pen, keyboard, pointer cancellation,
  leaving the element, and multi-touch.
- Keep hover as a separate signal and do not synthesize it during activation
  unless documented.

### Lazy, explicit audio

- Do not create an `AudioContext` from `connectedCallback()` when synth is off.
- Initialize audio only after `synth` is enabled and a user gesture permits it.
- Make audio ownership instance-local or accept an injected audio engine; avoid
  ambient global state hidden behind a symbol.
- Move the demonstration oscillator synth into an optional module if that
  substantially simplifies the renderer.
- Pool/reuse voice nodes where appropriate and bound timers; do not create
  oscillator/gain/filter graphs during purely visual state reconciliation.
- Test that connecting a visual-only keyboard creates no AudioContext.

## P2: lifecycle and memory discipline

- Store every pending rAF/animation handle and cancel it on disconnect.
- Disconnect observers and clear references to removed light-DOM children.
- Avoid repeatedly calling `observe()` for every child after every frame.
  Observe new children once and unobserve removed children where practical.
- On reconnect, rebuild registries deterministically without duplicating
  listeners, observers, SVG definitions, or paths.
- Add a connect/disconnect stress test and assert stable node, listener, and
  observer counts after garbage collection where the test environment permits.
- Bound all maps by current keys/indicators/overlays and assert removed IDs leave
  no entries.

## Correctness and compatibility tests

Add automated tests before making the scheduler clever. At minimum:

1. every existing public attribute/property produces the same visible and ARIA
   state as before;
2. six state assignments in one JavaScript task cause at most one scheduled
   flush and no intermediate DOM state;
3. assigning equal state causes zero class/ARIA/path mutations;
4. one indicator receiving five changed attributes is positioned once;
5. N dirty indicators cause one CTM read and one host-rect read per frame;
6. an overlay-only change never runs the indicator renderer;
7. an indicator-only change never scans or rebuilds overlays;
8. an unchanged overlay retains the same SVG node object and `d` attribute;
9. two overlay IDs may occupy one key without replacing each other;
10. `{ note: 0 }` and `{ key: 0 }` have distinct, documented meanings;
11. partial and circular keyboards handle negative/wrapped continuous pitches;
12. resize/geometry changes correctly reposition keys, indicators, and overlays;
13. disconnect cancels pending work and reconnect does not duplicate state;
14. normal rendering produces no console output or long task;
15. keyboard, pointer, and touch activation remain accessible and fire once.

Use DOM node-identity assertions, MutationObserver counters, stubbed scheduler
counters, and visual snapshots. Avoid screenshot-only tests for scheduling and
identity invariants.

## Proposed performance budgets

These are initial engineering budgets for warm Chromium on a typical developer
machine, not cross-device service-level guarantees. Calibrate CI thresholds
after collecting distributions; retain the work-counter invariants even if CI
wall-clock thresholds need wider margins.

### 12-key interactive profile

- `updateState()` call: under 0.25 ms p95 before returning.
- request to key class/ARIA mutation: same task or next rAF, under 8 ms p50 and
  under one 60 Hz frame p95 when invoked before the frame deadline.
- overlay request to SVG mutation: no unconditional second frame; under one
  60 Hz frame p95.
- renderer scripting: under 2 ms p95 for one ordinary patch.
- zero layout reads for pressed/lit/hovered-only changes.
- at most one CTM and one host-rect read for any indicator frame.
- zero node additions/removals for equal state or stable overlays.
- zero long tasks attributable to the component.

### 48-key / 20-indicator profile

- renderer scripting: under 4 ms p95 for a batched indicator/state update.
- one scheduled flush per input task/burst.
- one geometry-read phase per frame, independent of indicator count.
- work proportional to changed keys/indicators/overlays unless geometry changed.

Also report slower-device results rather than weakening invariants. A browser
trace should make a missed budget attributable to scheduler delay, script,
style, layout, paint, or external main-thread contention.

## Suggested implementation order

1. Add tests, counters, source maps, and the baseline harness.
2. Remove debug logging and lazy-load/disable audio for visual-only use.
3. Introduce the single dirty-set scheduler without changing public APIs.
4. Batch indicator mutations and cache one CTM/rect per frame.
5. Coalesce current state setters and add `updateState()` plus
   `updateComplete`.
6. Introduce typed keyed overlay/indicator registries; route the existing
   light-DOM protocol through them.
7. Separate geometry revisions/layers and remove redundant DOM reordering,
   timeouts, and animation loops.
8. Consolidate pointer/touch/mouse behavior and add lifecycle stress tests.
9. Re-run the downstream Walkie trace after its absolute-key/pitch-class bug is
   fixed and its duplicate projection passes are removed.
10. Publish an immutable release with migration notes and have consumers pin it.

Each step should land with before/after work counts and a browser trace. Avoid a
large rewrite which simultaneously changes geometry, interaction semantics,
markup, and scheduling; it would make visual regressions and performance wins
hard to attribute.

## Definition of done

The performance pass is successful when an ordinary musical state update uses
one clear path:

```text
typed state/overlay/indicator patch
             -> precise dirty sets
             -> at most one scheduled frame
             -> one geometry-read phase if needed
             -> one batched DOM-write phase
```

No caller should need to understand MutationObserver timing, add/remove dummy
nodes, wait two frames, or manually duplicate component state to get immediate,
stable feedback.
