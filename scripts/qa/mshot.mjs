// node scripts/qa/mshot.mjs <outName> <path>... : CDP mobile (390) full-page screenshots stitched side by side
// Env: W (width, default 390), MAXH (max height), JS (script to run before capture).
// Requires `npm run preview -- --port 4400` and Python with Pillow (env PYTHON, default python3). Output in .qa/shots/.
import { spawn, execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
const S = '.qa';
fs.mkdirSync('.qa/shots', { recursive: true });
const [name, ...paths] = process.argv.slice(2);
const W = Number(process.env.W || 390), MAXH = Number(process.env.MAXH || 4200);
const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9334', '--user-data-dir=' + os.tmpdir() + '/iicc-cdp-shot', 'about:blank'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const t = (await (await fetch('http://127.0.0.1:9334/json')).json()).find(t => t.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const waiters = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method) waiters.filter(w => w.ev === m.method).forEach(w => { w.res(m); waiters.splice(waiters.indexOf(w), 1); }); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const once = ev => new Promise(res => waiters.push({ ev, res }));
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 844, deviceScaleFactor: 1, mobile: true });
const files = [];
for (const p of paths) {
  const l = once('Page.loadEventFired'); await send('Page.navigate', { url: 'http://localhost:4400' + p });
  await Promise.race([l, new Promise(r => setTimeout(r, 8000))]); await new Promise(r => setTimeout(r, 400));
  if (process.env.JS) { await send('Runtime.evaluate', { expression: process.env.JS }); await new Promise(r => setTimeout(r, 500)); }
  const h = (await send('Runtime.evaluate', { expression: 'document.documentElement.scrollHeight', returnByValue: true })).result.result.value;
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: W, height: Math.min(h, MAXH), scale: 1 } });
  const f = `${S}/shots/c-${p.replace(/\//g, '_')}.png`; fs.writeFileSync(f, Buffer.from(shot.result.data, 'base64')); files.push(f);
}
ws.close(); chrome.kill();
execFileSync(process.env.PYTHON || 'python3', ['-c', `
import sys
from PIL import Image
ims=[Image.open(p).convert("RGB") for p in sys.argv[2:]]
W=sum(i.width+12 for i in ims); H=max(i.height for i in ims)
c=Image.new("RGB",(W,H),"#888"); x=0
for i in ims: c.paste(i,(x,0)); x+=i.width+12
c.save(sys.argv[1],quality=72)`, `${S}/shots/${name}.jpg`, ...files]);
console.log(`${S}/shots/${name}.jpg`);
process.exit(0);
