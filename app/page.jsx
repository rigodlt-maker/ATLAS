import { getPool } from "../lib/db";

async function getStatus() {
  try {
    const pool = getPool();
    const { rows } = await pool.query(`
      SELECT
        to_regclass('public.nodes')  IS NOT NULL AS has_nodes,
        to_regclass('public.edges')  IS NOT NULL AS has_edges,
        to_regclass('public.claims') IS NOT NULL AS has_claims
    `);
    const status = rows[0];

    let counts = { nodes: 0, edges: 0, claims: 0 };
    if (status.has_nodes) {
      const r = await pool.query(`
        SELECT
          (SELECT count(*) FROM nodes)  AS nodes,
          (SELECT count(*) FROM edges)  AS edges,
          (SELECT count(*) FROM claims) AS claims
      `);
      counts = r.rows[0];
    }

    return { connected: true, ...status, counts };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export default async function Home() {
  const status = await getStatus();

  return (
    <main style={{ maxWidth: 640, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 4 }}>ATLAS</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Explorar el pasado para comprender cómo llegamos hasta aquí.
      </p>

      <div
        style={{
          marginTop: 32,
          padding: 20,
          borderRadius: 12,
          background: status.connected ? "#eefbf1" : "#fdecea",
          border: `1px solid ${status.connected ? "#b7e4c7" : "#f5c2c0"}`,
        }}
      >
        {status.connected ? (
          <>
            <strong>✅ Conectado a la base de datos</strong>
            <ul style={{ marginTop: 12 }}>
              <li>Tabla nodes: {status.has_nodes ? "creada" : "no creada todavía"}</li>
              <li>Tabla edges: {status.has_edges ? "creada" : "no creada todavía"}</li>
              <li>Tabla claims: {status.has_claims ? "creada" : "no creada todavía"}</li>
            </ul>
            {status.has_nodes && (
              <p>
                {status.counts.nodes} nodos · {status.counts.edges} relaciones ·{" "}
                {status.counts.claims} claims
              </p>
            )}
          </>
        ) : (
          <>
            <strong>⚠️ No se pudo conectar a la base de datos</strong>
            <p style={{ fontSize: 14, color: "#900" }}>{status.error}</p>
            <p style={{ fontSize: 14 }}>
              Revisa que la variable de entorno <code>DATABASE_URL</code> esté
              configurada en Vercel (Settings → Environment Variables).
            </p>
          </>
        )}
      </div>
    </main>
  );
}

export const dynamic = "force-dynamic"; // siempre consulta la BD en cada visita
