import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

const accessToken = localStorage.getItem("accessToken");
const userData = localStorage.getItem("user");

if (!accessToken || !userData) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

const user = JSON.parse(userData);
const name = user?.username;

if (!name) {
  alert("Invalid user data. Please log in again.");
  window.location.href = "/account/login.html";
}

export async function editPost(event) {
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
    image,
    author,
  };

  try {
    const response = await fetch(`${BASE_URL}/social/posts/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }
    const data = await response.json();
    console.log(data);
    alert("Post updated successfully!");
    window.location.href = "/account/profilepage.html";
  } catch (error) {
    console.error("Error updating post:", error);
    alert("Something went wrong. Please try again.");
  }
}

export async function deletePost() {
  try {
    const response = await fetch(`${BASE_URL}/social/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete post");
    }
    const data = await response.json();
    console.log(data);
    alert("Post deleted successfully!");
    window.location.href = "/";
  } catch (error) {
    console.error("Error deleting post:", error);
    alert("Something went wrong. Please try again.");
  }
}
