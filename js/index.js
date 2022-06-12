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

// ===== hero sections flipdown =====

// Unix timestamp (in seconds) to count down to
const eventStart = Math.round(+new Date(2022, 10, 15, 16) / 1000); // 15th October 2022 at 4 pm in seconds

// Set up FlipDown
const flipdown = new FlipDown(eventStart, {
  headings: ["Dani", "Sati", "Minute", "Sekunde"],
});

// Start the countdown
flipdown.start();

// Do something when the countdown ends
flipdown.ifEnded(() => {
  console.log("The countdown has ended!");
});

// ===== kontakt sections cards =====

VanillaTilt.init(document.querySelectorAll(".kontakt-sec__card"), {
  glare: true,
  reverse: true,
  "max-glare": 0.15,
});
