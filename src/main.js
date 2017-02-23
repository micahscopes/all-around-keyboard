import 'skatejs-web-components';
import { define, h, Component, prop, emit } from 'skatejs';
import { keyLayout } from './key-layout'
import { arc } from 'd3-shape';
import { transition } from 'd3-transition';
import { interpolate } from 'd3-interpolate';
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
            .raisedPattern(this.raisedNotes)
            .startAngle(startAngle)
            .endAngle(endAngle)
            .octaveSize(this.notesInOctave)
            .pie(this.pie)

  let kbData = g.selectAll("path").data(this[KEYS]);//,(d)=>d.index);

  // EXIT
  kbData.exit()
  .on(KEYPRESS,null)
  .on(KEYRELEASE,null)
  .on(HOVEROVER,null)
  .on(HOVEROUT,null)
  .remove();

  // ENTER
  let kb = kbData.enter()
  .append("path")
  .attr("d",function(d){
    var k = drawKeys(d)
    this._current = k;
    return k;
  })
  .merge(kbData)


  // UPDATE (ANIMATE)
  transition("morph").duration(750);

  function animateKeys(d) {
    let thing = this;
    let i = interpolate(this._current,drawKeys(d));
    return function(t){
      thing._current = i(t);
      return thing._current;
    }
  }

  kbData.transition("morph").attrTween("d", animateKeys)
  // .each(function(d) { this._current = d; })

  this[KEYBOARD] = kb;
  updateKeyClasses.call(this);

  kb.on(HOVEROVER, (d) => {
    var e = new Event(KEYPRESS); e.index = d.index;
    // console.log(d);
    this.dispatchEvent(e)})
  .on(HOVEROUT, (d) => {
    var e = new Event(KEYRELEASE); e.index = d.index;
    this.dispatchEvent(e)})

  let kbElem = this;

  kb.on(KEYPRESS, function(d,i){
    if(kbElem.synth) {soundKey(this,d.frequency)} })
  .on(KEYRELEASE, function(d,i){
    if(kbElem.synth) {dampKey(this)} }
  );
}

function updateKeyClasses(){
  this[KEYBOARD]
  .classed("key",true)
  .classed("key--upper",(d)=>d.raised)
  .classed("key--lower",(d)=>!d.raised)
  .classed("key--pressed",(d)=> this[pressedKeys].has(d.index))
  .classed("key--highlight",(d)=> ( this[litKeys].has(d.index) ||
                                    this[litNotes].has(d.note)
                                  ));

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
const HOVEROUT = "touchend mouseout";

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

  static get props () {
    return {
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
      overlapping: prop.number({ attribute: true, default: 0.5 }),
      pie: prop.boolean({attribute: true, default: false}),
      synth: prop.boolean({attribute: true, default: false})
    };
  }
  connectedCallback () {
    // Ensure we call the parent.
    super.connectedCallback();
    setupLilSynth();

    this[pressedKeys] = new Set();
    this[litKeys] = new Set();
    this[litNotes] = new Set();

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
