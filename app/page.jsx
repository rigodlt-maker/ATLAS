import { getPool } from "../lib/db";

async function getNodeName(pool, id) {
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

async function getData() {
  try {
    const pool = getPool();

    const check = await pool.query(`SELECT to_regclass('public.nodes') IS NOT NULL AS ok`);
    if (!check.rows[0].ok) return { connected: true, ready: false };

    const nodesRes = await pool.query(`
      SELECT id, slug, type, node_kind, attributes
      FROM nodes WHERE is_current = true ORDER BY created_at ASC
    `);

    const nodes = [];
    for (const n of nodesRes.rows) {
      const claimsRes = await pool.query(
        `SELECT field, value, certainty, claim_status
         FROM claims
         WHERE subject_type = 'node' AND subject_id = $1 AND is_current = true
         ORDER BY field`,
        [n.id]
      );

      const name = await getNodeName(pool, n.id);

      const outRes = await pool.query(
        `SELECT relation_type, relation_subtype, target_id
         FROM edges WHERE source_id = $1 AND is_current = true`,
        [n.id]
      );
      const inRes = await pool.query(
        `SELECT relation_type, relation_subtype, source_id
         FROM edges WHERE target_id = $1 AND is_current = true`,
        [n.id]
      );

      const outgoing = [];
      for (const e of outRes.rows) {
        outgoing.push({ ...e, targetName: await getNodeName(pool, e.target_id) });
      }
      const incoming = [];
      for (const e of inRes.rows) {
        incoming.push({ ...e, sourceName: await getNodeName(pool, e.source_id) });
      }

      nodes.push({ ...n, name, claims: claimsRes.rows, outgoing, incoming });
    }

    return { connected: true, ready: true, nodes };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

const statusColor = {
  historical_consensus: "#2d7a3e",
  minority_view: "#b8860b",
  accepted: "#2d7a3e",
  disputed: "#b8860b",
  rejected: "#a33",
  unknown: "#888",
};

function formatValue(value) {
  if (value.text) return value.text;
  if (value.date) return `${value.date} (${value.precision})`;
  if (value.node_id) return `→ referencia a otro nodo`;
  if (value.number !== undefined) return `${value.number}${value.unit ? " " + value.unit : ""}`;
  return JSON.stringify(value);
}

export default async function Home() {
  const data = await getData();

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 4 }}>ATLAS</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Explorar el pasado para comprender cómo llegamos hasta aquí.
      </p>

      {!data.connected && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ No se pudo conectar a la base de datos</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{data.error}</p>
        </div>
      )}

      {data.connected && !data.ready && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fff8e6", border: "1px solid #f0d98c" }}>
          <strong>⏳ Conectado, pero las tablas todavía no existen</strong>
        </div>
      )}

      {data.connected && data.ready && data.nodes.length === 0 && (
        <div style={{ padding: 20, borderRadius: 12, background: "#eefbf1", border: "1px solid #b7e4c7" }}>
          <strong>✅ Conectado — base de datos vacía</strong>
        </div>
      )}

      {data.connected && data.ready && data.nodes.length > 0 && (
        <div>
          <p style={{ color: "#666" }}>{data.nodes.length} nodo(s) en ATLAS</p>
          {data.nodes.map((node) => (
            <div key={node.id} style={{ marginBottom: 20, padding: 20, borderRadius: 12, border: "1px solid #ddd" }}>
              <h2 style={{ margin: "0 0 4px 0" }}>{node.name}</h2>
              <p style={{ margin: "0 0 12px 0", color: "#888", fontSize: 13, textTransform: "uppercase" }}>
                {node.node_kind} · {node.type}
              </p>

              {node.claims.length > 0 && (
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse", marginBottom: 12 }}>
                  <tbody>
                    {node.claims.map((c, i) => (
                      <tr key={i} style={{ borderTop: "1px solid #eee" }}>
                        <td style={{ padding: "6px 8px 6px 0", color: "#555" }}>{c.field}</td>
                        <td style={{ padding: "6px 8px" }}>{formatValue(c.value)}</td>
                        <td style={{ padding: "6px 0", color: statusColor[c.claim_status] || "#555", fontWeight: 600 }}>
                          {c.claim_status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {(node.outgoing.length > 0 || node.incoming.length > 0) && (
                <div style={{ fontSize: 14, color: "#444", borderTop: "1px solid #eee", paddingTop: 10 }}>
                  {node.outgoing.map((e, i) => (
                    <div key={"o" + i}>
                      → <strong>{e.relation_type}/{e.relation_subtype}</strong> {e.targetName}
                    </div>
                  ))}
                  {node.incoming.map((e, i) => (
                    <div key={"i" + i}>
                      ← {e.sourceName} <strong>{e.relation_type}/{e.relation_subtype}</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
