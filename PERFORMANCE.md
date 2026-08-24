# Performance evidence

## Test boundary

The automated browser harness serves `src/` directly, replaces the CSS import
in memory, and imports the pinned `d3-shape@3.2.0` browser module. Its
dependency-free CDP client connects to the existing Chromium remote-debugging
endpoint on `127.0.0.1:9222` by default; `AAK_CHROME_URL` can select an isolated
loopback browser. An independent `test/browser/playwright-profile.js` profile
can be passed to an already-installed Playwright CLI. Neither path installs
packages, invokes Rollup, or writes generated bundles.

Deterministic counters cover scheduled renderer frames, layout reads, key/data
visits, DOM writes, node additions/removals, observer counts, audio allocation,
and long tasks. Browser tests also assert node identity and mutation behavior;
screenshots are not used as a substitute for those invariants.

## Before/after checkpoint

The pre-scheduler diagnostic checkpoint found:

- one `AudioContext` created by visual-only connection;
- about 150 shadow-tree attribute/class mutation records for six sequential
  state assignments on the default keyboard;
- nested animation-frame scheduling on overlay work;
- repeated CTM/host-rectangle reads for individual indicator changes.

The current correctness harness proves:

- zero visual-only audio contexts;
- one renderer frame for six state assignments and a 100-snapshot burst;
- six affected-key visits for the six-field default state patch;
- zero layout reads for state-only updates;
- zero frames and zero DOM mutations for equal state;
- at most one CTM and one host-rectangle read in any indicator render frame;
- one frame for a typed overlay add/move, with zero node churn for a stable ID;
- stable key, overlay, indicator, and label nodes across their supported updates;
- one active mutation observer and one active resize observer per connected
  instance, returning to zero on disconnect across 25 stress cycles;
- one shared structural-animation clock, cancellation on superseding geometry
  or disconnect, and no animation under reduced motion.

## 30-sample Chrome checkpoint

Collected on 2026-08-24 in a fresh temporary-profile headless Chrome 150. The
browser was launched from the already-installed binary and stopped after
collection; no package or build command was involved.

| Profile/scenario | Sync p95 | Renderer script p95 | Latency p50 | Work result |
| --- | ---: | ---: | ---: | --- |
| 12 keys, state | 0.10 ms | 0.20 ms | 16.6 ms | 1 frame, 0 reads, 2 key visits |
| 12 keys, no-op | 0.10 ms | 0 ms | 0 ms | 0 frames/writes |
| 12 keys, overlay add/remove | 0.70 ms | 0.50 ms | 16.6 ms | 1 frame, 0 reads |
| 48 keys, 20 indicators plus state | 0.90 ms | 3.50 ms | 16.7 ms | 1 frame, 0 reads, 8 key visits, 0 churn |
| 48 keys, 20 indicator updates | 0.70 ms | 2.90 ms | 16.7 ms | 1 frame, 20 style writes, cached transform |
| 48 keys, 20 overlay moves | 1.20 ms | 3.30 ms | 16.5 ms | 1 frame, 0 reads/churn |
| 128 keys, state | 0.20 ms | 0.20 ms | 16.6 ms | 1 frame, 0 reads, 2 key visits |
| 128 keys, 32 indicators plus state | 5.20 ms | 13.20 ms | 30.5 ms | 1 frame, 0 reads, 18 key visits; 3 observed long tasks |

The work-counter invariants pass. The 12-key single-state sync and scripting
budgets pass, and the isolated 48/20 combined state/indicator renderer p95 is
3.50 ms against the provisional 4 ms budget. The wall-time budgets are not a
blanket pass: request latency is quantized around the browser's 60 Hz frame
cadence and therefore misses the provisional sub-8 ms p50 target for a call
made just after a frame boundary. The 128/32 combined and structural profiles
also show slower-device-style long-task/outlier behavior. The ordinary-work
invariants are retained rather than weakened around those results.

Runs against the shared visible Chrome 149 endpoint were much noisier, with
unrelated CPU contention producing p95 and long-task outliers even in 12-key
scenarios. They retained the same frame/read/visit/churn invariants. The fresh
temporary-profile result above is the more attributable local calibration;
neither is a cross-device service-level guarantee.

A current-source DevTools trace of one combined 48-key/20-indicator state patch
recorded one 1.70 ms renderer frame, 2.211 ms `UpdateLayoutTree`, 0.430 ms
`Layout`, 1.724 ms `Paint`, and no task at or above 50 ms. The frame reused its
cached transform, so the renderer itself made zero CTM/host-rectangle reads.
Run `node test/browser/trace.mjs` to repeat that attribution capture.

## Playwright CLI checkpoint

Collected on 2026-08-25 with an already-cached Playwright CLI 0.1.18,
Playwright 1.63.0-alpha-2026-08-05, and an already-installed headless Chrome
150. No npm command, fetch, install, or build was involved.

The profile first used role/name locators to click the first accessible C key,
then activated the focused key with Space. Both paths emitted correlated
`press`, `release`, `activate` intents with the expected pointer/keyboard source.
An atomic state patch updated two period-relative C keys, one lit key, one
hovered key, and `aria-pressed` in one frame with four key visits, no geometry
read, and no node churn.

