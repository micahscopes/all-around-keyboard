function constant$1(x) {
  return function constant() {
    return x;
  };
}

const abs = Math.abs;
const atan2 = Math.atan2;
const cos = Math.cos;
const max = Math.max;
const min = Math.min;
const sin = Math.sin;
const sqrt = Math.sqrt;

const epsilon$1 = 1e-12;
const pi$1 = Math.PI;
const halfPi = pi$1 / 2;
const tau$1 = 2 * pi$1;

function acos(x) {
  return x > 1 ? 0 : x < -1 ? pi$1 : Math.acos(x);
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

const pi = Math.PI,
    tau = 2 * pi,
    epsilon = 1e-6,
    tauEpsilon = tau - epsilon;

function append(strings) {
  this._ += strings[0];
  for (let i = 1, n = strings.length; i < n; ++i) {
    this._ += arguments[i] + strings[i];
  }
}

function appendRound(digits) {
  let d = Math.floor(digits);
  if (!(d >= 0)) throw new Error(`invalid digits: ${digits}`);
  if (d > 15) return append;
  const k = 10 ** d;
  return function(strings) {
    this._ += strings[0];
    for (let i = 1, n = strings.length; i < n; ++i) {
      this._ += Math.round(arguments[i] * k) / k + strings[i];
    }
  };
}

class Path {
  constructor(digits) {
    this._x0 = this._y0 = // start of current subpath
    this._x1 = this._y1 = null; // end of current subpath
    this._ = "";
    this._append = digits == null ? append : appendRound(digits);
  }
  moveTo(x, y) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}`;
  }
  closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._append`Z`;
    }
  }
  lineTo(x, y) {
    this._append`L${this._x1 = +x},${this._y1 = +y}`;
  }
  quadraticCurveTo(x1, y1, x, y) {
    this._append`Q${+x1},${+y1},${this._x1 = +x},${this._y1 = +y}`;
  }
  bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._append`C${+x1},${+y1},${+x2},${+y2},${this._x1 = +x},${this._y1 = +y}`;
  }
  arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._append`M${this._x1 = x1},${this._y1 = y1}`;
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon));

    // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
    // Equivalently, is (x1,y1) coincident with (x2,y2)?
    // Or, is the radius zero? Line to (x1,y1).
    else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
      this._append`L${this._x1 = x1},${this._y1 = y1}`;
    }

    // Otherwise, draw an arc!
    else {
      let x20 = x2 - x0,
          y20 = y2 - y0,
          l21_2 = x21 * x21 + y21 * y21,
          l20_2 = x20 * x20 + y20 * y20,
          l21 = Math.sqrt(l21_2),
          l01 = Math.sqrt(l01_2),
          l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
          t01 = l / l01,
          t21 = l / l21;

      // If the start tangent is not coincident with (x0,y0), line to.
      if (Math.abs(t01 - 1) > epsilon) {
        this._append`L${x1 + t01 * x01},${y1 + t01 * y01}`;
      }

      this._append`A${r},${r},0,0,${+(y01 * x20 > x01 * y20)},${this._x1 = x1 + t21 * x21},${this._y1 = y1 + t21 * y21}`;
    }
  }
  arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r, ccw = !!ccw;

    // Is the radius negative? Error.
    if (r < 0) throw new Error(`negative radius: ${r}`);

    let dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._append`M${x0},${y0}`;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
      this._append`L${x0},${y0}`;
    }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._append`A${r},${r},0,1,${cw},${x - dx},${y - dy}A${r},${r},0,1,${cw},${this._x1 = x0},${this._y1 = y0}`;
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
      this._append`A${r},${r},0,${+(da >= pi)},${cw},${this._x1 = x + r * Math.cos(a1)},${this._y1 = y + r * Math.sin(a1)}`;
    }
  }
  rect(x, y, w, h) {
    this._append`M${this._x0 = this._x1 = +x},${this._y0 = this._y1 = +y}h${w = +w}v${+h}h${-w}Z`;
  }
  toString() {
    return this._;
  }
}

function withPath(shape) {
  let digits = 3;

  shape.digits = function(_) {
    if (!arguments.length) return digits;
    if (_ == null) {
      digits = null;
    } else {
      const d = Math.floor(_);
      if (!(d >= 0)) throw new RangeError(`invalid digits: ${_}`);
      digits = d;
    }
    return shape;
  };

  return () => new Path(digits);
}

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0, y10 = y1 - y0,
      x32 = x3 - x2, y32 = y3 - y2,
      t = y32 * x10 - x32 * y10;
  if (t * t < epsilon$1) return;
  t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / t;
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * sqrt(max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

function arc() {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$1(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null,
      path = withPath(arc);

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$1)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$1) {
      context.moveTo(r1 * cos(a0), r1 * sin(a0));
      context.arc(0, 0, r1, a0, a1, !cw);
      if (r0 > epsilon$1) {
        context.moveTo(r0 * cos(a1), r0 * sin(a1));
        context.arc(0, 0, r0, a1, a0, cw);
      }
    }

    // Or is it a circular or annular sector?
    else {
      var a01 = a0,
          a11 = a1,
          a00 = a0,
          a10 = a1,
          da0 = da,
          da1 = da,
          ap = padAngle.apply(this, arguments) / 2,
          rp = (ap > epsilon$1) && (padRadius ? +padRadius.apply(this, arguments) : sqrt(r0 * r0 + r1 * r1)),
          rc = min(abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
          rc0 = rc,
          rc1 = rc,
          t0,
          t1;

      // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
      if (rp > epsilon$1) {
        var p0 = asin(rp / r0 * sin(ap)),
            p1 = asin(rp / r1 * sin(ap));
        if ((da0 -= p0 * 2) > epsilon$1) p0 *= (cw ? 1 : -1), a00 += p0, a10 -= p0;
        else da0 = 0, a00 = a10 = (a0 + a1) / 2;
        if ((da1 -= p1 * 2) > epsilon$1) p1 *= (cw ? 1 : -1), a01 += p1, a11 -= p1;
        else da1 = 0, a01 = a11 = (a0 + a1) / 2;
      }

      var x01 = r1 * cos(a01),
          y01 = r1 * sin(a01),
          x10 = r0 * cos(a10),
          y10 = r0 * sin(a10);

      // Apply rounded corners?
      if (rc > epsilon$1) {
        var x11 = r1 * cos(a11),
            y11 = r1 * sin(a11),
            x00 = r0 * cos(a00),
            y00 = r0 * sin(a00),
            oc;

        // Restrict the corner radius according to the sector angle. If this
        // intersection fails, it’s probably because the arc is too small, so
        // disable the corner radius entirely.
        if (da < pi$1) {
          if (oc = intersect(x01, y01, x00, y00, x11, y11, x10, y10)) {
            var ax = x01 - oc[0],
                ay = y01 - oc[1],
                bx = x11 - oc[0],
                by = y11 - oc[1],
                kc = 1 / sin(acos((ax * bx + ay * by) / (sqrt(ax * ax + ay * ay) * sqrt(bx * bx + by * by))) / 2),
                lc = sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
            rc0 = min(rc, (r0 - lc) / (kc - 1));
            rc1 = min(rc, (r1 - lc) / (kc + 1));
          } else {
            rc0 = rc1 = 0;
          }
        }
      }

      // Is the sector collapsed to a line?
      if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

      // Does the sector’s outer ring have rounded corners?
      else if (rc1 > epsilon$1) {
        t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
        t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

        context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc1, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r1, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
          context.arc(t1.cx, t1.cy, rc1, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the outer ring just a circular arc?
      else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

      // Is there no inner ring, and it’s a circular sector?
      // Or perhaps it’s an annular sector collapsed due to padding?
      if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

      // Does the sector’s inner ring (or point) have rounded corners?
      else if (rc0 > epsilon$1) {
        t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
        t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

        context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

        // Have the corners merged?
        if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t1.y01, t1.x01), !cw);

        // Otherwise, draw the two corners and the ring.
        else {
          context.arc(t0.cx, t0.cy, rc0, atan2(t0.y01, t0.x01), atan2(t0.y11, t0.x11), !cw);
          context.arc(0, 0, r0, atan2(t0.cy + t0.y11, t0.cx + t0.x11), atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
          context.arc(t1.cx, t1.cy, rc0, atan2(t1.y11, t1.x11), atan2(t1.y01, t1.x01), !cw);
        }
      }

      // Or is the inner ring just a circular arc?
      else context.arc(0, 0, r0, a10, a00, cw);
    }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function() {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [cos(a) * r, sin(a) * r];
  };

  arc.innerRadius = function(_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : innerRadius;
  };

  arc.outerRadius = function(_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function(_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$1(+_), arc) : cornerRadius;
  };

  arc.padRadius = function(_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$1(+_), arc) : padRadius;
  };

  arc.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : startAngle;
  };

  arc.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : endAngle;
  };

  arc.padAngle = function(_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$1(+_), arc) : padAngle;
  };

  arc.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), arc) : context;
  };

  return arc;
}

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

const keyLayout = function() {
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

const LILSYNTH = Symbol();

function setupLilSynth() {
  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
  if (!AudioContext) return console.error("AudioContext not supported");
  if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
  if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;

  if(!window[LILSYNTH]){
    window[LILSYNTH] = new AudioContext;
  }
}

function soundKey(key, frequency) {
  // console.log(key,"on!!!!");
  let context = window[LILSYNTH];
  if(!key.filter){
    key.filter = context.createBiquadFilter();
    key.filter.frequency.value = frequency;
    key.filter.type = "bandpass";
  }
  let now = context.currentTime;

  key.gain = context.createGain();
  key.gain.gain.value = 0.000001;
  key.gain.connect(context.destination);

  key.filter.connect(key.gain);

  if (key.oscillator){
    key.oscillator.stop(now+0.4);
  }  if (key.oscillator2){
    key.oscillator2.stop(now+0.4);
  }  key.oscillator = context.createOscillator();
  key.oscillator2 = context.createOscillator();
  key.oscillator.type = "sawtooth";
  key.oscillator.frequency.value = frequency/2;
  key.oscillator.connect(key.filter);
  key.oscillator2.frequency.value = frequency;
  key.oscillator2.connect(key.gain);
  // key.gain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.05);
  // key.gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.1);
  key.gain.gain.setTargetAtTime(0.05, now, 0.04);
  key.oscillator.start(now);
  key.oscillator2.start(now);
  key.oscillator.stop(now + 40);
  key.oscillator2.stop(now + 40);
}

function dampKey(key) {
  let decay = 0.4;
  // console.log("tone off!!!!");
  let context = window[LILSYNTH];
  if (key.gain){
    key.gain.gain.setTargetAtTime(0.000001, context.currentTime, 0.05);
    let gain = key.gain;
    setTimeout(function(){gain.disconnect();}, decay*1000);
  }
  if(key.oscillator) key.oscillator.stop(context.currentTime + decay);
  if(key.oscillator2) key.oscillator2.stop(context.currentTime + decay);
}

var css = "all-around-keyboard {\n  display: block;\n  padding: 5px;\n}\n:host {\n  display: block;\n  padding: 5px;\n}\n.key {\n  stroke-width: 1.5px;\n}\n\n.key--lower { fill: white; stroke: #777;\n}\n.key--upper { fill: black; stroke: #000;\n}\n\n.key, .key--modulating {\n  transition: fill;\n  transition-duration: 1s;\n  transition-delay: 1s;\n  transition-timing-function: ease-in-out;\n}\n\n.key:not(.key--modulating) {\n  transition-delay: 0s !important;\n  transition-duration: 0.1s !important;\n}\n\n.key:not(.key--modulating).key--highlight, .key:not(.key--modulating).key--pressed {\n  transition-duration: 0s !important;\n}\n\n.key--pressed,\n.key--highlight.key--pressed.key--upper,\n.key--highlight.key--pressed.key--lower\n  { fill: deeppink; }\n\n.key--highlight {\n  stroke: rgba(0, 91, 255, 0.73);\n  stroke-width: 5.5px;\n}\n\n.key--highlight.key--lower { fill: rgb(215, 237, 249) }\n.key--highlight.key--upper { fill: #495b96 }\n";

const SVGStrokePadding = 15;
const SVGNS = 'http://www.w3.org/2000/svg';

// Event names
const KEYPRESS = 'keypress';
const KEYRELEASE = 'keyrelease';
const KEYLIGHT = 'keylight';
const KEYDIM = 'keydim';
const NOTELIGHT = 'notelight';
const NOTEDIM = 'notedim';

// Helper to create SVG elements
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  return el;
}

// Simple linear interpolation
function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Animate arc parameters over time
function animateArc(el, fromParams, toParams, drawArc, duration, onDone) {
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const t = Math.min(elapsed / duration, 1);
    const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; // easeInOutQuad

    const current = {
      startAngle: lerp(fromParams.startAngle, toParams.startAngle, eased),
      endAngle: lerp(fromParams.endAngle, toParams.endAngle, eased),
      innerRadius: lerp(fromParams.innerRadius, toParams.innerRadius, eased),
      outerRadius: lerp(fromParams.outerRadius, toParams.outerRadius, eased),
      raised: toParams.raised
    };

    el.setAttribute('d', drawArc(current));

    if (t < 1) {
      requestAnimationFrame(tick);
    } else if (onDone) {
      onDone();
    }
  }

  requestAnimationFrame(tick);
}

class AllAroundKeyboard extends HTMLElement {
  static observedAttributes = [
    'notes-in-octave', 'raised-notes', 'octaves', 'sweep', 'depth',
    'width', 'overlapping', 'pie', 'synth', 'transition-time',
    'base-tone', 'base-key', 'leftmost-key', 'key-style'
  ];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Default values
    this._notesInOctave = 12;
    this._raisedNotes = [1, 3, 6, 8, 10];
    this._octaves = 2;
    this._sweep = Math.PI / 2;
    this._depth = 100;
    this._width = 500;
    this._overlapping = 0.5;
    this._pie = false;
    this._synth = false;
    this._transitionTime = 750;
    this._baseTone = 32.70375;
    this._baseKey = 0;
    this._leftmostKey = 3 * 12;
    this._keyStyle = '';

    // State
    this._pressedKeys = new Set();
    this._litKeys = new Set();
    this._litNotes = new Set();
    this._keyElements = new Map(); // index -> {el, params}
    this._currentParams = new Map(); // index -> arc params for animation
  }

  // Property getters/setters with attribute sync
  get notesInOctave() { return this._notesInOctave; }
  set notesInOctave(v) { this._notesInOctave = Number(v); this._scheduleUpdate(); }

  get raisedNotes() { return this._raisedNotes; }
  set raisedNotes(v) {
    this._raisedNotes = Array.isArray(v) ? v : JSON.parse(v);
    this._scheduleUpdate();
  }

  get octaves() { return this._octaves; }
  set octaves(v) { this._octaves = Number(v); this._scheduleUpdate(); }

  get sweep() { return this._sweep; }
  set sweep(v) { this._sweep = Number(v) * Math.PI / 180; this._scheduleUpdate(); }

  get depth() { return this._depth; }
  set depth(v) { this._depth = Number(v); this._scheduleUpdate(); }

  get width() { return this._width; }
  set width(v) { this._width = Number(v); this._scheduleUpdate(); }

  get overlapping() { return this._overlapping; }
  set overlapping(v) { this._overlapping = Number(v); this._scheduleUpdate(); }

  get pie() { return this._pie; }
  set pie(v) { this._pie = v === true || v === 'true'; this._scheduleUpdate(); }

  get synth() { return this._synth; }
  set synth(v) { this._synth = v === true || v === 'true'; }

  get transitionTime() { return this._transitionTime; }
  set transitionTime(v) { this._transitionTime = Number(v); }

  get baseTone() { return this._baseTone; }
  set baseTone(v) { this._baseTone = Number(v); this._scheduleUpdate(); }

  get baseKey() { return this._baseKey; }
  set baseKey(v) { this._baseKey = Number(v); this._scheduleUpdate(); }

  get leftmostKey() { return this._leftmostKey; }
  set leftmostKey(v) { this._leftmostKey = Number(v); this._scheduleUpdate(); }

  get keyStyle() { return this._keyStyle; }
  set keyStyle(v) { this._keyStyle = v; this._updateStyle(); }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) return;
    const propName = name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    if (propName in this) {
      this[propName] = newVal;
    }
  }

  connectedCallback() {
    setupLilSynth();
    this._setupDOM();
    this._setupEventListeners();
    this._setupKeyboard();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  _setupDOM() {
    const style = document.createElement('style');
    style.textContent = css + this._keyStyle;
    this._styleEl = style;

    const container = document.createElement('div');
    const svg = svgEl('svg', { width: '100%' });
    const g = svgEl('g');
    svg.appendChild(g);
    container.appendChild(svg);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    this._svg = svg;
    this._g = g;
  }

  _updateStyle() {
    if (this._styleEl) {
      this._styleEl.textContent = css + this._keyStyle;
    }
  }

  _scheduleUpdate() {
    if (this._updatePending) return;
    this._updatePending = true;
    requestAnimationFrame(() => {
      this._updatePending = false;
      if (this.isConnected) {
        this._setupKeyboard();
      }
    });
  }

  _setupEventListeners() {
    const getKey = (index) => this._keyElements.get(index);

    this.addEventListener(KEYPRESS, (e) => {
      const keyData = getKey(e.index);
      if (keyData) {
        keyData.el.classList.add('key--pressed');
        keyData.el.dispatchEvent(new Event(KEYPRESS));
      }
      this._pressedKeys.add(e.index);
    });

    this.addEventListener(KEYRELEASE, (e) => {
      const keyData = getKey(e.index);
      if (keyData) {
        keyData.el.classList.remove('key--pressed');
        keyData.el.dispatchEvent(new Event(KEYRELEASE));
      }
      this._pressedKeys.delete(e.index);
    });

    this.addEventListener(KEYLIGHT, (e) => {
      const keyData = getKey(e.index);
      if (keyData) {
        keyData.el.classList.add('key--highlight');
        keyData.el.dispatchEvent(new Event(KEYLIGHT));
      }
      this._litKeys.add(e.index);
    });

    this.addEventListener(KEYDIM, (e) => {
      const keyData = getKey(e.index);
      if (keyData) {
        keyData.el.classList.remove('key--highlight');
        keyData.el.dispatchEvent(new Event(KEYDIM));
      }
      this._litKeys.delete(e.index);
    });

    this.addEventListener(NOTELIGHT, (e) => {
      for (const [, keyData] of this._keyElements) {
        if (keyData.data.note === e.note) {
          keyData.el.classList.add('key--highlight');
          keyData.el.dispatchEvent(new Event(NOTELIGHT));
        }
      }
      this._litNotes.add(e.note);
    });

    this.addEventListener(NOTEDIM, (e) => {
      for (const [, keyData] of this._keyElements) {
        if (keyData.data.note === e.note) {
          keyData.el.classList.remove('key--highlight');
          keyData.el.dispatchEvent(new Event(NOTEDIM));
        }
      }
      this._litNotes.delete(e.note);
    });
  }

  _setupKeyboard() {
    const outerRadius = (this._width - SVGStrokePadding * 2) / (2 * Math.sin(Math.min(this._sweep, Math.PI) / 2));
    const chordLength = outerRadius * 2 * Math.sin(this._sweep / 2);
    const innerRadius = outerRadius - this._depth;
    const startAngle = -this._sweep / 2;
    const endAngle = this._sweep / 2;

    let height;
    if (this._sweep > Math.PI) {
      height = outerRadius + Math.sqrt(outerRadius ** 2 - (chordLength / 2) ** 2);
    } else {
      height = outerRadius - Math.sqrt(outerRadius ** 2 - (chordLength / 2) ** 2) +
               this._depth * Math.cos(this._sweep / 2);
    }
    height += SVGStrokePadding;

    this._svg.setAttribute('viewBox', `0 0 ${this._width} ${height}`);
    this._g.setAttribute('transform', `translate(${this._width / 2}, ${outerRadius + SVGStrokePadding / 2})`);
    const drawArc = arc()
      .cornerRadius(2)
      .innerRadius(d => d.raised ? innerRadius + this._depth / (Math.tan(this._overlapping * Math.PI / 2) + 2) : innerRadius)
      .outerRadius(d => d.raised ? outerRadius : outerRadius - this._depth / (Math.tan(this._overlapping * Math.PI / 2) + 2));

    // Generate key data
    const keys = keyLayout()
      .octaves(this._octaves)
      .leftmostKey(this._leftmostKey)
      .baseTone(this._baseTone)
      .baseKey(this._baseKey)
      .raisedPattern(this._raisedNotes)
      .startAngle(startAngle)
      .endAngle(endAngle)
      .octaveSize(this._notesInOctave)
      .pie(this._pie);

    const keyData = keys();
    const currentIndices = new Set(keyData.map(d => d.index));

    // Remove keys that no longer exist
    for (const [index, data] of this._keyElements) {
      if (!currentIndices.has(index)) {
        data.el.remove();
        this._keyElements.delete(index);
        this._currentParams.delete(index);
      }
    }

    // Create arc params for a key
    const getArcParams = (d) => ({
      startAngle: d.startAngle,
      endAngle: d.endAngle,
      innerRadius: d.raised ? innerRadius + this._depth / (Math.tan(this._overlapping * Math.PI / 2) + 2) : innerRadius,
      outerRadius: d.raised ? outerRadius : outerRadius - this._depth / (Math.tan(this._overlapping * Math.PI / 2) + 2),
      raised: d.raised
    });

    // Update or create keys
    for (const d of keyData) {
      const existing = this._keyElements.get(d.index);
      const newParams = getArcParams(d);

      if (existing) {
        // Update existing key
        const oldParams = this._currentParams.get(d.index) || newParams;

        // Update classes for modulation
        const wasRaised = existing.el.classList.contains('key--upper');
        const needsModulation = (d.raised !== wasRaised);
        existing.el.classList.toggle('key--modulating', needsModulation);

        if (this._transitionTime > 0 && (
          oldParams.startAngle !== newParams.startAngle ||
          oldParams.endAngle !== newParams.endAngle
        )) {
          animateArc(existing.el, oldParams, newParams, drawArc, this._transitionTime, () => {
            existing.el.classList.remove('key--modulating');
            existing.el.classList.toggle('key--lower', !d.raised);
            existing.el.classList.toggle('key--upper', d.raised);
          });
        } else {
          existing.el.setAttribute('d', drawArc(newParams));
          setTimeout(() => {
            existing.el.classList.remove('key--modulating');
            existing.el.classList.toggle('key--lower', !d.raised);
            existing.el.classList.toggle('key--upper', d.raised);
          }, 1);
        }

        this._currentParams.set(d.index, newParams);
        existing.data = d;

        // Re-apply state classes
        existing.el.classList.toggle('key--pressed', this._pressedKeys.has(d.index));
        existing.el.classList.toggle('key--highlight',
          this._litKeys.has(d.index) || this._litNotes.has(d.note));
      } else {
        // Create new key
        const el = svgEl('path', {
          class: `key ${d.raised ? 'key--upper' : 'key--lower'}`,
          d: drawArc(newParams)
        });

        // Event handlers
        const onPress = (e) => {
          e.preventDefault();
          const evt = new Event(KEYPRESS);
          evt.index = d.index;
          this.dispatchEvent(evt);
        };

        const onRelease = (e) => {
          e.preventDefault();
          const evt = new Event(KEYRELEASE);
          evt.index = d.index;
          this.dispatchEvent(evt);
        };

        el.addEventListener('touchstart', onPress, { passive: false });
        el.addEventListener('mouseover', onPress);
        el.addEventListener('touchend', onRelease);
        el.addEventListener('mouseout', onRelease);
        el.addEventListener('mouseup', onRelease);

        el.addEventListener(KEYPRESS, () => {
          if (this._synth) soundKey(el, d.frequency);
        });
        el.addEventListener(KEYRELEASE, () => {
          if (this._synth) dampKey(el);
        });

        // Apply initial state
        if (this._pressedKeys.has(d.index)) el.classList.add('key--pressed');
        if (this._litKeys.has(d.index) || this._litNotes.has(d.note)) {
          el.classList.add('key--highlight');
        }

        this._g.appendChild(el);
        this._keyElements.set(d.index, { el, data: d });
        this._currentParams.set(d.index, newParams);
      }
    }

    // Raise upper keys to top of render order
    for (const d of keyData) {
      if (d.raised) {
        const keyData = this._keyElements.get(d.index);
        if (keyData) this._g.appendChild(keyData.el);
      }
    }
  }

  // Public API
  keysPress(keys) {
    const arr = typeof keys === 'number' ? [keys] : [...keys];
    for (const k of arr) {
      const e = new Event(KEYPRESS);
      e.index = k;
      this.dispatchEvent(e);
    }
  }

  keysRelease(keys) {
    const arr = typeof keys === 'number' ? [keys] : [...keys];
    for (const k of arr) {
      const e = new Event(KEYRELEASE);
      e.index = k;
      this.dispatchEvent(e);
    }
  }

  keysLight(keys) {
    const arr = typeof keys === 'number' ? [keys] : [...keys];
    for (const k of arr) {
      const e = new Event(KEYLIGHT);
      e.index = k;
      this.dispatchEvent(e);
    }
  }

  keysDim(keys) {
    const arr = typeof keys === 'number' ? [keys] : [...keys];
    for (const k of arr) {
      const e = new Event(KEYDIM);
      e.index = k;
      this.dispatchEvent(e);
    }
  }

  notesLight(notes) {
    const arr = typeof notes === 'number' ? [notes] : [...notes];
    for (const n of arr) {
      const e = new Event(NOTELIGHT);
      e.note = n;
      this.dispatchEvent(e);
    }
  }

  notesDim(notes) {
    const arr = typeof notes === 'number' ? [notes] : [...notes];
    for (const n of arr) {
      const e = new Event(NOTEDIM);
      e.note = n;
      this.dispatchEvent(e);
    }
  }

  releaseAll() {
    this.keysRelease(this._pressedKeys);
  }

  dimAll() {
    this.keysDim(this._litKeys);
    this.notesDim(this._litNotes);
  }
}

customElements.define('all-around-keyboard', AllAroundKeyboard);

export { AllAroundKeyboard, KEYDIM, KEYLIGHT, KEYPRESS, KEYRELEASE, NOTEDIM, NOTELIGHT, keyLayout };
