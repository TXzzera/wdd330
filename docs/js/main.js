console.log("main.js loaded!");

// Detect base path (root ou subpasta)
const pathParts = location.pathname.split("/");
const basePath = pathParts.length > 3 ? "../" : "./";
const path = window.location.pathname.toLowerCase();

// Load partials dynamically
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

// Load page-specific JS modules
async function initModules() {
  try {
    if (path.includes('index.html') || path === '/' || path.endsWith('/docs/')) {
      const rankingModule = await import('./ranking.js');
      rankingModule.loadTopTwenty();
    }

    if (path.includes('/playlists')) {
      await import('./playlist.js');
    }

    if (path.includes('/lyrics')) {
      const lyricsModule = await import('./lyrics.js');
      lyricsModule.initLyricsPage();
    }

    if (path.includes('/account')) {
      await import('./account.js');
    }

    try {
      await import('./search.js');
    } catch (e) {
      console.warn("Search module not loaded:", e);
    }

  } catch (e) {
    console.error("Error loading modules:", e);
  }
}

// Main init
async function init() {
  await loadPartial('header-base', `${basePath}partials/header.html`);
  await loadPartial('nav-base', `${basePath}partials/nav.html`);
  await loadPartial('footer-base', `${basePath}partials/footer.html`);
  await initModules();
}

document.addEventListener('DOMContentLoaded', init);
