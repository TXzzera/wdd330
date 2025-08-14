// main.js
const path = window.location.pathname.toLowerCase();
console.log("main.js loaded!");

// Function to load partials relative to the current file
async function loadPartial(id, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to load ${url}`);
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } catch (err) {
    console.error(err);
  }
}

async function init() {
  // ⚡ Use relative paths for GitHub Pages
  await loadPartial('header-base', './partials/header.html');
  await loadPartial('nav-base', './partials/nav.html');
  await loadPartial('footer-base', './partials/footer.html');

  // Load JS modules only if needed
  try {
    // Homepage
    if (path.includes('index.html') || path === '/' || path.endsWith('/docs/')) {
      const rankingModule = await import('./ranking.js');
      rankingModule.loadTopTwenty();
    }

    // Playlists
    if (path.includes('/playlists')) {
      await import('./playlist.js');
    }

    // Lyrics
    if (path.includes('/lyrics')) {
      const lyricsModule = await import('./lyrics.js');
      lyricsModule.initLyricsPage();
    }

    // Account
    if (path.includes('/account')) {
      await import('./account.js');
    }

  } catch (e) {
    console.error("Error loading module:", e);
  }
}

// Wait for the DOM to be ready
document.addEventListener('DOMContentLoaded', init);
