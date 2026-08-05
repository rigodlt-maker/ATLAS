# Handoff — ATLAS-S-20260805-1611-IMPL

**Guarda esto como:** `docs/handoffs/ATLAS-S-20260805-1611-IMPL-handoff.md`

## Cómo trabaja el usuario (léelo primero, siempre)
- Tablet Samsung Galaxy Tab S10+. **Sin computadora, sin terminal, sin Claude Code, sin git CLI.**
- Flujo real: Claude genera archivos → usuario descarga `.zip` → los sube a GitHub por el navegador
  ("Add file → Upload files") → scripts `.sql` se copian y pegan a mano en el SQL Editor de Neon →
  Vercel redespliega solo al detectar push → usuario revisa en la URL de Vercel desde la tablet.
- No asumas GitHub Desktop, Docker local, ni ningún paso de terminal a menos que el usuario diga
  que ya tiene computadora.

## Credenciales / recursos activos (no secretos, solo ubicaciones)
- **Repo GitHub:** `atlas` (rama `main`)
- **Neon:** proyecto `atlas`, base `neondb`, Postgres 18, región AWS US East 2 (Ohio)
- **Vercel:** proyecto desplegado en `atlas-six-vert.vercel.app`, variable de entorno `DATABASE_URL` configurada apuntando a Neon

## Estado real de la base de datos al cierre de esta sesión
Tablas creadas (`db/001_init.sql` ya corrido): `nodes`, `edges`, `claims`, `claim_sources`, `time_spans`, `sources`, `translations`.

Contenido cargado hasta ahora:
- `db/002_julio_cesar.sql` — Julio César + su padre, birth_date en disputa, claim de paternidad.
- `db/003_asesinato_cesar.sql` — Roma, Senado Romano, Bruto, Casio, evento del asesinato, con edges.
- (Puede haber un lote adicional cargado en esta misma sesión después de este handoff — revisa el
  DevLog completo o pregunta al usuario qué fue lo último que corrió en Neon antes de asumir el estado.)

## Decisión de infraestructura vigente (ver detalle en DevLog ATLAS-S-20260805-1611-IMPL)
Se usa **Neon + Vercel desde el día uno**, no Docker local, por decisión explícita de producto
(el usuario necesita ver progreso en su tablet). Esto es una desviación intencional y documentada
de la recomendación original de `ATLAS-infra-review.md` — no la reviertas sin que el usuario lo pida.

## Cómo continuar en la siguiente sesión
1. Pide o revisa el DevLog completo (`docs/ATLAS-DEVLOG.md`) para saber exactamente qué lotes de
   contenido ya se cargaron — la fuente de verdad del contenido son los archivos `db/00N_*.sql`
   que ya existen en el repo, en orden numérico.
2. Sigue el mismo patrón para nuevo contenido: un archivo `db/00N_descripcion.sql` con nodos,
   time_spans, claims, claim_sources, translations y edges — consistente con `atlas-arquitectura-v3.md`.
3. `app/page.jsx` ya es genérico: muestra cualquier nodo, sus claims y sus relaciones automáticamente.
   **No hace falta tocar `page.jsx` de nuevo solo por agregar contenido** — solo cuando se quiera
   cambiar cómo se ve (buscador, páginas de detalle, etc.).
4. Recuerda siempre: cada script SQL nuevo se entrega para copiar/pegar en el SQL Editor de Neon;
   cada cambio de código (`.jsx`, `.js`) se entrega para subir a GitHub vía "Upload files".

## Pendientes abiertos (heredados, sin resolver)
- ORM/cliente de datos: sigue usándose `pg` crudo.
- JSON Schemas de validación por `value_type` (v3 §5.1): no implementados.
- Página de detalle por nodo: no existe, todo vive en `/`.
- Buscador: no existe.
