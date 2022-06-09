/* Progress bar and scrolling background */
const pageProgressBar = document.querySelector(".progress-bar");
const progBarShowOnPx = 10; // amount of pixels before bar is shown

const backToTopButton = document.querySelector(".backToTopBtn");
const bttBtnShowOnPx = 100; // amount of pixels before button is shown

const backgroundImage = document.querySelector(".background-image");

const scrollContainer = () => {
  return document.documentElement || document.body;
};

backToTopButton.addEventListener("click", () => {
  document.body.scrollIntoView();
});

document.addEventListener("scroll", () => {
  const scrolledPercentage =
    (scrollContainer().scrollTop /
      (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
    100;

  // console.log(scrolledPercentage);
  pageProgressBar.style.width = scrolledPercentage + "%";

  if (scrollContainer().scrollTop > progBarShowOnPx)
    pageProgressBar.classList.remove("hidden");
  else pageProgressBar.classList.add("hidden");

  if (scrollContainer().scrollTop > bttBtnShowOnPx)
    backToTopButton.classList.remove("hidden");
  else backToTopButton.classList.add("hidden");

  backgroundImage.style.left = -scrolledPercentage / 2 + "%";
});
