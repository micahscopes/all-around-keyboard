import {
  AllAroundKeyboard,
  KeyboardProjectionAdapter,
  KEYBOARDINTENT,
  calculateIndicatorPlacement,
  keyLayout,
  type AnchorBatchResult,
  type FrequencyContext,
  type KeyboardIntent,
  type KeyboardLabel,
  type KeyboardOverlay,
  type KeyboardStatePatch,
  type ProjectionResult,
  type RenderStats
} from '../../src/main.js';

const keyboard: AllAroundKeyboard = document.createElement('all-around-keyboard');
const state: KeyboardStatePatch = {
  pressedKeys: new Set([36]),
  litNotes: [0, 4, 7],
  hoveredKeys: []
};
keyboard.updateState(state);
const completion: Promise<void> = keyboard.updateComplete;
void completion;

const overlay: KeyboardOverlay = {
  id: 'selection:c',
  at: { note: 0 },
  patterns: ['toggle-lines']
};
keyboard.setOverlay(overlay);
keyboard.setIndicator('voice:self', {
  at: { pitch: 6.42 },
  radius: 0.67,
  wave: { number: 0, amplitude: 0, phase: 0 }
});
const label: KeyboardLabel = {
  id: 'degree:tonic',
  at: { key: 36 },
  text: 'Do',
  ariaLabel: 'tonic, do'
};
keyboard.setLabel(label);

keyboard.frequencyProvider = (absoluteKey: number, context: FrequencyContext) =>
  220 * 2 ** ((absoluteKey - context.baseKey) / context.notesInOctave);
const anchors: AnchorBatchResult = keyboard.getAnchors(
  [{ key: 36 }, { note: 0 }],
  { space: 'host', radius: 0.5 }
);
void anchors;

keyboard.addEventListener(KEYBOARDINTENT, event => {
  const intent: KeyboardIntent = event.detail;
  if (intent.type === 'activate') {
    const key: number = intent.key;
    const interactionId: number = intent.interactionId;
    void key;
    void interactionId;
  }
});
keyboard.onRenderStats = (stats: Readonly<RenderStats>) => {
  const writes: number = stats.domWrites;
  void writes;
};

const projection = new KeyboardProjectionAdapter(keyboard, {
  onGap(detail) {
    const received: number = detail.receivedRevision;
    void received;
  }
});
const projectionResult: ProjectionResult = projection.applySnapshot({
  revision: 1,
  state,
  overlays: [overlay],
  indicators: [{ id: 'voice:self', at: { key: 36 } }],
  labels: [label]
});
void projectionResult;

const layout = keyLayout()
  .octaves(2)
  .octaveSize(12)
  .leftmostKey(36)
  .frequency(keyboard.frequencyProvider)();
const firstFrequency: number = layout[0].frequency;
void firstFrequency;

const placement = calculateIndicatorPlacement(
  { at: { kind: 'pitch', value: 0.5 }, radius: null, wave: null },
  { cx: 250, cy: 250, innerRadius: 100, outerRadius: 200, startAngle: 0, endAngle: Math.PI },
  new Map([[36, {
    startAngle: 0,
    endAngle: Math.PI / 12,
    innerRadius: 100,
    outerRadius: 200,
    raised: false
  }]]),
  {
    ctm: { a: 1, b: 0, c: 0, d: 1, e: 250, f: 250 },
    hostRect: { left: 0, top: 0 }
  },
  { octaves: 2, notesInOctave: 12, sweep: Math.PI, leftmostKey: 36 }
);
const placementVisible: boolean | undefined = placement?.visible;
void placementVisible;

// @ts-expect-error location objects must contain exactly one recognized unit
keyboard.setOverlay({ id: 'ambiguous', at: { key: 36, note: 0 } });
// @ts-expect-error overlays do not accept continuous pitch locations
keyboard.setOverlay({ id: 'continuous', at: { pitch: 1.25 } });
// @ts-expect-error indicators do not accept period-relative note locations
keyboard.setIndicator('note-indicator', { at: { note: 0 } });
