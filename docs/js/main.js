const path = window.location.pathname.toLowerCase();
console.log("Caminho atual (window.location.pathname):", path);

async function loadModule(modulePath) {
  try {
    await import(modulePath);
  } catch (e) {
    console.error(`Error loading module ${modulePath}`, e);
  }
}

loadModule('./search.js');

if (path === '/' || path.endsWith('/index.html') || path.endsWith('/docs/') || path.endsWith('/docs/index.html')) {
  loadModule('./ranking.js');
}

if (path.includes('/playlists')) {
  loadModule('./playlists.js');

}

if (path.includes('/lyrics')) {
  loadModule('./lyrics.js');
}

if (path.includes('/account')) {
  loadModule('./account.js');
}
