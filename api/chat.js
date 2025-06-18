const { chatHandler } = require("../openaiClient");

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
      const reply = await chatHandler(data.message);
      res.status(200).json({ reply });
    } catch (err) {
      console.error("Fehler in /api/chat:", err);
      res.status(500).json({ error: "Serverfehler" });
    }
  });
};
