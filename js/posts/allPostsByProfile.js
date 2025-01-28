import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

/**
 * Fetch all posts by a specific user.
 * @param {string} name - The ID of the user whose posts you want to fetch.
 * @returns {Promise<Array>} A list of posts by the user.
 */
async function getUserPosts(name) {
  try {
    const response = await fetch(`${BASE_URL}social/profile${name}/posts`, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching posts: ${response.statusText}`);
    }

    const posts = await response.json();
    console.log(posts);
    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
}
