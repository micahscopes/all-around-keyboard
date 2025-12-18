import { arc } from 'd3-shape';
import { keyLayout } from './key-layout';
import { setupLilSynth, soundKey, dampKey } from './lil-synth';
import css from './style.css';

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
    setupLilSynth(this);
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

    const elem = this;
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

export { AllAroundKeyboard, keyLayout, KEYPRESS, KEYRELEASE, KEYLIGHT, KEYDIM, NOTELIGHT, NOTEDIM };
