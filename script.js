async function askAI() {
  const query = document.getElementById('query').value;
  const answerBox = document.getElementById('answer');
  answerBox.innerText = "Loading...";

  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const data = await res.json();
    answerBox.innerText = data.answer || "No response";
  } catch (err) {
    answerBox.innerText = "Error: " + err.message;
  }
}

// Demo news feed (static for now)
document.getElementById('news').innerHTML = `
  <div class="news-item">Entrackr: CityMall to raise $38M in Series D</div>
  <div class="news-item">YourStory: Blue Tokai raises $25M in funding</div>
  <div class="news-item">Inc42: UPI crosses 20B monthly transactions</div>
`;
