# AS-R1B — Validación del Cerco de Resonancia (previsualización sin daño)

**Fecha:** 2026-11-03  
**Rama:** `develop`; `main` protegida y sin cambios.  
**Estado:** integrado en `nexus_assault`, con pruebas puras y comprobación estática de aislamiento. **Falta prueba manual jugable**.

## Qué se ha incorporado

- `src/gameplay/assault/resonancePreview.ts`: una máquina de estados independiente recibe el movimiento de la cabeza y los segmentos del cuerpo, invoca `detectResonanceLoop`, cuenta enemigos contenidos vivos, evita reactivaciones durante enfriamiento y conserva el polígono para mostrarlo durante 1,7 segundos. No modifica enemigos, energía, HP, daño, módulos ni progresión.
- `src/components/NexusSerpentDemo.tsx`: integración **únicamente** en el bloque de simulación `core.gameMode === 'nexus_assault'` mientras `run.status === 'combat'`, no hay cinemática ni introducción de jefe. Dibujo en espacio mundo con la cámara panorámica existente. Restablece historial en cada nueva partida y en cambio de sala.
- Indicador compacto del HUD de Assault: «CERCO DE RESONANCIA / AS-R1B», instrucciones para cerrar un lazo y marca «SIN DAÑO · PROTOTIPO». Si el cuerpo no tiene suficientes segmentos, solicita crecimiento.
- Pruebas: 17 casos `resonanceGeometry.test.ts` + 11 `resonancePreview.test.ts` = **28 pruebas deterministas**; `scripts/qa-assault-preview-scope.mjs` añade 10 invariantes estructurales de aislamiento. `npm run qa:gate` y GitHub Actions ejecutan los casos.

## Qué permanece intacto

- Movimiento e interpolación de la cadena de segmentos, aceleración, control teclado/puntero.
- Disparo automático y búsqueda de blancos existentes, habilidades activas y pasivas, Tail Strike, invulnerabilidad, impactos de cabeza y cola.
- Ganancia de energía, curación, recompensas, dificultades, salas, jefes, radar, cámara y mundo 5066,67 × 2850.
- Red Vital (`demo`), Supervivencia Nexus (`infinite`) y Vital Flow (`vital_flow`).

## Cómo probar en el equipo

```powershell
cd "C:\Users\ingvm.SPEEDFORCE\Downloads\orbi-nexus-serpent-v1.4.0-recuperacion\nexus_recovery"
git switch develop
git pull --ff-only origin develop
npm run qa:gate
npm run dev:local
```

Abrir `http://127.0.0.1:5173/` y seleccionar Nexus Assault.

1. Completar una primera sala y escoger una mejora que aumente longitud (el motor requiere **al menos 16 segmentos** para probar el cerco; inicialmente puede mostrar «desarrolla el cuerpo»).
2. Dibujar una curva amplia alrededor de uno o varios enemigos y cruzar la cabeza sobre un segmento propio suficientemente separado del cuello. **No basta** acercarse a un enemigo ni girar muy cerrado: se exige área >=3200 unidades² y perímetro >=220 unidades, sin autointersección secundaria.
3. Al cerrar correctamente debe aparecer un contorno energético del color del Guardián, un texto «CERCO DE RESONANCIA», el número de objetivos incluidos y la advertencia «SIN DAÑO». Dura ~1,7 s y tiene una espera de ~2,2 s para impedir reactivaciones continuas.
4. Comprobar también cierres sin enemigos (0 objetivos), segundo cierre tras enfriamiento, salida del área, pausa/reanudación, transición de sala, regreso al menú, nueva partida y cambio de Guardián. Comparar zoom 100% y 25% y tamaño móvil horizontal.
5. Comprobar que **el cerco no reduce HP**; los daños existentes por núcleos y Tail Strike sí deben seguir normales.
6. Entrar a Red Vital, Supervivencia y Vital Flow: no debe aparecer el indicador de AS-R1B ni cambiar el combate.

## Criterio de salida

- No aparezcan falsos positivos al pasar cerca del cuello o cuando el cuerpo aún es demasiado corto.
- Los cercos grandes se detecten al cruzar, la previsualización aparezca con coordenadas correctas y no reduzca FPS perceptiblemente.
- Queden registrados detalles de cercos no detectados y condiciones específicas de movimiento.
- `npm run qa:gate`, TypeScript y Vite correctos; no promover a `main` sin verificación visual.

## Qué sigue

**AS-R2** (NO implementado): daño de área parametrizado y limitado por enemigo/jefe, cooldown por objetivo, targeting desde posiciones de torretas, sinergias de cerco y pruebas de balance. Se habilitará solo cuando AS-R1B esté validado en partida real.

**Rollback**: cambiar `ASSAULT_RESONANCE_PREVIEW_ENABLED` a `false` en `src/gameplay/assault/resonancePreview.ts`; no es necesario revertir el motor histórico del juego.
