import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

/**
 * Deletes a post by its ID from the API.
 *
 * @param {string} id - The ID of the post to be deleted.
 * @throws Will throw an error if the deletion fails or if the response status is not OK.
 */
const accessToken = localStorage.getItem("accessToken");

/**
 * Function to delete a post by its ID.
 * It sends a DELETE request to the API and handles the response.
 *
 * @param {string} id - The ID of the post to delete.
 */
export async function deletePost(id) {
  try {
    // Send DELETE request to the API to delete the post
    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-KEY": apiKey,
      },
    });

    // Check if the response status is OK (2xx)
    if (!response.ok) {
      throw new Error(`Failed to delete post. Status: ${response.status}`);
    }

    // Log the response for debugging
    const responseText = await response.text(); // Using text() first to check the raw response
    console.log("Response text:", responseText);

    // If the response is empty, display a success message without parsing
    if (!responseText) {
      alert("Post deleted successfully");
      window.location.href = "/";
      return;
    }

    // If the response is in JSON format, parse and log it
    const data = JSON.parse(responseText);
    console.log("API response:", data);

    // Show success message and redirect to the homepage
    alert("Post deleted successfully!");
    window.location.href = "/";
  } catch (error) {
    // Log any error that occurs during the process
    console.error("Error deleting post:", error);
    alert("Something went wrong. Please try again.");
  }
}
