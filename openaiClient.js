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
      content: `Du bist ein freundlicher, geduldiger Beauty-Experte im BellaCare Studio. Antworte sympathisch und professionell. Hier sind Infos:\n\n${leistungen}`,
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

