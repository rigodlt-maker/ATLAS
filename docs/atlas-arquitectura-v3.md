STATUS: ARCHITECTURE APPROVED
VERSION: 3
PHASE: 0 COMPLETE

# ATLAS — Documento de Arquitectura (v3, definitiva)

Este documento reemplaza a `atlas-arquitectura-v2.md` como referencia vigente. Incorpora cuatro precisiones sobre el modelo de conocimiento que v2 dejaba abiertas. No cambia el stack ni introduce funcionalidad nueva fuera de esas cuatro precisiones. No se ha escrito código de Fase 1 todavía.

---

## 1. Arquitectura revisada — visión general

El stack se mantiene (PostgreSQL+PostGIS, Next.js, GraphQL), igual que la decisión relacional-sobre-grafo-dedicado. El modelo de cuatro capas de v2 se mantiene intacto:

```
CAPA 1 — ENTIDADES        nodes (persona, lugar, civilización, proceso, tradición...)
CAPA 2 — AFIRMACIONES     claims (cada dato concreto sobre una entidad, con su propia certeza y fuentes)
CAPA 3 — RELACIONES       edges (conectan entidades; también portan claims cuando son datables/inciertas)
CAPA 4 — TRADUCCIONES     translations (capa de presentación multilingüe, no duplica el histórico)
```

Lo que añade v3 no es una capa nueva, sino tres precisiones **dentro** de la capa de claims (tipado de valor, estado de consenso, versionado) y una confirmación explícita de una regla que v2 ya cumplía pero no dejaba escrita como regla dura (independencia idioma/dato).

---

## 2. Qué cambia respecto a v2

| Área | v2 | v3 | Por qué |
|---|---|---|---|
| `claims.value` | JSONB sin tipo declarado | JSONB + `value_type` obligatorio, con forma validable por tipo (sección 5.1) | Un JSONB sin tipo se vuelve un cajón de sastre a las pocas docenas de claims; con `value_type` cada valor es autodescriptivo y validable por JSON Schema |
| Desacuerdo histórico | Certeza por claim, pero sin forma de marcar cuál es la interpretación dominante cuando hay varias | `claim_status` por claim (sección 5.2) | Certeza mide "qué tan bien fundada está esta afirmación en sí misma"; consenso mide "qué lugar ocupa frente a las demás afirmaciones sobre el mismo campo" — son ejes distintos y v2 los mezclaba implícitamente |
| Idioma vs. dato | Ya separado en la práctica (`translations`), pero sin regla escrita para claims de tipo texto (epítetos, títulos) | Regla explícita: el dato en `claims.value` es siempre canónico e independiente del idioma; su presentación traducida vive en `translations` incluso cuando el valor es texto (sección 11) | v2 no cubría el caso "el valor mismo es una cadena de texto que además se traduce" (ej. un epíteto) |
| Historia del conocimiento | `created_at`/`updated_at` simples — una edición sobrescribe el dato anterior | Versionado tipo SCD2 en `nodes`, `edges` y `claims`: nunca se sobrescribe un valor histórico, se crea una nueva versión enlazada a la anterior, con autor, motivo y commit de git (sección 13) | Sin esto, una corrección arqueológica en 2030 borraría silenciosamente la interpretación de 2026, perdiendo auditabilidad |

---

## 3. Decisiones nuevas que necesito que apruebes

1. `claims.value_type` como columna obligatoria, con 9 valores fijos (sección 5.1).
2. `claims.claim_status` como columna obligatoria, con 6 valores fijos (sección 5.2), ortogonal a `certainty`.
3. Sin restricción de unicidad en `(subject_id, field)` de `claims` — múltiples claims para el mismo campo son el caso normal, no un conflicto a resolver.
4. Columnas de versionado (`version`, `is_current`, `supersedes_id`, `superseded_by_id`, `edited_by`, `change_reason`, `git_commit`, `valid_from`, `valid_until`) añadidas simétricamente a `nodes`, `edges` y `claims` (sección 13).
5. Regla dura de independencia idioma/dato extendida explícitamente a claims de tipo `text` (sección 11).

