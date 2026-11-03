# ORBI ECONOMY — Prismas ORBI (OPR) · Especificación fundacional v0.1

**Fecha:** 2026-11-03  
**Estado:** definición de moneda y primera reconexión gratuita implementadas en `develop`. **No existe compra, billetera productiva, crédito real ni sincronización entre juegos todavía.**  
**Marca provisional:** Prismas ORBI, código OPR, icono ◇. Revisar disponibilidad de marca y conflictos antes del lanzamiento comercial.

## 1. Concepto

Prismas ORBI (OPR) será la **unidad virtual de conveniencia** del universo ORBI Ecosystem. No es criptomoneda, activo financiero, NFT ni moneda convertible a efectivo; los jugadores no pueden transferirla fuera del sistema ni reclamar su valor en dinero.

El nombre, código y representación están centralizados en `src/economy/orbiEconomy.ts`; se pueden extraer en un futuro paquete compartido `@orbi/economy` sin ligar la definición a Nexus Serpent.

### Juegos del catálogo inicial
- ORBI Nexus Serpent
- ORBI Energy Swarm
- ORBI Grid Ascent
- ORBI Energy Slash
- ORBI Dash

El catálogo de `OrbiEconomyGameId` es inicial y ampliable. **Importar una definición común no significa que los saldos se sincronicen por sí solos**: cada sitio web tiene un origen diferente y `localStorage` no equivale a un backend central.

## 2. Primera integración: Nexus Assault

- Si el Guardián pierde HP, aparece opción **REVIVIR GRATIS** una única vez por partida.
- La reconexión conserva sala, progreso, núcleos, mejoras, estado del jefe y enemigos existentes.
- Recupera **60 % de HP** y activa un escudo por **3 segundos** de tiempo jugable; proyectiles hostiles en vuelo se limpian al confirmar.
- La reconexión es opcional: reiniciar o seleccionar otro Guardián sigue disponible.
- La segunda reconexión muestra **30 OPR · PRÓXIMAMENTE**, con botón deshabilitado. El precio es *hipótesis de balance*, no una oferta comercial.
- El contador `reviveCount` se restablece al comenzar **una nueva partida**, nunca al transicionar entre salas.
- No se fabrican monedas en el cliente y no se simula un saldo comprado.
- Para facilitar las pruebas del «Cerco de Resonancia», Assault otorga un **Filamento ORBI (+1 de longitud objetivo)** cada cinco enemigos normales/élite derrotados. La bonificación no usa la futura moneda premium.

## 3. Principios económicos

1. **Jugar gratis debe seguir siendo viable.** La reconexión gratis se mantiene; no bloquear progresión de historia ni GAIA detrás de un pago.
2. Los Prismas futuros deben ofrecer comodidad, personalización y segundas oportunidades limitadas. Evitar ventajas permanentes que conviertan rankings en pagos por victoria.
3. No vender consumibles al usuario sin avisar claramente el coste final y la posibilidad de perderlos al utilizarlos. Diseñar confirmación expresa para gastos.
4. Compras con fondos reales **desactivadas por defecto**. Ningún interruptor de UI puede activarlas sin integrar previamente autenticación, facturación y ledger.
5. No mezclar ganancias ficticias/de prueba con dinero pagado; probar siempre en entorno sandbox de tiendas con recibos de prueba y una base de datos aislada.
6. No crear un sistema de cajas de recompensas pagas ni mecánicas compulsivas al principio.

## 4. Arquitectura de billetera compartida — FUTURA, NO IMPLEMENTADA

**Identidad:** cuenta ORBI con autenticación y consentimiento, vinculada a los juegos mediante `walletId` y `userId`.

**Backend autoritativo:** ledger append-only por transacciones (premios, compra verificada, gastos, ajustes, reembolsos), claves únicas/idempotentes y bloqueos transaccionales. El cliente consulta el saldo pero nunca puede editarlo, acuñar OPR ni verificar sus propios comprobantes de pago.

**Flujo comercial futuro:**
1. El usuario solicita un paquete OPR desde una plataforma compatible.
2. Se inicia la compra usando el mecanismo permitido por esa tienda (Google Play Billing o Apple IAP donde corresponda).
3. El backend verifica el recibo con la plataforma y registra de forma atómica una sola concesión.
4. La cuenta ORBI recibe el saldo; los juegos consultan el mismo backend autenticado.
5. Al pagar una reconexión, el backend valida saldo y precio, descuenta los OPR de forma atómica, registra la transacción y devuelve un **comprobante de autorización de una sola utilización**.
6. Si hay cancelación, error o reembolso, se concilia la transacción sin otorgar beneficios duplicados.

