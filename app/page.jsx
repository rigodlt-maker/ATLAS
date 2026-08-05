import { getPool } from "../lib/db";

async function getData() {
  try {
    const pool = getPool();

    const check = await pool.query(`SELECT to_regclass('public.nodes') IS NOT NULL AS ok`);
    if (!check.rows[0].ok) {
      return { connected: true, ready: false };
    }

    const nodesRes = await pool.query(`
      SELECT id, slug, type, node_kind, attributes
      FROM nodes
      WHERE is_current = true
      ORDER BY created_at ASC
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

      const nameRes = await pool.query(
        `SELECT content FROM translations
         WHERE entity_type = 'node' AND entity_id = $1 AND field = 'name' AND locale = 'es'
         LIMIT 1`,
        [n.id]
      );

      nodes.push({
        ...n,
        name: nameRes.rows[0]?.content || n.attributes?.name || n.slug,
        claims: claimsRes.rows,
      });
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
          <p>Corre <code>db/001_init.sql</code> en el SQL Editor de Neon.</p>
        </div>
      )}

      {data.connected && data.ready && data.nodes.length === 0 && (
        <div style={{ padding: 20, borderRadius: 12, background: "#eefbf1", border: "1px solid #b7e4c7" }}>
          <strong>✅ Conectado — base de datos vacía</strong>
          <p>Todavía no hay nodos cargados.</p>
        </div>
      )}

      {data.connected && data.ready && data.nodes.length > 0 && (
        <div>
          <p style={{ color: "#666" }}>{data.nodes.length} nodo(s) en ATLAS</p>
          {data.nodes.map((node) => (
            <div
              key={node.id}
              style={{
                marginBottom: 20,
                padding: 20,
                borderRadius: 12,
                border: "1px solid #ddd",
              }}
            >
              <h2 style={{ margin: "0 0 4px 0" }}>{node.name}</h2>
              <p style={{ margin: "0 0 12px 0", color: "#888", fontSize: 13, textTransform: "uppercase" }}>
                {node.node_kind} · {node.type}
              </p>

              {node.claims.length === 0 ? (
                <p style={{ color: "#aaa", fontSize: 14 }}>Sin claims todavía.</p>
              ) : (
                <table style={{ width: "100%", fontSize: 14, borderCollapse: "collapse" }}>
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
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
