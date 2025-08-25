const { chatHandler } = require("../openaiClient");

// Einfache Pre-Processing-Funktion
function validateInput(text) {
  const emailRegex = /\S+@\S+\.\S+/; // E-Mail erkennen
  const phoneRegex = /(\+?\d[\d\s\-]{7,})/; // Telefonnummer erkennen

  // Wenn PII gefunden wird → false
  if (emailRegex.test(text) || phoneRegex.test(text)) return false;

  // Optional: Länge/Zeichenbeschränkung
  if (text.length > 200) return false;

  return true;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Only POST allowed" });
    return;
  }

  let body = "";
  req.on("data", chunk => (body += chunk));
  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      // ===== Pre-Processing Layer =====
      if (!validateInput(data.message)) {
        return res.status(400).json({ error: "Keine personenbezogenen Daten eingeben!" });
      }
      // ================================

      const reply = await chatHandler(data.message);
      res.status(200).json({ reply });
    } catch (err) {
      console.error("Fehler in /api/chat:", err);
      res.status(500).json({ error: "Serverfehler" });
    }
  });
};
