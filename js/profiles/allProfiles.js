import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

const accessToken = localStorage.getItem("accessToken");

// Funksjon for å hente profiler basert på søk
async function searchProfiles(query) {
  try {
    if (!accessToken) {
      throw new Error(
        "Ingen access token funnet. Brukeren må være logget inn."
      );
    }

    const response = await fetch(
      `${BASE_URL}social/profiles/search?q=${query}`,
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
      throw new Error(`Feil ved søk av profiler: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Returner profiler fra API-responsen
  } catch (error) {
    console.error("Feil ved søk av profiler:", error);
    return []; // Returnerer en tom array hvis noe går galt
  }
}

// Funksjon for å hente alle profiler (som allerede er definert)
async function getAllProfiles() {
  try {
    if (!accessToken) {
      throw new Error(
        "Ingen access token funnet. Brukeren må være logget inn."
      );
    }

    const response = await fetch(`${BASE_URL}social/profiles`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Feil ved henting av profiler: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data; // Returner profiler fra API-responsen
  } catch (error) {
    console.error("Feil ved henting av profiler:", error);
    return []; // Returnerer en tom array hvis noe går galt
  }
}

// Funksjon for å rendre profiler
async function renderProfiles(profiles) {
  const profilesContainer = document.getElementById("profiles-container");
  profilesContainer.innerHTML = ""; // Rens eventuelle tidligere data før visning

  profiles.forEach((profile) => {
    const profileLink = document.createElement("a");
    profileLink.href = `differentProfile.html?name=${profile.name}`;
    profileLink.classList.add("profile-link");

    // Opprett container for hver profil
    const profileElement = document.createElement("div");
    profileElement.classList.add("profile");

    const avatarImage = document.createElement("img");
    avatarImage.src = profile.avatar?.url || "default-avatar.jpg";
    avatarImage.alt = profile.avatar?.alt || "Avatar";
    profileElement.appendChild(avatarImage);

    const profileName = document.createElement("h3");
    profileName.textContent = profile.name || "Ukjent Navn";
    profileElement.appendChild(profileName);

    const profileBio = document.createElement("p");
    profileBio.textContent = profile.bio || "Ingen bio tilgjengelig";
    profileElement.appendChild(profileBio);

    const profileStats = document.createElement("p");
    profileStats.textContent = `Innlegg: ${profile._count.posts}, Følgere: ${profile._count.followers}, Følger: ${profile._count.following}`;
    profileElement.appendChild(profileStats);

    // if (profile.banner && profile.banner.url) {
    //   const bannerImage = document.createElement("img");
    //   bannerImage.src = profile.banner.url;
    //   bannerImage.alt = profile.banner.alt || "Banner";
    //   profileElement.appendChild(bannerImage);
    // }

    profileLink.appendChild(profileElement);
    profilesContainer.appendChild(profileLink);
  });
}

// Kjør funksjon for å hente og vise profiler ved lastning
document.addEventListener("DOMContentLoaded", async () => {
  const profiles = await getAllProfiles();
  renderProfiles(profiles);
});

// Legg til eventlistener for søkefunksjonen
document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value;
  if (query) {
    const profiles = await searchProfiles(query);
    renderProfiles(profiles);
  }
});