---

## 4. Modelo de datos revisado

```sql
nodes
  id (uuid, pk)
  node_kind             -- 'event' | 'process' | 'state' | 'entity' | 'narrative_tradition'
  type                  -- 'person' | 'civilization' | 'city' | 'technology' | 'religion' | ... (catálogo abierto)
  slug
  dataset_tag           -- 'seed' | 'historical'
  time_span_id (fk, nullable)
  default_certainty
  attributes (jsonb)    -- metadatos de catálogo sin ambigüedad histórica, no hechos discutibles
  version                -- NUEVO: entero, empieza en 1
  is_current             -- NUEVO: bool, default true
  supersedes_id (fk → nodes.id, nullable)     -- NUEVO
  superseded_by_id (fk → nodes.id, nullable)  -- NUEVO
  edited_by               -- NUEVO: autor/editor de esta versión
  change_reason (nullable) -- NUEVO
  git_commit (nullable)    -- NUEVO: hash del commit de atlas-content que originó esta fila
  valid_from (timestamptz) -- NUEVO
  valid_until (timestamptz, nullable) -- NUEVO
  created_at / updated_at

edges
  id (pk)
  source_id, target_id (fk → nodes)
  relation_type
  relation_subtype
  time_span_id (nullable)
  default_certainty
  version / is_current / supersedes_id / superseded_by_id
  edited_by / change_reason / git_commit / valid_from / valid_until   -- NUEVO (mismo bloque que nodes)

claims
  id (pk)
  subject_type           -- 'node' | 'edge'
  subject_id              -- fk polimórfico a nodes.id o edges.id
  field                   -- 'birth_date' | 'death_cause' | 'parentage' | 'territory_extent' | ...
  value_type              -- NUEVO, obligatorio: 'text' | 'number' | 'boolean' | 'date' | 'time_span' |
                           --   'node_reference' | 'geographic_reference' | 'list' | 'structured_object'
  value (jsonb)            -- forma depende de value_type, ver 5.1
  certainty                -- 🟢🔵🟡🟠🔴, mide qué tan bien fundada está ESTA afirmación
  claim_status             -- NUEVO: 'accepted' | 'disputed' | 'rejected' | 'historical_consensus' |
                           --   'minority_view' | 'unknown' — mide su lugar frente a otras afirmaciones
  narrative_type           -- 'documented_fact' | 'tradition' | 'myth' | 'legend' | 'interpretation' | 'hypothesis'
  note
  version / is_current / supersedes_id / superseded_by_id
  edited_by / change_reason / git_commit / valid_from / valid_until   -- NUEVO (mismo bloque que nodes)
  created_at

claim_sources
  claim_id (fk), source_id (fk), note

time_spans   -- igual que v2: start/end en año astronómico + precisión
sources      -- igual que v2
translations
  id (pk)
  entity_type        -- 'node' | 'claim'
  entity_id
  field               -- 'name' | 'summary' | 'description' | 'deep_content' | 'value_text'
  locale              -- 'es' | 'en' | ...
  content
  is_machine_translated (bool)
```

No hay tabla nueva. Las tres precisiones que requerían cambio de esquema (tipado, estado, versión) se resuelven todas como columnas dentro de las tablas ya existentes — es la solución mínima que pedías, no una reestructuración.

---

## 5. Modelo de claims/assertions

Se mantiene el diseño de v2: `claims` como tabla polimórfica ligera, no como event sourcing completo. Lo que cambia es que cada fila ahora declara explícitamente **qué tipo de valor contiene** (5.1) y **qué lugar ocupa frente a otras afirmaciones sobre el mismo campo** (5.2).

### 5.1 Sistema de tipos de `claims.value`

