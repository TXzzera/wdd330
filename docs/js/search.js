import { spotifyApiFetch, authorizeSpotify, getTokenFromUrl, saveToken, getToken } from './api/spotifyApi.js';

const input = document.querySelector(".search-bar input");

if (input) {
  let dropdown;
  let debounceTimeout;

  dropdown = document.createElement("div");
  dropdown.classList.add("search-dropdown");
  input.parentNode.appendChild(dropdown);

  function clearDropdown() {
    dropdown.innerHTML = "";
    dropdown.style.display = "none";
  }

  function createSuggestionItem(text, onClick) {
    const div = document.createElement("div");
    div.classList.add("suggestion-item");
    div.textContent = text;
    div.addEventListener("click", onClick);
    return div;
  }

  async function searchSpotify(query) {
    if (!query) {
      clearDropdown();
      return;
    }
    try {
      const res = await spotifyApiFetch(`search?q=${encodeURIComponent(query)}&type=track,artist,album&limit=5`);
      return res;
    } catch (e) {
      console.error("Spotify search error:", e);
      clearDropdown();
      return null;
    }
  }

  function redirectToLyrics(song, artist) {
    const url = `/docs/lyrics/index.html?song=${encodeURIComponent(song)}&artist=${encodeURIComponent(artist)}`;
    window.location.href = url;
  }

  function debounce(func, delay) {
    return (...args) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func(...args), delay);
    };
  }

  async function handleInput() {
    const query = input.value.trim();
    if (!query) {
      clearDropdown();
      return;
    }

    let token = getToken();
    if (!token) {
      authorizeSpotify();
      return;
    }

    const results = await searchSpotify(query);
    if (!results) return;

    dropdown.innerHTML = "";

    if (results.artists && results.artists.items.length) {
      const header = document.createElement("div");
      header.classList.add("dropdown-header");
      header.textContent = "Artists";
      dropdown.appendChild(header);
      results.artists.items.forEach(artist => {
        const item = createSuggestionItem(artist.name, () => {
          redirectToLyrics("", artist.name);
        });
        dropdown.appendChild(item);
      });
    }

    if (results.tracks && results.tracks.items.length) {
      const header = document.createElement("div");
      header.classList.add("dropdown-header");
      header.textContent = "Tracks";
      dropdown.appendChild(header);
      results.tracks.items.forEach(track => {
        const item = createSuggestionItem(`${track.name} — ${track.artists[0].name}`, () => {
          redirectToLyrics(track.name, track.artists[0].name);
        });
        dropdown.appendChild(item);
      });
    }

    if (results.albums && results.albums.items.length) {
      const header = document.createElement("div");
      header.classList.add("dropdown-header");
      header.textContent = "Albums";
      dropdown.appendChild(header);
      results.albums.items.forEach(album => {
        const item = createSuggestionItem(`${album.name} — ${album.artists[0].name}`, () => {
          redirectToLyrics("", album.artists[0].name);
        });
        dropdown.appendChild(item);
      });
    }

    dropdown.style.display = "block";
  }

  document.addEventListener("click", (e) => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) {
      clearDropdown();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    const token = getTokenFromUrl();
    if (token) {
      saveToken(token);
      history.replaceState(null, "", location.pathname);
    }

    input.addEventListener("input", debounce(handleInput, 400));
  });

} else {
  console.warn("search.js: .search-bar not found. Skipping search logic.");
}
