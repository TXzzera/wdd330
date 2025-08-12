import { searchVideo } from './api/youtubeApi.js';

const songEl = document.querySelector(".lyrics-info .song");
const artistEl = document.querySelector(".lyrics-info .artist");
const showLyricsBtn = document.getElementById("show-lyrics");
const showTranslationBtn = document.getElementById("show-translations");
const videoContainer = document.querySelector(".video-container");

let currentLyrics = "No lyrics available.";
let currentTranslation = "No translation available.";

function loadLyrics(song, artist) {
  currentLyrics = `Lyrics for ${song} by ${artist}`;
  currentTranslation = `Translation for ${song} by ${artist}`;
  updateLyricsDisplay();
}

function updateLyricsDisplay(showTranslation = false) {
  if (showTranslation) {
    songEl.textContent = currentTranslation;
  } else {
    songEl.textContent = currentLyrics;
  }
}

async function loadVideo(song, artist) {
  try {
    const video = await searchVideo(`${song} ${artist} official music video`);
    if (video) {
      const videoId = video.id.videoId;
      videoContainer.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" ` +
        `title="YouTube video player" frameborder="0" allowfullscreen></iframe>`;
    } else {
      videoContainer.innerHTML = "<p>No video found.</p>";
    }
  } catch (err) {
    console.error(err);
    videoContainer.innerHTML = "<p>Error loading video.</p>";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const song = params.get("song") || "Unknown Song";
  const artist = params.get("artist") || "Unknown Artist";

  artistEl.textContent = artist;
  loadLyrics(song, artist);
  loadVideo(song, artist);

  showLyricsBtn.addEventListener("click", () => updateLyricsDisplay(false));
  showTranslationBtn.addEventListener("click", () => updateLyricsDisplay(true));
});