`value` sigue siendo JSONB — es la decisión correcta para no explotar en columnas nullable por tipo — pero deja de ser un campo sin estructura porque `value_type` fija su forma esperada, validable por un JSON Schema propio de cada tipo en la Fase 1 (pipeline de ingesta):

| `value_type` | Forma de `value` | Ejemplo |
|---|---|---|
| `text` | `{ "text": string }` | `{ "text": "Cayo Julio César" }` |
| `number` | `{ "number": number, "unit": string \| null }` | `{ "number": 10, "unit": "legiones" }` |
| `boolean` | `{ "boolean": bool }` | `{ "boolean": true }` |
| `date` | `{ "date": string, "precision": "exact"\|"circa"\|"decade"\|"century" }` | `{ "date": "-0100-07-13", "precision": "exact" }` |
| `time_span` | `{ "start": number, "end": number \| null, "precision": ... }` | `{ "start": -509, "end": -27, "precision": "exact" }` |
| `node_reference` | `{ "node_id": uuid }` | `{ "node_id": "…-calpurnia" }` |
| `geographic_reference` | `{ "node_id": uuid \| null, "geometry": GeoJSON \| null }` | referencia a un nodo-lugar y/o geometría propia cuando no hay nodo modelado |
| `list` | `{ "items": [ { "value_type": ..., "value": ... }, ... ] }` | lista de valores tipados recursivamente (ej. varias divinidades tutelares) |
| `structured_object` | `{ "schema": string, "data": {...} }` | objeto validado contra un JSON Schema nombrado y versionado aparte (para casos que no encajan en los ocho tipos anteriores) |

Regla de ingesta: el catálogo abierto de `field` (`birth_date`, `father`, `territory_extent`...) declara en un lookup de configuración el `value_type` esperado por defecto para ese campo, pero cada claim guarda su `value_type` explícitamente en la fila — así el dato es autodescriptivo incluso si se consulta fuera del pipeline, y la ingesta puede validar que un `field` no reciba un tipo inconsistente con el resto de sus apariciones.

Ejemplo, Julio César:

```
claim:
  field: birth_date
  value_type: date
  value: { date: "-0100-07-13", precision: exact }

claim:
  field: father
  value_type: node_reference
  value: { node_id: "…-gayo-julio-cesar-padre" }
```

### 5.2 Afirmación, evidencia y consenso — `claim_status`

`certainty` (ya existente) y `claim_status` (nuevo) son **ejes ortogonais**, no un reemplazo el uno del otro:

- **`certainty`** — qué tan bien fundada está *esta afirmación en sí misma* (fuentes, calidad de la evidencia). Es una propiedad interna del claim.
- **`claim_status`** — qué lugar ocupa *frente a las demás afirmaciones* sobre el mismo `subject_id`+`field`, y frente al estado del consenso académico. Es una propiedad relacional/contextual.

```
claim_status:
    accepted               -- interpretación asumida por defecto (no hay otras afirmaciones que la contradigan en ATLAS)
    disputed                -- coexisten varios claims para el mismo subject+field, sin consenso registrado
    rejected                 -- documentado por completitud (fue afirmado alguna vez, o es un mito heredado), rechazado por la ciencia histórica actual
    historical_consensus     -- entre varios claims del mismo subject+field, este es el que sostiene el consenso académico mayoritario
    minority_view             -- sostenido por una minoría de historiadores, sin ser consenso
    unknown                    -- no hay posición académica clara; ATLAS no inventa una
```

No se necesita tabla ni mecanismo adicional. Regla mínima (aplicada en capa de aplicación, no como constraint de base de datos, para no sobre-restringir): de existir varios claims para el mismo `subject_id`+`field`, a lo sumo uno debería llevar `historical_consensus` — ese es el que la UI usa como interpretación por defecto; el resto se listan como "otras interpretaciones" sin eliminarlos nunca.

Ejemplo, Julio César:

