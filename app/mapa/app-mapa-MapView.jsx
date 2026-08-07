"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

export default function MapView({ locations }) {
  const mapInstanceRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function init() {
      const L = window.L;
      if (!L || !containerRef.current || mapInstanceRef.current) return;

      const center = locations.length ? [locations[0].lat, locations[0].lng] : [41.9, 12.5];
      const map = L.map(containerRef.current).setView(center, 5);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const bounds = [];
      locations.forEach((loc) => {
        L.marker([loc.lat, loc.lng])
          .addTo(map)
          .bindPopup(`<strong>${loc.name}</strong><br/>${loc.node_kind} · ${loc.type}`);
        bounds.push([loc.lat, loc.lng]);
      });
      if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });

      mapInstanceRef.current = map;
    }

    if (window.L) {
      init();
    } else {
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const cssLink = document.createElement("link");
        cssLink.rel = "stylesheet";
        cssLink.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(cssLink);
      }
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.body.appendChild(script);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [locations]);

  return (
    <>
      <div
        ref={containerRef}
        style={{ height: 400, borderRadius: 12, marginBottom: 16, border: "1px solid #ddd" }}
      />
      <div>
        {locations.map((loc) => (
          <Link key={loc.slug} href={`/nodo/${loc.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div
              style={{
                padding: "10px 14px",
                marginBottom: 6,
                borderRadius: 8,
                border: "1px solid #eee",
              }}
            >
              <strong>{loc.name}</strong>
              <span style={{ marginLeft: 8, color: "#888", fontSize: 12, textTransform: "uppercase" }}>
                {loc.node_kind} · {loc.type}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
