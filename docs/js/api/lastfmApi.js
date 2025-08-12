export const LASTFM_API_KEY = "ee4ed4886ef9cfbb241b86dbbb004ff9";

export async function getTopTracks(limit = 20) {
  const url = `https://ws.audioscrobbler.com/2.0/?method=chart.gettoptracks&limit=${limit}&api_key=${LASTFM_API_KEY}&format=json`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch Last.fm top tracks");
  const data = await response.json();
  return data.tracks.track;
}