The independent 30-sample 48-key/20-indicator result was 0.30 ms sync p95,
1.30 ms renderer p95, 16.6 ms request latency p50, and 17.8 ms latency p95. It
retained one frame, zero geometry reads, at most eight key visits, zero node
churn, and zero long tasks. The retained visual
is `output/playwright/playwright-cli-keyboard.png` (SHA-256
`3039f5e86aa17cc6df5e2b8c56474738690f52ab8cf690d29b30b664a044decd`), and
the captured trace is under `output/playwright/playwright-cli-trace/`.

The broader Playwright matrix runs five 30-sample profiles and all representative
state, burst, no-op, geometry, overlay, and indicator scenarios:

| Keys / indicators / overlays | Combined sync p95 | Combined renderer p95 | Latency p50 / p95 | Deterministic work |
| --- | ---: | ---: | ---: | --- |
| 12 / 0 / 0 | 0.20 ms state | 0.20 ms state | 16.6 / 17.1 ms | 1 frame, 0 reads, 2 key visits |
| 12 / 1 / 1 | 0.20 ms | 0.30 ms | 16.7 / 17.1 ms | 1 frame, 0 reads, 2 key visits, 0 churn |
| 48 / 8 / 8 | 0.20 ms | 0.50 ms | 16.6 / 17.4 ms | 1 frame, 0 reads, 8 key visits, 0 churn |
| 48 / 20 / 20 | 0.30 ms | 1.10 ms | 16.7 / 17.4 ms | 1 frame, 0 reads, 8 key visits, 0 churn |
| 128 / 32 / 32 | 0.40 ms | 1.70 ms | 16.6 / 18.3 ms | 1 frame, 0 reads, 18 key visits, 0 churn |

Every matrix lane produced zero console messages, page errors, deterministic
violations, and observed long tasks. A first diagnostic matrix run showed that
100 same-task snapshots still accumulated 12/12/48/48/100 intermediate key
visits despite rendering once. The scheduler now diffs the final pending state
against the last rendered snapshot at flush time; the repeated matrix recorded
at most two key visits in every 100-snapshot lane, with one frame, zero reads,
and zero churn. The 128-key structural lane remains intentionally reported:
14.50 ms renderer p95 and 29.4 ms request latency p95 in this run.

## Reproduce

With a Chromium debugging endpoint listening on port 9222:

```sh
node test/source-policy.mjs
node test/key-layout.mjs
node test/browser/compatibility.mjs
node test/browser/reduced-motion.mjs
node test/browser/visual-snapshot.mjs
node test/browser/trace.mjs
AAK_BENCH_ITERATIONS=30 AAK_BENCH_SUMMARY=1 node test/browser/benchmark.mjs
```

Set `AAK_BENCH_FULL=1` for the full key/indicator/overlay cross-product. Set
`AAK_BENCH_PROFILE=48:20:20` to isolate one key/indicator/overlay profile and
`AAK_CHROME_URL` to use another loopback debugging endpoint.

To repeat the independent profile without adding a repository dependency,
start `node test/browser/serve.mjs` in one terminal and copy its fixture URL.
Then use an already-installed Playwright CLI in another terminal:

```sh
AAK_PLAYWRIGHT_CLI=/absolute/path/to/playwright-cli.js
node "$AAK_PLAYWRIGHT_CLI" -s=aak-keyboard-profile open http://127.0.0.1:PORT/fixture
node "$AAK_PLAYWRIGHT_CLI" -s=aak-keyboard-profile run-code --filename="$PWD/test/browser/playwright-profile.js"
node "$AAK_PLAYWRIGHT_CLI" -s=aak-keyboard-profile run-code --filename="$PWD/test/browser/playwright-matrix.js"
node "$AAK_PLAYWRIGHT_CLI" -s=aak-keyboard-profile console
node "$AAK_PLAYWRIGHT_CLI" -s=aak-keyboard-profile close
```

Use the CLI's normal browser configuration on hosts where its default browser
is not available. This workflow intentionally contains no `npx`, install, or
build step.

## Downstream checkpoint

Read-only inspection found the named sibling consumers. Walkie Songie's dirty
Rust source already contains the absolute-key/pitch-class overlay fix and its
own performance note records one local plus one remote overlay mutation after
that cleanup. The currently running local Walkie app still serves a 31,961-byte
legacy `all-around-keyboard.esm.min.js` with SHA-256
`2bfc2a63569eca1945e2de47a6aed35479a83e2c1c89c413c18ffebf3acdee70`.
Runtime inspection found 12 rendered keys but no version, `updateState`,
`setOverlay`, or `setIndicator`, proving that it is not this release candidate.

Possibly Solfège is presently a native Rust MIDI/egui plugin rather than a web
keyboard adapter. The typed label, tuning, and anchor APIs are ready for a
future adapter, but no browser integration exists to trace. Neither sibling
checkout was modified.

## Release boundary

All four Rollup outputs and their source maps were generated for the `v1.9.0`
GitHub release with direct Rollup 4.53.5 execution. Builds from two independently
named toolchain roots with the same lockfile-pinned, integrity-verified inputs
were byte-identical across all eight files; map dependency paths are normalized
to `../node_modules/`. `test/browser/built-artifact.mjs` validated the maps and exercised the
ESM bundle in Chrome with no console output. `src/main.d.ts` and its strict
consumer passed both an in-memory syntax parse and an already-installed
TypeScript 5.9.3 compiler in strict, no-emit mode. No npm, npx, package lifecycle,
or documentation-copy command was run, and this release is not published to
npm.