**Esquema de datos previsto:**
- `wallets`: user_id, wallet_id, currency_code, balance_snapshot, version.
- `ledger_entries`: id, wallet_id, game_id, type, delta, source_id, created_at.
- `store_receipts`: receipt_id, provider, product_id, receipt_hash, verified_at, status.
- `spend_authorizations`: idempotency_key, wallet_id, action, game_run_id, quoted_price, consumed_at.
- `catalog_items`: immutable_id, game_id, type, price_prismas, enabled, version, locale.

**Seguridad:** acceso autenticado, políticas RLS, verificación de propiedad de wallet, protección anti-replay, historial auditable, límites de gasto y ajustes reembolsables; sin secretos de tienda ni claves privadas en frontend. La cartera central no debe depender de que todos los juegos tengan el mismo dominio.

### Reglas de plataforma a comprobar antes del lanzamiento

- Google Play: las monedas virtuales, vidas extra y bienes digitales suelen requerir Google Play Billing en apps distribuidas por Google Play, salvo excepciones expresas aplicables. Referencia: https://support.google.com/googleplay/android-developer/answer/9858738?hl=es
- Apple: el acceso a moneda virtual y bienes digitales en apps distribuidas por App Store está sujeto a IAP según 3.1.1; la moneda adquirida por IAP no puede vencer. Referencia: https://developer.apple.com/app-store/review/guidelines/es/
- Verificar también tratamiento de menores, impuestos y términos de uso para Chile y demás mercados antes de habilitar pagos.

## 5. Parámetros iniciales (NO son precios definitivos)

| Concepto | Estado | Valor |
|---|---|---|
| Moneda | Reservada en código | OPR / Prismas ORBI |
| Primera reconexión de Assault | ACTIVA, gratis | 0 OPR |
| Reconexión premium posterior | UI deshabilitada | 30 OPR, solo referencia |
| Recuperación de HP | ACTIVA | 60 % |
| Escudo de resurrección | ACTIVO | 3 segundos |
| Compra de OPR con dinero | INACTIVA | Sin catálogo de productos ni montos reales |
| Saldo compartido ORBI | NO IMPLEMENTADO | Requiere cuenta y backend |
| Filamento de crecimiento Assault | ACTIVO | +1 longitud cada 5 enemigos normales/élite |
| Gastos en otros juegos ORBI | NO IMPLEMENTADO | Importar catálogo solo tras autenticación |

## 6. QA y prohibiciones

- `npm run qa:assault-revive`: reglas de muerte/revivir, salud, escudo, moneda y compras apagadas.
- `npm run qa:assault-revive-scope`: asegurarse de que el handler no reinicie la sala, no borre núcleos, quite únicamente proyectiles enemigos, proteja `hurtAssaultPlayer` y no cobre.
- `npm run qa:gate`: pruebas previas AS-R1B, panorama 16:9, TypeScript y build Vite.
- Prueba manual en Chrome: muerte sala 1, botón gratis, salud 60 %, escudo 3s, núcleos preservados, muerte posterior sin gratis, reiniciar partida recupera gratis, supervivencia/Red Vital/Vital Flow no afectados, game-over visible con scrolling.
- Prohibido cobrar, generar saldos pagados desde `localStorage`, habilitar IAP sin verificación de recibos o anunciar conversión a efectivo.

## 7. Próximas fases sugeridas

- **ECO-02:** branding final, revisión de nombre y activo visual ORBI Signature para Prisma.
- **ECO-03:** identidad/autenticación, backend central y ledger virtual SIN pagos reales, sólo con créditos de pruebas aislados.
- **ECO-04:** catálogo de juegos, permisos, precios, servicios de gasto con confirmación, conciliación.
- **ECO-05:** sandbox de las tiendas, verificación de recibos, cumplimiento de plataformas y términos.
- **ECO-06:** estreno controlado de compras reales sólo tras QA de seguridad, refund y reconciliación.

**No fusionar `main` antes de validación visual del usuario.**
