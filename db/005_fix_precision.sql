-- ATLAS — Fix: soporte para precisión "solo año" (year_only)
-- Resuelve el hueco identificado en revisión de sesión: fechas donde solo se
-- conoce el año se guardaban forzando un día artificial (ej. "-0069-01-01"),
-- indistinguible de un día realmente documentado.
-- Ejecutar en el SQL Editor de Neon DESPUÉS de 001, 002, 003, 004.

-- ============================================================
-- 1. Ampliar el CHECK de precision en time_spans
-- ============================================================
ALTER TABLE time_spans DROP CONSTRAINT time_spans_precision_check;
ALTER TABLE time_spans ADD CONSTRAINT time_spans_precision_check
  CHECK (precision IN ('exact','circa','decade','century','year_only'));

-- ============================================================
-- 2. Convención para claims.value cuando value_type = 'date' (documentada,
--    no forzada por constraint porque value es JSONB):
--
--    Fecha completa conocida:  {"date": "-0044-03-15", "precision": "exact"}
--    Fecha aproximada con día: {"date": "-0042-10-23", "precision": "circa"}
--    Solo se conoce el año:     {"date": "-0069",       "precision": "year_only"}
--
--    Regla de ingesta: cuando solo se conoce el año, "date" NUNCA lleva mes/día.
--    El frontend debe mostrar year_only como "≈ año X" sin fecha completa.
-- ============================================================

-- ============================================================
-- 3. Corrección versionada: birth_date de Cleopatra VII (v3 §13, nunca se
--    sobrescribe — se supera la fila anterior y se crea una nueva versión).
-- ============================================================
WITH old_claim AS (
  SELECT id, version
  FROM claims
  WHERE subject_id = (SELECT id FROM nodes WHERE slug = 'cleopatra-vii')
    AND field = 'birth_date'
    AND is_current = true
),
new_claim AS (
  INSERT INTO claims (
    subject_type, subject_id, field, value_type, value,
    certainty, claim_status, narrative_type,
    version, supersedes_id, edited_by, change_reason
  )
  SELECT
    'node', (SELECT id FROM nodes WHERE slug = 'cleopatra-vii'), 'birth_date', 'date',
    '{"date": "-0069", "precision": "year_only"}'::jsonb,
    'strong', 'historical_consensus', 'documented_fact',
    old_claim.version + 1, old_claim.id,
    'ATLAS-S-20260805-1830-REV1',
    'Corrige precisión artificial: se forzaba día 01-01 cuando solo se conoce el año de nacimiento.'
  FROM old_claim
  RETURNING id
)
UPDATE claims
SET is_current = false, valid_until = now(), superseded_by_id = (SELECT id FROM new_claim)
WHERE id = (SELECT id FROM old_claim);

-- Verificación: debe mostrar la fila vieja (is_current=false) y la nueva (is_current=true)
SELECT id, value, value->>'precision' AS precision, claim_status, is_current, supersedes_id, superseded_by_id
FROM claims
WHERE subject_id = (SELECT id FROM nodes WHERE slug = 'cleopatra-vii') AND field = 'birth_date';
