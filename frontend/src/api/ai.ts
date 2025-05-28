export async function askAI(message: string): Promise<string> {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    return data.answer || "Pas de réponse.";
  } catch (error) {
    return "Erreur lors de la communication avec l'IA. Réessayez plus tard.";
  }
} 