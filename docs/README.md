## Usage:
```html
<script src=".../all-around-keyboard.min.js"></script>
<all-around-keyboard></all-around-keyboard>
```

### Configuration attributes
```html
<all-around-keyboard  notes-in-octave="12"
                      raised-notes="[1,3,6,8,10]"
                      sweep="270" octaves="4"
                      depth="100" width="800"
                      overlapping="0.5">
</all-around-keyboard>
```

### State attributes (declarative control)
Control key states via attributes - the parent component owns the state:

```html
<all-around-keyboard pressed-keys="[0,4,7]"
                     lit-notes="[0,4,7]">
</all-around-keyboard>
```

Or via JavaScript:
```javascript
const kb = document.querySelector('all-around-keyboard');

// Set pressed keys (visual + synth if enabled)
kb.pressedKeys = [0, 4, 7];

// Highlight notes across all octaves
kb.litNotes = [0, 4, 7];

// Hover effect
kb.hoveredKeys = [2];
```

**State attributes:**
- `pressed-keys` / `pressed-notes` - Pressed visual state
- `lit-keys` / `lit-notes` - Highlighted visual state
- `hovered-keys` / `hovered-notes` - Hover visual state

### Events (user interaction)
```javascript
kb.addEventListener('keyclick', (e) => {
  console.log('Clicked:', e.detail.index, 'Note:', e.detail.note);
});

kb.addEventListener('keyhover', (e) => {
  console.log('Hover:', e.detail.index);
});

kb.addEventListener('keyunhover', (e) => {
  console.log('Unhover:', e.detail.index);
});
```

### CSS custom properties
```css
all-around-keyboard {
  --key-lower-fill: white;
  --key-upper-fill: black;
  --key-pressed-fill: deeppink;
  --key-highlight-stroke: blue;
  --key-hover-opacity: 0.85;
}
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
* *[mbostock's arc piano gist](https://bl.ocks.org/mbostock/5723d93e4f617b542991)*
