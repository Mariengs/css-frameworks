import { BASE_URL } from "../api/api.js";

const user = JSON.parse(localStorage.getItem("user"));
const name = user?.username || "defaultName";

const accessToken = localStorage.getItem("accessToken");

if (!accessToken) {
  alert("You must be logged in to create a post.");
  window.location.href = "/account/login.html";
}

export async function createPost(event) {
  event.preventDefault();

  const title = document.getElementById("title").value.trim();
  const body = document.getElementById("body").value.trim();
  const image = document.getElementById("image").value.trim();
  const author = document.getElementById("author").value.trim();

  if (!title || !body || !image || !author) {
    alert("All fields are required");
    return;
  }

  const postData = {
    title,
    body,
    tags: [],
    media: {
      url: image,
      alt: "Post image",
    },
    author: {
      name: author,
    },
  };

  try {
    const response = await fetch(`${BASE_URL}/social/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }
    const data = await response.json();
    console.log(data);
    alert("Post created successfully!");
    window.location.href = "/account/profilepage.html";
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Something went wrong. Please try again.");
  }
}
