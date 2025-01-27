import { getAllPosts } from "./getAllPosts.js";

export async function renderPosts() {
  const accessToken = localStorage.getItem("accessToken");
  const API_KEY = "66603a13-3131-4687-8219-c588045bc193";

  if (!accessToken) {
    console.error("Ingen access token funnet! Brukeren må logge inn.");
    return;
  }

  try {
    const posts = await getAllPosts(API_KEY); // Henter innlegg
    console.log("Render poster:", posts); // Logger innholdet

    // Vis innleggene på siden
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.textContent = post.title; // Tilpass med ønsket data
      document.body.appendChild(postElement);
    });
  } catch (error) {
    console.error("Error rendering posts:", error);
  }
}
