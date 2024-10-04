const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.error("Error:", error));
};

const loadVideos = (searchTerm = "") => {
  fetch("https://openapi.programming-hero.com/api/phero-tube/videos")
    .then((res) => res.json())
    .then((data) => {
      let videos = data.videos;
      if (searchTerm) {
        videos = videos.filter((video) =>
          video.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      displayVideos(videos);
    })
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
      document.querySelectorAll("#categories button").forEach((btn) => {
        btn.classList.remove("bg-[red]", "text-white", "activeBtn");
      });
      button.classList.add("bg-[red]", "text-white", "activeBtn");
      fetch(
        `https://openapi.programming-hero.com/api/phero-tube/category/${category.category_id}`
      )
        .then((res) => res.json())
        .then((data) => displayVideos(data.category))
        .catch((error) => console.error("Error:", error));
    });
  });
};

const searchInput = document.querySelector("#search-input input");
searchInput.addEventListener("keyup", (e) => {
  const searchValue = e.target.value;
  loadVideos(searchValue);
});

const handleDetails = async (details) => {
  const uri = `https://openapi.programming-hero.com/api/phero-tube/video/${details}`;
  const res = await fetch(uri);
  const data = await res.json();
  modalDetails(data.video);
};

const modalTitle = document.querySelector(".modalTitle");
const modalbox = document.querySelector(".modal-box");
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
      </form>`;
  customModal.showModal();
};

const displayVideos = (videos) => {
  const videoContainer = document.getElementById("videos");
  videoContainer.innerHTML = "";
  if (videos.length === 0) {
    videoContainer.innerHTML = `
         <div class="flex items-center justify-center flex-col absolute top-1/2 left-1/2 -translate-x-1/2 ">
          <img src="./assets/Icon.png" alt="no-content" class="w-1/2 mb-2" />
          <p class="text-[2rem] font-bold text-center">Oops! No videos found</p>
        </div>`;
    return;
  }

  // Move this sorting logic to a separate function
  sortVideos(videos, 'desc');

  const sortedVideos = videos.sort((a, b) => b.others.views - a.others.views);
  const allViews = sortedVideos.map(video => parseInt(video.others.views.replace(/[^0-9]/g, '')));

  console.log(allViews);
//   (12) [100, 543, 11, 54, 36, 113, 11, 233, 45, 241, 26, 76]



  videos.forEach((video) => {
    const [years, months, days, hours, minutes, seconds] = timeAgo(
      video.others.posted_date
    );
    const videoCard = document.createElement("div");
    videoCard.classList.add("card", "card-compact", "bg-base-100", "shadow-xl");
    videoCard.innerHTML = `
        <figure>
          <img src="${
            video.thumbnail
          }" class="w-full h-[280px] object-cover" alt="${video.title}" />
        </figure>
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
              <p class="inline-block font-bold">${
                video.authors[0].profile_name
              }</p>
              <span class="inline-block">
                ${
                  video.authors[0].verified
                    ? `<img class="w-5 h-5 inline-block" src="./assets/verify.png">`
                    : ""
                }
              </span>
              <p>${video.others.views} views</p>
            </div>
            <div class="absolute top-0 left-0 rounded-xl opacity-0 hover:opacity-100 transition-all duration-300 w-full h-full flex justify-center items-center z-[99] bg-[#00000090]">
              <button onclick="handleDetails('${
                video.video_id
              }')" class="btn btn-circle px-8 text-white btn-outline">
                <h1>Details</h1>
              </button>
            </div>
          </div>
        </div>`;
    videoContainer.appendChild(videoCard);
  });
};

const formatTimeAgo = (years, months, days, hours, minutes, seconds) => {
  if (years) return `${years} years ago`;
  if (months) return `${months} months ago`;
  if (days) return `${days} days ago`;
  if (hours) return `${hours} hours ago`;
  if (minutes) return `${minutes} minutes ago`;
  return `${seconds} seconds ago`;
};

const sortVideos = (videos, order = 'desc') => {
  return videos.sort((a, b) => {
    const viewsA = parseInt(a.others.views.replace(/[^0-9]/g, ''));
    const viewsB = parseInt(b.others.views.replace(/[^0-9]/g, ''));
    return order === 'desc' ? viewsB - viewsA : viewsA - viewsB;
  });
};

const handleSort = (order) => {
  const videos = document.querySelectorAll('#videos .card');
  const sortedVideos = Array.from(videos).sort((a, b) => {
    const viewsA = parseInt(a.querySelector('p:last-child').textContent);
    const viewsB = parseInt(b.querySelector('p:last-child').textContent);
    return order === 'desc' ? viewsB - viewsA : viewsA - viewsB;
  });
  const videoContainer = document.getElementById('videos');
  videoContainer.innerHTML = '';
  sortedVideos.forEach(video => videoContainer.appendChild(video));
};

loadCategories();
loadVideos();

// Add this at the end of the file or in your initialization code
document.addEventListener('DOMContentLoaded', () => {
  const sortDropdown = document.createElement('div');
  sortDropdown.classList.add('dropdown', 'dropdown-end');
  sortDropdown.innerHTML = `
    <label tabindex="0" class="btn btn-info text-white text-base font-semibold">Sort by view</label>
    <ul tabindex="0" class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li><a onclick="handleSort('desc')">Highest to Lowest Views</a></li>
      <li><a onclick="handleSort('asc')">Lowest to Highest Views</a></li>
    </ul>
  `;
  document.querySelector('nav').appendChild(sortDropdown);
});
