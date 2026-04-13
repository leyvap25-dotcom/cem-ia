// ─── CEM IA — Service Worker v1 ──────────────────────────────────────────────
// Estrategia: Cache-First para assets estáticos, Network-First para /api/chat
// Al actualizar el SW (cambiar CACHE_NAME) se purgan las cachés viejas.

const CACHE_NAME = "cem-ia-v1";

// Assets que se precargan al instalar el SW (app shell)
const PRECACHE = [
  "/",
  "/_next/static/css/app.css",   // Next.js los genera dinámicos — se agregan en runtime
];

// Rutas que NUNCA se cachean (siempre van a la red)
const NETWORK_ONLY = [
  "/api/chat",
  "/api/stats",
];

// ── Install: precaché del app shell ──────────────────────────────────────────
self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Solo cacheamos "/" en install; el resto se agrega en fetch
      return cache.add("/").catch(() => {});
    })
  );
});

// ── Activate: limpia cachés viejas ───────────────────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: lógica de caché ────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Solo interceptamos mismo origen
  if (url.origin !== self.location.origin) return;

  // Rutas Network-Only (API calls con clave Anthropic, stats, etc.)
  if (NETWORK_ONLY.some((p) => url.pathname.startsWith(p))) {
    return; // deja pasar sin cachear
  }

  // Para peticiones GET → Cache-First con fallback a red y almacenamiento
  if (request.method !== "GET") return;

  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        // Solo cachear respuestas exitosas de assets estáticos
        if (
          response.ok &&
          (url.pathname.startsWith("/_next/") ||
            url.pathname === "/" ||
            url.pathname.endsWith(".html") ||
            url.pathname.endsWith(".json") ||
            url.pathname.endsWith(".png") ||
            url.pathname.endsWith(".jpg") ||
            url.pathname.endsWith(".svg") ||
            url.pathname.endsWith(".ico"))
        ) {
          cache.put(request, response.clone());
        }
        return response;
      } catch {
        // Sin red y sin caché → página offline integrada
        if (request.headers.get("accept")?.includes("text/html")) {
          return new Response(
            `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>CEM IA — Sin conexión</title>
<style>
  body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box;}
  .card{background:#1e293b;border-radius:16px;padding:32px;max-width:340px;text-align:center;border:1px solid #334155;}
  .icon{font-size:48px;margin-bottom:16px;}
  h1{font-size:20px;font-weight:800;color:#f8fafc;margin:0 0 8px;}
  p{font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 20px;}
  button{background:#7c3aed;color:#fff;border:none;border-radius:10px;padding:12px 24px;font-size:14px;font-weight:700;cursor:pointer;width:100%;}
  .tip{background:#172033;border-radius:10px;padding:12px;font-size:12px;color:#64748b;margin-top:16px;text-align:left;}
  .tip strong{color:#94a3b8;}
</style>
</head>
<body>
<div class="card">
  <div class="icon">📡</div>
  <h1>Sin conexión</h1>
  <p>El <strong>CEM Bot</strong> necesita internet para diagnosticar.<br>
  Las tablas de errores, planes PM y repuestos están disponibles offline.</p>
  <button onclick="location.reload()">Intentar de nuevo</button>
  <div class="tip">
    <strong>Disponible offline:</strong><br>
    ✓ Errores Rational, Unox, Zanolli, TurboChef<br>
    ✓ Planes de mantenimiento PM<br>
    ✓ Catálogo de repuestos con precios<br>
    ✓ Datos de instalación<br>
    ✗ CEM Bot (requiere internet)
  </div>
</div>
</body>
</html>`,
            {
              status: 200,
              headers: { "Content-Type": "text/html; charset=utf-8" },
            }
          );
        }
        return new Response("Sin conexión", { status: 503 });
      }
    })
  );
});
