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

async function initModules(path) {
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
  } catch (e) {
    console.error("Error loading module:", e);
  }
}

async function init() {
  // Compute base path depending on the page location
  const pathParts = window.location.pathname.split('/');
  const basePath = pathParts.length > 3 
    ? '../'  // subfolder like /lyrics/, /account/, /playlists/
    : './';   // root folder

  // Load partials with correct relative paths
  await loadPartial('header-base', `${basePath}partials/header.html`);
  await loadPartial('nav-base', `${basePath}partials/nav.html`);
  await loadPartial('footer-base', `${basePath}partials/footer.html`);

  // Path for modules
  const path = window.location.pathname.toLowerCase();
  await initModules(path);
}

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', init);
