console.log("authNav.js loaded 🎯");

function isLoggedIn() {
  const token = localStorage.getItem("accessToken");
  console.log("isLoggedIn? token:", token ? "✅ finnes" : "❌ finnes ikke");
  return !!token;
}

function setupAuthNav() {
  console.log("setupAuthNav kjører...");

  const loginLink = document.querySelector('a[href$="login.html"]');
  const registerLink = document.querySelector('a[href$="register.html"]');
  const profileLink = document.querySelector('a[href$="profilepage.html"]');
  const allProfilesLink = document.querySelector('a[href$="allProfiles.html"]');
  const createPostLink = document.querySelector('a[href$="create.html"]');
  const logoutButton = document.getElementById("logoutButton");

  console.log("Elementer funnet:", {
    loginLink,
    registerLink,
    profileLink,
    allProfilesLink,
    createPostLink,
    logoutButton,
  });

  const loggedIn = isLoggedIn();

  // Når IKKE logget inn: vis Login/Register, skjul resten
  if (loginLink && loginLink.parentElement) {
    loginLink.parentElement.style.display = loggedIn ? "none" : "";
  }
  if (registerLink && registerLink.parentElement) {
    registerLink.parentElement.style.display = loggedIn ? "none" : "";
  }

  // Når logget inn: vis Profile / See All Profiles / Create post / Logout
  if (profileLink && profileLink.parentElement) {
    profileLink.parentElement.style.display = loggedIn ? "" : "none";
  }
  if (allProfilesLink && allProfilesLink.parentElement) {
    allProfilesLink.parentElement.style.display = loggedIn ? "" : "none";
  }
  if (createPostLink && createPostLink.parentElement) {
    createPostLink.parentElement.style.display = loggedIn ? "" : "none";
  }
  if (logoutButton) {
    logoutButton.style.display = loggedIn ? "" : "none";
  }

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      console.log("Logout klikket – fjerner token og user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    });
  }

  console.log("Nav oppdatert, loggedIn =", loggedIn);
}

document.addEventListener("DOMContentLoaded", setupAuthNav);
