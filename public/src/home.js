document.addEventListener("DOMContentLoaded", async () => {
  const publicImagesList = document.getElementById("public-images-list");
  // local storage of likes
  function getNumberOfLikes() {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    return likes;
  }
  // fetching public images
  async function fetchPublicImages() {
    try {
      const res = await fetch("/api/images");
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      const images = await res.json();
      if (!publicImagesList) {
        publicImagesList.innerHTML = "<p>There are no images here yet.</p>";
        return;
      }
      const storeLikes = getNumberOfLikes();
      publicImagesList.innerHTML = "";
      images.forEach((image) => {
        // display div
        const div = document.createElement("div");
        div.className = "grid-item";
        // display public images
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.title;
        img.onerror = () => {
          this.onerror = null;
          this.src = "https://via.placeholder.com/300?text=Image+Not+Found";
        };
        // title of an image
        const imageTitle = document.createElement("h3");
        imageTitle.innerText = image.title;
        // display a user
        const user = document.createElement("p");
        user.innerText = image.postedBy;
        // heart icon and number of likes
        const likeDisplay = document.createElement("p");
        const heartIcon = document.createElement("strong");
        heartIcon.className = "heart-icon";
        heartIcon.innerHTML = "&#9829;  ";
        const span = document.createElement("span");
        localStorage.setItem("likes", JSON.stringify(storeLikes));
        span.innerText = `${storeLikes[image._id] || 0} likes`;
        // append elements
        div.appendChild(img);
        div.appendChild(imageTitle);
        div.appendChild(user);
        likeDisplay.appendChild(heartIcon);
        likeDisplay.appendChild(span);
        div.appendChild(likeDisplay);
        publicImagesList.appendChild(div);
      });
      // Masonry
      new Masonry(publicImagesList, {
        itemSelector: ".grid-item",
        columnWidth: ".grid-item",
        percentPosition: true,
      });
    } catch (error) {
      console.error("Error fetching public images:", error);
    }
  }
  // loading public images
  window.onload = fetchPublicImages();
});
