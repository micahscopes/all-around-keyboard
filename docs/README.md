# all-around keyboards
a web component for round pianos

### [demo](http://micahscopes.github.io/all-around-keyboard)

### example:
```html
<all-around-keyboard  notes-in-octave=12
                      raised-keys="[2,4,7,9,11]"
                      sweep=270 octaves=2
                      thickness=100 width=500
                      overlapping=0.75>
</all-around-keyboard>
```

#### todo:
- midi and events
- synthesis options
  1. enable/disable
  2. gain
- style options
- state (?)

### *inspired by mbostock's [arc piano example for d3](https://bl.ocks.org/mbostock/5723d93e4f617b542991) *

<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,4,7,9,11]"
                      sweep=4 octaves="3"
                      thickness="100" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,5,7,9,11]"
                      sweep=4 octaves="3"
                      thickness="100" width="500"
                      overlapping="0.75">
</all-around-keyboard>


<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,4,7,9,11]"
                      sweep=180 octaves="2"
                      thickness="130" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,4,7,9,11]"
                      sweep=360 octaves="2"
                      thickness="200" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,4,7,9,11]"
                      sweep=360 octaves="1"
                      thickness="200" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="12"
                      raised-keys="[2,5,7,9,11]"
                      sweep=120 octaves="2"
                      thickness="200" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="16"
                      raised-keys="[2,4,6,9,11,13,15]"
                      sweep=270 octaves="2"
                      thickness="220" width="500"
                      overlapping="0.75">
</all-around-keyboard>

<all-around-keyboard  notes-in-octave="31"
                      raised-keys="[2,4,6,11,13,15,19,23,25,28,30]"
                      sweep=270 octaves="1"
                      thickness="220" width="500"
                      overlapping="0.75">
</all-around-keyboard>


<style>
  body {
    background: aquamarine;
    font-size: 2em;
    font-family: sans;
    color: #4466bb;
  }

  all-around-keyboard {
    margin: 50px;
    display: inline-block;
    border: solid #4466bb 1px;
    padding: 40px;
  }
</style>