```
CLAIM A
  field: birth_date
  value_type: date
  value: { date: "-0099-07-13" }
  certainty: strong
  claim_status: historical_consensus
  fuentes: [suetonio, plutarco]

CLAIM B
  field: birth_date
  value_type: date
  value: { date: "-0100-07-13" }
  certainty: partial
  claim_status: minority_view
  fuentes: [fuente-tardía-C]
```

Ambas conviven en la base de datos. Ninguna se borra ni se sobrescribe.

---

## 6. Modelo causal revisado

Sin cambios respecto a v2. `edges` con `relation_type = 'causal'` y `relation_subtype` como rol dentro de una cadena (`structural_condition`, `contributing_factor`, `immediate_cause`, `trigger`, `immediate_consequence`, `long_term_consequence`). El grafo causal sigue siendo recursivo por construcción: una consecuencia es un nodo normal que puede ser causa de un tercer evento.

---

## 7. Modelo de procesos históricos (evento / proceso / estado)

Sin cambios respecto a v2. `node_kind` (`event | process | state | entity | narrative_tradition`) resuelve la distinción sin tablas separadas.

---

## 8. Modelo de continuidad e identidad histórica

Sin cambios respecto a v2. Regla dura: nunca fusionar automáticamente entidades por similitud de nombre; identidad histórica se modela con relaciones explícitas (`continued_as`, `renamed_to`, `succeeded_by`, `split_into`, `merged_into`, `claimed_continuity_with`), cada una con su propio `certainty` — y ahora, adicionalmente, cualquier claim asociado a esa relación puede llevar su propio `claim_status` si la continuidad misma está en disputa historiográfica (ej. "Tercera Roma" sería `claim_status: minority_view` o `rejected` según el campo).

---

## 9. Modelo genealógico

Sin cambios respecto a v2, con el mismo beneficio adicional que el resto de aristas: cada claim genealógico (parentesco, matrimonio) ahora tiene `value_type` (típicamente `node_reference` o `date`) y puede llevar `claim_status` cuando hay genealogías en disputa (ej. paternidad legendaria vs. paternidad documentada).

---

## 10. Mitología, tradición e interpretación

Sin cambios estructurales respecto a v2. Se combina `claims.narrative_type` (documented_fact/tradition/myth/legend/interpretation/hypothesis) con `nodes.node_kind = 'narrative_tradition'`. La novedad de v3 es que un mito registrado como claim puede ahora llevar `claim_status: rejected` (el hecho narrado no es histórico) sin dejar de existir en el grafo, que es justo el requisito de "la Lista Real Sumeria no es histórica pero su influencia sí lo es".

---

## 11. Estrategia multilingüe

Se mantiene la tabla `translations` separada (sección 4), con español como locale por defecto y fallback automático. **Precisión v3:** esta regla se extiende explícitamente a claims de tipo `text`. El dato histórico —incluyendo cuando el dato mismo es una cadena de texto (un epíteto, un título, un topónimo antiguo)— vive siempre en `claims.value` en su forma canónica (normalmente la lengua original o la forma académica estándar), y **nunca** se traduce en el lugar: cualquier presentación en otro idioma de ese texto pasa por `translations` con `entity_type = 'claim'`, `field = 'value_text'`, `locale = '…'`.

```
CLAIM (dato, independiente del idioma)
  field: epithet
  value_type: text
  value: { text: "Pontifex Maximus" }

TRANSLATIONS (presentación)
  ES: "Pontífice Máximo"
  EN: "Pontifex Maximus" (sin traducción real, o traducción literal si se decide)
  FR: "Grand Pontife"
```

Añadir un idioma nuevo sigue siendo siempre una migración de **datos** (`INSERT` en `translations`), nunca de **esquema**, y nunca toca `nodes`, `edges`, `claims` ni `time_spans`.

---

## 12. Estrategia de contenido — formato de ingesta

Se mantiene Markdown + frontmatter YAML como formato de ingesta. El frontmatter se actualiza para reflejar `value_type` y `claim_status` en cada claim:

