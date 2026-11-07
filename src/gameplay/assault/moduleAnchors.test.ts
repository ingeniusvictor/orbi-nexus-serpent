import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveAssaultModuleAnchor,createInitialAssaultSegments} from './moduleAnchors.ts';
test('starter anchor uses the same first-frame segment coordinate for ring and firing',()=>{
 const head={x:300,y:400};const segments=createInitialAssaultSegments(head,0,12);
 assert.equal(segments.length,12);
 const mod={bodyIndex:3,segmentIndex:9};
 const render=resolveAssaultModuleAnchor(mod,segments,head);
 const firing=resolveAssaultModuleAnchor(mod,segments,head);
 assert.deepEqual(render,firing);
 assert.deepEqual([render.x,render.y],[252,400]);
});
test('fallbacks never create detached first-frame cores',()=>{
 const head={x:50,y:60};
 assert.deepEqual(resolveAssaultModuleAnchor({bodyIndex:3},[],head),{x:50,y:60,index:-1,usesHead:true});
 const segments=createInitialAssaultSegments(head,0,2);
 const a=resolveAssaultModuleAnchor({bodyIndex:100},segments,head);
 assert.equal(a.index,1);
 assert.equal(a.x,segments[1].x);
});
test('other directions and invalid indices remain finite',()=>{
 const head={x:50,y:50},seg=createInitialAssaultSegments(head,Math.PI/2,5);
 const a=resolveAssaultModuleAnchor({bodyIndex:NaN},seg,head);
 assert.equal(a.index,0);
 assert.ok(seg.every(s=>Number.isFinite(s.x)&&Number.isFinite(s.y)));
});
