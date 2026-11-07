# ORBI NEXUS SERPENT — Continuidad oficial RV-08A → RV-08B → RV-09
**Fecha:** 2026-11-07  
**Modo:** Nexus Assault  
**Repositorio:** https://github.com/ingeniusvictor/orbi-nexus-serpent  
**Línea base de inspección:** `feature/assault-rv08-mutations-fusions`, commit `e95896f34474c20ad511ce8b29ec4e9c4b34bd58`  
**Estado:** especificación de trabajo. NO equivale a implementación de estas fases.

## 0. Contexto validado y restricciones inviolables
El jugador confirmó nueve Guardianes seleccionables, nueve energías registradas en GAIA LOCK, progresión en Nexus Assault, renacimiento gratuito y combate con múltiples núcleos. Las capturas del 7 de noviembre muestran: (a) FOTON con proyectiles/halo verde desproporcionado; (b) núcleo inicial y círculo luminoso desfasados al primer instante, que posteriormente se alinean; (c) al alcanzar 9/9 GAIA muestra principalmente un estado de interfaz, sin silueta suprema memorable.

Se identificaron pistas concretas en `src/components/NexusSerpentDemo.tsx`: el render de lanza solar para FOTON en Assault aplica un multiplicador de longitud de 1.35 y bloom adicional; el render de núcleos usa `mod.segmentIndex` para hallar el segmento; existe `mod.bodyIndex` junto con sincronización de módulos al cuerpo; GAIA tiene `gaiaAwakenedSec` y mejora temporal tras desafío de jefe, pero no una forma visual persistente ligada al progreso 9/9. **La causa del desajuste de spawn aún requiere confirmación en ejecución.**

No modificar `main` ni `develop`; crear PRs en borrador desde una rama de trabajo derivada de RV-08. Preservar nueve Guardianes, ocho núcleos físicos, nueve sellos, E3 mutaciones, E5 fusiones, sinergias pasivas, Cerco de Resonancia, Tail Strike, controles, revive gratuito, Prismas ORBI sin cobros y otros modos fuera de Assault. No incorporar gráficos/código/sonidos de SSSnaker. No añadir un segundo bucle de animación.

## 1. RV-08A — Normalización visual de proyectiles (primera intervención)
**Objetivo:** todas las energías pueden ser diferentes, pero el disparo base ocupa un espacio visual comparable; FOTON vuelve a ser reconocible sin tapar el combate.

- Auditar `ORBI_ATTACK_SIGNATURES`, radio lógico de proyectiles, cuerpo del disparo, halo, bloom, estela y partículas. Distinguir hitbox física, intensidad luminosa y geometría de dibujado; jamás alterar daño/velocidad por cambios cosméticos.
- Retirar la excepción excesiva de FOTON: revisar `length *= 1.35`, gradiente de halo y bloom de la punta; conservar centro blanco y acento verde solar más fino.
- Centralizar presupuesto visual por proyectil con escalas acotadas para núcleo, halo y estela; diferenciar formas (lanza, burbuja, cuchilla, pulso) sin desproporción. Propuesta inicial: núcleo dibujado dentro de 0.85–1.15 del tamaño de referencia; halo máximo 1.6–2.1 veces el cuerpo del disparo. Calibrar en juego; no usar estos números como límites de hitbox.
- Reducir únicamente emisión de estelas bajo congestión, aprovechando los límites de partículas existentes; no suprimir las señales de peligro.
- Asegurar que 1, 4 y 8 núcleos mantengan enemigos, ruta de movimiento y disparos visibles, incluso con mutaciones y fusiones.

**QA RV-08A:** capturas iguales a escala 100 % de FOTON y las otras ocho energías; comparación de diámetro aparente, longitud de estela y ocultamiento; hitbox y DPS antes/después equivalentes; prueba de sala 14 y 25+, ocho núcleos, FPS y partículas; sin regresiones E3/E5.

## 2. RV-08B — Sincronización atómica al iniciar (segunda intervención)
**Objetivo:** cero fotogramas visibles con orbe, anillo y segmento en coordenadas distintas al crear partida, elegir cualquiera de los nueve Guardianes, revivir o cambiar sala.

