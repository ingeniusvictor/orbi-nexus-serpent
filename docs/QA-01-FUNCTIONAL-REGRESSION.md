# QA-01 — Regresión funcional de ORBI Nexus Serpent

**Rama:** develop. **Baseline:** STB-01K con 0 errores TypeScript y build Vite aprobado en Windows (2026-10-25). **Estado:** QA manual pendiente; no promover a main.

## Comprobación automática
Desde la carpeta del repositorio:

```powershell
git pull --ff-only origin develop
npm run qa:gate
npm run dev:local
```

`qa:gate` bloquea si falla TypeScript, Vite o los artefactos web principales. La advertencia de tamaño JS se registra, pero **no** bloquea. El gate automático no simula teclado, físicas ni partidas, por lo que no sustituye las pruebas de navegador.

## Registro manual (Chrome/Edge, consola abierta con F12)

Para cada modo: iniciar desde el menú, mover al personaje, detener y reanudar, reiniciar partida, volver al menú y entrar de nuevo. Registrar `PASS / FAIL / NO PROBADO` y copiar el primer error de consola si aparece.

| ID | Modo | Caso verificable | Estado |
|---|---|---|---|
| QA-MENU-01 | Menú | Los cuatro modos pueden seleccionarse y comenzar sin pantalla en negro | NO PROBADO |
| QA-RV-01 | Red Vital | Movimiento responde; los orbes se recogen y cambian energía/puntuación | NO PROBADO |
| QA-RV-02 | Red Vital | Evolución, habilidad y reinicio conservan HUD y controles | NO PROBADO |
| QA-SN-01 | Supervivencia Nexus | Aparecen enemigos y amenazas; daño/escudo/vidas responden | NO PROBADO |
| QA-SN-02 | Supervivencia Nexus | Eventos Blackout, pausa, recuperación y reinicio | NO PROBADO |
| QA-NA-01 | Nexus Assault | Cuenta regresiva, inicio de combate y daño a enemigos | NO PROBADO |
| QA-NA-02 | Nexus Assault | Al limpiar una sala aparece la mejora y avanza a siguiente sala | NO PROBADO |
| QA-NA-03 | Nexus Assault | Sala de descanso muestra su faro sin crash; sala jefe se inicia | NO PROBADO |
| QA-VF-01 | Vital Flow | Dirección, desplazamiento, recolección, crecimiento y colisiones | NO PROBADO |
| QA-VF-02 | Vital Flow | Evolución final se visualiza correctamente; reinicio y pausa | NO PROBADO |
| QA-GEN-01 | General | Consola sin errores no controlados en cuatro modos | NO PROBADO |
| QA-GEN-02 | General | Pantalla adaptable y audio (activado/silenciado) | NO PROBADO |

### Evidencia de ejecución
- Fecha / navegador / resolución:
- Commit de develop (`git rev-parse --short HEAD`):
- `npm run qa:gate`: PASS / FAIL
- Casos PASS / FAIL / NO PROBADO:
- Error de consola / captura:
- Regresión respecto a versión recuperada:
- Decisión de integración a main: **NO** hasta revisión.

## Criterios de salida
1. `npm run qa:gate` aprobado en el commit evaluado.
2. Cada caso de la matriz en PASS o excepción justificada con issue.
3. Sin pérdida de controles, habilidades, progreso o transiciones.
4. Sin errores inesperados en consola.
5. Aprobación explícita de integración. Mantener main y tag históricos intactos hasta entonces.
