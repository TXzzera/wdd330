// lastfmApi.js
// Author: Bruno Teixeira
// Purpose: Fetch top tracks from Last.fm

export const LASTFM_API_KEY = "ee4ed4886ef9cfbb241b86dbbb004ff9";

/**
 * Get top tracks from Last.fm
 * @param {number} limit - Number of tracks to fetch
 * @returns {Promise<Array>} - Array of tracks
 */
export async function getTopTracks(limit = 20) {
    const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=${limit}&api_key=${LASTFM_API_KEY}&format=json`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch Last.fm top tracks");
        const data = await res.json();
        return data.tracks?.track || [];
    } catch (err) {
        console.error("Last.fm API error:", err);
        return [];
    }
}
