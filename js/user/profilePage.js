import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.querySelector(".profile");
  const postsContainer = document.getElementById("posts");

  // Hent token fra localStorage (fra innlogging)
  const token = localStorage.getItem("accessToken");

  // Hvis token ikke finnes, omdiriger til login-siden
  if (!token) {
    console.error("Token ikke funnet, omdirigerer til login");
    window.location.href = "login.html"; // Send brukeren til login-siden hvis token ikke finnes
    return;
  }

  // Hent brukerens data fra localStorage
  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData || !userData.username) {
    console.error("Brukerdata er ikke tilgjengelig eller mangler username");
    window.location.href = "login.html"; // Send brukeren til login-siden hvis dataene ikke finnes
    return;
  }

  const name = userData.username; // Bruker navnet fra localStorage

  try {
    // Kall API for å hente brukerdata
    const response = await fetch(`${BASE_URL}social/profiles/${name}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-Noroff-API-Key": apiKey,
      },
    });

    if (!response.ok) {
      throw new Error("Kunne ikke hente brukerdata");
    }

    const profileData = await response.json();

    // Tøm container og bygg profilen dynamisk
    profileContainer.innerHTML = "";

    // Profilbilde
    const img = document.createElement("img");
    img.src = profileData.data.avatar?.url || "https://via.placeholder.com/150"; // Fallback til plassholderbilde
    img.alt = profileData.data.avatar?.alt || "Profile image"; // Fallback for alt
    img.id = "profile-image";

    // Profilbanner
    const banner = document.createElement("img");
    banner.src =
      profileData.data.banner?.url || "https://via.placeholder.com/1500x500"; // Fallback banner
    banner.alt = profileData.data.banner?.alt || "Banner image";
    banner.id = "banner-image";

    // Navn
    const nameElement = document.createElement("h2");
    nameElement.innerText = profileData.data.name || "No name provided";

    // Bio
    const bioElement = document.createElement("p");
    bioElement.innerText = profileData.data.bio || "No bio available"; // Fallback hvis bio er null

    // Email
    const emailElement = document.createElement("p");
    emailElement.innerText = `Email: ${
      profileData.data.email || "No email provided"
    }`;

    // Rediger profil-knapp
    const editProfileButton = document.createElement("button");
    editProfileButton.innerText = "Edit Profile";
    editProfileButton.addEventListener("click", () => {
      localStorage.setItem("editingUser", JSON.stringify(profileData)); // Lagre data midlertidig
      window.location.href = "editProfile.html"; // Endre URL-en her hvis nødvendig
    });

    // Hent logoutButton fra HTML og legg til event listener
    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        console.log("Logging out...");

        // Fjern token og brukerdata ved utlogging
        localStorage.removeItem("accessToken");
        localStorage.removeItem("editingUser");
        localStorage.removeItem("user"); // Sørg for å fjerne brukerdata også

        // Send til login-siden etter utlogging
        window.location.href = "login.html";
      });
    }

    // Legg til elementer i DOM
    profileContainer.appendChild(banner);
    profileContainer.appendChild(img);
    profileContainer.appendChild(nameElement);
    profileContainer.appendChild(bioElement);
    profileContainer.appendChild(emailElement);
    profileContainer.appendChild(editProfileButton);

    // Hent brukerens innlegg
    const postsResponse = await fetch(
      `${BASE_URL}social/profiles/${name}/posts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": apiKey,
        },
      }
    );

    if (!postsResponse.ok) {
      throw new Error("Kunne ikke hente brukerens innlegg");
    }

    const postsData = await postsResponse.json();

    // Bygg innleggene dynamisk og legg til i HTML
    postsData.data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const postTitle = document.createElement("h3");
      postTitle.innerText = post.title;

      const postBody = document.createElement("p");
      postBody.innerText = post.body;

      if (post.media && post.media.url) {
        const postImage = document.createElement("img");
        postImage.src = post.media.url;
        postImage.alt = post.media.alt || "Post image";
        postImage.classList.add("post-image");
        postElement.appendChild(postImage);
      }

      postElement.addEventListener("click", () => {
        window.location.href = `/html/singlepost.html?id=${post.id}`;
      });

      postElement.appendChild(postTitle);
      postElement.appendChild(postBody);
      postsContainer.appendChild(postElement);
    });
  } catch (error) {
    console.error(error);
    profileContainer.innerHTML = "<p>Error fetching data</p>";
  }
});
