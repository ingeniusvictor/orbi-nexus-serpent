import test from 'node:test';
import assert from 'node:assert/strict';
import {validateAssaultVisual,repairAssaultEnemyPositions,resolveAssaultCamera,shouldUseSerpentBossSilhouette} from './visualContinuity.ts';
const player={x:1420,y:820,angle:0,segments:Array.from({length:24},(_,i)=>({x:1420-i*16,y:820,size:15,angle:0}))};
test('healthy transition 16→17 preserves world coordinates, body and length',()=>{
 const p=validateAssaultVisual(player,2850,1600,50,24);
 assert.equal(p.repaired,false);
 assert.equal(p.player.segments.length,24);
 assert.deepEqual(p.player,player);
});
test('nonfinite head, detached body and invalid angle recover to finite playable state',()=>{
 const p=validateAssaultVisual({...player,x:NaN,y:Infinity,angle:NaN,
  segments:[{x:NaN,y:Infinity}]},2850,1600,50,30);
 assert.equal(p.repaired,true);
 assert.equal(p.player.segments.length,30);
 for(const q of [p.player,...p.player.segments]) {
  assert.ok(Number.isFinite(q.x)&&Number.isFinite(q.y));
  assert.ok(q.x>=50&&q.x<=2800&&q.y>=50&&q.y<=1550);
 }
});
test('offscreen entities recover without creating new enemies',()=>{
 const enemies=[{x:Infinity,y:NaN,radius:16,health:12,id:'a'},
 {x:120,y:150,radius:14,health:3,id:'b'}];
 const p=repairAssaultEnemyPositions(enemies,2850,1600);
 assert.equal(p.enemies.length,2);assert.equal(p.repairs,1);
 assert.deepEqual(p.enemies[1],enemies[1]);
});
test('serpent identity covers early bosses, not future multiverse',()=>{
 for(const i of [1,5,10,15,20,25])assert.equal(shouldUseSerpentBossSilhouette(i),true);
 for(const i of [0,26,30,NaN])assert.equal(shouldUseSerpentBossSilhouette(i),false);
});

test('finite but disconnected head and core segments repair before rendering',()=>{
 const broken={...player,segments:player.segments.map((seg,i)=>({...seg,x:seg.x+(i>9?750:0)}))};
 const repaired=validateAssaultVisual(broken,2850,1600,50,24);
 assert.equal(repaired.repaired,true);
 assert.equal(repaired.player.segments.length,24);
 assert.ok(Math.hypot(repaired.player.x-repaired.player.segments[0].x,
  repaired.player.y-repaired.player.segments[0].y)<180);
 for(let i=1;i<repaired.player.segments.length;i++){
  const a=repaired.player.segments[i-1],b=repaired.player.segments[i];
  assert.ok(Math.hypot(a.x-b.x,a.y-b.y)<180);
 }
});
test('healthy winding serpent remains unmodified',()=>{
 const winding={...player,segments:player.segments.map((seg,i)=>({...seg,
   x:1450-Math.sin(i/3)*60-i*6,y:850+Math.cos(i/3)*60}))};
 const repaired=validateAssaultVisual(winding,2850,1600,50,24);
 assert.equal(repaired.repaired,false);
 assert.deepEqual(repaired.player.segments,winding.segments);
});
test('Assault camera follows head independently from stale camera and clamps to world',()=>{
 const centered=resolveAssaultCamera({x:1480,y:820},1,1200,700,2850,1600);
 assert.equal(centered.centerX,1480);
 assert.equal(centered.centerY,820);
 const edge=resolveAssaultCamera({x:80,y:60},1,1200,700,2850,1600);
 assert.equal(edge.centerX,600);assert.equal(edge.centerY,350);
 const tiny=resolveAssaultCamera({x:80,y:60},0.05,1200,700,2850,1600);
 assert.equal(tiny.centerX,1425);assert.equal(tiny.centerY,800);
 const invalid=resolveAssaultCamera({x:NaN,y:Infinity},NaN,1200,700,2850,1600);
 assert.equal(invalid.zoom,1);
 assert.equal(invalid.repaired,true);
 assert.ok(Number.isFinite(invalid.centerX)&&Number.isFinite(invalid.centerY));
});
