import { openSourcePage, startSourceServer } from './harness.mjs';

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  const baseline = await page.session.evaluate(`(async () => {
    const settle = (milliseconds = 250) => new Promise(resolve => setTimeout(resolve, milliseconds));
    const resetCounters = () => {
      Object.assign(window.__aakTest, { animationFrames: 0, ctmReads: 0, rectReads: 0 });
    };

    const keyboard = document.createElement('all-around-keyboard');
    const renderErrors = [];
    const renderStats = [];
    keyboard.onRenderStats = stats => renderStats.push(stats);
    keyboard.addEventListener('rendererror', event => {
      renderErrors.push({
        message: event.detail.error?.message || String(event.detail.error),
        stack: event.detail.error?.stack || null,
        context: event.detail.context
      });
    });
    keyboard.transitionTime = 0;
    document.body.append(keyboard);
    await settle();

    const audioContextsOnConnect = window.__aakTest.audioContexts;
    const keyCount = keyboard.shadowRoot.querySelectorAll('.key').length;

    let stateMutations = 0;
    const stateObserver = new MutationObserver(records => { stateMutations += records.length; });
    stateObserver.observe(keyboard.shadowRoot, { subtree: true, attributes: true });
    resetCounters();
    keyboard.pressedKeys = [36];
    keyboard.litKeys = [37];
    keyboard.pressedNotes = [0];
    keyboard.litNotes = [1];
    keyboard.hoveredKeys = [38];
    keyboard.hoveredNotes = [2];
    await settle();
    stateObserver.disconnect();
    const sequentialState = {
      ...window.__aakTest,
      mutations: stateMutations,
      pressed: keyboard.shadowRoot.querySelector('[data-key-index="36"]')?.classList.contains('key--pressed'),
      lit: keyboard.shadowRoot.querySelector('[data-key-index="37"]')?.classList.contains('key--highlight'),
      hovered: keyboard.shadowRoot.querySelector('[data-key-index="38"]')?.classList.contains('key--hover')
      ,scheduler: {
        connected: keyboard._connected,
        renderRequest: keyboard._renderRequest,
        deferred: Boolean(keyboard._renderDeferred),
        dirtyKeys: [...keyboard._dirty.keyState],
        reasons: [...keyboard._dirty.reasons]
      }
    };

    const indicator = document.createElement('i');
    indicator.dataset.pitch = '2';
    keyboard.append(indicator);
    await settle();
    resetCounters();
    indicator.dataset.pitch = '2.5';
    indicator.dataset.radius = '0.6';
    indicator.dataset.waveNumber = '2';
    indicator.dataset.waveAmplitude = '0.1';
    indicator.dataset.wavePhase = '0.2';
    await settle();
    const indicatorBurst = { ...window.__aakTest };

    resetCounters();
    const overlay = document.createElement('i');
    overlay.dataset.keyOverlay = '36';
    keyboard.append(overlay);
    await settle();
    const overlayAdd = { ...window.__aakTest };

    return {
      userAgent: navigator.userAgent,
      visibilityState: document.visibilityState,
      keyCount,
      audioContextsOnConnect,
      sequentialState,
      indicatorBurst,
      overlayAdd,
      renderErrors,
      renderStats
    };
  })()`);

  baseline.consoleMessages = page.consoleMessages;
  process.stdout.write(`${JSON.stringify(baseline, null, 2)}\n`);
} finally {
  if (page) await page.close();
  await server.close();
}
