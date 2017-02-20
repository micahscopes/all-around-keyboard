## usage:
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


## [examples](examples.html):
<iframe src="examples.html" frameborder="0" scrolling="no" width="110%" onload="this.style.height=this.contentDocument.body.scrollHeight +'px';"></iframe>

<style>
  #header_wrap {
    background: currentColor;
  }
  body, #main_content_wrap {
    background: aquamarine;
    font-family: sans;
  }
</style>

## Pressing and releasing keys
Key presses/releases:
``` javascript
// select the element
let kb = document.querySelector('all-around-keyboard');

// press and release events
let press = new Event('keypress'); press.index = 7;
let release = new Event('keyrelease'); release.index = 7;

kb.dispatchEvent(press); // press key with key.index == 7;
// ... sometime later on
kb.dispatchEvent(release); // release the key
```

### *inspired by mbostock's [arc piano example for d3](https://bl.ocks.org/mbostock/5723d93e4f617b542991) *
