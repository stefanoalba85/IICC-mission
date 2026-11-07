#!/usr/bin/env python3
"""Applies a reviewed translation sheet to src/i18n/it.json.

    python3 scripts/i18n/import-review.py <review.xlsx|review.csv> [--dry-run]

Reads the sheet made by `npm run i18n:export`, once the reviewer has filled in the Correzione and Note
columns. Each Correzione replaces the Italian text of its English key. A correction whose placeholders
([1], [/1], [2/]...) differ from the English text is skipped and listed, to be fixed by hand. Rows that
carry only a note are listed too: they need a decision, not a replacement. .xlsx needs openpyxl.
"""
import collections, csv, json, re, sys

CATALOG = 'src/i18n/it.json'
PLACEHOLDER = re.compile(r'\[/?\d+/?\]')

def rows(path):
    if path.endswith('.csv'):
        with open(path, encoding='utf-8-sig', newline='') as f:
            yield from csv.DictReader(f)
        return
    import openpyxl
    sheet = openpyxl.load_workbook(path, read_only=True).active
    it = sheet.iter_rows(values_only=True)
    head = next(it)
    for r in it:
        yield dict(zip(head, r))

def main():
    args = [a for a in sys.argv[1:] if a != '--dry-run']
    if len(args) != 1:
        sys.exit(__doc__)
    catalog = json.load(open(CATALOG, encoding='utf-8'))
    applied, same, stale, bad, notes = [], [], [], [], []
    for r in rows(args[0]):
        en = r.get('Testo inglese')
        fix = (r.get('Correzione') or '').strip()
        note = (r.get('Note') or '').strip()
        if note:
            notes.append((en, note))
        if not fix:
            continue
        if en not in catalog:
            stale.append(en)
        elif collections.Counter(PLACEHOLDER.findall(fix)) != collections.Counter(PLACEHOLDER.findall(en)):
            bad.append((en, fix))
        elif fix == catalog[en]:
            same.append(en)
        else:
            catalog[en] = fix
            applied.append(en)
    if '--dry-run' not in sys.argv:
        with open(CATALOG, 'w', encoding='utf-8') as f:
            json.dump(catalog, f, ensure_ascii=False, indent=2)
            f.write('\n')
    print(f'{len(applied)} applied, {len(same)} unchanged, {len(stale)} no longer in the catalog, '
          f'{len(bad)} with wrong placeholders, {len(notes)} rows with notes')
    for en in stale:
        print('  no longer in the catalog:', en[:100])
    for en, fix in bad:
        print('  wrong placeholders:', en[:100], '=>', fix[:100])

main()
