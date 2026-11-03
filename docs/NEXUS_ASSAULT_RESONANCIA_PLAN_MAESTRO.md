# ORBI NEXUS SERPENT — Plan maestro de Resonancia Nexus (Assault)

**Fecha:** 2026-11-03  
**Punto de referencia:** rama `develop`, commit `1dc73fe` (QA-AS16, arena panorámica 16:9)  
**Estado:** plan y auditoría formalizados. La **base geométrica pura AS-R1** ya existe y tiene 17 pruebas automatizadas aprobadas; **la detección visual y el daño de cerco no están conectados a las partidas**. El resto de las propuestas sigue sin implementar.  
**Alcance:** exclusivamente `nexus_assault`; proteger `demo`, `infinite`, `vital_flow`, `main` y todas las acciones existentes.

## 1. Propósito y límite de inspiración

Capturar los principios de juego demostrados por SSSnaker (serpiente armada, movimiento continuo, cercos, elección roguelite, salas, presión de proyectiles y especialización de build), **sin copiar sus recursos gráficos, sonidos, diseño de personajes, texto, capítulos, sistemas monetarios ni código**. ORBI conserva sus Guardianes FOTON/HYDRO/AERO/TERMO/MAGNE/ATON, el universo de Red Vital, energía Blackout, armamento modular, E1–E8, GAIA y el nuevo mundo 16:9.

Fuentes externas de contexto: https://www.habby.com/game/detail/snake ; https://play.google.com/store/apps/details?id=com.habby.sssnaker ; https://minireview.io/es/action/sssnaker ; https://www.reddit.com/r/sssnaker/comments/1guwgqq . El texto de análisis aportado por el usuario es la referencia funcional de diseño; los detalles de coronas, tiers, metas y eventos pueden variar por versión y no se deben tratar como contratos exactos.

## 2. Hechos del código actual y oportunidades

| Módulo | Evidencia en `NexusSerpentDemo.tsx` | Estado/decisión |
|---|---|---|
| Mundo | `ASSAULT_WORLD_WIDTH = EXPLORATION_WORLD_WIDTH`, alto compartido; QA-AS16 | **Conservar** arena 5066,67 × 2850 y cámara de seguimiento |
| Movimiento | cabeza con giro interpolado e inercia; `p.segments` en cadena de muelles | **Conservar** para render y física; no sustituir de golpe |
| Disparo modular | `createOrbiCombatModule`, `syncAssaultModulesToBodySlots`, loop de `modules.forEach` | **Extender** apuntado por posición del segmento, no por cabeza |
| La serpiente como arma | `Tail Strike` de contacto, daño/retroceso/sobrecalentamiento | **Conservar** como habilidad exclusiva ORBI |
| Círculo/lazo | no hay rutinas explícitas `circleAttack`, `loopClosed`, `pointInPolygon` | **Crear** «Cerco de Resonancia» sin autocolisión letal |
| Núcleos | FOTON/HYDRO/AERO/TERMO especializados; MAGNE/ATON genéricos | **Completar** stats/proyectiles/estatus por elemento |
| Adquisición | un núcleo inicial; opciones 3/cartas tras sala; 8 slots | **Extender** pool, repetibles, pesos y prerequisitos |
| Mutaciones | 4 mutaciones por nivel 3; 5 sinergias de combinación simple | **Preservar** y ampliar a árbol condicional |
| Rareza | legendary agrupada con epic en `getRarity` | **Corregir** 4 rarezas realmente distintas |
| Rango de desempeño | `roomClearDuration` inicializada pero sin incremento localizado | **Corregir** temporizador antes de cambiar recompensas |
| Recompensa boss | `guaranteedRareUpgrade = true` escrita, no consumida | **Completar** garantía sin duplicar curación |
| Evolución | E1–E8 basada en `player.energy`, cuerpo por `targetLength`, core slots aparte | **Separar** energía gastable, progreso persistente in-run y crecimiento |
| GAIA | requiere 9 energías, pero 8 slots y menos familias adquiribles | **Resolver** con 9 sellos de resonancia y máximo 8 núcleos físicos |
| Salas | normal/swarm/rest/boss; elite/preview definidos no sorteados | **Integrar después** con director de encuentros |
| Boss | 3 familias, fase 2 al 50 %, combate y recompensas ya desarrollados | **Conservar** hasta validar los nuevos encuentros |
| Radar | mapa global 16:9 y rastreo de enemigos | **Conservar** + perímetros/resonancias/alertas de trampas |
| QA | `qa:assault-landscape`, `qa:gate`, GitHub Actions | **Extender** pruebas deterministas, por módulo y modo |

