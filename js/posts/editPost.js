import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";
import { getAccessToken } from "../api/auth.js";
import { deletePost } from "./deletePost.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

/**
 * Fetches a post from the API by its ID and populates the edit form.
 *
 * @param {string} id - The ID of the post to edit.
 */
async function getPostForEdit(id) {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No token found. Are you logged in?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Could not fetch post. Status: ${response.status}`);
    }

    // Populate the form with existing post data
    populateEditForm(data);
  } catch (error) {
    console.error("Error fetching post:", error.message);
  }
}

/**
 * Populates the edit form with the current post data.
 *
 * @param {Object} postData - The post data returned from the API.
 */
function populateEditForm(postData) {
  const post = postData.data;

  // Populate form fields
  document.getElementById("title").value = post.title || "";
  document.getElementById("body").value = post.body || "";
  document.getElementById("image").value = post.media?.url || "";
}

/**
 * Handles form submission and sends the updated post data to the API.
 *
 * @param {Event} event - The form submission event.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault(); // Prevent default form submission behavior

  const id = urlParams.get("id"); // Get the post ID from the URL

  // Get updated data from the form
  const updatedPost = {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    media: {
      url: document.getElementById("image").value,
    },
  };

  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("No token found. Are you logged in?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "PUT", // PUT for updating
      headers,
      body: JSON.stringify(updatedPost),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Could not update post. Status: ${response.status}`);
    }

    alert("Post updated successfully!");
    window.location.href = `/html/singlepost.html?id=${id}`; // Redirect back to the post view page
  } catch (error) {
    console.error("Error updating post:", error.message);
  }
}

// Add event listener for form submission
const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.addEventListener("submit", handleEditFormSubmit);
}

// Fetch the post data when the page loads for editing
getPostForEdit(id);

const deleteButton = document.getElementById("deleteButton");
if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");

    if (confirmDelete) {
      deletePost(id); // Kaller deletePost-funksjonen med ID-en til innlegget
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("editingUser");
      localStorage.removeItem("user"); // Fjerner brukerdata
      window.location.href = "../account/login.html"; // Sender til login
    });
  }
});
