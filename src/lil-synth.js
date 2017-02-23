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
  let now = context.currentTime;
  if (!key.gain) {
    key.gain = context.createGain();
    key.gain.connect(context.destination);
    key.gain.gain.linearRampToValueAtTime(0, now + .02);
  }
  if (!key.filter) {
    key.filter = context.createBiquadFilter();
    key.filter.frequency.value = frequency;
    key.filter.type = "bandpass";
    key.filter.connect(key.gain);
  }
  if (key.oscillator){
    key.oscillator.stop(now+2)
  };
  if (key.oscillator2){
    key.oscillator2.stop(now+2);
  };
  key.oscillator = context.createOscillator();
  key.oscillator2 = context.createOscillator();
  key.oscillator.type = "sawtooth";
  key.oscillator.frequency.value = frequency/2;
  key.oscillator.connect(key.filter);
  key.oscillator2.frequency.value = frequency;
  key.oscillator2.connect(key.gain);
  key.gain.gain.linearRampToValueAtTime(.05, now + .05);
  // key.gain.gain.linearRampToValueAtTime(0.005, now + 5);
  key.oscillator.start(now+0.02);
  key.oscillator2.start(now+0.02);
  key.oscillator.stop(now + 40);
  key.oscillator2.stop(now + 40);
}

function dampKey(key) {
  let context = window[LILSYNTH];
  let now = context.currentTime;
  if (key.gain){ key.gain.gain.linearRampToValueAtTime(0, now + 0.3); }
  if(key.oscillator) key.oscillator.stop(now + 2);
  if(key.oscillator2) key.oscillator2.stop(now + 2);
}


export { setupLilSynth, soundKey, dampKey };
