var AllAroundKeyboard = (function (exports) {
  'use strict';

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

  function normalizeFrequency(value, field = 'frequency') {
    const number = Number(value);
    if (!Number.isFinite(number) || number <= 0) {
      throw new RangeError(`${field} values must be positive finite numbers`);
    }
    return number;
  }

  function normalizeFrequencyProvider(value) {
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

  function frequencyProvidersEqual(left, right) {
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

  function resolveKeyFrequency(provider, key, context) {
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

  // The demonstration synth is deliberately lazy and instance-owned. Merely
  // connecting a visual keyboard must never create an AudioContext.
  const synths = new WeakMap();

  function setupLilSynth(owner) {
    const existing = synths.get(owner);
    if (existing) return existing.context;
    const AudioContext = window.AudioContext || window.webkitAudioContext ||
      window.mozAudioContext || window.oAudioContext;
    if (!AudioContext) return null;
    const context = new AudioContext();
    synths.set(owner, { context, voices: new Map() });
    return context;
  }

  function createVoice(context, frequency) {
    const filter = context.createBiquadFilter();
    filter.frequency.value = frequency;
    filter.type = 'bandpass';

    const gain = context.createGain();
    gain.gain.value = 0.000001;
    filter.connect(gain);
    gain.connect(context.destination);

    const oscillator = context.createOscillator();
    const oscillator2 = context.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.value = frequency / 2;
    oscillator2.frequency.value = frequency;
    oscillator.connect(filter);
    oscillator2.connect(gain);
    oscillator.start();
    oscillator2.start();
    return { filter, gain, oscillator, oscillator2 };
  }

  function soundKey(owner, key, frequency, level = 0.05) {
    const context = setupLilSynth(owner);
    if (!context) return;
    try {
      const resuming = context.resume?.();
      resuming?.catch?.(() => {});
    } catch { /* gesture-time resume is best effort */ }
    const state = synths.get(owner);
    let voice = state.voices.get(key);
    if (!voice) {
      voice = createVoice(context, frequency);
      state.voices.set(key, voice);
    }
    voice.filter.frequency.value = frequency;
    voice.oscillator.frequency.value = frequency / 2;
    voice.oscillator2.frequency.value = frequency;
    const now = context.currentTime;
    voice.gain.gain.cancelScheduledValues?.(now);
    voice.gain.gain.setTargetAtTime(level, now, 0.04);
  }

  function dampKey(owner, key) {
    const state = synths.get(owner);
    const voice = state?.voices.get(key);
    if (!voice) return;
    const now = state.context.currentTime;
    voice.gain.gain.cancelScheduledValues?.(now);
    voice.gain.gain.setTargetAtTime(0.000001, now, 0.05);
  }

  function releaseLilSynthKey(owner, key) {
    const state = synths.get(owner);
    const voice = state?.voices.get(key);
    if (!voice) return;
    stopVoice(voice.oscillator, state.context.currentTime);
    stopVoice(voice.oscillator2, state.context.currentTime);
    voice.oscillator.disconnect();
    voice.oscillator2.disconnect();
    voice.filter.disconnect();
    voice.gain.disconnect();
    state.voices.delete(key);
  }

  function disposeLilSynth(owner) {
    const state = synths.get(owner);
    if (!state) return;
    for (const key of [...state.voices.keys()]) releaseLilSynthKey(owner, key);
    synths.delete(owner);
    try {
      const closing = state.context.close?.();
      closing?.catch?.(() => {});
    } catch { /* teardown is best effort */ }
  }

  function stopVoice(voice, when) {
    if (!voice) return;
    try { voice.stop(when); } catch { /* already stopped */ }
  }

  var css = "all-around-keyboard {\n  display: block;\n  padding: 5px;\n}\n:host {\n  display: block;\n  position: relative; /* Containing block for slotted absolute children */\n  padding: 5px;\n\n  /* CSS Custom Properties - override these to customize */\n  --key-lower-fill: white;\n  --key-lower-stroke: #777;\n  --key-upper-fill: black;\n  --key-upper-stroke: #000;\n  --key-pressed-fill: deeppink;\n  --key-highlight-stroke: rgba(0, 91, 255, 0.73);\n  --key-highlight-stroke-width: 5.5px;\n  --key-highlight-lower-fill: rgb(215, 237, 249);\n  --key-highlight-upper-fill: #495b96;\n  --key-hover-opacity: 0.85;\n  --key-stroke-width: 1.5px;\n  --key-focus-outline: 2px solid #005bff;\n  --key-focus-outline-offset: 2px;\n}\n\n/* Container layout for indicator positioning */\n.keyboard-container {\n  position: relative;\n}\n\n.indicator-container {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none; /* Allow clicks through to keyboard */\n  overflow: visible;\n}\n\n/* Slotted indicator children - positioned via CSS custom properties */\n::slotted([data-pitch]),\n::slotted([data-key]),\n::slotted([data-aak-indicator]) {\n  position: absolute;\n  left: var(--indicator-x, 50%);\n  top: var(--indicator-y, 50%);\n  transform: translate(-50%, -50%);\n  /* Hide until keyboard has positioned (sets data-positioned attribute) */\n  visibility: hidden;\n}\n\n/* Show indicators once positioned by keyboard */\n::slotted([data-positioned]) {\n  visibility: visible;\n}\n\n/* Default marker for the optional typed indicator API. Callers can override\n   it through ::part(indicator) or provide their own element. */\n::slotted([data-aak-indicator]) {\n  box-sizing: border-box;\n  width: var(--indicator-size, 0.75rem);\n  height: var(--indicator-size, 0.75rem);\n  border: var(--indicator-border, 2px solid white);\n  border-radius: 50%;\n  background: var(--indicator-fill, #005bff);\n  pointer-events: none;\n}\n\n.key {\n  stroke-width: var(--key-stroke-width);\n  cursor: pointer;\n  outline: none;\n}\n\n.key:focus-visible {\n  outline: var(--key-focus-outline);\n  outline-offset: var(--key-focus-outline-offset);\n}\n\n.key--lower {\n  fill: var(--key-lower-fill);\n  stroke: var(--key-lower-stroke);\n}\n.key--upper {\n  fill: var(--key-upper-fill);\n  stroke: var(--key-upper-stroke);\n}\n\n.key--hover.key--lower {\n  opacity: var(--key-hover-opacity);\n}\n.key--hover.key--upper {\n  opacity: var(--key-hover-opacity);\n}\n\n.key, .key--modulating {\n  transition: fill;\n  transition-duration: 1s;\n  transition-delay: 1s;\n  transition-timing-function: ease-in-out;\n}\n\n.key:not(.key--modulating) {\n  transition-delay: 0s !important;\n  transition-duration: 0.1s !important;\n}\n\n.key:not(.key--modulating).key--highlight, .key:not(.key--modulating).key--pressed {\n  transition-duration: 0s !important;\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .key,\n  .key--modulating {\n    transition-duration: 0s !important;\n    transition-delay: 0s !important;\n  }\n}\n\n.key--pressed,\n.key--highlight.key--pressed.key--upper,\n.key--highlight.key--pressed.key--lower {\n  fill: var(--key-pressed-fill);\n}\n\n.key--highlight {\n  stroke: var(--key-highlight-stroke);\n  stroke-width: var(--key-highlight-stroke-width);\n}\n\n.key--highlight.key--lower { fill: var(--key-highlight-lower-fill); }\n.key--highlight.key--upper { fill: var(--key-highlight-upper-fill); }\n\n/* Key labels */\n.key-label {\n  font-family: var(--key-label-font, system-ui, -apple-system, sans-serif);\n  font-size: var(--key-label-font-size, 12px);\n  font-weight: var(--key-label-font-weight, 500);\n  user-select: none;\n}\n\n.key-label--lower {\n  fill: var(--key-label-lower-fill, #333);\n}\n\n.key-label--upper {\n  fill: var(--key-label-upper-fill, #fff);\n}\n\n/* Typed labels are independent keyed annotations. Their text, accessible\n   label, and optional class come from the adapter rather than note-name\n   policy in the component. */\n.annotation-label {\n  fill: var(--annotation-label-fill, currentColor);\n  font-family: var(--annotation-label-font, system-ui, -apple-system, sans-serif);\n  font-size: var(--annotation-label-font-size, 12px);\n  font-weight: var(--annotation-label-font-weight, 600);\n  user-select: none;\n}\n";

  const SVGStrokePadding = 15;
  const SVGNS = 'http://www.w3.org/2000/svg';
  const VERSION = '1.9.0';

  // Existing event names remain stable. Pointer events are exported as well.
  const KEYCLICK = 'keyclick';
  const KEYHOVER = 'keyhover';
  const KEYUNHOVER = 'keyunhover';
  const KEYPOINTERDOWN = 'keypointerdown';
  const KEYPOINTERUP = 'keypointerup';
  const KEYBOARDINTENT = 'keyboardintent';
  const PROJECTIONGAP = 'projectiongap';
  const RENDERERROR = 'rendererror';
  const LOCATION_KINDS = ['key', 'note', 'pitch'];

  const STATE_FIELDS = {
    pressedKeys: '_pressedKeys',
    litKeys: '_litKeys',
    pressedNotes: '_pressedNotes',
    litNotes: '_litNotes',
    hoveredKeys: '_hoveredKeys',
    hoveredNotes: '_hoveredNotes'
  };

  const INDICATOR_ATTRIBUTES = new Set([
    'data-pitch', 'data-key', 'data-radius',
    'data-wave-number', 'data-wave-amplitude', 'data-wave-phase'
  ]);

  const INDICATOR_STYLE_PROPERTIES = new Set([
    '--indicator-x', '--indicator-y', '--indicator-angle', '--indicator-pitch',
    '--indicator-radius', '--indicator-visible', '--indicator-wave-offset',
    '--indicator-wave-phase', 'opacity', 'pointer-events'
  ]);

  const OVERLAY_ATTRIBUTES = new Set([
    'data-key-overlay', 'data-overlay-pattern', 'data-overlay-id'
  ]);

  function svgEl(tag, attrs = {}) {
    const element = document.createElementNS(SVGNS, tag);
    for (const [name, value] of Object.entries(attrs)) {
      element.setAttribute(name, value);
    }
    return element;
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function arcCentroid(params) {
    const midAngle = (params.startAngle + params.endAngle) / 2;
    const midRadius = (params.innerRadius + params.outerRadius) / 2;
    return {
      x: Math.sin(midAngle) * midRadius,
      y: -Math.cos(midAngle) * midRadius
    };
  }

  function parseArrayAttr(value) {
    if (!value) return [];
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function normalizeNumberSet(value, field) {
    let values;
    if (typeof value === 'string') {
      values = parseArrayAttr(value);
    } else if (value == null) {
      values = [];
    } else if (typeof value[Symbol.iterator] === 'function') {
      values = value;
    } else {
      throw new TypeError(`${field} must be an iterable of finite numbers`);
    }

    const normalized = new Set();
    for (const item of values) {
      const number = Number(item);
      if (!Number.isFinite(number)) {
        throw new TypeError(`${field} must contain only finite numbers`);
      }
      normalized.add(number);
    }
    return normalized;
  }

  function setsEqual(left, right) {
    if (left.size !== right.size) return false;
    for (const value of left) {
      if (!right.has(value)) return false;
    }
    return true;
  }

  function arraysEqual(left, right) {
    return left.length === right.length && left.every((value, index) => value === right[index]);
  }

  function paramsEqual(left, right) {
    return Boolean(left && right) &&
      left.startAngle === right.startAngle &&
      left.endAngle === right.endAngle &&
      left.innerRadius === right.innerRadius &&
      left.outerRadius === right.outerRadius &&
      left.raised === right.raised;
  }

  function overlaySpecsEqual(left, right) {
    return Boolean(left && right) &&
      left.id === right.id &&
      left.at.kind === right.at.kind &&
      left.at.value === right.at.value &&
      arraysEqual(left.patterns, right.patterns);
  }

  function indicatorSpecsEqual(left, right) {
    if (!left || !right || left.element !== right.element ||
        left.at.kind !== right.at.kind || left.at.value !== right.at.value ||
        left.radius !== right.radius) return false;
    if (!left.wave || !right.wave) return left.wave === right.wave;
    return left.wave.number === right.wave.number &&
      left.wave.amplitude === right.wave.amplitude &&
      left.wave.phase === right.wave.phase;
  }

  function labelSpecsEqual(left, right) {
    return Boolean(left && right) &&
      left.id === right.id &&
      left.at.kind === right.at.kind &&
      left.at.value === right.at.value &&
      left.text === right.text &&
      left.ariaLabel === right.ariaLabel &&
      left.className === right.className;
  }

  function finiteNumber(value, field) {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new TypeError(`${field} must be a finite number`);
    return number;
  }

  function createDirtyState() {
    return {
      reasons: new Set(),
      geometry: false,
      keyData: false,
      labels: false,
      allProjectedLabels: false,
      projectedLabels: new Set(),
      patterns: false,
      transform: false,
      allKeyState: false,
      stateFields: new Set(),
      keyState: new Set(),
      allIndicators: false,
      indicatorElements: new Set(),
      indicators: new Set(),
      allOverlays: false,
      overlayElements: new Set(),
      overlays: new Set()
    };
  }

  function hasDirtyWork(dirty) {
    return dirty.geometry || dirty.keyData || dirty.labels || dirty.patterns || dirty.transform ||
      dirty.allProjectedLabels || dirty.projectedLabels.size > 0 ||
      dirty.allKeyState || dirty.stateFields.size > 0 || dirty.keyState.size > 0 ||
      dirty.allIndicators || dirty.indicatorElements.size > 0 || dirty.indicators.size > 0 ||
      dirty.allOverlays || dirty.overlayElements.size > 0 || dirty.overlays.size > 0;
  }

  function normalizeLocation(at, allowedKinds, field = 'at') {
    if (!at || typeof at !== 'object') {
      throw new TypeError(`${field} must be an object with exactly one location`);
    }
    const present = LOCATION_KINDS.filter(kind => Object.prototype.hasOwnProperty.call(at, kind));
    if (present.length !== 1 || !allowedKinds.includes(present[0])) {
      throw new TypeError(`${field} must contain exactly one of ${allowedKinds.map(kind => `{ ${kind} }`).join(', ')}`);
    }
    return { kind: present[0], value: finiteNumber(at[present[0]], `${field}.${present[0]}`) };
  }

  function normalizeWave(wave) {
    if (wave == null) return null;
    if (typeof wave !== 'object') throw new TypeError('wave must be an object');
    return {
      number: finiteNumber(wave.number ?? 1, 'wave.number'),
      amplitude: finiteNumber(wave.amplitude ?? 0.2, 'wave.amplitude'),
      phase: finiteNumber(wave.phase ?? 0, 'wave.phase')
    };
  }

  /**
   * Pure indicator geometry. DOM reads are supplied through frameTransform and
   * DOM writes are deliberately left to the renderer.
   */
  function calculateIndicatorPlacement(spec, keyboardGeometry, keyParams, frameTransform, config) {
    const totalKeys = config.octaves * config.notesInOctave;
    if (totalKeys <= 0) return null;

    const sweepAngle = keyboardGeometry.endAngle - keyboardGeometry.startAngle;
    const keyWidth = sweepAngle / totalKeys;
    const circular = Math.abs(config.sweep - 2 * Math.PI) < 0.01;
    let angle;
    let pitch;
    let keyRadius = null;
    let visible = true;

    if (spec.at.kind === 'key') {
      const keyIndex = spec.at.value;
      const params = keyParams.get(keyIndex);
      pitch = keyIndex - config.leftmostKey;
      if (params) {
        angle = (params.startAngle + params.endAngle) / 2;
        const geometryDepth = keyboardGeometry.outerRadius - keyboardGeometry.innerRadius;
        if (geometryDepth !== 0) {
          const inner = (params.innerRadius - keyboardGeometry.innerRadius) / geometryDepth;
          const outer = (params.outerRadius - keyboardGeometry.innerRadius) / geometryDepth;
          keyRadius = params.raised ? inner + (outer - inner) * 0.5 : inner + (outer - inner) * 0.3;
        }
      } else {
        if (!circular && (pitch < 0 || pitch >= totalKeys)) visible = false;
        const position = circular ? ((pitch % totalKeys) + totalKeys) % totalKeys : pitch;
        angle = keyboardGeometry.startAngle + (position + 0.5) * keyWidth;
      }
    } else {
      pitch = spec.at.value;
      if (!circular && (pitch < -0.5 || pitch > totalKeys - 0.5)) visible = false;

      const lowerPitch = Math.floor(pitch);
      const upperPitch = Math.ceil(pitch);
      const fraction = pitch - lowerPitch;
      const wrap = value => ((value % totalKeys) + totalKeys) % totalKeys;
      const clamp = value => Math.max(0, Math.min(totalKeys - 1, value));
      const lowerIndex = config.leftmostKey + (circular ? wrap(lowerPitch) : clamp(lowerPitch));
      const upperIndex = config.leftmostKey + (circular ? wrap(upperPitch) : clamp(upperPitch));
      const lower = keyParams.get(lowerIndex);
      const upper = keyParams.get(upperIndex);

      if (lower && upper) {
        const lowerAngle = (lower.startAngle + lower.endAngle) / 2;
        let upperAngle = (upper.startAngle + upper.endAngle) / 2;
        if (circular && upperPitch >= totalKeys) upperAngle += 2 * Math.PI;
        angle = lowerAngle + fraction * (upperAngle - lowerAngle);
      } else if (lower) {
        angle = (lower.startAngle + lower.endAngle) / 2;
      } else {
        angle = keyboardGeometry.startAngle + (pitch + 0.5) * keyWidth;
      }
    }

    const baseRadius = spec.radius ?? keyRadius ?? 0.5;
    let radius = baseRadius;
    let waveOffset = null;
    let wavePosition = null;
    if (spec.wave) {
      wavePosition = 2 * Math.PI * spec.wave.number * pitch / totalKeys + spec.wave.phase;
      waveOffset = spec.wave.amplitude * Math.sin(wavePosition);
      radius += waveOffset;
    }

    const radialDistance = keyboardGeometry.innerRadius +
      radius * (keyboardGeometry.outerRadius - keyboardGeometry.innerRadius);
    const groupX = Math.sin(angle) * radialDistance;
    const groupY = -Math.cos(angle) * radialDistance;
    const { ctm, hostRect } = frameTransform;
    const screenX = ctm.a * groupX + ctm.c * groupY + ctm.e;
    const screenY = ctm.b * groupX + ctm.d * groupY + ctm.f;

    return {
      visible,
      x: screenX - hostRect.left,
      y: screenY - hostRect.top,
      angle: angle * 180 / Math.PI,
      pitch,
      radius,
      waveOffset,
      wavePosition
    };
  }

  class AllAroundKeyboard extends HTMLElement {
    static observedAttributes = [
      'notes-in-octave', 'raised-notes', 'octaves', 'sweep', 'depth',
      'width', 'overlapping', 'pie', 'synth', 'transition-time',
      'synth-gain',
      'base-tone', 'base-key', 'leftmost-key',
      'pressed-keys', 'lit-keys', 'pressed-notes', 'lit-notes',
      'hovered-keys', 'hovered-notes',
      'key-labels', 'label-format'
    ];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this._notesInOctave = 12;
      this._raisedNotes = [1, 3, 6, 8, 10];
      this._octaves = 2;
      this._sweep = Math.PI / 2;
      this._depth = 100;
      this._width = 500;
      this._overlapping = 0.5;
      this._pie = false;
      this._synth = false;
      this._synthGain = 0.05;
      this._transitionTime = 0;
      this._baseTone = 32.70375;
      this._baseKey = 0;
      this._leftmostKey = 36;
      this._frequencyProvider = null;

      this._pressedKeys = new Set();
      this._litKeys = new Set();
      this._pressedNotes = new Set();
      this._litNotes = new Set();
      this._hoveredKeys = new Set();
      this._hoveredNotes = new Set();
      this._renderedState = Object.fromEntries(
        Object.keys(STATE_FIELDS).map(field => [field, new Set()])
      );

      this._keyLabels = false;
      this._labelFormat = 'note';
      this._keyLabelsMap = null;
      this._labelRegistry = new Map();
      this._labelElements = new Map();
      this._nextLabelElementId = 1;

      this._keyElements = new Map();
      this._keysByNote = new Map();
      this._currentParams = new Map();
      this._keyAnimations = new Map();
      this._animationRequest = 0;
      this._focusedKeyIndex = null;
      this._nextInteractionId = 1;
      this._pointerInteractions = new Map();
      this._keyboardInteractions = new Map();
      this._geometryRevision = 0;
      this._geometry = {
        cx: 0,
        cy: 0,
        innerRadius: 0,
        outerRadius: 0,
        startAngle: 0,
        endAngle: 0
      };

      this._overlayRegistry = new Map();
      this._overlayElements = new Map();
      this._overlayByKey = new Map();
      this._overlayElementIds = new WeakMap();
      this._nextOverlayElementId = 1;
      this._overlayPatternIds = new Set();
      this._overlayPatternClones = [];
      this._overlayPatternId = null;

      this._indicatorRegistry = new Map();
      this._indicatorElementIds = new WeakMap();
      this._indicatorStyleState = new WeakMap();
      this._ownedIndicatorElements = new WeakSet();
      this._nextIndicatorElementId = 1;

      this._dirty = createDirtyState();
      this._renderRequest = 0;
      this._renderDeferred = null;
      this._frameTransform = null;
      this._lastResizeSize = null;
      this._connected = false;
      this._mutationObserver = null;
      this._resizeObserver = null;
      this.onRenderStats = null;
      this.onRenderError = null;

      this._setupDOM();
    }

    get notesInOctave() { return this._notesInOctave; }
    set notesInOctave(value) { this._setFiniteGeometry('_notesInOctave', value, 'notesInOctave', { min: 1, integer: true }); }

    get raisedNotes() { return [...this._raisedNotes]; }
    set raisedNotes(value) {
      const next = [...normalizeNumberSet(value, 'raisedNotes')].sort((left, right) => left - right);
      if (arraysEqual(this._raisedNotes, next)) return;
      this._raisedNotes = next;
      this._invalidate('geometry', null, 'raisedNotes');
    }

    get octaves() { return this._octaves; }
    set octaves(value) { this._setFiniteGeometry('_octaves', value, 'octaves', { min: 1, integer: true }); }

    // Retains the historical API: assignment is degrees and the getter is radians.
    get sweep() { return this._sweep; }
    set sweep(value) {
      const radians = finiteNumber(value, 'sweep') * Math.PI / 180;
      if (radians <= 0 || radians > 2 * Math.PI) throw new RangeError('sweep must be in (0, 360] degrees');
      if (this._sweep === radians) return;
      this._sweep = radians;
      this._invalidate('geometry', null, 'sweep');
    }

    get depth() { return this._depth; }
    set depth(value) { this._setFiniteGeometry('_depth', value, 'depth', { min: 0 }); }

    get width() { return this._width; }
    set width(value) { this._setFiniteGeometry('_width', value, 'width', { min: Number.EPSILON }); }

    get overlapping() { return this._overlapping; }
    set overlapping(value) { this._setFiniteGeometry('_overlapping', value, 'overlapping'); }

    get pie() { return this._pie; }
    set pie(value) {
      const next = value === true || value === 'true';
      if (next === this._pie) return;
      this._pie = next;
      this._invalidate('geometry', null, 'pie');
    }

    get synth() { return this._synth; }
    set synth(value) {
      const next = value === true || value === 'true';
      if (next === this._synth) return;
      this._synth = next;
      if (!next) disposeLilSynth(this);
    }

    get synthGain() { return this._synthGain; }
    set synthGain(value) {
      const next = finiteNumber(value, 'synthGain');
      if (next < 0 || next > 1) throw new RangeError('synthGain must be between 0 and 1');
      this._synthGain = next;
    }

    get transitionTime() { return this._transitionTime; }
    set transitionTime(value) {
      const next = finiteNumber(value, 'transitionTime');
      if (next < 0) throw new RangeError('transitionTime must be non-negative');
      if (next === this._transitionTime) return;
      this._transitionTime = next;
    }

    get baseTone() { return this._baseTone; }
    set baseTone(value) { this._setFiniteKeyData('_baseTone', value, 'baseTone', { min: Number.EPSILON }); }

    get baseKey() { return this._baseKey; }
    set baseKey(value) { this._setFiniteKeyData('_baseKey', value, 'baseKey'); }

    get leftmostKey() { return this._leftmostKey; }
    set leftmostKey(value) { this._setFiniteGeometry('_leftmostKey', value, 'leftmostKey', { integer: true }); }

    get frequencyProvider() { return normalizeFrequencyProvider(this._frequencyProvider); }
    set frequencyProvider(value) {
      const next = normalizeFrequencyProvider(value);
      if (frequencyProvidersEqual(this._frequencyProvider, next)) return;
      this._frequencyProvider = next;
      this._invalidate('keyData', null, 'frequencyProvider');
    }

    get pressedKeys() { return [...this._pressedKeys]; }
    set pressedKeys(value) { this.updateState({ pressedKeys: value }); }
    get litKeys() { return [...this._litKeys]; }
    set litKeys(value) { this.updateState({ litKeys: value }); }
    get pressedNotes() { return [...this._pressedNotes]; }
    set pressedNotes(value) { this.updateState({ pressedNotes: value }); }
    get litNotes() { return [...this._litNotes]; }
    set litNotes(value) { this.updateState({ litNotes: value }); }
    get hoveredKeys() { return [...this._hoveredKeys]; }
    set hoveredKeys(value) { this.updateState({ hoveredKeys: value }); }
    get hoveredNotes() { return [...this._hoveredNotes]; }
    set hoveredNotes(value) { this.updateState({ hoveredNotes: value }); }

    get keyLabels() { return this._keyLabels; }
    set keyLabels(value) {
      let enabled;
      let labelsMap = null;
      if (value instanceof Map) {
        enabled = true;
        labelsMap = new Map(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        enabled = true;
        labelsMap = new Map(Object.entries(value).map(([key, label]) => [Number(key), label]));
      } else {
        enabled = value === true || value === 'true';
      }

      const mapEqual = this._mapsEqual(this._keyLabelsMap, labelsMap);
      if (enabled === this._keyLabels && mapEqual) return;
      this._keyLabels = enabled;
      this._keyLabelsMap = labelsMap;
      this._invalidate('labels', null, 'keyLabels');
    }

    get labelFormat() { return this._labelFormat; }
    set labelFormat(value) {
      if (value === this._labelFormat) return;
      this._labelFormat = value;
      this._invalidate('labels', null, 'labelFormat');
    }

    get geometry() { return { ...this._geometry }; }
    get geometryRevision() { return this._geometryRevision; }
    get updateComplete() { return this._renderDeferred?.promise ?? Promise.resolve(); }
    whenRendered() { return this.updateComplete; }

    updateState(patch = {}) {
      if (!patch || typeof patch !== 'object') throw new TypeError('updateState expects an object');
      const changedFields = [];
      for (const [field, privateField] of Object.entries(STATE_FIELDS)) {
        if (!Object.prototype.hasOwnProperty.call(patch, field)) continue;
        const next = normalizeNumberSet(patch[field], field);
        const previous = this[privateField];
        if (setsEqual(previous, next)) continue;
        this[privateField] = next;
        changedFields.push(field);
      }
      if (changedFields.length === 0) return;

      for (const field of changedFields) this._dirty.stateFields.add(field);
      if (this._keyElements.size === 0) this._dirty.allKeyState = true;
      this._invalidate(null, null, 'state');
    }

    setOverlay(spec) {
      const normalized = this._normalizeOverlaySpec(spec);
      const previous = this._overlayRegistry.get(normalized.id);
      if (overlaySpecsEqual(previous, normalized)) return;
      this._overlayRegistry.set(normalized.id, normalized);
      this._invalidate('overlays', normalized.id, 'setOverlay');
    }

    removeOverlay(id) {
      const normalizedId = String(id);
      if (!this._overlayRegistry.delete(normalizedId)) return;
      this._invalidate('overlays', normalizedId, 'removeOverlay');
    }

    updateOverlays(specs) {
      if (!specs || typeof specs[Symbol.iterator] !== 'function') {
        throw new TypeError('updateOverlays expects an iterable');
      }
      const next = new Map();
      for (const spec of specs) {
        const normalized = this._normalizeOverlaySpec(spec);
        if (next.has(normalized.id)) throw new TypeError(`Duplicate overlay id: ${normalized.id}`);
        next.set(normalized.id, normalized);
      }

      for (const [id, current] of this._overlayRegistry) {
        if (current.sourceElement) continue;
        if (!next.has(id)) {
          this._overlayRegistry.delete(id);
          this._dirty.overlays.add(id);
        }
      }
      for (const [id, spec] of next) {
        const previous = this._overlayRegistry.get(id);
        if (!overlaySpecsEqual(previous, spec)) {
          this._overlayRegistry.set(id, spec);
          this._dirty.overlays.add(id);
        }
      }
      if (this._dirty.overlays.size > 0) this._invalidate(null, null, 'updateOverlays');
    }

    // Alias for adapters that publish a complete overlay snapshot.
    setOverlays(specs) { this.updateOverlays(specs); }

    setLabel(spec) {
      const normalized = this._normalizeLabelSpec(spec);
      const previous = this._labelRegistry.get(normalized.id);
      if (labelSpecsEqual(previous, normalized)) return;
      this._labelRegistry.set(normalized.id, normalized);
      this._invalidate('projectedLabels', normalized.id, 'setLabel');
    }

    removeLabel(id) {
      const normalizedId = String(id);
      if (!this._labelRegistry.delete(normalizedId)) return;
      this._invalidate('projectedLabels', normalizedId, 'removeLabel');
    }

    updateLabels(specs) {
      if (!specs || typeof specs[Symbol.iterator] !== 'function') {
        throw new TypeError('updateLabels expects an iterable');
      }
      const next = new Map();
      for (const spec of specs) {
        const normalized = this._normalizeLabelSpec(spec);
        if (next.has(normalized.id)) throw new TypeError(`Duplicate label id: ${normalized.id}`);
        next.set(normalized.id, normalized);
      }
      for (const id of this._labelRegistry.keys()) {
        if (next.has(id)) continue;
        this._labelRegistry.delete(id);
        this._dirty.projectedLabels.add(id);
      }
      for (const [id, spec] of next) {
        if (labelSpecsEqual(this._labelRegistry.get(id), spec)) continue;
        this._labelRegistry.set(id, spec);
        this._dirty.projectedLabels.add(id);
      }
      if (this._dirty.projectedLabels.size > 0) this._invalidate(null, null, 'updateLabels');
    }

    // Alias for adapters that publish a complete label snapshot.
    setLabels(specs) { this.updateLabels(specs); }

    setIndicator(id, spec) {
      const normalized = this._normalizeIndicatorSpec(id, spec);
      return this._setNormalizedIndicator(normalized);
    }

    _setNormalizedIndicator(normalized) {
      const normalizedId = normalized.id;
      const previous = this._indicatorRegistry.get(normalizedId);
      const { element } = normalized;
      if (indicatorSpecsEqual(previous, normalized)) return element;

      if (previous && previous.element !== element) {
        if (previous.owned) {
          previous.element.remove();
        } else {
          this._clearIndicatorPlacement(previous.element);
          delete previous.element.dataset.aakIndicator;
          previous.element.part.remove('indicator');
        }
      }

      if (normalized.owned && !element.isConnected) {
        this._ownedIndicatorElements.add(element);
      }
      element.dataset.aakIndicator = normalizedId;
      element.part.add('indicator');
      if (element.parentElement !== this) this.append(element);
      this._indicatorRegistry.set(normalizedId, normalized);
      this._invalidate('indicators', normalizedId, 'setIndicator');
      return element;
    }

    removeIndicator(id) {
      const normalizedId = String(id);
      const current = this._indicatorRegistry.get(normalizedId);
      if (!current) return;
      this._indicatorRegistry.delete(normalizedId);
      if (current.owned) {
        current.element.remove();
      } else {
        this._clearIndicatorPlacement(current.element);
        delete current.element.dataset.aakIndicator;
        current.element.part.remove('indicator');
      }
      this._invalidate('indicators', normalizedId, 'removeIndicator');
    }

    invalidateLayout() {
      this._frameTransform = null;
      this._dirty.allIndicators = true;
      this._invalidate('transform', null, 'layout');
    }

    getPositionForPitch(pitch, radius = 0.5) {
      const totalKeys = this._octaves * this._notesInOctave;
      const normalizedPitch = pitch / totalKeys;
      const angle = this._geometry.startAngle +
        normalizedPitch * (this._geometry.endAngle - this._geometry.startAngle);
      const radialDistance = this._geometry.innerRadius +
        radius * (this._geometry.outerRadius - this._geometry.innerRadius);
      return {
        x: this._geometry.cx + Math.sin(angle) * radialDistance,
        y: this._geometry.cy - Math.cos(angle) * radialDistance,
        angle: angle * 180 / Math.PI,
        pitch,
        radius
      };
    }

    getPositionForKey(keyIndex, radius = 0.5) {
      const params = this._currentParams.get(keyIndex);
      if (params) {
        const midAngle = (params.startAngle + params.endAngle) / 2;
        const pitch = (midAngle - this._geometry.startAngle) /
          (this._geometry.endAngle - this._geometry.startAngle) *
          (this._octaves * this._notesInOctave);
        return this.getPositionForPitch(pitch, radius);
      }
      return this.getPositionForPitch(keyIndex - this._leftmostKey, radius);
    }

    getAnchor(at, options = {}) {
      const result = this.getAnchors([at], options);
      return {
        revision: result.revision,
        space: result.space,
        at: result.anchors[0].at,
        points: result.anchors[0].points
      };
    }

    getAnchors(locations, options = {}) {
      if (!locations || typeof locations[Symbol.iterator] !== 'function') {
        throw new TypeError('getAnchors expects an iterable of locations');
      }
      if (!options || typeof options !== 'object') throw new TypeError('Anchor options must be an object');
      const radius = finiteNumber(options.radius ?? 0.5, 'options.radius');
      const space = options.space ?? 'viewBox';
      if (!['viewBox', 'client', 'host'].includes(space)) {
        throw new RangeError("options.space must be 'viewBox', 'client', or 'host'");
      }
      const normalized = [...locations].map((location, index) => {
        const value = normalizeLocation(location, ['key', 'note'], `locations[${index}]`);
        this._validateKeyOrNoteLocation(value, 'Anchor');
        return value;
      });

      let transform = null;
      let hostRect = null;
      if (space !== 'viewBox' && normalized.length > 0) {
        const ctm = this._g.getScreenCTM();
        if (ctm) transform = { a: ctm.a, b: ctm.b, c: ctm.c, d: ctm.d, e: ctm.e, f: ctm.f };
        if (space === 'host') {
          const rect = this.getBoundingClientRect();
          hostRect = { left: rect.left, top: rect.top };
        }
      }

      const pointForKey = key => {
        const params = this._currentParams.get(key);
        const entry = this._keyElements.get(key);
        if (!params || !entry) return null;
        const angle = (params.startAngle + params.endAngle) / 2;
        const radialDistance = params.innerRadius + radius * (params.outerRadius - params.innerRadius);
        const groupX = Math.sin(angle) * radialDistance;
        const groupY = -Math.cos(angle) * radialDistance;
        let x = this._geometry.cx + groupX;
        let y = this._geometry.cy + groupY;
        if (space !== 'viewBox') {
          if (!transform) return null;
          x = transform.a * groupX + transform.c * groupY + transform.e;
          y = transform.b * groupX + transform.d * groupY + transform.f;
          if (space === 'host') {
            x -= hostRect.left;
            y -= hostRect.top;
          }
        }
        return {
          key,
          note: entry.data.note,
          x,
          y,
          angle: angle * 180 / Math.PI,
          radius
        };
      };

      return {
        revision: this._geometryRevision,
        space,
        anchors: normalized.map(location => {
          const keys = location.kind === 'key'
            ? [location.value]
            : [...(this._keysByNote.get(location.value) || [])];
          return {
            at: { [location.kind]: location.value },
            points: keys.map(pointForKey).filter(Boolean)
          };
        })
      };
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      const property = name.replace(/-([a-z])/g, (_, character) => character.toUpperCase());
      if (property in this) this[property] = newValue;
    }

    connectedCallback() {
      if (this._connected) return;
      this._connected = true;
      this._setupObservers();
      this._scanLightDOM();
      Object.assign(this._dirty, {
        geometry: true,
        labels: true,
        patterns: true,
        transform: true,
        allKeyState: true,
        allIndicators: true,
        allOverlays: true,
        allProjectedLabels: true
      });
      this._invalidate(null, null, 'connect');
    }

    disconnectedCallback() {
      this._connected = false;
      if (this._renderRequest) {
        cancelAnimationFrame(this._renderRequest);
        this._renderRequest = 0;
      }
      this._cancelAllAnimations();
      this._mutationObserver?.disconnect();
      this._resizeObserver?.disconnect();
      this._mutationObserver = null;
      this._resizeObserver = null;
      this._frameTransform = null;
      for (const interaction of this._pointerInteractions.values()) this._dampEntry(interaction.entry);
      for (const interaction of this._keyboardInteractions.values()) this._dampEntry(interaction.entry);
      this._pointerInteractions.clear();
      this._keyboardInteractions.clear();
      disposeLilSynth(this);
      this._resolveRender();
    }

    _setFiniteGeometry(field, value, name, options = {}) {
      const next = finiteNumber(value, name);
      if (options.integer && !Number.isInteger(next)) throw new RangeError(`${name} must be an integer`);
      if (options.min != null && next < options.min) throw new RangeError(`${name} must be at least ${options.min}`);
      if (this[field] === next) return;
      this[field] = next;
      this._invalidate('geometry', null, name);
    }

    _setFiniteKeyData(field, value, name, options = {}) {
      const next = finiteNumber(value, name);
      if (options.min != null && next < options.min) throw new RangeError(`${name} must be at least ${options.min}`);
      if (this[field] === next) return;
      this[field] = next;
      this._invalidate('keyData', null, name);
    }

    _mapsEqual(left, right) {
      if (left === right) return true;
      if (!left || !right || left.size !== right.size) return false;
      for (const [key, value] of left) {
        if (!right.has(key) || right.get(key) !== value) return false;
      }
      return true;
    }

    _snapshotState() {
      return Object.fromEntries(
        Object.entries(STATE_FIELDS).map(([field, privateField]) => [field, new Set(this[privateField])])
      );
    }

    _collectDirtyStateKeys(dirty, snapshot) {
      for (const field of dirty.stateFields) {
        const previous = this._renderedState[field];
        const next = snapshot[field];
        const changedValues = new Set();
        for (const value of previous) {
          if (!next.has(value)) changedValues.add(value);
        }
        for (const value of next) {
          if (!previous.has(value)) changedValues.add(value);
        }
        if (field.endsWith('Keys')) {
          for (const key of changedValues) {
            if (this._keyElements.has(key)) dirty.keyState.add(key);
          }
        } else {
          for (const note of changedValues) {
            for (const key of this._keysByNote.get(note) || []) dirty.keyState.add(key);
          }
        }
      }
    }

    _commitRenderedState(snapshot, fields) {
      for (const field of fields) this._renderedState[field] = new Set(snapshot[field]);
    }

    _ensureRenderDeferred() {
      if (this._renderDeferred) return;
      let resolvePromise;
      const promise = new Promise(resolve => { resolvePromise = resolve; });
      this._renderDeferred = { promise, resolve: resolvePromise };
    }

    _resolveRender() {
      const deferred = this._renderDeferred;
      this._renderDeferred = null;
      deferred?.resolve();
    }

    _invalidate(kind, value, reason = kind) {
      if (reason) this._dirty.reasons.add(reason);
      if (kind === 'geometry') this._dirty.geometry = true;
      else if (kind === 'keyData') this._dirty.keyData = true;
      else if (kind === 'labels') this._dirty.labels = true;
      else if (kind === 'patterns') this._dirty.patterns = true;
      else if (kind === 'transform') this._dirty.transform = true;
      else if (kind === 'projectedLabels') this._dirty.projectedLabels.add(value);
      else if (kind === 'indicators') this._dirty.indicators.add(value);
      else if (kind === 'overlays') this._dirty.overlays.add(value);
      this._ensureRenderDeferred();
      if (!this._connected) {
        this._resolveRender();
        return;
      }
      if (this._renderRequest) return;
      this._renderRequest = requestAnimationFrame(timestamp => this._flushRender(timestamp));
    }

    _takeDirty() {
      const dirty = this._dirty;
      this._dirty = createDirtyState();
      return dirty;
    }

    _createStats(dirty, timestamp) {
      return {
        reason: [...dirty.reasons].join(','),
        dirtyKeys: dirty.allKeyState ? this._keyElements.size : dirty.keyState.size,
        dirtyIndicators: dirty.allIndicators ? this._indicatorRegistry.size : dirty.indicators.size,
        dirtyOverlays: dirty.allOverlays ? this._overlayRegistry.size : dirty.overlays.size,
        dirtyLabels: dirty.allProjectedLabels ? this._labelRegistry.size : dirty.projectedLabels.size,
        geometryReads: 0,
        domWrites: 0,
        keyVisits: 0,
        keyDataVisits: 0,
        nodeAdditions: 0,
        nodeRemovals: 0,
        scheduledFrames: 1,
        startedAt: timestamp,
        durationMs: 0
      };
    }

    _flushRender(timestamp = performance.now()) {
      this._renderRequest = 0;
      if (!this._connected) {
        this._resolveRender();
        return;
      }

      const dirty = this._takeDirty();
      const stateSnapshot = dirty.geometry || dirty.allKeyState || dirty.stateFields.size > 0
        ? this._snapshotState()
        : null;
      if (!dirty.geometry && !dirty.allKeyState && stateSnapshot) {
        this._collectDirtyStateKeys(dirty, stateSnapshot);
      }
      const stats = this._createStats(dirty, timestamp);
      const startedAt = performance.now();

      try {
        if (dirty.patterns) {
          this._refreshOverlayPatterns(stats);
          dirty.allOverlays = true;
        }
        for (const element of dirty.indicatorElements) this._syncDeclarativeIndicator(element, dirty.indicators);
        for (const element of dirty.overlayElements) this._syncDeclarativeOverlay(element, dirty.overlays);
        if (dirty.geometry) {
          this._renderGeometry(stats);
          dirty.labels = true;
          dirty.allProjectedLabels = true;
          dirty.allKeyState = true;
          dirty.allIndicators = true;
          dirty.allOverlays = true;
          dirty.transform = true;
        }
        if (dirty.keyData && !dirty.geometry) this._renderKeyData(stats);
        if (dirty.transform) this._frameTransform = null;
        stats.dirtyKeys = dirty.allKeyState ? this._keyElements.size : dirty.keyState.size;
        stats.dirtyIndicators = dirty.allIndicators ? this._indicatorRegistry.size : dirty.indicators.size;
        stats.dirtyOverlays = dirty.allOverlays ? this._overlayRegistry.size : dirty.overlays.size;
        stats.dirtyLabels = dirty.allProjectedLabels ? this._labelRegistry.size : dirty.projectedLabels.size;

        const indicatorIds = dirty.allIndicators
          ? new Set(this._indicatorRegistry.keys())
          : dirty.indicators;
        const placements = this._calculateIndicatorPlacements(indicatorIds, stats);

        if (dirty.allKeyState) this._applyKeyStates(this._keyElements.keys(), stats, stateSnapshot);
        else if (dirty.keyState.size) this._applyKeyStates(dirty.keyState, stats, stateSnapshot);
        if (stateSnapshot) {
          this._commitRenderedState(
            stateSnapshot,
            dirty.allKeyState ? Object.keys(STATE_FIELDS) : dirty.stateFields
          );
        }
        if (dirty.labels) this._renderBuiltinLabels(stats);
        this._renderProjectedLabels(
          dirty.allProjectedLabels ? new Set(this._labelRegistry.keys()) : dirty.projectedLabels,
          stats
        );
        this._renderOverlays(dirty.allOverlays ? new Set(this._overlayRegistry.keys()) : dirty.overlays, stats);
        this._applyIndicatorPlacements(placements, stats);
      } catch (error) {
        this._reportRenderError(error, { reasons: [...dirty.reasons] });
      }

      stats.durationMs = performance.now() - startedAt;
      delete stats.startedAt;
      if (typeof this.onRenderStats === 'function') {
        try { this.onRenderStats(Object.freeze({ ...stats })); }
        catch (error) { this._reportRenderError(error, { phase: 'onRenderStats' }); }
      }

      if (hasDirtyWork(this._dirty)) {
        this._invalidate(null, null, 'followup');
      } else {
        this._resolveRender();
      }
    }

    _setupDOM() {
      const style = document.createElement('style');
      style.textContent = css;
      const container = document.createElement('div');
      container.className = 'keyboard-container';
      container.setAttribute('role', 'application');
      container.setAttribute('aria-label', 'Musical keyboard');

      const svg = svgEl('svg', { width: '100%', role: 'group', 'aria-label': 'Piano keys' });
      const group = svgEl('g');
      const defs = svgEl('defs');
      const lowerGroup = svgEl('g', { class: 'key-layer key-layer--lower' });
      const upperGroup = svgEl('g', { class: 'key-layer key-layer--upper' });
      const overlayGroup = svgEl('g', { class: 'overlay-group' });
      const labelGroup = svgEl('g', { class: 'label-group' });
      group.append(defs, lowerGroup, upperGroup, overlayGroup, labelGroup);
      svg.append(group);
      container.append(svg);

      const indicatorContainer = document.createElement('div');
      indicatorContainer.className = 'indicator-container';
      indicatorContainer.append(document.createElement('slot'));
      container.append(indicatorContainer);

      const patternSlot = document.createElement('slot');
      patternSlot.name = 'overlay-pattern';
      patternSlot.hidden = true;
      patternSlot.addEventListener('slotchange', () => this._invalidate('patterns', null, 'patternSlot'));
      container.append(patternSlot);
      this.shadowRoot.append(style, container);

      this._svg = svg;
      this._g = group;
      this._defs = defs;
      this._lowerGroup = lowerGroup;
      this._upperGroup = upperGroup;
      this._overlayGroup = overlayGroup;
      this._labelGroup = labelGroup;
      this._container = container;
      this._indicatorContainer = indicatorContainer;
      this._patternSlot = patternSlot;
      this._setupEventDelegation();
    }

    _setupObservers() {
      this._mutationObserver = new MutationObserver(records => {
        for (const mutation of records) {
          if (mutation.type === 'childList' && mutation.target === this) {
            for (const node of mutation.removedNodes) {
              if (node instanceof Element) this._unregisterLightDOMElement(node);
            }
            for (const node of mutation.addedNodes) {
              if (node instanceof Element && !this._ownedIndicatorElements.has(node)) {
                this._routeLightDOMElement(node);
              }
            }
          } else if (mutation.type === 'attributes' && mutation.target.parentElement === this) {
            if (INDICATOR_ATTRIBUTES.has(mutation.attributeName)) {
              this._dirty.indicatorElements.add(mutation.target);
            }
            if (OVERLAY_ATTRIBUTES.has(mutation.attributeName)) {
              this._dirty.overlayElements.add(mutation.target);
            }
            if (mutation.attributeName === 'slot') this._dirty.patterns = true;
          }
        }
        if (hasDirtyWork(this._dirty)) this._invalidate(null, null, 'lightDOM');
      });
      this._mutationObserver.observe(this, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [...INDICATOR_ATTRIBUTES, ...OVERLAY_ATTRIBUTES, 'slot']
      });

      this._resizeObserver = new ResizeObserver(entries => {
        const rect = entries[0]?.contentRect;
        const nextSize = rect ? `${rect.width}:${rect.height}` : null;
        if (nextSize === this._lastResizeSize) return;
        this._lastResizeSize = nextSize;
        this._frameTransform = null;
        if (this._indicatorRegistry.size > 0) {
          this._dirty.allIndicators = true;
          this._invalidate('transform', null, 'resize');
        }
      });
      this._resizeObserver.observe(this);
    }

    _scanLightDOM() {
      for (const child of this.children) {
        if (!this._ownedIndicatorElements.has(child)) this._routeLightDOMElement(child);
      }
    }

    _routeLightDOMElement(element) {
      if (element.hasAttribute('data-pitch') || element.hasAttribute('data-key')) {
        this._dirty.indicatorElements.add(element);
      }
      if (element.hasAttribute('data-key-overlay')) this._dirty.overlayElements.add(element);
      if (element.slot === 'overlay-pattern') this._dirty.patterns = true;
    }

    _unregisterLightDOMElement(element) {
      const indicatorId = this._indicatorElementIds.get(element);
      if (indicatorId) {
        this._indicatorRegistry.delete(indicatorId);
        this._dirty.indicators.add(indicatorId);
        this._indicatorElementIds.delete(element);
        this._clearIndicatorPlacement(element);
      }
      const overlayId = this._overlayElementIds.get(element);
      if (overlayId) {
        if (this._overlayRegistry.get(overlayId)?.sourceElement === element) {
          this._overlayRegistry.delete(overlayId);
        }
        this._dirty.overlays.add(overlayId);
        this._overlayElementIds.delete(element);
      }
      if (element.slot === 'overlay-pattern') this._dirty.patterns = true;
    }

    _syncDeclarativeIndicator(element, dirtyIds = this._dirty.indicators) {
      let id = this._indicatorElementIds.get(element);
      const hasPitch = element.hasAttribute('data-pitch');
      const hasKey = element.hasAttribute('data-key');
      if (!hasPitch && !hasKey) {
        if (id) {
          this._indicatorRegistry.delete(id);
          dirtyIds.add(id);
          this._indicatorElementIds.delete(element);
          this._clearIndicatorPlacement(element);
        }
        return;
      }
      if (!id) {
        id = `declarative-indicator:${this._nextIndicatorElementId++}`;
        this._indicatorElementIds.set(element, id);
      }
      const parsedPitch = Number.parseFloat(element.dataset.pitch);
      const at = hasKey
        ? { kind: 'key', value: Number.parseInt(element.dataset.key, 10) }
        : { kind: 'pitch', value: Number.isFinite(parsedPitch) ? parsedPitch : 0 };
      if (!Number.isFinite(at.value)) return;
      const radiusValue = element.hasAttribute('data-radius') ? Number.parseFloat(element.dataset.radius) : null;
      const waveNumber = Number.parseFloat(element.dataset.waveNumber);
      const waveAmplitude = Number.parseFloat(element.dataset.waveAmplitude);
      const wavePhase = Number.parseFloat(element.dataset.wavePhase);
      const wave = element.hasAttribute('data-wave-number') ? {
        number: Number.isFinite(waveNumber) ? waveNumber : 1,
        amplitude: Number.isFinite(waveAmplitude) ? waveAmplitude : 0.2,
        phase: Number.isFinite(wavePhase) ? wavePhase : 0
      } : null;
      const next = {
        id,
        at,
        radius: Number.isFinite(radiusValue) ? radiusValue : null,
        wave,
        element,
        owned: false,
        sourceElement: element
      };
      if (!indicatorSpecsEqual(this._indicatorRegistry.get(id), next)) {
        this._indicatorRegistry.set(id, next);
        dirtyIds.add(id);
      }
    }

    _syncDeclarativeOverlay(element, dirtyIds = this._dirty.overlays) {
      let id = this._overlayElementIds.get(element);
      if (!element.hasAttribute('data-key-overlay')) {
        if (id) {
          this._overlayRegistry.delete(id);
          dirtyIds.add(id);
          this._overlayElementIds.delete(element);
        }
        return;
      }
      const requestedId = element.dataset.overlayId
        ? `declarative-overlay:${element.dataset.overlayId}`
        : null;
      if (id && requestedId && requestedId !== id) {
        if (this._overlayRegistry.get(id)?.sourceElement === element) {
          this._overlayRegistry.delete(id);
        }
        dirtyIds.add(id);
        id = requestedId;
        this._overlayElementIds.set(element, id);
      } else if (!id) {
        id = requestedId ?? `declarative-overlay:${this._nextOverlayElementId++}`;
        this._overlayElementIds.set(element, id);
      }
      const key = Number.parseInt(element.dataset.keyOverlay, 10);
      if (!Number.isFinite(key)) return;
      const patterns = element.dataset.overlayPattern
        ? element.dataset.overlayPattern.split(',').map(value => value.trim()).filter(Boolean)
        : [];
      const next = { id, at: { kind: 'key', value: key }, patterns, sourceElement: element };
      if (!overlaySpecsEqual(this._overlayRegistry.get(id), next)) {
        this._overlayRegistry.set(id, next);
        dirtyIds.add(id);
      }
    }

    _normalizeOverlaySpec(spec) {
      if (!spec || typeof spec !== 'object') throw new TypeError('Overlay spec must be an object');
      const id = String(spec.id ?? '');
      if (!id) throw new TypeError('Overlay id must not be empty');
      const at = normalizeLocation(spec.at, ['key', 'note']);
      this._validateOverlayLocation(at);
      let patterns = [];
      if (spec.patterns != null) {
        if (typeof spec.patterns === 'string' || typeof spec.patterns[Symbol.iterator] !== 'function') {
          throw new TypeError('Overlay patterns must be an iterable of pattern ids');
        }
        patterns = [...spec.patterns].map(pattern => String(pattern));
        if (patterns.some(pattern => !pattern)) throw new TypeError('Overlay pattern ids must not be empty');
        const unknown = patterns.filter(pattern => !this._isKnownOverlayPattern(pattern));
        if (unknown.length) throw new RangeError(`Unknown overlay pattern: ${unknown.join(', ')}`);
      }
      return { id, at, patterns, sourceElement: null };
    }

    _normalizeLabelSpec(spec) {
      if (!spec || typeof spec !== 'object') throw new TypeError('Label spec must be an object');
      const id = String(spec.id ?? '');
      if (!id) throw new TypeError('Label id must not be empty');
      const at = normalizeLocation(spec.at, ['key', 'note']);
      this._validateKeyOrNoteLocation(at, 'Label');
      if (!Object.prototype.hasOwnProperty.call(spec, 'text')) {
        throw new TypeError('Label text is required');
      }
      return {
        id,
        at,
        text: String(spec.text),
        ariaLabel: spec.ariaLabel == null ? null : String(spec.ariaLabel),
        className: spec.className == null ? '' : String(spec.className)
      };
    }

    _normalizeIndicatorSpec(id, spec) {
      const normalizedId = id == null ? '' : String(id);
      if (!normalizedId) throw new TypeError('Indicator id must not be empty');
      if (!spec || typeof spec !== 'object') throw new TypeError('Indicator spec must be an object');
      const previous = this._indicatorRegistry.get(normalizedId);
      const element = spec.element ?? previous?.element ?? document.createElement('span');
      if (!(element instanceof HTMLElement)) throw new TypeError('Indicator element must be an HTMLElement');
      const normalized = {
        id: normalizedId,
        at: normalizeLocation(spec.at, ['pitch', 'key']),
        radius: spec.radius == null ? null : finiteNumber(spec.radius, 'radius'),
        wave: normalizeWave(spec.wave),
        element,
        owned: spec.element == null && (previous?.owned ?? true),
        sourceElement: null
      };
      this._validateIndicatorLocation(normalized.at);
      return normalized;
    }

    _validateOverlayLocation(at) {
      this._validateKeyOrNoteLocation(at, 'Overlay');
    }

    _validateKeyOrNoteLocation(at, subject) {
      if (at.kind === 'key') {
        if (!Number.isInteger(at.value)) throw new RangeError(`${subject} key must be an integer`);
        const last = this._leftmostKey + this._octaves * this._notesInOctave - 1;
        if (at.value < this._leftmostKey || at.value > last) {
          throw new RangeError(`${subject} key must be between ${this._leftmostKey} and ${last}`);
        }
      } else if (!Number.isInteger(at.value) || at.value < 0 || at.value >= this._notesInOctave) {
        throw new RangeError(`${subject} note must be an integer between 0 and ${this._notesInOctave - 1}`);
      }
    }

    _isKnownOverlayPattern(id) {
      if (this._overlayPatternIds.has(id)) return true;
      for (const child of this.children) {
        if (child.slot !== 'overlay-pattern') continue;
        if (child.id === id && child.tagName.toLowerCase() === 'pattern') return true;
        for (const pattern of child.querySelectorAll('pattern')) {
          if (pattern.id === id) return true;
        }
      }
      return false;
    }

    _validateIndicatorLocation(at) {
      if (at.kind !== 'key') return;
      if (!Number.isInteger(at.value)) throw new RangeError('Indicator key must be an integer');
      const last = this._leftmostKey + this._octaves * this._notesInOctave - 1;
      if (at.value < this._leftmostKey || at.value > last) {
        throw new RangeError(`Indicator key must be between ${this._leftmostKey} and ${last}`);
      }
    }

    _refreshOverlayPatterns(stats) {
      for (const clone of this._overlayPatternClones) {
        clone.remove();
        stats.domWrites++;
        stats.nodeRemovals++;
      }
      this._overlayPatternClones = [];
      this._overlayPatternIds.clear();

      for (const assigned of this._patternSlot.assignedElements()) {
        const patterns = assigned.tagName.toLowerCase() === 'pattern'
          ? [assigned]
          : [...assigned.querySelectorAll('pattern')];
        for (const source of patterns) {
          const clone = source.cloneNode(true);
          const id = clone.id || `user-overlay-pattern-${this._overlayPatternClones.length}`;
          if (this._overlayPatternIds.has(id)) continue;
          clone.id = id;
          this._overlayPatternIds.add(id);
          this._overlayPatternClones.push(clone);
          this._defs.append(clone);
          stats.domWrites++;
          stats.nodeAdditions++;
        }
      }
      this._overlayPatternId = this._overlayPatternClones[0]?.id ?? null;
    }

    _renderGeometry(stats) {
      this._geometryRevision++;
      this._frameTransform = null;
      const outerRadius = (this._width - SVGStrokePadding * 2) /
        (2 * Math.sin(Math.min(this._sweep, Math.PI) / 2));
      const chordLength = outerRadius * 2 * Math.sin(this._sweep / 2);
      const innerRadius = outerRadius - this._depth;
      const startAngle = -this._sweep / 2;
      const endAngle = this._sweep / 2;
      let height;
      if (this._sweep > Math.PI) {
        height = outerRadius + Math.sqrt(Math.max(0, outerRadius ** 2 - (chordLength / 2) ** 2));
      } else {
        height = outerRadius - Math.sqrt(Math.max(0, outerRadius ** 2 - (chordLength / 2) ** 2)) +
          this._depth * Math.cos(this._sweep / 2);
      }
      height += SVGStrokePadding;

      this._setAttribute(this._svg, 'viewBox', `0 0 ${this._width} ${height}`, stats);
      this._setAttribute(this._g, 'transform', `translate(${this._width / 2}, ${outerRadius + SVGStrokePadding / 2})`, stats);
      this._geometry = {
        cx: this._width / 2,
        cy: outerRadius + SVGStrokePadding / 2,
        innerRadius,
        outerRadius,
        startAngle,
        endAngle
      };

      const raisedOffset = this._depth / (Math.tan(this._overlapping * Math.PI / 2) + 2);
      const drawArc = arc().cornerRadius(2)
        .innerRadius(data => data.raised ? innerRadius + raisedOffset : innerRadius)
        .outerRadius(data => data.raised ? outerRadius : outerRadius - raisedOffset);
      this._drawArc = drawArc;
      const keys = keyLayout()
        .octaves(this._octaves)
        .leftmostKey(this._leftmostKey)
        .baseTone(this._baseTone)
        .baseKey(this._baseKey)
        .frequency(this._frequencyProvider)
        .raisedPattern(this._raisedNotes)
        .startAngle(startAngle)
        .endAngle(endAngle)
        .octaveSize(this._notesInOctave)
        .pie(this._pie)();
      const currentIndices = new Set(keys.map(data => data.index));

      for (const [index, entry] of this._keyElements) {
        if (currentIndices.has(index)) continue;
        this._cancelKeyAnimation(index);
        releaseLilSynthKey(this, entry.el);
        entry.el.remove();
        entry.textEl.remove();
        this._keyElements.delete(index);
        this._currentParams.delete(index);
        stats.domWrites += 2;
        stats.nodeRemovals += 2;
      }

      const toParams = data => ({
        startAngle: data.startAngle,
        endAngle: data.endAngle,
        innerRadius: data.raised ? innerRadius + raisedOffset : innerRadius,
        outerRadius: data.raised ? outerRadius : outerRadius - raisedOffset,
        raised: data.raised
      });

      for (const data of keys) {
        const params = toParams(data);
        let entry = this._keyElements.get(data.index);
        if (!entry) {
          entry = this._createKey(data, params, drawArc, stats);
        } else {
          const previousParams = this._keyAnimations.get(data.index)?.current ||
            this._currentParams.get(data.index) || params;
          const targetLayer = data.raised ? this._upperGroup : this._lowerGroup;
          if (entry.el.parentNode !== targetLayer) {
            targetLayer.append(entry.el);
            stats.domWrites++;
          }
          this._toggleClass(entry.el, 'key--modulating', data.raised !== entry.data.raised, stats);
          this._toggleClass(entry.el, 'key--lower', !data.raised, stats);
          this._toggleClass(entry.el, 'key--upper', data.raised, stats);
          this._toggleClass(entry.textEl, 'key-label--lower', !data.raised, stats);
          this._toggleClass(entry.textEl, 'key-label--upper', data.raised, stats);
          this._setAttribute(entry.el, 'aria-label', `${this._getNoteName(data.note)} key`, stats);

          if (!paramsEqual(previousParams, params) && this._shouldAnimateGeometry()) {
            this._animateKey(data.index, entry, previousParams, params, drawArc);
          } else {
            this._cancelKeyAnimation(data.index);
            this._setAttribute(entry.el, 'd', drawArc(params), stats);
            const centroid = arcCentroid(params);
            this._setAttribute(entry.textEl, 'x', centroid.x, stats);
            this._setAttribute(entry.textEl, 'y', centroid.y, stats);
            this._toggleClass(entry.el, 'key--modulating', false, stats);
          }
          entry.data = data;
        }
        this._currentParams.set(data.index, params);
      }
      this._keysByNote.clear();
      for (const [index, entry] of this._keyElements) {
        const indices = this._keysByNote.get(entry.data.note) || new Set();
        indices.add(index);
        this._keysByNote.set(entry.data.note, indices);
      }
    }

    _renderKeyData(stats) {
      const notes = Array.from({ length: this._notesInOctave }, (_, note) => note);
      for (const [key, entry] of this._keyElements) {
        entry.data.frequency = resolveKeyFrequency(this._frequencyProvider, key, {
          note: entry.data.note,
          offset: key - this._leftmostKey,
          notes,
          notesInOctave: this._notesInOctave,
          baseTone: this._baseTone,
          baseKey: this._baseKey
        });
        stats.keyDataVisits = (stats.keyDataVisits || 0) + 1;
      }
    }

    _createKey(data, params, drawArc, stats) {
      const element = svgEl('path', {
        class: `key ${data.raised ? 'key--upper' : 'key--lower'}`,
        d: drawArc(params),
        tabindex: '0',
        role: 'button',
        'aria-label': `${this._getNoteName(data.note)} key`,
        'aria-pressed': 'false',
        'data-key-index': data.index
      });
      const centroid = arcCentroid(params);
      const textElement = svgEl('text', {
        class: `key-label ${data.raised ? 'key-label--upper' : 'key-label--lower'}`,
        x: centroid.x,
        y: centroid.y,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        'pointer-events': 'none'
      });
      textElement.textContent = this._getLabelText(data);
      textElement.style.display = this._keyLabels ? '' : 'none';
      (data.raised ? this._upperGroup : this._lowerGroup).append(element);
      this._labelGroup.append(textElement);
      const entry = {
        el: element,
        textEl: textElement,
        data,
        visualState: { pressed: false, lit: false, hovered: false }
      };
      this._keyElements.set(data.index, entry);
      stats.domWrites += 2;
      stats.nodeAdditions += 2;
      return entry;
    }

    _shouldAnimateGeometry() {
      return this._transitionTime > 0 &&
        !matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    _animateKey(index, entry, from, to, drawArc) {
      this._cancelKeyAnimation(index);
      this._keyAnimations.set(index, {
        entry,
        from,
        to,
        current: from,
        drawArc,
        startedAt: performance.now(),
        duration: this._transitionTime
      });
      if (!this._animationRequest) {
        this._animationRequest = requestAnimationFrame(now => this._tickKeyAnimations(now));
      }
    }

    _tickKeyAnimations(now) {
      this._animationRequest = 0;
      if (!this._connected) return;
      for (const [index, animation] of this._keyAnimations) {
        const { entry, from, to, drawArc, startedAt, duration } = animation;
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        const current = {
          startAngle: lerp(from.startAngle, to.startAngle, eased),
          endAngle: lerp(from.endAngle, to.endAngle, eased),
          innerRadius: lerp(from.innerRadius, to.innerRadius, eased),
          outerRadius: lerp(from.outerRadius, to.outerRadius, eased),
          raised: to.raised
        };
        animation.current = current;
        const path = drawArc(current);
        entry.el.setAttribute('d', path);
        const centroid = arcCentroid(current);
        entry.textEl.setAttribute('x', centroid.x);
        entry.textEl.setAttribute('y', centroid.y);
        for (const rendered of this._labelElements.values()) {
          const label = rendered.get(index);
          if (!label) continue;
          label.setAttribute('x', centroid.x);
          label.setAttribute('y', centroid.y);
        }
        for (const overlayId of this._overlayByKey.get(index) || []) {
          for (const overlayPath of this._overlayElements.get(overlayId)?.get(index) || []) {
            overlayPath.setAttribute('d', path);
          }
        }
        if (progress >= 1) {
          entry.el.classList.remove('key--modulating');
          this._keyAnimations.delete(index);
        }
      }
      if (this._keyAnimations.size > 0) {
        this._animationRequest = requestAnimationFrame(next => this._tickKeyAnimations(next));
      }
    }

    _cancelKeyAnimation(index) {
      this._keyAnimations.delete(index);
      if (this._keyAnimations.size === 0 && this._animationRequest) {
        cancelAnimationFrame(this._animationRequest);
        this._animationRequest = 0;
      }
    }

    _cancelAllAnimations() {
      if (this._animationRequest) cancelAnimationFrame(this._animationRequest);
      this._animationRequest = 0;
      this._keyAnimations.clear();
    }

    _applyKeyStates(indices, stats, state = this._snapshotState()) {
      for (const index of indices) {
        const entry = this._keyElements.get(Number(index));
        if (!entry) continue;
        stats.keyVisits++;
        const note = entry.data.note;
        const next = {
          pressed: state.pressedKeys.has(Number(index)) || state.pressedNotes.has(note),
          lit: state.litKeys.has(Number(index)) || state.litNotes.has(note),
          hovered: state.hoveredKeys.has(Number(index)) || state.hoveredNotes.has(note)
        };
        if (next.pressed !== entry.visualState.pressed) {
          this._toggleClass(entry.el, 'key--pressed', next.pressed, stats);
          this._setAttribute(entry.el, 'aria-pressed', next.pressed ? 'true' : 'false', stats);
        }
        if (next.lit !== entry.visualState.lit) this._toggleClass(entry.el, 'key--highlight', next.lit, stats);
        if (next.hovered !== entry.visualState.hovered) this._toggleClass(entry.el, 'key--hover', next.hovered, stats);
        entry.visualState = next;
      }
    }

    _renderBuiltinLabels(stats) {
      for (const entry of this._keyElements.values()) {
        const text = this._getLabelText(entry.data);
        if (entry.textEl.textContent !== text) {
          entry.textEl.textContent = text;
          stats.domWrites++;
        }
        const display = this._keyLabels ? '' : 'none';
        if (entry.textEl.style.display !== display) {
          entry.textEl.style.display = display;
          stats.domWrites++;
        }
      }
    }

    _resolveLabelKeys(spec) {
      if (spec.at.kind === 'key') return this._keyElements.has(spec.at.value) ? [spec.at.value] : [];
      return [...(this._keysByNote.get(spec.at.value) || [])];
    }

    _renderProjectedLabels(ids, stats) {
      if (ids.size === 0) return;
      const affectedKeys = new Set();
      for (const id of ids) {
        const spec = this._labelRegistry.get(id);
        const rendered = this._labelElements.get(id) || new Map();
        for (const key of rendered.keys()) affectedKeys.add(key);
        if (!spec) {
          for (const element of rendered.values()) {
            element.remove();
            stats.domWrites++;
            stats.nodeRemovals++;
          }
          this._labelElements.delete(id);
          continue;
        }

        const desiredKeys = new Set(this._resolveLabelKeys(spec));
        for (const key of desiredKeys) affectedKeys.add(key);
        const reusable = [];
        for (const [key, element] of rendered) {
          if (desiredKeys.has(key)) continue;
          rendered.delete(key);
          reusable.push(element);
        }

        for (const key of desiredKeys) {
          const params = this._currentParams.get(key);
          if (!params) continue;
          let element = rendered.get(key);
          if (!element) {
            element = reusable.shift();
            if (!element) {
              element = svgEl('text', {
                'text-anchor': 'middle',
                'dominant-baseline': 'central',
                'pointer-events': 'none',
                part: 'label annotation-label'
              });
              element.id = `aak-label-${this._nextLabelElementId++}`;
              this._labelGroup.append(element);
              stats.domWrites++;
              stats.nodeAdditions++;
            }
          }
          const centroid = arcCentroid(params);
          this._setAttribute(element, 'class', `annotation-label${spec.className ? ` ${spec.className}` : ''}`, stats);
          this._setAttribute(element, 'data-label-id', id, stats);
          this._setAttribute(element, 'data-key-index', key, stats);
          this._setAttribute(element, 'x', centroid.x, stats);
          this._setAttribute(element, 'y', centroid.y, stats);
          if (spec.ariaLabel == null) {
            if (element.hasAttribute('aria-label')) {
              element.removeAttribute('aria-label');
              stats.domWrites++;
            }
          } else {
            this._setAttribute(element, 'aria-label', spec.ariaLabel, stats);
          }
          if (element.textContent !== spec.text) {
            element.textContent = spec.text;
            stats.domWrites++;
          }
          element._geometryRevision = this._geometryRevision;
          rendered.set(key, element);
        }
        for (const element of reusable) {
          element.remove();
          stats.domWrites++;
          stats.nodeRemovals++;
        }
        this._labelElements.set(id, rendered);
      }
      this._syncProjectedLabelAria(affectedKeys, stats);
    }

    _syncProjectedLabelAria(keys, stats) {
      for (const key of keys) {
        const entry = this._keyElements.get(key);
        if (!entry) continue;
        const ids = [];
        for (const rendered of this._labelElements.values()) {
          const element = rendered.get(key);
          if (element) ids.push(element.id);
        }
        const description = ids.join(' ') || null;
        if (description == null) {
          if (entry.el.hasAttribute('aria-describedby')) {
            entry.el.removeAttribute('aria-describedby');
            stats.domWrites++;
          }
        } else {
          this._setAttribute(entry.el, 'aria-describedby', description, stats);
        }
      }
    }

    _getNoteName(noteNumber) {
      const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const octave = Math.floor(noteNumber / this._notesInOctave);
      const note = ((noteNumber % this._notesInOctave) + this._notesInOctave) % this._notesInOctave;
      return `${names[note] || `Note ${note}`}${octave}`;
    }

    _getLabelText(data) {
      if (this._keyLabelsMap?.has(data.index)) return String(this._keyLabelsMap.get(data.index));
      if (typeof this._labelFormat === 'function') return String(this._labelFormat(data));
      if (this._labelFormat === 'index') return String(data.index);
      if (this._labelFormat === 'pitch') {
        const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return names[data.note % this._notesInOctave] || String(data.note % this._notesInOctave);
      }
      return this._getNoteName(data.note);
    }

    _resolveOverlayKeys(spec) {
      if (spec.at.kind === 'key') return this._keyElements.has(spec.at.value) ? [spec.at.value] : [];
      return [...(this._keysByNote.get(spec.at.value) || [])];
    }

    _renderOverlays(ids, stats) {
      for (const id of ids) {
        const spec = this._overlayRegistry.get(id);
        const rendered = this._overlayElements.get(id) || new Map();
        if (!spec) {
          this._removeRenderedOverlay(id, rendered, stats);
          continue;
        }
        const desiredKeys = new Set(this._resolveOverlayKeys(spec));
        const patternIds = (spec.patterns.length ? spec.patterns : [this._overlayPatternId])
          .filter(patternId => patternId && this._overlayPatternIds.has(patternId));
        const reusablePaths = [];

        for (const [key, paths] of rendered) {
          if (desiredKeys.has(key) && patternIds.length) continue;
          reusablePaths.push(...paths);
          rendered.delete(key);
          const idsAtKey = this._overlayByKey.get(key);
          idsAtKey?.delete(id);
          if (idsAtKey?.size === 0) this._overlayByKey.delete(key);
        }

        if (!patternIds.length) {
          for (const path of reusablePaths) {
            path.remove();
            stats.domWrites++;
            stats.nodeRemovals++;
          }
          if (rendered.size === 0) this._overlayElements.delete(id);
          continue;
        }

        for (const key of desiredKeys) {
          const keyEntry = this._keyElements.get(key);
          if (!keyEntry) continue;
          let paths = rendered.get(key) || [];
          for (let index = 0; index < patternIds.length; index++) {
            let path = paths[index];
            if (!path) {
              path = reusablePaths.shift();
              if (path) path._geometryRevision = -1;
            }
            if (!path) {
              path = svgEl('path', {
                  class: 'key-overlay',
                  stroke: 'rgba(255, 255, 255, 0.5)',
                  'stroke-width': '3',
                  'pointer-events': 'none'
                });
              paths[index] = path;
              this._overlayGroup.append(path);
              stats.domWrites++;
              stats.nodeAdditions++;
            } else {
              paths[index] = path;
            }
            this._setAttribute(path, 'fill', `url(#${patternIds[index]})`, stats);
            if (path._geometryRevision !== this._geometryRevision) {
              this._setAttribute(path, 'd', keyEntry.el.getAttribute('d'), stats);
              path._geometryRevision = this._geometryRevision;
            }
          }
          while (paths.length > patternIds.length) {
            paths.pop().remove();
            stats.domWrites++;
            stats.nodeRemovals++;
          }
          rendered.set(key, paths);
          const idsAtKey = this._overlayByKey.get(key) || new Set();
          idsAtKey.add(id);
          this._overlayByKey.set(key, idsAtKey);
        }
        for (const path of reusablePaths) {
          path.remove();
          stats.domWrites++;
          stats.nodeRemovals++;
        }
        this._overlayElements.set(id, rendered);
      }
    }

    _removeRenderedOverlay(id, rendered, stats) {
      for (const [key, paths] of rendered) {
        for (const path of paths) {
          path.remove();
          stats.domWrites++;
          stats.nodeRemovals++;
        }
        const idsAtKey = this._overlayByKey.get(key);
        idsAtKey?.delete(id);
        if (idsAtKey?.size === 0) this._overlayByKey.delete(key);
      }
      this._overlayElements.delete(id);
    }

    _calculateIndicatorPlacements(ids, stats) {
      if (ids.size === 0) return [];
      const activeIds = [...ids].filter(id => this._indicatorRegistry.has(id));
      if (activeIds.length === 0) return [];
      const frame = this._readFrameTransform(stats);
      if (!frame) return [];
      const config = {
        octaves: this._octaves,
        notesInOctave: this._notesInOctave,
        leftmostKey: this._leftmostKey,
        sweep: this._sweep
      };
      return activeIds.map(id => {
        const spec = this._indicatorRegistry.get(id);
        return { id, spec, placement: calculateIndicatorPlacement(spec, this._geometry, this._currentParams, frame, config) };
      });
    }

    _readFrameTransform(stats) {
      if (this._frameTransform) return this._frameTransform;
      const ctm = this._g.getScreenCTM();
      stats.geometryReads++;
      if (!ctm) return null;
      const hostRect = this.getBoundingClientRect();
      stats.geometryReads++;
      this._frameTransform = {
        ctm: { a: ctm.a, b: ctm.b, c: ctm.c, d: ctm.d, e: ctm.e, f: ctm.f },
        hostRect: { left: hostRect.left, top: hostRect.top }
      };
      return this._frameTransform;
    }

    _applyIndicatorPlacements(calculated, stats) {
      for (const { spec, placement } of calculated) {
        if (!placement) continue;
        const element = spec.element;
        this._setIndicatorPlacementStyles(element, placement, stats);
        this._setAttribute(element, 'data-positioned', '', stats);
      }
    }

    _unmanagedIndicatorStyle(element) {
      const declarations = [];
      for (const property of element.style) {
        if (INDICATOR_STYLE_PROPERTIES.has(property)) continue;
        const value = element.style.getPropertyValue(property);
        const priority = element.style.getPropertyPriority(property);
        declarations.push(`${property}: ${value}${priority ? ' !important' : ''};`);
      }
      return declarations.join(' ');
    }

    _setIndicatorPlacementStyles(element, placement, stats) {
      const currentCssText = element.style.cssText;
      const previous = this._indicatorStyleState.get(element);
      const base = previous && currentCssText === previous.appliedCssText
        ? previous.base
        : this._unmanagedIndicatorStyle(element);
      const valuesKey = [
        placement.x, placement.y, placement.angle, placement.pitch,
        placement.radius, placement.visible, placement.waveOffset, placement.wavePosition
      ].join('|');
      if (previous && currentCssText === previous.appliedCssText && previous.valuesKey === valuesKey) return;

      const declarations = [
        base,
        `--indicator-x: ${placement.x}px;`,
        `--indicator-y: ${placement.y}px;`,
        `--indicator-angle: ${placement.angle}deg;`,
        `--indicator-pitch: ${placement.pitch};`,
        `--indicator-radius: ${placement.radius};`,
        `--indicator-visible: ${placement.visible ? 1 : 0};`
      ];
      if (!placement.visible) declarations.push('opacity: 0;', 'pointer-events: none;');
      if (placement.waveOffset != null) {
        declarations.push(
          `--indicator-wave-offset: ${placement.waveOffset};`,
          `--indicator-wave-phase: ${placement.wavePosition};`
        );
      }
      element.style.cssText = declarations.filter(Boolean).join(' ');
      this._indicatorStyleState.set(element, {
        base,
        valuesKey,
        appliedCssText: element.style.cssText
      });
      stats.domWrites++;
    }

    _clearIndicatorPlacement(element) {
      const previous = this._indicatorStyleState.get(element);
      const base = previous && element.style.cssText === previous.appliedCssText
        ? previous.base
        : this._unmanagedIndicatorStyle(element);
      element.style.cssText = base;
      this._indicatorStyleState.delete(element);
      element.removeAttribute('data-positioned');
    }

    _setupEventDelegation() {
      const keyFromEvent = event => {
        const element = event.target instanceof Element ? event.target.closest('.key') : null;
        if (!element || !this._g.contains(element)) return null;
        return this._keyElements.get(Number(element.dataset.keyIndex)) || null;
      };
      const eventOptions = { bubbles: true, composed: true };
      const basicDetail = entry => ({ index: entry.data.index, note: entry.data.note });
      const pointerDetail = (entry, event, extra = {}) => ({
        ...basicDetail(entry),
        frequency: entry.data.frequency,
        raised: entry.data.raised,
        clientX: event.clientX,
        clientY: event.clientY,
        pointerId: event.pointerId,
        ...extra
      });
      const finishPointerInteraction = (event, canceled = false) => {
        const interaction = this._pointerInteractions.get(event.pointerId);
        if (!interaction) return;
        this._pointerInteractions.delete(event.pointerId);
        const { entry, interactionId } = interaction;
        this._emitIntent('release', entry, 'pointer', event, { interactionId, canceled });
        this.dispatchEvent(new CustomEvent(KEYPOINTERUP, {
          ...eventOptions,
          detail: pointerDetail(entry, event, canceled ? { canceled: true } : {})
        }));
        this._dampEntry(entry);
        if (!canceled) this._emitIntent('activate', entry, 'pointer', event, { interactionId });
      };

      this._g.addEventListener('pointerover', event => {
        const entry = keyFromEvent(event);
        if (!entry || entry.el.contains(event.relatedTarget)) return;
        this._focusedKeyIndex = entry.data.index;
        this._emitIntent('hover', entry, 'pointer', event);
        this.dispatchEvent(new CustomEvent(KEYHOVER, { ...eventOptions, detail: basicDetail(entry) }));
      });
      this._g.addEventListener('pointerout', event => {
        const entry = keyFromEvent(event);
        if (!entry || entry.el.contains(event.relatedTarget)) return;
        this._focusedKeyIndex = null;
        this._emitIntent('unhover', entry, 'pointer', event);
        this.dispatchEvent(new CustomEvent(KEYUNHOVER, { ...eventOptions, detail: basicDetail(entry) }));
      });
      this._g.addEventListener('pointerdown', event => {
        const entry = keyFromEvent(event);
        if (!entry) return;
        event.preventDefault();
        try { entry.el.setPointerCapture(event.pointerId); } catch { /* capture is best effort */ }
        const interactionId = this._nextInteractionId++;
        const prior = this._pointerInteractions.get(event.pointerId);
        if (prior) {
          this._emitIntent('release', prior.entry, 'pointer', event, {
            interactionId: prior.interactionId,
            canceled: true
          });
          this._dampEntry(prior.entry);
        }
        this._pointerInteractions.set(event.pointerId, { entry, interactionId });
        this._emitIntent('press', entry, 'pointer', event, { interactionId });
        this.dispatchEvent(new CustomEvent(KEYPOINTERDOWN, { ...eventOptions, detail: pointerDetail(entry, event) }));
        this.dispatchEvent(new CustomEvent(KEYCLICK, { ...eventOptions, detail: basicDetail(entry) }));
        this._soundEntry(entry);
      });
      this._g.addEventListener('pointerup', event => finishPointerInteraction(event));
      this._g.addEventListener('pointercancel', event => finishPointerInteraction(event, true));
      this._g.addEventListener('lostpointercapture', event => finishPointerInteraction(event, true));
      this._g.addEventListener('keydown', event => {
        const entry = keyFromEvent(event);
        if (!entry) return;
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          if (!event.repeat && !this._keyboardInteractions.has(entry.data.index)) {
            const interactionId = this._nextInteractionId++;
            this._keyboardInteractions.set(entry.data.index, { entry, interactionId });
            this._emitIntent('press', entry, 'keyboard', event, { interactionId });
            this.dispatchEvent(new CustomEvent(KEYCLICK, { ...eventOptions, detail: basicDetail(entry) }));
            this._soundEntry(entry);
          }
        } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
          event.preventDefault();
          this._focusAdjacentKey(entry.data.index, -1);
        } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
          event.preventDefault();
          this._focusAdjacentKey(entry.data.index, 1);
        }
      });
      this._g.addEventListener('keyup', event => {
        const entry = keyFromEvent(event);
        if (!entry || (event.key !== 'Enter' && event.key !== ' ')) return;
        const interaction = this._keyboardInteractions.get(entry.data.index);
        if (!interaction) return;
        this._keyboardInteractions.delete(entry.data.index);
        this._emitIntent('release', entry, 'keyboard', event, { interactionId: interaction.interactionId });
        this._dampEntry(entry);
        this._emitIntent('activate', entry, 'keyboard', event, { interactionId: interaction.interactionId });
      });
      this._g.addEventListener('focusin', event => {
        const entry = keyFromEvent(event);
        if (!entry) return;
        this._focusedKeyIndex = entry.data.index;
        this._emitIntent('focus', entry, 'keyboard', event);
        this.dispatchEvent(new CustomEvent(KEYHOVER, { ...eventOptions, detail: basicDetail(entry) }));
      });
      this._g.addEventListener('focusout', event => {
        const entry = keyFromEvent(event);
        if (!entry) return;
        const interaction = this._keyboardInteractions.get(entry.data.index);
        if (interaction) {
          this._keyboardInteractions.delete(entry.data.index);
          this._emitIntent('release', entry, 'keyboard', event, {
            interactionId: interaction.interactionId,
            canceled: true
          });
          this._dampEntry(entry);
        }
        this._emitIntent('blur', entry, 'keyboard', event);
        this.dispatchEvent(new CustomEvent(KEYUNHOVER, { ...eventOptions, detail: basicDetail(entry) }));
      });
    }

    _emitIntent(type, entry, source, event, extra = {}) {
      const detail = {
        type,
        key: entry.data.index,
        note: entry.data.note,
        source,
        timeStamp: event.timeStamp,
        ...extra
      };
      if (source === 'pointer') {
        detail.pointerId = event.pointerId;
        detail.pointerType = event.pointerType;
        detail.pressure = event.pressure;
      }
      this.dispatchEvent(new CustomEvent(KEYBOARDINTENT, {
        bubbles: true,
        composed: true,
        detail: Object.freeze(detail)
      }));
    }

    _soundEntry(entry) {
      if (!this._synth) return;
      if (!setupLilSynth(this)) return;
      soundKey(this, entry.el, entry.data.frequency, this._synthGain);
    }

    _dampEntry(entry) {
      if (this._synth) dampKey(this, entry.el);
    }

    _focusAdjacentKey(currentIndex, direction) {
      const indices = [...this._keyElements.keys()].sort((left, right) => left - right);
      const nextIndex = indices[indices.indexOf(currentIndex) + direction];
      this._keyElements.get(nextIndex)?.el.focus();
    }

    getNoteAtPoint(screenX, screenY) {
      if (!this._g || !this._geometry) return null;
      const ctm = this._g.getScreenCTM();
      if (!ctm) return null;
      const inverse = ctm.inverse();
      const groupX = inverse.a * screenX + inverse.c * screenY + inverse.e;
      const groupY = inverse.b * screenX + inverse.d * screenY + inverse.f;
      const angle = Math.atan2(groupX, -groupY);
      const radius = Math.sqrt(groupX * groupX + groupY * groupY);
      if (radius < this._geometry.innerRadius || radius > this._geometry.outerRadius) return null;

      const inKey = params => {
        const normalize = value => ((value % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
        const normalizedAngle = normalize(angle);
        const start = normalize(params.startAngle);
        const end = normalize(params.endAngle);
        const inAngle = start <= end
          ? normalizedAngle >= start && normalizedAngle <= end
          : normalizedAngle >= start || normalizedAngle <= end;
        return inAngle && radius >= params.innerRadius && radius <= params.outerRadius;
      };

      const ordered = [
        [...this._keyElements].filter(([, entry]) => entry.data.raised),
        [...this._keyElements].filter(([, entry]) => !entry.data.raised)
      ];
      for (const entries of ordered) {
        for (const [index, entry] of entries) {
          const params = this._currentParams.get(index);
          if (params && inKey(params)) {
            return { index, note: entry.data.note, raised: entry.data.raised };
          }
        }
      }
      return null;
    }

    _setAttribute(element, name, value, stats) {
      const stringValue = String(value);
      if (element.getAttribute(name) === stringValue) return;
      element.setAttribute(name, stringValue);
      stats.domWrites++;
    }

    _toggleClass(element, name, enabled, stats) {
      if (element.classList.contains(name) === enabled) return;
      element.classList.toggle(name, enabled);
      stats.domWrites++;
    }

    _reportRenderError(error, context = {}) {
      const detail = { error, context };
      if (typeof this.onRenderError === 'function') {
        try { this.onRenderError(detail); } catch { /* rendering must not backpressure callers */ }
      }
      this.dispatchEvent(new CustomEvent(RENDERERROR, {
        bubbles: true,
        composed: true,
        detail
      }));
    }
  }

  /**
   * Revision gate for applications that project worker/store/replica state into
   * the element. It deliberately keeps transport and reset policy outside the
   * component: gaps are reported once and no patch queue or replay is retained.
   */
  class KeyboardProjectionAdapter {
    constructor(keyboard, options = {}) {
      if (!keyboard || typeof keyboard.updateState !== 'function' ||
          typeof keyboard.setOverlay !== 'function' || typeof keyboard.setIndicator !== 'function' ||
          typeof keyboard.setLabel !== 'function') {
        throw new TypeError('KeyboardProjectionAdapter expects an all-around-keyboard-compatible element');
      }
      if (!options || typeof options !== 'object') throw new TypeError('Adapter options must be an object');
      if (options.onGap != null && typeof options.onGap !== 'function') {
        throw new TypeError('options.onGap must be a function');
      }
      this.keyboard = keyboard;
      this.onGap = options.onGap ?? null;
      this._revision = null;
      this._gapPending = false;
      this._managedOverlays = new Set();
      this._managedIndicators = new Set();
      this._managedLabels = new Set();
    }

    get revision() { return this._revision; }
    get gapPending() { return this._gapPending; }

    applySnapshot(snapshot) {
      const revision = this._prepareRevision(snapshot, 'snapshot');
      if (this._revision != null && revision < this._revision) {
        return Object.freeze({ status: 'stale', revision: this._revision, receivedRevision: revision });
      }
      const prepared = this._prepareEnvelope(snapshot, 'snapshot', revision);

      this._applyState(prepared.state);
      this._applySnapshotCollection(
        prepared.overlays, this._managedOverlays,
        spec => this.keyboard.setOverlay(spec), id => this.keyboard.removeOverlay(id)
      );
      this._applySnapshotCollection(
        prepared.indicators, this._managedIndicators,
        spec => this.keyboard._setNormalizedIndicator(spec), id => this.keyboard.removeIndicator(id)
      );
      this._applySnapshotCollection(
        prepared.labels, this._managedLabels,
        spec => this.keyboard.setLabel(spec), id => this.keyboard.removeLabel(id)
      );
      this._revision = prepared.revision;
      this._gapPending = false;
      return Object.freeze({ status: 'applied', kind: 'snapshot', revision: this._revision });
    }

    applyPatch(patch) {
      const revision = this._prepareRevision(patch, 'patch');
      if (this._revision != null && revision <= this._revision) {
        return Object.freeze({ status: 'stale', revision: this._revision, receivedRevision: revision });
      }
      if (this._gapPending || this._revision == null || revision !== this._revision + 1) {
        return this._signalGap(revision);
      }
      const prepared = this._prepareEnvelope(patch, 'patch', revision);

      this._applyState(prepared.state);
      this._applyPatchCollection(
        prepared.overlays, this._managedOverlays,
        spec => this.keyboard.setOverlay(spec), id => this.keyboard.removeOverlay(id)
      );
      this._applyPatchCollection(
        prepared.indicators, this._managedIndicators,
        spec => this.keyboard._setNormalizedIndicator(spec), id => this.keyboard.removeIndicator(id)
      );
      this._applyPatchCollection(
        prepared.labels, this._managedLabels,
        spec => this.keyboard.setLabel(spec), id => this.keyboard.removeLabel(id)
      );
      this._revision = prepared.revision;
      return Object.freeze({ status: 'applied', kind: 'patch', revision: this._revision });
    }

    dispose(options = {}) {
      if (!options || typeof options !== 'object') throw new TypeError('Dispose options must be an object');
      if (options.remove === true) {
        for (const id of this._managedOverlays) this.keyboard.removeOverlay(id);
        for (const id of this._managedIndicators) this.keyboard.removeIndicator(id);
        for (const id of this._managedLabels) this.keyboard.removeLabel(id);
      }
      this._managedOverlays.clear();
      this._managedIndicators.clear();
      this._managedLabels.clear();
      this._revision = null;
      this._gapPending = false;
    }

    _prepareRevision(value, kind) {
      if (!value || typeof value !== 'object') throw new TypeError(`${kind} must be an object`);
      const revision = Number(value.revision);
      if (!Number.isSafeInteger(revision)) throw new TypeError(`${kind}.revision must be a safe integer`);
      return revision;
    }

    _prepareEnvelope(value, kind, revision = this._prepareRevision(value, kind)) {
      const state = this._prepareState(value.state, `${kind}.state`);
      if (kind === 'snapshot') {
        return {
          revision,
          state,
          overlays: this._prepareSnapshotSpecs(value.overlays, 'overlays'),
          indicators: this._prepareSnapshotSpecs(value.indicators, 'indicators'),
          labels: this._prepareSnapshotSpecs(value.labels, 'labels')
        };
      }
      return {
        revision,
        state,
        overlays: this._preparePatchOps(value.overlays, 'overlays'),
        indicators: this._preparePatchOps(value.indicators, 'indicators'),
        labels: this._preparePatchOps(value.labels, 'labels')
      };
    }

    _prepareState(state, field) {
      if (state === undefined) return null;
      if (!state || typeof state !== 'object') throw new TypeError(`${field} must be an object`);
      const normalized = {};
      for (const name of Object.keys(STATE_FIELDS)) {
        if (Object.prototype.hasOwnProperty.call(state, name)) {
          normalized[name] = normalizeNumberSet(state[name], `${field}.${name}`);
        }
      }
      return normalized;
    }

    _prepareSnapshotSpecs(value, kind) {
      if (value === undefined) return null;
      const specs = this._iterable(value, kind);
      return this._normalizeSpecs(specs, kind);
    }

    _preparePatchOps(value, kind) {
      if (value === undefined) return null;
      if (!value || typeof value !== 'object') throw new TypeError(`${kind} patch must be an object`);
      const upsert = this._normalizeSpecs(this._iterable(value.upsert ?? [], `${kind}.upsert`), kind);
      const remove = this._iterable(value.remove ?? [], `${kind}.remove`).map(id => {
        const normalized = String(id);
        if (!normalized) throw new TypeError(`${kind}.remove ids must not be empty`);
        return normalized;
      });
      const removeSet = new Set(remove);
      if (removeSet.size !== remove.length) throw new TypeError(`${kind}.remove contains duplicate ids`);
      for (const spec of upsert) {
        if (removeSet.has(spec.id)) throw new TypeError(`${kind} cannot upsert and remove id ${spec.id}`);
      }
      return { upsert, remove };
    }

    _iterable(value, field) {
      if (typeof value === 'string' || !value || typeof value[Symbol.iterator] !== 'function') {
        throw new TypeError(`${field} must be an iterable`);
      }
      return [...value];
    }

    _normalizeSpecs(specs, kind) {
      const result = [];
      const ids = new Set();
      for (const spec of specs) {
        let normalized;
        if (kind === 'overlays') normalized = this.keyboard._normalizeOverlaySpec(spec);
        else if (kind === 'labels') normalized = this.keyboard._normalizeLabelSpec(spec);
        else {
          if (!spec || typeof spec !== 'object') throw new TypeError('Indicator snapshot entries must be objects');
          normalized = this.keyboard._normalizeIndicatorSpec(spec.id, spec);
        }
        if (ids.has(normalized.id)) throw new TypeError(`Duplicate ${kind} id: ${normalized.id}`);
        ids.add(normalized.id);
        if (kind === 'overlays') {
          result.push({
            id: normalized.id,
            at: { [normalized.at.kind]: normalized.at.value },
            patterns: [...normalized.patterns]
          });
        } else if (kind === 'labels') {
          result.push({
            id: normalized.id,
            at: { [normalized.at.kind]: normalized.at.value },
            text: normalized.text,
            ariaLabel: normalized.ariaLabel,
            className: normalized.className
          });
        } else {
          result.push(normalized);
        }
      }
      return result;
    }

    _applyState(state) {
      if (state) this.keyboard.updateState(state);
    }

    _applySnapshotCollection(specs, managed, upsert, remove) {
      if (specs == null) return;
      const next = new Set(specs.map(spec => String(spec.id)));
      for (const spec of specs) upsert(spec);
      for (const id of managed) {
        if (!next.has(id)) remove(id);
      }
      managed.clear();
      for (const id of next) managed.add(id);
    }

    _applyPatchCollection(operations, managed, upsert, remove) {
      if (operations == null) return;
      for (const spec of operations.upsert) {
        upsert(spec);
        managed.add(String(spec.id));
      }
      for (const id of operations.remove) {
        remove(id);
        managed.delete(id);
      }
    }

    _signalGap(receivedRevision) {
      const detail = Object.freeze({
        currentRevision: this._revision,
        expectedRevision: this._revision == null ? null : this._revision + 1,
        receivedRevision
      });
      const requestedReset = !this._gapPending;
      if (requestedReset) {
        this._gapPending = true;
        this.keyboard.dispatchEvent(new CustomEvent(PROJECTIONGAP, {
          bubbles: true,
          composed: true,
          detail
        }));
        if (this.onGap) {
          try { this.onGap(detail); }
          catch (error) { this.keyboard._reportRenderError?.(error, { phase: 'projectionGapHandler' }); }
        }
      }
      return Object.freeze({ status: 'gap', requestedReset, ...detail });
    }
  }

  Object.defineProperty(AllAroundKeyboard, 'version', {
    configurable: false,
    enumerable: false,
    writable: false,
    value: VERSION
  });

  if (!customElements.get('all-around-keyboard')) {
    customElements.define('all-around-keyboard', AllAroundKeyboard);
  }

  exports.AllAroundKeyboard = AllAroundKeyboard;
  exports.KEYBOARDINTENT = KEYBOARDINTENT;
  exports.KEYCLICK = KEYCLICK;
  exports.KEYHOVER = KEYHOVER;
  exports.KEYPOINTERDOWN = KEYPOINTERDOWN;
  exports.KEYPOINTERUP = KEYPOINTERUP;
  exports.KEYUNHOVER = KEYUNHOVER;
  exports.KeyboardProjectionAdapter = KeyboardProjectionAdapter;
  exports.PROJECTIONGAP = PROJECTIONGAP;
  exports.RENDERERROR = RENDERERROR;
  exports.VERSION = VERSION;
  exports.calculateIndicatorPlacement = calculateIndicatorPlacement;
  exports.keyLayout = keyLayout;
  exports.normalizeFrequencyProvider = normalizeFrequencyProvider;
  exports.resolveKeyFrequency = resolveKeyFrequency;

  return exports;

})({});
//# sourceMappingURL=all-around-keyboard.js.map
