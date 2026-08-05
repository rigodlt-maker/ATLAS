import { Pool } from "pg";

// Reutiliza la conexión entre requests en desarrollo (evita agotar el pool de Neon).
let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Neon requiere SSL
    });
  }
  return pool;
}
