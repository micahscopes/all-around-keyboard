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
  let now = context.currentTime;
  key.gain = context.createGain();
  key.gain.gain.value = 0.000001;
  key.gain.connect(context.destination);
  key.filter = context.createBiquadFilter();
  key.filter.frequency.value = frequency;
  key.filter.type = "bandpass";

  key.filter.connect(key.gain);
  if (key.oscillator){
    key.oscillator.stop(now+0.4)
  };
  if (key.oscillator2){
    key.oscillator2.stop(now+0.4);
  };
  key.oscillator = context.createOscillator();
  key.oscillator2 = context.createOscillator();
  key.oscillator.type = "sawtooth";
  key.oscillator.frequency.value = frequency/2;
  key.oscillator.connect(key.filter);
  key.oscillator2.frequency.value = frequency;
  key.oscillator2.connect(key.gain);
  // key.gain.gain.linearRampToValueAtTime(0.05, context.currentTime + 0.05);
  // key.gain.gain.exponentialRampToValueAtTime(0.05, context.currentTime + 0.1);
  key.gain.gain.setTargetAtTime(0.05, context.currentTime, 0.04);
  key.oscillator.start(now);
  key.oscillator2.start(now);
  key.oscillator.stop(now + 40);
  key.oscillator2.stop(now + 40);
}

function dampKey(key) {
  let decay = 0.3;
  // console.log("tone off!!!!");
  let context = window[LILSYNTH];
  if (key.gain){
    key.gain.gain.setTargetAtTime(0.000001, context.currentTime, 0.05);
  }
  if(key.oscillator) key.oscillator.stop(context.currentTime + decay*2);
  if(key.oscillator2) key.oscillator2.stop(context.currentTime + decay*2);
}


export { setupLilSynth, soundKey, dampKey };