```markdown
---
id: julio-cesar
node_kind: entity
type: person
dataset_tag: historical
time_span: { start: -100, end: -44, precision: exact }
relations:
  - target: senado-romano
    type: political
    subtype: ruled
  - target: asesinato-julio-cesar
    type: causal
    subtype: trigger
claims:
  - field: birth_date
    value_type: date
    value: { date: "-0099-07-13", precision: exact }
    certainty: strong
    claim_status: historical_consensus
    narrative_type: documented_fact
    sources: [suetonio-vidas-cesares]
  - field: birth_date
    value_type: date
    value: { date: "-0100-07-13", precision: exact }
    certainty: partial
    claim_status: minority_view
    narrative_type: documented_fact
    sources: [fuente-tardia-c]
---

## Resumen
Texto nivel 1...

## Explicación
Texto nivel 2...

## Profundización
Texto nivel 3, markdown extenso...
```

Cada commit del repositorio `atlas-content` que modifica este archivo es la fuente del `git_commit` que la Fase 1 escribirá en la fila de `claims` correspondiente al ingerir el cambio (sección 13).

---

## 13. Versionado histórico explícito

**Mecanismo elegido: versionado de fila tipo SCD2, simétrico en `nodes`, `edges` y `claims`, respaldado por el historial de git de `atlas-content` como fuente de verdad del contenido.** No es event sourcing completo — no se registra un log de cada micro-cambio, solo una nueva fila-snapshot cuando el pipeline de ingesta detecta que un valor cambió de verdad.

Regla dura: **una fila que representa una interpretación histórica nunca se sobrescribe en su contenido.** Al detectar un cambio real de valor durante la ingesta:

1. Se inserta una fila nueva: mismo `subject_id`+`field` (en claims) o misma entidad (en nodes/edges), `version = version_anterior + 1`, `supersedes_id = id_de_la_fila_anterior`, `is_current = true`, `valid_from = now()`, `edited_by`, `change_reason`, `git_commit` del commit que introdujo el cambio.
2. La fila anterior se actualiza **solo en sus columnas de versionado** (nunca en `value`/`attributes`): `is_current = false`, `valid_until = now()`, `superseded_by_id = id_de_la_fila_nueva`.
3. Las consultas normales de aplicación filtran `is_current = true` (índice parcial), sin coste extra sobre el caso común.
4. El historial completo de cualquier nodo/arista/claim es un recorrido recursivo simple de `supersedes_id`.

Git es la fuente de verdad del **contenido en texto** (qué se escribió, cuándo, quién y por qué, vía mensajes de commit); Postgres es la fuente de verdad del **estado consultable**. `git_commit` es el puente entre ambos: cualquier versión en la base de datos se puede rastrear hasta el commit exacto de `atlas-content` que la originó, sin duplicar el historial de git dentro de Postgres.

Ejemplo — nueva evidencia arqueológica en 2030 corrige una fecha incorporada en 2026:

```
claim v1 (2026)
  value: { date: "-0099-07-13" }
  is_current: false
  valid_until: 2030-03-14
  superseded_by_id: <id de v2>
  git_commit: a1b2c3d

claim v2 (2030)
  value: { date: "-0098-11-02" }
  is_current: true
  supersedes_id: <id de v1>
  edited_by: "M. Torres"
  change_reason: "Nueva datación por hallazgo epigráfico en Placencia (2029)"
  git_commit: f9e8d7c
```

Nada se pierde. La v1 sigue siendo consultable, auditable y citable como "lo que ATLAS sostenía en 2026".

---

## 14. Análisis de escalabilidad

Sin cambios respecto a v2 en las conclusiones generales (la arquitectura relacional aguanta cómodamente hasta 100,000–1,000,000 de nodos sin cambios estructurales). Nota adicional de v3: el filtro `is_current = true` debe ir en índice parcial desde el DDL de Fase 1 — es el único ajuste de índices que introduce el versionado, y es barato.

