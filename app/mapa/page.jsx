import Link from "next/link";
import { getMapNodes } from "../../lib/atlas-data";
import MapView from "./MapView";

async function getData() {
  try {
    const locations = await getMapNodes();
    return { connected: true, locations };
  } catch (err) {
    return { connected: false, error: err.message, locations: [] };
  }
}

export default async function MapaPage() {
  const data = await getData();

  return (
    <main style={{ maxWidth: 680, margin: "40px auto", padding: "0 20px" }}>
      <Link href="/" style={{ fontSize: 14, color: "#666", textDecoration: "none" }}>
        &larr; Volver a ATLAS
      </Link>

      <h1 style={{ margin: "12px 0 4px 0" }}>Mapa Histórico</h1>
      <p style={{ margin: "0 0 20px 0", color: "#666" }}>
        Lugares con coordenadas cargadas en ATLAS.
      </p>

      {!data.connected && (
        <div style={{ padding: 20, borderRadius: 12, background: "#fdecea", border: "1px solid #f5c2c0" }}>
          <strong>⚠️ No se pudo conectar a la base de datos</strong>
          <p style={{ fontSize: 14, color: "#900" }}>{data.error}</p>
        </div>
      )}

      {data.connected && data.locations.length === 0 && (
        <p style={{ color: "#aaa" }}>Todavía no hay ubicaciones con coordenadas cargadas.</p>
      )}

      {data.connected && data.locations.length > 0 && <MapView locations={data.locations} />}
    </main>
  );
}

export const dynamic = "force-dynamic";
