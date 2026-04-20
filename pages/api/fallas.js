// pages/api/fallas.js
const { put, list } = require("@vercel/blob");

const BLOB_PATH = "fallas.json";

async function leerFallas() {
  try {
    const result = await list({ prefix: "fallas" });
    const blobs = result.blobs || [];
    if (blobs.length === 0) return [];
    blobs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    const res = await fetch(blobs[0].downloadUrl);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("leerFallas error:", e.message);
    return [];
  }
}

async function guardarFallas(fallas) {
  await put(BLOB_PATH, JSON.stringify(fallas), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const fallas = await leerFallas();
      return res.status(200).json(fallas);
    } catch (e) {
      console.error("GET error:", e.message);
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
      const guardadas = fallas.slice(-2000);
      await guardarFallas(guardadas);
      return res.status(200).json({ ok: true, total: guardadas.length });
    } catch (e) {
      console.error("POST error:", e.message);
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
      console.error("DELETE error:", e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
};
