## ATLAS-S-20260806-2230-FIX — Recuperación tras trabajo de otra sesión de IA

**Fecha:** 2026-08-06
**Tipo de sesión:** Diagnóstico y arreglo (no planeado — reactivo a un incidente).
**Continúa de:** ATLAS-S-20260805-1611-IMPL, y de trabajo hecho por **otra sesión de IA** (no
registrado en este DevLog en su momento — ver "Lección aprendida" abajo) que agregó
`app/nodo/[slug]/` y `lib/atlas-data.js`, y corrió `db/005_fix_precision.sql`.

### Qué pasó
Entre esta sesión y la anterior, el usuario usó **otra sesión de IA** (posiblemente con
acceso directo a archivos/terminal) para:
- Crear `lib/atlas-data.js` — una capa de datos más limpia que la original (`getNodeBySlug`,
  `listAllNodes`, `searchNodes`, `formatValue`, `certaintyLabel` con los emojis de `atlas.md` §6).
- Crear `app/nodo/[slug]/page.jsx` — página de detalle por nodo, con claims agrupados por
  campo y enlaces entre nodos conectados.
- Correr `db/005_fix_precision.sql` — agrega `year_only` como precisión válida en
  `time_spans` y corrige (vía versionado real, v3 §13) el `birth_date` de Cleopatra VII,
  que antes forzaba un día artificial inexistente.

Esa sesión **no dejó handoff ni entrada de DevLog**, y además el proceso de subir archivos
manualmente vía GitHub web dejó la app rota:
- `app/page.jsx` nunca se subió con ese nombre exacto — quedó como `app/app-page.jsx`
  (Next.js solo reconoce el nombre literal `page.jsx`; cualquier otro nombre es invisible
  para el enrutador). Resultado: 404 en la ruta raíz `/`.
- Quedaron dos archivos sueltos de más dentro de `app/nodo/[slug]/`: otro `app-page.jsx`
  y un `layout.jsx` duplicado (los layouts anidados no deben repetirse así).

### Diagnóstico y arreglo (esta sesión)
1. Se identificó el archivo faltante comparando la estructura real del repo (capturas del
   usuario) contra lo esperado por Next.js App Router.
2. Se escribió un `app/page.jsx` nuevo que **reutiliza `lib/atlas-data.js`** (no la versión
   anterior con queries inline) — lista todos los nodos, agrega buscador por nombre
   (`atlas.md` §39, pieza pendiente del MVP), y enlaza a `/nodo/[slug]`.
3. Se guio al usuario para renombrar `app-page.jsx` → `page.jsx` y borrar los dos archivos
   sobrantes, todo desde el editor web de GitHub (sin terminal).
4. Confirmado funcionando por el usuario.

### Estado real de la app al cierre de esta sesión
```
app/
├── page.jsx              -- lista + buscador, usa lib/atlas-data.js
├── layout.jsx
└── nodo/[slug]/
    └── page.jsx            -- ficha de detalle por nodo
lib/
├── db.js
└── atlas-data.js           -- capa de datos: getNodeBySlug, listAllNodes, searchNodes,
                                formatValue, statusColor, certaintyLabel
db/
├── 001_init.sql
├── 002_julio_cesar.sql
├── 003_asesinato_cesar.sql
├── 004_segundo_triunvirato.sql   (mismo contenido que 004_triunvirato_augusto.sql)
└── 005_fix_precision.sql          -- agrega precision 'year_only', corrige Cleopatra VII
```
Base de datos en Neon con las 5 migraciones corridas. App desplegada en Vercel
(dominio activo en GitHub → Settings → ver "About": `atlas-menerod.vercel.app`;
la URL `atlas-six-vert.vercel.app` es un alias del mismo proyecto, ambas deberían
apuntar al mismo deployment actual).

### Lección aprendida — regla nueva para todas las sesiones futuras
**Toda sesión de IA que modifique el repo de ATLAS, sin excepción, debe:**
1. Generar un Session ID (`ATLAS-S-YYYYMMDD-HHMM-XXXX`) al empezar.
2. Dejar una entrada en `docs/ATLAS-DEVLOG.md` y un handoff en `docs/handoffs/` al terminar,
   igual que se ha hecho en las demás sesiones — **sin excepción, incluso si la sesión fue
   corta o se hizo con otra herramienta (Claude Code, ChatGPT, etc.)**.
3. Si el usuario trae trabajo hecho por otra sesión sin documentar, la sesión actual debe
   reconstruir el registro faltante (como se hizo aquí) antes de seguir agregando cosas nuevas.

Esto no es una decisión de arquitectura — es un recordatorio de proceso, pero se registra
aquí porque su incumplimiento causó una app rota sin que nadie supiera por qué.

### Pendientes (sin cambios respecto al handoff anterior, salvo lo resuelto arriba)
- ORM/cliente de datos: sigue usándose `pg` crudo (ahora bien encapsulado en `lib/atlas-data.js`).
- JSON Schemas de validación por `value_type` (v3 §5.1): no implementados.
- Más contenido histórico: pendiente, a decidir con el usuario en la próxima tanda.
