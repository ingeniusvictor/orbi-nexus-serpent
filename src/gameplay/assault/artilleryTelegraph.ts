/** RV-10B: original ORBI artillery telegraph, computed without extra entities or loops.
 * Counterplay: the final aim locks before firing, so the player can dodge.
 */
export const ARTILLERY_WARNING_FRAMES = 36;
export const ARTILLERY_LOCK_FRAMES = 22;
export type TelegraphVector = {x:number;y:number};
export type ArtilleryTelegraph = {
  warning:boolean;
  locked:boolean;
  progress:number;
  direction:TelegraphVector;
};
export function normalizedAim(dx:number,dy:number):TelegraphVector {
  const magnitude = Math.hypot(dx,dy);
  return Number.isFinite(magnitude) && magnitude > 0.0001
    ? {x:dx/magnitude,y:dy/magnitude}
    : {x:1,y:0};
}
export function getArtilleryTelegraph(
  remainingFrames:number, dx:number, dy:number, lockedAim?:TelegraphVector
):ArtilleryTelegraph {
  const remaining = Number.isFinite(remainingFrames) ? remainingFrames : Infinity;
  const warning=remaining>0&&remaining<=ARTILLERY_WARNING_FRAMES;
  const locked=warning&&remaining<=ARTILLERY_LOCK_FRAMES&&!!lockedAim;
  return {
    warning,locked,
    progress:warning?Math.max(0,Math.min(1,1-remaining/ARTILLERY_WARNING_FRAMES)):0,
    direction:locked?normalizedAim(lockedAim!.x,lockedAim!.y):normalizedAim(dx,dy)
  };
}
