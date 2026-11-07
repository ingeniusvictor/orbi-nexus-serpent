import test from 'node:test';
import assert from 'node:assert/strict';
import {GAIA_SUPREME_ENERGIES,GAIA_SUPREME_COLORS,isGaiaSupremeUnlocked,drawGaiaSupremeForm} from './gaiaSupremeVisual.ts';
test('the permanent form is earned by nine distinct elements, not nine modules',()=>{
 const modules=GAIA_SUPREME_ENERGIES.slice(0,8).map(element=>({element}));
 assert.equal(isGaiaSupremeUnlocked({modules}),false);
 assert.equal(isGaiaSupremeUnlocked({modules,gaiaSeals:['quantum']}),true);
 assert.equal(isGaiaSupremeUnlocked({modules:[{element:'terra'},...modules.filter(m=>m.element!=='termo')],gaiaSeals:['quantum']}),true);
});
test('repeated energies cannot grant an early GAIA, and another run resets state',()=>{
 assert.equal(isGaiaSupremeUnlocked({modules:Array.from({length:9},()=>({element:'foton'}))}),false);
 assert.equal(isGaiaSupremeUnlocked(null),false);
 assert.equal(GAIA_SUPREME_COLORS.length,9);
});
test('supreme silhouette draws persistent body, nine sigils and head without any new scene objects',()=>{
 const calls:string[]=[];
 const proxy=new Proxy({}, {get(_t,k){if(k in _t)return (_t as any)[k];return (...args:any[])=>{calls.push(String(k));};},set(t,k,v){(t as any)[k]=v;return true;}}) as CanvasRenderingContext2D;
 const segments=Array.from({length:20},(_,i)=>({x:100-i*12,y:200}));
 drawGaiaSupremeForm(proxy,{x:100,y:200,angle:0,segments},{time:0,lowEffects:false,flashSec:0,convergenceSec:0});
 assert.ok(calls.filter(k=>k==='stroke').length>=19);
 assert.ok(calls.filter(k=>k==='fill').length>=20);
});
