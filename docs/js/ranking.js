import { getTopTracks } from './apis/lastfmApi.js';

function createMusicCards(tracks, container) {
  container.innerHTML = "";

  tracks.forEach(track => {
    const artistName = track.artist?.name || "Unknown Artist";
    const albumImage = track.image?.[2]?.["#text"] || 'images/default-album.png';

    const musicCard = document.createElement("div");
    musicCard.classList.add("music-card");
    musicCard.innerHTML = `
      <img src="${albumImage}" alt="Album cover" />
      <h3>${track.name}</h3>
      <p>${artistName}</p>
      <button class="listen-btn">Listen</button>
    `;

    // Button click event
    musicCard.querySelector(".listen-btn").addEventListener("click", () => {
      const url = `lyrics/index.html?artist=${encodeURIComponent(artistName)}&song=${encodeURIComponent(track.name)}`;
      window.location.href = url;
    });

    container.appendChild(musicCard);
  });
}

export async function loadTopTwenty() {
  const musicGrid = document.getElementById("music-grid");
  if (!musicGrid) {
    console.error("music-grid element not found in DOM");
    return;
  }

  console.log("Loading top tracks...");

  try {
    const tracks = await getTopTracks(20);
    if (!tracks.length) {
      musicGrid.innerHTML = "<p>No tracks found.</p>";
      return;
    }
    createMusicCards(tracks, musicGrid);
  } catch (err) {
    musicGrid.innerHTML = "<p>Failed to load ranking. Try again later.</p>";
    console.error("Error fetching top tracks:", err);
  }
}
