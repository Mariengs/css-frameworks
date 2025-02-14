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

// Funksjon for å hente alle profiler
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

    // Legg til Follow/Unfollow knapp
    const followButton = document.createElement("button");
    followButton.classList.add("follow-button");

    // Sjekk om brukeren allerede følger denne profilen
    if (profile.following) {
      followButton.innerText = "Unfollow";
    } else {
      followButton.innerText = "Follow";
    }

    // Legg eventlistener for Follow/Unfollow
    followButton.addEventListener("click", async (event) => {
      // Stopper lenkeklikking og hindrer omdirigering
      event.preventDefault();

      // Hvis profile.name er ugyldig, ikke fortsett med toggleFollow
      if (!profile.name) {
        console.error("Ugyldig profilnavn:", profile);
        return;
      }

      // Hvis vi prøver å unfollow, sørg for at vi har riktig profilnavn
      const action = profile.following ? "unfollow" : "follow";

      await toggleFollow(profile.name, action); // Passer riktig navn her

      // Oppdater teksten på knappen etter handlingen
      followButton.innerText = action === "follow" ? "Unfollow" : "Follow";
    });

    profileElement.appendChild(followButton);
    profileLink.appendChild(profileElement);
    profilesContainer.appendChild(profileLink);
  });
}

async function toggleFollow(profileName, action) {
  const accessToken = localStorage.getItem("accessToken");

  // Hvis profileName er ugyldig, returner tidlig
  if (!profileName) {
    console.error("Profilnavn er null eller ugyldig.");
    return;
  }

  try {
    // Bygg URL for follow eller unfollow
    let url = `${BASE_URL}social/profiles/${profileName}/follow`; // Standard for follow
    if (action === "unfollow") {
      // Sjekk om du allerede følger profilen før du prøver å unfollowe
      const followingResponse = await fetch(
        `${BASE_URL}social/profiles/me/following`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      const followingData = await followingResponse.json();
      const isFollowing = followingData.data.following.some(
        (follow) => follow.name === profileName
      );

      if (!isFollowing) {
        console.error("Du følger allerede ikke denne profilen.");
        return; // Hvis du ikke følger, gjør ingen endring
      }

      url = `${BASE_URL}social/profiles/${profileName}/unfollow`; // URL for unfollow
    }

    console.log("Request URL:", url); // Logg URL-en for debugging

    // Send forespørselen
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json", // Ingen body trengs, men Content-Type er fortsatt viktig
      },
    });

    // Logg responsen for å få mer informasjon ved feil
    const responseData = await response.json();

    if (!response.ok) {
      // Hvis svaret ikke er ok, logg feilmeldingen
      console.error("Feil ved forespørsel:", responseData);
      throw new Error(`Feil ved ${action} profil: ${response.statusText}`);
    }

    // Hvis alt går bra, logg suksess
    console.log(`${action}ed profile: ${profileName}`);

    // Eventuelt logge den returnerte dataen fra serveren for debugging
    console.log("Responsdata:", responseData);
  } catch (error) {
    // Logg eventuelle feil
    console.error(`Feil ved å ${action} profil:`, error);
  }
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
