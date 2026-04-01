export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "API key no configurada en el servidor." });

  const MAX_INTENTOS = 4;
  const ESPERA_BASE_MS = 1500; // espera inicial entre reintentos

  for (let intento = 1; intento <= MAX_INTENTOS; intento++) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(req.body),
      });

      // Si la API está sobrecargada (529) o error de servidor (500-599), reintentar
      if ((response.status === 529 || response.status === 500) && intento < MAX_INTENTOS) {
        const espera = ESPERA_BASE_MS * intento; // 1.5s, 3s, 4.5s
        await new Promise(r => setTimeout(r, espera));
        continue; // siguiente intento
      }

      const data = await response.json();
      return res.status(response.status).json(data);

    } catch (e) {
      // Error de red — reintentar si quedan intentos
      if (intento < MAX_INTENTOS) {
        await new Promise(r => setTimeout(r, ESPERA_BASE_MS * intento));
        continue;
      }
      return res.status(500).json({ error: "Error conectando con Anthropic: " + e.message });
    }
  }

  // Si agotó todos los intentos
  return res.status(529).json({ error: "El servicio está con alta demanda. Intenta en unos segundos." });
}
