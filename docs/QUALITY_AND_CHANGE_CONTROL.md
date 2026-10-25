# Protocolo de calidad y continuidad

## Ramas
- `main`: versión pública/histórica estable; no aplicar trabajos experimentales.
- `develop`: integración de mejoras pendientes de validación.
- Ramas `fix/<issue>-tema` o `feat/<issue>-tema` para cambios sustanciales.

## Para cada mejora
1. Abrir o actualizar issue con objetivo, alcance, riesgo y criterios de aceptación.
2. Conservar comportamiento y estética existentes salvo cambio solicitado.
3. Hacer commits acotados que mencionen el issue.
4. Actualizar `CHANGELOG.md` bajo «Sin publicar».
5. Registrar el resultado real de `npm run build` y `npm run check:types`.
6. Comprobar manualmente los cuatro modos cuando se toque lógica compartida; de lo contrario, el modo afectado y una prueba rápida del menú.
7. Solo fusionar a `main` tras revisión, pruebas y decisión explícita de lanzamiento.
8. En una versión publicada, crear etiqueta de versión y mover las entradas verificadas de «Sin publicar» a la nueva sección.

## Matriz mínima de regresión
| Área | Evidencia exigida |
|---|---|
| Menú y selección | Los cuatro modos se seleccionan sin errores |
| Red Vital | Controles, pickups, evolución y reinicio |
| Supervivencia Nexus | Enemigos, daño, Blackout, pausa y reinicio |
| Nexus Assault | Combate, progresión de salas, mejoras y HUD |
| Vital Flow | Movimiento, longitud, pickups, colisiones y reinicio |
| General | Pantalla adaptable, audio, consola del navegador y build |

## Registro de pruebas
En cada PR o issue copiar:
- **Versión/commit:**
- **Fecha, entorno y navegador:**
- **Modos probados:**
- **Resultado del build:**
- **Resultado del chequeo TypeScript:**
- **Resultados manuales y capturas:**
- **Regresiones detectadas:**
- **Aprobación para integrar:** sí/no

La existencia de un workflow no demuestra su aprobación. Registrar los resultados observados, no los previstos.
