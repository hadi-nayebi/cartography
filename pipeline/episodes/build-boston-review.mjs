import {readFile, writeFile, mkdir, copyFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {resolve, dirname, join} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const source=join(root,'data/boston-ma/normalized');
const hashes={};
async function read(name){const bytes=await readFile(join(source,name));hashes[name]=createHash('sha256').update(bytes).digest('hex');return JSON.parse(bytes);}
const trend=await read('trend.json');
const timeline=await read('timeline.json');
const beats=await read('beats.json');
const summary=await read('summary.json');
const cats=['persons','property','society'];
const indices=timeline.months.flatMap((m,i)=>m.startsWith('2025-')?[i]:[]);
if(indices.length!==12)throw new Error('Need twelve months for 2025');
const districts=Object.entries(beats.beats).map(([id,beat])=>{
 const counts=Object.fromEntries(cats.map(c=>[c,indices.reduce((s,i)=>s+timeline.cells[id][i][c],0)]));
 return {id,name:beat.name,centroid:beat.centroid,polygon:beat.polygon,total:cats.reduce((s,c)=>s+counts[c],0),counts};
}).sort((a,b)=>b.total-a.total);
const mappedTotal=districts.reduce((s,d)=>s+d.total,0);
const year2025=trend.years.find(y=>y.year===2025).total;
if(mappedTotal!==year2025)throw new Error('2025 district totals do not reconcile with trend');
// The authored captions are tied to this snapshot. A data refresh must not
// silently retain old factual copy; fail before rendering until it is reviewed.
for(const [year,total] of [[1989,70003],[2015,20110],[2016,46849],[2022,27537],[2025,29963]]){
 if(trend.years.find(y=>y.year===year)?.total!==total)throw new Error(`Review authored caption for ${year}`);
}
if(districts[0].id!=='D4'||districts[0].total!==5584)throw new Error('Review district highlight');
const change=(from,to)=>Math.round((trend.years.find(y=>y.year===to).total/trend.years.find(y=>y.year===from).total-1)*100);
const result={
 title:'Boston: four decades, two measuring systems',
 snapshot:summary.fetchedAt,
 years:trend.years.filter(y=>y.year<=2025),districts,mappedTotal,
 categories:cats.map(key=>({key,total:districts.reduce((s,d)=>s+d.counts[key],0)})),
 historicalChange:change(1989,2015),
 modernChange:change(2016,2025),
 sinceLow:change(2022,2025),
 inputs:hashes,
};
const dir=join(root,'videos/boston-crime-context-2026-01');await mkdir(dir,{recursive:true});
await writeFile(join(dir,'story-data.json'),JSON.stringify(result));
const pub=join(root,'surface/remotion/public/stories');await mkdir(pub,{recursive:true});
await writeFile(join(pub,'boston-review.json'),JSON.stringify(result));
const audio=join(root,'surface/remotion/public/audio');await mkdir(audio,{recursive:true});
await copyFile(join(dir,'music.mp3'),join(audio,'boston-review.mp3'));
console.log(JSON.stringify({mappedTotal,categories:result.categories,districts:districts.map(({id,total})=>({id,total})),historicalChange:result.historicalChange,modernChange:result.modernChange,sinceLow:result.sinceLow}));
