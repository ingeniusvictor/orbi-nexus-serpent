# NEXUS ASSAULT — Ruta de implementación por fases SSSnaker → ORBI (actualizada 2026-11-05)

## Alcance y método
Inspiración **exclusivamente en principios mecánicos**, sin copiar recursos, niveles, texto, sonidos, código, balance ni monetización de SSSnaker. Mantener autoría ORBI (Red Vital, Blackout, nueve Guardianes, Filamentos, Tail Strike, GAIA), mundo 16:9, controles, revival gratuito y separación absoluta de Demo/Infinite/Survival/Vital Flow.

La base de desarrollo es `develop`; todas las funcionalidades nuevas están **solo en PRs en borrador** hasta QA. Nunca fusionar a `main` sin prueba manual. No usar pagos con dinero real.

## Estado comprobable
- AS-R0 auditoría: realizada.
- AS-R1A geometría: realizada y probada.
- AS-R1B detector y trazado del cerco: realizado.
- ASSAULT-RV-01 revival gratis: confirmado manualmente; 60% HP / 3 s.
- ASSAULT-RV-02: nueve energías + nueve Guardianes, cartas + crecimiento, ocho núcleos físicos y sellos GAIA (PR #2).
- ASSAULT-RV-03: prioridad sello GAIA 9/9, límites de efectos (PR #3); jugador reportó congelación en sala 25 ANTES de este ajuste, aún no revalidado.
- **ASSAULT-RV-04 / AS-R2, en PR #4:** selector compacto, apuntado desde nodo, daño limitado del Cerco por evento, cronómetro de combate, recompensa rara única tras jefe y partículas adaptativas. Pruebas automáticas ≠ QA manual.
- **ASSAULT-RV-05 / AS-R3 parcial, en PR #5:** categoría legendaria separada de épica, probabilidad independiente, arte de carta y bonificación real; quedan pendientes catálogo de mutaciones, fusiones y convergencia. PR #5 contiene acumulativamente los cambios anteriores.
- **ASSAULT-RV-06 / GAIA parcial, PR #6:** tras 9/9 sellos, derrotar jefe habilita una sola Convergencia GAIA temporal (14 s) en sala posterior con bonos de daño; falta transformación artística definitiva y un desafío jefe específico.
- **ASSAULT-RV-07 / AS-R5 parcial, PR #7:** director determinista habilita habitaciones élite y antesalas de jefe; faltan IA de nuevos arquetipos, obstáculos y director dinámico completo. PR #7 incluye acumulativamente los cambios anteriores.

## Próximos gates (orden obligatorio)
### AS-R2 QA de combate / rendimiento (inmediato)
1. Validar en navegador en 1637×894: cabecera, nueve botones, dossier, arte y CTA íntegros sin scroll habitual; zoom 100%, móvil vertical y landscape.
2. Control de disparo: FOTON/HYDRO/QUANTUM desde nodos separados, blancos independientes, rango y proyectiles sin desincronización de segmentos.
3. Cerco: cruzar trazado real, área mínima, cooldown, blancos dentro/fuera, jefe (tope), faro de descanso (sin daño), efecto único por cierre; comparar con Tail Strike.
4. Sala 25+, ocho núcleos, 9/9 sello, 60 FPS objetivo escritorio / 30 FPS mínimo móvil; registrar FPS 1% low, cantidad de enemigos, proyectiles, partículas y errores consola.
5. Reparar diagnósticos TypeScript no bloqueantes; no aceptar `qa:gate` como aprobado si falla.
6. Evitar desbordamiento tras repetidas transiciones, reinicios y renacimiento gratuito.

### AS-R3 progresión roguelite y rarezas (pendiente)
- Separar rarezas comunes, raras, épicas y legendarias con efectos reales y catálogo validado; no convertir legendaria en sinónimo de épica.
- Garantía de jefe consumida exactamente una vez, tres cartas diversas, elecciones sin duplicados e imposibles excluidos; pruebas basadas en semillas.
- Cartas E1–E6: niveles de núcleo, mutaciones de nueve elementos, sobrecarga, fusión seleccionada y convergencia; prerequisitos y límites.
- Filamento de crecimiento y ranuras físicas desacoplados; E1–E8 por progreso acumulativo, no gasto de energía.

### AS-R4 convergencias y GAIA (pendiente)
- Sellos 9/9 deben desbloquear **desafío de sincronización** tras logro explícito; no solo contador.
- Crear transformación GAIA propia, temporal y balanceada, con visual original, su propia duración, cooldown, UI y prueba de jefes.
- Fusión de pares de energías con recetas originales y efectos observables, sin RNG de pago.
- Conservar ocho núcleos montados, los nueve sellos y separación entre misión GAIA y precios Prismas ORBI.

### AS-R5 director de escenarios y enemigos (pendiente)
- Activar salas élite y pre-jefe con frecuencia determinista; mantener jefes múltiples de cinco, santuario y progresión 30 salas.
- Introducir obstáculos exclusivos ORBI, telegráficos y destructibles, nunca paredes invisibles.
- Leaper, Charger, Splitter con límite de descendientes, Artillery con huecos, anti-camp no punitivo.
- Mantener navegación 16:9 y radar, objetivo y salida del combate siempre alcanzables.

### AS-R6 jefes, meta y release (pendiente)
- Patrones avanzados 70% / 30% solo después de pruebas de dos fases, límites de densidad, señales visuales.
- Pruebas de regresión Red Vital / Survival / Vital Flow, accesibilidad teclado/táctil, recuperación de guardado y Game Over.
- Metaprogresión cosmética por logros ganados jugando; **sin compras activas**.
- QA visual y 30 salas completas, informe de FPS y aprobación final antes de abrir PR a `main`.

## Reglas de desarrollo
- Dividir componentes nuevos en `src/gameplay/assault`, con funciones puras y tests en `src/gameplay/assault/*.test.ts`.
- No añadir otro bucle de animación ni reescribir toda la serpiente. Los sistemas se integran en el tick existente.
- Cada release exige build y tests, más prueba manual de los flujos que una CI no puede certificar.
- Mantener PRs en borrador mientras existan bloqueos. No mezclar la economía Prismas con el combate.
