import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const TEST_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = resolve(TEST_DIR, '..', '..');
const CHROME_HTTP = process.env.AAK_CHROME_URL || 'http://127.0.0.1:9222';

function contentType(pathname) {
  if (pathname.endsWith('.js') || pathname.endsWith('.mjs')) return 'text/javascript; charset=utf-8';
  if (pathname.endsWith('.css')) return 'text/css; charset=utf-8';
  return 'text/html; charset=utf-8';
}

async function sourceModule(pathname) {
  const localPath = resolve(ROOT_DIR, `.${pathname}`);
  if (!localPath.startsWith(`${ROOT_DIR}${sep}`)) {
    throw new Error('Path leaves the repository');
  }

  let source = await readFile(localPath, 'utf8');
  if (pathname === '/src/main.js') {
    const css = await readFile(resolve(ROOT_DIR, 'src/style.css'), 'utf8');
    source = source
      .replace("from 'd3-shape';", "from 'https://cdn.jsdelivr.net/npm/d3-shape@3.2.0/+esm';")
      .replace("from './key-layout';", "from './key-layout.js';")
      .replace("from './lil-synth';", "from './lil-synth.js';")
      .replace("import css from './style.css';", `const css = ${JSON.stringify(css)};`);
  }
  return source;
}

function fixtureHtml(modulePath = '/src/main.js') {
  return `<!doctype html>
<html>
  <head><meta charset="utf-8"><title>all-around-keyboard source fixture</title></head>
  <body>
    <script type="module">
      try {
        window.__aakModule = await import(${JSON.stringify(modulePath)});
        await customElements.whenDefined('all-around-keyboard');
        window.__fixtureReady = true;
      } catch (error) {
        window.__fixtureError = error?.stack || String(error);
      }
    </script>
  </body>
</html>`;
}

