// ─── CEM IA — Service Worker v3 ──────────────────────────────────────────────
// Estrategia: Cache-First para assets estáticos, Network-First para /api/chat
// v3: detección automática de actualizaciones + notificación al usuario

const CACHE_NAME = "cem-ia-v3";

const NETWORK_ONLY = [
  "/api/chat",
  "/api/stats",
];

// ── Install: skipWaiting inmediato para activar la nueva versión YA ──────────
self.addEventListener("install", (e) => {
  // skipWaiting fuerza que el nuevo SW tome control sin esperar que se cierren tabs
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.add("/").catch(() => {});
    })
  );
});

// ── Activate: limpia cachés viejas y toma control de todos los clientes ───────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => {
            console.log("[SW] Eliminando caché vieja:", k);
            return caches.delete(k);
          })
      )
    ).then(() => {
      // clients.claim() hace que el SW tome control de todas las tabs abiertas
      return self.clients.claim();
    }).then(() => {
      // Notificar a todos los clientes que hay una nueva versión activa
      return self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "SW_UPDATED", version: CACHE_NAME });
        });
      });
    })
  );
});

// ── Fetch: lógica de caché ────────────────────────────────────────────────────
self.addEventListener("fetch", (e) => {
  const { request } = e;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (NETWORK_ONLY.some((p) => url.pathname.startsWith(p))) {
    return;
  }

  if (request.method !== "GET") return;

  // Para la página principal ("/") usar Network-First para detectar updates
  if (url.pathname === "/") {
    e.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || offlinePage();
        })
    );
    return;
  }

  // Para assets estáticos → Cache-First
  e.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (
          response.ok &&
          (url.pathname.startsWith("/_next/") ||
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
        if (request.headers.get("accept")?.includes("text/html")) {
          return offlinePage();
        }
        return new Response("Sin conexión", { status: 503 });
      }
    })
  );
});

// ── Página offline ────────────────────────────────────────────────────────────
function offlinePage() {
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
