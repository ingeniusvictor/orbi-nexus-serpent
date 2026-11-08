/** RV-11: first 25 Assault boss chambers use original serpent silhouettes.
 * Pure Canvas 2D presentation. Existing boss physics, hitbox and attack logic untouched.
 */
export type SerpentBossDrawable={x:number;y:number;radius:number;phase?:number;type:string;vx?:number;vy?:number};
const theme=(type:string):[string,string,string]=>type==='blackout_elite_core'
 ?['#f43f5e','#7f1d1d','#ffb86b']
 :type==='crimson_pulsar_core'
 ?['#fb3f43','#4c0519','#ffcc55']
 :['#b879ff','#24083e','#64efff'];
export function drawSerpentBossForm(ctx:CanvasRenderingContext2D,boss:SerpentBossDrawable,time:number):void {
 if(!Number.isFinite(boss.x)||!Number.isFinite(boss.y)||!Number.isFinite(boss.radius))return;
 const r=Math.max(15,boss.radius);
 const [color,dark,accent]=theme(boss.type);
 const angle=Math.atan2(Number.isFinite(boss.vy)?boss.vy!:0,Number.isFinite(boss.vx)?boss.vx!:1);
 const phase=boss.phase===2?1.13:1;
 ctx.save();
 ctx.translate(boss.x,boss.y);
 ctx.rotate(angle);
 ctx.lineJoin='round';ctx.lineCap='round';
 // A strongly tapered jointed serpent, long enough to read even at zoomed-out scale.
 const count=boss.type==='void_serpent_fragment'?9:7;
 for(let i=count-1;i>=0;i--){
  const t=i/count;
  const x=-(i+1)*r*0.72;
  const y=Math.sin(time*2.1-i*0.72)*r*(0.20+0.22*t);
  const size=r*phase*(0.78-t*0.52);
  ctx.save();ctx.translate(x,y);
  ctx.fillStyle=dark;ctx.strokeStyle=color;ctx.lineWidth=2.6;
  ctx.beginPath();ctx.ellipse(0,0,size,size*0.72,0,0,Math.PI*2);ctx.fill();ctx.stroke();
  ctx.fillStyle=accent;
  ctx.beginPath();ctx.moveTo(-size*0.4,-size*0.55);
  ctx.lineTo(-size*0.1,-size*0.8);ctx.lineTo(size*0.2,-size*0.55);ctx.fill();
  ctx.restore();
 }
 // Head remains frontmost with angular jaws, twin serpent eyes and a forked tongue.
 ctx.fillStyle=dark;ctx.strokeStyle=color;ctx.lineWidth=4;
 ctx.beginPath();ctx.moveTo(r*1.1,0);ctx.lineTo(r*0.55,-r*0.70);
 ctx.lineTo(-r*0.55,-r*0.80);ctx.lineTo(-r*0.95,0);
 ctx.lineTo(-r*0.55,r*0.80);ctx.lineTo(r*0.55,r*0.70);
 ctx.closePath();ctx.fill();ctx.stroke();
 ctx.fillStyle=accent;
 for(const side of [-1,1]){
  ctx.beginPath();ctx.ellipse(r*0.30,side*r*0.34,r*0.13,r*0.10,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle=color;ctx.lineWidth=2.8;
  ctx.beginPath();ctx.moveTo(-r*0.30,side*r*0.65);
  ctx.lineTo(-r*0.65,side*r*1.04);ctx.lineTo(-r*0.85,side*r*0.66);ctx.stroke();
 }
 ctx.strokeStyle=accent;ctx.lineWidth=2;
 ctx.beginPath();ctx.moveTo(r*1.06,0);ctx.lineTo(r*1.39,0);
 ctx.moveTo(r*1.39,0);ctx.lineTo(r*1.58,-r*0.16);
 ctx.moveTo(r*1.39,0);ctx.lineTo(r*1.58,r*0.16);ctx.stroke();
 ctx.restore();
}
