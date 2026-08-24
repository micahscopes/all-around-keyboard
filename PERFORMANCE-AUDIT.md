# Performance wishlist completion audit

Audit date: 2026-08-25

This is a requirement-by-requirement audit of the `v1.9.0` GitHub release. It
keeps runtime, built-artifact, downstream, and publication evidence separate so
the release does not imply an npm publication or a downstream consumer upgrade.

## Evidence boundary

- The primary source harness is dependency-free Node plus CDP against real
  Chrome. A separate profile also ran through an already-cached Playwright CLI
  0.1.18 / Playwright 1.63.0-alpha-2026-08-05; it added no repository package
  and fetched nothing.
- Source tests transform the CSS and extensionless imports in memory and load
  the pinned `d3-shape@3.2.0` browser module. Built-artifact tests load the
  generated ESM release candidate instead.
- Correctness runs used the existing visible Chrome 149 endpoint. Attributable
  performance calibration also used a fresh temporary-profile headless Chrome
  150 launched from an already-installed browser binary.
- No npm, npx, package-manager install, package lifecycle, or documentation-copy
  command was run. After explicit release authorization, the packages pinned by
  `package-lock.json` were staged without scripts in a temporary directory,
  verified against their SHA-512 integrity values, and removed after direct
  Rollup 4.53.5 execution.

## Experience and projection contract

| Requirement | Current evidence | Result |
| --- | --- | --- |
| One-frame ordinary state/overlay response | Six setters, 100 snapshots, typed overlay add/move, and declarative bursts each schedule one renderer frame. There is no nested renderer rAF. | Proven source-direct |
| Equal state and stable overlays do no work/churn | Equality tests record zero frame/DOM mutation; stable overlay IDs retain path objects and unchanged `d`. | Proven source-direct |
| One geometry-read phase | State/overlay frames read no layout. N invalidated indicators use at most one CTM plus one host rectangle; cached transforms make ordinary continuous frames read zero. | Proven source-direct |
| Passive, non-blocking projection | Mutation methods return synchronously; `updateComplete` is optional; 100 unawaited snapshots converge to the latest value. | Proven source-direct |
| Revision recovery without replay/backpressure | `KeyboardProjectionAdapter` applies snapshots/contiguous patches, ignores stale input, reports one gap/reset request, blocks late increments while a reset is pending, and retains no replay queue. | Proven source-direct |
| Errors do not become model policy | Validation throws synchronously. Async render/hook failures use `onRenderError`/`rendererror`; a later lawful update recovers. No persistence, transport, worker, replica, MIDI, or optimistic-state policy entered the element. | Proven source-direct |
| Audio and presentation are peers | Visual projection creates no audio context or voice. The optional synth is driven only by deliberate pointer/keyboard gestures. | Proven source-direct |

Structural geometry and real layout necessarily have a narrower exception: a
geometry rebuild writes the new SVG/viewBox before reading its resulting CTM for
indicators. It still performs only one read pair and one write-bearing renderer
frame. A real `ResizeObserver` delivery may subsequently schedule a transform-
only frame if the host content box actually changed; this is not ordinary
interaction or an unconditional nested frame.

## P0 evidence and reproducibility

| Requirement | Evidence | Result |
| --- | --- | --- |
| Remove debug/eager overhead | `test/source-policy.mjs` rejects production console calls and untracked timeouts. Ordinary browser tests collect zero component console messages. Visual connection creates zero audio contexts. | Proven |
| Structured diagnostics | `onRenderStats` reports reasons, exact dirty counts, reads, writes, key/data visits, node churn, scheduled frames, and internal duration after every renderer frame. | Proven |
| Version provenance | `VERSION`, non-enumerable `AllAroundKeyboard.version`, `package.json`, and both lockfile root versions agree on `1.9.0`. | Proven in source |
| Deterministic outputs/maps | Rollup declares four named outputs with fresh per-output plugins and `sourcemap: true`. Two direct builds from the same pinned inputs produced byte-identical hashes for all four JS/map pairs. | Proven release artifact |
| Actual built artifact | `test/browser/built-artifact.mjs` found every JS/map pair, validated v3 maps/source references, and exercised the ESM artifact and its typed APIs/version in Chrome with no console output. | Proven release artifact |
| Real-browser matrix | The CDP harness covers 12/48/128 keys, 0/1/8/20/32 indicators/overlays, state/six-setter/100-update/no-op/geometry/continuous/add-remove/move/combined scenarios, percentiles, counters, long tasks, and trace attribution. Setup observer work is drained before samples, and deterministic invariant violations make the benchmark exit nonzero. Independent Playwright CLI profiles cover accessible pointer/keyboard input and five 30-sample lanes: 12/0/0, 12/1/1, 48/8/8, 48/20/20, and 128/32/32. | Proven source-direct in CDP and Playwright |

