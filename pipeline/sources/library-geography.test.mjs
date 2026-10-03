import test from 'node:test';
import assert from 'node:assert/strict';
import {inMultiPolygon} from './verify-library-geography.mjs';
test('geographic containment respects holes and separate islands',()=>{
 const g={type:'MultiPolygon',coordinates:[[[[0,0],[10,0],[10,10],[0,10],[0,0]],[[2,2],[4,2],[4,4],[2,4],[2,2]]],[[[20,20],[22,20],[22,22],[20,22],[20,20]]]]};
 assert.equal(inMultiPolygon([1,1],g),true);assert.equal(inMultiPolygon([3,3],g),false);assert.equal(inMultiPolygon([21,21],g),true);assert.equal(inMultiPolygon([15,15],g),false);
});
