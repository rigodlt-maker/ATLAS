import { getPool } from "./db";

export async function getNodeName(pool, id) {
  const r = await pool.query(
    `SELECT content FROM translations
     WHERE entity_type = 'node' AND entity_id = $1 AND field = 'name' AND locale = 'es'
     LIMIT 1`,
    [id]
  );
  if (r.rows[0]) return r.rows[0].content;
  const n = await pool.query(`SELECT slug FROM nodes WHERE id = $1`, [id]);
  return n.rows[0]?.slug || "?";
}

async function getNodeSlugById(pool, id) {
  const r = await pool.query(`SELECT slug FROM nodes WHERE id = $1`, [id]);
  return r.rows[0]?.slug || null;
}

export const statusColor = {
  historical_consensus: "#2d7a3e",
  minority_view: "#b8860b",
  accepted: "#2d7a3e",
  disputed: "#b8860b",
  rejected: "#a33",
  unknown: "#888",
};

// Niveles de certeza de atlas.md §6 — se muestran literales, nunca se ocultan.
export const certaintyLabel = {
  very_strong: "🟢 Evidencia muy fuerte",
  strong: "🔵 Evidencia fuerte",
  partial: "🟡 Evidencia parcial",
  disputed: "🟠 Controvertido",
  legendary: "🔴 Legendario / mitológico",
};

// v3 §5.1 — formatea cada value_type según su forma esperada.
// Incluye 'year_only' (fix de sesión 005): nunca inventa un día que no se conoce.
export function formatValue(value) {
  if (!value) return "";
  if (value.text) return value.text;
  if (value.date) {
    const prefix = { exact: "", circa: "≈ ", decade: "década de ", century: "siglo ", year_only: "≈ año " }[
      value.precision
    ] ?? "";
    return `${prefix}${value.date}`;
  }
  if (value.node_id) return "→ referencia a otro nodo";
  if (value.number !== undefined) return `${value.number}${value.unit ? " " + value.unit : ""}`;
  if (value.boolean !== undefined) return value.boolean ? "Sí" : "No";
  return JSON.stringify(value);
}

export async function searchNodes(query) {
  const pool = getPool();
  const like = `%${query}%`;
  const res = await pool.query(
    `SELECT DISTINCT n.id, n.slug, n.type, n.node_kind,
            COALESCE(t.content, n.slug) AS name
     FROM nodes n
     LEFT JOIN translations t
       ON t.entity_type = 'node' AND t.entity_id = n.id AND t.field = 'name' AND t.locale = 'es'
     WHERE n.is_current = true
       AND (COALESCE(t.content, '') ILIKE $1 OR n.slug ILIKE $1)
     ORDER BY name ASC
     LIMIT 50`,
    [like]
  );
  return res.rows;
}

export async function listAllNodes() {
  const pool = getPool();
  const res = await pool.query(
    `SELECT n.id, n.slug, n.type, n.node_kind,
            COALESCE(t.content, n.slug) AS name
     FROM nodes n
     LEFT JOIN translations t
       ON t.entity_type = 'node' AND t.entity_id = n.id AND t.field = 'name' AND t.locale = 'es'
     WHERE n.is_current = true
     ORDER BY n.created_at ASC`
  );
  return res.rows;
}

export async function getNodeBySlug(slug) {
  const pool = getPool();

  const nodeRes = await pool.query(
    `SELECT id, slug, type, node_kind, attributes, default_certainty, time_span_id
     FROM nodes WHERE slug = $1 AND is_current = true LIMIT 1`,
    [slug]
  );
  const node = nodeRes.rows[0];
  if (!node) return null;

  const name = await getNodeName(pool, node.id);

  let timeSpan = null;
  if (node.time_span_id) {
    const tsRes = await pool.query(
      `SELECT start_year, end_year, precision FROM time_spans WHERE id = $1`,
      [node.time_span_id]
    );
    timeSpan = tsRes.rows[0] || null;
  }

  const claimsRes = await pool.query(
    `SELECT id, field, value, certainty, claim_status, narrative_type, note
     FROM claims
     WHERE subject_type = 'node' AND subject_id = $1 AND is_current = true
     ORDER BY field, claim_status`,
    [node.id]
  );

  const claims = [];
  for (const c of claimsRes.rows) {
    const srcRes = await pool.query(
      `SELECT s.title, s.source_type
       FROM claim_sources cs JOIN sources s ON s.id = cs.source_id
       WHERE cs.claim_id = $1`,
      [c.id]
    );
    let refName = null;
    let refSlug = null;
    if (c.value?.node_id) {
      refName = await getNodeName(pool, c.value.node_id);
      refSlug = await getNodeSlugById(pool, c.value.node_id);
    }
    claims.push({ ...c, sources: srcRes.rows, refName, refSlug });
  }

  const outRes = await pool.query(
    `SELECT relation_type, relation_subtype, target_id, default_certainty
     FROM edges WHERE source_id = $1 AND is_current = true`,
    [node.id]
  );
  const outgoing = [];
  for (const e of outRes.rows) {
    outgoing.push({
      ...e,
      targetName: await getNodeName(pool, e.target_id),
      targetSlug: await getNodeSlugById(pool, e.target_id),
    });
  }

  const inRes = await pool.query(
    `SELECT relation_type, relation_subtype, source_id, default_certainty
     FROM edges WHERE target_id = $1 AND is_current = true`,
    [node.id]
  );
  const incoming = [];
  for (const e of inRes.rows) {
    incoming.push({
      ...e,
      sourceName: await getNodeName(pool, e.source_id),
      sourceSlug: await getNodeSlugById(pool, e.source_id),
    });
  }

  return { ...node, name, timeSpan, claims, outgoing, incoming };
}
