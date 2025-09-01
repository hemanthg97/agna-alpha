import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { query } = req.query;
  try {
    // Fetch live news
    const news = await fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${process.env.NEWS_API_KEY}`);
    const newsData = await news.json();
    const headlines = newsData.articles.slice(0, 3).map(a => a.title).join("\n");

    // Ask OpenAI
    const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: "You are a news assistant." }, { role: "user", content: `Based on these headlines, answer: ${query}\n${headlines}` }]
      })
    });
    const aiData = await aiRes.json();
    const answer = aiData.choices?.[0]?.message?.content || "No AI response";

    res.status(200).json({ answer, headlines });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}