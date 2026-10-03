import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Year={year:number;total:number;era:string};
type District={id:string;name:string;centroid:number[];polygon:number[][][];total:number};
export type BostonData={years:Year[];districts:District[];mappedTotal:number;historicalChange:number;modernChange:number;sinceLow:number;categories:{key:string;total:number}[]};
export type BostonProps={data:BostonData|null};
const C={bg:'#091827',panel:'#10283a',ink:'#f6f1e5',dim:'#afc6d2',teal:'#51dcc1',gold:'#ffc96c',grid:'#315064'};
const num=(n:number)=>n.toLocaleString('en-US');
const clamp=(x:number)=>Math.max(0,Math.min(1,x));

const CityMap:React.FC<{data:BostonData;large?:boolean;heat?:boolean;highlight?:string}>=({data,large=false,heat=false,highlight})=>{
 const paths=useMemo(()=>{
  const pts=data.districts.flatMap(d=>d.polygon.flat());
  const xs=pts.map(p=>p[0]*Math.cos(42.3*Math.PI/180)),ys=pts.map(p=>p[1]);
  const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
  const scale=Math.min(710/(maxX-minX),660/(maxY-minY));
  const project=(p:number[])=>[45+(p[0]*Math.cos(42.3*Math.PI/180)-minX)*scale,55+(maxY-p[1])*scale];
  return data.districts.map(d=>({...d,path:d.polygon.map(r=>r.map((p,i)=>`${i?'L':'M'}${project(p).map(v=>v.toFixed(1)).join(',')}`).join(' ')+'Z').join(' '),point:project(d.centroid)}));
 },[data]);
 return <div style={{position:'absolute',left:large?72:1300,top:large?225:275,width:large?870:555,height:large?620:490}}>
  <svg width="100%" height="100%" viewBox="0 0 800 740">
   {paths.map(d=><path key={d.id} d={d.path} fill={highlight===d.id?C.gold:heat?C.teal:'#24465a'} fillOpacity={highlight===d.id?1:heat?.22+.78*d.total/5584:.7} stroke={C.dim} strokeWidth={highlight===d.id?3:1.4}/>)}
   {paths.filter(d=>highlight?d.id===highlight:large&&['D4','A1','B2','A15'].includes(d.id)).map(d=><g key={d.id}><circle cx={d.point[0]} cy={d.point[1]} r={7} fill={C.ink}/><text x={d.point[0]+12} y={d.point[1]-10} fill={C.ink} fontFamily="sans-serif" fontWeight="700" fontSize="25" stroke={C.bg} strokeWidth="5" paintOrder="stroke">{d.id}</text></g>)}
  </svg>
  <div style={{fontSize:24,color:C.dim,textAlign:'center',marginTop:2}}>Boston police districts · north ↑</div>
 </div>;
};

