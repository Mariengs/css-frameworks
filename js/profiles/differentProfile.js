import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const name = new URLSearchParams(window.location.search).get("name");
  if (!name) {
    console.error("No profile name provided.");
    return;
  }

  const followButton = document.getElementById("follow-button");
  if (!followButton) {
    console.error("Follow button not found in the DOM.");
    return;
  }

  async function getProfileData(name) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("User is not logged in.");

    const response = await fetch(`${BASE_URL}social/profiles/${name}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(`Error fetching profile: ${response.statusText}`);
    return (await response.json()).data;
  }

  async function getUserPosts(name) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("User is not logged in.");

    const response = await fetch(`${BASE_URL}social/profiles/${name}/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error(`Error fetching posts: ${response.statusText}`);
    return (await response.json()).data;
  }

  async function checkFollowStatus(name) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return false;

    const response = await fetch(`${BASE_URL}social/profiles/${name}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Error fetching follow status:", response.statusText);
      return false;
    }

    return (await response.json()).data.isFollowing;
  }

  async function toggleFollowOnProfile(name) {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      console.error("User is not logged in.");
      return;
    }

    let isFollowing = await checkFollowStatus(name);
    const url = `${BASE_URL}social/profiles/${name}/follow`;
    const method = isFollowing ? "DELETE" : "PUT";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          data.errors &&
          data.errors[0]?.message === "You are already following this profile"
        ) {
          console.warn("Already following this profile. Updating UI.");
          return true; // Sett status til "following" uten å gjøre API-kall
        }
        console.error("Error toggling follow status:", data);
        return isFollowing; // Beholder gammel status hvis feilet
      }

      return !isFollowing;
    } catch (error) {
      console.error("Request failed:", error);
      return isFollowing; // Beholder gammel status ved feil
    }
  }

  try {
    const profile = await getProfileData(name);
    const posts = await getUserPosts(name);

    if (profile.banner?.url) {
      document.getElementById("profile-banner").src = profile.banner.url;
      document.getElementById("profile-banner").alt =
        profile.banner.alt || "Banner";
    }

    document.getElementById("profile-name").textContent =
      profile.name || "Unknown Name";
    document.getElementById("profile-bio").textContent =
      profile.bio || "No bio available";
    document.getElementById("profile-avatar").src =
      profile.avatar?.url || "default-avatar.jpg";
    document.getElementById("profile-avatar").alt =
      profile.avatar?.alt || "Avatar";

    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = posts.length
      ? posts
          .map(
            (post) => `
          <a href="../html/singlepost.html?id=${post.id}" class="post-link">
            <div class="post">
              <h3>${post.title || "No title available"}</h3>
              <p>${post.body || "No body available"}</p>
              ${
                post.media?.url
                  ? `<img src="${post.media.url}" alt="${
                      post.media.alt || "Post image"
                    }">`
                  : ""
              }
            </div>
          </a>
        `
          )
          .join("")
      : "No posts found.";

    let isFollowing = await checkFollowStatus(name);
    followButton.textContent = isFollowing ? "Unfollow" : "Follow";

    followButton.addEventListener("click", async () => {
      isFollowing = await toggleFollowOnProfile(name);
      followButton.textContent = isFollowing ? "Unfollow" : "Follow";
    });
  } catch (error) {
    console.error("Error loading profile data:", error);
  }
});
