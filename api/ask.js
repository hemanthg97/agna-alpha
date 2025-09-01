// api/ask.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  try {
    const { query } = req.body;

    // 🔑 API keys from Vercel Environment Variables
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const NEWS_API_KEY = process.env.NEWS_API_KEY;

    // 1. Fetch latest news
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?language=en&pageSize=5&apiKey=${NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    // Extract top headlines
    const headlines = newsData.articles
      .map((a, i) => `${i + 1}. ${a.title}`)
      .join("\n");

    // 2. Ask OpenAI to summarize + answer query
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful news assistant." },
          {
            role: "user",
            content: `Here are today's top headlines:\n${headlines}\n\nUser's question: ${query}`,
          },
        ],
      }),
    });

    const aiData = await aiRes.json();
    const aiAnswer =
      aiData.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate an answer.";

    res.status(200).json({ headlines: newsData.articles, answer: aiAnswer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
