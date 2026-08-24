import { openSourcePage, startSourceServer } from './harness.mjs';

const server = await startSourceServer();
let page;

try {
  page = await openSourcePage(`${server.url}/fixture`);
  const result = await page.session.evaluate(`(async () => {
    const results = [];
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
    const assert = (condition, message) => {
      if (!condition) throw new Error(message);
    };
    const test = async (name, body) => {
      try {
        await body();
        results.push({ name, status: 'passed' });
      } catch (error) {
        results.push({ name, status: 'failed', error: error?.stack || String(error) });
      }
    };
    const rendered = async keyboard => {
      await Promise.race([
        keyboard.updateComplete,
        sleep(2500).then(() => { throw new Error('render timeout'); })
      ]);
      await sleep(50);
      if (keyboard._renderDeferred) await keyboard.updateComplete;
    };
    const createKeyboard = async attributes => {
      const keyboard = document.createElement('all-around-keyboard');
      keyboard.transitionTime = 0;
      for (const [name, value] of Object.entries(attributes || {})) {
        keyboard.setAttribute(name, value);
      }
      document.body.append(keyboard);
      await rendered(keyboard);
      return keyboard;
    };
    const key = (keyboard, index) => keyboard.shadowRoot.querySelector('[data-key-index="' + index + '"]');
    const overlayPaths = keyboard => [...keyboard.shadowRoot.querySelectorAll('.key-overlay')];
    const addPatterns = async keyboard => {
      const source = document.createElement('div');
      source.slot = 'overlay-pattern';
      source.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs>' +
        '<pattern id="toggle-lines" width="8" height="8" patternUnits="userSpaceOnUse">' +
        '<path d="M0 0L8 8" stroke="red"/></pattern>' +
        '<pattern id="piece-dots" width="8" height="8" patternUnits="userSpaceOnUse">' +
        '<circle cx="4" cy="4" r="2" fill="blue"/></pattern>' +
        '</defs></svg>';
      keyboard.append(source);
      await rendered(keyboard);
      return source;
    };

    await test('visual connection is audio-lazy and versioned', async () => {
      const before = window.__aakTest.audioContexts;
      const keyboard = await createKeyboard();
      assert(window.__aakTest.audioContexts === before, 'connecting created an AudioContext');
      const ctor = customElements.get('all-around-keyboard');
      assert(ctor.version === '1.9.0', 'missing package version');
      assert(!Object.keys(ctor).includes('version'), 'version should be non-enumerable');
      keyboard.remove();
    });

    await test('optional synth is gesture-lazy, voice-bounded, and disposable', async () => {
      const before = { ...window.__aakTest };
      const keyboard = await createKeyboard({ synth: 'true', 'synth-gain': '0.08' });
      assert(window.__aakTest.audioContexts === before.audioContexts,
        'enabling synth during connection eagerly created an AudioContext');
      const target = key(keyboard, 36);
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 21 }));
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 21 }));
      assert(window.__aakTest.audioContexts === before.audioContexts + 1,
        'gesture did not lazily create one instance AudioContext');
      assert(window.__aakTest.oscillators === before.oscillators + 2 &&
        window.__aakTest.gains === before.gains + 1, 'first key press did not create one bounded voice');
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 22 }));
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 22 }));
      assert(window.__aakTest.oscillators === before.oscillators + 2 &&
        window.__aakTest.gains === before.gains + 1, 'repeated key press did not reuse its voice');
      keyboard.synth = false;
      assert(window.__aakTest.audioCloses === before.audioCloses + 1,
        'disabling synth did not dispose the instance AudioContext');
      keyboard.remove();
    });

    await test('state patches coalesce, diff, and stay layout-free', async () => {
      const keyboard = await createKeyboard();
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.pressedKeys = [36];
      keyboard.litKeys = [37];
      keyboard.pressedNotes = [0];
      keyboard.litNotes = [1];
      keyboard.hoveredKeys = [38];
      keyboard.hoveredNotes = [2];
      assert(!key(keyboard, 36).classList.contains('key--pressed'), 'state leaked before the atomic flush');
      await rendered(keyboard);
      assert(stats.length === 1, 'six assignments did not coalesce to one flush');
      assert(stats[0].keyVisits === 6, 'renderer did not visit the affected-key union');
      assert(stats[0].geometryReads === 0, 'state-only update read layout');
      assert(keyboard._keysByNote.size === keyboard.notesInOctave &&
        keyboard._keysByNote.get(0).size === keyboard.octaves,
        'note-to-key index was not bounded by current geometry');
      assert(key(keyboard, 36).classList.contains('key--pressed'), 'pressed state missing');
      assert(key(keyboard, 37).classList.contains('key--highlight'), 'lit state missing');
      assert(key(keyboard, 38).classList.contains('key--hover'), 'hover state missing');
      assert(key(keyboard, 36).getAttribute('aria-pressed') === 'true', 'ARIA state missing');

      let mutations = 0;
      const observer = new MutationObserver(records => { mutations += records.length; });
      observer.observe(keyboard.shadowRoot, { subtree: true, attributes: true });
      const flushes = stats.length;
      keyboard.updateState({
        pressedKeys: new Set([36]),
        litKeys: [37],
        pressedNotes: [0],
        litNotes: [1],
        hoveredKeys: [38],
        hoveredNotes: [2]
      });
      await sleep(100);
      observer.disconnect();
      assert(stats.length === flushes, 'equal state scheduled a render');
      assert(mutations === 0, 'equal state mutated the DOM');

      keyboard.updateState({ pressedKeys: [] });
      await rendered(keyboard);
      assert(keyboard.pressedNotes.length === 1, 'omitted state field was cleared');
      keyboard.remove();
    });

    await test('latest state wins without serial updateComplete waits', async () => {
      const keyboard = await createKeyboard();
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      for (let index = 0; index < 100; index++) {
        keyboard.updateState({ litKeys: [36 + index % 12] });
      }
      await rendered(keyboard);
      assert(stats.length === 1, '100 snapshots produced more than one flush');
      assert(stats[0].keyVisits === 1,
        '100 snapshots visited superseded intermediate keys instead of the final rendered diff');
      assert(keyboard.litKeys.length === 1 && keyboard.litKeys[0] === 39, 'latest snapshot did not win');
      assert(key(keyboard, 39).classList.contains('key--highlight'), 'latest snapshot was not projected');
      keyboard.remove();
    });

    await test('declarative attributes preserve visible, label, and ARIA behavior', async () => {
      const keyboard = await createKeyboard({
        'pressed-keys': '[36]',
        'lit-notes': '[1]',
        'hovered-keys': '[38]',
        'key-labels': 'true',
        'label-format': 'index'
      });
      assert(key(keyboard, 36).classList.contains('key--pressed'), 'pressed-keys attribute missing');
      assert(key(keyboard, 37).classList.contains('key--highlight'), 'lit-notes attribute missing');
      assert(key(keyboard, 38).classList.contains('key--hover'), 'hovered-keys attribute missing');
      assert(key(keyboard, 36).getAttribute('aria-pressed') === 'true', 'attribute state missed ARIA');
      const label = keyboard.shadowRoot.querySelector('.key-label');
      assert(label.style.display === '' && /^\\d+$/.test(label.textContent), 'label attributes missing');

      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.width = keyboard.width;
      keyboard.octaves = keyboard.octaves;
      keyboard.leftmostKey = keyboard.leftmostKey;
      await sleep(100);
      assert(stats.length === 0, 'equal geometry properties scheduled work');
      const firstKey = key(keyboard, 36);
      keyboard.width = 520;
      keyboard.depth = 110;
      await rendered(keyboard);
      assert(stats.length === 1, 'geometry property burst did not coalesce');
      assert(key(keyboard, 36) === firstKey, 'geometry update replaced a stable key');
      keyboard.remove();
    });

    await test('all established geometry/config attributes normalize through public properties', async () => {
      const keyboard = await createKeyboard({
        'notes-in-octave': '7',
        'raised-notes': '[1,3,5]',
        octaves: '3',
        sweep: '180',
        depth: '90',
        width: '420',
        overlapping: '0.4',
        pie: 'true',
        synth: 'false',
        'synth-gain': '0.07',
        'transition-time': '0',
        'base-tone': '55',
        'base-key': '12',
        'leftmost-key': '0',
        'pressed-notes': '[0]',
        'key-labels': 'true',
        'label-format': 'pitch'
      });
      assert(keyboard.notesInOctave === 7 && keyboard.octaves === 3 &&
        keyboard.raisedNotes.join(',') === '1,3,5' && keyboard.sweep === Math.PI &&
        keyboard.depth === 90 && keyboard.width === 420 && keyboard.overlapping === 0.4 &&
        keyboard.pie === true && keyboard.synth === false && keyboard.synthGain === 0.07 &&
        keyboard.transitionTime === 0 && keyboard.baseTone === 55 && keyboard.baseKey === 12 &&
        keyboard.leftmostKey === 0, 'configuration attributes did not reach normalized properties');
      assert(keyboard.shadowRoot.querySelectorAll('.key').length === 21,
        'notes/octaves attributes produced the wrong key count');
      assert(keyboard._keyElements.get(1).data.raised === true,
        'raised-notes attribute did not classify keys');
      const geometryRevision = keyboard.geometryRevision;
      keyboard.raisedNotes = [5, 3, 1];
      await sleep(50);
      assert(keyboard.geometryRevision === geometryRevision && keyboard._renderRequest === 0,
        'semantically equal raised-note order scheduled structural work');
      keyboard.raisedNotes = [];
      await rendered(keyboard);
      assert([...keyboard._keyElements.values()].every(entry => entry.data.raised === false),
        'an explicit empty raised-note pattern retained default raised keys');
      assert(key(keyboard, 0).classList.contains('key--pressed') &&
        key(keyboard, 7).classList.contains('key--pressed'),
        'pressed-notes did not project across periods');
      assert([...keyboard.shadowRoot.querySelectorAll('.key-label')].every(label => label.style.display === ''),
        'key-labels attribute did not reveal labels');
      const clientAnchor = keyboard.getAnchor({ key: 0 }, { space: 'client' }).points[0];
      const hit = keyboard.getNoteAtPoint(clientAnchor.x, clientAnchor.y);
      assert(hit?.index === 0 && hit.note === 0,
        'getNoteAtPoint no longer agrees with public key geometry');
      keyboard.remove();
    });

    await test('indicator bursts use one frame and one geometry-read phase', async () => {
      const keyboard = await createKeyboard();
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      const first = document.createElement('i');
      first.dataset.pitch = '2';
      first.dataset.radius = '0.5';
      first.dataset.waveNumber = '1';
      first.dataset.waveAmplitude = '0.2';
      first.dataset.wavePhase = '0';
      keyboard.append(first);
      await rendered(keyboard);
      assert(stats.length === 1, 'indicator add took more than one frame');
      assert(stats[0].dirtyIndicators === 1, 'indicator was not precisely routed');
      assert(stats[0].geometryReads === 2, 'first indicator frame did not use one CTM/rect pair');
      assert(first.hasAttribute('data-positioned'), 'indicator was not positioned');

      stats.length = 0;
      first.dataset.pitch = '2.5';
      first.dataset.radius = '0.6';
      first.dataset.waveNumber = '2';
      first.dataset.waveAmplitude = '0.1';
      first.dataset.wavePhase = '0.2';
      await rendered(keyboard);
      assert(stats.length === 1, 'five indicator attributes did not coalesce');
      assert(stats[0].dirtyIndicators === 1, 'one indicator was positioned more than once');
      assert(stats[0].geometryReads === 0, 'unchanged transform was not cached');

      stats.length = 0;
      first.dataset.waveNumber = '0';
      first.dataset.waveAmplitude = '0';
      first.dataset.wavePhase = '0';
      await rendered(keyboard);
      const declarativeSpec = keyboard._indicatorRegistry.get(keyboard._indicatorElementIds.get(first));
      assert(declarativeSpec.wave.number === 0 && declarativeSpec.wave.amplitude === 0 &&
        declarativeSpec.wave.phase === 0, 'zero-valued wave attributes were replaced by defaults');
      assert(stats.length === 1 && stats[0].dirtyIndicators === 1,
        'zero-valued wave attribute burst was not precisely coalesced');

      const second = document.createElement('i');
      second.dataset.key = '40';
      keyboard.append(second);
      await rendered(keyboard);
      stats.length = 0;
      keyboard.invalidateLayout();
      first.dataset.pitch = '3';
      second.dataset.key = '41';
      await rendered(keyboard);
      assert(stats.length === 1, 'multi-indicator update did not batch');
      assert(stats[0].geometryReads === 2, 'N indicators performed more than one CTM/rect pair');
      first.removeAttribute('data-pitch');
      await rendered(keyboard);
      assert(!first.hasAttribute('data-positioned') &&
        !first.style.getPropertyValue('--indicator-x'),
        'removing declarative indicator location left stale placement styles');
      keyboard.remove();
    });

    await test('indicator-only work leaves overlays untouched and handles pitch boundaries', async () => {
      const keyboard = await createKeyboard({ sweep: '360' });
      await addPatterns(keyboard);
      keyboard.setOverlay({ id: 'stable', at: { key: 36 }, patterns: ['toggle-lines'] });
      await rendered(keyboard);
      const overlay = keyboard._overlayElements.get('stable').get(36)[0];
      const overlayD = overlay.getAttribute('d');
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      const indicator = keyboard.setIndicator('wrapped', { at: { pitch: -0.25 }, radius: 0.5 });
      await rendered(keyboard);
      assert(indicator.hasAttribute('data-positioned'), 'negative circular pitch was not positioned');
      assert(stats.at(-1).dirtyOverlays === 0, 'indicator-only frame dirtied overlays');
      assert(keyboard._overlayElements.get('stable').get(36)[0] === overlay, 'indicator update replaced overlay');
      assert(overlay.getAttribute('d') === overlayD, 'indicator update rewrote overlay geometry');
      keyboard.remove();
    });

    await test('pure indicator placement covers partial, circular, raised, and wave geometry', async () => {
      const calculate = window.__aakModule.calculateIndicatorPlacement;
      const geometry = {
        innerRadius: 100, outerRadius: 200,
        startAngle: -Math.PI / 2, endAngle: Math.PI / 2
      };
      const keyParams = new Map([
        [36, { startAngle: -Math.PI / 2, endAngle: -Math.PI / 3,
          innerRadius: 100, outerRadius: 180, raised: false }],
        [37, { startAngle: -Math.PI / 3, endAngle: -Math.PI / 6,
          innerRadius: 125, outerRadius: 200, raised: true }]
      ]);
      const frame = {
        ctm: { a: 1, b: 0, c: 0, d: 1, e: 10, f: 20 },
        hostRect: { left: 5, top: 7 }
      };
      const partial = { octaves: 1, notesInOctave: 12, leftmostKey: 36, sweep: Math.PI };
      const outside = calculate({ at: { kind: 'pitch', value: -1 }, radius: 0.5, wave: null },
        geometry, keyParams, frame, partial);
      assert(outside.visible === false, 'partial sweep did not hide an out-of-range pitch');
      const circular = calculate({
        at: { kind: 'pitch', value: -0.25 }, radius: 0.5,
        wave: { number: 2, amplitude: 0.1, phase: 0.2 }
      }, geometry, keyParams, frame, { ...partial, sweep: Math.PI * 2 });
      assert(circular.visible && Number.isFinite(circular.x) && Number.isFinite(circular.y) &&
        circular.waveOffset !== null, 'circular wave placement did not wrap or remain finite');
      const raised = calculate({ at: { kind: 'key', value: 37 }, radius: null, wave: null },
        geometry, keyParams, frame, partial);
      assert(raised.radius > 0.5 && Number.isFinite(raised.angle),
        'raised-key placement did not derive its key-local radius');
      const missing = calculate({ at: { kind: 'key', value: 40 }, radius: 0.4, wave: null },
        geometry, keyParams, frame, partial);
      assert(Number.isFinite(missing.x) && Number.isFinite(missing.y),
        'missing key geometry did not use the deterministic fallback');
    });

    await test('typed indicators are stable and synchronously validated', async () => {
      const keyboard = await createKeyboard();
      const indicator = keyboard.setIndicator('voice:self', {
        at: { pitch: 6.42 }, radius: 0.67,
        wave: { number: 2, amplitude: 0.1, phase: 0.2 }
      });
      await rendered(keyboard);
      assert(indicator.hasAttribute('data-positioned'), 'typed indicator was not positioned');
      const same = keyboard.setIndicator('voice:self', {
        at: { pitch: 6.42 }, radius: 0.67,
        wave: { number: 2, amplitude: 0.1, phase: 0.2 }
      });
      assert(same === indicator, 'equal typed indicator lost element identity');
      let threw = false;
      try { keyboard.setIndicator('bad', { at: { pitch: 1, key: 36 } }); } catch { threw = true; }
      assert(threw, 'ambiguous indicator location was accepted');
      let outOfRange = false;
      try { keyboard.setIndicator('bad-key', { at: { key: 999 } }); } catch { outOfRange = true; }
      assert(outOfRange, 'out-of-range indicator key was accepted');
      let missingId = false;
      try { keyboard.setIndicator(undefined, { at: { key: 36 } }); } catch { missingId = true; }
      assert(missingId, 'missing indicator id was accepted');
      keyboard.removeIndicator('voice:self');
      assert(!indicator.isConnected, 'owned typed indicator was not removed');

      const firstExternal = document.createElement('span');
      firstExternal.part.add('avatar');
      keyboard.setIndicator('voice:external', {
        at: { key: 36 }, radius: 0.5, element: firstExternal
      });
      await rendered(keyboard);
      assert(firstExternal.part.contains('avatar') && firstExternal.part.contains('indicator'),
        'typed indicator overwrote a caller-owned part token');
      const replacement = document.createElement('span');
      replacement.part.add('avatar');
      keyboard.setIndicator('voice:external', {
        at: { key: 37 }, radius: 0.5, element: replacement
      });
      await rendered(keyboard);
      assert(firstExternal.isConnected && !firstExternal.hasAttribute('data-positioned') &&
        !firstExternal.part.contains('indicator') && firstExternal.part.contains('avatar'),
        'replaced external indicator was removed or not cleaned');
      keyboard.removeIndicator('voice:external');
      assert(replacement.isConnected && !replacement.part.contains('indicator') &&
        replacement.part.contains('avatar'), 'removed external indicator lost caller ownership or parts');
      keyboard.remove();
    });

    await test('typed overlays retain identity and support multiple owners', async () => {
      const keyboard = await createKeyboard();
      await addPatterns(keyboard);
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.setOverlay({ id: 'selection:key', at: { key: 36 }, patterns: ['toggle-lines'] });
      await rendered(keyboard);
      assert(stats.length === 1, 'overlay add took more than one frame');
      const firstPath = overlayPaths(keyboard)[0];
      const firstD = firstPath.getAttribute('d');
      const flushCount = stats.length;
      keyboard.setOverlay({ id: 'selection:key', at: { key: 36 }, patterns: ['toggle-lines'] });
      await sleep(100);
      assert(stats.length === flushCount, 'equal overlay scheduled a render');
      assert(overlayPaths(keyboard)[0] === firstPath, 'equal overlay lost node identity');
      assert(firstPath.getAttribute('d') === firstD, 'equal overlay rewrote its path');

      keyboard.setOverlay({ id: 'selection:key', at: { key: 37 }, patterns: ['toggle-lines'] });
      await rendered(keyboard);
      assert(keyboard._overlayElements.get('selection:key').get(37)[0] === firstPath,
        'moving an overlay replaced its SVG node');
      assert(firstPath.getAttribute('d') === key(keyboard, 37).getAttribute('d'),
        'moving an overlay did not update its geometry');

      keyboard.setOverlay({ id: 'piece:a', at: { key: 37 }, patterns: ['piece-dots'] });
      await rendered(keyboard);
      assert(overlayPaths(keyboard).length === 2, 'two overlays on one key collapsed');

      keyboard.setOverlay({ id: 'pitch-class:c', at: { note: 0 }, patterns: ['toggle-lines'] });
      await rendered(keyboard);
      const notePaths = keyboard._overlayElements.get('pitch-class:c');
      assert(notePaths.size === 2, 'note overlay did not cover both octaves');
      assert(keyboard._overlayElements.get('selection:key').size === 1, 'key and note locations were conflated');

      let ambiguous = false;
      try {
        keyboard.setOverlay({ id: 'bad', at: { key: 36, note: 0 }, patterns: ['toggle-lines'] });
      } catch { ambiguous = true; }
      assert(ambiguous, 'ambiguous overlay location was accepted');
      let foreignLocation = false;
      try {
        keyboard.setOverlay({ id: 'bad-pitch', at: { key: 36, pitch: 0 }, patterns: ['toggle-lines'] });
      } catch { foreignLocation = true; }
      assert(foreignLocation, 'overlay accepted a second unsupported location unit');
      let unknownPattern = false;
      try {
        keyboard.setOverlay({ id: 'bad-pattern', at: { key: 36 }, patterns: ['missing'] });
      } catch { unknownPattern = true; }
      assert(unknownPattern, 'unknown typed overlay pattern was accepted');
      assert(stats.at(-1).dirtyIndicators === 0, 'overlay-only frame dirtied indicators');
      keyboard.remove();
    });

    await test('typed labels are stable, accessible, and non-12-tone', async () => {
      const keyboard = await createKeyboard({
        'notes-in-octave': '7',
        octaves: '2',
        'raised-notes': '[1,3,5]'
      });
      const firstKey = key(keyboard, 36);
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.setLabel({
        id: 'solfege:tonic', at: { note: 0 }, text: 'Do',
        ariaLabel: 'tonic, do', className: 'tonic'
      });
      await rendered(keyboard);
      const firstLabels = [...keyboard.shadowRoot.querySelectorAll('[data-label-id="solfege:tonic"]')];
      assert(firstLabels.length === 2, 'period-relative label did not project across two 7-note periods');
      assert(firstLabels.every(label => label.textContent === 'Do' &&
        label.getAttribute('aria-label') === 'tonic, do' && label.classList.contains('tonic')),
        'typed label text, ARIA label, and class diverged');
      assert(firstLabels.every(label => key(keyboard, Number(label.dataset.keyIndex))
        .getAttribute('aria-describedby')?.split(' ').includes(label.id)),
        'typed labels were not associated with their interactive keys');
      const labelByKey = new Map(firstLabels.map(label => [label.dataset.keyIndex, label]));

      const flushes = stats.length;
      keyboard.setLabel({
        id: 'solfege:tonic', at: { note: 0 }, text: 'Do',
        ariaLabel: 'tonic, do', className: 'tonic'
      });
      await sleep(100);
      assert(stats.length === flushes, 'equal typed label scheduled a render');

      keyboard.setLabel({
        id: 'solfege:tonic', at: { note: 0 }, text: 'Sa',
        ariaLabel: 'tonic, sa', className: 'tonic current-mode'
      });
      await rendered(keyboard);
      const changedLabels = [...keyboard.shadowRoot.querySelectorAll('[data-label-id="solfege:tonic"]')];
      assert(changedLabels.every(label => labelByKey.get(label.dataset.keyIndex) === label),
        'tonic/mode text update replaced stable label nodes');
      assert(changedLabels.every(label => label.textContent === 'Sa' &&
        label.getAttribute('aria-label') === 'tonic, sa'), 'label and ARIA text did not update together');
      assert(key(keyboard, 36) === firstKey, 'label update reconstructed a key');

      let ambiguous = false;
      try { keyboard.setLabel({ id: 'bad', at: { key: 36, note: 0 }, text: 'x' }); }
      catch { ambiguous = true; }
      assert(ambiguous, 'ambiguous label location was accepted');
      keyboard.removeLabel('solfege:tonic');
      await rendered(keyboard);
      assert(!keyboard.shadowRoot.querySelector('[data-label-id="solfege:tonic"]'),
        'removed typed label leaked a node');
      assert(!key(keyboard, 36).hasAttribute('aria-describedby'),
        'removed typed label left a stale ARIA association');
      assert(keyboard._labelRegistry.size === 0 && keyboard._labelElements.size === 0,
        'removed typed label leaked registry state');
      keyboard.remove();
    });

    await test('custom frequency providers update key data without geometry work', async () => {
      const keyboard = await createKeyboard({ 'notes-in-octave': '7', octaves: '2' });
      const firstKey = key(keyboard, 36);
      const firstPath = firstKey.getAttribute('d');
      const revision = keyboard.geometryRevision;
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      const frequencies = Array.from({ length: 14 }, (_, index) => 200 + index * 10);
      keyboard.frequencyProvider = frequencies;
      await rendered(keyboard);
      assert(keyboard._keyElements.get(36).data.frequency === 200 &&
        keyboard._keyElements.get(49).data.frequency === 330,
        'array frequency provider did not use keyboard-relative offsets');
      assert(stats.length === 1 && stats[0].keyDataVisits === 14 && stats[0].domWrites === 0,
        'frequency-only update performed geometry or DOM work');
      assert(keyboard.geometryRevision === revision && key(keyboard, 36) === firstKey &&
        firstKey.getAttribute('d') === firstPath, 'frequency provider rebuilt geometry');

      const flushes = stats.length;
      keyboard.frequencyProvider = [...frequencies];
      await sleep(100);
      assert(stats.length === flushes, 'equal frequency provider scheduled work');
      keyboard.frequencyProvider = (absoluteKey, context) => 300 + context.offset;
      await rendered(keyboard);
      assert(keyboard._keyElements.get(36).data.frequency === 300 &&
        keyboard._keyElements.get(49).data.frequency === 313,
        'function frequency provider did not receive absolute key and offset context');
      let invalid = false;
      try { keyboard.frequencyProvider = [440, -1]; } catch { invalid = true; }
      assert(invalid, 'invalid frequency provider was not rejected synchronously');
      keyboard.remove();
    });

    await test('sync validation and async render errors use separate channels', async () => {
      const keyboard = await createKeyboard();
      let synchronous = false;
      try { keyboard.updateState({ litKeys: [Number.NaN] }); } catch { synchronous = true; }
      assert(synchronous, 'invalid API input did not throw synchronously');
      const hookErrors = [];
      const eventErrors = [];
      keyboard.onRenderError = detail => hookErrors.push(detail);
      keyboard.addEventListener('rendererror', event => eventErrors.push({
        detail: event.detail, bubbles: event.bubbles, composed: event.composed
      }));
      keyboard.frequencyProvider = () => { throw new Error('tuning failed'); };
      await Promise.race([
        keyboard.updateComplete,
        sleep(500).then(() => { throw new Error('render error left updateComplete pending'); })
      ]);
      assert(hookErrors.length === 1 && eventErrors.length === 1 &&
        eventErrors[0].detail.error.message === 'tuning failed' &&
        eventErrors[0].bubbles && eventErrors[0].composed,
        'asynchronous render failure did not reach both diagnostic channels');
      keyboard.frequencyProvider = null;
      keyboard.updateState({ litKeys: [36] });
      await rendered(keyboard);
      assert(key(keyboard, 36).classList.contains('key--highlight'),
        'renderer did not recover after an asynchronous error');
      keyboard.remove();
    });

    await test('revisioned anchors batch geometry reads and follow geometry', async () => {
      const keyboard = await createKeyboard({ 'notes-in-octave': '7', octaves: '2' });
      const ctmBefore = window.__aakTest.ctmReads;
      const rectBefore = window.__aakTest.rectReads;
      const noteAnchor = keyboard.getAnchor({ note: 0 });
      const keyAnchor = keyboard.getAnchor({ key: 36 });
      assert(noteAnchor.revision === keyboard.geometryRevision && noteAnchor.space === 'viewBox',
        'anchor omitted its geometry revision or coordinate space');
      assert(noteAnchor.points.length === 2 && keyAnchor.points.length === 1,
        'key/note anchors did not preserve distinct location units');
      assert(window.__aakTest.ctmReads === ctmBefore && window.__aakTest.rectReads === rectBefore,
        'viewBox anchor read layout');

      const batchCtm = window.__aakTest.ctmReads;
      const batchRect = window.__aakTest.rectReads;
      const batch = keyboard.getAnchors([
        { key: 36 }, { key: 37 }, { note: 0 }, { note: 1 }
      ], { space: 'host' });
      assert(batch.anchors.length === 4, 'batched anchor result lost locations');
      assert(window.__aakTest.ctmReads - batchCtm === 1 && window.__aakTest.rectReads - batchRect === 1,
        'batched anchors performed more than one CTM/host-rect read pair');

      const priorRevision = noteAnchor.revision;
      const priorX = keyAnchor.points[0].x;
      const priorY = keyAnchor.points[0].y;
      keyboard.width = 620;
      await rendered(keyboard);
      const changed = keyboard.getAnchor({ key: 36 });
      assert(changed.revision === priorRevision + 1, 'geometry change did not advance anchor revision');
      assert(changed.points[0].x !== priorX || changed.points[0].y !== priorY,
        'anchor did not follow changed geometry');
      keyboard.remove();
    });

    await test('geometry changes reposition stable overlays, indicators, and labels', async () => {
      const keyboard = await createKeyboard();
      await addPatterns(keyboard);
      const indicator = keyboard.setIndicator('geometry:indicator', { at: { key: 36 }, radius: 0.5 });
      keyboard.setOverlay({ id: 'geometry:overlay', at: { key: 36 }, patterns: ['toggle-lines'] });
      keyboard.setLabel({ id: 'geometry:label', at: { key: 36 }, text: 'G' });
      await rendered(keyboard);
      const overlay = keyboard._overlayElements.get('geometry:overlay').get(36)[0];
      const label = keyboard.shadowRoot.querySelector('[data-label-id="geometry:label"]');
      const before = {
        indicatorX: indicator.style.getPropertyValue('--indicator-x'),
        overlayD: overlay.getAttribute('d'),
        labelX: label.getAttribute('x')
      };
      const stats = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.width = 640;
      keyboard.depth = 130;
      await rendered(keyboard);
      assert(keyboard._indicatorRegistry.get('geometry:indicator').element === indicator &&
        keyboard._overlayElements.get('geometry:overlay').get(36)[0] === overlay &&
        keyboard.shadowRoot.querySelector('[data-label-id="geometry:label"]') === label,
        'geometry change replaced stable projected nodes');
      assert(indicator.style.getPropertyValue('--indicator-x') !== before.indicatorX &&
        overlay.getAttribute('d') !== before.overlayD && label.getAttribute('x') !== before.labelX,
        'geometry change did not reposition every projection layer');
      assert(stats.length <= 2 && stats.every(frame => frame.geometryReads <= 2) &&
        stats.filter(frame => frame.domWrites > 0).length === 1,
        'geometry projection did not use one CTM/rect read phase: ' + JSON.stringify(stats));
      keyboard.remove();
    });

    await test('projection adapter converges, retains identity, and requests one gap reset', async () => {
      const keyboard = await createKeyboard();
      await addPatterns(keyboard);
      const stats = [];
      const gaps = [];
      const gapEvents = [];
      keyboard.onRenderStats = value => stats.push(value);
      keyboard.addEventListener('projectiongap', event => gapEvents.push(event.detail));
      const adapter = new window.__aakModule.KeyboardProjectionAdapter(keyboard, {
        onGap: detail => gaps.push(detail)
      });

      const initial = adapter.applySnapshot({
        revision: 10,
        state: { litKeys: [36] },
        overlays: [{ id: 'graph:selection', at: { key: 36 }, patterns: ['toggle-lines'] }],
        indicators: [{ id: 'graph:vertex', at: { key: 36 }, radius: 0.6 }],
        labels: [{ id: 'graph:name', at: { key: 36 }, text: 'I', ariaLabel: 'vertex one' }]
      });
      assert(initial.status === 'applied' && initial.revision === 10,
        'initial projection snapshot was not applied');
      await rendered(keyboard);
      assert(stats.length === 1, 'one projection snapshot did not coalesce to one frame');
      const overlay = keyboard._overlayElements.get('graph:selection').get(36)[0];
      const indicator = keyboard._indicatorRegistry.get('graph:vertex').element;
      const label = keyboard.shadowRoot.querySelector('[data-label-id="graph:name"]');

      stats.length = 0;
      const next = adapter.applyPatch({
        revision: 11,
        state: { litKeys: [37] },
        overlays: { upsert: [{ id: 'graph:selection', at: { key: 37 }, patterns: ['toggle-lines'] }] },
        indicators: { upsert: [{ id: 'graph:vertex', at: { key: 37 }, radius: 0.6 }] },
        labels: { upsert: [{ id: 'graph:name', at: { key: 37 }, text: 'II', ariaLabel: 'vertex two' }] }
      });
      assert(next.status === 'applied' && adapter.revision === 11, 'contiguous patch was not applied');
      await rendered(keyboard);
      assert(stats.length === 1, 'one multi-registry patch did not coalesce to one frame');
      assert(keyboard._overlayElements.get('graph:selection').get(37)[0] === overlay,
        'projection patch replaced a stable overlay node');
      assert(keyboard._indicatorRegistry.get('graph:vertex').element === indicator,
        'projection patch replaced a stable indicator element');
      assert(keyboard.shadowRoot.querySelector('[data-label-id="graph:name"]') === label,
        'projection patch replaced a stable label node');

      stats.length = 0;
      const gap = adapter.applyPatch({ revision: 13, state: { litKeys: [40] } });
      const secondGap = adapter.applyPatch({ revision: 14, state: { litKeys: [41] } });
      const lateMissingPatch = adapter.applyPatch({ revision: 12, state: { litKeys: [42] } });
      assert(gap.status === 'gap' && gap.requestedReset === true && secondGap.requestedReset === false,
        'skipped revisions did not collapse to one reset request');
      assert(lateMissingPatch.status === 'gap' && lateMissingPatch.requestedReset === false,
        'gap recovery replayed a late incremental patch instead of requiring one reset snapshot');
      assert(gaps.length === 1 && gapEvents.length === 1 && adapter.revision === 11 && adapter.gapPending,
        'gap handling advanced state or emitted duplicate reset requests');
      await sleep(100);
      assert(stats.length === 0 && keyboard.litKeys[0] === 37,
        'missed projection patch touched the renderer');

      const reset = adapter.applySnapshot({
        revision: 14,
        state: { litKeys: [41] },
        overlays: [{ id: 'graph:selection', at: { key: 41 }, patterns: ['toggle-lines'] }],
        indicators: [],
        labels: [{ id: 'graph:name', at: { key: 41 }, text: 'VI', ariaLabel: 'vertex six' }]
      });
      assert(reset.status === 'applied' && adapter.revision === 14 && !adapter.gapPending,
        'reset snapshot did not recover revision continuity');
      await rendered(keyboard);
      assert(!indicator.isConnected && keyboard._indicatorRegistry.size === 0,
        'reset snapshot did not remove an adapter-owned indicator');
      assert(keyboard._overlayElements.get('graph:selection').get(41)[0] === overlay &&
        keyboard.shadowRoot.querySelector('[data-label-id="graph:name"]') === label,
        'reset snapshot failed to retain stable nodes');
      const stale = adapter.applyPatch({ revision: 13, state: { litKeys: [36] } });
      assert(stale.status === 'stale' && keyboard.litKeys[0] === 41,
        'stale patch changed the current projection');
      adapter.dispose({ remove: true });
      await rendered(keyboard);
      assert(keyboard._overlayRegistry.size === 0 && keyboard._labelRegistry.size === 0,
        'disposed adapter leaked managed registry entries');
      keyboard.remove();
    });

    await test('declarative overlays observe pattern changes without node churn', async () => {
      const keyboard = await createKeyboard();
      await addPatterns(keyboard);
      const source = document.createElement('i');
      source.dataset.keyOverlay = '36';
      source.dataset.overlayId = 'selection:first';
      source.dataset.overlayPattern = 'toggle-lines';
      keyboard.append(source);
      await rendered(keyboard);
      const first = overlayPaths(keyboard)[0];
      source.dataset.overlayPattern = 'piece-dots';
      await rendered(keyboard);
      const current = overlayPaths(keyboard)[0];
      assert(current === first, 'pattern change replaced the overlay node');
      assert(current.getAttribute('fill') === 'url(#piece-dots)', 'data-overlay-pattern was not observed');
      source.dataset.overlayId = 'selection:second';
      await rendered(keyboard);
      assert(!keyboard._overlayRegistry.has('declarative-overlay:selection:first') &&
        keyboard._overlayRegistry.get('declarative-overlay:selection:second')?.sourceElement === source,
        'data-overlay-id change did not remap declarative registry ownership');
      source.remove();
      await rendered(keyboard);
      assert(overlayPaths(keyboard).length === 0, 'removed declarative overlay leaked a path');
      keyboard.remove();
    });

    await test('geometry transitions are opt-in, single-clock, and supersedable', async () => {
      const keyboard = await createKeyboard();
      assert(keyboard.transitionTime === 0, 'geometry transitions were not opt-in');
      await addPatterns(keyboard);
      keyboard.setOverlay({ id: 'animated:overlay', at: { key: 36 }, patterns: ['toggle-lines'] });
      keyboard.setLabel({ id: 'animated:label', at: { key: 36 }, text: 'A' });
      await rendered(keyboard);
      keyboard.transitionTime = 120;
      keyboard.width = 540;
      await rendered(keyboard);
      assert(keyboard._keyAnimations.size > 1 && keyboard._animationRequest !== 0,
        'opted-in geometry change did not start one shared animation clock');
      keyboard.width = 580;
      await rendered(keyboard);
      assert(keyboard._keyAnimations.size <= keyboard._keyElements.size && keyboard._animationRequest !== 0,
        'superseding geometry created concurrent per-key animation loops');
      await sleep(220);
      assert(keyboard._keyAnimations.size === 0 && keyboard._animationRequest === 0,
        'finished geometry transition retained animation work');
      const targetPath = keyboard._drawArc(keyboard._currentParams.get(36));
      const keyPath = key(keyboard, 36).getAttribute('d');
      const overlayPath = keyboard._overlayElements.get('animated:overlay').get(36)[0].getAttribute('d');
      const builtinLabel = keyboard._keyElements.get(36).textEl;
      const projectedLabel = keyboard.shadowRoot.querySelector('[data-label-id="animated:label"]');
      assert(keyPath === targetPath && overlayPath === targetPath,
        'key or overlay did not converge to superseding geometry');
      assert(projectedLabel.getAttribute('x') === builtinLabel.getAttribute('x') &&
        projectedLabel.getAttribute('y') === builtinLabel.getAttribute('y'),
        'typed label did not follow the geometry transition');

      keyboard.width = 620;
      await keyboard.updateComplete;
      assert(keyboard._animationRequest !== 0, 'disconnect test did not start an animation');
      keyboard.remove();
      assert(keyboard._keyAnimations.size === 0 && keyboard._animationRequest === 0,
        'disconnect did not cancel geometry animation');
    });

    await test('disconnect and reconnect preserve one DOM and one key identity', async () => {
      const keyboard = await createKeyboard();
      const firstKey = key(keyboard, 36);
      const childCount = keyboard.shadowRoot.childNodes.length;
      keyboard.remove();
      await sleep(50);
      document.body.append(keyboard);
      await rendered(keyboard);
      assert(keyboard.shadowRoot.childNodes.length === childCount, 'reconnect duplicated shadow DOM');
      assert(key(keyboard, 36) === firstKey, 'reconnect replaced an unchanged key');
      keyboard.remove();
    });

    await test('connect/disconnect stress keeps observers, nodes, and registries bounded', async () => {
      assert(window.__aakTest.mutationObservers === 0 && window.__aakTest.resizeObservers === 0,
        'observer baseline was not clean');
      const keyboard = await createKeyboard();
      await addPatterns(keyboard);
      const firstKey = key(keyboard, 36);
      const shadowChildren = keyboard.shadowRoot.childNodes.length;
      for (let iteration = 0; iteration < 25; iteration++) {
        keyboard.setOverlay({ id: 'stress:overlay', at: { key: 36 + iteration % 12 }, patterns: ['toggle-lines'] });
        keyboard.setIndicator('stress:indicator', { at: { key: 36 + iteration % 12 }, radius: 0.5 });
        keyboard.setLabel({ id: 'stress:label', at: { key: 36 + iteration % 12 }, text: String(iteration) });
        await rendered(keyboard);
        keyboard.removeOverlay('stress:overlay');
        keyboard.removeIndicator('stress:indicator');
        keyboard.removeLabel('stress:label');
        await rendered(keyboard);
        assert(keyboard._overlayRegistry.size === 0 && keyboard._overlayElements.size === 0 &&
          keyboard._overlayByKey.size === 0 && keyboard._indicatorRegistry.size === 0 &&
          keyboard._labelRegistry.size === 0 && keyboard._labelElements.size === 0,
          'removed IDs left registry or ownership-map entries');

        keyboard.remove();
        assert(window.__aakTest.mutationObservers === 0 && window.__aakTest.resizeObservers === 0,
          'disconnect left an active observer');
        document.body.append(keyboard);
        await rendered(keyboard);
        assert(window.__aakTest.mutationObservers === 1 && window.__aakTest.resizeObservers === 1,
          'reconnect duplicated or omitted observers');
        assert(keyboard.shadowRoot.childNodes.length === shadowChildren &&
          keyboard.shadowRoot.querySelectorAll('.key').length === 24 && key(keyboard, 36) === firstKey,
          'reconnect duplicated DOM or replaced stable keys');
        assert(keyboard.shadowRoot.querySelectorAll('#toggle-lines').length === 1,
          'reconnect duplicated overlay pattern definitions');
      }

      let activations = 0;
      keyboard.addEventListener('keyclick', () => activations++);
      const target = key(keyboard, 36);
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 31 }));
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 31 }));
      assert(activations === 1, 'reconnect duplicated delegated event listeners');
      keyboard.remove();
      assert(window.__aakTest.mutationObservers === 0 && window.__aakTest.resizeObservers === 0,
        'final disconnect left active observers');
    });

    await test('disconnect cancels pending work and reconnect projects the latest state', async () => {
      const keyboard = await createKeyboard();
      keyboard.updateState({ litKeys: [40] });
      const completion = keyboard.updateComplete;
      keyboard.remove();
      await Promise.race([
        completion,
        sleep(500).then(() => { throw new Error('disconnect left updateComplete pending'); })
      ]);
      assert(keyboard._renderRequest === 0, 'disconnect left a render frame pending');
      keyboard.updateState({ litKeys: [41] });
      await Promise.race([
        keyboard.updateComplete,
        sleep(100).then(() => { throw new Error('disconnected updateComplete did not settle'); })
      ]);
      document.body.append(keyboard);
      await rendered(keyboard);
      assert(key(keyboard, 41).classList.contains('key--highlight'), 'reconnect lost latest state');
      keyboard.remove();
    });

    await test('pointer and keyboard activation emit once', async () => {
      const keyboard = await createKeyboard();
      const target = key(keyboard, 36);
      const counts = { click: 0, down: 0, up: 0 };
      keyboard.addEventListener('keyclick', () => counts.click++);
      keyboard.addEventListener('keypointerdown', () => counts.down++);
      keyboard.addEventListener('keypointerup', () => counts.up++);
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 3, pointerType: 'touch' }));
      target.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: 3, pointerType: 'touch' }));
      assert(counts.click === 1 && counts.down === 1 && counts.up === 1, 'pointer activation duplicated');
      target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'Enter' }));
      assert(counts.click === 2, 'keyboard activation did not emit exactly once');
      keyboard.remove();
    });

    await test('keyboardintent has stable ordering, correlation, and cancellation', async () => {
      const keyboard = await createKeyboard();
      const target = key(keyboard, 36);
      const intents = [];
      keyboard.addEventListener('keyboardintent', event => {
        intents.push({ ...event.detail, bubbles: event.bubbles, composed: event.composed,
          frozen: Object.isFrozen(event.detail) });
      });

      target.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 7, pointerType: 'pen', pressure: 0.6, buttons: 1
      }));
      target.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 7, pointerType: 'pen', pressure: 0
      }));
      assert(intents.map(intent => intent.type).join(',') === 'press,release,activate',
        'pointer intent ordering was not press, release, activate');
      assert(intents.every(intent => intent.interactionId === intents[0].interactionId),
        'pointer intent correlation changed within one interaction');
      assert(intents[0].key === 36 && intents[0].note === 0 && intents[0].source === 'pointer',
        'pointer intent omitted explicit key/note/source units');
      assert(intents[0].pointerId === 7 && intents[0].pointerType === 'pen' &&
        Math.abs(intents[0].pressure - 0.6) < 0.001,
        'pointer intent omitted pointer metadata: ' + JSON.stringify(intents[0]));
      assert(intents.every(intent => intent.bubbles && intent.composed && intent.frozen),
        'keyboardintent was not a composed immutable CustomEvent detail');

      intents.length = 0;
      target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: 8 }));
      target.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, pointerId: 8 }));
      assert(intents.map(intent => intent.type).join(',') === 'press,release',
        'canceled pointer unexpectedly activated');
      assert(intents[1].canceled === true && intents[1].interactionId === intents[0].interactionId,
        'canceled pointer release lost cancellation or correlation');

      intents.length = 0;
      target.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 81, pointerType: 'mouse', buttons: 1
      }));
      target.dispatchEvent(new PointerEvent('lostpointercapture', {
        bubbles: true, pointerId: 81, pointerType: 'mouse'
      }));
      assert(intents.map(intent => intent.type).join(',') === 'press,release' &&
        intents[1].canceled === true && keyboard._pointerInteractions.size === 0,
        'lost pointer capture did not cancel and clean up the interaction');

      intents.length = 0;
      let legacyHovers = 0;
      let legacyUnhovers = 0;
      keyboard.addEventListener('keyhover', () => legacyHovers++);
      keyboard.addEventListener('keyunhover', () => legacyUnhovers++);
      target.dispatchEvent(new PointerEvent('pointerover', {
        bubbles: true, pointerId: 82, pointerType: 'mouse', relatedTarget: null
      }));
      target.dispatchEvent(new PointerEvent('pointerout', {
        bubbles: true, pointerId: 82, pointerType: 'mouse', relatedTarget: keyboard._g
      }));
      assert(intents.map(intent => intent.type).join(',') === 'hover,unhover' &&
        legacyHovers === 1 && legacyUnhovers === 1,
        'leaving a key did not keep hover separate or preserve legacy hover events');

      intents.length = 0;
      target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
      target.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
      assert(intents.map(intent => intent.type).join(',') === 'press,release,activate',
        'keyboard intent ordering was not press, release, activate');
      assert(intents.every(intent => intent.source === 'keyboard'), 'keyboard source was not explicit');
      assert(intents[0].interactionId === intents[2].interactionId,
        'keyboard intent correlation changed within one interaction');

      intents.length = 0;
      target.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
      target.dispatchEvent(new FocusEvent('focusout', {
        bubbles: true, relatedTarget: key(keyboard, 37)
      }));
      assert(intents.map(intent => intent.type).join(',') === 'press,release,blur' &&
        intents[1].canceled === true && keyboard._keyboardInteractions.size === 0,
        'focus loss did not cancel and clean up keyboard activation');

      intents.length = 0;
      const secondTarget = key(keyboard, 37);
      target.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 9, pointerType: 'touch', buttons: 1
      }));
      secondTarget.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 10, pointerType: 'touch', buttons: 1
      }));
      secondTarget.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 10, pointerType: 'touch'
      }));
      target.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 9, pointerType: 'touch'
      }));
      const firstTouch = intents.filter(intent => intent.pointerId === 9);
      const secondTouch = intents.filter(intent => intent.pointerId === 10);
      assert(firstTouch.map(intent => intent.type).join(',') === 'press,release,activate' &&
        secondTouch.map(intent => intent.type).join(',') === 'press,release,activate',
        'multi-touch interactions were merged or duplicated');
      assert(firstTouch[0].interactionId !== secondTouch[0].interactionId &&
        keyboard._pointerInteractions.size === 0, 'multi-touch correlation or cleanup was not independent');

      keyboard.remove();
    });

    return results;
  })()`);

  const failures = result.filter(test => test.status === 'failed');
  process.stdout.write(`${JSON.stringify({ tests: result, consoleMessages: page.consoleMessages }, null, 2)}\n`);
  if (failures.length || page.consoleMessages.length) process.exitCode = 1;
} finally {
  if (page) await page.close();
  await server.close();
}
