import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import {
  detectResonanceLoop,
  hasSelfIntersection,
  pointInPolygon,
  polygonArea,
  polygonBounds,
  polygonPerimeter,
  segmentCrossing,
  type AssaultPoint,
} from './resonanceGeometry';

const p = (x: number, y: number): AssaultPoint => ({ x, y });
const square = [p(0, 0), p(100, 0), p(100, 100), p(0, 100)] as const;
// A head-to-tail body wrapping a broad square, crossed by a moving head at
// the distant upper edge. The first 5 body segments are intentionally ignored.
const coil = [
  p(70, 85), p(90, 105), p(130, 105), p(160, 125),
  p(160, 155), p(150, 195), p(130, 225), p(100, 225),
  p(70, 225), p(40, 225), p(10, 200), p(10, 160),
  p(10, 130), p(10, 100), p(10, 40), p(40, 40),
  p(70, 40), p(100, 40),
];
const oldHead = p(50, 10), newHead = p(50, 80);

test('proper line segments intersect at world-space coordinate', () => {
  const hit = segmentCrossing(p(0, 0), p(100, 100), p(0, 100), p(100, 0));
  assert.ok(hit);
  assert.deepEqual(hit.point, p(50, 50));
  assert.equal(hit.t, 0.5);
  assert.equal(hit.u, 0.5);
});
test('separated segments never intersect', () => {
  assert.equal(segmentCrossing(p(0, 0), p(50, 0), p(60, -50), p(60, 50)), null);
});
test('parallel segments are ignored', () => {
  assert.equal(segmentCrossing(p(0, 0), p(100, 0), p(0, 20), p(100, 20)), null);
});
test('collinear overlap does not trigger a circle', () => {
  assert.equal(segmentCrossing(p(0, 0), p(100, 0), p(40, 0), p(70, 0)), null);
});
test('zero-length and non-finite segments are invalid', () => {
  assert.equal(segmentCrossing(p(0, 0), p(0, 0), p(-1, 0), p(1, 0)), null);
  assert.equal(segmentCrossing(p(NaN, 0), p(1, 2), p(0, 0), p(4, 4)), null);
});
test('polygon shoelace area and perimeter are orientation-independent', () => {
  assert.equal(polygonArea(square), 10000);
  assert.equal(polygonArea([...square].reverse()), 10000);
  assert.equal(polygonPerimeter(square), 400);
});
test('point in polygon recognizes interior, exterior, and touching a wall', () => {
  assert.equal(pointInPolygon(p(50, 50), square), true);
  assert.equal(pointInPolygon(p(0, 50), square), true);
  assert.equal(pointInPolygon(p(120, 50), square), false);
});
test('point in a concave polygon does not fill its notch', () => {
  const concave = [p(0, 0), p(100, 0), p(100, 100), p(60, 100),
                   p(60, 40), p(40, 40), p(40, 100), p(0, 100)];
  assert.equal(pointInPolygon(p(20, 70), concave), true);
  assert.equal(pointInPolygon(p(50, 70), concave), false);
});
test('polygon bounding box computed with negative and positive positions', () => {
  assert.deepEqual(polygonBounds([p(-3, 5), p(15, -9), p(2, 20)]),
    { minX: -3, minY: -9, maxX: 15, maxY: 20 });
  assert.equal(polygonBounds([]), null);
});
test('self crossing checker distinguishes simple and bow-tie polygons', () => {
  assert.equal(hasSelfIntersection(square), false);
  assert.equal(hasSelfIntersection([p(0, 0), p(100, 100), p(0, 100), p(100, 0)]), true);
});
test('closed broad loop is detected with valid area and nearby target contained', () => {
  const loop = detectResonanceLoop(oldHead, newHead, coil);
  assert.ok(loop);
  assert.equal(loop.bodySegmentIndex, 15);
  assert.deepEqual(loop.intersection, p(50, 40));
  assert.ok(loop.area >= 3200);
  assert.ok(loop.perimeter >= 220);
  assert.equal(hasSelfIntersection(loop.polygon), false);
  assert.equal(pointInPolygon(p(80, 140), loop.polygon), true);
  assert.equal(pointInPolygon(p(230, 140), loop.polygon), false);
});
test('no crossing means no loop', () => {
  assert.equal(detectResonanceLoop(p(250, 250), p(255, 220), coil), null);
});
test('loop requires enough body points', () => {
  assert.equal(detectResonanceLoop(oldHead, newHead, coil.slice(0, 15)), null);
});
test('minimal area and perimeter are configurable and enforced', () => {
  assert.equal(detectResonanceLoop(oldHead, newHead, coil, { minArea: 10000000 }), null);
  assert.equal(detectResonanceLoop(oldHead, newHead, coil, { minPerimeter: 10000000 }), null);
});
test('contact already present at beginning of frame does not re-award loop', () => {
  assert.equal(detectResonanceLoop(p(50, 40), newHead, coil), null);
});
test('neck segments are ignored as a closure by default', () => {
  const points = [p(0, 1), p(0, -1), p(10, -1), p(10, 1), ...coil];
  assert.equal(detectResonanceLoop(p(-5, 0), p(5, 0), points, { minBodyPoints: 2, minArea: 0, minPerimeter: 0 }), null);
});
test('loop detector never mutates source positions', () => {
  const before = JSON.stringify({ coil, oldHead, newHead });
  detectResonanceLoop(oldHead, newHead, coil);
  assert.equal(JSON.stringify({ coil, oldHead, newHead }), before);
});
