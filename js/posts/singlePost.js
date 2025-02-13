import { BASE_URL } from "../api/api.js"; // Import the API key
import { getAccessToken } from "../api/auth.js";
import { deletePost } from "./deletePost.js";
import { apiKey } from "../api/apiKey.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id"); // This ID is used to fetch and delete the post

/**
 * Fetches a post from the API by its ID.
 *
 * @param {string} id - The ID of the post to fetch.
 * @throws Will throw an error if no token is found or if the request fails.
 */
async function getPost(id) {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No token found. Are you logged in?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    // Legg til _author flagget for å hente forfatteren
    const response = await fetch(`${BASE_URL}social/posts/${id}?_author=true`, {
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

/**
 * Displays the post data on the page.
 *
 * @param {Object} postData - The post data returned from the API.
 */
function displayPost(postData) {
  const post = postData.data; // Get the post data

  // Finn HTML-elementer
  const titleElement = document.getElementById("title");
  const authorElement = document.getElementById("author");
  const bodyElement = document.getElementById("body");
  const imageElement = document.getElementById("image");
  const updatedElement = document.getElementById("updated");

  if (!titleElement || !bodyElement || !imageElement) {
    console.error("Error: Could not find HTML elements.");
    return;
  }

  // Sett verdiene for elementene
  titleElement.textContent = post.title;
  authorElement.textContent = `By: ${post.author?.name || "Unknown"}`; // Håndter hvis forfatter er ukjent
  bodyElement.textContent = post.body;
  updatedElement.textContent = `Last updated: ${new Date(
    post.updated
  ).toLocaleString()}`;

  // Håndter bilde (hvis tilgjengelig)
  if (post.media && post.media.url) {
    imageElement.src = post.media.url;
    imageElement.alt = post.media.alt || "Post image";
  } else {
    imageElement.style.display = "none"; // Skjul bilde hvis det ikke finnes
  }

  // Finn knappene for redigering og sletting
  const editButton = document.getElementById("editButton");
  const deleteButton = document.getElementById("deleteButton");

  if (editButton && deleteButton) {
    // Redirect to edit page
    editButton.addEventListener("click", () => {
      window.location.href = `/html/editPost.html?id=${id}`;
    });

    // Handle delete button click
    deleteButton.addEventListener("click", () => {
      const confirmDelete = confirm(
        "Are you sure you want to delete this post?"
      );

      if (confirmDelete) {
        alert("Post deleted successfully!");
        deletePost(id); // Pass the ID to the deletePost function
      }
    });
  } else {
    console.error("Delete button or Edit button not found.");
  }

  // Feilsøking: Skriv ut currentUser og post.author
  const currentUser = JSON.parse(localStorage.getItem("user"));
  console.log("Current user from localStorage:", currentUser);
  console.log("Post author from API:", post.author);

  // Kontrollere om brukeren er eieren av innlegget
  if (
    currentUser &&
    post.author?.name &&
    currentUser.username === post.author.name
  ) {
    // Hvis brukeren er eieren, vis "Edit" og "Delete" knappene
    editButton.style.display = "inline-block"; // Vis edit-knapp
    deleteButton.style.display = "inline-block"; // Vis delete-knapp
  } else {
    // Hvis ikke, skjul knappene
    editButton.style.display = "none";
    deleteButton.style.display = "none";
  }
}

// Fetch the post when the page loads
getPost(id);
