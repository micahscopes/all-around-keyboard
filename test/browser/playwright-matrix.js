async (page) => {
  const consoleMessages = [];
  const pageErrors = [];
  page.on('console', message => consoleMessages.push({
    type: message.type(),
    text: message.text()
  }));
  page.on('pageerror', error => pageErrors.push(error.stack || String(error)));

  await page.waitForFunction(() => window.__fixtureReady === true);
  const report = await page.evaluate(async () => {
    const iterations = 30;
    const profiles = [
      { keys: 12, indicators: 0, overlays: 0 },
      { keys: 12, indicators: 1, overlays: 1 },
      { keys: 48, indicators: 8, overlays: 8 },
      { keys: 48, indicators: 20, overlays: 20 },
      { keys: 128, indicators: 32, overlays: 32 }
    ];
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const rendered = async keyboard => {
      await Promise.race([
        keyboard.updateComplete,
        sleep(3000).then(() => { throw new Error('render timeout'); })
      ]);
      if (keyboard._renderDeferred) await keyboard.updateComplete;
    };
    const drainSetupWork = async keyboard => {
      for (let pass = 0; pass < 3; pass++) {
        await new Promise(resolve => requestAnimationFrame(resolve));
        await rendered(keyboard);
      }
    };
    const percentile = (values, fraction) => {
      if (!values.length) return 0;
      const sorted = [...values].sort((left, right) => left - right);
      return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
    };
    const summarize = samples => {
      const values = field => samples.map(sample => sample[field]);
      const distribution = field => ({
        p50: percentile(values(field), 0.50),
        p95: percentile(values(field), 0.95),
        p99: percentile(values(field), 0.99),
        max: Math.max(...values(field))
      });
      return {
        samples: samples.length,
        syncMs: distribution('syncMs'),
        requestToCompleteMs: distribution('requestToCompleteMs'),
        scriptingMs: distribution('scriptingMs'),
        maxFrames: Math.max(...values('frames')),
        maxGeometryReads: Math.max(...values('geometryReads')),
        maxKeyVisits: Math.max(...values('keyVisits')),
        maxDomWrites: Math.max(...values('domWrites')),
        nodeAdditions: Math.max(...values('nodeAdditions')),
        nodeRemovals: Math.max(...values('nodeRemovals')),
        longTasks: values('longTasks').reduce((sum, count) => sum + count, 0)
      };
    };
    const measure = async (keyboard, action) => {
      action(-1);
      await rendered(keyboard);
      await drainSetupWork(keyboard);
      const samples = [];
      let frameStats = [];
      keyboard.onRenderStats = stats => frameStats.push(stats);
      for (let sample = 0; sample < iterations; sample++) {
        frameStats = [];
        const longTasks = [];
        const observer = PerformanceObserver.supportedEntryTypes?.includes('longtask')
          ? new PerformanceObserver(list => longTasks.push(...list.getEntries()))
          : null;
        observer?.observe({ type: 'longtask', buffered: false });
        const startedAt = performance.now();
        action(sample);
        const syncMs = performance.now() - startedAt;
        await rendered(keyboard);
        const requestToCompleteMs = performance.now() - startedAt;
        if (observer) longTasks.push(...observer.takeRecords());
        observer?.disconnect();
        samples.push({
          syncMs,
          requestToCompleteMs,
          scriptingMs: frameStats.reduce((sum, stats) => sum + stats.durationMs, 0),
          frames: frameStats.length,
          geometryReads: frameStats.reduce((sum, stats) => sum + stats.geometryReads, 0),
          keyVisits: frameStats.reduce((sum, stats) => sum + stats.keyVisits, 0),
          domWrites: frameStats.reduce((sum, stats) => sum + stats.domWrites, 0),
          nodeAdditions: frameStats.reduce((sum, stats) => sum + stats.nodeAdditions, 0),
          nodeRemovals: frameStats.reduce((sum, stats) => sum + stats.nodeRemovals, 0),
          longTasks: longTasks.length
        });
      }
      keyboard.onRenderStats = null;
      return summarize(samples);
    };
    const addPattern = keyboard => {
      const source = document.createElement('div');
      source.slot = 'overlay-pattern';
      source.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><pattern ' +
        'id="playwright-matrix-pattern" width="8" height="8" patternUnits="userSpaceOnUse">' +
        '<path d="M0 0L8 8" stroke="red"/></pattern></svg>';
      keyboard.append(source);
    };
    const setup = async profile => {
      const keyboard = document.createElement('all-around-keyboard');
      keyboard.transitionTime = 0;
      if (profile.keys === 128) {
        keyboard.notesInOctave = 16;
        keyboard.octaves = 8;
        keyboard.raisedNotes = [1, 3, 6, 8, 10, 13, 15];
      } else {
        keyboard.notesInOctave = 12;
        keyboard.octaves = profile.keys / 12;
      }
      addPattern(keyboard);
      document.body.append(keyboard);
      await rendered(keyboard);
      for (let index = 0; index < profile.indicators; index++) {
        keyboard.setIndicator(`playwright-matrix-indicator:${index}`, {
          at: { pitch: index % profile.keys },
          radius: 0.35 + index % 5 * 0.1
        });
      }
      const overlays = Array.from({ length: profile.overlays }, (_, index) => ({
        id: `playwright-matrix-overlay:${index}`,
        at: { key: keyboard.leftmostKey + index % profile.keys },
        patterns: ['playwright-matrix-pattern']
      }));
      keyboard.updateOverlays(overlays);
      await rendered(keyboard);
      await drainSetupWork(keyboard);
      return { keyboard, overlays };
    };

    const results = [];
    const violations = [];
    const check = (condition, profile, scenario, invariant) => {
      if (!condition) violations.push({ profile, scenario, invariant });
    };
    for (const profile of profiles) {
      const { keyboard, overlays } = await setup(profile);
      const scenarios = {};
      scenarios.singleState = await measure(keyboard, sample => {
        keyboard.updateState({ pressedKeys: [keyboard.leftmostKey + (sample & 1)] });
      });
      scenarios.sixStateAssignments = await measure(keyboard, sample => {
        const offset = sample & 1;
        keyboard.pressedKeys = [keyboard.leftmostKey + offset];
        keyboard.pressedNotes = [offset];
        keyboard.litKeys = [keyboard.leftmostKey + 2 + offset];
        keyboard.litNotes = [2 + offset];
        keyboard.hoveredKeys = [keyboard.leftmostKey + 4 + offset];
        keyboard.hoveredNotes = [4 + offset];
      });
      scenarios.hundredStateSnapshots = await measure(keyboard, sample => {
        for (let update = 0; update < 100; update++) {
          keyboard.updateState({
            litKeys: [keyboard.leftmostKey + ((sample + update) % profile.keys + profile.keys) % profile.keys]
          });
        }
      });
      scenarios.noopState = await measure(keyboard, () => {
        keyboard.updateState({ pressedKeys: keyboard.pressedKeys });
      });
      scenarios.geometry = await measure(keyboard, sample => {
        keyboard.width = sample & 1 ? 500 : 501;
      });
      scenarios.overlayAddRemove = await measure(keyboard, sample => {
        if ((sample & 1) === 0) {
          keyboard.setOverlay({
            id: 'playwright-matrix-overlay:temporary',
            at: { key: keyboard.leftmostKey },
            patterns: ['playwright-matrix-pattern']
          });
        } else {
          keyboard.removeOverlay('playwright-matrix-overlay:temporary');
        }
      });
      if (profile.indicators) {
        scenarios.continuousIndicators = await measure(keyboard, sample => {
          for (let index = 0; index < profile.indicators; index++) {
            keyboard.setIndicator(`playwright-matrix-indicator:${index}`, {
              at: { pitch: ((index + sample * 0.125) % profile.keys + profile.keys) % profile.keys },
              radius: 0.35 + index % 5 * 0.1
            });
          }
        });
        scenarios.combinedStateIndicators = await measure(keyboard, sample => {
          keyboard.updateState({
            pressedNotes: [((sample % keyboard.notesInOctave) + keyboard.notesInOctave) %
              keyboard.notesInOctave],
            litKeys: [keyboard.leftmostKey + ((sample % profile.keys) + profile.keys) % profile.keys]
          });
          for (let index = 0; index < profile.indicators; index++) {
            keyboard.setIndicator(`playwright-matrix-indicator:${index}`, {
              at: { pitch: ((index + sample * 0.125) % profile.keys + profile.keys) % profile.keys },
              radius: 0.35 + index % 5 * 0.1
            });
          }
        });
      }
      if (profile.overlays) {
        scenarios.overlayMove = await measure(keyboard, sample => {
          keyboard.updateOverlays(overlays.map((overlay, index) => ({
            ...overlay,
            at: {
              key: keyboard.leftmostKey +
                ((index + sample) % profile.keys + profile.keys) % profile.keys
            }
          })));
        });
      }

      const profileName = `${profile.keys}:${profile.indicators}:${profile.overlays}`;
      for (const scenarioName of ['singleState', 'sixStateAssignments', 'hundredStateSnapshots']) {
        const metrics = scenarios[scenarioName];
        check(metrics.samples === iterations, profileName, scenarioName, '30 measured samples');
        check(metrics.maxFrames <= 1, profileName, scenarioName, 'at most one renderer frame');
        check(metrics.maxGeometryReads === 0, profileName, scenarioName, 'zero state layout reads');
        check(metrics.nodeAdditions === 0 && metrics.nodeRemovals === 0,
          profileName, scenarioName, 'zero state node churn');
      }
      check(scenarios.hundredStateSnapshots.maxKeyVisits <= 2,
        profileName, 'hundredStateSnapshots', 'work excludes superseded intermediate keys');
      check(scenarios.noopState.maxFrames === 0 &&
        scenarios.noopState.maxGeometryReads === 0 &&
        scenarios.noopState.maxDomWrites === 0 &&
        scenarios.noopState.nodeAdditions === 0 &&
        scenarios.noopState.nodeRemovals === 0,
      profileName, 'noopState', 'zero no-op renderer work');
      check(scenarios.overlayAddRemove.maxFrames <= 1,
        profileName, 'overlayAddRemove', 'at most one renderer frame');
      check(scenarios.overlayAddRemove.maxGeometryReads === 0,
        profileName, 'overlayAddRemove', 'zero overlay layout reads');
      for (const scenarioName of ['continuousIndicators', 'combinedStateIndicators']) {
        const metrics = scenarios[scenarioName];
        if (!metrics) continue;
        check(metrics.maxFrames <= 1, profileName, scenarioName, 'at most one renderer frame');
        check(metrics.maxGeometryReads <= 2,
          profileName, scenarioName, 'at most one CTM/rect read pair');
        check(metrics.nodeAdditions === 0 && metrics.nodeRemovals === 0,
          profileName, scenarioName, 'zero stable-indicator churn');
      }
      if (scenarios.overlayMove) {
        check(scenarios.overlayMove.maxFrames <= 1,
          profileName, 'overlayMove', 'at most one renderer frame');
        check(scenarios.overlayMove.maxGeometryReads === 0,
          profileName, 'overlayMove', 'zero overlay layout reads');
        check(scenarios.overlayMove.nodeAdditions === 0 && scenarios.overlayMove.nodeRemovals === 0,
          profileName, 'overlayMove', 'zero stable-overlay churn');
      }
      results.push({ profile, scenarios });
      keyboard.remove();
      await new Promise(resolve => requestAnimationFrame(resolve));
    }
    return {
      generatedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      iterations,
      profiles: results,
      deterministicViolations: violations
    };
  });

  report.consoleMessages = consoleMessages;
  report.pageErrors = pageErrors;
  if (report.deterministicViolations.length || consoleMessages.length || pageErrors.length) {
    throw new Error(`Playwright matrix failed: ${JSON.stringify(report)}`);
  }
  return report;
}
