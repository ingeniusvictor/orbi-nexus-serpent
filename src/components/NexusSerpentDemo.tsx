/**
 * Orbi Nexus Serpent - Reboot Master 0.0
 * AAA Professional Coding & Visual Direction Reboot from Scratch
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Zap,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Shield,
  Crown,
  Volume2,
  VolumeX,
  Compass,
  ArrowRight,
  Flame,
  Layers,
  Info,
  ShieldAlert,
  Cpu,
  RotateCw,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Trash2,
  HelpCircle,
  X,
  Lock,
  Skull
} from 'lucide-react';
import {
  Point,
  Segment,
  EvolutionName,
  EvolutionStage,
  EnergyOrb,
  BlackoutFragment,
  Particle,
  Camera,
  GameStats,
  ParticleType,
  OrbType,
  GuardianId,
  GuardianTheme,
  BlackoutThreatLevel,
  CorruptionZone,
  CorruptedCoreSentinel,
  SentinelPhase,
  GameMode,
  VitalFlowPickup,
  DemoObjective,
  SessionStats,
  DemoRank,
  TutorialStepId,
  TutorialStep,
  DeviceProfile,
  ViewportState,
  OrbiCombatModule,
  AssaultEnemy,
  AssaultEnemyType,
  AssaultProjectile,
  AssaultUpgrade,
  AssaultRoomType,
  NexusAssaultRun,
  OrbiElementType,
  UpgradeRarity,
  OrbiEnergyId,
  AntiEnergyId,
  Vector2,
  SurvivalAntiSerpent,
  SurvivalAntiCombatProfile,
  SurvivalAntiProjectile,
  SurvivalHazardZone,
  SurvivalBlackoutEventType,
  SurvivalBlackoutEvent
} from '../types';

// QA-01G: large exploration worlds are native landscape 16:9; Assault keeps its own room bounds.
const EXPLORATION_WORLD_WIDTH = 2850 * 16 / 9;
const EXPLORATION_WORLD_HEIGHT = 2850;

const NEXUS_ASSAULT_ROOM_RADIUS_SCALE = 1.30; // Radius increased by 30% (effective playable area increased by ~69%)
const NEXUS_ASSAULT_ARENA_RADIUS = 730 * NEXUS_ASSAULT_ROOM_RADIUS_SCALE; // ~949.00

const ORBI_COUNTDOWN_AUDIO_CONFIG = {
  enabled: true,
  volume: 0.28,
  tickTone: "soft_orbi_pulse" as const,
  finalTone: "soft_launch_chime" as const,
};

const BLACKOUT_FINAL_ENTITY = {
  id: "blackout",
  name: "BLACKOUT",
  label: "BLACKOUT",
  role: "Corrupción suprema",
  description:
    "Blackout no es una anti-energía individual. Es la corrupción total que busca apagar la Red Vital ORBI.",
  relationToGaia:
    "Gaia representa unión vital. Blackout representa anulación total.",
};

const SURVIVAL_COOP_FUTURE_LOCK = {
  id: "coop_survival",
  name: "COOPERATIVO NEXUS",
  status: "future_locked",
  description:
    "Modo futuro para que dos o más serpientes ORBI sobrevivan juntas contra anti-serpientes Blackout.",
};

const ORBI_ANTI_ENERGY_REGISTRY: Record<AntiEnergyId, {
  name: string;
  label: string;
  oppositeOf: string;
  concept: string;
  color: string;
  glow: string;
  behavior: string;
}> = {
  anti_foton: {
    name: "Anti-Foton",
    label: "ANTI-FOTON",
    oppositeOf: "foton",
    concept: "Oscurecimiento de la luz solar",
    color: "#5B2CFF",
    glow: "#180033",
    behavior: "apaga zonas de luz y dispara sombras lineales",
  },
  anti_hydro: {
    name: "Anti-Hydro",
    label: "ANTI-HYDRO",
    oppositeOf: "hydro",
    concept: "Sequedad, ruptura de flujo y absorción",
    color: "#6B3A1F",
    glow: "#1F0B00",
    behavior: "drena energía y corta magnetismo de pickups",
  },
  anti_aero: {
    name: "Anti-Aero",
    label: "ANTI-AERO",
    oppositeOf: "aero",
    concept: "Presión muerta y vacío sin viento",
    color: "#4B5563",
    glow: "#0F172A",
    behavior: "ralentiza el movimiento y crea zonas de presión",
  },
  anti_termo: {
    name: "Anti-Termo",
    label: "ANTI-TERMO",
    oppositeOf: "termo",
    concept: "Frío extremo y apagado térmico",
    color: "#9FEAFF",
    glow: "#003344",
    behavior: "enfría ataques y reduce daño térmico",
  },
  anti_magne: {
    name: "Anti-Magne",
    label: "ANTI-MAGNE",
    oppositeOf: "magne",
    concept: "Repulsión caótica y campos inversos",
    color: "#FF8FF3",
    glow: "#4A003F",
    behavior: "empuja y distorsiona trayectorias",
  },
  anti_aton: {
    name: "Anti-Aton",
    label: "ANTI-ATON",
    oppositeOf: "aton",
    concept: "Inestabilidad atómica corrupta",
    color: "#8BFF4A",
    glow: "#153000",
    behavior: "explosiones inestables y pulsos tóxicos",
  },
  anti_kinetrix: {
    name: "Anti-Kinetrix",
    label: "ANTI-KINETRIX",
    oppositeOf: "kinetrix",
    concept: "Inercia muerta y bloqueo del movimiento",
    color: "#FF4A4A",
    glow: "#330000",
    behavior: "embiste y bloquea rutas",
  },
  anti_h2nova: {
    name: "Anti-H2Nova",
    label: "ANTI-H2NOVA",
    oppositeOf: "h2nova",
    concept: "Contaminación de energía limpia",
    color: "#3DFFB5",
    glow: "#00291B",
    behavior: "deja residuos corruptos persistentes",
  },
  anti_quantum: {
    name: "Anti-Quantum",
    label: "ANTI-QUANTUM",
    oppositeOf: "quantum",
    concept: "Colapso probabilístico Blackout",
    color: "#FF3DD8",
    glow: "#29001F",
    behavior: "teleporta, duplica amenazas y distorsiona espacio",
  },
};

// ========================================================
// ORBI NEXUS SERPENT — REBOOT BASE 0.0 + MODULE 0.1
// Esta es la nueva base visual oficial.
// No modificar la dirección artística sin instrucción explícita.
// ========================================================
const ORBI_NEXUS_VISUAL_LOCK = {
  version: "REBOOT_BASE_0.0",
  visualIdentity: "deep_cosmic_orbi_energy",
  allowFlatCyanBackground: false,
  allowPinkBackground: false,
  allowRetroGrid: false,
  allowScanlines: false,
  allowPixelatedStyle: false,
  allowBiologicalSnakeLook: false,
  preserveDarkCosmicAtmosphere: true,
  preserveEnergyFlowCreature: true,
};

const ORBI_ENERGY_REGISTRY: Record<OrbiEnergyId, {
  order: number;
  name: string;
  label: string;
  description: string;
  bodyCore: string;
  bodyGlow: string;
  bodyTrail: string;
  accent: string;
  projectile: string;
  role: string;
  playableNow: boolean;
  locked?: boolean;
  projectileCore?: string;
  impact?: string;
}> = {
  foton: {
    order: 1,
    name: "Orbi Foton",
    label: "FOTON",
    description: "Energía solar, luz y radiación vital.",
    bodyCore: "#22c55e",
    bodyGlow: "#15803d",
    bodyTrail: "rgba(34, 197, 94, 0.85)",
    accent: "#86efac",
    projectile: "#86efac",
    role: "Daño solar balanceado",
    playableNow: true,
  },
  hydro: {
    order: 2,
    name: "Orbi Hydro",
    label: "HYDRO",
    description: "Energía del agua, flujo y control.",
    bodyCore: "#38D5FF",
    bodyGlow: "#2B8CFF",
    bodyTrail: "rgba(56, 213, 255, 0.82)",
    accent: "#8EEBFF",
    projectile: "#8EEBFF",
    role: "Control y ralentización",
    playableNow: true,
  },
  aero: {
    order: 3,
    name: "Orbi Aero",
    label: "AERO",
    description: "Energía del aire, viento y presión.",
    bodyCore: "#EAFBFF",
    bodyGlow: "#8EF6FF",
    bodyTrail: "rgba(234, 251, 255, 0.82)",
    accent: "#D9FFFF",
    projectile: "#D9FFFF",
    role: "Velocidad y ráfagas",
    playableNow: true,
  },
  termo: {
    order: 4,
    name: "Orbi Termo",
    label: "TERMO",
    description: "Energía térmica, calor y combustión controlada.",
    bodyCore: "#FF6A2A",
    bodyGlow: "#FF2D00",
    bodyTrail: "rgba(255, 106, 42, 0.78)",
    accent: "#FFCC80",
    projectile: "#FF7A1A",
    projectileCore: "#FFCC80",
    impact: "#FF3D00",
    role: "Daño térmico y presión de área",
    playableNow: true,
  },
  magne: {
    order: 5,
    name: "Orbi Magne",
    label: "MAGNE",
    description: "Energía magnética, atracción y campos.",
    bodyCore: "#B58CFF",
    bodyGlow: "#7B4DFF",
    bodyTrail: "rgba(181, 140, 255, 0.76)",
    accent: "#E2D2FF",
    projectile: "#E2D2FF",
    role: "Atracción y control magnético",
    playableNow: true,
    locked: false,
  },
  aton: {
    order: 6,
    name: "Orbi Aton",
    label: "ATON",
    description: "Energía atómica y reacciones concentradas.",
    bodyCore: "#DFFF4A",
    bodyGlow: "#9AFF00",
    bodyTrail: "rgba(223, 255, 74, 0.76)",
    accent: "#F6FF87",
    projectile: "#F6FF87",
    role: "Impacto atómico y daño crítico",
    playableNow: true,
    locked: false,
  },
  kinetrix: {
    order: 7,
    name: "Orbi Kinetrix",
    label: "KINETRIX",
    description: "Energía cinética, movimiento, impacto y aceleración.",
    bodyCore: "#FFB84D",
    bodyGlow: "#FF7A1A",
    bodyTrail: "rgba(255, 184, 77, 0.76)",
    accent: "#FFE0A3",
    projectile: "#FFE0A3",
    role: "Movimiento, impacto y aceleración",
    playableNow: false,
    locked: true,
  },
  h2nova: {
    order: 8,
    name: "Orbi H2Nova",
    label: "H2NOVA",
    description: "Hidrógeno verde y energía limpia avanzada.",
    bodyCore: "#7CFFB2",
    bodyGlow: "#00FFC8",
    bodyTrail: "rgba(124, 255, 178, 0.76)",
    accent: "#C9FFE8",
    projectile: "#C9FFE8",
    role: "Energía limpia avanzada y soporte",
    playableNow: false,
    locked: true,
  },
  quantum: {
    order: 9,
    name: "Orbi Quantum",
    label: "QUANTUM",
    description: "Energía cuántica, la más poderosa de las 9 energías base.",
    bodyCore: "#FF8FF3",
    bodyGlow: "#B14CFF",
    bodyTrail: "rgba(255, 143, 243, 0.72)",
    accent: "#FFE3FB",
    projectile: "#FFE3FB",
    role: "Distorsión, probabilidad y poder avanzado",
    playableNow: false,
    locked: true,
  },
};

export type AssaultAttackVisualType =
  | "solar_lance"
  | "hydro_bubble"
  | "aero_blade"
  | "thermal_orb"
  | "magnetic_arc"
  | "atomic_pulse"
  | "kinetic_spike"
  | "h2nova_burst"
  | "quantum_shard"
  | "gaia_seed";

export interface AttackSignature {
  attackType: AssaultAttackVisualType;
  shape: string;
  description: string;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  trailStyle: string;
  impactStyle: string;
}

export const ORBI_ATTACK_SIGNATURES: Record<string, AttackSignature> = {
  foton: {
    attackType: "solar_lance",
    shape: "beam",
    description: "Rayo o lanza solar de luz concentrada",
    primaryColor: "#22c55e",
    secondaryColor: "#86efac",
    glowColor: "#15803d",
    trailStyle: "linear_solar",
    impactStyle: "solar_flash",
  },
  hydro: {
    attackType: "hydro_bubble",
    shape: "bubble",
    description: "Burbuja presurizada o gota líquida",
    primaryColor: "#38D5FF",
    secondaryColor: "#8EEBFF",
    glowColor: "#2B8CFF",
    trailStyle: "liquid_trail",
    impactStyle: "water_splash",
  },
  aero: {
    attackType: "aero_blade",
    shape: "crescent",
    description: "Cuchilla o ráfaga de viento",
    primaryColor: "#EAFBFF",
    secondaryColor: "#D9FFFF",
    glowColor: "#8EF6FF",
    trailStyle: "wind_streak",
    impactStyle: "gust_burst",
  },
  termo: {
    attackType: "thermal_orb",
    shape: "orb",
    description: "Esfera térmica de plasma rojo/naranja",
    primaryColor: "#FF7A1A",
    secondaryColor: "#FFCC80",
    glowColor: "#FF2D00",
    trailStyle: "ember_trail",
    impactStyle: "thermal_burst",
  },
  magne: {
    attackType: "magnetic_arc",
    shape: "arc",
    description: "Arco magnético o anillo electromagnético",
    primaryColor: "#B58CFF",
    secondaryColor: "#E2D2FF",
    glowColor: "#7B4DFF",
    trailStyle: "magnetic_wave",
    impactStyle: "magnetic_snap",
  },
  aton: {
    attackType: "atomic_pulse",
    shape: "pulse",
    description: "Pulso atómico concentrado",
    primaryColor: "#DFFF4A",
    secondaryColor: "#F6FF87",
    glowColor: "#9AFF00",
    trailStyle: "atomic_particle",
    impactStyle: "atomic_bloom",
  },
  kinetrix: {
    attackType: "kinetic_spike",
    shape: "dart",
    description: "Dardo o punta cinética de alto impulso",
    primaryColor: "#FFB84D",
    secondaryColor: "#FFE0A3",
    glowColor: "#FF7A1A",
    trailStyle: "kinetic_streak",
    impactStyle: "impact_shock",
  },
  h2nova: {
    attackType: "h2nova_burst",
    shape: "plasma_drop",
    description: "Pulso limpio de hidrógeno verde",
    primaryColor: "#7CFFB2",
    secondaryColor: "#C9FFE8",
    glowColor: "#00FFC8",
    trailStyle: "clean_energy",
    impactStyle: "nova_splash",
  },
  quantum: {
    attackType: "quantum_shard",
    shape: "shard",
    description: "Fragmento cuántico distorsionado",
    primaryColor: "#FF8FF3",
    secondaryColor: "#FFE3FB",
    glowColor: "#B14CFF",
    trailStyle: "quantum_glitch",
    impactStyle: "quantum_ripple",
  },
  gaia: {
    attackType: "gaia_seed",
    shape: "seed",
    description: "Semilla biótica latente de Gaia",
    primaryColor: "#4ADE80",
    secondaryColor: "#A7F3D0",
    glowColor: "#059669",
    trailStyle: "vine_trail",
    impactStyle: "bloom_flash",
  },
};

export type VitalFlowArenaBounds = {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
};

export type VitalFlowStatus =
  | "idle"
  | "countdown"
  | "playing"
  | "collapsed";

export type VitalFlowState = {
  initialized: boolean;
  status: VitalFlowStatus;
  elapsedTime: number;
  score: number;
  pickupsCollected: number;
  length: number;
  targetLength: number;

  head: { x: number; y: number };
  body: { x: number; y: number }[];

  direction: { x: number; y: number };
  nextDirection: { x: number; y: number };

  moveAccumulator: number;
  moveStepDistance: number;
  speed: number;

  pickups: VitalFlowPickup[];

  collapseReason: null | "WALL COLLISION" | "SELF COLLISION";
  spawnGraceTimer: number;

  lastInputAt: number;
};

export type AssaultDebugHudMode = "hidden" | "compact" | "expanded";

export type SerpentEnemyArchetype =
  | "baby_serpent"
  | "armored_serpent"
  | "twin_head_serpent"
  | "splitter_serpent"
  | "spitter_serpent"
  | "crawler_serpent"
  | "void_serpentling"
  | "rest_beacon";

export interface SerpentArchetypeData {
  label: string;
  role: string;
  sizeClass: "small" | "medium" | "large";
  movementStyle: string;
  attackStyle: string;
  maxSegments: number;
  bodyColor: string;
  accentColor: string;
  glowColor: string;
}

export const SERPENT_ENEMY_ARCHETYPES: Record<SerpentEnemyArchetype, SerpentArchetypeData> = {
  baby_serpent: {
    label: "BABY SERPENT",
    role: "rápido / hostigador",
    sizeClass: "small",
    movementStyle: "fast_slither",
    attackStyle: "short_burst",
    maxSegments: 3,
    bodyColor: "#FF5A6B",
    accentColor: "#FFB0B7",
    glowColor: "#8A1D2C",
  },
  armored_serpent: {
    label: "ARMORED SERPENT",
    role: "tanque / resistente",
    sizeClass: "medium",
    movementStyle: "heavy_slide",
    attackStyle: "slow_shot",
    maxSegments: 4,
    bodyColor: "#6D4AFF",
    accentColor: "#C7B8FF",
    glowColor: "#2A176A",
  },
  twin_head_serpent: {
    label: "TWIN-HEAD SERPENT",
    role: "doble amenaza",
    sizeClass: "medium",
    movementStyle: "forked_pursuit",
    attackStyle: "double_shot",
    maxSegments: 4,
    bodyColor: "#FF8A47",
    accentColor: "#FFD0A6",
    glowColor: "#7A2E00",
  },
  splitter_serpent: {
    label: "SPLITTER SERPENT",
    role: "divide presión",
    sizeClass: "medium",
    movementStyle: "erratic_curve",
    attackStyle: "fragment_shot",
    maxSegments: 4,
    bodyColor: "#C93CFF",
    accentColor: "#F0BBFF",
    glowColor: "#50116E",
  },
  spitter_serpent: {
    label: "SPITTER SERPENT",
    role: "rango / francotirador",
    sizeClass: "small",
    movementStyle: "keep_distance",
    attackStyle: "aimed_shot",
    maxSegments: 3,
    bodyColor: "#FF3D3D",
    accentColor: "#FFB3B3",
    glowColor: "#6E1010",
  },
  crawler_serpent: {
    label: "CRAWLER SERPENT",
    role: "presión constante",
    sizeClass: "small",
    movementStyle: "ground_crawl",
    attackStyle: "contact_or_short_spit",
    maxSegments: 5,
    bodyColor: "#3ACFFF",
    accentColor: "#C4F5FF",
    glowColor: "#0E4B5F",
  },
  void_serpentling: {
    label: "VOID SERPENTLING",
    role: "corrupto / extraño",
    sizeClass: "small",
    movementStyle: "phase_slither",
    attackStyle: "void_orb",
    maxSegments: 4,
    bodyColor: "#7A00FF",
    accentColor: "#D2B3FF",
    glowColor: "#24004A",
  },
  rest_beacon: {
    label: "NEXUS SANCTUARY",
    role: "santuario / curación",
    sizeClass: "medium",
    movementStyle: "stationary",
    attackStyle: "none",
    maxSegments: 1,
    bodyColor: "#ffffff",
    accentColor: "#22d3ee",
    glowColor: "#0ea5e9",
  },
};

const GAIA_EVOLUTION_LOCK = {
  id: "gaia",
  order: 10,
  name: "GAIA",
  label: "GAIA",
  selectable: false,
  playableNow: false,
  unlockType: "all_orbi_energies_collected",
  requiredEnergies: [
    "foton",
    "hydro",
    "aero",
    "termo",
    "magne",
    "aton",
    "kinetrix",
    "h2nova",
    "quantum",
  ],
  description:
    "Gaia no se selecciona. Gaia despierta cuando las 9 energías ORBI se sincronizan en una misma serpiente.",
};

const CANVAS_RENDER_CONFIG = {
  maxDprDesktop: 2,
  maxDprMobile: 1.5,
  maxDprLowEnd: 1.25,
};

const PERFORMANCE_PROFILE = {
  desktop: {
    maxParticles: 650,
    maxTrailPoints: 220,
    backgroundDetail: "high",
    glowIntensity: 1.0,
  },
  mobile: {
    maxParticles: 280,
    maxTrailPoints: 140,
    backgroundDetail: "medium",
    glowIntensity: 0.75,
  },
  lowEnd: {
    maxParticles: 180,
    maxTrailPoints: 100,
    backgroundDetail: "low",
    glowIntensity: 0.6,
  },
};

const DEBUG_PERFORMANCE = false;

// REBOOT 1.0 — VERSIONADO OFICIAL (Parte 1)
const ORBI_NEXUS_RELEASE = {
  appName: "ORBI NEXUS SERPENT",
  version: "v1.4.0-web-demo-candidate",
  codename: "Frozen Demo Candidate / Local Sandbox / Non-Commercial Public Demo",
  buildLabel: "MÓDULO 7A — WEB DEMO FREEZE",
  status: "v1.4.0-web-demo-candidate",
  releaseDate: "2026",
};

// REBOOT 1.0 — RELEASE STATUS LOCK (Parte 2)
const DEMO_RELEASE_LOCK = {
  visualDirectionLocked: true,
  mechanicsLocked: true,
  responsiveLocked: true,
  tutorialLocked: true,
  noNewFeaturesInThisBuild: true,
  status: "FROZEN / DEMO CANDIDATE",
};

// REBOOT 1.0 — QA CHECKLIST FINAL INTERNO (Parte 7)
const FINAL_QA_CHECKLIST = {
  versionVisible: true,
  aboutDemoScreen: true,
  creditsScreen: true,
  startScreenResponsive: true,
  demoModePlayable: true,
  infiniteModePlayable: true,
  tutorialToggleWorking: true,
  introSkippable: true,
  mouseControlWorking: true,
  keyboardControlWorking: true,
  touchControlWorking: true,
  mobileLandscapeOverlayWorking: true,
  safeAreasApplied: true,
  objectiveHudWorking: true,
  solarPulseWorking: true,
  nexusGuardianWorking: true,
  blackoutThreatWorking: true,
  corruptionZonesWorking: true,
  blackoutSurgeWorking: true,
  sentinelWorking: true,
  victoryScreenWorking: true,
  gameOverWorking: true,
  localStorageWorking: true,
  pwaMetaPresent: true,
  noPixelatedRendering: true,
  noRetroGrid: true,
  noFlatBlueBackground: true,
  noPinkBackgroundRegression: true,
  noUnhandledConsoleErrors: true,
  typeScriptClean: true,
  linterClean: true,
  productionBuildClean: true,
};

// REBOOT 1.0 — RELEASE NOTES INTERNAS (Parte 16)
const RELEASE_NOTES_1_0 = [
  "First playable demo mission.",
  "Hybrid mouse, keyboard and touch controls.",
  "Responsive canvas and mobile landscape support.",
  "Spark Solar, Solar Stream and Nexus Guardian evolution.",
  "Solar Pulse and Resonant Solar Pulse.",
  "Blackout Threat System.",
  "Corruption Zones and Blackout Surge events.",
  "Corrupted Core Sentinel mini-boss.",
  "Demo Objective Mode and Victory Screen.",
  "Tutorial onboarding and contextual help.",
  "Infinite Mode.",
  "Local high score and ranking.",
  "PWA-ready metadata.",
];

// REBOOT 1.0 — MODO DEBUG Y MODO PRESENTACIÓN (Parte 8 & 17)
const DEBUG_MODE = false;
const PRESENTATION_MODE = false;

// REBOOT 1.0 — LIMPIEZA DE LOGS (Parte 9)
function debugLog(...args: unknown[]) {
  if (DEBUG_MODE) {
    console.log(...args);
  }
}

// REBOOT 1.0 — LOCALSTORAGE HARDENING (Parte 10)
function safeGetLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetLocalStorage(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // fail silently
  }
}

// ORBI NEXUS SERPENT — HOTFIX GLOBAL 1.1.2A — TERRA TO TERMO HERO REGISTRY FIX
function migrateLegacyTerraToTermo(value: unknown): unknown {
  if (value === "terra") return "termo";
  if (value === "Terra") return "Termo";
  if (value === "TERRA") return "TERMO";

  if (Array.isArray(value)) {
    return value.map(migrateLegacyTerraToTermo);
  }

  if (value && typeof value === "object") {
    const migrated: any = {};
    for (const [key, v] of Object.entries(value as any)) {
      const newKey =
        key === "terra" ? "termo" :
        key === "Terra" ? "Termo" :
        key === "TERRA" ? "TERMO" :
        key;

      migrated[newKey] = migrateLegacyTerraToTermo(v);
    }
    return migrated;
  }

  return value;
}

function validateNoActiveTerraReferences() {
  const activeLabels = [
    GUARDIAN_THEMES.FOTON.name,
    GUARDIAN_THEMES.HYDRO.name,
    GUARDIAN_THEMES.AERO.name,
    GUARDIAN_THEMES.TERMO.name,
    GUARDIAN_THEMES.MAGNE.name,
    GUARDIAN_THEMES.ATON.name,
  ];
  if (activeLabels.some((label: string) => label.toLowerCase().includes("terra"))) {
    console.warn("[ORBI ENERGY REGISTRY] Visible Terra label detected. Replace with Termo.");
  }
}


const ORBI_NEXUS_PALETTE = {
  backgroundDeep: "#050b18",
  backgroundBlue: "#071527",
  backgroundViolet: "#111032",
  nexusCyan: "#22d8ff",
  nexusBlue: "#2c7dff",
  nexusViolet: "#7c4dff",
  fotonGold: "#ffd166",
  fotonAmber: "#ffb347",
  fotonWhite: "#fff4c2",
  blackoutPurple: "#3b155f",
  blackoutCore: "#08020f",
};

const PERFORMANCE_LIMITS = {
  maxParticlesDesktop: 450,
  maxParticlesMobile: 220,
  maxTrailPoints: 180,
  dprLimit: 2,
};

const NEXUS_BOUNDARY = {
  warningDistance: 180,
  containmentDistance: 60,
  softPushForce: 0.08,
  hardPushForce: 0.18,
  damagePerSecond: 8,
  severeDamagePerSecond: 16,
  severeAfterSeconds: 1.5,
};

const BOUNDARY_MODE: 'damage' | 'bounce' | 'hybrid' = 'hybrid';

const SOLAR_PULSE_CONFIG = {
  cooldown: 8,
  radiusSpark: 180,
  radiusSolarStream: 230,
  radiusNexusGuardian: 280,
  duration: 0.75,
  blackoutOrbBonus: 25,
  blackoutObstacleBonus: 50,
  cameraShake: 0.08,
};

const COMBO_CONFIG = {
  windowSeconds: 2,
  pointMultiplierStep: 0.1,
  maxMultiplier: 2,
};

const BLACKOUT_THREAT_CONFIG = {
  level1Time: 45,
  level2Time: 90,
  level3Time: 150,
  energyInfluence: 0.015,
  maxThreatLevel: 3,
};

const CORRUPTION_ZONE_REWARD = {
  score: 250,
  energy: 15,
  comboBoost: 1,
};

const NEXUS_GUARDIAN_REQUIREMENTS = {
  requiredEnergy: 75,
  optionalPurifiedZones: 1,
  optionalSurgesSurvived: 1,
};

const NEXUS_GUARDIAN_PULSE_MODIFIER = {
  radiusMultiplier: 1.18,
  purificationMultiplier: 1.2,
  cooldownReduction: 1,
};

const NEXUS_GUARDIAN_RESISTANCE = {
  blackoutDamageReduction: 0.12,
  boundaryDamageReduction: 0.08,
};

const GUARDIAN_SENTINEL_BONUS = {
  shieldDamageMultiplier: 1.15,
  healthDamageMultiplier: 1.1,
};

const SPAWN_SAFETY = {
  minDistanceFromPlayer: 300,
  maxDistanceFromPlayer: 900,
  minDistanceFromBoundary: 220,
};

const SENTINEL_SPAWN_CONFIG = {
  minTimeSeconds: 120,
  requiredPurifiedZones: 2,
  requireSolarStream: true,
  spawnWarningSeconds: 3,
  maxSentinelsPerRun: 1,
};

const SENTINEL_SPAWN_SAFETY = {
  minDistanceFromPlayer: 600,
  minDistanceFromBoundary: 280,
  preferredDistanceFromPlayer: 900,
};

const SENTINEL_BALANCE = {
  maxHealth: 300,
  maxShield: 150,
  solarPulseShieldDamage: 60,
  purifiedOrbShieldDamage: 15,
  directPulseHealthDamage: 45,
  vulnerableDuration: 8,
};

const SENTINEL_ENRAGE = {
  threshold: 0.35,
  attackSpeedMultiplier: 1.35,
  rewardMultiplier: 1.25,
};

const SENTINEL_REWARD = {
  score: 1000,
  energy: 30,
  threatReductionSeconds: 20,
};

// Future audio engine hook reservations (REBOOT 0.3)
function onSolarPulseCast() {}
function onSolarPulsePurify() {}
function onEvolutionAwakened() {}
function onComboIncrease() {}

function onSentinelDetected() {}
function onSentinelSpawn() {}
function onSentinelShieldBreak() {}
function onSentinelCoreDamaged() {}
function onSentinelDefeated() {}
function onPerfectSentinelPurge() {}

function onNexusGuardianAwakened() {}
function onGuardianPulseCast() {}
function onGuardianResonance() {}

// Demo mode audio & state hook reservations (REBOOT 0.6)
function onObjectiveComplete() {}
function onDemoVictory() {}
function onRankReveal() {}
function onHighScoreSaved() {}

const INITIAL_DEMO_OBJECTIVES = [
  {
    id: "reach_solar_stream",
    label: "Alcanza Solar Stream",
    description: "Absorbe energía suficiente para despertar tu primera evolución.",
    completed: false,
  },
  {
    id: "purify_two_zones",
    label: "Purifica 2 zonas corruptas",
    description: "Limpia la corrupción Blackout dentro de la Red Vital.",
    completed: false,
  },
  {
    id: "survive_blackout_surge",
    label: "Sobrevive a 1 Blackout Surge",
    description: "Resiste una oleada activa de corrupción.",
    completed: false,
  },
  {
    id: "defeat_sentinel",
    label: "Derrota al Corrupted Core Sentinel",
    description: "Purga el núcleo consciente de la infección Blackout.",
    completed: false,
  },
];

interface BestDemoRun {
  score: number;
  rank: 'C' | 'B' | 'A' | 'S' | 'ORBI_PRIME';
  time: number;
  maxCombo: number;
  date: string;
}


// Override config flags to prevent any retro grid, scanline, or scanline elements
const ENABLE_SCANLINES = false;
const ENABLE_CRT_OVERLAY = false;
const ENABLE_RETRO_GRID = false;
const ENABLE_PIXEL_STYLE = false;

// Quality limits
const QUALITY = {
  maxParticlesDesktop: PERFORMANCE_LIMITS.maxParticlesDesktop,
  maxParticlesMobile: PERFORMANCE_LIMITS.maxParticlesMobile,
  glowEnabled: true,
  cameraSmoothness: 0.055,
  vitalNetworkDensity: 15,
};

// Evolution names according to instructions (Stages 1 to 4)
const EVOLUTION_STAGES: Record<EvolutionName, EvolutionStage> = {
  SPARK: {
    id: 1,
    name: 'SPARK',
    displayName: 'SPARK SOLAR',
    minEnergy: 0,
    speed: 4.2,
    baseLength: 8,
    color: '#fbbf24', // Amber solar
    accentColor: '#f59e0b',
  },
  SOLAR_STREAM: {
    id: 2,
    name: 'SOLAR_STREAM',
    displayName: 'SOLAR STREAM',
    minEnergy: 25,
    speed: 3.7,
    baseLength: 16,
    color: '#f97316', // Orange Stream
    accentColor: '#f97316',
  },
  GUARDIAN_SERPENT: {
    id: 3,
    name: 'GUARDIAN_SERPENT',
    displayName: 'NEXUS GUARDIAN',
    minEnergy: 75,
    speed: 3.2,
    baseLength: 26,
    color: '#22d3ee', // Cyan Nexus
    accentColor: '#6366f1',
  },
  TITAN_SERPENT: {
    id: 4,
    name: 'TITAN_SERPENT',
    displayName: 'TITAN FLOW',
    minEnergy: 160,
    speed: 2.7,
    baseLength: 38,
    color: '#c084fc', // Celestial Violet
    accentColor: '#ec4899',
  }
};

// Guardians specs with primary solar gold / space colors
const GUARDIAN_THEMES: Record<GuardianId, GuardianTheme> = {
  FOTON: {
    id: 'FOTON',
    name: 'Orbi Foton',
    element: 'Energía Solar',
    description: 'Guardián solar nacido de la primera chispa de la Red Vital. Absorbe energía con velocidad y libera pulsos de luz pura.',
    primaryColor: '#22c55e', // Green Solar / Neon
    secondaryColor: '#16a34a', // Darker Green
    textColor: 'text-green-400',
    auraColor: 'rgba(34, 197, 94, 0.45)',
    particleColor: '#22c55e',
    trailColor: 'rgba(34, 197, 94, 0.22)',
    eyeColor: '#ffffff',
    blackoutContrastColor: '#22c55e',
    evolutionNames: {
      SPARK: 'Spark Solar',
      SOLAR_STREAM: 'Solar Stream',
      GUARDIAN_SERPENT: 'Nexus Guardian',
      TITAN_SERPENT: 'Titan Flow'
    },
    abilityName: 'Pulso Solar',
    abilityDescription: 'Genera una onda radial verde solar que destruye u otorga puntos por disipar orbes Blackout en su radio de acción.',
    passiveName: 'Absorción Fotónica',
    passiveDescription: '+15% de bono de energía al recolectar orbes positivos.',
    speedModifier: 1.00,
    energyModifier: 1.15,
    growthModifier: 1.00,
    resistanceModifier: 1.00,
    visualMotif: 'solar',
    orbStyle: 'solar_flare'
  },
  HYDRO: {
    id: 'HYDRO',
    name: 'Orbi Hydro',
    element: 'Energía Hídrica',
    description: 'Guardián de las corrientes vitales. Su cuerpo fluye como agua viva y puede restaurar energía incluso en medio de la corrupción.',
    primaryColor: '#0ea5e9', // Sky Blue
    secondaryColor: '#2563eb', // Royal Blue
    textColor: 'text-sky-400',
    auraColor: 'rgba(14, 165, 233, 0.45)',
    particleColor: '#38bdf8',
    trailColor: 'rgba(14, 165, 233, 0.22)',
    eyeColor: '#a5f3fc',
    blackoutContrastColor: '#38bdf8',
    evolutionNames: {
      SPARK: 'Aqua Spark',
      SOLAR_STREAM: 'Tidal Stream',
      GUARDIAN_SERPENT: 'Nexus Leviathan',
      TITAN_SERPENT: 'Titan Hydro Flow'
    },
    abilityName: 'Ola Purificadora',
    abilityDescription: 'Ola de purificación cíclica que transmuta orbes blackout cercanos en orbes de energía solar y otorga 2 segundos de inmunidad.',
    passiveName: 'Flujo Regenerativo',
    passiveDescription: 'Tras 4 segundos sin daño, se restaura gradualmente +1 de energía por segundo.',
    speedModifier: 0.95,
    energyModifier: 1.00,
    growthModifier: 1.00,
    resistanceModifier: 1.05,
    visualMotif: 'water',
    orbStyle: 'hydro_pulse'
  },
  AERO: {
    id: 'AERO',
    name: 'Orbi Aero',
    element: 'Energía Eólica',
    description: 'Guardián de los vientos de la Red Vital. Su cuerpo se mueve como una corriente de aire capaz de esquivar la corrupción.',
    primaryColor: '#10b981', // Emerald Green
    secondaryColor: '#14b8a6', // Teal
    textColor: 'text-emerald-400',
    auraColor: 'rgba(16, 185, 129, 0.45)',
    particleColor: '#34d399',
    trailColor: 'rgba(16, 185, 129, 0.22)',
    eyeColor: '#d1fae5',
    blackoutContrastColor: '#34d399',
    evolutionNames: {
      SPARK: 'Wind Spark',
      SOLAR_STREAM: 'Sky Stream',
      GUARDIAN_SERPENT: 'Storm Guardian',
      TITAN_SERPENT: 'Titan Aero Flow'
    },
    abilityName: 'Dash de Viento',
    abilityDescription: 'Ráfaga de aceleración súbita que confiere una estela de viento y reduce el daño recibido durante su trayecto.',
    passiveName: 'Corriente Ligera',
    passiveDescription: '+8% de velocidad de desplazamiento base y sensibilidad de viraje incrementada.',
    speedModifier: 1.08,
    energyModifier: 0.95,
    growthModifier: 1.00,
    resistanceModifier: 0.95,
    visualMotif: 'wind',
    orbStyle: 'wind_tempest'
  },
  TERMO: {
    id: 'TERMO',
    name: 'Orbi Termo',
    element: 'Energía Térmica',
    description: 'Guardián del calor de la Red Vital. Su energía fluye con ímpetu volcánico capaz de purgar la corrupción Blackout.',
    primaryColor: '#ff6a2a', // Thermal orange
    secondaryColor: '#ff2d00', // Crimson/red
    textColor: 'text-orange-500',
    auraColor: 'rgba(255, 106, 42, 0.45)',
    particleColor: '#ff8a50',
    trailColor: 'rgba(255, 106, 42, 0.22)',
    eyeColor: '#ffcc80',
    blackoutContrastColor: '#ff6a2a',
    evolutionNames: {
      SPARK: 'Thermal Spark',
      SOLAR_STREAM: 'Flame Stream',
      GUARDIAN_SERPENT: 'Helios Guardian',
      TITAN_SERPENT: 'Titan Termo Flow'
    },
    abilityName: 'Pulso Térmico',
    abilityDescription: 'Desata una explosión radial de calor que paraliza temporalmente fragmentos blackout cercanos y atrae suavemente orbes.',
    passiveName: 'Combustión Controlada',
    passiveDescription: '-15% de daño recibido de obstáculos y +10% de daño térmico.',
    speedModifier: 0.95,
    energyModifier: 1.05,
    growthModifier: 1.00,
    resistanceModifier: 0.85,
    visualMotif: 'solar',
    orbStyle: 'lithic_armor'
  },
  MAGNE: {
    id: 'MAGNE',
    name: 'Orbi Magne',
    element: 'Energía Magnética',
    description: 'Guardián magnético que controla los campos de fuerza, desviando proyectiles y atrayendo enemigos con precisión matemática.',
    primaryColor: '#7c4dff', // Violeta magnético
    secondaryColor: '#b58cff',
    textColor: 'text-violet-400',
    auraColor: 'rgba(124, 77, 255, 0.45)',
    particleColor: '#b58cff',
    trailColor: 'rgba(124, 77, 255, 0.22)',
    eyeColor: '#ffffff',
    blackoutContrastColor: '#7c4dff',
    evolutionNames: {
      SPARK: 'Magnetic Spark',
      SOLAR_STREAM: 'Polar Stream',
      GUARDIAN_SERPENT: 'Nexus Attractor',
      TITAN_SERPENT: 'Titan Magne Flow'
    },
    abilityName: 'Anillo de Polaridad',
    abilityDescription: 'Desata un campo magnético que atrae fragmentos de energía y desvía proyectiles enemigos cercanos.',
    passiveName: 'Campo Polar',
    passiveDescription: 'Los proyectiles y núcleos alteran levemente la trayectoria de amenazas cercanas.',
    speedModifier: 1.00,
    energyModifier: 1.05,
    growthModifier: 1.00,
    resistanceModifier: 1.10,
    visualMotif: 'solar', // reuse solar graphics adapted to violet particles
    orbStyle: 'magnetic_wave'
  },
  ATON: {
    id: 'ATON',
    name: 'Orbi Aton',
    element: 'Energía Atómica',
    description: 'Reactor vivo de fisión controlada. Libera devastadores pulsos radiactivos de daño concentrado y micro-explosiones.',
    primaryColor: '#dfff4a', // Amarillo nuclear / dorado radiactivo
    secondaryColor: '#ffd700',
    textColor: 'text-yellow-400',
    auraColor: 'rgba(223, 255, 74, 0.45)',
    particleColor: '#dfff4a',
    trailColor: 'rgba(223, 255, 74, 0.22)',
    eyeColor: '#ffffff',
    blackoutContrastColor: '#dfff4a',
    evolutionNames: {
      SPARK: 'Atomic Spark',
      SOLAR_STREAM: 'Fission Stream',
      GUARDIAN_SERPENT: 'Nexus Reactor',
      TITAN_SERPENT: 'Titan Aton Flow'
    },
    abilityName: 'Fisión Radiactiva',
    abilityDescription: 'Crea una micro-explosión nuclear concentrada de daño crítico en área reducida.',
    passiveName: 'Reactor Controlado',
    passiveDescription: 'Los impactos generan micro-pulsos de daño en área reducido.',
    speedModifier: 0.90,
    energyModifier: 1.15,
    growthModifier: 1.00,
    resistanceModifier: 0.95,
    visualMotif: 'solar', // reuse solar graphics styled as green/yellow nuclear energy
    orbStyle: 'atomic_particle'
  }
};

interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  size: number;
  vx?: number;
  vy?: number;
  decay?: number;
  maxLife?: number;
}

// Procedural sound effects using Web Audio API to prevent broken audio dependencies
class WebSynthEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {}

  private init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      this.ctx = new AudioContextClass();
    }
  }

  public play(type: 'solar' | 'nexus' | 'blackout' | 'evolve' | 'ability' | 'reset' | 'soft_orbi_pulse' | 'soft_launch_chime' | 'countdown_background_pad' | 'rift_spawn') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const ctx = this.ctx;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const t = ctx.currentTime;

      if (type === 'solar') {
        // High crystalline chime for solar orb collection
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(659.25, t); // E5, sweet and pure
        osc.frequency.exponentialRampToValueAtTime(987.77, t + 0.12); // rise to B5
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.06, t + 0.01); // smooth onset
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18); // smooth decay
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.2);

      } else if (type === 'nexus') {
        // Soft double electronic major third harmony
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, t); // C5
        osc1.frequency.exponentialRampToValueAtTime(659.25, t + 0.2); // rise to E5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, t); // G5
        osc2.frequency.exponentialRampToValueAtTime(987.77, t + 0.2); // rise to B5
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.07, t + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.32);
        osc2.stop(t + 0.32);

      } else if (type === 'blackout') {
        // Deep warm bass pluck instead of harsh sawtooth rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, t);
        osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.25);

      } else if (type === 'evolve') {
        // Glorious arpeggiated chord using warm sine waves
        const freqs = [261.63, 329.63, 392.00, 523.25]; // Major chord C4 E4 G4 C5
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + i * 0.04);
          osc.frequency.exponentialRampToValueAtTime(f * 1.5, t + i * 0.04 + 0.25);
          
          gain.gain.setValueAtTime(0, t + i * 0.04);
          gain.gain.linearRampToValueAtTime(0.06, t + i * 0.04 + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.4);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(t + i * 0.04);
          osc.stop(t + i * 0.04 + 0.45);
        });

      } else if (type === 'ability') {
        // Melodic flute-like sweeping whistle
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, t);
        osc.frequency.exponentialRampToValueAtTime(440, t + 0.35);
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.08, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);

      } else if (type === 'reset') {
        // Comforting, descending gentle cascade
        const freqs = [523.25, 392.00, 329.63]; // C5, G4, E4
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t + i * 0.04);
          
          gain.gain.setValueAtTime(0, t + i * 0.04);
          gain.gain.linearRampToValueAtTime(0.05, t + i * 0.04 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.04);
          osc.stop(t + i * 0.04 + 0.35);
        });

      } else if (type === 'soft_orbi_pulse') {
        // Organic, warm ambient chime strike
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(440, t); // A4 (warmer, less piercing than E5)
        // Organic attack click / frequency sweep
        osc1.frequency.exponentialRampToValueAtTime(329.63, t + 0.06); // drops to E4
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, t); // Octave up A5
        osc2.frequency.exponentialRampToValueAtTime(659.25, t + 0.06); // drops to E5
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.035, t + 0.01); // ultra soft onset
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35); // smooth gentle ring
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        
        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 0.4);
        osc2.stop(t + 0.4);

      } else if (type === 'soft_launch_chime') {
        // Celestial game-start launch harp chime
        const freqs = [329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // E4, G4, C5, E5, G5, C6
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          
          // Soft frequency slide upward for organic harp-like pluck feel
          osc.frequency.setValueAtTime(f * 0.98, t + i * 0.04);
          osc.frequency.exponentialRampToValueAtTime(f, t + i * 0.04 + 0.08);
          
          gain.gain.setValueAtTime(0, t + i * 0.04);
          gain.gain.linearRampToValueAtTime(0.04, t + i * 0.04 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.04 + 0.7);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.04);
          osc.stop(t + i * 0.04 + 0.8);
        });

      } else if (type === 'countdown_background_pad') {
        // Ambient sci-fi organic chord (C Major 9 / Am7 flavor): C3, G3, C4, E4, B4
        const chords = [130.81, 196.00, 261.63, 329.63, 493.88];
        chords.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          // Slight detuning for beautiful lush chorus effect
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, t);
          
          // Fade in over 1.2 seconds, sustain, then fade out over 2.5 seconds
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.04 / chords.length, t + 1.2);
          gain.gain.linearRampToValueAtTime(0.04 / chords.length, t + 2.5);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 4.0);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(t);
          osc.stop(t + 4.1);
        });
      } else if (type === 'rift_spawn') {
        // Subtle futuristic cosmic rift sound: pitch drop on soft triangle with a little hum
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, t); // E4
        osc.frequency.exponentialRampToValueAtTime(110, t + 0.3); // drop to A2
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.12, t + 0.02); // soft onset (requested volume 0.10–0.16)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); // smooth decay
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.45);
      }
    } catch (e) {
      console.warn("Audio Context failed to start:", e);
    }
  }
}

const synthEngineInstance = new WebSynthEngine();

const NEXUS_ASSAULT_SPEED_CONFIG = {
  baseSpeedMultiplier: 0.78,
  maxSpeedMultiplier: 1.18,
  speedIncreasePerRoom: 0.035,
  eliteRoomBonus: 0.04,
  swarmRoomBonus: 0.06,
  transitionSpeedMultiplier: 0.45,
  upgradeSelectionSpeedMultiplier: 0.0,
};

function AssaultRadarMinimap({ stateRef }: { stateRef: any }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let active = true;

    const render = () => {
      if (!active) return;
      const canvas = canvasRef.current;
      if (!canvas) {
        requestAnimationFrame(render);
        return;
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        requestAnimationFrame(render);
        return;
      }

      const core = stateRef.current;
      if (!core || !core.assaultRun) {
        requestAnimationFrame(render);
        return;
      }

      const player = core.player;
      if (!player) {
        requestAnimationFrame(render);
        return;
      }

      const enemies = core.assaultRun.enemies || [];
      const room = core.assaultRun.room || {};
      const shape = room.shape || 'RECTANGLE';

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw background disk
      ctx.fillStyle = 'rgba(3, 7, 18, 0.85)';
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Draw radar sweep
      const sweepAngle = (Date.now() / 800) * Math.PI;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.12)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(sweepAngle) * (cx - 4), cy + Math.sin(sweepAngle) * (cy - 4));
      ctx.stroke();

      // Range rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(cx, cy, (cx - 3) * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      const baseR = (core.gameMode === 'nexus_assault') ? NEXUS_ASSAULT_ARENA_RADIUS : 730;
      const scale = (cx - 5) / baseR;

      // Arena center offset relative to player
      const acx = cx + (1425 - player.x) * scale;
      const acy = cy + (1425 - player.y) * scale;
      const ar = baseR * scale;

      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, cx - 4, 0, Math.PI * 2);
      ctx.clip();

      // Draw arena boundary
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      if (shape === 'CIRCLE') {
        ctx.arc(acx, acy, ar, 0, Math.PI * 2);
      } else if (shape === 'OCTAGON') {
        for (let j = 0; j < 8; j++) {
          const ang = (j / 8) * Math.PI * 2 + Math.PI / 8;
          const px = acx + Math.cos(ang) * ar;
          const py = acy + Math.sin(ang) * ar;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (shape === 'WIDE_RECTANGLE') {
        const rx = ar * 1.25;
        const ry = ar * 0.8;
        ctx.rect(acx - rx, acy - ry, rx * 2, ry * 2);
      } else {
        ctx.rect(acx - ar, acy - ar, ar * 2, ar * 2);
      }
      ctx.stroke();

      // Draw grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      const boxMin = 1425 - 750;
      const boxMax = 1425 + 750;
      for (let x = boxMin; x <= boxMax; x += 200) {
        const rx = cx + (x - player.x) * scale;
        ctx.beginPath();
        ctx.moveTo(rx, cy - cx);
        ctx.lineTo(rx, cy + cx);
        ctx.stroke();
      }
      for (let y = boxMin; y <= boxMax; y += 200) {
        const ry = cy + (y - player.y) * scale;
        ctx.beginPath();
        ctx.moveTo(cx - cx, ry);
        ctx.lineTo(cx + cx, ry);
        ctx.stroke();
      }

      // Check room and enemy states
      const aliveEnemies = enemies.filter((e: any) => e.health > 0);
      const isSingleLeft = aliveEnemies.length === 1;
      const isSwarmRoom = core.assaultRun.roomType === 'swarm';

      // Draw swarm signals if applicable
      if (isSwarmRoom) {
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
          const shift = (Date.now() / 400) % 1;
          const rMin = cx - 12 + shift * 4;
          const rMax = cx - 4;
          ctx.moveTo(cx + Math.cos(a) * rMin, cy + Math.sin(a) * rMin);
          ctx.lineTo(cx + Math.cos(a) * rMax, cy + Math.sin(a) * rMax);
        }
        ctx.stroke();
      }

      // Draw enemies
      enemies.forEach((enemy: any) => {
        if (enemy.health <= 0) return;
        const ex = cx + (enemy.x - player.x) * scale;
        const ey = cy + (enemy.y - player.y) * scale;

        const distFromCenter = Math.hypot(ex - cx, ey - cy);
        if (distFromCenter < cx - 5) {
          const arch: SerpentEnemyArchetype = enemy.archetype || 'baby_serpent';
          
          if (enemy.isBoss) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Archetype specific radar shape
            ctx.fillStyle = enemy.color || '#f43f5e';
            ctx.strokeStyle = enemy.accentColor || '#ffffff';
            ctx.lineWidth = 1.0;

            if (arch === 'baby_serpent') {
              // Slim crimson dot
              ctx.beginPath();
              ctx.arc(ex, ey, 2.2, 0, Math.PI * 2);
              ctx.fill();
            } else if (arch === 'crawler_serpent') {
              // Tiny crawling centipede line (3 small dots connected)
              ctx.beginPath();
              ctx.arc(ex - 1.5, ey, 1.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(ex + 1.5, ey, 1.2, 0, Math.PI * 2);
              ctx.fill();
            } else if (arch === 'void_serpentling') {
              // Violet hollow circle
              ctx.beginPath();
              ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
              ctx.stroke();
            } else if (arch === 'armored_serpent') {
              // Blocky shield-like diamond
              ctx.beginPath();
              ctx.moveTo(ex, ey - 3.2);
              ctx.lineTo(ex + 3.2, ey);
              ctx.lineTo(ex, ey + 3.2);
              ctx.lineTo(ex - 3.2, ey);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();
            } else if (arch === 'splitter_serpent') {
              // Fractured cross-shaped point
              ctx.beginPath();
              ctx.moveTo(ex - 2.5, ey);
              ctx.lineTo(ex + 2.5, ey);
              ctx.moveTo(ex, ey - 2.5);
              ctx.lineTo(ex, ey + 2.5);
              ctx.stroke();
            } else if (arch === 'twin_head_serpent') {
              // Two tiny orange dots overlapping
              ctx.beginPath();
              ctx.arc(ex - 1.2, ey, 1.6, 0, Math.PI * 2);
              ctx.fill();
              ctx.beginPath();
              ctx.arc(ex + 1.2, ey, 1.6, 0, Math.PI * 2);
              ctx.fill();
            } else if (arch === 'spitter_serpent') {
              // Glowing neon red ring with inner dot
              ctx.beginPath();
              ctx.arc(ex, ey, 3.2, 0, Math.PI * 2);
              ctx.stroke();
              ctx.beginPath();
              ctx.arc(ex, ey, 1.0, 0, Math.PI * 2);
              ctx.fill();
            } else {
              // fallback
              ctx.beginPath();
              ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          // Boss warning pulsing ring
          if (enemy.isBoss) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            const pulseR = 9 + Math.sin(Date.now() / 150) * 4;
            ctx.arc(ex, ey, pulseR, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Elite amber border
          if (enemy.isElite && !enemy.isBoss) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(ex, ey, 5.5, 0, Math.PI * 2);
            ctx.stroke();
          }

          // BOSS / ELITE Text scan labels on radar (QA Checkpoint 8.1)
          if (enemy.isBoss) {
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 6px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('BOSS', ex + 8, ey + 2);
          } else if (enemy.isElite) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 5px JetBrains Mono, monospace';
            ctx.textAlign = 'left';
            ctx.fillText('ELITE', ex + 7, ey + 2);
          }

          // Single remaining enemy pulse
          if (isSingleLeft) {
            ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ex, ey, 7 + Math.sin(Date.now() / 100) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Last-hostile concentric ring
          if (enemy.shootCooldown !== undefined && enemy.shootCooldown < 30) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(ex, ey, 5 + Math.sin(Date.now() / 80) * 3, 0, Math.PI * 2);
            ctx.stroke();
          }
        } else {
          // Off-screen pointer
          const angle = Math.atan2(ey - cy, ex - cx);
          const px = cx + Math.cos(angle) * (cx - 7);
          const py = cy + Math.sin(angle) * (cy - 7);
          ctx.fillStyle = enemy.isBoss ? '#ef4444' : (enemy.isElite ? '#fbbf24' : '#f43f5e');
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px - Math.cos(angle - 0.25) * 6, py - Math.sin(angle - 0.25) * 6);
          ctx.lineTo(px - Math.cos(angle + 0.25) * 6, py - Math.sin(angle + 0.25) * 6);
          ctx.closePath();
          ctx.fill();

          // Draw an outer ring for off-screen elite border if tracking is unlocked
          if (enemy.isElite) {
            ctx.strokeStyle = 'rgba(251, 191, 36, 0.7)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(px, py, 4.5, 0, Math.PI * 2);
            ctx.stroke();
          }
        }
      });

      ctx.restore();

      // Pulse ring around player
      const pulseRadius = 5 + Math.sin(Date.now() / 150) * 1.5;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
    };
  }, [stateRef]);

  return (
    <div className="flex flex-col gap-1.5 items-center bg-[#030712]/90 border border-[#22d3ee]/20 rounded-xl p-3 backdrop-blur-md shadow-2xl">
      <span className="text-[9.5px] font-mono text-cyan-400 font-black uppercase tracking-wider">ENEMY DETECTOR RADAR</span>
      <div className="relative w-[130px] h-[130px]">
        <canvas ref={canvasRef} width={130} height={130} className="w-full h-full block" />
        <div className="absolute top-1 left-1.5 text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest">NEXUS</div>
        <div className="absolute bottom-1 right-1.5 text-[8px] font-mono text-cyan-500/50 font-bold uppercase tracking-widest">SCANNING</div>
      </div>
    </div>
  );
}

// ============================================================================
// STANDARDIZED TACTICAL HUD PREMIUM COMPONENTS
// ============================================================================

interface OrbiHeroInfoPanelProps {
  gameMode: string;
  selectedGuardian: GuardianId;
  themeSpecs: GuardianTheme;
  stats: GameStats;
  hudMode: 'full' | 'compact';
}

const OrbiHeroInfoPanel: React.FC<OrbiHeroInfoPanelProps> = ({
  gameMode,
  themeSpecs,
  stats,
  hudMode
}) => {
  if (hudMode === 'compact') return null;

  const isVitalFlow = gameMode === 'vital_flow';
  const evolutionLabel = (ENABLE_GLOBAL_SERPENT_EVOLUTION_SCALE_FIX && stats.visualLabel)
    ? stats.visualLabel
    : (isVitalFlow 
        ? `FASE E${Math.max(1, Math.floor(stats.length))}`
        : themeSpecs.evolutionNames[stats.evolution]);

  let accentBorder = 'border-cyan-500/20';
  let elementLabelColor = 'text-cyan-400';
  let elementBgColor = 'bg-cyan-950/40';
  let evolutionColor = 'text-cyan-400';

  if (gameMode === 'infinite') {
    accentBorder = 'border-purple-500/20';
    elementLabelColor = 'text-purple-400';
    elementBgColor = 'bg-purple-950/40';
    evolutionColor = 'text-purple-300';
  } else if (gameMode === 'nexus_assault') {
    accentBorder = 'border-amber-500/20';
    elementLabelColor = 'text-amber-400';
    elementBgColor = 'bg-amber-950/40';
    evolutionColor = 'text-amber-300';
  } else if (gameMode === 'vital_flow') {
    accentBorder = 'border-emerald-500/20';
    elementLabelColor = 'text-emerald-400';
    elementBgColor = 'bg-emerald-950/40';
    evolutionColor = 'text-emerald-300';
  }

  const energyTypeLabel = isVitalFlow ? "FUENTE SOLAR" : themeSpecs.element;
  const passiveTitle = isVitalFlow ? "FLUJO ACELERADO" : themeSpecs.passiveName;
  const passiveDesc = isVitalFlow ? "Crecimiento de estela vital continuo sin fricción" : themeSpecs.passiveDescription;

  return (
    <div className={`bg-[#030712]/90 border ${accentBorder} rounded-xl px-3.5 py-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1 w-full max-w-[200px] transition-all duration-300 pointer-events-auto`}>
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <h2 className="font-display font-black text-[10.5px] tracking-wider uppercase text-slate-100 truncate max-w-[100px]">
            {isVitalFlow ? "ORBI FOTON" : themeSpecs.name}
          </h2>
        </div>
        <span className={`text-[8px] uppercase font-mono font-black px-1 py-0.5 rounded ${elementBgColor} ${elementLabelColor} border border-white/5`}>
          {energyTypeLabel}
        </span>
      </div>

      <div className="flex flex-col gap-0.5 font-mono text-[9px]">
        <div className="flex justify-between">
          <span className="text-slate-500">EVOLUCIÓN:</span>
          <span className={`${evolutionColor} font-black`}>{isVitalFlow ? `FASE E${Math.floor(stats.length)}` : evolutionLabel}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">PASIVA:</span>
          <span className="text-[#fbbf24] font-bold uppercase text-[8.5px] truncate max-w-[110px]">{passiveTitle}</span>
        </div>
        <p className="text-slate-400 text-[8px] font-sans leading-normal mt-1 border-t border-white/5 pt-1">
          {passiveDesc}
        </p>
      </div>
    </div>
  );
};

interface OrbiVitalPanelProps {
  gameMode: string;
  stats: GameStats;
  themeSpecs: GuardianTheme;
  state: any;
  hudMode: 'full' | 'compact';
}

const OrbiVitalPanel: React.FC<OrbiVitalPanelProps> = ({ gameMode, stats, themeSpecs, state, hudMode }) => {
  const isVitalFlow = gameMode === 'vital_flow';

  let currentVal = stats.energy;
  let maxVal = 100;
  let color = themeSpecs.primaryColor;
  let label = 'CARGA VITAL';

  if (gameMode === 'nexus_assault') {
    currentVal = state.assaultRun?.hp ?? 0;
    maxVal = state.assaultRun?.maxHp ?? 100;
    color = '#10b981';
    label = 'VITALIDAD CORE';
  } else if (gameMode === 'infinite') {
    currentVal = stats.energy;
    maxVal = 100;
    color = '#a855f7';
    label = 'ESTABILIDAD INTERNA';
  } else {
    currentVal = stats.energy;
    maxVal = 100;
    color = themeSpecs.primaryColor;
    label = 'CARGA VITAL';
  }

  const percent = Math.max(0, Math.min(100, (currentVal / maxVal) * 100));
  const alertPulse = percent <= 20;

  if (hudMode === 'compact') {
    return (
      <div className="pointer-events-auto bg-[#030712]/90 border border-white/10 rounded-xl px-3 py-1.5 backdrop-blur-md shadow-xl flex items-center gap-2.5 w-full max-w-[200px]">
        <span className="font-mono text-[8px] text-slate-450 font-bold uppercase shrink-0">{label}</span>
        <div className="w-full h-1 rounded bg-slate-950/60 border border-white/5 relative overflow-hidden">
          <div
            className={`h-full duration-150 transition-all rounded-sm ${alertPulse ? 'bg-red-500 animate-pulse' : ''}`}
            style={{
              width: `${percent}%`,
              backgroundColor: alertPulse ? '#ef4444' : color,
              boxShadow: alertPulse ? '0 0 6px #ef4444' : `0 0 4px ${color}`
            }}
          />
        </div>
        <span className={`font-mono text-[9px] font-bold shrink-0 ${alertPulse ? 'text-red-400 animate-pulse font-black' : 'text-white'}`}>
          {currentVal}%
        </span>
      </div>
    );
  }

  return (
    <div className="pointer-events-auto bg-[#030712]/95 border border-white/10 rounded-xl p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1 w-full max-w-[200px] transition-all duration-300">
      <div className="flex justify-between items-center text-[9.5px] font-mono text-slate-300">
        <span className="flex items-center gap-1 font-semibold text-slate-200">
          <Flame className={`w-3.5 h-3.5 ${alertPulse ? 'text-rose-500 animate-bounce' : 'text-cyan-400'}`} /> {label}
        </span>
        <span className={`font-bold ${alertPulse ? 'text-red-400 animate-pulse font-black' : 'text-slate-100'}`}>
          {currentVal} / {maxVal} {gameMode === 'nexus_assault' ? 'HP' : '%'}
        </span>
      </div>
      <div className="w-full h-1.5 rounded bg-slate-950/60 border border-white/5 relative overflow-hidden">
        <div
          className={`h-full duration-150 transition-all rounded-sm ${alertPulse ? 'bg-red-500 animate-pulse' : ''}`}
          style={{
            width: `${percent}%`,
            backgroundColor: alertPulse ? '#ef4444' : color,
            boxShadow: alertPulse ? '0 0 8px #ef4444' : `0 0 6px ${color}`
          }}
        />
      </div>
      <div className="font-mono text-[7.5px] uppercase text-right tracking-wider text-slate-500 mt-0.5 leading-none">
        {alertPulse ? '⚠ CRÍTICO - EXPULSIÓN INMINENTE' : 'SISTEMA INTEGRADO ESTABLE'}
      </div>
    </div>
  );
};

interface OrbiModeStagePanelProps {
  gameMode: string;
  state: any;
  hudMode: 'full' | 'compact';
}

const OrbiModeStagePanel: React.FC<OrbiModeStagePanelProps> = ({ gameMode, state, hudMode }) => {
  let modeTitle = 'NEXUS SERPENT';
  let stageLabel = 'SALA / ARENA';
  let statusLabel = 'EN COMBATE';
  let statusColor = 'text-amber-400';
  let accentBorder = 'border-cyan-500/20';

  if (gameMode === 'demo') {
    modeTitle = 'RED VITAL';
    stageLabel = 'SECTOR CENTRAL';
    const sentinelActive = state.sentinel && !state.sentinel.defeated;
    statusLabel = sentinelActive ? '⚠ SENTINEL DETECTADO' : '✓ RED SANA';
    statusColor = sentinelActive ? 'text-red-400 animate-pulse font-black' : 'text-emerald-400';
    accentBorder = 'border-cyan-500/20';
  } else if (gameMode === 'infinite') {
    modeTitle = 'SUPERVIVENCIA NEXUS';
    stageLabel = 'ARENA INFINITA';
    statusLabel = state.survival?.activeBlackoutEvent ? '☠ EVENTO ESCALANDO' : 'Resistiendo';
    statusColor = state.survival?.activeBlackoutEvent ? 'text-rose-400 animate-pulse font-black' : 'text-purple-400';
    accentBorder = 'border-purple-500/20';
  } else if (gameMode === 'nexus_assault') {
    modeTitle = 'NEXUS ASSAULT';
    stageLabel = `SALA ${state.assaultRun ? state.assaultRun.roomIndex + 1 : 1}`;
    const cleared = state.assaultRun?.roomCleared;
    statusLabel = cleared ? '✓ SALA DESPEJADA' : '⚔ EN COMBATE';
    statusColor = cleared ? 'text-emerald-400 animate-pulse' : 'text-amber-400';
    accentBorder = 'border-amber-500/20';
  } else if (gameMode === 'vital_flow') {
    modeTitle = 'VITAL FLOW';
    if (state && state.vitalFlow) {
      const stage = getVitalFlowEvolutionStage(state.vitalFlow.pickupsCollected);
      stageLabel = getVitalFlowEvolutionLabel(stage, state.vitalFlow.pickupsCollected);
      const coreCount = getVitalFlowVisibleInternalCoreCount(stage, state.vitalFlow.pickupsCollected);
      statusLabel = `● ${coreCount} NÚCLEOS`;
    } else {
      stageLabel = 'PROTO DE FLUJO CLÁSICO';
      statusLabel = '● ESTABLE';
    }
    statusColor = 'text-emerald-400 font-bold';
    accentBorder = 'border-emerald-500/20';
  }

  let evolutionSection = null;
  let compactEvolutionSection = null;

  if (ENABLE_EVOLUTION_ENERGY_HUD && state && state.player) {
    const p = state.player;
    
    // Calculate current evolutionEnergy dynamically
    let currentEvolutionEnergy = p.evolutionEnergy || 0;
    if (gameMode === 'infinite') {
      currentEvolutionEnergy = (p.pickupEvolutionEnergy || 0) + Math.floor((state.timeElapsed || 0) / 15);
    } else if (gameMode === 'vital_flow') {
      currentEvolutionEnergy = state.vitalFlow ? state.vitalFlow.pickupsCollected : 0;
    } else {
      currentEvolutionEnergy = p.pickupEvolutionEnergy || 0;
    }

    let modeKey: "red_vital" | "survival_nexus" | "vital_flow" | "nexus_assault" = "red_vital";
    if (gameMode === 'vital_flow') modeKey = "vital_flow";
    else if (gameMode === 'infinite') modeKey = "survival_nexus";
    else if (gameMode === 'nexus_assault') modeKey = "nexus_assault";

    const progress = getEvolutionProgressForMode({
      mode: modeKey,
      evolutionEnergy: currentEvolutionEnergy,
      pickupsCollected: state.vitalFlow ? state.vitalFlow.pickupsCollected : 0,
      elapsedTime: state.timeElapsed || 0
    });

    const isMax = progress.isMaxStage;
    const labelTitle = gameMode === 'vital_flow' ? 'Esencias' : (gameMode === 'infinite' ? 'Progreso' : 'Energía');
    const nextLabel = progress.isMaxStage ? "" : `E${progress.stage + 1}`;

    // Full mode representation
    evolutionSection = (
      <div className="flex flex-col gap-1 border-t border-white/5 pt-2 mt-2 font-mono text-[9px] w-full">
        <div className="flex justify-between font-bold text-slate-300">
          <span>FASE E{progress.stage} — {progress.label.replace("E" + progress.stage + " — ", "")}</span>
        </div>
        <div className="flex justify-between items-center text-slate-400 mt-0.5">
          <span>{labelTitle}: <strong className="text-white">{currentEvolutionEnergy}</strong> / {progress.isMaxStage ? 'MAX' : progress.nextRequired}</span>
          {!isMax && <span className="text-slate-500">Próxima: {nextLabel}</span>}
          {isMax && <span className="text-emerald-400 font-bold">MÁXIMO</span>}
        </div>
        {!isMax && (
          <div className="w-full bg-slate-950/80 rounded-full h-1 mt-1 overflow-hidden border border-white/5">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progress.progressToNext}%` }}
            />
          </div>
        )}
      </div>
    );

    // Compact mode representation
    compactEvolutionSection = (
      <>
        <span className="text-slate-550">|</span>
        <span className="text-emerald-400 font-black px-1 rounded bg-emerald-950/40 border border-emerald-500/15">
          E{progress.stage} · {currentEvolutionEnergy}/{progress.isMaxStage ? '★' : progress.nextRequired}
        </span>
      </>
    );
  }

  if (hudMode === 'compact') {
    return (
      <div className={`bg-[#030712]/90 border ${accentBorder} rounded-xl px-3.5 py-1.5 backdrop-blur-md shadow-xl flex items-center gap-2.5 font-mono text-[9px] pointer-events-auto`}>
        <span className="font-display font-black text-white">{modeTitle}</span>
        <span className="text-slate-550">|</span>
        <span className="text-slate-300 font-bold">{stageLabel}</span>
        {compactEvolutionSection}
        <span className="text-slate-550">|</span>
        <span className={`${statusColor} font-black uppercase`}>{statusLabel}</span>
      </div>
    );
  }

  return (
    <div className={`bg-[#030712]/90 border ${accentBorder} rounded-xl px-4 py-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-0.5 min-w-[180px] pointer-events-auto`}>
      <span className="font-mono text-[7.5px] text-slate-500 uppercase tracking-widest leading-none">MODO ACTIVO</span>
      <h3 className="font-display font-black text-xs text-white tracking-wide uppercase leading-tight mt-1">
        {modeTitle}
      </h3>
      <div className="flex justify-between items-center border-t border-white/5 pt-1 mt-1 font-mono text-[9px]">
        <span className="text-slate-400">{stageLabel}</span>
        <span className={`${statusColor} font-bold uppercase`}>{statusLabel}</span>
      </div>
      {evolutionSection}
    </div>
  );
};

interface OrbiResourcePanelProps {
  gameMode: string;
  stats: GameStats;
  state: any;
  bestVitalFlowTime: number;
  bestVitalFlowScore: number;
  bestVitalFlowLength: number;
  bestVitalFlowPickups: number;
  bestSurvivalTime: number;
  bestSurvivalScore: number;
  hudMode: 'full' | 'compact';
}

const OrbiResourcePanel: React.FC<OrbiResourcePanelProps> = ({
  gameMode,
  stats,
  state,
  bestVitalFlowTime,
  bestVitalFlowScore,
  bestSurvivalTime,
  bestSurvivalScore,
  hudMode
}) => {
  const isVitalFlow = gameMode === 'vital_flow';

  let accentBorder = 'border-cyan-500/20';
  let accentGlow = 'rgba(6,182,212,0.1)';

  if (gameMode === 'infinite') {
    accentBorder = 'border-purple-500/20';
    accentGlow = 'rgba(168,85,247,0.1)';
  } else if (gameMode === 'nexus_assault') {
    accentBorder = 'border-amber-500/20';
    accentGlow = 'rgba(245,158,11,0.1)';
  } else if (gameMode === 'vital_flow') {
    accentBorder = 'border-emerald-500/20';
    accentGlow = 'rgba(16,185,129,0.1)';
  }

  let score = stats.score;
  let record = stats.highScore;
  let secondValue: React.ReactNode = null;
  let secondLabel = 'CÉLULAS';

  if (isVitalFlow && state.vitalFlow) {
    score = stats.score;
    record = bestVitalFlowScore;
    secondValue = `${Math.floor(stats.length)}`;
    secondLabel = 'LONGITUD';
  } else if (gameMode === 'infinite') {
    score = stats.score;
    record = bestSurvivalScore;
    secondValue = `${Math.floor(stats.length)}`;
    secondLabel = 'ESTELA';
  } else if (gameMode === 'nexus_assault') {
    score = stats.score;
    record = stats.highScore;
    secondValue = `${Math.floor(stats.length)}`;
    secondLabel = 'NÚCLEOS';
  } else {
    score = stats.score;
    record = stats.highScore;
    secondValue = `${Math.floor(stats.length)}`;
    secondLabel = 'CÉLULAS';
  }

  let activeTimeLabel = 'TIEMPO';
  let activeTimeValue = '—';
  let bestTimeValue = '—';

  if (isVitalFlow && state.vitalFlow) {
    activeTimeValue = `${state.vitalFlow.elapsedTime.toFixed(1)}s`;
    bestTimeValue = `${bestVitalFlowTime.toFixed(1)}s`;
  } else if (gameMode === 'infinite' && state.survival) {
    const sec = Math.floor(state.survival.elapsedTime ?? 0);
    const mm = Math.floor(sec / 60).toString().padStart(2, '0');
    const ss = (sec % 60).toString().padStart(2, '0');
    activeTimeValue = `${mm}:${ss}`;

    const bSec = Math.floor(bestSurvivalTime);
    const bMm = Math.floor(bSec / 60).toString().padStart(2, '0');
    const bSs = (bSec % 60).toString().padStart(2, '0');
    bestTimeValue = `${bMm}:${bSs}`;
  } else if (gameMode === 'nexus_assault') {
    activeTimeValue = `${(state.assaultRun?.roomClearTimer ?? 0).toFixed(1)}s`;
    bestTimeValue = 'COMBATE';
    activeTimeLabel = 'TIEMPO SALA';
  } else {
    activeTimeValue = 'SANO';
    bestTimeValue = 'ESTABLE';
    activeTimeLabel = 'SISTEMA';
  }

  if (hudMode === 'compact') {
    return (
      <div 
        className={`bg-[#030712]/90 border ${accentBorder} rounded-xl px-3 py-1.5 backdrop-blur-md shadow-xl flex items-center gap-3 font-mono text-[9px] pointer-events-auto w-full max-w-[200px] justify-between`}
        style={{ boxShadow: `0 0 10px ${accentGlow}` }}
      >
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-bold">PTS:</span>
          <span className="font-black text-yellow-400">{score}</span>
        </div>
        <div className="h-2 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-bold">{secondLabel[0]}:</span>
          <span className="font-black text-sky-400">{secondValue}</span>
        </div>
        <div className="h-2 w-[1px] bg-white/10" />
        <div className="flex items-center gap-1">
          <span className="text-slate-500 font-bold">T:</span>
          <span className="font-black text-emerald-400">{activeTimeValue}</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`bg-[#030712]/90 border ${accentBorder} rounded-xl p-2.5 backdrop-blur-md shadow-2xl grid grid-cols-2 gap-2 w-full max-w-[200px] transition-all duration-300 pointer-events-auto`}
      style={{ boxShadow: `0 0 15px ${accentGlow}` }}
    >
      <div className="flex flex-col">
        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider">PUNTOS</span>
        <span className="text-xs font-mono font-black text-yellow-400 leading-none mt-0.5">{score}</span>
        <span className="text-[7px] font-mono text-slate-550 mt-0.5 truncate">MÁX: {record}</span>
      </div>

      <div className="flex flex-col border-l border-white/5 pl-2">
        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider">{secondLabel}</span>
        <span className="text-xs font-mono font-black text-sky-400 leading-none mt-0.5">{secondValue}</span>
        <span className="text-[7px] font-mono text-slate-550 mt-0.5 truncate">MÁX REG: {record}</span>
      </div>

      <div className="flex flex-col border-t border-white/5 pt-1.5 mt-0.5">
        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider">{activeTimeLabel}</span>
        <span className="text-xs font-mono font-black text-emerald-400 leading-none mt-0.5">{activeTimeValue}</span>
      </div>

      <div className="flex flex-col border-t border-l border-white/5 pt-1.5 pl-2 mt-0.5">
        <span className="text-[7.5px] font-mono text-slate-500 uppercase tracking-wider">MÁX R. TIEMPO</span>
        <span className="text-xs font-mono font-black text-slate-300 leading-none mt-0.5 truncate">{bestTimeValue}</span>
      </div>
    </div>
  );
};

interface OrbiThreatPanelProps {
  gameMode: string;
  state: any;
  hudMode: 'full' | 'compact';
  getSurvivalDifficultyProfile: (time: number) => any;
}

const OrbiThreatPanel: React.FC<OrbiThreatPanelProps> = ({ gameMode, state, hudMode, getSurvivalDifficultyProfile }) => {
  if (hudMode === 'compact') return null;

  let threatLevel = 0;
  let threatLabel = 'NIVEL 0: SEGURO';
  let threatColor = 'text-green-400 bg-green-950/40 border border-green-500/20';
  let activeEventLabel = '';
  let activeEventDesc = '';
  let accentBorder = 'border-cyan-500/20';

  if (gameMode === 'demo') {
    threatLevel = state.threatLevel ?? 0;
    accentBorder = 'border-cyan-500/20';
    if (threatLevel === 1) {
      threatLabel = 'NIVEL 1: BAJO';
      threatColor = 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/20';
    } else if (threatLevel === 2) {
      threatLabel = 'NIVEL 2: ALTO';
      threatColor = 'text-amber-400 bg-amber-950/40 border border-amber-500/20';
    } else if (threatLevel === 3) {
      threatLabel = 'NIVEL 3: CRÍTICO';
      threatColor = 'text-rose-400 bg-rose-950/45 border border-rose-500/25';
    }
    if (state.surgeActive) {
      activeEventLabel = 'BLACKOUT SURGE';
      activeEventDesc = `Invasión de fragmentos en curso: ${Math.ceil(state.surgeTimer)}s`;
    }
  } else if (gameMode === 'infinite') {
    accentBorder = 'border-purple-500/20';
    const diff = getSurvivalDifficultyProfile(state.survival?.elapsedTime ?? 0);
    threatLevel = state.threatLevel ?? 0;
    threatLabel = `AMENAZA ${diff.romanTier}`;
    threatColor = 'text-purple-400 bg-purple-950/40 border border-purple-500/20';
    if (state.survival?.activeBlackoutEvent) {
      activeEventLabel = state.survival.activeBlackoutEvent.label;
      activeEventDesc = state.survival.activeBlackoutEvent.description;
    }
  } else if (gameMode === 'nexus_assault') {
    accentBorder = 'border-amber-500/20';
    threatLevel = state.assaultRun?.currentBoss ? 3 : 1;
    threatLabel = state.assaultRun?.currentBoss ? 'AMENAZA CRÍTICA' : 'SALA ESTABLE';
    threatColor = state.assaultRun?.currentBoss 
      ? 'text-red-400 bg-red-950/40 border border-red-500/20 animate-pulse'
      : 'text-amber-400 bg-amber-950/40 border border-amber-500/20';
  } else if (gameMode === 'vital_flow') {
    accentBorder = 'border-emerald-500/20';
    threatLevel = 0;
    threatLabel = 'ESTABLE (OK)';
    threatColor = 'text-emerald-400 bg-emerald-950/40 border border-emerald-500/20';
  } else {
    return null;
  }

  return (
    <div className={`bg-[#030712]/90 border ${accentBorder} rounded-xl p-2 w-full max-w-[200px] backdrop-blur-md shadow-2xl flex flex-col gap-1.5 pointer-events-auto`}>
      <div className="flex justify-between items-center gap-1.5">
        <span className="font-mono text-[7.5px] text-slate-500 uppercase tracking-widest">AMENAZA</span>
        <span className={`font-mono text-[8px] font-black px-1.5 py-0.5 rounded uppercase leading-none ${threatColor}`}>
          {threatLabel}
        </span>
      </div>

      {activeEventLabel && (
        <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-1.5 flex flex-col gap-0.5 animate-pulse">
          <span className="font-mono text-[8px] font-black text-rose-450 uppercase leading-none">
            {activeEventLabel}
          </span>
          <p className="text-[7.5px] font-mono text-slate-400 leading-normal">
            {activeEventDesc}
          </p>
        </div>
      )}
    </div>
  );
};

interface OrbiSynergyPanelProps {
  stateRef: React.MutableRefObject<any>;
  hudMode: 'full' | 'compact';
}

const OrbiSynergyPanel: React.FC<OrbiSynergyPanelProps> = ({ stateRef, hudMode }) => {
  if (hudMode === 'compact') return null;

  const assaultRun = stateRef.current.assaultRun;
  if (!assaultRun) return null;

  return (
    <div className="bg-[#030712]/90 border border-amber-500/20 rounded-xl p-2.5 backdrop-blur-md shadow-2xl flex flex-col gap-1.5 w-36 sm:w-44 max-w-xs transition-all duration-300 pointer-events-auto">
      <div className="flex items-center justify-between pb-1 border-b border-white/5">
        <span className="text-[8.5px] font-mono text-amber-400 font-black uppercase tracking-wider">NÚCLEOS EQUIPADOS</span>
        <span className="text-[8px] font-mono text-slate-550">({assaultRun.modules.length}/8)</span>
      </div>
      
      {assaultRun.modules.length === 0 ? (
        <span className="text-[8px] font-mono text-slate-600 italic">No hay núcleos equipados</span>
      ) : (
        <div className="flex flex-col gap-1 max-h-[110px] overflow-y-auto pr-0.5">
          {assaultRun.modules.map((mod: any) => {
            const colorMap: Record<string, string> = {
              foton: 'text-amber-400',
              hydro: 'text-cyan-400',
              aero: 'text-emerald-300',
              termo: 'text-orange-500',
              terra: 'text-orange-500'
            };
            const rarityBg: Record<string, string> = {
              common: 'border-slate-800 bg-slate-950/40 text-slate-400',
              rare: 'border-cyan-500/20 bg-cyan-950/20 text-cyan-400',
              epic: 'border-purple-500/30 bg-purple-950/20 text-purple-400'
            };
            return (
              <div key={mod.id} className="flex flex-col gap-0.5 p-1 rounded bg-slate-950/50 border border-white/5">
                <div className="flex justify-between items-center gap-1">
                  <span className={`text-[8.5px] font-mono font-bold leading-tight ${colorMap[mod.element] || 'text-white'} truncate max-w-[70px]`}>
                    {mod.name}
                  </span>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <span className={`text-[7px] font-mono font-black uppercase px-0.5 rounded border ${rarityBg[mod.rarity] || rarityBg.common}`}>
                      {mod.rarity[0]}
                    </span>
                    <span className="text-[8px] font-mono text-white font-black bg-slate-800/80 px-0.5 rounded">
                      L{mod.level}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="flex flex-col gap-0.5 mt-1 pt-1 border-t border-white/5">
        <span className="text-[8px] font-mono text-slate-500 font-bold uppercase tracking-widest">SINERGIAS ACTIVAS</span>
        {!assaultRun.synergiesActive || assaultRun.synergiesActive.length === 0 ? (
          <span className="text-[7.5px] font-mono text-slate-600 italic">Sinergias inactivas</span>
        ) : (
          <div className="flex flex-wrap gap-0.5">
            {assaultRun.synergiesActive.map((synId: string) => {
              const namesMap: Record<string, string> = {
                prisma_solar: "PRISMA",
                tormenta_radiante: "TORMENTA",
                monzon_nexus: "MONZÓN",
                guardian_current: "GUARDIAN"
              };
              return (
                <span 
                  key={synId} 
                  className="text-[7px] font-mono font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 rounded px-1 py-0.5 uppercase tracking-wide animate-pulse"
                >
                  {namesMap[synId] || synId.toUpperCase()}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

interface OrbiRadarPanelProps {
  stateRef: React.MutableRefObject<any>;
  gameMode: string;
  hudMode: 'full' | 'compact';
}

const OrbiRadarPanel: React.FC<OrbiRadarPanelProps> = ({ stateRef, gameMode, hudMode }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animFrameId: number;

    const renderRadar = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        animFrameId = requestAnimationFrame(renderRadar);
        return;
      }
      const ctx = canvas.getContext('2d');
      const core = stateRef.current;
      if (!ctx || !core || !core.player) {
        animFrameId = requestAnimationFrame(renderRadar);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const player = core.player;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radarRadius = canvas.width / 2 - 6;

      // Draw grid circle background
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(3, 7, 18, 0.65)';
      ctx.fill();
      ctx.lineWidth = 1.2;

      // Border color based on mode
      let borderColor = 'rgba(34, 211, 238, 0.45)';
      if (gameMode === 'infinite') borderColor = 'rgba(168, 85, 247, 0.45)';
      else if (gameMode === 'nexus_assault') borderColor = 'rgba(245, 158, 11, 0.45)';
      else if (gameMode === 'vital_flow') borderColor = 'rgba(16, 185, 129, 0.45)';

      ctx.strokeStyle = borderColor;
      ctx.stroke();

      // Draw concentric radar sweeps/rings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radarRadius * 0.4, 0, Math.PI * 2);
      ctx.arc(centerX, centerY, radarRadius * 0.7, 0, Math.PI * 2);
      ctx.stroke();

      // Draw crosshair axes
      ctx.beginPath();
      ctx.moveTo(centerX - radarRadius, centerY);
      ctx.lineTo(centerX + radarRadius, centerY);
      ctx.moveTo(centerX, centerY - radarRadius);
      ctx.lineTo(centerX, centerY + radarRadius);
      ctx.stroke();

      const isVitalFlowRadar = gameMode === 'vital_flow' && ENABLE_VITAL_FLOW_FULL_MAP_RADAR;

      if (isVitalFlowRadar) {
        // --- NEW MAP COVERAGE RADAR FOR VITAL FLOW (MÓDULO 5R.2B) ---
        const getRadarVitalFlowBounds = (c: any) => {
          if (c.vitalFlow?.arenaBounds) return c.vitalFlow.arenaBounds;
          const marginX = 90;
          const marginTop = 150;
          const marginBottom = 90;
          const w = c.dimensions?.width || 1200;
          const h = c.dimensions?.height || 800;
          const baseWidth = w - marginX * 2;
          const baseHeight = h - (marginTop + marginBottom);
          let playWidth = baseWidth * 2;
          let playHeight = baseHeight * 2;
          if (ENABLE_VITAL_FLOW_ARENA_SCALE_FIX) {
            playWidth *= VITAL_FLOW_ARENA_SCALE;
            playHeight *= VITAL_FLOW_ARENA_SCALE;
          }
          const cX = 1425;
          const cY = 1425;
          return {
            left: cX - playWidth / 2,
            right: cX + playWidth / 2,
            top: cY - playHeight / 2,
            bottom: cY + playHeight / 2,
            width: playWidth,
            height: playHeight,
            centerX: cX,
            centerY: cY
          };
        };

        const bounds = getRadarVitalFlowBounds(core);

        const mapWorldToRadar = (wx: number, wy: number) => {
          const padding = 6;
          const rw = canvas.width - padding * 2;
          const rh = canvas.height - padding * 2;
          const px = padding + ((wx - bounds.left) / bounds.width) * rw;
          const py = padding + ((wy - bounds.top) / bounds.height) * rh;
          return { x: px, y: py };
        };

        // Clip rendering inside radar boundary
        ctx.beginPath();
        ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
        ctx.clip();

        // 1. Draw outer boundary rectangle of the arena
        const tl = mapWorldToRadar(bounds.left, bounds.top);
        const br = mapWorldToRadar(bounds.right, bounds.bottom);
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.strokeRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
        ctx.setLineDash([]);

        // 2. Draw body segments (simplified path connecting them)
        if (player.segments && player.segments.length > 0) {
          ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          const first = mapWorldToRadar(player.x, player.y);
          ctx.moveTo(first.x, first.y);
          player.segments.forEach((seg: any, idx: number) => {
            if (idx % 3 === 0 || idx === player.segments.length - 1) {
              const pt = mapWorldToRadar(seg.x, seg.y);
              ctx.lineTo(pt.x, pt.y);
            }
          });
          ctx.stroke();
        }

        // 3. Draw pickups
        if (core.vitalFlow && core.vitalFlow.pickups) {
          core.vitalFlow.pickups.forEach((pItem: any) => {
            const pt = mapWorldToRadar(pItem.x, pItem.y);
            const isSolar = pItem.kind === 'solar_orb';
            const pColor = isSolar ? '#fbbf24' : '#10b981';
            
            // Draw pulsing outer ring for the primary pickup
            const alpha = 0.45 + Math.sin(Date.now() * 0.008) * 0.25;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = pColor;
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, isSolar ? 4 : 5.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Solid center
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
          });
        }

        // 4. Draw player head (moving spot)
        const pPt = mapWorldToRadar(player.x, player.y);
        ctx.beginPath();
        ctx.arc(pPt.x, pPt.y, 3.8, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      } else {
        // Collect elements
        const items: any[] = [];
        let worldRange = 500; 
        if (gameMode === 'vital_flow') worldRange = 350;
        else if (gameMode === 'nexus_assault') worldRange = 600;

        const scale = radarRadius / worldRange;

        // 1. Pickups
        if (gameMode === 'vital_flow') {
          if (core.vitalFlow && core.vitalFlow.pickups) {
            core.vitalFlow.pickups.forEach((p: any) => {
              items.push({ x: p.x, y: p.y, color: '#10b981', size: 3, type: 'pickup' });
            });
          }
        } else {
          if (core.orbs) {
            core.orbs.forEach((o: any) => {
              if (!o.collected) {
                let color = '#fbbf24';
                if (o.type === 'NEXUS') color = '#20d6ff';
                else if (o.type === 'BLACKOUT') color = '#a855f7';
                items.push({ x: o.x, y: o.y, color, size: 2.5, type: 'pickup' });
              }
            });
          }
        }

        // 2. Enemies / Bosses / Hazards
        if (gameMode === 'infinite' && core.survival) {
          if (core.survival.antiSerpents) {
            core.survival.antiSerpents.forEach((s: any) => {
              if (s.alive) {
                items.push({
                  x: s.x,
                  y: s.y,
                  color: s.isAlpha ? '#f43f5e' : '#ec4899',
                  size: s.isAlpha ? 5 : 3.5,
                  type: s.isAlpha ? 'alpha' : 'enemy',
                  pulse: s.isAlpha
                });
              }
            });
          }
          if (core.survival.hazards) {
            core.survival.hazards.forEach((h: any) => {
              items.push({ x: h.x, y: h.y, color: '#ec4899', size: 4, type: 'hazard' });
            });
          }
        } else if (gameMode === 'nexus_assault' && core.assaultRun) {
          if (core.assaultRun.enemies) {
            core.assaultRun.enemies.forEach((e: any) => {
              if (e.health > 0) {
                items.push({ x: e.x, y: e.y, color: '#f43f5e', size: 3, type: 'enemy' });
              }
            });
          }
          if (core.assaultRun.currentBoss && core.assaultRun.currentBoss.health > 0) {
            const b = core.assaultRun.currentBoss;
            items.push({ x: b.x, y: b.y, color: '#ef4444', size: 6, type: 'boss', pulse: true });
          }
        } else if (gameMode === 'demo') {
          if (core.corruptionZones) {
            core.corruptionZones.forEach((cz: any) => {
              if (cz.active) {
                items.push({ x: cz.x, y: cz.y, color: '#ef4444', size: 5.5, type: 'corruption_zone', pulse: true });
              }
            });
          }
          if (core.sentinel && !core.sentinel.defeated) {
            items.push({ x: core.sentinel.x, y: core.sentinel.y, color: '#ef4444', size: 6, type: 'boss', pulse: true });
          }
        }

        // Clip rendering inside radar boundary
        ctx.beginPath();
        ctx.arc(centerX, centerY, radarRadius, 0, Math.PI * 2);
        ctx.clip();

        // Plot items relative to player
        items.forEach(item => {
          const dx = item.x - player.x;
          const dy = item.y - player.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > worldRange) return;

          const rx = centerX + dx * scale;
          const ry = centerY + dy * scale;

          ctx.beginPath();
          ctx.arc(rx, ry, item.size, 0, Math.PI * 2);
          
          if (item.pulse) {
            const alpha = 0.5 + Math.sin(Date.now() * 0.01) * 0.3;
            ctx.fillStyle = item.color;
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.arc(rx, ry, item.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          } else {
            ctx.fillStyle = item.color;
            ctx.fill();
          }
        });

        // Draw player in the center
        ctx.beginPath();
        ctx.arc(centerX, centerY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
      }

      animFrameId = requestAnimationFrame(renderRadar);
    };

    animFrameId = requestAnimationFrame(renderRadar);
    return () => cancelAnimationFrame(animFrameId);
  }, [gameMode, stateRef]);

  const sizeClass = hudMode === 'compact' ? 'w-24 h-24' : 'w-32 h-32';
  const containerSize = hudMode === 'compact' ? 96 : 128;

  let accentBorder = 'border-cyan-500/20';
  let accentGlow = 'rgba(6,182,212,0.15)';
  if (gameMode === 'infinite') {
    accentBorder = 'border-purple-500/20';
    accentGlow = 'rgba(168,85,247,0.15)';
  } else if (gameMode === 'nexus_assault') {
    accentBorder = 'border-amber-500/20';
    accentGlow = 'rgba(245,158,11,0.15)';
  } else if (gameMode === 'vital_flow') {
    accentBorder = 'border-emerald-500/20';
    accentGlow = 'rgba(16,185,129,0.15)';
  }

  return (
    <div 
      className={`bg-[#030712]/90 border ${accentBorder} rounded-xl p-2.5 backdrop-blur-md flex flex-col items-center gap-1.5 shadow-2xl transition-all duration-300 pointer-events-auto w-36 sm:w-44`}
      style={{ boxShadow: `0 0 20px ${accentGlow}` }}
    >
      <span className="text-[8.5px] font-mono text-slate-450 font-bold uppercase tracking-widest leading-none">
        RADAR TÁCTICO
      </span>
      <div className={`relative ${sizeClass} flex items-center justify-center overflow-hidden rounded-full`}>
        <canvas ref={canvasRef} width={containerSize} height={containerSize} className={sizeClass} />
      </div>
      {hudMode !== 'compact' && (
        <div className="flex flex-col gap-0.5 w-full text-[7.5px] font-mono text-slate-500 mt-1 px-1 leading-none">
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-sky-400" />ORBI</span>
            <span className="flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${
                gameMode === 'vital_flow' ? 'bg-[#10b981]' : 'bg-[#f43f5e]'
              }`} />
              {gameMode === 'vital_flow' ? 'ESENCIA' : 'HOSTIL'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />SOLAR</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]" />NEXUS</span>
          </div>
        </div>
      )}
    </div>
  );
};

const ENABLE_VITAL_FLOW_DIMENSIONING_RULES = true;
const ENABLE_VITAL_FLOW_CORE_VISUAL_RULES = true;
const ENABLE_VITAL_FLOW_FOTON_GREEN_OVERRIDE = true;
const ENABLE_SERPENT_VISUAL_POLISH_5R3B = true;
const ENABLE_CANONICAL_SERPENT_EVOLUTION_MODEL = true;
const ENABLE_ENERGY_SCALE_SKIN_PATTERN = true;
const ENABLE_ORBITAL_CORE_RINGS = true;
const ENABLE_SOLID_TAIL_TERMINAL_NODE = true;
const ENABLE_ASSAULT_ELEMENTAL_CORE_COLORS = true;

// SAFETY GLOBAL EVOLUTION AND SMOOTHING SAFETY FLAGS (MÓDULO 5R.2A)
const ENABLE_GLOBAL_SERPENT_EVOLUTION_SCALE_FIX = true;
const ENABLE_SERPENT_VISUAL_SMOOTHING = true;
const ENABLE_EXACT_INTERNAL_CORE_STAGE_COUNTS = true;

// EVOLUTION PACING AND RADAR REBALANCE FLAGS & CONSTANTS (MÓDULO 5R.2B)
const ENABLE_EVOLUTION_PACING_REBALANCE = true;
const ENABLE_INTERNAL_CORE_SPACING_FIX = true;
const ENABLE_VITAL_FLOW_ARENA_SCALE_FIX = true;
const ENABLE_VITAL_FLOW_FULL_MAP_RADAR = true;
const ENABLE_EVOLUTION_ENERGY_HUD = true;

const INTERNAL_CORE_MIN_GAP_SEGMENTS = 2;
const INTERNAL_CORE_RADIUS_MULTIPLIER = 0.88; // 12% reduction
const INTERNAL_CORE_GLOW_MULTIPLIER = 0.85;   // 15% reduction
const VITAL_FLOW_ARENA_SCALE = 0.46875; // QA-01E: 25% larger dimensions than QA-01D (still 37.5% smaller than original)

type OrbiEvolutionEnergySource = 'solar_orb' | 'nexus_core' | 'vital_essence' | 'minor_energy' | 'assault_core';

function getEvolutionEnergyValue(source: OrbiEvolutionEnergySource): number {
  switch (source) {
    case 'solar_orb': return 1;
    case 'nexus_core': return 3;
    case 'vital_essence': return 1;
    case 'minor_energy': return 0.5;
    case 'assault_core': return 2;
    default: return 1;
  }
}

interface EvolutionThreshold {
  stage: number;
  required: number;
  label: string;
}

const RED_VITAL_EVOLUTION_THRESHOLDS: EvolutionThreshold[] = [
  { stage: 1, required: 0, label: "E1 — Baby Core" },
  { stage: 2, required: 2, label: "E2 — Proto Orb" },
  { stage: 3, required: 8, label: "E3 — Proto Serpent" },
  { stage: 4, required: 16, label: "E4 — Young Foton" },
  { stage: 5, required: 28, label: "E5 — Ascendant Foton" },
  { stage: 6, required: 44, label: "E6 — Guardian Foton" },
  { stage: 7, required: 64, label: "E7 — Elite Foton" },
  { stage: 8, required: 90, label: "E8 — Orbi Nexus Serpent" }
];

const RED_VITAL_EVOLUTION_LOCKED_THRESHOLDS = [
  { stage: 1, requiredEnergy: 0, coreCount: 1, label: "E1 — Baby Serpent" },
  { stage: 2, requiredEnergy: 3, coreCount: 2, label: "E2 — Proto Orb" },
  { stage: 3, requiredEnergy: 8, coreCount: 3, label: "E3 — Proto Serpent" },
  { stage: 4, requiredEnergy: 16, coreCount: 4, label: "E4 — Young Foton" },
  { stage: 5, requiredEnergy: 28, coreCount: 5, label: "E5 — Ascendant Foton" },
  { stage: 6, requiredEnergy: 44, coreCount: 6, label: "E6 — Guardian Foton" },
  { stage: 7, requiredEnergy: 64, coreCount: 7, label: "E7 — Elite Foton" },
  { stage: 8, requiredEnergy: 90, coreCount: 8, label: "E8 — Orbi Nexus Serpent" }
];

const ENABLE_ORBI_COUNTDOWN_VOICE = false;
const ORBI_COUNTDOWN_AUDIO_PRESET = "orbi_soft_futuristic_launch";

function getRedVitalLockedEvolutionState(evolutionEnergy: number) {
  const thresholds = RED_VITAL_EVOLUTION_LOCKED_THRESHOLDS;
  let current = thresholds[0];
  let next = thresholds[1];

  for (let i = 0; i < thresholds.length; i++) {
    if (evolutionEnergy >= thresholds[i].requiredEnergy) {
      current = thresholds[i];
      next = thresholds[i + 1] ?? null;
    }
  }

  return {
    stage: current.stage,
    coreCount: current.coreCount,
    label: current.label,
    currentRequired: current.requiredEnergy,
    nextRequired: next?.requiredEnergy ?? current.requiredEnergy,
    remainingToNext: next ? Math.max(0, next.requiredEnergy - evolutionEnergy) : 0,
    progressToNext: next
      ? Math.min(1, (evolutionEnergy - current.requiredEnergy) / (next.requiredEnergy - current.requiredEnergy))
      : 1,
    isMaxStage: !next
  };
}

function getRedVitalEvolutionEnergyValue(pickupType: string): number {
  switch (pickupType) {
    case "minor_energy":
    case "solar_orb":
    case "energy_orb":
    case "foton_orb":
    case "SOLAR":
      return 1;

    case "major_energy":
    case "nexus_core":
    case "rare_energy":
    case "NEXUS":
      return 2;

    default:
      return 1;
  }
}

function playOrbiCountdownCue(step: "ready" | "3" | "2" | "1" | "go", mode: GameMode) {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  
  const engine = synthEngineInstance;
  if (!engine.enabled) return;
  
  try {
    (engine as any).init();
  } catch (err) {}
  
  const ctx = (engine as any).ctx;
  if (!ctx) return;
  
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const t = ctx.currentTime;
  
  const masterVol = 0.24;
  const beepVol = 0.11;
  const padVol = 0.16;
  const chimeVol = 0.12;

  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(masterVol, t);
  masterGain.connect(ctx.destination);

  if (ENABLE_ORBI_COUNTDOWN_VOICE && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      let text = "";
      if (step === "ready") {
        text = mode === "nexus_assault" ? "Enlace de asalto listo" : (mode === "vital_flow" ? "Enlace de flujo listo" : "Enlace Orbi listo");
      } else if (step === "3") {
        text = "Tres";
      } else if (step === "2") {
        text = "Dos";
      } else if (step === "1") {
        text = "Uno";
      } else if (step === "go") {
        text = mode === "nexus_assault" ? "Asalto activo" : "Flujo activo";
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "es-ES";
      utterance.volume = 0.4;
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    } catch (speechErr) {
      console.warn("Speech synthesis failed:", speechErr);
    }
  }

  if (step === "ready") {
    const chords = [110.0, 146.83, 164.81, 220.0];
    chords.forEach(f => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(padVol / chords.length, t + 0.5);
      gain.gain.linearRampToValueAtTime(padVol / chords.length, t + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 2.0);
      
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 2.1);
    });

    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, t);
    subGain.gain.setValueAtTime(0, t);
    subGain.gain.linearRampToValueAtTime(0.15, t + 0.3);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 1.5);
    subOsc.connect(subGain);
    subGain.connect(masterGain);
    subOsc.start(t);
    subOsc.stop(t + 1.6);
  }

  else if (step === "3" || step === "2" || step === "1") {
    const baseFreq = step === "3" ? 146.83 : (step === "2" ? 164.81 : 220.0);
    const harmFreq = baseFreq * 2;
    
    const oscLow = ctx.createOscillator();
    const gainLow = ctx.createGain();
    oscLow.type = 'sine';
    oscLow.frequency.setValueAtTime(baseFreq, t);
    gainLow.gain.setValueAtTime(0, t);
    gainLow.gain.linearRampToValueAtTime(beepVol, t + 0.02);
    gainLow.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    oscLow.connect(gainLow);
    gainLow.connect(masterGain);
    oscLow.start(t);
    oscLow.stop(t + 0.45);

    const oscHarm = ctx.createOscillator();
    const gainHarm = ctx.createGain();
    oscHarm.type = 'sine';
    oscHarm.frequency.setValueAtTime(harmFreq, t);
    gainHarm.gain.setValueAtTime(0, t);
    gainHarm.gain.linearRampToValueAtTime(beepVol * 0.4, t + 0.03);
    gainHarm.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    oscHarm.connect(gainHarm);
    gainHarm.connect(masterGain);
    oscHarm.start(t);
    oscHarm.stop(t + 0.4);
  }

  else if (step === "go") {
    const chords = [220.0, 329.63, 440.0, 659.25, 880.0];
    chords.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      osc.frequency.setValueAtTime(f * 0.98, t + i * 0.03);
      osc.frequency.exponentialRampToValueAtTime(f, t + i * 0.03 + 0.06);
      
      gain.gain.setValueAtTime(0, t + i * 0.03);
      gain.gain.linearRampToValueAtTime(chimeVol, t + i * 0.03 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.03 + 0.8);
      
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t + i * 0.03);
      osc.stop(t + i * 0.03 + 0.9);
    });

    const padFreqs = [110.0, 164.81, 220.0];
    padFreqs.forEach(f => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.06, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.2);
      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 1.3);
    });
  }
}

const SURVIVAL_NEXUS_EVOLUTION_THRESHOLDS: EvolutionThreshold[] = [
  { stage: 1, required: 0, label: "E1 — Baby Core" },
  { stage: 2, required: 3, label: "E2 — Proto Orb" },
  { stage: 3, required: 10, label: "E3 — Proto Serpent" },
  { stage: 4, required: 22, label: "E4 — Young Foton" },
  { stage: 5, required: 40, label: "E5 — Ascendant Foton" },
  { stage: 6, required: 64, label: "E6 — Guardian Foton" },
  { stage: 7, required: 94, label: "E7 — Elite Foton" },
  { stage: 8, required: 130, label: "E8 — Orbi Nexus Serpent" }
];

const VITAL_FLOW_EVOLUTION_THRESHOLDS: EvolutionThreshold[] = [
  { stage: 1, required: 0, label: "E1 — Baby Core" },
  { stage: 2, required: 4, label: "E2 — Proto Orb" },
  { stage: 3, required: 10, label: "E3 — Proto Serpent" },
  { stage: 4, required: 20, label: "E4 — Young Foton" },
  { stage: 5, required: 36, label: "E5 — Ascendant Foton" },
  { stage: 6, required: 58, label: "E6 — Guardian Foton" },
  { stage: 7, required: 86, label: "E7 — Elite Foton" },
  { stage: 8, required: 120, label: "E8 — Orbi Nexus Serpent" }
];

interface EvolutionProgressResult {
  stage: number;
  progressToNext: number; // 0 to 100
  nextRequired: number;
  isMaxStage: boolean;
  label: string;
}

function getEvolutionProgressForMode(params: {
  mode: "red_vital" | "survival_nexus" | "vital_flow" | "nexus_assault";
  evolutionEnergy: number;
  pickupsCollected?: number;
  elapsedTime?: number;
}): EvolutionProgressResult {
  const { mode, evolutionEnergy } = params;
  
  if (mode === 'red_vital') {
    const evo = getRedVitalLockedEvolutionState(evolutionEnergy);
    return {
      stage: evo.stage,
      progressToNext: evo.progressToNext * 100,
      nextRequired: evo.nextRequired,
      isMaxStage: evo.isMaxStage,
      label: evo.label
    };
  }
  
  let thresholds = RED_VITAL_EVOLUTION_THRESHOLDS;
  if (mode === 'survival_nexus') {
    thresholds = SURVIVAL_NEXUS_EVOLUTION_THRESHOLDS;
  } else if (mode === 'vital_flow') {
    thresholds = VITAL_FLOW_EVOLUTION_THRESHOLDS;
  } else if (mode === 'nexus_assault') {
    thresholds = [
      { stage: 1, required: 0, label: "E1 — Baby Core" },
      { stage: 2, required: 15, label: "E2 — Proto Orb" },
      { stage: 3, required: 30, label: "E3 — Proto Serpent" },
      { stage: 4, required: 50, label: "E4 — Young Foton" },
      { stage: 5, required: 70, label: "E5 — Ascendant Foton" },
      { stage: 6, required: 95, label: "E6 — Guardian Foton" },
      { stage: 7, required: 125, label: "E7 — Elite Foton" },
      { stage: 8, required: 160, label: "E8 — Orbi Nexus Serpent" }
    ];
  }

  // Find active stage
  let activeStageIdx = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (evolutionEnergy >= thresholds[i].required) {
      activeStageIdx = i;
    }
  }

  const activeStage = thresholds[activeStageIdx];
  const isMaxStage = activeStageIdx === thresholds.length - 1;

  if (isMaxStage) {
    return {
      stage: activeStage.stage,
      progressToNext: 100,
      nextRequired: activeStage.required,
      isMaxStage: true,
      label: activeStage.label
    };
  }

  const nextStage = thresholds[activeStageIdx + 1];
  const currentRange = nextStage.required - activeStage.required;
  const currentProgress = evolutionEnergy - activeStage.required;
  const pct = currentRange > 0 ? Math.min(100, Math.max(0, (currentProgress / currentRange) * 100)) : 100;

  return {
    stage: activeStage.stage,
    progressToNext: pct,
    nextRequired: nextStage.required,
    isMaxStage: false,
    label: activeStage.label
  };
}

function getSpacedInternalCoreIndices(params: {
  segmentsLength: number;
  desiredCoreCount: number;
  minGapSegments?: number;
}): number[] {
  const { segmentsLength, desiredCoreCount } = params;
  const minGap = params.minGapSegments !== undefined ? params.minGapSegments : 2;
  
  if (desiredCoreCount <= 0 || segmentsLength < 5) return [];

  // Exclude head (indices 0 and 1) and tail (last two indices) to avoid saturation
  const startPadding = 2;
  const endPadding = 2;
  const availableLength = segmentsLength - startPadding - endPadding;

  if (availableLength <= 0) return [];

  // Enforce spacing boundaries
  const maxCores = Math.max(1, Math.floor((availableLength + minGap) / (1 + minGap)));
  const finalCoreCount = Math.min(desiredCoreCount, maxCores);

  if (finalCoreCount <= 0) return [];

  const indices: number[] = [];
  if (finalCoreCount === 1) {
    indices.push(startPadding + Math.floor(availableLength / 2));
  } else {
    const gap = (availableLength - 1) / (finalCoreCount - 1);
    for (let i = 0; i < finalCoreCount; i++) {
      const idx = Math.round(startPadding + i * gap);
      if (idx >= startPadding && idx < segmentsLength - endPadding) {
        if (indices.indexOf(idx) === -1) {
          indices.push(idx);
        }
      }
    }
  }

  return indices;
}

interface OrbiSerpentVisualProfile {
  stage: number;
  label: string;
  headScale: number;
  bodyLengthScale: number;
  thicknessMultiplier: number;
  visibleInternalCoreCount: number;
  tailOrbScale: number;
  glowMultiplier: number;
  trailMultiplier: number;
  orbitRingIntensity: number;
  energyFinIntensity: number;
  particleIntensity: number;
  preservePremiumHeadDetails: boolean;
}

// ==================================================
// OFFICIAL SERPENT VISUAL STANDARD (MÓDULO 5R.3)
// ==================================================

type OrbiSerpentCanonicalProfile = {
  mode: "red_vital" | "survival_nexus" | "nexus_assault" | "vital_flow";
  heroId: string;
  stage: number;

  headScale: number;
  bodyThickness: number;
  bodyLengthVisualScale: number;
  tailOrbScale: number;

  internalCoreCount: number;
  internalCoreSpacingMode: "sparse" | "normal" | "dense";
  internalCoreRadiusScale: number;
  internalCoreGlowScale: number;

  premiumHeadDetails: boolean;
  orbitalRings: boolean;
  stabilizerFins: boolean;
  microSatellite: boolean;

  auraScale: number;
  trailScale: number;
  particleScale: number;

  modeOverlay: "none" | "purification" | "blackout_pressure" | "assault_cores" | "vital_flow_classic";
};

const ORBI_SERPENT_MODE_SCALE_MODIFIERS = {
  red_vital: {
    globalScale: 1.0,
    thicknessScale: 1.0,
    auraScale: 1.0,
    coreDensityScale: 1.0
  },
  survival_nexus: {
    globalScale: 0.96,
    thicknessScale: 0.94,
    auraScale: 0.95,
    coreDensityScale: 0.9
  },
  nexus_assault: {
    globalScale: 0.82,
    thicknessScale: 0.78,
    auraScale: 0.72,
    coreDensityScale: 0.72
  },
  vital_flow: {
    globalScale: 0.95,
    thicknessScale: 0.92,
    auraScale: 0.95,
    coreDensityScale: 0.85
  }
};

type OrbiSerpentEvolutionStage = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

type OrbiSerpentCanonicalStageProfile = {
  stage: OrbiSerpentEvolutionStage;
  label: string;
  coreCount: number;
  lengthScale: number;
  widthScale: number;
  headScale: number;
  tailScale: number;
};

const ORBI_SERPENT_CANONICAL_STAGES: OrbiSerpentCanonicalStageProfile[] = [
  { stage: 1, label: "E1 — Baby Serpent", coreCount: 1, lengthScale: 0.20, widthScale: 0.35, headScale: 0.55, tailScale: 0.55 },
  { stage: 2, label: "E2 — Proto Orb", coreCount: 2, lengthScale: 0.32, widthScale: 0.45, headScale: 0.65, tailScale: 0.65 },
  { stage: 3, label: "E3 — Proto Serpent", coreCount: 3, lengthScale: 0.45, widthScale: 0.56, headScale: 0.74, tailScale: 0.74 },
  { stage: 4, label: "E4 — Young Foton", coreCount: 4, lengthScale: 0.58, widthScale: 0.67, headScale: 0.84, tailScale: 0.84 },
  { stage: 5, label: "E5 — Ascendant Foton", coreCount: 5, lengthScale: 0.72, widthScale: 0.78, headScale: 0.92, tailScale: 0.92 },
  { stage: 6, label: "E6 — Guardian Foton", coreCount: 6, lengthScale: 0.86, widthScale: 0.89, headScale: 1.00, tailScale: 1.00 },
  { stage: 7, label: "E7 — Elite Foton", coreCount: 7, lengthScale: 0.94, widthScale: 0.96, headScale: 1.06, tailScale: 1.06 },
  { stage: 8, label: "E8 — Orbi Nexus Serpent", coreCount: 8, lengthScale: 1.00, widthScale: 1.00, headScale: 1.12, tailScale: 1.12 }
];

function getOrbiSerpentCanonicalStageProfile(stage: number): OrbiSerpentCanonicalStageProfile {
  const safeStage = Math.max(1, Math.min(8, Math.floor(stage))) as OrbiSerpentEvolutionStage;
  return ORBI_SERPENT_CANONICAL_STAGES[safeStage - 1];
}

function getOrbiSerpentCanonicalProfile(params: {
  mode: "red_vital" | "survival_nexus" | "nexus_assault" | "vital_flow";
  heroId: string;
  stage: number;
  evolutionEnergy?: number;
  lengthScore?: number;
  activeCores?: unknown[];
}): OrbiSerpentCanonicalProfile {
  let { mode, heroId, stage } = params;

  if (mode === 'red_vital') {
    const evo = getRedVitalLockedEvolutionState(params.evolutionEnergy ?? 0);
    stage = evo.stage;
  }

  // Seccion 3 Scales:
  let baseHeadScale = 0.62;
  let baseBodyThickness = 0.48;
  let baseTailOrbScale = 0.16;
  let baseInternalCoreCount = 0;

  if (ENABLE_CANONICAL_SERPENT_EVOLUTION_MODEL) {
    const stageProfile = getOrbiSerpentCanonicalStageProfile(stage);
    baseHeadScale = stageProfile.headScale;
    baseBodyThickness = stageProfile.widthScale;
    baseTailOrbScale = stageProfile.tailScale;
    baseInternalCoreCount = mode === 'red_vital' ? getRedVitalLockedEvolutionState(params.evolutionEnergy ?? 0).coreCount : stageProfile.coreCount;
  } else {
    switch (stage) {
      case 1:
        baseHeadScale = 0.62;
        baseBodyThickness = 0.48;
        baseTailOrbScale = 0.16;
        baseInternalCoreCount = 0;
        break;
      case 2:
        baseHeadScale = 0.70;
        baseBodyThickness = 0.56;
        baseTailOrbScale = 0.28;
        baseInternalCoreCount = 1;
        break;
      case 3:
        baseHeadScale = 0.78;
        baseBodyThickness = 0.64;
        baseTailOrbScale = 0.38;
        baseInternalCoreCount = 2;
        break;
      case 4:
        baseHeadScale = 0.88;
        baseBodyThickness = 0.74;
        baseTailOrbScale = 0.50;
        baseInternalCoreCount = 3;
        break;
      case 5:
        baseHeadScale = 0.98;
        baseBodyThickness = 0.84;
        baseTailOrbScale = 0.62;
        baseInternalCoreCount = 4;
        break;
      case 6:
        baseHeadScale = 1.08;
        baseBodyThickness = 0.96;
        baseTailOrbScale = 0.74;
        baseInternalCoreCount = 5;
        break;
      case 7:
        baseHeadScale = 1.18;
        baseBodyThickness = 1.08;
        baseTailOrbScale = 0.86;
        baseInternalCoreCount = 6;
        break;
      case 8:
      default:
        baseHeadScale = 1.28;
        baseBodyThickness = 1.18;
        baseTailOrbScale = 0.96;
        baseInternalCoreCount = 7;
        break;
    }
  }

  // Adjust core count if post-E8
  let internalCoreCount = baseInternalCoreCount;
  if (stage >= 8 && params.evolutionEnergy !== undefined) {
    const extra = getPostE8InternalCoreOverflow(params.evolutionEnergy, mode);
    internalCoreCount = baseInternalCoreCount + extra;
  }

  const mods = ORBI_SERPENT_MODE_SCALE_MODIFIERS[mode] || {
    globalScale: 1.0,
    thicknessScale: 1.0,
    auraScale: 1.0,
    coreDensityScale: 1.0
  };

  let headScale = baseHeadScale * mods.globalScale;
  let bodyThickness = baseBodyThickness * mods.thicknessScale;
  let tailOrbScale = baseTailOrbScale * mods.globalScale;
  let internalCoreRadiusScale = 1.0;
  let internalCoreGlowScale = 1.0;
  let internalCoreSpacingMode: "sparse" | "normal" | "dense" = "normal";

  const premiumHeadDetails = true;
  const orbitalRings = stage >= 3;
  const microSatellite = stage >= 4;
  const stabilizerFins = stage >= 7;

  let auraScale = mods.auraScale;
  let trailScale = mods.globalScale;
  let particleScale = mods.globalScale;

  if (mode === 'nexus_assault') {
    internalCoreRadiusScale = 0.85; // 15% reduction
    tailOrbScale *= 0.80;           // 20% reduction
    internalCoreGlowScale = 0.75;  // limit glow
    internalCoreSpacingMode = "sparse";
  } else if (mode === 'vital_flow') {
    internalCoreSpacingMode = ENABLE_SERPENT_VISUAL_POLISH_5R3B ? "normal" : "sparse";
    if (stage >= 8) {
      headScale = 1.28 * mods.globalScale;
      bodyThickness = 1.18 * mods.thicknessScale;
      tailOrbScale = 0.96 * mods.globalScale; // freeze post-E8 scales
    }
  } else {
    internalCoreSpacingMode = "normal";
  }

  if (ENABLE_SERPENT_VISUAL_POLISH_5R3B) {
    // SECCIÓN 1 — REDUCCIÓN GLOBAL DE GROSOR
    bodyThickness *= 0.80;
    auraScale *= 0.90;
    trailScale *= 0.90;

    // SECCIÓN 2 — REDUCCIÓN ESPECÍFICA DE GROSOR EN NEXUS ASSAULT
    if (mode === 'nexus_assault') {
      bodyThickness *= 0.80;
      auraScale *= 0.85;
      internalCoreRadiusScale *= 0.92;
    }

    // SECCIÓN 9 — TRANSPARENCIA CONTROLADA DE NÚCLEOS INTERNOS
    internalCoreRadiusScale *= 0.92;
    internalCoreGlowScale *= 0.88;

    // SECCIÓN 4 — COLA MÁS PEQUEÑA
    tailOrbScale *= 0.50;
  }

  // Clamping tail visual weight (at most 55% of head weight under visual polish)
  const maxTailScale = headScale * (ENABLE_SERPENT_VISUAL_POLISH_5R3B ? 0.55 : 0.82);
  if (tailOrbScale > maxTailScale) {
    tailOrbScale = maxTailScale;
  }

  let modeOverlay: "none" | "purification" | "blackout_pressure" | "assault_cores" | "vital_flow_classic" = "none";
  if (mode === 'red_vital') {
    modeOverlay = "purification";
  } else if (mode === 'survival_nexus') {
    modeOverlay = "blackout_pressure";
  } else if (mode === 'nexus_assault') {
    modeOverlay = "assault_cores";
  } else if (mode === 'vital_flow') {
    modeOverlay = "vital_flow_classic";
  }

  if (mode === 'red_vital' && stage === 1) {
    auraScale *= 0.60;  // 40% reduction for less dense halo
    trailScale *= 0.65; // 35% reduction for less intense trail glow/saturation
    particleScale *= 0.60;
  }

  return {
    mode,
    heroId,
    stage,
    headScale,
    bodyThickness,
    bodyLengthVisualScale: mods.globalScale,
    tailOrbScale,
    internalCoreCount,
    internalCoreSpacingMode,
    internalCoreRadiusScale,
    internalCoreGlowScale,
    premiumHeadDetails,
    orbitalRings,
    stabilizerFins,
    microSatellite,
    auraScale,
    trailScale,
    particleScale,
    modeOverlay
  };
}

function getCanonicalCorePositions(params: {
  bodyPoints: { x: number; y: number }[];
  coreCount: number;
  headPaddingRatio?: number;
  tailPaddingRatio?: number;
}): number[] {
  const { bodyPoints, coreCount, headPaddingRatio = 0.12, tailPaddingRatio = 0.08 } = params;
  const total = bodyPoints.length;
  if (coreCount <= 0 || total < 3) return [];

  const headPadding = Math.floor(total * headPaddingRatio);
  const tailPadding = Math.floor(total * tailPaddingRatio);
  const availableLength = total - headPadding - tailPadding;

  if (availableLength <= 0) return [];

  const indices: number[] = [];
  if (coreCount === 1) {
    indices.push(headPadding + Math.floor(availableLength / 2));
  } else {
    // Distribute evenly
    const step = availableLength / (coreCount + 1);
    for (let i = 1; i <= coreCount; i++) {
      const idx = Math.round(headPadding + i * step);
      if (idx >= headPadding && idx < total - tailPadding) {
        if (!indices.includes(idx)) {
          indices.push(idx);
        }
      }
    }
  }
  return indices;
}

function getAssaultCanonicalCorePositions(params: {
  bodyPoints: { x: number; y: number }[];
  coreCount: number;
}): number[] {
  const { bodyPoints, coreCount } = params;
  const total = bodyPoints.length;
  if (coreCount <= 0 || total < 3) return [];

  // Compute prefix-sum path distances
  const d: number[] = [0];
  for (let i = 1; i < total; i++) {
    const dx = bodyPoints[i].x - bodyPoints[i-1].x;
    const dy = bodyPoints[i].y - bodyPoints[i-1].y;
    d.push(d[i-1] + Math.hypot(dx, dy));
  }
  const totalLength = d[total - 1];

  const headCorePadding = 52;
  const tailCorePadding = 44;
  const minCoreSpacingPx = 50; // range 46-54

  // Find min index (after headCorePadding)
  let minIdx = 1;
  for (let i = 1; i < total; i++) {
    if (d[i] >= headCorePadding) {
      minIdx = i;
      break;
    }
  }

  // Find max index (before tailCorePadding)
  let maxIdx = total - 2;
  for (let i = total - 1; i >= 0; i--) {
    if (totalLength - d[i] >= tailCorePadding) {
      maxIdx = i;
      break;
    }
  }

  if (minIdx >= maxIdx) {
    // Fallback if spline is extremely short
    return [Math.floor(total / 2)];
  }

  const indices: number[] = [];
  if (coreCount === 1) {
    indices.push(minIdx + Math.floor((maxIdx - minIdx) / 2));
  } else {
    const availableDist = d[maxIdx] - d[minIdx];
    const stepDist = availableDist / (coreCount - 1);

    for (let i = 0; i < coreCount; i++) {
      const targetDist = d[minIdx] + i * stepDist;
      // Find the closest segment index to targetDist
      let bestIdx = minIdx;
      let minDiff = Infinity;
      for (let j = minIdx; j <= maxIdx; j++) {
        const diff = Math.abs(d[j] - targetDist);
        if (diff < minDiff) {
          minDiff = diff;
          bestIdx = j;
        }
      }
      indices.push(bestIdx);
    }

    // Post-process to enforce minCoreSpacingPx if possible
    for (let i = 1; i < indices.length; i++) {
      const prevIdx = indices[i-1];
      let currIdx = indices[i];
      while (currIdx < maxIdx && d[currIdx] - d[prevIdx] < minCoreSpacingPx) {
        currIdx++;
      }
      indices[i] = currIdx;
    }
  }
  return indices;
}

function getCanonicalInternalCorePositions(params: {
  segments: { x: number; y: number }[];
  desiredCoreCount: number;
  spacingMode: "sparse" | "normal" | "dense";
}): number[] {
  const { segments, desiredCoreCount, spacingMode } = params;
  const totalSegs = segments.length;

  if (desiredCoreCount <= 0 || totalSegs < 7) return [];

  const startPadding = 4; // headPaddingSegments = 4
  const endPadding = 2;   // tailPaddingSegments = 2
  const availableLength = totalSegs - startPadding - endPadding;

  if (availableLength <= 0) return [];

  let minGap = 2;
  if (spacingMode === 'sparse') {
    minGap = 3;
  } else if (spacingMode === 'dense') {
    minGap = 1;
  } else {
    minGap = 2;
  }

  const maxCores = Math.max(1, Math.floor((availableLength + minGap) / (1 + minGap)));
  const finalCoreCount = Math.min(desiredCoreCount, maxCores);

  if (finalCoreCount <= 0) return [];

  const indices: number[] = [];
  if (finalCoreCount === 1) {
    indices.push(startPadding + Math.floor(availableLength / 2));
  } else {
    const gap = Math.max(minGap, (availableLength - 1) / (finalCoreCount - 1));
    for (let i = 0; i < finalCoreCount; i++) {
      const idx = Math.round(startPadding + i * gap);
      if (idx >= startPadding && idx < totalSegs - endPadding) {
        if (!indices.includes(idx)) {
          if (indices.length === 0 || idx - indices[indices.length - 1] >= minGap) {
            indices.push(idx);
          }
        }
      }
    }
  }

  return indices;
}

function getPostE8InternalCoreOverflow(resourceCount: number, mode: string): number {
  if (ENABLE_EVOLUTION_PACING_REBALANCE) {
    if (mode === "vital_flow") {
      const extra = Math.floor(Math.max(0, resourceCount - 120) / 18);
      return Math.min(extra, 24);
    } else if (mode === "red_vital") {
      const extra = Math.floor(Math.max(0, resourceCount - 90) / 18);
      return Math.min(extra, 18);
    } else if (mode === "survival_nexus") {
      const extra = Math.floor(Math.max(0, resourceCount - 130) / 45);
      return Math.min(extra, 18);
    } else if (mode === "nexus_assault") {
      const extra = Math.floor(Math.max(0, resourceCount - 160) / 18);
      return Math.min(extra, 18);
    }
  }
  if (mode === "vital_flow") {
    const extra = Math.floor(Math.max(0, resourceCount - 128) / 18);
    return Math.min(extra, 24);
  } else if (mode === "red_vital") {
    const extra = Math.floor(Math.max(0, resourceCount - 116) / 18);
    return Math.min(extra, 18);
  } else if (mode === "survival_nexus") {
    const extra = Math.floor(Math.max(0, resourceCount - 390) / 45);
    return Math.min(extra, 18);
  }
  return 0;
}

function getOrbiSerpentEvolutionLabel(stage: number, extraCount: number): string {
  const baseLabels: Record<number, string> = {
    1: "E1 — Baby Core",
    2: "E2 — Proto Orb",
    3: "E3 — Proto Serpent",
    4: "E4 — Young Foton",
    5: "E5 — Ascendant Foton",
    6: "E6 — Guardian Foton",
    7: "E7 — Elite Foton",
    8: "E8 — Orbi Nexus Serpent",
  };
  const label = baseLabels[stage] || "E1 — Baby Core";
  if (stage === 8 && extraCount > 0) {
    return `E8 — Orbi Nexus Serpent (+${extraCount} Núcleos)`;
  }
  return label;
}

function getOrbiSerpentEvolutionVisualProfile(params: {
  mode: "red_vital" | "survival_nexus" | "nexus_assault" | "vital_flow";
  stage?: number;
  pickupsOrEnergy: number;
  lengthScore?: number;
  heroId?: string;
}): OrbiSerpentVisualProfile {
  let stage = params.stage;
  const mode = params.mode;
  const val = params.pickupsOrEnergy;

  if (mode === 'red_vital') {
    const evo = getRedVitalLockedEvolutionState(val);
    const s = evo.stage;
    const stageProfile = getOrbiSerpentCanonicalStageProfile(s);
    return {
      stage: s,
      label: evo.label,
      headScale: stageProfile.headScale,
      bodyLengthScale: stageProfile.lengthScale,
      thicknessMultiplier: stageProfile.widthScale,
      visibleInternalCoreCount: evo.coreCount,
      tailOrbScale: stageProfile.tailScale,
      glowMultiplier: s === 1 ? 0.55 : s === 2 ? 0.65 : s === 3 ? 0.78 : s === 4 ? 0.90 : s === 5 ? 1.05 : s === 6 ? 1.18 : s === 7 ? 1.35 : 1.52,
      trailMultiplier: s === 1 ? 0.45 : s === 2 ? 0.55 : s === 3 ? 0.68 : s === 4 ? 0.82 : s === 5 ? 1.00 : s === 6 ? 1.14 : s === 7 ? 1.28 : 1.45,
      orbitRingIntensity: s === 1 ? 0 : s === 2 ? 0.05 : s === 3 ? 0.12 : s === 4 ? 0.20 : s === 5 ? 0.32 : s === 6 ? 0.48 : s === 7 ? 0.65 : 0.88,
      energyFinIntensity: s <= 3 ? 0 : s === 4 ? 0.08 : s === 5 ? 0.16 : s === 6 ? 0.26 : s === 7 ? 0.42 : 0.62,
      particleIntensity: s === 1 ? 0.45 : s === 2 ? 0.58 : s === 3 ? 0.72 : s === 4 ? 0.88 : s === 5 ? 1.05 : s === 6 ? 1.18 : s === 7 ? 1.34 : 1.50,
      preservePremiumHeadDetails: true
    };
  }

  if (stage === undefined) {
    if (ENABLE_EVOLUTION_PACING_REBALANCE) {
      let thresholds = RED_VITAL_EVOLUTION_THRESHOLDS;
      if (mode === "survival_nexus") thresholds = SURVIVAL_NEXUS_EVOLUTION_THRESHOLDS;
      else if (mode === "vital_flow") thresholds = VITAL_FLOW_EVOLUTION_THRESHOLDS;
      else if (mode === "nexus_assault") {
        thresholds = [
          { stage: 1, required: 0, label: "E1" },
          { stage: 2, required: 15, label: "E2" },
          { stage: 3, required: 30, label: "E3" },
          { stage: 4, required: 50, label: "E4" },
          { stage: 5, required: 70, label: "E5" },
          { stage: 6, required: 95, label: "E6" },
          { stage: 7, required: 125, label: "E7" },
          { stage: 8, required: 160, label: "E8" }
        ];
      }
      
      stage = 1;
      for (let i = 0; i < thresholds.length; i++) {
        if (val >= thresholds[i].required) {
          stage = thresholds[i].stage;
        }
      }
    } else {
      if (mode === "vital_flow") {
        if (val >= 128) stage = 8;
        else if (val >= 98) stage = 7;
        else if (val >= 72) stage = 6;
        else if (val >= 50) stage = 5;
        else if (val >= 32) stage = 4;
        else if (val >= 18) stage = 3;
        else if (val >= 8) stage = 2;
        else stage = 1;
      } else if (mode === "survival_nexus") {
        if (val >= 390) stage = 8;
        else if (val >= 290) stage = 7;
        else if (val >= 210) stage = 6;
        else if (val >= 145) stage = 5;
        else if (val >= 95) stage = 4;
        else if (val >= 55) stage = 3;
        else if (val >= 25) stage = 2;
        else stage = 1;
      } else if (mode === "nexus_assault") {
        if (val >= 160) stage = 8;
        else if (val >= 125) stage = 7;
        else if (val >= 95) stage = 6;
        else if (val >= 70) stage = 5;
        else if (val >= 50) stage = 4;
        else if (val >= 30) stage = 3;
        else if (val >= 15) stage = 2;
        else stage = 1;
      } else {
        stage = 1;
      }
    }
  }

  stage = Math.max(1, Math.min(8, stage));

  const extraCount = getPostE8InternalCoreOverflow(val, mode);
  const label = getOrbiSerpentEvolutionLabel(stage, extraCount);

  let profile: OrbiSerpentVisualProfile;
  if (ENABLE_CANONICAL_SERPENT_EVOLUTION_MODEL) {
    const stageProfile = getOrbiSerpentCanonicalStageProfile(stage);
    profile = {
      stage,
      label,
      headScale: stageProfile.headScale,
      bodyLengthScale: stageProfile.lengthScale,
      thicknessMultiplier: stageProfile.widthScale,
      visibleInternalCoreCount: stageProfile.coreCount + (stage === 8 ? extraCount : 0),
      tailOrbScale: stageProfile.tailScale,
      glowMultiplier: stage === 1 ? 0.55 : stage === 2 ? 0.65 : stage === 3 ? 0.78 : stage === 4 ? 0.90 : stage === 5 ? 1.05 : stage === 6 ? 1.18 : stage === 7 ? 1.35 : 1.52,
      trailMultiplier: stage === 1 ? 0.45 : stage === 2 ? 0.55 : stage === 3 ? 0.68 : stage === 4 ? 0.82 : stage === 5 ? 1.00 : stage === 6 ? 1.14 : stage === 7 ? 1.28 : 1.45,
      orbitRingIntensity: stage === 1 ? 0 : stage === 2 ? 0.05 : stage === 3 ? 0.12 : stage === 4 ? 0.20 : stage === 5 ? 0.32 : stage === 6 ? 0.48 : stage === 7 ? 0.65 : 0.88,
      energyFinIntensity: stage <= 3 ? 0 : stage === 4 ? 0.08 : stage === 5 ? 0.16 : stage === 6 ? 0.26 : stage === 7 ? 0.42 : 0.62,
      particleIntensity: stage === 1 ? 0.45 : stage === 2 ? 0.58 : stage === 3 ? 0.72 : stage === 4 ? 0.88 : stage === 5 ? 1.05 : stage === 6 ? 1.18 : stage === 7 ? 1.34 : 1.50,
      preservePremiumHeadDetails: true
    };
  } else {
    switch (stage) {
      case 1:
        profile = {
          stage: 1,
          label,
          headScale: 0.62,
          bodyLengthScale: 0.18,
          thicknessMultiplier: 0.50,
          visibleInternalCoreCount: 0,
          tailOrbScale: 0.12,
          glowMultiplier: 0.55,
          trailMultiplier: 0.45,
          orbitRingIntensity: 0,
          energyFinIntensity: 0,
          particleIntensity: 0.45,
          preservePremiumHeadDetails: true
        };
        break;
      case 2:
        profile = {
          stage: 2,
          label,
          headScale: 0.72,
          bodyLengthScale: 0.30,
          thicknessMultiplier: 0.60,
          visibleInternalCoreCount: 1,
          tailOrbScale: 0.28,
          glowMultiplier: 0.65,
          trailMultiplier: 0.55,
          orbitRingIntensity: 0.05,
          energyFinIntensity: 0,
          particleIntensity: 0.58,
          preservePremiumHeadDetails: true
        };
        break;
      case 3:
        profile = {
          stage: 3,
          label,
          headScale: 0.82,
          bodyLengthScale: 0.42,
          thicknessMultiplier: 0.70,
          visibleInternalCoreCount: 2,
          tailOrbScale: 0.42,
          glowMultiplier: 0.78,
          trailMultiplier: 0.68,
          orbitRingIntensity: 0.12,
          energyFinIntensity: 0,
          particleIntensity: 0.72,
          preservePremiumHeadDetails: true
        };
        break;
      case 4:
        profile = {
          stage: 4,
          label,
          headScale: 0.92,
          bodyLengthScale: 0.54,
          thicknessMultiplier: 0.80,
          visibleInternalCoreCount: 3,
          tailOrbScale: 0.56,
          glowMultiplier: 0.90,
          trailMultiplier: 0.82,
          orbitRingIntensity: 0.20,
          energyFinIntensity: 0.08,
          particleIntensity: 0.88,
          preservePremiumHeadDetails: true
        };
        break;
      case 5:
        profile = {
          stage: 5,
          label,
          headScale: 1.02,
          bodyLengthScale: 0.68,
          thicknessMultiplier: 0.92,
          visibleInternalCoreCount: 4,
          tailOrbScale: 0.70,
          glowMultiplier: 1.05,
          trailMultiplier: 1.00,
          orbitRingIntensity: 0.32,
          energyFinIntensity: 0.16,
          particleIntensity: 1.05,
          preservePremiumHeadDetails: true
        };
        break;
      case 6:
        profile = {
          stage: 6,
          label,
          headScale: 1.12,
          bodyLengthScale: 0.82,
          thicknessMultiplier: 1.04,
          visibleInternalCoreCount: 5,
          tailOrbScale: 0.84,
          glowMultiplier: 1.18,
          trailMultiplier: 1.14,
          orbitRingIntensity: 0.48,
          energyFinIntensity: 0.26,
          particleIntensity: 1.18,
          preservePremiumHeadDetails: true
        };
        break;
      case 7:
        profile = {
          stage: 7,
          label,
          headScale: 1.24,
          bodyLengthScale: 0.98,
          thicknessMultiplier: 1.18,
          visibleInternalCoreCount: 6,
          tailOrbScale: 0.96,
          glowMultiplier: 1.35,
          trailMultiplier: 1.28,
          orbitRingIntensity: 0.65,
          energyFinIntensity: 0.42,
          particleIntensity: 1.34,
          preservePremiumHeadDetails: true
        };
        break;
      case 8:
      default:
        profile = {
          stage: 8,
          label,
          headScale: 1.36,
          bodyLengthScale: 1.15,
          thicknessMultiplier: 1.32,
          visibleInternalCoreCount: 7 + extraCount,
          tailOrbScale: 1.08,
          glowMultiplier: 1.52,
          trailMultiplier: 1.45,
          orbitRingIntensity: 0.88,
          energyFinIntensity: 0.62,
          particleIntensity: 1.50,
          preservePremiumHeadDetails: true
        };
        break;
    }
  }

  // Freeze post-E8 scales
  if (stage === 8) {
    if (ENABLE_CANONICAL_SERPENT_EVOLUTION_MODEL) {
      profile.headScale = 1.12;
      profile.thicknessMultiplier = 1.00;
      profile.tailOrbScale = 1.12;
      profile.bodyLengthScale = Math.min(1.15, 1.00 + extraCount * 0.05);
    } else {
      profile.headScale = 1.36;
      profile.thicknessMultiplier = 1.32;
      profile.tailOrbScale = 1.08;
      profile.bodyLengthScale = 1.15;
    }
  }

  if (mode === "nexus_assault") {
    profile.bodyLengthScale *= 1.30;
    profile.thicknessMultiplier *= 0.85;
  }

  return profile;
}

function lerp(start: number, end: number, amt: number): number {
  return (1 - amt) * start + amt * end;
}

const ORBI_FOTON_VISUAL_PALETTE = {
  core: "#39ff14",
  coreHot: "#a3ff84",
  glow: "#16a34a",
  trail: "#39ff14",
  aura: "rgba(57, 255, 20, 0.34)",
  softAura: "rgba(22, 163, 74, 0.18)",
  whiteHot: "rgba(230, 255, 230, 0.95)"
};

function getVitalFlowEvolutionStage(pickupsCollected: number): number {
  if (ENABLE_EVOLUTION_PACING_REBALANCE) {
    if (pickupsCollected >= 120) return 8;
    if (pickupsCollected >= 86) return 7;
    if (pickupsCollected >= 58) return 6;
    if (pickupsCollected >= 36) return 5;
    if (pickupsCollected >= 20) return 4;
    if (pickupsCollected >= 10) return 3;
    if (pickupsCollected >= 4) return 2;
    return 1;
  }
  if (pickupsCollected >= 128) return 8;
  if (pickupsCollected >= 98) return 7;
  if (pickupsCollected >= 72) return 6;
  if (pickupsCollected >= 50) return 5;
  if (pickupsCollected >= 32) return 4;
  if (pickupsCollected >= 18) return 3;
  if (pickupsCollected >= 8) return 2;
  return 1;
}

interface VitalFlowSerpentVisualProfile {
  stage: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  label: string;
  bodyLengthScale: number;
  headScale: number;
  thicknessMultiplier: number;
  visibleInternalCoreCount: number;
  tailOrbScale: number;
  glowMultiplier: number;
  trailMultiplier: number;
  orbitRingIntensity: number;
  energyFinIntensity: number;
  particleIntensity: number;
}

function getVitalFlowEvolutionLabel(stage: number, pickupsCollected?: number): string {
  if (stage === 8 && pickupsCollected !== undefined) {
    const extraCount = getVitalFlowPostE8ExtraCoreCount(pickupsCollected);
    if (extraCount > 0) {
      return `E8 — Orbi Nexus Serpent (+${extraCount} Núcleos)`;
    }
  }
  switch (stage) {
    case 1: return "E1 — Baby Core";
    case 2: return "E2 — Proto Orb";
    case 3: return "E3 — Proto Serpent";
    case 4: return "E4 — Young Foton";
    case 5: return "E5 — Ascendant Foton";
    case 6: return "E6 — Guardian Foton";
    case 7: return "E7 — Elite Foton";
    case 8: return "E8 — Orbi Nexus Serpent";
    default: return "E1 — Baby Core";
  }
}

function getVitalFlowPostE8ExtraCoreCount(pickupsCollected: number): number {
  if (ENABLE_EVOLUTION_PACING_REBALANCE) {
    const extra = Math.floor(Math.max(0, pickupsCollected - 120) / 18);
    return Math.min(extra, 24);
  }
  const extra = Math.floor(Math.max(0, pickupsCollected - 128) / 18);
  return Math.min(extra, 24);
}

function getVitalFlowSerpentVisualProfile(
  stage: number,
  pickupsCollected: number
): VitalFlowSerpentVisualProfile {
  const label = getVitalFlowEvolutionLabel(stage);
  switch (stage) {
    case 1:
      return {
        stage: 1,
        label,
        bodyLengthScale: 0.20,
        headScale: 0.70,
        thicknessMultiplier: 0.55,
        visibleInternalCoreCount: 0,
        tailOrbScale: 0.15,
        glowMultiplier: 0.55,
        trailMultiplier: 0.45,
        orbitRingIntensity: 0,
        energyFinIntensity: 0,
        particleIntensity: 0.5,
      };
    case 2:
      return {
        stage: 2,
        label,
        bodyLengthScale: 0.32,
        headScale: 0.78,
        thicknessMultiplier: 0.65,
        visibleInternalCoreCount: 1,
        tailOrbScale: 0.35,
        glowMultiplier: 0.65,
        trailMultiplier: 0.55,
        orbitRingIntensity: 0,
        energyFinIntensity: 0,
        particleIntensity: 0.6,
      };
    case 3:
      return {
        stage: 3,
        label,
        bodyLengthScale: 0.45,
        headScale: 0.88,
        thicknessMultiplier: 0.75,
        visibleInternalCoreCount: 2,
        tailOrbScale: 0.50,
        glowMultiplier: 0.78,
        trailMultiplier: 0.70,
        orbitRingIntensity: 0.10,
        energyFinIntensity: 0,
        particleIntensity: 0.75,
      };
    case 4:
      return {
        stage: 4,
        label,
        bodyLengthScale: 0.58,
        headScale: 0.96,
        thicknessMultiplier: 0.85,
        visibleInternalCoreCount: 3,
        tailOrbScale: 0.65,
        glowMultiplier: 0.90,
        trailMultiplier: 0.82,
        orbitRingIntensity: 0.18,
        energyFinIntensity: 0,
        particleIntensity: 0.90,
      };
    case 5:
      return {
        stage: 5,
        label,
        bodyLengthScale: 0.72,
        headScale: 1.05,
        thicknessMultiplier: 0.96,
        visibleInternalCoreCount: 4,
        tailOrbScale: 0.78,
        glowMultiplier: 1.05,
        trailMultiplier: 1.00,
        orbitRingIntensity: 0.28,
        energyFinIntensity: 0.10,
        particleIntensity: 1.05,
      };
    case 6:
      return {
        stage: 6,
        label,
        bodyLengthScale: 0.86,
        headScale: 1.14,
        thicknessMultiplier: 1.08,
        visibleInternalCoreCount: 5,
        tailOrbScale: 0.90,
        glowMultiplier: 1.18,
        trailMultiplier: 1.12,
        orbitRingIntensity: 0.45,
        energyFinIntensity: 0.22,
        particleIntensity: 1.18,
      };
    case 7:
      return {
        stage: 7,
        label,
        bodyLengthScale: 1.00,
        headScale: 1.24,
        thicknessMultiplier: 1.20,
        visibleInternalCoreCount: 6,
        tailOrbScale: 1.00,
        glowMultiplier: 1.32,
        trailMultiplier: 1.25,
        orbitRingIntensity: 0.62,
        energyFinIntensity: 0.38,
        particleIntensity: 1.32,
      };
    case 8:
    default:
      return {
        stage: 8,
        label,
        bodyLengthScale: 1.15,
        headScale: 1.34,
        thicknessMultiplier: 1.32,
        visibleInternalCoreCount: 7,
        tailOrbScale: 1.15,
        glowMultiplier: 1.50,
        trailMultiplier: 1.42,
        orbitRingIntensity: 0.85,
        energyFinIntensity: 0.60,
        particleIntensity: 1.50,
      };
  }
}

function getVitalFlowVisibleInternalCoreCount(stage: number, pickupsCollected: number): number {
  const base = getVitalFlowSerpentVisualProfile(stage, pickupsCollected).visibleInternalCoreCount;
  if (stage < 8) return base;
  return base + getVitalFlowPostE8ExtraCoreCount(pickupsCollected);
}

// Shared constructor keeps survival resets aligned with the full initial state.
const createInitialSurvivalState = () => ({
      antiSerpents: [] as SurvivalAntiSerpent[],
      antiProjectiles: [] as SurvivalAntiProjectile[],
      hazards: [] as SurvivalHazardZone[],
      elapsedTime: 0,
      antiSerpentSpawnTimer: 0,
      spawnInterval: 15,
      maxAntiSerpents: 5,
      threatRating: 0,
      antiSerpentThreatLevel: 0,
      activeSymphony: 'Eco de la Red Vital',
      debuffType: null as 'ESTASIS' | 'ENTROPÍA' | null,
      debuffTimer: 0,
      debuffFeedbackCooldown: 0,
      currentPhase: 0,
      activeBlackoutEvent: null as SurvivalBlackoutEvent | null,
      blackoutEventTimer: 0,
      blackoutEventsCompleted: 0,
      lastBlackoutEventType: undefined as SurvivalBlackoutEventType | undefined,
      lastDamageReason: undefined as string | undefined,
      magnetBoostTimer: undefined as number | undefined,
      alphasDefeated: undefined as number | undefined,
      antiSerpentsDefeated: undefined as number | undefined,
      lastRewardedMinute: undefined as number | undefined,
      entropyTimer: undefined as number | undefined
    });

export default function NexusSerpentDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // REBOOT 0.9 — Performance/FPS Tracking Ref (Part 12)
  const fpsRef = useRef<{
    frameCount: number;
    lastTime: number;
    fpsHistory: number[];
  }>({
    frameCount: 0,
    lastTime: typeof performance !== 'undefined' ? performance.now() : 0,
    fpsHistory: [],
  });

  // REBOOT 0.9 — Viewport State (Part 1)
  const [viewport, setViewport] = useState<ViewportState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    dpr: typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1,
    orientation: typeof window !== 'undefined' && window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
    deviceProfile: 'desktop',
    isTouch: false,
    isSmallScreen: false,
  });

  // REBOOT 0.9 — Performance Profile (Part 11)
  const [performanceProfile, setPerformanceProfile] = useState<'desktop' | 'mobile' | 'lowEnd'>('desktop');

  // REBOOT 0.9 — FPS Monitor (Part 12)
  const [currentFps, setCurrentFps] = useState(60);
  const [activeParticlesCount, setActiveParticlesCount] = useState(0);

  // Sound triggers
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastSoundTrigger, setLastSoundTrigger] = useState<string>('');

  // Game UI/Screens state
  const [gameState, setGameState] = useState<'START' | 'CHOOSE' | 'PLAYING' | 'PAUSED' | 'GAMEOVER' | 'VICTORY'>('START');
  const [selectedGuardian, setSelectedGuardian] = useState<GuardianId>('FOTON');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hudMode, setHudMode] = useState<'full' | 'compact'>('full');

  // REBOOT 1.0 — MODAL STATES (Parte 3, 4, 11)
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showModeGuideModal, setShowModeGuideModal] = useState(false);

  // Demo / Infinite Mode States (REBOOT 0.6)
  const [gameMode, setGameMode] = useState<GameMode>('demo');
  const [objectives, setObjectives] = useState<DemoObjective[]>(INITIAL_DEMO_OBJECTIVES);
  const [completedBanner, setCompletedBanner] = useState<{ label: string; text: string } | null>(null);
  const [blackoutBanner, setBlackoutBanner] = useState<{ label: string; text: string } | null>(null);
  const [isObjectivesMinimized, setIsObjectivesMinimized] = useState(false);
  const [endGameStats, setEndGameStats] = useState<SessionStats | null>(null);
  const [bestDemoRun, setBestDemoRun] = useState<BestDemoRun | null>(null);
  const [showInfiniteBanner, setShowInfiniteBanner] = useState(false);
  const [showStartHint, setShowStartHint] = useState(false);

  // Survival Mode 4D States
  const [bestSurvivalTime, setBestSurvivalTime] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_survival_time');
    return val ? parseFloat(val) : 0;
  });
  const [bestSurvivalScore, setBestSurvivalScore] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_survival_score');
    return val ? parseInt(val, 10) : 0;
  });
  const [survivalSummary, setSurvivalSummary] = useState<{
    time: number;
    score: number;
    events: number;
    alphas: number;
    threat: number;
    serpentsDefeated: number;
    maxEvolution: string;
    dominantEnergy: string;
    cause: string;
  } | null>(null);

  // Vital Flow Mode States (Section 13 / localStorage / Summary)
  const [bestVitalFlowTime, setBestVitalFlowTime] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_vital_flow_time');
    return val ? parseFloat(val) : 0;
  });
  const [bestVitalFlowLength, setBestVitalFlowLength] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_vital_flow_length');
    return val ? parseInt(val, 10) : 0;
  });
  const [bestVitalFlowPickups, setBestVitalFlowPickups] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_vital_flow_pickups');
    return val ? parseInt(val, 10) : 0;
  });
  const [bestVitalFlowScore, setBestVitalFlowScore] = useState<number>(() => {
    const val = safeGetLocalStorage('orbi_best_vital_flow_score');
    return val ? parseInt(val, 10) : 0;
  });
  const [bestVitalFlowEvolution, setBestVitalFlowEvolution] = useState<string>(() => {
    const val = safeGetLocalStorage('orbi_best_vital_flow_evolution');
    return val || 'E1';
  });
  const [vitalFlowSummary, setVitalFlowSummary] = useState<{
    time: number;
    length: number;
    pickups: number;
    maxEvolution: string;
    score: number;
    cause: string;
  } | null>(null);

  const objectivesAutoMinimizeRef = useRef<NodeJS.Timeout | null>(null);

  // Cooldown & Active timers
  const [abilityCooldownRemaining, setAbilityCooldownRemaining] = useState(0);
  const [abilityActive, setAbilityActive] = useState(false);
  const [abilityDenied, setAbilityDenied] = useState(false);

  // Damage flashing indicator
  const [damageFlashing, setDamageFlashing] = useState(false);
  const [showCompactControlHint, setShowCompactControlHint] = useState(true);

  // Touch triggers
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Standard React state stats for HUD display updates (mirrors core layout in background)
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    energy: 40,
    highScore: 0,
    length: 8,
    evolution: 'SPARK',
  });

  // Corrupted Core Sentinel UI HUD state
  const [sentinelUI, setSentinelUI] = useState<{
    health: number;
    maxHealth: number;
    shield: number;
    maxShield: number;
    phase: 'forming' | 'shielded' | 'vulnerable' | 'enraged';
    defeated: boolean;
  } | null>(null);

  // Notifications
  const [notificationMsg, setNotificationMsg] = useState<string>('');
  const [soundTriggerTimeout, setSoundTriggerTimeout] = useState<NodeJS.Timeout | null>(null);
  const [boundaryAlert, setBoundaryAlert] = useState<string>('');
  const activeAlertRef = useRef<string>('');

  // Assault Mode States
  const [assaultRunHp, setAssaultRunHp] = useState(100);
  const [assaultRunMaxHp, setAssaultRunMaxHp] = useState(100);
  const [assaultRunRoom, setAssaultRunRoom] = useState(1);
  const [assaultRunCleared, setAssaultRunCleared] = useState(false);
  const [assaultKills, setAssaultKills] = useState(0);
  const [assaultUpgradeActive, setAssaultUpgradeActive] = useState(false);
  const [showDebugHUD, setShowDebugHUD] = useState(false);
  const [debugHudMode, setDebugHudMode] = useState<AssaultDebugHudMode>("hidden");
  const [roomEntryBanner, setRoomEntryBanner] = useState<{
    roomIndex: number;
    roomType: string;
    shape: string;
  } | null>(null);
  const [upgradesList, setUpgradesList] = useState<any[]>([]);
  const [lastProjectileTypeFired, setLastProjectileTypeFired] = useState<string>('N/A');
  const [lastStatusApplied, setLastStatusApplied] = useState<string>('Ninguno');
  const [lastSynergyProc, setLastSynergyProc] = useState<string>('Ninguno');

  const showTemporaryMessage = (msg: string) => {
    if (activeAlertRef.current !== msg) {
      activeAlertRef.current = msg;
      setBoundaryAlert(msg);
    }
  };

  // Reboot 0.8: Onboarding & Tutorial Systems
  const [tutorialEnabled, setTutorialEnabled] = useState<boolean>(() => {
    const saved = safeGetLocalStorage("orbiNexusTutorialEnabled");
    if (saved !== null) return saved === "true";
    const completed = safeGetLocalStorage("orbiNexusTutorialCompleted") === "true";
    return !completed; // True if not completed, false if completed
  });

  const [completedTutorialSteps, setCompletedTutorialSteps] = useState<TutorialStepId[]>(() => {
    const saved = safeGetLocalStorage("orbiNexusTutorialCompletedSteps");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTutorialStep, setActiveTutorialStep] = useState<TutorialStepId | null>(null);

  // Cinematic Intro System
  const [cinematicActive, setCinematicActive] = useState<boolean>(false);
  const [cinematicTimerSeconds, setCinematicTimerSeconds] = useState<number>(6);
  const cinematicTimerRef = useRef<number>(0);
  const cinematicActiveRef = useRef<boolean>(false);

  useEffect(() => {
    cinematicActiveRef.current = cinematicActive;
  }, [cinematicActive]);

  // Handle Survival Mode Game Over summarizing (Section 12)
  useEffect(() => {
    if (gameState === 'GAMEOVER' && gameMode === 'infinite') {
      handleSurvivalGameOver();
    }
  }, [gameState, gameMode]);

  // Contextual Help Message System
  const [contextualHelp, setContextualHelp] = useState<string | null>(null);
  const [contextualHelpTimer, setContextualHelpTimer] = useState<NodeJS.Timeout | null>(null);

  const TUTORIAL_STEPS_CONFIG: Record<TutorialStepId, { id: TutorialStepId; title: string; message: string; autoDismissSeconds?: number }> = {
    movement: {
      id: "movement",
      title: "MOVIMIENTO ELEMENTAL",
      message: "Desliza el mouse, usa WASD o arrastra la pantalla para dirigir el flujo de energía ORBI en el espacio.",
      autoDismissSeconds: 8
    },
    collect_energy: {
      id: "collect_energy",
      title: "RECOLECCIÓN CÓSMICA",
      message: "Absorbe Orbes Solares (amarillos) u Orbes Nexus (celestes) para rellenar tu carga vital de plasma y crecer.",
      autoDismissSeconds: 10
    },
    avoid_blackout: {
      id: "avoid_blackout",
      title: "INVASIÓN BLACKOUT",
      message: "Evita los fragmentos oscuros y orbes violetas. Consumen tu energía vital, rompen tus combos y encogen tu estela.",
      autoDismissSeconds: 12
    },
    solar_pulse: {
      id: "solar_pulse",
      title: "SOBRECARGA ACTIVA",
      message: "¡Tu energía supera el 20%! Presiona ESPACIO o toca el botón central para desatar tu habilidad solar y purgar amenazas.",
      autoDismissSeconds: 10
    },
    boundary_warning: {
      id: "boundary_warning",
      title: "CAMPO DE CONTENCIÓN",
      message: "Mantente lejos del borde rojo del sector. Exponerte al límite exterior drena tu plasma vital de forma crítica.",
      autoDismissSeconds: 8
    },
    corruption_zone: {
      id: "corruption_zone",
      title: "ZONAS DE CORRUPCIÓN",
      message: "Ha aparecido una tormenta de corrupción. Quédate dentro de ella y usa tu habilidad para purificarla antes de que se expanda.",
      autoDismissSeconds: 12
    },
    blackout_surge: {
      id: "blackout_surge",
      title: "SURGE OSCURO",
      message: "¡Sobrecarga de vacíos detectada! Los orbes se corrompen temporalmente. Resiste y purga todos los orbes posibles.",
      autoDismissSeconds: 12
    },
    sentinel_intro: {
      id: "sentinel_intro",
      title: "SENTINEL DE CORE",
      message: "¡Alerta de Jefe! Usa tu pulso solar para quebrar sus escudos cyan, luego ataca su núcleo dorado expuesto.",
      autoDismissSeconds: 15
    },
    victory_goal: {
      id: "victory_goal",
      title: "RED ESTABILIZADA",
      message: "Completa todos los objetivos del sector a la izquierda para disolver la infección y salvar la Red Vital.",
      autoDismissSeconds: 12
    }
  };

  // Periodic check to transition tutorial steps based on progress and state criteria
  useEffect(() => {
    if (!tutorialEnabled || gameState !== 'PLAYING' || cinematicActive || gameMode === 'nexus_assault' || gameMode === 'vital_flow') {
      setActiveTutorialStep(null);
      return;
    }

    const interval = setInterval(() => {
      const core = stateRef.current;
      const p = core?.player;
      if (!core || !p) return;

      // Determine next uncompleted step in order
      if (!completedTutorialSteps.includes('movement')) {
        setActiveTutorialStep('movement');
      } else if (!completedTutorialSteps.includes('collect_energy')) {
        setActiveTutorialStep('collect_energy');
      } else if (!completedTutorialSteps.includes('avoid_blackout')) {
        setActiveTutorialStep('avoid_blackout');
      } else if (!completedTutorialSteps.includes('solar_pulse')) {
        if (p.energy >= 20) {
          setActiveTutorialStep('solar_pulse');
        } else {
          setActiveTutorialStep(null);
        }
      } else if (!completedTutorialSteps.includes('boundary_warning')) {
        setActiveTutorialStep('boundary_warning');
      } else if (!completedTutorialSteps.includes('corruption_zone')) {
        if (core.corruptionZones.length > 0 || core.timeElapsed > 8) {
          setActiveTutorialStep('corruption_zone');
        } else {
          setActiveTutorialStep(null);
        }
      } else if (!completedTutorialSteps.includes('blackout_surge')) {
        if (core.surgeActive || core.timeElapsed > 15) {
          setActiveTutorialStep('blackout_surge');
        } else {
          setActiveTutorialStep(null);
        }
      } else if (!completedTutorialSteps.includes('sentinel_intro')) {
        if (core.sentinel) {
          setActiveTutorialStep('sentinel_intro');
        } else {
          setActiveTutorialStep(null);
        }
      } else if (!completedTutorialSteps.includes('victory_goal')) {
        setActiveTutorialStep('victory_goal');
      } else {
        // All steps completed! Disable tutorial and save completion
        setTutorialEnabled(false);
        localStorage.setItem("orbiNexusTutorialEnabled", "false");
        localStorage.setItem("orbiNexusTutorialCompleted", "true");
        setActiveTutorialStep(null);
        showTemporaryMessage("✓ ENTRENAMIENTO COMPLETADO");
        triggerAudioSign('Tutorial completado', 'evolve');
      }
    }, 500);

    return () => clearInterval(interval);
  }, [tutorialEnabled, completedTutorialSteps, gameState, cinematicActive]);

  const markTutorialStepCompleted = (stepId: TutorialStepId) => {
    if (!tutorialEnabled) return;
    if (completedTutorialSteps.includes(stepId)) return;
    
    const nextSteps = [...completedTutorialSteps, stepId];
    setCompletedTutorialSteps(nextSteps);
    localStorage.setItem("orbiNexusTutorialCompletedSteps", JSON.stringify(nextSteps));

    stateRef.current.floatingTexts.push({
      id: Math.random().toString(),
      x: stateRef.current.player.x,
      y: stateRef.current.player.y - 65,
      text: "✓ PASO COMPLETADO",
      color: '#22d3ee',
      life: 2.0,
      size: 14
    });

    triggerAudioSign('Paso de tutorial completado', 'evolve');
    setActiveTutorialStep(null);
  };

  const handleSkipTutorial = () => {
    setTutorialEnabled(false);
    localStorage.setItem("orbiNexusTutorialEnabled", "false");
    localStorage.setItem("orbiNexusTutorialCompleted", "true");
    setActiveTutorialStep(null);
    triggerAudioSign('Tutorial desactivado', 'reset');
    showTemporaryMessage("TUTORIAL DESACTIVADO");
  };

  const triggerStartHints = () => {
    setTimeout(() => {
      setShowStartHint(true);
      setTimeout(() => {
        setShowStartHint(false);
      }, 4000);
    }, 1000);
  };

  const handleSkipCinematic = () => {
    setCinematicActive(false);
    cinematicTimerRef.current = 0;
    triggerAudioSign('Intro Omitida', 'reset');
    triggerStartHints();
  };

  const triggerContextualHelp = (message: string) => {
    const core = stateRef.current;
    if (core.gameState !== 'PLAYING' || cinematicActive) return;
    if (core.timeElapsed - (core.lastHelpTime || 0) < 15) return;
    
    core.lastHelpTime = core.timeElapsed;
    setContextualHelp(message);
    
    if (contextualHelpTimer) clearTimeout(contextualHelpTimer);
    const t = setTimeout(() => {
      setContextualHelp(null);
    }, 5000);
    setContextualHelpTimer(t);

    triggerAudioSign('Alerta del Sistema', 'solar');
  };

  // Future systems and module hooks requested by Reboot 0.1
  const onEnergyCollect = (x: number, y: number, amount: number) => {
    // Empty hook reservando función de recolección
  };
  const onNexusOrbCollect = (x: number, y: number, points: number) => {
    // Empty hook reservando función de decodificación
  };
  const onBlackoutContact = (x: number, y: number, damage: number) => {
    triggerContextualHelp("CONSEJO: Desata tu pulso solar [ESPACIO] justo antes de impactar para repeler o destruir obstáculos.");
  };

  // Demo objective tracking and rank evaluation (REBOOT 0.6)
  const triggerObjectiveCompleted = (id: string, label: string, description: string) => {
    onObjectiveComplete();
    triggerAudioSign(`Objetivo: ${label}`, 'evolve');
    
    setCompletedBanner({ label, text: description });
    setTimeout(() => {
      setCompletedBanner(null);
    }, 4500);

    const core = stateRef.current;
    setObjectives([...core.objectives]);

    setIsObjectivesMinimized(false);
    if (objectivesAutoMinimizeRef.current) clearTimeout(objectivesAutoMinimizeRef.current);
    objectivesAutoMinimizeRef.current = setTimeout(() => {
      setIsObjectivesMinimized(true);
    }, 6000);
  };

  const calculateDemoRank = (statsObj: SessionStats): DemoRank => {
    const { score, totalTimeSeconds, maxCombo, damageTaken, perfectPurges, perfectSentinelPurge, sentinelPurged } = statsObj;
    
    if (sentinelPurged && perfectSentinelPurge && perfectPurges >= 1 && maxCombo >= 15 && damageTaken < 80) {
      return 'ORBI_PRIME';
    }
    if (score >= 12000 || (maxCombo >= 12 && totalTimeSeconds < 180 && sentinelPurged)) {
      return 'S';
    }
    if (score >= 7000 || (maxCombo >= 8 && totalTimeSeconds < 240)) {
      return 'A';
    }
    if (score >= 3000) {
      return 'B';
    }
    return 'C';
  };

  const captureSessionStats = (): SessionStats => {
    const core = stateRef.current;
    const p = core.player;
    
    const perfectPurgesCount = core.perfectPurgeEligible && core.statsExtra.blackoutSurgesSurvived > 0 ? 1 : 0;
    
    return {
      score: p.score,
      finalEnergy: Math.round(p.energy),
      maxEnergy: 220,
      maxEvolutionReached: EVOLUTION_STAGES[core.statsExtra.maxEvolution]?.displayName || 'Spark',
      maxCombo: core.statsExtra.maxCombo,
      zonesPurified: core.statsExtra.zonesPurified,
      surgesSurvived: core.statsExtra.blackoutSurgesSurvived,
      sentinelEncountered: core.statsExtra.sentinelsEncountered > 0,
      sentinelPurged: core.statsExtra.sentinelsPurged > 0,
      perfectPurges: perfectPurgesCount,
      perfectSentinelPurge: core.statsExtra.perfectSentinelPurge,
      damageTaken: core.statsExtra.damageTakenDuringSentinel + (100 - Math.round(p.energy)),
      blackoutHits: core.statsExtra.blackoutOrbsPurified,
      boundaryDamageTaken: Math.round(core.boundaryExposureTime * 12),
      totalTimeSeconds: Math.round(core.timeElapsed)
    };
  };

  const triggerDemoVictory = () => {
    onDemoVictory();
    triggerAudioSign('Red Vital Estabilizada', 'evolve');
    
    const statsObj = captureSessionStats();
    setEndGameStats(statsObj);
    
    const rank = calculateDemoRank(statsObj);
    
    const savedBest = safeGetLocalStorage('orbi_best_demo_run');
    let bestRunObj: BestDemoRun | null = savedBest ? JSON.parse(savedBest) : null;
    if (!bestRunObj || statsObj.score > bestRunObj.score) {
      const newBest: BestDemoRun = {
        score: statsObj.score,
        rank: rank,
        time: statsObj.totalTimeSeconds,
        maxCombo: statsObj.maxCombo,
        date: new Date().toLocaleDateString()
      };
      safeSetLocalStorage('orbi_best_demo_run', JSON.stringify(newBest));
      setBestDemoRun(newBest);
      onHighScoreSaved();
    } else {
      setBestDemoRun(bestRunObj);
    }
    
    onRankReveal();
    setGameState('VICTORY');
  };

  const updateObjectives = (dt: number) => {
    const core = stateRef.current;
    if (core.gameState !== 'PLAYING' || core.gameMode !== 'demo') return;

    const p = core.player;
    
    // 1. Reach Solar Stream
    const reachSolarStream = core.objectives.find(o => o.id === 'reach_solar_stream');
    if (reachSolarStream && !reachSolarStream.completed) {
      const isSolarStreamOrBetter = p.evolution === 'SOLAR_STREAM' || p.evolution === 'GUARDIAN_SERPENT' || p.evolution === 'TITAN_SERPENT';
      if (isSolarStreamOrBetter) {
        reachSolarStream.completed = true;
        reachSolarStream.completedAt = core.timeElapsed;
        triggerObjectiveCompleted('reach_solar_stream', 'Alcanza Solar Stream', 'Absorbe energía suficiente para despertar tu primera evolución.');
      }
    }

    // 2. Purify 2 zones
    const purifyTwoZones = core.objectives.find(o => o.id === 'purify_two_zones');
    if (purifyTwoZones && !purifyTwoZones.completed) {
      if (core.statsExtra.zonesPurified >= 2) {
        purifyTwoZones.completed = true;
        purifyTwoZones.completedAt = core.timeElapsed;
        triggerObjectiveCompleted('purify_two_zones', 'Purifica 2 zonas corruptas', 'Limpia la corrupción Blackout dentro de la Red Vital.');
      }
    }

    // 3. Survive Blackout Surge
    const surviveBlackoutSurge = core.objectives.find(o => o.id === 'survive_blackout_surge');
    if (surviveBlackoutSurge && !surviveBlackoutSurge.completed) {
      if (core.statsExtra.blackoutSurgesSurvived >= 1) {
        surviveBlackoutSurge.completed = true;
        surviveBlackoutSurge.completedAt = core.timeElapsed;
        triggerObjectiveCompleted('survive_blackout_surge', 'Sobrevive a 1 Blackout Surge', 'Resiste una oleada activa de corrupción.');
      }
    }

    // 4. Defeat Sentinel
    const defeatSentinel = core.objectives.find(o => o.id === 'defeat_sentinel');
    if (defeatSentinel && !defeatSentinel.completed) {
      if (core.statsExtra.sentinelsPurged >= 1) {
        defeatSentinel.completed = true;
        defeatSentinel.completedAt = core.timeElapsed;
        triggerObjectiveCompleted('defeat_sentinel', 'Derrota al Corrupted Core Sentinel', 'Purga el núcleo consciente de la infección Blackout.');
      }
    }

    // Check if all are completed
    const allCompleted = core.objectives.every(o => o.completed);
    if (allCompleted && !core.victoryTriggered) {
      core.victoryTriggered = true;
      core.victoryDelayTimer = 120; // 2 seconds delay (120 frames)
    }

    // Process Victory sequence delay
    if (core.victoryTriggered && core.victoryDelayTimer > 0) {
      core.victoryDelayTimer -= dt;
      if (core.victoryDelayTimer <= 0) {
        triggerDemoVictory();
      }
    }
  };

  // Evolution micro-cinematic state
  const [evolveOverlay, setEvolveOverlay] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
  }>({
    visible: false,
    title: '',
    subtitle: ''
  });

  // State reference to run continuous fast ticker in canvas loop safely without React render lag
  const stateRef = useRef({
    gameState: 'START',
    arenaSize: 2850,
    arenaWidth: EXPLORATION_WORLD_WIDTH,
    activeGuardian: 'FOTON' as GuardianId,
    redVitalEvolutionEnergy: 0,
    redVitalVisualStage: 1,
    redVitalInternalCoreCount: 1,
    lastCountdownStepPlayed: "",
    lastHelpTime: 0,
    lowEffectsMode: undefined as boolean | undefined,
    lowFpsConsecutiveSeconds: undefined as number | undefined,
    highFpsConsecutiveSeconds: undefined as number | undefined,
    avoidBlackoutTimer: undefined as number | undefined,
    victoryGoalTimer: undefined as number | undefined,
    assaultBackdrop: undefined as { dust: any[]; currents: any[]; nebula: any[]; initialized: boolean } | undefined,
    player: {
      x: 1425,
      y: 1425,
      vx: 0,
      vy: 0,
      angle: 0,
      speed: 4.2,
      targetAngle: 0,
      segments: [] as Segment[],
      length: 8,
      targetLength: 8,
      energy: 40,
      score: 0,
      evolution: 'SPARK' as EvolutionName,
      damageCooldown: 0,
      wingPhase: 0,
      orbitPhase: 0,
      gridBoundTicks: 0,
      ticksSinceLastDamage: 0,
      // Progression/appearance fields are populated by the existing run reset.
      pickupEvolutionEnergy: undefined as number | undefined,
      currentEvolutionStage: undefined as number | undefined,
      displayedEvolutionStage: undefined as number | undefined,
      internalCoreCount: undefined as number | undefined,
      progressionToNextStage: undefined as number | undefined,
      visualProfile: undefined as ReturnType<typeof getOrbiSerpentEvolutionVisualProfile> | undefined,
      radius: undefined as number | undefined,
      lastHitZone: undefined as string | undefined,
      lastHitTime: undefined as number | undefined,
      inactivityTicks: undefined as number | undefined,
      lowEnergyTicks: undefined as number | undefined,
      abilityUnusedTicks: undefined as number | undefined
    },
    evolutionCinematic: {
      active: false,
      timer: 0,
      stage: ''
    },
    ability: {
      active: false,
      cooldownRemaining: 0,
      activeTimer: 0,
      radialEffectX: 0,
      radialEffectY: 0,
      radialEffectRadius: 0,
      radialEffectActive: false,
      radialEffectMaxRadius: 260,
      radialEffectColor: '#fbbf24'
    },
    camera: {
      x: 1425,
      y: 1425,
      zoom: 0.95,
      shakeTime: 0,
      shakeIntensity: 0
    } as Camera,
    orbs: [] as EnergyOrb[],
    obstacles: [] as BlackoutFragment[],
    particles: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    keys: {} as Record<string, boolean>,
    activeControlMode: 'mouse' as 'mouse' | 'keyboard' | 'touch',
    lastPointerX: 0,
    lastPointerY: 0,
    boundaryExposureTime: 0,
    joystick: {
      active: false,
      startX: 0,
      startY: 0,
      curX: 0,
      curY: 0,
      angle: 0
    },
    bgParticles: [] as Point[], // Lay 1 (starfield dust)
    middleParticles: [] as Point[], // Lay 2 (medium dust clouds)
    gridBoundPulse: 0,
    vitalEnergyWind: 0,
    consecutiveCollects: 0,
    consecutiveTimer: 0,
    vitalNodes: [] as Point[],
    vitalConnections: [] as { p1: number; p2: number }[],
    timeElapsed: 0,
    threatLevel: 0 as BlackoutThreatLevel,
    corruptionZones: [] as CorruptionZone[],
    surgeTimer: 0, // time in seconds/ticks until next event or remaining in active event
    surgeActive: false,
    perfectPurgeEligible: true,
    sentinel: null as CorruptedCoreSentinel | null,
    sentinelDamageTakenThisFight: 0,
    sentinelTimeActive: 0,
    statsExtra: {
      zonesPurified: 0,
      blackoutOrbsPurified: 0,
      blackoutSurgesSurvived: 0,
      maxCombo: 0,
      maxEvolution: 'SPARK' as EvolutionName,
      sentinelsEncountered: 0,
      sentinelsPurged: 0,
      timeToPurgeSentinel: 0,
      damageTakenDuringSentinel: 0,
      perfectSentinelPurge: false,
      nexusGuardianReached: false
    },
    gameMode: 'demo' as GameMode,
    assaultRun: {
      hp: 100,
      maxHp: 100,
      roomIndex: 1,
      roomType: 'NORMAL' as AssaultRoomType,
      roomCleared: false,
      enemies: [] as AssaultEnemy[],
      projectiles: [] as AssaultProjectile[],
      modules: [] as OrbiCombatModule[],
      enemiesKilled: 0,
      upgradesAvailable: [] as AssaultUpgrade[],
      showUpgradeSelection: false
    } as NexusAssaultRun,
    objectives: INITIAL_DEMO_OBJECTIVES.map(o => ({ ...o, completed: false, completedAt: undefined as number | undefined })),
    victoryTriggered: false,
    victoryDelayTimer: 0,
    survival: createInitialSurvivalState(),
    vitalFlow: {
      elapsedTime: 0,
      lengthScore: 0,
      targetBodyLength: 8,
      currentBodyLength: 8,
      pickupsCollected: 0,
      pickups: [] as VitalFlowPickup[],
      speed: 155,
      lastGridX: 0,
      lastGridY: 0,
      gridStepTimer: 0,
      // Legacy Vital Flow state is populated when a run starts.
      // Declare its fields up front without changing their runtime defaults.
      head: undefined as Point | undefined,
      direction: undefined as Point | undefined,
      desiredDirection: undefined as Point | undefined,
      bodyPoints: undefined as Point[] | undefined,
      hasReceivedInput: undefined as boolean | undefined,
      hasStartedMoving: undefined as boolean | undefined,
      spawnGraceTimer: undefined as number | undefined,
      resizeGraceTimer: undefined as number | undefined,
      arenaBounds: undefined as ReturnType<typeof getActiveVitalFlowArenaBounds> | undefined,
      lastEvolutionStage: undefined as number | undefined,
      evolutionFlashTimer: undefined as number | undefined,
      lastEvolutionLabel: undefined as string | undefined,
    }
  });

  // Sound Engine config coupling
  useEffect(() => {
    synthEngineInstance.enabled = soundEnabled;
  }, [soundEnabled]);

  const triggerAudioSign = (name: string, type: 'solar' | 'nexus' | 'blackout' | 'evolve' | 'ability' | 'reset' | 'soft_orbi_pulse' | 'soft_launch_chime' | 'countdown_background_pad' | 'rift_spawn') => {
    synthEngineInstance.play(type);
    setLastSoundTrigger(name);
    if (soundTriggerTimeout) clearTimeout(soundTriggerTimeout);
    const t = setTimeout(() => setLastSoundTrigger(''), 1500);
    setSoundTriggerTimeout(t);
  };

  const getNexusAssaultSpeedMultiplier = (): number => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState?.run) return NEXUS_ASSAULT_SPEED_CONFIG.baseSpeedMultiplier;

    const run = nexusAssaultState.run;
    const roomIndex = run.roomIndex ?? 1;
    const roomType = run.roomType || nexusAssaultState.roomType || 'NORMAL';

    let multiplier =
      NEXUS_ASSAULT_SPEED_CONFIG.baseSpeedMultiplier +
      Math.max(0, roomIndex - 1) * NEXUS_ASSAULT_SPEED_CONFIG.speedIncreasePerRoom;

    if (roomType === "elite") {
      multiplier += NEXUS_ASSAULT_SPEED_CONFIG.eliteRoomBonus;
    }

    if (roomType === "swarm") {
      multiplier += NEXUS_ASSAULT_SPEED_CONFIG.swarmRoomBonus;
    }

    if (run.status === "transition_next_room") {
      multiplier *= NEXUS_ASSAULT_SPEED_CONFIG.transitionSpeedMultiplier;
    }

    if (run.status === "upgrade_selection" || run.status === "room_cleared") {
      multiplier *= NEXUS_ASSAULT_SPEED_CONFIG.upgradeSelectionSpeedMultiplier;
    }

    return Math.min(
      NEXUS_ASSAULT_SPEED_CONFIG.maxSpeedMultiplier,
      Math.max(0, multiplier)
    );
  };

  const getNexusAssaultDifficultyMultiplier = (): number => {
    const core = stateRef.current;
    const roomIndex = core.assaultRun?.run?.roomIndex ?? core.assaultRun?.roomIndex ?? 1;
    return Math.min(2.0, 1 + (roomIndex - 1) * 0.08);
  };

  const cloneCurrentAssaultHeadPosition = () => {
    return { x: stateRef.current.player.x, y: stateRef.current.player.y };
  };

  const cloneCurrentAssaultBodyPoints = () => {
    return stateRef.current.player.segments.map((seg: any) => ({ ...seg }));
  };

  const cloneCurrentAssaultTrailPoints = () => {
    return stateRef.current.player.segments.map((seg: any) => ({ ...seg }));
  };

  const restoreAssaultOrbiContinuity = (head: any, body: any[], trail: any[]) => {
    const p = stateRef.current.player;
    p.x = head.x;
    p.y = head.y;
    p.segments = body.map((seg: any) => ({ ...seg }));
  };

  const shiftAssaultBodyAndTrail = (dx: number, dy: number) => {
    if (dx === 0 && dy === 0) return;
    const segments = stateRef.current.player.segments;
    if (segments && segments.length > 0) {
      segments.forEach((seg: any) => {
        seg.x += dx;
        seg.y += dy;
      });
    }

    const core = stateRef.current;
    if (core.assaultRun && (core.assaultRun as any).orbiTrail) {
      for (const p of (core.assaultRun as any).orbiTrail) {
        p.x += dx;
        p.y += dy;
      }
    }

    if (core.assaultRun && (core.assaultRun as any).trailPoints) {
      for (const p of (core.assaultRun as any).trailPoints) {
        p.x += dx;
        p.y += dy;
      }
    }
  };

  const softlyRepositionOrbiIfNeeded = (dt: number) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const pos = core.player;
    if (!pos) return;

    // Boundary box is: center (1425) +/- 750 (boxMin=675, boxMax=2175)
    const boxMin = 1425 - 750;
    const boxMax = 1425 + 750;
    const safePadding = 160;

    const minX = boxMin + safePadding;
    const maxX = boxMax - safePadding;
    const minY = boxMin + safePadding;
    const maxY = boxMax - safePadding;

    const targetX = Math.max(minX, Math.min(maxX, pos.x));
    const targetY = Math.max(minY, Math.min(maxY, pos.y));

    const dx = targetX - pos.x;
    const dy = targetY - pos.y;

    if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
      const lerp = 1 - Math.pow(0.001, dt);
      const moveX = dx * lerp;
      const moveY = dy * lerp;

      pos.x += moveX;
      pos.y += moveY;
      shiftAssaultBodyAndTrail(moveX, moveY);
    }
  };

  // REBOOT 0.9 — Centralized Viewport & Responsive Resize Observer (Part 1 & 2)
  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const rawDpr = window.devicePixelRatio || 1;
      const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
      const orientation = w >= h ? 'landscape' : 'portrait';
      
      let deviceProfile: DeviceProfile = 'desktop';
      if (isTouch) {
        if (Math.max(w, h) < 950 && Math.min(w, h) < 500) {
          deviceProfile = 'mobile';
        } else if (Math.max(w, h) < 1180) {
          deviceProfile = 'tablet';
        } else {
          deviceProfile = 'laptop';
        }
      } else {
        if (w >= 1400) deviceProfile = 'desktop';
        else if (w >= 1024) deviceProfile = 'laptop';
        else if (w >= 768) deviceProfile = 'tablet';
        else deviceProfile = 'mobile';
      }

      const isSmallScreen = w < 768 || h < 500;

      setViewport({
        width: w,
        height: h,
        dpr: rawDpr,
        orientation,
        deviceProfile,
        isTouch,
        isSmallScreen,
      });

      setIsTouchDevice(isTouch);
      setDimensions({ width: w, height: h });
      if (deviceProfile === 'mobile') {
        setIsObjectivesMinimized(true);
      }

      // If we are in Vital Flow, protect from resize collisions by activating grace timer
      const core = stateRef.current;
      if (core && core.gameMode === 'vital_flow' && core.vitalFlow) {
        core.vitalFlow.resizeGraceTimer = 2.5;
        showTemporaryMessage('RESOLUCIÓN ADAPTADA — INMUNIDAD ACTIVADA');
        triggerAudioSign('Alerta del Sistema', 'solar');
      }

      // Automatically assign initial performance profile based on device category (Part 11)
      if (deviceProfile === 'mobile') {
        setPerformanceProfile(isSmallScreen ? 'lowEnd' : 'mobile');
      } else if (deviceProfile === 'tablet') {
        setPerformanceProfile('mobile');
      } else {
        setPerformanceProfile('desktop');
      }
    };

    updateSize();
    const observer = new ResizeObserver(() => updateSize());
    observer.observe(containerRef.current);

    window.addEventListener('orientationchange', updateSize);
    document.addEventListener('fullscreenchange', updateSize);

    // Read stored High Score
    const saved = safeGetLocalStorage('orbi_high_score');
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!isNaN(parsed)) {
        setStats(prev => ({ ...prev, highScore: parsed }));
      }
    }

    validateNoActiveTerraReferences();

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', updateSize);
      document.removeEventListener('fullscreenchange', updateSize);
    };
  }, []);

  // Update central states
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.activeGuardian = selectedGuardian;
    const theme = GUARDIAN_THEMES[selectedGuardian];
    stateRef.current.ability.radialEffectColor = theme.primaryColor;
  }, [selectedGuardian]);

  // Handle keys listener for keyboard navigation vector
  useEffect(() => {
    const gameKeys = [
      'arrowup',
      'arrowdown',
      'arrowleft',
      'arrowright',
      ' ',
      'w',
      'a',
      's',
      'd'
    ];

    const handleKeyDown = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      const codeLower = e.code.toLowerCase();

      if (keyLower === 'd') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          if (stateRef.current.gameMode === 'nexus_assault') {
            setDebugHudMode(prev => {
              let next: AssaultDebugHudMode = "hidden";
              if (prev === "hidden") next = "compact";
              else if (prev === "compact") next = "expanded";
              else next = "hidden";
              
              if (stateRef.current.assaultRun) {
                stateRef.current.assaultRun.debugHudMode = next;
              }
              return next;
            });
          } else {
            setShowDebugHUD(prev => !prev);
          }
        }
      }

      if (keyLower === 'h') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
          setHudMode(prev => prev === 'full' ? 'compact' : 'full');
        }
      }

      // Set key state
      stateRef.current.keys[keyLower] = true;
      stateRef.current.keys[codeLower] = true;

      if (stateRef.current.gameMode === 'vital_flow') {
        handleVitalFlowKeyboardInput(e);
        return;
      }

      // Check if it's one of the game's movement or slot keys to switch control mode
      if (gameKeys.includes(keyLower) || codeLower === 'space') {
        stateRef.current.activeControlMode = 'keyboard';
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const keyLower = e.key.toLowerCase();
      const codeLower = e.code.toLowerCase();

      stateRef.current.keys[keyLower] = false;
      stateRef.current.keys[codeLower] = false;

      if (gameKeys.includes(keyLower) || codeLower === 'space') {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Generate background elements & Red Vital
  const generateWorldElements = () => {
    const core = stateRef.current;
    const size = core.arenaSize;
    const worldWidth = core.arenaWidth;

    // Layer 1 stars (far parallax)
    const far: Point[] = [];
    for (let i = 0; i < 180; ++i) {
      far.push({
        x: Math.random() * worldWidth,
        y: Math.random() * size
      });
    }
    core.bgParticles = far;

    // Layer 2 stars (mid parallax)
    const mid: Point[] = [];
    for (let i = 0; i < 90; ++i) {
      mid.push({
        x: Math.random() * worldWidth,
        y: Math.random() * size
      });
    }
    core.middleParticles = mid;

    // Sutil curved pathways (Red Vital sutil)
    const nodes: Point[] = [];
    for (let i = 0; i < QUALITY.vitalNetworkDensity; ++i) {
      nodes.push({
        x: 150 + Math.random() * (worldWidth - 300),
        y: 150 + Math.random() * (size - 300)
      });
    }
    core.vitalNodes = nodes;

    const connections: { p1: number; p2: number }[] = [];
    // Clean curved links
    for (let i = 0; i < nodes.length; ++i) {
      const nearest = nodes
        .map((node, index) => ({ index, dist: Math.hypot(node.x - nodes[i].x, node.y - nodes[i].y) }))
        .filter(n => n.index !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 2);

      nearest.forEach(n => {
        const linkExists = connections.some(
          c => (c.p1 === i && c.p2 === n.index) || (c.p1 === n.index && c.p2 === i)
        );
        if (!linkExists) {
          connections.push({ p1: i, p2: n.index });
        }
      });
    }
    core.vitalConnections = connections;
  };

  // Level Reset game logic
  const initiateReset = () => {
    const core = stateRef.current;
    
    // Position player in exact middle and initialize segments
    core.player.x = (gameMode === 'demo' || gameMode === 'infinite') ? EXPLORATION_WORLD_WIDTH / 2 : 1425;
    core.player.y = 1425;
    core.player.vx = 0;
    core.player.vy = 0;
    core.player.angle = 0;
    core.player.targetAngle = 0;
    core.player.length = 4;
    core.player.targetLength = 4;
    core.player.energy = 40;
    core.player.score = 0;
    core.player.evolution = 'SPARK';
    core.player.damageCooldown = 0;
    core.player.wingPhase = 0;
    core.player.orbitPhase = 0;
    core.player.gridBoundTicks = 0;
    core.player.ticksSinceLastDamage = 0;
    
    // Initialize starting visual profile (E1 - Baby Core)
    const initMode = gameMode === 'infinite' ? 'survival_nexus' : (gameMode === 'vital_flow' ? 'vital_flow' : 'red_vital');
    const initEnergy = (initMode === 'red_vital' || gameMode === 'infinite') ? 0 : 40;
    
    // Reset Red Vital single source of truth and anti-jump helpers
    core.redVitalEvolutionEnergy = 0;
    core.redVitalVisualStage = 1;
    core.redVitalInternalCoreCount = 1;
    core.lastCountdownStepPlayed = "";
    
    core.player.pickupEvolutionEnergy = 0;
    core.player.currentEvolutionStage = 1;
    core.player.displayedEvolutionStage = 1;
    core.player.internalCoreCount = 1;
    core.player.progressionToNextStage = 0;
    (core.player as any).visualStage = 1;
    (core.player as any).energyCollected = 0;
    (core.player as any).cachedVisualProfile = null;
    (core.player as any).lastEvolutionStage = 1;
    
    core.player.visualProfile = getOrbiSerpentEvolutionVisualProfile({
      mode: initMode,
      pickupsOrEnergy: initEnergy
    });

    if (gameMode === 'demo') {
      setShowCompactControlHint(true);
    }

    core.evolutionCinematic = {
      active: false,
      timer: 0,
      stage: ''
    };

    core.camera.x = (gameMode === 'demo' || gameMode === 'infinite') ? EXPLORATION_WORLD_WIDTH / 2 : 1425;
    core.camera.y = 1425;
    core.camera.zoom = 0.95;
    core.camera.shakeTime = 0;
    core.camera.shakeIntensity = 0;

    core.ability.active = false;
    core.ability.cooldownRemaining = 0;
    core.ability.activeTimer = 0;

    // Reset threat and events
    core.timeElapsed = 0;
    core.threatLevel = 0;
    core.corruptionZones = [];
    core.surgeTimer = 0;
    core.surgeActive = false;
    core.perfectPurgeEligible = true;
    core.sentinel = null;
    core.sentinelDamageTakenThisFight = 0;
    core.sentinelTimeActive = 0;
    core.statsExtra = {
      zonesPurified: 0,
      blackoutOrbsPurified: 0,
      blackoutSurgesSurvived: 0,
      maxCombo: 0,
      maxEvolution: 'SPARK',
      sentinelsEncountered: 0,
      sentinelsPurged: 0,
      timeToPurgeSentinel: 0,
      damageTakenDuringSentinel: 0,
      perfectSentinelPurge: false,
      nexusGuardianReached: false
    };

    core.gameMode = gameMode;
    if (gameMode === 'infinite') {
      core.survival = createInitialSurvivalState();
    } else {
      core.survival = undefined as any;
    }

    if (gameMode === 'vital_flow') {
      const initialBounds = getVitalFlowArenaBounds();
      core.vitalFlow = {
        elapsedTime: 0,
        lengthScore: 4,
        targetBodyLength: 4,
        currentBodyLength: 4,
        pickupsCollected: 0,
        pickups: [] as VitalFlowPickup[],
        speed: 155,
        lastGridX: 0,
        lastGridY: 0,
        gridStepTimer: 0,
        direction: { x: 1, y: 0 },
        desiredDirection: { x: 1, y: 0 },
        hasStartedMoving: true,
        collapseReason: null as string | null,
        spawnGraceTimer: 1.25,
        resizeGraceTimer: 0,
        lastEvolutionStage: 1,
        evolutionFlashTimer: 0,
        lastEvolutionLabel: "Chispa Primordial",
        arenaBounds: {
          left: initialBounds.left,
          right: initialBounds.right,
          top: initialBounds.top,
          bottom: initialBounds.bottom,
          width: initialBounds.width,
          height: initialBounds.height,
          centerX: initialBounds.centerX,
          centerY: initialBounds.centerY,
        },
        head: { x: 0, y: 0 },
        bodyPoints: [] as { x: number; y: number }[]
      } as any;
      resetVitalFlowPlayerPosition();
      spawnVitalFlowPickups(core);
    } else {
      core.vitalFlow = undefined as any;
    }

    if (gameMode === 'nexus_assault') {
      core.player.length = 12;
      core.player.targetLength = 12;

      const startEnergy = getSelectedAssaultHeroEnergy();
      const startModule = createOrbiCombatModule(startEnergy, 3, "common");
      startModule.id = 'mod_starter_initial';
      startModule.name = `${startModule.name} Initial`;

      core.assaultRun = {
        hp: 100,
        maxHp: 100,
        roomIndex: 1,
        roomType: 'normal',
        roomCleared: false,
        enemies: [],
        projectiles: [],
        assaultBodyGrowth: 1,
        assaultTargetLength: 12,
        modules: [
          startModule
        ],
        enemiesKilled: 0,
        upgradesAvailable: [],
        showUpgradeSelection: false,
        synergiesActive: [],
        waveClearTimer: 0,
        run: {
          status: 'combat',
          currentRoomCleared: false
        },
        upgradeChoices: [],
        noEnemySoftlockTimer: 0,
        energyPickups: [],
        enemyProjectiles: [],
        playerProjectiles: [],
        floatingEnergyOrbs: [],
        droppedEnergy: [],
        pickups: [],
        particles: []
      };
      setAssaultRunHp(100);
      setAssaultRunMaxHp(100);
      setAssaultRunRoom(1);
      setAssaultRunCleared(false);
      setAssaultKills(0);
      setAssaultUpgradeActive(false);
      setUpgradesList([]);
    }
    core.objectives = INITIAL_DEMO_OBJECTIVES.map(o => ({ ...o, completed: false, completedAt: undefined }));
    core.victoryTriggered = false;
    core.victoryDelayTimer = 0;

    // Reset list
    core.orbs = [];
    core.obstacles = [];
    core.particles = [];
    core.floatingTexts = [];
    
    // Spawn initial items
    spawnOrbsAndSingularities();

    if (gameMode === 'nexus_assault') {
      spawnAssaultEnemiesForRoom(1);
    }
    
    // Refresh display
    setStats({
      score: 0,
      energy: 40,
      highScore: stats.highScore,
      length: 8,
      evolution: 'SPARK',
    });

    setObjectives(INITIAL_DEMO_OBJECTIVES.map(o => ({ ...o, completed: false, completedAt: undefined })));
    setCompletedBanner(null);
    setShowInfiniteBanner(false);
    setEndGameStats(null);

    setAbilityActive(false);
    setAbilityCooldownRemaining(0);
    setNotificationMsg('');
  };

  // REBOOT 1.0 — RESTABLECER DATOS LOCALES (Parte 11)
  const handleResetLocalData = () => {
    try {
      localStorage.removeItem("orbiNexusTutorialEnabled");
      localStorage.removeItem("orbiNexusTutorialCompleted");
      localStorage.removeItem("orbiNexusTutorialCompletedSteps");
      localStorage.removeItem("orbi_high_score");
      localStorage.removeItem("orbi_best_demo_run");
      localStorage.removeItem("orbi_best_survival_time");
      localStorage.removeItem("orbi_best_survival_score");
    } catch {
      // Ignore
    }
    setTutorialEnabled(true);
    setCompletedTutorialSteps([]);
    setStats(prev => ({ ...prev, highScore: 0 }));
    setBestDemoRun(null);
    setBestSurvivalTime(0);
    setBestSurvivalScore(0);
    showTemporaryMessage("DATOS DE DEMO PURGADOS");
  };

  // Find safe spawn position far from player and boundaries
  const findSafeSpawnPosition = () => {
    const core = stateRef.current;
    const size = core.arenaSize;
    const worldWidth = core.arenaWidth;
    const p = core.player;

    let bestX = worldWidth / 2;
    let bestY = size / 2;
    let attempts = 0;
    let found = false;

    while (attempts < 50 && !found) {
      attempts++;
      const testX = SPAWN_SAFETY.minDistanceFromBoundary + Math.random() * (worldWidth - SPAWN_SAFETY.minDistanceFromBoundary * 2);
      const testY = SPAWN_SAFETY.minDistanceFromBoundary + Math.random() * (size - SPAWN_SAFETY.minDistanceFromBoundary * 2);
      const distToPlayer = Math.hypot(testX - p.x, testY - p.y);

      if (distToPlayer >= SPAWN_SAFETY.minDistanceFromPlayer && distToPlayer <= SPAWN_SAFETY.maxDistanceFromPlayer) {
        bestX = testX;
        bestY = testY;
        found = true;
      }
    }

    return { x: bestX, y: bestY };
  };

  // Find safe spawn position for Corrupted Core Sentinel
  const findSafeSentinelSpawnPosition = () => {
    const core = stateRef.current;
    const size = core.arenaSize;
    const worldWidth = core.arenaWidth;
    const p = core.player;

    let bestX = worldWidth / 2;
    let bestY = size / 2;
    let attempts = 0;
    let found = false;

    while (attempts < 80 && !found) {
      attempts++;
      const testX = SENTINEL_SPAWN_SAFETY.minDistanceFromBoundary + Math.random() * (worldWidth - SENTINEL_SPAWN_SAFETY.minDistanceFromBoundary * 2);
      const testY = SENTINEL_SPAWN_SAFETY.minDistanceFromBoundary + Math.random() * (size - SENTINEL_SPAWN_SAFETY.minDistanceFromBoundary * 2);
      const distToPlayer = Math.hypot(testX - p.x, testY - p.y);

      const minDistance = attempts > 40 ? SENTINEL_SPAWN_SAFETY.minDistanceFromPlayer : SENTINEL_SPAWN_SAFETY.preferredDistanceFromPlayer;
      if (distToPlayer >= minDistance) {
        bestX = testX;
        bestY = testY;
        found = true;
      }
    }

    return { x: bestX, y: bestY };
  };

  // Spawn Corruption Zone
  const spawnCorruptionZone = () => {
    const core = stateRef.current;
    if (core.corruptionZones.filter(z => z.active || z.formingTimer !== undefined).length >= 3) return; // Prevent saturation

    const pos = findSafeSpawnPosition();
    const id = Math.random().toString(36).substring(2, 7);

    core.corruptionZones.push({
      id,
      x: pos.x,
      y: pos.y,
      radius: 180 + Math.random() * 80, // radius around 180 to 260
      intensity: 0.1,
      duration: 0,
      maxDuration: 25, // stays for up to 25 seconds unless purified
      purifiedAmount: 0,
      requiredPurification: 100, // needs 100 points of purification
      active: false,
      formingTimer: 60 // 1 second of warning at 60fps
    });

    showTemporaryMessage("CORRUPTION FORMING");
    triggerAudioSign("Corruption forming", "blackout");
  };

  // Start Blackout Surge Event
  const triggerBlackoutSurge = () => {
    const core = stateRef.current;
    if (core.surgeActive) return;

    const pos = findSafeSpawnPosition();
    const id = Math.random().toString(36).substring(2, 7);

    core.surgeActive = true;
    core.surgeTimer = 10; // 10 seconds duration
    core.perfectPurgeEligible = true;

    // 1. Create a special corruption zone for the surge
    const zoneRadius = 240;
    core.corruptionZones.push({
      id,
      x: pos.x,
      y: pos.y,
      radius: zoneRadius,
      intensity: 0.2,
      duration: 0,
      maxDuration: 12, // matches surge
      purifiedAmount: 0,
      requiredPurification: 120,
      active: false,
      formingTimer: 60 // 1 second warning
    });

    // 2. Spawn 5-7 Blackout Orbs clustered around pos
    for (let i = 0; i < 6; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (zoneRadius - 40);
      const orbX = pos.x + Math.cos(angle) * dist;
      const orbY = pos.y + Math.sin(angle) * dist;

      core.orbs.push({
        id: `surge_orb_${id}_${i}`,
        x: orbX,
        y: orbY,
        type: 'BLACKOUT',
        radius: 8,
        pulsePhase: Math.random() * Math.PI,
        pulseSpeed: 0.05,
        glowSize: 20,
        energyValue: -12,
        scoreValue: -25
      });
    }

    // 3. Spawn 3-4 temporary obstacles (Blackout fragments) around pos
    const numObs = 3 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numObs; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * (zoneRadius - 60);
      const obsX = pos.x + Math.cos(angle) * dist;
      const obsY = pos.y + Math.sin(angle) * dist;

      core.obstacles.push({
        id: `surge_obs_${id}_${i}`,
        x: obsX,
        y: obsY,
        radius: 10 + Math.random() * 6,
        vertices: Array.from({ length: 6 }, () => 0.8 + Math.random() * 0.4),
        rotation: Math.random() * Math.PI * 2,
        spinSpeed: (0.015 + Math.random() * 0.02) * (Math.random() < 0.5 ? 1 : -1),
        energyDamage: 22,
        scorePenalty: 50,
        pulsePhase: Math.random() * Math.PI,
        temporary: true,
        lifetime: 20 // seconds
      });
    }

    showTemporaryMessage("BLACKOUT SURGE DETECTED");
    triggerAudioSign("Blackout Surge started", 'blackout');

    // Spark burst at center of surge
    triggerBurstSparks(pos.x, pos.y, '#a855f7', 'BLACKOUT_SMOKE', 30);
  };

  // ========================================================
  // VITAL FLOW RECOVERY LOCK:
  // La implementación funcional recuperada depende de:
  // - core.vitalFlow dentro de stateRef.current;
  // - gameLoop principal sincronizado por dt;
  // - drawPremiumOrbiSerpent;
  // - handleVitalFlowInput;
  // - updateVitalFlowMovement;
  // - colisiones propias de Vital Flow;
  // - tutorial desactivado en este modo.
  //
  // No reemplazar con canvas paralelo ni setInterval.
  // ========================================================

  const ENABLE_VITAL_FLOW_RECOVERY_POLISH = true;
  const ENABLE_VITAL_FLOW_FIXED_ARENA_BOUNDS = true;
  const ENABLE_VITAL_FLOW_EVOLUTION_FLASH = true;
  const ENABLE_VITAL_FLOW_LONG_TAIL_RENDER_OPTIMIZATION = true;

  const getActiveVitalFlowArenaBounds = (): VitalFlowArenaBounds => {
    const core = stateRef.current;
    if (
      ENABLE_VITAL_FLOW_FIXED_ARENA_BOUNDS &&
      core.gameMode === 'vital_flow' &&
      core.vitalFlow?.arenaBounds
    ) {
      return core.vitalFlow.arenaBounds;
    }
    return getVitalFlowArenaBounds();
  };

  const getVitalFlowEvolutionLabel = (stage: number): string => {
    switch (stage) {
      case 1: return "Chispa Primordial";
      case 2: return "Resonancia Solar";
      case 3: return "Flujo de Plasma";
      case 4: return "Young Foton";
      case 5: return "Corriente Cósmica";
      case 6: return "Súper-Aura Serpent";
      case 7: return "Guardián de la Red";
      case 8: return "Flujo Divino";
      default: return "Sincronización Vital";
    }
  };

  const getVitalFlowEvolutionProgress = (pickups: number): { percent: number; current: number; target: number } => {
    if (pickups >= 128) return { percent: 100, current: 128, target: 128 };
    if (pickups >= 98) return { percent: ((pickups - 98) / 30) * 100, current: pickups - 98, target: 30 };
    if (pickups >= 72) return { percent: ((pickups - 72) / 26) * 100, current: pickups - 72, target: 26 };
    if (pickups >= 50) return { percent: ((pickups - 50) / 22) * 100, current: pickups - 50, target: 22 };
    if (pickups >= 32) return { percent: ((pickups - 32) / 18) * 100, current: pickups - 32, target: 18 };
    if (pickups >= 18) return { percent: ((pickups - 18) / 14) * 100, current: pickups - 18, target: 14 };
    if (pickups >= 8) return { percent: ((pickups - 8) / 10) * 100, current: pickups - 8, target: 10 };
    return { percent: (pickups / 8) * 100, current: pickups, target: 8 };
  };

  const getVitalFlowRenderableSegments = (segments: any[]) => {
    if (!ENABLE_VITAL_FLOW_LONG_TAIL_RENDER_OPTIMIZATION) return segments;

    const core = stateRef.current;
    const isMobile = viewport.deviceProfile === 'mobile';
    const lowEffectsMode = core?.lowEffectsMode === true;

    const maxRenderSegments =
      lowEffectsMode ? 80 :
      isMobile ? 100 :
      140;

    if (segments.length <= maxRenderSegments) return segments;

    // preservar cabeza y cola; muestrear segmentos intermedios
    const sampled = [];
    const step = Math.ceil(segments.length / maxRenderSegments);

    for (let i = 0; i < segments.length; i += step) {
      sampled.push(segments[i]);
    }

    const last = segments[segments.length - 1];
    if (sampled[sampled.length - 1] !== last) sampled.push(last);

    return sampled;
  };

  const ENABLE_VITAL_FLOW_DEBUG_BOUNDS = true;

  const getVitalFlowArenaBounds = (): VitalFlowArenaBounds => {
    const marginX = 90;
    const marginTop = 150;
    const marginBottom = 90;

    const baseWidth = dimensions.width - marginX * 2;
    const baseHeight = dimensions.height - (marginTop + marginBottom);

    // Double the size (2x width and 2x height)
    let playWidth = baseWidth * 2;
    let playHeight = baseHeight * 2;

    if (ENABLE_VITAL_FLOW_ARENA_SCALE_FIX) {
      playWidth *= VITAL_FLOW_ARENA_SCALE;
      playHeight *= VITAL_FLOW_ARENA_SCALE;
    }

    // Center around the standard arena coordinates to utilize the node structure
    const centerX = 1425;
    const centerY = 1425;

    const left = centerX - playWidth / 2;
    const right = centerX + playWidth / 2;
    const top = centerY - playHeight / 2;
    const bottom = centerY + playHeight / 2;

    return {
      left,
      right,
      top,
      bottom,
      width: playWidth,
      height: playHeight,
      centerX,
      centerY,
    };
  };

  const resetVitalFlowPlayerPosition = () => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    const bounds = getActiveVitalFlowArenaBounds();
    const startX = bounds.centerX;
    const startY = bounds.centerY;

    core.vitalFlow.head = { x: startX, y: startY };
    core.vitalFlow.direction = { x: 1, y: 0 };
    core.vitalFlow.desiredDirection = { x: 1, y: 0 };
    core.vitalFlow.hasReceivedInput = false;
    core.vitalFlow.spawnGraceTimer = 1.25;

    core.vitalFlow.bodyPoints = [
      { x: startX, y: startY },
      { x: startX - 16, y: startY },
      { x: startX - 32, y: startY },
      { x: startX - 48, y: startY }
    ];

    // Sync player global state for rendering
    core.player.x = startX;
    core.player.y = startY;
    core.player.vx = 4;
    core.player.vy = 0;
    core.player.angle = 0;
    core.player.targetAngle = 0;
    core.player.length = 4;
    core.player.targetLength = 4;
    core.player.evolution = 'SPARK';

    // Initialize starting visual profile for Vital Flow (E1 - Baby Core)
    core.player.visualProfile = getOrbiSerpentEvolutionVisualProfile({
      mode: 'vital_flow',
      pickupsOrEnergy: 0
    });

    core.player.segments = [
      { x: startX, y: startY, angle: 0, size: 15 },
      { x: startX - 16, y: startY, angle: 0, size: 15 },
      { x: startX - 32, y: startY, angle: 0, size: 15 },
      { x: startX - 48, y: startY, angle: 0, size: 15 }
    ];

    // Center camera on the viewport with no zoom scrolling
    core.camera.x = dimensions.width / 2;
    core.camera.y = dimensions.height / 2;
    core.camera.zoom = 1.0;
  };

  const handleVitalFlowKeyboardInput = (event: KeyboardEvent) => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      resetVitalFlowPlayerPosition();
      core.vitalFlow.pickups = [];
      spawnVitalFlowPickups(core);
      return;
    }

    let next = null;

    if (event.key === "ArrowUp" || event.key.toLowerCase() === "w") {
      next = { x: 0, y: -1 };
    }
    if (event.key === "ArrowDown" || event.key.toLowerCase() === "s") {
      next = { x: 0, y: 1 };
    }
    if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
      next = { x: -1, y: 0 };
    }
    if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
      next = { x: 1, y: 0 };
    }

    if (!next) return;

    event.preventDefault();

    const current = core.vitalFlow.direction ?? { x: 1, y: 0 };

    const isReverse =
      current.x + next.x === 0 &&
      current.y + next.y === 0;

    const allowReverse =
      (core.vitalFlow.currentBodyLength ?? 0) < 40 ||
      (core.vitalFlow.pickupsCollected ?? 0) < 2;

    if (isReverse && !allowReverse) return;

    core.vitalFlow.desiredDirection = next;
    core.vitalFlow.hasReceivedInput = true;
    core.activeControlMode = 'keyboard';
  };

  // QA-01C: single source of truth for rendering and pointer hit-testing.
  const getViewportCamera = () => {
    const core = stateRef.current;
    const viewW = Math.max(1, dimensions.width);
    const viewH = Math.max(1, dimensions.height);
    const padding = Math.min(20, viewW * 0.025, viewH * 0.025);
    let zoom = core.camera.zoom;
    let centerX = core.camera.x;
    let centerY = core.camera.y;

    if (core.gameMode === 'nexus_assault') {
      const extent = NEXUS_ASSAULT_ARENA_RADIUS * 1.10;
      zoom = Math.min(
        Math.max(1, viewW - padding * 2) / (extent * 2),
        Math.max(1, viewH - padding * 2) / (extent * 2)
      );
      centerX = 1425;
      centerY = 1425;
    } else if (core.gameMode === 'vital_flow' && core.vitalFlow) {
      const bounds = getActiveVitalFlowArenaBounds();
      zoom = Math.min(
        Math.max(1, viewW - padding * 2) / Math.max(1, bounds.width),
        Math.max(1, viewH - padding * 2) / Math.max(1, bounds.height)
      );
      centerX = bounds.centerX;
      centerY = bounds.centerY;
    } else {
      // Exploration worlds intentionally extend beyond the normal viewport.
      // Never force a cover-zoom when the browser is zoomed out: doing so
      // cancels the user's attempt to inspect the complete world.
      zoom = Math.max(0.05, zoom);
      const halfW = viewW / (2 * zoom);
      const halfH = viewH / (2 * zoom);
      // QA-01G-4: the exploration camera tracks the actual player even at
      // reduced browser/game zoom. Keeping the reset-time camera coordinates
      // fixed caused the serpent to disappear beyond the initial viewport.
      // For an axis that fits entirely, keep that axis centered on the world.
      if (core.gameState === 'PLAYING') {
        centerX = core.player.x;
        centerY = core.player.y;
      }
      centerX = halfW >= core.arenaWidth / 2
        ? core.arenaWidth / 2
        : Math.max(halfW, Math.min(core.arenaWidth - halfW, centerX));
      centerY = halfH >= core.arenaSize / 2
        ? core.arenaSize / 2
        : Math.max(halfH, Math.min(core.arenaSize - halfH, centerY));
    }

    return { viewW, viewH, zoom: Math.max(0.001, zoom), centerX, centerY };
  };

  const pointerToWorld = (clientX: number, clientY: number) => {
    const { viewW, viewH, zoom, centerX, centerY } = getViewportCamera();
    const rect = canvasRef.current?.getBoundingClientRect();
    const localX = rect ? (clientX - rect.left) * (viewW / Math.max(1, rect.width)) : clientX;
    const localY = rect ? (clientY - rect.top) * (viewH / Math.max(1, rect.height)) : clientY;
    return {
      x: centerX + (localX - viewW / 2) / zoom,
      y: centerY + (localY - viewH / 2) / zoom,
    };
  };

  const handleVitalFlowPointerInput = (pointerX: number, pointerY: number) => {
    const core = stateRef.current;
    if (!core.vitalFlow || gameMode !== "vital_flow") return;

    const { x: worldX, y: worldY } = pointerToWorld(pointerX, pointerY);

    const head = core.vitalFlow.head ?? { x: core.player.x, y: core.player.y };
    const dx = worldX - head.x;
    const dy = worldY - head.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      core.vitalFlow.desiredDirection = { x: dx > 0 ? 1 : -1, y: 0 };
    } else {
      core.vitalFlow.desiredDirection = { x: 0, y: dy > 0 ? 1 : -1 };
    }

    core.vitalFlow.hasReceivedInput = true;
    core.vitalFlow.hasStartedMoving = true;
  };

  const spawnVitalFlowPickups = (core: any) => {
    if (!core.vitalFlow) return;
    const countNeeded = core.vitalFlow.pickupsCollected >= 32 ? 2 : 1;
    const currentCount = core.vitalFlow.pickups.length;
    
    const bounds = getActiveVitalFlowArenaBounds();

    for (let i = currentCount; i < countNeeded; i++) {
      let x = 0;
      let y = 0;
      let safe = false;
      let attempts = 0;
      
      while (!safe && attempts < 100) {
        attempts++;
        x = bounds.left + 60 + Math.random() * (bounds.width - 120);
        y = bounds.top + 60 + Math.random() * (bounds.height - 120);
        
        // Check distance to player head
        const distToPlayer = Math.hypot(core.player.x - x, core.player.y - y);
        if (distToPlayer < 120) continue;
        
        // Check distance to body segments
        let farFromSegments = true;
        for (const seg of core.player.segments) {
          if (Math.hypot(seg.x - x, seg.y - y) < 80) {
            farFromSegments = false;
            break;
          }
        }
        
        if (!farFromSegments) continue;
        
        // Check distance to other vital flow pickups
        let farFromPickups = true;
        for (const p of core.vitalFlow.pickups) {
          if (Math.hypot(p.x - x, p.y - y) < 120) {
            farFromPickups = false;
            break;
          }
        }
        
        if (!farFromPickups) continue;
        
        safe = true;
      }
      
      let kind: "solar_orb" | "nexus_core" = "solar_orb";
      if (core.vitalFlow.pickupsCollected >= 18 && Math.random() < 0.3) {
        kind = "nexus_core";
      }
      
      core.vitalFlow.pickups.push({
        id: `vf_pickup_${Date.now()}_${Math.random()}`,
        x,
        y,
        kind,
        energyValue: kind === "solar_orb" ? 1 : 2,
        scoreValue: kind === "solar_orb" ? 10 : 25,
        radius: 10,
        pulsePhase: Math.random() * Math.PI
      });
    }
  };

  // Spawn Solar, Nexus, and Blackout Singularities
  const spawnOrbsAndSingularities = () => {
    const core = stateRef.current;
    if (core.gameMode === 'nexus_assault' || core.gameMode === 'vital_flow') return;
    const size = core.arenaSize;
    const worldWidth = core.arenaWidth;

    // Keep clean, clear spawns in space
    const targetSolar = 40;
    const targetNexus = 12;
    const targetBlackout = 10;
    const targetSingularities = 18;

    while (core.orbs.length < targetSolar + targetNexus + targetBlackout) {
      let type: OrbType = 'SOLAR';
      const rand = Math.random();
      if (rand < 0.65) {
        type = 'SOLAR';
      } else if (rand < 0.82) {
        type = 'NEXUS';
      } else {
        type = 'BLACKOUT';
      }

      const x = 120 + Math.random() * (worldWidth - 240);
      const y = 120 + Math.random() * (size - 240);
      
      // Prevent spawning overlapping elements near starting center
      if (Math.hypot(x - worldWidth / 2, y - size / 2) < 300) continue;

      const isSolar = type === 'SOLAR';
      const isNexus = type === 'NEXUS';
      const isBlackout = type === 'BLACKOUT';

      core.orbs.push({
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        type,
        radius: isSolar ? 7 : isNexus ? 10 : 8,
        pulsePhase: Math.random() * Math.PI,
        pulseSpeed: 0.04 + Math.random() * 0.03,
        glowSize: isSolar ? 18 : isNexus ? 28 : 20,
        energyValue: isSolar ? 4 : isNexus ? 15 : -12,
        scoreValue: isSolar ? 10 : isNexus ? 35 : -25
      });
    }

    while (core.obstacles.length < targetSingularities) {
      const x = 150 + Math.random() * (worldWidth - 300);
      const y = 150 + Math.random() * (size - 300);

      if (Math.hypot(x - worldWidth / 2, y - size / 2) < 400) continue;

      core.obstacles.push({
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        radius: 12 + Math.random() * 8,
        vertices: Array.from({ length: 6 }, () => 0.82 + Math.random() * 0.36),
        rotation: Math.random() * Math.PI * 2,
        spinSpeed: (0.01 + Math.random() * 0.02) * (Math.random() < 0.5 ? 1 : -1),
        energyDamage: 22,
        scorePenalty: 50,
        pulsePhase: Math.random() * Math.PI
      });
    }
  };

  // Spawn Corrupted Core Sentinel
  const spawnSentinel = () => {
    const core = stateRef.current;
    if (core.sentinel || core.statsExtra.sentinelsEncountered >= SENTINEL_SPAWN_CONFIG.maxSentinelsPerRun) return;

    const pos = findSafeSentinelSpawnPosition();
    core.sentinel = {
      id: `sentinel_${Math.random().toString(36).substring(2, 7)}`,
      x: pos.x,
      y: pos.y,
      radius: 45,
      health: SENTINEL_BALANCE.maxHealth,
      maxHealth: SENTINEL_BALANCE.maxHealth,
      shield: SENTINEL_BALANCE.maxShield,
      maxShield: SENTINEL_BALANCE.maxShield,
      phase: "forming",
      spawnTimer: SENTINEL_SPAWN_CONFIG.spawnWarningSeconds * 60, // 3 seconds at 60fps
      attackTimer: 120, // 2 seconds delay before first attack
      vulnerabilityTimer: 0,
      pulseTimer: 0,
      defeated: false
    };

    core.statsExtra.sentinelsEncountered++;
    core.sentinelDamageTakenThisFight = 0;
    core.sentinelTimeActive = 0;

    showTemporaryMessage("BLACKOUT CORE DETECTED");
    triggerAudioSign("Sentinel detected", "blackout");
    onSentinelDetected();
  };

  // Defeat Corrupted Core Sentinel
  const defeatSentinel = () => {
    const core = stateRef.current;
    if (!core.sentinel || core.sentinel.defeated) return;

    const s = core.sentinel;
    const p = core.player;

    s.defeated = true;
    s.phase = "defeated";

    core.statsExtra.sentinelsPurged++;
    core.statsExtra.timeToPurgeSentinel = Math.round(core.sentinelTimeActive);

    // Reward points and energy
    p.score += SENTINEL_REWARD.score;
    p.energy = Math.min(220, p.energy + SENTINEL_REWARD.energy);

    // Perfect Sentinel Purge criteria
    const tookDamage = core.sentinelDamageTakenThisFight > 0;
    if (!tookDamage) {
      const perfectBonus = 1500;
      p.score += perfectBonus;
      core.statsExtra.perfectSentinelPurge = true;

      showTemporaryMessage("PERFECT SENTINEL PURGE");
      triggerAudioSign("Perfect purge", "evolve");
      onPerfectSentinelPurge();

      triggerBurstSparks(s.x, s.y, '#fbbf24', 'EVOLUTION_EXPLOSION', 45);
      triggerBurstSparks(s.x, s.y, '#22d3ee', 'GRID_GLOW', 35);

      core.floatingTexts.push({
        id: Math.random().toString(),
        x: s.x,
        y: s.y - 45,
        text: 'PERFECT PURGE',
        color: '#fbbf24',
        life: 3.0,
        size: 26
      });
    } else {
      showTemporaryMessage("SENTINEL PURGED");
      triggerAudioSign("Sentinel Defeated", "evolve");
      onSentinelDefeated();

      triggerBurstSparks(s.x, s.y, '#fbbf24', 'EVOLUTION_EXPLOSION', 30);
      triggerBurstSparks(s.x, s.y, '#22d3ee', 'GRID_GLOW', 20);
    }

    core.camera.shakeTime = 30;
    core.camera.shakeIntensity = 12.0;

    // Reduce global threat level on boss defeat
    core.timeElapsed = Math.max(0, core.timeElapsed - SENTINEL_REWARD.threatReductionSeconds);

    core.floatingTexts.push({
      id: Math.random().toString(),
      x: s.x,
      y: s.y - 20,
      text: 'THE RED VITAL STABILIZES',
      color: '#cbd5e1',
      life: 2.0,
      size: 13
    });

    // Dissolve delay
    setTimeout(() => {
      const liveCore = stateRef.current;
      if (liveCore.sentinel && liveCore.sentinel.id === s.id) {
        liveCore.sentinel = null;
      }
    }, 1500);
  };

  // Sentinel Attack 1 — Corruption Pulse
  const triggerCorruptionPulseAttack = (s: CorruptedCoreSentinel) => {
    const core = stateRef.current;
    
    core.floatingTexts.push({
      id: Math.random().toString(),
      x: s.x,
      y: s.y - 45,
      text: "¡ONDA SÍSMICA BLACKOUT!",
      color: '#ef4444',
      life: 1.5,
      size: 14
    });

    // Ring shockwave particles
    for (let i = 0; i < 30; i++) {
      const angle = (i / 30) * Math.PI * 2;
      core.particles.push({
        id: Math.random().toString(),
        x: s.x,
        y: s.y,
        vx: Math.cos(angle) * 5.5,
        vy: Math.sin(angle) * 5.5,
        color: s.phase === 'enraged' ? '#ef4444' : '#a855f7',
        size: 5 + Math.random() * 5,
        alpha: 1.0,
        life: 1.0,
        decay: 0.025,
        type: 'COLLECT_SHOCKWAVE'
      });
    }

    // Instantly check distance sweep (since shockwave moves at high velocity)
    const p = core.player;
    const d = Math.hypot(p.x - s.x, p.y - s.y);
    if (d < 240) {
      if (p.damageCooldown <= 0) {
        const theme = GUARDIAN_THEMES[core.activeGuardian];
        const damageTaken = Math.round((s.phase === 'enraged' ? 26 : 18) * theme.resistanceModifier);

        p.energy = Math.max(0, p.energy - damageTaken);
        p.score = Math.max(0, p.score - 75);
        p.damageCooldown = 60;
        p.ticksSinceLastDamage = 0;
        core.consecutiveCollects = 0;
        core.consecutiveTimer = 0;
        core.perfectPurgeEligible = false;
        core.statsExtra.damageTakenDuringSentinel += damageTaken;
        core.sentinelDamageTakenThisFight += damageTaken;

        core.camera.shakeTime = 16;
        core.camera.shakeIntensity = 9.0;
        triggerAudioSign('Fuga de plasma (DAÑO)', 'blackout');
        setDamageFlashing(true);
        setTimeout(() => setDamageFlashing(false), 240);

        core.floatingTexts.push({
          id: Math.random().toString(),
          x: p.x,
          y: p.y - 20,
          text: `-${damageTaken}% IMPULSO`,
          color: '#ef4444',
          life: 1.2,
          size: 14
        });
      }
    }
  };

  // Sentinel Attack 2 — Blackout Seeds
  const triggerBlackoutSeedsAttack = (s: CorruptedCoreSentinel) => {
    const core = stateRef.current;

    core.floatingTexts.push({
      id: Math.random().toString(),
      x: s.x,
      y: s.y - 45,
      text: "¡SEMILLAS BLACKOUT!",
      color: '#a855f7',
      life: 1.5,
      size: 13
    });

    const numSeeds = 4 + Math.floor(Math.random() * 3);
    for (let i = 0; i < numSeeds; i++) {
      const angle = (i / numSeeds) * Math.PI * 2 + Math.random() * 0.5;
      const dist = 100 + Math.random() * 80;
      const orbX = s.x + Math.cos(angle) * dist;
      const orbY = s.y + Math.sin(angle) * dist;

      core.orbs.push({
        id: `sentinel_seed_${s.id}_${Date.now()}_${i}`,
        x: orbX,
        y: orbY,
        type: 'BLACKOUT',
        radius: 8,
        pulsePhase: Math.random() * Math.PI,
        pulseSpeed: 0.05,
        glowSize: 20,
        energyValue: -12,
        scoreValue: -25
      });

      triggerBurstSparks(orbX, orbY, '#a855f7', 'BLACKOUT_SMOKE', 8);
    }

    triggerAudioSign("Sentinel attack", "blackout");
  };

  // Sentinel Attack 3 — Fragment Orbit
  const triggerFragmentOrbitAttack = (s: CorruptedCoreSentinel) => {
    const core = stateRef.current;

    core.floatingTexts.push({
      id: Math.random().toString(),
      x: s.x,
      y: s.y - 45,
      text: "¡FRAGMENTOS EN ÓRBITA!",
      color: '#cbd5e1',
      life: 1.5,
      size: 13
    });

    const numFrags = 3;
    const baseAngle = Math.random() * Math.PI * 2;
    for (let i = 0; i < numFrags; i++) {
      const angle = baseAngle + (i / numFrags) * Math.PI * 2;
      const dist = 120;
      const obsX = s.x + Math.cos(angle) * dist;
      const obsY = s.y + Math.sin(angle) * dist;

      core.obstacles.push({
        id: `sentinel_frag_${s.id}_${Date.now()}_${i}`,
        x: obsX,
        y: obsY,
        radius: 12,
        vertices: Array.from({ length: 6 }, () => 0.8 + Math.random() * 0.4),
        rotation: angle,
        spinSpeed: 0.03,
        energyDamage: 20,
        scorePenalty: 40,
        pulsePhase: Math.random() * Math.PI,
        temporary: true,
        lifetime: 10
      });

      triggerBurstSparks(obsX, obsY, '#cbd5e1', 'GRID_GLOW', 6);
    }

    triggerAudioSign("Sentinel attack", "blackout");
  };

  // Update Sentinel State Tick
  const updateSentinel = (dt: number) => {
    const core = stateRef.current;
    if (!core.sentinel) return;

    const s = core.sentinel;
    const p = core.player;

    core.sentinelTimeActive += (1 / 60) * dt;

    // 1. FORMING (WARNING STATE)
    if (s.phase === "forming") {
      s.spawnTimer -= 1 * dt;
      
      // Corrupt lines converging and particles effect
      if (Math.random() < 0.3 * dt) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 100 + Math.random() * 200;
        core.particles.push({
          id: Math.random().toString(),
          x: s.x + Math.cos(ang) * dist,
          y: s.y + Math.sin(ang) * dist,
          vx: -Math.cos(ang) * 3,
          vy: -Math.sin(ang) * 3,
          color: '#a855f7',
          size: 3 + Math.random() * 3,
          alpha: 0.8,
          life: 1.0,
          decay: 0.02,
          type: 'BLACKOUT_SMOKE'
        });
      }

      if (s.spawnTimer <= 0) {
        s.phase = "shielded";
        showTemporaryMessage("CORRUPTED CORE SENTINEL");
        triggerAudioSign("Sentinel Spawned", 'blackout');
        onSentinelSpawn();
        
        // Large explosion on spawn!
        triggerBurstSparks(s.x, s.y, '#a855f7', 'BLACKOUT_SMOKE', 35);
        triggerBurstSparks(s.x, s.y, '#fbbf24', 'SOLAR_SPARK', 15);
        
        core.camera.shakeTime = 15;
        core.camera.shakeIntensity = 6.0;
      }
      return;
    }

    if (s.defeated) return;

    // 2. TIMERS & PHASE RECOVERY
    s.pulseTimer += 1 * dt;

    // Enraged threshold check
    if (s.phase !== "vulnerable" && s.phase !== "defeated") {
      const hpPercent = s.health / s.maxHealth;
      if (hpPercent <= SENTINEL_ENRAGE.threshold && s.phase !== "enraged") {
        s.phase = "enraged";
        showTemporaryMessage("SENTINEL ENRAGED");
        triggerAudioSign("Sentinel enraged", "blackout");
        triggerBurstSparks(s.x, s.y, '#f43f5e', 'BLACKOUT_SMOKE', 40);
        core.camera.shakeTime = 20;
        core.camera.shakeIntensity = 8.0;
      }
    }

    // Vulnerable phase timer decay
    if (s.phase === "vulnerable") {
      s.vulnerabilityTimer -= (1 / 60) * dt;
      if (s.vulnerabilityTimer <= 0) {
        const hpPercent = s.health / s.maxHealth;
        s.phase = hpPercent <= SENTINEL_ENRAGE.threshold ? "enraged" : "shielded";
        s.shield = Math.round(s.maxShield * 0.6); // 60% shield restored
        showTemporaryMessage("SHIELD REGENERATED");
        triggerAudioSign("Sentinel shield restored", "blackout");
        triggerBurstSparks(s.x, s.y, '#22d3ee', 'GRID_GLOW', 15);
      }
    }

    // 3. ATTACKS SYSTEM
    const attackSpeedMult = s.phase === "enraged" ? SENTINEL_ENRAGE.attackSpeedMultiplier : 1.0;
    s.attackTimer -= 1 * dt * attackSpeedMult;

    if (s.attackTimer <= 0) {
      const rand = Math.random();
      if (rand < 0.4) {
        triggerCorruptionPulseAttack(s);
      } else if (rand < 0.75) {
        triggerBlackoutSeedsAttack(s);
      } else {
        triggerFragmentOrbitAttack(s);
      }
      
      s.attackTimer = (4 + Math.random() * 2) * 60;
    }

    // 4. DAMAGE / CONTACT CHECKS WITH PLAYER
    const distToPlayer = Math.hypot(p.x - s.x, p.y - s.y);
    if (distToPlayer < s.radius + 18) {
      if (p.damageCooldown <= 0) {
        const contactDamage = s.phase === "enraged" ? 30 : 20;
        const theme = GUARDIAN_THEMES[core.activeGuardian];
        const damageTaken = Math.round(contactDamage * theme.resistanceModifier);
        
        p.energy = Math.max(0, p.energy - damageTaken);
        p.score = Math.max(0, p.score - 100);
        p.damageCooldown = 60;
        p.ticksSinceLastDamage = 0;
        core.consecutiveCollects = 0;
        core.consecutiveTimer = 0;
        core.perfectPurgeEligible = false;

        core.statsExtra.damageTakenDuringSentinel += damageTaken;
        core.sentinelDamageTakenThisFight += damageTaken;

        core.camera.shakeTime = 18;
        core.camera.shakeIntensity = 12;
        triggerAudioSign('Fuga de plasma (DAÑO)', 'blackout');
        triggerBurstSparks(p.x, p.y, '#f43f5e', 'BLACKOUT_SMOKE', 25);
        setDamageFlashing(true);
        setTimeout(() => setDamageFlashing(false), 240);

        p.targetLength = Math.max(8, p.targetLength - 2);
        p.length = Math.max(8, p.length - 2);

        core.floatingTexts.push({
          id: Math.random().toString(),
          x: s.x,
          y: s.y - 12,
          text: `-${damageTaken}% CONTACTO NÚCLEO`,
          color: '#f43f5e',
          life: 1.2,
          size: 15
        });

        if (p.energy <= 0) {
          setGameState('GAMEOVER');
          triggerAudioSign('Red vital purgada', 'reset');
          const savedMax = localStorage.getItem('orbi_high_score');
          const prevHighScore = savedMax ? parseInt(savedMax, 10) : 0;
          if (p.score > prevHighScore) {
            localStorage.setItem('orbi_high_score', p.score.toString());
            setStats(prev => ({ ...prev, highScore: p.score }));
          }
        }
      }
    }
  };

  // Cooldown denial trigger
  const triggerCooldownDenial = () => {
    triggerAudioSign('Error de canalización', 'reset');
    setAbilityDenied(true);
    setTimeout(() => {
      setAbilityDenied(false);
    }, 250);
  };

  // Ability Action implementation
  const triggerGuardianAbility = () => {
    const core = stateRef.current;
    if (core.gameState !== 'PLAYING') return;

    const theme = GUARDIAN_THEMES[core.activeGuardian];
    const p = core.player;

    if (core.ability.cooldownRemaining > 0 || core.ability.active) {
      triggerCooldownDenial();
      return;
    }

    triggerAudioSign(theme.abilityName, 'ability');
    onSolarPulseCast();
    if (p.evolution === 'GUARDIAN_SERPENT') {
      onGuardianPulseCast();
    }

    if (tutorialEnabled && activeTutorialStep === 'solar_pulse') {
      markTutorialStepCompleted('solar_pulse');
    }

    // Select dynamic max radius based on current evolution stage
    let maxRadius = p.evolution === 'SPARK'
      ? SOLAR_PULSE_CONFIG.radiusSpark
      : p.evolution === 'SOLAR_STREAM'
        ? SOLAR_PULSE_CONFIG.radiusSolarStream
        : SOLAR_PULSE_CONFIG.radiusNexusGuardian;

    if (p.evolution === 'GUARDIAN_SERPENT') {
      maxRadius *= NEXUS_GUARDIAN_PULSE_MODIFIER.radiusMultiplier;
    }

    // Make ability active
    core.ability.active = true;
    core.ability.activeTimer = SOLAR_PULSE_CONFIG.duration * 60; // dynamic duration at 60 FPS
    core.ability.radialEffectActive = true;
    core.ability.radialEffectX = p.x;
    core.ability.radialEffectY = p.y;
    core.ability.radialEffectRadius = 10;
    core.ability.radialEffectMaxRadius = maxRadius;
    core.ability.radialEffectColor = theme.primaryColor;

    // Apply specific elemental effects
    if (core.activeGuardian === 'FOTON') {
      // Screen shake feedback
      core.camera.shakeTime = 18;
      core.camera.shakeIntensity = 4.5;

      // Pulse floating text above player's head
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: p.x,
        y: p.y - 45,
        text: p.evolution === 'GUARDIAN_SERPENT' ? 'PULSO RESONANTE' : 'PULSO SOLAR',
        color: p.evolution === 'GUARDIAN_SERPENT' ? '#22d3ee' : '#fbbf24',
        life: 1.2,
        size: p.evolution === 'GUARDIAN_SERPENT' ? 22 : 20
      });

      triggerAbilityParticleBurst(p.x, p.y, theme.primaryColor, 40);
      
      let purifiedCount = 0;

      // 1. Purify Blackout Orbs inside the radius
      core.orbs.forEach(orb => {
        if (orb.type === 'BLACKOUT') {
          const d = Math.hypot(orb.x - p.x, orb.y - p.y);
          if (d < maxRadius) {
            orb.type = 'SOLAR';
            orb.radius = 7;
            orb.glowSize = 18;
            orb.energyValue = 4;
            orb.scoreValue = 10;

            p.score += SOLAR_PULSE_CONFIG.blackoutOrbBonus;
            purifiedCount++;

            triggerBurstSparks(orb.x, orb.y, '#fbbf24', 'SOLAR_SPARK', 10);
            onSolarPulsePurify();

            // Reduce Sentinel shield / health if orb is purified close to it
            if (core.sentinel && !core.sentinel.defeated && core.sentinel.phase !== 'forming') {
              const distToSentinel = Math.hypot(orb.x - core.sentinel.x, orb.y - core.sentinel.y);
              if (distToSentinel < 250) {
                const s = core.sentinel;
                if (s.phase === 'shielded' || s.phase === 'enraged') {
                  let dmg = SENTINEL_BALANCE.purifiedOrbShieldDamage;
                  if (p.evolution === 'GUARDIAN_SERPENT') {
                    dmg = Math.round(dmg * GUARDIAN_SENTINEL_BONUS.shieldDamageMultiplier);
                    onGuardianResonance();
                  }
                  s.shield = Math.max(0, s.shield - dmg);
                  triggerBurstSparks(s.x, s.y, '#22d3ee', 'GRID_GLOW', 10);
                  
                  core.floatingTexts.push({
                    id: Math.random().toString(),
                    x: s.x,
                    y: s.y - 25,
                    text: `ESCUDO -${dmg}`,
                    color: '#22d3ee',
                    life: 1.2,
                    size: 13
                  });

                  if (s.shield <= 0) {
                    s.phase = 'vulnerable';
                    s.vulnerabilityTimer = SENTINEL_BALANCE.vulnerableDuration;
                    showTemporaryMessage("CORE EXPOSED");
                    triggerAudioSign("Sentinel shield broken", "solar");
                    onSentinelShieldBreak();
                    triggerBurstSparks(s.x, s.y, '#fbbf24', 'SOLAR_SPARK', 25);
                  }
                } else if (s.phase === 'vulnerable') {
                  let dmg = Math.round(SENTINEL_BALANCE.purifiedOrbShieldDamage * 0.5);
                  if (p.evolution === 'GUARDIAN_SERPENT') {
                    dmg = Math.round(dmg * GUARDIAN_SENTINEL_BONUS.healthDamageMultiplier);
                    onGuardianResonance();
                  }
                  s.health = Math.max(0, s.health - dmg);
                  triggerBurstSparks(s.x, s.y, '#fbbf24', 'SOLAR_SPARK', 10);
                  
                  core.floatingTexts.push({
                    id: Math.random().toString(),
                    x: s.x,
                    y: s.y - 25,
                    text: `DAÑO -${dmg}`,
                    color: '#fbbf24',
                    life: 1.2,
                    size: 13
                  });

                  if (s.health <= 0) {
                    defeatSentinel();
                  }
                }
              }
            }

            core.floatingTexts.push({
              id: Math.random().toString(),
              x: orb.x,
              y: orb.y - 20,
              text: 'PURIFIED',
              color: '#fbbf24',
              life: 1.0,
              size: 11
            });
          }
        }
      });

      // 2. Suppress Blackout Fragments (Obstacles) inside the radius
      core.obstacles.forEach(obs => {
        const d = Math.hypot(obs.x - p.x, obs.y - p.y);
        if (d < maxRadius) {
          obs.suppressedUntil = performance.now() + 2000; // Suppress damage for 2 seconds
          p.score += SOLAR_PULSE_CONFIG.blackoutObstacleBonus;
          purifiedCount++;

          triggerBurstSparks(obs.x, obs.y, '#22d3ee', 'GRID_GLOW', 12);

          core.floatingTexts.push({
            id: Math.random().toString(),
            x: obs.x,
            y: obs.y - 25,
            text: 'SUPPRESSED',
            color: '#22d3ee',
            life: 1.2,
            size: 11
          });
        }
      });

      // Update Corruption Zones within range of Pulso Solar
      core.corruptionZones.forEach(zone => {
        const d = Math.hypot(zone.x - p.x, zone.y - p.y);
        if (d < maxRadius + zone.radius) {
          let amount = d < zone.radius ? 65 : 35; // FOTON gets huge purification bonus!
          if (p.evolution === 'GUARDIAN_SERPENT') {
            amount = Math.round(amount * NEXUS_GUARDIAN_PULSE_MODIFIER.purificationMultiplier);
            onGuardianResonance();
          }
          zone.purifiedAmount += amount;
          zone.intensity = Math.max(0, zone.intensity - 0.35);

          triggerBurstSparks(zone.x, zone.y, '#22d3ee', 'GRID_GLOW', 12);
          triggerBurstSparks(zone.x, zone.y, '#fbbf24', 'SOLAR_SPARK', 10);

          core.floatingTexts.push({
            id: Math.random().toString(),
            x: zone.x,
            y: zone.y - 10,
            text: `+${amount} PURITY`,
            color: '#fbbf24',
            life: 1.2,
            size: 14
          });
        }
      });

      // Show special purges notification
      if (purifiedCount > 0) {
        triggerAudioSign('Frecuencia Purificada', 'solar');
        core.floatingTexts.push({
          id: Math.random().toString(),
          x: p.x,
          y: p.y - 20,
          text: 'BLACKOUT ENERGY PURGED',
          color: '#22d3ee',
          life: 1.5,
          size: 14
        });
      }

    } else if (core.activeGuardian === 'HYDRO') {
      triggerAbilityParticleBurst(p.x, p.y, '#38bdf8', 30);
      
      // Ola Purificadora transmutates near blackout into solars
      core.obstacles.forEach(obs => {
        const d = Math.hypot(obs.x - p.x, obs.y - p.y);
        if (d < maxRadius) {
          triggerAbilityParticleBurst(obs.x, obs.y, '#38bdf8', 12);
          core.orbs.push({
            id: Math.random().toString(36).substring(2, 9),
            x: obs.x,
            y: obs.y,
            type: 'SOLAR',
            radius: 7,
            pulsePhase: Math.random() * Math.PI,
            pulseSpeed: 0.05,
            glowSize: 18,
            energyValue: 4,
            scoreValue: 12
          });
        }
      });
      core.obstacles = core.obstacles.filter(obs => Math.hypot(obs.x - p.x, obs.y - p.y) >= maxRadius);

    } else if (core.activeGuardian === 'AERO') {
      // Wind sprint dash
      triggerAbilityParticleBurst(p.x, p.y, '#34d399', 30);
      p.speed *= 2.2; // Huge speed boost

    } else if (core.activeGuardian === 'TERMO') {
      const isTermo = core.activeGuardian === 'TERMO';
      const sparkColor = isTermo ? '#ff6a2a' : '#fef08a';
      const freezeSparkColor = isTermo ? '#ff2d00' : '#10b981';
      triggerAbilityParticleBurst(p.x, p.y, sparkColor, 30);
      
      // Paraliza blackout fragments & pulls orbs
      core.obstacles.forEach(obs => {
        const d = Math.hypot(obs.x - p.x, obs.y - p.y);
        if (d < maxRadius) {
          obs.frozenTicks = 240; // Freeze for 4 seconds
          triggerAbilityParticleBurst(obs.x, obs.y, freezeSparkColor, 8);
        }
      });

      // Pull orbs gently towards player
      core.orbs.forEach(orb => {
        const d = Math.hypot(orb.x - p.x, orb.y - p.y);
        if (d < 350) {
          const angle = Math.atan2(p.y - orb.y, p.x - orb.x);
          orb.x += Math.cos(angle) * 12;
          orb.y += Math.sin(angle) * 12;
        }
      });
    } else if (core.activeGuardian === 'MAGNE') {
      triggerAbilityParticleBurst(p.x, p.y, '#7c4dff', 40);
      
      // Pull all orbs within 600px strongly towards the player!
      core.orbs.forEach(orb => {
        const d = Math.hypot(orb.x - p.x, orb.y - p.y);
        if (d < 600) {
          orb.magnetized = true;
          const angle = Math.atan2(p.y - orb.y, p.x - orb.x);
          orb.x += Math.cos(angle) * 20;
          orb.y += Math.sin(angle) * 20;
        }
      });
      
      // Clear/suppress nearby blackout obstacles
      core.obstacles.forEach(obs => {
        const d = Math.hypot(obs.x - p.x, obs.y - p.y);
        if (d < maxRadius) {
          obs.suppressedUntil = performance.now() + 3000; // Suppress for 3 seconds
          triggerAbilityParticleBurst(obs.x, obs.y, '#b58cff', 8);
        }
      });

      // Clear any enemy projectiles in Nexus Assault
      if (core.assaultRun && core.assaultRun.projectiles) {
        core.assaultRun.projectiles = core.assaultRun.projectiles.filter(proj => {
          if (proj.isEnemy) {
            const d = Math.hypot(proj.x - p.x, proj.y - p.y);
            if (d < maxRadius) {
              triggerAbilityParticleBurst(proj.x, proj.y, '#b58cff', 5);
              return false; // delete/despawn the projectile!
            }
          }
          return true;
        });
      }
    } else if (core.activeGuardian === 'ATON') {
      // Fisión Radiactiva nuclear pulse
      triggerAbilityParticleBurst(p.x, p.y, '#dfff4a', 45);
      triggerAbilityParticleBurst(p.x, p.y, '#ffd700', 30);
      triggerAudioSign('Frecuencia Purificada', 'solar');
      
      // Destroy blackout fragments inside 200px entirely, suppress the rest inside maxRadius
      core.obstacles.forEach(obs => {
        const d = Math.hypot(obs.x - p.x, obs.y - p.y);
        if (d < 200) {
          obs.suppressedUntil = performance.now() + 5000; // Suppress for 5 seconds
          triggerAbilityParticleBurst(obs.x, obs.y, '#ffd700', 12);
        } else if (d < maxRadius) {
          obs.suppressedUntil = performance.now() + 2000; // Suppress for 2 seconds
        }
      });
      core.obstacles = core.obstacles.filter(obs => Math.hypot(obs.x - p.x, obs.y - p.y) >= 200);

      // Apply massive damage to all enemies within range in Nexus Assault
      if (core.assaultRun && core.assaultRun.enemies) {
        core.assaultRun.enemies.forEach(enemy => {
          const d = Math.hypot(enemy.x - p.x, enemy.y - p.y);
          if (d < maxRadius) {
            applyAssaultDamageToEnemy(enemy, 40, { element: 'aton', source: 'ability_pulse' });
            triggerAbilityParticleBurst(enemy.x, enemy.y, '#dfff4a', 15);
            
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: enemy.x,
              y: enemy.y - 30,
              text: 'CRITICAL ATOMIC FISSION! 40 DMG',
              color: '#dfff4a',
              life: 1.5,
              size: 13
            });
          }
        });
      }
    }

    // General Corruption Zone purification check for other guardians
    if (core.activeGuardian !== 'FOTON') {
      core.corruptionZones.forEach(zone => {
        const d = Math.hypot(zone.x - p.x, zone.y - p.y);
        if (d < maxRadius + zone.radius) {
          const amount = d < zone.radius ? 40 : 20; // other guardians purify slightly less
          zone.purifiedAmount += amount;
          zone.intensity = Math.max(0, zone.intensity - 0.2);

          triggerBurstSparks(zone.x, zone.y, '#22d3ee', 'GRID_GLOW', 8);

          core.floatingTexts.push({
            id: Math.random().toString(),
            x: zone.x,
            y: zone.y - 10,
            text: `+${amount} PURITY`,
            color: '#22d3ee',
            life: 1.2,
            size: 13
          });
        }
      });
    }

    // --------------------------------------------------------
    // SENTINEL INTERACTION WITH GUARDIAN ABILITY
    // --------------------------------------------------------
    if (core.sentinel && core.sentinel.phase !== 'forming' && !core.sentinel.defeated) {
      const s = core.sentinel;
      const dist = Math.hypot(s.x - p.x, s.y - p.y);
      if (dist < maxRadius) {
        if (s.phase === "shielded" || s.phase === "enraged") {
          if (s.phase === "enraged" && s.shield <= 0) {
            let damage = SENTINEL_BALANCE.directPulseHealthDamage;
            if (p.evolution === 'GUARDIAN_SERPENT') {
              damage = Math.round(damage * GUARDIAN_SENTINEL_BONUS.healthDamageMultiplier);
              onGuardianResonance();
            }
            s.health = Math.max(0, s.health - damage);
            triggerBurstSparks(s.x, s.y, '#f43f5e', 'BLACKOUT_SMOKE', 25);
            onSentinelCoreDamaged();

            core.floatingTexts.push({
              id: Math.random().toString(),
              x: s.x,
              y: s.y - 30,
              text: `NÚCLEO ENRAGED DAÑADO -${damage}`,
              color: '#f43f5e',
              life: 1.5,
              size: 16
            });

            if (s.health <= 0) {
              defeatSentinel();
            }
          } else {
            let damage = SENTINEL_BALANCE.solarPulseShieldDamage;
            if (p.evolution === 'GUARDIAN_SERPENT') {
              damage = Math.round(damage * GUARDIAN_SENTINEL_BONUS.shieldDamageMultiplier);
              onGuardianResonance();
            }
            s.shield = Math.max(0, s.shield - damage);
            
            triggerBurstSparks(s.x, s.y, '#22d3ee', 'GRID_GLOW', 20);
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: s.x,
              y: s.y - 30,
              text: `ESCUDO DEBILITADO -${damage}`,
              color: '#22d3ee',
              life: 1.5,
              size: 15
            });

            if (s.shield <= 0) {
              s.phase = "vulnerable";
              s.vulnerabilityTimer = SENTINEL_BALANCE.vulnerableDuration;
              showTemporaryMessage("CORE EXPOSED");
              triggerAudioSign("Sentinel shield broken", "solar");
              onSentinelShieldBreak();
              triggerBurstSparks(s.x, s.y, '#fbbf24', 'SOLAR_SPARK', 25);
              
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: s.x,
                y: s.y - 50,
                text: "SHIELD PURGED",
                color: '#fbbf24',
                life: 2.0,
                size: 16
              });
            } else {
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: s.x,
                y: s.y - 10,
                text: "SHIELD DAMAGED",
                color: '#22d3ee',
                life: 1.2,
                size: 12
              });
            }
          }
        } else if (s.phase === "vulnerable") {
          let damage = SENTINEL_BALANCE.directPulseHealthDamage;
          if (p.evolution === 'GUARDIAN_SERPENT') {
            damage = Math.round(damage * GUARDIAN_SENTINEL_BONUS.healthDamageMultiplier);
            onGuardianResonance();
          }
          s.health = Math.max(0, s.health - damage);
          
          triggerBurstSparks(s.x, s.y, '#fbbf24', 'SOLAR_SPARK', 25);
          onSentinelCoreDamaged();

          core.floatingTexts.push({
            id: Math.random().toString(),
            x: s.x,
            y: s.y - 30,
            text: `NÚCLEO DAÑADO -${damage}`,
            color: '#fbbf24',
            life: 1.5,
            size: 16
          });

          if (s.health <= 0) {
            defeatSentinel();
          }
        }

        if (s.phase === "enraged") {
          core.obstacles = core.obstacles.filter(obs => {
            if (obs.id.startsWith(`sentinel_frag_`) && Math.hypot(obs.x - p.x, obs.y - p.y) < maxRadius) {
              triggerBurstSparks(obs.x, obs.y, '#cbd5e1', 'GRID_GLOW', 8);
              return false;
            }
            return true;
          });
          core.floatingTexts.push({
            id: Math.random().toString(),
            x: s.x,
            y: s.y + 20,
            text: "ENRAGE INTERRUPTED",
            color: '#fbbf24',
            life: 1.5,
            size: 12
          });
        }
      }
    }

    setAbilityActive(true);
    let cooldown = SOLAR_PULSE_CONFIG.cooldown;
    if (p.evolution === 'GUARDIAN_SERPENT') {
      cooldown -= NEXUS_GUARDIAN_PULSE_MODIFIER.cooldownReduction;
    }
    setAbilityCooldownRemaining(cooldown);
    core.ability.cooldownRemaining = cooldown * 60; // cooldown in seconds
  };

  const triggerAbilityParticleBurst = (cx: number, cy: number, color: string, count: number) => {
    const core = stateRef.current;
    for (let i = 0; i < count; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.5 + Math.random() * 4.5;
      core.particles.push({
        id: Math.random().toString(36).substring(2, 9),
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1.5 + Math.random() * 3.5,
        alpha: 1.0,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02,
        type: 'ABILITY_PULSE',
        glow: true
      });
    }
  };

  // Generate explosion / collecting sparks
  const triggerBurstSparks = (x: number, y: number, color: string, type: ParticleType, count: number) => {
    const core = stateRef.current;
    const max = isTouchDevice ? QUALITY.maxParticlesMobile : QUALITY.maxParticlesDesktop;
    
    // Evacuate oldest particles to maintain high performance
    if (core.particles.length > max) {
      core.particles.splice(0, core.particles.length - max);
    }

    for (let i = 0; i < count; ++i) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.8 + Math.random() * 3.5;
      core.particles.push({
        id: Math.random().toString(36).substring(2, 7),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1.2 + Math.random() * 2.8,
        alpha: 1.0,
        life: 1.0,
        decay: 0.015 + Math.random() * 0.035,
        type,
        glow: true
      });
    }
  };

  const getSafeSurvivalAntiSerpentSpawnPosition = () => {
    const core = stateRef.current;
    const p = core.player;
    const angle = Math.random() * Math.PI * 2;
    const dist = 450 + Math.random() * 300;
    let sx = p.x + Math.cos(angle) * dist;
    let sy = p.y + Math.sin(angle) * dist;
    
    // Clamp to arena bounds
    sx = Math.max(120, Math.min(core.arenaWidth - 120, sx));
    sy = Math.max(120, Math.min(core.arenaSize - 120, sy));
    return { x: sx, y: sy };
  };

  const createInitialAntiSerpentSegments = (x: number, y: number, lengthLevel: number) => {
    const count = 3 + lengthLevel;
    const segments: Vector2[] = [];
    for (let i = 0; i < count; i++) {
      segments.push({ x: x - i * 16, y: y });
    }
    return segments;
  };

  const addAntiSerpentSegment = (serpent: SurvivalAntiSerpent) => {
    if (!serpent.segments) serpent.segments = [];
    const lastSeg = serpent.segments[serpent.segments.length - 1] || { x: serpent.x, y: serpent.y };
    serpent.segments.push({ x: lastSeg.x, y: lastSeg.y });
  };

  const spawnAntiSerpentGrowthPulse = (serpent: SurvivalAntiSerpent) => {
    const core = stateRef.current;
    const color = ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy].color;
    
    core.floatingTexts.push({
      id: Math.random().toString(),
      x: serpent.x,
      y: serpent.y - 45,
      text: `¡${ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy].label} SE EXPANDE (LVL ${serpent.lengthLevel})!`,
      color: "#ef4444",
      life: 1.8,
      size: 13
    });
    
    triggerBurstSparks(serpent.x, serpent.y, color, "GRID_GLOW", 12);
    triggerBurstSparks(serpent.x, serpent.y, "#ffffff", "NEXUS_SPARK", 8);
    triggerAudioSign('Crecimiento anti-serpiente', 'evolve');
  };

  function maybeSpawnSurvivalAntiSerpent(dt: number) {
    const core = stateRef.current;
    if (core.gameMode !== "infinite") return;

    if (!core.survival) {
      core.survival = createInitialSurvivalState();
    }
    const survival = core.survival;
    if (!survival.antiSerpents) survival.antiSerpents = [];

    const timeAlive = survival.elapsedTime ?? 0;
    survival.antiSerpentSpawnTimer = (survival.antiSerpentSpawnTimer ?? 0) + (1 / 60) * dt;

    if (timeAlive < 25) return;

    const profile = getSurvivalDifficultyProfile(timeAlive);
    const hasAlpha = survival.antiSerpents.some(s => s.isAlpha && s.alive);
    const maxAntiSerpents = hasAlpha ? 1 : profile.antiSerpentMaxCount;

    const aliveAntiSerpents = survival.antiSerpents.filter(s => s.alive);

    if (aliveAntiSerpents.length >= maxAntiSerpents) return;

    const spawnInterval =
      timeAlive < 90 ? 35 :
      timeAlive < 180 ? 28 :
      22;

    if (survival.antiSerpentSpawnTimer >= spawnInterval) {
      spawnSurvivalAntiSerpent();
      survival.antiSerpentSpawnTimer = 0;
    }
  }

  const createAntiCombatProfile = (antiEnergy: AntiEnergyId): SurvivalAntiCombatProfile => {
    switch (antiEnergy) {
      case "anti_foton":
        return {
          attackType: "dark_lance",
          attackCooldown: 2.2,
          attackTimer: 1.5 + Math.random() * 1.5,
          attackRange: 400,
          specialCooldown: 5.0,
          specialTimer: 5.0,
          aggression: 0.7
        };
      case "anti_hydro":
        return {
          attackType: "stasis_glob",
          attackCooldown: 3.2,
          attackTimer: 2.0 + Math.random() * 1.5,
          attackRange: 280,
          specialCooldown: 6.0,
          specialTimer: 6.0,
          aggression: 0.5
        };
      case "anti_aero":
        return {
          attackType: "vacuum_dash",
          attackCooldown: 4.8,
          attackTimer: 2.5 + Math.random() * 1.5,
          attackRange: 320,
          specialCooldown: 8.0,
          specialTimer: 8.0,
          aggression: 0.95
        };
      case "anti_termo":
        return {
          attackType: "entropy_burst",
          attackCooldown: 4.0,
          attackTimer: 3.0 + Math.random() * 1.5,
          attackRange: 250,
          specialCooldown: 7.0,
          specialTimer: 7.0,
          aggression: 0.8
        };
      default:
        return {
          attackType: "dark_lance",
          attackCooldown: 3.0,
          attackTimer: 3.0,
          attackRange: 300,
          specialCooldown: 6.0,
          specialTimer: 6.0,
          aggression: 0.5
        };
    }
  };

  function spawnSurvivalAntiSerpent(options?: { isAlpha?: boolean; isMinor?: boolean }) {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;
    const timeAlive = survival.elapsedTime ?? 0;
    const isAlpha = options?.isAlpha ?? false;
    const isMinor = options?.isMinor ?? false;

    const available: AntiEnergyId[] =
      timeAlive < 90
        ? ["anti_foton", "anti_hydro"]
        : ["anti_foton", "anti_hydro", "anti_aero", "anti_termo"];

    let antiEnergy = available[Math.floor(Math.random() * available.length)];
    if (survival.activeBlackoutEvent?.type === "eclipse_field") {
      antiEnergy = "anti_foton";
    }
    const registry = ORBI_ANTI_ENERGY_REGISTRY[antiEnergy];

    const spawn = getSafeSurvivalAntiSerpentSpawnPosition();

    let lengthLevel =
      timeAlive < 90 ? 1 :
      timeAlive < 180 ? 2 :
      3;

    if (timeAlive >= 120) {
      lengthLevel = Math.min(4, lengthLevel + 1);
    }

    if (isAlpha) {
      lengthLevel = Math.min(6, lengthLevel + 2);
    } else if (isMinor) {
      lengthLevel = 1;
    }

    const diffProfile = getSurvivalDifficultyProfile(timeAlive);
    let baseHp = (60 + lengthLevel * 25) * diffProfile.enemyHpMultiplier;
    let baseSpeed = (95 + lengthLevel * 10) * diffProfile.enemySpeedMultiplier;

    if (antiEnergy === "anti_aero") {
      baseSpeed *= 1.12;
      baseHp *= 0.88;
    } else if (antiEnergy === "anti_termo") {
      baseHp *= 1.15;
      baseSpeed *= 0.85;
    }

    if (isAlpha) {
      baseHp *= 2.2;
      baseSpeed *= 1.08;
    } else if (isMinor) {
      baseHp *= 0.6;
      baseSpeed *= 0.9;
    }

    const serpent: SurvivalAntiSerpent = {
      id: `anti_serpent_${antiEnergy}_${isAlpha ? 'alpha_' : ''}${Date.now()}`,
      antiEnergy,
      x: spawn.x,
      y: spawn.y,
      vx: 0,
      vy: 0,
      segments: createInitialAntiSerpentSegments(spawn.x, spawn.y, lengthLevel),
      lengthLevel,
      growthTimer: 0,
      aiState: "hunt",
      aiTimer: 0,
      chargeTelegraphTimer: 0,
      chargeCooldown: isAlpha ? 2.5 : 4,
      targetVital: "head",
      hp: baseHp,
      maxHp: baseHp,
      speed: baseSpeed,
      radius: (18 + lengthLevel * 2) * (isAlpha ? 1.25 : 1),
      alive: true,
      combatProfile: createAntiCombatProfile(antiEnergy),
      isAlpha: isAlpha
    };

    if (isAlpha) {
      serpent.combatProfile.attackCooldown = Math.max(1.5, serpent.combatProfile.attackCooldown * 0.7);
    }

    survival.antiSerpents.push(serpent);

    if (isAlpha) {
      showSurvivalBanner(
        "ALPHA DETECTADO",
        `Cazador supremo ${registry.label} ha entrado en la arena`
      );
      triggerAudioSign('soft_orbi_pulse', 'blackout');
    } else if (!isMinor) {
      showSurvivalBanner(
        `${registry.label} DETECTADA`,
        "Anti-serpiente Blackout entrando a la arena"
      );
    } else {
      core.floatingTexts.push({
        id: `spawn_${Date.now()}_${Math.random()}`,
        x: spawn.x,
        y: spawn.y,
        text: `MENOR ${registry.label}`,
        color: '#a855f7',
        size: 9,
        vx: 0,
        vy: -20,
        life: 1.0,
        decay: 0.03
      });
    }
  }

  const getSafeHazardSpawnPosition = (minDist: number): { x: number; y: number } => {
    const core = stateRef.current;
    const p = core.player;
    const size = core.arenaSize || 2850;
    const width = core.gameMode === 'infinite' ? core.arenaWidth : size;
    
    let attempts = 0;
    while (attempts < 50) {
      const rx = 100 + Math.random() * (width - 200);
      const ry = 100 + Math.random() * (size - 200);
      if (Math.hypot(rx - p.x, ry - p.y) >= minDist) {
        return { x: rx, y: ry };
      }
      attempts++;
    }
    return { x: Math.max(100, Math.min(width - 100, p.x + 200)), y: Math.max(100, Math.min(size - 100, p.y)) };
  };

  const getNextBlackoutEventInterval = (timeAlive: number): number => {
    const core = stateRef.current;
    const survival = core.survival;
    if (survival && !survival.lastBlackoutEventType) {
      return 50;
    }
    if (timeAlive < 120) return 65;
    if (timeAlive < 240) return 55;
    return 45;
  };

  const chooseNextSurvivalBlackoutEvent = (timeAlive: number): SurvivalBlackoutEventType => {
    const core = stateRef.current;
    const survival = core.survival;
    const pool: SurvivalBlackoutEventType[] = [];

    pool.push("blackout_wave");

    if (timeAlive >= 75) {
      pool.push("eclipse_field", "stasis_flood");
    }

    if (timeAlive >= 105) {
      pool.push("vacuum_surge", "entropy_storm");
    }

    if (timeAlive >= 120) {
      pool.push("anti_serpent_alpha");
    }

    const lastType = survival?.lastBlackoutEventType;
    const filtered = pool.filter(e => e !== lastType);
    const finalPool = filtered.length > 0 ? filtered : pool;
    
    const idx = Math.floor(Math.random() * finalPool.length);
    return finalPool[idx];
  };

  const createSurvivalBlackoutEvent = (type: SurvivalBlackoutEventType): SurvivalBlackoutEvent => {
    const core = stateRef.current;
    const survival = core.survival;
    const timeAlive = survival?.elapsedTime ?? 0;
    const intensity =
      timeAlive < 120 ? 1 :
      timeAlive < 240 ? 2 :
      3;

    const config: Record<SurvivalBlackoutEventType, { label: string; description: string; duration: number }> = {
      blackout_wave: {
        label: "BLACKOUT WAVE",
        description: "Oleada de anti-serpientes menores detectada.",
        duration: 22,
      },
      eclipse_field: {
        label: "ECLIPSE FIELD",
        description: "La luz vital se reduce. Anti-Fotón intensifica sus ataques.",
        duration: 24,
      },
      stasis_flood: {
        label: "STASIS FLOOD",
        description: "Zonas de estasis Anti-Hydro contaminan la arena.",
        duration: 22,
      },
      vacuum_surge: {
        label: "VACUUM SURGE",
        description: "Corrientes de vacío aumentan la velocidad de Anti-Aero.",
        duration: 20,
      },
      entropy_storm: {
        label: "ENTROPY STORM",
        description: "Campos de entropía térmica corrompen el flujo vital.",
        duration: 22,
      },
      anti_serpent_alpha: {
        label: "ANTI-SERPENT ALPHA",
        description: "Una anti-serpiente evolucionada entra en la arena.",
        duration: 35,
      },
    };

    const conf = config[type];

    return {
      id: `blackout_event_${type}_${Date.now()}`,
      type,
      label: conf.label,
      description: conf.description,
      duration: conf.duration,
      remaining: conf.duration,
      intensity,
      startedAt: timeAlive,
      completed: false,
    };
  };

  // Deleted duplicate healSurvivalPlayerByPercent to resolve compilation error

  const addSurvivalEnergyCharge = (amount: number) => {
    const core = stateRef.current;
    core.player.score = (core.player.score ?? 0) + amount * 10;
  };

  const addSurvivalGrowthSegments = (amount: number) => {
    const core = stateRef.current;
    const p = core.player;
    p.targetLength = Math.min(100, p.targetLength + amount);
    core.floatingTexts.push({
      id: `growth_${Date.now()}_${Math.random()}`,
      x: p.x,
      y: p.y - 30,
      text: `CRECIMIENTO +${amount}`,
      color: '#34d399',
      size: 10,
      vx: 0,
      vy: -40,
      life: 1.2,
      decay: 0.025
    });
  };

  const rewardSurvivalBlackoutEvent = (event: SurvivalBlackoutEvent) => {
    if (event.type === "anti_serpent_alpha") {
      rewardSurvivalMilestone("alpha");
    } else {
      rewardSurvivalMilestone("event");
    }
  };

  const startSurvivalBlackoutEvent = (type: SurvivalBlackoutEventType) => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    const event = createSurvivalBlackoutEvent(type);
    survival.activeBlackoutEvent = event;
    survival.lastBlackoutEventType = type;

    showSurvivalBlackoutEventBanner(event);
    triggerAudioSign("soft_launch_chime", "blackout");

    applySurvivalBlackoutEventStartEffects(event);
  };

  const applySurvivalBlackoutEventStartEffects = (event: SurvivalBlackoutEvent) => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    if (event.type === "blackout_wave") {
      spawnSurvivalAntiSerpent({ isMinor: true });
    } else if (event.type === "anti_serpent_alpha") {
      spawnSurvivalAntiSerpent({ isAlpha: true });
      const alphas = survival.antiSerpents.filter(s => s.isAlpha && s.alive);
      if (alphas.length > 0) {
        (event as any).alphaId = alphas[alphas.length - 1].id;
      }
    }
  };

  const applySurvivalBlackoutEventLoopEffects = (dt: number, event: SurvivalBlackoutEvent) => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    if (event.type === "blackout_wave") {
      (event as any).spawnAccumulator = ((event as any).spawnAccumulator ?? 0) + (1 / 60) * dt;
      if ((event as any).spawnAccumulator >= 7) {
        (event as any).spawnAccumulator = 0;
        const timeAlive = survival.elapsedTime ?? 0;
        const maxNormal = timeAlive < 90 ? 1 : timeAlive < 180 ? 2 : 3;
        const aliveCount = survival.antiSerpents.filter(s => s.alive).length;
        if (aliveCount < maxNormal + 2) {
          spawnSurvivalAntiSerpent({ isMinor: true });
        }
      }
    } else if (event.type === "stasis_flood") {
      (event as any).stasisAccumulator = ((event as any).stasisAccumulator ?? 0) + (1 / 60) * dt;
      if ((event as any).stasisAccumulator >= 5) {
        (event as any).stasisAccumulator = 0;
        const activePools = survival.hazards.filter(h => h.type === "stasis_pool").length;
        const maxPools = event.intensity >= 3 ? 5 : 3;
        if (activePools < maxPools) {
          const pos = getSafeHazardSpawnPosition(180);
          survival.hazards.push({
            id: `haz_stasis_${Date.now()}_${Math.random()}`,
            type: 'stasis_pool',
            x: pos.x,
            y: pos.y,
            radius: 50,
            duration: 4.5,
            tickTimer: 0
          });
          triggerAudioSign('soft_launch_chime', 'blackout');
          triggerBurstSparks(pos.x, pos.y, '#22d3ee', 'NEXUS_SPARK', 6);
        }
      }
    } else if (event.type === "entropy_storm") {
      (event as any).entropyAccumulator = ((event as any).entropyAccumulator ?? 0) + (1 / 60) * dt;
      if ((event as any).entropyAccumulator >= 5) {
        (event as any).entropyAccumulator = 0;
        const activeFields = survival.hazards.filter(h => h.type === "entropy_field").length;
        const playerHp = core.player?.energy ?? 100;
        const maxFields = playerHp < 35 ? (event.intensity >= 3 ? 2 : 1) : (event.intensity >= 3 ? 4 : 2);
        if (activeFields < maxFields) {
          const pos = getSafeHazardSpawnPosition(180);
          survival.hazards.push({
            id: `haz_entropy_${Date.now()}_${Math.random()}`,
            type: 'entropy_field',
            x: pos.x,
            y: pos.y,
            radius: playerHp < 35 ? 32 : 44,
            duration: 3.2,
            tickTimer: 0
          });
          triggerAudioSign('soft_orbi_pulse', 'blackout');
          triggerBurstSparks(pos.x, pos.y, '#f97316', 'NEXUS_SPARK', 6);
        }
      }
    }
  };

  const updateActiveSurvivalBlackoutEvent = (dt: number) => {
    const core = stateRef.current;
    const survival = core.survival;
    const event = survival?.activeBlackoutEvent;
    if (!event || !survival) return;

    event.remaining -= (1 / 60) * dt;

    applySurvivalBlackoutEventLoopEffects(dt, event);

    if (event.type === "anti_serpent_alpha") {
      const alphaId = (event as any).alphaId;
      const alphaSerpent = survival.antiSerpents.find(s => s.id === alphaId);
      if (alphaSerpent && !alphaSerpent.alive) {
        completeSurvivalBlackoutEvent(event);
        return;
      }
    }

    if (event.remaining <= 0) {
      completeSurvivalBlackoutEvent(event);
    }
  };

  const completeSurvivalBlackoutEvent = (event: SurvivalBlackoutEvent) => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    event.completed = true;
    survival.blackoutEventsCompleted = (survival.blackoutEventsCompleted ?? 0) + 1;
    survival.activeBlackoutEvent = null;

    if (event.type === "anti_serpent_alpha") {
      const alphaId = (event as any).alphaId;
      const alphaSerpent = survival.antiSerpents.find(s => s.id === alphaId);
      if (alphaSerpent && alphaSerpent.alive) {
        alphaSerpent.alive = false;
        alphaSerpent.hp = -999;
        triggerBurstSparks(alphaSerpent.x, alphaSerpent.y, '#f43f5e', 'BLACKOUT_SMOKE', 15);
        core.floatingTexts.push({
          id: `alpha_retreat_${Date.now()}`,
          x: alphaSerpent.x,
          y: alphaSerpent.y,
          text: "ALPHA RETIRADO",
          color: '#94a3b8',
          size: 11,
          vx: 0,
          vy: -30,
          life: 1.0,
          decay: 0.02
        });
      }
    }

    rewardSurvivalBlackoutEvent(event);

    showSurvivalBanner(
      "EVENTO SUPERADO",
      `${event.label} estabilizado`
    );

    triggerAudioSign("reset", "evolve");
  };

  const updateSurvivalBlackoutEvents = (dt: number) => {
    const core = stateRef.current;
    if (core.gameMode !== "infinite" || !core.survival) return;

    const survival = core.survival;
    const timeAlive = survival.elapsedTime ?? 0;

    if (timeAlive < 45) return;

    if (survival.activeBlackoutEvent) {
      updateActiveSurvivalBlackoutEvent(dt);
      return;
    }

    survival.blackoutEventTimer = (survival.blackoutEventTimer ?? 0) + (1 / 60) * dt;

    const interval = getNextBlackoutEventInterval(timeAlive);

    if (survival.blackoutEventTimer >= interval) {
      let nextEvent = chooseNextSurvivalBlackoutEvent(timeAlive);
      
      // Section 8: Alpha Balance rules
      if (nextEvent === "anti_serpent_alpha" && !canStartAlphaEvent()) {
        const altPool: SurvivalBlackoutEventType[] = ["blackout_wave", "eclipse_field", "stasis_flood", "vacuum_surge", "entropy_storm"];
        const timeAliveFiltered = altPool.filter((type) => {
          if (type === "stasis_flood" || type === "eclipse_field") return timeAlive >= 75;
          if (type === "vacuum_surge" || type === "entropy_storm") return timeAlive >= 105;
          return true;
        });
        if (timeAliveFiltered.length > 0) {
          nextEvent = timeAliveFiltered[Math.floor(Math.random() * timeAliveFiltered.length)];
        } else {
          survival.blackoutEventTimer = interval - 5; 
          return;
        }
      }
      
      startSurvivalBlackoutEvent(nextEvent);
      survival.blackoutEventTimer = 0;
    }
  };

  function updateSurvivalAntiSerpents(dt: number) {
    const core = stateRef.current;
    if (core.gameMode !== "infinite") return;
    if (!core.survival) return;
    const survival = core.survival;
    if (!survival.antiSerpents) return;

    for (const serpent of survival.antiSerpents) {
      if (!serpent.alive) continue;

      updateSurvivalAntiSerpentAI(dt, serpent);
      updateSurvivalAntiSerpentMovement(dt, serpent);
      updateSurvivalAntiSerpentSegments(dt, serpent);
      updateSurvivalAntiSerpentGrowth(dt, serpent);
      handleSurvivalAntiSerpentCollisions(serpent);
      updateSurvivalAntiSerpentAttacks(dt, serpent);
    }

    survival.antiSerpents =
      survival.antiSerpents.filter(s => s.alive || s.hp > -999);
  }

  const damagePlayerSurvival = (amount: number, reason: string) => {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;
    
    // Save last damage reason for Post-Run summary
    if (core.survival) {
      core.survival.lastDamageReason = reason;
    }
    
    // Play damage audio
    triggerAudioSign('player_damaged', 'blackout');
    
    // Apply damage
    p.energy = Math.max(0, p.energy - amount);
    p.ticksSinceLastDamage = 0; // Reset recovery timer
    
    // Screen shake
    core.camera.shakeIntensity = Math.min(3.0, (core.camera.shakeIntensity || 0) + amount * 0.15);
    core.camera.shakeTime = Math.min(15, (core.camera.shakeTime || 0) + 8);
    
    // Floating damage text
    core.floatingTexts.push({
      id: `damage_${Date.now()}_${Math.random()}`,
      x: p.x,
      y: p.y - 12,
      text: `-${Math.round(amount)} ENERGÍA`,
      color: '#ef4444',
      size: 11,
      vx: (Math.random() - 0.5) * 40,
      vy: -60 - Math.random() * 40,
      life: 1.0,
      maxLife: 1.0
    });
  };

  const triggerDebuffFeedbackText = (text: string, color: string) => {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;
    core.floatingTexts.push({
      id: `debuff_${Date.now()}_${Math.random()}`,
      x: p.x,
      y: p.y - 32,
      text: text,
      color: color,
      size: 13,
      vx: (Math.random() - 0.5) * 20,
      vy: -50,
      life: 0.8,
      maxLife: 0.8
    });
  };

  const updateSurvivalAntiSerpentAttacks = (dt: number, serpent: SurvivalAntiSerpent) => {
    const core = stateRef.current;
    const p = core.player;
    if (!p || !serpent.alive) return;

    const prof = serpent.combatProfile;
    if (!prof) return;

    // Decrement timers
    let attackDecrement = (1 / 60) * dt;
    if (core.survival && core.survival.activeBlackoutEvent?.type === "eclipse_field" && serpent.antiEnergy === "anti_foton") {
      attackDecrement *= 1.12; // +12% fire rate
    }
    prof.attackTimer -= attackDecrement;

    let specialDecrement = (1 / 60) * dt;
    if (core.survival && core.survival.activeBlackoutEvent?.type === "entropy_storm" && serpent.antiEnergy === "anti_termo") {
      specialDecrement *= 1.35; // +35% special rate
    }
    prof.specialTimer -= specialDecrement;

    if (serpent.attackTelegraphTimer && serpent.attackTelegraphTimer > 0) {
      serpent.attackTelegraphTimer -= (1 / 60) * dt;
      if (serpent.attackTelegraphTimer <= 0) {
        // Telegraph complete! Fire the actual projectile!
        if (serpent.antiEnergy === 'anti_foton') {
          // Fire dark lance
          const dx = (serpent.attackTelegraphX ?? p.x) - serpent.x;
          const dy = (serpent.attackTelegraphY ?? p.y) - serpent.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const vx = dist > 0 ? (dx / dist) : 1;
          const vy = dist > 0 ? (dy / dist) : 0;
          
          // Anti-Foton trait: +10% projectile speed (base 360 * 1.1 = 396)
          const projSpeed = 396; 
          const baseDmg = serpent.lengthLevel >= 3 ? 12 : 8; // Stronger if level >= 3
          
          if (!core.survival.antiProjectiles) core.survival.antiProjectiles = [];
          core.survival.antiProjectiles.push({
            id: `proj_foton_${Date.now()}_${Math.random()}`,
            type: 'dark_lance',
            antiEnergy: 'anti_foton',
            x: serpent.x,
            y: serpent.y,
            vx: vx * projSpeed,
            vy: vy * projSpeed,
            radius: serpent.lengthLevel >= 3 ? 10 : 7,
            damage: baseDmg,
            life: 2.5,
            alive: true
          });
          
          triggerAudioSign('laser', 'blackout');
        }
      }
      return; // Do not trigger other attacks while telegraphing
    }

    // Check range
    const dx = p.x - serpent.x;
    const dy = p.y - serpent.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist <= prof.attackRange) {
      // Determine if they should attack based on state & cooldown
      if (prof.attackTimer <= 0) {
        // Execute attack!
        if (serpent.antiEnergy === 'anti_foton') {
          // Anti-Foton: dark_lance (Linear sniper)
          serpent.attackTelegraphTimer = 0.35;
          serpent.attackTelegraphX = p.x + (p.vx * 0.15); // Slight lead shot tracking!
          serpent.attackTelegraphY = p.y + (p.vy * 0.15);
          prof.attackTimer = prof.attackCooldown;
        } else if (serpent.antiEnergy === 'anti_hydro') {
          // Anti-Hydro: stasis_glob (Area slowing blob)
          const vx = dist > 0 ? (dx / dist) : 1;
          const vy = dist > 0 ? (dy / dist) : 0;
          const projSpeed = 185;
          
          if (!core.survival.antiProjectiles) core.survival.antiProjectiles = [];
          core.survival.antiProjectiles.push({
            id: `proj_hydro_${Date.now()}_${Math.random()}`,
            type: 'stasis_glob',
            antiEnergy: 'anti_hydro',
            x: serpent.x,
            y: serpent.y,
            vx: vx * projSpeed,
            vy: vy * projSpeed,
            radius: 11,
            damage: 6,
            life: 1.8,
            alive: true
          });
          
          prof.attackTimer = prof.attackCooldown;
          triggerAudioSign('soft_launch_chime', 'blackout');
        } else if (serpent.antiEnergy === 'anti_aero') {
          // Anti-Aero: vacuum_dash
          // If chargeCooldown is ready, trigger vacuum dash!
          if (serpent.chargeCooldown <= 0) {
            serpent.aiState = "charge";
            serpent.chargeTelegraphTimer = 0.7; // 0.7 seconds telegraph
            serpent.chargeTimer = 1.1; // 1.1s dash duration
            serpent.chargeTargetX = p.x;
            serpent.chargeTargetY = p.y;
            
            prof.attackTimer = prof.attackCooldown;
            serpent.chargeCooldown = 4.8; // Set cooldown
            triggerAudioSign('reset', 'blackout');
          }
        } else if (serpent.antiEnergy === 'anti_termo') {
          // Anti-Termo: entropy_burst
          const vx = dist > 0 ? (dx / dist) : 1;
          const vy = dist > 0 ? (dy / dist) : 0;
          const projSpeed = 135;
          
          if (!core.survival.antiProjectiles) core.survival.antiProjectiles = [];
          core.survival.antiProjectiles.push({
            id: `proj_termo_${Date.now()}_${Math.random()}`,
            type: 'entropy_burst',
            antiEnergy: 'anti_termo',
            x: serpent.x,
            y: serpent.y,
            vx: vx * projSpeed,
            vy: vy * projSpeed,
            radius: 14,
            damage: 9,
            life: 2.2,
            alive: true
          });
          
          prof.attackTimer = prof.attackCooldown;
          triggerAudioSign('soft_orbi_pulse', 'blackout');
        }
      }
    }
  };

  function updateSurvivalAntiSerpentAI(dt: number, serpent: SurvivalAntiSerpent) {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;

    serpent.aiTimer = (serpent.aiTimer || 0) + (1 / 60) * dt;
    
    let cooldownDecrement = (1 / 60) * dt;
    if (core.survival && core.survival.activeBlackoutEvent?.type === "vacuum_surge" && serpent.antiEnergy === "anti_aero") {
      cooldownDecrement *= 1.25; // reduces cooldown by 20% by recovering 25% faster
    }
    serpent.chargeCooldown = Math.max(0, (serpent.chargeCooldown || 0) - cooldownDecrement);

    const dx = p.x - serpent.x;
    const dy = p.y - serpent.y;
    const dist = Math.hypot(dx, dy);

    // Active ability triggers reaction
    if (core.ability.active && serpent.aiState !== "charge" && serpent.chargeCooldown <= 0) {
      serpent.aiState = "charge";
      serpent.aiTimer = 0;
      serpent.chargeTelegraphTimer = 0.8;
      serpent.chargeTargetX = p.x;
      serpent.chargeTargetY = p.y;
      
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: serpent.x,
        y: serpent.y - 30,
        text: "¡EMBESTIDA DE LA CONTRA-ENERGÍA!",
        color: "#ef4444",
        life: 1.5,
        size: 12
      });
      triggerAudioSign('Reacción reactiva', 'soft_orbi_pulse');
    }

    if (serpent.aiState === "hunt") {
      if (serpent.aiTimer > 4) {
        serpent.aiTimer = 0;
        serpent.targetVital = Math.random() < 0.55 ? "head" : "tail";
        if (dist < 320 && Math.random() < 0.6) {
          serpent.aiState = "orbit";
          serpent.aiTimer = 0;
        }
      }

      if (dist < 280 && serpent.chargeCooldown <= 0) {
        serpent.aiState = "charge";
        serpent.aiTimer = 0;
        serpent.chargeTelegraphTimer = 0.8;
        serpent.chargeTargetX = p.x + (p.vx || 0) * 12;
        serpent.chargeTargetY = p.y + (p.vy || 0) * 12;
        triggerAudioSign('Carga de anti-energía', 'soft_orbi_pulse');
      }

    } else if (serpent.aiState === "orbit") {
      if (serpent.aiTimer > 3) {
        serpent.aiTimer = 0;
        if (serpent.chargeCooldown <= 0) {
          serpent.aiState = "charge";
          serpent.chargeTelegraphTimer = 0.8;
          serpent.chargeTargetX = p.x + (p.vx || 0) * 10;
          serpent.chargeTargetY = p.y + (p.vy || 0) * 10;
        } else {
          serpent.aiState = "hunt";
        }
      }

    } else if (serpent.aiState === "charge") {
      if (serpent.chargeTelegraphTimer > 0) {
        serpent.chargeTelegraphTimer -= (1 / 60) * dt;
        if (serpent.chargeTelegraphTimer > 0.5) {
          serpent.chargeTargetX = p.x + (p.vx || 0) * 8;
          serpent.chargeTargetY = p.y + (p.vy || 0) * 8;
        }
        if (serpent.chargeTelegraphTimer <= 0) {
          serpent.chargeTimer = 1.2;
          const cDx = (serpent.chargeTargetX ?? p.x) - serpent.x;
          const cDy = (serpent.chargeTargetY ?? p.y) - serpent.y;
          const cDist = Math.hypot(cDx, cDy) || 1;
          serpent.vx = (cDx / cDist) * (serpent.speed * 1.8);
          serpent.vy = (cDy / cDist) * (serpent.speed * 1.8);
          triggerAudioSign('Embestida', 'soft_launch_chime');
        }
      } else {
        serpent.chargeTimer = (serpent.chargeTimer || 0) - (1 / 60) * dt;
        if (serpent.chargeTimer <= 0) {
          serpent.aiState = "retreat";
          serpent.aiTimer = 0;
          serpent.chargeCooldown = 3.5;
        }
      }

    } else if (serpent.aiState === "retreat") {
      if (serpent.aiTimer > 1.5) {
        serpent.aiState = "hunt";
        serpent.aiTimer = 0;
      }
    }
  }

  function updateSurvivalAntiSerpentMovement(dt: number, serpent: SurvivalAntiSerpent) {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;

    if (serpent.aiState === "charge" && serpent.chargeTelegraphTimer <= 0) {
      serpent.x += (serpent.vx || 0) * dt * (1 / 60) * 60;
      serpent.y += (serpent.vy || 0) * dt * (1 / 60) * 60;
      serpent.angle = Math.atan2(serpent.vy || 0, serpent.vx || 0);
    } else if (serpent.aiState === "charge" && serpent.chargeTelegraphTimer > 0) {
      const targetX = serpent.chargeTargetX ?? p.x;
      const targetY = serpent.chargeTargetY ?? p.y;
      const dx = targetX - serpent.x;
      const dy = targetY - serpent.y;
      serpent.angle = Math.atan2(dy, dx);
    } else if (serpent.aiState === "retreat") {
      const dx = serpent.x - p.x;
      const dy = serpent.y - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      const rx = dx / dist;
      const ry = dy / dist;
      
      const speedMultiplier = 1.1;
      const moveAmount = serpent.speed * speedMultiplier * (1 / 60) * dt;
      serpent.x += rx * moveAmount;
      serpent.y += ry * moveAmount;
      serpent.angle = Math.atan2(ry, rx);
    } else if (serpent.aiState === "orbit") {
      const dx = serpent.x - p.x;
      const dy = serpent.y - p.y;
      const dist = Math.hypot(dx, dy) || 1;
      
      const tx = -dy / dist;
      const ty = dx / dist;
      
      const targetOrbitDist = 240;
      const pullForce = (dist - targetOrbitDist) * 0.01;
      const rx = -dx / dist;
      const ry = -dy / dist;
      
      const mx = tx * 0.8 + rx * pullForce;
      const my = ty * 0.8 + ry * pullForce;
      const mDist = Math.hypot(mx, my) || 1;
      
      const moveAmount = serpent.speed * (1 / 60) * dt;
      serpent.x += (mx / mDist) * moveAmount;
      serpent.y += (my / mDist) * moveAmount;
      serpent.angle = Math.atan2(my, mx);
    } else {
      let targetX = p.x;
      let targetY = p.y;
      if (serpent.targetVital === "tail" && p.segments && p.segments.length > 0) {
        const tailSeg = p.segments[p.segments.length - 1];
        targetX = tailSeg.x;
        targetY = tailSeg.y;
      }
      
      const dx = targetX - serpent.x;
      const dy = targetY - serpent.y;
      const dist = Math.hypot(dx, dy);
      
      if (dist > 5) {
        const baseAngle = Math.atan2(dy, dx);
        const wiggle = Math.sin((serpent.aiTimer || 0) * 3) * 0.15;
        const finalAngle = baseAngle + wiggle;
        
        serpent.angle = finalAngle;
        const moveAmount = serpent.speed * (1 / 60) * dt;
        serpent.x += Math.cos(finalAngle) * moveAmount;
        serpent.y += Math.sin(finalAngle) * moveAmount;
      }
    }

    serpent.x = Math.max(50, Math.min(core.arenaWidth - 50, serpent.x));
    serpent.y = Math.max(50, Math.min(core.arenaSize - 50, serpent.y));
  }

  function updateSurvivalAntiSerpentSegments(dt: number, serpent: SurvivalAntiSerpent) {
    if (!serpent.segments || serpent.segments.length === 0) return;

    serpent.segments[0].x = serpent.x;
    serpent.segments[0].y = serpent.y;

    for (let i = 1; i < serpent.segments.length; i++) {
      const prev = serpent.segments[i - 1];
      const curr = serpent.segments[i];
      const sDx = curr.x - prev.x;
      const sDy = curr.y - prev.y;
      const sDist = Math.hypot(sDx, sDy);
      const spacing = 18;
      if (sDist > spacing) {
        const dragAngle = Math.atan2(sDy, sDx);
        curr.x = prev.x + Math.cos(dragAngle) * spacing;
        curr.y = prev.y + Math.sin(dragAngle) * spacing;
      }
    }
  }

  function updateSurvivalAntiSerpentGrowth(dt: number, serpent: SurvivalAntiSerpent) {
    const secDelta = (1 / 60) * dt;
    serpent.growthTimer = (serpent.growthTimer || 0) + secDelta;

    if (serpent.growthTimer >= 20 && serpent.lengthLevel < 5) {
      serpent.growthTimer = 0;
      serpent.lengthLevel += 1;
      serpent.maxHp += 18;
      serpent.hp += 10;
      serpent.speed += 4;
      addAntiSerpentSegment(serpent);
      spawnAntiSerpentGrowthPulse(serpent);
    }
  }

  function handleSurvivalAntiSerpentCollisions(serpent: SurvivalAntiSerpent) {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;
    const survival = core.survival;
    if (!survival) return;

    serpent.contactDamageCooldown = Math.max(0, (serpent.contactDamageCooldown || 0) - (1 / 60) * 1);
    p.damageCooldown = Math.max(0, p.damageCooldown - 1);

    const theme = GUARDIAN_THEMES[core.activeGuardian];
    const resistance = theme ? theme.resistanceModifier : 1;

    // 1. Head-to-Head collision
    const h2hDist = Math.hypot(p.x - serpent.x, p.y - serpent.y);
    const triggerH2H = h2hDist < (serpent.radius + 20);

    if (triggerH2H && p.damageCooldown <= 0 && (!serpent.contactDamageCooldown || serpent.contactDamageCooldown <= 0)) {
      const baseDamage = 16;
      const damageTaken = Math.round(baseDamage * resistance);
      
      p.energy = Math.max(0, p.energy - damageTaken);
      p.score = Math.max(0, p.score - 75);
      p.damageCooldown = 60;
      p.ticksSinceLastDamage = 0;
      serpent.contactDamageCooldown = 1.2;

      const pushAngle = Math.atan2(p.y - serpent.y, p.x - serpent.x);
      p.vx += Math.cos(pushAngle) * 14;
      p.vy += Math.sin(pushAngle) * 14;

      core.camera.shakeTime = 14;
      core.camera.shakeIntensity = 7.0;

      triggerAudioSign('Colisión cabeza (Alto Daño)', 'blackout');
      setDamageFlashing(true);
      setTimeout(() => setDamageFlashing(false), 200);

      core.floatingTexts.push({
        id: Math.random().toString(),
        x: p.x,
        y: p.y - 30,
        text: `CHOQUE FRONTAL -${damageTaken} ENERGÍA`,
        color: '#f43f5e',
        life: 1.8,
        size: 14
      });
    }

    // 2. Head-to-Tail collision
    if (p.segments && p.segments.length > 0) {
      const tailSeg = p.segments[p.segments.length - 1];
      const h2tDist = Math.hypot(tailSeg.x - serpent.x, tailSeg.y - serpent.y);
      if (h2tDist < (serpent.radius + 18) && p.damageCooldown <= 0 && (!serpent.contactDamageCooldown || serpent.contactDamageCooldown <= 0)) {
        const baseDamage = 8;
        const damageTaken = Math.round(baseDamage * resistance);
        
        p.energy = Math.max(0, p.energy - damageTaken);
        p.score = Math.max(0, p.score - 40);
        p.damageCooldown = 45;
        p.ticksSinceLastDamage = 0;
        serpent.contactDamageCooldown = 1.0;

        core.camera.shakeTime = 8;
        core.camera.shakeIntensity = 3.5;
        triggerAudioSign('Fuga de plasma', 'blackout');

        core.floatingTexts.push({
          id: Math.random().toString(),
          x: tailSeg.x,
          y: tailSeg.y - 30,
          text: `GOLPE EN COLA -${damageTaken} ENERGÍA`,
          color: '#fb923c',
          life: 1.5,
          size: 12
        });
      }
    }

    // 3. Body Grazing
    if (serpent.segments && serpent.segments.length > 1) {
      for (let i = 1; i < serpent.segments.length; i++) {
        const sSeg = serpent.segments[i];
        const grazeDist = Math.hypot(p.x - sSeg.x, p.y - sSeg.y);
        if (grazeDist < (serpent.radius + 15) && p.damageCooldown <= 0 && (!serpent.contactDamageCooldown || serpent.contactDamageCooldown <= 0)) {
          const baseDamage = 3;
          const damageTaken = Math.round(baseDamage * resistance);
          
          p.energy = Math.max(0, p.energy - damageTaken);
          p.score = Math.max(0, p.score - 15);
          p.damageCooldown = 30;
          p.ticksSinceLastDamage = 0;
          serpent.contactDamageCooldown = 0.8;

          const pushAngle = Math.atan2(p.y - sSeg.y, p.x - sSeg.x);
          p.vx += Math.cos(pushAngle) * 6;
          p.vy += Math.sin(pushAngle) * 6;

          core.camera.shakeTime = 4;
          core.camera.shakeIntensity = 1.5;

          core.floatingTexts.push({
            id: Math.random().toString(),
            x: p.x,
            y: p.y - 30,
            text: `ROCE CORRUPTO -${damageTaken}`,
            color: '#ef4444',
            life: 1.2,
            size: 11
          });
        }
      }
    }

    // 4. Active Ability Collision
    if (core.ability.radialEffectActive) {
      const radDist = Math.hypot(serpent.x - core.ability.radialEffectX, serpent.y - core.ability.radialEffectY);
      if (radDist <= core.ability.radialEffectRadius) {
        if (!serpent.lastHitByAbilityTime || (survival.elapsedTime - serpent.lastHitByAbilityTime) > 0.5) {
          serpent.lastHitByAbilityTime = survival.elapsedTime;
          
          const damage = 25;
          serpent.hp -= damage;
          
          core.floatingTexts.push({
            id: Math.random().toString(),
            x: serpent.x,
            y: serpent.y - 30,
            text: `-${damage}`,
            color: '#22d3ee',
            life: 1.2,
            size: 13
          });
          triggerBurstSparks(serpent.x, serpent.y, ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy].color, 'GRID_GLOW', 8);
          
          const pbAngle = Math.atan2(serpent.y - core.ability.radialEffectY, serpent.x - core.ability.radialEffectX);
          serpent.x += Math.cos(pbAngle) * 45;
          serpent.y += Math.sin(pbAngle) * 45;
        }
      }
    }

    // 5. Tail Strike collision
    if (p.segments && p.segments.length > 0) {
      for (let sIdx = 1; sIdx < p.segments.length; sIdx++) {
        const pSeg = p.segments[sIdx];
        const tsDist = Math.hypot(serpent.x - pSeg.x, serpent.y - pSeg.y);
        if (tsDist < 24) {
          if (!serpent.lastHitByTailTime || (survival.elapsedTime - serpent.lastHitByTailTime) > 0.3) {
            serpent.lastHitByTailTime = survival.elapsedTime;
            
            const evoDmg = p.evolution === 'TITAN_SERPENT' ? 30 : p.evolution === 'GUARDIAN_SERPENT' ? 22 : 15;
            serpent.hp -= evoDmg;
            
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: serpent.x,
              y: serpent.y - 30,
              text: `TAIL STRIKE -${evoDmg}`,
              color: '#f59e0b',
              life: 1.5,
              size: 13
            });
            triggerBurstSparks(serpent.x, serpent.y, '#f59e0b', 'TAIL_SPARK', 12);
            
            core.camera.shakeTime = 6;
            core.camera.shakeIntensity = 3.0;
            
            const pbAngle = Math.atan2(serpent.y - pSeg.y, serpent.x - pSeg.x);
            serpent.x += Math.cos(pbAngle) * 25;
            serpent.y += Math.sin(pbAngle) * 25;
          }
        }
      }
    }

    // 6. Check if serpent is defeated
    if (serpent.hp <= 0 && serpent.alive) {
      serpent.alive = false;
      
      triggerBurstSparks(serpent.x, serpent.y, ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy].color, 'GRID_GLOW', 18);
      triggerBurstSparks(serpent.x, serpent.y, '#1e1b4b', 'BLACKOUT_SMOKE', 15);
      
      triggerAudioSign('Anti-serpiente Purificada', 'nexus');
      
      const points = 150 + serpent.lengthLevel * 50;
      p.score += points;
      
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: serpent.x,
        y: serpent.y - 20,
        text: `+${points} PTS`,
        color: '#fbbf24',
        life: 1.5,
        size: 13
      });
      
      const numOrbs = 3 + Math.floor(Math.random() * 3);
      for (let oIdx = 0; oIdx < numOrbs; oIdx++) {
        const orbAngle = Math.random() * Math.PI * 2;
        const orbDist = Math.random() * 40;
        
        core.orbs.push({
          id: Math.random().toString(36).substring(2, 9),
          x: serpent.x + Math.cos(orbAngle) * orbDist,
          y: serpent.y + Math.sin(orbAngle) * orbDist,
          type: 'SOLAR',
          radius: 8,
          pulsePhase: Math.random() * Math.PI,
          pulseSpeed: 0.04,
          glowSize: 22,
          energyValue: 10,
          scoreValue: 25
        });
      }
    }
  }

  interface DifficultyProfile {
    tier: number;
    romanTier: string;
    label: string;
    enemyHpMultiplier: number;
    enemySpeedMultiplier: number;
    enemyDamageMultiplier: number;
    antiSerpentMaxCount: number;
    eventInterval: number;
  }

  const getSurvivalDifficultyProfile = (timeAlive: number): DifficultyProfile => {
    if (timeAlive < 60) {
      return {
        tier: 1,
        romanTier: "I",
        label: "FASE DE ESTABILIDAD",
        enemyHpMultiplier: 1.0,
        enemySpeedMultiplier: 1.0,
        enemyDamageMultiplier: 1.0,
        antiSerpentMaxCount: 4,
        eventInterval: 65
      };
    } else if (timeAlive < 120) {
      return {
        tier: 2,
        romanTier: "II",
        label: "PERTURBACIÓN MENOR",
        enemyHpMultiplier: 1.25,
        enemySpeedMultiplier: 1.10,
        enemyDamageMultiplier: 1.15,
        antiSerpentMaxCount: 5,
        eventInterval: 65
      };
    } else if (timeAlive < 180) {
      return {
        tier: 3,
        romanTier: "III",
        label: "SINFONÍA DE CORRUPCIÓN",
        enemyHpMultiplier: 1.55,
        enemySpeedMultiplier: 1.20,
        enemyDamageMultiplier: 1.30,
        antiSerpentMaxCount: 5,
        eventInterval: 55
      };
    } else if (timeAlive < 240) {
      return {
        tier: 4,
        romanTier: "IV",
        label: "ECLIPSE GRADUAL",
        enemyHpMultiplier: 1.90,
        enemySpeedMultiplier: 1.30,
        enemyDamageMultiplier: 1.50,
        antiSerpentMaxCount: 6,
        eventInterval: 55
      };
    } else {
      return {
        tier: 5,
        romanTier: "V",
        label: "PUNTO DE COLAPSO",
        enemyHpMultiplier: 2.30,
        enemySpeedMultiplier: 1.40,
        enemyDamageMultiplier: 1.70,
        antiSerpentMaxCount: 7,
        eventInterval: 45
      };
    }
  };

  const getStasisSlowMultiplier = (survival: any, currentStasisActive: boolean): number => {
    if (!currentStasisActive) return 1.0;
    const isFlood = survival?.activeBlackoutEvent?.type === "stasis_flood";
    const timeAlive = survival?.elapsedTime ?? 0;
    if (timeAlive > 180) return 0.52; // 48% slow
    if (isFlood) return 0.58; // 42% slow
    return 0.65; // 35% slow
  };

  const getEntropyTickDamage = (playerHp: number): number => {
    let baseDamage = 0.4;
    if (playerHp < 25) {
      baseDamage *= 0.6; // 40% reduction mercy threshold
    }
    return baseDamage;
  };

  const getVitalFlowMoveSpeed = (pickupsCollected: number): number => {
    const baseSpeed = 155;
    const speedIncrease = Math.floor(pickupsCollected / 12) * 4;
    const totalSpeed = Math.min(255, baseSpeed + speedIncrease);
    return totalSpeed / 40;
  };

  const handleVitalFlowInput = (key: string) => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    let nextDir = { ...core.vitalFlow.desiredDirection };

    if (key === 'arrowup' || key === 'w') {
      nextDir = { x: 0, y: -1 };
    } else if (key === 'arrowdown' || key === 's') {
      nextDir = { x: 0, y: 1 };
    } else if (key === 'arrowleft' || key === 'a') {
      nextDir = { x: -1, y: 0 };
    } else if (key === 'arrowright' || key === 'd') {
      nextDir = { x: 1, y: 0 };
    } else {
      return;
    }

    // Classic snake rule: cannot turn 180 degrees directly back into oneself if we have any segments
    const currentDir = core.vitalFlow.direction || { x: 1, y: 0 };
    const dotProduct = nextDir.x * currentDir.x + nextDir.y * currentDir.y;
    
    // If we're moving opposite, ignore unless we only have head
    if (dotProduct === -1 && core.player.segments.length > 1) {
      return;
    }

    core.vitalFlow.desiredDirection = nextDir;
    core.vitalFlow.hasStartedMoving = true;
    core.activeControlMode = 'keyboard';
  };

  const updateVitalFlowMovement = (dt: number) => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    const vf = core.vitalFlow;
    const p = core.player;

    // Tick grace timer
    if (vf.spawnGraceTimer > 0) {
      vf.spawnGraceTimer = Math.max(0, vf.spawnGraceTimer - dt);
    }

    const speed = getVitalFlowMoveSpeed(vf.pickupsCollected);

    const desired = vf.desiredDirection ?? vf.direction ?? { x: 1, y: 0 };
    vf.direction = desired;

    // Update vitalFlow head position
    const oldHead = vf.head ?? { x: p.x, y: p.y };
    const newHead = {
      x: oldHead.x + desired.x * speed * dt,
      y: oldHead.y + desired.y * speed * dt,
    };
    vf.head = newHead;

    // Sync to global player head
    p.x = newHead.x;
    p.y = newHead.y;
    p.vx = desired.x * speed;
    p.vy = desired.y * speed;
    p.angle = Math.atan2(desired.y, desired.x);

    // Unshift newHead to bodyPoints history trail
    if (!vf.bodyPoints) vf.bodyPoints = [];
    vf.bodyPoints.unshift({ x: newHead.x, y: newHead.y });

    // Smoothly grow current body length towards target
    if (vf.currentBodyLength < vf.targetBodyLength) {
      vf.currentBodyLength = Math.min(vf.targetBodyLength, vf.currentBodyLength + 0.15 * dt);
    }
    const targetCount = Math.floor(vf.currentBodyLength);

    // Keep player.segments matching targetCount
    while (p.segments.length < targetCount) {
      const last = p.segments[p.segments.length - 1] || { x: p.x, y: p.y, angle: p.angle, size: 15 };
      p.segments.push({ x: last.x, y: last.y, angle: last.angle, size: 15 });
    }
    while (p.segments.length > targetCount) {
      p.segments.pop();
    }

    // Update trailing segments with classic spacing
    const segSpacing = 16;
    if (p.segments.length > 0) {
      let prevX = p.x;
      let prevY = p.y;
      for (let i = 0; i < p.segments.length; i++) {
        const seg = p.segments[i];
        const dx = prevX - seg.x;
        const dy = prevY - seg.y;
        const dist = Math.hypot(dx, dy);
        if (dist > segSpacing) {
          const ratio = segSpacing / dist;
          seg.x = prevX - dx * ratio;
          seg.y = prevY - dy * ratio;
          seg.angle = Math.atan2(dy, dx);
        }
        prevX = seg.x;
        prevY = seg.y;
      }
    }

    // Sync bodyPoints to segments
    vf.bodyPoints = p.segments.map(s => ({ x: s.x, y: s.y }));
  };

  const checkVitalFlowPickupCollection = () => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    const vf = core.vitalFlow;
    const p = core.player;

    const pickupsToKeep: VitalFlowPickup[] = [];
    let collectedAny = false;

    for (const pickup of vf.pickups) {
      const dist = Math.hypot(p.x - pickup.x, p.y - pickup.y);
      if (dist < 32) {
        collectedAny = true;
        vf.pickupsCollected++;

        // Base points and combo multiplier
        const basePoints = pickup.kind === 'nexus_core' ? 250 : 100;
        const phase = getVitalFlowEvolutionStage(vf.pickupsCollected);
        const addedScore = basePoints * phase;
        p.score += addedScore;

        // Smooth growth
        const segmentGrowth = pickup.kind === 'nexus_core' ? 4 : 2;
        vf.targetBodyLength += segmentGrowth;

        // Update player.length and targetLength to sync React HUD
        p.targetLength = vf.targetBodyLength;
        p.length = vf.currentBodyLength;

        // Particle feedback
        const sparkColor = pickup.kind === 'nexus_core' ? '#22d3ee' : '#ffd166';
        triggerBurstSparks(pickup.x, pickup.y, sparkColor, pickup.kind === 'nexus_core' ? 'NEXUS_SPARK' : 'SOLAR_SPARK', 16);

        // Sound signal
        triggerAudioSign('Esencia vital integrada', pickup.kind === 'nexus_core' ? 'nexus' : 'solar');

        // Create floating text
        core.floatingTexts.push({
          id: `vf_score_${Date.now()}_${Math.random()}`,
          x: pickup.x,
          y: pickup.y - 12,
          text: `+${addedScore} PTS`,
          color: sparkColor,
          life: 1.2,
          size: 14
        });

        // Evolution transition checks
        const prevPhase = getVitalFlowEvolutionStage(vf.pickupsCollected - 1);
        const newPhase = getVitalFlowEvolutionStage(vf.pickupsCollected);
        if (newPhase > prevPhase) {
          triggerBurstSparks(p.x, p.y, '#10b981', 'SOLAR_SPARK', 25);
          triggerAudioSign('Fase evolutiva alcanzada', 'evolve');
          
          core.floatingTexts.push({
            id: `vf_evolve_${Date.now()}_${Math.random()}`,
            x: p.x,
            y: p.y - 32,
            text: `FASE ${newPhase} ALCANZADA!`,
            color: '#10b981',
            life: 2.0,
            size: 18
          });

          // Visual camera punch
          core.camera.zoom = Math.min(1.4, core.camera.zoom + 0.12);
        }

      } else {
        pickupsToKeep.push(pickup);
      }
    }

    vf.pickups = pickupsToKeep;

    if (collectedAny) {
      spawnVitalFlowPickups(core);
    }
  };

  const checkVitalFlowWallCollision = () => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    if (core.vitalFlow.spawnGraceTimer > 0) return;
    if (core.vitalFlow.resizeGraceTimer && core.vitalFlow.resizeGraceTimer > 0) return;

    const bounds = getActiveVitalFlowArenaBounds();
    const head = core.vitalFlow.head ?? { x: core.player.x, y: core.player.y };
    const radius = 10;

    if (
      head.x - radius < bounds.left ||
      head.x + radius > bounds.right ||
      head.y - radius < bounds.top ||
      head.y + radius > bounds.bottom
    ) {
      handleVitalFlowGameOver('WALL COLLISION');
    }
  };

  const checkVitalFlowSelfCollision = () => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    if (core.vitalFlow.spawnGraceTimer > 0) return;
    if (core.vitalFlow.resizeGraceTimer && core.vitalFlow.resizeGraceTimer > 0) return;

    const p = core.player;

    // Self-collision is physically possible from index 5 (6th segment) and onwards
    // and using a robust radius of 14px (spacing is 16px, sizes are 15px)
    for (let i = 5; i < p.segments.length; i++) {
      const seg = p.segments[i];
      const dist = Math.hypot(p.x - seg.x, p.y - seg.y);
      if (dist < 14) {
        handleVitalFlowGameOver('SELF COLLISION');
        return;
      }
    }
  };

  const updateVitalFlow = (dt: number) => {
    const core = stateRef.current;
    if (!core.vitalFlow || core.gameState !== 'PLAYING') return;

    // Check if cinematic (countdown) is active
    if (cinematicActiveRef.current) {
      core.player.vx = 0;
      core.player.vy = 0;
      return;
    }

    const vf = core.vitalFlow;

    // Update time
    vf.elapsedTime += (1 / 60) * dt;

    // Smooth growth of length
    if (vf.currentBodyLength < vf.targetBodyLength) {
      vf.currentBodyLength += 0.05 * dt;
      if (vf.currentBodyLength > vf.targetBodyLength) {
        vf.currentBodyLength = vf.targetBodyLength;
      }
    }
    
    // Set actual segments array length
    const targetCount = Math.floor(vf.currentBodyLength);
    while (core.player.segments.length < targetCount) {
      const lastSeg = core.player.segments[core.player.segments.length - 1] || { x: core.player.x, y: core.player.y, angle: core.player.angle, size: 15 };
      core.player.segments.push({
        x: lastSeg.x,
        y: lastSeg.y,
        angle: lastSeg.angle,
        size: 15
      });
    }
    if (core.player.segments.length > targetCount) {
      core.player.segments.length = targetCount;
    }

    // Sync player length state
    core.player.length = vf.currentBodyLength;
    core.player.targetLength = vf.targetBodyLength;

    // Update core player evolution based on pickupsCollected stage
    const stage = getVitalFlowEvolutionStage(vf.pickupsCollected);
    if (stage <= 2) {
      core.player.evolution = 'SPARK';
    } else if (stage <= 4) {
      core.player.evolution = 'SOLAR_STREAM';
    } else if (stage <= 6) {
      core.player.evolution = 'GUARDIAN_SERPENT';
    } else {
      core.player.evolution = 'TITAN_SERPENT';
    }

    // Handle evolution flash and feedback on upgrade
    if (ENABLE_VITAL_FLOW_EVOLUTION_FLASH) {
      if (vf.lastEvolutionStage === undefined) {
        vf.lastEvolutionStage = stage;
      } else if (stage > vf.lastEvolutionStage) {
        vf.lastEvolutionStage = stage;
        vf.evolutionFlashTimer = 1.2;
        const label = getVitalFlowEvolutionLabel(stage);
        vf.lastEvolutionLabel = label;
        showTemporaryMessage(`EVOLUCIÓN DETECTADA: ${label.toUpperCase()}`);
        triggerAudioSign('Evolución Vital', 'evolve');
      }
    }

    // Decrement timers securely with delta time
    if (vf.resizeGraceTimer && vf.resizeGraceTimer > 0) {
      vf.resizeGraceTimer = Math.max(0, vf.resizeGraceTimer - (1 / 60) * dt);
    }
    if (vf.evolutionFlashTimer && vf.evolutionFlashTimer > 0) {
      vf.evolutionFlashTimer = Math.max(0, vf.evolutionFlashTimer - (1 / 60) * dt);
    }

    // Run sub-methods
    updateVitalFlowMovement(dt);
    checkVitalFlowPickupCollection();
    checkVitalFlowWallCollision();
    checkVitalFlowSelfCollision();

    // Increment particle timer etc.
    core.vitalEnergyWind += 0.015 * dt;
  };

  const renderVitalFlow = (ctx: CanvasRenderingContext2D, dt: number) => {
    const core = stateRef.current;
    if (!core.vitalFlow) return;

    // Background atmosphere
    drawSpaceAtmosphereNebula(ctx, core.camera);

    // Subtle Curves Network
    drawSubtleCurvesVitalNetwork(ctx);

    // Render food/pickups
    core.vitalFlow.pickups.forEach((pickup) => {
      pickup.pulsePhase = (pickup.pulsePhase || 0) + 0.05 * dt;
      const dynamicRadius = (pickup.radius || 10) + Math.sin(pickup.pulsePhase) * 1.6;

      ctx.save();

      if (pickup.kind === 'solar_orb') {
        const outerGlow = dynamicRadius + 14;
        const grad = ctx.createRadialGradient(pickup.x, pickup.y, 1, pickup.x, pickup.y, outerGlow);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, '#fbbf24');
        grad.addColorStop(0.65, '#f59e0b');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, outerGlow, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.3 * (0.6 + Math.sin(core.vitalEnergyWind) * 0.4);
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, dynamicRadius * 1.35, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const outerGlow = dynamicRadius + 18;
        const grad = ctx.createRadialGradient(pickup.x, pickup.y, 1, pickup.x, pickup.y, outerGlow);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, '#22d3ee');
        grad.addColorStop(0.55, '#7c4dff');
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pickup.x, pickup.y, outerGlow, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
        ctx.lineWidth = 1.2;
        ctx.save();
        ctx.translate(pickup.x, pickup.y);
        ctx.rotate(core.vitalEnergyWind);
        ctx.beginPath();
        ctx.ellipse(0, 0, dynamicRadius * 1.45, dynamicRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    });

    // Draw Orbi
    drawPremiumOrbiSerpent(ctx);

    // Particles glow
    drawCosmicParticlesGlow(ctx);

    // Floating text overlays
    drawFloatingTextsOverlays(ctx);

    if (ENABLE_VITAL_FLOW_DEBUG_BOUNDS) {
      const bounds = getActiveVitalFlowArenaBounds();
      ctx.save();
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;
      ctx.strokeRect(bounds.left, bounds.top, bounds.width, bounds.height);
      ctx.restore();
    }

    // Evolution Flash Overlay
    const vf = core.vitalFlow;
    if (ENABLE_VITAL_FLOW_EVOLUTION_FLASH && vf.evolutionFlashTimer && vf.evolutionFlashTimer > 0) {
      ctx.save();
      
      // Reset transform to screen space
      const dpr = typeof window !== 'undefined' ? (window.devicePixelRatio || 1) : 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      
      // Full screen glow matching evolution mood
      const alpha = Math.min(0.5, vf.evolutionFlashTimer);
      ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      
      // Draw massive floating text of evolution
      ctx.font = "italic 900 32px 'Space Grotesk', Inter, sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Text coordinates at screen center
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2 - 40;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1.0, vf.evolutionFlashTimer * 1.5)})`;
      ctx.fillText(`¡EVOLUCIÓN COMPLETA!`, centerX, centerY);
      
      ctx.font = "bold 16px 'JetBrains Mono', monospace";
      ctx.fillStyle = `rgba(110, 231, 183, ${Math.min(1.0, vf.evolutionFlashTimer * 1.5)})`;
      ctx.fillText(vf.lastEvolutionLabel ? vf.lastEvolutionLabel.toUpperCase() : "SINCRONIZACIÓN", centerX, centerY + 40);
      
      ctx.restore();
    }
  };

  const drawSurvivalChargeTelegraph = (ctx: CanvasRenderingContext2D, serpent: SurvivalAntiSerpent) => {
    if (!serpent.alive) return;
    
    if (serpent.chargeTelegraphTimer && serpent.chargeTelegraphTimer > 0) {
      const duration = serpent.isAlpha ? 1.2 : 0.7;
      const progress = Math.max(0, Math.min(1.0, 1 - serpent.chargeTelegraphTimer / duration));
      
      const startX = serpent.x;
      const startY = serpent.y;
      const targetX = serpent.chargeTargetX ?? serpent.x;
      const targetY = serpent.chargeTargetY ?? serpent.y;
      
      const dx = targetX - startX;
      const dy = targetY - startY;
      const dist = Math.hypot(dx, dy);
      if (dist <= 0) return;
      
      const dirX = dx / dist;
      const dirY = dy / dist;
      
      const trajectoryLength = 500;
      const endX = startX + dirX * trajectoryLength;
      const endY = startY + dirY * trajectoryLength;
      
      ctx.save();
      
      const colorProgress = progress;
      const strokeColor = `rgba(${Math.floor(147 + colorProgress * 108)}, ${Math.floor(51 - colorProgress * 17)}, ${Math.floor(234 - colorProgress * 184)}, ${0.35 + progress * 0.45})`;
      const glowColor = `rgba(${Math.floor(168 + colorProgress * 87)}, ${Math.floor(85 - colorProgress * 51)}, ${Math.floor(247 - colorProgress * 197)}, ${0.45 + progress * 0.45})`;
      
      ctx.shadowBlur = 10 + progress * 15;
      ctx.shadowColor = glowColor;
      ctx.lineWidth = serpent.isAlpha ? (18 + progress * 14) : (10 + progress * 8);
      ctx.strokeStyle = strokeColor;
      
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      const laneWidth = serpent.isAlpha ? 45 : 30;
      const perpX = -dirY * laneWidth;
      const perpY = dirX * laneWidth;
      
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.15 + progress * 0.5})`;
      
      ctx.beginPath();
      ctx.moveTo(startX + perpX, startY + perpY);
      ctx.lineTo(endX + perpX, endY + perpY);
      ctx.moveTo(startX - perpX, startY - perpY);
      ctx.lineTo(endX - perpX, endY - perpY);
      ctx.stroke();
      
      ctx.fillStyle = `rgba(239, 68, 68, ${0.15 + progress * 0.4})`;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX + dirX * 100 + perpX * 0.5, startY + dirY * 100 + perpY * 0.5);
      ctx.lineTo(startX + dirX * 100 - perpX * 0.5, startY + dirY * 100 - perpY * 0.5);
      ctx.closePath();
      ctx.fill();

      if (serpent.isAlpha) {
        ctx.strokeStyle = `rgba(244, 63, 94, ${0.2 + progress * 0.6})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(targetX, targetY, 40 - progress * 15, 0, Math.PI * 2);
        ctx.stroke();
        
        const crossLength = 12;
        ctx.beginPath();
        ctx.moveTo(targetX - crossLength, targetY);
        ctx.lineTo(targetX + crossLength, targetY);
        ctx.moveTo(targetX, targetY - crossLength);
        ctx.lineTo(targetX, targetY + crossLength);
        ctx.stroke();
      }
      
      ctx.restore();
    }
  };

  const healSurvivalPlayerByPercent = (percent: number, reason: string) => {
    const core = stateRef.current;
    const p = core.player;
    if (!p) return;
    const healAmount = Math.round(100 * percent);
    p.energy = Math.min(100, p.energy + healAmount);
    
    core.floatingTexts.push({
      id: `heal_${Date.now()}_${Math.random()}`,
      x: p.x,
      y: p.y - 30,
      text: `+${healAmount}% REPARACIÓN (${reason})`,
      color: '#10b981',
      size: 13,
      vx: (Math.random() - 0.5) * 20,
      vy: -55,
      life: 1.2,
      maxLife: 1.2
    });
    triggerAudioSign('Crecimiento anti-serpiente', 'evolve');
  };

  const rewardSurvivalMilestone = (type: "minute" | "event" | "alpha") => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    switch (type) {
      case "minute":
        core.player.score = (core.player.score ?? 0) + 750;
        survival.magnetBoostTimer = 5.0;
        showSurvivalBanner("MINUTO SOBREVIVIDO", "+750 Puntos / Magnetismo vital");
        break;
      case "event":
        core.player.score = (core.player.score ?? 0) + 500;
        healSurvivalPlayerByPercent(0.08, "EVENTO ESTABILIZADO");
        break;
      case "alpha":
        core.player.score = (core.player.score ?? 0) + 2500;
        healSurvivalPlayerByPercent(0.16, "ALPHA PURGADA");
        addSurvivalGrowthSegments(1);
        break;
    }
  };

  const getSurvivalDeathCause = (lastDamageReason?: string): string => {
    if (!lastDamageReason) return "BLACKOUT OVERWHELMED";
    if (lastDamageReason === "ENTROPÍA") return "ENTROPY COLLAPSE";
    return lastDamageReason;
  };

  const handleSurvivalGameOver = () => {
    const core = stateRef.current;
    if (core.gameMode !== 'infinite' || !core.survival) return;

    const survival = core.survival;
    const p = core.player;
    if (!p) return;

    const finalTime = survival.elapsedTime ?? 0;
    const finalScore = p.score ?? 0;
    const finalEvents = survival.blackoutEventsCompleted ?? 0;
    const finalAlphas = survival.alphasDefeated ?? 0;
    const finalThreat = getSurvivalDifficultyProfile(finalTime).tier;

    const prevBestTimeStr = safeGetLocalStorage('orbi_best_survival_time');
    const prevBestTime = prevBestTimeStr ? parseFloat(prevBestTimeStr) : 0;
    if (finalTime > prevBestTime) {
      safeSetLocalStorage('orbi_best_survival_time', finalTime.toString());
      setBestSurvivalTime(finalTime);
    }

    const prevBestScoreStr = safeGetLocalStorage('orbi_best_survival_score');
    const prevBestScore = prevBestScoreStr ? parseInt(prevBestScoreStr, 10) : 0;
    if (finalScore > prevBestScore) {
      safeSetLocalStorage('orbi_best_survival_score', finalScore.toString());
      setBestSurvivalScore(finalScore);
    }

    const prevMaxEventsStr = safeGetLocalStorage('orbi_max_blackout_events_survived');
    const prevMaxEvents = prevMaxEventsStr ? parseInt(prevMaxEventsStr, 10) : 0;
    if (finalEvents > prevMaxEvents) {
      safeSetLocalStorage('orbi_max_blackout_events_survived', finalEvents.toString());
    }

    const prevMaxAlphasStr = safeGetLocalStorage('orbi_max_alphas_defeated');
    const prevMaxAlphas = prevMaxAlphasStr ? parseInt(prevMaxAlphasStr, 10) : 0;
    if (finalAlphas > prevMaxAlphas) {
      safeSetLocalStorage('orbi_max_alphas_defeated', finalAlphas.toString());
    }

    const prevBestThreatStr = safeGetLocalStorage('orbi_best_threat_tier');
    const prevBestThreat = prevBestThreatStr ? parseInt(prevBestThreatStr, 10) : 0;
    if (finalThreat > prevBestThreat) {
      safeSetLocalStorage('orbi_best_threat_tier', finalThreat.toString());
    }

    setSurvivalSummary({
      time: finalTime,
      score: finalScore,
      events: finalEvents,
      alphas: finalAlphas,
      threat: finalThreat,
      serpentsDefeated: survival.antiSerpentsDefeated ?? 0,
      maxEvolution: p.evolution || 'SPARK',
      dominantEnergy: getDominantAntiEnergy(survival.antiSerpents),
      cause: getSurvivalDeathCause(survival.lastDamageReason)
    });
  };

  const handleVitalFlowGameOver = (cause: 'WALL COLLISION' | 'SELF COLLISION') => {
    const core = stateRef.current;
    if (core.gameMode !== 'vital_flow' || !core.vitalFlow) return;

    setGameState('GAMEOVER');
    triggerAudioSign('Red vital purgada', 'reset');

    const vf = core.vitalFlow;
    const finalTime = vf.elapsedTime;
    const finalLength = vf.targetBodyLength;
    const finalPickups = vf.pickupsCollected;
    const finalScore = core.player.score;
    const finalEvolutionStage = getVitalFlowEvolutionStage(finalPickups);
    const finalEvolutionStr = `E${finalEvolutionStage}`;

    // Update LocalStorage and state
    const prevTimeStr = safeGetLocalStorage('orbi_best_vital_flow_time');
    const prevTime = prevTimeStr ? parseFloat(prevTimeStr) : 0;
    if (finalTime > prevTime) {
      safeSetLocalStorage('orbi_best_vital_flow_time', finalTime.toString());
      setBestVitalFlowTime(finalTime);
    }

    const prevLengthStr = safeGetLocalStorage('orbi_best_vital_flow_length');
    const prevLength = prevLengthStr ? parseInt(prevLengthStr, 10) : 0;
    if (finalLength > prevLength) {
      safeSetLocalStorage('orbi_best_vital_flow_length', finalLength.toString());
      setBestVitalFlowLength(finalLength);
    }

    const prevPickupsStr = safeGetLocalStorage('orbi_best_vital_flow_pickups');
    const prevPickups = prevPickupsStr ? parseInt(prevPickupsStr, 10) : 0;
    if (finalPickups > prevPickups) {
      safeSetLocalStorage('orbi_best_vital_flow_pickups', finalPickups.toString());
      setBestVitalFlowPickups(finalPickups);
    }

    const prevScoreStr = safeGetLocalStorage('orbi_best_vital_flow_score');
    const prevScore = prevScoreStr ? parseInt(prevScoreStr, 10) : 0;
    if (finalScore > prevScore) {
      safeSetLocalStorage('orbi_best_vital_flow_score', finalScore.toString());
      setBestVitalFlowScore(finalScore);
    }

    const prevEvolution = safeGetLocalStorage('orbi_best_vital_flow_evolution') || 'E1';
    const prevEvolutionStage = parseInt(prevEvolution.replace('E', ''), 10) || 1;
    if (finalEvolutionStage > prevEvolutionStage) {
      safeSetLocalStorage('orbi_best_vital_flow_evolution', finalEvolutionStr);
      setBestVitalFlowEvolution(finalEvolutionStr);
    }

    setVitalFlowSummary({
      time: finalTime,
      length: finalLength,
      pickups: finalPickups,
      maxEvolution: finalEvolutionStr,
      score: finalScore,
      cause
    });
  };

  const canStartAlphaEvent = (): boolean => {
    const core = stateRef.current;
    const survivalState = core.survival;
    if (!survivalState) return false;
    if ((survivalState.elapsedTime ?? 0) < 120) return false;
    
    // Check player HP ratio
    const p = core.player;
    if (p && p.energy < 30) return false; // low HP constraint

    const alive = survivalState.antiSerpents?.filter(s => s.alive && !s.isAlpha) ?? [];
    return alive.length <= 2;
  };

  function drawSurvivalAntiSerpent(ctx: CanvasRenderingContext2D, serpent: SurvivalAntiSerpent) {
    if (!serpent.alive) return;
    const registry = ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy];
    if (!registry) return;

    const baseColor = registry.color;
    const darkGlow = registry.glow;
    const radius = serpent.radius ?? 18;

    ctx.save();

    ctx.shadowBlur = 24;
    ctx.shadowColor = baseColor;

    // SECTION 10 & SECTION 11 — VISUAL TELEGRAPHS
    // Anti-Foton: Fine laser sniper telegraph
    if (serpent.antiEnergy === 'anti_foton' && serpent.attackTelegraphTimer && serpent.attackTelegraphTimer > 0) {
      ctx.save();
      ctx.shadowBlur = 0;
      // Pulsing red/purple laser line
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.0 + Math.sin(Date.now() * 0.05) * 0.4;
      ctx.beginPath();
      ctx.moveTo(serpent.x, serpent.y);
      ctx.lineTo(serpent.attackTelegraphX ?? serpent.x, serpent.attackTelegraphY ?? serpent.y);
      ctx.stroke();

      // Outer laser halo
      ctx.strokeStyle = 'rgba(217, 70, 239, 0.2)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.restore();
    }

    drawSurvivalChargeTelegraph(ctx, serpent);

    // ALPHA SPECIAL AURA
    if (serpent.isAlpha) {
      ctx.save();
      ctx.shadowBlur = 45;
      ctx.shadowColor = '#f43f5e';
      ctx.strokeStyle = `rgba(244, 63, 94, ${0.15 + Math.sin(Date.now() * 0.005) * 0.05})`;
      ctx.lineWidth = 14 + Math.sin(Date.now() * 0.01) * 3;
      ctx.beginPath();
      serpent.segments.forEach((seg, i) => {
        if (i === 0) ctx.moveTo(seg.x, seg.y);
        else ctx.lineTo(seg.x, seg.y);
      });
      ctx.stroke();
      ctx.restore();
    }

    // SECTION 10 — SEGMENT VISUALS
    if (serpent.segments && serpent.segments.length > 0) {
      // Draw thermal wave aura for Anti-Termo underneath everything
      if (serpent.antiEnergy === 'anti_termo') {
        ctx.save();
        ctx.shadowBlur = 35;
        ctx.shadowColor = '#f97316';
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
        ctx.lineWidth = 8;
        
        ctx.beginPath();
        serpent.segments.forEach((seg, idx) => {
          if (idx === 0) ctx.moveTo(seg.x, seg.y);
          else ctx.lineTo(seg.x, seg.y);
        });
        ctx.stroke();
        ctx.restore();
      }

      for (let i = serpent.segments.length - 1; i > 0; i--) {
        const segment = serpent.segments[i];
        const segRadius = radius * (1 - (i / serpent.segments.length) * 0.4);
        
        ctx.save();
        ctx.fillStyle = darkGlow;
        ctx.strokeStyle = baseColor;
        ctx.lineWidth = 3;

        if (serpent.antiEnergy === 'anti_foton') {
          // Sharp/Hexagonal segments
          ctx.beginPath();
          for (let k = 0; k < 6; k++) {
            const angle = (k * Math.PI) / 3;
            const px = segment.x + Math.cos(angle) * segRadius;
            const py = segment.y + Math.sin(angle) * segRadius;
            if (k === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Thin inner core
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, segRadius * 0.25, 0, Math.PI * 2);
          ctx.fill();

        } else if (serpent.antiEnergy === 'anti_hydro') {
          // Liquid overlapping bubble
          ctx.beginPath();
          ctx.arc(segment.x, segment.y, segRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner gloss wet reflection dot
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(segment.x - segRadius * 0.35, segment.y - segRadius * 0.35, segRadius * 0.18, 0, Math.PI * 2);
          ctx.fill();

        } else if (serpent.antiEnergy === 'anti_aero') {
          // Streamlined narrow triangles
          ctx.beginPath();
          const nextSeg = serpent.segments[i - 1] || segment;
          const segAngle = Math.atan2(nextSeg.y - segment.y, nextSeg.x - segment.x);
          
          ctx.translate(segment.x, segment.y);
          ctx.rotate(segAngle);

          ctx.moveTo(segRadius * 1.1, 0);
          ctx.lineTo(-segRadius * 0.6, segRadius * 0.7);
          ctx.lineTo(-segRadius * 0.6, -segRadius * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Aero wind sparkle trails (scattered particles)
          if (Math.random() < 0.05) {
            triggerBurstSparks(segment.x, segment.y, '#10b981', 'SOLAR_SPARK', 1);
          }

        } else if (serpent.antiEnergy === 'anti_termo') {
          // Chunky square-circles (rounded rects)
          ctx.beginPath();
          ctx.roundRect(segment.x - segRadius, segment.y - segRadius, segRadius * 2, segRadius * 2, segRadius * 0.5);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(segment.x - segRadius * 0.4, segment.y - segRadius * 0.4, segRadius * 0.8, segRadius * 0.8, segRadius * 0.15);
          ctx.fill();
        }

        ctx.restore();
      }
    }

    // SECTION 10 — HEAD VISUALS
    ctx.save();
    ctx.translate(serpent.x, serpent.y);
    ctx.rotate(serpent.angle ?? 0);

    ctx.fillStyle = '#050b18';
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = 4;

    if (serpent.antiEnergy === 'anti_foton') {
      // Elongated pointed head
      ctx.beginPath();
      ctx.moveTo(radius * 1.5, 0);
      ctx.lineTo(-radius * 0.6, radius * 0.8);
      ctx.lineTo(-radius * 1.2, radius * 0.5);
      ctx.lineTo(-radius * 0.8, 0);
      ctx.lineTo(-radius * 1.2, -radius * 0.5);
      ctx.lineTo(-radius * 0.6, -radius * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sharp lineal crimson eyes
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 12;
      ctx.fillRect(radius * 0.3, -radius * 0.4, 6.5, 1.8);
      ctx.fillRect(radius * 0.3, radius * 0.3, 6.5, 1.8);

    } else if (serpent.antiEnergy === 'anti_hydro') {
      // Rounded droplet head
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.1, -Math.PI * 0.5, Math.PI * 0.5, true);
      ctx.lineTo(-radius * 1.0, radius * 0.5);
      ctx.lineTo(-radius * 0.7, 0);
      ctx.lineTo(-radius * 1.0, -radius * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glossy turquoise/cyan eyes
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(radius * 0.4, -radius * 0.35, 3.8, 0, Math.PI * 2);
      ctx.arc(radius * 0.4, radius * 0.35, 3.8, 0, Math.PI * 2);
      ctx.fill();

    } else if (serpent.antiEnergy === 'anti_aero') {
      // Backward swept wings head
      ctx.beginPath();
      ctx.moveTo(radius * 1.3, 0);
      ctx.lineTo(-radius * 0.4, radius * 1.3);
      ctx.lineTo(-radius * 1.0, radius * 0.4);
      ctx.lineTo(-radius * 0.6, 0);
      ctx.lineTo(-radius * 1.0, -radius * 0.4);
      ctx.lineTo(-radius * 0.4, -radius * 1.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Neon green eyes
      ctx.fillStyle = '#10b981';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(radius * 0.35, -radius * 0.3, 3.0, 0, Math.PI * 2);
      ctx.arc(radius * 0.35, radius * 0.3, 3.0, 0, Math.PI * 2);
      ctx.fill();

    } else if (serpent.antiEnergy === 'anti_termo') {
      // Chunky blocky heavy head
      ctx.beginPath();
      ctx.roundRect(-radius * 1.1, -radius * 1.1, radius * 2.3, radius * 2.2, radius * 0.4);
      ctx.fill();
      ctx.stroke();

      // Deep orange burning ember eyes
      ctx.fillStyle = '#f97316';
      ctx.shadowColor = '#ea580c';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(radius * 0.5, -radius * 0.4, 4.2, 0, Math.PI * 2);
      ctx.arc(radius * 0.5, radius * 0.4, 4.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Active ability visual feedback pulse ring around head
    if (serpent.chargeTelegraphTimer && serpent.chargeTelegraphTimer > 0) {
      ctx.strokeStyle = baseColor;
      ctx.lineWidth = 2 + Math.sin(Date.now() * 0.03) * 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, radius * 1.4, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
    ctx.restore();
  }

  const updateSurvivalProjectiles = (dt: number) => {
    const core = stateRef.current;
    if (!core.survival || !core.survival.antiProjectiles) return;
    const p = core.player;
    if (!p) return;

    const survival = core.survival;
    for (const proj of survival.antiProjectiles) {
      if (!proj.alive) continue;

      // Move projectile
      proj.x += proj.vx * (1 / 60) * dt;
      proj.y += proj.vy * (1 / 60) * dt;

      // Decrement life
      proj.life -= (1 / 60) * dt;
      if (proj.life <= 0) {
        proj.alive = false;
        triggerProjectileExplosion(proj);
        continue;
      }

      // Check collision with player head
      const dist = Math.hypot(proj.x - p.x, proj.y - p.y);
      if (dist < proj.radius + p.radius) {
        proj.alive = false;
        damagePlayerSurvival(proj.damage, proj.type);
        triggerProjectileExplosion(proj);

        // Apply hit status debuff immediately
        if (proj.type === 'stasis_glob') {
          survival.debuffType = 'ESTASIS';
          survival.debuffTimer = 2.2; // 2.2 seconds slow
          triggerDebuffFeedbackText("ESTASIS", "#22d3ee");
        } else if (proj.type === 'entropy_burst') {
          survival.debuffType = 'ENTROPÍA';
          survival.debuffTimer = 3.2; // 3.2 seconds disable recovery
          triggerDebuffFeedbackText("ENTROPÍA RECOB. BLOQUEADA", "#f97316");
        }
      }
    }

    // Filter alive projectiles
    survival.antiProjectiles = survival.antiProjectiles.filter(p => p.alive);
  };

  const triggerProjectileExplosion = (proj: SurvivalAntiProjectile) => {
    const core = stateRef.current;
    const survival = core.survival;
    if (!survival) return;

    // Spawn visual blast sparkles
    const color = proj.type === 'dark_lance' ? '#ec4899' :
                  proj.type === 'stasis_glob' ? '#22d3ee' : '#f97316';
                  
    triggerBurstSparks(proj.x, proj.y, color, 'GRID_GLOW', 8);

    // If stasis glob or entropy burst explode, they leave a hazard pool/field behind!
    // Section 12: limit to 5 active hazard zones to keep screen clean
    if (!survival.hazards) survival.hazards = [];
    if (survival.hazards.length >= 5) {
      // Remove oldest hazard to make room
      survival.hazards.shift();
    }

    if (proj.type === 'stasis_glob') {
      // Anti-Hydro Trait: +15% pool radius (base 55 * 1.15 = 63.25) and duration (base 3.2s * 1.15 = 3.68s)
      survival.hazards.push({
        id: `haz_stasis_${Date.now()}_${Math.random()}`,
        type: 'stasis_pool',
        x: proj.x,
        y: proj.y,
        radius: 63,
        duration: 3.7,
        damageTimer: 0
      });
      triggerAudioSign('soft_launch_chime', 'blackout');
    } else if (proj.type === 'entropy_burst') {
      // Anti-Termo Trait: entropy field deals damage
      survival.hazards.push({
        id: `haz_entropy_${Date.now()}_${Math.random()}`,
        type: 'entropy_field',
        x: proj.x,
        y: proj.y,
        radius: 48,
        duration: 2.8,
        damageTimer: 0
      });
      triggerAudioSign('soft_orbi_pulse', 'blackout');
    }
  };

  const updateSurvivalHazards = (dt: number) => {
    const core = stateRef.current;
    if (!core.survival || !core.survival.hazards) return;
    const p = core.player;
    if (!p) return;

    const survival = core.survival;
    survival.debuffFeedbackCooldown = Math.max(0, (survival.debuffFeedbackCooldown || 0) - (1 / 60) * dt);

    let playerInStasis = false;
    let playerInEntropy = false;

    for (const haz of survival.hazards) {
      haz.duration -= (1 / 60) * dt;
      if (haz.duration <= 0) continue;

      // Check player overlap
      const dist = Math.hypot(haz.x - p.x, haz.y - p.y);
      if (dist < haz.radius + p.radius) {
        if (haz.type === 'stasis_pool') {
          playerInStasis = true;
        } else if (haz.type === 'entropy_field') {
          playerInEntropy = true;
          
          // Deal ticks of damage while in entropy
          haz.damageTimer = (haz.damageTimer || 0) - (1 / 60) * dt;
          if (haz.damageTimer <= 0) {
            damagePlayerSurvival(2, 'entropy_field');
            haz.damageTimer = 0.45; // Every 0.45 seconds
          }
        }
      }
    }

    // Refresh active debuffs
    if (playerInStasis) {
      survival.debuffType = 'ESTASIS';
      survival.debuffTimer = Math.max(survival.debuffTimer || 0, 0.5);
      if (survival.debuffFeedbackCooldown <= 0) {
        triggerDebuffFeedbackText("ESTASIS", "#22d3ee");
        survival.debuffFeedbackCooldown = 1.2;
      }
    } else if (playerInEntropy) {
      survival.debuffType = 'ENTROPÍA';
      survival.debuffTimer = Math.max(survival.debuffTimer || 0, 0.5);
      if (survival.debuffFeedbackCooldown <= 0) {
        triggerDebuffFeedbackText("ENTROPÍA RECOB. BLOQUEADA", "#f97316");
        survival.debuffFeedbackCooldown = 1.2;
      }
    }

    // Filter alive hazard zones
    survival.hazards = survival.hazards.filter(h => h.duration > 0);
  };

  const updateSurvivalMode = (dt: number) => {
    const core = stateRef.current;
    if (core.gameMode !== 'infinite') return;

    if (!core.survival) {
      core.survival = createInitialSurvivalState();
    }

    const survival = core.survival;
    survival.elapsedTime += (1 / 60) * dt;
    survival.threatRating = Math.floor(survival.elapsedTime / 10);
    survival.antiSerpentThreatLevel = Math.floor(survival.elapsedTime / 30);

    if (survival.elapsedTime > 180) {
      survival.activeSymphony = 'Sinfonía del Eclipse Total';
    } else if (survival.elapsedTime > 90) {
      survival.activeSymphony = 'Sinfonía del Vacío Corrupto';
    } else {
      survival.activeSymphony = 'Eco de la Red Vital';
    }

    maybeSpawnSurvivalAntiSerpent(dt);
    updateSurvivalAntiSerpents(dt);
    updateSurvivalProjectiles(dt);
    updateSurvivalHazards(dt);
    updateSurvivalBlackoutEvents(dt);

    // Ticking active debuff timer
    if (survival.debuffTimer && survival.debuffTimer > 0) {
      survival.debuffTimer -= (1 / 60) * dt;
      if (survival.debuffTimer <= 0) {
        survival.debuffType = null;
      }
    }

    const p = core.player;
    if (p) {
      p.damageCooldown = Math.max(0, p.damageCooldown - 1 * dt);
      p.ticksSinceLastDamage += 1 * dt;

      // 1. Minute-marker survival milestone tracking (Section 7)
      if (survival.lastRewardedMinute === undefined) survival.lastRewardedMinute = 0;
      const minutesPassed = Math.floor(survival.elapsedTime / 60);
      if (minutesPassed > survival.lastRewardedMinute) {
        survival.lastRewardedMinute = minutesPassed;
        rewardSurvivalMilestone("minute");
      }

      // 2. ENTROPÍA debuff damage ticking (Section 4)
      if (survival.debuffType === 'ENTROPÍA') {
        if (survival.entropyTimer === undefined) survival.entropyTimer = 0;
        survival.entropyTimer += (1 / 60) * dt;
        if (survival.entropyTimer >= 0.15) {
          survival.entropyTimer = 0;
          const tickDamage = getEntropyTickDamage(p.energy);
          damagePlayerSurvival(tickDamage, 'ENTROPÍA');
        }
      } else {
        survival.entropyTimer = 0;
      }
    }
  };

  // Pointer Handlers for Mouse & Touch Vector Dragging
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const core = stateRef.current;
    if (core.gameState !== 'PLAYING') return;

    if (core.gameMode === 'vital_flow') {
      core.activeControlMode = 'mouse';
      updatePointerVector(e.clientX, e.clientY);
      return;
    }

    if (e.pointerType === 'touch' || isTouchDevice) {
      core.activeControlMode = 'touch';
      core.joystick.active = true;
      core.joystick.startX = e.clientX;
      core.joystick.startY = e.clientY;
      core.joystick.curX = e.clientX;
      core.joystick.curY = e.clientY;
    } else {
      core.activeControlMode = 'mouse';
      core.lastPointerX = e.clientX;
      core.lastPointerY = e.clientY;
      updatePointerVector(e.clientX, e.clientY);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const core = stateRef.current;
    if (core.gameState !== 'PLAYING') return;

    if (core.gameMode === 'vital_flow') {
      core.activeControlMode = 'mouse';
      updatePointerVector(e.clientX, e.clientY);
      return;
    }

    if (e.pointerType === 'touch') {
      core.activeControlMode = 'touch';
    } else {
      // Mouse movement filter threshold
      const dx = Math.abs(e.clientX - core.lastPointerX);
      const dy = Math.abs(e.clientY - core.lastPointerY);
      if (dx > 2 || dy > 2) {
        core.activeControlMode = 'mouse';
        core.lastPointerX = e.clientX;
        core.lastPointerY = e.clientY;
      }
    }

    if (core.joystick.active) {
      core.joystick.curX = e.clientX;
      core.joystick.curY = e.clientY;
      const dx = e.clientX - core.joystick.startX;
      const dy = e.clientY - core.joystick.startY;
      if (Math.hypot(dx, dy) > 8) {
        core.joystick.angle = Math.atan2(dy, dx);
        core.player.targetAngle = core.joystick.angle;
      }
    } else {
      if (core.activeControlMode === 'mouse') {
        updatePointerVector(e.clientX, e.clientY);
      }
    }
  };

  const handlePointerUp = () => {
    stateRef.current.joystick.active = false;
  };

  const updatePointerVector = (pointerX: number, pointerY: number) => {
    const core = stateRef.current;
    if (cinematicActiveRef.current) return;
    if (core.gameMode === 'vital_flow') {
      handleVitalFlowPointerInput(pointerX, pointerY);
      return;
    }

    const p = core.player;
    // Match the actual responsive viewport camera and canvas screen rectangle.
    const { x: worldMouseX, y: worldMouseY } = pointerToWorld(pointerX, pointerY);

    const dx = worldMouseX - p.x;
    const dy = worldMouseY - p.y;

    if (Math.hypot(dx, dy) > 10) {
      p.targetAngle = Math.atan2(dy, dx);
    }
  };

  // =========================================================================
  // NEXUS ASSAULT MODE ENGINE & RENDERERS
  // =========================================================================
  const getPlayerHeadPosition = () => {
    return stateRef.current.player;
  };

  const getOrbiBodyPoints = () => {
    return stateRef.current.player.segments;
  };

  const applyAssaultBoundaryPushToBody = (dx: number, dy: number) => {
    const bodyPoints = getOrbiBodyPoints();
    if (!bodyPoints || bodyPoints.length === 0) return;
    for (const point of bodyPoints) {
      point.x += dx;
      point.y += dy;
    }
  };

  const spawnAssaultBoundaryWarningParticles = (x: number, y: number) => {
    const core = stateRef.current;
    for (let i = 0; i < 4; ++i) {
      core.particles.push({
        id: Math.random().toString(36).substring(2, 7),
        x: x + (Math.random() - 0.5) * 16,
        y: y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        color: '#f43f5e', // warning red
        size: 1.5 + Math.random() * 2.0,
        alpha: 0.9,
        life: 0.8,
        decay: 0.04,
        type: 'SOLAR_SPARK',
        glow: true
      });
    }
  };

  const getMutablePlayerHeadPositionForAssault = () => {
    return stateRef.current.player;
  };

  const getOrbiBodyPointsMutable = () => {
    return stateRef.current.player.segments;
  };

  const dampenAssaultVelocityAgainstWall = (dx: number, dy: number) => {
    const p = stateRef.current.player;
    if (dx !== 0) p.vx *= -0.2;
    if (dy !== 0) p.vy *= -0.2;
  };

  const enforceAssaultHardRoomBounds = () => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    if (!nexusAssaultState.room) {
      nexusAssaultState.room = {
        width: 2850,
        height: 2850,
        boundaryPadding: 1425 - 750 + 25,
        shape: 'RECTANGLE'
      };
    }

    const room = nexusAssaultState.room;
    const shape = room.shape || 'RECTANGLE';

    const pos = getMutablePlayerHeadPositionForAssault();
    if (!pos) return;

    const oldX = pos.x;
    const oldY = pos.y;

    const res = constrainPointToRoom(pos.x, pos.y, shape, 730);
    pos.x = res.x;
    pos.y = res.y;

    const dx = pos.x - oldX;
    const dy = pos.y - oldY;

    if (dx !== 0 || dy !== 0) {
      shiftAssaultBodyAndTrail(dx, dy);
      dampenAssaultVelocityAgainstWall(dx, dy);
      spawnAssaultBoundaryWarningParticles(pos.x, pos.y);
    }
  };

  const enforceAssaultRoomBounds = (dt: number) => {
    enforceAssaultHardRoomBounds();
  };

  const createAssaultEnergyPickup = (x: number, y: number): EnergyOrb => {
    const boxMin = 1425 - 750; // 675
    const boxMax = 1425 + 750; // 2175
    const padding = 25 + 60; // limitMargin + 60px padding as requested

    const safeX = Math.max(boxMin + padding, Math.min(boxMax - padding, x));
    const safeY = Math.max(boxMin + padding, Math.min(boxMax - padding, y));

    return {
      id: 'spawn_orb_' + Date.now() + Math.random(),
      x: safeX,
      y: safeY,
      type: 'SOLAR',
      radius: 5,
      pulsePhase: Math.random() * Math.PI,
      pulseSpeed: 0.04,
      glowSize: 12,
      energyValue: 10,
      scoreValue: 15,
      collected: false,
      magnetized: false,
      lifetime: 0,
      maxLifetime: 12
    };
  };

  const updateAssaultPickupMagnetism = (pickup: any, dt: number) => {
    const core = stateRef.current;
    const playerPos = getPlayerHeadPosition();
    const magnetismRadius = 350; // 350px

    if (pickup.lifetime === undefined) pickup.lifetime = 0;
    pickup.lifetime += dt * 0.016; // accumulate in seconds

    const dx = playerPos.x - pickup.x;
    const dy = playerPos.y - pickup.y;
    const dist = Math.hypot(dx, dy);

    if (dist <= magnetismRadius || pickup.magnetized) {
      pickup.magnetized = true;

      // Accelerate pull force over time to guarantee absorption
      const pullForce = 8.5 * (1 + pickup.lifetime * 0.15);
      if (dist > 0) {
        pickup.x += (dx / dist) * pullForce * dt;
        pickup.y += (dy / dist) * pullForce * dt;

        // Generate dense visual magnetism particles (QA Checkpoint 5.1)
        if (Math.random() < 0.45 && core.particles.length < (core.lowEffectsMode ? 15 : 120)) {
          core.particles.push({
            id: "magnet_trail_" + Math.random(),
            x: pickup.x,
            y: pickup.y,
            vx: -(dx / dist) * 1.5 + (Math.random() - 0.5) * 1.0,
            vy: -(dy / dist) * 1.5 + (Math.random() - 0.5) * 1.0,
            color: '#22d3ee', // high-glow electric cyan
            size: 2.2 + Math.random() * 1.8,
            alpha: 0.9,
            life: 0.5,
            decay: 0.08,
            type: 'NEXUS_SPARK',
            glow: true
          });
        }
      }
    }
  };

  const applyPickupFailsafe = (pickup: any, dt: number) => {
    // If the pickup is alive for more than 5.5 seconds, auto-collect it to prevent orphan pickups
    if (pickup.lifetime !== undefined && pickup.lifetime > 5.5) {
      pickup.collected = true;
      
      const core = stateRef.current;
      const p = core.player;
      if (p) {
        const theme = GUARDIAN_THEMES[core.activeGuardian] || { energyModifier: 1.0 };
        const solarBonus = (pickup.type === 'SOLAR' && core.activeGuardian === 'FOTON') ? 1.15 : 1.0;
        
        let energyAwarded = 0;
        if (core.gameMode === 'demo') {
          energyAwarded = getRedVitalEvolutionEnergyValue(pickup.type || '');
          const prevEnergy = core.redVitalEvolutionEnergy || 0;
          const previousStage = core.redVitalVisualStage || 1;
          
          core.redVitalEvolutionEnergy = prevEnergy + energyAwarded;
          
          let evo = getRedVitalLockedEvolutionState(core.redVitalEvolutionEnergy);
          let nextStage = evo.stage;
          
          if (nextStage > previousStage + 1) {
            console.warn("[RED VITAL EVOLUTION LOCK] Illegal jump prevented in failsafe", { previousStage, nextStage, energy: core.redVitalEvolutionEnergy });
            nextStage = previousStage + 1;
            const targetThreshold = RED_VITAL_EVOLUTION_LOCKED_THRESHOLDS.find(t => t.stage === nextStage);
            if (targetThreshold) {
              core.redVitalEvolutionEnergy = targetThreshold.requiredEnergy;
            }
            evo = getRedVitalLockedEvolutionState(core.redVitalEvolutionEnergy);
          }
          
          core.redVitalVisualStage = evo.stage;
          core.redVitalInternalCoreCount = evo.coreCount;
          p.pickupEvolutionEnergy = core.redVitalEvolutionEnergy;
          p.energy = Math.min(220, p.energy + energyAwarded * 10);
          
          if (evo.stage > previousStage) {
            triggerAudioSign('Orbi evolucionado', 'evolve');
            showTemporaryMessage(`EVOLUCIÓN ENERGÉTICA: E${evo.stage}`);
            triggerBurstSparks(p.x, p.y, '#ffd166', 'COLLECT_SHOCKWAVE', 25);
          }
        } else {
          energyAwarded = Math.round((pickup.energyValue || 8) * theme.energyModifier * solarBonus);
          const prevEnergy = p.pickupEvolutionEnergy || 0;
          p.pickupEvolutionEnergy = prevEnergy + energyAwarded;
          p.energy = Math.min(220, p.energy + energyAwarded);
        }
        
        p.score += pickup.scoreValue || 15;
        p.targetLength = Math.min(60, p.targetLength + 0.35);

        // Spark and floating feedback at pickup's current location
        triggerBurstSparks(pickup.x, pickup.y, '#ffd166', 'SOLAR_SPARK', 5);
        core.floatingTexts.push({
          id: 'failsafe_ft_' + Math.random(),
          x: pickup.x,
          y: pickup.y - 12,
          text: `AUTO-COLLECT +${pickup.scoreValue || 15} PTS`,
          color: '#fbbf24',
          life: 1.0,
          size: 11
        });
      }
    }
  };

  const updateAssaultEnergyPickups = (dt: number) => {
    const core = stateRef.current;
    if (core.gameMode !== "nexus_assault") return;

    core.orbs.forEach((pickup: any) => {
      if (pickup.type !== 'SOLAR' || pickup.collected) return;

      updateAssaultPickupMagnetism(pickup, dt);
      applyPickupFailsafe(pickup, dt);
    });

    // Filter out collected pickups safely
    core.orbs = core.orbs.filter((pickup: any) => !pickup.collected);
  };

  const absorbRemainingPickupsSafely = () => {
    const core = stateRef.current;

    if (core.gameMode === 'nexus_assault' && core.assaultRun) {
      const nexusAssaultState = core.assaultRun;
      let totalHealing = 0;
      if (core.orbs && core.orbs.length > 0) {
        totalHealing += core.orbs.length * 1.5;
      }
      if (totalHealing > 0) {
        nexusAssaultState.hp = Math.min(nexusAssaultState.maxHp, nexusAssaultState.hp + Math.round(totalHealing));
        setAssaultRunHp(nexusAssaultState.hp);
      }
      core.orbs = [];
      return;
    }

    const p = core.player;
    const theme = GUARDIAN_THEMES[core.activeGuardian];

    core.orbs.forEach((orb: any) => {
      if (orb.type !== 'SOLAR' || orb.collected) return;

      orb.collected = true;

      const solarBonus = (orb.type === 'SOLAR' && core.activeGuardian === 'FOTON') ? 1.15 : 1.0;
      const energyAwarded = Math.round(orb.energyValue * theme.energyModifier * solarBonus);
      p.energy = Math.min(220, p.energy + energyAwarded);
      p.score += orb.scoreValue;

      triggerBurstSparks(orb.x, orb.y, '#ffd166', 'SOLAR_SPARK', 6);
    });

    core.orbs = [];
  };

  const createFallbackUpgradeCard = (id: string): AssaultUpgrade => {
    let title = "NEXUS CORE UPGRADE";
    let desc = "Optimiza tus sistemas de flujo de partículas.";
    if (id === "upgrade_foton_core") {
      title = "FOTON CORE ENHANCEMENT";
      desc = "Potencia tu núcleo solar. Daño incrementado.";
    } else if (id === "add_hydro_core") {
      title = "HYDRO RESONANCE";
      desc = "Despierta corrientes regenerativas en tu escudo.";
    } else if (id === "add_aero_core") {
      title = "AERO STREAM ENGINE";
      desc = "Acelera el viraje y la velocidad del viento.";
    }
    return {
      id,
      title,
      description: desc,
      rarity: "common",
      apply: (r: any) => {
        r.hp = Math.min(r.maxHp, r.hp + 20);
        return r;
      }
    };
  };

  const createAssaultUpgradeChoices = (run: any): AssaultUpgrade[] => {
    generateAssaultUpgrades();
    return stateRef.current.assaultRun?.upgradesAvailable || [];
  };

  const createDefaultAssaultUpgradeChoices = (run: any): AssaultUpgrade[] => {
    return [
      {
        id: 'stat_heal_fallback_' + Math.random(),
        title: 'RECONEXIÓN RÁPIDA',
        description: 'Repara filamentos dañados. Restaura +30 HP.',
        rarity: 'common',
        apply: (r) => {
          r.hp = Math.min(r.maxHp, r.hp + 30);
          return r;
        }
      },
      {
        id: 'stat_max_hp_fallback_' + Math.random(),
        title: 'EXPANSIÓN ESTRUCTURAL',
        description: 'Aumenta permanentemente tu capacidad de membrana: +25 HP Máximo y sana +25 HP.',
        rarity: 'rare',
        apply: (r) => {
          r.maxHp += 25;
          r.hp += 25;
          return r;
        }
      },
      {
        id: 'stat_speed_fallback_' + Math.random(),
        title: 'OPTIMIZADOR CINÉTICO',
        description: 'Optimiza la conducción de iones. Incrementa la velocidad de viraje de tu estela.',
        rarity: 'epic',
        apply: (r: any) => {
          r.speed = (r.speed || 4.2) + 0.5;
          return r;
        }
      }
    ];
  };

  const showAssaultBanner = (title: string, subtitle: string) => {
    setCompletedBanner({ label: title, text: subtitle });
    setTimeout(() => {
      setCompletedBanner(null);
    }, 4500);
  };

  const showSurvivalBanner = (title: string, subtitle: string) => {
    setCompletedBanner({ label: title, text: subtitle });
    setTimeout(() => {
      setCompletedBanner(null);
    }, 3500);
  };

  const showSurvivalBlackoutEventBanner = (event: SurvivalBlackoutEvent) => {
    setBlackoutBanner({ label: event.label, text: event.description });
    setTimeout(() => {
      setBlackoutBanner(null);
    }, 2200);
  };

  const triggerRoomEntryBanner = (roomIndex: number, roomType: string, shape: string) => {
    setRoomEntryBanner({
      roomIndex,
      roomType,
      shape
    });
    setTimeout(() => {
      setRoomEntryBanner(null);
    }, 1500);
  };

  const hasAssaultSynergy = (id: string): boolean => {
    const core = stateRef.current;
    return !!(core.assaultRun && core.assaultRun.synergiesActive && core.assaultRun.synergiesActive.includes(id));
  };

  const applyAssaultStatusEffect = (enemy: any, effect: any) => {
    if (!enemy || enemy.health <= 0) return;

    if (!enemy.statusEffects) enemy.statusEffects = [];

    const existing = enemy.statusEffects.find((e: any) => e.type === effect.type);

    if (existing) {
      existing.remaining = Math.max(existing.remaining, effect.duration);
      existing.strength = Math.max(existing.strength, effect.strength);
      existing.stacks = Math.min(5, (existing.stacks ?? 1) + 1);
      setLastStatusApplied(effect.type);
      return;
    }

    enemy.statusEffects.push({
      ...effect,
      remaining: effect.duration,
      stacks: effect.stacks ?? 1,
    });
    setLastStatusApplied(effect.type);
  };

  const spawnSolarMarkParticles = (enemy: any) => {
    triggerBurstSparks(enemy.x, enemy.y, '#ffd166', 'SOLAR_SPARK', 3);
  };

  const spawnHydroSlowParticles = (enemy: any) => {
    triggerBurstSparks(enemy.x, enemy.y, '#22d3ee', 'HYDRO_DROP', 3);
  };

  const spawnAeroGustParticles = (enemy: any) => {
    triggerBurstSparks(enemy.x, enemy.y, '#a78bfa', 'AERO_WIND', 3);
  };

  const spawnTermoOverheatParticles = (enemy: any) => {
    triggerBurstSparks(enemy.x, enemy.y, '#f97316', 'TAIL_SPARK', 3);
  };

  const spawnOverheatTickParticles = (enemy: any) => {
    triggerBurstSparks(enemy.x, enemy.y, '#ef4444', 'TAIL_SPARK', 2);
  };

  const shouldFotonPierce = (projectile: any): boolean => {
    const core = stateRef.current;
    let rate = 0.25;
    if (core.assaultRun && core.assaultRun.modules) {
      const fotonCore = core.assaultRun.modules.find((m: any) => m.element === 'foton');
      if (fotonCore && fotonCore.level >= 2) {
        rate = 0.35;
      }
    }
    if (hasAssaultSynergy("prisma_solar")) {
      rate = 0.45;
    }
    return Math.random() < rate;
  };

  const handleFotonProjectileHit = (projectile: any, enemy: any) => {
    applyAssaultStatusEffect(enemy, {
      type: "solar_mark",
      duration: 2.5,
      strength: 1,
      sourceElement: "foton",
    });

    spawnSolarMarkParticles(enemy);

    if (hasAssaultSynergy("helios_thermal") && Math.random() < 0.10) {
      applyTermoOverheat(enemy, 1);
      setLastSynergyProc("helios_thermal");
    }

    if (shouldFotonPierce(projectile)) {
      if (!projectile.hasPierced) projectile.hasPierced = [];
      projectile.pierceRemaining = Math.max(projectile.pierceRemaining ?? 0, 1);
      if (!projectile.hasPierced.includes(enemy.id)) {
        projectile.hasPierced.push(enemy.id);
      }
    } else {
      projectile.x = -9999;
    }
  };

  const applyHydroSlow = (enemy: any, moduleLevel: number = 1) => {
    let dur = 2.2 + moduleLevel * 0.15;
    if (hasAssaultSynergy("monzon_nexus")) {
      dur *= 1.20;
    }
    applyAssaultStatusEffect(enemy, {
      type: "slow",
      duration: dur,
      strength: Math.min(0.42, 0.22 + moduleLevel * 0.035),
      sourceElement: "hydro",
    });

    spawnHydroSlowParticles(enemy);
  };

  const applyAeroWindPush = (enemy: any, projectile: any) => {
    const dx = enemy.x - projectile.x;
    const dy = enemy.y - projectile.y;
    const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));

    const push = 110;

    enemy.vx = (enemy.vx ?? 0) + (dx / len) * push;
    enemy.vy = (enemy.vy ?? 0) + (dy / len) * push;

    applyAssaultStatusEffect(enemy, {
      type: "wind_push",
      duration: 0.35,
      strength: 1,
      sourceElement: "aero",
    });

    spawnAeroGustParticles(enemy);

    const core = stateRef.current;
    if (core.assaultRun && core.assaultRun.modules) {
      const aeroCore = core.assaultRun.modules.find((m: any) => m.element === 'aero');
      if (aeroCore && aeroCore.level >= 2 && Math.random() < 0.20) {
        const near = findNearestAliveEnemy(enemy.x, enemy.y, 160, enemy.id);
        if (near) {
          applyAssaultDamageToEnemy(near, Math.round(projectile.damage * 0.45), {
            element: "aero",
            source: "wind_cut"
          });
          triggerBurstSparks(near.x, near.y, '#a78bfa', 'AERO_WIND', 3);
        }
      }
    }
  };

  const applyTermoOverheat = (enemy: any, moduleLevel: number = 1) => {
    applyAssaultStatusEffect(enemy, {
      type: "overheat",
      duration: 3.0,
      strength: 2 + moduleLevel,
      sourceElement: "termo",
      tickTimer: 0.5,
    });

    spawnTermoOverheatParticles(enemy);
  };

  const findNearestAliveEnemy = (x: number, y: number, maxRadius: number, excludeId?: string): any => {
    const core = stateRef.current;
    if (!core.assaultRun || !core.assaultRun.enemies) return null;

    let nearest: any = null;
    let nearestDist = maxRadius;

    core.assaultRun.enemies.forEach((enemy: any) => {
      if (enemy.health > 0 && enemy.id !== excludeId) {
        const dist = Math.hypot(enemy.x - x, enemy.y - y);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = enemy;
        }
      }
    });

    return nearest;
  };

  const spawnPrismaSolarBeam = (source: any, target: any) => {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    const dist = Math.hypot(dx, dy);
    const steps = Math.min(25, Math.floor(dist / 12));

    const core = stateRef.current;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = source.x + dx * t;
      const py = source.y + dy * t;
      const color = i % 3 === 0 ? '#22d3ee' : (i % 3 === 1 ? '#ffd166' : '#a78bfa');
      
      core.particles.push({
        id: 'prisma_beam_' + Math.random(),
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color,
        size: 2.0 + Math.random() * 1.5,
        alpha: 1.0,
        life: 0.8,
        decay: 0.04 + Math.random() * 0.04,
        type: 'SOLAR_SPARK',
        glow: true
      });
    }
  };

  const tryPrismaSolarRefraction = (sourceEnemy: any) => {
    if (!hasAssaultSynergy("prisma_solar")) return;

    if (Math.random() > 0.15) return;

    const target = findNearestAliveEnemy(sourceEnemy.x, sourceEnemy.y, 260, sourceEnemy.id);
    if (!target) return;

    applyAssaultDamageToEnemy(target, 5, {
      element: "foton",
      source: "prisma_solar",
    });

    spawnPrismaSolarBeam(sourceEnemy, target);
    setLastSynergyProc("prisma_solar");
  };

  const applyAssaultDamageToEnemy = (enemy: any, amount: number, context?: { element?: string; source?: string }) => {
    if (!enemy || enemy.health <= 0) return;
    if (enemy.archetype === 'rest_beacon' || enemy.type === 'REST_BEACON') return;

    let finalDamage = amount;

    if (enemy.statusEffects?.some((e: any) => e.type === "solar_mark")) {
      if (context?.element === "foton" || context?.element === "hydro") {
        if (hasAssaultSynergy("prisma_solar")) {
          finalDamage *= 1.08;
        } else if (context?.element === "foton") {
          finalDamage *= 1.05;
        }
      }
    }

    if (hasAssaultSynergy("helios_thermal") && enemy.statusEffects?.some((e: any) => e.type === "solar_mark")) {
      if (context?.element === "termo") {
        finalDamage *= 1.12;
      }
    }

    if (context?.source === "overheat") {
      if (enemy.isBoss) finalDamage *= 0.45;
      else if (enemy.isElite) finalDamage *= 0.70;
    }

    const finalDamageInt = Math.round(finalDamage);
    enemy.health = Math.max(0, enemy.health - finalDamageInt);
    if (enemy.hp !== undefined) {
      enemy.hp = enemy.health;
    }

    if (enemy.health <= 0) {
      onAssaultEnemyKilled(enemy);
      triggerBurstSparks(enemy.x, enemy.y, enemy.color || '#f43f5e', 'EVOLUTION_EXPLOSION', 18);

      const core = stateRef.current;
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: enemy.x,
        y: enemy.y - 15,
        text: enemy.isBoss ? 'SALA PURGADA (BOSS)' : (enemy.isElite ? 'ELITE PURGADO' : 'PURGADO'),
        color: enemy.isBoss ? '#ef4444' : (enemy.isElite ? '#f59e0b' : '#22d3ee'),
        life: 1.5,
        size: enemy.isBoss ? 16 : 13
      });

      if (Math.random() < 0.6 || enemy.isBoss || enemy.isElite) {
        const dropCount = enemy.isBoss ? 4 : (enemy.isElite ? 2 : 1);
        for (let d = 0; d < dropCount; d++) {
          core.orbs.push(createAssaultEnergyPickup(enemy.x + (Math.random() - 0.5) * 15, enemy.y + (Math.random() - 0.5) * 15));
        }
      }
    }
  };

  const getEnemySpeedMultiplierFromStatus = (enemy: any): number => {
    let multiplier = 1;

    for (const effect of enemy.statusEffects ?? []) {
      if (effect.type === "slow") {
        multiplier *= (1 - effect.strength);
      }
    }

    return Math.max(0.45, multiplier);
  };

  const updateAssaultStatusEffects = (dt: number) => {
    const core = stateRef.current;
    if (!core.assaultRun || !core.assaultRun.enemies) return;

    core.assaultRun.enemies.forEach((enemy: any) => {
      if (enemy.health <= 0) return;

      if (!enemy.statusEffects) {
        enemy.statusEffects = [];
        return;
      }

      enemy.statusEffects.forEach((effect: any) => {
        effect.remaining -= dt;

        if (effect.type === "overheat") {
          effect.tickTimer = (effect.tickTimer ?? 0) - dt;
          if (effect.tickTimer <= 0) {
            effect.tickTimer = 0.5;
            const stacks = effect.stacks ?? 1;
            const damage = Math.max(1, Math.round(effect.strength * stacks));
            applyAssaultDamageToEnemy(enemy, damage, {
              element: "termo",
              source: "overheat",
            });
            spawnOverheatTickParticles(enemy);
          }
        }
      });

      enemy.statusEffects = enemy.statusEffects.filter((e: any) => e.remaining > 0);
    });
  };

  const updateAssaultAreaEffects = (dt: number) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    if (!core.assaultRun.areaEffects) {
      core.assaultRun.areaEffects = [];
    }

    core.assaultRun.areaEffects.forEach((effect: any) => {
      effect.duration -= dt;
      effect.tickTimer = (effect.tickTimer ?? 0) - dt;

      if (effect.tickTimer <= 0) {
        effect.tickTimer = 0.4;

        core.assaultRun.enemies.forEach((enemy: any) => {
          if (enemy.health > 0) {
            const dist = Math.hypot(enemy.x - effect.x, enemy.y - effect.y);
            if (dist < effect.radius) {
              applyAssaultStatusEffect(enemy, {
                type: "slow",
                duration: 1.5,
                strength: 0.25,
                sourceElement: "hydro"
              });

              applyAssaultDamageToEnemy(enemy, 3, {
                element: "hydro",
                source: "vapor_cloud"
              });
            }
          }
        });

        if (Math.random() < 0.35) {
          triggerBurstSparks(effect.x + (Math.random() - 0.5) * effect.radius * 0.5, effect.y + (Math.random() - 0.5) * effect.radius * 0.5, '#ffffff', 'BLACKOUT_SMOKE', 1);
        }
      }
    });

    core.assaultRun.areaEffects = core.assaultRun.areaEffects.filter((e: any) => e.duration > 0);
  };

  const drawAssaultAreaEffects = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    if (!core.assaultRun || !core.assaultRun.areaEffects) return;

    core.assaultRun.areaEffects.forEach((effect: any) => {
      if (effect.type === "vapor_cloud") {
        ctx.save();
        const grad = ctx.createRadialGradient(effect.x, effect.y, 10, effect.x, effect.y, effect.radius);
        grad.addColorStop(0, "rgba(224, 242, 254, 0.28)");
        grad.addColorStop(0.5, "rgba(34, 211, 238, 0.12)");
        grad.addColorStop(0.8, "rgba(251, 146, 60, 0.05)");
        grad.addColorStop(1, "rgba(34, 211, 238, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(effect.x, effect.y, effect.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
  };

  const clearLooseAssaultPickups = () => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    if (nexusAssaultState.energyPickups) {
      nexusAssaultState.energyPickups = [];
    }

    if ("floatingEnergyOrbs" in nexusAssaultState) {
      nexusAssaultState.floatingEnergyOrbs = [];
    }

    if ("droppedEnergy" in nexusAssaultState) {
      nexusAssaultState.droppedEnergy = [];
    }

    if ("pickups" in nexusAssaultState) {
      nexusAssaultState.pickups = [];
    }

    // Clear current active orbs
    core.orbs = [];

    if (nexusAssaultState.particles) {
      nexusAssaultState.particles = nexusAssaultState.particles.filter((p: any) =>
        p.kind !== "energy_pickup" &&
        p.kind !== "assault_energy" &&
        p.kind !== "dropped_energy" &&
        p.type !== "energy_pickup" &&
        p.type !== "assault_energy" &&
        p.type !== "dropped_energy"
      );
    }

    if (core.particles) {
      core.particles = core.particles.filter((p: any) =>
        p.kind !== "energy_pickup" &&
        p.kind !== "assault_energy" &&
        p.kind !== "dropped_energy" &&
        p.type !== "energy_pickup" &&
        p.type !== "assault_energy" &&
        p.type !== "dropped_energy"
      );
    }
  };

  const completeAssaultRoomForUpgrade = () => {
    enterAssaultUpgradeSelection("legacy call");
  };

  const completeAssaultWaveOrRoom = () => {
    enterAssaultUpgradeSelection("legacy wave complete");
  };

  const checkAssaultWaveProgression = (dt: number) => {
    // Handled by updateNexusAssaultFlow
  };

  const assaultSoftlockFailsafe = (dt: number) => {
    // Handled by updateNexusAssaultFlow
  };

  const enterAssaultUpgradeSelection = (reason?: string) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const run = nexusAssaultState.run;
    if (!run) return;

    if (run.status === 'upgrade_selection' || run.status === 'game_over') return;

    absorbRemainingPickupsSafely();
    clearAssaultCombatResidue();

    run.currentRoomCleared = true;
    run.status = 'upgrade_selection';

    nexusAssaultState.waveClearTimer = 0;
    nexusAssaultState.noEnemyTimer = 0;
    nexusAssaultState.roomClearTimer = 0;
    nexusAssaultState.transitionTimer = 0;
    nexusAssaultState.upgradePanelFailsafeTimer = 0;
    nexusAssaultState.upgradePanelTimer = 0;

    nexusAssaultState.showUpgradePanel = true;
    nexusAssaultState.awaitingUpgradeSelection = true;
    nexusAssaultState.roomCleared = true;
    setAssaultRunCleared(true);
    nexusAssaultState.showUpgradeSelection = true;
    setAssaultUpgradeActive(true);

    // IMPLEMENTACIÓN 7 — SISTEMA DE EVALUACIÓN POST-SALA
    const grade = calculateAssaultRoomGrade();
    if (!nexusAssaultState.gradeHistory) {
      nexusAssaultState.gradeHistory = [];
    }
    nexusAssaultState.gradeHistory.push(grade);
    if (grade === 'S') {
      nexusAssaultState.totalSGrades = (nexusAssaultState.totalSGrades ?? 0) + 1;
    }

    // IMPLEMENTACIÓN 5 — CURACIÓN REBALANCEADA
    const baseHealPercent = getAssaultRoomClearHealPercent(nexusAssaultState.roomType);
    let extraHealPercent = 0;
    if (grade === "S") {
      extraHealPercent = 0.10; // Perfect clear / S Grade: +10% max HP extra
    } else if (grade === "A") {
      extraHealPercent = 0.04; // A Grade: +4% heal extra
    }
    const finalHealPercent = baseHealPercent + extraHealPercent;
    const healAmt = Math.round(nexusAssaultState.maxHp * finalHealPercent);
    
    nexusAssaultState.hp = Math.min(nexusAssaultState.maxHp, nexusAssaultState.hp + healAmt);
    nexusAssaultState.totalHealed = (nexusAssaultState.totalHealed ?? 0) + healAmt;
    setAssaultRunHp(nexusAssaultState.hp);

    triggerAudioSign('Red Vital Estabilizada', 'evolve');

    const gradeColor = grade === 'S' ? '#fbbf24' : (grade === 'A' ? '#c084fc' : (grade === 'B' ? '#38bdf8' : '#94a3b8'));
    core.floatingTexts.push({
      id: Math.random().toString(),
      x: core.player.x,
      y: core.player.y - 45,
      text: `EVALUACIÓN: ${grade}`,
      color: gradeColor,
      life: 2.2,
      size: 26
    });

    core.floatingTexts.push({
      id: Math.random().toString(),
      x: core.player.x,
      y: core.player.y - 75,
      text: `RECONEXIÓN: +${healAmt} HP (${Math.round(finalHealPercent * 100)}%)`,
      color: '#34d399',
      life: 2.5,
      size: 14
    });

    // Generate fresh upgrades list using the newly earned grade!
    generateAssaultUpgrades();
    const choices = (nexusAssaultState.upgradesAvailable && nexusAssaultState.upgradesAvailable.length >= 3)
      ? nexusAssaultState.upgradesAvailable
      : createGuaranteedAssaultUpgradeChoices();
      
    nexusAssaultState.upgradeChoices = choices;
    setUpgradesList(choices);

    showAssaultBanner(
      `CHAMBER CLEARED [GRADE ${grade}]`,
      "SELECT AN ORBI CORE UPGRADE"
    );
  };

  const createGuaranteedAssaultUpgradeChoices = (): AssaultUpgrade[] => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return [];

    let choices = createAssaultUpgradeChoices(nexusAssaultState.run);

    if (!choices || choices.length < 3) {
      choices = createDefaultAssaultUpgradeChoices(nexusAssaultState.run);
    }

    if (!choices || choices.length < 3) {
      choices = [
        createFallbackUpgradeCard("upgrade_foton_core"),
        createFallbackUpgradeCard("add_hydro_core"),
        createFallbackUpgradeCard("add_aero_core"),
      ];
    }

    return choices.slice(0, 3);
  };

  const ensureAssaultUpgradePanelExists = () => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    if (!nexusAssaultState.showUpgradePanel || !nexusAssaultState.awaitingUpgradeSelection) {
      nexusAssaultState.showUpgradePanel = true;
      nexusAssaultState.awaitingUpgradeSelection = true;
      nexusAssaultState.showUpgradeSelection = true;
      setAssaultUpgradeActive(true);
      setAssaultRunCleared(true);
    }
  };

  const ENABLE_ASSAULT_ROOM_FLOW_DIAGNOSTICS = true;

  const advanceAssaultRoom = (reason: string) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const run = nexusAssaultState.run;
    if (!run) return;

    // Use isTransitioningRoom, transitionLock as guards to prevent duplicate execution
    if (nexusAssaultState.isTransitioningRoom) {
      if (ENABLE_ASSAULT_ROOM_FLOW_DIAGNOSTICS) {
        console.log(`[ASSAULT ROOM FLOW] Blocked re-entry to advanceAssaultRoom. Reason: ${reason}`);
      }
      return;
    }

    const previousRoomNumber = run.roomIndex ?? nexusAssaultState.roomIndex ?? 1;
    const previousRoomType = nexusAssaultState.roomType || 'normal';

    // Set transition guard states
    nexusAssaultState.isTransitioningRoom = true;
    nexusAssaultState.transitionLock = true;
    nexusAssaultState.lastTransitionRoomId = previousRoomNumber;

    const preservedHead = cloneCurrentAssaultHeadPosition();
    const preservedBody = cloneCurrentAssaultBodyPoints();
    const preservedTrail = cloneCurrentAssaultTrailPoints();

    // Increment index
    const nextRoomNumber = previousRoomNumber + 1;
    run.roomIndex = nextRoomNumber;
    nexusAssaultState.roomIndex = nextRoomNumber;

    run.status = 'combat';
    run.currentRoomCleared = false;
    run.enemiesDefeated = 0;
    nexusAssaultState.roomCleared = false;
    setAssaultRunCleared(false);

    // Reset timers and tracking
    nexusAssaultState.noEnemyTimer = 0;
    nexusAssaultState.roomClearTimer = 0;
    nexusAssaultState.transitionTimer = 0;
    nexusAssaultState.waveClearTimer = 0;
    nexusAssaultState.noEnemySoftlockTimer = 0;
    nexusAssaultState.damageTakenThisRoom = 0;

    clearAssaultCombatResidue();

    restoreAssaultOrbiContinuity(preservedHead, preservedBody, preservedTrail);

    // CHOOSE SHAPE FIRST BEFORE SPAWNING (IMPLEMENTACIÓN 4)
    if (!nexusAssaultState.room) {
      nexusAssaultState.room = {
        width: 2850,
        height: 2850,
        boundaryPadding: 1425 - 750 + 25,
        shape: 'RECTANGLE'
      };
    }

    const roomIndex = nextRoomNumber;
    if (roomIndex === 1) {
      nexusAssaultState.room.shape = 'RECTANGLE';
    } else if (roomIndex === 2) {
      nexusAssaultState.room.shape = Math.random() < 0.5 ? 'RECTANGLE' : 'WIDE_RECTANGLE';
    } else if (roomIndex <= 4) {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE'];
      nexusAssaultState.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    } else if (roomIndex <= 6) {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE', 'OCTAGON'];
      nexusAssaultState.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    } else {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE', 'OCTAGON', 'DIAMOND'];
      nexusAssaultState.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    nexusAssaultState.roomShapeFallback = false;
    nexusAssaultState.roomShapeReason = 'none';

    enforceAssaultHardRoomBounds();
    syncAssaultModulesToBodySlots();

    const roomType = chooseNexusAssaultRoomType(roomIndex);
    nexusAssaultState.roomType = roomType;

    // Trigger Room Entry Banner (Implementation 6)
    triggerRoomEntryBanner(roomIndex, roomType, nexusAssaultState.room.shape);

    if (ENABLE_ASSAULT_ROOM_FLOW_DIAGNOSTICS) {
      console.log(
        `%c[ASSAULT ROOM FLOW]\nfrom room ${previousRoomNumber} type ${previousRoomType}\nto room ${nextRoomNumber} type ${roomType}\nreason: ${reason}`,
        "color: #a855f7; font-weight: bold;"
      );
    }

    if (roomType === 'rest') {
      nexusAssaultState.roomCleared = false;
      run.currentRoomCleared = false;
      run.status = 'combat';
      setAssaultRunCleared(false);

      const beacon: AssaultEnemy = {
        id: 'rest_beacon_' + Date.now() + '_' + Math.random(),
        type: 'REST_BEACON',
        archetype: 'rest_beacon',
        x: 1425,
        y: 1425,
        radius: 35,
        health: 100,
        maxHealth: 100,
        color: '#ffffff',
        accentColor: '#22d3ee',
        glowColor: '#0ea5e9',
        shootCooldown: 999999,
        vx: 0,
        vy: 0,
        lastShotTime: 0,
        statusEffects: []
      };
      nexusAssaultState.enemies = [beacon];
      setAssaultRunRoom(nexusAssaultState.roomIndex);

      showAssaultBanner(
        "NEXUS SANCTUARY",
        "PURIFY THE ALTAR TO STABILIZE VITALS"
      );
    } else if (roomType === 'boss') {
      const boss = createNexusAssaultBoss(roomIndex, nexusAssaultState.room);
      nexusAssaultState.enemies = [boss];
      nexusAssaultState.currentBoss = boss;

      setAssaultRunHp(nexusAssaultState.hp);
      setAssaultRunMaxHp(nexusAssaultState.maxHp);
      setAssaultRunRoom(nexusAssaultState.roomIndex);
      setAssaultRunCleared(false);

      triggerBossIntroCinematic(boss);
    } else {
      nexusAssaultState.enemies = spawnEnemiesForAssaultRoom(
        run.roomIndex,
        nexusAssaultState.room
      );

      if (!nexusAssaultState.enemies || nexusAssaultState.enemies.length === 0) {
        nexusAssaultState.enemies = spawnFallbackAssaultEnemies(run.roomIndex);
      }

      setAssaultRunRoom(nexusAssaultState.roomIndex);
      setAssaultRunHp(nexusAssaultState.hp);
      setAssaultRunMaxHp(nexusAssaultState.maxHp);

      core.floatingTexts.push({
        id: Math.random().toString(),
        x: preservedHead.x,
        y: preservedHead.y - 35,
        text: `SALA ${nexusAssaultState.roomIndex} ESTABILIZADA`,
        color: '#a855f7',
        life: 2.2,
        size: 18
      });
      triggerAudioSign('Conexión Resumida', 'evolve');

      const config = NEXUS_ASSAULT_ROOM_TYPE_CONFIG[roomType] || NEXUS_ASSAULT_ROOM_TYPE_CONFIG.normal;
      showAssaultBanner(
        config.label,
        "BLACKOUT HOSTILES DETECTED"
      );
    }

    nexusAssaultState.isTransitioningRoom = false;
  };

  const startNextAssaultRoom = (reason: string = 'transition_next_room') => {
    advanceAssaultRoom(reason);
  };

  const clearAssaultCombatResidue = () => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    nexusAssaultState.projectiles = [];
    if ("enemyProjectiles" in nexusAssaultState) nexusAssaultState.enemyProjectiles = [];
    if ("playerProjectiles" in nexusAssaultState) nexusAssaultState.playerProjectiles = [];

    // Clear loose pickups
    clearLooseAssaultPickups();
  };

  const growAssaultOrbiBodyForNewCore = (amount: number) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const growthUnits = Math.max(1, amount) * 2;

    nexusAssaultState.assaultBodyGrowth =
      (nexusAssaultState.assaultBodyGrowth ?? 1) + growthUnits;

    increaseOrbiBodyTargetLength(growthUnits);
  };

  const growAssaultOrbiBodyProgress = (amount: number) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    nexusAssaultState.assaultBodyGrowth =
      (nexusAssaultState.assaultBodyGrowth ?? 1) + amount;

    increaseOrbiBodyTargetLength(amount);
  };

  const increaseOrbiBodyTargetLength = (amount: number) => {
    const p = stateRef.current.player;
    p.targetLength = Math.min(60, p.targetLength + amount);
  };

  const getCurrentOrbiBodyLength = () => {
    return stateRef.current.player.targetLength;
  };

  const syncAssaultModulesToBodySlots = () => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState || !nexusAssaultState.modules) return;

    const modules = nexusAssaultState.modules;
    const bodyPoints = getOrbiBodyPointsMutable() || getOrbiBodyPoints();

    if (!bodyPoints || bodyPoints.length === 0) return;

    const coreCount = Math.max(1, modules.length);
    const coreIndices = getAssaultCanonicalCorePositions({
      bodyPoints: bodyPoints,
      coreCount: coreCount
    });

    for (let i = 0; i < modules.length; i++) {
      const index = coreIndices[i] !== undefined ? coreIndices[i] : Math.floor(((i + 1) / (modules.length + 1)) * (bodyPoints.length - 1));
      modules[i].bodyIndex = Math.max(1, Math.min(bodyPoints.length - 1, index));
      modules[i].segmentIndex = modules[i].bodyIndex;
    }
  };

  const getAssaultModuleFireOrigin = (module: any): { x: number; y: number } => {
    const bodyPoints = getOrbiBodyPoints();

    if (bodyPoints && bodyPoints.length > 2) {
      const index = Math.max(1, Math.min(bodyPoints.length - 1, module.bodyIndex !== undefined ? module.bodyIndex : (module.segmentIndex !== undefined ? module.segmentIndex : 3)));
      return {
        x: bodyPoints[index].x,
        y: bodyPoints[index].y,
      };
    }

    return { x: stateRef.current.player.x, y: stateRef.current.player.y };
  };

  const applyEnemyArchetype = (enemy: any, archKey: SerpentEnemyArchetype) => {
    const arch = SERPENT_ENEMY_ARCHETYPES[archKey];
    enemy.archetype = archKey;
    enemy.role = arch.role;
    enemy.label = arch.label;
    enemy.movementStyle = arch.movementStyle;
    enemy.attackStyle = arch.attackStyle;
    enemy.sizeClass = arch.sizeClass;
    enemy.maxSegments = arch.maxSegments;
    enemy.color = arch.bodyColor;
    enemy.accentColor = arch.accentColor;
    enemy.glowColor = arch.glowColor;
    enemy.segments = [];
    return enemy;
  };

  const spawnEnemiesForAssaultRoom = (roomIndex: number, room: any): any[] => {
    const roomType = chooseNexusAssaultRoomType(roomIndex);
    if (roomType === 'rest') {
      return [{
        id: 'rest_beacon_' + Date.now() + '_' + Math.random(),
        type: 'REST_BEACON',
        archetype: 'rest_beacon',
        x: 1425,
        y: 1425,
        radius: 35,
        health: 100,
        maxHealth: 100,
        color: '#ffffff',
        accentColor: '#22d3ee',
        glowColor: '#0ea5e9',
        shootCooldown: 999999,
        statusEffects: []
      }];
    }

    const diff = getNexusAssaultRoomDifficulty(roomIndex);
    const config = NEXUS_ASSAULT_ROOM_TYPE_CONFIG[roomType] || NEXUS_ASSAULT_ROOM_TYPE_CONFIG.normal;

    const enemiesList: any[] = [];
    
    const baseCount = config.enemyCountBase;
    const totalCount = Math.max(1, Math.round(baseCount * diff.spawnCountMultiplier));

    let wispCount = 0;
    let droneCount = 0;
    let spitterCount = 0;

    if (roomType === 'swarm') {
      wispCount = Math.round(totalCount * 0.65);
      droneCount = Math.round(totalCount * 0.25);
      spitterCount = Math.max(0, totalCount - wispCount - droneCount);
    } else if (roomType === 'elite') {
      wispCount = Math.max(1, Math.round(totalCount * 0.3));
      droneCount = Math.max(1, Math.round(totalCount * 0.3));
      spitterCount = Math.max(0, totalCount - wispCount - droneCount);
    } else if (roomType === 'boss_preview') {
      wispCount = 1;
      droneCount = 1;
      spitterCount = 1;
    } else {
      wispCount = Math.round(totalCount * 0.4);
      droneCount = Math.round(totalCount * 0.4);
      spitterCount = Math.max(0, totalCount - wispCount - droneCount);
    }

    if (wispCount === 0 && droneCount === 0 && spitterCount === 0) {
      wispCount = 3;
    }

    for (let i = 0; i < wispCount; ++i) {
      const pos = getAssaultSpawnPos();
      let archKey: SerpentEnemyArchetype = Math.random() < 0.7 ? 'baby_serpent' : 'crawler_serpent';
      if ((roomType === 'elite' || roomIndex >= 4) && Math.random() < 0.25) {
        archKey = 'void_serpentling';
      }
      const enemy = {
        id: `wisp_${i}_${Date.now()}_${Math.random()}`,
        type: 'WISP',
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        radius: 12,
        health: Math.round((20 + roomIndex * 2) * diff.enemyHpMultiplier),
        maxHealth: Math.round((20 + roomIndex * 2) * diff.enemyHpMultiplier),
        color: '#c084fc',
        shootCooldown: 0,
        lastShotTime: 0,
        alive: true
      };
      applyEnemyArchetype(enemy, archKey);
      enemiesList.push(enemy);
    }

    for (let i = 0; i < droneCount; ++i) {
      const pos = getAssaultSpawnPos();
      const speedScale = diff.enemySpeedMultiplier;
      const archKey: SerpentEnemyArchetype = Math.random() < 0.65 ? 'armored_serpent' : 'splitter_serpent';
      const enemy = {
        id: `drone_${i}_${Date.now()}_${Math.random()}`,
        type: 'DRONE',
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 1.5 * speedScale,
        vy: (Math.random() - 0.5) * 1.5 * speedScale,
        radius: 16,
        health: Math.round((35 + roomIndex * 4) * diff.enemyHpMultiplier),
        maxHealth: Math.round((35 + roomIndex * 4) * diff.enemyHpMultiplier),
        color: '#a855f7',
        shootCooldown: Math.max(40, (120 + Math.random() * 60) / diff.fireRateMultiplier),
        lastShotTime: 0,
        alive: true
      };
      applyEnemyArchetype(enemy, archKey);
      enemiesList.push(enemy);
    }

    for (let i = 0; i < spitterCount; ++i) {
      const pos = getAssaultSpawnPos();
      const enemy = {
        id: `spitter_${i}_${Date.now()}_${Math.random()}`,
        type: 'SPITTER',
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        radius: 20,
        health: Math.round((55 + roomIndex * 8) * diff.enemyHpMultiplier),
        maxHealth: Math.round((55 + roomIndex * 8) * diff.enemyHpMultiplier),
        color: '#7e22ce',
        shootCooldown: Math.max(50, (150 + Math.random() * 60) / diff.fireRateMultiplier),
        lastShotTime: 0,
        alive: true
      };
      applyEnemyArchetype(enemy, 'spitter_serpent');
      enemiesList.push(enemy);
    }

    // Elites spawning if is elite chamber, or by chance!
    const isEliteRoom = roomType === 'elite';
    if (isEliteRoom) {
      const pos = getAssaultSpawnPos();
      const archKey: SerpentEnemyArchetype = Math.random() < 0.5 ? 'twin_head_serpent' : 'splitter_serpent';
      const enemy = {
        id: `elite_${roomIndex}_${Date.now()}`,
        type: 'DRONE',
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 2.5 * diff.enemySpeedMultiplier,
        vy: (Math.random() - 0.5) * 2.5 * diff.enemySpeedMultiplier,
        radius: 26,
        health: Math.round((120 + roomIndex * 15) * diff.enemyHpMultiplier),
        maxHealth: Math.round((120 + roomIndex * 15) * diff.enemyHpMultiplier),
        color: '#fbbf24',
        shootCooldown: Math.max(30, 100 / diff.fireRateMultiplier),
        lastShotTime: 0,
        isElite: true,
        alive: true
      };
      applyEnemyArchetype(enemy, archKey);
      enemiesList.push(enemy);
    } else if (Math.random() < config.eliteChance) {
      const pos = getAssaultSpawnPos();
      const archKey: SerpentEnemyArchetype = Math.random() < 0.5 ? 'twin_head_serpent' : 'splitter_serpent';
      const enemy = {
        id: `elite_rand_${roomIndex}_${Date.now()}`,
        type: 'DRONE',
        x: pos.x,
        y: pos.y,
        vx: (Math.random() - 0.5) * 2.2 * diff.enemySpeedMultiplier,
        vy: (Math.random() - 0.5) * 2.2 * diff.enemySpeedMultiplier,
        radius: 25,
        health: Math.round((100 + roomIndex * 12) * diff.enemyHpMultiplier),
        maxHealth: Math.round((100 + roomIndex * 12) * diff.enemyHpMultiplier),
        color: '#fbbf24',
        shootCooldown: Math.max(35, 110 / diff.fireRateMultiplier),
        lastShotTime: 0,
        isElite: true,
        alive: true
      };
      applyEnemyArchetype(enemy, archKey);
      enemiesList.push(enemy);
    }

    enemiesList.forEach((e: any) => {
      e.spawnPortalTimer = 70;
      e.spawnPortalDuration = 70;
    });

    if (enemiesList.length > 0) {
      triggerAudioSign('Grieta Dimensional', 'rift_spawn');
    }

    return enemiesList;
  };

  const spawnFallbackAssaultEnemies = (roomIndex: number): any[] => {
    const enemiesList: any[] = [];
    for (let i = 0; i < 3; ++i) {
      const pos = getAssaultSpawnPos();
      const enemy = {
        id: `fallback_wisp_${i}_${Date.now()}_${Math.random()}`,
        type: 'WISP',
        x: pos.x,
        y: pos.y,
        vx: 0,
        vy: 0,
        radius: 12,
        health: 20 + roomIndex * 2,
        maxHealth: 20 + roomIndex * 2,
        color: '#c084fc',
        shootCooldown: 0,
        lastShotTime: 0,
        alive: true
      };
      applyEnemyArchetype(enemy, 'baby_serpent');
      enemiesList.push(enemy);
    }

    enemiesList.forEach((e: any) => {
      e.spawnPortalTimer = 70;
      e.spawnPortalDuration = 70;
    });

    if (enemiesList.length > 0) {
      triggerAudioSign('Grieta Dimensional', 'rift_spawn');
    }

    return enemiesList;
  };

  const updateNexusAssaultFlow = (dt: number) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const run = nexusAssaultState.run;
    if (!run) return;

    if (run.status === 'game_over') return;

    // Enforce high-precision boundary clamping immediately
    enforceAssaultHardRoomBounds();

    // Continuously map and distribute modular core slots along body points
    syncAssaultModulesToBodySlots();

    if (run.status === 'combat') {
      const aliveEnemies = nexusAssaultState.enemies.filter((e: any) => e.health > 0);

      if (aliveEnemies.length > 0) {
        nexusAssaultState.noEnemyTimer = 0;
        return;
      }

      const dtSec = dt > 0.1 ? dt * 0.01667 : dt;
      nexusAssaultState.noEnemyTimer = (nexusAssaultState.noEnemyTimer ?? 0) + dtSec;

      if (nexusAssaultState.noEnemyTimer >= 1.0) {
        enterAssaultUpgradeSelection("all enemies defeated");
      }
      return;
    }

    if (run.status === 'room_cleared' || run.status === 'room_clear') {
      const dtSec = dt > 0.1 ? dt * 0.01667 : dt;
      nexusAssaultState.roomClearTimer = (nexusAssaultState.roomClearTimer ?? 0) + dtSec;

      if (nexusAssaultState.roomClearTimer >= 0.5) {
        enterAssaultUpgradeSelection("room clear timer");
      }
      return;
    }

    if (run.status === 'upgrade_selection') {
      ensureAssaultUpgradePanelExists();

      const dtSec = dt > 0.1 ? dt * 0.01667 : dt;
      nexusAssaultState.upgradePanelTimer = (nexusAssaultState.upgradePanelTimer ?? 0) + dtSec;
      nexusAssaultState.upgradePanelFailsafeTimer = nexusAssaultState.upgradePanelTimer;

      const hasChoices =
        nexusAssaultState.upgradeChoices &&
        nexusAssaultState.upgradeChoices.length >= 3;

      if (!hasChoices) {
        nexusAssaultState.upgradeChoices = createGuaranteedAssaultUpgradeChoices();
        setUpgradesList(nexusAssaultState.upgradeChoices);
      }

      if (nexusAssaultState.upgradePanelTimer >= 12) {
        nexusAssaultState.showUpgradePanel = false;
        nexusAssaultState.awaitingUpgradeSelection = false;
        nexusAssaultState.upgradePanelTimer = 0;
        nexusAssaultState.showUpgradeSelection = false;
        setAssaultUpgradeActive(false);

        const choices = nexusAssaultState.upgradeChoices || [];
        if (choices.length > 0) {
          selectAssaultUpgrade(choices[0]);
        } else {
          startNextAssaultRoom('upgrade_selected_failsafe');
        }
      }
      return;
    }

    if (run.status === 'transition_next_room') {
      const dtSec = dt > 0.1 ? dt * 0.01667 : dt;
      nexusAssaultState.transitionTimer = (nexusAssaultState.transitionTimer ?? 0) + dtSec;

      if (nexusAssaultState.transitionTimer >= 0.75) {
        startNextAssaultRoom(nexusAssaultState.transitionReason || 'transition_next_room');
      }
      return;
    }
  };

  const upgradePanelFailsafe = (dt: number) => {
    // Handled by updateNexusAssaultFlow
  };

  const getAssaultSpawnPos = () => {
    const core = stateRef.current;
    const shape = core.assaultRun?.room?.shape || 'RECTANGLE';
    let rx = 1425;
    let ry = 1425;
    let attempts = 0;
    while (attempts < 100) {
      rx = 1425 + (Math.random() - 0.5) * 1300;
      ry = 1425 + (Math.random() - 0.5) * 1300;
      
      const check = constrainPointToRoom(rx, ry, shape, 700);
      const playerDist = Math.hypot(rx - core.player.x, ry - core.player.y);
      
      if (!check.hitWall && playerDist > 320) {
        break;
      }
      attempts++;
    }
    
    if (attempts >= 100 && shape !== 'RECTANGLE') {
      if (core.assaultRun?.room) {
        core.assaultRun.room.shape = 'RECTANGLE';
      }
      rx = 1425 + (Math.random() - 0.5) * 1100;
      ry = 1425 + (Math.random() - 0.5) * 1100;
    }
    return { x: rx, y: ry };
  };

  const getOrbiCorePalette = (element: string) => {
    const el = element === "terra" ? "termo" : (element as OrbiEnergyId);
    return ORBI_ENERGY_REGISTRY[el] ?? ORBI_ENERGY_REGISTRY.foton;
  };

  const getDefaultAttackTypeForElement = (element: string): string => {
    const el = element === "terra" ? "termo" : element;
    return ORBI_ATTACK_SIGNATURES[el]?.attackType || "solar_lance";
  };

  const triggerElementalAssaultImpact = (x: number, y: number, element: string, projColor: string) => {
    const core = stateRef.current;
    const el = element === "terra" ? "termo" : element;
    const sig = ORBI_ATTACK_SIGNATURES[el];
    
    // Default sparks
    const color = sig ? sig.primaryColor : projColor;
    const impactStyle = sig ? sig.impactStyle : "default";

    if (impactStyle === "solar_flash") {
      if (core.gameMode === 'nexus_assault' && el === 'foton') {
        // Foton neon/lime green laser impact
        triggerBurstSparks(x, y, "#8DFF00", "SOLAR_SPARK", 10);
        triggerBurstSparks(x, y, "#ffffff", "SOLAR_SPARK", 6);
        core.particles.push({
          id: "foton_impact_ring_" + Math.random(),
          x,
          y,
          vx: 0,
          vy: 0,
          color: "#B6FF00",
          size: 11,
          alpha: 1.0,
          life: 0.8,
          decay: 0.05,
          type: "COLLECT_SHOCKWAVE",
          glow: true
        });
      } else {
        // Golden solar flash
        triggerBurstSparks(x, y, color, "SOLAR_SPARK", 8);
        triggerBurstSparks(x, y, "#ffffff", "SOLAR_SPARK", 4);
        core.particles.push({
          id: "solar_impact_ring_" + Math.random(),
          x,
          y,
          vx: 0,
          vy: 0,
          color: "#FFF3A3",
          size: 8,
          alpha: 1.0,
          life: 0.8,
          decay: 0.05,
          type: "COLLECT_SHOCKWAVE",
          glow: true
        });
      }
    } else if (impactStyle === "water_splash") {
      // Water splash
      triggerBurstSparks(x, y, color, "HYDRO_SPLASH", 8);
      triggerBurstSparks(x, y, "#8EEBFF", "HYDRO_DROP", 6);
      core.particles.push({
        id: "water_splash_ring_" + Math.random(),
        x,
        y,
        vx: 0,
        vy: 0,
        color: "#2B8CFF",
        size: 10,
        alpha: 0.9,
        life: 0.7,
        decay: 0.06,
        type: "COLLECT_SHOCKWAVE",
        glow: false
      });
    } else if (impactStyle === "gust_burst") {
      // Wind cut
      triggerBurstSparks(x, y, color, "AERO_WIND", 10);
      for (let i = 0; i < 6; i++) {
        const ang = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const spd = 2.5 + Math.random() * 2.5;
        core.particles.push({
          id: "wind_cut_" + Math.random(),
          x,
          y,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          color: "#D9FFFF",
          size: 1.0 + Math.random() * 1.5,
          alpha: 0.85,
          life: 0.4,
          decay: 0.08,
          type: "AERO_WIND",
          glow: true
        });
      }
    } else if (impactStyle === "thermal_burst") {
      // Warm fiery burst
      triggerBurstSparks(x, y, color, "TAIL_SPARK", 12);
      triggerBurstSparks(x, y, "#FFCC80", "TAIL_SPARK", 6);
      core.particles.push({
        id: "thermal_shock_" + Math.random(),
        x,
        y,
        vx: 0,
        vy: 0,
        color: "#FF2D00",
        size: 12,
        alpha: 1.0,
        life: 0.9,
        decay: 0.04,
        type: "COLLECT_SHOCKWAVE",
        glow: true
      });
    } else {
      let sparkType: ParticleType = "NEXUS_SPARK";
      if (impactStyle === "magnetic_snap") sparkType = "NEXUS_SPARK";
      else if (impactStyle === "atomic_bloom") sparkType = "SOLAR_SPARK";
      else if (impactStyle === "impact_shock") sparkType = "TAIL_SPARK";
      else if (impactStyle === "nova_splash") sparkType = "HYDRO_DROP";
      else if (impactStyle === "quantum_ripple") sparkType = "NEXUS_SPARK";
      else if (impactStyle === "bloom_flash") sparkType = "TERRA_LEAF";

      triggerBurstSparks(x, y, color, sparkType, 10);
      if (sig?.secondaryColor) {
        triggerBurstSparks(x, y, sig.secondaryColor, sparkType, 4);
      }
    }
  };

  const onAssaultEnemyKilled = (enemy: any) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    if (enemy.archetype === 'rest_beacon' || enemy.type === 'REST_BEACON') {
      const healAmount = Math.round(core.assaultRun.maxHp * 0.20);
      core.assaultRun.hp = Math.min(core.assaultRun.maxHp, core.assaultRun.hp + healAmount);
      core.assaultRun.totalHealed = (core.assaultRun.totalHealed ?? 0) + healAmount;
      setAssaultRunHp(core.assaultRun.hp);
      
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: enemy.x,
        y: enemy.y - 45,
        text: `SANCTUARY RESTORED! +${healAmount} HP`,
        color: '#22d3ee',
        life: 3.5,
        size: 16
      });
      triggerAudioSign('Red Vital Conectada', 'evolve');
      triggerBurstSparks(enemy.x, enemy.y, '#ffffff', 'NEXUS_SPARK', 40);
      triggerBurstSparks(enemy.x, enemy.y, '#22d3ee', 'TAIL_SPARK', 30);
      return;
    }

    if (enemy.isBoss) {
      completeNexusAssaultBossRoom(enemy);
      return;
    }

    core.assaultRun.enemiesKilled++;
    setAssaultKills(core.assaultRun.enemiesKilled);

    if (enemy.isElite) {
      const healAmount = Math.round(core.assaultRun.maxHp * 0.15);
      core.assaultRun.hp = Math.min(core.assaultRun.maxHp, core.assaultRun.hp + healAmount);
      setAssaultRunHp(core.assaultRun.hp);
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: enemy.x,
        y: enemy.y - 40,
        text: `ELITE DEFEATED! +${healAmount} HP`,
        color: '#10b981',
        life: 2.5,
        size: 14
      });
      triggerAudioSign('Red Vital Estabilizada', 'evolve');
    }
  };

  const constrainPointToRoom = (x: number, y: number, shape: string, radius: number = 725): { x: number, y: number, hitWall: boolean } => {
    const cx = 1425;
    const cy = 1425;
    let hitWall = false;
    let rx = x;
    let ry = y;

    // Apply the 30% area expansion multiplier (+14% radius) only for Nexus Assault
    const currentMode = stateRef.current?.gameMode;
    const scaledRadius = currentMode === 'nexus_assault' ? radius * NEXUS_ASSAULT_ROOM_RADIUS_SCALE : radius;

    if (shape === 'CIRCLE') {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > scaledRadius) {
        hitWall = true;
        rx = cx + (dx / dist) * scaledRadius;
        ry = cy + (dy / dist) * scaledRadius;
      }
    } else if (shape === 'DIAMOND') {
      let dx = x - cx;
      let dy = y - cy;
      const sum = Math.abs(dx) + Math.abs(dy);
      const limit = scaledRadius * 1.2533;
      if (sum > limit) {
        hitWall = true;
        const excess = sum - limit;
        dx -= Math.sign(dx) * (excess / 2);
        dy -= Math.sign(dy) * (excess / 2);
      }
      rx = cx + dx;
      ry = cy + dy;
    } else if (shape === 'OCTAGON') {
      let dx = x - cx;
      let dy = y - cy;
      const r_oct = scaledRadius * 1.0531;
      
      // Box limits
      if (Math.abs(dx) > r_oct) {
        hitWall = true;
        dx = Math.sign(dx) * r_oct;
      }
      if (Math.abs(dy) > r_oct) {
        hitWall = true;
        dy = Math.sign(dy) * r_oct;
      }

      // Diagonal limit plane intersection
      const diagLimit = r_oct * 1.35;
      if (Math.abs(dx) + Math.abs(dy) > diagLimit) {
        hitWall = true;
        const sum = Math.abs(dx) + Math.abs(dy);
        const excess = sum - diagLimit;
        dx -= Math.sign(dx) * (excess / 2);
        dy -= Math.sign(dy) * (excess / 2);
      }
      rx = cx + dx;
      ry = cy + dy;
    } else if (shape === 'WIDE_RECTANGLE') {
      const minX = cx - scaledRadius * 1.1824;
      const maxX = cx + scaledRadius * 1.1824;
      const minY = cy - scaledRadius * 0.6651;
      const maxY = cy + scaledRadius * 0.6651;
      if (x < minX) { rx = minX; hitWall = true; }
      if (x > maxX) { rx = maxX; hitWall = true; }
      if (y < minY) { ry = minY; hitWall = true; }
      if (y > maxY) { ry = maxY; hitWall = true; }
    } else {
      // RECTANGLE / SQUARE
      const s = scaledRadius * 0.8862;
      const minVal = cx - s;
      const maxVal = cx + s;
      if (x < minVal) { rx = minVal; hitWall = true; }
      if (x > maxVal) { rx = maxVal; hitWall = true; }
      if (y < minVal) { ry = minVal; hitWall = true; }
      if (y > maxVal) { ry = maxVal; hitWall = true; }
    }

    return { x: rx, y: ry, hitWall };
  };

  const getSelectedAssaultHeroEnergy = (): OrbiEnergyId => {
    const core = stateRef.current;
    const guardian = core.activeGuardian; // 'FOTON' | 'HYDRO' | 'AERO' | 'TERMO' | 'TERRA'
    if (guardian === 'TERMO') return 'termo';
    return (guardian?.toLowerCase() as OrbiEnergyId) || 'foton';
  };

  const getSelectedAssaultHeroIdentity = () => {
    const energy = getSelectedAssaultHeroEnergy();
    return ORBI_ENERGY_REGISTRY[energy] ?? ORBI_ENERGY_REGISTRY.foton;
  };

  const getAssaultBodyThicknessMultiplier = (): number => {
    const core = stateRef.current;
    const run = core.assaultRun;
    if (!run) return 1;

    const uniqueEnergyCount = new Set(
      (run.modules ?? []).map((m: any) => m.element)
    ).size;

    const moduleCount = run.modules?.length ?? 1;
    const growth = run.assaultBodyGrowth ?? 1;

    const energyBonus = uniqueEnergyCount * 0.045;
    const moduleBonus = Math.max(0, moduleCount - 1) * 0.025;
    const growthBonus = Math.min(0.28, growth * 0.012);

    return Math.min(1.45, 1 + energyBonus + moduleBonus + growthBonus);
  };

  const getAssaultCoreVisualRadius = (module: any): number => {
    const levelBonus = (module.level ?? 1) * 0.8;
    const rarityBonus =
      module.rarity === "legendary" ? 3 :
      module.rarity === "epic" ? 2 :
      module.rarity === "rare" ? 1 :
      0;

    const bodyThickness = getAssaultBodyThicknessMultiplier();

    return Math.min(16, (6 + levelBonus + rarityBonus) * bodyThickness);
  };

  const getAssaultVitalHitPoints = () => {
    const core = stateRef.current;
    const head = { x: core.player.x, y: core.player.y };
    
    const segments = core.player.segments || [];
    const tail = segments.length > 0
      ? { x: segments[segments.length - 1].x, y: segments[segments.length - 1].y }
      : null;

    return {
      head,
      tail,
    };
  };

  const getAssaultHeadHitRadius = (): number => {
    const base = 22;
    const thickness = getAssaultBodyThicknessMultiplier();
    return Math.min(34, base * Math.min(1.18, thickness));
  };

  const getAssaultTailHitRadius = (): number => {
    const base = 18;
    const thickness = getAssaultBodyThicknessMultiplier();
    return Math.min(28, base * Math.min(1.12, thickness));
  };

  const getAssaultTailPoint = () => {
    const core = stateRef.current;
    const segments = core.player.segments || [];
    return segments.length > 0
      ? { x: segments[segments.length - 1].x, y: segments[segments.length - 1].y }
      : null;
  };

  const chooseNexusAssaultRoomType = (roomIndex: number): AssaultRoomType => {
    if (roomIndex <= 2) return "normal";
    if (roomIndex % 5 === 0) return "boss";
    if (roomIndex % 4 === 0) return "swarm";
    if (roomIndex % 7 === 0) return "rest";
    return "normal";
  };

  const getNexusAssaultRoomDifficulty = (roomIndex: number) => {
    const tier =
      roomIndex <= 3 ? 1 :
      roomIndex <= 6 ? 2 :
      roomIndex <= 10 ? 3 :
      roomIndex <= 15 ? 4 :
      5;

    const base = 1 + Math.max(0, roomIndex - 1) * 0.075;

    return {
      tier,
      baseMultiplier: Math.min(2.25, base),
      enemyHpMultiplier: Math.min(2.4, 1 + (roomIndex - 1) * 0.085),
      enemyDamageMultiplier: Math.min(2.0, 1 + (roomIndex - 1) * 0.06),
      enemySpeedMultiplier: Math.min(1.55, 1 + (roomIndex - 1) * 0.035),
      projectileSpeedMultiplier: Math.min(1.55, 1 + (roomIndex - 1) * 0.035),
      fireRateMultiplier: Math.min(1.65, 1 + (roomIndex - 1) * 0.04),
      spawnCountMultiplier: Math.min(2.2, 1 + (roomIndex - 1) * 0.07),
    };
  };

  const NEXUS_ASSAULT_ROOM_TYPE_CONFIG: Record<AssaultRoomType, { label: string; enemyCountBase: number; eliteChance: number; projectileDensity: number; healingMultiplier: number }> = {
    normal: {
      label: "NORMAL CHAMBER",
      enemyCountBase: 4,
      eliteChance: 0,
      projectileDensity: 1,
      healingMultiplier: 1,
    },
    swarm: {
      label: "SWARM CHAMBER",
      enemyCountBase: 8,
      eliteChance: 0,
      projectileDensity: 0.75,
      healingMultiplier: 1.15,
    },
    elite: {
      label: "ELITE CHAMBER",
      enemyCountBase: 3,
      eliteChance: 1,
      projectileDensity: 1.2,
      healingMultiplier: 1.35,
    },
    rest: {
      label: "VITAL STABILIZATION",
      enemyCountBase: 0,
      eliteChance: 0,
      projectileDensity: 0,
      healingMultiplier: 1,
    },
    boss_preview: {
      label: "NEXUS DISTORTION",
      enemyCountBase: 2,
      eliteChance: 0.5,
      projectileDensity: 1.1,
      healingMultiplier: 1.2,
    },
    boss: {
      label: "BOSS CHAMBER",
      enemyCountBase: 1,
      eliteChance: 0,
      projectileDensity: 1.25,
      healingMultiplier: 1.5,
    },
  };

  const getEnemyProjectileBudget = (roomIndex: number, roomType: AssaultRoomType): number => {
    const difficulty = getNexusAssaultRoomDifficulty(roomIndex);
    const typeConfig = NEXUS_ASSAULT_ROOM_TYPE_CONFIG[roomType] || NEXUS_ASSAULT_ROOM_TYPE_CONFIG.normal;

    const baseBudget = 18;
    const budget = baseBudget *
      difficulty.fireRateMultiplier *
      typeConfig.projectileDensity;

    return Math.min(48, Math.round(budget));
  };

  type AssaultRoomGrade = "S" | "A" | "B" | "C";

  const getUpgradeRarityWeightsForGrade = (grade: AssaultRoomGrade) => {
    switch (grade) {
      case "S":
        return { common: 45, rare: 35, epic: 17, legendary: 3 };
      case "A":
        return { common: 58, rare: 30, epic: 11, legendary: 1 };
      case "B":
        return { common: 70, rare: 24, epic: 6, legendary: 0 };
      default:
        return { common: 82, rare: 16, epic: 2, legendary: 0 };
    }
  };

  const getAssaultRoomClearHealPercent = (roomType: AssaultRoomType): number => {
    switch (roomType) {
      case "swarm": return 0.08;
      case "elite": return 0.14;
      case "rest": return 0.12;
      default: return 0.07;
    }
  };

  const calculateAssaultRoomGrade = (): AssaultRoomGrade => {
    const run = stateRef.current.assaultRun;
    if (!run) return "C";
    const damage = run.damageTakenThisRoom ?? 0;
    const clearTime = run.roomClearDuration ?? 999;

    if (damage <= 0 && clearTime <= 35) return "S";
    if (damage <= 15 && clearTime <= 50) return "A";
    if (damage <= 35) return "B";
    return "C";
  };

  const getAssaultTailStrikeDamage = (): number => {
    const core = stateRef.current;
    const run = core.assaultRun;
    if (!run) return 25;
    const roomIndex = run.roomIndex ?? 1;
    const moduleCount = run.modules?.length ?? 1;
    const uniqueCount = new Set((run.modules ?? []).map((m: any) => m.element)).size;

    let baseDamage =
      6 +
      moduleCount * 1.1 +
      uniqueCount * 1.8 +
      Math.min(10, roomIndex * 0.55);

    if (run.tailDamageMultiplier !== undefined) {
      baseDamage *= run.tailDamageMultiplier;
    }

    if (run.tailOverheatTime && run.tailOverheatTime > Date.now()) {
      baseDamage *= 0.75;
    }

    return Math.round(baseDamage);
  };

  const checkEnemyProjectileHitsAssaultVitalPoints = (proj: any) => {
    const { head, tail } = getAssaultVitalHitPoints();

    const headRadius = getAssaultHeadHitRadius();
    const tailRadius = getAssaultTailHitRadius();

    if (head && Math.hypot(proj.x - head.x, proj.y - head.y) <= proj.radius + headRadius) {
      return {
        hit: true,
        hitZone: "head" as const,
        damageMultiplier: 1.0,
      };
    }

    if (tail && Math.hypot(proj.x - tail.x, proj.y - tail.y) <= proj.radius + tailRadius) {
      return {
        hit: true,
        hitZone: "tail" as const,
        damageMultiplier: 0.65,
      };
    }

    // BODY PASS — NO DAMAGE! But we can check if it passes near the body to show a soft defensive spark
    let nearBody = false;
    const core = stateRef.current;
    for (let i = 0; i < core.player.segments.length; ++i) {
      const seg = core.player.segments[i];
      if (Math.hypot(proj.x - seg.x, proj.y - seg.y) < proj.radius + seg.size / 2) {
        nearBody = true;
        break;
      }
    }

    return {
      hit: false,
      hitZone: "body" as const,
      damageMultiplier: 0,
      nearBody,
    };
  };

  const hasAllGaiaEnergies = (run: any): boolean => {
    if (!run) return false;
    const elements = new Set(
      (run.modules ?? []).map((m: any) => m.element === "terra" ? "termo" : m.element)
    );
    const hasAll = GAIA_EVOLUTION_LOCK.requiredEnergies.every(e =>
      elements.has(e)
    );
    if (hasAll) {
      console.log("GAIA AWAKENING CONDITIONS MET");
    }
    return hasAll;
  };

  const getGaiaEnergyProgress = (run: any): number => {
    if (!run) return 0;
    const elements = new Set((run.modules ?? []).map((m: any) => m.element === "terra" ? "termo" : m.element));
    return GAIA_EVOLUTION_LOCK.requiredEnergies.filter(e => elements.has(e)).length;
  };

  const createOrbiCombatModule = (
    element: OrbiElementType,
    bodyIndex: number,
    rarity: UpgradeRarity = "common"
  ): OrbiCombatModule => {
    let name = "";
    let damage = 0;
    let cooldownSec = 0;
    let range = 0;
    let speed = 0;
    let statusEffect: "slow" | "knockback" | undefined = undefined;

    const el = element === "terra" ? "termo" : element;

    switch (el) {
      case "foton":
        name = "Foton Core";
        damage = 14;
        cooldownSec = 0.75;
        range = 720;
        speed = 7.4;
        break;
      case "hydro":
        name = "Hydro Core";
        damage = 9;
        cooldownSec = 1.05;
        range = 650;
        speed = 5.6;
        statusEffect = "slow";
        break;
      case "aero":
        name = "Aero Core";
        damage = 8;
        cooldownSec = 0.55;
        range = 760;
        speed = 9.2;
        break;
      case "termo":
        name = "Termo Core";
        damage = 12;
        cooldownSec = 1.15;
        range = 560;
        speed = 5.2;
        statusEffect = "knockback";
        break;
      default:
        name = "Energy Core";
        damage = 10;
        cooldownSec = 1.0;
        range = 600;
        speed = 6.0;
        break;
    }

    const mult = rarity === "epic" ? 1.35 : rarity === "rare" ? 1.15 : 1.0;
    const cdMult = rarity === "epic" ? 0.82 : rarity === "rare" ? 0.91 : 1.0;

    damage = Math.round(damage * mult);
    cooldownSec = cooldownSec * cdMult;

    const fireCooldown = Math.max(10, Math.round(cooldownSec * 60));

    return {
      id: `mod_${el}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      element: el,
      name,
      bodyIndex,
      level: 1,
      maxLevel: 5,
      rarity,
      cooldown: fireCooldown,
      cooldownRemaining: 0,
      damage,
      range,
      projectileSpeed: speed,
      projectileCount: 1,
      autoFire: true,
      statusEffect,
      attackType: getDefaultAttackTypeForElement(el),
      
      // Backwards compatibility
      type: el.toUpperCase() as any,
      segmentIndex: bodyIndex,
      lastFireTime: 0
    };
  };

  const getNextAvailableModuleBodyIndex = (run: NexusAssaultRun): number => {
    const preferredModuleIndexes = [2, 5, 8, 11, 14, 17, 20, 23];
    const takenIndexes = run.modules.map(m => m.bodyIndex !== undefined ? m.bodyIndex : (m.segmentIndex || 0));
    for (const idx of preferredModuleIndexes) {
      if (!takenIndexes.includes(idx)) {
        return idx;
      }
    }
    return (run.modules.length * 3 + 2) % 25;
  };

  const upgradeExistingCore = (run: NexusAssaultRun, element: OrbiElementType): NexusAssaultRun => {
    const el = element === "terra" ? "termo" : element;
    const mods = run.modules.filter(m => m.element === el);
    if (mods.length === 0) return run;

    mods.sort((a, b) => a.level - b.level);
    const target = mods[0];

    if (target.level < 5) {
      target.level++;
      target.damage = Math.round(target.damage * 1.18);
      target.range = Math.round(target.range * 1.04);
      target.projectileSpeed = target.projectileSpeed * 1.03;
      target.cooldown = Math.max(10, Math.round(target.cooldown * 0.94));
      
      target.fireCooldown = target.cooldown;
    }

    return run;
  };

  const checkSynergies = (run: NexusAssaultRun) => {
    if (!run.synergiesActive) run.synergiesActive = [];
    
    const hasFoton = run.modules.some(m => m.element === 'foton');
    const hasHydro = run.modules.some(m => m.element === 'hydro');
    const hasAero = run.modules.some(m => m.element === 'aero');
    const hasTermo = run.modules.some(m => m.element === 'termo' || m.element === 'terra');

    const checkAndActivate = (id: string, name: string) => {
      if (!run.synergiesActive!.includes(id)) {
        run.synergiesActive!.push(id);
        showTemporaryMessage(`SYNERGY AWAKENED: ${name}`);
        
        const core = stateRef.current;
        core.floatingTexts.push({
          id: Math.random().toString(),
          x: core.player.x,
          y: core.player.y - 60,
          text: `¡SINERGIA: ${name}!`,
          color: '#34d399',
          life: 3.0,
          size: 18
        });
        triggerAudioSign('Conexión Resumida', 'evolve');
      }
    };

    if (hasFoton && hasHydro) checkAndActivate("prisma_solar", "PRISMA SOLAR");
    if (hasFoton && hasAero) checkAndActivate("tormenta_radiante", "TORMENTA RADIANTE");
    if (hasHydro && hasAero) checkAndActivate("monzon_nexus", "MONZÓN NEXUS");
    if (hasHydro && hasTermo) checkAndActivate("vapor_nexus", "VAPOR NEXUS");
    if (hasFoton && hasTermo) checkAndActivate("helios_thermal", "HELIOS THERMAL");
  };

  const spawnAssaultEnemiesForRoom = (roomIndex: number) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    core.assaultRun.enemies = [];
    core.assaultRun.projectiles = [];
    core.assaultRun.roomCleared = false;
    core.assaultRun.showUpgradeSelection = false;
    setAssaultUpgradeActive(false);

    // Reset wave clear timer and clear any remaining energy pickups/orbs
    core.assaultRun.waveClearTimer = 0;
    core.assaultRun.noEnemySoftlockTimer = 0;
    core.assaultRun.damageTakenThisRoom = 0;
    core.assaultRun.roomClearDuration = 0;
    core.assaultRun.tailHitsThisRoom = 0;
    core.assaultRun.coreStabilizerActiveThisRoom = false;
    core.assaultRun.run = {
      status: 'combat',
      currentRoomCleared: false
    };
    core.orbs = [];

    if (!core.assaultRun.room) {
      core.assaultRun.room = {
        width: 2850,
        height: 2850,
        boundaryPadding: 1425 - 750 + 25,
        shape: 'RECTANGLE'
      };
    }

    // IMPLEMENTACIÓN 12 — ROOM SHAPE BALANCE (WITH PROGRESSION AND DIAMOND SHAPE SUPPORT)
    if (roomIndex === 1) {
      core.assaultRun.room.shape = 'RECTANGLE';
    } else if (roomIndex === 2) {
      core.assaultRun.room.shape = Math.random() < 0.5 ? 'RECTANGLE' : 'WIDE_RECTANGLE';
    } else if (roomIndex <= 4) {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE'];
      core.assaultRun.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    } else if (roomIndex <= 6) {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE', 'OCTAGON'];
      core.assaultRun.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    } else {
      const shapes = ['RECTANGLE', 'WIDE_RECTANGLE', 'CIRCLE', 'OCTAGON', 'DIAMOND'];
      core.assaultRun.room.shape = shapes[Math.floor(Math.random() * shapes.length)];
    }

    core.assaultRun.roomShapeFallback = false;
    core.assaultRun.roomShapeReason = 'none';

    const roomType = chooseNexusAssaultRoomType(roomIndex);
    core.assaultRun.roomType = roomType;

    // Trigger Room Entry Banner (Implementation 6)
    triggerRoomEntryBanner(roomIndex, roomType, core.assaultRun.room.shape);

    if (roomType === 'rest') {
      core.assaultRun.roomCleared = false;
      core.assaultRun.run.currentRoomCleared = false;
      core.assaultRun.run.status = 'combat';
      setAssaultRunCleared(false);

      const beacon: AssaultEnemy = {
        id: 'rest_beacon_' + Date.now() + '_' + Math.random(),
        type: 'REST_BEACON',
        archetype: 'rest_beacon',
        x: 1425,
        y: 1425,
        radius: 35,
        health: 100,
        maxHealth: 100,
        color: '#ffffff',
        accentColor: '#22d3ee',
        glowColor: '#0ea5e9',
        shootCooldown: 999999,
        vx: 0,
        vy: 0,
        lastShotTime: 0,
        statusEffects: []
      };
      core.assaultRun.enemies = [beacon];
      setAssaultRunRoom(core.assaultRun.roomIndex);

      showAssaultBanner(
        "NEXUS SANCTUARY",
        "PURIFY THE ALTAR TO STABILIZE VITALS"
      );
      return;
    }

    if (roomType === 'boss') {
      const boss = createNexusAssaultBoss(roomIndex, core.assaultRun.room);
      core.assaultRun.enemies = [boss];
      core.assaultRun.currentBoss = boss;

      setAssaultRunHp(core.assaultRun.hp);
      setAssaultRunMaxHp(core.assaultRun.maxHp);
      setAssaultRunRoom(core.assaultRun.roomIndex);
      setAssaultRunCleared(false);

      triggerBossIntroCinematic(boss);
      return;
    }

    const spawnedList = spawnEnemiesForAssaultRoom(roomIndex, core.assaultRun.room);
    if (roomIndex === 1) {
      core.assaultRun.queuedEnemies = spawnedList;
      core.assaultRun.enemies = [];
      core.assaultRun.countdownComplete = false;
      core.assaultRun.combatStarted = false;
      core.assaultRun.enemySpawnDelayAfterCountdown = 60; // 1.0s at 60fps
    } else {
      core.assaultRun.enemies = spawnedList;
      core.assaultRun.countdownComplete = true;
      core.assaultRun.combatStarted = true;
    }

    setAssaultRunHp(core.assaultRun.hp);
    setAssaultRunMaxHp(core.assaultRun.maxHp);
    setAssaultRunRoom(core.assaultRun.roomIndex);
    setAssaultRunCleared(false);

    const config = NEXUS_ASSAULT_ROOM_TYPE_CONFIG[roomType] || NEXUS_ASSAULT_ROOM_TYPE_CONFIG.normal;
    showAssaultBanner(
      config.label,
      "BLACKOUT HOSTILES DETECTED"
    );
  };

  const generateAssaultUpgrades = () => {
    const run = stateRef.current.assaultRun;
    if (!run) return;
    const totalModules = run.modules?.length ?? 0;
    const currentRoom = run.roomIndex ?? 1;

    const hasFoton = run.modules.some((m: any) => m.element === 'foton');
    const hasHydro = run.modules.some((m: any) => m.element === 'hydro');
    const hasAero = run.modules.some((m: any) => m.element === 'aero');
    const hasTermo = run.modules.some((m: any) => m.element === 'termo' || m.element === 'terra');

    const fotonLvl3 = run.modules.some((m: any) => m.element === 'foton' && m.level >= 3 && !m.mutation);
    const hydroLvl3 = run.modules.some((m: any) => m.element === 'hydro' && m.level >= 3 && !m.mutation);
    const aeroLvl3 = run.modules.some((m: any) => m.element === 'aero' && m.level >= 3 && !m.mutation);
    const termoLvl3 = run.modules.some((m: any) => (m.element === 'termo' || m.element === 'terra') && m.level >= 3 && !m.mutation);

    const availableOptions: AssaultUpgrade[] = [];

    // IMPLEMENTACIÓN 8 — UPGRADE CHANCE POR GRADE
    const lastGrade: AssaultRoomGrade = (run.gradeHistory && run.gradeHistory.length > 0)
      ? run.gradeHistory[run.gradeHistory.length - 1] as AssaultRoomGrade
      : "B";

    const weights = getUpgradeRarityWeightsForGrade(lastGrade);

    const getRarity = (): UpgradeRarity => {
      const rand = Math.random() * 100;
      const epicChance = weights.epic + (weights.legendary || 0);
      const rareChance = weights.rare;
      
      if (rand < epicChance) return 'epic';
      if (rand < epicChance + rareChance) return 'rare';
      return 'common';
    };

    if (totalModules < 8) {
      if (!hasHydro) {
        const rar = getRarity();
        availableOptions.push({
          id: 'add_hydro',
          title: 'AÑADIR NÚCLEO HYDRO',
          description: `Acopla un orbe Hydro azul en un segmento libre. Dispara torrentes acuáticos que ralentizan enemigos. Rareza: ${rar.toUpperCase()}`,
          rarity: rar,
          element: 'hydro',
          apply: (r) => {
            const idx = getNextAvailableModuleBodyIndex(r);
            const mod = createOrbiCombatModule('hydro', idx, rar);
            r.modules.push(mod);
            return r;
          }
        });
      }
      if (!hasAero) {
        const rar = getRarity();
        availableOptions.push({
          id: 'add_aero',
          title: 'AÑADIR NÚCLEO AERO',
          description: `Acopla un orbe Aero cian pálido en un segmento libre. Agujas eólicas de disparo hiper-veloz. Rareza: ${rar.toUpperCase()}`,
          rarity: rar,
          element: 'aero',
          apply: (r) => {
            const idx = getNextAvailableModuleBodyIndex(r);
            const mod = createOrbiCombatModule('aero', idx, rar);
            r.modules.push(mod);
            return r;
          }
        });
      }
      if (!hasTermo && currentRoom >= 2) {
        const rar = getRarity();
        availableOptions.push({
          id: 'add_termo',
          title: 'AÑADIR NÚCLEO TERMO',
          description: `Acopla un orbe Termo naranja en un segmento libre. Emite ráfagas térmicas de gran empuje. Rareza: ${rar.toUpperCase()}`,
          rarity: rar,
          element: 'termo',
          apply: (r) => {
            const idx = getNextAvailableModuleBodyIndex(r);
            const mod = createOrbiCombatModule('termo', idx, rar);
            r.modules.push(mod);
            return r;
          }
        });
      }
    }

    if (hasFoton) {
      const isMax = run.modules.filter((m: any) => m.element === 'foton').every((m: any) => m.level >= 5);
      if (!isMax) {
        const rar = getRarity();
        availableOptions.push({
          id: 'upg_foton',
          title: 'MEJORAR NÚCLEO FOTON',
          description: `Potencia tus ráfagas de luz Foton. +1 Nivel, +18% daño, +4% rango, cooldown reducido.`,
          rarity: rar,
          element: 'foton',
          apply: (r) => upgradeExistingCore(r, 'foton')
        });
      }
    }
    if (hasHydro) {
      const isMax = run.modules.filter((m: any) => m.element === 'hydro').every((m: any) => m.level >= 5);
      if (!isMax) {
        const rar = getRarity();
        availableOptions.push({
          id: 'upg_hydro',
          title: 'MEJORAR NÚCLEO HYDRO',
          description: `Potencia la presión hidráulica. +1 Nivel, +18% daño, +4% rango, ralentización mejorada.`,
          rarity: rar,
          element: 'hydro',
          apply: (r) => upgradeExistingCore(r, 'hydro')
        });
      }
    }
    if (hasAero) {
      const isMax = run.modules.filter((m: any) => m.element === 'aero').every((m: any) => m.level >= 5);
      if (!isMax) {
        const rar = getRarity();
        availableOptions.push({
          id: 'upg_aero',
          title: 'MEJORAR NÚCLEO AERO',
          description: `Potencia la cadencia de viento. +1 Nivel, +18% daño, +3% velocidad, cooldown reducido.`,
          rarity: rar,
          element: 'aero',
          apply: (r) => upgradeExistingCore(r, 'aero')
        });
      }
    }
    if (hasTermo) {
      const isMax = run.modules.filter((m: any) => m.element === 'termo' || m.element === 'terra').every((m: any) => m.level >= 5);
      if (!isMax) {
        const rar = getRarity();
        availableOptions.push({
          id: 'upg_termo',
          title: 'MEJORAR NÚCLEO TERMO',
          description: `Potencia la combustión térmica. +1 Nivel, +18% daño, calor e impacto incrementado.`,
          rarity: rar,
          element: 'termo',
          apply: (r) => upgradeExistingCore(r, 'termo')
        });
      }
    }

    if (fotonLvl3) {
      availableOptions.push({
        id: 'mut_solar_lance',
        title: 'MUTACIÓN: SOLAR LANCE',
        description: 'Requiere Foton Nivel 3. Los disparos de Foton ahora perforan al primer enemigo golpeado, impactando detrás.',
        rarity: 'epic',
        element: 'foton',
        apply: (r) => {
          const mod = r.modules.find(m => m.element === 'foton' && m.level >= 3 && !m.mutation);
          if (mod) mod.mutation = 'solar_lance';
          return r;
        }
      });
    }
    if (hydroLvl3) {
      availableOptions.push({
        id: 'mut_tidal_siphon',
        title: 'MUTACIÓN: TIDAL SIPHON',
        description: 'Requiere Hydro Nivel 3. Ralentiza más a los enemigos y tiene 15% de probabilidad de recuperar +1 HP por impacto.',
        rarity: 'epic',
        element: 'hydro',
        apply: (r) => {
          const mod = r.modules.find(m => m.element === 'hydro' && m.level >= 3 && !m.mutation);
          if (mod) mod.mutation = 'tidal_siphon';
          return r;
        }
      });
    }
    if (aeroLvl3) {
      availableOptions.push({
        id: 'mut_wind_split',
        title: 'MUTACIÓN: WIND SPLIT',
        description: 'Requiere Aero Nivel 3. El 35% de los disparos de Aero se dividen en dos microproyectiles eólicos adicionales.',
        rarity: 'epic',
        element: 'aero',
        apply: (r) => {
          const mod = r.modules.find(m => m.element === 'aero' && m.level >= 3 && !m.mutation);
          if (mod) mod.mutation = 'wind_split';
          return r;
        }
      });
    }
    if (termoLvl3) {
      availableOptions.push({
        id: 'mut_termo_pulse',
        title: 'MUTACIÓN: TERMO PULSE',
        description: 'Requiere Termo Nivel 3. Al disparar, Termo emite una onda de choque radial de empuje a su alrededor.',
        rarity: 'epic',
        element: 'termo',
        apply: (r) => {
          const mod = r.modules.find(m => (m.element === 'termo' || m.element === 'terra') && m.level >= 3 && !m.mutation);
          if (mod) mod.mutation = 'termo_pulse';
          return r;
        }
      });
    }

    // IMPLEMENTACIÓN 9 — MEJORAS DEFENSIVAS BÁSICAS
    availableOptions.push({
      id: 'def_vital_plating',
      title: 'VITAL PLATING',
      description: 'Acoplamiento blindado. +10 Max HP. Reduce el daño recibido en la cola un 5% de forma permanente.',
      rarity: 'common',
      apply: (r) => {
        r.maxHp += 10;
        r.hp += 10;
        r.tailDamageReduction = (r.tailDamageReduction ?? 1.0) * 0.95;
        return r;
      }
    });

    availableOptions.push({
      id: 'def_head_shield',
      title: 'HEAD SHIELD',
      description: 'Refuerzo de placa frontal de alta densidad. Reduce el daño recibido en la cabeza un 6% de forma permanente.',
      rarity: 'rare',
      apply: (r) => {
        r.headDamageReduction = (r.headDamageReduction ?? 1.0) * 0.94;
        return r;
      }
    });

    availableOptions.push({
      id: 'def_tail_condenser',
      title: 'TAIL CONDENSER',
      description: 'Condensador de masa de plasma. Aumenta el daño de Tail Strike un 8% permanentemente, incrementando su cooldown un 10%.',
      rarity: 'rare',
      apply: (r) => {
        r.tailDamageMultiplier = (r.tailDamageMultiplier ?? 1.0) * 1.08;
        r.tailCooldownMultiplier = (r.tailCooldownMultiplier ?? 1.0) * 1.10;
        return r;
      }
    });

    availableOptions.push({
      id: 'def_core_stabilizer',
      title: 'CORE STABILIZER',
      description: 'Absorbedor cinético de impacto. Restaura un 8% de vida máxima y aumenta la resistencia al daño un 15% durante la siguiente sala.',
      rarity: 'epic',
      apply: (r) => {
        r.hp = Math.min(r.maxHp, r.hp + Math.round(r.maxHp * 0.08));
        r.coreStabilizerActiveThisRoom = true;
        return r;
      }
    });

    availableOptions.push({
      id: 'def_radar_focus',
      title: 'RADAR FOCUS',
      description: 'Filtro espectral avanzado. El último enemigo queda detectado hiper-visible en radar y el tracking de Elites resalta 20% más.',
      rarity: 'common',
      apply: (r) => {
        r.radarFocusUnlocked = true;
        return r;
      }
    });

    availableOptions.push({
      id: 'stat_heal',
      title: 'RECONEXIÓN DE PLASMA',
      description: 'Sincroniza los filamentos vitals. Restaura de inmediato +45 HP a tu núcleo Orbi.',
      rarity: 'common',
      apply: (r) => {
        r.hp = Math.min(r.maxHp, r.hp + 45);
        return r;
      }
    });

    availableOptions.push({
      id: 'stat_max_hp',
      title: 'EXPANSIÓN ESTRUCTURAL',
      description: 'Aumenta de forma permanente tu capacidad de membrana: +25 HP Máximo y sana +25 HP.',
      rarity: 'rare',
      apply: (r) => {
        r.maxHp += 25;
        r.hp += 25;
        return r;
      }
    });

    const finalSelection: AssaultUpgrade[] = [];
    const copy = [...availableOptions];
    
    copy.sort((a, b) => {
      const scoreA = a.id.startsWith('add') ? 3 : a.id.startsWith('mut') ? 2 : a.id.startsWith('upg') ? 1 : 0;
      const scoreB = b.id.startsWith('add') ? 3 : b.id.startsWith('mut') ? 2 : b.id.startsWith('upg') ? 1 : 0;
      return scoreB - scoreA + (Math.random() - 0.5) * 1.5;
    });

    while (finalSelection.length < 3 && copy.length > 0) {
      const idx = Math.floor(Math.random() * Math.min(copy.length, 5));
      finalSelection.push(copy.splice(idx, 1)[0]);
    }

    while (finalSelection.length < 3) {
      finalSelection.push({
        id: 'stat_heal_fallback_' + Math.random(),
        title: 'RECONEXIÓN RÁPIDA',
        description: 'Repara filamentos dañados. Restaura +30 HP.',
        rarity: 'common',
        apply: (r) => {
          r.hp = Math.min(r.maxHp, r.hp + 30);
          return r;
        }
      });
    }

    run.upgradesAvailable = finalSelection;
    setUpgradesList(finalSelection);
  };

  const startNextAssaultRoomOrWave = () => {
    startNextAssaultRoom();
  };

  const selectAssaultUpgrade = (upgrade: any) => {
    const core = stateRef.current;
    const nexusAssaultState = core.assaultRun;
    if (!nexusAssaultState) return;

    const run = nexusAssaultState.run;
    if (!run) return;

    if (run.status !== 'upgrade_selection') return;

    if (upgrade.apply) {
      core.assaultRun = upgrade.apply(core.assaultRun);
    } else if (upgrade.action) {
      upgrade.action(core);
    }

    // Serpent Growth and Slot Sync
    if (upgrade.id && upgrade.id.startsWith('add_')) {
      growAssaultOrbiBodyForNewCore(1);
    } else {
      growAssaultOrbiBodyProgress(0.5);
    }

    syncAssaultModulesToBodySlots();

    checkSynergies(core.assaultRun);

    nexusAssaultState.showUpgradePanel = false;
    nexusAssaultState.awaitingUpgradeSelection = false;
    nexusAssaultState.upgradeChoices = [];
    nexusAssaultState.showUpgradeSelection = false;
    setAssaultUpgradeActive(false);

    // Enter cinematic transition state (0.75s) to prevent double-clicks and show smooth next chamber stabilization
    run.status = 'transition_next_room';
    nexusAssaultState.transitionTimer = 0;
    nexusAssaultState.transitionReason = 'upgrade_selected';
  };

  const hurtAssaultPlayer = (amount: number, zone?: "head" | "tail" | "body") => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    let finalAmount = amount;
    
    if (zone === "head" && core.assaultRun.headDamageReduction !== undefined) {
      finalAmount *= core.assaultRun.headDamageReduction;
    } else if (zone === "tail" && core.assaultRun.tailDamageReduction !== undefined) {
      finalAmount *= core.assaultRun.tailDamageReduction;
    }

    if (core.assaultRun.coreStabilizerActiveThisRoom) {
      finalAmount *= 0.85; // 15% damage reduction from Core Stabilizer
    }

    finalAmount = Math.max(1, Math.round(finalAmount));

    core.assaultRun.hp = Math.max(0, core.assaultRun.hp - finalAmount);
    setAssaultRunHp(core.assaultRun.hp);

    core.assaultRun.damageTakenThisRoom = (core.assaultRun.damageTakenThisRoom ?? 0) + finalAmount;
    core.assaultRun.totalDamageTaken = (core.assaultRun.totalDamageTaken ?? 0) + finalAmount;

    // Record hit zone & hit time in player (QA Checkpoint 2)
    const p = core.player;
    p.lastHitZone = zone || "head";
    p.lastHitTime = Date.now();

    // Trigger controlled screen flash
    setDamageFlashing(true);
    setTimeout(() => setDamageFlashing(false), 200);

    // Camera Shake feedback
    if (core.camera) {
      core.camera.shakeTime = 8;
      core.camera.shakeIntensity = zone === "head" ? 4.5 : (zone === "tail" ? 3.0 : 2.5);
    }

    // Audio Cue
    triggerAudioSign('Daño recibido', 'reset');

    // Floating damage text showing zone and damage amount at hit coordinate
    let hitX = p.x;
    let hitY = p.y;
    if (zone === "tail" && p.segments && p.segments.length > 0) {
      const lastSeg = p.segments[p.segments.length - 1];
      hitX = lastSeg.x;
      hitY = lastSeg.y;
    } else if (zone === "body" && p.segments && p.segments.length > 1) {
      const midSeg = p.segments[Math.floor(p.segments.length / 2)];
      hitX = midSeg.x;
      hitY = midSeg.y;
    }

    const zoneLabel = zone === "head" ? "HEAD HIT" : (zone === "tail" ? "TAIL HIT" : "BODY HIT");
    const textColor = zone === "head" ? "#ff4444" : (zone === "tail" ? "#ff6666" : "#ff3333");

    if (core.floatingTexts) {
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: hitX,
        y: hitY - 20,
        text: `-${finalAmount} ${zoneLabel}`,
        color: textColor,
        life: 1.4,
        size: 13
      });
    }

    if (core.assaultRun.hp <= 0) {
      setGameState('GAMEOVER');
      triggerAudioSign('Red vital purgada', 'reset');
    }
  };

  type NexusAssaultBossType =
    | "blackout_elite_core"
    | "crimson_pulsar_core"
    | "void_serpent_fragment";

  const createNexusAssaultBoss = (roomIndex: number, room: any) => {
    const bossTier =
      roomIndex >= 15 ? 3 :
      roomIndex >= 10 ? 2 :
      1;

    let bossType: AssaultEnemyType = "blackout_elite_core";
    if (bossTier === 2) bossType = "crimson_pulsar_core";
    if (bossTier === 3) bossType = "void_serpent_fragment";

    const difficulty = getNexusAssaultRoomDifficulty(roomIndex);

    const baseHp =
      bossTier === 1 ? 420 :
      bossTier === 2 ? 720 :
      1050;

    const bossHp = Math.round(baseHp * difficulty.enemyHpMultiplier);

    const boss = {
      id: `boss_${bossType}_${roomIndex}_${Date.now()}`,
      type: bossType,
      name:
        bossType === "blackout_elite_core" ? "BLACKOUT ELITE CORE" :
        bossType === "crimson_pulsar_core" ? "CRIMSON PULSAR CORE" :
        "VOID SERPENT FRAGMENT",
      x: 1425,
      y: 1425 - 280, // slightly offset upwards from center
      vx: 0,
      vy: 0,
      radius:
        bossTier === 1 ? 46 :
        bossTier === 2 ? 58 :
        68,
      health: bossHp,
      maxHealth: bossHp,
      hp: bossHp,
      maxHp: bossHp,
      damage: Math.round(12 * difficulty.enemyDamageMultiplier),
      alive: true,
      isBoss: true,
      isElite: true,
      bossTier,
      phase: 1,
      attackTimer: 0,
      patternTimer: 0,
      invulnTimer: 1.4, // Initial 1.4s invulnerability
      contactDamageCooldown: 0,
      scoreValue: 2500 * bossTier,
      shootCooldown: 0,
      lastShotTime: 0,
      color:
        bossType === "blackout_elite_core" ? "#ef4444" :
        bossType === "crimson_pulsar_core" ? "#dc2626" :
        "#c084fc",
    };

    return boss;
  };

  const triggerBossIntroCinematic = (boss: any) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    core.assaultRun.bossIntroActive = true;
    core.assaultRun.bossIntroTimer = 1.4 * 60; // 1.4s at 60fps

    core.camera.shakeTime = 12;
    core.camera.shakeIntensity = 6;

    showAssaultBanner(
      `BOSS CHAMBER ${String(core.assaultRun.roomIndex).padStart(2, "0")}`,
      boss.name
    );

    triggerAudioSign('Alerta de proximidad', 'blackout');
  };

  const calculateBossRoomGrade = (): string => {
    const core = stateRef.current;
    if (!core.assaultRun) return "C";

    const damageTaken = core.assaultRun.damageTakenThisRoom ?? 0;
    const maxHp = core.assaultRun.maxHp;

    if (damageTaken === 0) return "S";
    if (damageTaken < maxHp * 0.35) return "A";
    if (damageTaken < maxHp * 0.70) return "B";
    return "C";
  };

  const gradeToScore = (grade: string): number => {
    if (grade === 'S') return 4;
    if (grade === 'A') return 3;
    if (grade === 'B') return 2;
    return 1;
  };

  const completeNexusAssaultBossRoom = (boss: any) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    boss.alive = false;
    core.assaultRun.enemiesKilled = (core.assaultRun.enemiesKilled ?? 0) + 1;
    setAssaultKills(core.assaultRun.enemiesKilled);

    core.assaultRun.bossesDefeated = (core.assaultRun.bossesDefeated ?? 0) + 1;
    core.assaultRun.highestBossRoomReached = Math.max(
      core.assaultRun.highestBossRoomReached ?? 0,
      core.assaultRun.roomIndex
    );

    const grade = calculateBossRoomGrade();
    if (!core.assaultRun.gradeHistory) {
      core.assaultRun.gradeHistory = [];
    }
    core.assaultRun.gradeHistory.push(grade);
    if (grade === "S") {
      core.assaultRun.totalSGrades = (core.assaultRun.totalSGrades ?? 0) + 1;
    }

    if (
      !core.assaultRun.bestBossGrade ||
      gradeToScore(grade) > gradeToScore(core.assaultRun.bestBossGrade)
    ) {
      core.assaultRun.bestBossGrade = grade;
    }

    const clearTime = core.assaultRun.roomClearDuration ?? 0;
    if (
      !core.assaultRun.fastestBossClearSec ||
      clearTime < core.assaultRun.fastestBossClearSec
    ) {
      core.assaultRun.fastestBossClearSec = clearTime;
    }

    const healingAmount = Math.round(core.assaultRun.maxHp * 0.22);
    core.assaultRun.hp = Math.min(core.assaultRun.maxHp, core.assaultRun.hp + healingAmount);
    core.assaultRun.totalHealed = (core.assaultRun.totalHealed ?? 0) + healingAmount;
    setAssaultRunHp(core.assaultRun.hp);

    core.assaultRun.guaranteedRareUpgrade = true;

    triggerBurstSparks(boss.x, boss.y, boss.color, 'EVOLUTION_EXPLOSION', 35);
    triggerAudioSign('Red Vital Estabilizada', 'evolve');

    core.floatingTexts.push({
      id: Math.random().toString(),
      x: boss.x,
      y: boss.y - 45,
      text: `¡JEFE DESTRUIDO! EVALUACIÓN: ${grade}`,
      color: grade === 'S' ? '#fbbf24' : (grade === 'A' ? '#c084fc' : '#38bdf8'),
      life: 3.5,
      size: 18
    });

    setTimeout(() => {
      enterAssaultUpgradeSelection("boss defeated transition");
    }, 1200);
  };

  const updateNexusAssaultBoss = (boss: any, dt: number) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);

    if (boss.invulnTimer > 0) {
      boss.invulnTimer -= (1 / 60) * dt;
      if (boss.invulnTimer < 0) boss.invulnTimer = 0;
    }

    if (core.assaultRun.bossIntroActive && core.assaultRun.bossIntroTimer !== undefined) {
      core.assaultRun.bossIntroTimer -= dt;
      if (core.assaultRun.bossIntroTimer <= 0) {
        core.assaultRun.bossIntroActive = false;
      }
      return;
    }

    const hpPercent = boss.health / boss.maxHealth;
    if (boss.phase === 1 && hpPercent <= 0.5) {
      boss.phase = 2;
      boss.invulnTimer = 1.2;
      triggerAudioSign('Sentinel Despierto', 'evolve');

      // Giant Alerta de Fase (QA Checkpoint 7.1)
      core.floatingTexts.push({
        id: Math.random().toString(),
        x: boss.x,
        y: boss.y - 65,
        text: "⚠️ ADVERTENCIA: CRIMSON OVERDRIVE FASE 2 ⚠️",
        color: '#ff003c',
        life: 3.5,
        size: 22
      });

      core.floatingTexts.push({
        id: Math.random().toString(),
        x: boss.x,
        y: boss.y - 35,
        text: "¡VELOCIDAD Y PODER AUMENTADOS AL 140%!",
        color: '#ff9900',
        life: 3.0,
        size: 14
      });

      triggerBurstSparks(boss.x, boss.y, '#ff003c', 'EVOLUTION_EXPLOSION', 32);
      core.camera.shakeTime = 25;
      core.camera.shakeIntensity = 8.5;
    }

    boss.attackTimer = (boss.attackTimer ?? 0) + (1 / 60) * dt;
    boss.patternTimer = (boss.patternTimer ?? 0) + (1 / 60) * dt;
    if (boss.contactDamageCooldown > 0) {
      boss.contactDamageCooldown -= (1 / 60) * dt;
    }

    const px = core.player.x;
    const py = core.player.y;

    if (boss.type === "blackout_elite_core") {
      const dx = px - boss.x;
      const dy = py - boss.y;
      const dist = Math.hypot(dx, dy);

      let targetSpeed = 1.4;
      if (boss.phase === 2) {
        targetSpeed = 2.4;
      }

      if (dist > 0) {
        const ax = (dx / dist) * 0.08 * dt;
        const ay = (dy / dist) * 0.08 * dt;
        boss.vx = Math.max(-targetSpeed, Math.min(targetSpeed, boss.vx + ax));
        boss.vy = Math.max(-targetSpeed, Math.min(targetSpeed, boss.vy + ay));
      }

      boss.x += boss.vx * dt;
      boss.y += boss.vy * dt;

      const fireInterval = boss.phase === 2 ? 1.6 : 2.5;
      if (boss.attackTimer >= fireInterval) {
        boss.attackTimer = 0;
        const baseAngle = Math.atan2(py - boss.y, px - boss.x);
        const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, 'boss');

        if ((core.assaultRun.projectiles ?? []).length < budget) {
          const spreadAngles = [-0.18, 0, 0.18];
          spreadAngles.forEach((offset) => {
            const angle = baseAngle + offset;
            core.assaultRun.projectiles.push({
              id: 'boss_proj_' + Date.now() + '_' + Math.random(),
              x: boss.x,
              y: boss.y,
              vx: Math.cos(angle) * 3.6 * diff.projectileSpeedMultiplier,
              vy: Math.sin(angle) * 3.6 * diff.projectileSpeedMultiplier,
              radius: 6.5,
              damage: 13,
              color: '#f43f5e',
              isEnemy: true,
              type: 'ENEMY_SPIT'
            });
          });
          triggerBurstSparks(boss.x, boss.y, '#f43f5e', 'TAIL_SPARK', 8);
        }
      }

      if (boss.phase === 2) {
        const ringInterval = 3.5;
        if (boss.patternTimer >= ringInterval) {
          boss.patternTimer = 0;
          const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, 'boss');
          if ((core.assaultRun.projectiles ?? []).length < budget) {
            for (let i = 0; i < 12; i++) {
              const angle = (i / 12) * Math.PI * 2;
              core.assaultRun.projectiles.push({
                id: 'boss_ring_' + Date.now() + '_' + Math.random(),
                x: boss.x,
                y: boss.y,
                vx: Math.cos(angle) * 4.0 * diff.projectileSpeedMultiplier,
                vy: Math.sin(angle) * 4.0 * diff.projectileSpeedMultiplier,
                radius: 6,
                damage: 15,
                color: '#ef4444',
                isEnemy: true,
                type: 'ENEMY_SPIT'
              });
            }
            triggerBurstSparks(boss.x, boss.y, '#ef4444', 'ABILITY_PULSE', 12);
            triggerAudioSign('Fuga de plasma', 'blackout');
          }
        }
      }

    } else if (boss.type === "crimson_pulsar_core") {
      const targetX = 1425;
      const targetY = 1425 - 240;
      boss.x += (targetX - boss.x) * 0.05 * dt;
      boss.y += (targetY - boss.y) * 0.05 * dt;

      const spinAngle = core.vitalEnergyWind * 0.9;
      const streamInterval = boss.phase === 2 ? 0.35 : 0.6;
      if (boss.attackTimer >= streamInterval) {
        boss.attackTimer = 0;
        const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, 'boss');
        if ((core.assaultRun.projectiles ?? []).length < budget) {
          for (let i = 0; i < 4; i++) {
            const angle = spinAngle + (i / 4) * Math.PI * 2;
            core.assaultRun.projectiles.push({
              id: 'boss_stream_' + Date.now() + '_' + Math.random(),
              x: boss.x,
              y: boss.y,
              vx: Math.cos(angle) * 3.4 * diff.projectileSpeedMultiplier,
              vy: Math.sin(angle) * 3.4 * diff.projectileSpeedMultiplier,
              radius: 5.5,
              damage: 11,
              color: '#ef4444',
              isEnemy: true,
              type: 'ENEMY_SPIT'
            });
          }
        }
      }

      if (boss.phase === 2) {
        if (boss.pulsarRadius === undefined) boss.pulsarRadius = 0;
        boss.pulsarRadius += 2.8 * dt;
        if (boss.pulsarRadius >= 220) {
          boss.pulsarRadius = 0;
          const headDist = Math.hypot(px - boss.x, py - boss.y);
          if (headDist < 220) {
            hurtAssaultPlayer(28, "head");
            core.camera.shakeTime = 16;
            core.camera.shakeIntensity = 7;
          }
          triggerBurstSparks(boss.x, boss.y, '#dc2626', 'ABILITY_PULSE', 18);
          triggerAudioSign('Iniciando Enlace de Red', 'evolve');
        }
      }

    } else if (boss.type === "void_serpent_fragment") {
      const time = core.vitalEnergyWind * 1.2;
      const targetX = 1425 + Math.sin(time) * 320;
      const targetY = 1425 - 180 + Math.sin(time * 2) * 140;
      boss.x += (targetX - boss.x) * 0.08 * dt;
      boss.y += (targetY - boss.y) * 0.08 * dt;

      const shootInterval = boss.phase === 2 ? 0.7 : 1.2;
      if (boss.attackTimer >= shootInterval) {
        boss.attackTimer = 0;
        const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, 'boss');
        if ((core.assaultRun.projectiles ?? []).length < budget) {
          const randAngle = Math.random() * Math.PI * 2;
          core.assaultRun.projectiles.push({
            id: 'boss_void_' + Date.now() + '_' + Math.random(),
            x: boss.x,
            y: boss.y,
            vx: Math.cos(randAngle) * 4.5 * diff.projectileSpeedMultiplier,
            vy: Math.sin(randAngle) * 4.5 * diff.projectileSpeedMultiplier,
            radius: 8,
            damage: 18,
            color: '#a855f7',
            isEnemy: true,
            type: 'ENEMY_SPIT'
          });
          triggerBurstSparks(boss.x, boss.y, '#c084fc', 'BLACKOUT_SMOKE', 6);
        }
      }

      if (boss.phase === 2) {
        const headDist = Math.hypot(px - boss.x, py - boss.y);
        if (headDist < 550 && headDist > 10) {
          const pullIntensity = 1.4 * (1 - headDist / 550) * dt;
          const pullAngle = Math.atan2(boss.y - py, boss.x - px);
          core.player.x += Math.cos(pullAngle) * pullIntensity;
          core.player.y += Math.sin(pullAngle) * pullIntensity;

          if (Math.random() < 0.2 * dt) {
            core.particles.push({
              id: 'pull_pt_' + Math.random(),
              x: px + (Math.random() - 0.5) * 50,
              y: py + (Math.random() - 0.5) * 50,
              vx: Math.cos(pullAngle) * 3,
              vy: Math.sin(pullAngle) * 3,
              color: '#c084fc',
              size: 1.5,
              alpha: 0.7,
              life: 1.0,
              decay: 0.04,
              type: 'NEXUS_SPARK'
            });
          }
        }

        const spiralInterval = 0.15;
        if (boss.patternTimer >= spiralInterval) {
          boss.patternTimer = 0;
          const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, 'boss');
          if ((core.assaultRun.projectiles ?? []).length < budget) {
            const spiralAng = core.vitalEnergyWind * 4.0;
            core.assaultRun.projectiles.push({
              id: 'boss_spiral_' + Date.now() + '_' + Math.random(),
              x: boss.x,
              y: boss.y,
              vx: Math.cos(spiralAng) * 3.8 * diff.projectileSpeedMultiplier,
              vy: Math.sin(spiralAng) * 3.8 * diff.projectileSpeedMultiplier,
              radius: 5,
              damage: 12,
              color: '#c084fc',
              isEnemy: true,
              type: 'ENEMY_SPIT'
            });
          }
        }
      }
    }

    const headHitRadius = getAssaultHeadHitRadius();
    const distToHead = Math.hypot(px - boss.x, py - boss.y);
    if (distToHead < boss.radius + headHitRadius) {
      if (boss.contactDamageCooldown <= 0) {
        boss.contactDamageCooldown = 0.8;
        hurtAssaultPlayer(boss.damage, "head");
        triggerBurstSparks(px, py, '#f43f5e', 'BLACKOUT_SMOKE', 12);
        core.camera.shakeTime = 8;
        core.camera.shakeIntensity = 4.5;
      }
    }
  };

  const drawNexusAssaultBoss = (ctx: CanvasRenderingContext2D, boss: any) => {
    const core = stateRef.current;
    
    // Crimson Overdrive Phase 2 (QA Checkpoint 7.2)
    const isOverdrive = boss.phase === 2;
    const rMultiplier = isOverdrive ? 1.4 : 1.0;
    const r = boss.radius * rMultiplier;
    
    const pulseSpeed = isOverdrive ? 4.9 : 3.5;
    const pulse = Math.sin(core.vitalEnergyWind * pulseSpeed) * (isOverdrive ? 0.15 : 0.08);

    // Draw background Overdrive Crimson Corona before translating so it centers perfectly
    if (isOverdrive) {
      ctx.save();
      const coronaGrad = ctx.createRadialGradient(boss.x, boss.y, r * 0.3, boss.x, boss.y, r * 1.85);
      coronaGrad.addColorStop(0, 'rgba(255, 0, 60, 0.45)');
      coronaGrad.addColorStop(0.4, 'rgba(255, 0, 60, 0.22)');
      coronaGrad.addColorStop(0.8, 'rgba(255, 0, 60, 0.04)');
      coronaGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(boss.x, boss.y, r * 1.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.save();
    ctx.translate(boss.x, boss.y);

    if (boss.type === "blackout_elite_core") {
      ctx.save();
      ctx.rotate(core.vitalEnergyWind * 1.5);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';

      const teeth = 8;
      ctx.beginPath();
      for (let i = 0; i < teeth * 2; i++) {
        const angle = (i / teeth) * Math.PI;
        const currentR = r * (i % 2 === 0 ? 1.0 : 1.25 + pulse);
        const px = Math.cos(angle) * currentR;
        const py = Math.sin(angle) * currentR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#0a0518';
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const eyeR = r * 0.3 * (1 + pulse * 2);
      const eyeGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, eyeR);
      eyeGrad.addColorStop(0, '#ffffff');
      eyeGrad.addColorStop(0.3, '#f43f5e');
      eyeGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = eyeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, eyeR, 0, Math.PI * 2);
      ctx.fill();

    } else if (boss.type === "crimson_pulsar_core") {
      const activeRadius = r * (1.0 + Math.sin(core.vitalEnergyWind * 4.0) * 0.15);

      if (boss.phase === 2 && boss.pulsarRadius !== undefined) {
        ctx.restore();
        ctx.save();
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([6, 6]);
        ctx.fillStyle = 'rgba(220, 38, 38, 0.04)';

        ctx.beginPath();
        ctx.arc(boss.x, boss.y, boss.pulsarRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
        ctx.save();
        ctx.translate(boss.x, boss.y);
      }

      const auraGrad = ctx.createRadialGradient(0, 0, activeRadius * 0.4, 0, 0, activeRadius * 1.3);
      auraGrad.addColorStop(0, '#dc2626');
      auraGrad.addColorStop(0.6, 'rgba(239, 68, 68, 0.3)');
      auraGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(0, 0, activeRadius * 1.3, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#0a0518';
      const nodes = 4;
      ctx.beginPath();
      for (let i = 0; i <= nodes; i++) {
        const ang = (i / nodes) * Math.PI * 2 - core.vitalEnergyWind * 0.8;
        const px = Math.cos(ang) * activeRadius;
        const py = Math.sin(ang) * activeRadius;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, activeRadius * 0.25, 0, Math.PI * 2);
      ctx.fill();

    } else if (boss.type === "void_serpent_fragment") {
      ctx.save();
      ctx.rotate(-core.vitalEnergyWind * 1.1);
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4.0;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.06)';

      const lobes = 3;
      ctx.beginPath();
      for (let i = 0; i < lobes * 2; i++) {
        const angle = (i / lobes) * Math.PI;
        const currentR = r * (i % 2 === 0 ? 1.0 : 0.65 + pulse);
        const px = Math.cos(angle) * currentR;
        const py = Math.sin(angle) * currentR;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = '#02000a';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.52, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.save();
      ctx.rotate(core.vitalEnergyWind * 2.0);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const ang = (j / 8) * Math.PI * 2;
        const currentR = r * (j % 2 === 0 ? 0.35 : 0.12);
        const px = Math.cos(ang) * currentR;
        const py = Math.sin(ang) * currentR;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    if (boss.invulnTimer > 0) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 3.0;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(0, 0, r * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }

    // Draw status effect indicators above boss center (Modular 3G HUD)
    if (boss.statusEffects && boss.statusEffects.length > 0) {
      const activeEffects = boss.statusEffects.slice(0, 3);
      const iconSpacing = 10;
      const totalWidth = (activeEffects.length - 1) * iconSpacing;
      let startX = -totalWidth / 2;
      const startY = -r - 18;

      activeEffects.forEach((eff: any) => {
        ctx.save();
        ctx.translate(startX, startY);
        if (eff.type === 'slow') {
          ctx.fillStyle = '#22d3ee';
          ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(0, 1, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (eff.type === 'overheat') {
          ctx.fillStyle = '#f97316';
          ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(0, -4);
          ctx.lineTo(2.5, 2.5);
          ctx.lineTo(-2.5, 2.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        } else if (eff.type === 'solar_mark') {
          ctx.fillStyle = '#ffd166';
          ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(0, 0, 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(-2.5, 0);
          ctx.lineTo(2.5, 0);
          ctx.stroke();
        }
        ctx.restore();
        startX += iconSpacing;
      });
    }

    ctx.restore();
  };

  const drawOrbiDimensionalRiftPortal = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    timer: number,
    duration: number,
    enemyColor?: string
  ) => {
    const progress = 1.0 - Math.max(0, Math.min(1, timer / duration));
    const mainColor = enemyColor || '#a855f7';
    const portalCyan = '#22d3ee';
    const coreColor = '#03000a';

    ctx.save();

    const blurRadius = radius * (1.2 + Math.sin(progress * Math.PI) * 1.5);
    const bgGrad = ctx.createRadialGradient(x, y, 1, x, y, blurRadius);
    bgGrad.addColorStop(0, 'rgba(3, 0, 10, 0.85)');
    bgGrad.addColorStop(0.4, 'rgba(124, 58, 237, 0.25)');
    bgGrad.addColorStop(0.7, 'rgba(34, 211, 238, 0.12)');
    bgGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.arc(x, y, blurRadius, 0, Math.PI * 2);
    ctx.fill();

    if (progress <= 0.35) {
      const p = progress / 0.35;
      const currentRadius = radius * 0.4 * p;
      const rotation = p * Math.PI * 2;

      ctx.translate(x, y);
      ctx.rotate(rotation);

      ctx.strokeStyle = portalCyan;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = portalCyan;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(-currentRadius * 1.5, 0);
      ctx.bezierCurveTo(-currentRadius * 0.5, -4, currentRadius * 0.5, 4, currentRadius * 1.5, 0);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
      ctx.lineWidth = 1.0;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI / 2) + p * 0.5;
        const startR = radius * (2.2 - p * 1.2);
        const endR = radius * 0.2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR);
        ctx.lineTo(Math.cos(angle) * endR, Math.sin(angle) * endR);
        ctx.stroke();
      }
    } else if (progress <= 0.75) {
      const p = (progress - 0.35) / 0.40;
      const portalRadius = radius * (0.4 + 1.2 * Math.sin(p * Math.PI * 0.5));
      const rotation = (0.35 * Math.PI * 2) + p * Math.PI * 1.5;

      ctx.translate(x, y);
      ctx.rotate(rotation);

      const vortex = ctx.createRadialGradient(0, 0, portalRadius * 0.2, 0, 0, portalRadius);
      vortex.addColorStop(0, coreColor);
      vortex.addColorStop(0.5, 'rgba(124, 58, 237, 0.85)');
      vortex.addColorStop(0.85, portalCyan);
      vortex.addColorStop(1, 'transparent');

      ctx.fillStyle = vortex;
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = mainColor;
      ctx.lineWidth = 2.0 + Math.sin(Date.now() * 0.02) * 1.0;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, portalRadius * 0.95, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = portalCyan;
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 3; i++) {
        const startAngle = (i * Math.PI * 2 / 3);
        ctx.beginPath();
        ctx.arc(0, 0, portalRadius * 1.1, startAngle, startAngle + 0.6);
        ctx.stroke();
      }
    } else {
      const p = (progress - 0.75) / 0.25;
      const fadeOutPortal = 1.0 - p;
      const portalRadius = radius * 1.6 * fadeOutPortal;

      if (portalRadius > 0.5) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(-p * Math.PI);
        const vortex = ctx.createRadialGradient(0, 0, portalRadius * 0.1, 0, 0, portalRadius);
        vortex.addColorStop(0, coreColor);
        vortex.addColorStop(0.6, 'rgba(124, 58, 237, 0.5)');
        vortex.addColorStop(1, 'transparent');
        ctx.fillStyle = vortex;
        ctx.beginPath();
        ctx.arc(0, 0, portalRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.translate(x, y);
      
      const flashRadius = radius * (0.8 + 1.5 * p);
      const flashGrad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, flashRadius);
      flashGrad.addColorStop(0, 'rgba(255, 255, 255, ' + (0.9 * (1.0 - p)) + ')');
      flashGrad.addColorStop(0.3, 'rgba(34, 211, 238, ' + (0.6 * (1.0 - p)) + ')');
      flashGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = flashGrad;
      ctx.beginPath();
      ctx.arc(0, 0, flashRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalAlpha = p;
      ctx.shadowColor = mainColor;
      ctx.shadowBlur = 10;
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  const drawSerpentEnemy = (ctx: CanvasRenderingContext2D, enemy: any) => {
    const core = stateRef.current;
    if (!core) return;
    const arch: SerpentEnemyArchetype = enemy.archetype || 'baby_serpent';
    const radius = enemy.radius;

    if (arch === 'rest_beacon' || enemy.type === 'REST_BEACON') {
      const hX = enemy.x;
      const hY = enemy.y + Math.sin(Date.now() * 0.002) * 5; // gentle floating motion

      ctx.save();
      // 1. Massive cyan sanctuary aura
      const sanctuaryGrad = ctx.createRadialGradient(hX, hY, 2, hX, hY, radius * 3.0);
      sanctuaryGrad.addColorStop(0, 'rgba(34, 211, 238, 0.35)');
      sanctuaryGrad.addColorStop(0.3, 'rgba(14, 165, 233, 0.15)');
      sanctuaryGrad.addColorStop(0.7, 'rgba(34, 211, 238, 0.04)');
      sanctuaryGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = sanctuaryGrad;
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 3.0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Beautiful rotating external bracket rings (gives it a high-tech sanctuary look)
      const rotAngle = (Date.now() / 1500) * Math.PI;
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.65)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 1.35, rotAngle, rotAngle + Math.PI * 0.45);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 1.35, rotAngle + Math.PI, rotAngle + Math.PI * 1.45);
      ctx.stroke();

      const rotAngle2 = -(Date.now() / 1100) * Math.PI;
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 1.6, rotAngle2, rotAngle2 + Math.PI * 0.3);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 1.6, rotAngle2 + Math.PI, rotAngle2 + Math.PI * 1.3);
      ctx.stroke();

      // 3. Central temple altar shape (a solid crystalline core with nice borders)
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3.0;
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      for (let j = 0; j < 8; j++) {
        const ang = (j / 8) * Math.PI * 2 + rotAngle * 0.15;
        const px = hX + Math.cos(ang) * radius;
        const py = hY + Math.sin(ang) * radius;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 4. White-hot central spark core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 0.45, 0, Math.PI * 2);
      ctx.fill();

      // Inner cyan core flare
      ctx.fillStyle = '#22d3ee';
      ctx.beginPath();
      ctx.arc(hX, hY, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();

      // Gentle pulse indicator text "ALTAR" in JetBrains Mono
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText("NEXUS SANCTUARY", hX, hY - radius - 15);

      ctx.restore();
      return;
    }

    const bodyColor = enemy.color || '#ff5a6b';
    const accentColor = enemy.accentColor || '#ffb0b7';
    const glowColor = enemy.glowColor || '#8a1d2c';

    ctx.save();

    // Handle void serpentling phasing opacity
    if (arch === 'void_serpentling' && enemy.alpha !== undefined) {
      ctx.globalAlpha = enemy.alpha;
    }

    // --- AURA BLACKOUT HOSTIL ---
    const glowRadius = radius * 2.2;
    const enemyGrad = ctx.createRadialGradient(enemy.x, enemy.y, 1, enemy.x, enemy.y, glowRadius);
    enemyGrad.addColorStop(0, glowColor);
    enemyGrad.addColorStop(0.4, 'rgba(10, 5, 24, 0.4)');
    enemyGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = enemyGrad;
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // --- ENEMY COMBAT ATTACK TELEGRAPHS (QA Checkpoint 3.1) ---
    if (arch === 'spitter_serpent') {
      const dx = core.player.x - enemy.x;
      const dy = core.player.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < 500) {
        const angle = Math.atan2(dy, dx);
        const chargeProgress = enemy.shootCooldown <= 50 ? (1.0 - enemy.shootCooldown / 50) : 0;

        ctx.save();
        // Directional telegraph line to player head
        ctx.strokeStyle = `rgba(255, 61, 61, ${0.15 + chargeProgress * 0.45})`;
        ctx.lineWidth = 1.5 + chargeProgress * 1.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.moveTo(enemy.x, enemy.y);
        ctx.lineTo(enemy.x + Math.cos(angle) * Math.min(dist, 320), enemy.y + Math.sin(angle) * Math.min(dist, 320));
        ctx.stroke();
        ctx.setLineDash([]);

        // Small warning circle at max reach/player head
        if (chargeProgress > 0) {
          ctx.strokeStyle = '#ff3d3d';
          ctx.fillStyle = `rgba(255, 61, 61, ${chargeProgress * 0.15})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(enemy.x + Math.cos(angle) * Math.min(dist, 320), enemy.y + Math.sin(angle) * Math.min(dist, 320), 25 * chargeProgress, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    if (arch === 'twin_head_serpent') {
      const dx = core.player.x - enemy.x;
      const dy = core.player.y - enemy.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 0 && dist < 480) {
        const baseAngle = Math.atan2(dy, dx);
        const chargeProgress = enemy.shootCooldown <= 50 ? (1.0 - enemy.shootCooldown / 50) : 0;

        ctx.save();
        ctx.strokeStyle = `rgba(255, 138, 71, ${0.12 + chargeProgress * 0.43})`;
        ctx.lineWidth = 1.2 + chargeProgress * 1.3;
        ctx.setLineDash([6, 5]);

        // Twin fork angled lasers
        [-0.15, 0.15].forEach((offset) => {
          const ang = baseAngle + offset;
          ctx.beginPath();
          ctx.moveTo(enemy.x, enemy.y);
          ctx.lineTo(enemy.x + Math.cos(ang) * Math.min(dist, 280), enemy.y + Math.sin(ang) * Math.min(dist, 280));
          ctx.stroke();
        });
        ctx.setLineDash([]);

        // Circular warning dome around the twin head serpent
        ctx.strokeStyle = `rgba(255, 138, 71, ${0.1 + chargeProgress * 0.25})`;
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, 65, 0, Math.PI * 2);
        ctx.stroke();
        if (chargeProgress > 0) {
          ctx.fillStyle = `rgba(255, 138, 71, ${chargeProgress * 0.08})`;
          ctx.beginPath();
          ctx.arc(enemy.x, enemy.y, 65, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    // --- RENDER SEGMENTS (from tail to neck/head) ---
    if (enemy.segments && enemy.segments.length > 1) {
      for (let i = enemy.segments.length - 1; i > 0; --i) {
        const seg = enemy.segments[i];
        const nextSeg = enemy.segments[i - 1];
        
        // Taper segment size from head to tail
        const progress = i / enemy.segments.length; // 0 near head, 1 near tail
        const segRadius = radius * (0.88 - progress * 0.45);

        // Segment fill and stroke
        ctx.fillStyle = '#0a0518';
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2.0;

        // Custom segment styles by archetype
        if (arch === 'armored_serpent') {
          // Draw armor plating rings/plates around segments
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius * 1.35, 0, Math.PI * 2);
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.fillStyle = glowColor;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
          ctx.fill();
        } else if (arch === 'void_serpentling') {
          // Hollow ring segments
          ctx.fillStyle = 'rgba(36, 0, 74, 0.2)';
          ctx.strokeStyle = glowColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Core point
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (arch === 'splitter_serpent') {
          // Draw separate energy sparks in between segments
          const midX = (seg.x + nextSeg.x) / 2;
          const midY = (seg.y + nextSeg.y) / 2;
          ctx.fillStyle = accentColor;
          ctx.beginPath();
          ctx.arc(midX, midY, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = bodyColor;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
          ctx.stroke();
        } else if (arch === 'crawler_serpent') {
          // Crawler spikes / legs
          const dx = nextSeg.x - seg.x;
          const dy = nextSeg.y - seg.y;
          const angle = Math.atan2(dy, dx) + Math.PI / 2;

          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          // left spike
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(seg.x + Math.cos(angle) * (segRadius * 1.5), seg.y + Math.sin(angle) * (segRadius * 1.5));
          // right spike
          ctx.moveTo(seg.x, seg.y);
          ctx.lineTo(seg.x - Math.cos(angle) * (segRadius * 1.5), seg.y - Math.sin(angle) * (segRadius * 1.5));
          ctx.stroke();

          ctx.fillStyle = '#0a0518';
          ctx.strokeStyle = bodyColor;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          // standard / baby_serpent / twin_head_serpent / spitter_serpent segment
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, segRadius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // --- RENDER GLOWING HEAD ---
    const headX = enemy.x;
    const headY = enemy.y;

    ctx.fillStyle = '#0a0518';
    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2.5;

    if (arch === 'armored_serpent') {
      // Hexagonal armored head
      ctx.beginPath();
      for (let j = 0; j < 6; j++) {
        const ang = (j / 6) * Math.PI * 2 + core.vitalEnergyWind * 0.2;
        const px = headX + Math.cos(ang) * radius;
        const py = headY + Math.sin(ang) * radius;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Armored front plate
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(headX, headY, radius * 0.35, 0, Math.PI * 2);
      ctx.fill();

    } else if (arch === 'twin_head_serpent') {
      // Draw twin heads! One slightly angled left, one right.
      const dx = (enemy.segments && enemy.segments.length > 1) ? (enemy.x - enemy.segments[1].x) : 0;
      const dy = (enemy.segments && enemy.segments.length > 1) ? (enemy.y - enemy.segments[1].y) : 0;
      const baseAngle = (dx === 0 && dy === 0) ? core.vitalEnergyWind : Math.atan2(dy, dx);

      [-0.32, 0.32].forEach((offsetAngle) => {
        const hAngle = baseAngle + offsetAngle;
        const hx = headX + Math.cos(hAngle) * (radius * 0.6);
        const hy = headY + Math.sin(hAngle) * (radius * 0.6);
        const hr = radius * 0.75;

        ctx.fillStyle = '#0a0518';
        ctx.strokeStyle = bodyColor;
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        ctx.arc(hx, hy, hr, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Little glowing slit eye in each head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(hx + Math.cos(hAngle) * (hr * 0.3), hy + Math.sin(hAngle) * (hr * 0.3), 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

    } else if (arch === 'spitter_serpent') {
      // Prominent triangular firing snout head
      const dx = (enemy.segments && enemy.segments.length > 1) ? (enemy.x - enemy.segments[1].x) : 0;
      const dy = (enemy.segments && enemy.segments.length > 1) ? (enemy.y - enemy.segments[1].y) : 0;
      const angle = (dx === 0 && dy === 0) ? core.vitalEnergyWind : Math.atan2(dy, dx);

      ctx.beginPath();
      ctx.moveTo(headX + Math.cos(angle) * (radius * 1.4), headY + Math.sin(angle) * (radius * 1.4));
      ctx.lineTo(headX + Math.cos(angle + 2.1) * radius, headY + Math.sin(angle + 2.1) * radius);
      ctx.lineTo(headX + Math.cos(angle - 2.1) * radius, headY + Math.sin(angle - 2.1) * radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Pulsing weapon core mouth
      const mouthSize = radius * (0.35 + Math.sin(core.vitalEnergyWind * 6.0) * 0.1);
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(headX + Math.cos(angle) * (radius * 0.4), headY + Math.sin(angle) * (radius * 0.4), mouthSize, 0, Math.PI * 2);
      ctx.fill();

    } else if (arch === 'void_serpentling') {
      // Corrupt diamond head with empty central void
      const dx = (enemy.segments && enemy.segments.length > 1) ? (enemy.x - enemy.segments[1].x) : 0;
      const dy = (enemy.segments && enemy.segments.length > 1) ? (enemy.y - enemy.segments[1].y) : 0;
      const angle = (dx === 0 && dy === 0) ? core.vitalEnergyWind : Math.atan2(dy, dx);

      ctx.beginPath();
      ctx.moveTo(headX + Math.cos(angle) * (radius * 1.25), headY + Math.sin(angle) * (radius * 1.25));
      ctx.lineTo(headX + Math.cos(angle + Math.PI / 2) * radius, headY + Math.sin(angle + Math.PI / 2) * radius);
      ctx.lineTo(headX - Math.cos(angle) * (radius * 0.8), headY - Math.sin(angle) * (radius * 0.8));
      ctx.lineTo(headX + Math.cos(angle - Math.PI / 2) * radius, headY + Math.sin(angle - Math.PI / 2) * radius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Void core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(headX, headY, radius * 0.3, 0, Math.PI * 2);
      ctx.stroke();

    } else {
      // standard / baby_serpent / crawler_serpent sleek circular head
      ctx.beginPath();
      ctx.arc(headX, headY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Slit glowing eyes
      const dx = (enemy.segments && enemy.segments.length > 1) ? (enemy.x - enemy.segments[1].x) : 0;
      const dy = (enemy.segments && enemy.segments.length > 1) ? (enemy.y - enemy.segments[1].y) : 0;
      const angle = (dx === 0 && dy === 0) ? core.vitalEnergyWind : Math.atan2(dy, dx);

      // Draw two glowing slashes representing eyes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      [-0.4, 0.4].forEach((offsetAngle) => {
        const eyeAngle = angle + offsetAngle;
        const ex = headX + Math.cos(eyeAngle) * (radius * 0.5);
        const ey = headY + Math.sin(eyeAngle) * (radius * 0.5);
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + Math.cos(angle) * 3, ey + Math.sin(angle) * 3);
        ctx.stroke();
      });
    }

    // Draw status effect indicators above enemy head (Modular 3G HUD)
    if (enemy.statusEffects && enemy.statusEffects.length > 0) {
      const activeEffects = enemy.statusEffects.slice(0, 3); // Max 3
      const iconSpacing = 8;
      const totalWidth = (activeEffects.length - 1) * iconSpacing;
      let startX = enemy.x - totalWidth / 2;
      const startY = enemy.y - radius - 12;

      activeEffects.forEach((eff: any) => {
        ctx.save();
        if (core.lowEffectsMode) {
          ctx.beginPath();
          ctx.arc(startX, startY, 2, 0, Math.PI * 2);
          if (eff.type === 'slow') ctx.fillStyle = '#22d3ee';
          else if (eff.type === 'overheat') ctx.fillStyle = '#f97316';
          else if (eff.type === 'solar_mark') ctx.fillStyle = '#ffd166';
          else ctx.fillStyle = '#ffffff';
          ctx.fill();
        } else {
          ctx.translate(startX, startY);
          if (eff.type === 'slow') {
            ctx.fillStyle = '#22d3ee';
            ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(0, 1, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          } else if (eff.type === 'overheat') {
            ctx.fillStyle = '#f97316';
            ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.moveTo(0, -3);
            ctx.lineTo(2, 2);
            ctx.lineTo(-2, 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else if (eff.type === 'solar_mark') {
            ctx.fillStyle = '#ffd166';
            ctx.strokeStyle = 'rgba(3, 7, 18, 0.6)';
            ctx.lineWidth = 1.0;
            ctx.beginPath();
            ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(0, 0, 1, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(-2, 0);
            ctx.lineTo(2, 0);
            ctx.stroke();
          }
        }
        ctx.restore();
        startX += iconSpacing;
      });
    }

    ctx.restore();
  };

  const updateNexusAssault = (dt: number) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    // Handle delayed combat start after countdownComplete is true
    if (!core.assaultRun.combatStarted) {
      if (core.assaultRun.countdownComplete) {
        if (core.assaultRun.enemySpawnDelayAfterCountdown === undefined) {
          core.assaultRun.enemySpawnDelayAfterCountdown = 60;
        }
        core.assaultRun.enemySpawnDelayAfterCountdown -= 1 * dt;
        if (core.assaultRun.enemySpawnDelayAfterCountdown <= 0) {
          core.assaultRun.combatStarted = true;
          // Spawn enemies with portal spawn effects now!
          core.assaultRun.enemies = core.assaultRun.queuedEnemies || [];
          core.assaultRun.queuedEnemies = [];
          
          // Set portal duration on them
          core.assaultRun.enemies.forEach((e: any) => {
            e.spawnPortalTimer = 70;
            e.spawnPortalDuration = 70;
          });

          // Play beautiful start chime
          triggerAudioSign('Conexión Resumida', 'evolve');
          triggerAudioSign('Grieta Dimensional', 'rift_spawn');
        }
      }
      
      // Update basic status systems but do not update enemies or auto-fire
      updateAssaultEnergyPickups(dt);
      updateAssaultStatusEffects(dt);
      updateAssaultAreaEffects(dt);
      return;
    }

    // Run the high-precision state machine update first
    updateNexusAssaultFlow(dt);

    // If we are currently in upgrade selection or transition next room, freeze gameplay logic
    const status = core.assaultRun.run?.status || 'combat';
    if (status === 'upgrade_selection' || status === 'transition_next_room') {
      return;
    }

    updateAssaultEnergyPickups(dt);
    updateAssaultStatusEffects(dt);
    updateAssaultAreaEffects(dt);

    const boxMin = 1425 - (NEXUS_ASSAULT_ARENA_RADIUS + 20);
    const boxMax = 1425 + (NEXUS_ASSAULT_ARENA_RADIUS + 20);

    core.assaultRun.enemies.forEach((enemy: any) => {
      if (enemy.spawnPortalTimer !== undefined && enemy.spawnPortalTimer > 0) {
        enemy.spawnPortalTimer -= 1 * dt;
        enemy.vx = 0;
        enemy.vy = 0;
        return;
      }
      const shape = core.assaultRun.room?.shape || 'RECTANGLE';
      const enemyRes = constrainPointToRoom(enemy.x, enemy.y, shape, 730 - enemy.radius);
      enemy.x = enemyRes.x;
      enemy.y = enemyRes.y;
      if (enemyRes.hitWall) {
        if (enemy.type === 'DRONE') {
          const limit = NEXUS_ASSAULT_ARENA_RADIUS - enemy.radius;
          if (enemy.x <= 1425 - limit || enemy.x >= 1425 + limit) {
            enemy.vx *= -1;
          }
          if (enemy.y <= 1425 - limit || enemy.y >= 1425 + limit) {
            enemy.vy *= -1;
          }
        } else {
          enemy.vx *= -0.5;
          enemy.vy *= -0.5;
        }
      }

      let speedMult = 1.0;
      if (enemy.slowedUntil && enemy.slowedUntil > Date.now()) {
        speedMult = 0.45;
      }
      speedMult *= getEnemySpeedMultiplierFromStatus(enemy);

      if (enemy.isBoss) {
        updateNexusAssaultBoss(enemy, dt);
      } else {
        // Resolve Archetype fallback if not set
        if (!enemy.archetype) {
          if (enemy.type === 'WISP') {
            applyEnemyArchetype(enemy, 'baby_serpent');
          } else if (enemy.type === 'DRONE') {
            applyEnemyArchetype(enemy, 'armored_serpent');
          } else if (enemy.type === 'SPITTER') {
            applyEnemyArchetype(enemy, 'spitter_serpent');
          } else {
            applyEnemyArchetype(enemy, 'baby_serpent');
          }
        }

        const arch: SerpentEnemyArchetype = enemy.archetype;
        const dx = core.player.x - enemy.x;
        const dy = core.player.y - enemy.y;
        const dist = Math.hypot(dx, dy);

        // --- MOVEMENT STYLE & VELOCITY CALCULATIONS ---
        if (arch === 'baby_serpent') {
          // FAST SLITHER toward player head with micro sinuous wave
          const speed = 2.4 * speedMult;
          const sinWave = Math.sin(core.vitalEnergyWind * 6.0) * 0.45;
          if (dist > 0) {
            const tx = (dx / dist) * speed;
            const ty = (dy / dist) * speed;
            enemy.vx = tx - ty * sinWave;
            enemy.vy = ty + tx * sinWave;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          // Contact attack
          if (dist < enemy.radius + 22) {
            enemy.health = 0;
            hurtAssaultPlayer(12, "head");
            triggerBurstSparks(enemy.x, enemy.y, '#f43f5e', 'BLACKOUT_SMOKE', 15);
            triggerAudioSign('Fuga de plasma', 'blackout');
            core.camera.shakeTime = 8;
            core.camera.shakeIntensity = 5;
          }

        } else if (arch === 'crawler_serpent') {
          // CONSTANT GROUND SLITHER with larger wave amplitude
          const speed = 1.7 * speedMult;
          const sinWave = Math.sin(core.vitalEnergyWind * 4.0) * 0.7;
          if (dist > 0) {
            const tx = (dx / dist) * speed;
            const ty = (dy / dist) * speed;
            enemy.vx = tx - ty * sinWave;
            enemy.vy = ty + tx * sinWave;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          // Contact or short spit
          if (dist < enemy.radius + 22) {
            enemy.health = 0;
            hurtAssaultPlayer(9, "head");
            triggerBurstSparks(enemy.x, enemy.y, enemy.color, 'BLACKOUT_SMOKE', 12);
            core.camera.shakeTime = 6;
            core.camera.shakeIntensity = 4;
          }

        } else if (arch === 'void_serpentling') {
          // PHASE SLITHER (frequent fast micro-bursts, then slow down and turn transparent)
          if (enemy.phaseTimer === undefined) enemy.phaseTimer = Math.random() * 50;
          enemy.phaseTimer += dt;
          const isPhasing = Math.sin(enemy.phaseTimer * 0.08) > 0.25;
          enemy.alpha = isPhasing ? 0.35 : 1.0;

          const speed = (isPhasing ? 0.55 : 2.5) * speedMult;
          if (dist > 0) {
            enemy.vx = (dx / dist) * speed;
            enemy.vy = (dy / dist) * speed;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          // Contact attack
          if (dist < enemy.radius + 22) {
            enemy.health = 0;
            hurtAssaultPlayer(15, "head");
            triggerBurstSparks(enemy.x, enemy.y, '#7a00ff', 'BLACKOUT_SMOKE', 16);
            triggerAudioSign('Fuga de plasma', 'blackout');
            core.camera.shakeTime = 8;
            core.camera.shakeIntensity = 5;
          }

          // Shoots slow corruption orb
          const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);
          enemy.shootCooldown -= 1 * dt * diff.fireRateMultiplier;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 180 + Math.random() * 90;
            if (dist > 0 && dist < 500) {
              const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, core.assaultRun.roomType ?? 'normal');
              if ((core.assaultRun.projectiles ?? []).length < budget) {
                core.assaultRun.projectiles.push({
                  id: 'void_proj_' + Date.now() + '_' + Math.random(),
                  x: enemy.x,
                  y: enemy.y,
                  vx: (dx / dist) * 2.8 * diff.projectileSpeedMultiplier,
                  vy: (dy / dist) * 2.8 * diff.projectileSpeedMultiplier,
                  radius: 7,
                  damage: 13,
                  color: '#7a00ff',
                  isEnemy: true,
                  type: 'ENEMY_SPIT'
                });
                triggerBurstSparks(enemy.x, enemy.y, '#7a00ff', 'TAIL_SPARK', 4);
              }
            }
          }

        } else if (arch === 'armored_serpent') {
          // HEAVY SLOW SLIDE
          const speed = 0.8 * speedMult;
          if (dist > 0) {
            enemy.vx = (dx / dist) * speed;
            enemy.vy = (dy / dist) * speed;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          if (enemy.x < boxMin + 20 || enemy.x > boxMax - 20) { enemy.vx *= -1; }
          if (enemy.y < boxMin + 20 || enemy.y > boxMax - 20) { enemy.vy *= -1; }

          // SLOW SHOT heavy glob
          const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);
          enemy.shootCooldown -= 1 * dt * diff.fireRateMultiplier;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 200 + Math.random() * 80;
            if (dist > 0 && dist < 520) {
              const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, core.assaultRun.roomType ?? 'normal');
              if ((core.assaultRun.projectiles ?? []).length < budget) {
                core.assaultRun.projectiles.push({
                  id: 'armored_proj_' + Date.now() + '_' + Math.random(),
                  x: enemy.x,
                  y: enemy.y,
                  vx: (dx / dist) * 3.2 * diff.projectileSpeedMultiplier,
                  vy: (dy / dist) * 3.2 * diff.projectileSpeedMultiplier,
                  radius: 8.5,
                  damage: 18,
                  color: '#6d4aff',
                  isEnemy: true,
                  type: 'ENEMY_SPIT'
                });
                triggerBurstSparks(enemy.x, enemy.y, '#6d4aff', 'TAIL_SPARK', 5);
              }
            }
          }

        } else if (arch === 'twin_head_serpent') {
          // FORKED PURSUIT (snakes and tracks tightly)
          const speed = 1.7 * speedMult;
          if (dist > 0) {
            enemy.vx = (dx / dist) * speed;
            enemy.vy = (dy / dist) * speed;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          if (enemy.x < boxMin + 20 || enemy.x > boxMax - 20) { enemy.vx *= -1; }
          if (enemy.y < boxMin + 20 || enemy.y > boxMax - 20) { enemy.vy *= -1; }

          // DOUBLE SHOT
          const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);
          enemy.shootCooldown -= 1 * dt * diff.fireRateMultiplier;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 130 + Math.random() * 60;
            if (dist > 0 && dist < 480) {
              const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, core.assaultRun.roomType ?? 'normal');
              if ((core.assaultRun.projectiles ?? []).length < budget) {
                const baseAngle = Math.atan2(dy, dx);
                [-0.15, 0.15].forEach((offset) => {
                  const ang = baseAngle + offset;
                  core.assaultRun.projectiles.push({
                    id: 'twin_proj_' + Date.now() + '_' + Math.random(),
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(ang) * 4.3 * diff.projectileSpeedMultiplier,
                    vy: Math.sin(ang) * 4.3 * diff.projectileSpeedMultiplier,
                    radius: 5,
                    damage: 11,
                    color: '#ff8a47',
                    isEnemy: true,
                    type: 'ENEMY_SPIT'
                  });
                });
                triggerBurstSparks(enemy.x, enemy.y, '#ff8a47', 'TAIL_SPARK', 6);
              }
            }
          }

        } else if (arch === 'splitter_serpent') {
          // ERRATIC CURVE
          if (enemy.erraticTimer === undefined) enemy.erraticTimer = Math.random() * 100;
          enemy.erraticTimer += dt * 0.06;
          
          const speed = 1.4 * speedMult;
          if (dist > 0) {
            const baseVx = (dx / dist) * speed;
            const baseVy = (dy / dist) * speed;
            const perpVx = -baseVy * Math.sin(enemy.erraticTimer) * 0.9;
            const perpVy = baseVx * Math.sin(enemy.erraticTimer) * 0.9;
            enemy.vx = baseVx + perpVx;
            enemy.vy = baseVy + perpVy;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          if (enemy.x < boxMin + 20 || enemy.x > boxMax - 20) { enemy.vx *= -1; }
          if (enemy.y < boxMin + 20 || enemy.y > boxMax - 20) { enemy.vy *= -1; }

          // FRAGMENT SHOT
          const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);
          enemy.shootCooldown -= 1 * dt * diff.fireRateMultiplier;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 150 + Math.random() * 70;
            if (dist > 0 && dist < 450) {
              const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, core.assaultRun.roomType ?? 'normal');
              if ((core.assaultRun.projectiles ?? []).length < budget) {
                const baseAngle = Math.atan2(dy, dx);
                [-0.22, 0.22].forEach((offset) => {
                  const ang = baseAngle + offset;
                  core.assaultRun.projectiles.push({
                    id: 'splitter_proj_' + Date.now() + '_' + Math.random(),
                    x: enemy.x,
                    y: enemy.y,
                    vx: Math.cos(ang) * 3.8 * diff.projectileSpeedMultiplier,
                    vy: Math.sin(ang) * 3.8 * diff.projectileSpeedMultiplier,
                    radius: 5,
                    damage: 10,
                    color: '#c93cff',
                    isEnemy: true,
                    type: 'ENEMY_SPIT'
                  });
                });
                triggerBurstSparks(enemy.x, enemy.y, '#c93cff', 'TAIL_SPARK', 4);
              }
            }
          }

        } else if (arch === 'spitter_serpent') {
          // KEEP DISTANCE: backs away if player is too close, stays at comfortable sniping range
          const speed = 1.2 * speedMult;
          if (dist < 260 && dist > 0) {
            enemy.vx = -(dx / dist) * speed;
            enemy.vy = -(dy / dist) * speed;
          } else if (dist > 380 && dist > 0) {
            enemy.vx = (dx / dist) * 0.7 * speed;
            enemy.vy = (dy / dist) * 0.7 * speed;
          } else if (dist > 0) {
            enemy.vx = -(dy / dist) * 0.9 * speed;
            enemy.vy = (dx / dist) * 0.9 * speed;
          }
          enemy.x += enemy.vx * dt;
          enemy.y += enemy.vy * dt;

          if (enemy.x < boxMin + 20 || enemy.x > boxMax - 20) { enemy.vx *= -1; }
          if (enemy.y < boxMin + 20 || enemy.y > boxMax - 20) { enemy.vy *= -1; }

          // AIMED SHOT
          const diff = getNexusAssaultRoomDifficulty(core.assaultRun.roomIndex ?? 1);
          enemy.shootCooldown -= 1 * dt * diff.fireRateMultiplier;
          if (enemy.shootCooldown <= 0) {
            enemy.shootCooldown = 160 + Math.random() * 50;
            if (dist > 0 && dist < 480) {
              const budget = getEnemyProjectileBudget(core.assaultRun.roomIndex ?? 1, core.assaultRun.roomType ?? 'normal');
              if ((core.assaultRun.projectiles ?? []).length < budget) {
                core.assaultRun.projectiles.push({
                  id: 'spitter_proj_' + Date.now() + '_' + Math.random(),
                  x: enemy.x,
                  y: enemy.y,
                  vx: (dx / dist) * 4.6 * diff.projectileSpeedMultiplier,
                  vy: (dy / dist) * 4.6 * diff.projectileSpeedMultiplier,
                  radius: 6,
                  damage: 13,
                  color: '#ff3d3d',
                  isEnemy: true,
                  type: 'ENEMY_SPIT'
                });
                triggerBurstSparks(enemy.x, enemy.y, '#ff3d3d', 'TAIL_SPARK', 4);
              }
            }
          }
        } else if (arch === 'rest_beacon' || enemy.type === 'REST_BEACON') {
          // NO MOVEMENT
          enemy.vx = 0;
          enemy.vy = 0;

          const auraRadius = 180; // beautiful generous aura size
          if (dist < auraRadius) {
            // Stay near to purify!
            const dtSeconds = dt > 0.15 ? dt * 0.01667 : dt;
            const purifySpeed = 40; // 2.5 seconds to fully purify (40% per second)
            enemy.health = Math.max(0, enemy.health - purifySpeed * dtSeconds);

            // Healing tick to player while purifying: +12 HP per second
            const healTick = 12 * dtSeconds;
            core.assaultRun.hp = Math.min(core.assaultRun.maxHp, core.assaultRun.hp + healTick);
            setAssaultRunHp(Math.floor(core.assaultRun.hp));

            // Spawn lovely cyan sparks flowing from the beacon to the player head
            if (Math.random() < 0.25) {
              const sparkAngle = Math.random() * Math.PI * 2;
              const sx = enemy.x + Math.cos(sparkAngle) * (Math.random() * 40);
              const sy = enemy.y + Math.sin(sparkAngle) * (Math.random() * 40);
              triggerAbilityParticleBurst(sx, sy, '#22d3ee', 2);
            }

            // Show floating text occasionally
            if (Math.random() < 0.05) {
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: enemy.x + (Math.random() - 0.5) * 40,
                y: enemy.y - 40,
                text: `PURIFICANDO SANCTUARIO... ${Math.round(100 - enemy.health)}%`,
                color: '#22d3ee',
                life: 0.8,
                size: 11
              });
            }
          }

          if (enemy.health <= 0) {
            onAssaultEnemyKilled(enemy);
            triggerBurstSparks(enemy.x, enemy.y, '#ffffff', 'EVOLUTION_EXPLOSION', 25);
          }
        }

        // --- PROC-SNAKE SEGMENTS SYNCHRONIZATION ---
        if (enemy.segments) {
          if (enemy.segments.length === 0) {
            const segCount = enemy.maxSegments || 3;
            for (let s = 0; s < segCount; ++s) {
              enemy.segments.push({ x: enemy.x, y: enemy.y });
            }
          }
          enemy.segments[0] = { x: enemy.x, y: enemy.y };
          const spacing = enemy.radius * 0.82;
          for (let i = 1; i < enemy.segments.length; ++i) {
            const prev = enemy.segments[i - 1];
            const curr = enemy.segments[i];
            const dSegX = curr.x - prev.x;
            const dSegY = curr.y - prev.y;
            const dSegDist = Math.hypot(dSegX, dSegY);
            if (dSegDist > spacing) {
              const ang = Math.atan2(dSegY, dSegX);
              curr.x = prev.x + Math.cos(ang) * spacing;
              curr.y = prev.y + Math.sin(ang) * spacing;
            }
          }
        }
      }

      // Offensive Tail Strike (Daño y empuje de cola)
      if (enemy.health > 0 && enemy.archetype !== 'rest_beacon' && enemy.type !== 'REST_BEACON' && !(enemy.spawnPortalTimer && enemy.spawnPortalTimer > 0)) {
        const tailPos = getAssaultTailPoint();
        if (tailPos) {
          const tailRadius = getAssaultTailHitRadius();
          const distToTail = Math.hypot(enemy.x - tailPos.x, enemy.y - tailPos.y);
          if (distToTail < enemy.radius + tailRadius) {
            if (!enemy.lastTailHitTime || enemy.lastTailHitTime < Date.now()) {
              let rawCooldown = 320; // 0.32s base for normal enemies
              let dmgMultiplier = 1.0;
              if (enemy.isBoss) {
                rawCooldown = 650; // 0.65s for bosses
                dmgMultiplier = 0.38;
              } else if (enemy.isElite) {
                rawCooldown = 480; // 0.48s for elites
                dmgMultiplier = 0.65;
              }

              const baseCooldown = rawCooldown * (core.assaultRun.tailCooldownMultiplier ?? 1.0);
              enemy.lastTailHitTime = Date.now() + baseCooldown;
              
              // Overheat tracking
              if (!core.assaultRun.tailStrikeTimestamps) {
                core.assaultRun.tailStrikeTimestamps = [];
              }
              const now = Date.now();
              core.assaultRun.tailStrikeTimestamps = core.assaultRun.tailStrikeTimestamps.filter((t: number) => now - t < 3000);
              core.assaultRun.tailStrikeTimestamps.push(now);
              
              if (core.assaultRun.tailStrikeTimestamps.length >= 6) {
                core.assaultRun.tailOverheatTime = now + 4000; // 4s cooldown penalty
                triggerAudioSign('SOBRECALENTAMIENTO COLA', 'blackout');
                core.floatingTexts.push({
                  id: 'overheat_' + Math.random(),
                  x: tailPos.x,
                  y: tailPos.y - 40,
                  text: 'COLA SOBRECALENTADA (DMG -25%)',
                  color: '#f43f5e',
                  life: 1.5,
                  maxLife: 1.5,
                  size: 16
                });
              }

              const tailDamage = Math.round(getAssaultTailStrikeDamage() * dmgMultiplier);
              if (enemy.invulnTimer && enemy.invulnTimer > 0) {
                triggerBurstSparks(enemy.x, enemy.y, '#ffffff', 'TAIL_SPARK', 4);
                return;
              }
              enemy.health = Math.max(0, enemy.health - tailDamage);

              // Update stats
              core.assaultRun.tailHitsThisRoom = (core.assaultRun.tailHitsThisRoom ?? 0) + 1;
              core.assaultRun.totalTailHits = (core.assaultRun.totalTailHits ?? 0) + 1;
              core.assaultRun.totalTailDamage = (core.assaultRun.totalTailDamage ?? 0) + tailDamage;
              
              // Apply knockback to enemy away from tail
              const angle = Math.atan2(enemy.y - tailPos.y, enemy.x - tailPos.x);
              enemy.x += Math.cos(angle) * 75;
              enemy.y += Math.sin(angle) * 75;
              
              // Satisfying feedbacks (QA Checkpoint 6.1 - Radial tail strike pulse)
              triggerBurstSparks(enemy.x, enemy.y, '#e11d48', 'TAIL_SPARK', 14);
              triggerAudioSign('Impacto de cola', 'solar');
              core.camera.shakeTime = 6;
              core.camera.shakeIntensity = 3.5;

              // Spawn beautiful radial shockwave pulse at tail strike point!
              core.particles.push({
                id: 'tail_strike_radial_' + Date.now() + Math.random(),
                x: enemy.x,
                y: enemy.y,
                vx: 0,
                vy: 0,
                color: '#f43f5e',
                size: 20,
                alpha: 1.0,
                life: 1.0,
                decay: 0.05,
                type: 'COLLECT_SHOCKWAVE',
                glow: true
              });
              
              // Floating text indicators
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: enemy.x,
                y: enemy.y - 20,
                text: `${tailDamage} TAIL STRIKE`,
                color: '#f43f5e',
                life: 1.0,
                size: 13
              });

              if (enemy.health <= 0) {
                onAssaultEnemyKilled(enemy);
                triggerBurstSparks(enemy.x, enemy.y, enemy.color, 'EVOLUTION_EXPLOSION', 18);
                
                core.floatingTexts.push({
                  id: Math.random().toString(),
                  x: enemy.x,
                  y: enemy.y - 15,
                  text: enemy.isBoss ? 'SALA PURGADA (BOSS)' : (enemy.isElite ? 'ELITE PURGADO' : 'PURGADO'),
                  color: enemy.isBoss ? '#ef4444' : (enemy.isElite ? '#f59e0b' : '#22d3ee'),
                  life: 1.5,
                  size: enemy.isBoss ? 16 : 13
                });

                if (Math.random() < 0.6 || enemy.isBoss || enemy.isElite) {
                  const dropCount = enemy.isBoss ? 4 : (enemy.isElite ? 2 : 1);
                  for (let d = 0; d < dropCount; d++) {
                    core.orbs.push(createAssaultEnergyPickup(enemy.x + (Math.random() - 0.5) * 15, enemy.y + (Math.random() - 0.5) * 15));
                  }
                }
              }
            }
          }
        }
      }
    });

    core.assaultRun.modules.forEach((mod: any) => {
      if (mod.lastFireTime === undefined) mod.lastFireTime = 0;
      mod.lastFireTime += 1 * dt;
      
      const fireCooldownValue = mod.fireCooldown !== undefined ? mod.fireCooldown : mod.cooldown;

      if (mod.lastFireTime >= fireCooldownValue) {
        let nearestEnemy: any = null;
        let nearestDist = Infinity;
        core.assaultRun.enemies.forEach((enemy: any) => {
          if (enemy.health > 0 && !(enemy.spawnPortalTimer && enemy.spawnPortalTimer > 0)) {
            const dist = Math.hypot(core.player.x - enemy.x, core.player.y - enemy.y);
            if (dist < nearestDist) {
              nearestDist = dist;
              nearestEnemy = enemy;
            }
          }
        });

        const maxRange = mod.range !== undefined ? mod.range : 550;

        if (nearestEnemy && nearestDist < maxRange) {
          mod.lastFireTime = 0;
          
          const index = mod.bodyIndex !== undefined ? mod.bodyIndex : (mod.segmentIndex !== undefined ? mod.segmentIndex : 3);
          const seg = core.player.segments[index] || core.player;
          
          const dx = nearestEnemy.x - seg.x;
          const dy = nearestEnemy.y - seg.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            let pvx = (dx / dist) * mod.projectileSpeed;
            let pvy = (dy / dist) * mod.projectileSpeed;

            if (mod.element === 'foton' && core.assaultRun.synergiesActive?.includes('tormenta_radiante')) {
              pvx *= 1.08;
              pvy *= 1.08;
            }

            triggerAudioSign('Carga solar absorbida', 'solar');

            const palette = getOrbiCorePalette(mod.element);
            const color = palette.projectile;
            const projType = palette.label;

            const statusEffect = mod.statusEffect;
            const piercing = mod.mutation === 'solar_lance';

            const elementNormalized = mod.element === 'terra' ? 'termo' : mod.element;
            const projectileType = mod.attackType ?? getDefaultAttackTypeForElement(mod.element);

            core.assaultRun.projectiles.push({
              id: 'pproj_' + Date.now() + '_' + Math.random(),
              x: seg.x,
              y: seg.y,
              vx: pvx,
              vy: pvy,
              radius: elementNormalized === 'hydro' ? 7 : (elementNormalized === 'termo' ? 8 : (elementNormalized === 'foton' ? 6 : 5)),
              damage: mod.damage,
              color: color,
              isEnemy: false,
              type: projType as any,
              statusEffect: statusEffect,
              piercing: piercing,
              hasPierced: [],
              element: elementNormalized,
              attackType: projectileType,
              coreColor: palette.projectileCore ?? palette.accent,
              glowColor: palette.bodyGlow,
              trailColor: palette.bodyTrail
            });

            setLastProjectileTypeFired(projectileType);

            const sparkType = elementNormalized === 'hydro' ? 'HYDRO_DROP' : (elementNormalized === 'aero' ? 'AERO_WIND' : (elementNormalized === 'termo' ? 'TAIL_SPARK' : 'SOLAR_SPARK'));
            triggerBurstSparks(seg.x, seg.y, color, sparkType, 4);

            if (mod.element === 'aero' && mod.mutation === 'wind_split' && Math.random() < 0.35) {
              const baseAngle = Math.atan2(dy, dx);
              for (const angOffset of [-0.22, 0.22]) {
                const splitAngle = baseAngle + angOffset;
                core.assaultRun.projectiles.push({
                  id: 'pproj_split_' + Date.now() + '_' + Math.random(),
                  x: seg.x,
                  y: seg.y,
                  vx: Math.cos(splitAngle) * mod.projectileSpeed * 0.75,
                  vy: Math.sin(splitAngle) * mod.projectileSpeed * 0.75,
                  radius: 3.5,
                  damage: Math.round(mod.damage * 0.4),
                  color: color,
                  isEnemy: false,
                  type: 'AERO',
                  isWindSplit: true,
                  element: 'aero',
                  attackType: 'aero_shard',
                  coreColor: palette.projectileCore ?? palette.accent,
                  glowColor: palette.bodyGlow,
                  trailColor: palette.bodyTrail
                });
              }
              triggerBurstSparks(seg.x, seg.y, color, 'AERO_WIND', 3);
            }

            if ((mod.element === 'terra' || mod.element === 'termo') && (mod.mutation === 'terra_pulse' || mod.mutation === 'termo_pulse')) {
              core.ability = {
                ...core.ability,
                radialEffectActive: true,
                radialEffectRadius: 5,
                radialEffectMaxRadius: 180,
                radialEffectX: seg.x,
                radialEffectY: seg.y,
                radialEffectColor: 'rgba(249, 115, 22, 0.65)'
              };
              
              core.assaultRun.enemies.forEach((enemy: any) => {
                if (enemy.health > 0) {
                  const enemyDist = Math.hypot(enemy.x - seg.x, enemy.y - seg.y);
                  if (enemyDist < 180) {
                    const pushAngle = Math.atan2(enemy.y - seg.y, enemy.x - seg.x);
                    enemy.x += Math.cos(pushAngle) * 60;
                    enemy.y += Math.sin(pushAngle) * 60;
                    enemy.health = Math.max(0, enemy.health - 10);
                    triggerBurstSparks(enemy.x, enemy.y, '#f97316', 'TAIL_SPARK', 6);
                  }
                }
              });
            }
          }
        }
      }
    });

    core.assaultRun.projectiles.forEach((proj: any) => {
      proj.x += proj.vx * dt;
      proj.y += proj.vy * dt;

      // Spawn trail particle based on element / attack type
      if (!proj.isEnemy && proj.element) {
        const el = proj.element;
        const sig = ORBI_ATTACK_SIGNATURES[el];
        if (sig && Math.random() < 0.45) {
          let trailColor = sig.secondaryColor;
          if (core.gameMode === 'nexus_assault' && el === 'foton') {
            trailColor = "#8DFF00";
          }
          const trailStyle = sig.trailStyle;

          let particleType: ParticleType = "NEXUS_SPARK";
          let particleSize = proj.radius * 0.45;
          let decayVal = 0.08 + Math.random() * 0.05;
          let glowEnabled = true;

          if (trailStyle === "linear_solar") {
            particleType = "SOLAR_SPARK";
            decayVal = 0.12;
          } else if (trailStyle === "liquid_trail") {
            particleType = "HYDRO_DROP";
            particleSize = proj.radius * 0.55;
            decayVal = 0.07;
            glowEnabled = false;
          } else if (trailStyle === "wind_streak") {
            particleType = "AERO_WIND";
            decayVal = 0.14;
          } else if (trailStyle === "ember_trail") {
            particleType = "TAIL_SPARK";
            particleSize = proj.radius * 0.5;
            decayVal = 0.09;
          } else if (trailStyle === "magnetic_wave") {
            particleType = "NEXUS_SPARK";
            decayVal = 0.1;
          } else if (trailStyle === "atomic_particle") {
            particleType = "SOLAR_SPARK";
            decayVal = 0.11;
          } else if (trailStyle === "kinetic_streak") {
            particleType = "TAIL_SPARK";
            decayVal = 0.13;
          } else if (trailStyle === "clean_energy") {
            particleType = "HYDRO_DROP";
            decayVal = 0.08;
          } else if (trailStyle === "quantum_glitch") {
            particleType = "NEXUS_SPARK";
            decayVal = 0.15;
          } else if (trailStyle === "vine_trail") {
            particleType = "TERRA_LEAF";
            decayVal = 0.06;
          }

          core.particles.push({
            id: "trail_" + Math.random(),
            x: proj.x - proj.vx * 0.5,
            y: proj.y - proj.vy * 0.5,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            color: trailColor,
            size: particleSize,
            alpha: 0.85,
            life: 0.5,
            decay: decayVal,
            type: particleType,
            glow: glowEnabled
          });
        }
      }

      if (proj.type === 'HYDRO' && !proj.isEnemy && core.assaultRun.synergiesActive?.includes('monzon_nexus')) {
        let homingTarget: any = null;
        let bestDist = Infinity;
        core.assaultRun.enemies.forEach((enemy: any) => {
          if (enemy.health > 0) {
            const d = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
            if (d < bestDist && d < 300) {
              bestDist = d;
              homingTarget = enemy;
            }
          }
        });
        
        if (homingTarget) {
          const dx = homingTarget.x - proj.x;
          const dy = homingTarget.y - proj.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0) {
            const speed = Math.hypot(proj.vx, proj.vy);
            const targetVx = (dx / dist) * speed;
            const targetVy = (dy / dist) * speed;
            
            proj.vx = proj.vx * 0.90 + targetVx * 0.10;
            proj.vy = proj.vy * 0.90 + targetVy * 0.10;
          }
        }
      }

      if (proj.isEnemy) {
        if (core.gameMode === 'nexus_assault') {
          const res = checkEnemyProjectileHitsAssaultVitalPoints(proj);
          if (res.hit) {
            proj.x = -9999;
            hurtAssaultPlayer(proj.damage * res.damageMultiplier, res.hitZone);
            const tailPt = getAssaultVitalHitPoints().tail;
            const burstX = res.hitZone === 'head' ? core.player.x : (tailPt ? tailPt.x : proj.x);
            const burstY = res.hitZone === 'head' ? core.player.y : (tailPt ? tailPt.y : proj.y);
            triggerBurstSparks(burstX, burstY, proj.color, 'BLACKOUT_SMOKE', res.hitZone === 'head' ? 8 : 5);
            triggerAudioSign('Fuga de plasma', 'blackout');
            if (res.hitZone === 'head') {
              core.camera.shakeTime = 5;
              core.camera.shakeIntensity = 3;
            }
          } else if (res.nearBody) {
            // soft sparkle representing energy shielding when grazing body
            if (Math.random() < 0.12) {
              triggerBurstSparks(proj.x, proj.y, proj.color || '#34d399', 'SOLAR_SPARK', 1);
            }
          }
        } else {
          const headDist = Math.hypot(proj.x - core.player.x, proj.y - core.player.y);
          if (headDist < proj.radius + 20) {
            proj.x = -9999;
            hurtAssaultPlayer(proj.damage, "head");
            triggerBurstSparks(core.player.x, core.player.y, proj.color, 'BLACKOUT_SMOKE', 8);
            triggerAudioSign('Fuga de plasma', 'blackout');
            core.camera.shakeTime = 5;
            core.camera.shakeIntensity = 3;
          } else {
            for (let i = 0; i < core.player.segments.length; ++i) {
              const seg = core.player.segments[i];
              if (Math.hypot(proj.x - seg.x, proj.y - seg.y) < proj.radius + seg.size / 2) {
                proj.x = -9999;
                hurtAssaultPlayer(proj.damage * 0.5, "body");
                triggerBurstSparks(seg.x, seg.y, proj.color, 'BLACKOUT_SMOKE', 5);
                triggerAudioSign('Fuga de plasma', 'blackout');
                break;
              }
            }
          }
        }
      } else {
        core.assaultRun.enemies.forEach((enemy: any) => {
          if (enemy.health > 0 && !(enemy.spawnPortalTimer && enemy.spawnPortalTimer > 0)) {
            const dist = Math.hypot(proj.x - enemy.x, proj.y - enemy.y);
            if (dist < proj.radius + enemy.radius) {
              if (enemy.invulnTimer && enemy.invulnTimer > 0) {
                proj.x = -9999;
                return;
              }

              const moduleLevel = 1;
              const element = proj.element || (proj.type ? proj.type.toLowerCase() : "");

              // Centralized damage application with modifiers
              applyAssaultDamageToEnemy(enemy, proj.damage, {
                element: element,
                source: "projectile"
              });

              if (element) {
                triggerElementalAssaultImpact(enemy.x, enemy.y, element, proj.color);
              } else {
                triggerBurstSparks(enemy.x, enemy.y, proj.color, 'NEXUS_SPARK', 8);
              }
              triggerAudioSign('Cristal Nexus decodificado', 'nexus');

              // ELEMENTAL EFFECTS: FOTON (Precisión solar)
              if (element === 'foton') {
                handleFotonProjectileHit(proj, enemy);
              }

              // ELEMENTAL EFFECTS: HYDRO (Control de flujos)
              if (element === 'hydro') {
                applyHydroSlow(enemy, moduleLevel);
                tryPrismaSolarRefraction(enemy);
              }

              // ELEMENTAL EFFECTS: AERO (Velocidad & viento cruzado)
              if (element === 'aero') {
                applyAeroWindPush(enemy, proj);

                // Monzon Nexus check: Aero impact on slowed enemy triggers storm splash
                if (enemy.statusEffects?.some((e: any) => e.type === "slow")) {
                  if (hasAssaultSynergy("monzon_nexus")) {
                    const radius = 120;
                    const splashDamage = Math.round(proj.damage * 0.4);
                    const coreObj = stateRef.current;
                    coreObj.assaultRun.enemies.forEach((other: any) => {
                      if (other.health > 0 && other.id !== enemy.id) {
                        const dist = Math.hypot(other.x - enemy.x, other.y - enemy.y);
                        if (dist < radius) {
                          applyAssaultDamageToEnemy(other, splashDamage, {
                            element: "aero",
                            source: "monzon_splash"
                          });
                          triggerBurstSparks(other.x, other.y, '#22d3ee', 'HYDRO_DROP', 2);
                        }
                      }
                    });
                    triggerBurstSparks(enemy.x, enemy.y, '#22d3ee', 'HYDRO_SPLASH', 6);
                    setLastSynergyProc("monzon_nexus");
                  }
                }
              }

              // ELEMENTAL EFFECTS: TERMO (Sobrecalentamiento)
              if (element === 'termo') {
                applyTermoOverheat(enemy, moduleLevel);

                // Vapor Nexus check: Termo impact on slowed enemy triggers vapor cloud
                if (enemy.statusEffects?.some((e: any) => e.type === "slow")) {
                  if (hasAssaultSynergy("vapor_nexus")) {
                    const coreObj = stateRef.current;
                    if (!coreObj.assaultRun.areaEffects) coreObj.assaultRun.areaEffects = [];
                    if (coreObj.assaultRun.areaEffects.filter((e: any) => e.type === "vapor_cloud").length < 4) {
                      coreObj.assaultRun.areaEffects.push({
                        type: "vapor_cloud",
                        x: enemy.x,
                        y: enemy.y,
                        radius: 90,
                        duration: 2.5,
                        tickTimer: 0.4
                      });
                      triggerBurstSparks(enemy.x, enemy.y, '#e2e8f0', 'BLACKOUT_SMOKE', 5);
                    }
                    setLastSynergyProc("vapor_nexus");
                  }
                }
              }

              // Fallbacks for standard project attributes
              if (proj.statusEffect === 'slow' && element !== 'hydro') {
                applyHydroSlow(enemy, 1);
              }
              if (proj.statusEffect === 'knockback' && element !== 'aero' && element !== 'termo') {
                const angle = Math.atan2(enemy.y - proj.y, enemy.x - proj.x);
                enemy.x += Math.cos(angle) * 45;
                enemy.y += Math.sin(angle) * 45;
                triggerBurstSparks(enemy.x, enemy.y, '#f97316', 'TAIL_SPARK', 4);
              }

              // Siphon Mutation heal
              const hydroCore = core.assaultRun.modules.find((m: any) => m.element === 'hydro');
              if (hydroCore && hydroCore.mutation === 'tidal_siphon' && element === 'hydro' && Math.random() < 0.15) {
                core.assaultRun.hp = Math.min(core.assaultRun.maxHp, core.assaultRun.hp + 1);
                setAssaultRunHp(core.assaultRun.hp);
                core.floatingTexts.push({
                  id: Math.random().toString(),
                  x: core.player.x,
                  y: core.player.y - 20,
                  text: '+1 HP',
                  color: '#22d3ee',
                  life: 1.0,
                  size: 11
                });
              }

              // Fallback refraction logic for Prisma Solar
              if (element === 'foton' && hasAssaultSynergy("prisma_solar") && Math.random() < 0.15) {
                const refractionAngle = Math.random() * Math.PI * 2;
                core.assaultRun.projectiles.push({
                  id: 'pproj_refract_' + Date.now() + '_' + Math.random(),
                  x: proj.x,
                  y: proj.y,
                  vx: Math.cos(refractionAngle) * 6.5,
                  vy: Math.sin(refractionAngle) * 6.5,
                  radius: proj.radius * 0.8,
                  damage: Math.round(proj.damage * 0.6),
                  color: '#ffd166',
                  isEnemy: false,
                  type: 'FOTON',
                  element: 'foton',
                  attackType: 'solar_lance'
                });
                setLastProjectileTypeFired('solar_lance');
                triggerBurstSparks(proj.x, proj.y, '#ffd166', 'SOLAR_SPARK', 3);
                setLastSynergyProc("prisma_solar");
              }

              // Pierce logic
              if (proj.piercing) {
                if (!proj.hasPierced) proj.hasPierced = [];
                if (!proj.hasPierced.includes(enemy.id)) {
                  proj.hasPierced.push(enemy.id);
                  if (proj.hasPierced.length >= 2) {
                    proj.x = -9999;
                  }
                }
              } else if (element !== 'foton') {
                proj.x = -9999;
              }
            }
          }
        });
      }
    });

    core.assaultRun.projectiles = core.assaultRun.projectiles.filter((p: any) => {
      if (p.x < boxMin - 100 || p.x > boxMax + 100 || p.y < boxMin - 100 || p.y > boxMax + 100) return false;
      return p.x > 0;
    });

    core.assaultRun.enemies = core.assaultRun.enemies.filter((enemy: any) => enemy.health > 0);

    // Call high-precision wave progression logic and failsafe checks
    checkAssaultWaveProgression(dt);
    assaultSoftlockFailsafe(dt);
    upgradePanelFailsafe(dt);
  };

  const drawAssaultLivingBackdrop = (ctx: CanvasRenderingContext2D, dt: number) => {
    const core = stateRef.current;
    const isLow = core.lowEffectsMode === true;
    
    // Budgets (Implementation 9)
    const ambientDustMax = isLow ? 40 : 120;
    const driftCurrentsMax = isLow ? 12 : 40;
    const nebulaPatchesMax = isLow ? 4 : 8;

    // Initialize backdrop container if not done
    if (!core.assaultBackdrop) {
      core.assaultBackdrop = {
        dust: [] as any[],
        currents: [] as any[],
        nebula: [] as any[],
        initialized: false
      };
    }

    const backdrop = core.assaultBackdrop;
    const cx = 1425;
    const cy = 1425;
    const arenaR = NEXUS_ASSAULT_ARENA_RADIUS;

    // 1. Living Nebula Layer (Soft glowing blobs with slow drift & scaling)
    if (backdrop.nebula.length === 0) {
      const colors = [
        'rgba(34, 211, 238, 0.04)',  // Cyan
        'rgba(124, 77, 255, 0.03)', // Violet
        'rgba(16, 185, 129, 0.03)',  // Green/Emerald
        'rgba(245, 158, 11, 0.02)',  // Amber
      ];
      for (let i = 0; i < nebulaPatchesMax; i++) {
        const angle = Math.random() * Math.PI * 2;
        const rValue = Math.random() * (arenaR - 200);
        backdrop.nebula.push({
          x: cx + Math.cos(angle) * rValue,
          y: cy + Math.sin(angle) * rValue,
          size: 250 + Math.random() * 250,
          color: colors[i % colors.length],
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          pulseSpeed: 0.002 + Math.random() * 0.003,
          phase: Math.random() * Math.PI
        });
      }
    }

    // Update & draw nebulas
    backdrop.nebula.forEach((neb: any) => {
      neb.x += neb.vx * dt;
      neb.y += neb.vy * dt;
      neb.phase += neb.pulseSpeed * dt;
      
      const d = Math.hypot(neb.x - cx, neb.y - cy);
      if (d > arenaR) {
        const angle = Math.random() * Math.PI * 2;
        neb.x = cx + Math.cos(angle) * (arenaR - 150);
        neb.y = cy + Math.sin(angle) * (arenaR - 150);
      }

      const scale = 1 + Math.sin(neb.phase) * 0.15;
      const grad = ctx.createRadialGradient(neb.x, neb.y, 0, neb.x, neb.y, neb.size * scale);
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x, neb.y, neb.size * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // 2. Ambient Energy Dust (Slowly drifting small light specks)
    while (backdrop.dust.length < ambientDustMax) {
      const angle = Math.random() * Math.PI * 2;
      const rValue = Math.random() * arenaR;
      const colors = ['#22d3ee', '#818cf8', '#a78bfa', '#f59e0b', '#10b981'];
      backdrop.dust.push({
        x: cx + Math.cos(angle) * rValue,
        y: cy + Math.sin(angle) * rValue,
        size: 0.8 + Math.random() * 1.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        alpha: 0.1 + Math.random() * 0.35,
        pulseSpeed: 0.01 + Math.random() * 0.02,
        phase: Math.random() * Math.PI
      });
    }

    // Update & draw dust
    backdrop.dust.forEach((d: any) => {
      const p = core.player;
      const parallaxFactor = 0.03;
      d.x += (d.vx - p.vx * parallaxFactor) * dt;
      d.y += (d.vy - p.vy * parallaxFactor) * dt;
      d.phase += d.pulseSpeed * dt;

      const dist = Math.hypot(d.x - cx, d.y - cy);
      if (dist > arenaR - 10) {
        const angle = Math.atan2(d.y - cy, d.x - cx) + Math.PI + (Math.random() - 0.5) * 0.5;
        d.x = cx + Math.cos(angle) * (arenaR - 20);
        d.y = cy + Math.sin(angle) * (arenaR - 20);
      }

      let reactionGlow = 0;
      const distToPlayer = Math.hypot(d.x - p.x, d.y - p.y);
      if (distToPlayer < 180) {
        reactionGlow += (1 - distToPlayer / 180) * 0.45;
      }
      if (core.assaultRun?.currentBoss && core.assaultRun.currentBoss.health > 0) {
        const b = core.assaultRun.currentBoss;
        const distToBoss = Math.hypot(d.x - b.x, d.y - b.y);
        if (distToBoss < 250) {
          reactionGlow += (1 - distToBoss / 250) * 0.5;
        }
      }

      const alpha = Math.min(1.0, (d.alpha + Math.sin(d.phase) * 0.05 + reactionGlow));
      ctx.fillStyle = d.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size * (1 + reactionGlow * 1.2), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 3. Drift Currents (Thin faint curved/straight energy vector streaks)
    while (backdrop.currents.length < driftCurrentsMax) {
      const angle = Math.random() * Math.PI * 2;
      const rValue = Math.random() * arenaR;
      backdrop.currents.push({
        x: cx + Math.cos(angle) * rValue,
        y: cy + Math.sin(angle) * rValue,
        length: 25 + Math.random() * 45,
        speed: 0.25 + Math.random() * 0.35,
        angle: Math.random() * Math.PI * 2,
        color: Math.random() < 0.5 ? 'rgba(34, 211, 238, 0.04)' : 'rgba(124, 77, 255, 0.03)',
        width: 1.0 + Math.random() * 1.5
      });
    }

    backdrop.currents.forEach((c: any) => {
      const p = core.player;
      const parallaxFactor = 0.05;
      c.x += (Math.cos(c.angle) * c.speed - p.vx * parallaxFactor) * dt;
      c.y += (Math.sin(c.angle) * c.speed - p.vy * parallaxFactor) * dt;

      const dist = Math.hypot(c.x - cx, c.y - cy);
      if (dist > arenaR + 50) {
        const randAngle = Math.random() * Math.PI * 2;
        c.x = cx - Math.cos(randAngle) * arenaR;
        c.y = cy - Math.sin(randAngle) * arenaR;
        c.angle = randAngle + (Math.random() - 0.5) * 0.3;
      }

      ctx.strokeStyle = c.color;
      ctx.lineWidth = c.width;
      ctx.beginPath();
      ctx.moveTo(c.x, c.y);
      ctx.lineTo(c.x + Math.cos(c.angle) * c.length, c.y + Math.sin(c.angle) * c.length);
      ctx.stroke();
    });
  };

  const drawNexusAssaultRoom = (ctx: CanvasRenderingContext2D, dt: number = 1.0) => {
    const core = stateRef.current;
    if (!core.assaultRun) return;

    const boxMin = 1425 - 750;
    const boxMax = 1425 + 750;
    const boxSize = 1500;

    ctx.save();

    const shape = core.assaultRun.room?.shape || 'RECTANGLE';
    const cx = 1425;
    const cy = 1425;
    const r = NEXUS_ASSAULT_ARENA_RADIUS;

    const createRoomPath = (offset: number = 0) => {
      ctx.beginPath();
      const currentRadius = r + offset;
      if (shape === 'CIRCLE') {
        ctx.arc(cx, cy, currentRadius, 0, Math.PI * 2);
      } else if (shape === 'DIAMOND') {
        const d_limit = currentRadius * 1.2533;
        ctx.moveTo(cx, cy - d_limit);
        ctx.lineTo(cx + d_limit, cy);
        ctx.lineTo(cx, cy + d_limit);
        ctx.lineTo(cx - d_limit, cy);
        ctx.closePath();
      } else if (shape === 'OCTAGON') {
        const r_oct = currentRadius * 1.0531;
        for (let j = 0; j < 8; j++) {
          const ang = (j / 8) * Math.PI * 2 + Math.PI / 8;
          const px = cx + Math.cos(ang) * r_oct;
          const py = cy + Math.sin(ang) * r_oct;
          if (j === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
      } else if (shape === 'WIDE_RECTANGLE') {
        const rx = currentRadius * 1.1824;
        const ry = currentRadius * 0.6651;
        ctx.rect(cx - rx, cy - ry, rx * 2, ry * 2);
      } else {
        const s = currentRadius * 0.8862;
        ctx.rect(cx - s, cy - s, s * 2, s * 2);
      }
    };

    ctx.save();
    createRoomPath(0);
    ctx.clip();

    // 1. Render the dynamic living backdrop inside clipped room boundaries! (Implementation 2)
    drawAssaultLivingBackdrop(ctx, dt);

    // Simplify grid if low effects active (QA Checkpoint 10.1)
    const isLowEffects = core.lowEffectsMode === true;
    const gridSpacing = isLowEffects ? 200 : 100;

    ctx.strokeStyle = 'rgba(34, 211, 238, 0.04)';
    ctx.lineWidth = 1.0;
    for (let x = boxMin; x <= boxMax; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, boxMin);
      ctx.lineTo(x, boxMax);
      ctx.stroke();
    }
    for (let y = boxMin; y <= boxMax; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(boxMin, y);
      ctx.lineTo(boxMax, y);
      ctx.stroke();
    }
    ctx.restore();

    // Shade everything outside the true boundary shape (Implementation 3 / 5)
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - 2000, cy - 2000, 4000, 4000); // huge outer box
    createRoomPath(0); // inner shape
    ctx.fillStyle = 'rgba(2, 1, 8, 0.75)'; // dark semi-transparent space outside
    ctx.fill('evenodd');
    ctx.restore();

    const pulsePhase = Math.sin(core.vitalEnergyWind * 2.0) * 0.5 + 0.5;
    ctx.strokeStyle = `rgba(34, 211, 238, ${0.45 + pulsePhase * 0.15})`;
    ctx.lineWidth = 3.5;

    if (QUALITY.glowEnabled && !isLowEffects) {
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 12;
    }
    createRoomPath(0);
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(124, 77, 255, 0.15)';
    ctx.lineWidth = 1.0;
    createRoomPath(20);
    ctx.stroke();

    // 4. Draw pickups (Orbs) behind players and enemies (QA Checkpoint 1.1)
    drawIntenseHighGlowOrbs(ctx);
    drawAssaultAreaEffects(ctx);

    // 5. Draw enemies
    core.assaultRun.enemies.forEach((enemy: any) => {
      if (enemy.isBoss) {
        drawNexusAssaultBoss(ctx, enemy);
        return;
      }
      if (enemy.spawnPortalTimer !== undefined && enemy.spawnPortalTimer > 0) {
        const duration = enemy.spawnPortalDuration || 70;
        drawOrbiDimensionalRiftPortal(
          ctx,
          enemy.x,
          enemy.y,
          enemy.radius,
          enemy.spawnPortalTimer,
          duration,
          enemy.color
        );
        const progress = 1.0 - (enemy.spawnPortalTimer / duration);
        if (progress > 0.75) {
          ctx.save();
          ctx.globalAlpha = (progress - 0.75) / 0.25;
          drawSerpentEnemy(ctx, enemy);
          ctx.restore();
        }
      } else {
        drawSerpentEnemy(ctx, enemy);
      }
    });

    // 6. Draw sorted projectiles: Player first, then Enemy on top (QA Checkpoint 1.2)
    const sortedProjectiles = [...core.assaultRun.projectiles].sort((a: any, b: any) => {
      const pA = a.isEnemy ? 1 : 0;
      const pB = b.isEnemy ? 1 : 0;
      return pA - pB;
    });

    sortedProjectiles.forEach((proj: any) => {
      ctx.save();

      if (proj.isEnemy) {
        // High Contrast Threatening Obsidian Core Enemy Projectile (QA Checkpoint 4.1)
        const coreCol = '#020008'; // Dark obsidian black core
        const mainCol = proj.color || '#ef4444'; // Neon red/orange
        const glowCol = '#7e22ce'; // Neon violet glow
        const glowRadius = proj.radius * 2.5;

        // High energy outer radial discharge glow
        const grad = ctx.createRadialGradient(proj.x, proj.y, proj.radius * 0.4, proj.x, proj.y, glowRadius);
        grad.addColorStop(0, '#ffffff'); // bright edge center
        grad.addColorStop(0.25, mainCol); // neon red
        grad.addColorStop(0.65, glowCol); // neon violet glow
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Dark obsidian core inside
        ctx.fillStyle = coreCol;
        ctx.strokeStyle = mainCol;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        return;
      }

      // Player projectiles: use element-specific signature visuals
      const element = proj.element || "foton";
      const sig = ORBI_ATTACK_SIGNATURES[element] || ORBI_ATTACK_SIGNATURES.foton;

      let mainCol = sig.primaryColor;
      let coreCol = sig.secondaryColor;
      let glowCol = sig.glowColor;
      const attackType = sig.attackType;

      if (core.gameMode === 'nexus_assault' && element === 'foton') {
        mainCol = "#8DFF00"; // foton green / baseColor
        coreCol = "#ffffff"; // white-hot / coreColor
        glowCol = "#B6FF00"; // neon/lime green / trail & glowColor
      }

      ctx.translate(proj.x, proj.y);
      const angle = Math.atan2(proj.vy, proj.vx);
      ctx.rotate(angle);

      if (attackType === "solar_lance") {
        let length = proj.radius * 3.4;
        let height = proj.radius * 0.85;

        if (core.gameMode === 'nexus_assault' && element === 'foton') {
          length *= 1.35; // projectileLengthMultiplier
          height *= 0.72; // projectileWidthMultiplier
        }

        // Glow
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, length * 1.5);
        glowGrad.addColorStop(0, coreCol);
        glowGrad.addColorStop(0.35, mainCol);
        glowGrad.addColorStop(0.7, glowCol);
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, length * 1.2, height * 2.8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Inner Sharp lance
        ctx.fillStyle = coreCol;
        ctx.beginPath();
        ctx.moveTo(-length * 0.8, 0);
        ctx.lineTo(-length * 0.2, -height * 0.85);
        ctx.lineTo(length * 0.9, 0);
        ctx.lineTo(-length * 0.2, height * 0.85);
        ctx.closePath();
        ctx.fill();

        // Bright white core highlights
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = (core.gameMode === 'nexus_assault' && element === 'foton') ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(-length * 0.5, 0);
        ctx.lineTo(length * 0.65, 0);
        ctx.stroke();

        // Extra bloom and laser-like sharpness for Foton in Assault
        if (core.gameMode === 'nexus_assault' && element === 'foton') {
          ctx.save();
          const bloomGrad = ctx.createRadialGradient(length * 0.8, 0, 0, length * 0.8, 0, height * 3.5);
          bloomGrad.addColorStop(0, '#ffffff');
          bloomGrad.addColorStop(0.35, '#8DFF00');
          bloomGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = bloomGrad;
          ctx.beginPath();
          ctx.arc(length * 0.8, 0, height * 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      } else if (attackType === "hydro_bubble") {
        const radius = proj.radius * 1.25;

        // Radial glow
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.5);
        glowGrad.addColorStop(0, "rgba(56, 213, 255, 0.4)");
        glowGrad.addColorStop(0.5, "rgba(43, 140, 255, 0.15)");
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Outer translucent liquid circle
        ctx.strokeStyle = "rgba(142, 235, 255, 0.9)";
        ctx.lineWidth = 2.0;
        ctx.fillStyle = "rgba(56, 213, 255, 0.25)";
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Inner glowing core droplet
        ctx.fillStyle = coreCol;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, 0);
        ctx.quadraticCurveTo(radius * 0.1, -radius * 0.45, radius * 0.4, 0);
        ctx.quadraticCurveTo(radius * 0.1, radius * 0.45, -radius * 0.5, 0);
        ctx.closePath();
        ctx.fill();

        // Glossy highlight reflection
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.beginPath();
        ctx.arc(radius * 0.2, -radius * 0.2, radius * 0.22, 0, Math.PI * 2);
        ctx.fill();
      } else if (attackType === "aero_blade") {
        const radius = proj.radius * 1.3;

        // Radial wind glow
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 2.8);
        glowGrad.addColorStop(0, "rgba(234, 251, 255, 0.35)");
        glowGrad.addColorStop(0.4, "rgba(142, 246, 255, 0.15)");
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.ellipse(0, 0, radius * 2.5, radius * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Outer wind blade crescent pointing forward
        ctx.fillStyle = "rgba(234, 251, 255, 0.45)";
        ctx.strokeStyle = coreCol;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-radius * 0.5, -radius * 1.35);
        ctx.quadraticCurveTo(radius * 1.3, 0, -radius * 0.5, radius * 1.35);
        ctx.quadraticCurveTo(radius * 0.15, 0, -radius * 0.5, -radius * 1.35);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner high-density white razor-sharp edge
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.moveTo(-radius * 0.2, -radius * 0.8);
        ctx.quadraticCurveTo(radius * 0.95, 0, -radius * 0.2, radius * 0.8);
        ctx.quadraticCurveTo(radius * 0.15, 0, -radius * 0.2, -radius * 0.8);
        ctx.closePath();
        ctx.fill();
      } else if (attackType === "thermal_orb") {
        const radius = proj.radius * 1.2 * (core.gameMode === 'nexus_assault' ? 0.70 : 1.0);

        // Multi-stop fire radial gradient
        const glowRadius = radius * 3.4;
        const fireGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowRadius);
        fireGrad.addColorStop(0, "#ffffff");
        fireGrad.addColorStop(0.18, coreCol);
        fireGrad.addColorStop(0.45, mainCol);
        fireGrad.addColorStop(0.75, glowCol);
        fireGrad.addColorStop(1, "transparent");

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Inner dense amber core
        ctx.fillStyle = coreCol;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
        ctx.fill();

        // Fiery outer boundary rings
        ctx.strokeStyle = "rgba(255, 45, 0, 0.55)";
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 1.25, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const radius = proj.radius;
        
        // Glow
        const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 3.0);
        glowGrad.addColorStop(0, coreCol);
        glowGrad.addColorStop(0.35, mainCol);
        glowGrad.addColorStop(0.8, glowCol);
        glowGrad.addColorStop(1, "transparent");

        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 3.0, 0, Math.PI * 2);
        ctx.fill();

        if (attackType === "magnetic_arc") {
          ctx.strokeStyle = coreCol;
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, radius * 1.2, -Math.PI / 2, Math.PI / 2);
          ctx.stroke();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else if (attackType === "atomic_pulse") {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          for (let i = 0; i < 4; i++) {
            const ang = (i * Math.PI) / 2;
            ctx.lineTo(Math.cos(ang) * radius * 1.4, Math.sin(ang) * radius * 1.4);
            ctx.lineTo(Math.cos(ang + Math.PI/4) * radius * 0.6, Math.sin(ang + Math.PI/4) * radius * 0.6);
          }
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (attackType === "kinetic_spike") {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          ctx.moveTo(-radius * 1.2, 0);
          ctx.lineTo(-radius * 0.4, -radius * 0.7);
          ctx.lineTo(radius * 1.5, 0);
          ctx.lineTo(-radius * 0.4, radius * 0.7);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(-radius * 0.8, 0);
          ctx.lineTo(radius * 0.8, 0);
          ctx.lineTo(-radius * 0.2, -radius * 0.35);
          ctx.closePath();
          ctx.fill();
        } else if (attackType === "h2nova_burst") {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          ctx.moveTo(-radius * 1.1, 0);
          ctx.bezierCurveTo(radius * 0.2, -radius * 1.1, radius * 1.1, -radius * 0.8, radius * 1.1, 0);
          ctx.bezierCurveTo(radius * 1.1, radius * 0.8, radius * 0.2, radius * 1.1, -radius * 1.1, 0);
          ctx.closePath();
          ctx.fill();
        } else if (attackType === "quantum_shard") {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          ctx.moveTo(-radius * 1.4, 0);
          ctx.lineTo(0, -radius * 0.75);
          ctx.lineTo(radius * 1.4, 0);
          ctx.lineTo(0, radius * 0.75);
          ctx.closePath();
          ctx.fill();

          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.moveTo(-radius * 0.7, 0);
          ctx.lineTo(0, -radius * 0.35);
          ctx.lineTo(radius * 0.7, 0);
          ctx.lineTo(0, radius * 0.35);
          ctx.closePath();
          ctx.fill();
        } else if (attackType === "gaia_seed") {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          ctx.ellipse(0, 0, radius * 1.3, radius * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = mainCol;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-radius * 1.3, 0);
          ctx.lineTo(radius * 1.3, 0);
          ctx.stroke();
        } else {
          ctx.fillStyle = coreCol;
          ctx.beginPath();
          ctx.arc(0, 0, radius * 0.85, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    });

    core.assaultRun.modules.forEach((mod: any) => {
      const seg = core.player.segments[mod.segmentIndex];
      if (seg) {
        const pulse = 1.2 + Math.sin(core.vitalEnergyWind * 2.8 + mod.segmentIndex) * 0.2;
        const palette = getOrbiCorePalette(mod.element);
        const radius = getAssaultCoreVisualRadius(mod) * pulse;

        ctx.save();

        // halo elemental
        const glow = ctx.createRadialGradient(
          seg.x,
          seg.y,
          0,
          seg.x,
          seg.y,
          radius * 2.6
        );
        glow.addColorStop(0, palette.accent || palette.projectile);
        glow.addColorStop(0.45, palette.bodyGlow || '#ffffff');
        glow.addColorStop(1, "rgba(0,0,0,0)");

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius * 2.6, 0, Math.PI * 2);
        ctx.fill();

        // núcleo interno
        ctx.fillStyle = palette.bodyCore || '#ffffff';
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // anillo
        ctx.strokeStyle = palette.accent || palette.projectile;
        ctx.lineWidth = Math.max(1.5, radius * 0.18);
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius * 1.25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, radius * 0.35, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    });

    // Premium Room Transition Screen-Fade & Ripple Pulsation Effects (REBOOT 1.1F)
    const runStatus = core.assaultRun.run?.status;
    if (runStatus === 'transition_next_room') {
      const transTimer = core.assaultRun.transitionTimer || 0;
      // Linear and cosine fade configurations
      const opacity = Math.min(0.85, transTimer * 0.95);
      
      // Outer dims and grids backdrop shading
      ctx.fillStyle = `rgba(3, 4, 15, ${opacity})`;
      ctx.fillRect(boxMin - 100, boxMin - 100, boxSize + 200, boxSize + 200);

      // Core integrations sweep circles centered on Orbi's exact real-time head location
      const p = core.player;
      
      // Dual resonance radial glow wave impulses
      ctx.strokeStyle = `rgba(34, 211, 238, ${Math.max(0, 1 - transTimer * 1.3)})`;
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, transTimer * 260, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0, 1 - transTimer * 1.3)})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, transTimer * 380, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  };

  // Play and Start game triggers
  const handleStartPlaying = (guardian: GuardianId) => {
    setSelectedGuardian(guardian);
    setGameState('PLAYING');
    setSurvivalSummary(null); // Clear previous survival run summary
    setVitalFlowSummary(null); // Clear previous vital flow run summary
    generateWorldElements();
    initiateReset();

    const core = stateRef.current;
    setCinematicActive(true);
    setCinematicTimerSeconds(4);
    cinematicTimerRef.current = 240; // 4 seconds at 60fps (3, 2, 1, FLUJO ORBI)
    if (ORBI_COUNTDOWN_AUDIO_CONFIG.enabled) {
      core.lastCountdownStepPlayed = "ready";
      playOrbiCountdownCue("ready", core.gameMode);
    } else {
      triggerAudioSign('Iniciando Enlace de Red', 'evolve');
    }
  };

  // Return to Choose Screen
  const handleBackToSelect = () => {
    setGameState('CHOOSE');
    setSurvivalSummary(null);
    setVitalFlowSummary(null);
    triggerAudioSign('Re-direccionando', 'reset');
  };

  // Resume Connection from Pause
  const handleResumePlay = () => {
    setGameState('PLAYING');
    triggerAudioSign('Conexión Resumida', 'evolve');
  };

  // Return to main menu
  const handleReturnToMain = () => {
    setGameState('START');
    triggerAudioSign('Navegación Inicial', 'reset');
  };

  // TRIGGER MAIN CONTINUOUS TICK LOOP (Canvas state updates & drawing)
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const gameLoop = (now: number) => {
      animId = requestAnimationFrame(gameLoop);

      const core = stateRef.current;
      const theme = GUARDIAN_THEMES[core.activeGuardian];
      const size = core.arenaSize;
      const worldWidth = core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : size;

      // Time differences to lock speed on different screens
      let dt = (now - lastTime) / 16.666;
      if (dt > 4) dt = 4; // prevent crazy jumps
      lastTime = now;

      // REBOOT 0.9 — Performance & FPS Monitoring calculation (Part 12 & 13)
      fpsRef.current.frameCount++;
      if (now >= fpsRef.current.lastTime + 1000) {
        const calculatedFps = Math.round((fpsRef.current.frameCount * 1000) / (now - fpsRef.current.lastTime));
        setCurrentFps(calculatedFps);
        fpsRef.current.frameCount = 0;
        fpsRef.current.lastTime = now;

        // Auto degradation based on active sliding FPS average
        if (core.gameState === 'PLAYING') {
          fpsRef.current.fpsHistory.push(calculatedFps);
          if (fpsRef.current.fpsHistory.length > 5) {
            fpsRef.current.fpsHistory.shift();
          }
          const avgFps = fpsRef.current.fpsHistory.length > 0
            ? fpsRef.current.fpsHistory.reduce((a, b) => a + b, 0) / fpsRef.current.fpsHistory.length
            : calculatedFps;

          if (avgFps < 42 && performanceProfile === 'desktop') {
            setPerformanceProfile('mobile');
            showTemporaryMessage('RENDIMIENTO ADAPTADO: PERFIL MÓVIL');
          } else if (avgFps < 32 && performanceProfile === 'mobile') {
            setPerformanceProfile('lowEnd');
            showTemporaryMessage('RENDIMIENTO ADAPTADO: CALIDAD MÍNIMA');
          }

          // Low Effects Mode Auto-Degradation (FPS < 48 for 3 consecutive seconds)
          if (calculatedFps < 48) {
            core.lowFpsConsecutiveSeconds = (core.lowFpsConsecutiveSeconds ?? 0) + 1;
            if (core.lowFpsConsecutiveSeconds >= 3) {
              if (!core.lowEffectsMode) {
                core.lowEffectsMode = true;
                showTemporaryMessage('MODO EFECTOS REDUCIDOS ACTIVO');
              }
            }
          } else if (calculatedFps >= 52) {
            core.lowFpsConsecutiveSeconds = 0;
            // Auto-recovery (FPS >= 52 for 4 consecutive seconds)
            core.highFpsConsecutiveSeconds = (core.highFpsConsecutiveSeconds ?? 0) + 1;
            if (core.highFpsConsecutiveSeconds >= 4) {
              if (core.lowEffectsMode) {
                core.lowEffectsMode = false;
                showTemporaryMessage('RESTABLECIENDO EFECTOS COMPLETOS');
              }
            }
          } else {
            core.highFpsConsecutiveSeconds = 0;
          }
        }
      }

      if (core.gameState === 'PLAYING') {
        const p = core.player;

        // Unified Serpent Evolution & Scaling System (MÓDULO 5R.2A - Global Serpent Evolution)
        if (ENABLE_GLOBAL_SERPENT_EVOLUTION_SCALE_FIX) {
          let mode: "red_vital" | "survival_nexus" | "nexus_assault" | "vital_flow" = "red_vital";
          let resourceVal = 0;
          if (core.gameMode === 'vital_flow') {
            mode = "vital_flow";
            resourceVal = core.vitalFlow ? core.vitalFlow.pickupsCollected : 0;
          } else if (core.gameMode === 'infinite') {
            mode = "survival_nexus";
            resourceVal = core.timeElapsed || 0;
          } else if (core.gameMode === 'nexus_assault') {
            mode = "nexus_assault";
            resourceVal = p.energy || 0;
          } else {
            mode = "red_vital";
            resourceVal = p.pickupEvolutionEnergy || 0;
          }

          // If player moves in demo mode, hide compact hint
          if (core.gameMode === 'demo' && showCompactControlHint) {
            if (Math.hypot(p.x - core.arenaWidth / 2, p.y - core.arenaSize / 2) > 15) {
              setShowCompactControlHint(false);
            }
          }

          const targetProfile = getOrbiSerpentEvolutionVisualProfile({
            mode,
            pickupsOrEnergy: resourceVal
          });

          if (!p.visualProfile) {
            p.visualProfile = { ...targetProfile };
          } else {
            const lerpVal = ENABLE_SERPENT_VISUAL_SMOOTHING ? 0.08 * dt : 1;
            p.visualProfile.stage = targetProfile.stage;
            p.visualProfile.label = targetProfile.label;
            p.visualProfile.visibleInternalCoreCount = targetProfile.visibleInternalCoreCount;
            p.visualProfile.preservePremiumHeadDetails = targetProfile.preservePremiumHeadDetails;

            // Interpolate scales smoothly to eliminate jumps
            p.visualProfile.headScale = lerp(p.visualProfile.headScale, targetProfile.headScale, lerpVal);
            p.visualProfile.bodyLengthScale = lerp(p.visualProfile.bodyLengthScale, targetProfile.bodyLengthScale, lerpVal);
            p.visualProfile.thicknessMultiplier = lerp(p.visualProfile.thicknessMultiplier, targetProfile.thicknessMultiplier, lerpVal);
            p.visualProfile.tailOrbScale = lerp(p.visualProfile.tailOrbScale, targetProfile.tailOrbScale, lerpVal);
            p.visualProfile.glowMultiplier = lerp(p.visualProfile.glowMultiplier, targetProfile.glowMultiplier, lerpVal);
            p.visualProfile.trailMultiplier = lerp(p.visualProfile.trailMultiplier, targetProfile.trailMultiplier, lerpVal);
            p.visualProfile.orbitRingIntensity = lerp(p.visualProfile.orbitRingIntensity, targetProfile.orbitRingIntensity, lerpVal);
            p.visualProfile.energyFinIntensity = lerp(p.visualProfile.energyFinIntensity, targetProfile.energyFinIntensity, lerpVal);
            p.visualProfile.particleIntensity = lerp(p.visualProfile.particleIntensity, targetProfile.particleIntensity, lerpVal);
          }
        }

        if (core.gameMode === 'vital_flow') {
          // Cinematic countdown update
          if (cinematicActiveRef.current) {
            cinematicTimerRef.current -= 1 * dt;
            const secs = Math.ceil(cinematicTimerRef.current / 60);
            if (secs !== cinematicTimerSeconds) {
              setCinematicTimerSeconds(Math.max(0, secs));
              if (ORBI_COUNTDOWN_AUDIO_CONFIG.enabled) {
                const currentStep = secs === 4 ? "3" : (secs === 3 ? "2" : (secs === 2 ? "1" : (secs === 1 ? "go" : "")));
                if (currentStep && currentStep !== core.lastCountdownStepPlayed) {
                  core.lastCountdownStepPlayed = currentStep;
                  playOrbiCountdownCue(currentStep as any, core.gameMode);
                }
              }
            }
            if (cinematicTimerRef.current <= 0) {
              setCinematicActive(false);
              cinematicActiveRef.current = false;
              triggerStartHints();
            }
            p.vx = 0;
            p.vy = 0;
            p.speed = 0;

            if (Math.random() < 0.25 * dt) {
              core.particles.push({
                id: Math.random().toString(36).substring(2, 7),
                x: p.x + (Math.random() - 0.5) * 80,
                y: p.y + (Math.random() - 0.5) * 80,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                color: theme.particleColor,
                size: 1.5 + Math.random() * 2,
                alpha: 0.8,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type: 'SOLAR_SPARK',
                glow: true
              });
            }
          } else {
            updateVitalFlow(dt);
          }

          // Process particles, texts, and camera follow (shared effects)
          // Update camera follow head
          const cam = core.camera;
          const lerpFactor = 1 - Math.pow(0.08, dt);
          cam.x += (p.x - cam.x) * lerpFactor;
          cam.y += (p.y - cam.y) * lerpFactor;

          // Particles update
          const activeParticles = [];
          for (const part of core.particles) {
            part.x += part.vx * dt;
            part.y += part.vy * dt;
            part.life -= part.decay * dt;
            if (part.life > 0) {
              activeParticles.push(part);
            }
          }
          core.particles = activeParticles;

          // Floating text update
          const activeTexts = [];
          for (const ft of core.floatingTexts) {
            ft.life -= 0.016 * dt;
            if (ft.life > 0) {
              activeTexts.push(ft);
            }
          }
          core.floatingTexts = activeTexts;

          // Animate wings and orbits
          p.wingPhase += 0.12 * dt;
          p.orbitPhase += 0.05 * dt;
        } else {

        // Cinematic update
        if (cinematicActiveRef.current) {
          cinematicTimerRef.current -= 1 * dt;
          const secs = Math.ceil(cinematicTimerRef.current / 60);
          if (secs !== cinematicTimerSeconds) {
            setCinematicTimerSeconds(Math.max(0, secs));
             if (ORBI_COUNTDOWN_AUDIO_CONFIG.enabled) {
               const currentStep = secs === 4 ? "3" : (secs === 3 ? "2" : (secs === 2 ? "1" : (secs === 1 ? "go" : "")));
               if (currentStep && currentStep !== core.lastCountdownStepPlayed) {
                 core.lastCountdownStepPlayed = currentStep;
                 playOrbiCountdownCue(currentStep as any, core.gameMode);
               }
             }
          }
          if (cinematicTimerRef.current <= 0) {
            setCinematicActive(false);
            cinematicActiveRef.current = false;
            triggerStartHints();
            if (core.gameMode === 'nexus_assault' && core.assaultRun) {
              core.assaultRun.countdownComplete = true;
            }
            // Tutorial starts!
            if (tutorialEnabled) {
              setCompletedTutorialSteps([]);
              localStorage.removeItem("orbiNexusTutorialCompletedSteps");
            }
          }
          // Lock player in place and spawn aesthetic sparks around them
          p.vx = 0;
          p.vy = 0;
          p.speed = 0;

          if (Math.random() < 0.25 * dt) {
            core.particles.push({
              id: Math.random().toString(36).substring(2, 7),
              x: p.x + (Math.random() - 0.5) * 80,
              y: p.y + (Math.random() - 0.5) * 80,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              color: theme.particleColor,
              size: 1.5 + Math.random() * 2,
              alpha: 0.8,
              life: 1.0,
              decay: 0.02 + Math.random() * 0.02,
              type: 'SOLAR_SPARK',
              glow: true
            });
          }
        }

        // Check tutorial step completions inside gameLoop
        if (tutorialEnabled && !cinematicActiveRef.current) {
          if (activeTutorialStep === 'movement') {
            if (Math.hypot(p.x - 1425, p.y - 1425) > 60) {
              markTutorialStepCompleted('movement');
            }
          } else if (activeTutorialStep === 'collect_energy') {
            // Checked during positive orb pickup
          } else if (activeTutorialStep === 'avoid_blackout') {
            core.avoidBlackoutTimer = (core.avoidBlackoutTimer || 0) + (1 / 60) * dt;
            if (core.avoidBlackoutTimer >= 8.0) {
              markTutorialStepCompleted('avoid_blackout');
            }
          } else if (activeTutorialStep === 'solar_pulse') {
            // Checked in triggerGuardianAbility
          } else if (activeTutorialStep === 'boundary_warning') {
            // Checked in boundaries checks
          } else if (activeTutorialStep === 'corruption_zone') {
            if (core.statsExtra.zonesPurified > 0) {
              markTutorialStepCompleted('corruption_zone');
            }
          } else if (activeTutorialStep === 'blackout_surge') {
            if (core.statsExtra.blackoutSurgesSurvived > 0) {
              markTutorialStepCompleted('blackout_surge');
            }
          } else if (activeTutorialStep === 'sentinel_intro') {
            if (core.sentinel && (core.sentinel.shield < SENTINEL_BALANCE.maxShield || core.sentinel.health < SENTINEL_BALANCE.maxHealth)) {
              markTutorialStepCompleted('sentinel_intro');
            }
          } else if (activeTutorialStep === 'victory_goal') {
            core.victoryGoalTimer = (core.victoryGoalTimer || 0) + (1 / 60) * dt;
            if (core.victoryGoalTimer >= 8.0) {
              markTutorialStepCompleted('victory_goal');
            }
          }
        }

        // Contextual Help checking in simulation tick thread
        if (!cinematicActiveRef.current) {
          // 1. Inactivity checking
          if (Math.hypot(p.vx, p.vy) < 0.2) {
            p.inactivityTicks = (p.inactivityTicks || 0) + 1 * dt;
            if (p.inactivityTicks >= 300) { // 5 seconds
              triggerContextualHelp("CONSEJO: Guía el flujo solar para recolectar energía y evitar la desestabilización.");
              p.inactivityTicks = 0;
            }
          } else {
            p.inactivityTicks = 0;
          }

          // 2. Low energy checking
          if (p.energy <= 20) {
            p.lowEnergyTicks = (p.lowEnergyTicks || 0) + 1 * dt;
            if (p.lowEnergyTicks >= 180) { // 3 seconds
              triggerContextualHelp("ALERTA: Carga vital baja. Busca orbes amarillos o celestes con urgencia para recuperar plasma.");
              p.lowEnergyTicks = 0;
            }
          } else {
            p.lowEnergyTicks = 0;
          }

          // 3. Ability unused checking
          if (core.ability.cooldownRemaining <= 0 && !core.ability.active && p.energy >= 20) {
            p.abilityUnusedTicks = (p.abilityUnusedTicks || 0) + 1 * dt;
            if (p.abilityUnusedTicks >= 720) { // 12 seconds
              triggerContextualHelp("CONSEJO: ¡Habilidad lista! Usa ESPACIO o pulsa el botón central para desintegrar amenazas cercanas.");
              p.abilityUnusedTicks = 0;
            }
          } else {
            p.abilityUnusedTicks = 0;
          }
        }

        // Process evolution micro-cinematic clock and bullet-time slow-mo
        if (core.evolutionCinematic && core.evolutionCinematic.active) {
          core.evolutionCinematic.timer -= 1 * dt;
          if (core.evolutionCinematic.timer <= 0) {
            core.evolutionCinematic.active = false;
          }
          // Bullet-time: slow down core physics delta clock by 65% for cinematic emphasis!
          dt *= 0.35;
        }

        // Increment continuous wind and phases
        core.vitalEnergyWind += 0.04 * dt;
        p.wingPhase += (core.evolutionCinematic && core.evolutionCinematic.active ? 0.28 : 0.12) * dt;
        p.orbitPhase += 0.05 * dt;

        // Passive features: regenerator of Hydro
        if (core.activeGuardian === 'HYDRO') {
          p.ticksSinceLastDamage += 1 * dt;
          if (p.ticksSinceLastDamage >= 240) { // 4 seconds
            const canRecover = !(core.gameMode === 'infinite' && core.survival?.debuffType === 'ENTROPÍA');
            if (canRecover && p.energy < 100 && Math.floor(p.ticksSinceLastDamage) % 60 === 0) {
              p.energy = Math.min(100, p.energy + 1);
            }
          }
        }

        // Active Ability cooldown ticking
        if (core.ability.cooldownRemaining > 0) {
          core.ability.cooldownRemaining -= 1 * dt;
          if (Math.floor(core.ability.cooldownRemaining) % 60 === 0) {
            setAbilityCooldownRemaining(Math.max(0, Math.ceil(core.ability.cooldownRemaining / 60)));
          }
        }

        if (core.ability.active) {
          core.ability.activeTimer -= 1 * dt;
          if (core.ability.activeTimer <= 0) {
            core.ability.active = false;
            setAbilityActive(false);
            // Revert Aero dash modifiers
            if (core.activeGuardian === 'AERO') {
              p.speed = EVOLUTION_STAGES[p.evolution].speed * theme.speedModifier;
            }
          }
        }

        // Radial pulses
        if (core.ability.radialEffectActive) {
          core.ability.radialEffectRadius += 8 * dt;
          if (core.ability.radialEffectRadius >= core.ability.radialEffectMaxRadius) {
            core.ability.radialEffectActive = false;
          }
        }

        // Linear interpolation angle tracking (turning kinetics)
        const currentStage = EVOLUTION_STAGES[p.evolution];
        
        // Set dynamic speeds based on current stage and guardian modifiers
        let targetSpeed = currentStage.speed * theme.speedModifier;
        if (core.ability.active && core.activeGuardian === 'AERO') {
          targetSpeed = currentStage.speed * theme.speedModifier * 2.2;
        }
        p.speed = p.speed * 0.88 + targetSpeed * 0.12;

        const assaultStatus = (core.gameMode === 'nexus_assault' && core.assaultRun) 
          ? (core.assaultRun.run?.status || 'combat') 
          : 'combat';

        if (core.gameMode === 'nexus_assault' && (assaultStatus === 'upgrade_selection' || assaultStatus === 'transition_next_room')) {
          p.vx = 0;
          p.vy = 0;
          p.speed = 0;
          if (assaultStatus === 'transition_next_room') {
            const targetX = 1425;
            const targetY = 1425;
            const lerpFactor = 1 - Math.pow(0.08, dt);
            p.x += (targetX - p.x) * lerpFactor;
            p.y += (targetY - p.y) * lerpFactor;
          }
        } else {
          // Handle keyboard targetAngle redirection if keyboard control is active
          if (core.activeControlMode === 'keyboard') {
            let kDx = 0;
            let kDy = 0;
            if (core.keys['arrowleft'] || core.keys['a']) kDx -= 1;
            if (core.keys['arrowright'] || core.keys['d']) kDx += 1;
            if (core.keys['arrowup'] || core.keys['w']) kDy -= 1;
            if (core.keys['arrowdown'] || core.keys['s']) kDy += 1;

            const kLen = Math.hypot(kDx, kDy);
            if (kLen > 0) {
              kDx /= kLen;
              kDy /= kLen;
              p.targetAngle = Math.atan2(kDy, kDx);
            }
          }

          // Active Ability auto-activation trigger inside simulation thread
          if (core.keys[' '] || core.keys['space']) {
            triggerGuardianAbility();
            // Reset keys to avoid continuous fires
            core.keys[' '] = false;
            core.keys['space'] = false;
          }

          // Angle wrapping & LERP
          let diff = p.targetAngle - p.angle;
          while (diff < -Math.PI) diff += Math.PI * 2;
          while (diff > Math.PI) diff -= Math.PI * 2;

          const turnSpeed = core.activeGuardian === 'AERO' ? 0.14 : 0.11; // Quick responsive turn speed
          if (!cinematicActiveRef.current) {
            p.angle += diff * turnSpeed * dt;
          }

          // Drive coordinates with premium drift visual inertia momentum
          let currentSpeed = p.speed;
          if (core.gameMode === 'nexus_assault') {
            currentSpeed = p.speed * getNexusAssaultSpeedMultiplier();
          } else if (core.gameMode === 'infinite' && core.survival?.debuffType === 'ESTASIS') {
            currentSpeed = p.speed * getStasisSlowMultiplier(core.survival, true);
          }
          const desiredVx = Math.cos(p.angle) * currentSpeed;
          const desiredVy = Math.sin(p.angle) * currentSpeed;
          
          if (p.vx === undefined) p.vx = desiredVx;
          if (p.vy === undefined) p.vy = desiredVy;
          
          const inertiaRatio = core.evolutionCinematic && core.evolutionCinematic.active ? 0.08 : 0.16;
          p.vx = p.vx * (1 - inertiaRatio) + desiredVx * inertiaRatio;
          p.vy = p.vy * (1 - inertiaRatio) + desiredVy * inertiaRatio;

          if (!cinematicActiveRef.current) {
            p.x += p.vx * dt;
            p.y += p.vy * dt;
          } else {
            p.vx = 0;
            p.vy = 0;
            p.speed = 0;
            p.x = core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth / 2 : 1425;
            p.y = 1425;
          }
        }

        // Boundaries checks with customizable boundary modes and Nexus containment field (REBOOT 0.2C)
        let boundaryFlag = false;

        {
          const distToBoundary = Math.min(p.x, p.y, worldWidth - p.x, size - p.y);

          if (BOUNDARY_MODE === 'bounce') {
            const padding = 45;
            if (p.x < padding) { p.x = padding; p.targetAngle = 0; p.angle = 0; p.vx = 0; p.vy = 0; boundaryFlag = true; }
            if (p.x > worldWidth - padding) { p.x = worldWidth - padding; p.targetAngle = Math.PI; p.angle = Math.PI; p.vx = 0; p.vy = 0; boundaryFlag = true; }
            if (p.y < padding) { p.y = padding; p.targetAngle = Math.PI / 2; p.angle = Math.PI / 2; p.vx = 0; p.vy = 0; boundaryFlag = true; }
            if (p.y > size - padding) { p.y = size - padding; p.targetAngle = -Math.PI / 2; p.angle = -Math.PI / 2; p.vx = 0; p.vy = 0; boundaryFlag = true; }
          } else {
            // 'hybrid' or 'damage' styles
            const inWarning = distToBoundary < NEXUS_BOUNDARY.warningDistance;
            const inContainment = distToBoundary < NEXUS_BOUNDARY.containmentDistance;
            const isHardOob = (p.x < 35 || p.x > worldWidth - 35 || p.y < 35 || p.y > size - 35);

            // 1. Show alerts based on active boundaries
            if (isHardOob) {
              showTemporaryMessage('ESTABILIDAD CRÍTICA');
              if (tutorialEnabled && activeTutorialStep === 'boundary_warning') {
                markTutorialStepCompleted('boundary_warning');
              }
            } else if (inContainment) {
              showTemporaryMessage('CAMPO DE CONTENCIÓN ACTIVO');
              if (tutorialEnabled && activeTutorialStep === 'boundary_warning') {
                markTutorialStepCompleted('boundary_warning');
              }
            } else if (inWarning) {
              showTemporaryMessage('LÍMITE NEXUS CERCANO');
              if (tutorialEnabled && activeTutorialStep === 'boundary_warning') {
                markTutorialStepCompleted('boundary_warning');
              }
            } else {
              showTemporaryMessage('');
            }

            // 2. Accumulate or decay boundary exposure
            if (inContainment) {
              core.boundaryExposureTime += (1 / 60) * dt; // Convert frames to approximate elapsed seconds
              
              // Damage Rate scaling
              const isSevere = core.boundaryExposureTime > NEXUS_BOUNDARY.severeAfterSeconds || isHardOob;
              const damageRate = isSevere ? NEXUS_BOUNDARY.severeDamagePerSecond : NEXUS_BOUNDARY.damagePerSecond;
              let dmg = damageRate * (1 / 60) * dt;
              if (p.evolution === 'GUARDIAN_SERPENT') {
                dmg *= (1 - NEXUS_GUARDIAN_RESISTANCE.boundaryDamageReduction);
              }

              p.energy = Math.max(0, p.energy - dmg);

              // Shakes and flags
              boundaryFlag = true;
              p.gridBoundTicks = isSevere ? 15 : 6;
              core.camera.shakeIntensity = isSevere ? 1.4 : 0.6;
              core.camera.shakeTime = isSevere ? 6 : 2;

              // Spawn premium edge sparks of containment
              if (Math.random() < 0.28) {
                const borderSparkColor = isSevere ? '#ef4444' : '#22d8ff';
                core.particles.push({
                  id: Math.random().toString(36).substring(2, 7),
                  x: p.x + (Math.random() - 0.5) * 16,
                  y: p.y + (Math.random() - 0.5) * 16,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4,
                  color: borderSparkColor,
                  size: 1.5 + Math.random() * 2.0,
                  alpha: 0.9,
                  life: 1.0,
                  decay: 0.03 + Math.random() * 0.03,
                  type: 'COLLECT_SHOCKWAVE',
                  glow: true
                });
              }

              // Check Game Over (Energy Collapse)
              if (p.energy <= 0) {
                setGameState('GAMEOVER');
                triggerAudioSign('Red vital purgada', 'reset');
                // Save HighScore
                const savedMax = safeGetLocalStorage('orbi_high_score');
                const prevHighScore = savedMax ? parseInt(savedMax, 10) : 0;
                if (p.score > prevHighScore) {
                  safeSetLocalStorage('orbi_high_score', p.score.toString());
                  setStats(prev => ({ ...prev, highScore: p.score }));
                }
              }
            } else {
              // Decay exposure safely back to 0
              core.boundaryExposureTime = Math.max(0, core.boundaryExposureTime - (2 / 60) * dt);
            }

            // 3. Apply push forces towards the interior of the arena!
            if (inContainment && BOUNDARY_MODE === 'hybrid') {
              let pushX = 0;
              let pushY = 0;

              if (p.x < NEXUS_BOUNDARY.containmentDistance) {
                const hard = p.x < 35;
                pushX += hard ? NEXUS_BOUNDARY.hardPushForce : NEXUS_BOUNDARY.softPushForce;
              }
              if (p.x > worldWidth - NEXUS_BOUNDARY.containmentDistance) {
                const hard = p.x > worldWidth - 35;
                pushX -= hard ? NEXUS_BOUNDARY.hardPushForce : NEXUS_BOUNDARY.softPushForce;
              }
              if (p.y < NEXUS_BOUNDARY.containmentDistance) {
                const hard = p.y < 35;
                pushY += hard ? NEXUS_BOUNDARY.hardPushForce : NEXUS_BOUNDARY.softPushForce;
              }
              if (p.y > size - NEXUS_BOUNDARY.containmentDistance) {
                const hard = p.y > size - 35;
                pushY -= hard ? NEXUS_BOUNDARY.hardPushForce : NEXUS_BOUNDARY.softPushForce;
              }

              // Smoothly modify velocity towards center
              p.vx += pushX * dt * 5.5;
              p.vy += pushY * dt * 5.5;
            }

            // Hard clamping so that under no circumstance Orbi escapes outside the arena canvas
            const hardMargin = 15;
            if (p.x < hardMargin) { p.x = hardMargin; p.vx = 0; }
            if (p.x > worldWidth - hardMargin) { p.x = worldWidth - hardMargin; p.vx = 0; }
            if (p.y < hardMargin) { p.y = hardMargin; p.vy = 0; }
            if (p.y > size - hardMargin) { p.y = size - hardMargin; p.vy = 0; }
          }
        }

        if (boundaryFlag) {
          // Additional custom boundary hit ticks
        }

        if (p.gridBoundTicks > 0) p.gridBoundTicks -= 1 * dt;

        // Continuously interpolate actual length toward target length for smooth visual growth
        p.length = p.length * 0.95 + p.targetLength * 0.05;

        // Inverse Kinematics Body Segments trailing (Thicker seamless tapered Ribbon)
        let jointsNeeded = Math.min(
          PERFORMANCE_PROFILE[performanceProfile].maxTrailPoints,
          Math.floor(p.length)
        );

        if (core.gameMode === 'nexus_assault') {
          jointsNeeded = Math.floor(jointsNeeded * 1.30);
        }
        
        // Seed initial list if empty
        if (p.segments.length === 0) {
          for (let i = 0; i < jointsNeeded; ++i) {
            p.segments.push({
              x: p.x - Math.cos(p.angle) * i * 16,
              y: p.y - Math.sin(p.angle) * i * 16,
              angle: p.angle,
              size: 15
            });
          }
        }

        // Keep lengths aligned dynamically
        if (p.segments.length < jointsNeeded) {
          const last = p.segments[p.segments.length - 1] || p;
          p.segments.push({
            x: last.x,
            y: last.y,
            angle: p.angle,
            size: 14
          });
        } else if (p.segments.length > jointsNeeded) {
          p.segments.pop();
        }

        // Apply distance chain constraints (seamless energy ribbon trail)
        // Adaptive segment gap: segments contract at high speed, keeping ribbons continuous!
        const targetJointGap = Math.max(9, Math.min(18, 17 - (p.speed * 0.95)));

        for (let i = 0; i < p.segments.length; ++i) {
          const joint = p.segments[i];
          const prev = i === 0 ? p : p.segments[i - 1];

          const dx = joint.x - prev.x;
          const dy = joint.y - prev.y;
          const dist = Math.hypot(dx, dy);

          const angle = Math.atan2(dy, dx);

          if (dist > targetJointGap) {
            const targetX = prev.x + Math.cos(angle) * targetJointGap;
            const targetY = prev.y + Math.sin(angle) * targetJointGap;
            
            // Relaxed spring follow-through factor to eliminate high-frequency kinking and rigidness
            const followStrength = Math.min(0.95, 0.68 * dt);
            joint.x += (targetX - joint.x) * followStrength;
            joint.y += (targetY - joint.y) * followStrength;
          }
          
          // Interpolate angle smoothly for node graphics layout
          let diffAng = angle - joint.angle;
          while (diffAng < -Math.PI) diffAng += Math.PI * 2;
          while (diffAng > Math.PI) diffAng -= Math.PI * 2;
          joint.angle += diffAng * Math.min(0.95, 0.68 * dt);
          
          // Setup sizes: tapered ribbon sizes based on base widths and positions
          const ratio = 1 - (i / p.segments.length);
          const baseJointSize = p.evolution === 'SPARK' ? 12 : p.evolution === 'SOLAR_STREAM' ? 20 : p.evolution === 'GUARDIAN_SERPENT' ? 32 : 44;
          joint.size = baseJointSize * (0.35 + ratio * 0.65);
        }

        // Periodically spawn minimal elegant tail particles (flujo de plasma vivo)
        if (Math.random() < 0.28) {
          if (p.segments.length > 5) {
            const idx = Math.floor(Math.random() * p.segments.length);
            const seg = p.segments[idx];
            const r = 1 - (idx / p.segments.length);
            core.particles.push({
              id: Math.random().toString(36).substring(2, 7),
              x: seg.x + (Math.random() - 0.5) * 8,
              y: seg.y + (Math.random() - 0.5) * 8,
              vx: (Math.random() - 0.5) * 0.5 - Math.cos(seg.angle) * 0.4,
              vy: (Math.random() - 0.5) * 0.5 - Math.sin(seg.angle) * 0.4,
              color: theme.particleColor,
              size: 0.8 + Math.random() * 1.5,
              alpha: 0.65 * r,
              life: 0.8,
              decay: 0.02 + Math.random() * 0.03,
              type: 'TAIL_SPARK',
              glow: false
            });
          }
        }

        // Camera Tracking with LERP drift kinetics (smooth responsive parallax)
        const cam = core.camera;
        let camTargetX = p.x;
        let camTargetY = p.y;
        
        // Lead looking camera offset
        if (!core.victoryTriggered) {
          camTargetX += Math.cos(p.angle) * 85;
          camTargetY += Math.sin(p.angle) * 85;
        }

        cam.x += (camTargetX - cam.x) * QUALITY.cameraSmoothness * dt;
        cam.y += (camTargetY - cam.y) * QUALITY.cameraSmoothness * dt;

        // Smooth camera zoom: adjusts dynamically based on stage size and active cinematic awakening
        let desiredZoom = p.evolution === 'SPARK' ? 1.05 : p.evolution === 'SOLAR_STREAM' ? 0.95 : p.evolution === 'GUARDIAN_SERPENT' ? 0.85 : 0.75;
        if (core.evolutionCinematic && core.evolutionCinematic.active) {
          // Epic close-up zoom punch when evolution is ongoing
          desiredZoom = 1.35;
        }
        if (core.victoryTriggered) {
          desiredZoom = 1.45; // Special close-up on Orbi

          // Gradually dissolve corruption zones and spawn ascending gold particles
          core.corruptionZones.forEach(zone => {
            if (zone.intensity > 0) {
              zone.intensity = Math.max(0, zone.intensity - 0.05 * dt);
            }
          });

          if (Math.random() < 0.28 * dt) {
            core.particles.push({
              id: Math.random().toString(),
              x: p.x + (Math.random() - 0.5) * 160,
              y: p.y + (Math.random() - 0.5) * 160,
              vx: (Math.random() - 0.5) * 1.5,
              vy: -1.5 - Math.random() * 2.0, // Rising
              color: '#fbbf24', // Golden ascending particle
              size: 1.5 + Math.random() * 3.5,
              alpha: 1.0,
              life: 1.0,
              decay: 0.015 + Math.random() * 0.01,
              type: 'NEXUS_SPARK',
              glow: true
            });
          }
        }
        cam.zoom = cam.zoom * (1 - 0.05 * dt) + desiredZoom * (0.05 * dt);

        // Apply micro shakes
        if (cam.shakeTime > 0) {
          cam.shakeTime -= 1 * dt;
          cam.x += (Math.random() - 0.5) * cam.shakeIntensity;
          cam.y += (Math.random() - 0.5) * cam.shakeIntensity;
        }

        // Lock camera boundaries safely
        const halfW = dimensions.width / 2;
        const halfH = dimensions.height / 2;
        {
          if (cam.x < halfW) cam.x = halfW;
          if (cam.x > size - halfW) cam.x = size - halfW;
          if (cam.y < halfH) cam.y = halfH;
          if (cam.y > size - halfH) cam.y = size - halfH;
        }

        // Decay combo timer
        if (core.consecutiveTimer > 0) {
          core.consecutiveTimer -= (1 / 60) * dt;
          if (core.consecutiveTimer <= 0) {
            core.consecutiveCollects = 0;
            core.consecutiveTimer = 0;
          }
        }

        // Check solar / nexus / blackout orbs pickup
        core.orbs.forEach((orb) => {
          const dist = Math.hypot(p.x - orb.x, p.y - orb.y);
          if (dist < orb.radius + 28) {
            // Picked! Add metrics or subtract for blackout
            if (orb.type === 'BLACKOUT') {
              // RESET COMBO ON BLACKOUT HIT
              core.consecutiveCollects = 0;
              core.consecutiveTimer = 0;
              core.perfectPurgeEligible = false;

              // Subtract stats
              p.energy = Math.max(0, p.energy + orb.energyValue); // orb.energyValue is negative (-12)
              p.score = Math.max(0, p.score + orb.scoreValue); // orb.scoreValue is negative (-25)

              // Call reserve hook
              onBlackoutContact(orb.x, orb.y, 12);
              triggerAudioSign('Fuga de plasma', 'blackout');

              // Burst of dark purple sparks
              triggerBurstSparks(orb.x, orb.y, '#a855f7', 'BLACKOUT_SMOKE', 12);

              // Soft camera feedback
              core.camera.shakeTime = 6;
              core.camera.shakeIntensity = 1.8;

              // Create floating loss text
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: orb.x,
                y: orb.y - 12,
                text: 'BLACKOUT HIT',
                color: '#ef4444',
                life: 1.2,
                size: 14
              });

            } else {
              // POSITIVE ORB COLLECTION: Solar or Nexus
              if (tutorialEnabled && activeTutorialStep === 'collect_energy') {
                markTutorialStepCompleted('collect_energy');
              }
              core.consecutiveCollects++;
              core.consecutiveTimer = COMBO_CONFIG.windowSeconds;

              // Calculate combo multiplier
              const multiplier = Math.min(
                COMBO_CONFIG.maxMultiplier,
                1.0 + (core.consecutiveCollects - 1) * COMBO_CONFIG.pointMultiplierStep
              );

              const finalPoints = Math.round(orb.scoreValue * multiplier);
              p.score += finalPoints;

              let energyAwarded = 0;
              if (core.gameMode === 'demo') {
                energyAwarded = getRedVitalEvolutionEnergyValue(orb.type || '');
                const prevEnergy = core.redVitalEvolutionEnergy || 0;
                const previousStage = core.redVitalVisualStage || 1;
                
                core.redVitalEvolutionEnergy = prevEnergy + energyAwarded;
                
                let evo = getRedVitalLockedEvolutionState(core.redVitalEvolutionEnergy);
                let nextStage = evo.stage;
                
                if (nextStage > previousStage + 1) {
                  console.warn("[RED VITAL EVOLUTION LOCK] Illegal jump prevented in main collect", { previousStage, nextStage, energy: core.redVitalEvolutionEnergy });
                  nextStage = previousStage + 1;
                  const targetThreshold = RED_VITAL_EVOLUTION_LOCKED_THRESHOLDS.find(t => t.stage === nextStage);
                  if (targetThreshold) {
                    core.redVitalEvolutionEnergy = targetThreshold.requiredEnergy;
                  }
                  evo = getRedVitalLockedEvolutionState(core.redVitalEvolutionEnergy);
                }
                
                core.redVitalVisualStage = evo.stage;
                core.redVitalInternalCoreCount = evo.coreCount;
                p.pickupEvolutionEnergy = core.redVitalEvolutionEnergy;
                p.energy = Math.min(220, p.energy + energyAwarded * 10);
                
                if (evo.stage > previousStage) {
                  triggerAudioSign('Orbi evolucionado', 'evolve');
                  showTemporaryMessage(`EVOLUCIÓN ENERGÉTICA: E${evo.stage}`);
                  triggerBurstSparks(p.x, p.y, '#ffd166', 'COLLECT_SHOCKWAVE', 25);
                }
              } else {
                const solarBonus = (orb.type === 'SOLAR' && core.activeGuardian === 'FOTON') ? 1.15 : 1.0;
                energyAwarded = Math.round(orb.energyValue * theme.energyModifier * solarBonus);
                const prevEnergy = p.pickupEvolutionEnergy || 0;
                p.pickupEvolutionEnergy = prevEnergy + energyAwarded;
                p.energy = Math.min(220, p.energy + energyAwarded);
              }
              
              // Increment segments target lengths
              p.targetLength = Math.min(60, p.targetLength + (orb.type === 'SOLAR' ? 0.35 : 1.5));
              p.length = p.length * 0.95 + p.targetLength * 0.05;

              // Trigger beautiful shiny spark bursts
              const sparkColor = orb.type === 'SOLAR' ? '#ffd166' : '#22d3ee';
              triggerBurstSparks(orb.x, orb.y, sparkColor, orb.type === 'SOLAR' ? 'SOLAR_SPARK' : 'NEXUS_SPARK', 14);

              // Spawn beautiful outward expanding radial shockwave ring
              core.particles.push({
                id: Math.random().toString(36).substring(2, 7),
                x: orb.x,
                y: orb.y,
                vx: 0,
                vy: 0,
                color: sparkColor,
                size: orb.radius * 2,
                alpha: 1.0,
                life: 1.0,
                decay: 0.04, // fast decay
                type: 'COLLECT_SHOCKWAVE',
                glow: false
              });

              // Minor camera tactile punch on collections
              core.camera.shakeTime = Math.max(core.camera.shakeTime, 5);
              core.camera.shakeIntensity = Math.max(core.camera.shakeIntensity, 2.0);

              // Call empty reserve hooks for module system
              if (orb.type === 'SOLAR') {
                onEnergyCollect(orb.x, orb.y, energyAwarded);
                triggerAudioSign('Carga solar absorbida', 'solar');
              } else {
                onNexusOrbCollect(orb.x, orb.y, finalPoints);
                triggerAudioSign('Cristal Nexus decodificado', 'nexus');
                // Extra visual zoom punch on Nexus orbs
                core.camera.zoom = Math.min(1.4, core.camera.zoom + 0.06);
              }

              // Create floating overlay texts
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: orb.x,
                y: orb.y - 12,
                text: `+${finalPoints} PTS`,
                color: sparkColor,
                life: 1.0,
                size: 14
              });

              // If combo increases, show extra multiplier floating badge and trigger hook
              if (core.consecutiveCollects >= 2) {
                onComboIncrease();
                core.floatingTexts.push({
                  id: Math.random().toString(),
                  x: orb.x,
                  y: orb.y - 28,
                  text: `COMBO x${core.consecutiveCollects}!`,
                  color: '#fbbf24',
                  life: 1.2,
                  size: 12
                });
              }
            }

            // Relocate orb
            if (core.gameMode === 'nexus_assault') {
              orb.collected = true;
            } else {
              orb.x = 120 + Math.random() * (size - 240);
              orb.y = 120 + Math.random() * (size - 240);
              while (Math.hypot(orb.x - p.x, orb.y - p.y) < 320) {
                orb.x = 120 + Math.random() * (size - 240);
                orb.y = 120 + Math.random() * (size - 240);
              }
            }
          }
        });

        if (core.gameMode === 'nexus_assault') {
          core.orbs = core.orbs.filter((orb) => !orb.collected);
        }

        if (core.gameMode === 'nexus_assault') {
          updateNexusAssault(dt);
        } else {
          if (core.gameMode === 'infinite') {
            updateSurvivalMode(dt);
          }
          // Check obstacles collision and damage penalties
          p.damageCooldown = Math.max(0, p.damageCooldown - 1 * dt);

          core.obstacles.forEach((obs) => {
          // If frozen by Terra nature roots or Termo heat, spin is locked and has sparkles around it
          if (obs.frozenTicks && obs.frozenTicks > 0) {
            obs.frozenTicks -= 1 * dt;
            obs.rotation += obs.spinSpeed * 0.15 * dt;
            if (Math.random() < 0.1) {
              const isTermo = core.activeGuardian === 'TERMO';
              const particleColor = isTermo ? '#ff6a2a' : '#10b981';
              const particleType = isTermo ? 'SOLAR_SPARK' : 'TERRA_LEAF';
              triggerBurstSparks(obs.x, obs.y, particleColor, particleType, 1);
            }
          } else {
            obs.rotation += obs.spinSpeed * dt;
          }

          // Check suppression state first (neutralized by Foton's Solar Pulse)
          const nowMs = performance.now();
          const isSuppressed = obs.suppressedUntil !== undefined && obs.suppressedUntil > nowMs;
          if (isSuppressed) return; // Immune to suppressed obstacle collisions!

          const dist = Math.hypot(p.x - obs.x, p.y - obs.y);
          if (dist < obs.radius + 18) {
            // Collision! Hurt player if cooldown over
            if (p.damageCooldown <= 0) {
              // Terra resistance modifier (takes 20% less damage)
              let damageFactor = theme.resistanceModifier;
              if (p.evolution === 'GUARDIAN_SERPENT') {
                damageFactor *= (1 - NEXUS_GUARDIAN_RESISTANCE.blackoutDamageReduction);
              }
              const damageTaken = Math.round(obs.energyDamage * damageFactor);
              p.energy = Math.max(0, p.energy - damageTaken);
              p.score = Math.max(0, p.score - obs.scorePenalty);
              p.damageCooldown = 60; // 1 second cooling
              p.ticksSinceLastDamage = 0;

              // RESET COMBO ON DAMAGE TAKEN
              core.consecutiveCollects = 0;
              core.consecutiveTimer = 0;
              core.perfectPurgeEligible = false;

              // Core hook trigger for module system
              onBlackoutContact(obs.x, obs.y, damageTaken);

              // Camera and audio feedback
              core.camera.shakeTime = 18;
              core.camera.shakeIntensity = 14;
              triggerAudioSign('Fuga de plasma (DAÑO)', 'blackout');

              // Hurt particles
              triggerBurstSparks(p.x, p.y, '#f43f5e', 'BLACKOUT_SMOKE', 22);

              // Flash screen
              setDamageFlashing(true);
              setTimeout(() => setDamageFlashing(false), 240);

              // Substract segment length as physical decay
              p.targetLength = Math.max(8, p.targetLength - 1.5);
              p.length = Math.max(8, p.length - 1.5);

              // Create floating loss text
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: obs.x,
                y: obs.y - 12,
                text: `-${damageTaken}% ENERGÍA`,
                color: '#f43f5e',
                life: 1.0,
                size: 15
              });

              if (p.energy <= 0) {
                setGameState('GAMEOVER');
                triggerAudioSign('Red vital purgada', 'reset');

                // Record High Score to local cache
                const savedMax = safeGetLocalStorage('orbi_high_score');
                const prevHighScore = savedMax ? parseInt(savedMax, 10) : 0;
                if (p.score > prevHighScore) {
                  safeSetLocalStorage('orbi_high_score', p.score.toString());
                  setStats(prev => ({ ...prev, highScore: p.score }));
                }
              }
            }
          }
        });

        // --------------------------------------------------------
        // BLACKOUT THREAT SYSTEM & EVENTS
        // --------------------------------------------------------
        // Calculate Threat Level
        core.timeElapsed += (1 / 60) * dt;

        // Process Corrupted Core Sentinel State Machine
        if (core.sentinel) {
          updateSentinel(dt);
        } else if (core.statsExtra.sentinelsEncountered === 0) {
          // Verify Sentinel spawning conditions
          const purifiedZonesCount = core.corruptionZones.filter(z => z.purifiedAmount >= 100).length;
          const isSolarStreamOrBetter = p.evolution === 'SOLAR_STREAM' || p.evolution === 'GUARDIAN_SERPENT' || p.evolution === 'TITAN_SERPENT';
          
          if (core.timeElapsed >= SENTINEL_SPAWN_CONFIG.minTimeSeconds &&
              purifiedZonesCount >= SENTINEL_SPAWN_CONFIG.requiredPurifiedZones &&
              isSolarStreamOrBetter &&
              core.threatLevel >= 3) {
            spawnSentinel();
          }
        }

        // Count unpurified Blackout Orbs
        const blackoutOrbsCount = core.orbs.filter(o => o.type === 'BLACKOUT').length;
        // Count active Blackout obstacles (obstacles)
        const obstacleCount = core.obstacles.length;

        // Threat value calculation
        let threatScore = core.timeElapsed; // 1 point per second
        threatScore += p.energy * BLACKOUT_THREAT_CONFIG.energyInfluence;

        // Evolution influence
        const evoInfluence = p.evolution === 'TITAN_SERPENT' ? 60 :
                             p.evolution === 'GUARDIAN_SERPENT' ? 35 :
                             p.evolution === 'SOLAR_STREAM' ? 15 : 0;
        threatScore += evoInfluence;

        // Blackout elements counts
        threatScore += blackoutOrbsCount * 8;
        threatScore += obstacleCount * 5;

        // Map threatScore to level
        let newThreatLevel: BlackoutThreatLevel = 0;
        if (tutorialEnabled) {
          if (core.timeElapsed >= 140) {
            newThreatLevel = 3;
          } else if (core.timeElapsed >= 80) {
            newThreatLevel = 2;
          } else if (core.timeElapsed >= 40) {
            newThreatLevel = 1;
          }
        } else {
          if (core.timeElapsed >= BLACKOUT_THREAT_CONFIG.level3Time || threatScore >= 160) {
            newThreatLevel = 3;
          } else if (core.timeElapsed >= BLACKOUT_THREAT_CONFIG.level2Time || threatScore >= 95) {
            newThreatLevel = 2;
          } else if (core.timeElapsed >= BLACKOUT_THREAT_CONFIG.level1Time || threatScore >= 45) {
            newThreatLevel = 1;
          }
        }

        // Limit maximum threat level to config
        newThreatLevel = Math.min(newThreatLevel, BLACKOUT_THREAT_CONFIG.maxThreatLevel) as BlackoutThreatLevel;

        // Trigger notifications and audio cues on threat level change
        if (newThreatLevel !== core.threatLevel) {
          core.threatLevel = newThreatLevel;
          if (newThreatLevel === 1) {
            showTemporaryMessage("BLACKOUT SIGNAL DETECTED");
            triggerAudioSign("Blackout Level 1", 'blackout');
          } else if (newThreatLevel === 2) {
            showTemporaryMessage("BLACKOUT SURGE INCOMING");
            triggerAudioSign("Blackout Level 2", 'blackout');
          } else if (newThreatLevel === 3) {
            showTemporaryMessage("RED VITAL COMPROMISED");
            triggerAudioSign("Blackout Level 3", 'blackout');
          }
        }

        // Scheduling Corruption Zones and Blackout Surges
        const frameTick = Math.floor(core.timeElapsed * 60);
        let zoneSpawnInterval = tutorialEnabled ? 3600 : 2100; // ~60 seconds vs ~35 seconds
        let surgeSpawnInterval = tutorialEnabled ? 4800 : 3000; // ~80 seconds vs ~50 seconds

        if (core.threatLevel === 1) {
          zoneSpawnInterval = tutorialEnabled ? 3000 : 1800; // 50 seconds vs 30 seconds
          surgeSpawnInterval = tutorialEnabled ? 4200 : 2700; // 70 seconds vs 45 seconds
        } else if (core.threatLevel === 2) {
          zoneSpawnInterval = tutorialEnabled ? 2400 : 1300; // 40 seconds vs ~21 seconds
          surgeSpawnInterval = tutorialEnabled ? 3000 : 1800; // 50 seconds vs 30 seconds
        } else if (core.threatLevel === 3) {
          zoneSpawnInterval = tutorialEnabled ? 1800 : 900;  // 30 seconds vs 15 seconds
          surgeSpawnInterval = tutorialEnabled ? 2400 : 1200; // 40 seconds vs 20 seconds
        }

        // Trigger zone spawn if we are in threat level >= 1
        if (core.threatLevel >= 1 && frameTick % zoneSpawnInterval === 0) {
          spawnCorruptionZone();
        }

        // Trigger surge spawn if we are in threat level >= 1
        if (core.threatLevel >= 1 && frameTick % surgeSpawnInterval === 0 && !core.surgeActive) {
          triggerBlackoutSurge();
        }

        // Update Corruption Zones
        core.corruptionZones.forEach((zone) => {
          if (zone.formingTimer !== undefined && zone.formingTimer > 0) {
            zone.formingTimer -= 1 * dt;
            if (zone.formingTimer <= 0) {
              zone.formingTimer = undefined;
              zone.active = true;
              triggerBurstSparks(zone.x, zone.y, '#a855f7', 'BLACKOUT_SMOKE', 20);
            }
          } else if (zone.active) {
            zone.duration += (1 / 60) * dt;

            // Generate particles inside active zone
            if (Math.random() < 0.12 * dt) {
              const ang = Math.random() * Math.PI * 2;
              const r = Math.random() * zone.radius;
              core.particles.push({
                id: Math.random().toString(),
                x: zone.x + Math.cos(ang) * r,
                y: zone.y + Math.sin(ang) * r,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                color: '#a855f7',
                size: 2 + Math.random() * 4,
                alpha: 0.8,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type: 'BLACKOUT_SMOKE'
              });
            }

            // Spawning blackout orbs inside active zone occasionally
            if (Math.floor(zone.duration * 60) % 240 === 0 && Math.random() < 0.7) {
              const ang = Math.random() * Math.PI * 2;
              const r = Math.random() * (zone.radius - 20);
              const orbX = zone.x + Math.cos(ang) * r;
              const orbY = zone.y + Math.sin(ang) * r;

              if (Math.hypot(orbX - p.x, orbY - p.y) > 120) {
                core.orbs.push({
                  id: Math.random().toString(),
                  x: orbX,
                  y: orbY,
                  type: 'BLACKOUT',
                  radius: 8,
                  pulsePhase: Math.random() * Math.PI,
                  pulseSpeed: 0.05,
                  glowSize: 20,
                  energyValue: -12,
                  scoreValue: -25
                });
              }
            }
          }
        });

        // Filter and process purified/completed corruption zones
        core.corruptionZones = core.corruptionZones.filter((zone) => {
          if (zone.purifiedAmount >= zone.requiredPurification) {
            // ZONE PURIFIED!
            const mult = core.threatLevel >= 3 ? 1.5 : 1.0;
            const scoreReward = Math.round(CORRUPTION_ZONE_REWARD.score * mult);
            const energyReward = Math.round(CORRUPTION_ZONE_REWARD.energy * mult);

            p.score += scoreReward;
            p.energy = Math.min(220, p.energy + energyReward);
            core.consecutiveCollects += CORRUPTION_ZONE_REWARD.comboBoost;
            core.consecutiveTimer = COMBO_CONFIG.windowSeconds;

            core.statsExtra.zonesPurified++;

            // Shiny reward explosions
            triggerBurstSparks(zone.x, zone.y, '#22d3ee', 'GRID_GLOW', 30);
            triggerBurstSparks(zone.x, zone.y, '#fbbf24', 'SOLAR_SPARK', 25);

            core.camera.shakeTime = 12;
            core.camera.shakeIntensity = 4.0;

            // Display floating text
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: zone.x,
              y: zone.y - 40,
              text: 'ZONA PURIFICADA',
              color: '#22d3ee',
              life: 2.0,
              size: 20
            });
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: zone.x,
              y: zone.y - 15,
              text: 'THE NEXUS BREATHES AGAIN',
              color: '#fbbf24',
              life: 2.0,
              size: 11
            });

            triggerAudioSign("Zona purificada", 'solar');
            return false;
          }

          if (zone.duration >= zone.maxDuration) {
            triggerBurstSparks(zone.x, zone.y, '#6b21a8', 'BLACKOUT_SMOKE', 25);
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: zone.x,
              y: zone.y - 20,
              text: 'CORRUPCIÓN EXPANDIDA',
              color: '#a855f7',
              life: 1.5,
              size: 14
            });
            return false;
          }

          return true;
        });

        // Update Blackout Surge Event
        if (core.surgeActive) {
          core.surgeTimer -= (1 / 60) * dt;
          if (core.surgeTimer <= 0) {
            core.surgeActive = false;
            core.surgeTimer = 0;
            core.statsExtra.blackoutSurgesSurvived++;

            if (core.perfectPurgeEligible) {
              const pointsBonus = 500;
              p.score += pointsBonus;
              core.consecutiveCollects += 3;
              core.consecutiveTimer = COMBO_CONFIG.windowSeconds + 2;

              triggerBurstSparks(p.x, p.y, '#fbbf24', 'EVOLUTION_EXPLOSION', 35);
              triggerBurstSparks(p.x, p.y, '#22d3ee', 'GRID_GLOW', 25);

              core.floatingTexts.push({
                id: Math.random().toString(),
                x: p.x,
                y: p.y - 45,
                text: 'PERFECT PURGE',
                color: '#fbbf24',
                life: 2.5,
                size: 24
              });

              triggerAudioSign("Purga perfecta", 'evolve');
            } else {
              core.floatingTexts.push({
                id: Math.random().toString(),
                x: p.x,
                y: p.y - 30,
                text: 'SURGE SOBREVIVIDO',
                color: '#cbd5e1',
                life: 1.5,
                size: 14
              });
            }
          }
        }

        // Decay temporary obstacles
        core.obstacles.forEach((obs) => {
          if (obs.temporary && obs.lifetime !== undefined) {
            obs.lifetime -= (1 / 60) * dt;
          }
        });
        core.obstacles = core.obstacles.filter(obs => !obs.temporary || (obs.lifetime !== undefined && obs.lifetime > 0));

        // Update extra metrics
        core.statsExtra.maxCombo = Math.max(core.statsExtra.maxCombo, core.consecutiveCollects);
        const stageLevels: Record<EvolutionName, number> = { SPARK: 1, SOLAR_STREAM: 2, GUARDIAN_SERPENT: 3, TITAN_SERPENT: 4 };
        if (stageLevels[p.evolution] > stageLevels[core.statsExtra.maxEvolution]) {
          core.statsExtra.maxEvolution = p.evolution;
        }

        // Handle auto-evolution thresholds sequentially
        let desiredStage: EvolutionName = 'SPARK';
        if (p.energy >= EVOLUTION_STAGES.TITAN_SERPENT.minEnergy) {
          desiredStage = 'TITAN_SERPENT';
        } else if (p.energy >= EVOLUTION_STAGES.GUARDIAN_SERPENT.minEnergy) {
          desiredStage = 'GUARDIAN_SERPENT';
        } else if (p.energy >= EVOLUTION_STAGES.SOLAR_STREAM.minEnergy) {
          desiredStage = 'SOLAR_STREAM';
        }

        if (desiredStage !== p.evolution) {
          // If moving from SPARK to SOLAR_STREAM, trigger micro-cinematic
          if (p.evolution === 'SPARK' && desiredStage === 'SOLAR_STREAM') {
            onEvolutionAwakened();
            core.evolutionCinematic = {
              active: true,
              timer: 90, // 1.5 seconds at 60fps duration
              stage: 'SOLAR_STREAM'
            };
            
            setEvolveOverlay({
              visible: true,
              title: 'SOLAR STREAM AWAKENED',
              subtitle: 'THE NEXUS RESPONDS'
            });
            setTimeout(() => {
              setEvolveOverlay(prev => ({ ...prev, visible: false }));
            }, 1500);
          } else if (desiredStage === 'GUARDIAN_SERPENT') {
            onNexusGuardianAwakened();
            core.statsExtra.nexusGuardianReached = true;
            core.evolutionCinematic = {
              active: true,
              timer: 135, // ~2.25 seconds duration
              stage: 'GUARDIAN_SERPENT'
            };
            
            const hasPurifiedZone = core.statsExtra.zonesPurified >= NEXUS_GUARDIAN_REQUIREMENTS.optionalPurifiedZones;
            const hasSurvivedSurge = core.statsExtra.blackoutSurgesSurvived >= NEXUS_GUARDIAN_REQUIREMENTS.optionalSurgesSurvived;
            
            let subtitle = 'FOTON ANSWERS THE RED VITAL';
            if (hasPurifiedZone || hasSurvivedSurge) {
              subtitle = 'FOTON RESONANCE DETECTED — THE RED VITAL AWAKENS';
              triggerBurstSparks(p.x, p.y, '#22d3ee', 'GRID_GLOW', 30);
              triggerBurstSparks(p.x, p.y, '#fbbf24', 'SOLAR_SPARK', 30);
            }
            
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: p.x,
              y: p.y - 70,
              text: '★ BONUS OBJECTIVE COMPLETE ★',
              color: '#22d3ee',
              life: 2.5,
              size: 20
            });
            core.floatingTexts.push({
              id: Math.random().toString(),
              x: p.x,
              y: p.y - 40,
              text: 'NEXUS GUARDIAN AWAKENED',
              color: '#fbbf24',
              life: 2.5,
              size: 18
            });

            setEvolveOverlay({
              visible: true,
              title: 'NEXUS GUARDIAN AWAKENED',
              subtitle: subtitle
            });
            setTimeout(() => {
              setEvolveOverlay(prev => ({ ...prev, visible: false }));
            }, 2250);
          }

          p.evolution = desiredStage;
          
          // Flash explosion of sparks!
          p.targetLength = EVOLUTION_STAGES[desiredStage].baseLength;
          p.length = EVOLUTION_STAGES[desiredStage].baseLength;
          
          triggerBurstSparks(p.x, p.y, '#ffffff', 'EVOLUTION_EXPLOSION', 45);
          triggerAudioSign(`Evolución: ${theme.evolutionNames[desiredStage]}`, 'evolve');
          
          // Camera punch
          core.camera.shakeTime = 24;
          core.camera.shakeIntensity = 10;
        }
      }

        // Ticking down floating texts (Performance Budget: max 5 active, expire oldest)
        core.floatingTexts = core.floatingTexts
          .map(t => {
            t.y -= 1.0 * dt;
            t.life -= 0.02 * dt;
            return t;
          })
          .filter(t => t.life > 0);

        if (core.floatingTexts.length > 5) {
          core.floatingTexts.splice(0, core.floatingTexts.length - 5);
        }

        // Update particle physics simulation
        core.particles = core.particles
          .map(pt => {
            pt.x += pt.vx * dt;
            pt.y += pt.vy * dt;
            pt.alpha -= pt.decay * dt;
            pt.life -= pt.decay * dt;
            return pt;
          })
          .filter(pt => pt.alpha > 0);
        }

        // REBOOT 0.9 — Performance Cap Particles (Part 11) (Respect lowEffectsMode limit)
        const maxAllowedParticles = core.lowEffectsMode ? 15 : PERFORMANCE_PROFILE[performanceProfile].maxParticles;
        if (core.particles.length > maxAllowedParticles) {
          core.particles = core.particles.slice(core.particles.length - maxAllowedParticles);
        }

        // Sync particle counts to state for debugging UI
        if (Math.floor(now) % 30 === 0) {
          setActiveParticlesCount(core.particles.length);
        }

        // Sync display scores to React Hook state (throttled/batched by React)
        if (Math.floor(now) % 8 === 0) {
          setStats({
            score: p.score,
            energy: p.energy,
            highScore: Math.max(stats.highScore, p.score),
            length: core.gameMode === 'vital_flow' ? Math.floor(p.length) : Math.max(8, Math.floor(p.length)),
            evolution: p.evolution,
            comboCount: core.consecutiveCollects,
            comboTimer: core.consecutiveTimer,
            visualStage: p.visualProfile?.stage,
            visualLabel: p.visualProfile?.label
          });

          // Sync Corrupted Core Sentinel state to HUD
          if (core.sentinel) {
            setSentinelUI({
              health: core.sentinel.health,
              maxHealth: core.sentinel.maxHealth,
              shield: core.sentinel.shield,
              maxShield: core.sentinel.maxShield,
              phase: core.sentinel.phase as any,
              defeated: core.sentinel.defeated
            });
          } else {
            setSentinelUI(null);
          }
        }

        // Evaluate demo objective completions and victory transitions
        if (core.gameMode !== 'nexus_assault') {
          updateObjectives(dt);
        }
      }

      // --------------------------------------------------------
      // RENDER CANVAS (REBOOT 0.9 — HD Responsive Scaling & DPR)
      // --------------------------------------------------------
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) {
        const rawDpr = window.devicePixelRatio || 1;
        let maxDpr = CANVAS_RENDER_CONFIG.maxDprDesktop;
        if (performanceProfile === 'lowEnd') {
          maxDpr = CANVAS_RENDER_CONFIG.maxDprLowEnd;
        } else if (viewport.deviceProfile === 'mobile') {
          maxDpr = CANVAS_RENDER_CONFIG.maxDprMobile;
        }
        const dpr = Math.min(rawDpr, maxDpr);

        const expectedW = Math.floor(dimensions.width * dpr);
        const expectedH = Math.floor(dimensions.height * dpr);

        if (canvas.width !== expectedW || canvas.height !== expectedH) {
          canvas.width = expectedW;
          canvas.height = expectedH;
        }

        ctx.imageSmoothingEnabled = true;

        ctx.save();
        ctx.scale(dpr, dpr);

        // Clear viewport with pure cosmic depth radial gradients
        ctx.fillStyle = '#020617';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
        
        // Center camera coordinates inside standard viewport translation matrix with scaling
        const cam = core.camera;
        const { viewW, viewH, zoom: renderZoom, centerX: renderCenterX, centerY: renderCenterY } = getViewportCamera();
        ctx.translate(viewW / 2, viewH / 2);
        ctx.scale(renderZoom, renderZoom);
        ctx.translate(-renderCenterX, -renderCenterY);

        if (core.gameMode === 'vital_flow') {
          renderVitalFlow(ctx, dt);
        } else if (core.gameMode === 'nexus_assault') {
          // Capa 1 & 2: Space Gradient with cinematic gas nebulas (Atmospheric Depth)
          drawSpaceAtmosphereNebula(ctx, cam);
          drawNexusAssaultRoom(ctx, dt);
          // Render Player Avatar (Orbi Foton Flow - Ribbon + reactor core + stage wings)
          drawPremiumOrbiSerpent(ctx);

          // Active Ability ripple ring waves
          drawActiveAbilityRipples(ctx);

          // Render Particle system glows
          drawCosmicParticlesGlow(ctx);

          // Render floating overlay indicators texts
          drawFloatingTextsOverlays(ctx);
        } else {
          // Capa 1 & 2: Space Gradient with cinematic gas nebulas (Atmospheric Depth)
          drawSpaceAtmosphereNebula(ctx, cam);
          // Render Corruption Zones
          drawCorruptionZones(ctx);

          // Capa 3: Subtle Red Vital Network curved pathways
          drawSubtleCurvesVitalNetwork(ctx);

          // Render food Orbs
          drawIntenseHighGlowOrbs(ctx);

          // Render obstacles
          drawBlackoutSingularities(ctx);

          // Render survival mode anti-serpents
          if (core.gameMode === 'infinite') {
            drawBlackoutEventVisuals(ctx, dt);
            drawSurvivalProjectilesAndHazards(ctx);
            drawSurvivalAntiSerpents(ctx);
          }

          // Render Corrupted Core Sentinel if active
          if (core.sentinel) {
            drawSentinel(ctx);
          }

          // Render Player Avatar (Orbi Foton Flow - Ribbon + reactor core + stage wings)
          drawPremiumOrbiSerpent(ctx);

          // Active Ability ripple ring waves
          drawActiveAbilityRipples(ctx);

          // Render Particle system glows
          drawCosmicParticlesGlow(ctx);

          // Render floating overlay indicators texts
          drawFloatingTextsOverlays(ctx);
        }

        ctx.restore();
      }
    };

    animId = requestAnimationFrame(gameLoop);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, gameState, selectedGuardian]);

  // Capa 1 & 2: Deep space gradient + soft colored glowing nebulae
  const drawSpaceAtmosphereNebula = (ctx: CanvasRenderingContext2D, camera: Camera) => {
    const core = stateRef.current;
    const size = core.arenaSize;
    const width = core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : size;
    const wind = core.vitalEnergyWind;

    // Layer 1: Dark cosmic base quadrant
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : size, size);

    // Layer 2: Glowing soft gas clouds (Nebulizaciones adaptadas al perfil de rendimiento)
    const detail = PERFORMANCE_PROFILE[performanceProfile].backgroundDetail;
    const nebulas = [];
    if (detail === 'high') {
      nebulas.push(
        { x: width * 0.25, y: size * 0.25, r: 580, color: 'rgba(32, 214, 255, 0.08)' }, // Cyan glow
        { x: width * 0.75, y: size * 0.70, r: 680, color: 'rgba(124, 77, 255, 0.08)' }, // Violet glow
        { x: width * 0.50, y: size * 0.50, r: 500, color: 'rgba(251, 191, 36, 0.04)' },  // Gold glow
        { x: width * 0.20, y: size * 0.80, r: 620, color: 'rgba(14, 165, 233, 0.07)' },  // Hydro blue
        { x: width * 0.82, y: size * 0.22, r: 590, color: 'rgba(16, 185, 129, 0.06)' }   // Aero green
      );
    } else if (detail === 'medium') {
      nebulas.push(
        { x: width * 0.25, y: size * 0.25, r: 580, color: 'rgba(32, 214, 255, 0.08)' },
        { x: width * 0.75, y: size * 0.70, r: 680, color: 'rgba(124, 77, 255, 0.08)' },
        { x: width * 0.50, y: size * 0.50, r: 500, color: 'rgba(251, 191, 36, 0.04)' }
      );
    } else { // low
      nebulas.push(
        { x: width * 0.50, y: size * 0.50, r: 500, color: 'rgba(32, 214, 255, 0.04)' }
      );
    }

    ctx.save();
    nebulas.forEach((neb, i) => {
      // Slow drifting wind kinetics for ambient space depth
      const driftX = Math.sin(wind * 0.12 + i) * 35;
      const driftY = Math.cos(wind * 0.12 + i) * 35;

      const grad = ctx.createRadialGradient(
        neb.x + driftX, neb.y + driftY, 5,
        neb.x + driftX, neb.y + driftY, neb.r + Math.sin(wind * 0.25 + i) * 30
      );
      grad.addColorStop(0, neb.color);
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(neb.x + driftX, neb.y + driftY, neb.r * 1.25, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // Draw pulsing violet/crimson ambient background overlay if Surge is active or Threat is high
    if (core.surgeActive || core.threatLevel >= 2) {
      const pulseSpeed = core.surgeActive ? 0.005 : 0.002;
      const alphaVal = (core.surgeActive ? 0.10 : 0.05) * (0.5 + 0.5 * Math.sin(performance.now() * pulseSpeed));
      ctx.fillStyle = core.threatLevel === 3 ? `rgba(220, 38, 38, ${alphaVal * 0.35})` : `rgba(124, 77, 255, ${alphaVal})`;
      ctx.fillRect(0, 0, size, size);
    }

    // Ambient floating starfield dust (Layer 4 Parallax Stars)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
    core.bgParticles.forEach(p => {
      // Parallax effect using subtle camera offset ratios
      const shiftX = (p.x - camera.x) * 0.06;
      const shiftY = (p.y - camera.y) * 0.06;
      ctx.beginPath();
      ctx.arc(camera.x + shiftX, camera.y + shiftY, 0.95, 0, Math.PI * 2);
      ctx.fill();
    });

    // Medium parallax stardust clusters
    ctx.fillStyle = GUARDIAN_THEMES[core.activeGuardian].primaryColor;
    ctx.save();
    core.middleParticles.forEach((p, idx) => {
      const shiftX = (p.x - camera.x) * 0.12;
      const shiftY = (p.y - camera.y) * 0.12;
      ctx.globalAlpha = 0.22 + Math.sin(wind * 0.5 + idx) * 0.1;
      ctx.beginPath();
      ctx.arc(camera.x + shiftX, camera.y + shiftY, 2.2 + Math.sin(wind * 0.4 + idx) * 0.8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  // Render Corruption Zones
  const drawCorruptionZones = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    
    ctx.save();
    core.corruptionZones.forEach((zone) => {
      // 1. If forming (warning state)
      if (zone.formingTimer !== undefined && zone.formingTimer > 0) {
        // Draw dashed, blinking violet/red warning circle
        const flash = Math.floor(zone.formingTimer / 4) % 2 === 0;
        ctx.strokeStyle = flash ? 'rgba(168, 85, 247, 0.75)' : 'rgba(239, 68, 68, 0.25)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Pulsing indicator fill
        ctx.fillStyle = flash ? 'rgba(168, 85, 247, 0.05)' : 'rgba(239, 68, 68, 0.02)';
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, zone.radius, 0, Math.PI * 2);
        ctx.fill();

        // Warning text label "CORRUPTION FORMING"
        ctx.fillStyle = 'rgba(216, 180, 254, 0.85)';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('! CORRUPCIÓN DETECTADA !', zone.x, zone.y);
      } 
      // 2. If fully active
      else if (zone.active) {
        const pulse = Math.sin(performance.now() * 0.003) * 15;
        const radiusWithPulse = zone.radius + pulse;

        // Draw radial gradient representing the aura
        const grad = ctx.createRadialGradient(
          zone.x, zone.y, 5,
          zone.x, zone.y, radiusWithPulse
        );
        
        // Intensity determines color strength
        const maxAlpha = 0.15 + zone.intensity * 0.15;
        grad.addColorStop(0, `rgba(124, 77, 255, ${maxAlpha})`); // deep violet core
        grad.addColorStop(0.5, `rgba(168, 85, 247, ${maxAlpha * 0.5})`);
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, radiusWithPulse, 0, Math.PI * 2);
        ctx.fill();

        // Outer border of zone
        ctx.strokeStyle = 'rgba(124, 77, 255, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(zone.x, zone.y, radiusWithPulse, 0, Math.PI * 2);
        ctx.stroke();

        // Draw active purification progress ring inside the zone
        const angleEnd = (zone.purifiedAmount / zone.requiredPurification) * Math.PI * 2;
        if (angleEnd > 0) {
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.65)'; // Cyan progress ring
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.arc(zone.x, zone.y, zone.radius - 12, -Math.PI / 2, -Math.PI / 2 + angleEnd);
          ctx.stroke();
        }

        // Draw small floating label representing current purification percentage
        ctx.fillStyle = 'rgba(168, 85, 247, 0.9)';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(
          `CORRUPCIÓN ACTIVADA: ${Math.round((1 - (zone.purifiedAmount / zone.requiredPurification)) * 100)}%`,
          zone.x, zone.y - 10
        );
      }
    });
    ctx.restore();
  };

  // Capa 3: Subtly curved pathways representing the living neural network
  const drawSubtleCurvesVitalNetwork = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    const nodes = core.vitalNodes;
    const conns = core.vitalConnections;
    const wind = core.vitalEnergyWind;

    if (!nodes || nodes.length === 0) return;

    ctx.save();
    
    // Draw Curved conduits with glowing photons flowing
    ctx.lineWidth = 1.0;
    
    conns.forEach((conn, index) => {
      const p1 = nodes[conn.p1];
      const p2 = nodes[conn.p2];
      if (p1 && p2) {
        // Curved quadratic midpoint oscillation
        const ctrlX = (p1.x + p2.x) / 2 + Math.sin(wind * 0.35 + index) * 45;
        const ctrlY = (p1.y + p2.y) / 2 + Math.cos(wind * 0.35 + index) * 45;

        // Very soft color cycles under <12% opacity (pulses brighter during evolution cinematic!)
        const isEvolveCinematic = core.evolutionCinematic && core.evolutionCinematic.active;
        const opacityMult = isEvolveCinematic ? 4.5 : 1.0;
        const colors = [
          `rgba(34, 211, 238, ${0.08 * opacityMult})`,
          `rgba(124, 77, 255, ${0.08 * opacityMult})`,
          `rgba(251, 191, 36, ${0.06 * opacityMult})`
        ];
        ctx.strokeStyle = colors[index % colors.length];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2.x, p2.y);
        ctx.stroke();

        // Traveling light photon pulse (curved sliding)
        const t = (wind * 0.25 + index * 0.15) % 1.0;
        const mt = 1 - t;
        // Bezier points formula
        const px = mt * mt * p1.x + 2 * mt * t * ctrlX + t * t * p2.x;
        const py = mt * mt * p1.y + 2 * mt * t * ctrlY + t * t * p2.y;

        // Draw shining photon flare on path
        const photonGrad = ctx.createRadialGradient(px, py, 0, px, py, 5);
        const glowColor = ['#22d3ee', '#7c4dff', '#fbbf24'][index % 3];
        photonGrad.addColorStop(0, '#ffffff');
        photonGrad.addColorStop(0.4, glowColor);
        photonGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = photonGrad;
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw active glowing nodes
    nodes.forEach((node, i) => {
      const pulse = 3.5 + Math.sin(wind * 1.3 + i) * 1.2;
      const theme = GUARDIAN_THEMES[core.activeGuardian];

      // Inner space node flare
      ctx.fillStyle = theme.auraColor;
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = theme.primaryColor;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse * 1.0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 1.0;
      ctx.beginPath();
      ctx.arc(node.x, node.y, pulse * 0.42, 0, Math.PI * 2);
      ctx.fill();
    });

    if (core.gameMode !== 'vital_flow') {
      // Simple, clean boundary warning ring (No grid blocks) replaced by dynamic Nexus Containment Field
      const margin = 35;
      const boundaryHeight = core.arenaSize - (margin * 2);
      const boundaryWidth = (core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : core.arenaSize) - (margin * 2);

      // Subtle ambient pulsars for the warning boundary
      const pulsePhase = Math.sin(core.vitalEnergyWind * 2.0) * 0.5 + 0.5;
      
      // Draw the main warning boundary (180px away from the absolute arena boundaries)
      ctx.strokeStyle = `rgba(34, 216, 255, ${0.04 + pulsePhase * 0.05})`;
      ctx.lineWidth = 1.0;
      ctx.strokeRect(NEXUS_BOUNDARY.warningDistance, NEXUS_BOUNDARY.warningDistance, (core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : core.arenaSize) - NEXUS_BOUNDARY.warningDistance * 2, core.arenaSize - NEXUS_BOUNDARY.warningDistance * 2);

      // Draw the containment boundary (60px away)
      ctx.strokeStyle = `rgba(124, 77, 255, ${0.1 + pulsePhase * 0.08})`;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(NEXUS_BOUNDARY.containmentDistance, NEXUS_BOUNDARY.containmentDistance, (core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : core.arenaSize) - NEXUS_BOUNDARY.containmentDistance * 2, core.arenaSize - NEXUS_BOUNDARY.containmentDistance * 2);

      // Draw the absolute containment shield (35px margin)
      // If player is in containment zone, let's pulse it bright and vibrate a bit!
      const distToEdge = Math.min(core.player.x, core.player.y, (core.gameMode === 'demo' || core.gameMode === 'infinite' ? core.arenaWidth : core.arenaSize) - core.player.x, core.arenaSize - core.player.y);
      const inContainmentZone = distToEdge < NEXUS_BOUNDARY.containmentDistance;
      const isSevereZone = distToEdge < 35 || (inContainmentZone && core.boundaryExposureTime > NEXUS_BOUNDARY.severeAfterSeconds);

      let shieldColor = 'rgba(34, 216, 255, 0.22)';
      let shieldWidth = 2.0;

      if (isSevereZone) {
        shieldColor = `rgba(239, 68, 68, ${0.65 + Math.sin(core.vitalEnergyWind * 6.0) * 0.15})`;
        shieldWidth = 4.5;
      } else if (inContainmentZone) {
        shieldColor = `rgba(245, 158, 11, ${0.45 + Math.sin(core.vitalEnergyWind * 4.0) * 0.1})`;
        shieldWidth = 3.0;
      }

      // Outer glow strokes
      ctx.strokeStyle = shieldColor;
      ctx.lineWidth = shieldWidth;
      
      if (QUALITY.glowEnabled) {
        ctx.shadowColor = isSevereZone ? '#ef4444' : inContainmentZone ? '#f59e0b' : '#22d8ff';
        ctx.shadowBlur = isSevereZone ? 15 : inContainmentZone ? 8 : 4;
      }
      
      ctx.strokeRect(margin, margin, boundaryWidth, boundaryHeight);

      // Draw secondary inner wave pulsing inward when in containment zone!
      if (inContainmentZone) {
        const waveOffset = (core.vitalEnergyWind * 45) % NEXUS_BOUNDARY.containmentDistance;
        ctx.strokeStyle = isSevereZone ? `rgba(239, 68, 68, ${0.25 - waveOffset / NEXUS_BOUNDARY.containmentDistance})` : `rgba(34, 216, 255, ${0.25 - waveOffset / NEXUS_BOUNDARY.containmentDistance})`;
        ctx.lineWidth = 1.2;
        ctx.strokeRect(margin + waveOffset, margin + waveOffset, boundaryWidth - waveOffset * 2, boundaryHeight - waveOffset * 2);
      }

      // Restore context shadow values to maintain performance
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  };

  // Rediseño de Orbes: Solar, Nexus, and Blackout
  const drawIntenseHighGlowOrbs = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    const theme = GUARDIAN_THEMES[core.activeGuardian];
    const rotation = core.vitalEnergyWind * 1.2;

    core.orbs.forEach((orb) => {
      orb.pulsePhase += orb.pulseSpeed;
      const dynamicRadius = orb.radius + Math.sin(orb.pulsePhase) * 1.6;

      ctx.save();

      if (orb.type === 'SOLAR') {
        // Gilded solar: white hot nucleus, amber soft corona glow (Correction 9)
        const outerGlow = dynamicRadius + 14;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 1, orb.x, orb.y, outerGlow);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.25, '#fbbf24');
        grad.addColorStop(0.65, theme.secondaryColor);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, outerGlow, 0, Math.PI * 2);
        ctx.fill();

        // Delicate rotating orbits flare
        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = 0.3 * (0.6 + Math.sin(rotation) * 0.4);
        ctx.lineWidth = 1.0;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, dynamicRadius * 1.35, 0, Math.PI * 2);
        ctx.stroke();

      } else if (orb.type === 'BLACKOUT') {
        // Blackout: Dark purple core with a glowing violet corona
        const outerGlow = dynamicRadius + 15;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 1, orb.x, orb.y, outerGlow);
        grad.addColorStop(0, '#120224'); // deep dark blackout core
        grad.addColorStop(0.3, '#3b0764'); // purple
        grad.addColorStop(0.7, '#a855f7'); // amethyst violet glow
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, outerGlow, 0, Math.PI * 2);
        ctx.fill();

        // Corrupted rotating crystalline band
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
        ctx.lineWidth = 1.0;
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate(-rotation * 0.8);
        ctx.beginPath();
        ctx.ellipse(0, 0, dynamicRadius * 1.35, dynamicRadius * 0.35, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

      } else {
        // Nexus: Cyan focal center with elegant dual revolving violet orbits
        const outerGlow = dynamicRadius + 18;
        const grad = ctx.createRadialGradient(orb.x, orb.y, 1, orb.x, orb.y, outerGlow);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.2, '#22d3ee'); // Glowing radiant cyan
        grad.addColorStop(0.55, '#7c4dff'); // Cosmic/deep violet
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, outerGlow, 0, Math.PI * 2);
        ctx.fill();

        // High gloss elegant orbital bands in cyan and violet
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)'; // Cyan orbit
        ctx.lineWidth = 1.2;
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate(rotation);
        ctx.beginPath();
        ctx.ellipse(0, 0, dynamicRadius * 1.45, dynamicRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = 'rgba(124, 77, 255, 0.45)'; // Violet orbit
        ctx.save();
        ctx.translate(orb.x, orb.y);
        ctx.rotate(-rotation * 1.4);
        ctx.beginPath();
        ctx.ellipse(0, 0, dynamicRadius * 1.45, dynamicRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    });

    // Render VITAL FLOW pickups (Section 3 & 9)
    if (core.gameMode === 'vital_flow' && core.vitalFlow) {
      core.vitalFlow.pickups.forEach((pickup) => {
        pickup.pulsePhase = (pickup.pulsePhase || 0) + 0.05;
        const dynamicRadius = pickup.radius + Math.sin(pickup.pulsePhase) * 1.6;

        ctx.save();

        if (pickup.kind === 'solar_orb') {
          // Gilded solar: white hot nucleus, amber soft corona glow
          const outerGlow = dynamicRadius + 14;
          const grad = ctx.createRadialGradient(pickup.x, pickup.y, 1, pickup.x, pickup.y, outerGlow);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.25, '#fbbf24');
          grad.addColorStop(0.65, '#f59e0b');
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pickup.x, pickup.y, outerGlow, 0, Math.PI * 2);
          ctx.fill();

          // Delicate rotating orbits flare
          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = 0.3 * (0.6 + Math.sin(rotation) * 0.4);
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(pickup.x, pickup.y, dynamicRadius * 1.35, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          // Nexus Core: Cyan focal center with elegant dual revolving violet orbits
          const outerGlow = dynamicRadius + 18;
          const grad = ctx.createRadialGradient(pickup.x, pickup.y, 1, pickup.x, pickup.y, outerGlow);
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(0.2, '#22d3ee'); // Radiant cyan
          grad.addColorStop(0.55, '#7c4dff'); // Cosmic/deep violet
          grad.addColorStop(1, 'transparent');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(pickup.x, pickup.y, outerGlow, 0, Math.PI * 2);
          ctx.fill();

          // High gloss elegant orbital bands in cyan and violet
          ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)'; // Cyan orbit
          ctx.lineWidth = 1.2;
          ctx.save();
          ctx.translate(pickup.x, pickup.y);
          ctx.rotate(rotation);
          ctx.beginPath();
          ctx.ellipse(0, 0, dynamicRadius * 1.45, dynamicRadius * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          ctx.strokeStyle = 'rgba(124, 77, 255, 0.45)'; // Violet orbit
          ctx.save();
          ctx.translate(pickup.x, pickup.y);
          ctx.rotate(-rotation * 1.4);
          ctx.beginPath();
          ctx.ellipse(0, 0, dynamicRadius * 1.45, dynamicRadius * 0.45, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
      });
    }
  };

  const drawBlackoutSingularities = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    const rotation = core.vitalEnergyWind * 1.2;
    const now = performance.now();

    core.obstacles.forEach((obs) => {
      const dynamicRadius = obs.radius + Math.sin(core.vitalEnergyWind * 1.8) * 1.0;
      const isSuppressed = obs.suppressedUntil !== undefined && obs.suppressedUntil > now;
      
      ctx.save();

      // 1. Corrupt dark purple soft nebula aura (Abyssal core) or Suppressed blue aura
      const auraGlow = dynamicRadius + 18;
      const auraGrad = ctx.createRadialGradient(obs.x, obs.y, dynamicRadius * 0.3, obs.x, obs.y, auraGlow);
      if (isSuppressed) {
        // Cyan/violet suppressed containment glow
        auraGrad.addColorStop(0, 'rgba(34, 211, 238, 0.52)');
        auraGrad.addColorStop(0.65, 'rgba(124, 77, 255, 0.25)');
      } else {
        auraGrad.addColorStop(0, 'rgba(107, 33, 168, 0.72)');
        auraGrad.addColorStop(0.65, 'rgba(59, 7, 100, 0.40)');
      }
      auraGrad.addColorStop(1, 'transparent');
      
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, auraGlow, 0, Math.PI * 2);
      ctx.fill();

      // 2. Singular dark core hole
      ctx.fillStyle = '#010103';
      ctx.strokeStyle = isSuppressed ? '#22d3ee' : '#581c87'; // Suppressed cyan outline
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(obs.x, obs.y, dynamicRadius * 0.84, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 3. Unstable rotating crackled warning orbit ring
      ctx.strokeStyle = isSuppressed ? 'rgba(34, 211, 238, 0.6)' : 'rgba(168, 85, 247, 0.55)';
      ctx.lineWidth = 1.2;
      ctx.save();
      ctx.translate(obs.x, obs.y);
      ctx.rotate(-rotation * 0.8);
      ctx.beginPath();
      // Draw a distorted hexagon representing instable gravity
      for (let j = 0; j < 6; j++) {
        const phi = (j / 6) * Math.PI * 2;
        const offset = dynamicRadius * (1.12 + Math.sin(rotation * 2.0 + j) * 0.12);
        const px = Math.cos(phi) * offset;
        const py = Math.sin(phi) * offset;
        if (j === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Emit soft containment sparkles in suppressed state
      if (isSuppressed && Math.random() < 0.12) {
        triggerBurstSparks(obs.x, obs.y, '#22d3ee', 'GRID_GLOW', 2);
      }

      ctx.restore();
    });
  };

  const getDominantAntiEnergy = (serpents: SurvivalAntiSerpent[]): string => {
    if (!serpents || serpents.length === 0) return 'NINGUNA';
    const counts: Record<string, number> = {};
    let maxCount = 0;
    let dominant = 'NINGUNA';
    for (const s of serpents) {
      if (s.alive) {
        counts[s.antiEnergy] = (counts[s.antiEnergy] || 0) + 1;
        if (counts[s.antiEnergy] > maxCount) {
          maxCount = counts[s.antiEnergy];
          dominant = ORBI_ANTI_ENERGY_REGISTRY[s.antiEnergy]?.label || 'NINGUNA';
        }
      }
    }
    return dominant;
  };

  const drawBlackoutEventVisuals = (ctx: CanvasRenderingContext2D, dt: number) => {
    const core = stateRef.current;
    if (core.gameMode !== 'infinite' || !core.survival) return;

    const event = core.survival.activeBlackoutEvent;
    if (!event) return;

    ctx.save();
    
    if (event.type === "eclipse_field") {
      ctx.fillStyle = "rgba(15, 0, 30, 0.28)";
      ctx.fillRect(0, 0, core.arenaWidth, core.arenaSize);

      const centerX = core.arenaWidth / 2;
      const centerY = core.arenaSize / 2;
      const grad = ctx.createRadialGradient(centerX, centerY, 100, centerX, centerY, 800);
      grad.addColorStop(0, "rgba(91, 44, 255, 0.08)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 800, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() < 0.12 * dt) {
        const pX = Math.random() * core.arenaWidth;
        const pY = Math.random() * core.arenaSize;
        const color = Math.random() < 0.5 ? '#fbbf24' : '#5b2cff';
        core.particles.push({
          id: `eclipse_${Date.now()}_${Math.random()}`,
          x: pX,
          y: pY,
          vx: (Math.random() - 0.5) * 1.0,
          vy: (Math.random() - 0.5) * 1.0,
          color,
          size: 1 + Math.random() * 2,
          alpha: 0.15 + Math.random() * 0.2,
          life: 1.0,
          decay: 0.015,
          type: 'SOLAR_SPARK'
        });
      }
    } else if (event.type === "blackout_wave") {
      const timeSecs = Date.now() * 0.003;
      const borderAlpha = 0.1 + Math.abs(Math.sin(timeSecs * Math.PI)) * 0.15;
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${borderAlpha})`;
      ctx.lineWidth = 12;
      ctx.strokeRect(0, 0, core.arenaWidth, core.arenaSize);

      if (Math.random() < 0.1 * dt) {
        const pX = Math.random() * core.arenaWidth;
        const pY = Math.random() * core.arenaSize;
        core.particles.push({
          id: `wave_${Date.now()}_${Math.random()}`,
          x: pX,
          y: pY,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          color: '#a855f7',
          size: 2 + Math.random() * 3,
          alpha: 0.1 + Math.random() * 0.15,
          life: 1.0,
          decay: 0.02,
          type: 'BLACKOUT_SMOKE'
        });
      }
    } else if (event.type === "vacuum_surge") {
      ctx.strokeStyle = "rgba(16, 185, 129, 0.12)";
      ctx.lineWidth = 2;
      const timeSecs = Date.now() * 0.001;
      
      ctx.setLineDash([40, 150]);
      ctx.lineDashOffset = -timeSecs * 350;
      
      ctx.beginPath();
      for (let i = 0; i < 15; i++) {
        const startY = (i * (core.arenaSize / 15)) + Math.sin(timeSecs + i) * 40;
        ctx.moveTo(100, startY);
        ctx.lineTo(core.arenaWidth - 100, startY + 200);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (event.type === "entropy_storm") {
      if (Math.random() < 0.15 * dt) {
        const pX = Math.random() * core.arenaWidth;
        const pY = Math.random() * core.arenaSize;
        const color = Math.random() < 0.6 ? '#f97316' : '#ea580c';
        core.particles.push({
          id: `entropy_${Date.now()}_${Math.random()}`,
          x: pX,
          y: pY,
          vx: (Math.random() - 0.5) * 1.5,
          vy: -1.0 - Math.random() * 1.5,
          color,
          size: 1.5 + Math.random() * 2.5,
          alpha: 0.15 + Math.random() * 0.25,
          life: 1.0,
          decay: 0.02,
          type: 'SOLAR_SPARK'
        });
      }
    } else if (event.type === "anti_serpent_alpha") {
      const flash = Math.abs(Math.sin(Date.now() * 0.002)) * 0.05;
      ctx.fillStyle = `rgba(239, 68, 68, ${flash})`;
      ctx.fillRect(0, 0, core.arenaWidth, core.arenaSize);
    }

    ctx.restore();
  };

  const drawSurvivalProjectilesAndHazards = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    if (core.gameMode !== 'infinite' || !core.survival) return;
    const survival = core.survival;
    const p = core.player;

    // 1. Draw Hazards FIRST so they render below projectiles/serpents
    if (survival.hazards) {
      survival.hazards.forEach((haz: SurvivalHazardZone) => {
        ctx.save();
        
        // Pulse animation
        const pulse = 1.0 + Math.sin(Date.now() * 0.01) * 0.06;
        const rad = haz.radius * pulse;
        const alpha = Math.max(0, Math.min(0.45, haz.duration / 0.3)); // Fade out near death

        if (haz.type === 'stasis_pool') {
          // Cyan/Turquoise inverted stasis pool
          const grad = ctx.createRadialGradient(haz.x, haz.y, rad * 0.2, haz.x, haz.y, rad);
          grad.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.7})`);
          grad.addColorStop(0.6, `rgba(8, 145, 178, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(2, 6, 23, 0)`);
          
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, rad, 0, Math.PI * 2);
          ctx.fill();

          // Outer ring
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.5})`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, rad, 0, Math.PI * 2);
          ctx.stroke();
          
          // Draw clock indicator
          ctx.strokeStyle = `rgba(34, 211, 238, ${alpha * 0.2})`;
          ctx.lineWidth = 1.0;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, rad * 0.75, 0, Math.PI * 2);
          ctx.stroke();
        } else if (haz.type === 'entropy_field') {
          // Orange/Black corrupt field
          const grad = ctx.createRadialGradient(haz.x, haz.y, rad * 0.1, haz.x, haz.y, rad);
          grad.addColorStop(0, `rgba(249, 115, 22, ${alpha * 0.75})`);
          grad.addColorStop(0.5, `rgba(120, 10, 0, ${alpha * 0.45})`);
          grad.addColorStop(0.8, `rgba(15, 23, 42, ${alpha * 0.3})`);
          grad.addColorStop(1, `rgba(2, 6, 23, 0)`);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, rad, 0, Math.PI * 2);
          ctx.fill();

          // Render small corrupt embers
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
          for (let i = 0; i < 5; i++) {
            const angle = (Date.now() * 0.002 + i * 1.2) % (Math.PI * 2);
            const dist = (rad * 0.2) + ((Date.now() * 0.05 + i * 15) % (rad * 0.6));
            const ex = haz.x + Math.cos(angle) * dist;
            const ey = haz.y + Math.sin(angle) * dist;
            ctx.beginPath();
            ctx.arc(ex, ey, 2.0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Sharp border ring
          ctx.strokeStyle = `rgba(251, 146, 60, ${alpha * 0.6})`;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(haz.x, haz.y, rad, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
    }

    // 2. Draw Projectiles
    if (survival.antiProjectiles) {
      survival.antiProjectiles.forEach((proj: SurvivalAntiProjectile) => {
        if (!proj.alive) return;
        ctx.save();

        if (proj.type === 'dark_lance') {
          // Linear dark lance with violet/red border
          const angle = Math.atan2(proj.vy, proj.vx);
          ctx.translate(proj.x, proj.y);
          ctx.rotate(angle);

          // Glow shadow
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#d946ef';

          // Outer lance blade
          ctx.fillStyle = '#1e1b4b'; // Dark violet core
          ctx.strokeStyle = '#ec4899'; // Bright pink/magenta
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(18, 0);
          ctx.lineTo(-12, 5.5);
          ctx.lineTo(-6, 0);
          ctx.lineTo(-12, -5.5);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Inner glowing core
          ctx.fillStyle = '#ef4444'; // Red core
          ctx.beginPath();
          ctx.moveTo(8, 0);
          ctx.lineTo(-4, 2.2);
          ctx.lineTo(-4, -2.2);
          ctx.closePath();
          ctx.fill();
        } else if (proj.type === 'stasis_glob') {
          // Cyan turquoise corrupt liquid globe
          ctx.shadowBlur = 15;
          ctx.shadowColor = '#06b6d4';

          ctx.fillStyle = '#022c22'; // Dark teal core
          ctx.strokeStyle = '#22d3ee'; // Neon cyan
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner bubble highlights
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(proj.x - proj.radius * 0.3, proj.y - proj.radius * 0.3, proj.radius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else if (proj.type === 'entropy_burst') {
          // Orange dark corrupt orb
          ctx.shadowBlur = 18;
          ctx.shadowColor = '#f97316';

          const timeAngle = Date.now() * 0.005;
          ctx.translate(proj.x, proj.y);
          ctx.rotate(timeAngle);

          // Outer heavy thermal core
          ctx.fillStyle = '#1c0d02'; // Intense dark orange-black
          ctx.strokeStyle = '#f97316'; // Deep orange
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          
          for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const r = proj.radius + Math.sin(Date.now() * 0.01 + i) * 2;
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Cold cian reverse spark in the center
          ctx.fillStyle = '#06b6d4';
          ctx.beginPath();
          ctx.arc(0, 0, proj.radius * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      });
    }

    // 3. Draw player debuff indicators
    if (survival.debuffType && p) {
      ctx.save();
      const debuffColor = survival.debuffType === 'ESTASIS' ? '#22d3ee' : '#f97316';
      
      ctx.strokeStyle = debuffColor;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 1.5, Date.now() * 0.003, Date.now() * 0.003 + Math.PI * 2);
      ctx.stroke();

      // Draw active status overlay above player
      ctx.font = 'bold 8px JetBrains Mono, monospace';
      ctx.fillStyle = debuffColor;
      ctx.textAlign = 'center';
      ctx.fillText(survival.debuffType, p.x, p.y - p.radius - 12);
      ctx.restore();
    }
  };

  const drawSurvivalAntiSerpents = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    if (core.gameMode !== 'infinite') return;
    
    const antiSerpents = core.survival?.antiSerpents || [];
    antiSerpents.forEach((serpent) => {
      if (!serpent.alive || serpent.segments.length === 0) return;
      
      const reg = ORBI_ANTI_ENERGY_REGISTRY[serpent.antiEnergy];
      const color = reg.color;
      
      // Call the high-fidelity modular drawing routine
      drawSurvivalAntiSerpent(ctx, serpent);
      
      ctx.save();
      // Draw health bar and label above head
      const head = serpent.segments[0];
      const labelY = head.y - 24 - (serpent.lengthLevel * 2);
      
      // Label text
      ctx.font = serpent.isAlpha ? 'bold 11px JetBrains Mono, monospace' : 'bold 8.5px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = serpent.isAlpha ? '#f43f5e' : color;
      ctx.fillText(serpent.isAlpha ? `ALPHA ${reg.label}` : reg.label, head.x, labelY);
      
      // Health bar background
      const barW = serpent.isAlpha ? 52 : 34;
      const barH = serpent.isAlpha ? 4 : 3;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
      ctx.strokeStyle = serpent.isAlpha ? 'rgba(244, 63, 94, 0.4)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(head.x - barW / 2, labelY + 4, barW, barH);
      ctx.fill();
      ctx.stroke();
      
      // Health bar fill
      const hpPct = Math.max(0, Math.min(1, serpent.hp / serpent.maxHp));
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.rect(head.x - barW / 2, labelY + 4, barW * hpPct, barH);
      ctx.fill();
      
      ctx.restore();
    });
  };

  // Render Corrupted Core Sentinel Vector Graphics
  const drawSentinel = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    if (!core.sentinel) return;

    const s = core.sentinel;
    const rotation = core.vitalEnergyWind * 0.9;
    const pulse = Math.sin(core.vitalEnergyWind * 2.2) * 2.5;

    ctx.save();

    // 1. WARNING EFFECT WHEN FORMING
    if (s.phase === 'forming') {
      const alpha = 0.35 + 0.35 * Math.sin(performance.now() * 0.01);
      
      ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([12, 8]);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.5})`;
      ctx.lineWidth = 1.0;
      ctx.setLineDash([]);
      for (let i = 0; i < 8; i++) {
        const angle = rotation + (i / 8) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(angle) * (s.radius * 2.5), s.y + Math.sin(angle) * (s.radius * 2.5));
        ctx.lineTo(s.x + Math.cos(angle) * (s.radius * 0.5), s.y + Math.sin(angle) * (s.radius * 0.5));
        ctx.stroke();
      }

      const grad = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.radius * 1.5);
      grad.addColorStop(0, `rgba(18, 2, 36, ${alpha * 0.85})`);
      grad.addColorStop(0.5, `rgba(168, 85, 247, ${alpha * 0.4})`);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText("ESTABILIZANDO ENTRADA BLACKOUT...", s.x, s.y - s.radius - 20);

      ctx.restore();
      return;
    }

    if (s.defeated) {
      ctx.globalAlpha = 0.5;
      const grad = ctx.createRadialGradient(s.x, s.y, 1, s.x, s.y, s.radius * 2.5);
      grad.addColorStop(0, 'rgba(251, 191, 36, 0.4)');
      grad.addColorStop(0.5, 'rgba(34, 211, 238, 0.2)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius * 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    // 2. MAIN CORE SHADOW/AURA
    const auraRadius = s.radius * (1.6 + (s.phase === 'enraged' ? 0.45 : 0.2) * Math.sin(core.vitalEnergyWind * 1.5));
    const auraGrad = ctx.createRadialGradient(s.x, s.y, s.radius * 0.2, s.x, s.y, auraRadius);

    if (s.phase === 'shielded') {
      auraGrad.addColorStop(0, 'rgba(124, 77, 255, 0.4)');
      auraGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.2)');
      auraGrad.addColorStop(1, 'transparent');
    } else if (s.phase === 'vulnerable') {
      auraGrad.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      auraGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.2)');
      auraGrad.addColorStop(1, 'transparent');
    } else if (s.phase === 'enraged') {
      auraGrad.addColorStop(0, 'rgba(239, 68, 68, 0.55)');
      auraGrad.addColorStop(0.4, 'rgba(124, 77, 255, 0.3)');
      auraGrad.addColorStop(1, 'transparent');
    }

    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(s.x, s.y, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. ATTACKS SHOCKWAVE RANGE TELEGRAPH (SUBTLE OUTER RING)
    ctx.strokeStyle = s.phase === 'enraged' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(168, 85, 247, 0.1)';
    ctx.lineWidth = 1.0;
    ctx.setLineDash([8, 12]);
    ctx.beginPath();
    ctx.arc(s.x, s.y, 240, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 4. DRAW CENTRAL REACTOR SEGMENTED GEOMETRIC SHAPE (ABYSSAL TECHNOLOGY CORE)
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(rotation);

    const sides = 8;
    const baseRadius = s.radius + pulse;

    ctx.strokeStyle = s.phase === 'enraged' ? '#f43f5e' : s.phase === 'vulnerable' ? '#fbbf24' : '#a855f7';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    for (let i = 0; i <= sides; i++) {
      const angle = (i / sides) * Math.PI * 2;
      const r = baseRadius * (i % 2 === 0 ? 1.05 : 0.85);
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();

    const fillGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, baseRadius);
    if (s.phase === 'enraged') {
      fillGrad.addColorStop(0, '#ffffff');
      fillGrad.addColorStop(0.3, '#f43f5e');
      fillGrad.addColorStop(0.8, '#1e020d');
    } else if (s.phase === 'vulnerable') {
      fillGrad.addColorStop(0, '#ffffff');
      fillGrad.addColorStop(0.4, '#fbbf24');
      fillGrad.addColorStop(0.85, '#2e1c02');
    } else {
      fillGrad.addColorStop(0, '#090114');
      fillGrad.addColorStop(0.4, '#1e073a');
      fillGrad.addColorStop(0.85, '#581c87');
    }
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.rotate(-rotation * 1.8);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.moveTo(Math.cos(angle) * (baseRadius * 0.4), Math.sin(angle) * (baseRadius * 0.4));
      ctx.lineTo(Math.cos(angle) * (baseRadius * 0.75), Math.sin(angle) * (baseRadius * 0.75));
    }
    ctx.stroke();

    ctx.restore();

    // 5. DRAW ACTIVE ORBITAL PLATES / DEFENSIVE SHIELDS (REVOLVING BANDS)
    if (s.phase === 'shielded' || s.phase === 'enraged') {
      const shieldGlowSize = s.radius * 1.6 + pulse * 1.2;
      
      const shieldGrad = ctx.createRadialGradient(s.x, s.y, s.radius * 0.9, s.x, s.y, shieldGlowSize + 10);
      shieldGrad.addColorStop(0, 'rgba(34, 211, 238, 0.05)');
      shieldGrad.addColorStop(0.7, 'rgba(34, 211, 238, 0.22)');
      shieldGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = shieldGrad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, shieldGlowSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(-rotation * 1.2);
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3.5;
      
      for (let i = 0; i < 3; i++) {
        const startAngle = (i / 3) * Math.PI * 2;
        const endAngle = startAngle + Math.PI / 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, shieldGlowSize - 2, startAngle, endAngle);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  };

  // Draw Player Avatar: Tapered energy ribbon trail + symmetrical reactor core
  const drawPremiumOrbiSerpent = (
    ctx: CanvasRenderingContext2D,
    playerOverride?: any,
    options?: {
      canonicalProfile?: OrbiSerpentCanonicalProfile;
      mode?: "red_vital" | "survival_nexus" | "nexus_assault" | "vital_flow";
      heroId?: string;
    }
  ) => {
    const core = stateRef.current;
    const p = playerOverride || core.player;
    let theme = GUARDIAN_THEMES[core.activeGuardian];

    // FOTON GREEN OVERRIDE
    if (core.activeGuardian === 'FOTON' && ENABLE_VITAL_FLOW_FOTON_GREEN_OVERRIDE) {
      theme = {
        ...theme,
        primaryColor: ORBI_FOTON_VISUAL_PALETTE.core,
        secondaryColor: ORBI_FOTON_VISUAL_PALETTE.glow,
        auraColor: ORBI_FOTON_VISUAL_PALETTE.aura,
        particleColor: ORBI_FOTON_VISUAL_PALETTE.core,
        trailColor: ORBI_FOTON_VISUAL_PALETTE.trail
      };
    }

    if (p.segments.length === 0) return;

    const originalSegments = p.segments;
    const isVitalFlow = core.gameMode === 'vital_flow';

    if (isVitalFlow && ENABLE_VITAL_FLOW_LONG_TAIL_RENDER_OPTIMIZATION) {
      p.segments = getVitalFlowRenderableSegments(originalSegments);
    }

    // Determine standard canonical profile
    let canonicalProfile = options?.canonicalProfile;
    if (!canonicalProfile) {
      const mode = options?.mode || (core.gameMode === 'infinite' ? 'survival_nexus' : core.gameMode as any) || "red_vital";
      const heroId = options?.heroId || core.activeGuardian || "FOTON";
      
      let stage = 1;
      let evolutionEnergy = 0;
      if (mode === 'vital_flow' && core.vitalFlow) {
        stage = getVitalFlowEvolutionStage(core.vitalFlow.pickupsCollected);
        evolutionEnergy = core.vitalFlow.pickupsCollected;
      } else if (p.visualProfile) {
        stage = p.visualProfile.stage;
        evolutionEnergy = p.pickupEvolutionEnergy || 0;
      } else {
        evolutionEnergy = p.pickupEvolutionEnergy || 0;
        stage = getOrbiSerpentEvolutionVisualProfile({ mode, pickupsOrEnergy: evolutionEnergy }).stage;
      }

      canonicalProfile = getOrbiSerpentCanonicalProfile({
        mode,
        heroId,
        stage,
        evolutionEnergy
      });

      // Maintain visual smoothing
      if (p.visualProfile) {
        canonicalProfile.headScale = p.visualProfile.headScale;
        canonicalProfile.bodyThickness = p.visualProfile.thicknessMultiplier;
        canonicalProfile.tailOrbScale = p.visualProfile.tailOrbScale;
        const maxTailScale = canonicalProfile.headScale * 0.82;
        if (canonicalProfile.tailOrbScale > maxTailScale) {
          canonicalProfile.tailOrbScale = maxTailScale;
        }
      }
    }

    let baseWidth = 44 * canonicalProfile.bodyThickness;
    if (core.evolutionCinematic && core.evolutionCinematic.active) {
      baseWidth *= 1.35; // Trail expands during evolution
    }

    // Helper for high-definition continuous tapered plasma ribbon:
    const buildTaperedPath = (widthFactor: number, colorStyle: string, alphaVal: number) => {
      ctx.save();
      ctx.globalAlpha = alphaVal;
      ctx.strokeStyle = colorStyle;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const total = p.segments.length;
      if (total < 2) {
        ctx.restore();
        return;
      }
      
      const firstWidth = baseWidth * widthFactor;
      ctx.lineWidth = firstWidth;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.segments[0].x, p.segments[0].y);
      ctx.stroke();

      for (let i = 0; i < total - 1; i++) {
        const seg1 = p.segments[i];
        const seg2 = p.segments[i + 1];
        const ratio1 = 1 - (i / total);
        const ratio2 = 1 - ((i + 1) / total);
        const ratio = (ratio1 + ratio2) / 2;
        ctx.lineWidth = baseWidth * widthFactor * (0.35 + ratio * 0.65);
        ctx.beginPath();
        ctx.moveTo(seg1.x, seg1.y);
        ctx.lineTo(seg2.x, seg2.y);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Gaia supreme convergence check (all 9 active elements)
    const isGaiaActive = (canonicalProfile.mode === 'nexus_assault' && core.assaultRun && core.assaultRun.modules) ? (() => {
      const elements = new Set(core.assaultRun.modules.map((m: any) => m.element));
      const uniqueElements = Array.from(elements).filter(el => el !== 'gaia');
      return uniqueElements.length >= 9;
    })() : false;

    // Overriding visual label in HUD if Gaia is active
    if (isGaiaActive && p.visualProfile) {
      p.visualProfile.label = "E8 — ORBI GAIA SUPREME NEXUS";
    }

    // Dynamic Alphas (Section 10 Transparency Blueprint)
    let bodyAlpha = 0.65;
    let outerGlowAlpha = 0.40;
    let scaleLineAlpha = 0.50;
    let centralFilamentAlpha = 0.85;
    let coreAlpha = 0.95;

    // Section 11 Nexus Assault Multipliers
    if (canonicalProfile.mode === 'nexus_assault') {
      bodyAlpha *= 0.90; // assaultBodyScaleModifier
      outerGlowAlpha *= 0.80; // assaultGlowModifier
      coreAlpha = Math.min(1.0, coreAlpha * 1.15); // assaultCoreProminenceModifier
    }

    const bodyOuterGlowAlpha = (ENABLE_SERPENT_VISUAL_POLISH_5R3B ? 0.84 : 1.0) * outerGlowAlpha;
    const bodyMidGlowAlpha = (ENABLE_SERPENT_VISUAL_POLISH_5R3B ? 0.88 : 1.0) * bodyAlpha;
    const bodyRibbonAlpha = (ENABLE_SERPENT_VISUAL_POLISH_5R3B ? 0.92 : 1.0);
    const internalCoreGlowAlpha = (ENABLE_SERPENT_VISUAL_POLISH_5R3B ? 0.90 : 1.0) * coreAlpha;

    // Helper to draw natural energy scale joints on the serpent body (Módulo 5R.4 / Sección 3)
    const buildEnergyScalesPattern = (baseW: number, colorStyle: string, alphaVal: number) => {
      const total = p.segments.length;
      if (total < 3) return;

      ctx.save();
      ctx.globalAlpha = alphaVal;
      ctx.strokeStyle = colorStyle;
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'round';

      const step = 2; // Low frequency, not a fine grid
      for (let i = 1; i < total - 1; i += step) {
        const seg = p.segments[i];
        const prev = p.segments[i - 1];
        const next = p.segments[i + 1];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const segmentAngle = Math.atan2(dy, dx);
        const perpAngle = segmentAngle + Math.PI / 2;

        const ratio = 1 - (i / total);
        const segmentWidth = baseW * (0.35 + ratio * 0.65);

        // Draw backward curved scale arcs spanning across body width
        ctx.beginPath();
        const leftX = seg.x - Math.cos(perpAngle) * (segmentWidth * 0.45);
        const leftY = seg.y - Math.sin(perpAngle) * (segmentWidth * 0.45);
        const rightX = seg.x + Math.cos(perpAngle) * (segmentWidth * 0.45);
        const rightY = seg.y + Math.sin(perpAngle) * (segmentWidth * 0.45);

        const backX = seg.x - Math.cos(segmentAngle) * (segmentWidth * 0.25);
        const backY = seg.y - Math.sin(segmentAngle) * (segmentWidth * 0.25);

        ctx.moveTo(leftX, leftY);
        ctx.quadraticCurveTo(backX, backY, rightX, rightY);
        ctx.stroke();

        // Connect the scale to create a natural central filament joint line
        ctx.beginPath();
        ctx.moveTo(seg.x, seg.y);
        ctx.lineTo(backX, backY);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Layered Render of continuous glowing energy stream
    if (canonicalProfile.stage >= 5) {
      buildTaperedPath(3.4, isGaiaActive ? '#22c55e' : theme.auraColor, 0.18 * canonicalProfile.auraScale * bodyOuterGlowAlpha);
      buildTaperedPath(2.0, isGaiaActive ? '#DFFF4A' : theme.secondaryColor, 0.35 * canonicalProfile.trailScale * bodyMidGlowAlpha);
    }

    if (canonicalProfile.mode === 'vital_flow') {
      buildTaperedPath(3.2, theme.auraColor, 0.15 * canonicalProfile.auraScale * bodyOuterGlowAlpha);
      buildTaperedPath(1.9, theme.secondaryColor, 0.22 * canonicalProfile.trailScale * bodyMidGlowAlpha);
    }

    // Layer 1: Massive soft space aura glow
    buildTaperedPath(2.4, isGaiaActive ? '#22c55e' : theme.auraColor, 0.25 * canonicalProfile.auraScale * bodyOuterGlowAlpha);

    // Layer 2: Plasma flow volume
    buildTaperedPath(1.4, isGaiaActive ? '#22c55e' : theme.secondaryColor, 0.45 * canonicalProfile.trailScale * bodyMidGlowAlpha);

    // Layer 2.5: Energy scale skin pattern (Módulo 5R.4 / Sección 3)
    if (ENABLE_ENERGY_SCALE_SKIN_PATTERN) {
      buildEnergyScalesPattern(baseWidth, isGaiaActive ? '#DFFF4A' : theme.primaryColor, scaleLineAlpha);
    }

    // Layer 3: Central glowing core (Central energy filament)
    buildTaperedPath(0.72, isGaiaActive ? '#DFFF4A' : theme.primaryColor, centralFilamentAlpha * bodyRibbonAlpha);

    // Layer 4: Pure white-hot innermost fusion spine
    buildTaperedPath(0.24, isGaiaActive ? '#FFE875' : '#ffffff', 1.0);

    // Draw spaced canonical internal cores
    const totalSegs = p.segments.length;
    let coreCount = canonicalProfile.internalCoreCount;
    if (canonicalProfile.mode === 'nexus_assault') {
      const realEquippedCoreCount = (core.assaultRun && core.assaultRun.modules) ? core.assaultRun.modules.length : 1;
      coreCount = Math.max(1, realEquippedCoreCount);
    }
    let coreIndices: number[] = [];
    if (coreCount > 0 && totalSegs >= 3) {
      if (canonicalProfile.mode === 'nexus_assault') {
        coreIndices = getAssaultCanonicalCorePositions({
          bodyPoints: p.segments,
          coreCount: coreCount
        });
      } else if (ENABLE_CANONICAL_SERPENT_EVOLUTION_MODEL) {
        coreIndices = getCanonicalCorePositions({
          bodyPoints: p.segments,
          coreCount: coreCount,
          headPaddingRatio: 0.12,
          tailPaddingRatio: 0.08
        });
      } else {
        coreIndices = getCanonicalInternalCorePositions({
          segments: p.segments,
          desiredCoreCount: coreCount,
          spacingMode: canonicalProfile.internalCoreSpacingMode
        });
      }

      // Element palette mapping for cores
      const elementColorMap: Record<string, { primary: string, secondary: string }> = {
        foton: { primary: '#B6FF00', secondary: '#8DFF00' },
        hydro: { primary: '#0ea5e9', secondary: '#2563eb' },
        aero: { primary: '#10b981', secondary: '#14b8a6' },
        termo: { primary: '#ff6a2a', secondary: '#ff2d00' },
        terra: { primary: '#ff6a2a', secondary: '#ff2d00' },
        magne: { primary: '#b58cff', secondary: '#7b4dff' },
        aton: { primary: '#dfff4a', secondary: '#9aff00' },
        kinetrix: { primary: '#ff2a85', secondary: '#ff7a1a' },
        h2nova: { primary: '#00f0ff', secondary: '#00ffc8' },
        quantum: { primary: '#6366f1', secondary: '#4f46e5' },
        gaia: { primary: '#22c55e', secondary: '#15803d' }
      };

      coreIndices.forEach((segmentIndex, i) => {
        const seg = p.segments[segmentIndex];
        if (seg) {
          ctx.save();
          ctx.translate(seg.x, seg.y);
          ctx.rotate(p.wingPhase * 0.5 + i * 0.3);

          const size = (seg.size || 15) * 1.15;
          let coreRadius = size * 0.88 * canonicalProfile.internalCoreRadiusScale;
          let glowSize = size * 0.85 * canonicalProfile.internalCoreGlowScale;

          if (canonicalProfile.mode === 'nexus_assault') {
            coreRadius *= 1.30;
            glowSize *= 1.30;
          }

          let primaryColor = theme.primaryColor;
          let secondaryColor = theme.secondaryColor || theme.primaryColor;

          // Multicolor Elemental cores (Sección 11 / Sección 5 / Sección 6)
          if (ENABLE_ASSAULT_ELEMENTAL_CORE_COLORS && canonicalProfile.mode === 'nexus_assault' && core.assaultRun) {
            const activeModules = core.assaultRun.modules || [];
            const mod = activeModules[i];
            if (mod) {
              const palette = elementColorMap[mod.element] || elementColorMap['foton'];
              primaryColor = palette.primary;
              secondaryColor = palette.secondary;
            }
          }

          // Dark backdrop for high contrast against green body
          if (canonicalProfile.mode === 'nexus_assault') {
            ctx.save();
            ctx.fillStyle = 'rgba(2, 1, 8, 0.45)';
            ctx.beginPath();
            ctx.arc(0, 0, coreRadius * 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          ctx.globalAlpha = 0.85 * internalCoreGlowAlpha;

          // Radiant core background glow
          const rGrad = ctx.createRadialGradient(0, 0, 1, 0, 0, glowSize);
          if (canonicalProfile.mode === 'nexus_assault') {
            rGrad.addColorStop(0, '#ffffff');
            rGrad.addColorStop(0.40, '#ffffff');
            rGrad.addColorStop(0.65, primaryColor);
            rGrad.addColorStop(0.85, secondaryColor);
          } else {
            rGrad.addColorStop(0, '#ffffff');
            rGrad.addColorStop(0.35, primaryColor);
            rGrad.addColorStop(0.75, secondaryColor);
          }
          rGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = rGrad;
          ctx.beginPath();
          ctx.arc(0, 0, glowSize, 0, Math.PI * 2);
          ctx.fill();

          // Extra outer soft aura glow layer for Assault
          if (canonicalProfile.mode === 'nexus_assault') {
            ctx.save();
            ctx.globalAlpha = 0.35 * internalCoreGlowAlpha;
            const rGradOuter = ctx.createRadialGradient(0, 0, 1, 0, 0, glowSize * 1.4);
            rGradOuter.addColorStop(0, primaryColor);
            rGradOuter.addColorStop(0.5, secondaryColor);
            rGradOuter.addColorStop(1, 'transparent');
            ctx.fillStyle = rGradOuter;
            ctx.beginPath();
            ctx.arc(0, 0, glowSize * 1.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }

          // Symmetrical orbital rings (Sección 5: aros orbitales tipo átomo)
          if (ENABLE_ORBITAL_CORE_RINGS) {
            ctx.strokeStyle = primaryColor;
            ctx.lineWidth = (canonicalProfile.mode === 'nexus_assault') ? 1.8 : 1.2;
            ctx.globalAlpha = ((canonicalProfile.mode === 'nexus_assault') ? 0.85 : 0.65) * coreAlpha;
            
            // Atom-like Ring 1
            ctx.beginPath();
            ctx.ellipse(0, 0, coreRadius * 1.6, coreRadius * 0.6, -Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();

            // Atom-like Ring 2
            ctx.beginPath();
            ctx.ellipse(0, 0, coreRadius * 1.6, coreRadius * 0.6, Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();

            // Symmetrical spinning satellites (Sección 5: pequeños satélites o puntos orbitales)
            const timeVal = performance.now() * 0.004;
            if (canonicalProfile.mode === 'nexus_assault') {
              // High-fidelity atom-like orbiters tracing both rings
              ctx.save();
              ctx.globalAlpha = 1.0 * coreAlpha;
              
              // Orbiter 1 (Ring 1, tilted -PI/4)
              const phi1 = timeVal * 1.5 + i * 1.2;
              const x1_ell = coreRadius * 1.6 * Math.cos(phi1);
              const y1_ell = coreRadius * 0.6 * Math.sin(phi1);
              const sat1X = x1_ell * Math.cos(-Math.PI / 4) - y1_ell * Math.sin(-Math.PI / 4);
              const sat1Y = x1_ell * Math.sin(-Math.PI / 4) + y1_ell * Math.cos(-Math.PI / 4);
              
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(sat1X, sat1Y, 3.2, 0, Math.PI * 2);
              ctx.fill();

              // Add a small neon trail or glow to the orbiter
              const oGrad1 = ctx.createRadialGradient(sat1X, sat1Y, 0, sat1X, sat1Y, 6);
              oGrad1.addColorStop(0, '#ffffff');
              oGrad1.addColorStop(0.5, secondaryColor);
              oGrad1.addColorStop(1, 'transparent');
              ctx.fillStyle = oGrad1;
              ctx.beginPath();
              ctx.arc(sat1X, sat1Y, 6, 0, Math.PI * 2);
              ctx.fill();

              // Orbiter 2 (Ring 2, tilted PI/4)
              const phi2 = -timeVal * 1.8 - i * 0.7;
              const x2_ell = coreRadius * 1.6 * Math.cos(phi2);
              const y2_ell = coreRadius * 0.6 * Math.sin(phi2);
              const sat2X = x2_ell * Math.cos(Math.PI / 4) - y2_ell * Math.sin(Math.PI / 4);
              const sat2Y = x2_ell * Math.sin(Math.PI / 4) + y2_ell * Math.cos(Math.PI / 4);

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(sat2X, sat2Y, 3.2, 0, Math.PI * 2);
              ctx.fill();

              const oGrad2 = ctx.createRadialGradient(sat2X, sat2Y, 0, sat2X, sat2Y, 6);
              oGrad2.addColorStop(0, '#ffffff');
              oGrad2.addColorStop(0.5, primaryColor);
              oGrad2.addColorStop(1, 'transparent');
              ctx.fillStyle = oGrad2;
              ctx.beginPath();
              ctx.arc(sat2X, sat2Y, 6, 0, Math.PI * 2);
              ctx.fill();

              ctx.restore();
            } else {
              const satAngle = timeVal + i * 1.5;
              const satX = Math.cos(satAngle) * (coreRadius * 1.4);
              const satY = Math.sin(satAngle) * (coreRadius * 0.5);

              ctx.fillStyle = '#ffffff';
              ctx.globalAlpha = 0.9 * coreAlpha;
              ctx.beginPath();
              ctx.arc(satX, satY, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // Symmetrical spinning orbit ring per internal core (classic)
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.2;
            ctx.globalAlpha = 0.38;
            ctx.beginPath();
            ctx.ellipse(0, 0, coreRadius * 1.5, coreRadius * 0.5, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.restore();
        }
      });
    }

    // Elegant tail energy flare / Solid terminal node (Sección 7)
    if (totalSegs > 0) {
      const lastSeg = p.segments[totalSegs - 1];
      
      // Determine largest core size (closest to head) for tail diameter reference
      let largestCoreRadius = 12; // default
      if (coreIndices.length > 0 && p.segments[coreIndices[0]]) {
        const firstCoreSeg = p.segments[coreIndices[0]];
        const sizeVal = (firstCoreSeg.size || 15) * 1.15;
        largestCoreRadius = sizeVal * 0.88 * canonicalProfile.internalCoreRadiusScale;
      } else if (p.segments.length > 0) {
        const sizeVal = (p.segments[0].size || 15) * 1.15;
        largestCoreRadius = sizeVal * 0.88 * canonicalProfile.internalCoreRadiusScale;
      }

      // tailNodeDiameter = largestInternalCoreDiameter
      let tailNodeRadius = largestCoreRadius;
      
      // Enforce: No debe superar a la cabeza
      const headRadius = 36 * canonicalProfile.headScale;
      if (tailNodeRadius >= headRadius) {
        tailNodeRadius = headRadius * 0.82;
      }

      if (ENABLE_SOLID_TAIL_TERMINAL_NODE) {
        ctx.save();
        
        // Solid/dense radial core
        const tailGrad = ctx.createRadialGradient(lastSeg.x, lastSeg.y, 1, lastSeg.x, lastSeg.y, tailNodeRadius);
        tailGrad.addColorStop(0, '#ffffff'); // highly dense center
        tailGrad.addColorStop(0.35, theme.primaryColor); // solid color
        tailGrad.addColorStop(0.80, theme.secondaryColor); // dense outer rim
        tailGrad.addColorStop(1, 'transparent');
        
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.arc(lastSeg.x, lastSeg.y, tailNodeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Compact structural outer ring (Anillo estructural compacto, no aros orbitales de átomo)
        ctx.strokeStyle = theme.secondaryColor;
        ctx.lineWidth = 2.0;
        ctx.globalAlpha = 0.82;
        ctx.beginPath();
        ctx.arc(lastSeg.x, lastSeg.y, tailNodeRadius * 1.25, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      } else {
        // Classic energy flare
        const tailFlareSize = baseWidth * 1.8 * canonicalProfile.tailOrbScale;
        const tailGrad = ctx.createRadialGradient(lastSeg.x, lastSeg.y, 0, lastSeg.x, lastSeg.y, tailFlareSize);
        tailGrad.addColorStop(0, '#ffffff');
        tailGrad.addColorStop(0.3, theme.primaryColor);
        tailGrad.addColorStop(0.65, theme.secondaryColor);
        tailGrad.addColorStop(1, 'transparent');

        ctx.save();
        ctx.fillStyle = tailGrad;
        ctx.beginPath();
        ctx.arc(lastSeg.x, lastSeg.y, tailFlareSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // DRAW PLAYER HEAD (Symmetrical technology energy Reactor Core - NO biological reptile snout)
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);

    const headRadius = 36 * canonicalProfile.headScale;
    const auraPulseSize = headRadius * (1.45 + Math.sin(p.wingPhase * 1.8) * 0.08);

    // Front energy projectile guide
    const emissionW = headRadius * 3.2;
    const emissionH = headRadius * 1.8;
    const emissionGrad = ctx.createRadialGradient(headRadius * 0.5, 0, 0, headRadius * 0.5, 0, emissionW);
    emissionGrad.addColorStop(0, theme.auraColor);
    emissionGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    emissionGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = emissionGrad;
    ctx.beginPath();
    ctx.ellipse(headRadius * 0.5, 0, emissionW, emissionH, 0, -Math.PI / 2.3, Math.PI / 2.3);
    ctx.fill();

    // Orbital technical rings
    if (canonicalProfile.orbitalRings) {
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = (0.4 + Math.sin(p.wingPhase * 1.8) * 0.15) * (canonicalProfile.stage >= 6 ? 0.88 : 0.65);
      ctx.beginPath();
      ctx.ellipse(headRadius * 0.1, 0, headRadius * 1.4, headRadius * 0.45, p.wingPhase * 0.5, 0, Math.PI * 2);
      ctx.stroke();

      if (canonicalProfile.stage >= 6) {
        ctx.strokeStyle = theme.secondaryColor;
        ctx.lineWidth = 1.0;
        ctx.globalAlpha = (0.4 + Math.sin(p.wingPhase * 1.8) * 0.15) * 0.88;
        ctx.beginPath();
        ctx.ellipse(headRadius * 0.1, 0, headRadius * 1.6, headRadius * 0.55, -p.wingPhase * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // Micro satellite / orbital particle
    if (canonicalProfile.microSatellite) {
      ctx.save();
      const satAngle = p.wingPhase * 2.5;
      const satDist = headRadius * 1.5;
      const satX = Math.cos(satAngle) * satDist;
      const satY = Math.sin(satAngle) * (satDist * 0.45);
      ctx.translate(satX, satY);
      
      const satGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 4);
      satGrad.addColorStop(0, '#ffffff');
      satGrad.addColorStop(0.5, theme.primaryColor);
      satGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = satGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Lateral stabilizers
    if (canonicalProfile.stabilizerFins) {
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.fillStyle = theme.auraColor;
      
      // Top side stabilizer
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.2, -headRadius * 0.6);
      ctx.lineTo(-headRadius * 0.8, -headRadius * 1.1);
      ctx.lineTo(-headRadius * 0.5, -headRadius * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bottom side stabilizer
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.2, headRadius * 0.6);
      ctx.lineTo(-headRadius * 0.8, headRadius * 1.1);
      ctx.lineTo(-headRadius * 0.5, headRadius * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.restore();
    }

    // Forward-pointing intense energy node
    if (isVitalFlow && canonicalProfile.stage >= 3) {
      ctx.save();
      const fGrad = ctx.createRadialGradient(headRadius * 0.8, 0, 1, headRadius * 0.8, 0, headRadius * 0.4);
      fGrad.addColorStop(0, '#ffffff');
      fGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = fGrad;
      ctx.beginPath();
      ctx.arc(headRadius * 0.8, 0, headRadius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Extra cinematic orbital rings when transitioning
    if (core.evolutionCinematic && core.evolutionCinematic.active) {
      const ringRadius = headRadius * 2.2;
      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.0;
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.ellipse(headRadius * 0.1, 0, ringRadius, ringRadius * 0.4, p.wingPhase * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.strokeStyle = '#fbbf24'; // Gold
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(headRadius * 0.1, 0, ringRadius * 1.3, ringRadius * 0.5, -p.wingPhase * 0.9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Soft glowing solar aura sphere
    const headGrad = ctx.createRadialGradient(headRadius * 0.2, 0, 1, 0, 0, auraPulseSize);
    headGrad.addColorStop(0, '#ffffff');
    headGrad.addColorStop(0.35, theme.primaryColor);
    headGrad.addColorStop(0.75, theme.secondaryColor);
    headGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = headGrad;
    ctx.beginPath();
    ctx.arc(0, 0, auraPulseSize, 0, Math.PI * 2);
    ctx.fill();

    // Symmetrical digital reactor core geometric panel (No animal mouth)
    ctx.beginPath();
    ctx.moveTo(headRadius * 1.45, 0); // focal vertex
    ctx.lineTo(headRadius * 0.3, -headRadius * 0.8);
    ctx.lineTo(-headRadius * 0.7, -headRadius * 0.45);
    ctx.lineTo(-headRadius * 0.3, 0);
    ctx.lineTo(-headRadius * 0.7, headRadius * 0.45);
    ctx.lineTo(headRadius * 0.3, headRadius * 0.8);
    ctx.closePath();

    const shapeGrad = ctx.createLinearGradient(-headRadius * 0.7, 0, headRadius * 1.45, 0);
    shapeGrad.addColorStop(0, theme.secondaryColor);
    shapeGrad.addColorStop(0.6, theme.primaryColor);
    shapeGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = shapeGrad;
    ctx.fill();

    // Sharp electronic scanning visor eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(headRadius * 0.5, -headRadius * 0.2);
    ctx.lineTo(headRadius * 0.85, -headRadius * 0.12);
    ctx.lineTo(headRadius * 0.42, -headRadius * 0.08);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headRadius * 0.5, headRadius * 0.2);
    ctx.lineTo(headRadius * 0.85, headRadius * 0.12);
    ctx.lineTo(headRadius * 0.42, headRadius * 0.08);
    ctx.closePath();
    ctx.fill();

    // Filamento interno blanco caliente
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.globalAlpha = 0.95;
    ctx.beginPath();
    ctx.moveTo(-headRadius * 0.4, 0);
    ctx.lineTo(headRadius * 0.75, 0);
    ctx.stroke();

    // Symmetrical Abstract layered energy wing plates
    let wingsType = 'SPARK';
    if (canonicalProfile.stage <= 2) {
      wingsType = 'SPARK';
    } else if (canonicalProfile.stage <= 4) {
      wingsType = 'SOLAR_STREAM';
    } else if (canonicalProfile.stage <= 6) {
      wingsType = 'GUARDIAN_SERPENT';
    } else {
      wingsType = 'TITAN_SERPENT';
    }

    if (wingsType === 'SPARK') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.25, -headRadius * 0.15);
      ctx.quadraticCurveTo(-headRadius * 0.8, -headRadius * 0.45, -headRadius * 1.15, -headRadius * 0.35);
      ctx.moveTo(-headRadius * 0.25, headRadius * 0.15);
      ctx.quadraticCurveTo(-headRadius * 0.8, headRadius * 0.45, -headRadius * 1.15, headRadius * 0.35);
      ctx.stroke();

    } else if (wingsType === 'SOLAR_STREAM') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, headRadius * 1.02, -Math.PI / 2.2, Math.PI / 2.2);
      ctx.stroke();

      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.arc(0, 0, headRadius * 1.25, 0, Math.PI * 2);
      ctx.stroke();

    } else if (wingsType === 'GUARDIAN_SERPENT') {
      const flap = Math.sin(p.wingPhase * 1.4) * headRadius * 0.4;
      ctx.fillStyle = theme.auraColor;
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 2.0;

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.2, -headRadius * 0.4);
      ctx.lineTo(-headRadius * 1.1, -headRadius * 2.3 - flap);
      ctx.lineTo(headRadius * 0.35, -headRadius * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.2, headRadius * 0.4);
      ctx.lineTo(-headRadius * 1.1, headRadius * 2.3 + flap);
      ctx.lineTo(headRadius * 0.35, headRadius * 0.55);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.5, -headRadius * 0.3);
      ctx.lineTo(-headRadius * 1.4, -headRadius * 1.7 - flap * 0.6);
      ctx.lineTo(headRadius * 0.1, -headRadius * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.5, headRadius * 0.3);
      ctx.lineTo(-headRadius * 1.4, headRadius * 1.7 + flap * 0.6);
      ctx.lineTo(headRadius * 0.1, headRadius * 0.45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = theme.secondaryColor;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      ctx.moveTo(-headRadius * 1.1, -headRadius * 2.3 - flap);
      ctx.quadraticCurveTo(-headRadius * 1.8, -headRadius * 2.5 - flap, -headRadius * 1.5, -headRadius * 1.2);
      ctx.moveTo(-headRadius * 1.1, headRadius * 2.3 + flap);
      ctx.quadraticCurveTo(-headRadius * 1.8, headRadius * 2.5 + flap, -headRadius * 1.5, headRadius * 1.2);
      ctx.stroke();

      ctx.save();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.ellipse(0, 0, headRadius * 1.8, headRadius * 0.6, p.wingPhase * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(0, 0, headRadius * 2.1, headRadius * 0.7, -p.wingPhase * 0.85, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(headRadius * 0.15, -headRadius * 0.4);
      ctx.quadraticCurveTo(headRadius * 0.48, 0, headRadius * 0.15, headRadius * 0.4);
      ctx.stroke();

    } else if (wingsType === 'TITAN_SERPENT') {
      const flap = Math.sin(p.wingPhase * 1.1) * headRadius * 0.55;

      ctx.fillStyle = theme.trailColor;
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(headRadius * 0.4, -headRadius * 0.12);
      ctx.lineTo(headRadius * 1.65, 0); 
      ctx.lineTo(headRadius * 0.4, headRadius * 0.12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = theme.secondaryColor;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.arc(-headRadius * 0.2, 0, headRadius * 1.45 + Math.sin(p.wingPhase * 1.2) * 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = theme.auraColor;
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 2.2;

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.3, -headRadius * 0.4);
      ctx.lineTo(-headRadius * 1.25, -headRadius * 2.8 - flap);
      ctx.lineTo(headRadius * 0.4, -headRadius * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.3, headRadius * 0.4);
      ctx.lineTo(-headRadius * 1.25, headRadius * 2.8 + flap);
      ctx.lineTo(headRadius * 0.4, headRadius * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.6, -headRadius * 0.3);
      ctx.lineTo(-headRadius * 1.65, -headRadius * 2.2 - flap * 0.7);
      ctx.lineTo(-headRadius * 0.1, -headRadius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-headRadius * 0.6, headRadius * 0.3);
      ctx.lineTo(-headRadius * 1.65, headRadius * 2.2 + flap * 0.7);
      ctx.lineTo(-headRadius * 0.1, headRadius * 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // Head Visual Target Rings (QA Checkpoint 2.1)
    if (core.gameMode === 'nexus_assault') {
      ctx.save();
      const pulse = 1 + Math.sin(core.vitalEnergyWind * 4.5) * 0.15;
      const outerR = (headRadius * 1.25) * pulse;
      const isRecentlyHit = core.player.lastHitZone === 'head' && (Date.now() - core.player.lastHitTime < 450);

      ctx.strokeStyle = isRecentlyHit ? `rgba(255, 255, 255, ${0.8 + Math.sin(Date.now() / 30) * 0.2})` : 'rgba(34, 211, 238, 0.75)';
      ctx.lineWidth = isRecentlyHit ? 3.0 : 1.8;
      if (isRecentlyHit) {
        ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, outerR * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2 - core.vitalEnergyWind * 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * (outerR - 4), Math.sin(ang) * (outerR - 4));
        ctx.lineTo(Math.cos(ang) * (outerR + 3), Math.sin(ang) * (outerR + 3));
        ctx.stroke();
      }

      ctx.rotate(-p.angle);
      ctx.fillStyle = isRecentlyHit ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
      ctx.font = 'bold 8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('NÚCLEO', 0, -outerR - 5);
      ctx.restore();
    }

    // Render Elemental Combat Modules in Nexus Assault Mode
    if (core.gameMode === 'nexus_assault' && core.assaultRun) {
      core.assaultRun.modules.forEach((mod: any) => {
        const index = mod.bodyIndex !== undefined ? mod.bodyIndex : (mod.segmentIndex !== undefined ? mod.segmentIndex : 3);
        const seg = p.segments[index];
        if (seg) {
          ctx.save();
          // SECCIÓN 7 & 8 — Paletas elementales canónicas oficiales completas de ORBI
          const elementColorMap: Record<string, { primary: string, secondary: string, aura: string }> = {
            foton: { primary: '#B6FF00', secondary: '#8DFF00', aura: 'rgba(182, 255, 0, 0.45)' }, // Foton -> verde solar/neón
            hydro: { primary: '#0ea5e9', secondary: '#2563eb', aura: 'rgba(14, 165, 233, 0.45)' }, // Hydro -> azul/cian
            aero: { primary: '#10b981', secondary: '#14b8a6', aura: 'rgba(16, 185, 129, 0.45)' }, // Aero -> turquesa/verde eólico
            termo: { primary: '#ff6a2a', secondary: '#ff2d00', aura: 'rgba(255, 106, 42, 0.45)' }, // Termo -> rojo/naranja térmico
            terra: { primary: '#ff6a2a', secondary: '#ff2d00', aura: 'rgba(255, 106, 42, 0.45)' }, // Terra -> termo
            magne: { primary: '#b58cff', secondary: '#7b4dff', aura: 'rgba(181, 140, 255, 0.45)' }, // Magne -> violeta magnético
            aton: { primary: '#dfff4a', secondary: '#9aff00', aura: 'rgba(223, 255, 74, 0.45)' }, // Aton -> amarillo nuclear
            kinetrix: { primary: '#ff2a85', secondary: '#ff7a1a', aura: 'rgba(255, 42, 133, 0.45)' }, // Kinetrix -> magenta/rosa cinético
            h2nova: { primary: '#00f0ff', secondary: '#00ffc8', aura: 'rgba(0, 240, 255, 0.45)' }, // H2Nova -> azul hidrógeno brillante
            quantum: { primary: '#6366f1', secondary: '#4f46e5', aura: 'rgba(99, 102, 241, 0.45)' }, // Quantum -> púrpura/índigo profundo
            gaia: { primary: '#22c55e', secondary: '#15803d', aura: 'rgba(34, 197, 94, 0.45)' }       // Gaia -> verde naturaleza/vida
          };

          const palette = elementColorMap[mod.element] || { primary: '#B6FF00', secondary: '#8DFF00', aura: 'rgba(182, 255, 0, 0.45)' };
          const primaryColor = palette.primary;
          const secondaryColor = palette.secondary;
          const auraColor = palette.aura;

          // SECCIÓN 2 & 9 Scales
          let sizeMultiplier = 1.0;
          let glowMultiplier = 1.0;
          let alphaMultiplier = 1.0;
          if (ENABLE_SERPENT_VISUAL_POLISH_5R3B) {
            sizeMultiplier *= 0.92 * 0.92; // global internalCoreRadiusScale reduction (0.92) + assault additional reduction (0.92)
            glowMultiplier *= 0.88;        // global internalCoreGlowScale reduction (0.88)
            alphaMultiplier *= 0.92;       // global internalCoreAlpha reduction (0.92)
          }

          const size = (seg.size || 15) * sizeMultiplier;
          const time = performance.now() * 0.005;
          const pulse = 1 + Math.sin(time + index) * 0.15;
          
          ctx.globalAlpha = 0.85 * alphaMultiplier;

          // Soft aura glow
          const auraGrad = ctx.createRadialGradient(seg.x, seg.y, size * 0.2, seg.x, seg.y, size * 2.2 * pulse * glowMultiplier);
          auraGrad.addColorStop(0, primaryColor);
          auraGrad.addColorStop(0.4, 'rgba(0,0,0,0)');
          ctx.fillStyle = auraGrad;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, size * 2.2 * pulse * glowMultiplier, 0, Math.PI * 2);
          ctx.fill();

          // Symmetrical spinning orbit ring ("usar pequeño halo/aro orbital correspondiente")
          ctx.strokeStyle = secondaryColor;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.save();
          ctx.translate(seg.x, seg.y);
          ctx.rotate(time * 0.5 + index);
          ctx.ellipse(0, 0, size * 1.6 * pulse, size * 0.65 * pulse, 0, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();

          // Main core outline ring
          ctx.strokeStyle = primaryColor;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, size * 1.3 * pulse, 0, Math.PI * 2);
          ctx.stroke();

          // White-hot inner core
          const coreGrad = ctx.createRadialGradient(seg.x, seg.y, 1, seg.x, seg.y, size * 0.7);
          coreGrad.addColorStop(0, '#ffffff');
          coreGrad.addColorStop(0.5, primaryColor);
          coreGrad.addColorStop(1, 'transparent');
          ctx.fillStyle = coreGrad;
          ctx.beginPath();
          ctx.arc(seg.x, seg.y, size * 0.7, 0, Math.PI * 2);
          ctx.fill();

          // Tiny satellite orbiting
          const rotAngle = time * 0.8 + index;
          const ox = seg.x + Math.cos(rotAngle) * (size * 1.35 * pulse);
          const oy = seg.y + Math.sin(rotAngle) * (size * 1.35 * pulse);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(ox, oy, 2.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        }
      });
    }

    // Tail Vital Marker (QA Checkpoint 2.2)
    if (core.gameMode === 'nexus_assault' && p.segments && p.segments.length > 0) {
      const tailSeg = p.segments[p.segments.length - 1];
      const tailRadius = getAssaultTailHitRadius();
      
      ctx.save();
      const pulse = 1 + Math.sin(core.vitalEnergyWind * 4.5) * 0.15;
      const outerR = (tailRadius * 1.25) * pulse;
      const isRecentlyHit = core.player.lastHitZone === 'tail' && (Date.now() - core.player.lastHitTime < 450);

      ctx.translate(tailSeg.x, tailSeg.y);

      ctx.strokeStyle = isRecentlyHit ? `rgba(255, 255, 255, ${0.8 + Math.sin(Date.now() / 30) * 0.2})` : 'rgba(244, 63, 94, 0.75)';
      ctx.lineWidth = isRecentlyHit ? 3.0 : 1.8;
      if (isRecentlyHit) {
        ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, outerR * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(0, 0, outerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 1.2;
      for (let i = 0; i < 4; i++) {
        const ang = (i * Math.PI) / 2 + core.vitalEnergyWind * 0.5;
        ctx.beginPath();
        ctx.moveTo(Math.cos(ang) * (outerR - 4), Math.sin(ang) * (outerR - 4));
        ctx.lineTo(Math.cos(ang) * (outerR + 3), Math.sin(ang) * (outerR + 3));
        ctx.stroke();
      }

      ctx.fillStyle = isRecentlyHit ? '#ffffff' : 'rgba(255, 255, 255, 0.45)';
      ctx.font = 'bold 8px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText('COLA', 0, -outerR - 5);
      ctx.restore();
    }

    ctx.restore();

    if (isVitalFlow && ENABLE_VITAL_FLOW_LONG_TAIL_RENDER_OPTIMIZATION) {
      p.segments = originalSegments;
    }
  };

  const drawActiveAbilityRipples = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    if (core.ability.radialEffectActive) {
      const radius = core.ability.radialEffectRadius;
      const alpha = 1.0 - (radius / core.ability.radialEffectMaxRadius);
      
      ctx.save();
      ctx.strokeStyle = core.ability.radialEffectColor;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 4.0;
      ctx.beginPath();
      ctx.arc(core.ability.radialEffectX, core.ability.radialEffectY, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Thin secondary echo
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(core.ability.radialEffectX, core.ability.radialEffectY, Math.max(0, radius - 25), 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  };

  const drawCosmicParticlesGlow = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    ctx.save();
    
    core.particles.forEach((pt) => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, Math.min(1, pt.alpha));
      
      if (pt.type === 'COLLECT_SHOCKWAVE') {
        const curRadius = pt.size * (1 + (1 - pt.life) * 2.2);
        
        ctx.strokeStyle = pt.color;
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, curRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, curRadius * 1.15, 0, Math.PI * 2);
        ctx.stroke();
      } else if (pt.glow) {
        // High def radial gradient to represent energy shine
        const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.size * 3.8);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.28, pt.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size * 3.8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    ctx.restore();
  };

  const drawFloatingTextsOverlays = (ctx: CanvasRenderingContext2D) => {
    const core = stateRef.current;
    ctx.save();
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    core.floatingTexts.forEach((t) => {
      ctx.font = `bold ${t.size}px "JetBrains Mono", monospace`;
      ctx.fillStyle = t.color;
      ctx.globalAlpha = t.life;
      ctx.fillText(t.text, t.x, t.y);
    });
    ctx.restore();
  };

  const getEvolveProgression = () => {
    if (ENABLE_GLOBAL_SERPENT_EVOLUTION_SCALE_FIX && stats.visualStage !== undefined) {
      const stage = stats.visualStage;
      if (stage >= 8) {
        return { percent: 100, label: 'NEXUS SERPENT TOTALMENTE EVOLUCIONADO' };
      }

      let currentVal = 0;
      let thresholds: number[] = [];
      let labelTgt = "";

      if (gameMode === 'vital_flow') {
        currentVal = stateRef.current.vitalFlow ? stateRef.current.vitalFlow.pickupsCollected : 0;
        thresholds = [0, 8, 18, 32, 50, 72, 98, 128];
        const nextLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
        labelTgt = nextLabels[stage];
      } else if (gameMode === 'infinite') {
        currentVal = stateRef.current.timeElapsed || 0;
        thresholds = [0, 25, 55, 95, 145, 210, 290, 390];
        const nextLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
        labelTgt = nextLabels[stage];
      } else if (gameMode === 'nexus_assault') {
        currentVal = stats.energy;
        thresholds = [0, 15, 30, 50, 70, 95, 125, 160];
        const nextLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
        labelTgt = nextLabels[stage];
      } else {
        currentVal = stats.energy;
        thresholds = [0, 6, 14, 26, 42, 62, 86, 116];
        const nextLabels = ["E1", "E2", "E3", "E4", "E5", "E6", "E7", "E8"];
        labelTgt = nextLabels[stage];
      }

      const lower = thresholds[stage - 1];
      const upper = thresholds[stage];
      const range = upper - lower;
      const progress = range > 0 ? Math.min(100, Math.max(0, ((currentVal - lower) / range) * 100)) : 100;
      return {
        percent: progress,
        label: `${Math.round(progress)}% Para Etapa ${labelTgt}`
      };
    }

    const e = stats.energy;
    if (stats.evolution === 'SPARK') {
      const p = Math.min(100, (e / 25) * 100);
      return { percent: p, label: `${Math.round(p)}% Para Flujo Solar` };
    }
    if (stats.evolution === 'SOLAR_STREAM') {
      const base = 25;
      const target = 75;
      const p = Math.min(100, Math.max(0, ((e - base) / (target - base)) * 100));
      return { percent: p, label: `${Math.round(p)}% Para Nexus Guardian` };
    }
    if (stats.evolution === 'GUARDIAN_SERPENT') {
      return { percent: 100, label: 'NEXT: TITAN FLOW — LOCKED' };
    }
    return { percent: 100, label: 'TITÁN APEX COMPLETAMENTE ACTIVADO' };
  };

  const progressionData = getEvolveProgression();
  const themeSpecs = GUARDIAN_THEMES[selectedGuardian];

  return (
    <div
      ref={containerRef}
      id="nexus-serpent-root"
      className="relative w-full h-screen select-none overflow-hidden font-sans text-white bg-[#020617]"
    >
      {/* REBOOT 0.9 — Orientation Lock Overlay (Part 5) */}
      {viewport.isTouch && viewport.orientation === 'portrait' && (
        <div className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-lg flex flex-col justify-center items-center p-6 text-center animate-fade-in">
          <div className="max-w-xs flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-cyan-950/40 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-6 animate-pulse">
              <RotateCw className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <h2 className="font-display font-extrabold text-lg tracking-wider text-white uppercase">
              Girar Dispositivo
            </h2>
            <p className="font-mono text-[9.5px] text-cyan-400 uppercase tracking-widest mt-1">
              Modo Horizontal Requerido
            </p>
            <p className="text-xs text-slate-400 mt-4 leading-relaxed">
              Por favor, rote su dispositivo a modo horizontal para una óptima distribución espacial de los controles de la Red Vital.
            </p>
          </div>
        </div>
      )}

      {/* Damage flashing layer */}
      {damageFlashing && (
        <div className="absolute inset-0 z-35 bg-red-950/20 border-[8px] border-red-500/30 pointer-events-none animate-pulse" />
      )}

      {/* CORRUPTED CORE SENTINEL BOSS HUD */}
      {gameState === 'PLAYING' && sentinelUI && !sentinelUI.defeated && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-none flex flex-col gap-1.5 animate-fade-in">
          {/* Boss Info Header */}
          <div className="flex justify-between items-end px-1">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono tracking-widest text-[#a855f7] font-black uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                MINI-JEFE BLACKOUT DETECTADO
              </span>
              <h2 className={`font-mono text-sm font-extrabold tracking-wider ${
                sentinelUI.phase === 'enraged' ? 'text-rose-400 animate-pulse' :
                sentinelUI.phase === 'vulnerable' ? 'text-amber-400' : 'text-slate-100'
              }`}>
                SENTINEL DE CORE CORRUPTO
              </h2>
            </div>
            <div className="text-right font-mono text-[9px] text-slate-400">
              {sentinelUI.phase === 'forming' && <span className="text-purple-400 animate-pulse">FORMANDO VORTEX...</span>}
              {sentinelUI.phase === 'shielded' && <span className="text-cyan-400">ESCUDOS DE RED: ACTIVOS</span>}
              {sentinelUI.phase === 'vulnerable' && <span className="text-amber-400 font-bold animate-bounce">¡CORE EXPUESTO!</span>}
              {sentinelUI.phase === 'enraged' && <span className="text-rose-500 font-black animate-pulse">!!! SOBRECARGA CRÍTICA !!!</span>}
            </div>
          </div>

          {/* Dual progress bar glass panel */}
          <div className="bg-[#030712]/90 border border-purple-500/20 rounded-xl p-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(168,85,247,0.15)] flex flex-col gap-2 pointer-events-auto">
            {/* Core Integrity (Health Bar) */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 leading-none">
                <span>INTEGRIDAD DEL CORE</span>
                <span className="font-bold text-slate-200">{Math.round((sentinelUI.health / sentinelUI.maxHealth) * 100)}%</span>
              </div>
              <div className="w-full h-2 rounded bg-slate-950/60 border border-white/5 overflow-hidden relative">
                <div 
                  className={`h-full transition-all duration-300 rounded ${
                    sentinelUI.phase === 'enraged' ? 'bg-gradient-to-r from-red-600 to-rose-400 animate-pulse' : 'bg-gradient-to-r from-purple-600 to-[#7c4dff]'
                  }`}
                  style={{ width: `${(sentinelUI.health / sentinelUI.maxHealth) * 100}%` }}
                />
              </div>
            </div>

            {/* Network Shield (Shield Bar) */}
            {sentinelUI.maxShield > 0 && (
              <div className="flex flex-col gap-1 transition-all">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 leading-none">
                  <span>ESCUDO DE RED BLACKOUT</span>
                  <span className="font-bold text-cyan-300">
                    {sentinelUI.shield > 0 ? `${Math.round((sentinelUI.shield / sentinelUI.maxShield) * 100)}%` : 'CONEXIÓN CORRUPTA - APAGADO'}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded bg-slate-950/60 border border-white/5 overflow-hidden relative">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-600 to-[#20d6ff] transition-all duration-300 rounded"
                    style={{ width: `${(sentinelUI.shield / sentinelUI.maxShield) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Centered Boundary Alert Warn Banner */}
      {gameState === 'PLAYING' && boundaryAlert && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-40 pointer-events-none flex flex-col items-center">
          <div className={`px-5 py-2.5 rounded-xl border backdrop-blur-md flex items-center gap-2.5 shadow-[0_0_20px_rgba(239,68,68,0.25)] transition-all duration-300 animate-pulse ${
            boundaryAlert === 'ESTABILIDAD CRÍTICA'
              ? 'border-rose-500 bg-red-950/85 text-rose-200'
              : boundaryAlert === 'CAMPO DE CONTENCIÓN ACTIVO'
                ? 'border-amber-500 bg-amber-950/85 text-amber-200'
                : 'border-cyan-500/30 bg-cyan-950/80 text-cyan-200'
          }`}>
            <ShieldAlert className={`w-4 h-4 ${
              boundaryAlert === 'ESTABILIDAD CRÍTICA' ? 'text-rose-400' : boundaryAlert === 'CAMPO DE CONTENCIÓN ACTIVO' ? 'text-amber-400' : 'text-cyan-400'
            }`} />
            <span className="font-mono text-xs font-black tracking-widest uppercase">
              {boundaryAlert}
            </span>
          </div>
        </div>
      )}

      {/* GAME RUNTIME HUD */}
      {gameState === 'PLAYING' && (
        <>
          {/* GLOBAL TACTICAL HUD GRID (Standardized - Módulo 6A) */}
          <div 
            className="absolute top-0 left-0 right-0 z-30 pointer-events-none flex flex-col gap-3"
            style={{
              paddingTop: 'calc(env(safe-area-inset-top, 0px) + 12px)',
              paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 12px)',
              paddingRight: 'calc(env(safe-area-inset-right, 0px) + 12px)',
            }}
          >
            {/* Top row: Left: Hero Info & Vital, Center: Mode & Stage, Right: Resource & Threat */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 w-full">
              
              {/* Left Column: Hero & Vital info */}
              <div className="flex flex-col gap-2 pointer-events-auto shrink-0">
                <OrbiHeroInfoPanel 
                  gameMode={gameMode}
                  selectedGuardian={selectedGuardian}
                  themeSpecs={themeSpecs}
                  stats={stats}
                  hudMode={hudMode}
                />
                <OrbiVitalPanel 
                  gameMode={gameMode}
                  stats={stats}
                  themeSpecs={themeSpecs}
                  state={stateRef.current}
                  hudMode={hudMode}
                />
              </div>

              {/* Center Column: Mode & Stage Info, plus objectives or special events */}
              <div className="flex flex-col items-center gap-1.5 shrink-0 mx-auto pointer-events-auto">
                <OrbiModeStagePanel 
                  gameMode={gameMode}
                  state={stateRef.current}
                  hudMode={hudMode}
                />

                {/* Gaia Lock progress specifically for Nexus Assault */}
                {gameMode === 'nexus_assault' && stateRef.current.assaultRun && (
                  <div className="flex flex-col gap-1 w-44 sm:w-48 bg-[#030712]/90 border border-emerald-500/20 p-2 rounded-xl backdrop-blur-md shadow-xl">
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-slate-350 gap-2 leading-none">
                      <span className="font-bold flex items-center gap-1 text-emerald-400">
                        <Sparkles className="w-3 h-3 text-emerald-400" /> GAIA LOCK
                      </span>
                      <span className="font-bold text-emerald-400">
                        {getGaiaEnergyProgress(stateRef.current.assaultRun)} / 9
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded bg-slate-950/60 border border-white/5 relative overflow-hidden mt-1">
                      <div
                        className="h-full duration-200 transition-all rounded-sm bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse"
                        style={{
                          width: `${(getGaiaEnergyProgress(stateRef.current.assaultRun) / 9) * 100}%`,
                          boxShadow: '0 0 8px rgba(52, 211, 153, 0.4)'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Debug HUD Compact Mode */}
                {gameMode === 'nexus_assault' && debugHudMode === "compact" && (
                  <div className="flex items-center gap-2.5 bg-[#030712]/92 border border-cyan-500/20 px-3 py-1 rounded-full backdrop-blur-md text-[8.5px] font-mono text-cyan-400 shadow-xl animate-fade-in mt-1">
                    <span>HOSTILES: <strong className="text-white">{stateRef.current.assaultRun ? stateRef.current.assaultRun.enemies.length : 0}</strong></span>
                    <span className="text-white/10">|</span>
                    <span>T. SALA: <strong className="text-white">{(stateRef.current.assaultRun?.waveClearTimer || 0).toFixed(1)}s</strong></span>
                  </div>
                )}
              </div>

              {/* Right Column: Resources & Threat Info, Pause & Toggle controls */}
              <div className="flex flex-col gap-2 items-end pointer-events-auto shrink-0 justify-end md:justify-start">
                <OrbiResourcePanel 
                  gameMode={gameMode}
                  stats={stats}
                  state={stateRef.current}
                  bestVitalFlowTime={bestVitalFlowTime}
                  bestVitalFlowScore={bestVitalFlowScore}
                  bestVitalFlowLength={bestVitalFlowLength}
                  bestVitalFlowPickups={bestVitalFlowPickups}
                  bestSurvivalTime={bestSurvivalTime}
                  bestSurvivalScore={bestSurvivalScore}
                  hudMode={hudMode}
                />
                
                <OrbiThreatPanel 
                  gameMode={gameMode}
                  state={stateRef.current}
                  hudMode={hudMode}
                  getSurvivalDifficultyProfile={getSurvivalDifficultyProfile}
                />

                {/* Control Action Buttons (Compact Menu) */}
                <div className="flex items-center gap-1.5 bg-[#030712]/90 border border-white/10 p-1 rounded-xl backdrop-blur-md mt-1">
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-1 bg-slate-900 border border-white/10 rounded-lg text-slate-350 hover:text-white hover:bg-slate-800 duration-150 cursor-pointer"
                    title={soundEnabled ? "Silenciar audio" : "Activar audio"}
                  >
                    {soundEnabled ? <Volume2 className="w-3 h-3 text-yellow-400" /> : <VolumeX className="w-3 h-3 text-slate-500" />}
                  </button>
                  <button
                    onClick={() => setHudMode(prev => prev === 'full' ? 'compact' : 'full')}
                    className="px-2 py-1 bg-slate-900 border border-white/10 rounded-lg text-slate-350 hover:text-white text-[8px] font-mono font-bold hover:bg-slate-800 duration-150 cursor-pointer"
                    title="Alternar vista HUD [H]"
                  >
                    HUD: {hudMode === 'full' ? 'COMPACTO' : 'COMPLETO'}
                  </button>
                  <button
                    onClick={() => setGameState('PAUSED')}
                    className="p-1 bg-slate-900 border border-white/10 rounded-lg text-slate-350 hover:text-white hover:bg-slate-800 duration-150 cursor-pointer"
                    title="Pausar juego [PESC]"
                  >
                    <Pause className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* FLOATING TACTICAL SIDEBARS (Standardized - Módulo 6A) */}
          {/* Right Floating Sidebar: Synergies, Build details, and Radar Minimap */}
          <div 
            className="absolute right-4 top-24 z-25 pointer-events-auto max-w-[280px] sm:max-w-xs flex flex-col gap-3 animate-fade-in"
            style={{
              paddingRight: 'calc(env(safe-area-inset-right, 0px))',
            }}
          >
            {/* Standardized Synergy & Module Build Panel */}
            <OrbiSynergyPanel 
              stateRef={stateRef}
              hudMode={hudMode}
            />

            {/* Standardized Tactical Radar & Scan Minimap */}
            <OrbiRadarPanel 
              gameMode={gameMode}
              hudMode={hudMode}
              stateRef={stateRef}
            />
          </div>

          {/* Left Floating Sidebar or Bottom Center: Toggleable Diagnostics (Tracker) */}
          {showDebugHUD && (
            <div 
              className="absolute left-4 top-24 z-25 pointer-events-auto w-64 bg-[#03010b]/95 border border-cyan-500/35 rounded-xl p-3.5 backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.25)] flex flex-col gap-2.5 animate-fade-in"
              style={{
                paddingLeft: 'calc(env(safe-area-inset-left, 0px))',
              }}
            >
              <div className="flex justify-between items-center pb-1.5 border-b border-cyan-500/20">
                <span className="font-mono text-[9px] font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  DIAGNÓSTICOS CORE
                </span>
                <button 
                  onClick={() => setShowDebugHUD(false)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer text-[10px]"
                >
                  ✕
                </button>
              </div>

              {/* General details based on Mode */}
              {gameMode === 'nexus_assault' && stateRef.current.assaultRun && (
                <div className="flex flex-col gap-1.5 text-[9.5px] font-mono text-slate-350">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>HOSTILES:</span>
                    <strong className="text-white">{stateRef.current.assaultRun.enemies.length}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>STATUS SALA:</span>
                    <strong className="text-amber-400 uppercase">{stateRef.current.assaultRun.run?.status || 'combat'}</strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>TIEMPO SALA:</span>
                    <strong className="text-white">{(stateRef.current.assaultRun.waveClearTimer || 0).toFixed(1)}s</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>CUERPO CRECIMIENTO:</span>
                    <strong className="text-emerald-400">+{stateRef.current.assaultRun.assaultBodyGrowth ?? 1}</strong>
                  </div>
                </div>
              )}

              {/* Survival Diagnostics */}
              {gameMode === 'infinite' && stateRef.current.survival && (
                <div className="flex flex-col gap-1.5 text-[9.5px] font-mono text-slate-350">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>SERPIENTES EN ARENA:</span>
                    <strong className="text-purple-400 font-bold">
                      {(stateRef.current.survival.antiSerpents || []).filter(s => s.alive).length} / {stateRef.current.survival.maxAntiSerpents}
                    </strong>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span>HAZARDS ACTIVOS:</span>
                    <strong className="text-white">{(stateRef.current.survival.hazards || []).length} / 5</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>ESTADO DEBUFF:</span>
                    <strong className={`uppercase ${stateRef.current.survival.debuffType ? 'text-red-400 animate-pulse' : 'text-slate-500'}`}>
                      {stateRef.current.survival.debuffType || 'NINGUNO'}
                    </strong>
                  </div>

                  {/* List active threats */}
                  {(stateRef.current.survival.antiSerpents || []).filter(s => s.alive).length > 0 && (
                    <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-white/5">
                      <span className="text-[8px] text-slate-500 uppercase font-bold">LISTA DE AMENAZAS:</span>
                      <div className="max-h-[80px] overflow-y-auto flex flex-col gap-1 pr-0.5">
                        {(stateRef.current.survival.antiSerpents || []).filter(s => s.alive).map((serp) => {
                          const hpPerc = Math.round((serp.hp / serp.maxHp) * 100);
                          return (
                            <div key={serp.id} className="p-1 bg-[#12071a]/40 border border-purple-500/10 rounded flex flex-col gap-0.5 text-[8px]">
                              <div className="flex justify-between items-center font-mono">
                                <span className="font-bold text-purple-300">
                                  {ORBI_ANTI_ENERGY_REGISTRY[serp.antiEnergy]?.label || 'ANTI-ENEMIGO'}
                                </span>
                                <span className="text-slate-400">{hpPerc}% HP</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* General Active Orbs Tracker */}
              <div className="flex flex-col gap-1 mt-1.5 pt-1.5 border-t border-white/5 text-[9.5px] font-mono text-slate-350">
                <div className="flex justify-between">
                  <span>ORBES ACTIVOS:</span>
                  <strong className="text-white">{stateRef.current.orbs?.length || 0}</strong>
                </div>
                {stateRef.current.orbs && stateRef.current.orbs.length > 0 && (
                  <div className="max-h-[100px] overflow-y-auto flex flex-col gap-1 pr-0.5 mt-1">
                    {stateRef.current.orbs.slice(0, 5).map((orb: any, idx: number) => {
                      const percent = Math.min(100, ((orb.lifetime || 0) / 5.5) * 100);
                      return (
                        <div key={orb.id || idx} className="p-1 bg-slate-950/70 border border-white/5 rounded flex flex-col gap-0.5 text-[8px]">
                          <div className="flex justify-between items-center">
                            <span className="text-cyan-400 font-bold">ORB #{idx + 1}</span>
                            <span className="text-[7.5px] text-slate-500 uppercase">
                              {orb.magnetized ? 'MAGNETIZADO' : 'ESTÁTICO'}
                            </span>
                          </div>
                          <div className="w-full h-1 bg-slate-900 rounded overflow-hidden mt-0.5">
                            <div 
                              className={`h-full ${percent > 80 ? 'bg-amber-500' : 'bg-cyan-500'}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    {stateRef.current.orbs.length > 5 && (
                      <span className="text-[7.5px] text-center text-slate-500 italic mt-0.5">
                        + {stateRef.current.orbs.length - 5} orbes adicionales...
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pause Button / Controls wrapper (Standardized HUD overlay) */}
          <div className="absolute top-4 right-4 z-25 pointer-events-auto flex items-center gap-2"
               style={{
                 paddingTop: 'calc(env(safe-area-inset-top, 0px))',
                 paddingRight: 'calc(env(safe-area-inset-right, 0px))',
               }}>
            <button
              onClick={() => setGameState('PAUSED')}
              className="p-3 bg-[#030712]/85 border border-cyan-500/15 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 duration-150 cursor-pointer shadow-xl backdrop-blur-md"
              title="Pausar Juego"
            >
              <Pause className="w-4 h-4" />
            </button>
          </div>

          {/* ACTIVE CASTING SHIELD BUTTON (Dynamic layout based on Touch vs Desktop - REBOOT 0.9) */}
          {gameMode !== 'vital_flow' && (
            <div 
              className={`absolute z-25 pointer-events-auto flex flex-col items-center gap-1 ${
                isTouchDevice 
                  ? "bottom-6 right-8" 
                  : "bottom-6 left-1/2 transform -translate-x-1/2"
              }`}
              style={isTouchDevice ? {
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
                paddingRight: 'calc(env(safe-area-inset-right, 0px))',
              } : undefined}
            >
              <button
                onClick={triggerGuardianAbility}
                disabled={abilityCooldownRemaining > 0}
                className={`w-14 h-14 rounded-full border bg-[#030712]/90 flex flex-col items-center justify-center transition duration-150 hover:scale-105 active:scale-95 shadow-2xl relative cursor-pointer ${
                  abilityDenied 
                    ? 'animate-wiggle border-red-500 text-red-500' 
                    : abilityCooldownRemaining > 0 
                      ? 'border-slate-800 text-slate-600' 
                      : 'border-cyan-500/50 text-cyan-400'
                }`}
                style={{
                  boxShadow: abilityDenied
                    ? '0 0 20px #ef4444'
                    : abilityCooldownRemaining === 0
                      ? `0 0 16px ${themeSpecs.primaryColor}50`
                      : 'none'
                }}
              >
                <Zap className="w-6 h-6 animate-pulse" />
                
                {abilityCooldownRemaining > 0 && (
                  <span className="absolute inset-0 rounded-full flex items-center justify-center bg-black/60 font-mono text-sm text-slate-400 font-bold">
                    {abilityCooldownRemaining}s
                  </span>
                )}
              </button>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#22d3ee] bg-cyan-950/20 px-2 py-0.5 border border-cyan-500/10 rounded">
                {themeSpecs.abilityName} {isTouchDevice ? "[TAP]" : "[ESPACIO]"}
              </span>
            </div>
          )}

          {gameMode === 'vital_flow' && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-25 pointer-events-none flex flex-col items-center gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#10b981] bg-emerald-950/30 px-3 py-1.5 border border-emerald-500/20 rounded-lg shadow-lg">
                VITAL FLOW — CONTROL EL FLUJO
              </span>
            </div>
          )}

          {/* Touch Joystick Overlay representation for mobile devices (REBOOT 0.9) */}
          {isTouchDevice && (
            <div 
              className="absolute bottom-6 left-8 z-15 pointer-events-none"
              style={{
                paddingBottom: 'calc(env(safe-area-inset-bottom, 0px))',
                paddingLeft: 'calc(env(safe-area-inset-left, 0px))',
              }}
            >
              <div className="w-20 h-20 rounded-full border border-white/10 bg-slate-950/30 backdrop-blur-xs flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/35 border border-cyan-400/50 animate-pulse" />
              </div>
              {showStartHint && gameMode !== 'demo' && (
                <span className="absolute top-full left-0 right-0 text-center font-mono text-[9px] text-slate-300 mt-1 uppercase tracking-widest bg-[#030712]/90 border border-cyan-500/15 px-2.5 py-1 rounded animate-fade-in duration-300">
                  {gameMode === 'vital_flow' ? "Absorbe esencias. Evita bordes." : "Arrastra para dirigir la energía ORBI"}
                </span>
              )}
            </div>
          )}

          {/* Compact Control Hint for Red Vital (REBOOT 0.9 / Surgical Glassmorphism) */}
          {gameMode === 'demo' && showCompactControlHint && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-45 p-3 sm:p-3.5 bg-[#030712]/80 border border-cyan-550/25 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.15)] pointer-events-none max-w-sm animate-fade-in duration-300">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                <p className="font-mono text-[9.5px] sm:text-[10.5px] text-cyan-300 leading-normal uppercase tracking-widest text-center select-none">
                  Guía la energía ORBI con el cursor, WASD o toque.
                </p>
              </div>
            </div>
          )}

          {/* Keyboard keys hints overlay on wide desktops (Start Label Cleanup) */}
          {showStartHint && !isTouchDevice && gameMode !== 'demo' && (
            <div className="absolute bottom-4 left-4 z-15 p-3.5 bg-[#030712]/85 border border-[#22d3ee]/15 rounded-xl pointer-events-none max-w-sm animate-fade-in duration-300">
              <p className="font-mono text-[10.5px] text-slate-300 leading-relaxed uppercase tracking-wider">
                {gameMode === 'vital_flow' ? (
                  <>
                    <span className="text-emerald-400 font-bold">Absorbe esencias.</span><br />
                    <span className="text-rose-400 font-bold mt-1 block">Evita bordes y tu propio cuerpo.</span>
                  </>
                ) : (
                  <>
                    <span className="text-cyan-400 font-bold">Guía la energía ORBI con el mouse, WASD o flechas.</span><br />
                    <span className="text-slate-400 text-[10px] mt-1 block">Espacio / botón táctil para desencadenar habilidad.</span>
                  </>
                )}
              </p>
            </div>
          )}

          {/* Left-side objectives checklist panel (Demo Mode only) */}
          {gameMode === 'demo' && (
            <div className={`absolute top-44 left-4 z-30 transition-all duration-300 max-w-xs sm:max-w-sm pointer-events-auto ${
              isObjectivesMinimized ? '-translate-x-[calc(100%-24px)] opacity-60 hover:opacity-100' : 'translate-x-0'
            }`}>
              <div className="bg-[#030712]/92 border border-cyan-500/20 rounded-xl p-4 backdrop-blur-md shadow-2xl relative">
                
                {/* Collapse button on the right edge */}
                <button
                  onClick={() => setIsObjectivesMinimized(!isObjectivesMinimized)}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-950 border border-cyan-500/30 text-cyan-400 hover:text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 duration-150"
                  title={isObjectivesMinimized ? "Expandir Objetivos" : "Minimizar Objetivos"}
                >
                  <span className="font-mono text-[10px] font-bold leading-none">{isObjectivesMinimized ? '▶' : '◀'}</span>
                </button>

                <div className="flex items-center justify-between gap-3 mb-2.5 pb-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-display font-medium text-[10.5px] tracking-wider uppercase text-slate-100">
                      SECTOR VITAL
                    </span>
                  </div>
                  <span className="font-mono text-[9px] bg-cyan-950/50 border border-cyan-500/20 px-1.5 py-0.5 text-cyan-400 rounded">
                    {objectives.filter(o => o.completed).length}/4 COMPLETO
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  {objectives.map((obj) => (
                    <div key={obj.id} className="flex gap-2 items-start">
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 font-mono text-[9px] ${
                        obj.completed
                          ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                          : 'border-slate-750 bg-slate-900/40 text-slate-500'
                      }`}>
                        {obj.completed ? '✓' : '•'}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-[10.5px] font-mono font-bold leading-tight transition-all duration-300 ${
                          obj.completed ? 'text-slate-400 line-through' : 'text-slate-200'
                        }`}>
                          {obj.label}
                        </span>
                        <span className="text-[8.5px] font-sans text-slate-400 leading-tight">
                          {obj.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cinematic Intro Overlay Component (Start Countdown Polish) */}
          {cinematicActive && (
            <div className="absolute inset-0 z-50 bg-slate-950/20 flex flex-col justify-center items-center p-6 text-center pointer-events-none select-none">
              <div className="absolute top-6 right-6 pointer-events-auto">
                <button
                  onClick={handleSkipCinematic}
                  className="px-3 py-1.5 border border-slate-700/25 hover:border-cyan-500/50 bg-slate-950/40 rounded-lg text-slate-400 hover:text-cyan-400 text-[9px] tracking-widest font-mono uppercase cursor-pointer transition duration-150 active:scale-95 shadow-md flex items-center gap-1.5"
                >
                  <span>Omitir</span> <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>

              <div className="flex flex-col items-center justify-center animate-fade-in duration-300">
                {cinematicTimerSeconds > 1 ? (
                  <div className="flex flex-col items-center">
                    {/* Big glowing numbers */}
                    <span 
                      className="text-8xl font-display font-black tracking-tighter"
                      style={{
                        color: GUARDIAN_THEMES[selectedGuardian]?.primaryColor || '#22d3ee',
                        textShadow: `0 0 20px ${GUARDIAN_THEMES[selectedGuardian]?.primaryColor || '#22d3ee'}a0`,
                      }}
                    >
                      {cinematicTimerSeconds - 1}
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 tracking-widest uppercase mt-3">
                      {gameMode === 'nexus_assault' ? "Sincronizando Asalto" : (gameMode === 'vital_flow' ? "Sincronizando Flujo" : "Sincronizando Estela")}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <span 
                      className="text-4xl sm:text-5xl font-display font-black tracking-widest uppercase animate-pulse"
                      style={{
                        color: GUARDIAN_THEMES[selectedGuardian]?.primaryColor || '#22d3ee',
                        textShadow: `0 0 25px ${GUARDIAN_THEMES[selectedGuardian]?.primaryColor || '#22d3ee'}`,
                      }}
                    >
                      {gameMode === 'nexus_assault' ? "ASALTO NEXUS" : (gameMode === 'vital_flow' ? "FLUJO VITAL" : "FLUJO ORBI")}
                    </span>
                    <span className="font-mono text-[9.5px] text-yellow-400 tracking-widest uppercase mt-2 font-bold animate-pulse">
                      {gameMode === 'nexus_assault' ? "¡SALA DE ASALTO ACTIVA!" : "¡RED VITAL ACTIVA!"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Active Tutorial Step Card Overlay (REBOOT 0.9 — Responsive Adaptability) */}
          {tutorialEnabled && gameMode !== 'vital_flow' && gameMode !== 'demo' && !cinematicActive && activeTutorialStep && TUTORIAL_STEPS_CONFIG[activeTutorialStep] && (
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 z-40 pointer-events-auto w-full max-w-md px-4 animate-fade-in"
              style={{
                top: viewport.deviceProfile === 'mobile' ? 'calc(env(safe-area-inset-top, 0px) + 72px)' : '112px',
              }}
            >
              <div className="bg-[#030712]/92 border border-cyan-400/40 p-3 sm:p-4 rounded-xl shadow-[0_0_30px_rgba(34,211,238,0.15)] flex flex-col gap-2 sm:gap-2.5 backdrop-blur-md">
                <div className="flex items-center justify-between gap-4 pb-1.5 border-b border-white/5 border-dashed">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="font-mono text-[9px] sm:text-[10px] text-cyan-400 font-bold uppercase tracking-widest select-none">
                      {TUTORIAL_STEPS_CONFIG[activeTutorialStep].title}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        markTutorialStepCompleted(activeTutorialStep);
                      }}
                      className="font-mono text-[8.5px] sm:text-[9px] font-bold tracking-widest uppercase text-slate-350 hover:text-white px-1.5 py-0.5 border border-slate-800 hover:border-slate-700 bg-slate-900/60 rounded duration-150 cursor-pointer"
                    >
                      Entendido
                    </button>
                    <button
                      onClick={handleSkipTutorial}
                      className="font-mono text-[8.5px] sm:text-[9px] text-slate-500 hover:text-red-400 hover:border-red-400/30 px-1.5 py-0.5 border border-transparent rounded duration-150 cursor-pointer"
                      title="Desactivar tutorial por completo"
                    >
                      Omitir
                    </button>
                  </div>
                </div>
                <p className="text-[10.5px] sm:text-[11.5px] font-sans text-slate-200 leading-relaxed text-left">
                  {TUTORIAL_STEPS_CONFIG[activeTutorialStep].message}
                </p>
                <div className="flex items-center justify-between font-mono text-[8px] sm:text-[8.5px] text-slate-400 tracking-wider">
                  <span>✓ CUMPLE LA CONDICIÓN PARA CONTINUAR</span>
                  <span>{completedTutorialSteps.length}/9 COMPLETO</span>
                </div>
              </div>
            </div>
          )}

          {/* Contextual Suggestion Help Message Overlay */}
          {contextualHelp && (
            <div className="absolute bottom-[16%] left-1/2 transform -translate-x-1/2 z-40 pointer-events-none w-full max-w-lg px-4 text-center animate-fade-in">
              <div className="bg-[#020617]/95 border border-cyan-400/20 px-4 py-2.5 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-xs">
                <span className="font-mono text-[9.5px] text-cyan-400 font-medium tracking-wide uppercase leading-normal">
                  {contextualHelp}
                </span>
              </div>
            </div>
          )}

          {/* NEXUS ASSAULT UPGRADE PANEL OVERLAY (Asalto Hotfix 1.1d) */}
          {gameMode === 'nexus_assault' && stateRef.current.assaultRun && (stateRef.current.assaultRun.run.status === 'upgrade_selection' || stateRef.current.assaultRun.showUpgradePanel) && (
            <div className="absolute inset-0 z-50 bg-[#020617ef]/98 backdrop-blur-lg flex flex-col justify-center items-center p-4 sm:p-6 text-center animate-fade-in pointer-events-auto overflow-y-auto">
              <div className="max-w-4xl w-full flex flex-col items-center gap-4 sm:gap-6 my-auto py-6">
                
                {/* Header */}
                <div className="flex flex-col items-center gap-1 sm:gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-500/30 bg-amber-950/20 flex items-center justify-center text-amber-400 animate-pulse shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                    <Sparkles className="w-5 sm:w-6 sm:h-6 h-5" />
                  </div>
                  <span className="font-mono text-[9px] sm:text-[10px] text-amber-400 font-bold uppercase tracking-widest leading-none mt-1 sm:mt-2">SALA COMPLETADA</span>
                  <h2 className="font-display font-black text-xl sm:text-3xl text-white tracking-widest mt-1">
                    SELECCIONA MEJORA DEL CORE
                  </h2>
                  <div className="w-24 sm:w-32 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-1" />
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl mt-2 sm:mt-4">
                  {upgradesList && upgradesList.map((upgrade, index) => {
                    const rarityColors: Record<string, string> = {
                      common: 'border-slate-800 bg-slate-950/60 hover:border-slate-500 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] text-slate-300',
                      rare: 'border-cyan-500/20 bg-cyan-950/15 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] text-cyan-300',
                      epic: 'border-purple-500/30 bg-purple-950/15 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] text-purple-300'
                    };
                    const badgeColors: Record<string, string> = {
                      common: 'bg-slate-900 border-slate-700 text-slate-400',
                      rare: 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400',
                      epic: 'bg-purple-950/50 border-purple-500/30 text-purple-400'
                    };
                    return (
                      <button
                        key={upgrade.id || index}
                        onClick={() => selectAssaultUpgrade(upgrade)}
                        className={`flex flex-col text-left p-4 sm:p-5 rounded-2xl border backdrop-blur-xs transition duration-200 hover:scale-[1.02] active:scale-95 cursor-pointer flex-1 gap-3 sm:gap-4 ${rarityColors[upgrade.rarity] || rarityColors.common}`}
                      >
                        <div className="flex justify-between items-center w-full">
                          <span className={`text-[8.5px] sm:text-[9px] font-mono font-bold uppercase px-2 py-0.5 border rounded ${badgeColors[upgrade.rarity] || badgeColors.common}`}>
                            {upgrade.rarity}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500">#{index + 1}</span>
                        </div>
                        
                        <div className="flex flex-col gap-1 mt-1">
                          <h3 className="font-mono font-black text-xs sm:text-sm tracking-wide text-white leading-snug">
                            {upgrade.title}
                          </h3>
                          <p className="font-sans text-[10.5px] sm:text-[11.5px] text-slate-400 leading-relaxed mt-1">
                            {upgrade.description}
                          </p>
                        </div>

                        <div className="w-full h-[1px] bg-white/5 mt-auto pt-2" />
                        <div className="flex items-center gap-1.5 font-mono text-[9px] sm:text-[9.5px] text-amber-400 uppercase tracking-widest">
                          <span>ASIMILAR NÚCLEO</span> <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Countdown / Failsafe footer representation */}
                <div className="font-mono text-[9px] text-slate-500 mt-2 uppercase tracking-wider select-none animate-pulse">
                  FALLSAFE ACTIVO: TRANSICIÓN AUTOMÁTICA EN {Math.max(0, 6 - Math.floor(stateRef.current.assaultRun?.upgradePanelTimer || 0))}S
                </div>

              </div>
            </div>
          )}
        </>
      )}

      {/* Cinematic Room Entry Banner (Implementation 6 & 7) */}
      {roomEntryBanner && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center pointer-events-none select-none bg-black/10 backdrop-blur-[1px] overflow-hidden">
          {/* Top/Bottom Cinematic Letterbox Bars */}
          <div className="absolute top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black/80 to-transparent transition-all duration-300 animate-slide-down" />
          <div className="absolute bottom-0 left-0 w-full h-[60px] bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 animate-slide-up" />

          {/* Central Banner Container */}
          <div className="flex flex-col items-center text-center px-8 py-6 max-w-xl scale-95 animate-fade-in relative bg-slate-950/80 border border-white/5 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(34,211,238,0.15)]">
            
            {/* Tech bracket line decoration */}
            <div className="absolute -inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-400/85 to-transparent" />
            <div className="absolute -inset-x-6 bottom-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/85 to-transparent" />
            
            <span className="font-mono text-[9px] font-black tracking-[0.25em] text-cyan-400 uppercase drop-shadow-[0_0_8px_rgba(34,211,238,0.55)]">
              ESTABILIZANDO SECTOR ORBI
            </span>

            <h1 className="font-display font-black text-4xl text-white tracking-[0.1em] uppercase my-2 drop-shadow-[0_2px_15px_rgba(255,255,255,0.2)] flex items-center gap-3">
              SALA {String(roomEntryBanner.roomIndex).padStart(2, '0')}
            </h1>

            <div className="flex items-center gap-3 mt-1.5 font-mono text-[9px] tracking-widest text-slate-300 bg-slate-950/90 border border-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              <div className="flex items-center gap-1">
                <span className="text-slate-500">TIPO:</span>
                <strong className={`uppercase ${
                  roomEntryBanner.roomType === 'boss' ? 'text-rose-400 font-black' :
                  roomEntryBanner.roomType === 'rest' ? 'text-teal-400 font-bold' :
                  roomEntryBanner.roomType === 'hazard' ? 'text-amber-400' :
                  roomEntryBanner.roomType === 'elite' ? 'text-purple-400' : 'text-slate-300'
                }`}>
                  {roomEntryBanner.roomType}
                </strong>
              </div>
              <span className="text-white/10">|</span>
              <div className="flex items-center gap-1">
                <span className="text-slate-500">GEOMETRÍA:</span>
                <strong className="text-white uppercase font-bold">{roomEntryBanner.shape}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sliding Objective Completed Toast/Banner */}
      {completedBanner && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none w-full max-w-sm px-4 animate-fade-in">
          <div className="bg-slate-950/95 border-2 border-[#fbbf24] p-3 rounded-xl shadow-[0_0_25px_rgba(251,191,36,0.35)] flex items-center gap-3 backdrop-blur-md">
            <div className="w-8 h-8 rounded-full bg-yellow-950/50 border border-[#fbbf24]/50 flex items-center justify-center text-yellow-400 animate-bounce shrink-0 shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-mono text-[8px] font-black text-[#fbbf24] tracking-widest uppercase">
                OBJETIVO COMPLETADO
              </span>
              <span className="font-display font-bold text-xs text-slate-100 tracking-wide mt-0.5">
                {completedBanner.label}
              </span>
              <span className="text-[9px] font-sans text-slate-400 mt-0.5 leading-tight">
                {completedBanner.text}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Infinite Mode Engaged Banner */}
      {showInfiniteBanner && (
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none w-full max-w-md px-4 text-center animate-fade-in">
          <div className="bg-slate-950/95 border border-purple-500/40 p-5 rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.35)] flex flex-col items-center gap-2 backdrop-blur-md">
            <div className="w-10 h-10 rounded-full bg-purple-950/50 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-0.5">
              <Crown className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-purple-400 font-display font-black text-lg tracking-widest leading-none">
              MODO INFINITO ACTIVADO
            </h2>
            <p className="font-mono text-slate-300 text-[9px] tracking-widest uppercase mt-1 leading-none">
              SOBREVIVE AL BLACKOUT COMPLETO
            </p>
          </div>
        </div>
      )}

      {/* EVOLVE SUPER CINEMATIC OVERLAY CARD */}
      {evolveOverlay.visible && (
        <div className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center bg-black/45 backdrop-blur-xs transition-all duration-300">
          <div className="bg-[#030712]/92 border-2 border-yellow-400 p-8 py-10 rounded-2xl shadow-[0_0_50px_rgba(251,191,36,0.3)] flex flex-col items-center gap-2 transform transition-transform duration-300 scale-100">
            <div className="w-16 h-16 rounded-full bg-yellow-950/45 border border-yellow-400/50 flex items-center justify-center text-yellow-400 animate-pulse mb-2 shadow-[0_0_15px_rgba(251,191,36,0.25)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-yellow-400 font-display font-black text-2xl sm:text-3xl tracking-widest text-center">
              {evolveOverlay.title}
            </h2>
            <div className="w-24 h-[1px] bg-yellow-400/50 my-2" />
            <p className="font-mono text-slate-300 text-xs tracking-widest uppercase font-semibold text-center mt-1 text-cyan-400">
              {evolveOverlay.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* STAGE CANVAS LAYER RENDER */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="w-full h-full block cursor-crosshair touch-none bg-[#020617]"
      />

      {/* ========================================================
          SCREEN OVERLAY: START SCREEN (INTRODUCIR LA DEMO MASTER)
          ======================================================== */}
      {gameState === 'START' && (
        <div className="orbi-premium-start absolute inset-0 z-40 flex flex-col items-center justify-start p-4 sm:p-6 text-center overflow-y-auto animate-fade-in">
          
          {/* Symmetrical glowing energy backdrop sphere */}
          <div className="absolute w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />
          <div className="absolute w-[320px] h-[320px] rounded-full bg-cyan-600/10 blur-[90px] pointer-events-none mt-20" />

          <div className="relative z-10 w-full max-w-[1640px] mx-auto flex flex-col items-center pt-4 sm:pt-7">
            
            {/* Top decorative particle spark icon header */}
            <div className="w-12 h-12 rounded-full bg-yellow-950/45 border border-[#fbbf24]/50 flex items-center justify-center text-yellow-400 animate-pulse mb-3 shadow-[0_0_25px_rgba(251,191,36,0.4)]">
              <Zap className="w-5 h-5" />
            </div>

            <h1 className="orbi-premium-title font-display font-black text-4xl sm:text-6xl tracking-[0.15em] text-[#f8fafc] mb-1">
              ORBI NEXUS SERPENT
            </h1>
            <p className="font-mono text-[10px] sm:text-xs text-cyan-400 uppercase tracking-widest font-semibold mb-6">
              DESPIERTA LA RED VITAL · CUATRO MUNDOS · UNA ENERGÍA
            </p>

            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent mb-6" />

            <p className="font-sans text-sm text-slate-200 leading-relaxed max-w-2xl mb-6">
              Una pequeña chispa solar de energía ORBI despierta dentro de la Red Vital. Absorbe orbes de luz codificados para evolucionar tu flujo de plasma continuo hacia un Guardián de Luz espectacular.
            </p>

            {/* Mode selection columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 w-full mb-8">
              {/* CARD 1: RED VITAL */}
              <div className="orbi-premium-mode orbi-mode-vital flex flex-col justify-between p-5 border rounded-xl transition-all text-left relative">
                <div className="orbi-mode-art" aria-hidden="true"><span>✦</span></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-cyan-400/25 text-cyan-400 bg-cyan-950/30 font-bold uppercase tracking-wider">
                      Misión principal
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    RED VITAL
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 leading-normal mt-1.5 mb-4">
                    Evoluciona, purifica la Red Vital y derrota al Sentinel.
                  </p>
                  <div className="border-t border-white/5 pt-2.5 mb-4">
                    <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider">IDEAL PARA:</span>
                    <span className="font-sans text-[10px] text-cyan-300">Primera partida / experiencia guiada.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGameMode('demo');
                    setGameState('CHOOSE');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-650 border border-cyan-400/30 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider hover:from-cyan-500 hover:to-indigo-550 active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                >
                  Iniciar Red Vital <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD 2: SUPERVIVENCIA NEXUS */}
              <div className="orbi-premium-mode orbi-mode-survival flex flex-col justify-between p-5 border rounded-xl transition-all text-left relative">
                <div className="orbi-mode-art" aria-hidden="true"><span>◈</span></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-purple-400/25 text-purple-400 bg-purple-950/30 font-bold uppercase tracking-wider">
                      Infinito
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    SUPERVIVENCIA NEXUS
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 leading-normal mt-1.5 mb-4">
                    Sobrevive el mayor tiempo posible mientras la amenaza Blackout escala sin límite.
                  </p>
                  <div className="border-t border-white/5 pt-2.5 mb-4">
                    <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider">IDEAL PARA:</span>
                    <span className="font-sans text-[10px] text-purple-300">Récords / práctica / desafío continuo.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGameMode('infinite');
                    setGameState('CHOOSE');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-[#7c4dff]/70 to-[#9c27b0]/70 border border-purple-400/30 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider hover:from-[#7c4dff]/90 hover:to-[#9c27b0]/90 active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.15)]"
                >
                  Iniciar Supervivencia <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* CARD 3: NEXUS ASSAULT */}
              <div className="orbi-premium-mode orbi-mode-assault flex flex-col justify-between p-5 border rounded-xl transition-all text-left relative">
                <div className="orbi-mode-art" aria-hidden="true"><span>⚔</span></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-amber-400/25 text-amber-400 bg-amber-950/30 font-bold uppercase tracking-wider">
                      Roguelite experimental
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    NEXUS ASSAULT
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 leading-normal mt-1.5 mb-4">
                    Limpia cámaras, elige upgrades, integra núcleos ORBI y construye una serpiente multienergética.
                  </p>
                  <div className="border-t border-white/5 pt-2.5 mb-4">
                    <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider">IDEAL PARA:</span>
                    <span className="font-sans text-[10px] text-amber-300">Combate avanzado / builds / salas.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGameMode('nexus_assault');
                    setGameState('CHOOSE');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-orange-700 border border-amber-400/30 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider hover:from-amber-500 hover:to-orange-650 active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                >
                  Iniciar Assault <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                </button>
              </div>

              {/* CARD 4: VITAL FLOW */}
              <div className="orbi-premium-mode orbi-mode-flow flex flex-col justify-between p-5 border rounded-xl transition-all text-left relative">
                <div className="orbi-mode-art" aria-hidden="true"><span>∞</span></div>
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-[8px] px-2 py-0.5 rounded border border-emerald-400/25 text-emerald-400 bg-emerald-950/30 font-bold uppercase tracking-wider">
                      Homenaje Clásico
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base text-white tracking-wide">
                    VITAL FLOW
                  </h3>
                  <p className="font-sans text-[11px] text-slate-300 leading-normal mt-1.5 mb-4">
                    Crece continuamente comiendo esencia vital. La colisión con bordes o con tu propio cuerpo desatará el colapso.
                  </p>
                  <div className="border-t border-white/5 pt-2.5 mb-4">
                    <span className="font-mono text-[8px] text-slate-500 block uppercase tracking-wider">IDEAL PARA:</span>
                    <span className="font-sans text-[10px] text-emerald-300">Habilidad clásica / reflejos / crecimiento puro.</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setGameMode('vital_flow');
                    setGameState('CHOOSE');
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 border border-emerald-400/30 text-white font-mono font-bold text-xs rounded-lg uppercase tracking-wider hover:from-emerald-500 hover:to-teal-650 active:scale-95 duration-100 flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)]"
                >
                  Iniciar Vital Flow <Play className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                </button>
              </div>
            </div>

            {/* Interactive Tutorial and Cinematic Onboarding Toggle */}
            <div className="flex items-center gap-4 bg-[#030712]/75 border border-cyan-500/15 p-4 rounded-xl max-w-sm mb-6 shadow-lg">
              <div className="flex flex-col text-left">
                <span className="font-mono text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                  MÓDULO DE ENTRENAMIENTO
                </span>
                <span className="text-[10px] font-sans text-slate-400 mt-0.5 leading-snug">
                  Activar tutorial guiado interactivo y secuencia de enlace cinemático inicial.
                </span>
              </div>
              <button
                onClick={() => {
                  const newVal = !tutorialEnabled;
                  setTutorialEnabled(newVal);
                  safeSetLocalStorage("orbiNexusTutorialEnabled", newVal ? "true" : "false");
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  tutorialEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow-md ring-0 transition duration-200 ease-in-out ${
                    tutorialEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* REBOOT 1.0 — INFORMACIÓN Y CRÉDITOS (Parte 3, 4, 11) */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-6 font-mono text-[10px] text-slate-400 select-none">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`flex items-center gap-1.5 cursor-pointer duration-150 active:scale-95 transition-all py-1.5 px-3 border border-slate-500/10 rounded-lg font-semibold uppercase text-[9px] tracking-wider ${
                  soundEnabled 
                    ? 'hover:text-yellow-400 hover:border-yellow-400/30 text-yellow-400/90 bg-yellow-950/10' 
                    : 'hover:text-slate-300 hover:border-slate-500/30 text-slate-500 bg-[#090d22]/30'
                }`}
              >
                {soundEnabled ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-yellow-400" /> AUDIO: ON
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-slate-500" /> AUDIO: OFF
                  </>
                )}
              </button>

              <button
                onClick={() => setShowAboutModal(true)}
                className="flex items-center gap-1.5 hover:text-cyan-400 cursor-pointer duration-150 active:scale-95 transition-all py-1.5 px-3 border border-slate-500/10 rounded-lg hover:border-cyan-400/30 bg-[#090d22]/30 hover:bg-[#090d22]/80 font-semibold uppercase text-[9px] tracking-wider"
              >
                <Info className="w-3.5 h-3.5 text-cyan-400" /> ACERCA DE ORBI
              </button>

              <button
                onClick={() => setShowModeGuideModal(true)}
                className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer duration-150 active:scale-95 transition-all py-1.5 px-3 border border-slate-500/10 rounded-lg hover:border-emerald-400/30 bg-[#090d22]/30 hover:bg-[#090d22]/80 font-semibold uppercase text-[9px] tracking-wider"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-400" /> ¿QUÉ MODO ELEGIR?
              </button>
              
              <button
                onClick={() => setShowCreditsModal(true)}
                className="flex items-center gap-1.5 hover:text-purple-400 cursor-pointer duration-150 active:scale-95 transition-all py-1.5 px-3 border border-slate-500/10 rounded-lg hover:border-purple-400/30 bg-[#090d22]/30 hover:bg-[#090d22]/80 font-semibold uppercase text-[9px] tracking-wider"
              >
                <Crown className="w-3.5 h-3.5 text-purple-400" /> CRÉDITOS
              </button>

              <button
                onClick={() => setShowResetConfirm(true)}
                className="flex items-center gap-1.5 hover:text-rose-400 cursor-pointer duration-150 active:scale-95 transition-all py-1.5 px-3 border border-slate-500/10 rounded-lg hover:border-rose-400/30 bg-[#090d22]/30 hover:bg-[#090d22]/80 font-semibold uppercase text-[9px] tracking-wider font-bold"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" /> REINICIAR DATOS
              </button>
            </div>

            <div className="text-slate-500 text-[9px] uppercase tracking-wider font-mono mb-2">
              Build: {ORBI_NEXUS_RELEASE.version} | Frozen Demo Candidate
            </div>

            {/* REBOOT 1.0 — MODAL INTERFACE RENDERERS (Parte 3, 4, 11) */}
            {showAboutModal && (
              <div className="absolute inset-0 z-50 bg-[#020617ef] backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
                <div className="relative w-full max-w-md bg-[#050b18]/95 border border-cyan-500/30 rounded-2xl p-6 text-left shadow-[0_0_50px_rgba(34,211,238,0.15)] overflow-y-auto max-h-[90vh]">
                  {/* Close button */}
                  <button
                    onClick={() => setShowAboutModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition duration-150 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <Info className="w-5 h-5 text-cyan-400" />
                    <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                      Acerca de la Demo
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-white tracking-wide mb-1">
                    ORBI NEXUS SERPENT
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="font-mono text-[9.5px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded font-bold">
                      {ORBI_NEXUS_RELEASE.version}
                    </span>
                    <span className="text-slate-400 font-mono text-[9px] uppercase tracking-wider">
                      CODENAME: {ORBI_NEXUS_RELEASE.codename}
                    </span>
                  </div>

                  <p className="font-sans text-[11.5px] text-slate-300 leading-relaxed mb-4">
                    <strong>ORBI NEXUS SERPENT</strong> es una demo web experimental del universo <strong>ORBI Ecosystem</strong>. Presenta una criatura de energía vital que evoluciona a través de diferentes modos de juego, combinando reflejos, estrategia, supervivencia, evolución elemental y estética sci-fi cósmica.
                  </p>

                  <p className="font-sans text-[11px] text-slate-400 leading-relaxed mb-5">
                    Esta versión es una demo pública no comercial, creada para mostrar la dirección visual, jugable y narrativa del proyecto. No representa una versión final comercial.
                  </p>

                  <div className="space-y-2 mb-6">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block font-bold">MODOS INCLUIDOS:</span>
                    
                    <div className="bg-[#030712]/60 border border-white/5 p-2.5 rounded-xl">
                      <span className="font-mono text-[9px] text-cyan-400 font-bold block mb-0.5">1. RED VITAL (Demo Ready)</span>
                      <p className="font-sans text-[10.5px] text-slate-400 leading-relaxed">
                        Misión principal de evolución ORBI. Recolecta energía, crece fase por fase, purifica zonas y enfrenta amenazas Blackout.
                      </p>
                    </div>

                    <div className="bg-[#030712]/60 border border-white/5 p-2.5 rounded-xl">
                      <span className="font-mono text-[9px] text-purple-400 font-bold block mb-0.5">2. SUPERVIVENCIA NEXUS (Demo Ready)</span>
                      <p className="font-sans text-[10.5px] text-slate-400 leading-relaxed">
                        Modo infinito de resistencia contra anti-energías y amenazas Blackout. Sobrevive, evoluciona y supera récords.
                      </p>
                    </div>

                    <div className="bg-[#030712]/60 border border-white/5 p-2.5 rounded-xl">
                      <span className="font-mono text-[9px] text-amber-400 font-bold block mb-0.5">3. NEXUS ASSAULT (Demo Ready)</span>
                      <p className="font-sans text-[10.5px] text-slate-400 leading-relaxed">
                        Modo roguelite de salas, núcleos elementales, portales dimensionales, oleadas, descansos y progresión táctica.
                      </p>
                    </div>

                    <div className="bg-[#030712]/60 border border-white/5 p-2.5 rounded-xl">
                      <span className="font-mono text-[9px] text-emerald-400 font-bold block mb-0.5">4. VITAL FLOW (Experimental Playable / Demo Lab)</span>
                      <p className="font-sans text-[10.5px] text-slate-400 leading-relaxed">
                        Modo inspirado en la viborita clásica, reinterpretado con estética ORBI, crecimiento energético, auto-colisión y desafío de flujo continuo.
                      </p>
                    </div>

                    <div className="bg-[#030712]/60 border border-white/5 p-3 rounded-xl flex items-center justify-between mt-3">
                      <div>
                        <span className="font-mono text-[9px] text-slate-400 font-bold block">PUNTAJE MÁXIMO LOCAL</span>
                        <span className="font-mono text-xs font-bold text-yellow-400 mt-0.5 block">
                          {stats.highScore} PTS
                        </span>
                      </div>
                      {bestDemoRun && (
                        <div className="text-right">
                          <span className="font-mono text-[9px] text-slate-400 font-bold block">RANGO LOGRADO</span>
                          <span className="font-mono text-xs font-bold text-cyan-400 mt-0.5 block">
                            RANGO {bestDemoRun.rank === 'ORBI_PRIME' ? 'PRIME' : bestDemoRun.rank}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Reset button inside About modal */}
                  <div className="border-t border-slate-500/10 pt-4 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-sans">¿Deseas reiniciar tu progreso?</span>
                    <button
                      onClick={() => setShowResetConfirm(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/20 hover:border-rose-500/40 text-rose-400 font-mono text-[10px] rounded-lg duration-150 cursor-pointer active:scale-95"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> RESTABLECER
                    </button>
                  </div>
                </div>
              </div>
            )}

            {showModeGuideModal && (
              <div className="absolute inset-0 z-50 bg-[#020617ef] backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
                <div className="relative w-full max-w-2xl bg-[#050b18]/95 border border-emerald-500/30 rounded-2xl p-6 text-left shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-y-auto max-h-[90vh]">
                  {/* Close button */}
                  <button
                    onClick={() => setShowModeGuideModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition duration-150 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="w-5 h-5 text-emerald-400 animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                      Guía del Sistema Orbi
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-white tracking-wide mb-1">
                    ¿QUÉ MODO DE JUEGO ELEGIR?
                  </h3>
                  <p className="font-sans text-[11.5px] text-slate-400 leading-relaxed mb-6">
                    ORBI NEXUS SERPENT ofrece tres modalidades de juego distintas diseñadas para diferentes estilos y de acuerdo a tu nivel de experiencia. Compara sus características a continuación:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* RED VITAL DETAILS */}
                    <div className="bg-[#030712]/60 border border-cyan-500/10 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[8px] font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-1.5 py-0.5 rounded uppercase block w-max mb-2">
                          Misión principal
                        </span>
                        <h4 className="font-display font-bold text-sm text-slate-100">RED VITAL</h4>
                        <p className="text-[10.5px] text-slate-400 mt-2 font-sans leading-relaxed">
                          Objetivo cerrado, evolución guiada, derrota al Sentinel.
                        </p>
                        <div className="mt-3 space-y-1.5 text-[9.5px] font-mono text-slate-400">
                          <div className="flex items-start gap-1">
                            <span className="text-cyan-400">•</span>
                            <span>Progresión guiada de Spark a Guardian</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-cyan-400">•</span>
                            <span>Purificación de zonas Blackout</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-cyan-400">•</span>
                            <span>Encuentro final con Sentinel</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                        DIFICULTAD: <span className="text-green-400 font-bold">RECOMENDADO</span>
                      </div>
                    </div>

                    {/* SUPERVIVENCIA NEXUS DETAILS */}
                    <div className="bg-[#030712]/60 border border-purple-500/10 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[8px] font-bold text-purple-400 bg-purple-950/40 border border-purple-500/20 px-1.5 py-0.5 rounded uppercase block w-max mb-2">
                          Arcade infinito
                        </span>
                        <h4 className="font-display font-bold text-sm text-slate-100">SUPERVIVENCIA NEXUS</h4>
                        <p className="text-[10.5px] text-slate-400 mt-2 font-sans leading-relaxed">
                          Sin final fijo, dificultad progresiva, busca tu récord personal.
                        </p>
                        <div className="mt-3 space-y-1.5 text-[9.5px] font-mono text-slate-400">
                          <div className="flex items-start gap-1">
                            <span className="text-purple-400">•</span>
                            <span>Escalamiento de corrupción</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-purple-400">•</span>
                            <span>Resistencia sin límite temporal</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-purple-400">•</span>
                            <span>Récords de puntuación máxima</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                        DIFICULTAD: <span className="text-yellow-400 font-bold">ESCALABLE</span>
                      </div>
                    </div>

                    {/* NEXUS ASSAULT DETAILS */}
                    <div className="bg-[#030712]/60 border border-amber-500/10 p-4 rounded-xl flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[8px] font-bold text-amber-400 bg-amber-950/40 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase block w-max mb-2">
                          Roguelite experimental
                        </span>
                        <h4 className="font-display font-bold text-sm text-slate-100">NEXUS ASSAULT</h4>
                        <p className="text-[10.5px] text-slate-400 mt-2 font-sans leading-relaxed">
                          Combate por salas, upgrades modulares, integración de núcleos.
                        </p>
                        <div className="mt-3 space-y-1.5 text-[9.5px] font-mono text-slate-400">
                          <div className="flex items-start gap-1">
                            <span className="text-amber-400">•</span>
                            <span>Upgrades al limpiar salas de asalto</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-amber-400">•</span>
                            <span>Integración de núcleos elementales</span>
                          </div>
                          <div className="flex items-start gap-1">
                            <span className="text-amber-400">•</span>
                            <span>Vulnerabilidad en cabeza y cola</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-2 border-t border-white/5 text-[9px] font-mono text-slate-500">
                        DIFICULTAD: <span className="text-rose-400 font-bold">DESAFIANTE</span>
                      </div>
                    </div>
                  </div>

                  {/* Informative footer */}
                  <div className="border-t border-slate-500/10 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                    <span>SELECCIÓN DE PROTOCOLO JUGABLE</span>
                    <span>v1.1.3D</span>
                  </div>
                </div>
              </div>
            )}

            {showCreditsModal && (
              <div className="absolute inset-0 z-50 bg-[#020617ef] backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 animate-fade-in">
                <div className="relative w-full max-w-md bg-[#050b18]/95 border border-purple-500/30 rounded-2xl p-6 text-left shadow-[0_0_50px_rgba(124,77,255,0.15)] overflow-y-auto max-h-[90vh]">
                  {/* Close button */}
                  <button
                    onClick={() => setShowCreditsModal(false)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg p-1 transition duration-150 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-purple-400" />
                    <span className="font-mono text-[10px] text-purple-400 font-bold uppercase tracking-widest">
                      Créditos Oficiales
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-white tracking-wide mb-1">
                    ORBI NEXUS SERPENT
                  </h3>
                  <span className="font-mono text-[9.5px] text-slate-400 block mb-5 uppercase tracking-wider">
                    Una creación del universo ORBI Ecosystem
                  </span>

                  <div className="space-y-4 font-mono text-xs text-slate-300">
                    <div className="border-l-2 border-purple-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">CONCEPTO & DIRECCIÓN CREATIVA</span>
                      <span className="font-bold text-slate-200">Víctor Marcel León Pacheco</span>
                      <p className="text-slate-400 text-[10px] leading-relaxed mt-1">
                        Creador de la visión, dirección artística, diseño original de mecánicas de juego, validación, narrativa del universo ORBI y evolución del proyecto.
                      </p>
                    </div>

                    <div className="border-l-2 border-cyan-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">CO-DISEÑO CONCEPTUAL</span>
                      <span className="font-bold text-slate-200">ChatGPT / OpenAI</span>
                      <p className="text-slate-400 text-[10px] leading-relaxed mt-1">
                        Arquitectura de sistemas, documentación técnica, prompts maestros, balance funcional y asistencia creativa continua.
                      </p>
                    </div>

                    <div className="border-l-2 border-yellow-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">IMPLEMENTACIÓN ASISTIDA</span>
                      <span className="font-bold text-slate-200">Google AI Studio</span>
                      <p className="text-slate-400 text-[10px] leading-relaxed mt-1">
                        Generación y refactorización de código, integración técnica, depuración, optimización de renderizado y compilación de build.
                      </p>
                    </div>

                    <div className="border-l-2 border-emerald-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">ECOSISTEMA</span>
                      <span className="font-bold text-slate-200">ORBI Ecosystem</span>
                      <span className="text-slate-400 block text-[10px] mt-0.5">Plataforma Cósmica de Evolución e Integración Vital</span>
                    </div>

                    <div className="border-l-2 border-slate-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">AÑO DE ESTABILIZACIÓN</span>
                      <span className="font-bold text-slate-200">2026</span>
                    </div>

                    <div className="border-l-2 border-indigo-500/30 pl-3 py-0.5">
                      <span className="text-slate-500 text-[9px] block uppercase">BETA TESTING & FEEDBACK</span>
                      <span className="font-bold text-slate-200">Pruebas & Validación de Demo</span>
                      <p className="text-slate-400 text-[10px] leading-relaxed mt-1">
                        Gracias a los beta testers que participarán en la validación temprana de esta demo, aportando observaciones, pruebas de usabilidad, reportes de errores y feedback para mejorar la experiencia final.
                      </p>
                      <div className="text-[10px] font-bold text-indigo-400 mt-1 uppercase">
                        Beta testers: Próximamente
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-500/10 pt-4 mt-6 text-center space-y-1 font-mono text-[9px] text-slate-500">
                    <div>
                      © 2026 ORBI Ecosystem. Todos los derechos reservados.
                    </div>
                    <div className="text-[8px] leading-normal uppercase">
                      © 2026 ORBI Ecosystem · Concepto y dirección: Víctor Marcel León Pacheco · Co-diseño: ChatGPT / OpenAI · Implementación asistida: Google AI Studio
                    </div>
                  </div>
                </div>
              </div>
            )}

            {showResetConfirm && (
              <div className="absolute inset-0 z-55 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
                <div className="w-full max-w-xs bg-[#0b0c16] border border-rose-500/40 rounded-xl p-5 text-center shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-3">
                    <Trash2 className="w-6 h-6 text-rose-500" />
                  </div>
                  
                  <h4 className="font-mono text-sm font-bold text-white uppercase tracking-wider mb-2">
                    ¿Confirmar purga total?
                  </h4>
                  
                  <p className="font-sans text-xs text-slate-400 leading-relaxed mb-5">
                    Esta acción restablecerá permanentemente tu puntaje máximo local, tutorial e historial. No se puede revertir.
                  </p>
                  
                  <div className="flex gap-3 justify-center font-mono text-[11px]">
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-4 py-2 bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-slate-300 rounded-lg duration-150 cursor-pointer"
                    >
                      CANCELAR
                    </button>
                    <button
                      onClick={() => {
                        handleResetLocalData();
                        setShowResetConfirm(false);
                        setShowAboutModal(false);
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg duration-150 font-bold cursor-pointer"
                    >
                      PURGAR DATOS
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN OVERLAY: GUARDIAN CHOICE SELECTION SCREEN
          ======================================================== */}
      {gameState === 'CHOOSE' && (
        <div className="orbi-guardian-choose absolute inset-0 z-45 p-4 sm:p-8 flex flex-col justify-between overflow-y-auto animate-fade-in">
          
          <div className="absolute w-[400px] h-[400px] -top-20 -left-20 rounded-full bg-cyan-600/5 blur-[100px] pointer-events-none" />
          <div className="absolute w-[400px] h-[400px] -bottom-20 -right-20 rounded-full bg-indigo-600/5 blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 text-center max-w-3xl mx-auto mt-2 sm:mt-4">
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest bg-cyan-950/30 px-2.5 py-1 border border-cyan-505/20 rounded">
              SALA DE ENLACE · GUARDIANES ENERGÉTICOS
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-wider mt-3">
              ELIGE TU SERPIENTE
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Cada energía transforma tu estrategia. Examina los poderes pasivos y activos antes de despertar tu núcleo.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 max-w-[1560px] mx-auto w-full my-5">
            {Object.values(GUARDIAN_THEMES).map((theme) => {
              const isSelected = selectedGuardian === theme.id;
              return (
                <div
                  key={theme.id}
                  onClick={() => setSelectedGuardian(theme.id)}
                  className={`orbi-guardian-card border rounded-2xl p-4 sm:p-5 cursor-pointer flex flex-col justify-between transition-all duration-150 ${
                    isSelected
                      ? 'orbi-guardian-selected bg-slate-950/90 border-cyan-400 shadow-[0_0_24px_rgba(6,182,212,0.28)] translate-y-[-4px]'
                      : 'bg-slate-950/75 border-white/20 hover:border-cyan-400/50 hover:bg-slate-950/90'
                  }`}
                >
                  <div>
                    {/* Elemental energy avatar — no change to guardian gameplay */}
                    <div className={`orbi-guardian-portrait orbi-guardian-${theme.id.toLowerCase()}`} aria-hidden="true"><span>{theme.name.charAt(0)}</span></div>
                    {/* Header bar */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">ELEMENTO</span>
                        <span className={`text-[11px] font-bold uppercase mt-1 leading-none ${theme.textColor}`}>{theme.element}</span>
                      </div>
                      <span className={`w-3 h-3 rounded-full ${
                        theme.id === 'FOTON' ? 'bg-[#22c55e]' : theme.id === 'HYDRO' ? 'bg-[#0ea5e9]' : theme.id === 'AERO' ? 'bg-[#10b981]' : theme.id === 'TERMO' ? 'bg-[#ff6a2a]' : theme.id === 'MAGNE' ? 'bg-[#7c4dff]' : theme.id === 'ATON' ? 'bg-[#dfff4a]' : 'bg-[#eab308]'
                      }`} />
                    </div>

                    <h3 className="text-lg font-bold text-white tracking-wide mb-2">
                      {theme.name}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      {theme.description}
                    </p>
                  </div>

                  <div className="border-t border-white/5 pt-3 mt-4 flex flex-col gap-1.5 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pasivo:</span>
                      <span className="text-slate-300 text-right leading-tight max-w-[130px]">{theme.passiveName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Activo:</span>
                      <span className="text-slate-300 text-right leading-tight max-w-[130px]">{theme.abilityName}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected guardian dossier; original game stats are read directly from GUARDIAN_THEMES. */}
          <div className="orbi-guardian-dossier relative z-10 max-w-[1560px] w-full mx-auto rounded-2xl border border-cyan-400/25 p-4 sm:p-6 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300">GUARDIÁN SELECCIONADO</span>
              <h3 className="text-2xl sm:text-3xl font-display font-black text-white tracking-widest mt-1">{GUARDIAN_THEMES[selectedGuardian].name}</h3>
              <p className="text-slate-300 text-sm mt-2 max-w-xl">{GUARDIAN_THEMES[selectedGuardian].description}</p>
            </div>
            <div className="flex flex-wrap gap-3 font-mono text-xs">
              <div className="rounded-lg border border-amber-400/25 bg-amber-950/20 px-4 py-3"><span className="block text-amber-300 text-[10px] mb-1">HABILIDAD PASIVA</span><strong className="text-white">{GUARDIAN_THEMES[selectedGuardian].passiveName}</strong></div>
              <div className="rounded-lg border border-cyan-400/25 bg-cyan-950/20 px-4 py-3"><span className="block text-cyan-300 text-[10px] mb-1">HABILIDAD ACTIVA</span><strong className="text-white">{GUARDIAN_THEMES[selectedGuardian].abilityName}</strong></div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="relative z-10 flex flex-col sm:flex-row gap-4 items-center justify-between max-w-4xl mx-auto w-full mb-4 border-t border-cyan-400/20 pt-4">
            <button
              onClick={handleReturnToMain}
              className="px-6 py-2.5 bg-transparent border border-white/10 rounded-xl text-slate-400 text-xs font-mono tracking-widest uppercase hover:text-white hover:bg-white/5 duration-150 cursor-pointer w-full sm:w-auto"
            >
              VOLVER AL INICIO
            </button>
            <button
              onClick={() => handleStartPlaying(selectedGuardian)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 border border-cyan-400/20 rounded-xl text-white text-xs font-mono tracking-widest font-bold uppercase hover:from-cyan-500 hover:to-indigo-500 active:scale-95 cursor-pointer duration-150 w-full sm:w-auto"
            >
              CONFIRMAR GUARDIÁN · DESPERTAR NÚCLEO
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN OVERLAY: PAUSE SCREEN
          ======================================================== */}
      {gameState === 'PAUSED' && (
        <div className="absolute inset-0 z-40 bg-[#020617f0] backdrop-blur-xl flex flex-col justify-center items-center p-6 text-center animate-fade-in">
          <div className="relative max-w-sm bg-slate-950/80 border border-cyan-500/15 p-8 rounded-2xl shadow-2xl flex flex-col items-center">
            
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-cyan-504/20 text-[#22d3ee] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5 animate-spin" />
            </div>

            <h2 className="font-display font-medium text-xl tracking-wider text-white mb-2">
              PROTOCOLO EN SUSPENSO
            </h2>
            <p className="font-sans text-xs text-slate-400 leading-relaxed mb-6">
              La conexión vital ha sido interrumpida temporalmente. Puedes retomar la modulación del núcleo o reconfigurar la esencia de la entidad.
            </p>

            <button
              onClick={handleResumePlay}
              className="w-full py-3 bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] rounded-xl text-xs font-mono tracking-widest uppercase hover:opacity-90 cursor-pointer active:scale-95 duration-150 font-bold mb-3 shadow-[0_0_12px_rgba(14,165,233,0.25)]"
            >
              RECONECTAR FLUJO
            </button>
            <button
              onClick={handleBackToSelect}
              className="w-full py-2.5 bg-transparent border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase hover:bg-white/5 cursor-pointer duration-150 text-slate-400 mb-3"
            >
              RECONFIGURAR ENTIDAD
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN OVERLAY: VICTORY SCREEN (NEXUS STABILIZED)
          ======================================================== */}
      {gameState === 'VICTORY' && endGameStats && (
        <div className="absolute inset-0 z-40 bg-[#020512f5] backdrop-blur-2xl flex flex-col justify-center items-center p-4 sm:p-6 overflow-y-auto animate-fade-in">
          
          {/* Atmospheric background glows */}
          <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[130px] pointer-events-none -top-20" />
          <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[110px] pointer-events-none -bottom-20" />

          <div className="relative max-w-4xl w-full bg-[#030715]/95 border border-cyan-500/25 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(34,211,238,0.2)] flex flex-col items-center">
            
            {/* Crown/Crown Sparkles Header */}
            <div className="w-14 h-14 rounded-full bg-cyan-950/55 border border-cyan-400/40 text-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(34,211,238,0.25)] animate-bounce">
              <Crown className="w-7 h-7" />
            </div>

            <h1 className="font-display font-black text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 tracking-widest text-center uppercase">
              NEXUS ESTABILIZADO
            </h1>
            <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest font-semibold mt-1">
              LA RED VITAL EN EL SECTOR RESPIRA DE NUEVO
            </p>

            <div className="w-36 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-500/45 to-transparent my-4" />

            {/* Layout Grid: Stats, Rank, Checklist */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full mt-2">
              
              {/* Left Column: Grade Card & Historical Record */}
              <div className="md:col-span-4 flex flex-col gap-4">
                
                {/* Visual Rank Plate */}
                <div className="bg-slate-950/75 border border-white/5 rounded-2xl p-5 flex flex-col items-center justify-center text-center relative overflow-hidden h-full">
                  <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">CALIFICACIÓN</span>
                  
                  {/* Huge Grade Emblem */}
                  <div className="my-3 relative">
                    <span className={`text-5xl sm:text-6xl font-display font-black tracking-tighter ${
                      calculateDemoRank(endGameStats) === 'ORBI_PRIME' ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-yellow-400 to-amber-500 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]' :
                      calculateDemoRank(endGameStats) === 'S' ? 'text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.4)]' :
                      calculateDemoRank(endGameStats) === 'A' ? 'text-violet-400' :
                      calculateDemoRank(endGameStats) === 'B' ? 'text-sky-400' : 'text-slate-400'
                    }`}>
                      {calculateDemoRank(endGameStats) === 'ORBI_PRIME' ? 'PRIME' : calculateDemoRank(endGameStats)}
                    </span>
                  </div>

                  <span className="font-mono text-[9px] text-slate-300 uppercase tracking-widest bg-cyan-950/45 border border-cyan-500/10 px-2.5 py-1 rounded">
                    {calculateDemoRank(endGameStats) === 'ORBI_PRIME' ? 'ORBI PRIME' :
                     calculateDemoRank(endGameStats) === 'S' ? 'FOTON PRIME CANDIDATE' :
                     calculateDemoRank(endGameStats) === 'A' ? 'SOLAR GUARDIAN' :
                     calculateDemoRank(endGameStats) === 'B' ? 'NEXUS STABILIZER' :
                     'SPARK SURVIVOR'}
                  </span>

                  <p className="text-[10px] text-slate-400 leading-normal mt-3 px-2 max-w-[180px]">
                    {calculateDemoRank(endGameStats) === 'ORBI_PRIME' ? 'Pureza solar absoluta. Sentinel purgado a la perfección sin recibir daño directo.' :
                     calculateDemoRank(endGameStats) === 'S' ? 'Excelente modulación energética. Flujo de plasma de nivel superior.' :
                     calculateDemoRank(endGameStats) === 'A' ? 'Desempeño sobresaliente resguardando los nodos de energía solar.' :
                     calculateDemoRank(endGameStats) === 'B' ? 'Estabilización del núcleo completada exitosamente.' :
                     'Superviviente elemental. Modulación mínima de plasma estabilizada.'}
                  </p>
                </div>
              </div>

              {/* Middle Column: Detailed Session Stats */}
              <div className="md:col-span-5 bg-slate-950/75 border border-white/5 rounded-2xl p-5 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-4 pb-1.5 border-b border-white/5">
                  MÉTRICAS DE RENDIMIENTO
                </span>

                <div className="flex flex-col gap-2.5 font-mono text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">PUNTAJE LOGRADO:</span>
                    <span className="text-yellow-400 font-bold text-right">{endGameStats.score} PTS</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">TIEMPO TOTAL:</span>
                    <span className="text-slate-100 font-bold text-right">
                      {Math.floor(endGameStats.totalTimeSeconds / 60)}:{(endGameStats.totalTimeSeconds % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">COMBO MÁXIMO:</span>
                    <span className="text-[#fbbf24] font-bold text-right">x{endGameStats.maxCombo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">ZONAS PURIFICADAS:</span>
                    <span className="text-emerald-400 font-bold text-right">{endGameStats.zonesPurified} / 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">SURGES SOBREVIVIDOS:</span>
                    <span className="text-indigo-400 font-bold text-right">{endGameStats.surgesSurvived} SURGES</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 text-left">SENTINEL DERROTADO:</span>
                    <span className={endGameStats.sentinelPurged ? 'text-green-400 font-bold text-right' : 'text-slate-400 text-right'}>
                      {endGameStats.sentinelPurged ? 'SÍ' : 'NO'}
                    </span>
                  </div>
                  {endGameStats.sentinelPurged && (
                    <div className="flex justify-between text-[10.5px] bg-cyan-950/30 border border-cyan-500/10 p-1.5 rounded mt-0.5">
                      <span className="text-cyan-400 text-left">PERFECT SENTINEL PURGE:</span>
                      <span className={endGameStats.perfectSentinelPurge ? 'text-yellow-400 font-bold text-right' : 'text-slate-400 text-right'}>
                        {endGameStats.perfectSentinelPurge ? 'LOGRADO (+1500)' : 'NO LOGRADO'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                    <span className="text-slate-500 text-left">DAÑO RECIBIDO:</span>
                    <span className={`text-right font-bold ${endGameStats.damageTaken < 50 ? 'text-green-400' : endGameStats.damageTaken < 100 ? 'text-amber-400' : 'text-red-400'}`}>
                      {endGameStats.damageTaken} HP
                    </span>
                  </div>
                </div>

                {/* Best Run Box inside metrics column */}
                {bestDemoRun && (
                  <div className="mt-4 pt-3 border-t border-white/5 text-[10px] font-mono flex items-center justify-between text-slate-400">
                    <span>MÁXIMO DE RED VITAL HISTÓRICO:</span>
                    <span className="text-[#fbbf24] font-bold">
                      {bestDemoRun.score} PTS (RANK {bestDemoRun.rank === 'ORBI_PRIME' ? 'PRIME' : bestDemoRun.rank})
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Objectives completed verification list */}
              <div className="md:col-span-3 bg-slate-950/75 border border-white/5 rounded-2xl p-5 flex flex-col">
                <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase mb-4 pb-1.5 border-b border-white/5">
                  OBJETIVOS DE SECTOR
                </span>

                <div className="flex flex-col gap-3.5">
                  {objectives.map((obj) => (
                    <div key={obj.id} className="flex gap-2 items-start text-left">
                      <div className="w-4 h-4 rounded-full border border-emerald-500 bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 font-mono text-[9px] font-bold">
                        ✓
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10.5px] font-mono text-slate-300 font-bold leading-tight">
                          {obj.label}
                        </span>
                        <span className="text-[8.5px] font-sans text-slate-400 mt-0.5 leading-tight">
                          {obj.description}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons Footer */}
            <div className="flex flex-col sm:flex-row gap-4 w-full mt-8 border-t border-white/5 pt-6 max-w-2xl justify-center">
              <button
                onClick={() => {
                  setGameMode('demo');
                  handleStartPlaying(selectedGuardian);
                }}
                className="px-6 py-3 bg-transparent border border-cyan-500/30 text-cyan-400 hover:text-white hover:bg-cyan-950/20 text-xs font-mono tracking-widest font-bold uppercase rounded-xl active:scale-95 duration-150 cursor-pointer"
              >
                REINICIAR RED VITAL
              </button>
              
              <button
                onClick={() => {
                  const core = stateRef.current;
                  core.gameMode = 'infinite';
                  setGameMode('infinite');
                  core.victoryTriggered = false;
                  core.victoryDelayTimer = 0;
                  core.player.energy = 100; // Refill vital charge!
                  
                  setGameState('PLAYING');
                  setShowInfiniteBanner(true);
                  setTimeout(() => setShowInfiniteBanner(false), 4500);
                }}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 border border-emerald-400/20 text-white text-xs font-mono tracking-widest font-bold uppercase rounded-xl active:scale-95 duration-150 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                MODO INFINITO (CONTINUAR)
              </button>

              <button
                onClick={handleReturnToMain}
                className="px-6 py-3 bg-transparent border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 text-xs font-mono tracking-widest uppercase rounded-xl duration-150 cursor-pointer"
              >
                VOLVER AL INICIO
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          SCREEN OVERLAY: GAME OVER COVER SCREEN
          ======================================================== */}
      {gameState === 'GAMEOVER' && (
        gameMode === 'infinite' && survivalSummary ? (
          <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-3xl flex flex-col justify-center items-center p-4 sm:p-6 text-center animate-fade-in overflow-y-auto">
            {/* Ambient Purple/Red Glow behind */}
            <div className="absolute w-[450px] h-[450px] rounded-full bg-purple-950/15 blur-[120px] pointer-events-none" />
            <div className="absolute w-[250px] h-[250px] rounded-full bg-rose-950/10 blur-[80px] pointer-events-none" />

            <div className="relative max-w-lg w-full bg-[#0a0512]/90 border border-purple-500/30 px-6 sm:px-8 py-7 sm:py-8 rounded-2xl shadow-[0_0_35px_rgba(168,85,247,0.25)] flex flex-col items-center">
              {/* Core Purgado Indicator */}
              <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-400 flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                <Skull className="w-6 h-6 text-purple-400" />
              </div>

              <h2 className="font-display font-black text-2xl tracking-wider text-purple-100 mb-1">
                CONEXIÓN PURGADA
              </h2>
              <p className="font-mono text-[9px] text-purple-400 uppercase tracking-widest font-bold mb-4">
                SUPERVIVENCIA NEXUS — SISTEMA COLAPSADO
              </p>

              {/* Danger / Cause of Death Badge */}
              <div className="mb-5 bg-rose-950/50 border border-rose-500/30 px-3.5 py-1.5 rounded-lg flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-mono text-[9.5px] text-rose-300 font-bold uppercase tracking-wider">
                  Causa de derrota: <strong className="text-white ml-1 font-black">{survivalSummary.cause}</strong>
                </span>
              </div>

              {/* Performance metrics grid */}
              <div className="w-full bg-slate-950/60 border border-white/5 p-4 sm:p-5 rounded-xl mb-6 font-mono text-xs flex flex-col gap-3.5">
                
                {/* Score Section */}
                <div className="flex justify-between items-center border-b border-white/5 pb-2.5">
                  <span className="text-slate-400 text-left uppercase text-[10px]">Puntos Logrados:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-yellow-400">{survivalSummary.score} PTS</span>
                    {bestSurvivalScore > 0 && survivalSummary.score >= bestSurvivalScore && (
                      <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 py-0.5 rounded uppercase mt-0.5">✦ NUEVO RÉCORD DE PUNTOS</span>
                    )}
                  </div>
                </div>

                {/* Grid for key metrics */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-[11px] border-b border-white/5 pb-3">
                  {/* Time Alive with medal */}
                  <div className="flex flex-col text-left">
                    <span className="text-slate-500 text-[9px] uppercase">TIEMPO ACTIVO</span>
                    <span className="text-white font-black text-sm flex items-center gap-1 mt-0.5">
                      {(() => {
                        const mm = Math.floor(survivalSummary.time / 60).toString().padStart(2, '0');
                        const ss = Math.floor(survivalSummary.time % 60).toString().padStart(2, '0');
                        return `${mm}:${ss}`;
                      })()}
                      {bestSurvivalTime > 0 && survivalSummary.time >= bestSurvivalTime && (
                        <span className="text-[8px] font-bold text-emerald-400">✦</span>
                      )}
                    </span>
                    {bestSurvivalTime > 0 && survivalSummary.time >= bestSurvivalTime && (
                      <span className="text-[7px] text-emerald-400 font-bold uppercase tracking-tighter mt-0.5">NUEVA MEJOR MARCA</span>
                    )}
                  </div>

                  {/* Max Threat Tier reached */}
                  <div className="flex flex-col text-right">
                    <span className="text-slate-500 text-[9px] uppercase">RATING AMENAZA MÁX</span>
                    <span className="text-rose-400 font-black text-sm mt-0.5">
                      TIER {(() => {
                        const Roman = ["", "I", "II", "III", "IV", "V"];
                        return Roman[survivalSummary.threat] || survivalSummary.threat;
                      })()}
                    </span>
                    <span className="text-[8.5px] text-rose-500 font-bold uppercase truncate">
                      {getSurvivalDifficultyProfile(survivalSummary.time).label}
                    </span>
                  </div>

                  {/* Dominant Orbital */}
                  <div className="flex flex-col text-left border-t border-white/5 pt-2">
                    <span className="text-slate-500 text-[9px] uppercase">DOMINIO ORBITAL</span>
                    <span className="text-fuchsia-400 font-black uppercase mt-0.5">
                      {survivalSummary.dominantEnergy}
                    </span>
                  </div>

                  {/* Max Evolution reached */}
                  <div className="flex flex-col text-right border-t border-white/5 pt-2">
                    <span className="text-slate-500 text-[9px] uppercase">MÁX EVOLUCIÓN</span>
                    <span className="text-cyan-400 font-bold mt-0.5 truncate uppercase">
                      {EVOLUTION_STAGES[survivalSummary.maxEvolution]?.displayName || survivalSummary.maxEvolution}
                    </span>
                  </div>
                </div>

                {/* Sub-counters (defeated, completed) */}
                <div className="grid grid-cols-3 gap-2 text-center text-slate-400 text-[10px]">
                  <div className="bg-slate-900/40 p-2 rounded border border-white/5 flex flex-col justify-center">
                    <span className="text-amber-400 font-black text-sm">{survivalSummary.serpentsDefeated}</span>
                    <span className="text-[7.5px] text-slate-500 uppercase mt-0.5">ANTIS PURIFICADAS</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded border border-white/5 flex flex-col justify-center">
                    <span className="text-rose-400 font-black text-sm">{survivalSummary.alphas}</span>
                    <span className="text-[7.5px] text-slate-500 uppercase mt-0.5">ALPHAS DESTRUIDAS</span>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded border border-white/5 flex flex-col justify-center">
                    <span className="text-purple-400 font-black text-sm">{survivalSummary.events}</span>
                    <span className="text-[7.5px] text-slate-500 uppercase mt-0.5">BLACKOUTS SUPERADOS</span>
                  </div>
                </div>

              </div>

              {/* Retry / Back to Choice Buttons */}
              <button
                onClick={() => handleStartPlaying(selectedGuardian)}
                className="w-full py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-xl text-xs font-mono tracking-widest uppercase hover:opacity-95 active:scale-95 duration-150 font-black cursor-pointer mb-3 shadow-[0_0_20px_rgba(168,85,247,0.35)] text-white"
              >
                FORZAR RECONEXIÓN
              </button>
              <button
                onClick={handleBackToSelect}
                className="w-full py-2.5 bg-transparent border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase hover:bg-white/5 cursor-pointer duration-150 text-slate-400"
              >
                SELECCIONAR GUARDIÁN
              </button>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 z-40 bg-red-950/20 backdrop-blur-2xl flex flex-col justify-center items-center p-6 text-center animate-fade-in">
            
            {/* Centered glow spot */}
            <div className="absolute w-[360px] h-[360px] rounded-full bg-red-650/10 blur-[90px] pointer-events-none" />

            <div className="relative max-w-sm bg-[#0a0709]/95 border border-red-500/20 px-8 py-8 rounded-2xl shadow-2xl flex flex-col items-center">
              
              {/* Hurt spark skull design placeholder */}
              <div className="w-11 h-11 rounded-full bg-red-950/45 border border-red-500/30 text-red-400 flex items-center justify-center mb-4 shadow-[0_0_12px_rgba(239,68,68,0.2)]">
                <Layers className="w-5 h-5" />
              </div>

              <h2 className="font-display font-semibold text-lg tracking-wider text-rose-100 mb-1">
                CONEXIÓN PURGADA
              </h2>
              <p className="font-mono text-[10px] text-red-400 uppercase tracking-widest font-semibold mb-4">
                {gameMode === 'vital_flow' ? "ESTELA VITAL COLAPSADA" : "Núcleo solar desestabilizado"}
              </p>

              {gameMode === 'vital_flow' && vitalFlowSummary && (
                <div className="mb-4 bg-red-950/40 border border-red-500/20 px-3 py-1 rounded-lg">
                  <span className="font-mono text-[9px] text-red-400 uppercase tracking-widest font-bold">
                    Causa: <span className="text-white ml-1 font-black">{vitalFlowSummary.cause === 'WALL COLLISION' ? 'COLISIÓN CON LÍMITES' : 'AUTO-COLISIÓN DE ESTELA'}</span>
                  </span>
                </div>
              )}

              {/* Performance metrics inside box */}
              <div className="w-full bg-slate-950/70 border border-white/5 p-4 rounded-xl mb-6 font-mono text-xs flex flex-col gap-2">
                {gameMode === 'nexus_assault' ? (
                  <>
                    <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">MODO NEXUS ASSAULT</span>
                      <span className="text-white font-black">SALA {assaultRunRoom}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">ESTADO RUN:</span>
                      <span className="text-rose-400 font-bold text-right uppercase">CORE DESTRUIDO</span>
                    </div>
                    
                    {/* Cosecha de núcleos */}
                    <div className="flex flex-col gap-1 text-left mt-2">
                      <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">NÚCLEOS ACTIVADOS ({stateRef.current.assaultRun?.modules.length || 0})</span>
                      {(!stateRef.current.assaultRun || stateRef.current.assaultRun.modules.length === 0) ? (
                        <span className="text-[9.5px] text-slate-500 italic">Ninguno acoplado</span>
                      ) : (
                        <div className="grid grid-cols-2 gap-1 mt-1 max-h-[110px] overflow-y-auto pr-1">
                          {stateRef.current.assaultRun.modules.map((mod: any) => {
                            const colorMap: Record<string, string> = {
                              foton: 'text-amber-400',
                              hydro: 'text-cyan-400',
                              aero: 'text-emerald-300',
                              termo: 'text-orange-500',
                              terra: 'text-orange-500'
                            };
                            return (
                              <div key={mod.id} className="p-1.5 rounded bg-slate-900/60 border border-white/5 text-[9px] flex flex-col">
                                <div className="flex justify-between items-center">
                                  <span className={`font-bold truncate ${colorMap[mod.element] || 'text-white'}`}>
                                    {mod.name}
                                  </span>
                                  <span className="font-black text-white ml-1 bg-slate-800/80 px-0.5 rounded text-[8px]">
                                    L{mod.level}
                                  </span>
                                </div>
                                {mod.mutation && (
                                  <span className="text-[7.5px] text-yellow-400 truncate mt-0.5">
                                    ✦ {mod.mutation.toUpperCase()}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Sinergias del asalto */}
                    <div className="flex flex-col gap-1 text-left mt-2 border-t border-white/5 pt-1.5">
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest font-mono">SINERGIAS DESATADAS</span>
                      {(!stateRef.current.assaultRun || !stateRef.current.assaultRun.synergiesActive || stateRef.current.assaultRun.synergiesActive.length === 0) ? (
                        <span className="text-[8.5px] font-mono text-slate-500 italic">Ninguna sinergia activa</span>
                      ) : (
                        <div className="flex flex-wrap gap-1 mt-1 font-mono">
                          {stateRef.current.assaultRun.synergiesActive.map((synId: string) => {
                            const namesMap: Record<string, string> = {
                              prisma_solar: "PRISMA SOLAR",
                              tormenta_radiante: "TORMENTA RADIANTE",
                              monzon_nexus: "MONZÓN NEXUS",
                              guardian_current: "GUARDIAN CURRENT"
                            };
                            return (
                              <span 
                                key={synId} 
                                className="text-[8px] font-bold text-emerald-400 bg-emerald-950/45 border border-emerald-500/25 px-1 py-0.5 rounded uppercase"
                              >
                                {namesMap[synId] || synId.toUpperCase()}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Estadísticas de combate y supervivencia */}
                    <div className="flex flex-col gap-1.5 text-left mt-3 border-t border-white/5 pt-2 font-mono text-[9.5px]">
                      <span className="text-[9px] text-rose-400 font-bold uppercase tracking-widest">REGISTRO DE EFICIENCIA</span>
                      
                      <div className="flex justify-between text-slate-400">
                        <span>Daño Recibido:</span>
                        <span className="text-red-400 font-semibold">{stateRef.current.assaultRun?.totalDamageTaken || 0} HP</span>
                      </div>

                      <div className="flex justify-between text-slate-400">
                        <span>Recuperación Core:</span>
                        <span className="text-emerald-400 font-semibold">+{stateRef.current.assaultRun?.totalHealed || 0} HP</span>
                      </div>

                      <div className="flex justify-between text-slate-400">
                        <span>Impactos de Cola:</span>
                        <span className="text-pink-400 font-semibold">{stateRef.current.assaultRun?.totalTailHits || 0} ({stateRef.current.assaultRun?.totalTailDamage || 0} DMG)</span>
                      </div>

                      <div className="flex justify-between text-slate-400">
                        <span>Salas Perfectas (S):</span>
                        <span className="text-amber-400 font-semibold">{stateRef.current.assaultRun?.totalSGrades || 0}</span>
                      </div>

                      {stateRef.current.assaultRun?.gradeHistory && stateRef.current.assaultRun.gradeHistory.length > 0 && (
                        <div className="flex flex-col gap-1 mt-1 border-t border-white/5 pt-1.5">
                          <span className="text-[8px] text-slate-500 uppercase tracking-wider">Historial de Evaluación:</span>
                          <div className="flex flex-wrap gap-1 mt-0.5">
                            {stateRef.current.assaultRun.gradeHistory.map((gr: string, idx: number) => {
                              const grColor = gr === 'S' ? 'text-amber-400 bg-amber-950/30 border-amber-500/20' : (gr === 'A' ? 'text-purple-400 bg-purple-950/30 border-purple-500/20' : (gr === 'B' ? 'text-sky-400 bg-sky-950/30 border-sky-500/20' : 'text-slate-400 bg-slate-900 border-white/5'));
                              return (
                                <span key={idx} className={`px-1 py-0.5 text-[8.5px] font-bold border rounded ${grColor}`}>
                                  {gr}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : gameMode === 'vital_flow' && stateRef.current.vitalFlow ? (
                  <>
                    <div className="flex justify-between border-b border-white/5 pb-1.5 mb-1.5">
                      <span className="text-emerald-400 font-black uppercase tracking-wider">MODO VITAL FLOW</span>
                      <span className="text-emerald-300 font-bold">ESTELA MÁXIMA</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">PUNTOS:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-yellow-400 font-bold">{stats.score}</span>
                        {stats.score >= bestVitalFlowScore && (
                          <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 py-0.5 rounded uppercase mt-0.5 animate-pulse">✦ NUEVO RÉCORD PUNTOS</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-500 text-left">TIEMPO ACTIVO:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-emerald-400 font-bold font-mono">
                          {stateRef.current.vitalFlow.elapsedTime.toFixed(1)}s
                        </span>
                        {stateRef.current.vitalFlow.elapsedTime >= bestVitalFlowTime && (
                          <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 py-0.5 rounded uppercase mt-0.5 animate-pulse">✦ NUEVA MEJOR MARCA</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-500 text-left">FASE EVOLUCIÓN:</span>
                      <span className="text-sky-400 font-bold uppercase">
                        E{getVitalFlowEvolutionStage(stateRef.current.vitalFlow.pickupsCollected)}
                      </span>
                    </div>

                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-500 text-left">ESENCIAS RECOLECTADAS:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-amber-400 font-bold">
                          {stateRef.current.vitalFlow.pickupsCollected}
                        </span>
                        {stateRef.current.vitalFlow.pickupsCollected >= bestVitalFlowPickups && (
                          <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 py-0.5 rounded uppercase mt-0.5 animate-pulse">✦ NUEVO RÉCORD ESENCIAS</span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-1.5">
                      <span className="text-slate-500 text-left">LONGITUD ESTIRADA:</span>
                      <div className="flex flex-col items-end">
                        <span className="text-cyan-400 font-bold">
                          {Math.floor(stats.length)} CÉLULAS
                        </span>
                        {stats.length >= bestVitalFlowLength && (
                          <span className="text-[7.5px] font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 px-1 py-0.5 rounded uppercase mt-0.5 animate-pulse">✦ NUEVA MÁXIMA LONGITUD</span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">PUNTOS:</span>
                      <span className="text-yellow-400 font-bold text-right">{stats.score}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">MÁX EVOLUCIÓN:</span>
                      <span className="text-cyan-400 font-bold text-right uppercase">
                        {EVOLUTION_STAGES[stateRef.current.statsExtra.maxEvolution]?.displayName || 'SPARK SOLAR'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">COMBO MÁXIMO:</span>
                      <span className="text-amber-400 font-bold text-right">x{stateRef.current.statsExtra.maxCombo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">ZONAS PURIFICADAS:</span>
                      <span className="text-green-400 font-bold text-right">{stateRef.current.statsExtra.zonesPurified}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 text-left">SURGES SOBREVIVIDOS:</span>
                      <span className="text-indigo-400 font-bold text-right">{stateRef.current.statsExtra.blackoutSurgesSurvived}</span>
                    </div>
                  </>
                )}
                {gameMode !== 'vital_flow' && (
                  <div className="flex justify-between border-t border-white/5 pt-2 mt-1">
                    <span className="text-slate-500 text-left">RECORD MÁXIMO:</span>
                    <span className="text-white font-bold text-right">{stats.highScore} PTS</span>
                  </div>
                )}

                {/* Objective Progress inside Game Over screen */}
                {gameMode === 'demo' && (
                  <div className="border-t border-white/5 pt-2 mt-1 text-left">
                    <div className="flex justify-between items-center text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                      <span>PROGRESO DE SECTOR:</span>
                      <span className="text-cyan-400">{objectives.filter(o => o.completed).length} / 4</span>
                    </div>
                    <div className="w-full h-1 rounded bg-slate-950 border border-white/5 overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-sm"
                           style={{ width: `${(objectives.filter(o => o.completed).length / 4) * 100}%` }} />
                    </div>
                    <div className="flex flex-col gap-1 mt-2 text-[9px] leading-tight text-slate-400">
                      {objectives.map(o => (
                        <div key={o.id} className="flex gap-1.5 items-center">
                          <span className={o.completed ? "text-emerald-500" : "text-slate-600"}>
                            {o.completed ? "✓" : "•"}
                          </span>
                          <span className={o.completed ? "line-through text-slate-500 font-medium" : "text-slate-300 font-medium"}>
                            {o.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => handleStartPlaying(selectedGuardian)}
                className="w-full py-3 bg-gradient-to-r from-[#ef4444] to-[#ec4899] rounded-xl text-xs font-mono tracking-widest uppercase hover:opacity-95 active:scale-95 duration-150 font-bold cursor-pointer mb-3 shadow-[0_0_15px_rgba(239,68,68,0.35)]"
              >
                FORZAR REINICIO
              </button>
              <button
                onClick={handleBackToSelect}
                className="w-full py-2.5 bg-transparent border border-white/10 rounded-xl text-xs font-mono tracking-widest uppercase hover:bg-white/5 cursor-pointer duration-150 text-slate-400"
              >
                SELECCIONAR GUARDIÁN
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