The historical pre-pass checkpoint is localization evidence rather than a
replayable old bundle: visual connection allocated audio, six setters caused
roughly 150 shadow mutations, overlay work used nested frames, and indicator
updates repeated layout reads. The current `baseline.mjs` records zero eager
audio, one frame/eight writes/six key visits for the six-setter projection, and
one coalesced indicator frame. Because the old release provenance was already
missing, the before side cannot be promoted to built-artifact proof.

## P1 renderer and typed projection APIs

| Requirement | Evidence | Result |
| --- | --- | --- |
| One lifecycle-safe dirty renderer | One instance request snapshots precise dirty sets, clears them before work, reports stats, schedules only callback-induced follow-up work, cancels on disconnect, and settles completion. Mutation/resize observers only invalidate. | Proven |
| Atomic state diff | `updateState` implements omitted-versus-empty semantics, normalizes iterables once, equality no-op, last-write-wins convergence, and one atomic DOM flush. At flush, changed fields are diffed against the last rendered snapshot, excluding superseded intermediate keys. A structural note-to-key index makes note patches proportional to matching keys. | Proven |
| Stable typed overlays | Explicit `{ key }`/`{ note }`, stable IDs/paths, complete snapshot diff, direct ID/key maps, multiple owners, first-creation z-order, pattern validation, and declarative adapters are covered. `data-overlay-pattern` and `data-overlay-id` changes are observed. | Proven |
| Stable typed indicators | Explicit `{ key }`/`{ pitch }`, stable IDs/elements, owned/external cleanup, caller part/style preservation, coalesced attributes, pure placement, and one preserved `cssText` transaction per dirty indicator are covered. Zero-valued wave attributes remain zero. | Proven |
| Read/write separation for indicators | All placements are calculated from one immutable frame transform before any indicator style write. One invalidated frame reads one CTM/rect pair; cached frames read none. | Proven |
| API validation and types | Location objects reject multiple recognized units, unsupported units, missing IDs, invalid patterns, and out-of-range typed keys/notes. `src/main.d.ts` declares state, overlays, indicators, labels, anchors, intent, projection, tuning, diagnostics, and events. A strict no-emit consumer locks valid usage and three invalid locations; TypeScript 5.9.3 compiled it successfully. | Runtime and compiler proven |

## P2 structure, interaction, audio, and lifecycle

| Requirement | Evidence | Result |
| --- | --- | --- |
| Structural equality/revisions | Normalized equal settings schedule no work; reordered raised-note sets are equal; explicit empty raised notes work; geometry revisions are monotonic. Base tone/key and frequency providers update metadata without geometry or DOM writes. | Proven |
| Stable layers/nodes | Lower/upper/overlay/label groups are persistent. Geometry changes preserve matching key, label, overlay, and indicator identities and avoid blanket reappend. | Proven |
| Animation discipline | Geometry transition defaults to zero, uses one shared clock, follows overlay and labels, supersedes prior targets, cancels on disconnect, and is disabled by actual reduced-motion emulation. There are no renderer timeouts. | Proven |
| One semantic input vocabulary | Immutable composed `keyboardintent` emits press/release/activate once with local correlation and explicit key/note/source. Hover/unhover and focus/blur stay separate. Pen metadata, mouse lost capture, pointer cancellation/leave, touch multi-pointer separation, keyboard blur, Enter/Space, and legacy events are covered. | Proven |
| Lazy instance audio | Synth code is a separate module backed by per-instance weak state. Context creation is gesture-lazy; one voice is reused per key; disable, key removal, and disconnect dispose/release resources without timers. | Proven |
| Lifecycle bounds | A 25-cycle test proves one observer of each kind connected, zero disconnected, one delegated listener effect, one pattern clone, stable key/shadow nodes, and empty overlay/indicator/label ownership maps after removals. Pending render/animation/input state is canceled or cleared. | Proven |

## Solfège and graph integration lane

