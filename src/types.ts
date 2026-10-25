/**
 * Orbi Nexus Serpent - Declaración de Tipos y Interfaces
 */

export interface Point {
  x: number;
  y: number;
}

export interface Segment {
  x: number;
  y: number;
  angle: number;
  size: number;
}

export type EvolutionName = 'SPARK' | 'SOLAR_STREAM' | 'GUARDIAN_SERPENT' | 'TITAN_SERPENT';

export interface EvolutionStage {
  id: number;
  name: EvolutionName;
  displayName: string;
  minEnergy: number;
  speed: number;
  baseLength: number;
  color: string;
  accentColor: string;
}

export type OrbType = 'SOLAR' | 'NEXUS' | 'BLACKOUT';

export interface EnergyOrb {
  id: string;
  x: number;
  y: number;
  type: OrbType;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  glowSize: number;
  energyValue: number;
  scoreValue: number;
  collected?: boolean;
  magnetized?: boolean;
  lifetime?: number;
  maxLifetime?: number;
}

export interface BlackoutFragment {
  id: string;
  x: number;
  y: number;
  radius: number;
  vertices: number[];
  rotation: number;
  spinSpeed: number;
  energyDamage: number;
  scorePenalty: number;
  pulsePhase: number;
  frozenTicks?: number; // Added to support TERRA paralyzing roots
  suppressedUntil?: number; // Added to support Foton suppressed blackout obstacles
  temporary?: boolean;
  lifetime?: number;
}

export type BlackoutThreatLevel = 0 | 1 | 2 | 3;

export type SentinelPhase = "forming" | "shielded" | "vulnerable" | "enraged" | "defeated";

export interface CorruptedCoreSentinel {
  id: string;
  x: number;
  y: number;
  radius: number;
  health: number;
  maxHealth: number;
  shield: number;
  maxShield: number;
  phase: SentinelPhase;
  spawnTimer: number;
  attackTimer: number;
  vulnerabilityTimer: number;
  pulseTimer: number;
  defeated: boolean;
}

export interface CorruptionZone {
  id: string;
  x: number;
  y: number;
  radius: number;
  intensity: number;
  duration: number;
  maxDuration: number;
  purifiedAmount: number;
  requiredPurification: number;
  active: boolean;
  formingTimer?: number; // for warning
}

export type ParticleType = 
  | 'SOLAR_SPARK' 
  | 'NEXUS_SPARK' 
  | 'BLACKOUT_SMOKE' 
  | 'GRID_GLOW' 
  | 'EVOLUTION_EXPLOSION' 
  | 'STAR_DUST'
  | 'HYDRO_DROP'      // For water droplets
  | 'HYDRO_SPLASH'
  | 'AERO_WIND'       // For eolian sweeps
  | 'TERRA_LEAF'      // For nature leaves/spores
  | 'TERRA_POLLEN'
  | 'TAIL_SPARK'
  | 'COLLECT_SHOCKWAVE'
  | 'ABILITY_PULSE';   // Active ability visual wave

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  life: number; // 0 a 1
  decay: number;
  type: ParticleType;
  glow?: boolean;
}

export interface GameStats {
  score: number;
  energy: number;
  highScore: number;
  length: number;
  evolution: EvolutionName;
  comboCount?: number;
  comboTimer?: number;
  visualStage?: number;
  visualLabel?: string;
}

export type GameMode = "demo" | "infinite" | "nexus_assault" | "vital_flow";

export type VitalFlowPickupType = "solar_orb" | "nexus_core";

export interface VitalFlowPickup {
  id: string;
  x: number;
  y: number;
  kind: VitalFlowPickupType;
  energyValue: number;
  scoreValue: number;
  radius?: number;
  pulsePhase?: number;
}


export type OrbiEnergyId =
  | "foton"
  | "hydro"
  | "aero"
  | "termo"
  | "magne"
  | "aton"
  | "kinetrix"
  | "h2nova"
  | "quantum";

