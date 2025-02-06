import { BASE_URL, API_KEY } from "../api/api.js"; // ✅ Importer API-nøkkelen
import { getAccessToken } from "../api/auth.js";

// Hent ID fra URL-parametere
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Hent innlegget fra API-en
async function getPost(id) {
  try {
    const token = getAccessToken();
    console.log("Henter token:", token);

    if (!token) {
      throw new Error("Ingen token funnet. Er du logget inn?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY, // ✅ Legger til API-nøkkelen
    };

    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log("API response:", data);

    if (!response.ok) {
      throw new Error(`Kunne ikke hente innlegget. Status: ${response.status}`);
    }

    displayPost(data);
  } catch (error) {
    console.error("Feil ved henting av innlegg:", error.message);
  }
}

// Vis innlegget på siden
function displayPost(postData) {
  const post = postData.data; // ✅ Hent selve innlegget

  // Finn HTML-elementer
  const titleElement = document.getElementById("title");
  const authorElement = document.getElementById("author");
  const bodyElement = document.getElementById("body");
  const imageElement = document.getElementById("image");
  const updatedElement = document.getElementById("updated");

  if (!titleElement || !bodyElement || !imageElement) {
    console.error("Feil: Kunne ikke finne nødvendige HTML-elementer.");
    return;
  }

  // Sett inn verdier
  titleElement.textContent = post.title;
  authorElement.textContent = `By: ${post.author?.name || "Unknown"}`; // 🔹 Håndterer hvis forfatter mangler
  bodyElement.textContent = post.body;
  updatedElement.textContent = `Last updated: ${new Date(
    post.updated
  ).toLocaleString()}`;

  // Håndter bilde (hvis det finnes)
  if (post.media && post.media.url) {
    imageElement.src = post.media.url;
    imageElement.alt = post.media.alt || "Post image";
  } else {
    imageElement.style.display = "none"; // Skjul bildet hvis det ikke finnes
  }
}

getPost(id);
