import { BASE_URL } from "../api/api.js";

/**
 * Search for posts using a search query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} A list of posts matching the search query.
 */

export async function searchPosts(query) {
  if (!query) {
    console.error("Query cannot be empty.");
    return [];
  }

  const url = `${BASE_URL}social/posts?q=${encodeURIComponent(query)}`;

  // Hent accessToken fra f.eks. localStorage
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error("Access token is missing.");
    return [];
  }

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching posts: ${response.statusText}`);
    }

    const results = await response.json();
    console.log(results);
    return results;
  } catch (error) {
    console.error(error);
    return [];
  }
}