export async function startSourceServer() {
  const server = createServer(async (request, response) => {
    try {
      const url = new URL(request.url, 'http://127.0.0.1');
      if (url.pathname === '/' || url.pathname === '/fixture') {
        response.writeHead(200, { 'content-type': contentType('.html'), 'cache-control': 'no-store' });
        response.end(fixtureHtml());
        return;
      }
      if (url.pathname === '/favicon.ico') {
        response.writeHead(204, { 'cache-control': 'no-store' });
        response.end();
        return;
      }
      if (url.pathname === '/fixture-dist') {
        response.writeHead(200, { 'content-type': contentType('.html'), 'cache-control': 'no-store' });
        response.end(fixtureHtml('/dist/all-around-keyboard.esm.js'));
        return;
      }
      if (url.pathname.startsWith('/src/') && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'))) {
        response.writeHead(200, { 'content-type': contentType(url.pathname), 'cache-control': 'no-store' });
        response.end(await sourceModule(url.pathname));
        return;
      }
      if (url.pathname.startsWith('/dist/') &&
          (url.pathname.endsWith('.js') || url.pathname.endsWith('.map'))) {
        response.writeHead(200, { 'content-type': contentType(url.pathname), 'cache-control': 'no-store' });
        response.end(await sourceModule(url.pathname));
        return;
      }
      response.writeHead(404).end('Not found');
    } catch (error) {
      response.writeHead(500, { 'content-type': 'text/plain; charset=utf-8' });
      response.end(error?.stack || String(error));
    }
  });

  await new Promise((resolveListen, rejectListen) => {
    server.once('error', rejectListen);
    server.listen(0, '127.0.0.1', resolveListen);
  });

  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}`,
    close: () => new Promise((resolveClose, rejectClose) => {
      server.close(error => error ? rejectClose(error) : resolveClose());
      // A source-map or module request can leave a browser keep-alive socket
      // open after its target closes. Do not let that make a completed test
      // process linger indefinitely.
      server.closeAllConnections?.();
    })
  };
}

class CdpSession {
  constructor(webSocketUrl) {
    this._nextId = 1;
    this._pending = new Map();
    this._listeners = new Map();
    this._socket = new WebSocket(webSocketUrl);
  }

  async connect() {
    await new Promise((resolveOpen, rejectOpen) => {
      this._socket.addEventListener('open', resolveOpen, { once: true });
      this._socket.addEventListener('error', rejectOpen, { once: true });
    });
    this._socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this._pending.get(message.id);
        if (!pending) return;
        this._pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      for (const listener of this._listeners.get(message.method) || []) {
        listener(message.params);
      }
    });
    return this;
  }

  on(method, listener) {
    const listeners = this._listeners.get(method) || [];
    listeners.push(listener);
    this._listeners.set(method, listeners);
  }

  once(method) {
    return new Promise(resolveEvent => {
      const listener = value => {
        const listeners = this._listeners.get(method) || [];
        this._listeners.set(method, listeners.filter(candidate => candidate !== listener));
        resolveEvent(value);
      };
      this.on(method, listener);
    });
  }

  send(method, params = {}) {
    const id = this._nextId++;
    const response = new Promise((resolveResult, rejectResult) => {
      this._pending.set(id, { resolve: resolveResult, reject: rejectResult });
    });
    this._socket.send(JSON.stringify({ id, method, params }));
    return response;
  }

  async evaluate(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
      userGesture: false
    });
    if (result.exceptionDetails) {
      throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    }
    return result.result.value;
  }

  close() {
    this._socket.close();
  }
}

export async function openSourcePage(url) {
  const created = await fetch(`${CHROME_HTTP}/json/new?about:blank`, { method: 'PUT' });
  if (!created.ok) throw new Error(`Could not create Chrome target: ${created.status}`);
  const target = await created.json();
  const session = await new CdpSession(target.webSocketDebuggerUrl).connect();
  const consoleMessages = [];

  session.on('Runtime.consoleAPICalled', event => {
    consoleMessages.push({
      type: event.type,
      values: event.args.map(arg => arg.value ?? arg.description)
    });
  });

  await session.send('Runtime.enable');
  await session.send('Page.enable');
  await session.send('Emulation.setFocusEmulationEnabled', { enabled: true });
  await session.send('Page.bringToFront');
  await session.send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      window.__aakTest = {
        audioContexts: 0, audioCloses: 0, oscillators: 0, gains: 0,
        animationFrames: 0, ctmReads: 0, rectReads: 0,
        mutationObservers: 0, resizeObservers: 0
      };
      class TestAudioParam {
        constructor() { this.value = 0; }
        setTargetAtTime(value) { this.value = value; }
        cancelScheduledValues() {}
      }
      class TestAudioNode {
        connect() { return this; }
        disconnect() {}
      }
      class TestAudioContext {
        constructor() {
          window.__aakTest.audioContexts += 1;
          this.currentTime = 0;
          this.destination = new TestAudioNode();
        }
        createBiquadFilter() {
          const node = new TestAudioNode();
          node.frequency = new TestAudioParam();
          node.type = 'bandpass';
          return node;
        }
        createGain() {
          window.__aakTest.gains += 1;
          const node = new TestAudioNode();
          node.gain = new TestAudioParam();
          return node;
        }
        createOscillator() {
          window.__aakTest.oscillators += 1;
          const node = new TestAudioNode();
          node.frequency = new TestAudioParam();
          node.type = 'sine';
          node.start = () => {};
          node.stop = () => {};
          return node;
        }
        resume() { return Promise.resolve(); }
        close() {
          window.__aakTest.audioCloses += 1;
          return Promise.resolve();
        }
      }
      Object.defineProperty(window, 'AudioContext', { configurable: true, value: TestAudioContext });
      Object.defineProperty(window, 'webkitAudioContext', { configurable: true, value: TestAudioContext });
      const NativeMutationObserver = window.MutationObserver;
      window.MutationObserver = function (callback) {
        const observer = new NativeMutationObserver(callback);
        const nativeDisconnect = observer.disconnect.bind(observer);
        let active = true;
        window.__aakTest.mutationObservers += 1;
        observer.disconnect = () => {
          if (active) {
            active = false;
            window.__aakTest.mutationObservers -= 1;
          }
          nativeDisconnect();
        };
        return observer;
      };
      window.MutationObserver.prototype = NativeMutationObserver.prototype;
      const NativeResizeObserver = window.ResizeObserver;
      window.ResizeObserver = function (callback) {
        const observer = new NativeResizeObserver(callback);
        const nativeDisconnect = observer.disconnect.bind(observer);
        let active = true;
        window.__aakTest.resizeObservers += 1;
        observer.disconnect = () => {
          if (active) {
            active = false;
            window.__aakTest.resizeObservers -= 1;
          }
          nativeDisconnect();
        };
        return observer;
      };
      window.ResizeObserver.prototype = NativeResizeObserver.prototype;
      const nativeRaf = window.requestAnimationFrame.bind(window);
      window.requestAnimationFrame = callback => {
        window.__aakTest.animationFrames += 1;
        return nativeRaf(callback);
      };
      const nativeCtm = SVGGraphicsElement.prototype.getScreenCTM;
      SVGGraphicsElement.prototype.getScreenCTM = function (...args) {
        window.__aakTest.ctmReads += 1;
        return nativeCtm.apply(this, args);
      };
      const nativeRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function (...args) {
        window.__aakTest.rectReads += 1;
        return nativeRect.apply(this, args);
      };
    `
  });

  await session.send('Page.navigate', { url });
  await session.send('Page.bringToFront');
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const status = await session.evaluate(`({ ready: window.__fixtureReady === true, error: window.__fixtureError || null })`);
    if (status.error) throw new Error(status.error);
    if (status.ready) break;
    await new Promise(resolveWait => setTimeout(resolveWait, 50));
  }
  const ready = await session.evaluate('window.__fixtureReady === true');
  if (!ready) throw new Error('Timed out waiting for source fixture');

  return {
    session,
    consoleMessages,
    close: async () => {
      session.close();
      await fetch(`${CHROME_HTTP}/json/close/${target.id}`);
    }
  };
}
