import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

const accessToken = localStorage.getItem("accessToken");

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
    return data.data;
  } catch (error) {
    console.error("Feil ved søk av profiler:", error);
    return [];
  }
}

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

    return data.data;
  } catch (error) {
    console.error("Feil ved henting av profiler:", error);
    return [];
  }
}

async function renderProfiles(profiles) {
  const profilesContainer = document.getElementById("profiles-container");
  profilesContainer.innerHTML = "";

  profiles.forEach((profile) => {
    const profileLink = document.createElement("a");
    profileLink.href = `differentProfile.html?name=${profile.name}`;
    profileLink.classList.add("profile-link");

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
    profileBio.textContent = profile.bio || "No bio available";
    profileElement.appendChild(profileBio);

    const profileStats = document.createElement("p");
    profileStats.textContent = `Innlegg: ${profile._count.posts}, Følgere: ${profile._count.followers}, Følger: ${profile._count.following}`;
    profileElement.appendChild(profileStats);

    const followButton = document.createElement("button");
    followButton.classList.add("follow-button");

    if (profile.following) {
      followButton.innerText = "Unfollow";
    } else {
      followButton.innerText = "Follow";
    }

    followButton.addEventListener("click", async (event) => {
      event.preventDefault();

      if (!profile.name) {
        console.error("Ugyldig profilnavn:", profile);
        return;
      }

      const action = profile.following ? "unfollow" : "follow";

      await toggleFollow(profile.name, action);

      followButton.innerText = action === "follow" ? "Unfollow" : "Follow";
    });

    profileElement.appendChild(followButton);
    profileLink.appendChild(profileElement);
    profilesContainer.appendChild(profileLink);
  });
}

async function toggleFollow(profileName, action) {
  const accessToken = localStorage.getItem("accessToken");

  if (!profileName) {
    console.error("Profilename is undefined.");
    return;
  }

  try {
    let url = `${BASE_URL}social/profiles/${profileName}/follow`;
    if (action === "unfollow") {
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
        console.error("You are not following this profile.");
        return;
      }

      url = `${BASE_URL}social/profiles/${profileName}/unfollow`;
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error("Feil ved forespørsel:", responseData);
      throw new Error(`Feil ved ${action} profil: ${response.statusText}`);
    }

    console.log(`${action}ed profile: ${profileName}`);
  } catch (error) {
    console.error(`Feil ved å ${action} profil:`, error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const profiles = await getAllProfiles();
  renderProfiles(profiles);
});

document.getElementById("searchButton").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value;
  if (query) {
    const profiles = await searchProfiles(query);
    renderProfiles(profiles);
  }
});
