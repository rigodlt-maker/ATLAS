import Link from "next/link";
import { listAllNodes, searchNodes } from "../lib/atlas-data";

async function getData(q) {
  try {
    const nodes = q ? await searchNodes(q) : await listAllNodes();
    return { connected: true, nodes };
  } catch (err) {
    return { connected: false, error: err.message, nodes: [] };
  }
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const q = (params?.q || "").trim();
  const data = await getData(q);

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <h1 style={{ marginBottom: 4 }}>ATLAS</h1>
      <p style={{ color: "#666", marginTop: 0 }}>
        Explorar el pasado para comprender cómo llegamos hasta aquí.
      </p>

      <Link
        href="/linea"
        style={{
          display: "inline-block",
          marginBottom: 16,
          fontSize: 14,
          color: "#333",
          textDecoration: "none",
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "6px 12px",
        }}
      >
        📅 Ver línea de tiempo
      </Link>

      {!data.connected && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ No se pudo conectar a la base de datos</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{data.error}</p>
        </div>
      )}

      {data.connected && (
        <>
          <form method="GET" style={{ display: "flex", gap: 8, margin: "8px 0 12px 0" }}>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Buscar por nombre..."
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 15,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#222",
                color: "#fff",
                fontSize: 15,
              }}
            >
              Buscar
            </button>
          </form>

          {q && (
            <p style={{ color: "#666", fontSize: 14 }}>
              {data.nodes.length} resultado(s) para &quot;{q}&quot; ·{" "}
              <Link href="/" style={{ color: "#555" }}>limpiar</Link>
            </p>
          )}

          {!q && <p style={{ color: "#666" }}>{data.nodes.length} nodo(s) en ATLAS</p>}

          {data.nodes.length === 0 ? (
            <p style={{ color: "#aaa" }}>Sin resultados.</p>
          ) : (
            <div>
              {data.nodes.map((n) => (
                <Link
                  key={n.id}
                  href={`/nodo/${n.slug}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      marginBottom: 10,
                      padding: "14px 16px",
                      borderRadius: 10,
                      border: "1px solid #ddd",
                    }}
                  >
                    <strong style={{ fontSize: 16 }}>{n.name}</strong>
                    <span
                      style={{
                        marginLeft: 10,
                        color: "#888",
                        fontSize: 12,
                        textTransform: "uppercase",
                      }}
                    >
                      {n.node_kind} · {n.type}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
