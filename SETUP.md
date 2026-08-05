# ATLAS — Puesta en marcha (Fase 1, versión gratuita sin terminal)

## Qué contiene este paquete
- `app/` — app Next.js mínima: una sola página que muestra si la base de datos
  está conectada y cuántas tablas/filas existen (esto es lo que verás en tu celular).
- `db/001_init.sql` — el DDL completo de las 7 tablas de `atlas-arquitectura-v3.md`.
- `lib/db.js` — conexión a Postgres.
- `package.json`, `next.config.mjs`, `.gitignore`, `.env.example`.

## Cómo instalarlo (una sola vez)

### 1. Copia estos archivos a tu carpeta local del repo
Arrastra **todo el contenido** de este paquete (respetando las carpetas
`app/`, `db/`, `lib/`) dentro de la carpeta que GitHub Desktop clonó para `atlas`.

### 2. Sube a GitHub
En GitHub Desktop:
- Verás la lista de archivos nuevos en "Changes".
- Escribe un mensaje de commit, ej: `feat: seed app + DDL fase 1`.
- Botón "Commit to main".
- Botón "Push origin".

### 3. Corre el DDL contra tu base de Neon
Neon tiene un **SQL Editor** en su propio dashboard web (no necesitas terminal):
- Entra a tu proyecto en neon.tech → pestaña "SQL Editor".
- Abre `db/001_init.sql` de este paquete, copia todo el contenido, pégalo ahí.
- Ejecuta ("Run"). Esto crea las 7 tablas.

### 4. Verifica en Vercel
- Vercel detecta el push automáticamente y despliega en 1-2 minutos.
- Entra a tu proyecto en vercel.com → tendrás una URL tipo `atlas-tuusuario.vercel.app`.
- Abre esa URL **en tu celular**. Deberías ver:
  - "✅ Conectado a la base de datos"
  - Las tres tablas marcadas como "creada"
  - "0 nodos · 0 relaciones · 0 claims" (normal, todavía no hay contenido)

Si ves "⚠️ No se pudo conectar", revisa que `DATABASE_URL` esté bien puesta
en Vercel → Settings → Environment Variables, y que sea exactamente el
connection string que te dio Neon (incluye `?sslmode=require` si Neon lo agregó).

## A partir de aquí
Cada vez que quieras avanzar (agregar el pipeline de ingesta, cargar el
primer nodo real como Julio César, etc.), lo hacemos en el chat: yo te doy
archivos nuevos o actualizados, tú los arrastras a la misma carpeta, commit,
push — y en 1-2 minutos lo ves reflejado en tu celular.
