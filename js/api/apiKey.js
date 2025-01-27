const apiKey = "<din-api-nøkkel>"; // Erstatt med den faktiske API-nøkkelen

const response = await fetch("https://v2.api.noroff.dev/social/posts", {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  },
});

if (response.ok) {
  const data = await response.json();
  console.log(data); // Logger resultatet
} else {
  console.error("Noe gikk galt:", response.statusText);
}
