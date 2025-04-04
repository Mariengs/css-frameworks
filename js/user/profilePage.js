import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.querySelector(".profile");
  const postsContainer = document.getElementById("posts");

  if (!profileContainer || !postsContainer) {
    console.error(
      "Profile container eller posts container ikke funnet i DOM-en."
    );
    return;
  }

  const token = localStorage.getItem("accessToken");

  if (!token) {
    console.error("Token ikke funnet, omdirigerer til login");
    window.location.href = "login.html";
    return;
  }

  const userData = JSON.parse(localStorage.getItem("user"));

  if (!userData || !userData.username) {
    console.error("Brukerdata er ikke tilgjengelig eller mangler username");
    window.location.href = "login.html";
    return;
  }

  const name = userData.username;

  try {
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

    profileContainer.innerHTML = "";

    // Profilbilde
    const img = document.createElement("img");
    img.src = profileData.data.avatar?.url || "https://via.placeholder.com/150";
    img.alt = profileData.data.avatar?.alt || "Profile image";
    img.id = "profile-image";
    img.classList.add(
      "w-32",
      "h-32",
      "object-cover",
      "rounded-full",
      "border-4",
      "border-white",
      "shadow-md"
    );

    // Banner
    const banner = document.getElementById("banner-image");
    banner.src =
      profileData.data.banner?.url || "https://via.placeholder.com/1500x500";
    banner.alt = profileData.data.banner?.alt || "Banner image";

    // Navn
    const nameElement = document.createElement("h2");
    nameElement.classList.add("text-2xl", "font-semibold", "mb-2");
    nameElement.innerText = profileData.data.name || "No name provided";

    // Bio
    const bioElement = document.createElement("p");
    bioElement.innerText = profileData.data.bio || "No bio available";

    // Email
    const emailElement = document.createElement("p");
    emailElement.innerText = `Email: ${
      profileData.data.email || "No email provided"
    }`;

    // Edit profile button
    const editProfileButton = document.createElement("button");
    editProfileButton.classList.add(
      "bg-gray-800",
      "text-white",
      "py-1",
      "px-3",
      "rounded-lg",
      "hover:bg-blue-900",
      "focus:outline-none",
      "transition",
      "duration-200",
      "ease-in-out",
      "text-sm",
      "mt-4"
    );
    editProfileButton.innerText = "Edit Profile";
    editProfileButton.addEventListener("click", () => {
      localStorage.setItem("editingUser", JSON.stringify(profileData));
      window.location.href = "editProfile.html";
    });

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
      logoutButton.addEventListener("click", () => {
        console.log("Logging out...");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("editingUser");
        localStorage.removeItem("user");

        window.location.href = "login.html";
      });
    }

    profileContainer.appendChild(banner);
    profileContainer.appendChild(img);
    profileContainer.appendChild(nameElement);
    profileContainer.appendChild(bioElement);
    profileContainer.appendChild(emailElement);
    profileContainer.appendChild(editProfileButton);

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

    postsData.data.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
      postElement.classList.add(
        "bg-white",
        "p-4",
        "rounded-lg",
        "shadow-md",
        "max-w-sm",
        "w-full"
      );

      const postTitle = document.createElement("h3");
      postTitle.classList.add("font-semibold", "text-lg");
      postTitle.innerText = post.title;

      const postBody = document.createElement("p");
      postBody.classList.add("text-gray-600");
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
