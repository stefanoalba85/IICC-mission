// node scripts/i18n/extract.mjs [pagePathSubstring]   (after `npm run build`)
// Lists the texts of the English pages that have no Italian translation yet and adds them to
// src/i18n/it.json with an empty value, ready to be translated. Without an argument it covers the
// pages in IT_READY; with an argument, every page whose path contains it (to prepare new pages).
import fs from 'node:fs';
import path from 'node:path';
import { keysOf } from '../../src/i18n/translate.mjs';
import { IT_READY, normalize } from '../../src/i18n/routes.mjs';

const dist = 'dist', catFile = 'src/i18n/it.json';
const only = process.argv[2];
const pages = [];
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) { if (f !== 'it' && f !== '_astro' && f !== 'images') walk(p); }
    else if (f === 'index.html') pages.push(normalize('/' + path.relative(dist, d).split(path.sep).join('/')));
  }
})(dist);
const selected = pages.filter(p => only ? p.includes(only) : IT_READY.has(p)).sort();
const catalog = fs.existsSync(catFile) ? JSON.parse(fs.readFileSync(catFile, 'utf8')) : {};
let added = 0;
const perPage = {};
for (const p of selected) {
  const html = fs.readFileSync(path.join(dist, p === '/' ? 'index.html' : p.slice(1) + '/index.html'), 'utf8');
  for (const k of keysOf(html)) {
    if (!(k in catalog)) { catalog[k] = ''; added++; (perPage[p] ??= []).push(k); }
  }
}
const sorted = Object.fromEntries(Object.keys(catalog).sort((a, b) => a.localeCompare(b, 'en')).map(k => [k, catalog[k]]));
fs.writeFileSync(catFile, JSON.stringify(sorted, null, 2) + '\n');
const empty = Object.values(sorted).filter(v => v === '').length;
console.log(`${selected.length} pages scanned, ${added} new strings added; ${empty} strings still to translate in ${catFile}`);
for (const [p, ks] of Object.entries(perPage)) console.log(`  ${p}: ${ks.length} new`);
