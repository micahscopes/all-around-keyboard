import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { openSourcePage, startSourceServer } from './harness.mjs';

// This protects rendered SVG geometry/layering and computed key presentation.
// It complements behavioral identity/mutation assertions; it is not used as a
// screenshot-only scheduling test.
const EXPECTED_SHA256 = 'f6a089dc4de9af446663ccf31013231501a200d50f6c4f0f151ede559895b6e8';

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  const snapshot = await page.session.evaluate(`(async () => {
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 0;
    keyboard.keyLabels = true;
    keyboard.labelFormat = 'index';
    const patterns = document.createElement('div');
    patterns.slot = 'overlay-pattern';
    patterns.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><pattern id="snapshot-lines" ' +
      'width="8" height="8" patternUnits="userSpaceOnUse"><path d="M0 0L8 8"/></pattern></svg>';
    keyboard.append(patterns);
    document.body.append(keyboard);
    await keyboard.updateComplete;
    keyboard.updateState({ pressedKeys: [36], litKeys: [37], hoveredKeys: [38] });
    keyboard.setOverlay({ id: 'snapshot:overlay', at: { key: 39 }, patterns: ['snapshot-lines'] });
    keyboard.setLabel({ id: 'snapshot:label', at: { key: 40 }, text: 'V', ariaLabel: 'degree five' });
    await keyboard.updateComplete;
    const keys = [...keyboard.shadowRoot.querySelectorAll('.key')];
    const result = {
      viewBox: keyboard._svg.getAttribute('viewBox'),
      transform: keyboard._g.getAttribute('transform'),
      layerClasses: [...keyboard._g.children].map(element => element.getAttribute('class') || element.tagName),
      keys: keys.map(element => {
        const style = getComputedStyle(element);
        return {
          index: element.dataset.keyIndex,
          class: element.getAttribute('class'),
          d: element.getAttribute('d'),
          ariaLabel: element.getAttribute('aria-label'),
          ariaPressed: element.getAttribute('aria-pressed'),
          fill: style.fill,
          stroke: style.stroke,
          strokeWidth: style.strokeWidth,
          opacity: style.opacity
        };
      }),
      builtinLabels: [...keyboard.shadowRoot.querySelectorAll('.key-label')].map(element => ({
        class: element.getAttribute('class'),
        text: element.textContent,
        x: element.getAttribute('x'),
        y: element.getAttribute('y'),
        display: element.style.display
      })),
      overlay: [...keyboard.shadowRoot.querySelectorAll('.key-overlay')].map(element => ({
        d: element.getAttribute('d'), fill: element.getAttribute('fill')
      })),
      annotation: [...keyboard.shadowRoot.querySelectorAll('.annotation-label')].map(element => ({
        text: element.textContent,
        ariaLabel: element.getAttribute('aria-label'),
        x: element.getAttribute('x'),
        y: element.getAttribute('y')
      }))
    };
    return result;
  })()`);
  if (process.env.AAK_VISUAL_CAPTURE === '1') {
    const capture = await page.session.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false
    });
    const outputDirectory = new URL('../../output/playwright/', import.meta.url);
    await mkdir(outputDirectory, { recursive: true });
    await writeFile(new URL('all-around-keyboard.png', outputDirectory), Buffer.from(capture.data, 'base64'));
  }
  const serialized = JSON.stringify(snapshot);
  const hash = createHash('sha256').update(serialized).digest('hex');
  assert.equal(hash, EXPECTED_SHA256,
    `visual SVG snapshot changed; inspect before accepting new hash ${hash}`);
  assert.deepEqual(page.consoleMessages, []);
  process.stdout.write(`visual-snapshot: passed (${hash})\n`);
} finally {
  if (page) await page.close();
  await server.close();
}
