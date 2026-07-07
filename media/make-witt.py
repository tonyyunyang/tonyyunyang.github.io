"""Derive the halftone ink map (witt.png) from the Moritz Nähr portrait of
Wittgenstein (public domain; Wikimedia Commons "Ludwig Wittgenstein 1930").
Usage: python3 make-witt.py <path-to-photo.png>

Output: media/witt.png — small RGBA image where each pixel is one particle,
alpha = ink density (0 = background, no particle). Plus debug previews.
"""
import sys
from PIL import Image, ImageDraw, ImageOps, ImageFilter

SRC = sys.argv[1] if len(sys.argv) > 1 else "witt-source.png"
OUT = "witt.png"
DBG = "."

im = Image.open(SRC).convert("RGB")
W, H = im.size

# ---- 1. background removal: flood fill from every bright border pixel ----
g = ImageOps.grayscale(im)
work = g.copy()
d = ImageDraw.Draw(work)
MARK = 1  # sentinel value (photo has no pure-1 grays after we check)
seeds = []
for x in range(0, W, 4):
    seeds += [(x, 0), (x, H - 1)]
for y in range(0, H, 4):
    seeds += [(0, y), (W - 1, y)]
px = work.load()
gpx = g.load()
for (x, y) in seeds:
    if gpx[x, y] > 165 and px[x, y] != MARK:
        ImageDraw.floodfill(work, (x, y), MARK, thresh=42)

mask = work.point(lambda v: 255 if v == MARK else 0)  # white = background
# close small gaps, then soften the edge so the silhouette isn't razor-cut
mask = mask.filter(ImageFilter.MaxFilter(3))
mask = mask.filter(ImageFilter.GaussianBlur(1.2))
mask.save(f"{DBG}/witt-mask.png")

# ---- 2. ink from darkness; local contrast so the features pop ----
g2 = ImageOps.autocontrast(g, cutoff=1)
g2 = g2.filter(ImageFilter.UnsharpMask(radius=5, percent=110, threshold=2))
ink = g2.point(lambda v: int(255 * ((1 - v / 255) ** 0.92)))
# subtract background
ink = Image.composite(Image.new("L", im.size, 0), ink, mask)
ink.save(f"{DBG}/witt-ink-full.png")

# ---- 3. crop to head + collar (the jacket mostly fades under the text
# anyway) so the face fills more of the canvas and the features resolve ----
CROP = (12, 0, 238, 290)  # trims side background and lower jacket
ink = ink.crop(CROP)
CW_, CH_ = ink.size
GRID_W = 92
GRID_H = int(round(GRID_W * CH_ / CW_))
small = ink.resize((GRID_W, GRID_H), Image.LANCZOS)

# count particles above the runtime threshold
lo = small.point(lambda v: 255 if v >= 26 else 0)
count = sum(1 for v in lo.getdata() if v)
print(f"grid {GRID_W}x{GRID_H}, particles >= thresh: {count}")

out = Image.new("RGBA", small.size, (0, 0, 0, 0))
out.putalpha(small)
out.save(OUT)
print("wrote", OUT)

# ---- 4. preview: render the halftone as it would appear on yellow ----
SCALE = 6
prev = Image.new("RGB", (GRID_W * SCALE, GRID_H * SCALE), (255, 255, 2))
pd = ImageDraw.Draw(prev)
spx = small.load()
for gy in range(GRID_H):
    for gx in range(GRID_W):
        a = spx[gx, gy]
        if a < 26:
            continue
        t = a / 255
        r = (0.55 + 2.3 * t) * SCALE / 2
        alpha = min(0.30, 0.10 + 0.26 * t)
        # composite black at `alpha` over yellow
        c = tuple(int(v * (1 - alpha)) for v in (255, 255, 2))
        cx, cy = gx * SCALE + SCALE / 2, gy * SCALE + SCALE / 2
        pd.ellipse([cx - r, cy - r, cx + r, cy + r], fill=c)
prev.save(f"{DBG}/witt-preview.png")
print("preview written")
