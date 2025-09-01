// Load live news
async function loadNews() {
  try {
    const res = await fetch('/api/news');
    const data = await res.json();
    const container = document.getElementById('newsContainer');
    container.innerHTML = '';
    data.articles.forEach(article => {
      const div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <img src="${article.urlToImage || 'https://via.placeholder.com/400x200'}" alt="news"/>
        <h3>${article.title}</h3>
        <p>${article.description || ''}</p>
      `;
      container.appendChild(div);
    });
  } catch (err) {
    console.error(err);
  }
}

// Handle AI search
async function handleSearch() {
  const input = document.getElementById('searchInput').value;
  const resultBox = document.getElementById('aiResult');
  resultBox.innerText = "Loading...";
  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(input)}`);
    const data = await res.json();
    resultBox.innerText = data.result || data.error || "No response";
  } catch (err) {
    resultBox.innerText = "Error: " + err.message;
  }
}

document.getElementById('searchBtn').addEventListener('click', handleSearch);
window.onload = loadNews;
