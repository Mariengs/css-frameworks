import { REGISTER_URL } from "../api/api.js";

function getValues() {
  const name = document.getElementById("name").value;
  const password = document.getElementById("password").value;
  const email = document.getElementById("email").value;

  if (!name || !password || !email) {
    alert("All felds are required");
    return;
  }

  return { name, password, email };
}

function requestBody({ name, email, password, bio, avatar }) {
  return {
    name,
    email,
    password,
    bio,
    avatar: {
      url: "avatarURL",
      alt: "avatar",
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
    alert("Registration successful! Welcome!");
    window.location.href = "/account/login.html";
  } catch (error) {
    alert(`Something went wrong: ${error.message}`);
  }
}

document
  .getElementById("registerform")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const bodyValues = getValues();

    const requestBody = requestBody(bodyValues);

    registerUser(requestBody);
  });
