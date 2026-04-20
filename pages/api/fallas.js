// pages/api/fallas.js
const SHEETS_URL = "https://script.google.com/macros/s/AKfycbyPlzg3V5sTcbXoFQHnsH5iY56v0T76hk93gJ8T4rvd9dl7xftRNZ6Cm1iUS0sAVOlY/exec";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const r = await fetch(SHEETS_URL);
      const data = await r.json();
      return res.status(200).json(Array.isArray(data) ? data : []);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  if (req.method === "POST") {
    try {
      const falla = req.body;
      const r = await fetch(SHEETS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          equipo:  falla.equipo  || "Sin especificar",
          marca:   falla.marca   || "Sin especificar",
          ref:     falla.ref     || "Sin especificar",
          sintoma: falla.sintoma || "Sin especificar",
          ciudad:  falla.ciudad  || "",
          fecha:   falla.fecha   || new Date().toISOString(),
        }),
      });
      const data = await r.json();
      return res.status(200).json(data);
    } catch (e) {
      return res.status(500).json({ error: e.message });
    }
  }

  return res.status(405).json({ error: "Método no permitido" });
}
