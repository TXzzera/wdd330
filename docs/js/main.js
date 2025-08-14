const path = window.location.pathname.toLowerCase();

async function loadPartial(id, url) {
  const response = await fetch(url);
  if (response.ok) {
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } else {
    console.error(`Failed to load partial ${url}`);
  }
}

async function init() {
  // Load header, nav, footer
  await loadPartial('header-base', '/docs/partials/header.html');
  await loadPartial('nav-base', '/docs/partials/nav.html');
  await loadPartial('footer-base', '/docs/partials/footer.html');

  // Load search module
  try {
    await import('./search.js');
  } catch (e) {
    console.error("Error loading search.js", e);
  }

  // Load homepage modules
  if (path.includes('index.html') || path === '/' || path.endsWith('/docs/')) {
    try {
      const rankingModule = await import('./ranking.js');
      rankingModule.loadTopTwenty();
    } catch (e) {
      console.error("Error loading ranking.js", e);
    }
  }

  // Load other page modules
  if (path.includes('/playlists')) {
    await import('./playlist.js').catch(e => console.error(e));
  }

 if (path.includes('/lyrics')) {
  const lyricsModule = await import('./lyrics.js');
  lyricsModule.initLyricsPage(); 
}


  if (path.includes('/account')) {
    await import('./account.js').catch(e => console.error(e));
  }
}

document.addEventListener('DOMContentLoaded', init);