export type OrbiHeroEnergy = OrbiEnergyId;

export type OrbiCoreElement = OrbiEnergyId;

export type OrbiElementType = OrbiEnergyId | "terra";

export type UpgradeRarity = "common" | "rare" | "epic";

export interface OrbiCombatModule {
  id: string;
  element: OrbiElementType;
  name: string;
  bodyIndex: number;
  level: number;
  maxLevel: number;
  rarity: UpgradeRarity;
  cooldown: number;
  cooldownRemaining: number;
  damage: number;
  range: number;
  projectileSpeed: number;
  projectileCount: number;
  autoFire: boolean;
  statusEffect?: "slow" | "knockback";
  mutation?: "solar_lance" | "tidal_siphon" | "wind_split" | "terra_pulse" | "termo_pulse";
  attackType?: string;
  
  // Backwards compatibility properties
  type?: 'FOTON' | 'HYDRO' | 'AERO' | 'TERRA' | 'TERMO';
  segmentIndex?: number;
  lastFireTime?: number;
  fireCooldown?: number;
}

export type AssaultStatusEffectType =
  | "slow"
  | "overheat"
  | "wind_push"
  | "solar_mark"
  | "vapor_cloud"
  | "radiant_charge";

export interface AssaultStatusEffect {
  type: AssaultStatusEffectType;
  duration: number;
  remaining: number;
  strength: number;
  sourceElement?: string;
  tickTimer?: number;
  stacks?: number;
}

export interface AssaultAreaEffect {
  type: "vapor_cloud" | string;
  x: number;
  y: number;
  radius: number;
  duration: number;
  tickTimer: number;
  maxDuration?: number;
}

export type AssaultEnemyType = 'WISP' | 'DRONE' | 'SPITTER' | 'blackout_elite_core' | 'crimson_pulsar_core' | 'void_serpent_fragment';

export interface AssaultEnemy {
  id: string;
  type: AssaultEnemyType;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  health: number;
  maxHealth: number;
  color: string;
  shootCooldown: number;
  lastShotTime: number;
  angle?: number;
  frozenTicks?: number; // to support slow/freeze on enemies
  slowedUntil?: number; // to support hydro slow
  statusEffects?: AssaultStatusEffect[];
  
  // Boss fields
  isBoss?: boolean;
  isElite?: boolean;
  name?: string;
  phase?: number;
  hp?: number;
  maxHp?: number;
  bossTier?: number;
  attackTimer?: number;
  patternTimer?: number;
  invulnTimer?: number;
  contactDamageCooldown?: number;
  scoreValue?: number;
}

export interface AssaultProjectile {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  color: string;
  isEnemy: boolean;
  type: string;
  statusEffect?: "slow" | "knockback";
  piercing?: boolean;
  hasPierced?: string[]; // track hit enemy IDs
  isWindSplit?: boolean;
  attackType?: string;
  element?: string;
  coreColor?: string;
  glowColor?: string;
  trailColor?: string;
}

export interface AssaultUpgrade {
  id: string;
  title: string;
  description: string;
  rarity: UpgradeRarity;
  element?: OrbiElementType;
  apply: (run: NexusAssaultRun) => NexusAssaultRun;
  
  // Backwards compatibility
  name?: string;
  icon?: string;
  action?: (core: any) => void;
}

export type NexusAssaultRoomType =
  | "normal"
  | "swarm"
  | "elite"
  | "rest"
  | "boss_preview"
  | "boss";

export type AssaultRoomType = NexusAssaultRoomType;

export interface NexusAssaultRun {
  hp: number;
  maxHp: number;
  roomIndex: number;
  roomType: AssaultRoomType;
  roomCleared: boolean;
  enemies: AssaultEnemy[];
  projectiles: AssaultProjectile[];
  modules: OrbiCombatModule[];
  enemiesKilled: number;
  upgradesAvailable: AssaultUpgrade[];
  showUpgradeSelection: boolean;
  synergiesActive?: string[]; // track active synergies
  waveClearTimer?: number;
  roomClearDuration?: number;
  tailHitsThisRoom?: number;
  gradeHistory?: string[];
  totalSGrades?: number;
  tailOverheatTime?: number;
  tailStrikeCountInWindow?: number;
  