### Limitaciones/casos a revisar primero
- El autoapuntado selecciona enemigo por distancia **a la cabeza**, aunque el disparo nace del segmento portador. Eso impide la verdadera táctica de extender/enroscar torretas.
- La cadena visual usa muelles/relajación y puede deformarse en giros cerrados. No debe utilizarse sin saneamiento como polígono de daños.
- La selección de salas prioriza jefes múltiplos de 5; luego Swarm múltiplos de 4; luego Rest múltiplos de 7. `elite` y `boss_preview` existen, pero no salen desde `chooseNexusAssaultRoomType`.
- Fases, raridades y tiempo de sala tienen solapamientos; corregir antes del árbol profundo para no recalibrar sobre estados defectuosos.
- `NexusSerpentDemo.tsx` tiene más de 21.000 líneas. Introducir lógica de geometría/armas/loot en módulos externos con APIs pequeñas; evitar otra sección monolítica.

## 3. Pilares originales de ORBI que NO se negocian

1. **Una serpiente, múltiples energías**: cada arma aparece como núcleo luminoso independiente acoplado al cuerpo, no como arma global.
2. **Seis Guardianes visibles** y potencial de nueve energías ORBI; MAGNE y ATON deben obtener verdadera identidad de combate, no un reskin.
3. **Red Vital y Blackout** como fuerzas argumentales; preservar continuidad de cosmología y terminología.
4. **Cuerpo vivo** con etapas E1–E8, núcleo interior y Tail Strike. El cerco complementa, no sustituye, el ataque de cola.
5. **Mundo panorámico 16:9** y libertad exploratoria; no reducirlo a un pasillo vertical fijo.
6. **Juego accesible**: no bloquear fusiones detrás de pago, gacha, coronas monetizables, anuncios ni obligación de colección.
7. **Aislamiento de modos**: todos los cambios de Assault detrás de estados/servicios `AssaultRun`; ningún cambio de reglas de Vital Flow, Red Vital o Supervivencia.

## 4. Arquitectura objetivo sin reescritura

Propuesta de módulos:
```text
src/gameplay/assault/
  geometry.ts            # polyline, segment intersections, point in polygon, area
  resonanceLoop.ts       # pure detection + cooldown/event; no canvas calls
  targeting.ts           # local target policy per mounted core
  upgrades.ts            # stable card definitions, gating, rarity, rerolls
  energyRegistry.ts      # nine energy definitions + status/attack archetype
  synergies.ts           # graph rules, active resonance vs fused module
  encounterDirector.ts   # room type/wave/timing/obstacles/telegraphs
  bossPatterns.ts        # preserve legacy 50% phase, optional new patterns
  assaultBalance.ts      # tunables, no magic literals in game loop
  assaultTypes.ts        # state, versions, events; never tie to React state
scripts/qa-assault-*.mjs # deterministic mechanics and regression gates
```

**Integración:** `NexusSerpentDemo.tsx` continúa controlando el bucle existente e invoca funciones puras del sistema nuevo. React mantiene la UI. No añadir un segundo `requestAnimationFrame` ni un segundo motor de colisiones. Reutilizar `assaultRun.modules`, `assaultRun.enemies`, `player.segments` y `assaultRun.projectiles`. Todas las modificaciones del estado se aplican en **un solo tick** con eventos identificados.

**Flags** sugeridas:
`ASSAULT_V2_PATH_ENABLED`,
`ASSAULT_V2_LOOP_PREVIEW`,
`ASSAULT_V2_LOOP_DAMAGE`,
`ASSAULT_V2_NODE_AIM`,
`ASSAULT_V2_SKILL_TREE`,
`ASSAULT_V2_ENCOUNTER_DIRECTOR`,
`ASSAULT_V2_TEAM_RELAY`.
Cada una habilitada solo para `nexus_assault`; por defecto desactivada hasta que pase QA. Rollback por flag, no revirtiendo mecánicas históricas.

