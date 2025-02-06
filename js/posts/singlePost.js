import { BASE_URL, API_KEY } from "../api/api.js"; // Importer API-nøkkelen
import { getAccessToken } from "../api/auth.js";
import { deletePost } from "./deletePost.js";

// Hent ID fra URL-parametere
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

// Hent innlegget fra API-en
async function getPost(id) {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No token found. Are you logged in?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY, // Legger til API-nøkkelen
    };

    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    console.log("API response:", data);

    if (!response.ok) {
      throw new Error(`Could not fetch post. Status: ${response.status}`);
    }

    displayPost(data);
  } catch (error) {
    console.error("Error fetching post:", error.message);
  }
}

// Vis innlegget på siden
function displayPost(postData) {
  const post = postData.data; // Hent selve innlegget

  // Finn HTML-elementer
  const titleElement = document.getElementById("title");
  const authorElement = document.getElementById("author");
  const bodyElement = document.getElementById("body");
  const imageElement = document.getElementById("image");
  const updatedElement = document.getElementById("updated");

  if (!titleElement || !bodyElement || !imageElement) {
    console.error("Error: Could not find HTML-elements.");
    return;
  }

  // Sett inn verdier
  titleElement.textContent = post.title;
  authorElement.textContent = `By: ${post.author?.name || "Unknown"}`; // Håndterer hvis forfatter mangler
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

// Finn knappene
const editButton = document.getElementById("editButton");
const deleteButton = document.getElementById("deleteButton");

// Hent ID fra URL for å bruke i lenken

const postId = urlParams.get("id");

// Omdiriger til redigeringsside
editButton.addEventListener("click", () => {
  window.location.href = `/html/edit.html?id=${postId}`;
});

// Omdiriger til sletteside eller bekreft sletting
deleteButton.addEventListener("click", () => {
  const confirmDelete = confirm(
    "Er du sikker på at du vil slette dette innlegget?"
  );

  if (confirmDelete) {
    alert("Innlegget er slettet (ikke implementert ennå).");
    deletePost(id);
    // Her kan du eventuelt kalle en slettingsfunksjon senere
  }
});

getPost(id);
