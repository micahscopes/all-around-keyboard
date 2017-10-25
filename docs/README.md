## Usage:
```html
<script src=".../all-around-keyboard.min.js"></script>
<all-around-keyboard></all-around-keyboard>
```
### Adjusting attributes
```html
<all-around-keyboard  notes-in-octave=12
                      raised-notes="[2,4,7,9,11]"
                      sweep=270 octaves=4
                      depth=100 width=800
                      overlapping=0.5
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

## [examples](examples/index.html):
<iframe src="examples/index.html" frameborder="0" scrolling="no" width="110%" onload="this.style.height=this.contentDocument.body.scrollHeight +'px';"></iframe>

<style>
  #header_wrap {
    background: currentColor;
  }
  body, #main_content_wrap {
    background: aquamarine;
    font-family: sans;
  }
</style>

### credits
* *developed by [Micah Fitch](http://github.com/micahscopes)*
* *[d3.js](https://d3js.org/)*
* *[skate.js](https://github.com/skatejs/skatejs)*
* *[mbostock's arc piano gist](https://bl.ocks.org/mbostock/5723d93e4f617b542991)*
