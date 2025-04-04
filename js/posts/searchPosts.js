import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

export async function searchPosts(query) {
  if (!query) {
    console.error("Search query cannot be empty.");
    return [];
  }

  const searchUrl = `${BASE_URL}social/posts/search?q=${encodeURIComponent(
    query
  )}`;
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    console.warn("Access token is missing.");
    alert("You must be logged in to search.");
    return [];
  }

  try {
    const response = await fetch(searchUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        console.warn("Invalid or expired token. Please check your login.");
        alert("Your session may have expired. Try logging in again.");
        return [];
      }
      throw new Error(`Error searching posts: ${response.statusText}`);
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Search request failed:", error);
    return [];
  }
}
