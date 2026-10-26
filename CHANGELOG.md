# Historial de cambios — ORBI Nexus Serpent

Todas las modificaciones relevantes del juego se documentan aquí. Seguimos el principio de conservar lo jugable y describir el cambio, su motivo, la evidencia de prueba y los riesgos pendientes.

Formato: fecha ISO, identificador, tipo (Añadido / Modificado / Corregido / Rendimiento / Seguridad), modos afectados, validación y enlaces a issue/commit.

## [Sin publicar] — rama develop

### QA-01G-3 — Eliminar barrera física cuadrada residual (2026-10-26)
- **Red Vital / Supervivencia Nexus:** corregido el tope duro horizontal `p.x > size - hardMargin`, que continuaba restringiendo físicamente al personaje a X=2835 aunque el mundo ya medía 5066,67 de ancho.
- Corregida también la detección y fuerza de empuje del borde derecho del campo de contención, sustituyendo el alto `size` por el ancho efectivo `worldWidth` exclusivamente en el eje X.
- No se modifica el eje Y, el radar ni la geometría específica de las salas de Nexus Assault y Vital Flow.
- **Estado:** implementado en `develop`; pendiente `npm run qa:gate` y comprobación manual de tránsito por X=2850 y del borde derecho real, sin afectar los cuatro modos. No fusionar a `main`.

### QA-01G-2 — Rectángulo físico/visual consistente (2026-10-26)
- **Red Vital y Supervivencia Nexus:** el escudo perimetral y su onda interior se dibujan ahora con ancho y alto independientes, alineados con los límites físicos 5066,67×2850. Se conserva el tamaño de los mundos propios de Assault y Vital Flow.
- Aparición de peligros de supervivencia usa el ancho exploratorio real y una posición alternativa dentro de límites. Corregidos el centro de referencia del aviso de controles de Red Vital y el reposicionamiento durante la cinemática.
- Nebulosas de fondo distribuidas a lo ancho del mundo; trazos de evento `vacuum_surge` prolongados hasta el borde horizontal.
- **Validación pendiente:** `npm run qa:gate`, visual 1920×1080/25 %, radar, cuatro bordes físicos, eventos Blackout y regresión de los cuatro modos. Sin promoción a `main`.

### Añadido
- **STB-01 (2026-10-25):** rama `develop` para trabajo de estabilización independiente de `main`.
- **STB-01 (2026-10-25):** comando `npm run dev:local` para iniciar Vite en `127.0.0.1:5173`.
- **STB-01 (2026-10-25):** comando `npm run check:types`, auditoría de TypeScript no bloqueante en CI y compilación automática en GitHub Actions.
- **STB-01 (2026-10-25):** documentación de líneas de trabajo y criterios de calidad en `docs/STB-01-STABILIZATION.md`.

### Corregido (STB-01 — 2026-10-25)
- `src/types.ts`: tipado de zonas peligrosas acepta los temporizadores `damageTimer` y `tickTimer` que conviven en el código recuperado (no cambia comportamiento).
- `NexusSerpentDemo.tsx`: objetivos de demo se inicializan usando la definición tipada `INITIAL_DEMO_OBJECTIVES` para conservar etiquetas y descripciones.
- `NexusSerpentDemo.tsx`: el tipo del texto flotante documenta propiedades de animación que ya se usan (`vx`, `vy`, `decay`, `maxLife`).
- `NexusSerpentDemo.tsx`: valor inicial `roomType` normalizado de `NORMAL` a `normal` según `NexusAssaultRoomType`.
- **Validación:** cambios publicados en `develop`, aún sin resultado de `tsc --noEmit` ni test jugable posterior. No marcar como resueltos numéricamente hasta medir.

