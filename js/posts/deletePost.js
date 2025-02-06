import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";
export async function deletePost() {
  try {
    const response = await fetch(`${BASE_URL}/social/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    const data = await response.json();
    console.log(data);
    alert("Post deleted successfully!");
    window.location.href = "/";
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Something went wrong. Please try again.");
  }
}
