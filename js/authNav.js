console.log("authNav.js loaded 🎯");

(function () {
  function initNavAuth() {
    const token = localStorage.getItem("accessToken");

    const loginLink = document.querySelector('a[href$="login.html"]');
    const registerLink = document.querySelector('a[href$="register.html"]');
    const profileLink = document.querySelector('a[href$="profilepage.html"]');
    const allProfilesLink = document.querySelector(
      'a[href$="allProfiles.html"]'
    );
    const createPostLink = document.querySelector('a[href$="create.html"]');
    const logoutButton = document.getElementById("logoutButton");

    if (
      !loginLink &&
      !registerLink &&
      !profileLink &&
      !allProfilesLink &&
      !createPostLink &&
      !logoutButton
    ) {
      return;
    }

    if (!token) {
      if (profileLink) profileLink.style.display = "none";
      if (allProfilesLink) allProfilesLink.style.display = "none";
      if (createPostLink) createPostLink.style.display = "none";
      if (logoutButton) logoutButton.style.display = "none";
    } else {
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
    }

    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData");

        window.location.href = "/";
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavAuth);
  } else {
    initNavAuth();
  }
})();
