import { BASE_URL } from "../api/api.js";
/**
 * Follow or unfollow a user.
 * @param {string} userId - The ID of the user to follow/unfollow.
 * @param {boolean} follow - `true` to follow, `false` to unfollow.
 * @returns {Promise<void>}
 */
async function toggleFollowUser(userId, follow) {
  const url = `${BASE_URL}social/profiles/${userId}/follow`;

  try {
    const response = await fetch(url, {
      method: follow ? "PUT" : "DELETE",
      headers: {
        Authorization: `Bearer ${yourAccessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(
        `${follow ? "Follow" : "Unfollow"} failed: ${response.statusText}`
      );
    }

    console.log(
      `${follow ? "Followed" : "Unfollowed"} user with ID: ${userId}`
    );
  } catch (error) {
    console.error(error);
  }
}
