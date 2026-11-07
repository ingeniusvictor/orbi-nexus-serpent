/** RV-08B: one anchor for each physical Assault module.
 * The same center is used by the core, ring, aura and targeting/shot origin.
 */
export type AnchorPoint={x:number;y:number};
export type AnchorModule={bodyIndex?:number;segmentIndex?:number};
export type ResolvedModuleAnchor=AnchorPoint&{index:number;usesHead:boolean};
export function resolveAssaultModuleAnchor(
  module:AnchorModule, segments:readonly AnchorPoint[]|undefined,head:AnchorPoint
):ResolvedModuleAnchor{
  if(!segments?.length) return {x:head.x,y:head.y,index:-1,usesHead:true};
  const preferred=module.bodyIndex ?? module.segmentIndex ?? 0;
  const n=Number.isFinite(preferred)?Math.trunc(preferred):0;
  const index=Math.min(segments.length-1,Math.max(0,n));
  const point=segments[index];
  return {x:point.x,y:point.y,index,usesHead:false};
}
export function createInitialAssaultSegments(
  head:AnchorPoint,angle:number,count=12,gap=16
):Array<AnchorPoint&{angle:number;size:number}>{
  const safeCount=Math.max(2,Math.min(60,Math.floor(count)));
  return Array.from({length:safeCount},(_,i)=>({
    x:head.x-Math.cos(angle)*i*gap,
    y:head.y-Math.sin(angle)*i*gap,
    angle,size:15
  }));
}
