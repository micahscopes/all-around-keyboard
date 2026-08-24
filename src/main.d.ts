export type KeyLocation = { key: number; note?: never; pitch?: never };
export type NoteLocation = { note: number; key?: never; pitch?: never };
export type PitchLocation = { pitch: number; key?: never; note?: never };
export type KeyboardLocation = KeyLocation | NoteLocation | PitchLocation;

export type KeyboardIntent =
  | {
      type: 'press' | 'release' | 'activate';
      interactionId: number;
      key: number;
      note: number;
      source: 'pointer' | 'keyboard' | 'midi';
      pointerId?: number;
      pointerType?: string;
      pressure?: number;
      canceled?: boolean;
      timeStamp: number;
    }
  | {
      type: 'focus' | 'blur' | 'hover' | 'unhover';
      key: number;
      note: number;
      source: 'pointer' | 'keyboard';
      pointerId?: number;
      pointerType?: string;
      pressure?: number;
      timeStamp: number;
    };

export interface KeyboardStatePatch {
  pressedKeys?: Iterable<number>;
  pressedNotes?: Iterable<number>;
  litKeys?: Iterable<number>;
  litNotes?: Iterable<number>;
  hoveredKeys?: Iterable<number>;
  hoveredNotes?: Iterable<number>;
}

export interface KeyboardOverlay {
  id: string | number;
  at: KeyLocation | NoteLocation;
  patterns?: Iterable<string>;
}

export interface IndicatorWave {
  number?: number;
  amplitude?: number;
  phase?: number;
}

export interface KeyboardIndicator {
  at: KeyLocation | PitchLocation;
  radius?: number | null;
  wave?: IndicatorWave | null;
  element?: HTMLElement;
}

export interface ProjectedKeyboardIndicator extends KeyboardIndicator {
  id: string | number;
}

export interface KeyboardLabel {
  id: string | number;
  at: KeyLocation | NoteLocation;
  text: string | number;
  ariaLabel?: string | null;
  className?: string | null;
}

export interface FrequencyContext {
  key: number;
  note: number;
  offset: number;
  notes: readonly number[];
  notesInOctave: number;
  baseTone: number;
  baseKey: number;
}

export type FrequencyProvider =
  | ((absoluteKey: number, context: FrequencyContext) => number | null | undefined)
  | number
  | readonly (number | null | undefined)[]
  | ReadonlyMap<number, number>
  | Record<number, number>
  | null;

export interface KeyboardGeometry {
  cx: number;
  cy: number;
  innerRadius: number;
  outerRadius: number;
  startAngle: number;
  endAngle: number;
}

export interface AnchorPoint {
  key: number;
  note: number;
  x: number;
  y: number;
  angle: number;
  radius: number;
}

export interface KeyboardPosition {
  x: number;
  y: number;
  angle: number;
  pitch: number;
  radius: number;
}

export interface IndicatorPlacementSpec {
  at: { kind: 'key' | 'pitch'; value: number };
  radius: number | null;
  wave: {
    number: number;
    amplitude: number;
    phase: number;
  } | null;
}

export interface KeyGeometryParameters {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  raised: boolean;
}

export interface IndicatorFrameTransform {
  ctm: { a: number; b: number; c: number; d: number; e: number; f: number };
  hostRect: { left: number; top: number };
}

export interface IndicatorPlacementConfig {
  octaves: number;
  notesInOctave: number;
  sweep: number;
  leftmostKey: number;
}

export interface IndicatorPlacement extends KeyboardPosition {
  visible: boolean;
  waveOffset: number | null;
  wavePosition: number | null;
}

export interface AnchorResult {
  revision: number;
  space: 'viewBox' | 'client' | 'host';
  at: KeyLocation | NoteLocation;
  points: AnchorPoint[];
}

export interface AnchorBatchResult {
  revision: number;
  space: 'viewBox' | 'client' | 'host';
  anchors: Array<{ at: KeyLocation | NoteLocation; points: AnchorPoint[] }>;
}

