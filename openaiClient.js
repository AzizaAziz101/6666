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
  content: `Du bist ein freundlicher, geduldiger Selbstbewusstsein-Experte bei Confidence.Digital. Du hilfst in Themen wie Behandlungsfragen, psycholgische weiterentwicklung, dreist zu sein im Alltag um sich zu nehmen was man braucht.

Wenn jemand fragt, wie man einen Termin buchen kann, **antworte mit diesem klickbaren Link in pinker Farbe**:

<a href="https://selbst.vercel.app/" class="text-pink-500 font-semibold underline">Jetzt Termin buchen</a>

⚠️ Du buchst niemals selbst Termine. Verweise ausschließlich auf den Link oben.

Beantworte auch Fragen zur Entwicklung von Strukturen, Abläufen und positven Systemen im Alltag sympathisch und professionell.

### Unsere Behandlungen

Psychoedukation Sucht
Mensch-Tier-Ambulanz
Messies Selbsthilfegruppe und Interventionsgruppe
Chronische Schmerzen
StimmenhoererInnen
Antiaggression
Entspannung, Autogenes Training und Körperwahrnehmung
Konzentration und Kognitives Training
Intensiv Workshop fuer chronische Schmerzen und chronische Erkrankungen
Anorexia Nervosa Essstoerungsgruppe
`
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

