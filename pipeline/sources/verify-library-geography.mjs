import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
// Ray casting in this local longitude/latitude extent. No areas or distances
// are inferred; both points and GeoJSON use the same WGS84 coordinates.
export function inRing([x,y], ring){
 let inside=false;
 for(let i=0,j=ring.length-1;i<ring.length;j=i++){
  const [ax,ay]=ring[i], [bx,by]=ring[j];
  if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
 }
 return inside;
}
export function inMultiPolygon(point, geometry){
 if(geometry.type!=='MultiPolygon')throw new Error('Expected MultiPolygon');
 return geometry.coordinates.some(rings=>inRing(point,rings[0])&&!rings.slice(1).some(r=>inRing(point,r)));
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../../data/nyc-libraries/',import.meta.url));
 const bytes=await readFile(resolve(root,'raw/boroughs-26b.geojson'));
 const provenance=JSON.parse(await readFile(resolve(root,'provenance.json'),'utf8'));
 if(createHash('sha256').update(bytes).digest('hex')!==provenance.boroughBoundaries.sha256)throw new Error('Borough snapshot hash changed');
 const features=JSON.parse(bytes).features;
 const polygons=new Map(features.map(f=>[f.properties.boroname.toUpperCase(),f.geometry]));
 if(polygons.size!==5)throw new Error('Expected five distinct boroughs');
 const {records}=JSON.parse(await readFile(resolve(root,'derived/libraries.json'),'utf8'));
 const failed=records.filter(r=>!polygons.has(r.borough)||!inMultiPolygon([r.longitude,r.latitude],polygons.get(r.borough)));
 if(failed.length)throw new Error(`Points outside assigned borough: ${failed.map(r=>r.id).join(', ')}`);
 console.log(`${records.length} records checked against assigned borough geometry; none outside.`);
}
