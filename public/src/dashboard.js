document.addEventListener("DOMContentLoaded", async () => {
  const imageForm = document.getElementById("add-image-form");
  const imagesList = document.getElementById("images-list");
  //disabled dashboard link
  const dashboard = document.getElementById("dashboard");
  dashboard.addEventListener("click", (e) => e.preventDefault());
  dashboard.style.pointerEvents = "none";
  dashboard.style.backgroundColor = "gray";
  dashboard.style.color = "black";
  dashboard.removeAttribute("href");
  // local storage of likes
  function getNumberOfLikes() {
    const likes = JSON.parse(localStorage.getItem("likes")) || {};
    return likes;
  }
  // image form
  imageForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const yourData = new FormData(e.target);
    const data = {
      title: yourData.get("title"),
      url: yourData.get("url"),
    };
    try {
      const res = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      await res.json();
      e.target.reset();
      fetchImages();
      alert("You added an image.");
    } catch (error) {
      console.error("Error adding images:", error);
    }
  });
  // fetching user's images
  async function fetchImages() {
    try {
      const res = await fetch("/api/my-images");
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      const images = await res.json();
      if (!imagesList) {
        imagesList.innerHTML = "<p>There are no images here yet.</p>";
        return;
      }
      const storeLikes = getNumberOfLikes();
      imagesList.innerHTML = "";
      images.forEach((image) => {
        // display div
        const div = document.createElement("div");
        div.className = "grid-item";
        // display images
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
          span.innerText = `${currentLikes} likes`;
          alert("You liked an image.");
        };
        // delete images
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerText = "Delete Image";
        deleteBtn.onclick = () => deleteImages(image._id);
        // append elements
        div.appendChild(img);
        div.appendChild(imageTitle);
        div.appendChild(user);
        likeDisplay.appendChild(heartIcon);
        likeDisplay.appendChild(span);
        div.appendChild(likeDisplay);
        div.appendChild(deleteBtn);
        imagesList.appendChild(div);
      });
      // Masonry
      new Masonry(imagesList, {
        itemSelector: ".grid-item",
        columnWidth: ".grid-item",
        percentPosition: true,
      });
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  }
  // delete id's images
  async function deleteImages(id) {
    try {
      const res = await fetch(`/api/my-images/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        console.error(res.statusText);
        return;
      }
      // delete likes after deleting images
      const deleteLikes = JSON.parse(localStorage.getItem("likes")) || {};
      if (deleteLikes[id] !== undefined) {
        delete deleteLikes[id];
        localStorage.setItem("likes", JSON.stringify(deleteLikes));
      }
      fetchImages();
      alert("You deleted an image.");
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  }
  // loading images
  window.onload = fetchImages();
});
