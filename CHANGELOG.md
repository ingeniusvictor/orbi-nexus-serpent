# Historial de cambios — ORBI Nexus Serpent

Todas las modificaciones relevantes del juego se documentan aquí. Seguimos el principio de conservar lo jugable y describir el cambio, su motivo, la evidencia de prueba y los riesgos pendientes.

Formato: fecha ISO, identificador, tipo (Añadido / Modificado / Corregido / Rendimiento / Seguridad), modos afectados, validación y enlaces a issue/commit.

## [Sin publicar] — rama develop

### Añadido
- **STB-01 (2026-10-25):** rama `develop` para trabajo de estabilización independiente de `main`.
- **STB-01 (2026-10-25):** comando `npm run dev:local` para iniciar Vite en `127.0.0.1:5173`.
- **STB-01 (2026-10-25):** comando `npm run check:types`, auditoría de TypeScript no bloqueante en CI y compilación automática en GitHub Actions.
- **STB-01 (2026-10-25):** documentación de líneas de trabajo y criterios de calidad en `docs/STB-01-STABILIZATION.md`.

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
