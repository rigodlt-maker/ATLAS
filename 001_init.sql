-- ATLAS — Fase 1 DDL inicial
-- Corresponde a atlas-arquitectura-v3.md, secciones 4, 5, 13, 14.
-- Ejecutar una sola vez contra la base de Neon (o cualquier Postgres 16+).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- time_spans
-- ============================================================
CREATE TABLE time_spans (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  start_year    integer NOT NULL,   -- año astronómico (negativos = a.C.)
  end_year      integer,
  precision     text NOT NULL CHECK (precision IN ('exact','circa','decade','century')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- sources
-- ============================================================
CREATE TABLE sources (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  title         text NOT NULL,
  source_type   text,               -- 'primary' | 'secondary'
  citation      text,
  url           text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- nodes
-- ============================================================
CREATE TABLE nodes (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_kind         text NOT NULL CHECK (node_kind IN ('event','process','state','entity','narrative_tradition')),
  type              text NOT NULL,          -- catálogo abierto: 'person','civilization','city',...
  slug              text NOT NULL,
  dataset_tag       text NOT NULL DEFAULT 'seed' CHECK (dataset_tag IN ('seed','historical')),
  time_span_id      uuid REFERENCES time_spans(id),
  default_certainty text CHECK (default_certainty IN ('very_strong','strong','partial','disputed','legendary')),
  attributes        jsonb NOT NULL DEFAULT '{}',

  version           integer NOT NULL DEFAULT 1,
  is_current        boolean NOT NULL DEFAULT true,
  supersedes_id     uuid REFERENCES nodes(id),
  superseded_by_id  uuid REFERENCES nodes(id),
  edited_by         text,
  change_reason     text,
  git_commit        text,
  valid_from        timestamptz NOT NULL DEFAULT now(),
  valid_until       timestamptz,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_nodes_current ON nodes (id) WHERE is_current = true;
CREATE INDEX idx_nodes_slug ON nodes (slug);
CREATE INDEX idx_nodes_type ON nodes (type);

-- ============================================================
-- edges
-- ============================================================
CREATE TABLE edges (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id         uuid NOT NULL REFERENCES nodes(id),
  target_id         uuid NOT NULL REFERENCES nodes(id),
  relation_type     text NOT NULL,
  relation_subtype  text,
  time_span_id      uuid REFERENCES time_spans(id),
  default_certainty text CHECK (default_certainty IN ('very_strong','strong','partial','disputed','legendary')),

  version           integer NOT NULL DEFAULT 1,
  is_current        boolean NOT NULL DEFAULT true,
  supersedes_id     uuid REFERENCES edges(id),
  superseded_by_id  uuid REFERENCES edges(id),
  edited_by         text,
  change_reason     text,
  git_commit        text,
  valid_from        timestamptz NOT NULL DEFAULT now(),
  valid_until       timestamptz,

  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_edges_current ON edges (id) WHERE is_current = true;
CREATE INDEX idx_edges_source ON edges (source_id);
CREATE INDEX idx_edges_target ON edges (target_id);

-- ============================================================
-- claims
-- ============================================================
CREATE TABLE claims (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_type      text NOT NULL CHECK (subject_type IN ('node','edge')),
  subject_id        uuid NOT NULL,   -- fk polimórfico: valida en capa de aplicación
  field             text NOT NULL,
  value_type        text NOT NULL CHECK (value_type IN (
                       'text','number','boolean','date','time_span',
                       'node_reference','geographic_reference','list','structured_object'
                     )),
  value             jsonb NOT NULL,
  certainty         text NOT NULL CHECK (certainty IN ('very_strong','strong','partial','disputed','legendary')),
  claim_status      text NOT NULL CHECK (claim_status IN (
                       'accepted','disputed','rejected',
                       'historical_consensus','minority_view','unknown'
                     )),
  narrative_type    text NOT NULL CHECK (narrative_type IN (
                       'documented_fact','tradition','myth','legend','interpretation','hypothesis'
                     )),
  note              text,

  version           integer NOT NULL DEFAULT 1,
  is_current        boolean NOT NULL DEFAULT true,
  supersedes_id     uuid REFERENCES claims(id),
  superseded_by_id  uuid REFERENCES claims(id),
  edited_by         text,
  change_reason     text,
  git_commit        text,
  valid_from        timestamptz NOT NULL DEFAULT now(),
  valid_until       timestamptz,

  created_at        timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_claims_current ON claims (id) WHERE is_current = true;
CREATE INDEX idx_claims_subject ON claims (subject_type, subject_id);
CREATE INDEX idx_claims_field ON claims (field);

-- Regla del CONTRATO v3: fuentes obligatorias para narrative_type = 'documented_fact'
-- se valida en capa de aplicación/ingesta, no como constraint de BD (evita bloquear
-- ingesta parcial durante desarrollo).

-- ============================================================
-- claim_sources
-- ============================================================
CREATE TABLE claim_sources (
  claim_id   uuid NOT NULL REFERENCES claims(id),
  source_id  uuid NOT NULL REFERENCES sources(id),
  note       text,
  PRIMARY KEY (claim_id, source_id)
);

-- ============================================================
-- translations
-- ============================================================
CREATE TABLE translations (
  id                     uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type            text NOT NULL CHECK (entity_type IN ('node','claim')),
  entity_id              uuid NOT NULL,
  field                  text NOT NULL,   -- 'name' | 'summary' | 'description' | 'deep_content' | 'value_text'
  locale                 text NOT NULL,
  content                text NOT NULL,
  is_machine_translated  boolean NOT NULL DEFAULT false,
  created_at             timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_translations_entity ON translations (entity_type, entity_id, locale);
