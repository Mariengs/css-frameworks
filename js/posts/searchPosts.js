import { BASE_URL } from "../api/api";

/**
 * Search for posts using a search query.
 * @param {string} query - The search query.
 * @returns {Promise<Array>} A list of posts matching the search query.
 */
async function searchPosts(query) {
  const url = `${BASE_URL}social/posts?q=${encodeURIComponent(query)}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
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
