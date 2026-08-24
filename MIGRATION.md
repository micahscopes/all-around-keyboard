# Performance-pass migration notes

These notes describe the changes in the GitHub-only `v1.9.0` release. The
release includes browser bundles and source maps but is not published to npm.

## Compatibility retained

- The `all-around-keyboard` element name and existing geometry/state
  attributes and properties remain supported.
- Declarative light-DOM overlays and indicators remain supported.
- `keyclick`, `keyhover`, `keyunhover`, `keypointerdown`, and `keypointerup`
  remain composed/bubbling compatibility events with established key units.
- Key paths remain focusable ARIA buttons, and state continues to update
  `aria-pressed`.
- Existing CSS custom properties and Shadow DOM key/overlay/label layers remain
  available.

## Intentional changes

- Geometry animation is now opt-in. Set `transition-time` or
  `keyboard.transitionTime` to a positive duration to restore it. Reduced-motion
  users still receive the final geometry without animation.
- Visual state assignment no longer starts or stops the demonstration synth.
  Audio is driven only by explicit user input when `synth` is enabled.
- The synth is instance-owned, gesture-lazy, voice-bounded, and torn down when
  disabled or disconnected. `synth-gain` controls its demonstration output.
- Typed APIs reject ambiguous locations (`{ key, note }`) and invalid values
  synchronously. Replace bare integers in new integrations with an explicit
  `{ key }`, `{ note }`, or `{ pitch }` object.
- Modern `keyboardintent` activation occurs after a successful release. Legacy
  `keyclick` retains press-time behavior so existing consumers are not silently
  reordered.

## Recommended high-rate API changes

Replace sequential state setters with one patch where practical:

```js
keyboard.updateState({ pressedKeys, litNotes, hoveredKeys });
```

Do not serialize model commands behind `await keyboard.updateComplete`.
Rendering is a passive projection and intermediate lawful snapshots may be
coalesced. Use `updateComplete` only when code must observe the resulting DOM.

Replace ownership-by-light-DOM-node with stable application IDs for frequently
updated overlays, indicators, and labels. Declarative nodes remain appropriate
for static markup and compatibility.

Use `KeyboardProjectionAdapter` only as a revision gate. Persistence,
validation, optimistic state, worker messages, replica recovery, MIDI, and
audio remain application concerns.

## Release artifacts

The four browser bundles and four v3 source maps were freshly generated with
Rollup 4.53.5 from lockfile-pinned, integrity-verified inputs. Builds from two
independently named toolchain roots were byte-identical, source-map dependency
paths are stable, and `test/browser/built-artifact.mjs` passed against the ESM
artifact in Chrome. The stale copied files under `docs/lib` are not release
artifacts and were not overwritten.

For copied-asset consumers such as Walkie Songie, verify
`AllAroundKeyboard.version`, pin the `v1.9.0` release tag or a recorded content
hash, and migrate high-rate projection calls as a separate reviewed change. The
currently observed Walkie asset predates the typed APIs and has not been
silently replaced by this release.