### Validación local comunicada (2026-10-25)
- Tras actualizar `develop` hasta `7635d9a`, ejecutar `npm install` y `npm run check:types`, el usuario registró **433 errores TypeScript** y código de salida **2**.
- Comparación con el respaldo original: **450 → 433** (17 diagnósticos menos; aproximadamente 3,8 %).
- `npm install` auditó 218 paquetes y no informó vulnerabilidades; persisten advertencias informativas de scripts de instalación.
- No equivale a compilación de producción aprobada ni a pruebas de regresión completas.

### STB-01B — Correcciones acotadas (2026-10-25)
- Inicializado `lastHelpTime` en el estado principal para mantener coherente la ayuda contextual.
- Reinicio de objetivos de Red Vital: reutiliza `INITIAL_DEMO_OBJECTIVES` también para el estado de React, conservando `label` y `description`.
- Diagnóstico base recibido: **433 errores**; de ellos **406 TS2339**, **8 TS2739**, **8 TS2367**, y **11 de otras categorías**, según el archivo adjunto de validación local.
- **Validación comunicada:** después de STB-01B, ejecución local de `npm run check:types` reporta **427 errores** (433 → 427; reducción de 6). No se dispone del detalle de los 427 diagnósticos ni de pruebas de regresión completas.

### STB-01C — Vital Flow (2026-10-25)
- A partir del diagnóstico adjunto de **427 errores TypeScript**, declaradas 12 propiedades de estado diferido de Vital Flow en el inicializador principal (posición, dirección, entrada, cuerpo, temporizadores, arena y evolución).
- Se conservan sus valores iniciales efectivos como `undefined`; la lógica del juego sigue poblándolos en sus rutinas existentes. No se introduce nueva física ni se altera el movimiento.
- **Validación local comunicada:** `npm run check:types` reportó **366 errores** (427 → 366, reducción de 61). Sigue pendiente la confirmación de `npm run build` y de la regresión funcional de Vital Flow.

### STB-01D — Nexus Assault (2026-10-25)
- Se asignó al estado inicial `assaultRun` la interfaz `NexusAssaultRun` ya existente en `src/types.ts`. Esta aserción es solo de TypeScript: no añade propiedades ni altera los valores del objeto en tiempo de ejecución.
- Se extendió esa interfaz con metadatos opcionales de transición y diagnóstico de salas que ya usa el controlador.
- **Base de medición comunicada:** 366 errores antes de STB-01D.
- **Validación local comunicada:** `npm run check:types` reportó **140 errores** (366 → 140, reducción de 226). `npm run build` **aprobado**: Vite 6.4.5, 1675 módulos, 3,78 s. Advertencia no bloqueante: chunk JS de 634,43 KB (175,88 KB gzip), superior al umbral de 500 KB. **Pendiente:** pruebas de regresión de Nexus Assault y de los cuatro modos. La aserción no garantiza la inicialización en tiempo de ejecución de todas las propiedades opcionales.

### STB-01E — Estado de sesión (2026-10-25)
- Corregido el reinicio de `statsExtra` en `NexusSerpentDemo.tsx`: ahora reinicializa explícitamente `nexusGuardianReached: false`, requerido por el modelo de estadísticas y coherente con el estado inicial.
- **Última evidencia:** 140 diagnósticos TypeScript y compilación Vite de producción exitosa, antes de esta corrección.
- **Pendiente:** nuevo recuento TypeScript y pruebas de juego; no se atribuye una reducción numérica sin esa medición.

### STB-01F — Progresión del jugador (2026-10-25)
- Declaradas explícitamente siete propiedades diferidas del jugador para evolución, apariencia y radio (`pickupEvolutionEnergy`, `currentEvolutionStage`, `displayedEvolutionStage`, `internalCoreCount`, `progressionToNextStage`, `visualProfile`, `radius`).
- Sus valores iniciales efectivos continúan siendo `undefined`; las rutinas existentes siguen asignando los valores al comenzar una partida.
- **Validación local comunicada:** TypeScript pasó de **140 a 95 errores** tras STB-01E y STB-01F (−45). `npm run build` exitoso: Vite 6.4.5, 1.675 módulos, 3,43 s, JS 634,63 KB (175,90 KB gzip); persiste advertencia no bloqueante de chunk superior a 500 KB. Falta prueba de regresión jugable.

