# STB-01 — Stabilization baseline (2026-10-25)

## Provenance

Original playable source recovered from a September 20 archive. Historical ref:
`v1.4.0-web-demo-candidate-recovered` on commit `445c87803a00295fbcdc61cc0f23384c652fe5e5`.

**Never rewrite the historical tag or force push `main`.** Work on `develop`.

## Evidence and limits

- The user launched all four modes in a local Vite browser session: Red Vital, Nexus Assault, Supervivencia Nexus, and Vital Flow.
- These captures establish startup and rendered UI, **not** exhaustive QA or runtime correctness.
- The original `tsc --noEmit` output had 450 errors. A locally prepared experimental Stage 1 reduced this to 441, but those experiments have **not** been merged into this branch.
- Much of the diagnostic volume is inferred state objects that lack fields later assigned during gameplay. Fix root causes rather than suppressing the type checker.

## Workstreams

1. **P0 preserve functionality:** smoke-check startup, mouse/keyboard controls, pickups, damage and restart in all four modes; check console errors.
2. **P1 state models:** explicitly type factories for Player, Vital Flow, Survival, Nexus Assault, objectives and shared core. Keep initialization defaults coherent.
3. **P1 release pipeline:** verify fresh install and production Vite build. CI is intentionally separate from TypeScript audit while baseline is red.
4. **P2 regression tests:** record initial and post-change behavior for transitions, Blackout, progression and HUD counters.
5. **P3 maintainability:** split the large game component only after characterization tests exist.

## Local commands

```powershell
git fetch origin
git switch develop
git pull --ff-only origin develop
npm install
npm run dev:local
npm run build
npm run check:types
```

Use separate terminals for `dev:local` and checks. `npm run check:types` is expected to report pre-existing errors until typing work is complete. Never claim that a passing build validates all gameplay.

## Release gates

- No unintended changes to original gameplay and visual design.
- Four-mode manual smoke test plus browser console inspection.
- Production build succeeds.
- TypeScript errors reduced in reviewed changes (eventual target: zero).
- Changes reviewed via PR into `main`.
