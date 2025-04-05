const editButton = document.getElementById("editButton");
const buttonText = editButton.querySelector(".button-text");

editButton.addEventListener("click", () => {
  editButton.disabled = true;
  buttonText.textContent = "Saving...";

  setTimeout(() => {
    editButton.disabled = false;
    buttonText.textContent = "Edit";
  }, 2000);
});
