const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.error("Error:", error));
};

const loadVideos = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => displayVideos(data.videos))
    .catch((error) => console.error("Error:", error));
};

const displayCategories = (categories) => {
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.classList.add(
      "btn",
      "btn-active",
      "hover:bg-[red]",
      "hover:text-white"
    );
    button.innerText = category.category;
    document.getElementById("categories").appendChild(button);
  });
};

const displayVideos = (videos) => {
  videos.forEach((video) => {
    const videoContainer = document.createElement("div");
    videoContainer.classList.add(
      "card",
      "card-compact",
      "bg-base-100",
      "shadow-xl"
    );
    videoContainer.innerHTML = `
            <figure><img src="${
              video.thumbnail
            }" class="w-full h-[280px] object-cover" alt="${
      video.title
    }" /></figure>
            <div class="card-body">
              <div class="flex gap-4">
                <img src="${video.authors[0].profile_picture}" alt="${
      video.title
    }" class="w-10 h-10 rounded-full" />
    ${
      video.others.posted_date
        ? `<div class="absolute right-4 bg-black rounded-xl text-white px-6 py-2 bottom-28 z-10">
    <p>${video.others.posted_date}</p>
    </div>`
        : ""
    }
                <div>
                  <h2 class="card-title font-bold">${video.title}</h2>
                  <p class='inline-block font-bold'>${
                    video.authors[0].profile_name
                  }</p> <span class='inline-block'>${
      video.authors[0].verified
        ? `<img class='w-5 h-5 inline-block' src="./assets/verify.png">`
        : ""
    }</span>
                  <p>${video.others.views}</p>
                </div>
              </div>
            </div>
        `;
    console.log(video);

    document.getElementById("videos").appendChild(videoContainer);
  });
};

loadCategories();
loadVideos();
