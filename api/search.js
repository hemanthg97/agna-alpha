async function askAI() {
  const query = document.getElementById("query").value;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!res.ok) {
      throw new Error("Request failed: " + res.statusText);
    }

    const data = await res.json();

    resultsDiv.innerHTML = `
      <div class="card">
        <h3>AI Answer</h3>
        <p>${data.answer}</p>
      </div>
      <div class="card">
        <h3>Latest Headlines</h3>
        <ul>
          ${data.news.map(n => `<li><a href="${n.url}" target="_blank">${n.title}</a></li>`).join("")}
        </ul>
      </div>
    `;
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}