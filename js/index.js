import { renderPosts } from "./posts/renderPosts.js";

document.addEventListener("DOMContentLoaded", () => {
  renderPosts();
});

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");

  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("editingUser");
      localStorage.removeItem("user");
      window.location.href = "account/login.html";
    });
  }
});
