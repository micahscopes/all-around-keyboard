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

export {
  setupLilSynth,
  soundKey,
  dampKey,
  releaseLilSynthKey,
  disposeLilSynth
};
