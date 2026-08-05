## ATLAS-S-20260805-1611-IMPL — Fase 1: puesta en marcha real (stack gratuito, sin terminal, sin Claude Code)

**Fecha:** 2026-08-05
**Tipo de sesión:** Implementación real (no revisión). Primera vez que ATLAS queda desplegado y visible.
**Continúa de:** ATLAS-S-20260804-2154-INFR

### Contexto operativo (importante para la siguiente sesión)
El usuario trabaja **desde una tablet Samsung Galaxy Tab S10+, sin computadora, sin terminal, sin Claude Code**.
Todo el flujo de trabajo real de este proyecto es:
1. Claude (este chat) genera archivos y los entrega como `.zip` para descargar.
2. El usuario los sube a GitHub vía el navegador, usando **"Add file → Upload files"** en github.com (no GitHub Desktop, no `git` por línea de comandos).
3. Los scripts `.sql` se pegan y corren manualmente en el **SQL Editor de Neon** (tampoco hay conexión automática entre GitHub y Neon — cada script se copia a mano).
4. Vercel redespliega automáticamente al detectar push a `main`.
5. El usuario verifica el resultado abriendo la URL de Vercel en la tablet.

**Esta es la modalidad de trabajo real del proyecto y debe asumirse por defecto en sesiones futuras**, salvo que el usuario indique que ya tiene acceso a una computadora.

### Desviación documentada respecto a `ATLAS-infra-review.md` (ATLAS-S-20260804-2154-INFR)
La revisión de infraestructura anterior recomendaba **Postgres local en Docker, sin proveedor cloud, para toda la Fase 1**, y posponer el hosting gestionado hasta el primer despliegue.

Se desvía de esa recomendación **intencionalmente y por una razón de producto explícita**: el usuario necesita ver el progreso en su celular/tablet desde el día uno, y no tiene computadora para correr Docker. Por tanto, Fase 1 se implementó directamente con:
- **Neon** (Postgres 16+ gestionado, plan gratuito) en vez de Docker local.
- **Vercel** (plan gratuito) para desplegar la app Next.js con cada push.
- **GitHub** (subida manual vía navegador, sin git CLI) como control de versiones.

Esto no cambia ninguna decisión de `atlas-arquitectura-v3.md` (sigue siendo Postgres+PostGIS, mismo modelo `nodes`/`edges`/`claims`). Solo cambia *quién aloja* la base, tal como esa misma revisión ya anticipaba como aceptable ("Supabase-solo-como-DB, Neon, RDS... cualquiera de ellos parte del mismo `pg_dump`").

### Qué se construyó
- **Repo `atlas`** en GitHub con:
  - `package.json`, `next.config.mjs`, `.gitignore`, `.env.example`
  - `lib/db.js` — conexión a Postgres vía `pg`, pool reutilizable
  - `app/layout.jsx`, `app/page.jsx` — página única que muestra: estado de conexión a la BD, cada nodo cargado, sus claims (con color según `claim_status`), y sus relaciones entrantes/salientes
  - `db/001_init.sql` — DDL completo de las 7 tablas de `atlas-arquitectura-v3.md` §4, con columnas de versionado SCD2 e índices parciales `is_current = true`
  - `db/002_julio_cesar.sql` — primer contenido real: nodo Julio César con dos claims de `birth_date` en disputa (`historical_consensus` vs `minority_view`, ejemplo literal de v3 §5.2), claim de `father` como `node_reference` (v3 §5.1), fuentes y traducciones
  - `db/003_asesinato_cesar.sql` — expansión en red (no solo fecha suelta, cumpliendo atlas.md §33): nodos Roma, Senado Romano, Bruto, Casio, evento "Asesinato de Julio César", conectados con edges causales, políticos y geográficos
- **Proyecto Neon** `atlas` (Postgres 18, región AWS US East 2) con las 7 tablas creadas y corriendo.
- **Proyecto Vercel** desplegado en `atlas-six-vert.vercel.app`, con `DATABASE_URL` apuntando a Neon.

### Estado verificado
- La app carga en el celular del usuario y muestra 7 nodos con sus claims y relaciones correctamente, incluyendo la coexistencia de dos interpretaciones contradictorias de una misma fecha (comportamiento central del modelo de v3, confirmado funcionando en producción real).

### Pendientes para la siguiente sesión
- Cargar más contenido histórico (en curso — ver lote siguiente en este mismo DevLog o en el próximo commit).
- Corregir sistemáticamente traducciones faltantes en nodos nuevos (se detectó y arregló un caso puntual: `gayo-julio-cesar-padre`).
- Decidir ORM/cliente de datos (sigue pendiente desde la revisión de infraestructura — por ahora se usa `pg` crudo directamente en `lib/db.js`, funcional pero sin capa de validación de `value_type`/JSON Schema todavía).
- Construir página de detalle por nodo (actualmente todo vive en una sola página `/`).
- Validación de ingesta (JSON Schemas por `value_type`, v3 §5.1) — no implementada todavía; los INSERTs actuales son manuales y no pasan por ningún pipeline de validación.
- Cuando el usuario tenga acceso a una computadora, evaluar migrar el flujo de subida manual a GitHub Desktop o Claude Code para reducir fricción.
