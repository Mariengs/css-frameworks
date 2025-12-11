function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  return !!token;
}

function setupAuthNav() {
  console.log("setupAuthNav kjører...");

  const loginItem = document.getElementById("nav-login");
  const registerItem = document.getElementById("nav-register");
  const profileItem = document.getElementById("nav-profile");
  const allProfilesItem = document.getElementById("nav-all-profiles");
  const createItem = document.getElementById("nav-create");
  const logoutItem = document.getElementById("nav-logout");
  const logoutButton = document.getElementById("logoutButton");

  const loggedIn = isLoggedIn();

  if (loginItem) loginItem.style.display = loggedIn ? "none" : "";
  if (registerItem) registerItem.style.display = loggedIn ? "none" : "";

  if (profileItem) profileItem.style.display = loggedIn ? "" : "none";
  if (allProfilesItem) allProfilesItem.style.display = loggedIn ? "" : "none";
  if (createItem) createItem.style.display = loggedIn ? "" : "none";
  if (logoutItem) logoutItem.style.display = loggedIn ? "" : "none";

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("Logout klikket – fjerner token og user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    });
  }
}

document.addEventListener("DOMContentLoaded", setupAuthNav);
