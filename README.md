# all-around keyboards
a web component for round pianos

### [demo](http://micahscopes.github.io/all-around-keyboard)

## usage:
```html
<script src=".../all-around-keyboard.min.js"></script>
<all-around-keyboard></all-around-keyboard>
```

## configuration attributes
```html
<all-around-keyboard  notes-in-octave="12"
                      raised-notes="[1,3,6,8,10]"
                      sweep="90" octaves="2"
                      depth="100" width="500"
                      overlapping="0.5">
</all-around-keyboard>
```

## state attributes (declarative control)
Set which keys are pressed, lit, or hovered via attributes:

```html
<all-around-keyboard pressed-keys="[0,4,7]"
                     lit-notes="[0,4,7]"
                     hovered-keys="[2]">
</all-around-keyboard>
```

Or via JavaScript:
```javascript
const kb = document.querySelector('all-around-keyboard');

// Set pressed keys (shows as pressed visually, triggers synth if enabled)
kb.pressedKeys = [0, 4, 7];

// Set lit notes (highlights all keys of those pitch classes)
kb.litNotes = [0, 4, 7];

// Set hovered keys (subtle hover visual)
kb.hoveredKeys = [2];
```

**Available state attributes:**
- `pressed-keys` / `pressed-notes` - Keys shown as pressed
- `lit-keys` / `lit-notes` - Keys shown as highlighted
- `hovered-keys` / `hovered-notes` - Keys shown with hover effect

## events (user interaction output)
```javascript
const kb = document.querySelector('all-around-keyboard');

kb.addEventListener('keyclick', (e) => {
  console.log('Clicked key index:', e.detail.index);
  console.log('Note (pitch class):', e.detail.note);
});

kb.addEventListener('keyhover', (e) => {
  console.log('Hovering key:', e.detail.index);
});

kb.addEventListener('keyunhover', (e) => {
  console.log('Left key:', e.detail.index);
});
```

## CSS custom properties
Style the keyboard via CSS custom properties:
```css
all-around-keyboard {
  --key-lower-fill: white;
  --key-lower-stroke: #777;
  --key-upper-fill: black;
  --key-upper-stroke: #000;
  --key-pressed-fill: deeppink;
  --key-highlight-stroke: rgba(0, 91, 255, 0.73);
  --key-highlight-stroke-width: 5.5px;
  --key-highlight-lower-fill: rgb(215, 237, 249);
  --key-highlight-upper-fill: #495b96;
  --key-hover-opacity: 0.85;
  --key-stroke-width: 1.5px;
}
```

## accessibility
- Full keyboard navigation (arrow keys, Enter/Space to click)
- ARIA roles and labels for screen readers
- Focus indicators

##### *inspired by mbostock's example for d3: https://bl.ocks.org/mbostock/5723d93e4f617b542991*
