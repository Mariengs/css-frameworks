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

    // Fyll ut skjemaet med eksisterende innleggsdata
    populateEditForm(data);
  } catch (error) {
    console.error("Feil ved henting av innlegg:", error.message);
  }
}

/**
 * Fyller ut redigeringsskjemaet med gjeldende innleggsdata, inkludert tags.
 *
 * @param {Object} postData - Innleggsdata fra API-et.
 */
function populateEditForm(postData) {
  const post = postData.data;

  // Fyll inn skjemaets felter
  document.getElementById("title").value = post.title || "";
  document.getElementById("body").value = post.body || "";
  document.getElementById("image").value = post.media?.url || "";

  // Fyll inn eksisterende tags i input-feltet
  const tagsInput = document.getElementById("tagsInput");
  if (tagsInput) {
    tagsInput.value = post.tags ? post.tags.join(", ") : "";
  }
}

/**
 * Håndterer innsending av skjemaet og sender oppdaterte data til API-et.
 *
 * @param {Event} event - Skjemainnsendingshendelsen.
 */
async function handleEditFormSubmit(event) {
  event.preventDefault(); // Hindrer standard innsending av skjemaet

  const id = urlParams.get("id"); // Hent innleggets ID fra URL-en

  // Hent oppdaterte data fra skjemaet
  const updatedPost = {
    title: document.getElementById("title").value,
    body: document.getElementById("body").value,
    media: {
      url: document.getElementById("image").value,
    },
    tags: document
      .getElementById("tagsInput")
      .value.split(",")
      .map((tag) => tag.trim()) // Fjerner mellomrom rundt tags
      .filter((tag) => tag !== ""), // Fjerner tomme tags
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
      method: "PUT", // PUT brukes for oppdatering
      headers,
      body: JSON.stringify(updatedPost),
    });

    if (!response.ok) {
      throw new Error(
        `Kunne ikke oppdatere innlegget. Status: ${response.status}`
      );
    }

    alert("Innlegget ble oppdatert!");
    window.location.href = `../html/singlepost.html?id=${id}`; // Omadresserer til innleggets visningsside
  } catch (error) {
    console.error("Feil ved oppdatering av innlegg:", error.message);
  }
}

// Legg til event listener for skjemainnsending
const editForm = document.getElementById("editForm");
if (editForm) {
  editForm.addEventListener("submit", handleEditFormSubmit);
}

// Hent innleggsdata ved lasting av siden for redigering
getPostForEdit(id);

const deleteButton = document.getElementById("deleteButton");
if (deleteButton) {
  deleteButton.addEventListener("click", () => {
    const confirmDelete = confirm(
      "Er du sikker på at du vil slette dette innlegget?"
    );

    if (confirmDelete) {
      deletePost(id); // Kaller deletePost-funksjonen med innleggets ID
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
      window.location.href = "../account/login.html"; // Sender til innloggingssiden
    });
  }
});
