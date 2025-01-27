import { BASE_URL } from "../api/api.js";
const API_KEY = "66603a13-3131-4687-8219-c588045bc193";
export async function getAllPosts() {
  try {
    const response = await fetch(`${BASE_URL}social/posts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Something went wrong: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("API-respons:", result); // Logger data fra API
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
}
