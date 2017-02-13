# all-around keyboards
a web component for round pianos

### [demo](http://micahscopes.github.io/all-around-keyboard)

### example:
```html
<all-around-keyboard  notes-in-octave=12
                      raised-keys="[2,4,7,9,11]"
                      sweep=270 octaves=2
                      depth=100 width=500
                      overlapping=0.75>
</all-around-keyboard>
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
