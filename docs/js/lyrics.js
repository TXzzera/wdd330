import { searchSong, fetchLyricsFromUrl } from '../apis/geniusApi.js';
import { searchVideo } from '../apis/youtubeApi.js';

export async function initLyricsPage() {
    const songEl = document.querySelector(".lyrics-info .song");
    const artistEl = document.querySelector(".lyrics-info .artist");
    const showLyricsBtn = document.getElementById("show-lyrics");
    const showTranslationBtn = document.getElementById("show-translations");
    const videoContainer = document.querySelector(".video-container");

    if (!songEl || !artistEl || !showLyricsBtn || !showTranslationBtn || !videoContainer) {
        console.error("Lyrics page elements not found");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const song = params.get("song");
    const artist = params.get("artist");

    if (!song || !artist) {
        songEl.textContent = "No song selected";
        artistEl.textContent = "Please search for a song or select one from the homepage.";
        videoContainer.innerHTML = "";
        return;
    }

    let currentLyrics = "Loading lyrics...";
    let currentTranslation = "Loading translation...";

    songEl.textContent = song;
    artistEl.textContent = artist;

    async function loadLyrics() {
        try {
            const hits = await searchSong(song, artist);
            if (hits.length > 0) {
                currentLyrics = await fetchLyricsFromUrl(hits[0].result.url);
                currentTranslation = currentLyrics;
            } else {
                currentLyrics = "Lyrics not found.";
                currentTranslation = "Translation not available.";
            }
            updateLyricsDisplay(false);
        } catch (err) {
            console.error(err);
            currentLyrics = "Error loading lyrics.";
            currentTranslation = "Error loading translation.";
            updateLyricsDisplay(false);
        }
    }

    function updateLyricsDisplay(showTranslation = false) {
        songEl.textContent = showTranslation ? currentTranslation : currentLyrics;
    }

    async function loadVideo() {
        try {
            const video = await searchVideo(`${song} ${artist} official music video`);
            if (video) {
                const videoId = video.id.videoId;
                videoContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" 
                  title="YouTube video player" frameborder="0" allowfullscreen></iframe>`;
            } else {
                videoContainer.innerHTML = "<p>Video not found.</p>";
            }
        } catch (err) {
            console.error(err);
            videoContainer.innerHTML = "<p>Error loading video.</p>";
        }
    }

    await loadLyrics();
    await loadVideo();

    showLyricsBtn.addEventListener("click", () => updateLyricsDisplay(false));
    showTranslationBtn.addEventListener("click", () => updateLyricsDisplay(true));
}