## 5. Mecánica estrella — Cerco de Resonancia

**Diseño:** un lazo de energía formado cuando la cabeza cruza un tramo suficientemente alejado de su propio cuerpo. En el interior se aplica una descarga energética. El jugador puede formar un cerco pequeño para someter élites, o uno amplio para encerrar grupos; disparos automáticos y Tail Strike siguen operando.

**Regla geométrica propuesta:**
1. Añadir una `AssaultPathHistory` **solo de consulta**: muestras de trayectoria de la cabeza a cada ~8–12 unidades recorridas, con interpolación temporal determinista. No sustituir los segmentos renderizados.
2. Construir un `combatPolyline` estabilizado (cabeza + nodos re-muestreados a distancia espacial) y analizar intersección del segmento de avance `headPrev→headNow` con los segmentos del cuerpo desde índice >= 5; ignorar la unión contigua a la cabeza.
3. Obtener el punto exacto de intersección y cerrar el polígono con la trayectoria entre cabeza y cruce.
4. Rechazar polígonos degenerados: autointersección secundaria, vértices repetidos, área < 3.200 unidades², menos de 16 segmentos o perímetro insuficiente; parámetros sujetos a prueba con movimiento real.
5. `pointInPolygon` sobre enemigos **vivos** potencialmente cercanos; filtrar primero por bounding box, no calcular sobre todos sin culling.
6. Emitir `AssaultLoopClosedEvent` único; lanzar efecto visual y sonido ORBI original, aplicar un golpe de área, luego pulsos breves opcionales si el lazo sigue válido.

**Antiexploit y balance inicial propuesto (no cifras implementadas):**
- Activación máximo una vez por cierre y tiempo de enfriamiento global de 1,8–2,5 s; cada enemigo conserva su último tick para no recibir 60 golpes/s.
- Limitar el daño de cerco sobre jefes y objetivos especiales; el cerco es más fuerte en control AoE que en DPS de un objetivo único.
- Los cercos extremadamente pequeños no deben ser una estrategia óptima de invulnerabilidad. El jugador sigue siendo vulnerable por cabeza y cola según reglas ORBI actuales.
- Un cerco no mueve ni teletransporta al enemigo; no crea colisiones con el cuerpo y no cambia los controles de giro.
- La «Ametralladora» (cuerpo apilado) sirve para concentrar disparos, pero un polígono de área mínima no activa daño gratuito.

**Complejidad y presupuesto:** trayectoria `O(N)` para intersección contra una línea de cabeza y `O(K·N)` para enemigos contenidos **solo al cerrar**, no por frame; con índice espacial (rejilla 256–384 unidades) reducir K. Conservar la meta de 60 FPS escritorio y 30 FPS móviles modestos; el coste por frame debe ser medido, no supuesto.

## 6. Núcleos por segmento y 4 estilos tácticos

El disparo actual ya usa cooldown individual por módulo, pero **apunta desde la cabeza**. La política nueva evalúa distancia, ángulo y prioridad desde `bodyPoints[module.bodyIndex]`. Mantener la lógica actual como fallback bajo flag.

- **Línea / Barrido:** módulos distribuidos a lo largo del recorrido, objetivos independientes. Bonus por diversidad de blancos, no solo por daño bruto.
- **Enroscado / Concentración:** módulos próximos concentran disparos. Introducir degradación leve por saturación o enemigos que obliguen a desplazarse; nunca premiar AFK constante.
- **Cerco / Resonancia:** cierre geográfico válido con hit interior + sinergias relacionadas. El ataque de cola se mantiene adicional.
- **Curva / Flanqueo:** alta proporción de módulos mirando a distintos ángulos y efectos cruzados. No exigir cerrar círculo para tener recompensa.

**TargetingPolicies** posibles: `nearest_from_node`, `low_health`, `elite_priority`, `marked`, `crowd_center`, `defend_head`. Seleccionarlas por arma/upgrade, con prioridad y rangos explícitos. Limitar búsqueda a enemigos activos y visibles en zona cercana; no autoapuntar a kilómetros por el nuevo mapa.

## 7. Identidades elementales y 9 energías

