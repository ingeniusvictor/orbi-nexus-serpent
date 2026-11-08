import test from 'node:test';
import assert from 'node:assert/strict';
import {drawSerpentBossForm} from './serpentBossVisual.ts';
test('all initial boss families render actual serpent body segments and a head',()=>{
 for(const type of ['blackout_elite_core','crimson_pulsar_core','void_serpent_fragment']){
  const calls:string[]=[];
  const ctx=new Proxy({}, {get(_t,k){return (..._args:unknown[])=>{calls.push(String(k));};},
   set(t,k,v){(t as Record<string,unknown>)[String(k)]=v;return true;}}) as CanvasRenderingContext2D;
  drawSerpentBossForm(ctx,{x:100,y:150,radius:40,type,phase:2},0);
  assert.ok(calls.filter(x=>x==='ellipse').length>=7);
  assert.ok(calls.filter(x=>x==='fill').length>=8);
  assert.ok(calls.includes('restore'));
 }
});
test('invalid bosses are ignored safely',()=>{
 const ctx={save(){throw Error('should not render')}} as unknown as CanvasRenderingContext2D;
 drawSerpentBossForm(ctx,{x:NaN,y:0,radius:20,type:'blackout_elite_core'},0);
});
