const TwelveTones = [1,2,3,4,5,6,7,8,9,10,11,12];
const Pentatonic = [2,4,7,9,11];

function constant(x) {
  return function constant() {
    return x;
  };
}

export const keyLayout = function(){
  let octaves = 1;
  let octaveSize = 12;
  let raisedPattern = Pentatonic;
  let isRaised;
  let startAngle = constant(-Math.PI);
  let endAngle = constant(Math.PI);
  let frequency;
  //
  function keyLayout(notes) {
    if (!notes) {
      for (var i = 0, notes = []; i<octaveSize; i++) {notes.push(i+1)}
    }
    if (!isRaised){
      isRaised = k => raisedPattern.includes(k);
    }
    if (!frequency) {
      frequency = (k) => 440 * Math.pow(2, (k - 9) / notes.length)
    }

    let raisedPatternOctaves = Math.ceil(Math.max.apply(Math,raisedPattern)/notes.length);
    let allKeys = [], raisedKeys = [], lowerKeys = [];
    let lowerCount = 0;
    let k,l;
    for(k=0; k<notes.length*octaves; k++){
      if(!isRaised((k+1)%(raisedPatternOctaves*notes.length))) {lowerCount++;}
    }

    for(k = 0, l = 0; k < notes.length*octaves; k++) {
      let diffAngle = (endAngle(k)-startAngle(k))/lowerCount;
      let key = { note: notes[k%notes.length], index: k+1 }
      key.frequency = frequency(key.index)
      if(isRaised(key.index%(raisedPatternOctaves*notes.length))) {
        key.startAngle = startAngle(k) + diffAngle * (l - .5 + 0.15);
        key.endAngle = startAngle(k) + diffAngle * (l + 0.5 - 0.15);
        key.raised = true;
        raisedKeys.push(key);
      } else {
        key.startAngle = startAngle(k) + l*diffAngle;
        key.endAngle = key.startAngle + diffAngle;
        key.raised = false;
        lowerKeys.push(key);
        l++;
      }
    }
    return lowerKeys.concat(raisedKeys);
  }

  // for (var i = 0, n = numTones*octaves; i < n; ++i) {
  //   keys[i].frequency = 440 * Math.pow(2, (i - 9) / numTones); // 0 is middle C
  // }


  //  let isRaised = k => raisedPattern.includes(k);
  keyLayout.isRaised = function(_){
    if (arguments.length) { isRaised = typeof _ === "function" ? _ : constant(_) }
    return keyLayout;
  };

  // let raisedPattern = Pentatonic;
  keyLayout.raisedPattern = function(_) {
    if (_ && _.length) { raisedPattern = _ }
    return keyLayout;
  };

  //  let octaves = 1;
  keyLayout.octaves = function(_) {
    if (typeof _ === "number") { octaves = _ }
    return keyLayout;
  };

  // let startAngle = constant(-Math.PI);
  keyLayout.startAngle = function(_) {
    if (arguments.length) { startAngle = typeof _ === "function" ? _ : constant(_) }
    return keyLayout;
  };

  // let frequency;
  keyLayout.frequency = function(_) {
    if (arguments.length) { frequency = typeof _ === "function" ? _ : constant(_) }
    return keyLayout;
  };

  // let endAngle = constant(Math.PI);
  keyLayout.endAngle = function(_) {
    if (arguments.length) { endAngle = typeof _ === "function" ? _ : constant(_) }
    return keyLayout;
  };

  keyLayout.octaveSize = function(_) {
    if (typeof _ === "number") { octaveSize = _ }
    return keyLayout;
  }

  return keyLayout;
}