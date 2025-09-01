async function askAI() {
  const query = document.getElementById('query').value;
  const res = await fetch(`/api/ask?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  document.getElementById('results').innerText = data.answer || "No answer";
}