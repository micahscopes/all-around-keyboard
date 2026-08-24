const Pentatonic = [1, 3, 6, 8, 10];

function constant(x) {
  return function constant() {
    return x;
  };
}

function normalizeFrequency(value, field = 'frequency') {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${field} values must be positive finite numbers`);
  }
  return number;
}

export function normalizeFrequencyProvider(value) {
  if (value == null) return null;
  if (typeof value === 'function') return value;
  if (typeof value === 'number') return normalizeFrequency(value);
  if (Array.isArray(value)) {
    return value.map((frequency, index) => frequency == null
      ? null
      : normalizeFrequency(frequency, `frequency[${index}]`));
  }
  if (value instanceof Map) {
    const normalized = new Map();
    for (const [key, frequency] of value) {
      const absoluteKey = Number(key);
      if (!Number.isInteger(absoluteKey)) throw new TypeError('frequency Map keys must be integers');
      normalized.set(absoluteKey, normalizeFrequency(frequency, `frequency.get(${absoluteKey})`));
    }
    return normalized;
  }
  if (typeof value === 'object') {
    const normalized = Object.create(null);
    for (const [key, frequency] of Object.entries(value)) {
      const absoluteKey = Number(key);
      if (!Number.isInteger(absoluteKey)) throw new TypeError('frequency object keys must be integers');
      normalized[absoluteKey] = normalizeFrequency(frequency, `frequency[${key}]`);
    }
    return normalized;
  }
  throw new TypeError('frequency must be a function, number, array, Map, object, or null');
}

export function frequencyProvidersEqual(left, right) {
  if (left === right) return true;
  if (Array.isArray(left) && Array.isArray(right)) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }
  if (left instanceof Map && right instanceof Map) {
    if (left.size !== right.size) return false;
    for (const [key, value] of left) if (right.get(key) !== value) return false;
    return true;
  }
  if (left && right && typeof left === 'object' && typeof right === 'object') {
    const leftEntries = Object.entries(left);
    const rightEntries = Object.entries(right);
    return leftEntries.length === rightEntries.length &&
      leftEntries.every(([key, value]) => right[key] === value);
  }
  return false;
}

export function resolveKeyFrequency(provider, key, context) {
  const fallback = context.baseTone * Math.pow(2, (key - context.baseKey) / context.notes.length);
  if (provider == null) return fallback;
  let value;
  if (typeof provider === 'function') {
    value = provider(key, { key, ...context });
  } else if (typeof provider === 'number') {
    value = provider;
  } else if (Array.isArray(provider)) {
    value = provider[context.offset];
  } else if (provider instanceof Map) {
    value = provider.get(key);
  } else {
    value = provider[key];
  }
  return value == null ? fallback : normalizeFrequency(value, `frequency for key ${key}`);
}

// Simple pie layout - divides angles equally among keys
function simplePie(data, startAngle, endAngle) {
  const n = data.length;
  const totalAngle = endAngle - startAngle;
  const anglePerKey = totalAngle / n;

  return data.map((d, i) => ({
    ...d,
    startAngle: startAngle + i * anglePerKey,
    endAngle: startAngle + (i + 1) * anglePerKey
  }));
}

export const keyLayout = function() {
  let pieStyle = false;
  let octaves = 1;
  let octaveSize = 12;
  let raisedPattern = Pentatonic;
  let isRaised;
  let startAngle = constant(-Math.PI);
  let leftmostKey = 48;
  let baseTone = 32.70375;
  let baseKey = 0;
  let endAngle = constant(Math.PI);
  let frequency;

  function keyLayout(notes) {
    if (!notes) {
      notes = [];
      for (let i = 0; i < octaveSize; i++) {
        notes.push(i);
      }
    }
    if (!isRaised) {
      isRaised = k => raisedPattern.includes(k);
    }
    const raisedPatternOctaves = raisedPattern.length
      ? Math.max(1, Math.floor(Math.max(...raisedPattern) / notes.length) + 1)
      : 1;
    const raisedPeriod = raisedPatternOctaves * notes.length;
    const raisedIndex = key => ((key % raisedPeriod) + raisedPeriod) % raisedPeriod;
    const allKeys = [];
    let lowerCount = 0;

    // Count lower keys
    for (let k = 0; k < notes.length * octaves; k++) {
      if (!isRaised(raisedIndex(k + leftmostKey))) {
        lowerCount++;
      }
    }

    // Build key data
    for (let k = 0, l = 0; k < notes.length * octaves; k++) {
      const diffAngle = (endAngle(k) - startAngle(k)) / lowerCount;
      const key = {};

      key.index = k + leftmostKey;
      const noteIndex = ((key.index % notes.length) + notes.length) % notes.length;
      key.note = notes[noteIndex];
      key.frequency = resolveKeyFrequency(frequency, key.index, {
        note: key.note,
        offset: k,
        notes,
        notesInOctave: notes.length,
        baseTone,
        baseKey
      });

      if (isRaised(raisedIndex(key.index))) {
        if (!pieStyle) {
          key.startAngle = startAngle(k) + diffAngle * (l - 0.5 + 0.15);
          key.endAngle = startAngle(k) + diffAngle * (l + 0.5 - 0.15);
        }
        key.raised = true;
      } else {
        if (!pieStyle) {
          key.startAngle = startAngle(k) + l * diffAngle;
          key.endAngle = key.startAngle + diffAngle;
        }
        key.raised = false;
        l++;
      }
      allKeys.push(key);
    }

    // Apply pie layout if enabled
    if (pieStyle) {
      const start = typeof startAngle === 'function' ? startAngle(0) : startAngle;
      const end = typeof endAngle === 'function' ? endAngle(0) : endAngle;
      return simplePie(allKeys, start, end);
    }

    return allKeys;
  }

  keyLayout.isRaised = function(_) {
    if (arguments.length) {
      isRaised = typeof _ === 'function' ? _ : constant(_);
    }
    return keyLayout;
  };

  keyLayout.raisedPattern = function(_) {
    if (Array.isArray(_)) {
      raisedPattern = [..._];
      isRaised = null;
    }
    return keyLayout;
  };

  keyLayout.octaves = function(_) {
    if (typeof _ === 'number') {
      octaves = _;
    }
    return keyLayout;
  };

  keyLayout.startAngle = function(_) {
    if (arguments.length) {
      startAngle = typeof _ === 'function' ? _ : constant(_);
    }
    return keyLayout;
  };

  keyLayout.frequency = function(_) {
    if (arguments.length) {
      frequency = normalizeFrequencyProvider(_);
    }
    return keyLayout;
  };

  keyLayout.endAngle = function(_) {
    if (arguments.length) {
      endAngle = typeof _ === 'function' ? _ : constant(_);
    }
    return keyLayout;
  };

  keyLayout.octaveSize = function(_) {
    if (typeof _ === 'number') {
      octaveSize = _;
    }
    return keyLayout;
  };

  keyLayout.leftmostKey = function(_) {
    if (typeof _ === 'number') {
      leftmostKey = _;
    }
    return keyLayout;
  };

  keyLayout.baseTone = function(_) {
    if (typeof _ === 'number') {
      baseTone = _;
    }
    return keyLayout;
  };

  keyLayout.baseKey = function(_) {
    if (typeof _ === 'number') {
      baseKey = _;
    }
    return keyLayout;
  };

  keyLayout.pie = function(_) {
    if (typeof _ === 'boolean') {
      pieStyle = _;
    }
    return keyLayout;
  };

  return keyLayout;
};
