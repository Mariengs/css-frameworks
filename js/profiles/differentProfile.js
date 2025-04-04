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
    const url = isFollowing
      ? `${BASE_URL}social/profiles/${name}/unfollow`
      : `${BASE_URL}social/profiles/${name}/follow`;

    const method = isFollowing ? "PUT" : "PUT";

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
          return true;
        }
        console.error("Error toggling follow status:", data);
        return isFollowing;
      }

      return !isFollowing;
    } catch (error) {
      console.error("Request failed:", error);
      return isFollowing;
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

    if (postsContainer) {
      postsContainer.innerHTML = "";
      postsContainer.classList.add(
        "grid",
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-2",
        "gap-6",
        "justify-items-center"
      );

      if (posts.length) {
        posts.forEach((post) => {
          const postLink = document.createElement("a");
          postLink.href = `../html/singlepost.html?id=${post.id}`;
          postLink.classList.add(
            "block",
            "rounded-lg",
            "bg-white",
            "shadow-md",
            "hover:shadow-lg",
            "transition-shadow",
            "max-w-[350px]",
            "w-full"
          );

          const postDiv = document.createElement("div");
          postDiv.classList.add("p-4", "space-y-4", "sm:p-6");

          const postTitle = document.createElement("h3");
          postTitle.textContent = post.title || "No title available";
          postTitle.classList.add("text-xl", "font-semibold", "text-gray-900");

          const postBody = document.createElement("p");
          postBody.textContent = post.body || "No body available";
          postBody.classList.add("text-gray-700", "text-sm", "line-clamp-3");

          const postImage = document.createElement("img");
          if (post.media?.url) {
            postImage.src = post.media.url;
            postImage.alt = post.media.alt || "Post image";
            postImage.classList.add(
              "w-full",
              "h-auto",
              "rounded-lg",
              "object-cover"
            );
            postDiv.appendChild(postImage);
          }

          postDiv.appendChild(postTitle);
          postDiv.appendChild(postBody);
          postLink.appendChild(postDiv);

          postsContainer.appendChild(postLink);
        });
      } else {
        postsContainer.textContent = "No posts found.";
      }
    }

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
