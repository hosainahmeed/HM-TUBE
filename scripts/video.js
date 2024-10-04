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
    const [years, months, days, hours, minutes, seconds] = timeAgo(video.others.posted_date);
    const videoContainer = document.createElement("div");
    videoContainer.classList.add(
      "card",
      "card-compact",
      "bg-base-100",
      "shadow-xl"
    );
    videoContainer.innerHTML = `
            <figure><img src="${video.thumbnail}" class="w-full h-[280px] object-cover" alt="${video.title}" /></figure>
            <div class="card-body">
              <div class="flex gap-4">
                <img src="${video.authors[0].profile_picture}" alt="${video.title}" class="w-10 h-10 rounded-full" />
                ${video.others.posted_date
                  ? `<div class="absolute right-4 bg-black text-xs rounded-xl text-white px-6 py-2 bottom-28 z-10">
                      <p>${formatTimeAgo(years, months, days, hours, minutes, seconds)}</p>
                     </div>`
                  : ""}
                <div>
                  <h2 class="card-title font-bold">${video.title}</h2>
                  <p class='inline-block font-bold'>${video.authors[0].profile_name}</p>
                  <span class='inline-block'>
                    ${video.authors[0].verified
                      ? `<img class='w-5 h-5 inline-block' src="./assets/verify.png">`
                      : ""}
                  </span>
                  <p>${video.others.views}</p>
                </div>
              </div>
            </div>
        `;
    document.getElementById("videos").appendChild(videoContainer);
  });
};

const formatTimeAgo = (years, months, days, hours, minutes, seconds) => {
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

loadCategories();   
loadVideos();
