import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

const name = JSON.parse(localStorage.getItem("user")).username;

document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.querySelector(".profile");
  const postsContainer = document.getElementById("posts");

  // Hent token fra localStorage (fra innlogging)
  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "login.html"; // Send brukeren til login hvis ikke innlogget
    return;
  }

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

    const userData = await response.json();

    // Tøm container og bygg profilen dynamisk
    profileContainer.innerHTML = "";

    // Profilbilde
    const img = document.createElement("img");
    img.src = userData.data.avatar?.url || "https://via.placeholder.com/150"; // Fallback til plassholderbilde
    img.alt = userData.data.avatar?.alt || "Profile image"; // Fallback for alt

    // Profilbanner
    const banner = document.createElement("img");
    banner.src =
      userData.data.banner?.url || "https://via.placeholder.com/1500x500"; // Fallback banner
    banner.alt = userData.data.banner?.alt || "Banner image";

    // Navn
    const nameElement = document.createElement("h2");
    nameElement.innerText = userData.data.name || "No name provided";

    // Bio
    const bioElement = document.createElement("p");
    bioElement.innerText = userData.data.bio || "No bio available"; // Fallback hvis bio er null

    // Email
    const emailElement = document.createElement("p");
    emailElement.innerText = `Email: ${
      userData.data.email || "No email provided"
    }`;

    // Rediger profil-knapp
    const editPageButton = document.createElement("button");
    editPageButton.innerText = "Edit Profile";
    editPageButton.addEventListener("click", () => {
      localStorage.setItem("editingUser", JSON.stringify(userData)); // Lagre data midlertidig
      window.location.href = "edit.html";
    });

    // Logg ut-knapp
    const logoutButton = document.createElement("button");
    logoutButton.innerText = "Log Out";
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("editingUser");
      window.location.href = "login.html";
    });

    // Legg til elementer i DOM
    profileContainer.appendChild(banner);
    profileContainer.appendChild(img);
    profileContainer.appendChild(nameElement);
    profileContainer.appendChild(bioElement);
    profileContainer.appendChild(emailElement);
    profileContainer.appendChild(editPageButton);
    profileContainer.appendChild(logoutButton);

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

    // Sjekk om innleggene finnes
    console.log(postsData);

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