export interface RenderStats {
  reason: string;
  dirtyKeys: number;
  dirtyIndicators: number;
  dirtyOverlays: number;
  dirtyLabels: number;
  geometryReads: number;
  domWrites: number;
  keyVisits: number;
  keyDataVisits: number;
  nodeAdditions: number;
  nodeRemovals: number;
  scheduledFrames: 1;
  durationMs: number;
}

export interface RenderErrorDetail {
  error: unknown;
  context: Record<string, unknown>;
}

export interface ProjectionGapDetail {
  currentRevision: number | null;
  expectedRevision: number | null;
  receivedRevision: number;
}

export interface LegacyKeyDetail {
  index: number;
  note: number;
}

export interface LegacyPointerDetail extends LegacyKeyDetail {
  frequency: number;
  raised: boolean;
  clientX: number;
  clientY: number;
  pointerId: number;
  canceled?: boolean;
}

export interface AllAroundKeyboardEventMap extends HTMLElementEventMap {
  keyboardintent: CustomEvent<KeyboardIntent>;
  projectiongap: CustomEvent<ProjectionGapDetail>;
  rendererror: CustomEvent<RenderErrorDetail>;
  keyclick: CustomEvent<LegacyKeyDetail>;
  keyhover: CustomEvent<LegacyKeyDetail>;
  keyunhover: CustomEvent<LegacyKeyDetail>;
  keypointerdown: CustomEvent<LegacyPointerDetail>;
  keypointerup: CustomEvent<LegacyPointerDetail>;
}

export declare class AllAroundKeyboard extends HTMLElement {
  static readonly version: string;

  notesInOctave: number;
  get raisedNotes(): number[];
  set raisedNotes(value: Iterable<number>);
  octaves: number;
  /** Assignment is degrees; the historical getter returns radians. */
  sweep: number;
  depth: number;
  width: number;
  overlapping: number;
  get pie(): boolean;
  set pie(value: boolean | string);
  get synth(): boolean;
  set synth(value: boolean | string);
  synthGain: number;
  transitionTime: number;
  baseTone: number;
  baseKey: number;
  leftmostKey: number;
  frequencyProvider: FrequencyProvider;
  get pressedKeys(): number[];
  set pressedKeys(value: Iterable<number>);
  get litKeys(): number[];
  set litKeys(value: Iterable<number>);
  get pressedNotes(): number[];
  set pressedNotes(value: Iterable<number>);
  get litNotes(): number[];
  set litNotes(value: Iterable<number>);
  get hoveredKeys(): number[];
  set hoveredKeys(value: Iterable<number>);
  get hoveredNotes(): number[];
  set hoveredNotes(value: Iterable<number>);
  get keyLabels(): boolean;
  set keyLabels(value: boolean | string | Map<number, unknown> | Record<number, unknown>);
  labelFormat: 'note' | 'index' | 'pitch' | string | ((key: unknown) => unknown);

  readonly geometry: KeyboardGeometry;
  readonly geometryRevision: number;
  readonly updateComplete: Promise<void>;
  onRenderStats: ((stats: Readonly<RenderStats>) => void) | null;
  onRenderError: ((detail: RenderErrorDetail) => void) | null;

  whenRendered(): Promise<void>;
  updateState(patch?: KeyboardStatePatch): void;
  setOverlay(spec: KeyboardOverlay): void;
  removeOverlay(id: string | number): void;
  updateOverlays(specs: Iterable<KeyboardOverlay>): void;
  setOverlays(specs: Iterable<KeyboardOverlay>): void;
  setIndicator(id: string | number, spec: KeyboardIndicator): HTMLElement;
  removeIndicator(id: string | number): void;
  setLabel(spec: KeyboardLabel): void;
  removeLabel(id: string | number): void;
  updateLabels(specs: Iterable<KeyboardLabel>): void;
  setLabels(specs: Iterable<KeyboardLabel>): void;
  invalidateLayout(): void;
  getPositionForPitch(pitch: number, radius?: number): KeyboardPosition;
  getPositionForKey(key: number, radius?: number): KeyboardPosition;
  getAnchor(at: KeyLocation | NoteLocation, options?: AnchorOptions): AnchorResult;
  getAnchors(locations: Iterable<KeyLocation | NoteLocation>, options?: AnchorOptions): AnchorBatchResult;
  getNoteAtPoint(screenX: number, screenY: number):
    { index: number; note: number; raised: boolean } | null;

