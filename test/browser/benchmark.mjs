import { openSourcePage, startSourceServer } from './harness.mjs';

const iterations = Math.max(3, Number.parseInt(process.env.AAK_BENCH_ITERATIONS || '30', 10));
const fullMatrix = process.env.AAK_BENCH_FULL === '1';
const summaryOnly = process.env.AAK_BENCH_SUMMARY === '1';
const profileFilter = process.env.AAK_BENCH_PROFILE || '';
const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  const report = await page.session.evaluate(`(async () => {
    const iterations = ${iterations};
    const fullMatrix = ${fullMatrix};
    const profileFilter = ${JSON.stringify(profileFilter)};
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const rendered = async keyboard => {
      await Promise.race([
        keyboard.updateComplete,
        sleep(3000).then(() => { throw new Error('render timeout'); })
      ]);
      if (keyboard._renderDeferred) await keyboard.updateComplete;
    };
    const drainSetupWork = async keyboard => {
      // ResizeObserver and slotchange notifications can arrive after the render
      // which caused them. Keep that setup work out of steady-state samples.
      for (let pass = 0; pass < 3; pass++) {
        await new Promise(resolve => requestAnimationFrame(() => resolve()));
        await rendered(keyboard);
      }
    };
    const percentile = (values, percentileValue) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((left, right) => left - right);
      const index = Math.min(sorted.length - 1, Math.ceil(percentileValue * sorted.length) - 1);
      return sorted[index];
    };
    const summarize = samples => {
      const field = name => samples.map(sample => sample[name]);
      const distribution = name => ({
        p50: percentile(field(name), 0.50),
        p95: percentile(field(name), 0.95),
        p99: percentile(field(name), 0.99),
        max: Math.max(...field(name))
      });
      return {
        samples: samples.length,
        syncMs: distribution('syncMs'),
        requestToCompleteMs: distribution('requestToCompleteMs'),
        scriptingMs: distribution('scriptingMs'),
        maxFrames: Math.max(...field('frames')),
        maxGeometryReads: Math.max(...field('geometryReads')),
        maxKeyVisits: Math.max(...field('keyVisits')),
        maxDomWrites: Math.max(...field('domWrites')),
        nodeAdditions: Math.max(...field('nodeAdditions')),
        nodeRemovals: Math.max(...field('nodeRemovals')),
        longTasks: field('longTasks').reduce((total, count) => total + count, 0)
      };
    };
    const measure = async (keyboard, action) => {
      action(-1);
      await rendered(keyboard);
      await drainSetupWork(keyboard);
      const samples = [];
      let frameStats = [];
      keyboard.onRenderStats = stats => frameStats.push(stats);
      for (let sampleIndex = 0; sampleIndex < iterations; sampleIndex++) {
        frameStats = [];
        const longTasks = [];
        const observer = globalThis.PerformanceObserver &&
          PerformanceObserver.supportedEntryTypes?.includes('longtask')
          ? new PerformanceObserver(list => longTasks.push(...list.getEntries()))
          : null;
        observer?.observe({ type: 'longtask', buffered: false });
        const startedAt = performance.now();
        action(sampleIndex);
        const syncMs = performance.now() - startedAt;
        await rendered(keyboard);
        const requestToCompleteMs = performance.now() - startedAt;
        observer?.disconnect();
        samples.push({
          syncMs,
          requestToCompleteMs,
          scriptingMs: frameStats.reduce((total, stats) => total + stats.durationMs, 0),
          frames: frameStats.length,
          geometryReads: frameStats.reduce((total, stats) => total + stats.geometryReads, 0),
          keyVisits: frameStats.reduce((total, stats) => total + stats.keyVisits, 0),
          domWrites: frameStats.reduce((total, stats) => total + stats.domWrites, 0),
          nodeAdditions: frameStats.reduce((total, stats) => total + stats.nodeAdditions, 0),
          nodeRemovals: frameStats.reduce((total, stats) => total + stats.nodeRemovals, 0),
          longTasks: longTasks.length
        });
      }
      keyboard.onRenderStats = null;
      return summarize(samples);
    };
    const addPatterns = keyboard => {
      const source = document.createElement('div');
      source.slot = 'overlay-pattern';
      source.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><pattern id="bench-pattern" ' +
        'width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0L8 8" stroke="red"/></pattern></svg>';
      keyboard.append(source);
    };
    const setupProfile = async ({ keys, indicators, overlays }) => {
      const keyboard = document.createElement('all-around-keyboard');
      keyboard.transitionTime = 0;
      if (keys === 128) {
        keyboard.notesInOctave = 16;
        keyboard.octaves = 8;
        keyboard.raisedNotes = [1, 3, 6, 8, 10, 13, 15];
      } else {
        keyboard.notesInOctave = 12;
        keyboard.octaves = keys / 12;
      }
      addPatterns(keyboard);
      document.body.append(keyboard);
      await rendered(keyboard);
      for (let index = 0; index < indicators; index++) {
        keyboard.setIndicator('bench-indicator:' + index, {
          at: { pitch: index % keys },
          radius: 0.35 + index % 5 * 0.1
        });
      }
      const overlaySpecs = Array.from({ length: overlays }, (_, index) => ({
        id: 'bench-overlay:' + index,
        at: { key: keyboard.leftmostKey + index % keys },
        patterns: ['bench-pattern']
      }));
      keyboard.updateOverlays(overlaySpecs);
      await rendered(keyboard);
      return { keyboard, overlaySpecs };
    };
    const counts = [0, 1, 8, 32];
    const profiles = [];
    for (const keys of [12, 48, 128]) {
      if (fullMatrix) {
        for (const indicators of counts) {
          for (const overlays of counts) profiles.push({ keys, indicators, overlays });
        }
      } else {
        for (const count of counts) profiles.push({ keys, indicators: count, overlays: count });
      }
    }
    if (!fullMatrix) profiles.push({ keys: 48, indicators: 20, overlays: 20 });
    const selectedProfiles = profileFilter
      ? profiles.filter(profile =>
          [profile.keys, profile.indicators, profile.overlays].join(':') === profileFilter)
      : profiles;
    if (selectedProfiles.length === 0) throw new Error('Unknown AAK_BENCH_PROFILE: ' + profileFilter);

    const results = [];
    for (const profile of selectedProfiles) {
      const { keyboard, overlaySpecs } = await setupProfile(profile);
      const scenarios = {};
      scenarios.singleState = await measure(keyboard, index => {
        keyboard.updateState({ pressedKeys: [keyboard.leftmostKey + (index & 1)] });
      });
      scenarios.sixStateAssignments = await measure(keyboard, index => {
        const offset = index & 1;
        keyboard.pressedKeys = [keyboard.leftmostKey + offset];
        keyboard.pressedNotes = [offset];
        keyboard.litKeys = [keyboard.leftmostKey + 2 + offset];
        keyboard.litNotes = [2 + offset];
        keyboard.hoveredKeys = [keyboard.leftmostKey + 4 + offset];
        keyboard.hoveredNotes = [4 + offset];
      });
      scenarios.hundredStateSnapshots = await measure(keyboard, index => {
        for (let update = 0; update < 100; update++) {
          keyboard.updateState({
            litKeys: [keyboard.leftmostKey + (index + update) % profile.keys]
          });
        }
      });
      scenarios.noopState = await measure(keyboard, () => {
        keyboard.updateState({ pressedKeys: keyboard.pressedKeys });
      });
      scenarios.geometry = await measure(keyboard, index => {
        keyboard.width = index & 1 ? 500 : 501;
      });
      scenarios.overlayAddRemove = await measure(keyboard, sampleIndex => {
        if ((sampleIndex & 1) === 0) {
          keyboard.setOverlay({
            id: 'bench-overlay:temporary',
            at: { key: keyboard.leftmostKey },
            patterns: ['bench-pattern']
          });
        } else {
          keyboard.removeOverlay('bench-overlay:temporary');
        }
      });
      if (profile.indicators) {
        scenarios.continuousIndicators = await measure(keyboard, sampleIndex => {
          for (let index = 0; index < profile.indicators; index++) {
            keyboard.setIndicator('bench-indicator:' + index, {
              at: { pitch: (index + sampleIndex * 0.125) % profile.keys },
              radius: 0.35 + index % 5 * 0.1
            });
          }
        });
        scenarios.combinedStateIndicators = await measure(keyboard, sampleIndex => {
          keyboard.updateState({
            pressedNotes: [sampleIndex % keyboard.notesInOctave],
            litKeys: [keyboard.leftmostKey + sampleIndex % profile.keys]
          });
          for (let index = 0; index < profile.indicators; index++) {
            keyboard.setIndicator('bench-indicator:' + index, {
              at: { pitch: (index + sampleIndex * 0.125) % profile.keys },
              radius: 0.35 + index % 5 * 0.1
            });
          }
        });
      }
      if (profile.overlays) {
        scenarios.overlayMove = await measure(keyboard, sampleIndex => {
          keyboard.updateOverlays(overlaySpecs.map((spec, index) => ({
            ...spec,
            at: {
              key: keyboard.leftmostKey +
                ((index + sampleIndex) % profile.keys + profile.keys) % profile.keys
            }
          })));
        });
      }
      results.push({ profile, scenarios });
      keyboard.remove();
      await sleep(10);
    }

    return {
      generatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      iterations,
      fullMatrix,
      results
    };
  })()`);

  report.consoleMessages = page.consoleMessages;
  const deterministicViolations = [];
  const check = (condition, profile, scenario, invariant) => {
    if (!condition) {
      deterministicViolations.push({ profile, scenario, invariant });
    }
  };
  for (const { profile, scenarios } of report.results) {
    const profileName = [profile.keys, profile.indicators, profile.overlays].join(':');
    for (const scenario of ['singleState', 'sixStateAssignments', 'hundredStateSnapshots']) {
      const metrics = scenarios[scenario];
      check(metrics.maxFrames <= 1, profileName, scenario, 'at most one renderer frame');
      check(metrics.maxGeometryReads === 0, profileName, scenario, 'zero state layout reads');
      check(metrics.nodeAdditions === 0 && metrics.nodeRemovals === 0,
        profileName, scenario, 'zero state node churn');
    }
    check(scenarios.hundredStateSnapshots.maxKeyVisits <= 2,
      profileName, 'hundredStateSnapshots', 'work excludes superseded intermediate keys');
    const noop = scenarios.noopState;
    check(noop.maxFrames === 0 && noop.maxGeometryReads === 0 && noop.maxDomWrites === 0 &&
      noop.nodeAdditions === 0 && noop.nodeRemovals === 0,
      profileName, 'noopState', 'zero no-op renderer work');
    for (const scenario of ['continuousIndicators', 'combinedStateIndicators']) {
      const metrics = scenarios[scenario];
      if (!metrics) continue;
      check(metrics.maxFrames <= 1, profileName, scenario, 'at most one renderer frame');
      check(metrics.maxGeometryReads <= 2, profileName, scenario, 'at most one CTM/rect read pair');
      check(metrics.nodeAdditions === 0 && metrics.nodeRemovals === 0,
        profileName, scenario, 'zero stable-indicator churn');
    }
    if (scenarios.overlayMove) {
      const metrics = scenarios.overlayMove;
      check(metrics.maxFrames <= 1, profileName, 'overlayMove', 'at most one renderer frame');
      check(metrics.maxGeometryReads === 0, profileName, 'overlayMove', 'zero overlay layout reads');
      check(metrics.nodeAdditions === 0 && metrics.nodeRemovals === 0,
        profileName, 'overlayMove', 'zero stable-overlay churn');
    }
  }
  const output = summaryOnly ? {
    generatedAt: report.generatedAt,
    userAgent: report.userAgent,
    iterations: report.iterations,
    fullMatrix: report.fullMatrix,
    results: report.results.map(({ profile, scenarios }) => ({
      profile,
      scenarios: Object.fromEntries(Object.entries(scenarios).map(([name, metrics]) => [name, {
        syncP95Ms: metrics.syncMs.p95,
        latencyP50Ms: metrics.requestToCompleteMs.p50,
        latencyP95Ms: metrics.requestToCompleteMs.p95,
        scriptingP95Ms: metrics.scriptingMs.p95,
        maxFrames: metrics.maxFrames,
        maxGeometryReads: metrics.maxGeometryReads,
        maxKeyVisits: metrics.maxKeyVisits,
        maxDomWrites: metrics.maxDomWrites,
        nodeAdditions: metrics.nodeAdditions,
        nodeRemovals: metrics.nodeRemovals,
        longTasks: metrics.longTasks
      }]))
    })),
    consoleMessages: report.consoleMessages,
    deterministicViolations
  } : report;
  if (!summaryOnly) output.deterministicViolations = deterministicViolations;
  process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  if (page.consoleMessages.length || deterministicViolations.length) process.exitCode = 1;
} finally {
  if (page) await page.close();
  await server.close();
}
