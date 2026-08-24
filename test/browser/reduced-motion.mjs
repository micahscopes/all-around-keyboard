import { openSourcePage, startSourceServer } from './harness.mjs';

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  await page.session.send('Emulation.setEmulatedMedia', {
    media: '',
    features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
  });
  const result = await page.session.evaluate(`(async () => {
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 250;
    document.body.append(keyboard);
    await keyboard.updateComplete;
    const firstKey = keyboard.shadowRoot.querySelector('[data-key-index="36"]');
    keyboard.width = 620;
    await keyboard.updateComplete;
    const target = keyboard._drawArc(keyboard._currentParams.get(36));
    const result = {
      reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
      animations: keyboard._keyAnimations.size,
      animationRequest: keyboard._animationRequest,
      atTarget: firstKey.getAttribute('d') === target
    };
    keyboard.remove();
    return result;
  })()`);
  if (!result.reduced || result.animations !== 0 || result.animationRequest !== 0 || !result.atTarget) {
    throw new Error(`reduced-motion contract failed: ${JSON.stringify(result)}`);
  }
  if (page.consoleMessages.length) {
    throw new Error(`unexpected console output: ${JSON.stringify(page.consoleMessages)}`);
  }
  process.stdout.write('reduced-motion: passed\n');
} finally {
  if (page) await page.close();
  await server.close();
}
