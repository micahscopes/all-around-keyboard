const Pentatonic = [1, 3, 6, 8, 10];

function constant(x) {
  return function constant() {
    return x;
  };
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
    if (!frequency) {
      frequency = k => baseTone * Math.pow(2, (k - baseKey) / notes.length);
    }

    const raisedPatternOctaves = Math.ceil(Math.max(...raisedPattern) / notes.length);
    const allKeys = [];
    let lowerCount = 0;

    // Count lower keys
    for (let k = 0; k < notes.length * octaves; k++) {
      if (!isRaised(k % (raisedPatternOctaves * notes.length))) {
        lowerCount++;
      }
    }

    // Build key data
    for (let k = 0, l = 0; k < notes.length * octaves; k++) {
      const diffAngle = (endAngle(k) - startAngle(k)) / lowerCount;
      const key = {};

      key.index = k + leftmostKey;
      key.note = notes[key.index % notes.length];
      key.frequency = frequency(key.index);

      if (isRaised(key.index % (raisedPatternOctaves * notes.length))) {
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
    if (_ && _.length) {
      raisedPattern = _;
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
      frequency = typeof _ === 'function' ? _ : constant(_);
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
