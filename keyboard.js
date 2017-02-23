var width = 600,
    height = 600,
    outerRadius = height/2-50;
    innerRadius = outerRadius / 3;

var over = "ontouchstart" in window ? "touchstart" : "mouseover",
    out = "ontouchstart" in window ? "touchend" : "mouseout";

var pie = d3.layout.pie()
    .startAngle(-Math.PI/2)
    .endAngle(3*Math.PI/2)
    .padAngle(.01)
    .value(function() { return 1; })
    .sort(null);

function stretchRepeat(ary, num)
{
    var result = [];
    for(var i=0;i<num;i++)
      result.push(ary[i%ary.length]);
    return result;
}

function keyboard(numTones,octaves,raised) {
  var tones = [...Array(numTones*octaves).keys()].map(t => t+1);
  var isLowered = (k) => !raised.includes(k%numTones)
  var isRaised = (k) => raised.includes(k%numTones)

  var loweredKeys = pie(tones.filter(isLowered));
  var keyWidth = (pie.endAngle() - pie.startAngle()) / loweredKeys.length;
  var raisedKeys = [];

  for (var i = 0, n = loweredKeys.length; i < n; i++) {
    var k = loweredKeys[i];
    if (isRaised(k.data+1)) {
      raisedKeys.splice(i, 0, {
        data: k.data+1,
        startAngle: k.startAngle + keyWidth * (.5 + .15),
        endAngle: k.endAngle + keyWidth * (.5 - .15),
        padAngle: k.padAngle,
        sharp: true
      });
    }
    k.sharp = false;
  }
  var keys = raisedKeys.concat(loweredKeys).sort((a,b) => a.data - b.data);
  for (var i = 0, n = numTones*octaves; i < n; ++i) {
    keys[i].frequency = 440 * Math.pow(2, (i - 9) / numTones); // 0 is middle C
  }

  return keys.sort(function(a, b) { return a.sharp - b.sharp; });
}

var arc = d3.svg.arc()
    .cornerRadius(4)
    .padRadius(function(d) { return d.sharp ? outerRadius + 80 : outerRadius; })
    .innerRadius(function(d) { return d.sharp ? innerRadius + 80 : innerRadius; });

var svg = d3.select("body").append("svg")
    .attr("viewBox", "0 0 "+width+" "+height)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height/2 + ")");

var key = svg.selectAll("path")
    .data(keyboard(12,1,[2,5,7,9,11]))
  .enter().append("path")
    .each(function(d, i) {
      d.outerRadius = outerRadius - 40;
      if(d.sharp){ d.outerRadius += 80};
      })
    .attr("class", function(d) { return "key key--" + (d.sharp ? "black" : "white"); })
    .attr("d", arc)
    /*.on(over, function(d){arcTween(outerRadius, 0)})
    .on(out, arcTween(outerRadius - 20, 150));*/

function arcTween(outerRadius, delay) {
  return function() {
    d3.event.preventDefault();
    d3.select(this).transition().delay(delay).attrTween("d", function(d) {
      var i = d3.interpolate(d.outerRadius, outerRadius);
      return function(t) { d.outerRadius = i(t); return arc(d); };
    });
  };
}

(function() {
  var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
  if (!AudioContext) return console.error("AudioContext not supported");
  if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
  if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;

  var context = new AudioContext;

  key.on(over + ".beep", function(d, i) {
    console.log("hey!");
    var now = context.currentTime,
        oscillator = context.createOscillator(),
        gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = d.frequency;
    gain.gain.linearRampToValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.4, now + .05);
    gain.gain.linearRampToValueAtTime(0, now + 0.2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(0);
    setTimeout(function() { oscillator.stop(); }, 1500);
  });
})();