**Base actual:** FOTON = precisión solar/perforación; HYDRO = slow/absorción; AERO = viento/cadencia; TERMO = DoT térmico/empuje. Mantener el balance existente como baseline.

**Completar:**
- MAGNE: campo de polaridad; vincular blancos marcados con arcos de daño encadenado y breve atracción de proyectiles **enemigos** (con límites).
- ATON: pulsos de fisión controlada; daño en área pequeño, radiación acumulable con tope.
- KINETRIX: dardos cinéticos, carga por movimiento, impacto único con empuje.
- H2NOVA: plasma limpio de hidrógeno, burbuja regenerativa o reacción con Hydro/Termo.
- QUANTUM: fragmentos con pequeñas distorsiones de trayectoria/posición y probabilidad explícita de eco.

**Prevenir superposición:** cada núcleo tiene un rol dominante `single_target`, `aoe`, `control`, `chain`, `defense` o `mobility`. Cada estado elemental usa caps y duración; evitar que nueve proyectiles simultáneos saturen pantalla.

**Máximo ocho módulos físicos** se conserva. Para desbloquear GAIA se reúnen **nueve Sellos de Resonancia** (bitset/Set por run), que se obtienen por uso/combinación y eventos; no es necesario portar nueve torretas a la vez. Un sello solo cuenta si su condición objetiva se ha alcanzado en esa partida. `GaiaAwakening` solo cambia al completar el Set y superar un desafío; no permitir que se active por contar skins. Debe seguir siendo in-run y lograble sin compras.

## 8. Árbol evolutivo de armas y cartas — 6 escalones ORBI

No copiar el sistema de Coronas. Reusar el sistema actual de niveles 1–5 y mutaciones; **separar** nivel físico de módulo, maestría elemental y fusión.

- **E1 — Activación:** el núcleo existe y dispara.
- **E2 — Mejora de comportamiento:** nuevo rebote, perforación, campo, cadena, etc., escogido de cartas elegibles.
- **E3 — Mutación:** respetar `Solar Lance`, `Tidal Siphon`, `Wind Split`, `Termo Pulse` actuales y añadir equivalentes para las otras energías.
- **E4 — Sobrecarga:** desbloqueo por maestría **durante la partida**, no por coronas compradas; modifica el ataque del elemento y añade nueva firma visual.
- **E5 — Fusión dual:** requiere E3 en dos ramas compatibles y seleccionar una carta de fusión real. Las cinco `synergiesActive` actuales siguen siendo **resonancias pasivas automáticas** y no consumen carta; la fusión es un escalón superior distinto.
- **E6 — Convergencia:** mejora adicional de fusión al alcanzar E4/E3, con costes/condiciones explícitos y máximo número de fusiones activas balanceado.

Modelo propuesto:
```ts
type ElementId = "foton"|"hydro"|"aero"|"termo"|"magne"|"aton"|"kinetrix"|"h2nova"|"quantum";
type AssaultUpgradeKind = "new_core"|"core_level"|"mutation"|"overload"|"fusion"|"defense"|"body"|"heal"|"resonance";
type FusionRecipe = {
  id: string;
  required: Array<{element: ElementId; minTier: number}>;
  requiresRunMastery?: number;
  grants: string;
  maxPerRun: number;
};
type AssaultRunV2 = {
  schemaVersion: 2;
  moduleSlots: number; // 8 max
  acquiredResonances: Set<ElementId>;
  selectedFusions: string[];
  combatPath: Array<{x:number;y:number}>;
  lastLoopId?: number;
};
```
El `Set` es una forma conceptual; si se persiste JSON usar `ElementId[]` serializable con migración, no serializar un Set directamente.

**Loot pool:** evaluar `prerequisites` y `conflicts` antes de pesos, luego sorteo semilla-determinista y diversidad de tres cartas. Cuatro rarezas reales: común, rara, épica y legendaria; el roll de legendaria no se suma a épica. Recompensa rara de jefe se **consume** explícitamente en el próximo selector. Pity/gacha de pago: prohibidos. Cartas no disponibles muestran una ruta futura en el Codex, no ocupan el pool.