- Inspeccionar la construcción de `core.player.segments`, la posición de cabeza/cámara, `createOrbiCombatModule`, `getNextAvailableModuleBodyIndex`, `syncAssaultModulesToBodySlots` y el render que usa `mod.segmentIndex`. Identificar el primer tick en que `bodyIndex` y `segmentIndex` se sincronizan.
- Elegir una fuente de verdad para `moduleAnchorIndex` o establecer una función pura `resolveModuleAnchor(module, segments, player)`; usar la **misma** para orbe, anillo, aura, origen del disparo y efectos, con fallback explícito cuando aún no existan los segmentos necesarios.
- Inicializar posición, longitud, ángulo, cola, slots y cámara antes del primer dibujado de Assault. Evitar interrumpir el render general y no añadir `setTimeout` como parche visual.
- Repetir sincronización en los puntos de reentrada: inicio, cambio de Guardián, transición de sala, revive, crecimiento, mutación y recomposición de cuerpo. Evitar saltos de un frame y teletransporte óptico.
- Instrumentación de desarrollo sin impacto de producción: distancia por fotograma entre centro del orbe, centro del anillo y segmento; reportar `maxInitialAnchorErrorPx` y limpiar bandera de QA cuando se estabilice.

**QA RV-08B:** cada uno de los nueve Guardianes, mínimo tres reinicios por personaje, verificación desde frame 0, transiciones y revive; objetivo de error entre centro de orbe y anillo ≤1 px en coordenadas de mundo. Sin alteraciones de cámara, movimiento, apuntado por núcleo ni colisiones.

## 3. RV-09 — GAIA SUPREME FORM / Serpiente Suprema de la Red Vital
**Decisión de producto:** separar *desbloqueo cosmético supremo permanente durante la partida* de *potenciación de combate temporal*.
- **9/9 sellos energéticos:** activar `gaiaSupremeVisualUnlocked` por progreso derivado de las nueve energías, aunque el cuerpo solo porte ocho módulos. La serpiente cambia de forma de inmediato y la mantiene hasta derrota/fin de partida. No requiere comprar Prismas ORBI ni un noveno núcleo físico.
- **Desafío de jefe existente:** al derrotar al jefe que corresponde, conceder la Convergencia GAIA temporal ya implementada (actualmente 14 segundos; valores de daño existentes), distinguible del desbloqueo cosmético y aplicable en sala siguiente. No duplicar bonos ni resetear sellos en cambios de sala.
- La forma suprema debe ser **silueta nueva reconocible**, no solo brillo: cabeza geométrica/corona orbital inspirada en símbolos originales ORBI; crestas articuladas; nueve marcas energéticas distribuidas por cuerpo; contorno segmentado prismático; terminación de cola singular; estela de doble filamento refinada. Guardar legibilidad de orbes instalados.
- Paleta: base blanca/verde vital con acentos reconocibles de las nueve energías; alternancia suave sin flashes agresivos, halo delgado; evitar una capa verde opaca que cubra la arena.
- Transición de 0.8–1.2 s con ondas y un pulso de nueve señales energéticas, un solo evento por desbloqueo, sin pausa prolongada ni emisión ilimitada. Feedback HUD: `GAIA SUPREME · DESPERTADA` persistente y `CONVERGENCIA · 14 s` durante el buff, con temporizador decreciente.
- Separar estado de forma del temporizador de bonificación; rehidratar estado correctamente al revivir y transitar entre salas. Estado visual derivado del progreso 9/9 para evitar desincronización al reconstruir la escena.
- Optimización: geométricas Canvas 2D y cache/Path2D según viabilidad, no nuevos assets obligatorios ni entidades persistentes por segmento; LOD low-effects, máximo dos capas de halo, presupuestos visuales constantes con 8 núcleos; no cambiar física/hitbox por la apariencia.
- La rareza E8 existente puede coexistir con GAIA. La forma GAIA siempre prevalece visualmente sin borrar núcleos/armas/evoluciones internas del Guardián.
- Probar 9/9 sin jefe vencido, 9/9 + jefe vencido, durante 14 s de convergencia, tras expiración, revive y nueva sala. La silueta suprema debe **permanecer** en todos esos casos (excepto reset de run).

