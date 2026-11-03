// node scripts/i18n/export-csv.mjs [out.csv]   (after `npm run build`)
// Exports the Italian catalog for review (Google Sheets / Excel): one row per text with the pages that
// use it, the English text, the current Italian text and an empty column for the reviewer's correction.
import fs from 'node:fs';
import path from 'node:path';
import { keysOf } from '../../src/i18n/translate.mjs';
import { IT_READY, LEGAL_REVIEW, normalize, toIt } from '../../src/i18n/routes.mjs';

const out = process.argv[2] || '.qa/traduzioni-it.csv';
const catalog = JSON.parse(fs.readFileSync('src/i18n/it.json', 'utf8'));
const where = {};
for (const p of [...IT_READY].sort()) {
  const html = fs.readFileSync(path.join('dist', p === '/' ? 'index.html' : p.slice(1) + '/index.html'), 'utf8');
  for (const k of new Set(keysOf(html))) (where[k] ??= []).push(toIt(p));
}
const q = s => `"${String(s).replace(/"/g, '""')}"`;
const legalIt = new Set([...LEGAL_REVIEW].map(p => toIt(p)));
const exported = Object.values(where).reduce((all, ps) => { ps.forEach(p => all.add(p)); return all; }, new Set());
// texts used only on pages that need a legal check (shared texts such as menu and footer are excluded)
const legal = k => where[k].every(it => legalIt.has(it));
const pagesOf = k => where[k].length === exported.size && exported.size > 1 ? 'tutte le pagine (menu, footer, testi comuni)' : where[k].join(' ');
const rows = [['Pagine', 'Revisione legale', 'Testo inglese', 'Traduzione italiana', 'Correzione', 'Note'].map(q).join(',')];
for (const k of Object.keys(where).sort((a, b) => pagesOf(a).localeCompare(pagesOf(b)) || a.localeCompare(b))) {
  rows.push([pagesOf(k), legal(k) ? 'sì' : '', k, catalog[k] ?? '', '', ''].map(q).join(','));
}
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, '﻿' + rows.join('\n') + '\n');
console.log(`${rows.length - 1} rows -> ${out}`);
