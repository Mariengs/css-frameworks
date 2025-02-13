import { REGISTER_URL } from "../api/api.js";

function getValues() {
  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = document.getElementById("email").value.trim();
  const bio = document.getElementById("bio")?.value.trim();
  const avatarUrl = document.getElementById("avatar")?.value.trim();

  if (!name || !password || !email) {
    alert("All fields are required");
    return null; // Viktig for å unngå videre behandling
  }

  return { name, password, email, bio, avatarUrl };
}

function createRequestBody({ name, email, password, bio, avatarUrl }) {
  return {
    name,
    email,
    password,
    bio: bio || "Default bio", // Standardverdi hvis bio ikke er oppgitt
    avatar: {
      url: avatarUrl || "placeholder.png", // Standardverdi hvis avatar ikke er oppgitt
      alt: "avatar.png",
    },
  };
}

async function registerUser(requestBody) {
  try {
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Something went wrong:", errorData);
      throw new Error(
        `Registration failed: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    localStorage.setItem("accessToken", data.accessToken);
    alert("Registration successful! Welcome!");
    window.location.href = "login.html";
  } catch (error) {
    alert(`Something went wrong: ${error.message}`);
  }
}

document
  .getElementById("registerform")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const values = getValues();
    if (!values) {
      return;
    }

    const requestBodyData = createRequestBody(values);

    registerUser(requestBodyData);
  });