**QA RV-09:** secuencia reproducible 8/9 → sello 9/9 → transformación visible (frame y HUD) → jefe → potencia temporal → expiración sin perder apariencia; pruebas deterministas de estado y render snapshot; 60 FPS objetivo en equipo de escritorio de referencia, degradación gráfica controlada en equipos modestos; sin congelamiento observado tras sala 25, nueve sellos y ocho núcleos.

## 4. Criterios generales y gates de liberación
1. Tres PRs en borrador: RV-08A, RV-08B y RV-09. Secuencia de merge a `develop` solo tras QA; `main` intacta.
2. Compilar Vite, `npm run check:types` sin errores, `npm run qa:gate`, QA de Assault y regresión de revive, GAIA, geometría, mutaciones E3 y fusiones E5. No basta con tests de cadenas estáticas para declarar jugabilidad.
3. Registrar comparación visual antes/después y rendimiento (FPS mediana, mínimo/1 % low, disparos, partículas y cargas). Probar teclado/ratón y táctil.
4. Comprobar que no existen disparos gigantes, desfasaje inicial, ni apariencia GAIA reducida a un contador. Si alguna falla, mantener el PR en borrador e informar.
5. Documentar commits, ejecución de Actions, pantallas e incidencias en el plan maestro sin sobrescribir el historial.
6. Solo después de los tres gates avanzar al backlog E4 sobrecarga, E6 convergencia ofensiva, enemigos avanzados, obstáculos y patrones de jefes.

## 5. Instrucción de ejecución al retomar
Trabajar directamente en GitHub `ingeniusvictor/orbi-nexus-serpent`, usando `feature/assault-rv08-mutations-fusions` como punto de partida **solo si la rama sigue vigente**; comprobar HEAD antes de actuar. Implementar RV-08A, validar y luego RV-08B; crear RV-09 únicamente cuando ambas superen sus gates. No sustituir el objetivo de GAIA por un simple buff/HUD. Entregar comandos PowerShell completos para probar localmente y conservar `main` intacta.

---

## 6. Implementación real RV-08A/RV-08B/RV-09 (7 noviembre 2026)
**Código implementado en** `feature/assault-rv09-supreme-form-implementation`. **PR:** https://github.com/ingeniusvictor/orbi-nexus-serpent/pull/9 (borrador). Esta sección sustituye el estado histórico de planificación de las fases 1–3.

- **RV-08A implementada:** FOTON en Assault usa 0.94 en vez de 1.35 de longitud extraordinaria, glow y bloom focales menores, y partículas de estela reducidas. Hitbox y daño se mantienen.
- **RV-08B implementada:** `moduleAnchors.ts` define un centro común para el cuerpo físico, proyectil, halo y núcleo. `createInitialAssaultSegments` crea los puntos del cuerpo antes del primer fotograma; se sincronizan los slots al iniciar y antes de dibujar Assault.
- **RV-09 implementada:** `gaiaSupremeVisual.ts` dibuja una capa de silueta original con cuerpo blanco/verde vital, corona y crestas gemelas, nueve sigilos prismáticos, tail tip y halo de convergencia. El requisito de progreso se deriva de los nueve sellos conocidos, no del número de módulos. El render base reduce sus halos verdes para dar protagonismo a esta silueta.
- **Reglas conservadas:** ocho núcleos físicos, nueve sellos GAIA, buff Convergencia temporal, revive, resto de modos, wallets sin pagos.
- **Pruebas añadidas:** `src/gameplay/assault/moduleAnchors.test.ts`, `gaiaSupremeVisual.test.ts` y `scripts/qa-assault-rv09-visual.mjs`. Ver workflow `build-and-type-audit.yml`.
- **Pendiente:** verificación manual del aspecto real en Chrome (pantallas del usuario), alineación instantánea de los nueve Guardianes, continuidad con ocho núcleos y 9/9, FPS de sala 25+. No confundir CI con certificación de gameplay.
