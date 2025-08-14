// main.js
console.log("main.js loaded!");

// Detect base path relative to docs root
function getBasePath() {
    const pathParts = window.location.pathname.split("/").filter(p => p);

    // If at docs root (e.g., /docs/index.html), return ""
    if (pathParts.length <= 2) return "";

    // Otherwise, return "../" repeated for depth relative to docs/
    const depth = pathParts.length - 2;
    return "../".repeat(depth);
}

// Load a partial HTML file and replace {basePath}
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

// Initialize page and load JS modules dynamically
async function init() {
    const base = getBasePath();

    // Load partials
    await loadPartial('header-base', `${base}partials/header.html`);
    await loadPartial('nav-base', `${base}partials/nav.html`);
    await loadPartial('footer-base', `${base}partials/footer.html`);

    const path = window.location.pathname.toLowerCase();

    try {
        // Homepage
        if (path.endsWith("index.html") || path === "/" || path.endsWith("/docs/")) {
            const rankingModule = await import(`${base}js/ranking.js`);
            rankingModule.loadTopTwenty();
        }

        // Playlists page
        if (path.includes("/playlists/")) {
            await import(`${base}js/playlist.js`);
        }

        // Lyrics page
        if (path.includes("/lyrics/")) {
            const lyricsModule = await import(`${base}js/lyrics.js`);
            lyricsModule.initLyricsPage();
        }

        // Account pages (index, login, signup)
        if (path.includes("/account/")) {
            await import(`${base}js/account.js`);
        }

    } catch (err) {
        console.error("Error loading module:", err);
    }
}

// Run after DOM content is fully loaded
document.addEventListener("DOMContentLoaded", init);
