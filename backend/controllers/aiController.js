import OpenAI from "openai";

export const askAI = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message requis" });

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Tu es un assistant utile pour les freelances et clients sur une plateforme de mise en relation. Réponds de façon concise et utile." },
        { role: "user", content: message },
      ],
      max_tokens: 300,
      temperature: 0.7,
    });
    res.json({ answer: completion.choices[0]?.message?.content || "Pas de réponse." });
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    res.status(500).json({ error: "Erreur lors de la communication avec l'IA." });
  }
}; 