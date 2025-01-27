import { getAllPosts } from "/js/posts/getAllPosts.js";

// Funksjon for å vise postene på nettsiden
export async function renderPosts() {
  const posts = await getAllPosts(); // Hent alle poster fra API

  if (!posts || posts.length === 0) {
    console.error("Ingen poster funnet!");
    return;
  }

  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Rens eventuelle tidligere data før visning

  // Iterer gjennom postene og legg dem til på siden
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.classList.add("post"); // Legg til en CSS-klasse for styling

    // Legg til tittel og innhold
    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;

    const postBody = document.createElement("p");
    postBody.textContent = post.body; // Eller post.body hvis du vil vise selve innholdet
    if (post.media) {
      const postImage = document.createElement("img");
      postImage.src = post.media.url;
      postImage.alt = post.media.alt;
      postElement.appendChild(postImage);
    }

    // Legg til post-elementene i div
    postElement.appendChild(postTitle);
    postElement.appendChild(postBody);

    // Legg post-elementet til i containeren
    postsContainer.appendChild(postElement);
  });
}