### STB-01G — Diagnóstico de 95 errores (2026-10-25)
- Analizado el diagnóstico local `nexus-stb01f.txt` con **95 errores TypeScript**.
- `NexusAssaultRun`: añadidas declaraciones opcionales para sala del subestado `run`, enemigos pendientes, fin de cuenta regresiva, comienzo de combate y retardo de aparición.
- Estado compartido: declarados los campos diferidos ya utilizados para reducción dinámica de efectos, seguimiento de FPS, tutorial, fondo de Nexus Assault, daño recibido y contadores de Supervivencia Nexus.
- Estas declaraciones comienzan en `undefined` y preservan las rutinas existentes; no equivalen a verificar su inicialización funcional.
- **Pendiente de validar:** recuento de TypeScript posterior, `npm run build` y pruebas de los cuatro modos. **95** es la última cifra medida **antes** de estos cambios.

### STB-01G — Validación local (2026-10-25)
- El usuario confirmó **18 errores TypeScript** tras actualizar `develop`: 95 → 18 (−77); reducción acumulada 450 → 18 (−432; 96 %).
- `npm run build` **aprobado**: Vite 6.4.5, 1675 módulos, 3,47 s; JS 635,04 KB (176,03 KB gzip). Permanece advertencia de chunk superior a 500 KB.
- **Pendiente:** los mensajes concretos de los 18 errores y pruebas funcionales de los cuatro modos.

### STB-01H — Intervención sobre los últimos 18 errores (2026-10-25)
- Analizado `nexus-stb01g.txt`: **18 errores TypeScript** antes de esta intervención.
- Conservadas las propiedades del estado de habilidad al activar el pulso de núcleo (`...core.ability`), evitando que se pierdan indicadores de enfriamiento y duración por reemplazo parcial.
- Añadido tamaño explícito al texto flotante de sobrecalentamiento de cola.
- Los dos faros de salas de descanso (`rest_beacon`) ahora declaran velocidad inicial `vx: 0`, `vy: 0` y `lastShotTime: 0`, coherentes con su estado estático.
- Comparaciones de tipo de sala para bonificaciones de velocidad normalizadas a `elite` y `swarm`, que son los valores declarados por `NexusAssaultRoomType`.
- **Pendiente de validar:** medición posterior, compilación y prueba de Nexus Assault; no atribuir una cifra de errores sin prueba.

### STB-01H — Validación local (2026-10-25)
- Resultado comunicado: **14 errores TypeScript** (18 → 14, reducción de 4; acumulado 450 → 14).
- `npm run build` exitoso con Vite 6.4.5: 1.675 módulos, 3,49 s; bundle JS de 635,12 KB (176,04 KB gzip), advertencia no bloqueante de tamaño.
- Pendiente: diagnóstico exacto de los 14 errores y validación funcional de los cuatro modos.

### STB-01I — Últimos 14 diagnósticos (2026-10-25)
- Analizado el informe local de **14 errores** (`nexus-stb01h.txt`).
- Extraído un constructor único `createInitialSurvivalState()` para inicializar y reinicializar Supervivencia Nexus de modo consistente, sin perder temporizadores de eventos y contadores.
- Eliminadas dos comparaciones con el guardián `TERRA` que no figura en la unión actual `GuardianId`; se mantiene la rama `TERMO`.
- Añadido `REST_BEACON` a `AssaultEnemyType`, puesto que ya se usa en las salas de descanso.
- **Pendiente de nueva medición:** quedan por revisar `NEXUS_AVATAR` y comparaciones de `vital_flow` en ramas del simulador. No se asegura aún cero errores ni regresión funcional.

