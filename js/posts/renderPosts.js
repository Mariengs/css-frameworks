import { getAllPosts } from "/js/posts/getAllPosts.js";
import { BASE_URL } from "../api/api.js";

/**
 * Renders a list of posts onto the page.
 * Fetches posts from an API and dynamically creates HTML elements
 * to display each post in the `#posts-container` element.
 *
 * Each post is clickable and redirects to a single post page.
 *
 * @async
 * @function renderPosts
 * @returns {Promise<void>} Resolves when the posts are rendered, or logs an error if no posts are found.
 */
export async function renderPosts() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    console.error("Ingen poster funnet!");
    return;
  }

  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Rens eventuelle tidligere data før visning

  /**
   * Iterates through the posts and adds them to the page.
   * Each post is wrapped in an `<a>` element with a link to a single post view page.
   */
  posts.forEach((post) => {
    const postLink = document.createElement("a");
    postLink.href = `../html/singlepost.html?id=${post.id}`;
    postLink.classList.add("post-link");

    const postElement = document.createElement("div");
    postElement.classList.add("post");

    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;

    const postBody = document.createElement("p");
    postBody.textContent = post.body;

    if (post.media) {
      const postImage = document.createElement("img");
      postImage.src = post.media.url;
      postImage.alt = post.media.alt || "Post image";
      postElement.appendChild(postImage);
    }

    postElement.appendChild(postTitle);
    postElement.appendChild(postBody);

    postLink.appendChild(postElement);

    postsContainer.appendChild(postLink);
  });

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");

  searchButton.addEventListener("click", async () => {
    const query = searchInput.value.trim();
    if (query) {
      const filteredPosts = await searchPosts(query);
      renderFilteredPosts(filteredPosts);
    }
  });

  async function searchPosts(query) {
    const accessToken = localStorage.getItem("accessToken");
    const API_KEY = "233315a6-8ab8-4b0f-a8d5-0f4d19e5106b";

    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        `${BASE_URL}social/posts/search?q=${query}`,
        options
      );
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error fetching posts:", errorData);
        throw new Error(errorData.message || "Failed to fetch posts");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  }

  function renderFilteredPosts(posts) {
    const postsContainer = document.getElementById("posts-container");
    postsContainer.innerHTML = "";
    if (posts.length === 0) {
      postsContainer.innerHTML = "<p>Ingen innlegg funnet for søket.</p>";
      return;
    }

    posts.forEach((post) => {
      const postLink = document.createElement("a");
      postLink.href = `../html/singlepost.html?id=${post.id}`;
      postLink.classList.add("post-link");

      const postElement = document.createElement("div");
      postElement.classList.add("post");

      const postTitle = document.createElement("h3");
      postTitle.textContent = post.title;

      const postBody = document.createElement("p");
      postBody.textContent = post.body;

      if (post.media) {
        const postImage = document.createElement("img");
        postImage.src = post.media.url;
        postImage.alt = post.media.alt || "Post image";
        postElement.appendChild(postImage);
      }

      postElement.appendChild(postTitle);
      postElement.appendChild(postBody);
      postLink.appendChild(postElement);
      postsContainer.appendChild(postLink);
    });
  }
}
