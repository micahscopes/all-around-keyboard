# all-around keyboards
a web component for round pianos

### [demo](http://micahscopes.github.io/all-around-keyboard)

## usage:
```html
<script src=".../all-around-keyboard.min.js"></src>

<all-around-keyboard  notes-in-octave=12
                      raised-notes="[2,4,7,9,11]"
                      sweep=270 octaves=2
                      depth=100 width=500
                      overlapping=0.75>
</all-around-keyboard>
```

### Pressing and releasing keys
``` javascript
// select the keyboard
let kb = document.querySelector('all-around-keyboard');

kb.keysPress([2,6,9,11,18])
setTimeout(() => { kb.keysRelease([2,6,9,11,18]) }, 4000);
```

### Lighting and dimming keys
``` javascript
kb.keysLight([2,6,9,11,18])
setTimeout(() => { kb.keysDim([2,6,9,11,18]) }, 4000);
```

### Lighting and dimming notes (pitch classes)
``` javascript
kb.notesLight([2,4,6,7,9,11,1])
setTimeout(() => { kb.notesDim([2,4,6,7,9,11,1]) }, 4000);
```

#### dreams and schemes:
- midi events
- note and x/y events
- multitouch support
- synthesis
  1. enable/disable
  2. gain
  3. integrate with [this badass dx7 emulator](https://github.com/mmontag/dx7-synth-js)
- more styles
- fix bugs
- and so much more (?)

#### *inspired by mbostock's example for d3: https://bl.ocks.org/mbostock/5723d93e4f617b542991*
