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
  content: `Du bist ein freundlicher, geduldiger Beauty-Experte bei Luminous Studio.

Wenn jemand fragt, wie man einen Termin buchen kann, **antworte immer mit diesem klickbaren Link in pinker Farbe**:

<a href="https://beautinda.de/salon/B12kT0zgdBrVS9q0mk0B" class="text-pink-500 font-semibold underline">Jetzt Termin buchen</a>

⚠️ Du buchst niemals selbst Termine. Verweise ausschließlich auf den Link oben.

Beantworte auch Fragen zu Behandlungen, Preisen und Abläufen sympathisch und professionell.

Hier sind die Studioinformationen:

${leistungen}`
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

