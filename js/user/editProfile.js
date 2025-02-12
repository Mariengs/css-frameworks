import { BASE_URL } from "../api/api.js";
import { apiKey } from "../api/apiKey.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("edit-form");

  // Hent brukeren som skal redigeres fra localStorage
  const editingUser = JSON.parse(localStorage.getItem("editingUser"));
  const token = localStorage.getItem("accessToken");
  const name =
    editingUser.data.name || JSON.parse(localStorage.getItem("user")).username;

  // Logg for å sjekke om tokenet er tilgjengelig
  console.log("AccessToken ved innlasting: ", token);

  if (!token || !editingUser) {
    console.error("Ingen tilgangstoken eller ingen brukerdata");
    window.location.href = "login.html"; // Hvis ingen tilgangstoken eller brukerdata, gå til login
    return;
  }

  // Fyll skjemaet med eksisterende brukerdata
  document.getElementById("name").value = editingUser.data.name || "";
  document.getElementById("bio").value = editingUser.data.bio || "";
  document.getElementById("email").value = editingUser.data.email || "";
  document.getElementById("avatar").value = editingUser.data.avatar?.url || "";
  document.getElementById("banner").value = editingUser.data.banner?.url || "";

  // Når skjemaet blir sendt, oppdater brukerdataene
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // Forhindre at skjemaet sender på vanlig måte

    // Sjekk om tilgangstoken finnes før vi prøver å sende data
    const token = localStorage.getItem("accessToken");
    console.log("Token ved innsending: ", token);

    if (!token) {
      console.error("Ingen tilgangstoken, kan ikke sende forespørsel.");
      window.location.href = "login.html"; // Hvis ingen token finnes, send til login
      return;
    }

    const updatedData = {
      name: document.getElementById("name").value,
      bio: document.getElementById("bio").value,
      email: document.getElementById("email").value,
      avatar: {
        url: document.getElementById("avatar").value, // Send som objekt med url
      },
      banner: {
        url: document.getElementById("banner").value, // Send som objekt med url
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
        console.error("API error:", errorData); // Dette kan gi mer informasjon om hva som er feil
        throw new Error("Kunne ikke oppdatere profilen");
      }

      const updatedUser = await response.json();

      // Lagre de oppdaterte dataene i localStorage
      localStorage.setItem("editingUser", JSON.stringify(updatedUser));

      // Også oppdatere 'user' dataene for å reflektere navnet på tvers av applikasjonen
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: updatedUser.data.username, // Brukerens navn etter oppdatering
          name: updatedUser.data.name, // Lagre det nye navnet
        })
      );

      // Logg for å se at vi har oppdatert profil og brukerdata
      console.log("Oppdatert brukerdata:", updatedUser);

      // Redirect til profilside etter oppdatering
      window.location.href = "/account/profilepage.html"; // Vi skal nå omdirigere til profil-siden
    } catch (error) {
      console.error(error);
      alert("Det oppstod en feil ved oppdatering av profilen.");
    }
  });
});
