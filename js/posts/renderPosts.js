import { getAllPosts } from "/js/posts/getAllPosts.js";
import { BASE_URL } from "../api/api.js";

export async function renderPosts() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    console.error("No posts found!");
    return;
  }

  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postLink = document.createElement("a");
    postLink.href = `../html/singlepost.html?id=${post.id}`;
    postLink.classList.add(
      "block",
      "hover:scale-105",
      "transition-transform",
      "duration-300"
    );

    const postElement = document.createElement("div");
    postElement.classList.add(
      "bg-white",
      "p-4",
      "rounded-lg",
      "shadow-lg",
      "hover:shadow-xl",
      "transition-shadow",
      "duration-300",
      "h-full",
      "flex",
      "flex-col"
    );

    if (post.media) {
      const postImage = document.createElement("img");
      postImage.src = post.media.url;
      postImage.alt = post.media.alt || "Post image";
      postImage.classList.add("w-full", "h-48", "object-cover", "rounded-t-lg");
      postElement.appendChild(postImage);
    }

    const postContent = document.createElement("div");
    postContent.classList.add("flex-grow", "flex", "flex-col");

    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;
    postTitle.classList.add("text-xl", "font-semibold", "mb-2");

    const postBody = document.createElement("p");
    postBody.textContent = post.body;
    postBody.classList.add("text-gray-600", "truncate-2-lines");

    postContent.appendChild(postTitle);
    postContent.appendChild(postBody);

    postElement.appendChild(postContent);
    postLink.appendChild(postElement);
    postsContainer.appendChild(postLink);
  });
}
