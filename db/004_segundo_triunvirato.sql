-- ATLAS — Tercer lote de contenido: del Segundo Triunvirato al fin de la República
-- Sigue atlas.md §33 (red, no fechas sueltas) y v3 §8 (identidad histórica vía
-- relaciones explícitas: aquí se usa 'continued_as' para República→Imperio,
-- con certainty 'disputed' porque el momento exacto de la transición se debate).
-- Ejecutar en el SQL Editor de Neon DESPUÉS de 001, 002 y 003.
-- NOTA: este archivo se sube a GitHub como registro histórico; ya fue corrido en Neon.

-- ============================================================
-- 1. Nodos nuevos
-- ============================================================
INSERT INTO nodes (node_kind, type, slug, dataset_tag, default_certainty, attributes) VALUES
  ('entity',      'person',      'octavio-augusto',       'historical', 'very_strong', '{}'),
  ('entity',      'person',      'marco-antonio',          'historical', 'very_strong', '{}'),
  ('entity',      'person',      'marco-emilio-lepido',    'historical', 'strong',      '{}'),
  ('entity',      'person',      'cleopatra-vii',          'historical', 'very_strong', '{}'),
  ('entity',      'institution', 'segundo-triunvirato',    'historical', 'very_strong', '{}'),
  ('state',       'state',       'republica-romana',       'historical', 'very_strong', '{}'),
  ('state',       'state',       'imperio-romano',         'historical', 'very_strong', '{}');

-- Time spans de los dos eventos con fecha exacta
INSERT INTO time_spans (start_year, end_year, precision) VALUES
  (-42, -42, 'exact'),   -- Batalla de Filipos
  (-31, -31, 'exact');   -- Batalla de Actium

INSERT INTO nodes (node_kind, type, slug, dataset_tag, time_span_id, default_certainty, attributes)
SELECT 'event', 'battle', 'batalla-de-filipos', 'historical', ts.id, 'very_strong', '{}'::jsonb
FROM time_spans ts WHERE ts.start_year = -42 AND ts.end_year = -42
ORDER BY ts.created_at DESC LIMIT 1;

INSERT INTO nodes (node_kind, type, slug, dataset_tag, time_span_id, default_certainty, attributes)
SELECT 'event', 'battle', 'batalla-de-accio', 'historical', ts.id, 'very_strong', '{}'::jsonb
FROM time_spans ts WHERE ts.start_year = -31 AND ts.end_year = -31
ORDER BY ts.created_at DESC LIMIT 1;

-- ============================================================
-- 2. Traducciones
-- ============================================================
INSERT INTO translations (entity_type, entity_id, field, locale, content, is_machine_translated)
SELECT 'node', id, 'name', 'es', v.name, false
FROM nodes, (VALUES
  ('octavio-augusto',    'Octavio (Augusto)'),
  ('marco-antonio',      'Marco Antonio'),
  ('marco-emilio-lepido','Marco Emilio Lépido'),
  ('cleopatra-vii',      'Cleopatra VII'),
  ('segundo-triunvirato','Segundo Triunvirato'),
  ('republica-romana',   'República Romana'),
  ('imperio-romano',     'Imperio Romano'),
  ('batalla-de-filipos', 'Batalla de Filipos'),
  ('batalla-de-accio',   'Batalla de Actium')
) AS v(slug, name)
WHERE nodes.slug = v.slug;

-- ============================================================
-- 3. Claims biográficos y de fecha
-- ============================================================
INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'birth_date', 'date', '{"date": "-0063-09-23", "precision": "exact"}'::jsonb,
       'very_strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'octavio-augusto';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'death_date', 'date', '{"date": "0014-08-19", "precision": "exact"}'::jsonb,
       'very_strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'octavio-augusto';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type, note)
SELECT 'node', id, 'title', 'text', '{"text": "Augustus"}'::jsonb,
       'very_strong', 'accepted', 'documented_fact',
       'Título honorífico otorgado por el Senado en el año -27, tras el cual "Octavio" pasa a ser conocido como "Augusto".'
FROM nodes WHERE slug = 'octavio-augusto';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'birth_date', 'date', '{"date": "-0069-01-01", "precision": "circa"}'::jsonb,
       'strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'cleopatra-vii';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'date', 'date', '{"date": "-0042-10-23", "precision": "circa"}'::jsonb,
       'very_strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'batalla-de-filipos';

INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type)
SELECT 'node', id, 'date', 'date', '{"date": "-0031-09-02", "precision": "exact"}'::jsonb,
       'very_strong', 'historical_consensus', 'documented_fact'
FROM nodes WHERE slug = 'batalla-de-accio';

-- ============================================================
-- 4. Edges — la red completa
-- ============================================================

-- Miembros del Segundo Triunvirato
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT p.id, t.id, 'political', 'member_of', 'very_strong'
FROM nodes p, nodes t
WHERE p.slug IN ('octavio-augusto','marco-antonio','marco-emilio-lepido') AND t.slug = 'segundo-triunvirato';

-- Bruto y Casio mueren en Filipos, enfrentados al Triunvirato
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT p.id, e.id, 'military', 'defeated_at', 'very_strong'
FROM nodes p, nodes e
WHERE p.slug IN ('marco-junio-bruto','cayo-casio-longino') AND e.slug = 'batalla-de-filipos';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT t.id, e.id, 'causal', 'immediate_cause', 'very_strong'
FROM nodes t, nodes e
WHERE t.slug = 'segundo-triunvirato' AND e.slug = 'batalla-de-filipos';

-- Alianza Marco Antonio - Cleopatra, y guerra contra Octavio
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT a.id, c.id, 'political', 'alianza', 'very_strong'
FROM nodes a, nodes c
WHERE a.slug = 'marco-antonio' AND c.slug = 'cleopatra-vii';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT o.id, e.id, 'military', 'victory', 'very_strong'
FROM nodes o, nodes e
WHERE o.slug = 'octavio-augusto' AND e.slug = 'batalla-de-accio';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT p.id, e.id, 'military', 'defeated_at', 'very_strong'
FROM nodes p, nodes e
WHERE p.slug IN ('marco-antonio','cleopatra-vii') AND e.slug = 'batalla-de-accio';

-- Cadena causal: asesinato → ruptura del triunvirato → Filipos → guerra final → Actium → fin de la República
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT ac.id, st.id, 'causal', 'immediate_consequence', 'strong'
FROM nodes ac, nodes st
WHERE ac.slug = 'asesinato-julio-cesar' AND st.slug = 'segundo-triunvirato';

INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT ba.id, ir.id, 'causal', 'long_term_consequence', 'strong'
FROM nodes ba, nodes ir
WHERE ba.slug = 'batalla-de-accio' AND ir.slug = 'imperio-romano';

-- Identidad histórica: República → Imperio (v3 §8, certainty 'disputed' porque
-- Augusto mantuvo formas republicanas; el momento exacto de la transición se debate).
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT rr.id, ir.id, 'identity', 'continued_as', 'disputed'
FROM nodes rr, nodes ir
WHERE rr.slug = 'republica-romana' AND ir.slug = 'imperio-romano';

-- Octavio/Augusto como fundador y primer gobernante del Imperio
INSERT INTO edges (source_id, target_id, relation_type, relation_subtype, default_certainty)
SELECT o.id, ir.id, 'political', 'gobernó', 'very_strong'
FROM nodes o, nodes ir
WHERE o.slug = 'octavio-augusto' AND ir.slug = 'imperio-romano';

-- Julio César como padre adoptivo de Octavio (relación genealógica real)
INSERT INTO claims (subject_type, subject_id, field, value_type, value, certainty, claim_status, narrative_type, note)
SELECT 'node', o.id, 'adoptive_father', 'node_reference', jsonb_build_object('node_id', jc.id),
       'very_strong', 'accepted', 'documented_fact',
       'Julio César adoptó testamentariamente a su sobrino nieto Octavio en el año -44.'
FROM nodes o, nodes jc
WHERE o.slug = 'octavio-augusto' AND jc.slug = 'julio-cesar';

-- Verificación rápida (corregido: count(*) en vez de count())
SELECT n.slug, n.node_kind, n.type,
  (SELECT count(*) FROM claims WHERE subject_id = n.id) AS claims,
  (SELECT count(*) FROM edges WHERE source_id = n.id OR target_id = n.id) AS relaciones
FROM nodes n
ORDER BY n.created_at;
