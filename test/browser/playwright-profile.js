async (page) => {
  const equals = (actual, expected, message) => {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}: ${JSON.stringify(actual)}`);
    }
  };

  await page.waitForFunction(() => window.__fixtureReady === true);
  const initial = await page.evaluate(async () => {
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 0;
    keyboard.keyLabels = true;
    const intents = [];
    keyboard.addEventListener('keyboardintent', event => intents.push({ ...event.detail }));
    document.body.append(keyboard);
    await keyboard.updateComplete;
    window.__playwrightKeyboard = keyboard;
    window.__playwrightIntents = intents;
    return {
      version: keyboard.constructor.version,
      keyCount: keyboard.shadowRoot.querySelectorAll('.key').length
    };
  });
  equals(initial, { version: '1.9.0', keyCount: 24 }, 'initial keyboard contract changed');

  await page.getByRole('button', { name: 'C0 key' }).first().click();
  const pointer = await page.evaluate(() => window.__playwrightIntents.map(intent => ({
    type: intent.type,
    source: intent.source,
    interactionId: intent.interactionId,
    key: intent.key,
    note: intent.note
  })));
  equals(pointer.slice(-3).map(intent => intent.type), ['press', 'release', 'activate'],
    'pointer intent ordering changed');
  equals(pointer.slice(-3).map(intent => intent.source), ['pointer', 'pointer', 'pointer'],
    'pointer intent source changed');
  if (!pointer.slice(-3).every(intent => intent.interactionId === pointer.at(-1).interactionId &&
      intent.key === 36 && intent.note === 0)) {
    throw new Error(`pointer correlation/units changed: ${JSON.stringify(pointer)}`);
  }

  await page.evaluate(() => { window.__playwrightIntents.length = 0; });
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  const keyboardIntents = await page.evaluate(() => window.__playwrightIntents.map(intent => ({
    type: intent.type,
    source: intent.source,
    interactionId: intent.interactionId
  })));
  equals(keyboardIntents.slice(-3).map(intent => intent.type), ['press', 'release', 'activate'],
    'keyboard intent ordering changed');
  equals(keyboardIntents.slice(-3).map(intent => intent.source), ['keyboard', 'keyboard', 'keyboard'],
    'keyboard intent source changed');
  if (!keyboardIntents.slice(-3).every(intent =>
      intent.interactionId === keyboardIntents.at(-1).interactionId)) {
    throw new Error(`keyboard correlation changed: ${JSON.stringify(keyboardIntents)}`);
  }

  const correctness = await page.evaluate(async () => {
    const keyboard = window.__playwrightKeyboard;
    const stats = [];
    keyboard.onRenderStats = value => stats.push(value);
    keyboard.updateState({ pressedNotes: [0], litKeys: [40], hoveredKeys: [41] });
    await keyboard.updateComplete;
    keyboard.onRenderStats = null;
    const key = index => keyboard.shadowRoot.querySelector(`[data-key-index="${index}"]`);
    return {
      frames: stats.length,
      stats: stats[0],
      key36Pressed: key(36).classList.contains('key--pressed'),
      key48Pressed: key(48).classList.contains('key--pressed'),
      key40Lit: key(40).classList.contains('key--highlight'),
      key41Hovered: key(41).classList.contains('key--hover'),
      aria36: key(36).getAttribute('aria-pressed')
    };
  });
  if (correctness.frames !== 1 || correctness.stats.geometryReads !== 0 ||
      correctness.stats.keyVisits !== 4 || correctness.stats.nodeAdditions !== 0 ||
      correctness.stats.nodeRemovals !== 0 || !correctness.key36Pressed ||
      !correctness.key48Pressed || !correctness.key40Lit || !correctness.key41Hovered ||
      correctness.aria36 !== 'true') {
    throw new Error(`atomic state projection changed: ${JSON.stringify(correctness)}`);
  }

  const performance = await page.evaluate(async () => {
    const oldKeyboard = window.__playwrightKeyboard;
    oldKeyboard.remove();
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 0;
    keyboard.octaves = 4;
    document.body.append(keyboard);
    await keyboard.updateComplete;
    for (let index = 0; index < 20; index++) {
      keyboard.setIndicator(`playwright:${index}`, {
        at: { pitch: index },
        radius: 0.35 + index % 5 * 0.1
      });
    }
    await keyboard.updateComplete;
    for (let pass = 0; pass < 3; pass++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      await keyboard.updateComplete;
    }

    const percentile = (values, fraction) => {
      const sorted = [...values].sort((left, right) => left - right);
      return sorted[Math.min(sorted.length - 1, Math.ceil(sorted.length * fraction) - 1)];
    };
    const samples = [];
    const longTasks = [];
    const observer = PerformanceObserver.supportedEntryTypes?.includes('longtask')
      ? new PerformanceObserver(list => longTasks.push(...list.getEntries()))
      : null;
    observer?.observe({ type: 'longtask', buffered: false });
    for (let sample = -1; sample < 30; sample++) {
      const frames = [];
      keyboard.onRenderStats = stats => frames.push(stats);
      const startedAt = performance.now();
      keyboard.updateState({
        pressedNotes: [((sample % 12) + 12) % 12],
        litKeys: [keyboard.leftmostKey + ((sample % 48) + 48) % 48]
      });
      for (let index = 0; index < 20; index++) {
        keyboard.setIndicator(`playwright:${index}`, {
          at: { pitch: (index + sample * 0.125 + 48) % 48 },
          radius: 0.35 + index % 5 * 0.1
        });
      }
      const syncMs = performance.now() - startedAt;
      await keyboard.updateComplete;
      const requestToCompleteMs = performance.now() - startedAt;
      if (sample >= 0) {
        samples.push({
          syncMs,
          requestToCompleteMs,
          frames: frames.length,
          scriptingMs: frames.reduce((sum, stats) => sum + stats.durationMs, 0),
          geometryReads: frames.reduce((sum, stats) => sum + stats.geometryReads, 0),
          keyVisits: frames.reduce((sum, stats) => sum + stats.keyVisits, 0),
          nodeAdditions: frames.reduce((sum, stats) => sum + stats.nodeAdditions, 0),
          nodeRemovals: frames.reduce((sum, stats) => sum + stats.nodeRemovals, 0)
        });
      }
    }
    keyboard.onRenderStats = null;
    observer?.disconnect();
    const values = field => samples.map(sample => sample[field]);
    return {
      samples: samples.length,
      syncP95Ms: percentile(values('syncMs'), 0.95),
      scriptingP95Ms: percentile(values('scriptingMs'), 0.95),
      latencyP50Ms: percentile(values('requestToCompleteMs'), 0.50),
      latencyP95Ms: percentile(values('requestToCompleteMs'), 0.95),
      maxFrames: Math.max(...values('frames')),
      maxGeometryReads: Math.max(...values('geometryReads')),
      maxKeyVisits: Math.max(...values('keyVisits')),
      maxNodeAdditions: Math.max(...values('nodeAdditions')),
      maxNodeRemovals: Math.max(...values('nodeRemovals')),
      longTasks: longTasks.length
    };
  });
  if (performance.samples !== 30 || performance.maxFrames !== 1 ||
      performance.maxGeometryReads > 2 || performance.maxKeyVisits > 9 ||
      performance.maxNodeAdditions !== 0 || performance.maxNodeRemovals !== 0) {
    throw new Error(`Playwright performance invariant changed: ${JSON.stringify(performance)}`);
  }

  return {
    userAgent: await page.evaluate(() => navigator.userAgent),
    correctness,
    pointer,
    keyboardIntents,
    performance
  };
}