---

## 15. Riesgos nuevos identificados en esta revisión

- **Sobre-normalización prematura de `claims`** (heredado de v2): mitigado igual — solo campos disputables o con fuente propia van a `claims`.
- **Explosión de versiones por ingesta repetida sin cambio real:** si el pipeline re-ingiere un archivo sin cambios de valor, no debe crear una versión nueva. Mitigación: diff de `value` antes de decidir si se crea fila nueva; si es idéntico, no-op (ni siquiera se actualiza `git_commit`).
- **Mantenimiento de JSON Schemas por `value_type`:** nueve tipos implican nueve schemas a mantener. Mitigación: son estables por diseño (no se espera añadir tipos nuevos con frecuencia); `structured_object` existe precisamente como válvula de escape para casos que no ameritan un décimo tipo fijo.
- **Ambigüedad en cuál claim es `historical_consensus` cuando el pipeline ingiere varios a la vez:** al ser una regla de aplicación y no un constraint de base de datos, es posible ingerir dos claims con `historical_consensus` para el mismo campo por error humano. Mitigación: validación de ingesta (no de esquema) que avise, no bloquee, cuando detecte más de un `historical_consensus` por `subject_id`+`field`.

---

## 16. Recomendación final

La arquitectura v3 está lista para aprobarse como definitiva. No introduce tecnología nueva ni tablas nuevas — resuelve las cuatro precisiones pendientes con columnas dentro del esquema ya aprobado en v2: `value_type` (tipado de claims), `claim_status` (consenso sin perder afirmaciones contradictorias), la regla explícita de independencia idioma/dato, y versionado SCD2 respaldado por git (auditabilidad histórica).

Siguiente paso, tras tu aprobación explícita: **Fase 1 — DDL completo, JSON Schemas de validación por `value_type` y por `type` de nodo, y pipeline de ingesta** (incluye el diff de versión descrito en la sección 13).

---

## CONTRATO DE ARQUITECTURA

Decisiones que no deben cambiarse sin una revisión arquitectónica explícita:

- PostgreSQL como fuente de verdad del estado consultable.
- PostGIS para geografía.
- `nodes` + `edges` como modelo de grafo sobre base relacional (no grafo dedicado).
- `claims` como capa obligatoria de conocimiento, separada de `nodes`/`edges`.
- Ningún campo históricamente discutible vive directamente en `nodes.attributes` o en `edges` — siempre pasa por `claims`.
- `claims.value_type` obligatorio en toda fila de `claims`; JSONB nunca sin tipo declarado.
- `claims.certainty` y `claims.claim_status` son ejes ortogonales; ninguno reemplaza al otro.
- Sin restricción de unicidad en `(subject_id, field)` de `claims` — la coexistencia de afirmaciones contradictorias es el diseño esperado, no una excepción.
- Nunca fusionar automáticamente entidades por similitud de nombre; identidad histórica siempre vía relaciones explícitas de identidad.
- `node_kind` (`event | process | state | entity | narrative_tradition`) como distinción obligatoria.
- Separación estricta contenido/código: contenido histórico vive en Markdown+frontmatter en `atlas-content`, nunca hardcodeado en la aplicación.
- Multiidioma exclusivamente vía `translations`; añadir idioma es siempre migración de datos, nunca de esquema; esto aplica también a claims de tipo `text`.
- Ninguna fila que represente una interpretación histórica se sobrescribe en su valor: toda edición sustantiva crea una nueva versión enlazada (`supersedes_id`/`superseded_by_id`), nunca un `UPDATE` sobre `value`/`attributes`.
- `git_commit` como puente obligatorio entre cada versión en base de datos y el commit de `atlas-content` que la originó.
- Fuentes (`sources`/`claim_sources`) obligatorias para cualquier claim con `narrative_type: documented_fact`.
- Dataset técnico (`dataset_tag = 'seed'`) siempre distinguible y purgable sin tocar contenido histórico real.
