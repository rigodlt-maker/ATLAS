-- ATLAS — Segundo lote de contenido: el Asesinato de Julio César
-- Sigue atlas.md §33 (regla de enriquecimiento): no se agrega solo una fecha,
-- se agrega la red de nodos y relaciones conectadas al evento.
-- Ejecutar en el SQL Editor de Neon DESPUÉS de 001_init.sql y 002_julio_cesar.sql.
-- NOTA: este archivo se sube a GitHub como registro histórico; ya fue corrido en Neon.

-- ============================================================
-- 0. Arregla la traducción que faltó del padre de Julio César
-- ============================================================
INSERT INTO translations (entity_type, entity_id, field, locale, content, is_machine_translated)
SELECT 'node', id, 'name', 'es', 'Gayo Julio César (padre)', false
FROM nodes WHERE slug = 'gayo-julio-cesar-padre'
  AND NOT EXISTS (
    SELECT 1 FROM translations
    WHERE entity_type = 'node' AND entity_id = nodes.id AND field = 'name' AND locale = 'es'
  );

-- ============================================================
-- 1. Nuevos nodos: lugar, institución, actores
-- ============================================================
INSERT INTO nodes (node_kind, type, slug, dataset_tag, default_certainty, attributes) VALUES
  ('entity', 'city',        'roma',                 'historical', 'very_strong', '{}'),
  ('entity', 'institution', 'senado-romano',         'historical', 'very_strong', '{}'),
  ('entity', 'person',      'marco-junio-bruto',     'historical', 'strong',      '{}'),
  ('entity', 'person',      'cayo-casio-longino',    'historical', 'strong',      '{}');

-- ============================================================
-- 2. Time span y nodo del evento: Asesinato de Julio César
-- ============================================================
INSERT INTO time_spans (start_year, end_year, precision) VALUES (-44, -44, 'exact');

INSERT INTO nodes (node_kind, type, slug, dataset_tag, time_span_id, default_certainty, attributes)
SELECT 'event', 'assassination', 'asesinato-julio-cesar', 'historical', ts.id, 'very_strong', '{}'::jsonb
FROM time_spans ts
WHERE ts.start_year = -44 AND ts.end_year = -44
ORDER BY ts.created_at DESC
LIMIT 1;

-- ============================================================
-- 3. Traducciones (nombres legibles en español)
-- ============================================================
INSERT INTO translations (entity_type, entity_id, field, locale, content, is_machine_translated)
SELECT 'node', id, 'name', 'es', v.name, false
FROM nodes, (VALUES
  ('roma', 'Roma'),
  ('senado-romano', 'Senado Romano'),
  ('marco-junio-bruto', 'Marco Junio Bruto'),
  ('cayo-casio-longino', 'Cayo Casio Longino'),
  ('asesinato-julio-cesar', 'Asesinato de Julio César')
) AS v(slug, name)
WHERE nodes.slug = v.slug;

-- ============================================================
-- 4. Claims del evento: fecha y lugar
-- ============================================================
INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'date', 'date',
       '{"date": "-0044-03-15", "precision": "exact"}'::jsonb,
       'very_strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'asesinato-julio-cesar';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type, note)
SELECT 'node', id, 'location', 'text',
       '{"text": "Curia de Pompeyo, Roma"}'::jsonb,
       'strong', 'accepted', 'documented_fact',
       'La tradición popular lo sitúa en el Senado; las fuentes primarias señalan la Curia de Pompeyo.'
FROM nodes WHERE slug = 'asesinato-julio-cesar';

-- Fuentes para el claim de fecha (reutiliza Suetonio/Plutarco ya cargados)
INSERT INTO claim_sources (claim_id, source_id)
SELECT cl.id, s.id
FROM claims cl, sources s
WHERE cl.subject_id = (SELECT id FROM nodes WHERE slug = 'asesinato-julio-cesar')
  AND cl.field = 'date'
  AND s.title IN ('Vidas de los Césares', 'Vidas Paralelas');

-- ============================================================
-- 5. Relaciones (edges) — la red, no solo la fecha
-- ============================================================
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT b.id, e.id, 'causal', 'trigger', 'very_strong'
FROM nodes b, nodes e
WHERE b.slug = 'marco-junio-bruto' AND e.slug = 'asesinato-julio-cesar';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT c.id, e.id, 'causal', 'trigger', 'very_strong'
FROM nodes c, nodes e
WHERE c.slug = 'cayo-casio-longino' AND e.slug = 'asesinato-julio-cesar';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT jc.id, e.id, 'biographical', 'victim_of', 'very_strong'
FROM nodes jc, nodes e
WHERE jc.slug = 'julio-cesar' AND e.slug = 'asesinato-julio-cesar';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT e.id, r.id, 'geographic', 'took_place_in', 'very_strong'
FROM nodes e, nodes r
WHERE e.slug = 'asesinato-julio-cesar' AND r.slug = 'roma';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT jc.id, roma.id, 'political', 'gobernó', 'very_strong'
FROM nodes jc, nodes roma
WHERE jc.slug = 'julio-cesar' AND roma.slug = 'roma';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT b.id, sr.id, 'political', 'member_of', 'very_strong'
FROM nodes b, nodes sr
WHERE b.slug = 'marco-junio-bruto' AND sr.slug = 'senado-romano';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT c.id, sr.id, 'political', 'member_of', 'very_strong'
FROM nodes c, nodes sr
WHERE c.slug = 'cayo-casio-longino' AND sr.slug = 'senado-romano';

-- Verificación rápida (corregido: count(*) en vez de count())
SELECT n.slug, n.node_kind,
  (SELECT count(*) FROM edges WHERE source_id = n.id) AS relaciones_salientes,
  (SELECT count(*) FROM edges WHERE target_id = n.id) AS relaciones_entrantes
FROM nodes n
ORDER BY n.created_at;