### STB-01I — Validación local (2026-10-25)
- Recuento comunicado: **9 errores TypeScript** (14 → 9; reducción acumulada 450 → 9 = 98 %).
- `npm run build` exitoso: Vite 6.4.5, 1.675 módulos, 3,33 s; JS 634,30 KB (175,98 KB gzip). Advertencia no bloqueante de chunk >500 KB.
- Pendientes: diagnóstico detallado de los nueve errores, comprobación del tipado limpio y pruebas de los cuatro modos.

### STB-01J — Diagnóstico de nueve errores (2026-10-25)
- Revisado `nexus-stb01i.txt` con **9 errores**.
- Se tiparon explícitamente los dos faros de descanso `AssaultEnemy` para preservar el literal `REST_BEACON`.
- La evolución final de Vital Flow utiliza `TITAN_SERPENT`, que existe en `EvolutionName`; `NEXUS_AVATAR` no existe en esa unión. Requiere revisar la nomenclatura visual esperada.
- Eliminadas las comprobaciones de `vital_flow` del bloque `else` de simulación no-Vital Flow, que eran inalcanzables; se conservó la ruta dedicada previa del modo Vital Flow.
- **Pendiente:** ejecución local de TypeScript, Vite y pruebas funcionales. Nueve es la medición anterior, no un resultado verificado de STB-01J.

### STB-01J — Validación local (2026-10-25)
- El usuario confirmó **2 errores TypeScript** (9 → 2; 448 de 450 resueltos, ≈99,6 %).
- `npm run build` aprobado: Vite 6.4.5, 1675 módulos, 3,29 s; JS 633,27 KB (175,70 KB gzip), advertencia de chunk >500 KB no bloqueante.
- Pendientes: diagnóstico exacto de los dos errores, cierre de tipado y pruebas jugables de cuatro modos.

### STB-01K — Últimos dos diagnósticos (2026-10-25)
- Diagnosticados los dos errores `TS2353` de `NexusSerpentDemo.tsx` en los faros de descanso (líneas 10819 y 12095 del informe STB-01J).
- Añadida propiedad opcional `archetype?: string` a `AssaultEnemy`, que refleja metadatos ya existentes en los objetos. Cambio exclusivo de tipado, sin modificación del comportamiento en tiempo de ejecución.
- **Pendiente de verificación local:** ejecución de `npm run check:types` con expectativa de 0 errores y `npm run build`. No declarar cero errores antes de comprobarlo.

### STB-01K — Tipado visual de faros (2026-10-25)
- Tras la adición de `archetype`, el compilador comunicó dos errores TS2353 posteriores para `accentColor` en los faros de descanso (líneas 10826 y 12102).
- Añadidas propiedades opcionales `accentColor?: string` y `glowColor?: string` a `AssaultEnemy`, ambos metadatos existentes en los faros. Cambio de tipos sin alteración del comportamiento en ejecución.
- **Pendiente:** nueva ejecución local de `npm run check:types` antes de afirmar 0 errores.

### STB-01K — Cierre de tipado y compilación (2026-10-25)
- **Confirmación local:** `npm run check:types` completó sin diagnósticos, **0 errores TypeScript**, frente a los 450 de la recuperación inicial.
- **Build aprobado:** Vite 6.4.5, 1.675 módulos transformados, 3,42 s, JavaScript 633,27 KB (175,70 KB gzip).
- **Advertencia no bloqueante:** chunk JS minificado superior a 500 KB.
- **Alcance del cierre:** control estático y compilación; **pendientes** pruebas funcionales de Red Vital, Supervivencia Nexus, Nexus Assault y Vital Flow antes de declarar estable el juego.

### QA-01A — Gate automático y matriz funcional (2026-10-25)
- Añadido `npm run qa:gate` que ejecuta `check:types`, `build` y valida artefactos web emitidos; registra aviso de bundle principal >500 kB.
- Añadida la matriz de regresión de los cuatro modos en `docs/QA-01-FUNCTIONAL-REGRESSION.md`, con criterios de salida y evidencia requerida.
- **Pendiente:** ejecutar el gate en Windows y probar manualmente los 12 casos. El cierre STB-01K de cero errores es la última prueba aportada; estos cambios de QA todavía no se han ejecutado en el equipo del usuario.
- `main` y la etiqueta de recuperación permanecen fuera de alcance.