**Adquisición en campo:** cajas energéticas de ORBI (originales): `Cápsula Filamento` (+longitud), `Relé de Núcleo` (elección de módulo), `Cristal de Resonancia` (carga de evolución), `Cámara de Enlace` (3 cartas). No copiar sprites ni cofres del referente. Añadir distribución escasa y límites anti-farm.

## 9. Evolución E1–E8, longitud y recursos

**Tres variables independientes:**
1. `vitalEnergy` gastable (habilidades, absorbible y pérdida).
2. `runEvolutionCharge` acumulativa/monótona para E1–E8; la muerte termina run, pero gastar energía no hace involucionar el aspecto.
3. `targetBodyLength` y `combatModuleCount`: define volumen físico y cantidad de torretas; límites visuales y de simulación distintos.

Migración propuesta: inicializar `runEvolutionCharge` a partir de energía acumulada conocida, sin alterar `energy` histórico; contabilizar orbes por id una sola vez, evitar doble crédito al limpiar salas. Conservar tabla E1–E8 existente como primera calibración (0,15,30,50,70,95,125,160), pero nombres por Guardián y cambios visuales graduales. El número de núcleos visibles realmente equipados no debe confundirse con `visibleInternalCoreCount` artístico.

**Longitud y espacio:** crecimiento actual +2 al agregar núcleo y +0,5 al elegir otras mejoras se mantiene inicialmente. Nuevas «Cápsulas Filamento» aumentan longitud sin regalarnos un arma; la build de cerco debe ser viable aunque el jugador lleve pocos módulos.

## 10. Director de salas, mapa 16:9 y amenazas

El generador de salas no debe reescribir las 5066,67 × 2850 unidades: propone **zonas de encuentro locales** dentro del mapa global, con telemetría de cámara y posiciones del jugador. Mantener cámara y radar panorámicos; un encuentro marca un área activa, pero no genera una barrera invisible ni achica la arena navegable.

- **Normal:** enemigos mixtos con 1 patrón central.
- **Swarm:** muchas unidades con caps de proyectiles y rendimiento.
- **Elite:** 1–2 enemigos de rol especial, mejoras mayores, no obligatorio cada sala.
- **Rift/Preview:** anticipa ataques de un futuro jefe y da recursos si el jugador lee el patrón.
- **Sanctuary:** descanso/interacción voluntaria, sin engañar al jugador sobre hostilidad.
- **Boss:** jefe con señales claras y patrones auditados.

**Recomendación de capítulos:** campaña de 30 salas organizada en sectores 1–10, 11–20, 21–30, sin quitar los jefes del calendario actual cada 5 salas durante la migración. Posteriormente diferenciar mini-jefe (10,20) y jefe de cierre (30) solo si mejora el ritmo en QA. Mantener todos los tipos de sala existentes, pero habilitar `elite` y `boss_preview` por reglas explícitas que no desplacen las salas de santuario.

**Objetos originales ORBI:** paneles refractores, pilares de Blackout, condensadores detonables, campos térmicos, puentes energéticos. `Obstacle` incorpora `collidesWithHead`, `blocksProjectiles`, `reflectsProjectile`, `destructibleHp`, `telegraphSec`; la cola no es un sólido que bloquee trayectorias. Toda trampa debe tener preaviso gráfico/sonoro, ruta accesible y límite de cobertura para no bloquear el mundo.

## 11. IA enemiga y jefes: combate que obliga a cambiar de patrón

Conservar Baby, Armored, Twin-Head, Splitter, Spitter, Crawler, Void Serpentling y REST_BEACON. Introducir conductas como **componentes** sobre arquetipos existentes, no reemplazarlos:
- `leaper`: predice posición de cabeza, muestra indicador de suelo, salta y puede ser golpeado en ventana concreta;
- `charger`: 0,7–1,2 s de wind-up y barrido lineal, con dirección marcada;
- `splitter`: esporas originales, hasta 2–3 hijos para evitar duplicación exponencial;
- `artillery`: abanico, cruz y ring con huecos suficientes para una cabeza de hitbox real;
- `anti_turtle`: zona de riesgo que rompe permanencia excesiva en una esquina, **sin castigar enroscado táctico normal**.

