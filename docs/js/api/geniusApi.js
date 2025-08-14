// geniusApi.js
// Author: Bruno Teixeira
// Purpose: Search for songs and fetch lyrics from Genius API via backend

/**
 * Search for a song using the backend proxy
 * @param {string} song - Song title
 * @param {string} artist - Artist name
 * @returns {Promise<Array>} - Array of hits
 */
export async function searchSong(song, artist) {
    const query = encodeURIComponent(`${song} ${artist}`);
    const url = `/search?q=${query}`; // Calls backend proxy

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to search Genius API");
        const data = await res.json();
        return data.response?.hits || [];
    } catch (err) {
        console.error("Genius API error:", err);
        return [];
    }
}

/**
 * Get the lyrics page URL from a hit
 * @param {object} hit - A hit object from Genius API
 * @returns {string} - URL of the lyrics page
 */
export function getLyricsUrl(hit) {
    return hit.result?.url || "";
}

/**
 * Fetch lyrics from a Genius page URL
 * @param {string} url - Lyrics page URL
 * @returns {Promise<string>} - Lyrics text
 */
export async function fetchLyricsFromUrl(url) {
    try {
        const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        if (!res.ok) throw new Error("Failed to fetch lyrics page");

        const data = await res.json();

        // Extract lyrics using regex
        const match = data.contents.match(/<div class="lyrics">([\s\S]*?)<\/div>/) ||
                      data.contents.match(/<div data-lyrics-container="true">([\s\S]*?)<\/div>/g);
        if (!match) return "Lyrics not found.";

        // Clean HTML tags
        return match.map(m => m.replace(/<[^>]+>/g, '')).join("\n").trim();
    } catch (err) {
        console.error("Error fetching lyrics:", err);
        return "Lyrics not available.";
    }
}
