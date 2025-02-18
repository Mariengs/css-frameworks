import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";
import { getAccessToken } from "../api/auth.js";
import { deletePost } from "./deletePost.js";

const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");

/**
 * Henter et innlegg fra API-et basert på ID og fyller ut redigeringsskjemaet.
 *
 * @param {string} id - ID-en til innlegget som skal redigeres.
 */
async function getPostForEdit(id) {
  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Ingen token funnet. Er du logget inn?");
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

    if (!response.ok) {
      throw new Error(`Kunne ikke hente innlegget. Status: ${response.status}`);
    }

    const data = await response.json();

    populateEditForm(data);
  } catch (error) {
    console.error("Feil ved henting av innlegg:", error.message);
  }
}

/**
 * Fills the edit form with the current post data, including tags.
 *
 * @param {Object} postData - Post data from the API.
 */
function populateEditForm(postData) {
  const post = postData.data;

  // Fill in existing post data
  document.getElementById("title").value = post.title || "";
  document.getElementById("body").value = post.body || "";
  document.getElementById("image").value = post.media?.url || "";

  const tagsInput = document.getElementById("tagsInput");
  if (tagsInput) {
    tagsInput.value = post.tags ? post.tags.join(", ") : "";
  }
}

/**
 *
 *  Handles the form submission for editing a post and sends the updated data to the API.
 *
 * @param {Event} event - Event object representing the form submission.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault();

  const id = urlParams.get("id");

  // Fetch updated post data
  const updatedPost = {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    media: {
      url: document.getElementById("image").value,
    },
    tags: document
      .getElementById("tagsInput")
      .value.split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== ""),
  };

  try {
    const token = getAccessToken();

    if (!token) {
      throw new Error("Ingen token funnet. Er du logget inn?");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    };

    const response = await fetch(`${BASE_URL}social/posts/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      throw new Error(
        `Kunne ikke oppdatere innlegget. Status: ${response.status}`
      );
    }

    alert("Innlegget ble oppdatert!");
    window.location.href = `../html/singlepost.html?id=${id}`;
  } catch (error) {
    console.error("Feil ved oppdatering av innlegg:", error.message);
  }
}

const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.addEventListener("submit", handleEditFormSubmit);
}

getPostForEdit(id);

const deleteButton = document.getElementById("deleteButton");
if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Er du sikker på at du vil slette dette innlegget?"
    );

    if (confirmDelete) {
      deletePost(id);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("editingUser");
      localStorage.removeItem("user");
      window.location.href = "../account/login.html";
    });
  }
});
