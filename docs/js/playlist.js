// playlist.js

const LIKE_GRID = document.getElementById("like-grid");
const LAST_GRID = document.getElementById("last-grid");
const FEAT_GRID = document.getElementById("feat-grid");

/**
 * Get the currently logged-in username
 * @returns {string} username or "guest"
 */
function getCurrentUser() {
  const profile = JSON.parse(localStorage.getItem("user_profile") || "null");
  return profile?.username || "guest";
}

/**
 * Get a specific type of playlist for the current user
 * @param {string} type - "liked_playlists", "last_playlists", "featured_playlists"
 * @returns {Array} list of playlists
 */
function getUserPlaylists(type) {
  const user = getCurrentUser();
  return JSON.parse(localStorage.getItem(`${type}_${user}`) || "[]");
}

/**
 * Save a specific type of playlist for the current user
 * @param {string} type
 * @param {Array} playlists
 */
function saveUserPlaylists(type, playlists) {
  const user = getCurrentUser();
  localStorage.setItem(`${type}_${user}`, JSON.stringify(playlists));
}

/**
 * Render playlists into a specific grid element
 * @param {HTMLElement} grid
 * @param {Array} playlists
 */
function renderGrid(grid, playlists) {
  grid.innerHTML = "";
  playlists.forEach(pl => {
    const div = document.createElement("div");
    div.classList.add("playlist-card");
    div.innerHTML = `<h4>${pl.name}</h4><p>${pl.description || ""}</p>`;
    grid.appendChild(div);
  });
}

/**
 * Load all playlists for the current user
 */
function loadPlaylists() {
  const liked = getUserPlaylists("liked_playlists");
  const last = getUserPlaylists("last_playlists");
  const featured = getUserPlaylists("featured_playlists");

  renderGrid(LIKE_GRID, liked);
  renderGrid(LAST_GRID, last);
  renderGrid(FEAT_GRID, featured);
}

/**
 * Add a playlist to a specific type for the current user
 * @param {string} type - playlist type
 * @param {Object} playlist - playlist object {name, description}
 */
function addPlaylist(type, playlist) {
  const playlists = getUserPlaylists(type);
  playlists.push(playlist);
  saveUserPlaylists(type, playlists);
  loadPlaylists(); // refresh display
}

document.addEventListener("DOMContentLoaded", () => {
  loadPlaylists();
});
