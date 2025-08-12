import { getTopTracks } from './api/lastfmApi.js';
import { spotifyApiFetch } from './api/spotifyApi.js';

const musicGrid = document.getElementById("music-grid");
const seeMoreBtn = document.querySelector(".see-more-btn");

async function loadRanking(limit = 20) {
  try {
    const tracks = await getTopTracks(limit);

    musicGrid.innerHTML = "";

    for (const track of tracks) {
      const q = `${track.name} ${track.artist.name}`;
      let spotifyData;
      try {
        const res = await spotifyApiFetch(`search?q=${encodeURIComponent(q)}&type=track&limit=1`);
        spotifyData = res.tracks.items[0];
      } catch {
        spotifyData = null;
      }

      const musicCard = document.createElement("div");
      musicCard.classList.add("music-card");

      musicCard.innerHTML = `
        <img src="${spotifyData?.album?.images[0]?.url || 'images/default-album.png'}" alt="Album cover" />
        <h3>${track.name}</h3>
        <p>${track.artist.name}</p>
        <button class="btn listen-btn" data-track-id="${spotifyData?.id || ''}">Listen</button>
      `;

      musicGrid.appendChild(musicCard);
    }

  } catch (err) {
    musicGrid.innerHTML = "<p>Failed to load ranking. Try again later.</p>";
    console.error(err);
  }
}

seeMoreBtn?.addEventListener("click", () => {
  alert("See more not implemented yet.");
});

document.addEventListener("DOMContentLoaded", () => {
  loadRanking();
});
