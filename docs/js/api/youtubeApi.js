// youtubeApi.js
// Author: Bruno Teixeira
// Purpose: Search YouTube videos

export const YOUTUBE_API_KEY = "AIzaSyCOVwKaKjOY_DNhj7blxXrySfwwp8Bx_as";

/**
 * Search for a YouTube video
 * @param {string} query - Search query
 * @returns {Promise<object|null>} - Video object or null
 */
export async function searchVideo(query) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch YouTube video");
        const data = await res.json();
        return data.items[0] || null;
    } catch (err) {
        console.error("YouTube API error:", err);
        return null;
    }
}
