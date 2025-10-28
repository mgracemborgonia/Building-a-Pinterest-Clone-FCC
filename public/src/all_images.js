document.addEventListener("DOMContentLoaded", async () => {
  const allImagesList = document.getElementById("all-images-list");
  //disabled all images link
  const allImages = document.getElementById("all-images");
  allImages.addEventListener("click", (e) => e.preventDefault());
  allImages.style.pointerEvents = "none";
  allImages.style.backgroundColor = "gray";
  allImages.style.color = "black";
  allImages.removeAttribute("href");
  // local storage of likes
  function getNumberOfLikes() {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    return likes;
  }
  // fetching all images
  async function fetchAllImages() {
    try {
      const res = await fetch("/api/my-images");
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      const images = await res.json();
      if (!allImagesList) {
        allImagesList.innerHTML =
          "<p>You do not have saved images here yet.</p>";
        return;
      }
      const storeLikes = getNumberOfLikes();
      allImagesList.innerHTML = "";
      images.forEach((image) => {
        const div = document.createElement("div");
        div.className = "grid-item";
        // display saved images
        const img = document.createElement("img");
        img.src = image.url;
        img.alt = image.title;
        img.onerror = function () {
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
        heartIcon.innerHTML =
          storeLikes[image._id] > 0 ? "&#9829;  " : "&#9825;  ";
        const span = document.createElement("span");
        span.innerText = `${storeLikes[image._id] || 0} likes`;
        // click a heart icon to like
        heartIcon.onclick = () => {
          let currentLikes = storeLikes[image._id] || 0;
          currentLikes++;
          storeLikes[image._id] = currentLikes;
          localStorage.setItem("likes", JSON.stringify(storeLikes));
          heartIcon.innerHTML = "&#9829;  ";
          span.innerText = `${currentLikes}  likes`;
        };
        // append elements
        div.appendChild(img);
        div.appendChild(imageTitle);
        div.appendChild(user);
        likeDisplay.appendChild(heartIcon);
        likeDisplay.appendChild(span);
        div.appendChild(likeDisplay);
        allImagesList.appendChild(div);
      });
      // Masonry
      new Masonry(allImagesList, {
        itemSelector: ".grid-item",
        columnWidth: ".grid-item",
        percentPosition: true,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
  // loading all images
  window.onload = fetchAllImages();
});
