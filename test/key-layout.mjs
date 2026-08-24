import assert from 'node:assert/strict';
import { keyLayout } from '../src/key-layout.js';

const standard = keyLayout()
  .octaves(2)
  .octaveSize(12)
  .leftmostKey(36)
  .raisedPattern([1, 3, 6, 8, 10])
  .startAngle(-Math.PI / 4)
  .endAngle(Math.PI / 4)();

assert.equal(standard.length, 24);
assert.equal(standard[0].index, 36);
assert.equal(standard.at(-1).index, 59);
assert.equal(standard[0].note, 0);
assert.equal(standard[1].raised, true);
assert.ok(standard.every(key => Number.isFinite(key.frequency)));

const circular = keyLayout()
  .octaves(1)
  .octaveSize(12)
  .leftmostKey(0)
  .raisedPattern([1, 3, 6, 8, 10])
  .startAngle(-Math.PI)
  .endAngle(Math.PI)
  .pie(true)();

assert.equal(circular.length, 12);
assert.equal(circular[0].startAngle, -Math.PI);
assert.equal(circular.at(-1).endAngle, Math.PI);

const arrayFrequencies = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(36)
  .raisedPattern([1])
  .frequency([100, 125, 150])();
assert.deepEqual(arrayFrequencies.map(key => key.frequency), [100, 125, 150]);

const objectFrequencies = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(36)
  .raisedPattern([1])
  .frequency({ 36: 210, 37: 220, 38: 230 })();
assert.deepEqual(objectFrequencies.map(key => key.frequency), [210, 220, 230]);

const mapFrequencies = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(36)
  .raisedPattern([1])
  .frequency(new Map([[36, 310], [37, 320], [38, 330]]))();
assert.deepEqual(mapFrequencies.map(key => key.frequency), [310, 320, 330]);

const functionContexts = [];
const functionFrequencies = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(-1)
  .raisedPattern([1])
  .frequency((key, context) => {
    functionContexts.push(context);
    return 400 + context.offset;
  })();
assert.deepEqual(functionFrequencies.map(key => key.frequency), [400, 401, 402]);
assert.deepEqual(functionFrequencies.map(key => key.note), [2, 0, 1]);
assert.equal(functionContexts[0].key, -1);
assert.equal(functionContexts[0].notesInOctave, 3);

const noRaisedKeys = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(0)
  .raisedPattern([])();
assert.ok(noRaisedKeys.every(key => key.raised === false));

const negativeRaisedKeys = keyLayout()
  .octaves(1)
  .octaveSize(3)
  .leftmostKey(-2)
  .raisedPattern([1])();
assert.equal(negativeRaisedKeys[0].note, 1);
assert.equal(negativeRaisedKeys[0].raised, true);

assert.throws(() => keyLayout().frequency([440, -1]), /positive finite/);

process.stdout.write('key-layout: passed\n');