### QA-01B — Encuadre responsivo de los cuatro escenarios (2026-10-25)
- Inspeccionadas capturas de Red Vital, Supervivencia Nexus, Nexus Assault y Vital Flow en 127.0.0.1:5173: márgenes vacíos, cámara desplazada y arena visible con escala inconsistente.
- Introducida política de cámara por modo en el transform del canvas: **cover** del mundo para Red Vital/Supervivencia Nexus con centro limitado al mundo; **contain** de límites de arena para Nexus Assault (con margen para formas diamante/octágono) y Vital Flow.
- El canvas sigue utilizando 100 % del contenedor; no se alteran las coordenadas físicas, colisiones ni la lógica de progresión. En pantallas panorámicas, las arenas cuadradas/circulares conservan su proporción: el entorno de fondo ocupa el resto del viewport.
- **Pendiente de validación local:** `npm run qa:gate`, capturas nuevas en los cuatro modos y prueba de movimiento/cámara, salas variables y rotación a paisaje Android. No promover a `main`.

### QA-01C — Cámara y controles sincronizados (2026-10-25)
- Referencia de escritorio establecida: 1920×1080, escala de Windows 100 %, relación 16:9; la dimensión CSS real se obtiene del contenedor del juego (navegador normal/F11).
- Centralizado el encuadre en `getViewportCamera()` y la transformación puntero→mundo en `pointerToWorld()` usando el rectángulo real del canvas. El mismo zoom y centro sirven para dibujar y apuntar con mouse/táctil, incluidos Nexus Assault y Vital Flow.
- No se alteran las físicas del juego; se corrige la coherencia de coordenadas visuales y de entrada tras QA-01B.
- **Pendiente de verificar:** `npm run qa:gate` y pruebas reales en 1920×1080 (normal y F11) y Android horizontal 915×412; no se ha ejecutado el gate desde esta intervención.

### QA-01D — Ajuste inicial de geometría por modalidad (2026-10-25)
- **Vital Flow:** `VITAL_FLOW_ARENA_SCALE` pasa de 0.75 a 0.375; ancho y alto de arena a la mitad (área total 25 % de la anterior), manteniendo la función de límites utilizada por spawn, cámara y colisiones al iniciar partida.
- **Red Vital y Supervivencia Nexus:** confirmado que el mundo heredado usa `arenaSize: 2850` y comprobaciones cuadradas `size` para límites, generación y dibujo. La conversión real a rectángulo horizontal 16:9 es una siguiente intervención separada: hay que actualizar límites físicos, posiciones iniciales, distribución de objetos, radar y encuadre simultáneamente; **no se ha aplicado todavía**. Se preservan mundo grande y radar.
- Pendiente de validar `npm run qa:gate` y partida nueva de Vital Flow; cambio de arena requiere reiniciar modo para adoptar los nuevos límites.

### QA-01E — Feedback de encuadre (2026-10-25)
- Vital Flow: `VITAL_FLOW_ARENA_SCALE` incrementado de 0.375 a **0.46875** (+25 % de ancho y alto respecto de QA-01D). El área sigue siendo menor que la versión anterior a QA-01D.
- Nexus Assault: margen geométrico de encuadre ajustado de radio ×1.32 a ×1.10 para ampliar la sala en la pantalla sin cambiar colisiones ni geometría física. **Requiere revisión** de puntas de rombos/octágonos y efectos que puedan desbordar la pantalla.
- Red Vital / Supervivencia Nexus: pendiente transformar el mundo cuadrado legado 2850×2850 en mundo rectangular horizontal de verdad (distribución, límites, colisiones, minimapa y cámara), sin distorsionar geometría ni tomar el zoom del navegador como zoom del juego. No se marca como solucionado.
- **Pendiente:** `npm run qa:gate`, revisión visual 1920×1080 y pruebas de jugabilidad.