| Requirement | Evidence | Result |
| --- | --- | --- |
| Policy-free keyed labels | Stable typed labels accept `{ key }` or period-relative `{ note }`, support non-12 periods, update text/ARIA/class in place, and associate descriptions with the corresponding key buttons. Built-in 12-tone names remain only a convenience. | Proven |
| Caller-owned tuning | Function, constant, keyboard-relative array, absolute-key Map/object, sparse fallback, negative keys, and non-12-note periods are tested. | Proven |
| Revisioned graph anchors | `getAnchor(s)` supports viewBox/client/host spaces and returns all period matches plus geometry revision. ViewBox reads none; host batches one CTM/rect pair independent of edge count. | Proven |
| Graph/worker projection boundary | Snapshot/patch adapter projects state, labels, overlays, and indicators by stable application ID without querying or embedding a graph/store/replica. Gap recovery requests a current snapshot once. | Proven |
| Actual Possibly Solfège/downstream adapter | Sibling repositories exist outside this workspace. Walkie's dirty source already maps pitch classes to absolute overlay keys, and its performance note records one local plus one remote overlay mutation after that fix. The live local Walkie server still loads a 31,961-byte legacy keyboard bundle at SHA-256 `2bfc2a63569eca1945e2de47a6aed35479a83e2c1c89c413c18ffebf3acdee70`; it exposes no version, `updateState`, `setOverlay`, or `setIndicator`. Possibly Solfège is currently a native Rust MIDI/egui plugin, not a browser keyboard adapter. | Consumer unit fix evidenced; new release integration unproven |

## Minimum compatibility checklist

1. Established attributes/properties, visible classes, labels, ARIA, geometry,
   hit testing, and public CSS variables: covered.
2. Six assignments produce one flush and no intermediate DOM: covered.
3. Equal state produces zero frame/class/ARIA/path mutation: covered.
4. Five indicator attributes, including wave fields, position once: covered.
5. N indicators perform at most one CTM and one host-rect read: covered.
6. Overlay-only work reports zero dirty indicators: covered.
7. Indicator-only work leaves overlay object/path/`d` untouched: covered.
8. Stable overlay IDs retain the same SVG node and avoid equal `d` writes:
   covered.
9. Multiple overlay IDs on one key coexist: covered.
10. `{ note: 0 }` and `{ key: 0 }` remain distinct and ambiguous shapes throw:
    covered.
11. Partial/circular, negative/wrapped, raised/lower, wave, zero-depth, and
    missing-key indicator placement remains finite/hidden as appropriate:
    covered.
12. Resize/geometry changes reposition every projection layer: covered.
13. Disconnect cancels work and reconnect projects latest state without
    duplication: covered.
14. Ordinary rendering produces no component console output; isolated ordinary
    profiles produce no long task: covered. Large 128-key profiles have reported
    long tasks and are not mislabeled as an ordinary pass.
15. Pointer, mouse, touch, pen, keyboard, cancellation, leave/lost-capture,
    multi-touch, focus, and legacy activation semantics: covered.

## Current performance-budget result

| Provisional budget | Current evidence | Result |
| --- | --- | --- |
| 12-key `updateState` sync under 0.25 ms p95 | 0.10 ms isolated p95 | Pass locally |
| 12-key ordinary renderer under 2 ms p95 | 0.20 ms isolated p95 | Pass locally |
| Request-to-mutation under 8 ms p50 / one 60 Hz frame p95 | About 16.6 ms p50 and 17.3 ms p95 | p50 miss; p95 slightly over one nominal frame |
| Overlay has no unconditional second frame | One frame in correctness and benchmark runs | Pass invariant |
| State reads/churn | Zero layout reads; equal work zero; stable overlays zero churn | Pass invariant |
| 48-key/20-indicator combined renderer under 4 ms p95 | 3.50 ms isolated p95 | Pass locally |
| Independent Playwright 48-key/20-indicator combined renderer under 4 ms p95 | 1.10 ms matrix p95 and 1.30 ms accessibility-profile p95 across 30 samples each | Pass locally |
| One flush/read phase and proportional work | One frame, cached zero reads, 8 affected key visits, 20 indicator style writes | Pass invariant |
| Slower 128/32 reporting | Combined p95 13.20 ms with three observed long tasks; structural p95 39.40 ms | Reported, not hidden |

A current-source combined 48/20 DevTools trace recorded a 1.70 ms renderer
frame, 2.211 ms `UpdateLayoutTree`, 0.430 ms `Layout`, 1.724 ms `Paint`, and no
long task. Shared visible-Chrome results were noisier but retained the
deterministic work invariants. See `PERFORMANCE.md` for the complete calibration
boundary.

## Verification completed in the current worktree

