import type { AssaultRoomType } from '../../types';
/**
 * AS-R5: deterministic original ORBI encounter cadence, never shrinks arena.
 * Bosses every five rooms, Sanctuaries every seven unless already boss.
 */
export function selectAssaultEncounterType(roomIndex:number): AssaultRoomType {
 if (!Number.isInteger(roomIndex) || roomIndex <= 2) return 'normal';
 if (roomIndex % 5 === 0) return 'boss';
 if (roomIndex % 7 === 0) return 'rest';
 if (roomIndex % 4 === 0) return 'swarm';
 if (roomIndex % 5 === 4) return 'boss_preview';
 if (roomIndex >= 6 && (roomIndex % 6 === 0 || roomIndex % 6 === 3)) return 'elite';
 return 'normal';
}
