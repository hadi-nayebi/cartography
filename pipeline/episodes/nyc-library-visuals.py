#!/usr/bin/env python3
"""Prepare only display geometry; analytical geometry and source records stay intact."""
import json, math, pathlib
root=pathlib.Path(__file__).resolve().parents[2]
data=json.loads((root/'data/nyc-libraries/derived/libraries.json').read_text())
geo=json.loads((root/'data/nyc-libraries/raw/boroughs-26b.geojson').read_text())
def xy(p): return [100+(p[0]+74.26)*1250, 35+(40.92-p[1])*1650]
def simplify(points,tol=.25):
 if len(points)<3:return points
 a,b=points[0],points[-1]; dx=b[0]-a[0];dy=b[1]-a[1];den=dx*dx+dy*dy
 def dist(p):
  t=max(0,min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/den)) if den else 0
  return math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)
 ds=[dist(p) for p in points];i=max(range(len(ds)),key=ds.__getitem__)
 if ds[i]<=tol:return [a,b]
 return simplify(points[:i+1],tol)[:-1]+simplify(points[i:],tol)
paths=[]
for f in geo['features']:
 polygons=f['geometry']['coordinates'] if f['geometry']['type']=='MultiPolygon' else [f['geometry']['coordinates']]
 path=[]
 for poly in polygons:
  for ring in poly:
   pts=simplify([xy(p) for p in ring])
   path.append('M'+'L'.join(f'{x:.2f},{y:.2f}' for x,y in pts)+'Z')
 paths.append({'name':f['properties']['boroname'],'d':' '.join(path)})
for m in data['markers']:m['x'],m['y']=xy([m['longitude'],m['latitude']])
result={'boroughs':paths,'markers':data['markers'],'recordCount':data['recordCount'],'mapMarkerCount':data['mapMarkerCount']}
out=root/'surface/remotion/public/data/nyc-libraries/visuals.json';out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(result,separators=(',',':'))+'\n')
print(f'{len(paths)} borough paths; {len(data["markers"])} markers; {out.stat().st_size} display bytes')
