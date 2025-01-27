import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

// Hent ID fra URL-parametere
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

if (id) {
  // Nå kan du hente innlegget fra API-en
  async function getPost() {
    try {
      const response = await fetch(
        `${BASE_URL}social/posts/${id}`,
        getAccessToken()
          ? { headers: { Authorization: `Bearer ${getAccessToken()}` } }
          : {}
      );
      if (!response.ok) {
        throw new Error("Could not fetch the post.");
      }
      const post = await response.json();
      displayPost(post);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  }

  // Funksjon for å vise innlegget på siden
  function displayPost(post) {
    const postContainer = document.getElementById("post-container");
    const postTitle = document.createElement("h1");
    const postBody = document.createElement("p");

    postTitle.textContent = post.title;
    postBody.textContent = post.body;

    postContainer.appendChild(postTitle);
    postContainer.appendChild(postBody);
  }

  // Hent innlegget når siden lastes
  getPost();
} else {
  console.error("No post ID found in URL");
}
