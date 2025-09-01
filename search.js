export default async function handler(req, res) {
  try {
    const { query } = req.query;
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: `Summarize the latest business/startup news about: ${query}` }],
        max_tokens: 150
      })
    });
    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No answer";
    res.status(200).json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
