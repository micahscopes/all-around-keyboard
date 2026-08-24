# all-around-keyboard

A radial musical keyboard implemented as a native custom element with SVG,
Shadow DOM, and `d3-shape`. It does not use Lit or another component framework.
The package ships TypeScript declarations for the imperative APIs and events.

[Demo](http://micahscopes.github.io/all-around-keyboard)

## Basic use

```html
<script src=".../all-around-keyboard.min.js"></script>

<all-around-keyboard
  notes-in-octave="12"
  raised-notes="[1,3,6,8,10]"
  sweep="90"
  octaves="2"
  depth="100"
  width="500"
  overlapping="0.5">
</all-around-keyboard>
```

The established attributes and properties remain supported. Geometry options
are `notes-in-octave`, `raised-notes`, `octaves`, `sweep`, `depth`, `width`,
`overlapping`, `pie`, `base-tone`, `base-key`, and `leftmost-key`. Geometry
transitions are opt-in through `transition-time`; the default is `0` and reduced
motion always disables them.

Scheduling is intentionally FRP-like but browser-native: synchronous setters,
MutationObserver, and ResizeObserver only update normalized state/dirty sets;
one `requestAnimationFrame` projects the latest lawful snapshot. Composed
`CustomEvent`s carry input intent in the reverse direction. There is no Lit,
framework scheduler, signal runtime, or serial render queue.

State bursts are diffed against the last rendered snapshot at flush time, so
superseded intermediate keys do not inflate renderer work. A 100-snapshot burst
still projects only the final lawful state in one frame.

## Atomic state projection

The six state properties still work, but high-rate callers should publish one
patch. Omitted fields are unchanged and an explicit empty iterable clears a
field.

```js
keyboard.updateState({
  pressedKeys: [36],
  pressedNotes: [],
  litKeys: [40, 43],
  litNotes: [0, 4, 7],
  hoveredKeys: new Set([41]),
});
```

`pressedKeys`, `litKeys`, and `hoveredKeys` contain absolute keyboard keys.
Their `*Notes` counterparts contain period-relative notes. Calls are
synchronous, return no paint promise, and coalesce to the latest state for the
next render. Applications should not await rendering before accepting another
command or publishing another revision.

`keyboard.updateComplete` and `keyboard.whenRendered()` are optional testing or
observation boundaries:

```js
keyboard.updateState({ litNotes: [0, 4, 7] });
await keyboard.updateComplete;
```

Synchronous API validation errors throw from the setter/call. Failures during
an asynchronous render are sent to `keyboard.onRenderError` and the
`rendererror` event; they do not roll back application state.

The declarative state attributes remain available:

```html
<all-around-keyboard
  pressed-keys="[36]"
  lit-notes="[0,4,7]"
  hovered-keys="[38]">
</all-around-keyboard>
```

## Typed overlays and indicators

Locations are explicit. `{ key: 36 }` is one absolute key, `{ note: 0 }`
matches that period-relative note in every displayed period, and
`{ pitch: 6.42 }` is a continuous keyboard position. Ambiguous or out-of-range
locations are rejected.

```js
keyboard.setOverlay({
  id: 'selection:c',
  at: { note: 0 },
  patterns: ['toggle-lines'],
});

keyboard.setIndicator('voice:self', {
  at: { pitch: 6.42 },
  radius: 0.67,
  wave: { number: 2, amplitude: 0.1, phase: 0.2 },
});

keyboard.removeOverlay('selection:c');
keyboard.removeIndicator('voice:self');
```

`updateOverlays()` (also available as `setOverlays()`) accepts a complete typed
overlay snapshot. Stable IDs retain their SVG or HTML nodes when their location
or presentation changes. Multiple overlay IDs may occupy the same key. Their
z-order is their first rendered creation order; moving/updating a stable ID does
not silently raise it above its peers, and pattern order is preserved within an
ID.

Overlay patterns continue to use the light-DOM compatibility protocol. Pattern
IDs referenced by the typed API must already be supplied:

```html
<svg slot="overlay-pattern" aria-hidden="true">
  <defs>
    <pattern id="toggle-lines" width="8" height="8"
             patternUnits="userSpaceOnUse">
      <path d="M0 0L8 8" stroke="currentColor"></path>
    </pattern>
  </defs>
</svg>
```

Existing `data-key-overlay`, `data-overlay-id`, `data-overlay-pattern`,
`data-pitch`, `data-key`, `data-radius`, and wave attributes are still supported
as declarative adapters. Wave number, amplitude, and phase may explicitly be
zero.

## Keyed labels and custom tuning

Typed labels place and diff caller-owned text without embedding solfège,
spelling, locale, or twelve-tone policy in the element:

```js
keyboard.setLabel({
  id: 'degree:tonic',
  at: { note: 0 },
  text: 'Do',
  ariaLabel: 'tonic, do',
  className: 'tonic',
});

keyboard.updateLabels(nextLabels); // complete typed-label snapshot
keyboard.removeLabel('degree:tonic');
```

`setLabels()` is an alias for complete snapshots. A label at `{ note }` gets
one stable text node per matching displayed key. `notesInOctave` may be any
positive integer.

Custom frequencies can be a function, keyboard-relative array, absolute-key
`Map`/object, a constant, or `null` for equal temperament:

```js
keyboard.frequencyProvider = (absoluteKey, context) => {
  return myTuning[context.offset];
};

keyboard.frequencyProvider = [261.63, 293.66, 329.63];
keyboard.frequencyProvider = new Map([[36, 261.63], [37, 277.18]]);
```

Frequency-only changes update key metadata without rebuilding SVG geometry.

## Read-only graph anchors

Graph/canvas adapters can obtain coordinates without reaching into the shadow
tree:

```js
const one = keyboard.getAnchor({ key: 36 });
// { revision, space: 'viewBox', at: { key: 36 }, points: [...] }

const batch = keyboard.getAnchors(
  [{ key: 36 }, { key: 40 }, { note: 0 }],
  { space: 'host', radius: 0.5 },
);
```

`viewBox` coordinates require no layout read. `client` reads one group CTM for
the whole batch. `host` reads one CTM and one host rectangle for the whole
batch, regardless of edge count. Results carry `geometryRevision`; call after
`updateComplete` when observing a just-submitted geometry change. A `{ note }`
anchor contains one point for every matching displayed key.

## Interaction events

`keyboardintent` is the preferred composed event. Its detail always names both
the absolute `key` and period-relative `note`.

```js
keyboard.addEventListener('keyboardintent', event => {
  const { type, interactionId, key, note, source } = event.detail;
  // Send intent to the application's authority boundary; do not treat
  // `activate` as a durable commit.
});
```

Pointer and keyboard activation ordering is `press`, `release`, `activate`.
`press`, `release`, and `activate` share a component-local `interactionId`.
Pointer cancellation, lost capture, or keyboard blur emits a canceled
`release` and no `activate`. Hover/unhover and focus/blur are separate intents.
Pointer details also include `pointerId`, `pointerType`, and `pressure`.

Legacy `keyclick`, `keyhover`, `keyunhover`, `keypointerdown`, and
`keypointerup` events remain available with their existing `{ index, note }`
detail. For compatibility, legacy `keyclick` still fires on the initial pointer
or keyboard press; new code should use `keyboardintent` when release/activation
semantics matter.

Arrow keys move focus. Enter and Space activate the focused key. Key SVG paths
retain button roles, accessible names, `tabindex`, focus styling, and
`aria-pressed` state.

## Revision-aware projections

`KeyboardProjectionAdapter` is an optional gate between a model/worker/store
and the element. It applies snapshots and contiguous patches synchronously,
coalesces their DOM work through the keyboard, ignores stale revisions, and
requests one reset when continuity is lost. It never queues an unbounded replay
or owns transport/persistence policy.

```js
const projection = new KeyboardProjectionAdapter(keyboard, {
  onGap({ expectedRevision, receivedRevision }) {
    requestCurrentSnapshot({ expectedRevision, receivedRevision });
  },
});

projection.applySnapshot({
  revision: 10,
  state: { litKeys: [36] },
  overlays: [],
  indicators: [],
  labels: [],
});

projection.applyPatch({
  revision: 11,
  state: { litKeys: [37] },
  labels: {
    upsert: [{ id: 'degree', at: { key: 37 }, text: 'Re' }],
    remove: [],
  },
});
```

Patch collections use `{ upsert, remove }`. A skipped patch emits one composed
`projectiongap` event and calls `onGap` once until a current snapshot is
applied. Omitted snapshot collections remain untouched; an explicit empty
collection removes objects managed by that adapter.

## Optional demonstration synth

The built-in synth is off by default. Connecting or rendering never creates an
`AudioContext`; it is created only after `synth` is enabled and a pointer or
keyboard gesture occurs. Voices are pooled per key and disposed when synth is
disabled or the element disconnects.

```html
<all-around-keyboard synth="true" synth-gain="0.05"></all-around-keyboard>
```

Visual `pressedKeys`/`pressedNotes` state does not trigger audio. Applications
with MIDI or production audio should subscribe to the same model/intents via a
separate audio adapter.

## Diagnostics and verification

Diagnostics are off by default:

```js
keyboard.onRenderStats = stats => performancePanel.record(stats);
keyboard.onRenderError = ({ error, context }) => report(error, context);
```

The dependency-free source-direct checks speak CDP to the already-running
Chromium debugging endpoint and do not require a package install or bundle
build:

```sh
node test/source-policy.mjs
node test/key-layout.mjs
node test/browser/compatibility.mjs
node test/browser/reduced-motion.mjs
node test/browser/visual-snapshot.mjs
node test/browser/trace.mjs
AAK_BENCH_ITERATIONS=30 AAK_BENCH_SUMMARY=1 node test/browser/benchmark.mjs
```

Independent source-direct profiles are available for an already-installed
Playwright CLI. Start `node test/browser/serve.mjs`, then pass
`test/browser/playwright-profile.js` and `test/browser/playwright-matrix.js` to
the CLI's `run-code --filename` command. This is optional and does not require
adding Playwright to this package; the exact no-install commands and recorded
checkpoints are in `PERFORMANCE.md`.

See [PERFORMANCE.md](PERFORMANCE.md) for evidence and reproducibility notes and
[MIGRATION.md](MIGRATION.md) for compatibility details.

## CSS custom properties

The established key variables remain supported, including
`--key-lower-fill`, `--key-upper-fill`, `--key-pressed-fill`,
`--key-highlight-*`, `--key-hover-opacity`, `--key-stroke-width`, and focus
variables. Typed indicators expose `::part(indicator)`; typed labels expose
`::part(label)` and `::part(annotation-label)` plus `--annotation-label-*`
properties.

Inspired by [Mike Bostock's radial keyboard example](https://bl.ocks.org/mbostock/5723d93e4f617b542991).
