import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

const API_KEY = "233315a6-8ab8-4b0f-a8d5-0f4d19e5106b";

export async function getAllPosts() {
  const accessToken = getAccessToken();
  const errorElement = document.getElementById("error-message");

  if (!accessToken) {
    const errorMessage = "You must be logged in to see all posts.";
    console.warn(errorMessage);

    if (errorElement) {
      errorElement.textContent = errorMessage;
      errorElement.classList.remove("hidden");
    }

    return [];
  }

  if (errorElement) {
    errorElement.classList.add("hidden");
  }

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${BASE_URL}social/posts`, options);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching posts:", errorData);

      if (errorElement) {
        errorElement.textContent =
          errorData.message || "Failed to fetch posts.";
        errorElement.classList.remove("hidden");
      }

      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);

    if (errorElement) {
      errorElement.textContent =
        "An error occurred while loading posts. Please try again.";
      errorElement.classList.remove("hidden");
    }

    throw error;
  }
}