  // Boss Tracking Fields
  currentBoss?: any;
  bossIntroTimer?: number;
  bossIntroActive?: boolean;
  guaranteedRareUpgrade?: boolean;
  bossesDefeated?: number;
  highestBossRoomReached?: number;
  bestBossGrade?: string;
  fastestBossClearSec?: number;
  
  // HOTFIX 1.1C compatibility fields
  run: {
    status: 'combat' | 'room_cleared' | 'upgrade_selection' | 'transition_next_room' | 'game_over' | 'room_clear';
    currentRoomCleared: boolean;
    roomIndex?: number;
    enemiesDefeated?: number;
  };
  upgradeChoices?: AssaultUpgrade[];
  noEnemySoftlockTimer?: number;
  energyPickups?: any[];
  enemyProjectiles?: any[];
  playerProjectiles?: any[];
  floatingEnergyOrbs?: any[];
  droppedEnergy?: any[];
  pickups?: any[];
  particles?: any[];
  areaEffects?: AssaultAreaEffect[];
  debugHudMode?: string;

  // 1.1E Hotfix extra fields
  noEnemyTimer?: number;
  roomClearTimer?: number;
  transitionTimer?: number;
  upgradePanelFailsafeTimer?: number;
  showUpgradePanel?: boolean;
  awaitingUpgradeSelection?: boolean;
  assaultBodyGrowth?: number;
  assaultTargetLength?: number;
  assaultCoreSlots?: any;
  room?: any;
  tailStrikeCooldown?: number;
  damageTakenThisRoom?: number;
  tailStrikeTimestamps?: number[];
  tailDamageMultiplier?: number;
  tailCooldownMultiplier?: number;
  headDamageReduction?: number;
  tailDamageReduction?: number;
  coreStabilizerActiveThisRoom?: boolean;
  radarFocusUnlocked?: boolean;
  totalDamageTaken?: number;
  totalHealed?: number;
  totalTailDamage?: number;
  totalTailHits?: number;
  totalTimeSec?: number;
  isTransitioningRoom?: boolean;
  transitionLock?: boolean;
  lastTransitionRoomId?: number;
  transitionReason?: string;
  // Transition diagnostics and shape-fallback metadata used by the room controller.
  roomShapeFallback?: boolean;
  roomShapeReason?: string;
  upgradePanelTimer?: number;
  totalDamageDealt?: number;
  totalSGradesEarned?: number;
}

export interface DemoObjective {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  completedAt?: number;
}

export interface SessionStats {
  score: number;
  finalEnergy: number;
  maxEnergy: number;
  maxEvolutionReached: string;
  maxCombo: number;
  zonesPurified: number;
  surgesSurvived: number;
  sentinelEncountered: boolean;
  sentinelPurged: boolean;
  perfectPurges: number;
  perfectSentinelPurge: boolean;
  damageTaken: number;
  blackoutHits: number;
  boundaryDamageTaken: number;
  totalTimeSeconds: number;
  nexusGuardianReached?: boolean;
  tutorialEnabled?: boolean;
  tutorialCompletedSteps?: number;
  tutorialSkipped?: boolean;
}

export type TutorialStepId =
  | "movement"
  | "collect_energy"
  | "avoid_blackout"
  | "solar_pulse"
  | "boundary_warning"
  | "corruption_zone"
  | "blackout_surge"
  | "sentinel_intro"
  | "victory_goal";

export interface TutorialStep {
  id: TutorialStepId;
  title: string;
  message: string;
  completed: boolean;
  triggered: boolean;
  autoDismissSeconds?: number;
}

export type DemoRank = 'C' | 'B' | 'A' | 'S' | 'ORBI_PRIME';


