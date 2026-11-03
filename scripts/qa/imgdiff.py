"""python3 scripts/qa/imgdiff.py <beforeDir> <afterDir> [outDir]
Compares same-named PNG screenshots pixel by pixel; reports pages that differ and writes
a red-highlighted diff image for each (requires Pillow)."""
import os, sys
from PIL import Image, ImageChops
a_dir, b_dir = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else None
if out: os.makedirs(out, exist_ok=True)
same = diff = 0
for f in sorted(os.listdir(a_dir)):
    if not f.endswith('.png'): continue
    pb = os.path.join(b_dir, f)
    if not os.path.exists(pb): print('MISSING', f); diff += 1; continue
    a = Image.open(os.path.join(a_dir, f)).convert('RGB'); b = Image.open(pb).convert('RGB')
    if a.size != b.size:
        print(f'SIZE  {f}: {a.size} -> {b.size}'); diff += 1; continue
    d = ImageChops.difference(a, b); box = d.getbbox()
    if not box: same += 1; continue
    px = sum(1 for v in d.convert('L').point(lambda x: 255 if x > 24 else 0).getdata() if v)
    print(f'DIFF  {f}: area {box}, {px} px changed'); diff += 1
    if out:
        m = d.convert('L').point(lambda x: 255 if x > 24 else 0)
        hl = b.copy(); hl.paste((255, 0, 0), mask=m); hl.save(os.path.join(out, f))
print(f'\n{same} identical, {diff} different')
