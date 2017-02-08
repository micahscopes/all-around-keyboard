import 'skatejs-web-components';
import 'shady-dom';
import { define, h, Component, prop } from 'skatejs';
// import { makeKeys } from './keyboard.js'
import { arc, pie } from 'd3-shape';
import { select, selectAll, namespaces } from 'd3-selection';

const audio = Symbol();
const shadowSVG = Symbol();

const css = `
all-around-keyboard {
  display: block;
  padding: 5px;
}
:host {
  display: block;
  padding: 5px;
}
.key {
  stroke-width: 1.5px;
}

.key--white { fill: #fff; stroke: #777; }
.key--black { fill: #333; stroke: #000; }
.key--white:hover { fill: yellow; stroke: #00999b; }
.key--black:hover { fill: yellow; stroke: #910099; }
`

customElements.define('all-around-keyboard', class extends Component {
  static get props () {
    return {
      // By declaring the property an attribute, we can now pass an initial value
      // for the count as part of the HTML.
      notesInOctave: prop.number({ attribute: true, default: 12 }),
      raisedKeys: prop.array  ({ attribute: true, default: [1,3,6,8,10] }),
      octaves: prop.number({ attribute: true, default: 2 }),
      sweep: prop.number({ attribute: true, default: 90,
        deserialize (val) {
          return val*Math.PI/180;
        },
        serialize (val) {
          return val*180/Math.PI;
        }
      }),
      thickness: prop.number({ attribute: true, default: 100 }),
      width: prop.number({ attribute: true, default: 500 }),
      overlapping: prop.number({ attribute: true, default: 2.75 })
    };
  }
  connectedCallback () {
    // Ensure we call the parent.
    super.connectedCallback();
    var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
    if (!AudioContext) return console.error("AudioContext not supported");
    if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
    if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;

    if(!window[audio]){
      window[audio] = new AudioContext;
    }

    this[audio] = window[audio];

    this[shadowSVG] = document.createElementNS(namespaces.svg,"svg");
    select(this[shadowSVG]).append("g");

  }

  disconnectedCallback () {
    // Ensure we callback the parent.
    super.disconnectedCallback();

    // If we didn't clean up after ourselves, we'd continue to render
    // unnecessarily.
    clearInterval(this[sym]);
  }

  renderCallback () {
    // By separating the strings (and not using template literals or string
    // concatenation) it ensures the strings are diffed indepenedently. If
    // you select "Count" with your mouse, it will not deselect whenr endered.
    return [h('div'),h('style',css)];
  }

  renderedCallback() {
    var elem = this;
    this.shadowRoot.children[0].appendChild(this[shadowSVG]);

    var outerRadius = this.width/(2*Math.sin(Math.min(this.sweep,Math.PI)/2));
    var chordLength = outerRadius*2*Math.sin(this.sweep/2);
    var innerRadius = outerRadius - this.thickness;
    var startAngle = -this.sweep/2;
    var endAngle = this.sweep/2;
    // sagitta, long and short
    var height;
    if(this.sweep > Math.PI) {
      height = outerRadius + Math.sqrt(Math.pow(outerRadius,2) - Math.pow(chordLength/2,2));
    } else {
      height = outerRadius - Math.sqrt(
        Math.pow(outerRadius,2) - Math.pow(chordLength/2,2)) + this.thickness*Math.cos(this.sweep/2)
    }


    var svg = select(this[shadowSVG])
        .attr("width", this.width)
        .attr("height", height)

    var g = svg
        .select("g")
        .attr("transform", "translate(" + (this.width / 2) + "," + outerRadius + ")");

    var keyPie = pie()
        .startAngle(startAngle)
        .endAngle(endAngle)
        .padAngle(3/outerRadius)
        .value(function() { return 1; })
        .sort(null);

    function makeKeys(numTones,octaves,raised) {
        var tones = [];
        for (i=1; i <= numTones*octaves; i++) {
          tones.push(i);
        }
        var isLowered = (k) => !raised.includes(k%numTones)
        var isRaised = (k) => raised.includes(k%numTones)

        var loweredKeys = keyPie(tones.filter(isLowered));
        var keyWidth = (endAngle - startAngle) / loweredKeys.length;
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

    var keyArc = arc()
        .cornerRadius(2)
        // .padRadius(function(d) { return d.sharp ? outerRadius : outerRadius - thickness; })
        .innerRadius(function(d) {
          return d.sharp ? innerRadius + elem.thickness/(elem.overlapping+2): innerRadius;
        })
        .outerRadius(function(d) {
          return d.sharp ? outerRadius : outerRadius - elem.thickness/(elem.overlapping+2);
        });


    // DATA JOIN
    // Join new data with old elements, if any.
    let keys = makeKeys(this.notesInOctave,this.octaves,this.raisedKeys);
    let keyboard = g.selectAll("path").data(keys);

    // EXIT
    // Remove old elements as needed.
    keyboard.exit().on(over,null).remove();

    // UPDATE
    // Update old elements as needed.
    // text.attr("class", "update");

    var over = ("ontouchstart" in window) ? "touchstart" : "mouseover";
    var out = ("ontouchstart" in window) ? "touchend" : "mouseout";


    // ENTER
    // Create new elements as needed.
    var context = this[audio];
    keyboard = keyboard.enter().append("path").merge(keyboard)
      .attr("class", function(d) { return "key key--" + (d.sharp ? "black" : "white"); })
      .attr("d", keyArc);


    keyboard.on(over, function(d, i) {
      console.log("hey!!!!");
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

  }
});
