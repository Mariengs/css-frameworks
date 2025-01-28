import { getAllPosts } from "/js/posts/getAllPosts.js";

/**
 * Renders a list of posts onto the page.
 * Fetches posts from an API and dynamically creates HTML elements
 * to display each post in the `#posts-container` element.
 *
 * Each post is clickable and redirects to a single post page.
 *
 * @async
 * @function renderPosts
 * @returns {Promise<void>} Resolves when the posts are rendered, or logs an error if no posts are found.
 */
export async function renderPosts() {
  // Hent alle poster fra API-et
  const posts = await getAllPosts();

  if (!posts || posts.length === 0) {
    console.error("Ingen poster funnet!");
    return;
  }

  // Velg containeren hvor postene skal vises
  const postsContainer = document.getElementById("posts-container");
  postsContainer.innerHTML = ""; // Rens eventuelle tidligere data før visning

  /**
   * Iterates through the posts and adds them to the page.
   * Each post is wrapped in an `<a>` element with a link to a single post view page.
   */

  posts.forEach((post) => {
    // Opprett lenke-elementet for hele posten
    const postLink = document.createElement("a");
    postLink.href = `../html/singlepost.html?id=${post.id}`; // URL med innleggets ID
    postLink.classList.add("post-link"); // CSS-klasse for styling

    // Opprett div-element for posten
    const postElement = document.createElement("div");
    postElement.classList.add("post"); // CSS-klasse for styling

    // Opprett tittel-element
    const postTitle = document.createElement("h3");
    postTitle.textContent = post.title;

    // Opprett innhold-element
    const postBody = document.createElement("p");
    postBody.textContent = post.body; // Viser innholdet i innlegget

    // Legg til bilde hvis det finnes
    if (post.media) {
      const postImage = document.createElement("img");
      postImage.src = post.media.url;
      postImage.alt = post.media.alt || "Post image";
      postElement.appendChild(postImage);
    }

    // Legg til tittel og innhold i postElement
    postElement.appendChild(postTitle);
    postElement.appendChild(postBody);

    // Gjør hele postElement klikkbart ved å legge det inne i postLink
    postLink.appendChild(postElement);

    // Legg postLink til i containeren
    postsContainer.appendChild(postLink);
  });
}
