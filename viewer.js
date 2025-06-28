
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// TODO: Replace with your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCkFlZ-HNhVx_vkG9DT461bZYg275ijQa0",
  authDomain: "uno-score-tracker.firebaseapp.com",
  projectId: "uno-score-tracker",
  storageBucket: "uno-score-tracker.firebasestorage.app",
  messagingSenderId: "502256969133",
  appId: "1:502256969133:web:067f671d5ff17bd3ca2d24"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const historyContainer = document.getElementById('historyContainer');
const searchInput = document.getElementById('searchInput');

async function loadGameHistory() {
  try {
    const q = query(collection(db, "games"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      historyContainer.innerHTML = "<p>No game history found.</p>";
      return;
    }

    historyContainer.innerHTML = "";
    snapshot.forEach(doc => {
      const data = doc.data();
      const div = document.createElement('div');
      div.className = "match";

      const date = new Date(data.timestamp);
      const sortedPlayers = Object.entries(data.scores || {}).sort((a, b) => a[1] - b[1]);


      let html = `<div class="date">${date.toLocaleString()}</div><ul>`;
      sortedPlayers.forEach(([name, score], index) => {
        html += `<li><strong>${index + 1}. ${name}</strong>: ${score} pts</li>`;
      });
      html += "</ul>";

      if (Array.isArray(data.history)) {

        html += "<details><summary>Game Scores</summary><ul>";
        data.history.forEach((game, i) => {

          html += `<li><strong>Game ${i + 1}:</strong> ` +
            Object.entries(game)
              .map(([p, s]) => `${p}: ${s}`)
              .join(", ") + "</li>";
        });
        html += "</ul></details>";
      }

      div.innerHTML = html;
      historyContainer.appendChild(div);
    });
  } catch (error) {
    historyContainer.innerHTML = `<p>Error loading history: ${error.message}</p>`;
  }
}

// Filter matches by player
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const matches = document.querySelectorAll(".match");
  matches.forEach(match => {
    match.classList.remove("filtered-out");
    if (!match.innerText.toLowerCase().includes(query)) {
      match.classList.add("filtered-out");
    }
  });
});

loadGameHistory();
