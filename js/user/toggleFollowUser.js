import { BASE_URL } from "../api/api.js";
import { getAccessToken } from "../api/auth.js";

export async function toggleFollowUser(profileName, follow) {
  try {
    const response = await fetch(`${BASE_URL}social/profile/${name}/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to toggle follow");
    }
  } catch (error) {
    console.error(error);
  }
}

const followButton = document.getElementById("follow-btn");
const unfollowButton = document.getElementById("unfollow-btn");

followButton.addEventListener("click", async () => {
  const profileName = followButton.dataset.profile;
  await toggleFollowProfile(profileName, true);
  alert(`Now following ${profileName}`);
});

unfollowButton.addEventListener("click", async () => {
  const profileName = unfollowButton.dataset.profile;
  await toggleFollowProfile(profileName, false);
  alert(`Unfollowed ${profileName}`);
});

// export async function toggleUnfollowUser() {
//   try {
//     const response = await fetch(`${BASE_URL}social/profile/${name}/unfollow`, {
//       method: "DELETE",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${getAccessToken()}`,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }
