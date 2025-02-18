import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

const API_KEY = "233315a6-8ab8-4b0f-a8d5-0f4d19e5106b";

export async function getAllPosts() {
  const accessToken = getAccessToken();

  if (!accessToken) {
    console.error("Ingen access token funnet! Brukeren må logge inn.");
    throw new Error("Access token mangler");
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
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
