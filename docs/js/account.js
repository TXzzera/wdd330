import { authorizeSpotify, getTokenFromUrl, saveToken, getToken } from './api/spotifyApi.js';

const accountContainer = document.getElementById("account-container");

function renderAccountDetails(profile) {
  if (!accountContainer) return;

  accountContainer.innerHTML = `
    <h2>${profile.display_name || profile.id}</h2>
    <p>Email: ${profile.email || "Not provided"}</p>
    <img src="${profile.images?.[0]?.url || 'images/user-placeholder.png'}" alt="User avatar" style="width:80px; border-radius:50%">
    <button id="logout-btn">Logout</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("spotify_access_token");
    location.reload();
  });
}

async function fetchSpotifyProfile(token) {
  const res = await fetch("https://api.spotify.com/v1/me", {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to fetch Spotify profile");
  return res.json();
}

async function initAccount() {
  let token = getToken();

  const tokenFromUrl = getTokenFromUrl();
  if (tokenFromUrl) {
    saveToken(tokenFromUrl);
    token = tokenFromUrl;
    history.replaceState(null, "", location.pathname);
  }

  if (!token) {
    if (accountContainer) {
      accountContainer.innerHTML = `<button id="login-btn">Connect with Spotify</button>`;
      document.getElementById("login-btn").addEventListener("click", () => {
        authorizeSpotify();
      });
    }
    return;
  }

  try {
    const profile = await fetchSpotifyProfile(token);
    renderAccountDetails(profile);
  } catch (err) {
    console.error(err);
    localStorage.removeItem("spotify_access_token");
    location.reload();
  }
}

document.addEventListener("DOMContentLoaded", initAccount);
