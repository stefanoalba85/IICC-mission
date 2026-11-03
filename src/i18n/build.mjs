// Build step for the Italian site. Runs after `astro build` (see src/i18n/integration.mjs):
// for every page in IT_READY it translates the built English HTML with the catalog and writes it to its
// Italian URL, then writes a bilingual sitemap.xml and robots.txt.
import fs from 'node:fs';
import path from 'node:path';
import { translatePage, attr, isEl } from './translate.mjs';
import { SITE, IT_READY, toIt, normalize, hasIt } from './routes.mjs';

const ASSET = /\.(?:jpe?g|png|webp|gif|svg|pdf|css|js|ico|xml|txt)$/i;

/** Rewrites an Italian document: lang, canonical, internal links, language switcher, redirect script. */
function rewriter(enPath, itPath) {
  return doc => {
    const visit = n => {
      if (!isEl(n)) { for (const c of n.childNodes || []) visit(c); return; }
      const set = (name, value) => { const a = n.attrs.find(x => x.name === name); if (a) a.value = value; else n.attrs.push({ name, value }); };
      if (n.tagName === 'html') set('lang', 'it');
      if (n.tagName === 'link' && attr(n, 'rel') === 'canonical') set('href', SITE + itPath);
      if (n.tagName === 'meta' && attr(n, 'property') === 'og:locale') set('content', 'it_IT');
      if (n.tagName === 'meta' && attr(n, 'property') === 'og:locale:alternate') set('content', 'en_GB');
      if (n.tagName === 'meta' && attr(n, 'property') === 'og:url') set('content', SITE + itPath);
      if (n.tagName === 'a' && attr(n, 'data-lang')) {
        // language switcher: mark Italian as current
        n.attrs = n.attrs.filter(x => x.name !== 'aria-current');
        if (attr(n, 'data-lang') === 'it') n.attrs.push({ name: 'aria-current', value: 'true' });
      } else if ((n.tagName === 'a' && attr(n, 'href')) || (n.tagName === 'form' && attr(n, 'action'))) {
        const name = n.tagName === 'a' ? 'href' : 'action';
        const href = attr(n, name);
        if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith('/it/') && !ASSET.test(href.split(/[?#]/)[0])) {
          const target = normalize(href);
          if (hasIt(target)) set(name, toIt(target) + (href.match(/[?#].*$/)?.[0] ?? ''));
        }
      }
      for (const c of n.childNodes || []) visit(c);
      // the first-visit language redirect only belongs on the English homepage
      n.childNodes = (n.childNodes || []).filter(c => !(isEl(c) && c.tagName === 'script' && attr(c, 'id') === 'lang-redirect'));
    };
    visit(doc);
  };
}

const enFile = (dist, enPath) => path.join(dist, enPath === '/' ? 'index.html' : enPath.slice(1) + '/index.html');
const itFile = (dist, itPath) => path.join(dist, itPath.slice(1), 'index.html');

export function loadCatalog(root) {
  const file = path.join(root, 'src/i18n/it.json');
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : {};
}

export function buildItalian(dist, root, log = console) {
  const catalog = loadCatalog(root);
  const missingByPage = {};
  let written = 0;
  for (const enPath of [...IT_READY].sort()) {
    const src = enFile(dist, enPath);
    if (!fs.existsSync(src)) { log.warn(`[i18n] ${enPath}: English page not found, skipped`); continue; }
    const itPath = toIt(enPath);
    const { html, missing } = translatePage(fs.readFileSync(src, 'utf8'), catalog, rewriter(enPath, itPath));
    const out = itFile(dist, itPath);
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, html);
    written++;
    if (missing.length) missingByPage[enPath] = missing;
  }

  // bilingual sitemap with hreflang alternates
  const pages = [];
  (function walk(d) {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) { if (p !== path.join(dist, 'it') && f !== '_astro' && f !== 'images') walk(p); }
      else if (f === 'index.html') pages.push(normalize('/' + path.relative(dist, d).split(path.sep).join('/')));
    }
  })(dist);
  const urls = pages.sort().map(en => {
    const alt = hasIt(en)
      ? `\n    <xhtml:link rel="alternate" hreflang="en" href="${SITE}${en}"/>\n    <xhtml:link rel="alternate" hreflang="it" href="${SITE}${toIt(en)}"/>\n    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${en}"/>`
      : '';
    const it = hasIt(en) ? `\n  <url>\n    <loc>${SITE}${toIt(en)}</loc>${alt}\n  </url>` : '';
    return `  <url>\n    <loc>${SITE}${en}</loc>${alt}\n  </url>${it}`;
  });
  fs.writeFileSync(path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);

  const missingCount = new Set(Object.values(missingByPage).flat()).size;
  log.info(`[i18n] ${written} Italian pages written; ${missingCount} untranslated strings`);
  if (missingCount) {
    for (const [p, keys] of Object.entries(missingByPage)) log.warn(`[i18n] ${p}: ${keys.length} untranslated (run npm run i18n:extract)`);
  }
  return { written, missingByPage };
}
