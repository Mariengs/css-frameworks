import { getAllPosts } from "/js/posts/getAllPosts.js";

export async function renderPosts() {
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    return;
  }

  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = "";

  posts.forEach((post) => {
    const postLink = document.createElement("a");
    postLink.href = `../html/singlepost.html?id=${post.id}`;
    postLink.classList.add("block", "group");

    const postElement = document.createElement("div");
    postElement.classList.add(
      "bg-white",
      "rounded-xl",
      "shadow-md",
      "hover:shadow-xl",
      "transition-all",
      "duration-300",
      "h-full",
      "flex",
      "flex-col",
      "overflow-hidden",
      "border",
      "border-gray-200",
      "hover:border-gray-400",
      "group-hover:-translate-y-1"
    );

    if (post.media) {
      const imageContainer = document.createElement("div");
      imageContainer.classList.add(
        "relative",
        "overflow-hidden",
        "h-48",
        "bg-gray-100"
      );

      const postImage = document.createElement("img");
      postImage.src = post.media.url;
      postImage.alt = post.media.alt || "Post image";
      postImage.classList.add(
        "w-full",
        "h-full",
        "object-cover",
        "group-hover:scale-105",
        "transition-transform",
        "duration-500"
      );

      imageContainer.appendChild(postImage);
      postElement.appendChild(imageContainer);
    }

    const postContent = document.createElement("div");
    postContent.classList.add("p-5", "flex-grow", "flex", "flex-col");

    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;
    postTitle.classList.add(
      "text-lg",
      "font-bold",
      "mb-2",
      "text-gray-800",
      "line-clamp-2",
      "group-hover:text-blue-600",
      "transition-colors"
    );

    const postBody = document.createElement("p");
    postBody.textContent = post.body;
    postBody.classList.add(
      "text-gray-600",
      "text-sm",
      "line-clamp-3",
      "flex-grow"
    );

    postContent.appendChild(postTitle);
    postContent.appendChild(postBody);

    postElement.appendChild(postContent);
    postLink.appendChild(postElement);
    postsContainer.appendChild(postLink);
  });
}