- `node --check` on changed runtime and browser-test modules: passed.
- `node test/source-policy.mjs`: passed.
- `node test/key-layout.mjs`: passed.
- `node test/browser/baseline.mjs`: completed with no console/render error.
- `node test/browser/compatibility.mjs`: 24 scenarios passed; no console output.
- `node test/browser/reduced-motion.mjs`: passed with Chrome media emulation.
- `node test/browser/visual-snapshot.mjs`: passed at SHA-256
  `f6a089dc4de9af446663ccf31013231501a200d50f6c4f0f151ede559895b6e8`.
- `node test/browser/built-artifact.mjs`: passed against all four generated
  bundles and their v3 source maps; the ESM artifact reported version `1.9.0`,
  projected state/ARIA, and exposed the typed APIs and projection adapter.
- Direct Rollup 4.53.5 passes from two independently named temporary toolchain
  roots produced byte-identical SHA-256 hashes for all eight release artifacts;
  dependency sources are normalized to stable `../node_modules/` paths.
- `node test/browser/trace.mjs`: passed; isolated metrics are recorded above.
- The source-direct Playwright CLI profile passed accessible pointer and
  keyboard activation, atomic state/ARIA checks, and 30 combined samples: 0.30
  ms sync p95, 1.30 ms renderer p95, 16.6 ms latency p50, 17.8 ms latency p95,
  one frame, zero geometry reads, eight maximum key
  visits, zero node churn, zero long tasks. Its screenshot is
  `output/playwright/playwright-cli-keyboard.png` at SHA-256
  `3039f5e86aa17cc6df5e2b8c56474738690f52ab8cf690d29b30b664a044decd`;
  the corresponding trace is under `output/playwright/playwright-cli-trace/`.
- The independent Playwright matrix passed five 30-sample profiles spanning
  12/48/128 keys and 0/1/8/20/32 indicators/overlays, all nine representative
  scenarios, and every deterministic invariant with zero console messages or
  page errors. After final-state diffing was added, 100-snapshot bursts visit at
  most two keys in every profile, versus 12/12/48/48/100 in the diagnostic run
  immediately before that change.
- Bun's no-install TypeScript parser accepted `src/main.d.ts` and the strict
  `test/types/public-api.ts` consumer without writing artifacts.
- An already-installed Nix-store TypeScript 5.9.3 compiler then passed
  `test/types/tsconfig.json` in strict, no-emit mode. No package command, fetch,
  install, emitted artifact, or build script was involved.
- Thirty-sample isolated and release-candidate 12/48/128 representative
  profiles: completed; no component console output, long tasks, or deterministic
  invariant violations in the release run; timing results and misses are
  recorded above.
- `git diff --check`: passed.

## Release boundary and remaining downstream work

The GitHub release contains these reproducible artifacts:

| Artifact | Bytes | SHA-256 |
| --- | ---: | --- |
| `all-around-keyboard.js` | 125443 | `0ab8aa4407687bf3389c3afa8a37511810942f24a3f4950885f5804a9eb8859f` |
| `all-around-keyboard.js.map` | 259248 | `7043d6a020953efd103dc242544d5b2c9cca19594b0052528adfcf221e1c7096` |
| `all-around-keyboard.min.js` | 69263 | `04c9824156535cc74e98676c04af2897652668440622cdb9205f69739d5d0d11` |
| `all-around-keyboard.min.js.map` | 206202 | `e2672b945c00f5021c8d798ce64a85a36e6f2032b82f1b47d7a75ae82a991f9f` |
| `all-around-keyboard.esm.js` | 119114 | `b5ea10599dc167d9bdf0e8979a97bbc60831989d8d6ff0df1b4e464b51ec31cc` |
| `all-around-keyboard.esm.js.map` | 259229 | `3c9196fa47b576d784a7d9e3f7593b0b7faae3a5c3fa433f5617cb851bba0532` |
| `all-around-keyboard.esm.min.js` | 69229 | `bdf2cf76fd1605f5d3923c0ac3b6758f22dbf1d6ead4d5c9f2fdc9aafbcf4a59` |
| `all-around-keyboard.esm.min.js.map` | 206237 | `9b9669e72d29d9d730d3b0c102a824c7d92df21a21d5da1c9773c8278a67d27a` |

The remaining boundaries are deliberately outside this release:

1. The downstream repositories are present but outside this workspace.
   Walkie's unit fix is visible in its uncommitted source, but its live local app
   still serves a legacy, unversioned keyboard without the typed APIs. A
   post-upgrade downstream trace therefore requires a separate consumer change.
   Possibly Solfège has no browser adapter to verify yet.
2. This is a GitHub-only release. No npm package is published.
3. No downstream consumer is silently repinned or overwritten by this release.
