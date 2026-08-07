import Link from "next/link";
import { notFound } from "next/navigation";
import { getNodeBySlug, formatValue, statusColor, certaintyLabel } from "../../../lib/atlas-data";

function formatTimeSpan(ts) {
  if (!ts) return null;
  const fmt = (y) => (y < 0 ? `${-y} a.C.` : `${y} d.C.`);
  if (ts.start_year === ts.end_year) return `${fmt(ts.start_year)} (${ts.precision})`;
  return `${fmt(ts.start_year)} — ${ts.end_year != null ? fmt(ts.end_year) : "presente"} (${ts.precision})`;
}

export default async function NodePage({ params }) {
  const { slug } = await params;
  const node = await getNodeBySlug(slug);
  if (!node) notFound();

  // Agrupar claims por campo — así conviven visiones en disputa del mismo dato
  // (v3 §5.2: certainty y claim_status son ejes distintos, nunca se ocultan).
  const claimsByField = {};
  for (const c of node.claims) {
    if (!claimsByField[c.field]) claimsByField[c.field] = [];
    claimsByField[c.field].push(c);
  }

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <Link href="/" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>
        &larr; Volver a ATLAS
      </Link>

      <h1 style={{ margin: "12px 0 4px 0" }}>{node.name}</h1>
      <p style={{ margin: "0 0 4px 0", color: "#888", fontSize: 13, textTransform: "uppercase" }}>
        {node.node_kind} · {node.type}
      </p>
      {node.timeSpan && (
        <p style={{ margin: "0 0 20px 0", color: "#555", fontSize: 14 }}>{formatTimeSpan(node.timeSpan)}</p>
      )}

      {Object.keys(claimsByField).length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 16, color: "#333", borderBottom: "1px solid #eee", paddingBottom: 6 }}>
            Lo que sabemos
          </h2>
          {Object.entries(claimsByField).map(([field, claims]) => (
            <div key={field} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, color: "#999", textTransform: "uppercase", marginBottom: 4 }}>
                {field}
                {claims.length > 1 && (
                  <span style={{ marginLeft: 8, color: "#b8860b", fontWeight: 600 }}>
                    ({claims.length} interpretaciones)
                  </span>
                )}
              </div>
              {claims.map((c) => (
                <div
                  key={c.id}
                  style={{
                    padding: "10px 14px",
                    marginBottom: 6,
                    borderRadius: 8,
                    border: "1px solid #eee",
                    background: "#fafafa",
                  }}
                >
                  <div style={{ fontSize: 15 }}>
                    {c.refSlug ? <Link href={`/nodo/${c.refSlug}`}>{c.refName}</Link> : formatValue(c.value)}
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4, color: "#666" }}>
                    {certaintyLabel[c.certainty] || c.certainty}
                    {" · "}
                    <span style={{ color: statusColor[c.claim_status] || "#555", fontWeight: 600 }}>
                      {c.claim_status}
                    </span>
                  </div>
                  {c.note && (
                    <div style={{ fontSize: 13, marginTop: 6, color: "#555", fontStyle: "italic" }}>{c.note}</div>
                  )}
                  {c.sources.length > 0 && (
                    <div style={{ fontSize: 12, marginTop: 6, color: "#888" }}>
                      Fuentes: {c.sources.map((s) => s.title).join(", ")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {(node.outgoing.length > 0 || node.incoming.length > 0) && (
        <section>
          <h2 style={{ fontSize: 16, color: "#333", borderBottom: "1px solid #eee", paddingBottom: 6 }}>
            Conexiones
          </h2>
          {node.outgoing.map((e, i) => (
            <div key={"o" + i} style={{ fontSize: 14, margin: "8px 0" }}>
              →{" "}
              <strong>
                {e.relation_type}/{e.relation_subtype}
              </strong>{" "}
              {e.targetSlug ? <Link href={`/nodo/${e.targetSlug}`}>{e.targetName}</Link> : e.targetName}
            </div>
          ))}
          {node.incoming.map((e, i) => (
            <div key={"i" + i} style={{ fontSize: 14, margin: "8px 0" }}>
              {e.sourceSlug ? <Link href={`/nodo/${e.sourceSlug}`}>{e.sourceName}</Link> : e.sourceName}{" "}
              <strong>
                {e.relation_type}/{e.relation_subtype}
              </strong>{" "}
              ←
            </div>
          ))}
        </section>
      )}
    </main>
  );
}

export const dynamic = "force-dynamic";
