import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeLibraries} from './nyc-libraries.mjs';
const row=(uid,overrides={})=>({uid,facname:uid,factype:'PUBLIC LIBRARY',datasource:'bpl_libraries',boro:'BROOKLYN',latitude:'40.67',longitude:'-73.96',bin:'3029665',...overrides});
test('does not collapse coincident points or placeholder building IDs without evidence',()=>{
 const data=normalizeLibraries([row('a',{bin:'0'}),row('b',{bin:'0'})]);
 assert.equal(data.recordCount,2);assert.equal(data.mapMarkerCount,2);assert.equal(data.records[0].buildingId,null);
});
test('corroborated grouping preserves records and rejects drift',()=>{
 const g={id:'site',name:'Site',members:['a','b'],anchorId:'a',evidence:['https://example.org/source']};
 const result=normalizeLibraries([row('a'),row('b',{latitude:'40.67003'})],[g]);
 assert.equal(result.recordCount,2);assert.equal(result.mapMarkerCount,1);assert.deepEqual(result.markers[0].memberIds,['a','b']);
 assert.throws(()=>normalizeLibraries([row('a'),row('b',{bin:'3029666'})],[g]),/building/);
 assert.throws(()=>normalizeLibraries([row('a'),row('b')],[g,g]),/multiply/);
});
test('missing coordinates and duplicate IDs fail; other library types stay excluded',()=>{
 assert.throws(()=>normalizeLibraries([row('a',{latitude:''})]),/Missing/);
 assert.throws(()=>normalizeLibraries([row('a'),row('a')]),/Duplicate/);
 const result=normalizeLibraries([row('a'),row('b',{factype:'ACADEMIC LIBRARIES'})]);assert.equal(result.recordCount,1);
});
