import 'skatejs-web-components';
import { define, h, Component, prop, emit } from 'skatejs';
import { keyLayout } from './key-layout'
import { arc } from 'd3-shape';
import { transition } from 'd3-transition';
import { interpolate } from 'd3-interpolate';
import { setupLilSynth, soundKey, dampKey } from './lil-synth'
import { select, selectAll, namespaces, event as currentEvent } from 'd3-selection';

const KEYBOARD = Symbol();
const KEYS = Symbol();

const currentKeyPositions = Symbol();
const shadowSVG = Symbol();

const SVGStrokePadding = 15;

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
  { fill: deeppink; }

.key--highlight {
  stroke: rgba(0, 91, 255, 0.73);
  stroke-width: 5.5px;
  // fill: url(#diagonalHatch);
  // stroke-dasharray: 8,2;
}

.key--highlight.key--lower { fill: rgb(215, 237, 249) }
.key--highlight.key--upper { fill: #495b96 }
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
  window.select = select;
  var svg = this[shadowSVG]

  svg.attr("viewBox","0 0 "+this.width+" "+height)

  var g = svg
      .select("g")
      .attr("transform", "translate(" + (this.width / 2) + "," + (outerRadius + SVGStrokePadding/2) + ")");

  var drawKeys = arc()
      .cornerRadius(2)
      // .padRadius(function(d) { return d.sharp ? outerRadius : outerRadius - depth; })
      .innerRadius(function(d) {
        return d.raised ? innerRadius + elem.depth/(Math.tan(elem.overlapping*Math.PI/2)+2): innerRadius;
      })
      .outerRadius(function(d) {
        return d.raised ? outerRadius : outerRadius - elem.depth/(Math.tan(elem.overlapping*Math.PI/2)+2);
      })

  // DATA JOIN
  this[KEYS] = keyLayout()
            .octaves(this.octaves)
            .leftmostKey(this.leftmostKey)
            .baseTone(this.baseTone)
            .baseKey(this.baseKey)
            .raisedPattern(this.raisedNotes)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .octaveSize(this.notesInOctave)
            .pie(this.pie)

  let kbAll = g.selectAll("path").data(this[KEYS])
  // .sort((a,b) => (!a.raised && b.raised ? -1 : 1) );

  let kbLower = kbAll.filter((d)=>!d.raised)
  let kbUpper = kbAll.filter((d)=>d.raised)

  // EXIT
  kbAll.exit()
  .on(KEYPRESS,null)
  .on(HOVEROVER,null)
  .remove();

  kbAll.enter().filter((d)=>d.raised).raise()

  let kb = kbAll.enter()
  .append("path").classed("key",true)
  .attr("d",function(d){
    var k = drawKeys(d)
    elem[currentKeyPositions][d.index] = k;
    return k;
  }).merge(kbAll)

  this[KEYBOARD] = kb;

  kb.classed("key--pressed",(d)=> this[pressedKeys].has(d.index))
  .classed("key--highlight",(d)=> ( this[litKeys].has(d.index) ||
                                    this[litNotes].has(d.note)
                                  ));
  // UPDATE (ANIMATE)
  transition("morph");

  function animateKeys(d,k) {
    let thing = this;
    let i = interpolate(elem[currentKeyPositions][d.index],drawKeys(d));
    return function(t){
      elem[currentKeyPositions][d.index] = i(t);
      return elem[currentKeyPositions][d.index];
    }
  }

  if(this.transitionTime > 0){
    kbAll
    .transition("morph")
    .attrTween("d", animateKeys)
    .duration(this.transitionTime)
  } else {
    kb.attr("d",function(d){
      var k = drawKeys(d)
      elem[currentKeyPositions][d.index] = k;
      return k;
    })
  }

  kb
  .classed("key--upper",(d)=>d.raised)
  .classed("key--lower",(d)=>!d.raised)
  .filter((d)=>d.raised).raise()

  kb.on(HOVEROVER, (d) => {
    currentEvent.preventDefault();
    var e = new Event(KEYPRESS); e.index = d.index;
    this.dispatchEvent(e)}, true)
  .on(HOVEROUT, (d) => {
    currentEvent.preventDefault();
    var e = new Event(KEYRELEASE); e.index = d.index;
    this.dispatchEvent(e)}, true)

  kb.on(KEYPRESS, function(d,i){
    if(elem.synth) {soundKey(this,d.frequency)} })
  .on(KEYRELEASE, function(d,i){
    if(elem.synth) {dampKey(this)} }
  )
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
const HOVEROVER = "touchstart mouseover";
const HOVEROUT = "touchend mouseout mouseup";

const pressedKeys = Symbol();
const litKeys = Symbol();
const litNotes = Symbol();

const KeyboardElement = customElements.define('all-around-keyboard', class extends Component {
  keysPress = multiEmitter(this,KEYPRESS,'index');
  keysRelease = multiEmitter(this,KEYRELEASE,'index');
  keysLight = multiEmitter(this,KEYLIGHT,'index');
  keysDim = multiEmitter(this,KEYDIM,'index');
  notesLight = multiEmitter(this,NOTELIGHT,'note');
  notesDim = multiEmitter(this,NOTEDIM,'note');
  panic = function(){
    this.keysRelease(this[pressedKeys])
  }

  static get props () {
    return {
      notesInOctave: prop.number({ attribute: true, default: 12 }),
      raisedNotes: prop.array  ({ attribute: true, default: [1,3,6,8,10] }),
      octaves: prop.number({ attribute: true, default: 2 }),
      sweep: prop.number({ attribute: true, default: Math.PI/2,
        deserialize (val) {
          return val*Math.PI/180;
        },
        serialize (val) {
          return val*180/Math.PI;
        }
      }),
      depth: prop.number({ attribute: true, default: 100 }),
      width: prop.number({ attribute: true, default: 500 }),
      overlapping: prop.number({ attribute: true, default: 0.5 }),
      pie: prop.boolean({attribute: true, default: false}),
      synth: prop.boolean({attribute: true, default: false}),
      transitionTime: prop.number({attribute: true, default: 750}),
      baseTone: prop.number({attribute: true, default: 32.70375}),
      baseKey: prop.number({attribute: true, default: 0}),
      leftmostKey: prop.number({attribute: true, default: 3*12})
    };
  }
  connectedCallback () {
    // Ensure we call the parent.
    super.connectedCallback();
    setupLilSynth();

    this[pressedKeys] = new Set();
    this[litKeys] = new Set();
    this[litNotes] = new Set();

    this[currentKeyPositions] = {};

    this.addEventListener(KEYPRESS,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--pressed",true)
      .dispatch(KEYPRESS);

      this[pressedKeys].add(e.index);
    })

    this.addEventListener(KEYRELEASE,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--pressed",false)
      .dispatch(KEYRELEASE);

      this[pressedKeys].delete(e.index);
    })

    this.addEventListener(KEYLIGHT,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--highlight",true)
      .dispatch(KEYLIGHT);

      this[litKeys].add(e.index);
    })

    this.addEventListener(KEYDIM,function(e){
      this[KEYBOARD].filter((d)=>d.index == e.index)
      .classed("key--highlight",false)
      .dispatch(KEYDIM);

      this[litKeys].delete(e.index);
    })

    this.addEventListener(NOTELIGHT,function(e){
      this[KEYBOARD].filter((d)=>d.note == e.note)
      .classed("key--highlight",true)
      .dispatch(NOTELIGHT);

      this[litNotes].add(e.note);
    })

    this.addEventListener(NOTEDIM,function(e){
      this[KEYBOARD].filter((d)=>d.note == e.note)
      .classed("key--highlight",false)
      .dispatch(NOTEDIM);

      this[litNotes].delete(e.note);
    })
  }

  disconnectedCallback () {
    super.disconnectedCallback();

    // todo: cleanup, cleanup... (everybody do your share!)
    //        ...i.e. clearInterval(this[sym]);
  }

  renderCallback () {
    return [h('div'),h('style',css)];
  }

  renderedCallback() {
    if(!this[shadowSVG]) {
      this[shadowSVG] = select(this.shadowRoot.children[0])
      .append("svg")
      .attr("width","100%");

      this[shadowSVG].append("g");
    }
    this.shadowRoot.children[0].appendChild(this[shadowSVG].node());

    setupKeyboard.call(this);
  }
});

export {  KeyboardElement, keyLayout,
          KEYPRESS, KEYRELEASE, KEYLIGHT, KEYDIM, NOTELIGHT, NOTEDIM  };
