// Translation engine for the Italian pages: takes a built English page (HTML), splits it into translation
// units and replaces each with its Italian text from the catalog (src/i18n/it.json).
//
// A unit is a run of inline content inside a block element: a heading, a paragraph, a button label, a list
// item… Inline tags inside a unit (links, <strong>, <span>, icons, <br>) become numbered placeholders, so
// the catalog key for   Donate<br/><span style="…">Today</span>   is   "Donate[1/][2]Today[/2]".
// Translations must keep the same placeholders; their attributes are copied back from the English page.
// Attributes (alt, title, placeholder, aria-label, meta descriptions, data-t-*) are translated as whole strings.
import { parse, parseFragment, serialize, serializeOuter } from 'parse5';

const SKIP = new Set(['script', 'style', 'noscript', 'template', 'code', 'pre', 'textarea']);
const VOID_INLINE = new Set(['br', 'img', 'input', 'wbr', 'svg']);
const INLINE = new Set(['a', 'span', 'strong', 'b', 'em', 'i', 'small', 'sup', 'sub', 'cite', 'abbr', 'u', 'mark', 'time', 'q', 's', 'label']);
const ATTRS = new Set(['alt', 'title', 'placeholder', 'aria-label']);
const META = new Set(['description', 'og:title', 'og:description', 'twitter:title', 'twitter:description']);
const TITLE_SUFFIX = ' | IICC Mission';
const HAS_WORD = /\p{L}/u;

const isEl = n => n.tagName !== undefined;
const isText = n => n.nodeName === '#text';
const attr = (n, name) => n.attrs?.find(a => a.name === name)?.value;

function inlineOnly(n) {
  if (isText(n) || n.nodeName === '#comment') return true;
  if (!isEl(n)) return false;
  if (VOID_INLINE.has(n.tagName)) return true;
  return INLINE.has(n.tagName) && n.childNodes.every(inlineOnly);
}

const collapse = s => s.replace(/\s+/g, ' ');
const textOf = n => isText(n) ? n.value : (isEl(n) && n.tagName !== 'svg' ? n.childNodes.map(textOf).join('') : '');
const escapeText = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
const startTag = n => `<${n.tagName}${n.attrs.map(a => ` ${a.name}="${escapeAttr(a.value)}"`).join('')}>`;

/** Builds the catalog key for a run of inline nodes; `slots` collects the elements behind each placeholder. */
function keyOf(nodes, slots) {
  let out = '';
  for (const n of nodes) {
    if (isText(n)) out += collapse(n.value);
    else if (!isEl(n)) continue;
    else if (VOID_INLINE.has(n.tagName)) { slots.push(n); out += `[${slots.length}/]`; }
    else { slots.push(n); const i = slots.length; out += `[${i}]${keyOf(n.childNodes, slots)}[/${i}]`; }
  }
  return out;
}

/** Turns a translated key back into HTML, restoring each placeholder's original element. */
function htmlOf(text, slots) {
  return text.split(/(\[\/?\d+\/?\])/).map(part => {
    const m = part.match(/^\[(\/?)(\d+)(\/?)\]$/);
    if (!m) return escapeText(part);
    const el = slots[Number(m[2]) - 1];
    if (!el) return '';
    if (m[3]) return serializeOuter(el);
    return m[1] ? `</${el.tagName}>` : startTag(el);
  }).join('');
}

