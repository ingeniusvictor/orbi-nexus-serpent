/** RV-09: purely visual, permanent GAIA SUPREME form at 9/9 discovered energies.
 * Not an extra physical core, hitbox, mutation, buff, or renderer loop.
 * Low-effects mode keeps the same silhouette and reduces ornaments.
 */
export const GAIA_SUPREME_ENERGIES=[
  'foton','hydro','aero','termo','magne','aton','kinetrix','h2nova','quantum'
] as const;
export const GAIA_SUPREME_COLORS=[
  '#8dff00','#38d5ff','#bafcff','#ff8a26','#af8cff',
  '#dfff4a','#ffc266','#58ffc3','#f48fff'
] as const;
export type GaiaSupremeRun={
  modules?:readonly {element:string}[];
  gaiaSeals?:readonly string[];
};
export function isGaiaSupremeUnlocked(run:GaiaSupremeRun|null|undefined):boolean{
  if(!run)return false;
  const known=new Set([
    ...(run.modules??[]).map(m=>m.element==='terra'?'termo':m.element),
    ...(run.gaiaSeals??[])
  ]);
  return GAIA_SUPREME_ENERGIES.every(id=>known.has(id));
}
type GaiaPoint={x:number;y:number};
type GaiaPlayer=GaiaPoint&{angle:number;segments:readonly GaiaPoint[]};
type GaiaDrawOptions={time:number;lowEffects:boolean;flashSec?:number;convergenceSec?:number};
export function drawGaiaSupremeForm(
  ctx:CanvasRenderingContext2D,player:GaiaPlayer,opts:GaiaDrawOptions
):void{
  const {segments}=player;
  if(!segments?.length) return;
  const low=opts.lowEffects;
  const pulse=0.5+Math.sin(opts.time*2.1)*0.5;
  const convergence=(opts.convergenceSec??0)>0;
  const points=[player,...segments];
  ctx.save();
  ctx.lineJoin='round';ctx.lineCap='round';
  // Three nested strokes change the full body silhouette while preserving
  // existing collision radii and physical core positions.
  for(const [width,color,alpha] of [
    [29,'#073a32',0.92],
    [21,'#dcfff5',0.82],
    [7,convergence?'#f8e5ff':'#62ffe0',0.88]
  ] as const){
    ctx.strokeStyle=color;
    ctx.lineWidth=width;
    ctx.globalAlpha=alpha;
    ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);
    for(let i=1;i<points.length;i++)ctx.lineTo(points[i].x,points[i].y);
    ctx.stroke();
  }
  ctx.globalAlpha=1;
  // Nine visually distinct energy sigils distributed from head to tail.
  const usable=Math.max(1,segments.length-1);
  for(let i=0;i<GAIA_SUPREME_COLORS.length;i++){
    const index=Math.min(usable,Math.floor((i+.5)*usable/9));
    const seg=segments[index];
    const before=segments[Math.max(0,index-1)]??player;
    const after=segments[Math.min(segments.length-1,index+1)]??seg;
    const dx=after.x-before.x,dy=after.y-before.y;
    const norm=Math.hypot(dx,dy)||1;
    const nx=-dy/norm,ny=dx/norm;
    const color=GAIA_SUPREME_COLORS[i];
    ctx.save();
    ctx.strokeStyle=color;ctx.fillStyle=color;
    ctx.lineWidth=low?2.3:3.0;
    ctx.globalAlpha=0.94;
    // Paired crest blades that fundamentally alter the external silhouette.
    for(const side of [-1,1]){
      const sx=seg.x+nx*side*12,sy=seg.y+ny*side*12;
      const tipx=seg.x+nx*side*(low?23:31)+(dx/norm)*8;
      const tipy=seg.y+ny*side*(low?23:31)+(dy/norm)*8;
      ctx.beginPath();ctx.moveTo(sx-5,sy-5);ctx.lineTo(tipx,tipy);
      ctx.lineTo(sx+5,sy+5);ctx.stroke();
    }
    ctx.beginPath();ctx.arc(seg.x,seg.y,low?3:4,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  // Sharp unique diamond-tail (a clearly different outline from normal Orbi).
  const tail=segments[segments.length-1];
  const previous=segments[Math.max(0,segments.length-2)]??player;
  const tailAngle=Math.atan2(tail.y-previous.y,tail.x-previous.x);
  ctx.save();ctx.translate(tail.x,tail.y);ctx.rotate(tailAngle);
  ctx.fillStyle='#dffff7';ctx.strokeStyle='#52ffc4';ctx.lineWidth=2.8;
  ctx.beginPath();ctx.moveTo(28,0);ctx.lineTo(2,-14);
  ctx.lineTo(-13,0);ctx.lineTo(2,14);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.restore();
  // Nine-point crown and armoured head, oriented with movement direction.
  ctx.save();ctx.translate(player.x,player.y);ctx.rotate(player.angle);
  if(!low){
    ctx.strokeStyle='rgba(175,255,224,0.55)';ctx.lineWidth=1.7;
    ctx.beginPath();ctx.ellipse(-3,0,39+2*pulse,24,0,0,Math.PI*2);ctx.stroke();
  }
  ctx.fillStyle='#052d32';ctx.strokeStyle='#eafff3';ctx.lineWidth=3.2;
  ctx.beginPath();ctx.moveTo(35,0);ctx.lineTo(12,-19);ctx.lineTo(-17,-20);
  ctx.lineTo(-28,0);ctx.lineTo(-17,20);ctx.lineTo(12,19);
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle='#dbfff6';ctx.beginPath();ctx.moveTo(30,0);
  ctx.lineTo(7,-9);ctx.lineTo(-12,0);ctx.lineTo(7,9);
  ctx.closePath();ctx.fill();
  for(const side of [-1,1]){
    ctx.fillStyle='#b4ffe1';ctx.strokeStyle='#35f7cf';ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(9,side*15);
    ctx.lineTo(0,side*36);ctx.lineTo(-29,side*44);
    ctx.lineTo(-20,side*17);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#0cf1db';ctx.beginPath();ctx.arc(17,side*10,3.4,0,Math.PI*2);ctx.fill();
  }
  for(let i=0;i<9;i++){
    const t=(i/8)*Math.PI*1.45-Math.PI*.72;
    ctx.fillStyle=GAIA_SUPREME_COLORS[i];
    ctx.beginPath();
    ctx.arc(-3+Math.cos(t)*31,Math.sin(t)*26,low?2.3:3.3,0,Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
  // One-time transformation bloom and temporary convergence corona.
  const flash=Math.max(0,Math.min(1.2,opts.flashSec??0));
  if(flash>0 || convergence){
    const radius=convergence?53+3*pulse:48+(1.2-flash)*80;
    ctx.strokeStyle=convergence?'rgba(255,214,255,0.65)':`rgba(208,255,242,${Math.min(.7,flash*.55)})`;
    ctx.lineWidth=convergence?3.5:5*flash;
    ctx.beginPath();ctx.arc(player.x,player.y,radius,0,Math.PI*2);ctx.stroke();
  }
  ctx.restore();
}
