"""Reproduce Boston's three review thumbnail candidates from plotted source data.

Run from any directory with Python 3 and Pillow installed. No stock crime imagery.
"""
from pathlib import Path
import json
import shutil
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "videos/boston-crime-context-2026-01/packaging"
OUT.mkdir(exist_ok=True)
DATA = ROOT / "data/boston-ma/normalized"
history = json.loads((DATA / "history.json").read_text())["years"]
beats = json.loads((DATA / "beats.json").read_text())["beats"]
timeline = json.loads((DATA / "timeline.json").read_text())
indices = range(len(timeline["months"]) - 60, len(timeline["months"]))
counts = {k: sum(timeline["cells"][k][i][c] for i in indices for c in ("persons", "property", "society")) for k in beats}
assert sum(counts.values()) == 148155
FONT = Path("/usr/share/fonts/truetype/dejavu")
def font(size, bold=True):
    return ImageFont.truetype(str(FONT / ("DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf")), size)

def canvas():
    im = Image.new("RGB", (1280, 720), "#101e2b")
    return im, ImageDraw.Draw(im)

def text(d, xy, value, size, fill="#f8f1dd", bold=True):
    d.text(xy, value, font=font(size, bold), fill=fill, stroke_width=0)

def map_shape(d, box, colored=False):
    pts = [p for b in beats.values() for ring in b["polygon"] for p in ring]
    xmin, xmax = min(p[0] for p in pts), max(p[0] for p in pts)
    ymin, ymax = min(p[1] for p in pts), max(p[1] for p in pts)
    x, y, w, h = box
    # Longitude compressed for Boston's latitude; preserve geographic aspect.
    scale = min(w / ((xmax - xmin) * .739), h / (ymax - ymin))
    ox = x + (w - (xmax-xmin)*.739*scale)/2
    oy = y + (h - (ymax-ymin)*scale)/2
    for key, b in beats.items():
        t = counts[key] / max(counts.values())
        color = tuple(round(a+(z-a)*t) for a,z in zip((48,91,113),(249,181,75))) if colored else "#2a485b"
        for ring in b["polygon"]:
            poly = [(ox+(p[0]-xmin)*.739*scale, oy+(ymax-p[1])*scale) for p in ring]
            d.polygon(poly, fill=color, outline="#d8e8e7", width=2)

im,d=canvas()
map_shape(d,(755,95,480,555))
text(d,(55,40),"BOSTON",108)
text(d,(62,198),"CRIME",64, "#f2b44e")
text(d,(62,288),"WHAT",91)
text(d,(62,390),"CHANGED?",91)
text(d,(65,565),"40 YEARS · MAPPED",35)
im.save(OUT/"a-long-arc.jpg",quality=94)

im,d=canvas()
text(d,(55,38),"BOSTON",88)
text(d,(50,135),"−71%",176,"#f2b44e")
text(d,(62,351),"FBI INDEX CRIMES",31)
text(d,(62,414),"1989 → 2015",44)
subset=[h for h in history if 1989<=h['year']<=2015]
for i,h in enumerate(subset):
    x=650+i*20; height=h['total']/70003*375
    d.rounded_rectangle((x,550-height,x+14,550),radius=3,fill="#f2b44e" if i in (0,len(subset)-1) else "#6c96a8")
text(d,(639,580),"THE LONG DECLINE",31)
im.save(OUT/"b-decline.jpg",quality=94)

im,d=canvas()
map_shape(d,(650,45,575,580),True)
text(d,(52,40),"BOSTON",87)
text(d,(56,199),"WHERE",79)
text(d,(56,298),"REPORTS",79)
text(d,(56,397),"CLUSTER",79,"#f2b44e")
text(d,(59,565),"12 POLICE DISTRICTS",30)
text(d,(685,642),"JUL 2021–JUN 2026",28)
im.save(OUT/"c-districts.jpg",quality=94)

# Selected starting thumbnail: one geographic identifier and one verified fact.
# The neutral map is an outline, not a heat map of the 1989–2015 change.
im,d=canvas()
map_shape(d,(735,70,490,575))
text(d,(55,35),"BOSTON",98)
text(d,(45,180),"−71%",185,"#f2b44e")
text(d,(65,415),"FBI INDEX CRIMES",34)
text(d,(65,485),"1989 → 2015",46)
text(d,(65,620),"40 YEARS OF CHANGE",32)
im.save(OUT/"selected-map-number.jpg",quality=94)
shutil.copyfile(OUT/"selected-map-number.jpg", OUT.parent/"thumbnail.jpg")

sheet=Image.new('RGB',(960,600),'#eef0f0')
sd=ImageDraw.Draw(sheet)
for n,(name,title) in enumerate([
    ('a-long-arc.jpg','A · Boston Crime: 40 Years of Change, Mapped'),
    ('b-decline.jpg','B · Boston’s Long Crime Decline—and What Came Next'),
    ('c-districts.jpg','C · Where Boston Crime Reports Cluster')]):
    pic=Image.open(OUT/name);pic.thumbnail((320,180));sheet.paste(pic,(0,n*200))
    sd.text((338,n*200+62),title,font=font(18),fill='#172b3b')
sheet.save(OUT/'review-sheet.jpg',quality=94)
print('Wrote three 1280×720 candidates and review sheet; no empirical winner claimed.')
