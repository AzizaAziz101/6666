const { chatHandler } = require("../openaiClient");

// ===== PII-Filter-Funktion =====
function validateInput(text) {
  // 1. E-Mail-Adressen
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;

  // 2. Telefonnummern
  const phoneRegex = /(\+?\d[\d\s\-]{7,}\d)/;

  // 3. IBAN / Bankdaten
  const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{1,30}\b/i;

  // 4. Postadressen (einfach)
  const addressRegex = /\b[A-ZÄÖÜ][a-zäöüß]+\s\d{1,4}\b/;

  // 5. IDs (SSN, Perso, Führerschein)
  const idRegex = /\b(\d{3}-\d{2}-\d{4}|\d{9})\b/;

  // 6. Keywords für sensible Daten
  const sensitiveKeywords = [
    "passwort", "geburtsdatum", "sozialversicherungsnummer",
    "patient", "krankheit", "medizinisch", "religion", "sexualität",
    "ethnie", "adresse", "iban"
  ];

  if (
    emailRegex.test(text) ||
    phoneRegex.test(text) ||
    ibanRegex.test(text) ||
    addressRegex.test(text) ||
    idRegex.test(text) ||
    sensitiveKeywords.some(keyword => text.toLowerCase().includes(keyword))
  ) {
    return false; // PII gefunden
  }

  if (text.length > 500) return false; // Optional: Länge begrenzen
  return true; // Kein PII erkannt
}
// ================================

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

      // ===== PII-Check =====
      if (!validateInput(data.message)) {
        return res.status(400).json({
          type: "PII",
          message: "Bitte geben Sie keine personenbezogenen Daten (Namen, E-Mail, Telefonnummer, Adresse usw.) ein!"
        });
      }
      // ====================

      const reply = await chatHandler(data.message);
      res.status(200).json({ reply });
    } catch (err) {
      console.error("Fehler in /api/chat:", err);
      res.status(500).json({ error: "Serverfehler" });
    }
  });
};
