"""Audit the built site: internal links + anchors, orphans, forms, contacts.
Usage: python3 scripts/qa/audit.py dist .qa/audit.json   (run after `npm run build`)
"""
import os, re, sys, json, collections, html
from html.parser import HTMLParser

DIST = sys.argv[1]

class P(HTMLParser):
    def __init__(self):
        super().__init__(); self.links = []; self.ids = set(); self.forms = []; self.stack = []
        self.cur = None; self.text = []; self.in_main = 0; self.in_header = 0; self.in_footer = 0; self.imgs = []; self.iframes = []; self.videos = []
        self.qr = 0
    def handle_starttag(self, tag, a):
        a = dict(a)
        if 'id' in a: self.ids.add(a['id'])
        if tag == 'main': self.in_main += 1
        if tag == 'header': self.in_header += 1
        if tag == 'footer': self.in_footer += 1
        if tag == 'a':
            self.cur = {'href': a.get('href'), 'text': '', 'aria': a.get('aria-label'), 'zone': 'main' if self.in_main and not self.in_header else ('header' if self.in_header else ('footer' if self.in_footer else 'other'))}
        if tag == 'form': self.forms.append({'action': a.get('action'), 'onsubmit': (a.get('onsubmit') or '')[:80], 'method': a.get('method')})
        if tag == 'img': self.imgs.append(a.get('src'))
        if tag == 'iframe': self.iframes.append(a.get('src'))
        if tag in ('video', 'audio'): self.videos.append(tag)
    def handle_endtag(self, tag):
        if tag == 'a' and self.cur is not None:
            self.cur['text'] = re.sub(r'\s+', ' ', self.cur['text']).strip(); self.links.append(self.cur); self.cur = None
        if tag == 'main': self.in_main -= 1
        if tag == 'header': self.in_header -= 1
        if tag == 'footer': self.in_footer -= 1
    def handle_data(self, d):
        if self.cur is not None: self.cur['text'] += d
        if self.in_main: self.text.append(d)

pages = {}
for root, _, fs in os.walk(DIST):
    for f in fs:
        if not f.endswith('.html'): continue
        p = os.path.join(root, f); rel = '/' + os.path.relpath(p, DIST)
        url = rel[:-len('index.html')] if rel.endswith('index.html') else rel
        src = open(p, encoding='utf-8').read(); pr = P(); pr.feed(src)
        pages[url] = {'p': pr, 'raw': src}

def norm(h):
    h = h.split('?')[0]
    path, _, frag = h.partition('#')
    if path and not path.endswith('/') and not path.endswith('.html') and '.' not in path.split('/')[-1]: path += '/'
    return path, frag

out = collections.defaultdict(list)
inbound = collections.defaultdict(set)
for url, d in pages.items():
    for l in d['p'].links:
        h = l['href']
        if h is None or h.strip() in ('', '#'):
            out['empty_href'].append((url, l['text'] or l['aria'])); continue
        if h.startswith(('http://', 'https://')):
            out['external'].append((url, h, l['text'] or l['aria'], l['zone'])); continue
        if h.startswith(('mailto:', 'tel:')):
            out['mailtel'].append((url, h)); continue
        if h.startswith('#'):
            if h[1:] not in d['p'].ids: out['bad_local_anchor'].append((url, h, l['text']))
            continue
        path, frag = norm(h)
        target = pages.get(path)
        if target is None and not os.path.exists(DIST + path):
            out['broken'].append((url, h, l['text'])); continue
        if target is not None:
            if path != url and l['zone'] == 'main': inbound[path].add(url)
            if frag and frag not in target['p'].ids: out['bad_anchor'].append((url, h, l['text']))
        out['pairs'].append((l['text'], path + (('#' + frag) if frag else ''), url, l['zone']))

# nav (header/footer) reachability
navlinked = set()
for url, d in pages.items():
    for l in d['p'].links:
        if l['zone'] in ('header', 'footer') and l['href'] and l['href'].startswith('/'):
            navlinked.add(norm(l['href'])[0])
orphans = [u for u in sorted(pages) if not inbound.get(u) and u not in navlinked and u not in ('/', '/404.html')]
only_nav = [u for u in sorted(pages) if not inbound.get(u) and u in navlinked]

forms = [(u, f) for u, d in pages.items() for f in d['p'].forms]
emails = collections.Counter(); phones = collections.Counter(); addrs = collections.Counter()
for u, d in pages.items():
    t = re.sub(r'<[^>]+>', ' ', d['raw'])
    t = html.unescape(t)
    for m in re.findall(r'[\w.+-]+@[\w-]+\.[\w.]+', t): emails[m] += 1
    for m in re.findall(r'\+\d[\d\s()-]{7,}\d', t): phones[re.sub(r'\s+', ' ', m)] += 1
    for k in ['North Sydney', 'Vatican City', 'Via delle Milizie', 'PO Box', 'Cheltenham', 'Melbourne VIC']:
        if k in t: addrs[k] += 1

json.dump({
    'pages': len(pages), 'broken': out['broken'], 'bad_anchor': out['bad_anchor'], 'bad_local_anchor': out['bad_local_anchor'],
    'empty_href': out['empty_href'], 'external': sorted(set((h, z) for _, h, _, z in out['external'])),
    'external_full': out['external'], 'mailtel': sorted(set(h for _, h in out['mailtel'])),
    'orphans': orphans, 'only_nav': only_nav, 'forms': forms,
    'emails': emails.most_common(), 'phones': phones.most_common(), 'addrs': addrs.most_common(),
    'pairs': out['pairs'],
    'iframes': [(u, d['p'].iframes) for u, d in pages.items() if d['p'].iframes],
}, open(sys.argv[2], 'w'), indent=1)
print('pages', len(pages), 'broken', len(out['broken']), 'bad_anchor', len(out['bad_anchor']), 'bad_local_anchor', len(out['bad_local_anchor']), 'empty', len(out['empty_href']), 'orphans', len(orphans), 'forms', len(forms))
