function isLoggedIn() {
  return !!localStorage.getItem("accessToken");
}

function setupAuthNav() {
  const loginLink = document.querySelector('a[href$="login.html"]');
  const registerLink = document.querySelector('a[href$="register.html"]');
  const profileLink = document.querySelector('a[href$="profilepage.html"]');
  const allProfilesLink = document.querySelector('a[href$="allProfiles.html"]');
  const createPostLink = document.querySelector('a[href$="create.html"]');
  const logoutButton = document.getElementById("logoutButton");

  const loggedIn = isLoggedIn();

  // Når IKKE logget inn: vis Login/Register, skjul resten
  if (loginLink) loginLink.parentElement.style.display = loggedIn ? "none" : "";
  if (registerLink)
    registerLink.parentElement.style.display = loggedIn ? "none" : "";

  // Når logget inn: vis Profile / See all profiles / Create post / Logout
  if (profileLink)
    profileLink.parentElement.style.display = loggedIn ? "" : "none";
  if (allProfilesLink)
    allProfilesLink.parentElement.style.display = loggedIn ? "" : "none";
  if (createPostLink)
    createPostLink.parentElement.style.display = loggedIn ? "" : "none";
  if (logoutButton) logoutButton.style.display = loggedIn ? "" : "none";

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
      window.location.href = "/";
    });
  }
}

document.addEventListener("DOMContentLoaded", setupAuthNav);
