// node scripts/qa/overlap.mjs dist [width] [onlyPathSubstring]
// Requires `npm run preview -- --port 4400`. Reports text blocks that overlap each other or the IICC logo,
// and words split across two lines,
// e.g. a hero logo covering a title or a quote card covering a paragraph. Writes .qa/overlap-<width>.json.
import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

const dist = process.argv[2];
const W = Number(process.argv[3] || 1440);
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
  ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--remote-debugging-port=9335', '--user-data-dir=' + path.join(os.tmpdir(), 'iicc-cdp-overlap'), 'about:blank'], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1500));
const t = (await (await fetch('http://127.0.0.1:9335/json')).json()).find(t => t.type === 'page');
const ws = new WebSocket(t.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pend = new Map(); const waiters = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); } if (m.method) waiters.filter(w => w.ev === m.method).forEach(w => { w.res(m); waiters.splice(waiters.indexOf(w), 1); }); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const once = ev => new Promise(res => waiters.push({ ev, res }));
await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: 900, deviceScaleFactor: 1, mobile: W < 700 });

const probe = `(() => {
  const vis = el => { const s = getComputedStyle(el); return s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05; };
  // text boxes: elements with their own non-empty text, measured on the text itself
  const boxes = [];
  const walker = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    if (!n.textContent.trim() || /^[\u201c\u201d"'♡♥\s]+$/.test(n.textContent)) continue; // skip decorative quote marks and hearts
    const el = n.parentElement; if (!el || !vis(el) || el.closest('[hidden],details:not([open]) > :not(summary)')) continue;
    const r = document.createRange(); r.selectNodeContents(n);
    for (const b of r.getClientRects()) if (b.width > 2 && b.height > 2) boxes.push({ el, b, kind: 'text', label: n.textContent.trim().slice(0, 30) });
  }
  for (const img of document.querySelectorAll('main img[src*="IICC_Logo"], main img[src*="IICC_Badge"]')) {
    if (vis(img)) { const b = img.getBoundingClientRect(); if (b.width > 20) boxes.push({ el: img, b, kind: 'logo', label: 'LOGO' }); }
  }
  const out = new Set();
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const A = boxes[i], B = boxes[j];
    if (A.el === B.el) continue;
    if (A.kind === 'text' && B.kind === 'text' && (A.el.contains(B.el) || B.el.contains(A.el))) continue;
    const x = Math.min(A.b.right, B.b.right) - Math.max(A.b.left, B.b.left);
    const y = Math.min(A.b.bottom, B.b.bottom) - Math.max(A.b.top, B.b.top);
    if (x > 6 && y > 6) out.add(A.label + ' ⟷ ' + B.label + ' @' + Math.round(Math.max(A.b.top, B.b.top) + scrollY));
  }
  // words split across two lines (e.g. "EDUCATIO / N"): a single word whose range has more than one line box
  const words = document.createTreeWalker(document.querySelector('main') || document.body, NodeFilter.SHOW_TEXT);
  let w, broken = 0;
  while ((w = words.nextNode()) && broken < 4) {
    const el = w.parentElement; if (!el || !vis(el)) continue;
    const re = /[A-Za-z\u00C0-\u024F]{4,}/g; let m;
    while ((m = re.exec(w.textContent)) && broken < 4) {
      const r = document.createRange(); r.setStart(w, m.index); r.setEnd(w, m.index + m[0].length);
      const lines = new Set([...r.getClientRects()].filter(b => b.width > 1).map(b => Math.round(b.top)));
      if (lines.size > 1) { out.add('BROKEN WORD: ' + m[0] + ' @' + Math.round(r.getBoundingClientRect().top + scrollY)); broken++; }
    }
  }
  return JSON.stringify([...out].slice(0, 8));
})()`;

const results = [];
for (const p of list) {
  const l = once('Page.loadEventFired'); await send('Page.navigate', { url: 'http://localhost:4400' + p });
  await Promise.race([l, new Promise(r => setTimeout(r, 8000))]); await new Promise(r => setTimeout(r, 300));
  const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true });
  const v = JSON.parse(r.result.result.value);
  if (v.length) { results.push({ p, v }); console.log(`✗ ${p}\n   ` + v.join('\n   ')); }
}
console.log(`\n${list.length} pages checked at ${W}px, ${results.length} with overlaps`);
fs.mkdirSync('.qa', { recursive: true }); fs.writeFileSync(`.qa/overlap-${W}.json`, JSON.stringify(results, null, 1));
ws.close(); chrome.kill(); process.exit(0);
