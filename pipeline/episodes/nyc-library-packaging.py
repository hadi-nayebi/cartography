#!/usr/bin/env python3
"""Selected map-led thumbnail and publishing text from frozen source geometry."""
import json,pathlib,hashlib
from PIL import Image,ImageDraw,ImageFont
root=pathlib.Path(__file__).resolve().parents[2];out=root/'videos/nyc-libraries-2026-01/packaging';out.mkdir(exist_ok=True)
img=Image.new('RGB',(1280,720),'#f2efdf');d=ImageDraw.Draw(img)
colors=['#247e8b','#c45a34','#8062ac'];system={'Manhattan':0,'Bronx':0,'Staten Island':0,'Brooklyn':1,'Queens':2}
def font(s):return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',s)
def xy(p):return (70+(p[0]+74.26)*1120,75+(40.92-p[1])*1480)
g=json.loads((root/'data/nyc-libraries/raw/boroughs-26b.geojson').read_text())
for f in g['features']:
 polygons=f['geometry']['coordinates'] if f['geometry']['type']=='MultiPolygon' else [f['geometry']['coordinates']]
 for poly in polygons:
  for index,ring in enumerate(poly):
   d.polygon([xy(p) for p in ring],fill=colors[system[f['properties']['boroname']]] if index==0 else '#f2efdf')
d.text((44,22),'NEW YORK CITY',font=font(36),fill='#122a37')
d.text((795,75),'3',font=font(238),fill='#122a37')
d.text((758,354),'LIBRARY',font=font(62),fill='#122a37')
d.text((758,427),'SYSTEMS',font=font(62),fill='#122a37')
d.text((763,532),'ONE CITY',font=font(42),fill='#122a37')
for i,c in enumerate(colors):d.rounded_rectangle((763+i*141,615,878+i*141,627),6,fill=c)
img.save(out/'thumbnail.jpg',quality=95,subsampling=0)
title='New York’s Three Library Systems, Mapped'
text='''New York City has three public-library systems. Follow their geography across five boroughs, rewind to their 1895–1896 roots, and visit Bedford Library as an example of a neighborhood institution that offers more than books.

00:00 One city, three library systems
00:10 New York Public Library: three boroughs
00:25 Brooklyn Public Library
00:35 Queens Public Library
00:45 Library roots before consolidation
01:09 The five-borough city in 1898
01:20 Bedford Library in Brooklyn
01:46 Learning beyond the bookshelves
01:58 The citywide network today
02:18 One city, more than one story

SOURCES
NYPL institutional timeline: https://www.nypl.org/125/timeline
NYPL system overview: https://www.nypl.org/about
Brooklyn Public Library history: https://www.bklynlibrary.org/125
Queens Public Library institutional history: https://hiphop50.queenslibrary.org/venue/queens-public-library/
1898 consolidation, NYC Landmarks Preservation Commission: https://archaeology.cityofnewyork.us/collection/nyc-timeline/consolidation-of-the-five-borough-city
Bedford Library: https://www.bklynlibrary.org/locations/bedford
Brooklyn adult learning centers: https://www.bklynlibrary.org/adult-learning/learning-centers
Queens current locations: https://www.queenslibrary.org/about-us/locations
NYC Planning Facilities Database: https://data.cityofnewyork.us/City-Government/Facilities-Database/ji82-xba5
Borough boundaries: https://data.cityofnewyork.us/City-Government/Borough-Boundaries/gthc-hcne

MAP NOTES
The June 2026 FacDB 26v1 public-library subset contains 226 records. Five documented library/learning-center pairs share display markers, yielding 221 markers. These are dataset records and display conventions, not a certified census of currently open branches or unique buildings. Check the provider's directory before visiting. Modern borough outlines support the historical dates; the film does not reconstruct historical branch openings or explain all causes of separate governance.

REPRODUCIBLE RECIPE
https://github.com/hadi-nayebi/cartography/tree/codex/nyc-library-recipe/videos/nyc-libraries-2026-01
Source data, checks and display scripts are retained in the repository.

Original procedural instrumental score, generated from the included script; no narration or external audio samples.
'''
(out/'description.txt').write_text(text)
(out/'youtube.json').write_text(json.dumps({'title':title,'description':text,'visibility':'unpublished-review','thumbnail':'thumbnail.jpg','thumbnailSha256':hashlib.sha256((out/'thumbnail.jpg').read_bytes()).hexdigest(),'thumbnailChoice':'Producer-selected geographic silhouette plus the verified three-system premise; performance untested','tags':['New York City','libraries','urban history','maps','Cartography']},indent=2)+'\n')
print(out)
