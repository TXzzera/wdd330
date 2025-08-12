const LIKE_GRID = document.getElementById("like-grid");
const LAST_GRID = document.getElementById("last-grid");
const FEAT_GRID = document.getElementById("feat-grid");

function loadPlaylists() {
  const liked = JSON.parse(localStorage.getItem("liked_playlists") || "[]");
  const last = JSON.parse(localStorage.getItem("last_playlists") || "[]");
  const featured = JSON.parse(localStorage.getItem("featured_playlists") || "[]");

  function renderGrid(grid, playlists) {
    grid.innerHTML = "";
    playlists.forEach(pl => {
      const div = document.createElement("div");
      div.classList.add("playlist-card");
      div.innerHTML = `<h4>${pl.name}</h4><p>${pl.description || ""}</p>`;
      grid.appendChild(div);
    });
  }

  renderGrid(LIKE_GRID, liked);
  renderGrid(LAST_GRID, last);
  renderGrid(FEAT_GRID, featured);
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlaylists();
});