Los jefes actuales Blackout Elite Core, Crimson Pulsar Core y Void Serpent Fragment mantienen sus dos fases (50% HP) hasta que estén probados cerco/IA y render. Tres fases al 70%/30%, invocaciones y teleports solo después, detrás de flag; el boss debe poder ser dañado tanto por armas como por Tail Strike y cerco, con topes de daño por evento.

## 12. Relevo, equipo, equipamiento y economía (fase posterior)

**Tag-team no entra en el primer ciclo**: altera duración, dificultad, habilidades y derrota, y puede diluir el protagonismo del Guardián elegido. Más adelante probar «Pacto de Guardianes»: un titular y hasta dos suplentes, con reserva explícita, invulnerabilidad breve de relevo y misma configuración de módulos, sin regalar torretas duplicadas.

Meta-progresión original y opcional por logros/recursos ganados jugando, no gacha:
- Cabeza (precisión), Filamento (alcance), Emisor (cadencia), Coraza (resistencia), Núcleo Vital (HP), Cola (impacto).
- Guardado versionado con migraciones, capas de rareza sin poder imposible de balancear, no usar nombres ni imágenes del equipo de SSSnaker.
- No introducir Arena asíncrona, gremios, monedas premium, ruleta ni eventos diarios antes de terminar el ciclo central de Assault. Coste de mantenimiento, equilibrio y experiencia offline no lo justifican todavía.

## 13. Balance preliminar: variables y fórmulas parametrizadas

**Solo hipótesis de diseño, no valores actualmente programados:**
- Combat pacing: tiempo contra enemigo normal ~3–9 s, élite ~15–30 s, jefe ~60–120 s en build comparable; validar con seeds y diversidad.
- La descarga de cerco tendrá componente `base + módulos + tamaño`, pero daño de jefe acotado por porcentaje de HP por cierre; se debe medir DPS efectivo de cerco frente a Tail Strike y a disparo, no fijar números arbitrarios como definitivos.
- El daño por segundo esperado de un módulo se calcula como `damage * projectileCount * hitChance / cooldownSeconds`. Las fusiones deben comparar **efecto**, no solo DPS; efecto de ralentización y empuje cuentan como supervivencia.
- Conjunto configurable: `loopMinSegments`, `loopMinArea`, `loopCooldown`, `loopBossCap`, `targetingRadius`, `spawnDistanceMin/Max`, `enemyActiveCap`, `projectileBudget`, `statusStackCap`, `particleBudget`, `roomTimeGoal`, `healBudget`, `fusionSlots`, `bodyLengthCap`, `difficultyCurve`, `hpHeadTailRatio`.
- Director toma el rango de módulos: si enemigo aparece a más de 1.2× del rango efectivo y no tiene movimiento hacia el jugador, marcar telegráficamente ubicación y ajustar spawn, no obligar a recorrer 1.200 unidades sin combate.
- Conserva presupuesto actual de proyectiles (hasta 48 en ciertas salas) como línea de partida para balance, no aumentarlo por fusionar armas.
- Cargas/curación de defensa no pueden permitir invulnerabilidad permanente.

## 14. Riesgos y controles

| Riesgo | Impacto | Mitigación/QA |
|---|---|---|
| Romper movimiento/animación de la serpiente | Crítico | historial geométrico independiente; comparación frame a frame |
| Autocierre falso en giros pequeños | Alto | mínimos de área, distancia y segmentos + test degenerados |
| Cerco demasiado fuerte contra jefes | Alto | caps por boss + cooldown por evento/objetivo |
| Cortar sin querer otros modos | Crítico | flags exclusivos Assault, pruebas smoke en 4 modos |
| Rendimiento con muchos enemigos + polígonos | Alto | detección al evento, bounding boxes, spatial hash, culling |
| Desbordamiento mapa/radar tras 16:9 | Alto | QA-AS16 siempre activo; tests bordes y minimapa |
| Recompensas duplicadas por callbacks de jefe | Alto | IDs idempotentes y un solo flujo de finalización |
| Builds obligatorias de único elemento | Alto | cuatro estilos de movimiento viables + diversidad de cartas |
| Estado save antiguo incompatible | Alto | versión de schema, migración y fallback |
| Efectos visuales impiden ver proyectiles | Alto | jerarquía visual, límites alfa/partículas y telegraphs |
| Dificultad imposible para jugadores nuevos | Alto | tutorial, modo inicial, curva y datos de intentos local |

