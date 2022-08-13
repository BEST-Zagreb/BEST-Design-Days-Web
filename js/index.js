// ===== hero sections flipdown =====

// Unix timestamp (in seconds) to count down to
const eventStart = Math.round(new Date(2022, 09, 14, 16) / 1000); // 17th October 2022 at 4 pm in seconds

// Set up FlipDown
const flipdown = new FlipDown(eventStart, {
  headings: ["Dani", "Sati", "Minute", "Sekunde"],
});

// Start the countdown
flipdown.start();

// Do something when the countdown ends
flipdown.ifEnded(() => {
  console.log("Event ended!");
});

// ===== annual partners carousel =====

const slideElement = document.querySelector(".godisnji-partneri-sec__slide");
const slideImg = document.querySelectorAll(
  ".godisnji-partneri-sec__slide > a > img"
);

let counter = 1; // for seamless infinite sliding

let numberOfItemsToSlide = 2; // must be <= number of items in carousel
let slideDuration = 1500; // in miliseconds
let pauseDuration = 2500; // must be >= slideDuration, in miliseconds

if (window.matchMedia("(max-width: 450px)").matches) {
  numberOfItemsToSlide = 1; // must be <= number of items in carousel
  slideDuration = 750; // in miliseconds
  pauseDuration = 1500; // must be >= slideDuration, in miliseconds
}

slideElement.style.transition = "all " + slideDuration + "ms" + " ease-out";

setInterval(() => {
  slideElement.style.marginLeft =
    "-" +
    numberOfItemsToSlide * counter * slideImg[0].getBoundingClientRect().width +
    "px";

  counter++;
}, pauseDuration + 50);

slideElement.addEventListener("transitionend", () => {
  // needs to be bigger or equal (not just equal) because of some bug
  if (counter >= slideImg.length / 2 / numberOfItemsToSlide + 1) {
    // set slide to start
    slideElement.style.transitionDuration = "1ms";
    slideElement.style.marginLeft = "0px";

    counter = 1; // reset counter
  } else {
    slideElement.style.transitionDuration = slideDuration + "ms";
  }
});

// ===== contact sections cards tilt =====
function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (!isTouchDevice()) {
  VanillaTilt.init(document.querySelectorAll(".kontakt-sec__card"), {
    glare: true,
    reverse: true,
    "max-glare": 0.75,
  });
}
