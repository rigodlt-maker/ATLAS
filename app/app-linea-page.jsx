import Link from "next/link";
import { getTimelineNodes, formatYear } from "../../lib/atlas-data";

const kindLabel = {
  event: "evento",
  process: "proceso",
  state: "estado",
  entity: "entidad",
  narrative_tradition: "tradición",
};

async function getData() {
  try {
    const nodes = await getTimelineNodes();
    return { connected: true, nodes };
  } catch (err) {
    return { connected: false, error: err.message, nodes: [] };
  }
}

export default async function LineaDeTiempo() {
  const data = await getData();

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <Link href="/" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>
        &larr; Volver a ATLAS
      </Link>

      <h1 style={{ margin: "12px 0 4px 0" }}>Línea de Tiempo</h1>
      <p style={{ margin: "0 0 24px 0", color: "#666" }}>
        Todo lo cargado en ATLAS, ordenado cronológicamente.
      </p>

      {!data.connected && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ No se pudo conectar a la base de datos</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{data.error}</p>
        </div>
      )}

      {data.connected && data.nodes.length === 0 && (
        <p style={{ color: "#aaa" }}>Ningún nodo tiene todavía una fecha determinable.</p>
      )}

      {data.connected && data.nodes.length > 0 && (
        <div style={{ borderLeft: "2px solid #ddd", paddingLeft: 20, marginLeft: 6 }}>
          {data.nodes.map((n) => (
            <div key={n.id} style={{ marginBottom: 22, position: "relative" }}>
              <div
                style={{
                  position: "absolute",
                  left: -26,
                  top: 4,
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: "#222",
                }}
              />
              <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>
                {n.precision === "circa" || n.precision === "year_only" ? "≈ " : ""}
                {formatYear(n.sortYear)}
                {n.endYear != null && n.endYear !== n.sortYear ? ` — ${formatYear(n.endYear)}` : ""}
              </div>
              <Link href={`/nodo/${n.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{ fontSize: 17, fontWeight: 600 }}>{n.name}</div>
              </Link>
              <div style={{ fontSize: 12, color: "#999", textTransform: "uppercase" }}>
                {kindLabel[n.node_kind] || n.node_kind} · {n.type}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