### QA-01F — Corregida compensación involuntaria del zoom del navegador (2026-10-25)
- El usuario confirmó que el encuadre seguía igual. Causa identificada en `getViewportCamera()`: para Red Vital y Supervivencia el `coverZoom` crecía cuando el navegador se alejaba a 25 %, cancelando el efecto de alejarse y forzando el recorte.
- Se conserva el zoom propio de la cámara de exploración y se centra el mundo cuando cabe completo, evitando clamps invertidos. Nexus Assault y Vital Flow mantienen sus políticas de ajuste separadas.
- **Límite explícito:** esto corrige el recorte inducido por zoom del navegador, **no** convierte todavía el mundo físico cuadrado 2850×2850 en rectángulo horizontal. La conversión 16:9 sigue pendiente y requiere coordenadas, límites, distribución y radar.
- Requiere `npm run qa:gate` y comprobación visual normal/25 % del navegador. No afirmar solución total ni promover a `main`.

### QA-01G — Conversión 16:9 del mundo de exploración (2026-10-26)
- **Red Vital y Supervivencia Nexus:** mundo de exploración de 2850×2850 a **5066,67×2850** unidades (16:9), manteniendo la sala independiente de Nexus Assault y la arena de Vital Flow.
- Cámara horizontal, punto inicial del jugador, distribución base de orbes/obstáculos, estrellas y nodos de fondo, límite físico horizontal, límites de contención y coordenadas de eventos de Supervivencia actualizados para usar `arenaWidth`.
- Esta implementación aborda la causa del borde cuadrado observada al alejar Chrome al 25 %; el zoom de navegador no sustituye al zoom propio del juego.
- **Pendiente de validar:** `npm run qa:gate`, nuevas partidas de Red Vital y Supervivencia, minimapa/radar, bordes en los cuatro extremos y visualización a 25 % en 1920×1080. No mover a `main` hasta superar QA. Puede haber subsistemas heredados aún basados en `arenaSize` que necesiten migración tras pruebas.

### Pendiente de comprobar
- Ejecución y resultado del workflow de compilación.
- Corrección de los errores TypeScript originales (450 observados en el respaldo; 441 en un experimento local que **no** forma parte de `develop`).
- Validación completa, no solo visual, de los cuatro modos.

## [v1.4.0-web-demo-candidate-recovered] — 2026-10-25

- Respaldo del código original recuperado de un ZIP fechado el 20 de septiembre de 2026.
- Conserva Red Vital, Supervivencia Nexus, Nexus Assault y Vital Flow.
- Los cuatro modos se abrieron y mostraron ejecución en un navegador local, según capturas entregadas durante la recuperación. Esto **no** equivale a una batería completa de pruebas.
- Commit original: `445c87803a00295fbcdc61cc0f23384c652fe5e5`.
- Etiqueta histórica: `v1.4.0-web-demo-candidate-recovered`.
- Estado técnico conocido del respaldo: 450 errores en `tsc --noEmit`; no se han resuelto en la versión histórica.

## Convención para próximos cambios

Cada entrada nueva debe indicar:
- **ID y fecha:** p. ej. `STB-02 | 2026-10-26`.
- **Qué cambió y por qué:** comportamiento anterior/nuevo.
- **Modos afectados:** Red Vital / Supervivencia Nexus / Nexus Assault / Vital Flow / Compartido.
- **Pruebas realizadas y resultado:** build, TypeScript, pruebas manuales, capturas cuando proceda.
- **Riesgos o regresiones conocidas** y enlace al commit o pull request.

No marcar tareas como verificadas sin evidencia de ejecución. No editar retroactivamente el histórico etiquetado.
