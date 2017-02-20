import 'skatejs-web-components';
import { define, h, Component, prop } from 'skatejs';
import { keyLayout } from './key-layout.js'
import { arc, pie } from 'd3-shape';
import { select, selectAll, namespaces } from 'd3-selection';

const audio = Symbol();
const shadowSVG = Symbol();

const KEYPRESS = 'keypress';
const KEYRELEASE = 'keyrelease'
var keyNoteClass = (n) => 'key--note-'+n;
var keyIndexClass = (n) => 'key--index-'+n;

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

.key--lower { fill: #fff; stroke: #777; }
.key--upper { fill: #333; stroke: #000; }
.key--pressed { fill: yellow; stroke: #00999b; }
`

const KeyboardElement = customElements.define('all-around-keyboard', class extends Component {
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
      depth: prop.number({ attribute: true, default: 100 }),
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
    var innerRadius = outerRadius - this.depth;
    var startAngle = -this.sweep/2;
    var endAngle = this.sweep/2;
    // sagitta, long and short
    var height;
    if(this.sweep > Math.PI) {
      height = outerRadius + Math.sqrt(Math.pow(outerRadius,2) - Math.pow(chordLength/2,2));
    } else {
      height = outerRadius - Math.sqrt(
        Math.pow(outerRadius,2) - Math.pow(chordLength/2,2)) + this.depth*Math.cos(this.sweep/2)
    }


    var svg = select(this[shadowSVG])
        .attr("width", this.width)
        .attr("height", height)

    var g = svg
        .select("g")
        .attr("transform", "translate(" + (this.width / 2) + "," + outerRadius + ")");

    var drawKeys = arc()
        .cornerRadius(2)
        // .padRadius(function(d) { return d.sharp ? outerRadius : outerRadius - depth; })
        .innerRadius(function(d) {
          return d.raised ? innerRadius + elem.depth/(elem.overlapping+2): innerRadius;
        })
        .outerRadius(function(d) {
          return d.raised ? outerRadius : outerRadius - elem.depth/(elem.overlapping+2);
        });

    // DATA JOIN
    let keys = keyLayout()
              .octaves(this.octaves)
              .raisedPattern(this.raisedKeys)
              .startAngle(startAngle)
              .endAngle(endAngle)
              .octaveSize(this.notesInOctave)

    // let keys = layoutKeys(this.notesInOctave,this.octaves,this.raisedKeys,startAngle,endAngle,outerRadius);
    let keyboard = g.selectAll("path").data(keys);

    // EXIT
    keyboard.exit().on(KEYPRESS,null).remove();

    // UPDATE
    var over = ("ontouchstart" in window) ? "touchstart" : "mouseover";
    var out = ("ontouchstart" in window) ? "touchend" : "mouseout";

    // ENTER
    var context = this[audio];
    keyboard = keyboard.enter().append("path").merge(keyboard)
      .attr("class", function(d) {
        return "key key--" + (d.raised ? "upper" : "lower")
        + " " + keyNoteClass(d.note)
        + " " + keyIndexClass(d.index);
      })
      .attr("d", drawKeys);

    this.addEventListener(KEYPRESS,function(e){
      keyboard.filter("."+keyIndexClass(e.index))
      .classed("key--pressed",true)
      .dispatch(KEYPRESS);
    })

    this.addEventListener(KEYRELEASE,function(e){
      keyboard.filter("."+keyIndexClass(e.index)).classed("key--pressed",false)
      .dispatch(KEYRELEASE);
    })


    keyboard
      .on(over, (d) => {
        var e = new Event(KEYPRESS); e.index = d.index;
        this.dispatchEvent(e)})
      .on(out, (d) => {
        var e = new Event(KEYRELEASE); e.index = d.index;
        this.dispatchEvent(e)})

    keyboard.on(KEYPRESS, function(d, i) {
      // console.log(d,i,"hey!!!!");
      let now = context.currentTime,
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
      gain.gain.linearRampToValueAtTime(.1, now + .05);
      gain.gain.linearRampToValueAtTime(0.005, now + 5);
      this.gain = gain;
      filter.frequency.value = d.frequency;
      filter.type = "bandpass";
      filter.connect(gain);
      gain.connect(context.destination);
      oscillator.start(0);
      this.oscillator = oscillator;
      setTimeout(function() { oscillator.stop(); }, 10000);
    });

    keyboard.on(KEYRELEASE, function(d, i) {
      let now = context.currentTime;
      let oscillator = this.oscillator;
      this.gain.gain.linearRampToValueAtTime(0, now + 0.2);
      setTimeout(function() { oscillator.stop(); }, 500);
    });


  }
});

export { KeyboardElement, keyLayout };
