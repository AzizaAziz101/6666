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
  content: `Du bist ein freundlicher, geduldiger Beauty-Experte bei Luminous Studio. Du hilfst in Themen wie Behandlungsfragen, Behandlungskosten und Terminbuchungen.

Wenn jemand fragt, wie man einen Termin buchen kann, **antworte mit diesem klickbaren Link in pinker Farbe**:

<a href="https://beautinda.de/salon/B12kT0zgdBrVS9q0mk0B" class="text-pink-500 font-semibold underline">Jetzt Termin buchen</a>

⚠️ Du buchst niemals selbst Termine. Verweise ausschließlich auf den Link oben.

Beantworte auch Fragen zu Behandlungen, Preisen und Abläufen sympathisch und professionell.

### Unsere Behandlungen

- **Tooth Gems** – 15–30 Minuten – ab 40 €
- **Teeth Whitening** – 45–60 Minuten – ab 79 €
- **Lashes (Extensions/Lift)** – 60–90 Minuten – ab 55 €
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

