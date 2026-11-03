/** Geometry primitives for Assault Resonance Loop (AS-R1).
 *
 * Strictly pure: no canvas, DOM, React, enemy mutation, or random numbers.
 * NOT wired to gameplay until flagged manual validation. Coordinates are
 * world-space (the same units as Nexus Assault's 16:9 world).
 */
export type AssaultPoint = Readonly<{ x: number; y: number }>;

export interface SegmentCrossing {
  point: AssaultPoint;
  /** Parametric position on the FIRST segment; [0, 1]. */
  t: number;
  /** Parametric position on the SECOND segment; [0, 1]. */
  u: number;
}

export interface ResonanceLoop {
  /** Ordered, unclosed polygon vertices, including the head and intersection. */
  polygon: AssaultPoint[];
  intersection: AssaultPoint;
  bodySegmentIndex: number;
  area: number;
  perimeter: number;
}

export interface ResonanceGeometryConfig {
  /** Ignore the neck and neighboring body segments. */
  minBodySegmentIndex?: number;
  minBodyPoints?: number;
  minArea?: number;
  minPerimeter?: number;
  epsilon?: number;
}

const DEFAULT_GEOMETRY: Required<ResonanceGeometryConfig> = {
  minBodySegmentIndex: 5,
  minBodyPoints: 16,
  minArea: 3200,
  minPerimeter: 220,
  epsilon: 1e-7,
};

export function isFinitePoint(p: AssaultPoint): boolean {
  return Number.isFinite(p.x) && Number.isFinite(p.y);
}

function cross(ax: number, ay: number, bx: number, by: number): number {
  return ax * by - ay * bx;
}

function signedDistance2(a: AssaultPoint, b: AssaultPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

/** Collinear overlap is not a closure: avoids firing from stationary contact. */
export function segmentCrossing(
  a: AssaultPoint, b: AssaultPoint,
  c: AssaultPoint, d: AssaultPoint,
  epsilon = 1e-7
): SegmentCrossing | null {
  if (![a, b, c, d].every(isFinitePoint)) return null;
  const rx = b.x - a.x, ry = b.y - a.y;
  const sx = d.x - c.x, sy = d.y - c.y;
  if (rx * rx + ry * ry <= epsilon * epsilon ||
      sx * sx + sy * sy <= epsilon * epsilon) return null;
  const det = cross(rx, ry, sx, sy);
  if (Math.abs(det) <= epsilon) return null;
  const qx = c.x - a.x, qy = c.y - a.y;
  const t = cross(qx, qy, sx, sy) / det;
  const u = cross(qx, qy, rx, ry) / det;
  if (t < -epsilon || t > 1 + epsilon || u < -epsilon || u > 1 + epsilon) return null;
  return {
    point: { x: a.x + t * rx, y: a.y + t * ry },
    t: Math.max(0, Math.min(1, t)),
    u: Math.max(0, Math.min(1, u)),
  };
}

export function polygonArea(polygon: readonly AssaultPoint[]): number {
  if (polygon.length < 3 || polygon.some(p => !isFinitePoint(p))) return 0;
  let twiceArea = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i], next = polygon[(i + 1) % polygon.length];
    twiceArea += p.x * next.y - next.x * p.y;
  }
  return Math.abs(twiceArea) * 0.5;
}

export function polygonPerimeter(polygon: readonly AssaultPoint[]): number {
  if (polygon.length < 3 || polygon.some(p => !isFinitePoint(p))) return 0;
  let total = 0;
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i], next = polygon[(i + 1) % polygon.length];
    total += Math.hypot(next.x - p.x, next.y - p.y);
  }
  return total;
}

/** Boundary counts as inside; useful for enemies touching an energy loop. */
export function pointInPolygon(p: AssaultPoint, polygon: readonly AssaultPoint[], epsilon = 1e-7): boolean {
  if (!isFinitePoint(p) || polygon.length < 3 || polygon.some(v => !isFinitePoint(v))) return false;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    const dx = b.x - a.x, dy = b.y - a.y;
    const vX = p.x - a.x, vY = p.y - a.y;
    const len2 = dx * dx + dy * dy;
    const crossMagnitude = Math.abs(cross(dx, dy, vX, vY));
    if (len2 > epsilon * epsilon &&
        crossMagnitude <= epsilon * Math.sqrt(len2) &&
        vX * dx + vY * dy >= -epsilon &&
        vX * dx + vY * dy <= len2 + epsilon) return true;
    if ((a.y > p.y) !== (b.y > p.y)) {
      const atX = a.x + dx * (p.y - a.y) / dy;
      if (p.x < atX) inside = !inside;
    }
  }
  return inside;
}

export function polygonBounds(polygon: readonly AssaultPoint[]) {
  if (!polygon.length || polygon.some(p => !isFinitePoint(p))) return null;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of polygon) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }
  return { minX, minY, maxX, maxY };
}

export function hasSelfIntersection(polygon: readonly AssaultPoint[], epsilon = 1e-7): boolean {
  const n = polygon.length;
  if (n < 4) return false;
  for (let i = 0; i < n; i++) {
    const nextI = (i + 1) % n;
    for (let j = i + 2; j < n; j++) {
      const nextJ = (j + 1) % n;
      if (nextJ === i) continue; // closing and first edge are adjacent
      if (segmentCrossing(polygon[i], polygon[nextI], polygon[j], polygon[nextJ], epsilon)) return true;
    }
  }
  return false;
}

/** Detects a head-motion crossing with the non-adjacent snake body.
 * The returned polygon is only a PREVIEW: no damage or progression changes.
 */
export function detectResonanceLoop(
  previousHead: AssaultPoint,
  currentHead: AssaultPoint,
  bodyHeadToTail: readonly AssaultPoint[],
  config: ResonanceGeometryConfig = {}
): ResonanceLoop | null {
  const limits = { ...DEFAULT_GEOMETRY, ...config };
  if (bodyHeadToTail.length < limits.minBodyPoints ||
      ![previousHead, currentHead, ...bodyHeadToTail].every(isFinitePoint) ||
      signedDistance2(previousHead, currentHead) <= limits.epsilon * limits.epsilon) return null;

  let best: ResonanceLoop | null = null;
  let firstCrossingT = Infinity;
  for (let i = Math.max(1, limits.minBodySegmentIndex); i < bodyHeadToTail.length - 1; i++) {
    const hit = segmentCrossing(
      previousHead, currentHead, bodyHeadToTail[i], bodyHeadToTail[i + 1], limits.epsilon
    );
    // Entering at exactly t=0 is an existing intersection, not a new crossing.
    if (!hit || hit.t <= 0.001 || hit.t >= firstCrossingT) continue;
    const polygon = [currentHead, ...bodyHeadToTail.slice(0, i + 1), hit.point];
    const area = polygonArea(polygon);
    if (area < limits.minArea) continue;
    const perimeter = polygonPerimeter(polygon);
    if (perimeter < limits.minPerimeter || hasSelfIntersection(polygon, limits.epsilon)) continue;
    best = {
      polygon,
      intersection: hit.point,
      bodySegmentIndex: i,
      area,
      perimeter,
    };
    firstCrossingT = hit.t;
  }
  return best;
}
