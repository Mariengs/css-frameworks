import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const name = new URLSearchParams(window.location.search).get("name");

  if (!name) {
    console.error("Ingen profilnavn i URL-en.");
    return;
  }

  // Funksjon for å hente brukerens profil
  async function getProfileData(profileName) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Brukeren er ikke logget inn.");
    }

    const response = await fetch(`${BASE_URL}social/profiles/${profileName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Feil ved henting av profil: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Returner profilen fra API-responsen
  }

  // Funksjon for å hente brukerens innlegg
  async function getUserPosts(profileName) {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      throw new Error("Brukeren er ikke logget inn.");
    }

    const response = await fetch(
      `${BASE_URL}social/profiles/${profileName}/posts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Feil ved henting av brukerens innlegg: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data.data; // Returner innleggene fra API-responsen
  }

  try {
    // Hent profilinformasjon
    const profile = await getProfileData(name);

    // Hent brukerens innlegg
    const posts = await getUserPosts(name);
    if (profile.banner && profile.banner.url) {
      document.getElementById("profile-banner").src = profile.banner.url;
      document.getElementById("profile-banner").alt =
        profile.banner.alt || "Banner";
    }

    // Vis profilinformasjonen
    document.getElementById("profile-name").textContent =
      profile.name || "Ukjent Navn";
    document.getElementById("profile-bio").textContent =
      profile.bio || "Ingen bio tilgjengelig";
    document.getElementById("profile-avatar").src =
      profile.avatar?.url || "default-avatar.jpg";
    document.getElementById("profile-avatar").alt =
      profile.avatar?.alt || "Avatar";

    // Vis innleggene
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = ""; // Rens eventuelle tidligere innlegg

    if (posts && Array.isArray(posts) && posts.length > 0) {
      posts.forEach((post) => {
        const postElement = document.createElement("div");
        postElement.classList.add("post");

        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title || "Uten tittel";

        const postBody = document.createElement("p");
        postBody.textContent = post.body || "Ingen innhold tilgjengelig";

        postElement.appendChild(postTitle);
        postElement.appendChild(postBody);

        postsContainer.appendChild(postElement);
      });
    } else {
      postsContainer.innerHTML = "Ingen innlegg funnet for denne brukeren.";
    }
  } catch (error) {
    console.error("Feil ved lasting av profildata:", error);
  }
});
