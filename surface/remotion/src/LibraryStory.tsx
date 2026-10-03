import React from 'react';
import {AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame} from 'remotion';
export type LibraryVisuals={boroughs:{name:string;d:string}[];markers:{id:string;name:string;system:string;borough:string;x:number;y:number}[];recordCount:number;mapMarkerCount:number};
export type LibraryProps={visuals:LibraryVisuals|null};
const INK='#122a37',PAPER='#f2efdf',MUTED='#5a6b70';
const systems=['New York Public Library','Brooklyn Public Library','Queens Public Library'];
const colors=['#247e8b','#c45a34','#8062ac'];
const boroughSystem:Record<string,number>={Manhattan:0,Bronx:0,'Staten Island':0,Brooklyn:1,Queens:2};
const labelsRaw:[string,number,number][]=[['BRONX',582,104],['MANHATTAN',435,268],['QUEENS',705,383],['BROOKLYN',475,585],['STATEN ISLAND',157,692]];
const labels=labelsRaw.map(([name,x,y])=>[name,100+x*1250/1550,35+y*1650/2050] as [string,number,number]);
const clamp=(x:number)=>Math.max(0,Math.min(1,x));
const smooth=(x:number)=>{const v=clamp(x);return v*v*(3-2*v)};
const scenes=[
 {start:0,end:10,k:'NEW YORK CITY',title:'One city.\nThree library systems.',body:'Follow the colors across five boroughs.',foot:'Public-library network geography · June 2026 facility snapshot'},
 {start:10,end:25,k:'01 / NEW YORK PUBLIC LIBRARY',title:'One network,\nthree boroughs.',body:'The Bronx, Manhattan and Staten Island share the New York Public Library system.',foot:'System geography: New York Public Library · nypl.org/about'},
 {start:25,end:35,k:'02 / BROOKLYN PUBLIC LIBRARY',title:'Brooklyn has\nits own system.',body:'The orange network is Brooklyn Public Library.',foot:'System geography: Brooklyn Public Library · bklynlibrary.org'},
 {start:35,end:45,k:'03 / QUEENS PUBLIC LIBRARY',title:'And Queens\nhas its own.',body:'Three networks together span the five boroughs.',foot:'System geography: Queens Public Library · queenslibrary.org'},
 {start:45,end:57,k:'1895 / INSTITUTIONAL ROOTS',title:'Before today’s\nfive-borough city…',body:'The Astor and Lenox libraries joined with the Tilden Trust to form the New York Public Library.',foot:'Source: NYPL 125-year timeline · Background: today’s borough outlines'},
 {start:57,end:69,k:'1896 / TWO MORE SYSTEMS',title:'Brooklyn and Queens\ntrace their roots here.',body:'Both library systems date their founding to 1896.',foot:'Sources: Brooklyn Public Library · Queens Public Library institutional histories'},
 {start:69,end:80,k:'1898 / A NEW CITY',title:'Five boroughs\nbecome one city.',body:'On January 1, Greater New York consolidated. These library institutions were already taking shape.',foot:'Source: NYC Landmarks Preservation Commission · Modern outlines shown'},
 {start:80,end:94,k:'A NEIGHBORHOOD CLOSE-UP',title:'Find Bedford\nin Brooklyn.',body:'The citywide network resolves into individual places: here, 496 Franklin Avenue.',foot:'Bedford Library · Brooklyn Public Library location and history page'},
 {start:94,end:106,k:'1905 / BEDFORD LIBRARY',title:'A building with\na long local life.',body:'Bedford Library has served patrons from its Franklin Avenue building since 1905.',foot:'Source: bklynlibrary.org/locations/bedford'},
 {start:106,end:118,k:'BEYOND THE BOOKSHELVES',title:'Learning happens\nupstairs, too.',body:'Its second-floor adult learning center helps adults develop literacy skills for their own goals.',foot:'Source: Brooklyn Public Library · Bedford branch description'},
 {start:118,end:138,k:'BACK TO THE CITY / JUNE 2026',title:'Three networks.\nNeighborhood places.',body:'This facility snapshot shows the networks together. For a visit, check your library’s current directory.',foot:'NYC Planning FacDB 26v1 · 226 records / 221 display markers · Not an open-branch census'},
 {start:138,end:150,k:'CARTOGRAPHY / EXPLORE YOUR CITY',title:'One city’s map.\nMore than one story.',body:'Three systems, roots before consolidation, and places that do more than lend books.',foot:'Sources and reproducible recipe linked in the description'},
];
export const LibraryStory:React.FC<LibraryProps>=({visuals})=>{
 const frame=useCurrentFrame(),t=frame/30;
 if(!visuals)throw new Error('Library visuals required');
 const scene=scenes.find(s=>t>=s.start&&t<s.end)??scenes[scenes.length-1];
 const enter=smooth((t-scene.start)/.6);
 const active=t<10?-1:t<25?0:t<35?1:t<45?2:-1;
 const history=t>=45&&t<80,close=t>=80&&t<118;
 const focusBorough=t>=10&&t<15?'BRONX':t>=15&&t<20?'MANHATTAN':t>=20&&t<25?'STATEN ISLAND':null;
 const historicActive=history?(t<57?0:t<69?3:-1):active;
 const bedford=visuals.markers.find(m=>m.name.toUpperCase().includes('BEDFORD')&&m.system===systems[1]);
 if(!bedford)throw new Error('Bedford source marker missing');
 const zoom=smooth((t-80)/3)*(1-smooth((t-115)/3));
 const scale=1+zoom*2.4;
 const tx=(465-bedford.x*scale)*zoom,ty=(365-bedford.y*scale)*zoom;
 const timelineYear=t<57?1895:t<69?1896:1898;
 return <AbsoluteFill style={{background:PAPER,color:INK,fontFamily:'DejaVu Sans, sans-serif'}}>
  <Audio src={staticFile('audio/nyc-library-score.wav')} volume={f=>interpolate(f,[0,45,4380,4499],[0,.85,.85,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}/>
  <div style={{position:'absolute',left:70,top:44,fontSize:24,fontWeight:700,letterSpacing:5}}>CARTOGRAPHY <span style={{color:MUTED,fontWeight:400}}> / NEW YORK</span></div>
  <div style={{position:'absolute',right:72,top:46,fontSize:22,color:MUTED}}>LIBRARIES · {history?'1895–1898':'CITY ATLAS'}</div>
  <div style={{position:'absolute',left:65,top:133,width:1010,height:782,background:'#e0e8e5',borderRadius:20,overflow:'hidden'}}>
   <svg viewBox="0 0 920 800" width="1010" height="782" aria-label="Geographic map of New York City library systems">
    <defs><pattern id="grid" width="65" height="65" patternUnits="userSpaceOnUse"><path d="M65 0H0V65" fill="none" stroke="#94acb2" strokeWidth=".5" opacity=".3"/></pattern></defs>
    <rect width="920" height="800" fill="url(#grid)"/>
    <g transform={`translate(${tx} ${ty}) scale(${scale})`}>
    {visuals.boroughs.map(b=>{const i=boroughSystem[b.name];return <path key={b.name} d={b.d} fill={colors[i]} fillOpacity={historicActive<0?.16:historicActive===i||(historicActive===3&&i>0)?.28:.05} stroke={active<0||active===i?colors[i]:'#95aaa9'} strokeWidth={1.5/scale} fillRule="evenodd"/>})}
    {!history&&visuals.markers.map((m,index)=>{
      const i=systems.indexOf(m.system);const reveal=t<10?clamp((t-.5-index/85)/1.2):active<0?1:i===active?clamp((t-scene.start-index%30/20)/1.5):.14;
      return <circle key={m.id} cx={m.x} cy={m.y} r={(active===i?4:3)/Math.sqrt(scale)} fill={colors[i]} stroke={PAPER} strokeWidth={.7/scale} opacity={reveal*(close?.36:focusBorough&&m.borough!==focusBorough?.18:1)}/>;
    })}
    </g>
    {!close&&labels.map(([name,x,y])=><text key={name} x={x} y={y} textAnchor="middle" fontSize={focusBorough===name?25:19} fontWeight="700" fill={INK} stroke={PAPER} strokeWidth="5" paintOrder="stroke">{name}</text>)}
    {close&&<g><circle cx={bedford.x*scale+tx} cy={bedford.y*scale+ty} r={14+3*Math.sin(t*2)} fill="none" stroke={colors[1]} strokeWidth="3"/><circle cx={bedford.x*scale+tx} cy={bedford.y*scale+ty} r="5" fill={colors[1]}/><text x="465" y="318" textAnchor="middle" fill={INK} fontSize="26" fontWeight="700" stroke={PAPER} strokeWidth="6" paintOrder="stroke">BEDFORD LIBRARY</text><text x="465" y="420" textAnchor="middle" fill={INK} fontSize="20" stroke={PAPER} strokeWidth="5" paintOrder="stroke">Brooklyn · Franklin Avenue</text></g>}
    <text x="35" y="48" fontSize="17" fill={MUTED}>{history?'TODAY’S BOROUGH GEOGRAPHY':close?'NEIGHBORHOOD LOCATION':'FACILITY LOCATIONS · JUNE 2026'}</text>
    <path d="M863 74V34M855 45L863 34L871 45" fill="none" stroke={MUTED} strokeWidth="2"/><text x="863" y="94" textAnchor="middle" fontSize="15" fill={MUTED}>N</text>
   </svg>
  </div>
  <div style={{position:'absolute',left:1135,top:158,width:710,opacity:enter,transform:`translateY(${(1-enter)*10}px)`}}>
   <div style={{fontSize:21,letterSpacing:2,color:active>=0?colors[active]:MUTED,fontWeight:700,marginBottom:30}}>{scene.k}</div>
   <div style={{fontSize:57,lineHeight:1.13,fontWeight:800,letterSpacing:-1.8,whiteSpace:'pre-line',marginBottom:35}}>{scene.title}</div>
   <div style={{fontSize:30,lineHeight:1.48,maxWidth:650}}>{scene.body}</div>
   {!history&&!close&&<div style={{marginTop:45}}>{systems.map((s,i)=><div key={s} style={{fontSize:23,marginTop:18,opacity:active<0||active===i?1:.35,display:'flex',alignItems:'center',gap:17}}><span style={{width:15,height:15,background:colors[i],borderRadius:20}}/>{s}</div>)}</div>}
   {history&&<div style={{marginTop:38}}><div style={{fontSize:96,fontWeight:800,color:timelineYear===1895?colors[0]:timelineYear===1896?colors[1]:INK}}>{timelineYear}</div><div style={{display:'flex',justifyContent:'space-between',borderTop:'3px solid #aebbb4',paddingTop:14,fontSize:22}}>{[1895,1896,1898].map(y=><span key={y} style={{color:y===timelineYear?INK:MUTED,fontWeight:y===timelineYear?800:400}}>{y}</span>)}</div><div style={{fontSize:21,color:MUTED,marginTop:25}}>Library institutions → consolidated city</div></div>}
   {close&&<div style={{marginTop:45,borderTop:'2px solid #c45a34',paddingTop:24}}><div style={{fontSize:62,fontWeight:800,color:colors[1]}}>{t<106?'1905':'2nd floor'}</div><div style={{fontSize:23,color:MUTED,marginTop:12}}>{t<106?'Franklin Avenue building':'Adult learning center'}</div></div>}
  </div>
  <div style={{position:'absolute',left:70,right:70,top:954,borderTop:'1px solid #b9c5be',paddingTop:23,fontSize:20,color:MUTED}}>{scene.foot}</div>
  <div style={{position:'absolute',bottom:0,height:6,width:`${t/150*100}%`,background:colors[Math.min(2,Math.floor(t/50))]}}/>
 </AbsoluteFill>;
};
