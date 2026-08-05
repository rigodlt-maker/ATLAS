-- ATLAS — Primer contenido real: Julio César
-- Sigue exactamente los ejemplos de atlas-arquitectura-v3.md (secciones 5.1, 5.2, 12).
-- Demuestra: dos claims en disputa para el mismo campo (birth_date), y una
-- referencia a otro nodo (father) con value_type = node_reference.
-- Ejecutar en el SQL Editor de Neon, DESPUÉS de haber corrido db/001_init.sql.
-- NOTA: este archivo se sube a GitHub como registro histórico; ya fue corrido en Neon.

-- ============================================================
-- 1. Fuentes
-- ============================================================
WITH src_suetonio AS (
  INSERT INTO sources (title, source_type, citation)
  VALUES ('Vidas de los Césares', 'primary', 'Suetonio, s. II d.C.')
  RETURNING id
),
src_plutarco AS (
  INSERT INTO sources (title, source_type, citation)
  VALUES ('Vidas Paralelas', 'primary', 'Plutarco, s. I-II d.C.')
  RETURNING id
),
src_tardia AS (
  INSERT INTO sources (title, source_type, citation)
  VALUES ('Fuente tardía C (ejemplo)', 'secondary', 'Referencia ilustrativa de la arquitectura v3')
  RETURNING id
),

-- ============================================================
-- 2. Time span de la vida de Julio César
-- ============================================================
ts_cesar AS (
  INSERT INTO time_spans (start_year, end_year, precision)
  VALUES (-100, -44, 'exact')
  RETURNING id
),

-- ============================================================
-- 3. Nodos: Julio César y su padre
-- ============================================================
node_padre AS (
  INSERT INTO nodes (node_kind, type, slug, dataset_tag, default_certainty, attributes)
  VALUES ('entity', 'person', 'gayo-julio-cesar-padre', 'historical', 'strong', '{}')
  RETURNING id
),
node_cesar AS (
  INSERT INTO nodes (node_kind, type, slug, dataset_tag, time_span_id, default_certainty, attributes)
  SELECT 'entity', 'person', 'julio-cesar', 'historical', ts_cesar.id, 'strong',
         '{"name": "Cayo Julio César"}'::jsonb
  FROM ts_cesar
  RETURNING id
)

-- ============================================================
-- 4. Claims: dos interpretaciones de birth_date (v3 §5.2, ejemplo literal)
-- ============================================================
INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', node_cesar.id, 'birth_date', 'date',
       '{"date": "-0099-07-13", "precision": "exact"}'::jsonb,
       'strong', 'historical_consensus', 'documented_fact'
FROM node_cesar
UNION ALL
SELECT 'node', node_cesar.id, 'birth_date', 'date',
       '{"date": "-0100-07-13", "precision": "exact"}'::jsonb,
       'partial', 'minority_view', 'documented_fact'
FROM node_cesar
RETURNING id, value, claim_status;

-- ============================================================
-- 5. Claim de paternidad: node_reference (v3 §5.1, ejemplo literal)
-- ============================================================
INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', c.id, 'father', 'node_reference',
       jsonb_build_object('node_id', p.id),
       'strong', 'accepted', 'documented_fact'
FROM nodes c, nodes p
WHERE c.slug = 'julio-cesar' AND p.slug = 'gayo-julio-cesar-padre'
RETURNING id, value;

-- ============================================================
-- 6. Vincular fuentes a los claims de birth_date
-- ============================================================
INSERT INTO claim_sources (claim_id, source_id)
SELECT cl.id, s.id
FROM claims cl, sources s
WHERE cl.subject_id = (SELECT id FROM nodes WHERE slug = 'julio-cesar')
  AND cl.field = 'birth_date'
  AND cl.claim_status = 'historical_consensus'
  AND s.title = 'Vidas de los Césares';

INSERT INTO claim_sources (claim_id, source_id)
SELECT cl.id, s.id
FROM claims cl, sources s
WHERE cl.subject_id = (SELECT id FROM nodes WHERE slug = 'julio-cesar')
  AND cl.field = 'birth_date'
  AND cl.claim_status = 'historical_consensus'
  AND s.title = 'Vidas Paralelas';

INSERT INTO claim_sources (claim_id, source_id)
SELECT cl.id, s.id
FROM claims cl, sources s
WHERE cl.subject_id = (SELECT id FROM nodes WHERE slug = 'julio-cesar')
  AND cl.field = 'birth_date'
  AND cl.claim_status = 'minority_view'
  AND s.title = 'Fuente tardía C (ejemplo)';

-- ============================================================
-- 7. Traducción del nombre (v3 §11)
-- ============================================================
INSERT INTO translations (entity_type, entity_id, field, locale, content, is_machine_translated)
SELECT 'node', id, 'name', 'es', 'Cayo Julio César', false
FROM nodes WHERE slug = 'julio-cesar';

INSERT INTO translations (entity_type, entity_id, field, locale, content, is_machine_translated)
SELECT 'node', id, 'name', 'en', 'Gaius Julius Caesar', false
FROM nodes WHERE slug = 'julio-cesar';

-- Verificación rápida (corregido: count(*) en vez de count())
SELECT n.slug, n.type, n.node_kind, count(c.id) AS claims_count
FROM nodes n
LEFT JOIN claims c ON c.subject_id = n.id
GROUP BY n.slug, n.type, n.node_kind;
