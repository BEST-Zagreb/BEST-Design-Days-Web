// Progress bar
const progressBarElement = document.createElement("div");
progressBarElement.classList.add("progress-bar");
document.querySelector("body").appendChild(progressBarElement);
const progBarShowOnPx = 10; // amount of pixels before bar is shown

// Back to top button
const backToTopBtn = document.createElement("div");
backToTopBtn.classList.add("backToTopBtn", "hidden");
backToTopBtn.setAttribute("title", "Scroll to top"); // tooltip
backToTopBtn.innerHTML = `<svg
aria-hidden="true"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 448 512">
    <path fill="black"
    d="M240.971 130.524l194.343 194.343
    c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667
    c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516
    c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667
    c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525
    c9.372-9.373 24.568-9.373 33.941-.001z">
    </path>
</svg>`;
document.querySelector("body").appendChild(backToTopBtn);

const bttBtnShowOnPx = 100; // amount of pixels before button is shown

// Background paralax
const backgroundElement = document.createElement("div");
backgroundElement.classList.add("background-image");
document.querySelector("body").appendChild(backgroundElement);

const scrollContainer = () => {
  return document.documentElement || document.body;
};

backToTopBtn.addEventListener("click", () => {
  document.body.scrollIntoView();
});

document.addEventListener("scroll", () => {
  const scrolledPercentage =
    (scrollContainer().scrollTop /
      (scrollContainer().scrollHeight - scrollContainer().clientHeight)) *
    100;

  progressBarElement.style.width = scrolledPercentage + "%";

  if (scrollContainer().scrollTop > progBarShowOnPx)
    progressBarElement.classList.remove("hidden");
  else progressBarElement.classList.add("hidden");

  if (scrollContainer().scrollTop > bttBtnShowOnPx)
    backToTopBtn.classList.remove("hidden");
  else backToTopBtn.classList.add("hidden");

  backgroundElement.style.top = -scrolledPercentage / 4 + "%";
  backgroundElement.style.left = -scrolledPercentage / 2 + "%";
});
