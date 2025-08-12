export const YOUTUBE_API_KEY = "AIzaSyCOVwKaKjOY_DNhj7blxXrySfwwp8Bx_as";

export async function searchVideo(query) {
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}&type=video`;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch YouTube video");
  const data = await response.json();
  if (data.items.length === 0) return null;
  return data.items[0];
}
