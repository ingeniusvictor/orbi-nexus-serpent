/** RV-10C — original ORBI Blackout behaviours. Deterministic, bounded and independent of the render loop. */
export type Vec2={x:number;y:number};
export type ChargePhase='warning'|'charge'|'recover';
export interface ChargeState {phase:ChargePhase;frames:number;direction:Vec2}
export const CHARGE_WARNING=38;
export const CHARGE_DURATION=22;
export const CHARGE_RECOVER=62;
export function unit(dx:number,dy:number):Vec2{
 const len=Math.hypot(dx,dy);
 return Number.isFinite(len)&&len>0.0001?{x:dx/len,y:dy/len}:{x:1,y:0};
}
export function nextCharge(state:ChargeState|undefined,dx:number,dy:number,dt:number):ChargeState {
 const step=Number.isFinite(dt)?Math.max(0,Math.min(dt,4)):1;
 if(!state)return {phase:'warning',frames:CHARGE_WARNING,direction:unit(dx,dy)};
 const frames=state.frames-step;
 if(frames>0)return {...state,frames};
 if(state.phase==='warning')return {phase:'charge',frames:CHARGE_DURATION,direction:state.direction};
 if(state.phase==='charge')return {phase:'recover',frames:CHARGE_RECOVER,direction:state.direction};
 return {phase:'warning',frames:CHARGE_WARNING,direction:unit(dx,dy)};
}
export function flankVelocity(enemy:Vec2,player:Vec2,side:-1|1,speed:number):Vec2{
 const aim=unit(player.x-enemy.x,player.y-enemy.y);
 const distance=Math.hypot(player.x-enemy.x,player.y-enemy.y);
 const radial=distance<185?-0.65:distance>310?0.75:0;
 const v=unit(aim.x*radial-aim.y*side,aim.y*radial+aim.x*side);
 const bounded=Number.isFinite(speed)?Math.max(0,Math.min(3,speed)):0;
 return {x:v.x*bounded,y:v.y*bounded};
}
export function splitAllowance(roomIndex:number,activeEnemies:number,existingChildren:number):number{
 const cap=Math.min(30,Math.max(12,12+Math.floor(Math.max(1,roomIndex)/5)*2));
 if(!Number.isFinite(activeEnemies)||!Number.isFinite(existingChildren))return 0;
 return activeEnemies<=cap-2&&existingChildren<6?Math.min(2,6-existingChildren,cap-activeEnemies):0;
}
