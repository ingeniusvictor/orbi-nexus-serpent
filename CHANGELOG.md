# Historial de cambios — ORBI Nexus Serpent

Todas las modificaciones relevantes del juego se documentan aquí. Seguimos el principio de conservar lo jugable y describir el cambio, su motivo, la evidencia de prueba y los riesgos pendientes.

Formato: fecha ISO, identificador, tipo (Añadido / Modificado / Corregido / Rendimiento / Seguridad), modos afectados, validación y enlaces a issue/commit.

## [Sin publicar] — rama develop

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
- **Estado:** cambio publicado, sin nueva ejecución local de TypeScript o prueba funcional. Última medición acreditada: **140 errores**, previa a STB-01E y STB-01F.

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