## 15. Orden de ejecución y criterios de salida

**GATE 0 — Línea base y bugs bloqueantes**
- Congelar el comportamiento actual (semillas y capturas), completar `roomClearDuration`, rarezas y `guaranteedRareUpgrade`.
- Asegurar que GAIA no se anuncie como obtenible; documentar 8 slots y nine-resonances proposal.
- **Salida:** TypeScript, Vite, QA-AS16 y smoke de las 4 modalidades, sin regresión.

**AS-R1 — Trayectoria y cerco sin daño**
- Añadir librería geométrica pura, tests de cruces, polígonos cóncavos, tolerancias y casos degenerados.
- Primera integración solo `LOOP_PREVIEW`: efecto de cierre y telemetría local; módulos y daño históricos intactos.
- **Salida:** 100% tests geometría, estabilidad FPS y no cierres falsos.

**AS-R2 — Cerco ofensivo y apuntado por segmento**
- Daño AoE por eventos con cooldowns, límites en jefes; autoblancos desde cada segmento con fallback.
- **Salida:** se puede encerrar enemigos, Tail Strike sigue funcionando, no hay disparos fuera de rango.

**AS-R3 — Arsenal/loot y progreso coherente**
- Cartas de núcleo repetible, defensa, longitud, cuatro rarezas; E1–E8 con contador monótono y cuatro nuevas especializaciones.
- **Salida:** 8 slots realmente utilizables, 3 cartas elegibles, estadísticas reales y no regresión de guardianes.

**AS-R4 — Grafo, mutaciones, fusiones y GAIA**
- Resonancias pasivas existentes + fusiones de cartas E5/E6; nueve sellos, ocho módulos físicos.
- **Salida:** GAIA alcanzable en un run sin compras, todas las recetas validadas y cada elemento útil.

**AS-R5 — Director, obstáculos, enemigos**
- Integrar salas Elite/Preview, hazards originales, nuevos patrones y telegraphs; conservar formato panorámico.
- **Salida:** 30 salas se pueden finalizar en QA, sin softlocks, accesos bloqueados ni enemigos fuera de mundo.

**AS-R6 — Jefes, relevo opcional y presentación**
- Boss 3 fases detrás de flag, balance de dificultades, tutorial de cerco, HUD, retroalimentación, optimización móvil.
- **Salida:** desempeño en FPS objetivo, elección significativa de builds, historia y estética coherentes ORBI.

## 16. QA mínimo obligatorio para cada PR

1. `npm run qa:gate` + `npm run qa:assault-landscape` + build de Actions; **distinguir** TypeScript si el job es `continue-on-error`.
2. Tests unitarios puros de colisiones, punto en polígono, precisión temporal, daño idempotente, rarezas, requisitos y fusiones.
3. Partidas con seeds: ataque sin mejoras; cinco mejoras; cerco pequeño/grande; boss fase 2; pausa; HP0; upgrade fallback; santuario; transición; 30 salas.
4. Vistas 1920×1080 al 100% y 25%, y móvil horizontal. Revisar radar, visibilidad de peligro, interacciones y puntero.
5. Smoke de Red Vital, Supervivencia, Vital Flow y retorno a START/CHOOSE; cero cambios de comportamiento.
6. Monitor en desarrollo: `fps`, `renderMs`, `geometryMs`, `projectileCount`, `enemyCount`, `loopEvents`, `damageBySource`, `rareOffers`, `softlocks`; sin telemetría personal obligatoria.
7. Promocionar a `main` **solo** tras aprobación visual/funcional del propietario.

## 17. Decisión recomendada

**Primer desarrollo efectivo: AS-R1 «Cerco de Resonancia» sin daño**, después de GATE 0. Es la diferencia mecánica con mayor valor potencial de toda la comparación. Mantener intacto el render de serpiente y el ciclo de armas existente; construirlo como módulo puro, feature flag y test. En paralelo, reparar las tres fallas de progresión que contaminarían cualquier balance (temporizador de sala, rareza legendaria y garantía boss).

**No confundir:** este documento es un plan de implementación y auditoría, no la afirmación de que estas mecánicas ya se encuentren integradas.
