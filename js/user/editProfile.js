import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-form");

  const editingUser = JSON.parse(localStorage.getItem("editingUser"));
  const token = localStorage.getItem("accessToken");
  const name =
    editingUser.data.name || JSON.parse(localStorage.getItem("user")).username;

  document.getElementById("name").value = editingUser.data.name || "";
  document.getElementById("bio").value = editingUser.data.bio || "";
  document.getElementById("email").value = editingUser.data.email || "";
  document.getElementById("avatar").value = editingUser.data.avatar?.url || "";
  document.getElementById("banner").value = editingUser.data.banner?.url || "";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");

    const updatedData = {
      name: document.getElementById("name").value,
      bio: document.getElementById("bio").value,
      email: document.getElementById("email").value,
      avatar: {
        url: document.getElementById("avatar").value,
      },
      banner: {
        url: document.getElementById("banner").value,
      },
    };
    console.log("Oppdaterte data:", updatedData);

    try {
      const response = await fetch(`${BASE_URL}social/profiles/${name}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error("Kunne ikke oppdatere profilen");
      }

      const updatedUser = await response.json();

      localStorage.setItem("editingUser", JSON.stringify(updatedUser));

      window.location.href = "/account/profilepage.html";
    } catch (error) {
      console.error(error);
      alert("Det oppstod en feil ved oppdatering av profilen.");
    }
  });
});
