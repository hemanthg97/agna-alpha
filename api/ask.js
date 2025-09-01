export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { query } = req.body;

  try {
    // Fetch latest news from NewsAPI
    const newsRes = await fetch(
      `https://newsapi.org/v2/top-headlines?country=in&apiKey=${process.env.NEWS_API_KEY}`
    );
    const newsData = await newsRes.json();

    const headlines = newsData.articles
      ? newsData.articles.slice(0, 5).map((a) => a.title)
      : ["No news available"];

    // Ask OpenAI
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Answer briefly: ${query}` }],
      }),
    });

    const aiData = await aiRes.json();
    const answer =
      aiData.choices?.[0]?.message?.content || "No response from AI";

    res.status(200).json({ answer, headlines });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
