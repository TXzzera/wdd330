const input = document.querySelector(".search-bar input");

if (!input) {
  console.warn("search.js: .search-bar not found.");
} else {
  let dropdown;
  let debounceTimeout;

  dropdown = document.createElement("div");
  dropdown.classList.add("search-dropdown");
  input.parentNode.style.position = "relative";
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

  async function handleInput() {
    const query = input.value.trim();
    if (!query) return clearDropdown();

    dropdown.innerHTML = "";

    try {
      const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to fetch from Genius proxy");

      const data = await res.json();
      const hits = data.response?.hits || [];

      if (hits.length) {
        const header = document.createElement("div");
        header.classList.add("dropdown-header");
        header.textContent = "Songs";
        dropdown.appendChild(header);

        hits.forEach(hit => {
          const songTitle = hit.result?.title || "Unknown Song";
          const artistName = hit.result?.primary_artist?.name || "Unknown Artist";
          const item = createSuggestionItem(`${songTitle} — ${artistName}`, () => {
            window.location.href = `/docs/lyrics/index.html?song=${encodeURIComponent(songTitle)}&artist=${encodeURIComponent(artistName)}`;
          });
          dropdown.appendChild(item);
        });
      } else {
        dropdown.appendChild(createSuggestionItem("No results found", () => {}));
      }

      dropdown.style.display = "block";
    } catch (err) {
      console.error("Search error:", err);
      clearDropdown();
    }
  }

  function debounce(func, delay) {
    return (...args) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => func(...args), delay);
    };
  }

  document.addEventListener("click", e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) clearDropdown();
  });

  input.addEventListener("input", debounce(handleInput, 300));
}
