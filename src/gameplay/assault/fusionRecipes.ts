/** ASSAULT-RV-08 — selected E5 fusions, independent from passive synergies.
 * Two mutation-ready, level-three cores are required. At most two selected
 * fusions in a run. No extra projectiles and no paid unlocks.
 */
export const FUSION_RECIPES = [
  {
    id:'prisma_vital', title:'PRISMA VITAL',
    elements:['foton','hydro'],
    description:'Foton e Hydro mutados: +18% contra enemigos marcados o ralentizados; +6% si aún no lo están.',
  },
  {
    id:'magnetar_nexus', title:'MAGNETAR NEXUS',
    elements:['magne','aton'],
    description:'Magne y Aton mutados: +14% de daño directo, reducido a +7% contra jefes.',
  },
  {
    id:'nova_paradox', title:'PARADOJA NOVA',
    elements:['h2nova','quantum'],
    description:'H2Nova y Quantum mutados: +11% de daño, reducido a +9% contra jefes.',
  }
] as const;
export type AssaultFusionId=(typeof FUSION_RECIPES)[number]['id'];
export const ASSAULT_MAX_FUSIONS = 2;
export function eligibleFusionRecipes(
  modules:readonly {element:string;level:number;mutation?:string}[],
  active:readonly string[],
) {
  if(active.length>=ASSAULT_MAX_FUSIONS)return [];
  return FUSION_RECIPES.filter(fusion=>!active.includes(fusion.id) &&
    fusion.elements.every(element=>modules.some(m=>m.element===element&&m.level>=3&&Boolean(m.mutation)))
  );
}
export function fusionImpactMultiplier(
  active: readonly string[],
  element: string,
  target: {isBoss?:boolean; statusEffects?:readonly {type:string}[]},
):number {
  // Only one applicable fusion bonus per projectile, never multiply stacked bonuses.
  let factor=1;
  for(const recipe of FUSION_RECIPES){
    if(!active.includes(recipe.id) || !recipe.elements.some(e=>e===element))continue;
    if(recipe.id==='prisma_vital'){
      const marked=target.statusEffects?.some(s=>s.type==='slow'||s.type==='solar_mark');
      factor=Math.max(factor,marked?1.18:1.06);
    } else if(recipe.id==='magnetar_nexus'){
      factor=Math.max(factor,target.isBoss?1.07:1.14);
    } else if(recipe.id==='nova_paradox'){
      factor=Math.max(factor,target.isBoss?1.09:1.11);
    }
  }
  return Math.min(1.18,factor);
}
