// pages/api/fallas.js
// Sin dependencias externas - usa fetch nativo para leer/escribir en Vercel Blob
// BLOB_READ_WRITE_TOKEN se inyecta automáticamente por Vercel

const BLOB_URL = "https://blob.vercel-storage.com";
const BLOB_PATH = "fallas.json";

function getToken() {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

async function leerFallas() {
  try {
    // Listar blobs con prefijo
    const token = getToken();
    const res = await fetch(`${BLOB_URL}?prefix=${BLOB_PATH}&limit=1`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const blobs = data.blobs || [];
    if (blobs.length === 0) return [];
    // Descargar el archivo
    const dl = await fetch(blobs[0].downloadUrl);
    if (!dl.ok) return [];
    const json = await dl.json();
    return Array.isArray(json) ? json : [];
  } catch (e) {
    console.error("leerFallas:", e.message);
    return [];
  }
}

async function guardarFallas(fallas) {
  const token = getToken();
  const body = JSON.stringify(fallas);
  const res = await fetch(`${BLOB_URL}/${BLOB_PATH}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-add-random-suffix": "0",
      "x-cache-control-max-age": "0",
    },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Blob PUT failed: " + txt);
  }
  return res.json();
}

export default async function handler(req, res) {
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
