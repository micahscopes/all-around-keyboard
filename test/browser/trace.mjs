import { openSourcePage, startSourceServer } from './harness.mjs';

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  await page.session.evaluate(`(async () => {
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 0;
    keyboard.notesInOctave = 12;
    keyboard.octaves = 4;
    document.body.append(keyboard);
    await keyboard.updateComplete;
    for (let index = 0; index < 20; index++) {
      keyboard.setIndicator('trace:' + index, {
        at: { pitch: index }, radius: 0.35 + index % 5 * 0.1
      });
    }
    await keyboard.updateComplete;
    window.__traceKeyboard = keyboard;
  })()`);

  const tracingComplete = page.session.once('Tracing.tracingComplete');
  await page.session.send('Tracing.start', {
    transferMode: 'ReturnAsStream',
    categories: [
      'devtools.timeline',
      'blink.user_timing',
      'v8.execute',
      'disabled-by-default-devtools.timeline'
    ].join(',')
  });

  const work = await page.session.evaluate(`(async () => {
    const keyboard = window.__traceKeyboard;
    const stats = [];
    keyboard.onRenderStats = frame => stats.push(frame);
    keyboard.updateState({ pressedKeys: [36], litNotes: [0, 4, 7] });
    for (let index = 0; index < 20; index++) {
      keyboard.setIndicator('trace:' + index, {
        at: { pitch: index + 0.375 }, radius: 0.35 + index % 5 * 0.1
      });
    }
    await keyboard.updateComplete;
    await new Promise(resolve => requestAnimationFrame(() => resolve()));
    keyboard.onRenderStats = null;
    return stats;
  })()`);

  await page.session.send('Tracing.end');
  const { stream } = await tracingComplete;
  let traceSource = '';
  for (;;) {
    const chunk = await page.session.send('IO.read', { handle: stream });
    traceSource += chunk.data;
    if (chunk.eof) break;
  }
  await page.session.send('IO.close', { handle: stream });
  const trace = JSON.parse(traceSource);
  const names = new Set([
    'RunTask', 'FunctionCall', 'EventDispatch', 'UpdateLayoutTree', 'Layout',
    'PrePaint', 'Paint', 'CompositeLayers'
  ]);
  const metrics = {};
  for (const name of names) metrics[name] = { count: 0, totalMs: 0, maxMs: 0 };
  for (const event of trace.traceEvents || []) {
    if (!names.has(event.name) || typeof event.dur !== 'number') continue;
    const durationMs = event.dur / 1000;
    const metric = metrics[event.name];
    metric.count++;
    metric.totalMs += durationMs;
    metric.maxMs = Math.max(metric.maxMs, durationMs);
  }
  for (const metric of Object.values(metrics)) {
    metric.totalMs = Number(metric.totalMs.toFixed(3));
    metric.maxMs = Number(metric.maxMs.toFixed(3));
  }
  const report = {
    userAgent: await page.session.evaluate('navigator.userAgent'),
    profile: { keys: 48, indicators: 20, overlays: 0 },
    rendererFrames: work,
    traceMetrics: metrics,
    longTasks: (trace.traceEvents || []).filter(event =>
      event.name === 'RunTask' && typeof event.dur === 'number' && event.dur >= 50_000).length,
    consoleMessages: page.consoleMessages
  };
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (work.length !== 1 || work[0].geometryReads > 2 || report.longTasks || page.consoleMessages.length) {
    process.exitCode = 1;
  }
} finally {
  if (page) await page.close();
  await server.close();
}
