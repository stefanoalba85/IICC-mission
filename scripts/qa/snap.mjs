// node scripts/qa/snap.mjs dist <width> <outDir> [onlyPathSubstring]
// Full-page screenshots of every built page (PNG, one per page) for before/after visual comparison.
// Requires `npm run preview -- --port 4400`. Lazy images are forced to load before capture.
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const [dist, wArg, outDir, only = ''] = process.argv.slice(2);
const W = Number(wArg || 1280), MAXH = 16000;
fs.mkdirSync(outDir, { recursive: true });
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f === 'index.html') pages.push('/' + path.relative(dist, d).split(path.sep).join('/') + (d === dist ? '' : '/'));
    else if (f === '404.html') pages.push('/404.html');
  }
})(dist);
const list = pages.map(p => p.replace('//', '/')).filter(p => p.includes(only)).sort();

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9337', '--user-data-dir=' + path.join(os.tmpdir(), 'iicc-cdp-snap'), 'about:blank'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const t = (await (await fetch('http://127.0.0.1:9337/json')).json()).find(t => t.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const waiters = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method) waiters.filter(w => w.ev === m.method).forEach(w => { w.res(m); waiters.splice(waiters.indexOf(w), 1); }); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const once = ev => new Promise(res => waiters.push({ ev, res }));
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 });
for (const p of list) {
  const l = once('Page.loadEventFired'); await send('Page.navigate', { url: 'http://localhost:4400' + p });
  await Promise.race([l, new Promise(r => setTimeout(r, 10000))]);
  await send('Runtime.evaluate', { expression: `(async () => { document.querySelectorAll('img[loading=lazy]').forEach(i => i.loading = 'eager');
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; setTimeout(r, 4000); })));
    await document.fonts.ready; })()`, awaitPromise: true });
  await new Promise(r => setTimeout(r, 300));
  const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: Math.min(h, MAXH), scale: 1 } });
  fs.writeFileSync(path.join(outDir, (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/[\/.]/g, '_')) + '.png'), Buffer.from(shot.result.data, 'base64'));
}
console.log(`${list.length} pages captured at ${W}px -> ${outDir}`);
ws.close(); chrome.kill(); process.exit(0);
