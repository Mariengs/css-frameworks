import { renderPosts } from "./posts/renderPosts.js";
import { searchPosts } from "../js/posts/searchPosts.js";

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("editingUser");
      localStorage.removeItem("user");
      window.location.href = "account/login.html";
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.getElementById("searchButton");
  const searchInput = document.getElementById("searchInput");

  if (!searchButton || !searchInput) {
    console.error("Search button or search input not found.");
    return;
  }

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();

    if (!query) {
      alert("Please enter a search query!");
      return;
    }

    const results = await searchPosts(query);
    displaySearchResults(results.data);
  });
});

function displaySearchResults(posts) {
  const postsContainer = document.getElementById("posts-container");

  if (!postsContainer) {
    console.error("Could not find 'posts-container'.");
    return;
  }

  postsContainer.innerHTML = "";

  if (posts.length === 0) {
    postsContainer.innerHTML =
      "<p class='text-center text-gray-500'>No posts found.</p>";
    return;
  }

  posts.forEach((post) => {
    const postContainer = document.createElement("div");
    postContainer.classList.add(
      "post",
      "bg-white",
      "rounded-lg",
      "shadow-lg",
      "p-4",
      "flex",
      "flex-col",
      "space-y-4",
      "transition-transform",
      "transform",
      "hover:scale-105",
      "hover:shadow-xl"
    );

    const postLink = document.createElement("a");
    postLink.href = `../html/singlepost.html?id=${post.id}`;
    postLink.classList.add("block");

    const title = document.createElement("h3");
    title.textContent = post.title;
    title.classList.add("text-2xl", "font-semibold", "text-gray-800");

    const body = document.createElement("p");
    body.textContent = post.body;
    body.classList.add("text-gray-600", "text-sm", "leading-relaxed");

    if (post.media && post.media.url) {
      const img = document.createElement("img");
      img.src = post.media.url;
      img.alt = post.title;
      img.classList.add("post-image", "w-full", "h-auto", "rounded-lg", "mb-4");
      postLink.appendChild(img);
    }

    postLink.appendChild(title);
    postLink.appendChild(body);
    postContainer.appendChild(postLink);
    postsContainer.appendChild(postContainer);
  });
}
