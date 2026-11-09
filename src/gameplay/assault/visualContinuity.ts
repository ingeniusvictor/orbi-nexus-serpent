/** RV-11 — finite-state continuity guard for Assault only.
 * Repairs corrupted visual coordinates without changing healthy player progression.
 * Kept pure so room 16→17 and other transitions are deterministic in tests.
 */
export type AssaultPoint={x:number;y:number};
export type AssaultBodyPoint=AssaultPoint&{size?:number;angle?:number};
export type AssaultVisualSnapshot={
  x:number;y:number;angle:number;segments:AssaultBodyPoint[];
};
export type AssaultRepair={player:AssaultVisualSnapshot; repaired:boolean; reason:string};
const finite=(v:number)=>Number.isFinite(v);
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function validateAssaultVisual(
 input:AssaultVisualSnapshot,width:number,height:number,
 margin=60, targetLength=12
):AssaultRepair {
 const w=finite(width)&&width>200?width:2850;
 const h=finite(height)&&height>200?height:1600;
 const pad=clamp(finite(margin)?margin:60,20,Math.min(w,h)/3);
 const safeX=finite(input.x)?clamp(input.x,pad,w-pad):w/2;
 const safeY=finite(input.y)?clamp(input.y,pad,h-pad):h/2;
 const safeAngle=finite(input.angle)?input.angle:0;
 const raw=Array.isArray(input.segments)?input.segments:[];
 const segmentCount=clamp(finite(targetLength)?Math.round(targetLength):12,8,60);
 const brokenHead=!finite(input.x)||!finite(input.y);
 const brokenSegments=raw.length===0||raw.some(p=>!p||!finite(p.x)||!finite(p.y));
 const displaced=raw.length>0&&finite(raw[0]?.x)&&finite(raw[0]?.y)&&
  Math.hypot(raw[0].x-safeX,raw[0].y-safeY)>Math.max(w,h)*1.5;
 // Finite but disconnected body is also corrupted: the core can be onscreen
 // while elemental segments are stranded across the world.
 const maxLink=180;
 const disconnected=raw.length>0 && !brokenSegments && (
  Math.hypot(raw[0].x-safeX,raw[0].y-safeY)>maxLink ||
  raw.some((point,i)=>i>0 && Math.hypot(point.x-raw[i-1].x,point.y-raw[i-1].y)>maxLink)
 );
 const mustRebuild=brokenHead||brokenSegments||displaced||disconnected;
 const segments=mustRebuild
  ?Array.from({length:segmentCount},(_,i)=>({
    x:clamp(safeX-Math.cos(safeAngle)*(i+1)*16,pad,w-pad),
    y:clamp(safeY-Math.sin(safeAngle)*(i+1)*16,pad,h-pad),
    size:15,angle:safeAngle
  }))
  :raw.map(p=>({...p,x:p.x< -200||p.x>w+200?clamp(p.x,pad,w-pad):p.x,
    y:p.y< -200||p.y>h+200?clamp(p.y,pad,h-pad):p.y}));
 const repaired=mustRebuild||safeX!==input.x||safeY!==input.y||
  safeAngle!==input.angle||segments.some((p,i)=>p.x!==raw[i]?.x||p.y!==raw[i]?.y);
 return {player:{x:safeX,y:safeY,angle:safeAngle,segments},repaired,
   reason:mustRebuild?'invalid player/body':repaired?'out-of-bounds coordinates':'ok'};
}
export function repairAssaultEnemyPositions<T extends AssaultPoint&{radius:number;health:number}>(
 enemies:readonly T[],width:number,height:number
):{enemies:T[];repairs:number}{
 let repairs=0;
 const w=finite(width)&&width>200?width:2850;
 const h=finite(height)&&height>200?height:1600;
 const cleaned:T[]=[];
 for(const e of enemies){
  if(!e||!finite(e.health)||e.health<=0)continue;
  const pad=clamp(finite(e.radius)?e.radius+48:60,30,Math.min(w,h)/3);
  const x=finite(e.x)?clamp(e.x,pad,w-pad):w/2;
  const y=finite(e.y)?clamp(e.y,pad,h-pad):h/2;
  if(x!==e.x||y!==e.y)repairs++;
  cleaned.push(x===e.x&&y===e.y?e:{...e,x,y});
 }
 return {enemies:cleaned,repairs};
}
export const SERPENT_ONLY_THROUGH_ROOM=25;
export function shouldUseSerpentBossSilhouette(roomIndex:number):boolean{
 return Number.isInteger(roomIndex)&&roomIndex>=1&&roomIndex<=SERPENT_ONLY_THROUGH_ROOM;
}

/** Independent Assault follow camera. Never use another mode's arena bounds. */
export type AssaultCameraResult={zoom:number;centerX:number;centerY:number;repaired:boolean;reason:string};
export function resolveAssaultCamera(
 head:AssaultPoint, requestedZoom:number, viewW:number, viewH:number,
 worldW:number,worldH:number
):AssaultCameraResult {
 const w=Number.isFinite(worldW)&&worldW>200?worldW:2850;
 const h=Number.isFinite(worldH)&&worldH>200?worldH:1600;
 const vw=Number.isFinite(viewW)&&viewW>0?viewW:1;
 const vh=Number.isFinite(viewH)&&viewH>0?viewH:1;
 const zoom=Number.isFinite(requestedZoom)&&requestedZoom>0
   ?Math.max(0.05,Math.min(4,requestedZoom)):1;
 const halfW=vw/(2*zoom),halfH=vh/(2*zoom);
 const hx=Number.isFinite(head.x)?head.x:w/2;
 const hy=Number.isFinite(head.y)?head.y:h/2;
 const centerX=halfW>=w/2?w/2:clamp(hx,halfW,w-halfW);
 const centerY=halfH>=h/2?h/2:clamp(hy,halfH,h-halfH);
 return {zoom,centerX,centerY,
  repaired:!Number.isFinite(head.x)||!Number.isFinite(head.y)||!Number.isFinite(requestedZoom)||requestedZoom<=0,
  reason:'assault camera tracks repaired player using world bounds'};
}
