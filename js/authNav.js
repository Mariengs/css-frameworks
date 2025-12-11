// js/authNav.js

(function () {
  function initNavAuth() {
    // Endre nøkkelnavn hvis du bruker noe annet enn "accessToken"
    const token = localStorage.getItem("accessToken");

    // Finn lenkene i nav-en (matcher slutten av href)
    const loginLink = document.querySelector('a[href$="login.html"]');
    const registerLink = document.querySelector('a[href$="register.html"]');
    const profileLink = document.querySelector('a[href$="profilepage.html"]');
    const allProfilesLink = document.querySelector(
      'a[href$="allProfiles.html"]'
    );
    const createPostLink = document.querySelector('a[href$="create.html"]');
    const logoutButton = document.getElementById("logoutButton");

    // Hvis vi ikke finner noe som helst, trenger vi ikke gjøre noe
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

    // Ikke logget inn → skjul alt som krever login
    if (!token) {
      if (profileLink) profileLink.style.display = "none";
      if (allProfilesLink) allProfilesLink.style.display = "none";
      if (createPostLink) createPostLink.style.display = "none";
      if (logoutButton) logoutButton.style.display = "none";
    } else {
      // Logget inn → skjul login & register
      if (loginLink) loginLink.style.display = "none";
      if (registerLink) registerLink.style.display = "none";
    }

    // Logout-knapp
    if (logoutButton) {
      logoutButton.addEventListener("click", function () {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userData"); // hvis du lagrer brukerinfo her

        // Samme som "Home"-lenken din
        window.location.href = "/";
      });
    }
  }

  // Sørg for at DOM-en er klar
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initNavAuth);
  } else {
    initNavAuth();
  }
})();
