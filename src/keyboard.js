var sweep = Math.PI;
var thickness = 200;
var overlapper = 2.75;
var width = 500;
// chord length, diameter
var outerRadius = width/(2*Math.sin(Math.min(sweep,Math.PI)/2));
var chordLength = outerRadius*2*Math.sin(sweep/2)
var innerRadius = outerRadius - thickness;

// sagitta, long and short
var height = sweep > Math.PI ?
                outerRadius + Math.sqrt(outerRadius**2 - (chordLength/2)**2) :
                outerRadius - Math.sqrt(outerRadius**2 - (chordLength/2)**2) + thickness*Math.cos(sweep/2)

// height += thickness;

var over = "ontouchstart" in window ? "touchstart" : "mouseover",
    out = "ontouchstart" in window ? "touchend" : "mouseout";

var pie = d3.layout.pie()
    .startAngle(-sweep/2)
    .endAngle(sweep/2)
    .padAngle(3/outerRadius)
    .value(function() { return 1; })
    .sort(null);

function stretchRepeat(ary, num)
{
    var result = [];
    for(var i=0;i<num;i++)
      result.push(ary[i%ary.length]);
    return result;
}

function makeKeys(numTones,octaves,raised) {
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

window.makeKeys = makeKeys

var arc = d3.svg.arc()
    .cornerRadius(2)
    // .padRadius(function(d) { return d.sharp ? outerRadius : outerRadius - thickness; })
    .innerRadius(function(d) { return d.sharp ? innerRadius + thickness/overlapper: innerRadius; });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
var g = svg.append("g")
    .attr("transform", "translate(" + width / 2 + "," + outerRadius + ")");

var keys = makeKeys(12,1,[2,4,7,9,11])

window.update = function(keys) {

  // DATA JOIN
  // Join new data with old elements, if any.
  let keyboard = svg.selectAll("path").data(keys);

  // UPDATE
  // Update old elements as needed.
  // text.attr("class", "update");

  // ENTER
  // Create new elements as needed.
  keyboard.enter().append("path")
  //
  // ENTER + UPDATE
  // After merging the entered elements with the update selection,
  // apply operations to both.
  keyboard
    .attr("class", function(d) { return "key key--" + (d.sharp ? "black" : "white"); })
    .attr("d", arc)


  // EXIT
  // Remove old elements as needed.
  keyboard.exit().remove();

  return keyboard
}

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

  window.update = function(keys) {

    // DATA JOIN
    // Join new data with old elements, if any.
    let keyboard = g.selectAll("path").data(keys);

    // UPDATE
    // Update old elements as needed.
    // text.attr("class", "update");

    // ENTER
    // Create new elements as needed.
    keyboard.enter().append("path")

    //
    // ENTER + UPDATE
    // After merging the entered elements with the update selection,
    // apply operations to both.
    keyboard
    .each(function(d, i) {
        d.outerRadius = d.sharp? outerRadius : outerRadius - thickness/overlapper;
        })
      .attr("class", function(d) { return "key key--" + (d.sharp ? "black" : "white"); })
      .attr("d", arc)

    svg.attr("viewBox", function(d){
      var bbox = this.getElementsByTagName('g')[0].getBBox();
      // return [-bbox.x, -bbox.y, bbox.width, bbox.height].join(" ");
    })

    keyboard.on(over + ".beep", function(d, i) {
      var now = context.currentTime,
          oscillator = context.createOscillator(),
          oscillator2 = context.createOscillator(),
          filter = context.createBiquadFilter(),
          gain = context.createGain();
      oscillator.type = "sawtooth";
      oscillator.frequency.value = d.frequency/2;
      oscillator.connect(filter);
      oscillator2.frequency.value = d.frequency;
      oscillator2.connect(gain);
      gain.gain.value = 0;
      gain.gain.linearRampToValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(.1, now + .05);
      gain.gain.linearRampToValueAtTime(0, now + 0.5);
      filter.frequency.value = d.frequency;
      filter.type = "bandpass";
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start(0);
      setTimeout(function() { oscillator.stop(); }, 4000);
    });

    // EXIT
    // Remove old elements as needed.
    keyboard.exit().on(over+".beep",null).remove();

    return keyboard
  }

  var keyboard = window.update(keys);

})();
