import { BASE_URL } from "../api/api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  const userData = JSON.parse(localStorage.getItem("editingUser"));

  if (!userData) {
    window.location.href = "profile.html";
    return;
  }

  document.getElementById("name").value = userData.name;
  document.getElementById("bio").value = userData.bio;

  document.getElementById("saveButton").addEventListener("click", async () => {
    const updatedUser = {
      name: document.getElementById("name").value,
      bio: document.getElementById("bio").value,
    };

    try {
      const response = await fetch(`${BASE_URL}social/profiles${name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        throw new Error("Kunne ikke oppdatere brukerdata");
      }

      const updatedData = await response.json();
      localStorage.setItem("editingUser", JSON.stringify(updatedData)); // Oppdater lagrede data

      window.location.href = "profile.html"; // Send tilbake til profil
    } catch (error) {
      console.error(error);
      alert("Feil ved oppdatering av profil");
    }
  });
});
