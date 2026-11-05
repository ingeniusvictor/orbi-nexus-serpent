/** ASSAULT-RV-08 — E3 mutations for the five advanced ORBI energies.
 * Effects are calculated once per successful projectile impact. No extra bullets,
 * additional game loop, global timers or direct mutation of React state.
 */
export const ADVANCED_MUTATION_SPECS = [
  { element: 'magne', id: 'magnetic_chain', title: 'CADENA POLAR', description: '35% de probabilidad de descargar un arco sobre un segundo enemigo cercano.' },
  { element: 'aton', id: 'aton_fission', title: 'FISIÓN CONTROLADA', description: 'Cada impacto proyecta una onda que alcanza hasta dos enemigos cercanos.' },
  { element: 'kinetrix', id: 'kinetrix_impulse', title: 'IMPULSO VECTORIAL', description: 'Empuja al enemigo alcanzado sin crear proyectiles adicionales.' },
  { element: 'h2nova', id: 'h2nova_repair', title: 'CICLO REGENERATIVO', description: 'Recupera un punto de HP por cada ocho impactos válidos.' },
  { element: 'quantum', id: 'quantum_echo', title: 'ECO CUÁNTICO', description: '25% de probabilidad de un segundo impacto limitado sobre el mismo objetivo.' },
] as const;

export type AdvancedMutationId = (typeof ADVANCED_MUTATION_SPECS)[number]['id'];
export type MutationEnemy = {
  id: string;
  x: number;
  y: number;
  health: number;
  isBoss?: boolean;
  type?: string;
  archetype?: string;
  spawnPortalTimer?: number;
};
export type MutationImpact = {
  secondaryHits: Array<{id:string; damage:number}>;
  echoDamage: number;
  pushDistance: number;
  heal: number;
};

export function eligibleAdvancedMutations(
  modules: readonly {element:string;level:number;mutation?:string}[],
): typeof ADVANCED_MUTATION_SPECS[number][] {
  return ADVANCED_MUTATION_SPECS.filter(spec =>
    modules.some(m => m.element === spec.element && m.level >= 3 && !m.mutation)
  );
}
function validEnemy(e:MutationEnemy, excludedId:string):boolean {
  return e.id !== excludedId &&
    Number.isFinite(e.x) && Number.isFinite(e.y) &&
    Number.isFinite(e.health) && e.health > 0 &&
    !(e.spawnPortalTimer && e.spawnPortalTimer > 0) &&
    e.type !== 'REST_BEACON' && e.archetype !== 'rest_beacon';
}
/** impactNumber is a per-module hit count; rolls are supplied by the simulation. */
export function calculateAdvancedMutationImpact(input:{
  mutation?:string;
  damage:number;
  target:MutationEnemy;
  enemies:readonly MutationEnemy[];
  roll:number;
  impactNumber:number;
}):MutationImpact {
  const {mutation,target,enemies}=input;
  const damage=Math.max(0,Number.isFinite(input.damage)?input.damage:0);
  const roll=Math.max(0,Math.min(.999999,Number.isFinite(input.roll)?input.roll:1));
  const result:MutationImpact={secondaryHits:[],echoDamage:0,pushDistance:0,heal:0};
  if(!validEnemy(target,'__never_equal__') || damage===0) return result;
  if(mutation==='magnetic_chain' && roll<0.35) {
    let closest:MutationEnemy|null=null;
    let minDistSq=155*155;
    for(const e of enemies){
      if(!validEnemy(e,target.id)) continue;
      const dx=e.x-target.x,dy=e.y-target.y,d2=dx*dx+dy*dy;
      if(d2<minDistSq){minDistSq=d2;closest=e;}
    }
    if(closest) result.secondaryHits.push({id:closest.id,damage:Math.max(1,Math.round(damage*(closest.isBoss ? 0.20 : 0.42)))});
  } else if(mutation==='aton_fission') {
    const nearby=enemies.filter(e=>validEnemy(e,target.id))
      .map(e=>({enemy:e,distSq:(e.x-target.x)**2+(e.y-target.y)**2}))
      .filter(o=>o.distSq<100*100)
      .sort((a,b)=>a.distSq-b.distSq || a.enemy.id.localeCompare(b.enemy.id))
      .slice(0,2);
    result.secondaryHits=nearby.map(({enemy})=>({
      id:enemy.id,damage:Math.max(1,Math.round(damage*(enemy.isBoss ? 0.15 : 0.28)))
    }));
  } else if(mutation==='kinetrix_impulse') {
    result.pushDistance=target.isBoss?0:38;
  } else if(mutation==='h2nova_repair') {
    if(Number.isInteger(input.impactNumber) && input.impactNumber>0 && input.impactNumber%8===0)result.heal=1;
  } else if(mutation==='quantum_echo' && roll<.25) {
    result.echoDamage=Math.max(1,Math.round(damage*(target.isBoss ? 0.18 : 0.40)));
  }
  return result;
}
