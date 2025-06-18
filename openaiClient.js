import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const leistungen = fs.readFileSync('leistungen.txt', 'utf-8');

export async function chatHandler(userMessage) {
  const messages = [
    {
      role: 'system',
      content: `Du bist der Assistent vom BellaCare Studio. Beantworte Fragen basierend auf diesen Informationen:\n${leistungen}`
    },
    { role: 'user', content: userMessage }
  ];

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages
  });

  return response.choices[0].message.content;
}