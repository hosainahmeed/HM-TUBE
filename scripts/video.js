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

const timeAgo = (date) => {
  const seconds = parseInt(date % 60);
  const minutes = parseInt((date / 60) % 60);
  const hours = parseInt((date / 3600) % 24);
  const days = parseInt((date / 86400) % 30);
  const months = parseInt((date / 2592000) % 12);
  const years = parseInt(date / 31536000);
  return [years, months, days, hours, minutes, seconds];
};

const displayCategories = (categories) => {
  categories.forEach((category) => {
    const button = document.createElement("button");

    button.classList.add("btn", "hover:bg-[red]", "hover:text-white");
    button.innerText = category.category;
    button.setAttribute("id", `category-${category.category_id}`);
    document.getElementById("categories").appendChild(button);
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      document.querySelectorAll("#categories button").forEach((btn) => {
        btn.classList.remove("bg-[red]", "text-white", "activeBtn");
      });

      // Add active class to clicked button
      button.classList.add("bg-[red]", "text-white", "activeBtn");

      console.log(category.category_id);

      fetch(
        `https://openapi.programming-hero.com/api/phero-tube/category/${category.category_id}`
      )
        .then((res) => res.json())
        .then((data) => displayVideos(data.category))
        .catch((error) => console.error("Error:", error));
    });
  });
};

const handleDetails = async (details) => {
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${details}`;
  const res = await fetch(uri);
  const data = await res.json();
  modalDetails(data.video);
};
const modalTitle = document.querySelector(".modalTitle");
const modalbox = document.querySelector(".modal-box");
const modaldetails = document.querySelector(".modal-box p");
const modalDetails = (details) => {
  modalTitle.innerText = details.title;
  modalbox.innerHTML = `
  <div class="flex justify-center items-center">
  <img src="${details.thumbnail}" alt="${details.title}" class="w-full h-[280px] object-cover">
  </div>
  <h1 class="text-xl font-bold">${details.title}</h1>
  <p>${details.description}</p>
   <form method="dialog">
        <button class="btn btn-sm btn-circle btn-error absolute right-2 bottom-2">✕</button>
    </form>
  `;
  customModal.showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";
  if (videos.length == 0) {
    videoContainer.classList.add("relative");
    videoContainer.innerHTML = `
      <div class="text-center text-2xl font-bold absolute top-1/2 left-1/2 -translate-x-1/2">
      <div class="flex justify-center items-center">
      <img src="${"./assets/Icon.png"}" alt="no-content" class="w-1/2">
      </div>
      <p class="text-xl font-bold">Oops! No videos found</p>
      </div>
      `;
    return;
  }
  videos.forEach((video) => {
    const [years, months, days, hours, minutes, seconds] = timeAgo(
      video.others.posted_date
    );
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
                    ? `<div class="absolute right-4 bg-black text-xs rounded-xl text-white px-6 py-2 bottom-28 z-10">
                      <p>${formatTimeAgo(
                        years,
                        months,
                        days,
                        hours,
                        minutes,
                        seconds
                      )}</p>
                     </div>`
                    : ""
                }
                <div>
                  <h2 class="card-title font-bold">${video.title}</h2>
                  <p class='inline-block font-bold'>${
                    video.authors[0].profile_name
                  }</p>
                  <span class='inline-block'>
                    ${
                      video.authors[0].verified
                        ? `<img class='w-5 h-5 inline-block' src="./assets/verify.png">`
                        : ""
                    }
                  </span>
                  <p>${video.others.views}</p>
                </div>
            <div class="absolute top-0 left-0 rounded-xl opacity-0 hover:opacity-100 transition-all duration-300 w-full h-full flex justify-center items-center z-[999] bg-[#00000090]">
                <button onclick="handleDetails('${
                  video.video_id
                }')" class="btn btn-circle px-8 text-white btn-outline"><h1>Details</h1></button>
            </div>
              </div>
            </div>
        `;
    document.getElementById("videos").appendChild(videoContainer);
  });
};

const formatTimeAgo = (years, months, days, hours, minutes, seconds) => {
  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
};

loadCategories();
loadVideos();