/** Collects the translation units of a parsed document, in document order. */
function units(doc) {
  const found = [];
  const flush = (parent, run) => {
    // trim whitespace and icons/line breaks at the edges: they stay in place, outside the unit
    const edge = n => n.nodeName === '#comment' || (isText(n) ? !n.value.trim() : isEl(n) && (VOID_INLINE.has(n.tagName) || !textOf(n).trim()));
    let a = 0, b = run.length;
    while (a < b && edge(run[a])) a++;
    while (b > a && edge(run[b - 1])) b--;
    const nodes = run.slice(a, b);
    if (!nodes.length) return;
    // a lone wrapper (e.g. a link around the whole label): translate its content
    if (nodes.length === 1 && isEl(nodes[0])) { flush(nodes[0], nodes[0].childNodes.slice()); return; }
    // only elements side by side, no free text between them (menu columns, label + value pairs…):
    // each element is a unit of its own
    if (!nodes.some(n => isText(n) && n.value.trim())) {
      for (const n of nodes) if (isEl(n) && !VOID_INLINE.has(n.tagName)) flush(n, n.childNodes.slice());
      return;
    }
    const slots = [];
    const key = keyOf(nodes, slots).trim();
    if (!key || !HAS_WORD.test(key.replace(/\[\/?\d+\/?\]/g, ''))) return;
    found.push({ parent, nodes, slots, key, lead: false, trail: false });
  };
  const walk = el => {
    if (SKIP.has(el.tagName) || el.tagName === 'svg') return;
    let run = [];
    for (const c of el.childNodes) {
      if (inlineOnly(c)) run.push(c);
      else { if (run.length) flush(el, run); run = []; if (isEl(c)) walk(c); }
    }
    if (run.length) flush(el, run);
  };
  walk(doc.childNodes.find(n => n.tagName === 'html'));
  return found;
}

/** Translatable attribute strings of a document: [{ node, name, key, prefix? }]. */
function attributes(doc) {
  const out = [];
  const visit = n => {
    if (!isEl(n)) { for (const c of n.childNodes || []) visit(c); return; }
    for (const a of n.attrs) {
      const v = collapse(a.value).trim();
      if (!v || !HAS_WORD.test(v)) continue;
      if (ATTRS.has(a.name) || a.name.startsWith('data-t-')) out.push({ node: n, name: a.name, key: v });
      else if (n.tagName === 'meta' && a.name === 'content' && META.has(attr(n, 'name') || attr(n, 'property'))) {
        const suffix = v.endsWith(TITLE_SUFFIX) ? TITLE_SUFFIX : '';
        out.push({ node: n, name: a.name, key: v.slice(0, v.length - suffix.length), suffix });
      }
    }
    for (const c of n.childNodes || []) visit(c);
    if (n.content) visit(n.content);
  };
  visit(doc);
  return out;
}

/** All catalog keys used by an English page (for extraction). */
export function keysOf(html) {
  const doc = parse(html);
  const keys = attributes(doc).map(a => a.key);
  for (const u of units(doc)) keys.push(u.key.endsWith(TITLE_SUFFIX) ? u.key.slice(0, -TITLE_SUFFIX.length) : u.key);
  return keys;
}

/**
 * Translates an English page. `catalog` maps English keys to Italian; missing keys stay in English and are
 * returned in `missing`. `rewrite(doc)` runs last for structural changes (links, lang, canonical…).
 */
export function translatePage(html, catalog, rewrite) {
  const doc = parse(html);
  const missing = new Set();
  const tr = key => {
    const v = catalog[key];
    if (v === undefined || v === '') { missing.add(key); return key; }
    return v;
  };
  for (const a of attributes(doc)) {
    const at = a.node.attrs.find(x => x.name === a.name);
    at.value = tr(a.key) + (a.suffix || '');
  }
  for (const u of units(doc)) {
    const isTitle = u.parent.tagName === 'title' && u.key.endsWith(TITLE_SUFFIX);
    const key = isTitle ? u.key.slice(0, -TITLE_SUFFIX.length) : u.key;
    let text = tr(key) + (isTitle ? TITLE_SUFFIX : '');
    // Italian elisions ("dell’accompagnamento") make long unbreakable words: allow a line
    // break after the apostrophe in headings and bold labels (zero-width space), used only when the line is too narrow
    if (/^(h[1-6]|strong|b)$/.test(u.parent.tagName)) text = text.replace(/’(?=\p{L})/gu, '’\u200B');
    const frag = parseFragment(u.parent, (u.lead ? ' ' : '') + htmlOf(text, u.slots) + (u.trail ? ' ' : ''));
    const kids = u.parent.childNodes;
    const at = kids.indexOf(u.nodes[0]);
    const end = kids.indexOf(u.nodes[u.nodes.length - 1]);
    if (at < 0 || end < 0) continue;
    for (const n of frag.childNodes) n.parentNode = u.parent;
    kids.splice(at, end - at + 1, ...frag.childNodes);
  }
  if (rewrite) rewrite(doc);
  return { html: serialize(doc), missing: [...missing] };
}

export { parse, serialize, attr, isEl };
