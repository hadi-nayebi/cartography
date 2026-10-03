import {readFile, writeFile, mkdir, copyFile, cp} from 'node:fs/promises';
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

// Revision2 restores the original annual-histogram / monthly-map composition.
const history=await read('history.json');
for(const name of ['feed.json','points.json','neighborhoods.json','basemap.json'])await read(name);
const hist=(year)=>history.years.find(y=>y.year===year);
if(hist(1989).property!==57084||hist(2000).property!==28548||hist(2008).violent!==6676||hist(2008).property!==22429)throw new Error('Historical annotation changed');
if(hist(1993).total!==55555||Math.round((1-hist(1993).total/hist(1989).total)*100)!==21||hist(2010).violent!==5819||Math.round((1-hist(2010).violent/hist(1989).violent)*100)!==55)throw new Error('Revised historical finding changed');
const annualDistrict=(id,year)=>timeline.months.reduce((sum,m,i)=>sum+(m.startsWith(`${year}-`)?cats.reduce((n,c)=>n+timeline.cells[id][i][c],0):0),0);
if(annualDistrict('D4',2022)!==4156||annualDistrict('D4',2023)!==5022||trend.years.find(y=>y.year===2023).total!==31239)throw new Error('District or annual annotation changed');
const recent=timeline.months.slice(-60).map(month=>({month,total:Object.values(timeline.cells).reduce((s,v)=>s+cats.reduce((n,c)=>n+v[timeline.months.indexOf(month)][c],0),0)}));
const peak=recent.reduce((a,b)=>b.total>a.total?b:a);
if(peak.month!=='2024-08'||peak.total!==2944||result.categories.find(c=>c.key==='property').total!==18186)throw new Error('Monthly/category annotation changed');
const config=JSON.parse(await readFile(join(dir,'config.json'),'utf8'));
const viewerCopy=JSON.stringify([config.copy,config.historyNotes,config.annotations,config.hook,config.punchline]);
if(/do not join|never across|safest|to this week/i.test(viewerCopy))throw new Error('Production instruction or unsupported claim leaked into viewer copy');
await cp(source,join(root,'surface/remotion/public/data/boston-ma/normalized'),{recursive:true});
await copyFile(join(dir,'music-v2.mp3'),join(audio,'boston-review-v2.mp3'));
await writeFile(join(dir,config.historyInterlude?'revision4-inputs.json':'revision3-inputs.json'),JSON.stringify({sourceSnapshot:summary.fetchedAt,inputs:hashes,peak,configSha256:createHash('sha256').update(await readFile(join(dir,'config.json'))).digest('hex'),musicSha256:createHash('sha256').update(await readFile(join(dir,config.historyInterlude?'music-v4.mp3':'music-v2.mp3'))).digest('hex')},null,2)+'\n');

if(config.historyInterlude) await copyFile(join(dir,'music-v4.mp3'),join(audio,'boston-review-v4.mp3'));

// Calendar landmarks must carry source evidence and fit between neighboring notes.
const notes=[...config.historyNotes].sort((a,b)=>a.atYear-b.atYear);
for(let i=0;i<notes.length;i++){
 const note=notes[i];
 if(note.role==='calendar-anchor'&&!/^https:\/\//.test(note.sourceUrl??''))throw new Error('Calendar anchor lacks a source');
 const end=22+(note.atYear-1985)/41*128+(note.durationSec??4.6);
 if(i+1<notes.length&&end>22+(notes[i+1].atYear-1985)/41*128)throw new Error('Historical annotations overlap');
}

await writeFile(join(dir,'story-beats.json'),JSON.stringify(notes.map(n=>({...n,startsAtSeconds:Number((22+(n.atYear-1985)/41*128+((config.historyInterlude&&22+(n.atYear-1985)/41*128>=config.historyInterlude.pauseAtSec)?config.historyInterlude.durationSec:0)).toFixed(3)),endsAtSeconds:Number((22+(n.atYear-1985)/41*128+(n.durationSec??4.6)+((config.historyInterlude&&22+(n.atYear-1985)/41*128+(n.durationSec??4.6)>config.historyInterlude.pauseAtSec)?config.historyInterlude.durationSec:0)).toFixed(3)),relationship:n.role==='calendar-anchor'?'temporal context; no causal claim':'computed data finding'})),null,2)+'\n');
