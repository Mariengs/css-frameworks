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
        // Opprett lenke-element for å gjøre innlegget klikkbart
        const postLink = document.createElement("a");
        postLink.href = `../html/singlepost.html?id=${post.id}`; // Lenke til single post
        postLink.classList.add("post-link"); // CSS-klasse for styling

        const postElement = document.createElement("div");
        postElement.classList.add("post");

        // Legg til tittel
        const postTitle = document.createElement("h3");
        postTitle.textContent = post.title || "Uten tittel";

        // Legg til innhold (body)
        const postBody = document.createElement("p");
        postBody.textContent = post.body || "Ingen innhold tilgjengelig";

        // Legg til bilde hvis det finnes
        if (post.media && post.media.url) {
          const postImage = document.createElement("img");
          postImage.src = post.media.url;
          postImage.alt = post.media.alt || "Post image";
          postElement.appendChild(postImage);
        }

        // Legg til tittel og innhold til postElement
        postElement.appendChild(postTitle);
        postElement.appendChild(postBody);

        // Legg postElement til i lenken
        postLink.appendChild(postElement);

        // Legg postLink til i containeren
        postsContainer.appendChild(postLink);
      });
    } else {
      postsContainer.innerHTML = "Ingen innlegg funnet for denne brukeren.";
    }
  } catch (error) {
    console.error("Feil ved lasting av profildata:", error);
  }
});
