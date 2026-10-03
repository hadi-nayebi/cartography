import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';

const systems = {bpl_libraries:'Brooklyn Public Library',nypl_libraries:'New York Public Library',qpl_libraries:'Queens Public Library'};
const boroughs = new Set(['BRONX','BROOKLYN','MANHATTAN','QUEENS','STATEN ISLAND']);
// Only corroborated pairs are combined. Shared coordinates or a placeholder
// building ID alone cannot establish a shared site.
export function normalizeLibraries(rows, groups=[]) {
 const records=rows.filter(r=>r.factype==='PUBLIC LIBRARY').map(r=>{
  if(!r.uid || !systems[r.datasource] || !boroughs.has(r.boro))throw new Error('Unknown library identity, system or borough');
  if(!r.latitude?.trim() || !r.longitude?.trim())throw new Error(`Missing coordinates: ${r.uid}`);
  const latitude=Number(r.latitude),longitude=Number(r.longitude);
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||latitude<40.45||latitude>40.95||longitude< -74.3||longitude> -73.65)throw new Error(`Invalid NYC coordinates: ${r.uid}`);
  return {id:r.uid,name:r.facname,borough:r.boro,system:systems[r.datasource],source:r.datasource,latitude,longitude,buildingId:/^[1-5]\d{6}$/.test(r.bin??'')?r.bin:null,address:r.address??null};
 });
 const byId=new Map(records.map(r=>[r.id,r]));
 if(byId.size!==records.length)throw new Error('Duplicate record ID');
 const grouped=new Set();
 const markers=groups.map(g=>{
  if(!g.id||g.members.length<2||!g.evidence?.length)throw new Error('A site group requires members and evidence');
  const members=g.members.map(id=>{
   if(!byId.has(id)||grouped.has(id))throw new Error(`Missing or multiply grouped record: ${id}`);
   grouped.add(id);return byId.get(id);
  });
  const anchor=byId.get(g.anchorId);
  if(!anchor||!g.members.includes(g.anchorId))throw new Error('Group anchor must be a member');
  if(!anchor.buildingId||members.some(r=>r.buildingId!==anchor.buildingId||r.system!==anchor.system||r.borough!==anchor.borough))throw new Error('Corroborated group building/system/borough changed');
  return {id:g.id,name:g.name,latitude:anchor.latitude,longitude:anchor.longitude,borough:anchor.borough,system:anchor.system,memberIds:g.members,evidence:g.evidence};
 });
 for(const r of records)if(!grouped.has(r.id))markers.push({id:r.id,name:r.name,latitude:r.latitude,longitude:r.longitude,borough:r.borough,system:r.system,memberIds:[r.id],evidence:[]});
 const countBy=(key)=>Object.fromEntries([...new Set(records.map(r=>r[key]))].sort().map(value=>[value,records.filter(r=>r[key]===value).length]));
 return {schemaVersion:1,measure:'FacDB public-library records, not certified current branches',recordCount:records.length,mapMarkerCount:markers.length,documentedSiteGroups:groups.length,recordCountsByBorough:countBy('borough'),recordCountsBySystem:countBy('system'),records,markers:markers.sort((a,b)=>a.id.localeCompare(b.id))};
}

if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const root=fileURLToPath(new URL('../../',import.meta.url));
 const source=await readFile(resolve(root,'data/nyc-libraries/raw/facdb-26v1-libraries.json'));
 const provenance=JSON.parse(await readFile(resolve(root,'data/nyc-libraries/provenance.json'),'utf8'));
 const digest=createHash('sha256').update(source).digest('hex');
 if(digest!==provenance.rawSha256)throw new Error('Source snapshot hash changed; review provenance');
 const groups=JSON.parse(await readFile(resolve(root,'data/nyc-libraries/site-groups.json'),'utf8'));
 const result={...normalizeLibraries(JSON.parse(source),groups),snapshot:provenance.version,retrievedAt:provenance.retrievedAt,rawSha256:digest};
 await writeFile(resolve(root,'data/nyc-libraries/derived/libraries.json'),JSON.stringify(result,null,2)+'\n');
 console.log(JSON.stringify({records:result.recordCount,mapMarkers:result.mapMarkerCount,siteGroups:result.documentedSiteGroups,boroughs:result.recordCountsByBorough}));
}
