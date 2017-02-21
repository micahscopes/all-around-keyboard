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
  // console.log(d,i,"hey!!!!");
  let context = window[LILSYNTH];
  let now = context.currentTime,
      oscillator = context.createOscillator(),
      oscillator2 = context.createOscillator(),
      filter = context.createBiquadFilter(),
      gain = context.createGain();
  oscillator.type = "sawtooth";
  oscillator.frequency.value = frequency/2;
  oscillator.connect(filter);
  oscillator2.frequency.value = frequency;
  oscillator2.connect(gain);
  gain.gain.value = 0;
  gain.gain.linearRampToValueAtTime(.1, now + .05);
  gain.gain.linearRampToValueAtTime(0.005, now + 5);
  key.gain = gain;
  filter.frequency.value = frequency;
  filter.type = "bandpass";
  filter.connect(gain);
  gain.connect(context.destination);
  oscillator.start(0);
  key.oscillator = oscillator;
  setTimeout(function() { oscillator.stop(); }, 10000);
}

function dampKey(key) {
  let context = window[LILSYNTH];
  let now = context.currentTime;
  let oscillator = key.oscillator;
  key.gain.gain.linearRampToValueAtTime(0, now + 0.3);
  setTimeout(function() { oscillator.stop(); }, 500);
}


export { setupLilSynth, soundKey, dampKey };
