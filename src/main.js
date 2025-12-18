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
const KEYPOINTERDOWN = 'keypointerdown';
const KEYPOINTERUP = 'keypointerup';

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

// Calculate centroid position of an arc segment
function arcCentroid(params) {
  const { startAngle, endAngle, innerRadius, outerRadius } = params;
  const midAngle = (startAngle + endAngle) / 2;
  const midRadius = (innerRadius + outerRadius) / 2;
  // SVG uses clockwise angles from 12 o'clock, so we need to adjust
  return {
    x: Math.sin(midAngle) * midRadius,
    y: -Math.cos(midAngle) * midRadius
  };
}

// Animate arc parameters over time (with optional text element)
function animateArc(el, textEl, fromParams, toParams, drawArc, duration, onDone) {
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

    // Update text position if text element exists
    if (textEl) {
      const centroid = arcCentroid(current);
      textEl.setAttribute('x', centroid.x);
      textEl.setAttribute('y', centroid.y);
    }

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
    'hovered-keys', 'hovered-notes',
    // Label attributes
    'key-labels', 'label-format'
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

    // Label settings
    this._keyLabels = false;
    this._labelFormat = 'note'; // 'note', 'pitch', 'index', or custom function
    this._keyLabelsMap = null; // Map of index -> label string (for custom labels)

    // Internal
    this._keyElements = new Map(); // index -> {el, textEl, data}
    this._currentParams = new Map(); // index -> arc params for animation
    this._focusedKeyIndex = null; // for keyboard navigation

    // Geometry cache (for indicator positioning)
    this._geometry = {
      cx: 0,           // center x in viewBox coords
      cy: 0,           // center y in viewBox coords
      innerRadius: 0,
      outerRadius: 0,
      startAngle: 0,
      endAngle: 0
    };

    // Indicator observation
    this._indicatorObserver = null;
    this._resizeObserver = null;
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

  get keyLabels() { return this._keyLabels; }
  set keyLabels(v) {
    // Can be boolean, 'true'/'false', or a Map/Object of index -> label
    if (v instanceof Map) {
      this._keyLabels = true;
      this._keyLabelsMap = v;
    } else if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
      this._keyLabels = true;
      this._keyLabelsMap = new Map(Object.entries(v).map(([k, val]) => [Number(k), val]));
    } else {
      this._keyLabels = v === true || v === 'true';
      this._keyLabelsMap = null;
    }
    this._updateLabels();
  }

  get labelFormat() { return this._labelFormat; }
  set labelFormat(v) {
    this._labelFormat = v;
    this._updateLabels();
  }

  // Read-only geometry property for external positioning
  get geometry() {
    return { ...this._geometry };
  }

  // Helper method to get position for a pitch value
  getPositionForPitch(pitch, radius = 0.5) {
    const totalKeys = this._octaves * this._notesInOctave;
    const normalizedPitch = pitch / totalKeys;
    const angle = this._geometry.startAngle +
                  normalizedPitch * (this._geometry.endAngle - this._geometry.startAngle);
    const r = this._geometry.innerRadius +
              radius * (this._geometry.outerRadius - this._geometry.innerRadius);

    const x = this._geometry.cx + Math.sin(angle) * r;
    const y = this._geometry.cy - Math.cos(angle) * r;

    return {
      x, y,
      angle: angle * 180 / Math.PI,
      pitch,
      radius
    };
  }

  // Helper method to get position for a key index
  getPositionForKey(keyIndex, radius = 0.5) {
    const keyEntry = this._keyElements.get(keyIndex);
    if (keyEntry) {
      const params = this._currentParams.get(keyIndex);
      if (params) {
        const midAngle = (params.startAngle + params.endAngle) / 2;
        const pitch = ((midAngle - this._geometry.startAngle) /
                       (this._geometry.endAngle - this._geometry.startAngle)) *
                      (this._octaves * this._notesInOctave);
        return this.getPositionForPitch(pitch, radius);
      }
    }
    // Fallback to simple calculation
    return this.getPositionForPitch(keyIndex - this._leftmostKey, radius);
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
    this._setupIndicatorObservers();
  }

  disconnectedCallback() {
    if (this._indicatorObserver) {
      this._indicatorObserver.disconnect();
      this._indicatorObserver = null;
    }
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }

  _setupDOM() {
    const style = document.createElement('style');
    style.textContent = css;

    const container = document.createElement('div');
    container.classList.add('keyboard-container');
    container.setAttribute('role', 'application');
    container.setAttribute('aria-label', 'Musical keyboard');

    const svg = svgEl('svg', { width: '100%' });
    svg.setAttribute('role', 'group');
    svg.setAttribute('aria-label', 'Piano keys');

    const g = svgEl('g');
    svg.appendChild(g);
    container.appendChild(svg);

    // Indicator slot container - positioned over the keyboard
    const indicatorContainer = document.createElement('div');
    indicatorContainer.classList.add('indicator-container');
    const slot = document.createElement('slot');
    indicatorContainer.appendChild(slot);
    container.appendChild(indicatorContainer);

    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(container);

    this._svg = svg;
    this._g = g;
    this._container = container;
    this._indicatorContainer = indicatorContainer;
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

  // Get label text for a key
  _getLabelText(data) {
    // Custom labels map takes precedence
    if (this._keyLabelsMap && this._keyLabelsMap.has(data.index)) {
      return this._keyLabelsMap.get(data.index);
    }

    // Format-based labels
    if (typeof this._labelFormat === 'function') {
      return this._labelFormat(data);
    }

    switch (this._labelFormat) {
      case 'note':
        return this._getNoteName(data.note);
      case 'pitch':
        // Just the pitch class (C, D, E, etc.) without octave
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        return noteNames[data.note % this._notesInOctave] || `${data.note % this._notesInOctave}`;
      case 'index':
        return String(data.index);
      default:
        return this._getNoteName(data.note);
    }
  }

  // Update all key labels (text content and visibility)
  _updateLabels() {
    if (!this._keyElements) return;

    for (const [index, keyData] of this._keyElements) {
      if (keyData.textEl) {
        if (this._keyLabels) {
          keyData.textEl.textContent = this._getLabelText(keyData.data);
          keyData.textEl.style.display = '';
        } else {
          keyData.textEl.style.display = 'none';
        }
      }
    }
  }

  // Set up observers for indicator children
  _setupIndicatorObservers() {
    // Watch for changes to indicator children (data attributes, added/removed)
    this._indicatorObserver = new MutationObserver((mutations) => {
      let needsUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          needsUpdate = true;
        } else if (mutation.type === 'attributes') {
          const attr = mutation.attributeName;
          if (attr === 'data-pitch' || attr === 'data-key' || attr === 'data-radius') {
            this._updateIndicator(mutation.target);
          }
        }
      }
      if (needsUpdate) {
        this._updateIndicators();
      }
    });

    this._indicatorObserver.observe(this, {
      childList: true,
      subtree: false,
      attributes: true,
      attributeFilter: ['data-pitch', 'data-key', 'data-radius', 'data-wave-number', 'data-wave-amplitude', 'data-wave-phase']
    });

    // Also observe attribute changes on children (MutationObserver on parent doesn't catch child attr changes)
    // We'll re-observe children when they're added
    this._observeIndicatorChildren();

    // Watch for resize to update indicator positions
    this._resizeObserver = new ResizeObserver(() => {
      this._updateIndicators();
    });
    this._resizeObserver.observe(this);

    // Initial update
    this._updateIndicators();
  }

  // Observe attribute changes on indicator children
  _observeIndicatorChildren() {
    for (const child of this.children) {
      if (child.hasAttribute('data-pitch') || child.hasAttribute('data-key')) {
        // Observe this child for attribute changes
        this._indicatorObserver.observe(child, {
          attributes: true,
          attributeFilter: ['data-pitch', 'data-key', 'data-radius', 'data-wave-number', 'data-wave-amplitude', 'data-wave-phase']
        });
      }
    }
  }

  // Update all indicator children positions
  _updateIndicators() {
    // Double-rAF to ensure layout is fully complete before reading CTM
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        for (const child of this.children) {
          if (child.hasAttribute('data-pitch') || child.hasAttribute('data-key')) {
            this._updateIndicator(child);
          }
        }
        // Re-observe new children
        this._observeIndicatorChildren();
      });
    });
  }

  // Update a single indicator child's CSS custom properties
  _updateIndicator(el) {
    const hasPitch = el.hasAttribute('data-pitch');
    const hasKey = el.hasAttribute('data-key');

    if (!hasPitch && !hasKey) return;

    let angle;
    let pitch;
    let keyRadius = null;
    let isVisible = true;

    const totalKeys = this._octaves * this._notesInOctave;
    const sweepAngle = this._geometry.endAngle - this._geometry.startAngle;
    const keyWidth = sweepAngle / totalKeys;

    if (hasKey) {
      // For data-key: use the key's actual geometry directly
      const keyIndex = parseInt(el.dataset.key, 10);
      const keyEntry = this._keyElements.get(keyIndex);
      console.log('[all-around-keyboard] _updateIndicator: keyIndex=', keyIndex, 'found=', !!keyEntry, 'leftmostKey=', this._leftmostKey, 'keyElements.keys=', [...this._keyElements.keys()]);
      if (keyEntry) {
        const params = this._currentParams.get(keyIndex);
        if (params) {
          // Use the key's actual midAngle directly - no conversion needed
          angle = (params.startAngle + params.endAngle) / 2;
          pitch = keyIndex - this._leftmostKey;

          // Position white (lower) keys closer to inner edge, black (upper) keys at center
          // This avoids awkward overlapping when keys have offset geometry
          const keyInnerNorm = (params.innerRadius - this._geometry.innerRadius) /
                               (this._geometry.outerRadius - this._geometry.innerRadius);
          const keyOuterNorm = (params.outerRadius - this._geometry.innerRadius) /
                               (this._geometry.outerRadius - this._geometry.innerRadius);
          const keyDepth = keyOuterNorm - keyInnerNorm;

          if (params.raised) {
            // Black keys: center of key
            keyRadius = keyInnerNorm + keyDepth * 0.5;
          } else {
            // White keys: 30% from inner edge of key
            keyRadius = keyInnerNorm + keyDepth * 0.3;
          }
        } else {
          // Fallback: calculate angle from key index
          pitch = keyIndex - this._leftmostKey;
          angle = this._geometry.startAngle + (pitch + 0.5) * keyWidth;
        }
      } else {
        // Key not found: calculate angle from key index
        pitch = keyIndex - this._leftmostKey;
        angle = this._geometry.startAngle + (pitch + 0.5) * keyWidth;
      }
    } else {
      // For data-pitch: continuous positioning using actual key positions
      pitch = parseFloat(el.dataset.pitch) || 0;

      // Check if keyboard is circular (sweep close to 360°)
      const isCircular = Math.abs(this._sweep - 2 * Math.PI) < 0.01;

      if (!isCircular && (pitch < -0.5 || pitch > totalKeys - 0.5)) {
        isVisible = false;
      }

      // Get the two adjacent keys to interpolate between
      const lowerPitch = Math.floor(pitch);
      const upperPitch = Math.ceil(pitch);
      const fraction = pitch - lowerPitch;

      // Get key indices (with wrapping for circular)
      const lowerKeyIndex = this._leftmostKey + (isCircular ? ((lowerPitch % totalKeys) + totalKeys) % totalKeys : Math.max(0, Math.min(totalKeys - 1, lowerPitch)));
      const upperKeyIndex = this._leftmostKey + (isCircular ? ((upperPitch % totalKeys) + totalKeys) % totalKeys : Math.max(0, Math.min(totalKeys - 1, upperPitch)));

      const lowerParams = this._currentParams.get(lowerKeyIndex);
      const upperParams = this._currentParams.get(upperKeyIndex);

      if (lowerParams && upperParams) {
        const lowerAngle = (lowerParams.startAngle + lowerParams.endAngle) / 2;
        let upperAngle = (upperParams.startAngle + upperParams.endAngle) / 2;

        // Handle wrap-around for circular keyboards
        if (isCircular && upperPitch >= totalKeys) {
          upperAngle += 2 * Math.PI;
        }

        // Interpolate between the two key centers
        angle = lowerAngle + fraction * (upperAngle - lowerAngle);
      } else if (lowerParams) {
        angle = (lowerParams.startAngle + lowerParams.endAngle) / 2;
      } else {
        // Fallback if keys not ready yet
        angle = this._geometry.startAngle + (pitch + 0.5) * keyWidth;
      }
    }

    // Calculate radius - can be static or modulated by a standing wave
    let radius;
    const baseRadius = el.hasAttribute('data-radius')
      ? parseFloat(el.dataset.radius)
      : (keyRadius ?? 0.5);

    if (el.hasAttribute('data-wave-number')) {
      // Standing wave: radius oscillates based on pitch position
      const waveNumber = parseFloat(el.dataset.waveNumber) || 1;
      const waveAmplitude = parseFloat(el.dataset.waveAmplitude) || 0.2;
      const wavePhase = parseFloat(el.dataset.wavePhase) || 0;

      // Calculate wave: k wavelengths across totalKeys
      const wavePosition = (2 * Math.PI * waveNumber * pitch / totalKeys) + wavePhase;
      const waveOffset = waveAmplitude * Math.sin(wavePosition);

      radius = baseRadius + waveOffset;

      // Set wave CSS custom properties for external use
      el.style.setProperty('--indicator-wave-offset', waveOffset);
      el.style.setProperty('--indicator-wave-phase', wavePosition);
    } else {
      radius = baseRadius;
    }

    // Set visibility
    el.style.setProperty('--indicator-visible', isVisible ? '1' : '0');
    if (!isVisible) {
      el.style.opacity = '0';
      el.style.pointerEvents = 'none';
    } else {
      el.style.opacity = '';
      el.style.pointerEvents = '';
    }

    // Calculate radial position
    const r = this._geometry.innerRadius +
              radius * (this._geometry.outerRadius - this._geometry.innerRadius);

    // Calculate point in <g> coordinate space (origin is at keyboard center)
    const gX = Math.sin(angle) * r;
    const gY = -Math.cos(angle) * r;

    // Use SVG's CTM to transform to screen coordinates
    const ctm = this._g.getScreenCTM();
    if (!ctm) return;

    // Transform the point
    const screenX = ctm.a * gX + ctm.c * gY + ctm.e;
    const screenY = ctm.b * gX + ctm.d * gY + ctm.f;

    // Make relative to host element (the containing block for slotted content)
    const hostRect = this.getBoundingClientRect();
    const pixelX = screenX - hostRect.left;
    const pixelY = screenY - hostRect.top;

    // Set CSS custom properties
    el.style.setProperty('--indicator-x', `${pixelX}px`);
    el.style.setProperty('--indicator-y', `${pixelY}px`);
    el.style.setProperty('--indicator-angle', `${angle * 180 / Math.PI}deg`);
    el.style.setProperty('--indicator-pitch', pitch);
    el.style.setProperty('--indicator-radius', radius);
    // Mark as positioned so CSS can show it
    el.setAttribute('data-positioned', '');
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

    // Cache geometry for indicator positioning
    this._geometry = {
      cx: this._width / 2,
      cy: outerRadius + SVGStrokePadding / 2,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle
    };

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
        if (data.textEl) data.textEl.remove();
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

        // Update text class for raised state
        if (existing.textEl) {
          existing.textEl.classList.toggle('key-label--upper', d.raised);
          existing.textEl.classList.toggle('key-label--lower', !d.raised);
        }

        if (this._transitionTime > 0 && (
          oldParams.startAngle !== newParams.startAngle ||
          oldParams.endAngle !== newParams.endAngle
        )) {
          animateArc(existing.el, existing.textEl, oldParams, newParams, drawArc, this._transitionTime, () => {
            existing.el.classList.remove('key--modulating');
            existing.el.classList.toggle('key--lower', !d.raised);
            existing.el.classList.toggle('key--upper', d.raised);
          });
        } else {
          existing.el.setAttribute('d', drawArc(newParams));
          // Update text position without animation
          if (existing.textEl) {
            const centroid = arcCentroid(newParams);
            existing.textEl.setAttribute('x', centroid.x);
            existing.textEl.setAttribute('y', centroid.y);
          }
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

        // Pointer events with full detail (for drag-drop detection)
        el.addEventListener('pointerdown', (e) => {
          const params = this._currentParams.get(d.index);
          const evt = new CustomEvent(KEYPOINTERDOWN, {
            ...eventOpts,
            detail: {
              index: d.index,
              note: d.note,
              frequency: d.frequency,
              raised: d.raised,
              clientX: e.clientX,
              clientY: e.clientY,
              pointerId: e.pointerId
            }
          });
          this.dispatchEvent(evt);
        });

        el.addEventListener('pointerup', (e) => {
          const params = this._currentParams.get(d.index);
          const evt = new CustomEvent(KEYPOINTERUP, {
            ...eventOpts,
            detail: {
              index: d.index,
              note: d.note,
              frequency: d.frequency,
              raised: d.raised,
              clientX: e.clientX,
              clientY: e.clientY,
              pointerId: e.pointerId
            }
          });
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

        // Create text element for label
        const centroid = arcCentroid(newParams);
        const textEl = svgEl('text', {
          class: `key-label ${d.raised ? 'key-label--upper' : 'key-label--lower'}`,
          x: centroid.x,
          y: centroid.y,
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'pointer-events': 'none'  // Allow clicks to pass through to the key
        });
        textEl.textContent = this._getLabelText(d);
        if (!this._keyLabels) {
          textEl.style.display = 'none';
        }

        this._g.appendChild(el);
        this._g.appendChild(textEl);
        this._keyElements.set(d.index, { el, textEl, data: d });
        this._currentParams.set(d.index, newParams);
      }
    }

    // Apply initial states
    this._applyKeyStates();

    // Raise upper keys to top of render order
    for (const d of keyData) {
      if (d.raised) {
        const keyEntry = this._keyElements.get(d.index);
        if (keyEntry) this._g.appendChild(keyEntry.el);
      }
    }

    // Raise all text labels above all keys
    for (const [, keyEntry] of this._keyElements) {
      if (keyEntry.textEl) this._g.appendChild(keyEntry.textEl);
    }

    // Update indicator positions after geometry changes
    this._updateIndicators();
  }
}

customElements.define('all-around-keyboard', AllAroundKeyboard);

export { AllAroundKeyboard, keyLayout, KEYCLICK, KEYHOVER, KEYUNHOVER };
