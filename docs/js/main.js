// main.js
console.log("main.js loaded!");

// Detect the current base path relative to docs folder
function getBasePath() {
    const pathParts = window.location.pathname.split("/");
    const depth = pathParts.includes("docs") ? pathParts.length - pathParts.indexOf("docs") - 2 : 0;
    return "../".repeat(depth);
}

// Load partial HTML and replace {basePath}
async function loadPartial(id, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        let html = await response.text();
        const basePath = getBasePath();
        html = html.replace(/{basePath}/g, basePath);
        document.getElementById(id).innerHTML = html;
    } catch (err) {
        console.error(err);
    }
}

// Initialize page
async function init() {
    // Load partials
    await loadPartial('header-base', `${getBasePath()}partials/header.html`);
    await loadPartial('nav-base', `${getBasePath()}partials/nav.html`);
    await loadPartial('footer-base', `${getBasePath()}partials/footer.html`);

    // Determine which page is loaded
    const path = window.location.pathname.toLowerCase();

    try {
        // Homepage
        if (path.endsWith("index.html") && path.includes("/docs/index.html")) {
            const rankingModule = await import(`${getBasePath()}js/ranking.js`);
            rankingModule.loadTopTwenty();
        }

        // Playlists page
        if (path.includes("/playlists/")) {
            await import(`${getBasePath()}js/playlist.js`);
        }

        // Lyrics page
        if (path.includes("/lyrics/")) {
            const lyricsModule = await import(`${getBasePath()}js/lyrics.js`);
            lyricsModule.initLyricsPage();
        }

        // Account pages
        if (path.includes("/account/")) {
            await import(`${getBasePath()}js/account.js`);
        }

    } catch (err) {
        console.error("Error loading module:", err);
    }
}

// Run after DOM loaded
document.addEventListener("DOMContentLoaded", init);
