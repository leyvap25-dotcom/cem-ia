// pages/api/fallas.js
// Guarda y lee fallas globales usando Vercel Blob
import { put, head, del } from "@vercel/blob";

const BLOB_KEY = "cem-fallas/fallas.json";

async function leerFallas() {
  try {
    const info = await head(BLOB_KEY);
    const res = await fetch(info.url);
    return await res.json();
  } catch {
    return [];
  }
}

async function guardarFallas(fallas) {
  await put(BLOB_KEY, JSON.stringify(fallas), {
    access: "public",
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET — leer todas las fallas
  if (req.method === "GET") {
    try {
      const fallas = await leerFallas();
      return res.status(200).json(fallas);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // POST — guardar nueva falla
  if (req.method === "POST") {
    try {
      const falla = req.body;
      if (!falla || !falla.equipo) return res.status(400).json({ error: "Falla inválida" });
      const fallas = await leerFallas();
      fallas.push({ ...falla, fecha: falla.fecha || new Date().toISOString() });
      // Máximo 2000 registros para no sobrepasar el Blob
      const recortadas = fallas.slice(-2000);
      await guardarFallas(recortadas);
      return res.status(200).json({ ok: true, total: recortadas.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  // DELETE — borrar registros (solo admin)
  if (req.method === "DELETE") {
    try {
      const { indices, pin } = req.body;
      if (pin !== "1234") return res.status(403).json({ error: "PIN incorrecto" });
      const fallas = await leerFallas();
      const set = new Set(indices);
      const nuevas = fallas.filter((_, i) => !set.has(i));
      await guardarFallas(nuevas);
      return res.status(200).json({ ok: true, total: nuevas.length });
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