  addEventListener<K extends keyof AllAroundKeyboardEventMap>(
    type: K,
    listener: (this: AllAroundKeyboard, event: AllAroundKeyboardEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
}

export interface AnchorOptions {
  radius?: number;
  space?: 'viewBox' | 'client' | 'host';
}

export interface ProjectionSnapshot {
  revision: number;
  state?: KeyboardStatePatch;
  overlays?: Iterable<KeyboardOverlay>;
  indicators?: Iterable<ProjectedKeyboardIndicator>;
  labels?: Iterable<KeyboardLabel>;
}

export interface ProjectionOperations<T> {
  upsert?: Iterable<T>;
  remove?: Iterable<string | number>;
}

export interface ProjectionPatch {
  revision: number;
  state?: KeyboardStatePatch;
  overlays?: ProjectionOperations<KeyboardOverlay>;
  indicators?: ProjectionOperations<ProjectedKeyboardIndicator>;
  labels?: ProjectionOperations<KeyboardLabel>;
}

export type ProjectionResult = Readonly<
  | { status: 'applied'; kind: 'snapshot' | 'patch'; revision: number }
  | { status: 'stale'; revision: number; receivedRevision: number }
  | ({ status: 'gap'; requestedReset: boolean } & ProjectionGapDetail)
>;

export declare class KeyboardProjectionAdapter {
  constructor(keyboard: AllAroundKeyboard, options?: {
    onGap?: (detail: ProjectionGapDetail) => void;
  });
  readonly keyboard: AllAroundKeyboard;
  onGap: ((detail: ProjectionGapDetail) => void) | null;
  readonly revision: number | null;
  readonly gapPending: boolean;
  applySnapshot(snapshot: ProjectionSnapshot): ProjectionResult;
  applyPatch(patch: ProjectionPatch): ProjectionResult;
  dispose(options?: { remove?: boolean }): void;
}

export interface KeyLayoutDatum {
  index: number;
  note: number;
  frequency: number;
  raised: boolean;
  startAngle: number;
  endAngle: number;
}

export interface KeyLayout {
  (notes?: number[]): KeyLayoutDatum[];
  isRaised(value: ((key: number) => boolean) | boolean): KeyLayout;
  raisedPattern(value: number[]): KeyLayout;
  octaves(value: number): KeyLayout;
  startAngle(value: number | ((key: number) => number)): KeyLayout;
  endAngle(value: number | ((key: number) => number)): KeyLayout;
  frequency(value: FrequencyProvider): KeyLayout;
  octaveSize(value: number): KeyLayout;
  leftmostKey(value: number): KeyLayout;
  baseTone(value: number): KeyLayout;
  baseKey(value: number): KeyLayout;
  pie(value: boolean): KeyLayout;
}

export declare function keyLayout(): KeyLayout;
export declare function normalizeFrequencyProvider(value: FrequencyProvider): FrequencyProvider;
export declare function resolveKeyFrequency(
  provider: FrequencyProvider,
  key: number,
  context: FrequencyContext
): number;
export declare function calculateIndicatorPlacement(
  spec: IndicatorPlacementSpec,
  keyboardGeometry: KeyboardGeometry,
  keyParameters: ReadonlyMap<number, KeyGeometryParameters>,
  frameTransform: IndicatorFrameTransform,
  config: IndicatorPlacementConfig
): IndicatorPlacement | null;

export declare const VERSION: string;
export declare const KEYCLICK: 'keyclick';
export declare const KEYHOVER: 'keyhover';
export declare const KEYUNHOVER: 'keyunhover';
export declare const KEYPOINTERDOWN: 'keypointerdown';
export declare const KEYPOINTERUP: 'keypointerup';
export declare const KEYBOARDINTENT: 'keyboardintent';
export declare const PROJECTIONGAP: 'projectiongap';
export declare const RENDERERROR: 'rendererror';

declare global {
  interface HTMLElementTagNameMap {
    'all-around-keyboard': AllAroundKeyboard;
  }
}
