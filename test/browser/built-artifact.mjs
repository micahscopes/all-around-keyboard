import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { openSourcePage, startSourceServer } from './harness.mjs';

const outputs = [
  'all-around-keyboard.js',
  'all-around-keyboard.min.js',
  'all-around-keyboard.esm.js',
  'all-around-keyboard.esm.min.js'
];

for (const output of outputs) {
  let source;
  let mapSource;
  try {
    source = await readFile(new URL(`../../dist/${output}`, import.meta.url), 'utf8');
    mapSource = await readFile(new URL(`../../dist/${output}.map`, import.meta.url), 'utf8');
  } catch (error) {
    throw new Error(
      `Missing release candidate dist/${output} or its source map. ` +
      'Generate release artifacts intentionally before running the built-artifact gate.',
      { cause: error }
    );
  }
  assert.match(source, new RegExp(`sourceMappingURL=${output.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\.map`),
    `${output} does not reference its source map`);
  const map = JSON.parse(mapSource);
  assert.equal(map.version, 3, `${output}.map is not a v3 source map`);
  assert.ok(map.sources.some(sourceName => /src\/main\.js$/.test(sourceName)),
    `${output}.map does not map back to src/main.js`);
}

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture-dist`);
  const result = await page.session.evaluate(`(async () => {
    const keyboard = document.createElement('all-around-keyboard');
    keyboard.transitionTime = 0;
    document.body.append(keyboard);
    await keyboard.updateComplete;
    keyboard.updateState({ pressedKeys: [36], litNotes: [1] });
    await keyboard.updateComplete;
    const key36 = keyboard.shadowRoot.querySelector('[data-key-index="36"]');
    const key37 = keyboard.shadowRoot.querySelector('[data-key-index="37"]');
    const result = {
      version: window.__aakModule.VERSION,
      constructorVersion: customElements.get('all-around-keyboard').version,
      pressed: key36.classList.contains('key--pressed'),
      ariaPressed: key36.getAttribute('aria-pressed'),
      lit: key37.classList.contains('key--highlight'),
      typedApis: ['updateState', 'setOverlay', 'setIndicator', 'setLabel', 'getAnchors']
        .every(name => typeof keyboard[name] === 'function'),
      adapter: typeof window.__aakModule.KeyboardProjectionAdapter === 'function'
    };
    keyboard.remove();
    return result;
  })()`);
  assert.equal(result.version, '1.9.0');
  assert.equal(result.constructorVersion, '1.9.0');
  assert.equal(result.pressed, true);
  assert.equal(result.ariaPressed, 'true');
  assert.equal(result.lit, true);
  assert.equal(result.typedApis, true);
  assert.equal(result.adapter, true);
  assert.deepEqual(page.consoleMessages, []);
  process.stdout.write('built-artifact: passed\n');
} finally {
  if (page) await page.close();
  await server.close();
}
