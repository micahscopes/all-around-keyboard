import 'skatejs-web-components';
import { define, h, Component, prop, emit } from 'skatejs';
import { keyLayout } from './key-layout'
import { arc, pie } from 'd3-shape';
import { setupLilSynth, soundKey, dampKey } from './lil-synth'
import { select, selectAll, namespaces } from 'd3-selection';

const KEYBOARD = Symbol();
const KEYS = Symbol();
const shadowSVG = Symbol();

const SVGStrokePadding = 5;

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

.key--pressed,
.key--highlight.key--pressed.key--upper,
.key--highlight.key--pressed.key--lower
  { fill: yellow; }

.key--highlight {
    stroke: #0095ff;
    stroke-width: 5px;
}

.key--highlight.key--lower { fill: #eee }
.key--highlight.key--upper { fill: #444 }
`

function setupKeyboard(){
  var elem = this; //make sure to bind elem to this function
  var outerRadius = (this.width-SVGStrokePadding*2)/(2*Math.sin(Math.min(this.sweep,Math.PI)/2));
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
  height += SVGStrokePadding;

  var svg = select(this[shadowSVG])
      .attr("viewBox", "0 0 "+this.width+" "+height)
      .attr("width","100%")

  var g = svg
      .select("g")
      .attr("transform", "translate(" + (this.width / 2) + "," + (outerRadius + SVGStrokePadding/2) + ")");

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
  this[KEYS] = keyLayout()
            .octaves(this.octaves)
            .raisedPattern(this.raisedNotes)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .octaveSize(this.notesInOctave)

  this[KEYBOARD] = g.selectAll("path").data(this[KEYS]);

  // EXIT
  this[KEYBOARD].exit().on(KEYPRESS,null).remove();

  // ENTER
  // var context = this[AUDIO];
  this[KEYBOARD] = this[KEYBOARD].enter().append("path").merge(this[KEYBOARD])
    .attr("class", function(d) {
      return "key key--" + (d.raised ? "upper" : "lower");
    })
    .attr("d", drawKeys);
}

const multiEmitter = (elem,eventName,indexName) => {
  return (Ks) => {
    Ks = [].concat(...[Ks]);
    Ks.forEach((k) => {
      var e = new Event(eventName); e[indexName] = k;
      elem.dispatchEvent(e)}
    )
      // let o = {detail:{}};
      // o.detail[indexName] = k
      // emit(elem,eventType,o);
  } ;
}

const KEYPRESS = 'keypress';
const KEYRELEASE = 'keyrelease';
const KEYLIGHT = 'keylight';
const KEYDIM = 'keydim';
const NOTELIGHT = 'notelight';
const NOTEDIM = 'notedim';

const KeyboardElement = customElements.define('all-around-keyboard', class extends Component {
  keysPress = multiEmitter(this,KEYPRESS,'index');
  keysRelease = multiEmitter(this,KEYRELEASE,'index');
  keysLight = multiEmitter(this,KEYLIGHT,'index');
  keysDim = multiEmitter(this,KEYDIM,'index');
  notesLight = multiEmitter(this,NOTELIGHT,'note');
  notesDim = multiEmitter(this,NOTEDIM,'note');

  static get props () {
    return {
      // By declaring the property an attribute, we can now pass an initial value
      // for the count as part of the HTML.
      notesInOctave: prop.number({ attribute: true, default: 12 }),
      raisedNotes: prop.array  ({ attribute: true, default: [2,4,7,9,11] }),
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
    setupLilSynth();

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
    return [h('div'),h('style',css)];
  }

  renderedCallback() {
    this.shadowRoot.children[0].appendChild(this[shadowSVG]);

    setupKeyboard.call(this);

    this.addEventListener(KEYPRESS,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--pressed",true)
      .dispatch(KEYPRESS);
    })

    this.addEventListener(KEYRELEASE,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index).classed("key--pressed",false)
      .dispatch(KEYRELEASE);
    })

    this.addEventListener(KEYLIGHT,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--highlight",true)
      .dispatch(KEYLIGHT);
    })

    this.addEventListener(KEYDIM,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index).classed("key--highlight",false)
      .dispatch(KEYDIM);
    })

    this.addEventListener(NOTELIGHT,function(e){
      this[KEYBOARD].filter((d)=>d.note == e.note)
      .classed("key--highlight",true)
      .dispatch(NOTELIGHT);
    })

    this.addEventListener(NOTEDIM,function(e){
      this[KEYBOARD].filter((d)=>d.note == e.note).classed("key--highlight",false)
      .dispatch(NOTEDIM);
    })

    var over = ("ontouchstart" in window) ? "touchstart" : "mouseover";
    var out = ("ontouchstart" in window) ? "touchend" : "mouseout";

    this[KEYBOARD]
      .on(over, (d) => {
        var e = new Event(KEYPRESS); e.index = d.index;
        this.dispatchEvent(e)})
      .on(out, (d) => {
        var e = new Event(KEYRELEASE); e.index = d.index;
        this.dispatchEvent(e)})

    this[KEYBOARD].on(KEYPRESS, function(d,i){soundKey(this,d.frequency)});
    this[KEYBOARD].on(KEYRELEASE, function(d,i){dampKey(this)});


  }
});

export { KeyboardElement, keyLayout };
