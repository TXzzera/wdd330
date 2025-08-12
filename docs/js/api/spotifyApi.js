export const SPOTIFY_CLIENT_ID = "63761883f37149a68ac312a699bd35d1";
export const SPOTIFY_REDIRECT_URI = "https://txzzera.github.io/docs/callback.html";
export const SPOTIFY_SCOPES = "user-read-private user-read-email playlist-read-private";

const TOKEN_STORAGE_KEY = "spotify_access_token";

export async function authorizeSpotify() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}` +
    `&response_type=token&redirect_uri=${encodeURIComponent(SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SPOTIFY_SCOPES)}`;
  window.location.href = authUrl;
}

export function getTokenFromUrl() {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_STORAGE_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

export async function spotifyApiFetch(endpoint) {
  const token = getToken();
  if (!token) throw new Error("No Spotify token found");
  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(`Spotify API error: ${response.statusText}`);
  return response.json();
}