const Chart:React.FC<{years:Year[];progress:number;accent?:string;marker?:number;small?:boolean}>=({years,progress,accent=C.teal,marker,small=false})=>{
 const width=small?500:1100,height=380,left=88,right=40,top=35,bottom=68;
 const max=Math.ceil(Math.max(...years.map(y=>y.total))/10000)*10000;
 const x=(i:number)=>left+i/(years.length-1)*(width-left-right);
 const y=(n:number)=>height-bottom-n/max*(height-top-bottom);
 const path=years.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v.total)}`).join(' ');
 const markerIndex=years.findIndex(v=>v.year===marker);
 return <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
  {[0,.5,1].map(v=><g key={v}><line x1={left} x2={width-right} y1={y(v*max)} y2={y(v*max)} stroke={C.grid}/><text x={left-18} y={y(v*max)+9} textAnchor="end" fill={C.dim} fontSize="25">{v*max/1000}k</text></g>)}
  <path d={path} fill="none" stroke={accent} strokeWidth="6" strokeLinejoin="round" pathLength={1000} strokeDasharray="1000" strokeDashoffset={1000*(1-clamp(progress))}/>
  {years.map((v,i)=>i/(years.length-1)<=progress&&<circle key={v.year} cx={x(i)} cy={y(v.total)} r={4} fill={accent}/>)}
  {[0,Math.floor((years.length-1)/2),years.length-1].map(i=><text key={i} x={x(i)} y={height-18} textAnchor="middle" fill={C.dim} fontSize="29">{years[i].year}</text>)}
  {markerIndex>=0&&<g><line x1={x(markerIndex)} x2={x(markerIndex)} y1={20} y2={height-bottom} stroke={C.gold} strokeDasharray="8 8" strokeWidth="2"/><text x={Math.min(width-95,Math.max(100,x(markerIndex)))} y={22} textAnchor="middle" fill={C.gold} fontSize="27">{marker}</text></g>}
 </svg>;
};

const scenes=[
 {start:0,end:18,kicker:'BOSTON / 1985–2025',title:'A different city. A different record.',captions:['Forty years of recorded crime tell a story of change.','But one continuous line would hide a crucial break.','Follow the long decline, the new measuring system, and the city map.']},
 {start:18,end:43,kicker:'01 / THE LONG VIEW',title:'The older series falls by 71%.',captions:['The FBI series peaks at 70,003 in 1989.','By 2015 it records 20,110 under that same broad measure.','These are reported counts, not a person’s probability of becoming a victim.']},
 {start:43,end:65,kicker:'CONTEXT / 1996',title:'A city response enters the timeline.',captions:['Operation Ceasefire began in 1996, targeting youth firearm violence.','It is a useful historical anchor—not an explanation for every movement here.','This chart covers a broader crime measure than the intervention’s target.']},
 {start:65,end:88,kicker:'02 / THE MEASURING SYSTEM CHANGES',title:'Do not join these two endpoints.',captions:['The historical FBI series ends in 2015.','The newer BPD record starts in August 2015; 2016 is its first full year here.','Different source and classification. Compare change within each panel.']},
 {start:88,end:116,kicker:'03 / THE RECENT DECADE',title:'Lower than 2016. Above the 2022 low.',captions:['Crime-classified, district-assigned records fall 36% from 2016 to 2025.','Boston declared a public health emergency on March 15, 2020.','That date gives context. This chart alone cannot isolate a pandemic effect.','The 2025 count is 9% above 2022, despite the longer decline.']},
 {start:116,end:144,kicker:'04 / WHERE REPORTS WERE ASSIGNED IN 2025',title:'The citywide total hides local differences.',captions:['The 2025 district counts add up to 29,963 in this extracted series.','D-4 has the largest count in this view: 5,584.','Police district labels are reference names, not exact neighborhood boundaries.','Population, visitors and reporting differ. These counts cannot rank safety.']},
 {start:144,end:163,kicker:'05 / WHAT IS BEING COUNTED?',title:'Most of this count is property-related.',captions:['The recipe groups offense descriptions into three crime categories.','Service records are excluded; these are records, not unique victims.','Sexual-assault reports are absent from the public incident file—not zero.']},
 {start:163,end:180,kicker:'TAKE THE PERSPECTIVE WITH YOU',title:'Read the trend. Keep the context.',captions:['Boston’s older and newer records both show substantial long-run declines.','The source break and local differences are part of the story.','Ask what changed, what was counted, and whose experience a count leaves out.']},
];

export const BostonReview:React.FC<BostonProps>=({data})=>{
 const frame=useCurrentFrame();const {fps}=useVideoConfig();const sec=frame/fps;
 const scene=scenes.find(s=>sec>=s.start&&sec<s.end)??scenes[scenes.length-1];
 const i=scenes.indexOf(scene),local=sec-scene.start;
 const fade=interpolate(local,[0,.65],[0,1],{extrapolateRight:'clamp'});
 if(!data)return <AbsoluteFill style={{background:C.bg}}/>;
 const fbi=data.years.filter(y=>y.era==='fbi'),recent=data.years.filter(y=>y.era==='incident');
 const caption=scene.captions[Math.min(scene.captions.length-1,Math.floor(local/((scene.end-scene.start)/scene.captions.length)))];
 const panelStyle:React.CSSProperties={position:'absolute',left:90,top:300};
 const source=i===2?'Historical anchor: US Department of Justice / Operation Ceasefire':i===4?'Historical anchor: Boston public-health emergency order, March 2020':'Sources: FBI UCR + BPD / Analyze Boston · snapshot: July 12, 2026';
 return <AbsoluteFill style={{background:C.bg,color:C.ink,fontFamily:'Arial, sans-serif'}}>
  <Audio src={staticFile('audio/boston-review.mp3')} volume={f=>.22*Math.min(clamp(f/fps/3),clamp((180-f/fps)/4))}/>
  <div style={{position:'absolute',left:88,top:50,fontSize:26,letterSpacing:5,color:C.teal}}>CARTOGRAPHY</div>
  <div style={{position:'absolute',right:88,top:50,fontSize:24,color:C.dim}}>{String(i+1).padStart(2,'0')} / 08</div>
  <div style={{opacity:fade}}>
   <div style={{position:'absolute',left:88,top:115,color:C.gold,fontSize:27,letterSpacing:2}}>{scene.kicker}</div>
   <div style={{position:'absolute',left:88,top:166,fontSize:62,fontWeight:700,letterSpacing:-1.8,maxWidth:1700}}>{scene.title}</div>
   <CityMap data={data} large={i===5} heat={i===5} highlight={i===5&&local>=7?'D4':undefined}/>
   {i===0&&<div style={{...panelStyle,top:345,width:1100}}><div style={{fontSize:138,fontWeight:700,color:C.teal}}>1985 <span style={{color:C.dim,fontWeight:400}}>→</span> 2025</div><div style={{fontSize:42,color:C.dim,marginTop:35,lineHeight:1.4}}>One place.<br/>Two data eras.<br/>A more useful way to read change.</div></div>}
   {(i===1||i===2)&&<div style={panelStyle}><div style={{fontSize:29,color:C.dim,marginBottom:20}}>FBI UCR · annual reported index-crime counts</div><Chart years={fbi} progress={i===2?1:local/12} marker={i===2?1996:1989}/><div style={{fontSize:44,marginTop:15}}><span style={{color:C.teal}}>70,003 → 20,110</span><span style={{color:C.dim,fontSize:31}}> / 1989 to 2015</span></div>{i===2&&<div style={{fontSize:29,color:C.gold,marginTop:18}}>Ceasefire: youth firearm violence, not this entire total.</div>}</div>}
   {i===3&&<div style={{...panelStyle,display:'flex',gap:40}}><div><div style={{fontSize:32,color:C.teal}}>FBI / 1985–2015</div><Chart years={fbi} progress={1} small/><div style={{fontSize:36}}>2015: 20,110</div></div><div style={{borderLeft:`2px dashed ${C.gold}`,paddingLeft:25}}><div style={{fontSize:32,color:C.gold}}>BPD / 2016–2025</div><Chart years={recent} progress={1} accent={C.gold} small/><div style={{fontSize:36}}>2016: 46,849</div></div></div>}
   {i===4&&<div style={panelStyle}><div style={{fontSize:29,color:C.dim,marginBottom:20}}>BPD · crime-classified records assigned to a district</div><Chart years={recent} progress={local/10} accent={C.gold} marker={2020}/><div style={{fontSize:43,marginTop:15}}><span style={{color:C.gold}}>46,849 → 29,963</span><span style={{fontSize:29,color:C.dim}}> / 2016 to 2025</span></div><div style={{fontSize:29,color:C.dim,marginTop:18}}>2022: 27,537 · 2025: +9% from that low</div></div>}
   {i===5&&<div style={{position:'absolute',left:1050,top:310,width:770}}><div style={{fontSize:29,color:C.dim,marginBottom:35}}>Crime-classified records / 2025</div>{data.districts.slice(0,4).map(d=><div key={d.id} style={{marginBottom:25}}><div style={{fontSize:31,display:'flex',justifyContent:'space-between'}}><span>{d.id} · {d.name}</span><b>{num(d.total)}</b></div><div style={{height:14,marginTop:12,width:`${d.total/5584*100}%`,background:d.id==='D4'?C.gold:C.teal,opacity:.9}}/></div>)}<div style={{marginTop:35,fontSize:29,color:C.gold,lineHeight:1.45}}>Report volume, not a safety score.<br/>No population or visitor adjustment.</div></div>}
   {i===6&&<div style={{...panelStyle,width:1100}}>{[...data.categories].sort((a,b)=>b.total-a.total).map((c,j)=><div key={c.key} style={{marginBottom:42}}><div style={{fontSize:36,display:'flex',justifyContent:'space-between'}}><span>{({property:'Property',persons:'Persons',society:'Society'} as Record<string,string>)[c.key]}</span><b>{num(c.total)}</b></div><div style={{height:28,width:`${c.total/data.mappedTotal*100}%`,marginTop:15,background:[C.teal,C.gold,'#94a5fa'][j]}}/></div>)}<div style={{fontSize:28,color:C.dim}}>2025 · documented keyword classification · service records excluded</div></div>}
   {i===7&&<div style={{...panelStyle,width:1120,fontSize:45,lineHeight:1.7}}><div><span style={{color:C.teal}}>01</span> Compare like with like.</div><div><span style={{color:C.teal}}>02</span> Use events as anchors, not shortcuts.</div><div><span style={{color:C.teal}}>03</span> Read place as well as time.</div><div style={{marginTop:50,fontSize:30,color:C.dim,lineHeight:1.5}}>Data, definitions and reproduction recipe<br/>github.com/hadi-nayebi/cartography</div></div>}
  </div>
  <div style={{position:'absolute',left:88,right:88,bottom:100,borderTop:`1px solid ${C.grid}`,paddingTop:23,fontSize:37,lineHeight:1.3,minHeight:74}}>{caption}</div>
  <div style={{position:'absolute',left:88,bottom:42,fontSize:22,color:C.dim}}>{source}</div>
  <div style={{position:'absolute',right:88,bottom:42,fontSize:22,color:C.dim}}>Counts ≠ risk · source details in the recipe</div>
  <div style={{position:'absolute',bottom:0,left:0,height:7,width:`${sec/180*100}%`,background:C.teal}}/>
 </AbsoluteFill>;
};