export interface Camera {
  x: number;
  y: number;
  zoom: number;
  shakeTime: number;
  shakeIntensity: number;
  smoothAngle?: number;
}

export type GuardianId = 'FOTON' | 'HYDRO' | 'AERO' | 'TERMO' | 'MAGNE' | 'ATON';

export interface GuardianTheme {
  id: GuardianId;
  name: string;
  element: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  auraColor: string;
  particleColor: string;
  trailColor: string;
  eyeColor: string;
  blackoutContrastColor: string;
  evolutionNames: Record<EvolutionName, string>;
  abilityName: string;
  abilityDescription: string;
  passiveName: string;
  passiveDescription: string;
  speedModifier: number;
  energyModifier: number;
  growthModifier: number;
  resistanceModifier: number;
  visualMotif: 'solar' | 'water' | 'wind' | 'nature';
  orbStyle: string;
}

export type DeviceProfile = "desktop" | "laptop" | "tablet" | "mobile";

export interface ViewportState {
  width: number;
  height: number;
  dpr: number;
  orientation: "landscape" | "portrait";
  deviceProfile: DeviceProfile;
  isTouch: boolean;
  isSmallScreen: boolean;
}

export type AntiEnergyId =
  | "anti_foton"
  | "anti_hydro"
  | "anti_aero"
  | "anti_termo"
  | "anti_magne"
  | "anti_aton"
  | "anti_kinetrix"
  | "anti_h2nova"
  | "anti_quantum";

export interface Vector2 {
  x: number;
  y: number;
}

export interface SurvivalAntiCombatProfile {
  attackType: "dark_lance" | "stasis_glob" | "vacuum_dash" | "entropy_burst";
  attackCooldown: number;
  attackTimer: number;
  attackRange: number;
  specialCooldown: number;
  specialTimer: number;
  aggression: number;
}

export interface SurvivalAntiSerpent {
  id: string;
  antiEnergy: AntiEnergyId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  segments: Vector2[];
  lengthLevel: number;
  growthTimer: number;
  aiState: "hunt" | "orbit" | "charge" | "retreat";
  aiTimer: number;
  chargeTelegraphTimer: number;
  chargeCooldown: number;
  targetVital: "head" | "tail";
  hp: number;
  maxHp: number;
  speed: number;
  radius: number;
  alive: boolean;
  combatProfile: SurvivalAntiCombatProfile;
  isAlpha?: boolean;
  angle?: number;
  chargeTimer?: number;
  chargeTargetX?: number;
  chargeTargetY?: number;
  stateTimer?: number;
  contactDamageCooldown?: number;
  lastHitByAbilityTime?: number;
  lastHitByTailTime?: number;
  attackTelegraphTimer?: number;
  attackTelegraphX?: number;
  attackTelegraphY?: number;
}

export type SurvivalAntiProjectileType =
  | "dark_lance"
  | "stasis_glob"
  | "entropy_burst";

export type SurvivalHazardType =
  | "stasis_pool"
  | "entropy_field";

export interface SurvivalAntiProjectile {
  id: string;
  type: SurvivalAntiProjectileType;
  antiEnergy: AntiEnergyId;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  life: number;
  alive: boolean;
}

export interface SurvivalHazardZone {
  id: string;
  type: SurvivalHazardType;
  x: number;
  y: number;
  radius: number;
  duration: number;
  // Legacy survival hazards count damage intervals with damageTimer.
  // Other event handlers use tickTimer. Both appear in recovered gameplay.
  tickTimer?: number;
  damageTimer?: number;
}

export type SurvivalBlackoutEventType =
  | "blackout_wave"
  | "eclipse_field"
  | "stasis_flood"
  | "vacuum_surge"
  | "entropy_storm"
  | "anti_serpent_alpha";

export interface SurvivalBlackoutEvent {
  id: string;
  type: SurvivalBlackoutEventType;
  label: string;
  description: string;
  duration: number;
  remaining: number;
  intensity: number;
  startedAt: number;
  completed: boolean;
}



