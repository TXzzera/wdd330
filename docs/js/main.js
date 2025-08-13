const path = window.location.pathname.toLowerCase();
console.log("main.js foi carregado!");

async function loadPartial(id, url) {
  const response = await fetch(url);
  if (response.ok) {
    const html = await response.text();
    document.getElementById(id).innerHTML = html;
  } else {
    console.error(`Failed to load partial ${url}`);
  }
}

async function loadModule(modulePath) {
  try {
    await import(modulePath);
  } catch (e) {
    console.error(`Error loading module ${modulePath}`, e);
  }
}

async function init() {
  // Primeiro carrega os partials
  await loadPartial('header-base', '/docs/partials/header.html');
  await loadPartial('nav-base', '/docs/partials/nav.html');
  await loadPartial('footer-base', '/docs/partials/footer.html');

  // Só depois importa os módulos que usam esses partials
  await loadModule('./search.js');

  if (path === '/' || path.endsWith('/index.html') || path.endsWith('/docs/') || path.endsWith('/docs/index.html')) {
    await loadModule('./ranking.js');
  }

  if (path.includes('/playlists')) {
    await loadModule('./playlists.js');
  }

  if (path.includes('/lyrics')) {
    await loadModule('./lyrics.js');
  }

  if (path.includes('/account')) {
    await loadModule('./account.js');
  }
}

// Espera o DOM estar pronto, aí chama init()
document.addEventListener('DOMContentLoaded', init);
