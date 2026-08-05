import Link from "next/link";
import { getPool } from "../lib/db";
import { searchNodes, listAllNodes } from "../lib/atlas-data";

async function getStatus() {
  try {
    const pool = getPool();
    const check = await pool.query(`SELECT to_regclass('public.nodes') IS NOT NULL AS ok`);
    return { connected: true, ready: check.rows[0].ok };
  } catch (err) {
    return { connected: false, error: err.message };
  }
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").trim();

  const status = await getStatus();

  let nodes = [];
  let error = null;
  if (status.connected && status.ready) {
    try {
      nodes = q ? await searchNodes(q) : await listAllNodes();
    } catch (err) {
      error = err.message;
    }
  }

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 4 }}>ATLAS</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Explorar el pasado para comprender cómo llegamos hasta aquí.
      </p>

      <form action="/" method="GET" style={{ marginBottom: 24 }}>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar persona, lugar, evento..."
          style={{
            width: "100%",
            padding: "10px 14px",
            fontSize: 16,
            borderRadius: 8,
            border: "1px solid #ccc",
            boxSizing: "border-box",
          }}
        />
      </form>

      {!status.connected && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ No se pudo conectar a la base de datos</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{status.error}</p>
        </div>
      )}

      {status.connected && !status.ready && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fff8e6", border: "1px solid #f0d98c" }}>
          <strong>⏳ Conectado, pero las tablas todavía no existen</strong>
        </div>
      )}

      {error && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ Error al consultar</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{error}</p>
        </div>
      )}

      {status.connected && status.ready && !error && (
        <>
          <p style={{ color: "#666" }}>
            {q ? `${nodes.length} resultado(s) para "${q}"` : `${nodes.length} nodo(s) en ATLAS`}
          </p>

          {nodes.length === 0 && q && (
            <p style={{ color: "#888" }}>Sin resultados. Prueba con otro término.</p>
          )}

          {nodes.length === 0 && !q && (
            <div style={{ padding: 20, borderRadius: 12, background: "#eefbf1", border: "1px solid #b7e4c7" }}>
              <strong>✅ Conectado — base de datos vacía</strong>
            </div>
          )}

          <div>
            {nodes.map((n) => (
              <Link
                key={n.id}
                href={`/nodo/${n.slug}`}
                style={{
                  display: "block",
                  padding: "14px 16px",
                  marginBottom: 8,
                  borderRadius: 10,
                  border: "1px solid #ddd",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <strong>{n.name}</strong>
                <div style={{ fontSize: 12, color: "#888", textTransform: "uppercase" }}>
                  {n.node_kind} · {n.type}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
