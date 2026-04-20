// pages/api/fallas.js
const BLOB_PATH = "fallas.json";

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function leerFallas() {
  try {
    const token = getToken();
    // Listar para obtener la URL más reciente
    const listRes = await fetch(
      `https://blob.vercel-storage.com?prefix=fallas.json&limit=1`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!listRes.ok) return [];
    const listData = await listRes.json();
    const blobs = listData.blobs || [];
    if (blobs.length === 0) return [];
    // Forzar no-cache con timestamp
    const url = blobs[0].downloadUrl + "?t=" + Date.now();
    const dlRes = await fetch(url, { cache: "no-store" });
    if (!dlRes.ok) return [];
    const json = await dlRes.json();
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("leerFallas:", e.message);
    return [];
  }
}

async function guardarFallas(fallas) {
  const token = getToken();
  const res = await fetch(`https://blob.vercel-storage.com/${BLOB_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-add-random-suffix": "0",
      "x-cache-control-max-age": "0",
    },
    body: JSON.stringify(fallas),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Blob PUT failed: " + txt);
  }
  return res.json();
}

export default async function handler(req, res) {
  // No cachear esta respuesta
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const fallas = await leerFallas();
      return res.status(200).json(fallas);
    } catch (e) {
      console.error("GET:", e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const falla = req.body;
      if (!falla) return res.status(400).json({ error: "Body vacío" });
      const fallas = await leerFallas();
      fallas.push({
        equipo: falla.equipo || "Sin especificar",
        marca: falla.marca || "Sin especificar",
        ref: falla.ref || "Sin especificar",
        sintoma: falla.sintoma || "Sin especificar",
        fecha: falla.fecha || new Date().toISOString(),
      });
      await guardarFallas(fallas.slice(-2000));
      return res.status(200).json({ ok: true, total: fallas.length });
    } catch (e) {
      console.error("POST:", e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { indices, pin } = req.body || {};
      if (pin !== "1234") return res.status(403).json({ error: "PIN incorrecto" });
      const fallas = await leerFallas();
      const set = new Set(indices || []);
      const nuevas = fallas.filter((_, i) => !set.has(i));
      await guardarFallas(nuevas);
      return res.status(200).json({ ok: true, total: nuevas.length });
    } catch (e) {
      console.error("DELETE:", e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
