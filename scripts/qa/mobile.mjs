// node scripts/qa/mobile.mjs dist [width] [onlyPathSubstring]
// Requires `npm run preview -- --port 4400` running. Writes .qa/mobile.json.
// Launches headless Chrome via CDP, loads each page at mobile width, reports horizontal overflow culprits.
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';

const dist = process.argv[2];
const W = Number(process.argv[3] || 390);
const only = process.argv[4] || '';
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
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9333', '--user-data-dir=' + path.join(os.tmpdir(), 'iicc-cdp-qa'), 'about:blank'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const targets = await (await fetch('http://127.0.0.1:9333/json')).json();
const ws = new WebSocket(targets.find(t => t.type === 'page').webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const waiters = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
  if (m.method) waiters.filter(w => w.ev === m.method).forEach(w => { w.res(m); waiters.splice(waiters.indexOf(w), 1); });
});
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const once = ev => new Promise(res => waiters.push({ ev, res }));
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 844, deviceScaleFactor: 1, mobile: true });

const probe = `(() => {
  const W = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const out = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed') continue;
    if (r.right > W + 1 || r.left < -1) {
      // skip if an ancestor clips overflow
      let a = el.parentElement, clipped = false;
      while (a && a !== document.body) { const s = getComputedStyle(a); if (/(hidden|auto|scroll|clip)/.test(s.overflowX)) { const ar = a.getBoundingClientRect(); if (ar.right <= W + 1 && ar.left >= -1) { clipped = true; break; } } a = a.parentElement; }
      if (clipped) continue;
      // only report outermost offenders
      const p = el.parentElement; const pr = p && p.getBoundingClientRect();
      if (pr && (pr.right > W + 1 || pr.left < -1) && p !== document.body) continue;
      const ps = p ? (p.tagName.toLowerCase() + '.' + (typeof p.className==='string'?p.className.trim().split(/\s+/).slice(0,2).join('.'):'') + ' {' + (p.getAttribute('style')||'').slice(0,70) + '}') : '';
      out.push('<' + ps + '> ' + (el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0,2).join('.') : '')) + ' [' + Math.round(r.left) + '→' + Math.round(r.right) + '] ' + (el.textContent || '').trim().slice(0, 40).replace(/\\s+/g,' '));
    }
  }
  // tiny text check
  let tiny = 0; for (const el of document.querySelectorAll('p,li,span,a,small')) { if (el.children.length === 0 && el.textContent.trim() && parseFloat(getComputedStyle(el).fontSize) < 11) tiny++; }
  return JSON.stringify({ sw, W, out: out.slice(0, 12), tiny, h: document.documentElement.scrollHeight });
})()`;

const results = [];
for (const p of list) {
  const loaded = once('Page.loadEventFired');
  await send('Page.navigate', { url: 'http://localhost:4400' + p });
  await Promise.race([loaded, new Promise(r => setTimeout(r, 8000))]);
  await new Promise(r => setTimeout(r, 250));
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  const v = JSON.parse(r.result.result.value);
  results.push({ p, ...v });
  if (v.sw > v.W || v.out.length) console.log(`✗ ${p} scrollW=${v.sw} tiny=${v.tiny}\n   ` + v.out.join('\n   '));
}
const bad = results.filter(r => r.sw > r.W || r.out.length);
console.log(`\n${results.length} pages checked, ${bad.length} with overflow`);
fs.mkdirSync('.qa', { recursive: true });
fs.writeFileSync('.qa/mobile.json', JSON.stringify(results, null, 1));
ws.close(); chrome.kill();
process.exit(0);
