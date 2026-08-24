import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const packageLock = JSON.parse(await readFile(new URL('../package-lock.json', import.meta.url), 'utf8'));
const main = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');
const synth = await readFile(new URL('../src/lil-synth.js', import.meta.url), 'utf8');
const declarations = await readFile(new URL('../src/main.d.ts', import.meta.url), 'utf8');
const typeConsumer = await readFile(new URL('./types/public-api.ts', import.meta.url), 'utf8');
const typeConfig = JSON.parse(await readFile(new URL('./types/tsconfig.json', import.meta.url), 'utf8'));
const playwrightProfile = await readFile(new URL('./browser/playwright-profile.js', import.meta.url), 'utf8');
const playwrightMatrix = await readFile(new URL('./browser/playwright-matrix.js', import.meta.url), 'utf8');
const rollup = await readFile(new URL('../rollup.config.js', import.meta.url), 'utf8');

assert.doesNotMatch(main, /console\.(?:log|warn|error)\s*\(/, 'renderer contains production console output');
assert.doesNotMatch(synth, /console\.(?:log|warn|error)\s*\(/, 'synth contains production console output');
assert.doesNotMatch(main, /setTimeout\s*\(/, 'renderer contains an untracked timeout');
assert.doesNotMatch(synth, /setTimeout\s*\(/, 'synth contains an untracked voice timer');
assert.match(main, new RegExp(`const VERSION = ['"]${packageJson.version.replaceAll('.', '\\.')}`),
  'diagnostic version does not match package.json');
assert.equal(packageLock.version, packageJson.version, 'package-lock version does not match package.json');
assert.equal(packageLock.packages[''].version, packageJson.version,
  'package-lock root package version does not match package.json');
assert.equal(packageLock.packages['node_modules/d3-shape'].version, '3.2.0',
  'browser/source baseline expects the locked d3-shape 3.2.0 geometry engine');
assert.equal(packageJson.types, './src/main.d.ts', 'package does not expose its declaration file');
assert.equal(packageJson.exports['.'].types, './src/main.d.ts', 'root export is missing declarations');
for (const publicType of ['KeyboardIntent', 'KeyboardLocation', 'KeyboardLabel', 'ProjectionSnapshot']) {
  assert.match(declarations, new RegExp(`(?:type|interface) ${publicType}\\b`),
    `declarations are missing ${publicType}`);
}
assert.match(declarations, /type KeyLocation = \{ key: number; note\?: never; pitch\?: never \}/,
  'key location declarations do not reject ambiguous units');
assert.match(typeConsumer, /@ts-expect-error location objects must contain exactly one recognized unit/,
  'type consumer does not lock ambiguous-location rejection');
assert.equal(typeConfig.compilerOptions.strict, true, 'type consumer must compile in strict mode');
assert.equal(typeConfig.compilerOptions.noEmit, true, 'type consumer must never emit artifacts');
assert.match(playwrightProfile, /getByRole\('button', \{ name: 'C0 key' \}\)/,
  'Playwright profile must exercise the accessible key surface');
assert.match(playwrightProfile, /for \(let sample = -1; sample < 30; sample\+\+\)/,
  'Playwright profile must retain its warmup plus 30 measured samples');
for (const invariant of [
  'performance.maxFrames !== 1',
  'performance.maxGeometryReads > 2',
  'performance.maxKeyVisits > 9',
  'performance.maxNodeAdditions !== 0',
  'performance.maxNodeRemovals !== 0'
]) {
  assert.ok(playwrightProfile.includes(invariant),
    `Playwright profile is missing invariant: ${invariant}`);
}
for (const profile of [
  '{ keys: 12, indicators: 0, overlays: 0 }',
  '{ keys: 12, indicators: 1, overlays: 1 }',
  '{ keys: 48, indicators: 8, overlays: 8 }',
  '{ keys: 48, indicators: 20, overlays: 20 }',
  '{ keys: 128, indicators: 32, overlays: 32 }'
]) {
  assert.ok(playwrightMatrix.includes(profile), `Playwright matrix is missing profile: ${profile}`);
}
for (const scenario of [
  'singleState',
  'sixStateAssignments',
  'hundredStateSnapshots',
  'noopState',
  'geometry',
  'overlayAddRemove',
  'continuousIndicators',
  'combinedStateIndicators',
  'overlayMove'
]) {
  assert.ok(playwrightMatrix.includes(scenario), `Playwright matrix is missing scenario: ${scenario}`);
}
assert.match(playwrightMatrix, /const iterations = 30;/,
  'Playwright matrix must retain 30 measured samples');
assert.match(playwrightMatrix, /hundredStateSnapshots\.maxKeyVisits <= 2/,
  'Playwright matrix must reject superseded intermediate key visits');
assert.equal((rollup.match(/sourcemap:\s*true/g) || []).length, 4,
  'every distributed artifact must generate a source map');
assert.match(rollup, /sourcemapPathTransform/,
  'source maps must normalize dependency paths across build environments');
for (const output of [
  'dist/all-around-keyboard.js',
  'dist/all-around-keyboard.min.js',
  'dist/all-around-keyboard.esm.js',
  'dist/all-around-keyboard.esm.min.js'
]) {
  assert.match(rollup, new RegExp(`file:\\s*['"]${output.replaceAll('.', '\\.')}['"]`),
    `missing deterministic Rollup output ${output}`);
}

process.stdout.write('source-policy: passed\n');
