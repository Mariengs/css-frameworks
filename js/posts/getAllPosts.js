import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

const API_KEY = "233315a6-8ab8-4b0f-a8d5-0f4d19e5106b";

export async function getAllPosts() {
  const accessToken = getAccessToken(); // Hent access token

  if (!accessToken) {
    console.error("Ingen access token funnet! Brukeren må logge inn.");
    throw new Error("Access token mangler");
  }

  const options = {
    headers: {
      Authorization: `Bearer ${accessToken}`, // Bearer token for brukeren
      "X-Noroff-API-Key": API_KEY, // API-nøkkelen for applikasjonen
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(`${BASE_URL}social/posts`, options); // Bruk options i fetch
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error fetching posts:", errorData);
      throw new Error(errorData.message || "Failed to fetch posts");
    }

    const data = await response.json();
    return data.data; // Returner postene som hentes
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}
