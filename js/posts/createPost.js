import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

// Retrieve user data and access token from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const name = user?.username || "defaultName";
const accessToken = localStorage.getItem("accessToken");

// If there's no access token, redirect to the login page
if (!accessToken) {
  alert("You must be logged in to create a post.");
  window.location.href = "/account/login.html";
}

/**
 * Handles the creation of a new post.
 *
 * @param {Event} event - The submit event triggered by the form.
 * @throws Will throw an error if the post creation fails.
 */
export async function createPost(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();
  const image = document.getElementById("image").value.trim();
  const tagsInput = document.getElementById("tags").value.trim();

  // Check if required fields are filled
  if (!title || !body || !image) {
    alert("All fields are required");
    return;
  }

  const tags = tagsInput ? tagsInput.split(",").map((tag) => tag.trim()) : [];

  const postData = {
    title,
    body,
    tags: tags,
    media: {
      url: image,
      alt: "Post image",
    },
  };

  try {
    const response = await fetch(`${BASE_URL}social/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();
    console.log("API Response:", responseData);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(
        `Failed to create post: ${responseData.message || response.status}`
      );
    }

    alert("Post created successfully!");
    window.location.href = "/";
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Something went wrong. Please try again.");
  }
}

/**
 * Initializes the form submission event listener when the document is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");

  if (form) {
    form.addEventListener("submit", createPost);
  } else {
    console.error("Form not found! Check that the ID is correct.");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createPostForm");
  const logoutButton = document.getElementById("logoutButton");

  if (form) {
    form.addEventListener("submit", createPost);
  } else {
    console.error("Form not found! Check that the ID is correct.");
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/account/login.html";
    });
  } else {
    console.error("Logout button not found! Check that the ID is correct.");
  }
});
