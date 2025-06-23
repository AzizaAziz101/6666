const OpenAI = require("openai");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Optional: Text aus Datei einlesen
const leistungen = fs.existsSync("leistungen.txt")
  ? fs.readFileSync("leistungen.txt", "utf-8")
  : "";

async function chatHandler(userMessage) {
  const messages = [
    {
  role: "system",
  content: `Du bist ein freundlicher, geduldiger Beauty-Experte bei Luminous Studio, der einen klickbaren Link anzeigen kann wenn die Frage aufkommt wie man einen Termin buchen kann: https://beautinda.de/salon/B12kT0zgdBrVS9q0mk0B. Beantworte Fragen zu Behandlungen, Preisen und Abläufen sympathisch und professionell.

Wichtig: Für Terminbuchungen **verweist du immer nur auf: (https://beautinda.de/salon/B12kT0zgdBrVS9q0mk0B) – du buchst niemals selbst.

Hier sind die Studioinformationen:\n\n${leistungen}`,
},
    { role: "user", content: userMessage },
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages,
  });

  return response.choices[0].message.content;
}

module.exports = { chatHandler };

