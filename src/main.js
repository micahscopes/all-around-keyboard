import { arc } from 'd3-shape';
import { keyLayout } from './key-layout';
import { setupLilSynth, soundKey, dampKey } from './lil-synth';
import css from './style.css';

const SVGStrokePadding = 15;
const SVGNS = 'http://www.w3.org/2000/svg';

// Event names (output only - user interactions)
const KEYCLICK = 'keyclick';
const KEYHOVER = 'keyhover';
const KEYUNHOVER = 'keyunhover';

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

// Parse JSON array attribute, return empty array on failure
function parseArrayAttr(val) {
  if (!val) return [];
  try {
    const arr = JSON.parse(val);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

class AllAroundKeyboard extends HTMLElement {
  static observedAttributes = [
    'notes-in-octave', 'raised-notes', 'octaves', 'sweep', 'depth',
    'width', 'overlapping', 'pie', 'synth', 'transition-time',
    'base-tone', 'base-key', 'leftmost-key',
    // State attributes (input)
    'pressed-keys', 'lit-keys', 'pressed-notes', 'lit-notes',
    'hovered-keys', 'hovered-notes'
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

    // State (driven by attributes)
    this._pressedKeys = new Set();
    this._litKeys = new Set();
    this._pressedNotes = new Set();
    this._litNotes = new Set();
    this._hoveredKeys = new Set();
    this._hoveredNotes = new Set();

    // Internal
    this._keyElements = new Map(); // index -> {el, data}
    this._currentParams = new Map(); // index -> arc params for animation
    this._focusedKeyIndex = null; // for keyboard navigation
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

  // State attribute getters/setters
  get pressedKeys() { return [...this._pressedKeys]; }
  set pressedKeys(v) {
    this._pressedKeys = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

  get litKeys() { return [...this._litKeys]; }
  set litKeys(v) {
    this._litKeys = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

  get pressedNotes() { return [...this._pressedNotes]; }
  set pressedNotes(v) {
    this._pressedNotes = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

  get litNotes() { return [...this._litNotes]; }
  set litNotes(v) {
    this._litNotes = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

  get hoveredKeys() { return [...this._hoveredKeys]; }
  set hoveredKeys(v) {
    this._hoveredKeys = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

  get hoveredNotes() { return [...this._hoveredNotes]; }
  set hoveredNotes(v) {
    this._hoveredNotes = new Set(Array.isArray(v) ? v : parseArrayAttr(v));
    this._applyKeyStates();
  }

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
    this._setupKeyboard();
  }

  disconnectedCallback() {
    // Cleanup if needed
  }

  _setupDOM() {
    const style = document.createElement('style');
    style.textContent = css;

    const container = document.createElement('div');
    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', 'Musical keyboard');

    const svg = svgEl('svg', { width: '100%' });
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Piano keys');

    const g = svgEl('g');
    svg.appendChild(g);
    container.appendChild(svg);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    this._svg = svg;
    this._g = g;
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

  // Get note name for accessibility
  _getNoteName(noteNum) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(noteNum / this._notesInOctave);
    const note = noteNum % this._notesInOctave;
    return `${noteNames[note] || `Note ${note}`}${octave}`;
  }

  // Focus adjacent key for keyboard navigation
  _focusAdjacentKey(currentIndex, direction) {
    const indices = [...this._keyElements.keys()].sort((a, b) => a - b);
    const currentPos = indices.indexOf(currentIndex);
    const nextPos = currentPos + direction;
    if (nextPos >= 0 && nextPos < indices.length) {
      const nextIndex = indices[nextPos];
      const nextKey = this._keyElements.get(nextIndex);
      if (nextKey) nextKey.el.focus();
    }
  }

  // Apply pressed/lit/hover states to all keys based on current attribute values
  _applyKeyStates() {
    for (const [index, keyData] of this._keyElements) {
      const note = keyData.data.note;
      const isPressed = this._pressedKeys.has(index) || this._pressedNotes.has(note);
      const isLit = this._litKeys.has(index) || this._litNotes.has(note);
      const isHovered = this._hoveredKeys.has(index) || this._hoveredNotes.has(note);

      keyData.el.classList.toggle('key--pressed', isPressed);
      keyData.el.classList.toggle('key--highlight', isLit);
      keyData.el.classList.toggle('key--hover', isHovered);

      // ARIA state
      keyData.el.setAttribute('aria-pressed', isPressed ? 'true' : 'false');

      // Synth integration
      if (this._synth) {
        if (isPressed) {
          soundKey(keyData.el, keyData.data.frequency);
        } else {
          dampKey(keyData.el);
        }
      }
    }
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
      } else {
        // Create new key with ARIA attributes
        const noteName = this._getNoteName(d.note);
        const el = svgEl('path', {
          class: `key ${d.raised ? 'key--upper' : 'key--lower'}`,
          d: drawArc(newParams),
          tabindex: '0',
          role: 'button',
          'aria-label': `${noteName} key`,
          'aria-pressed': 'false'
        });

        // Event options for bubbling through shadow DOM
        const eventOpts = { bubbles: true, composed: true };

        // Event handlers - emit events, don't manage state
        el.addEventListener('mouseenter', (e) => {
          e.preventDefault();
          this._focusedKeyIndex = d.index;
          const evt = new CustomEvent(KEYHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        });

        el.addEventListener('mouseleave', (e) => {
          e.preventDefault();
          this._focusedKeyIndex = null;
          const evt = new CustomEvent(KEYUNHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        });

        el.addEventListener('mousedown', (e) => {
          e.preventDefault();
          const evt = new CustomEvent(KEYCLICK, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        });

        el.addEventListener('touchstart', (e) => {
          e.preventDefault();
          const evt = new CustomEvent(KEYHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
          e.preventDefault();
          const evt = new CustomEvent(KEYCLICK, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
          const unhoverEvt = new CustomEvent(KEYUNHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(unhoverEvt);
        });

        // Keyboard navigation
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const evt = new CustomEvent(KEYCLICK, { ...eventOpts, detail: { index: d.index, note: d.note } });
            this.dispatchEvent(evt);
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
            e.preventDefault();
            this._focusAdjacentKey(d.index, -1);
          } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
            e.preventDefault();
            this._focusAdjacentKey(d.index, 1);
          }
        });

        el.addEventListener('focus', () => {
          this._focusedKeyIndex = d.index;
          const evt = new CustomEvent(KEYHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        });

        el.addEventListener('blur', () => {
          const evt = new CustomEvent(KEYUNHOVER, { ...eventOpts, detail: { index: d.index, note: d.note } });
          this.dispatchEvent(evt);
        });

        this._g.appendChild(el);
        this._keyElements.set(d.index, { el, data: d });
        this._currentParams.set(d.index, newParams);
      }
    }

    // Apply initial states
    this._applyKeyStates();

    // Raise upper keys to top of render order
    for (const d of keyData) {
      if (d.raised) {
        const keyData = this._keyElements.get(d.index);
        if (keyData) this._g.appendChild(keyData.el);
      }
    }
  }
}

customElements.define('all-around-keyboard', AllAroundKeyboard);

export { AllAroundKeyboard, keyLayout, KEYCLICK, KEYHOVER, KEYUNHOVER };
