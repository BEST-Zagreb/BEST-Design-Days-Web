const annualPartnersCarousel = document.querySelector(
  ".godisnji-partneri-sec__slider"
);

function addAnnualPartners(data) {
  const partnerTemplate = document.querySelector("[data-partner-template]");

  const partnersSlide = document.createElement("div");
  partnersSlide.classList.add("godisnji-partneri-sec__slide");
  data.map((partner) => {
    const partnerElement = partnerTemplate.content.cloneNode(true).children[0];
    partnerElement.setAttribute("href", partner.linkUrl);
    partnerElement.firstElementChild.setAttribute("src", partner.imgUrl);
    partnerElement.firstElementChild.setAttribute(
      "alt",
      partner.naziv + " partner logo"
    );
    partnerElement.firstElementChild.setAttribute("title", partner.naziv);
    partnersSlide.append(partnerElement);
  });

  annualPartnersCarousel.append(partnersSlide);
  annualPartnersCarousel.append(partnersSlide.cloneNode(true));
}

function annualPartnersCarouselSlide() {
  const slideElement = document.querySelector(".godisnji-partneri-sec__slide");
  const slideImgs = document.querySelectorAll(
    ".godisnji-partneri-sec__slide > a > img"
  );

  let annualPartnersCounter = 1; // counter for seamless infinite sliding

  let numberOfItemsToSlide = 0; // must be <= number of items in carousel (slideImgs.length / 2)
  let slideDuration = 1500; // in miliseconds
  let pauseDuration = 3500; // must be >= slideDuration, in miliseconds

  if (window.matchMedia("(max-width: 480px)").matches) {
    numberOfItemsToSlide = 1; // must be <= number of items in carousel
    slideDuration = 750; // in miliseconds
    pauseDuration = 2500; // must be >= slideDuration, in miliseconds
  }

  function slidePartnersSlider(numberOfItemsToSlide) {
    slideElement.style.marginLeft =
      "-" +
      numberOfItemsToSlide *
        annualPartnersCounter *
        slideImgs[0].getBoundingClientRect().width +
      "px";

    annualPartnersCounter++;
  }

  // initial slide for setting height = max height of all images
  annualPartnersCounter = slideImgs.length / 2 / numberOfItemsToSlide;
  slidePartnersSlider(numberOfItemsToSlide);

  slideElement.style.transition =
    "margin-left " + slideDuration + "ms" + " ease-out";

  let sliderIsPaused = false;
  setInterval(() => {
    if (!sliderIsPaused) {
      slidePartnersSlider(numberOfItemsToSlide);
    }
  }, pauseDuration + 50);

  // pause slider when hovering over
  slideElement.addEventListener("mouseenter", () => {
    sliderIsPaused = true;
  });
  slideElement.addEventListener("mouseleave", () => {
    sliderIsPaused = false;
  });

  slideElement.addEventListener("transitionend", (el) => {
    // check if transition is margin-left
    if (el.propertyName === "margin-left") {
      // needs to be bigger or equal (not just equal) because of some bug
      if (
        annualPartnersCounter >=
        slideImgs.length / 2 / numberOfItemsToSlide + 1
      ) {
        // set slide to start
        slideElement.style.transitionDuration = "1ms";
        slideElement.style.marginLeft = "0px";

        annualPartnersCounter = 1; // reset annualPartnersCounter
      } else {
        slideElement.style.transitionDuration = slideDuration + "ms";
      }
    }
  });
}

async function initializeAnnualPartners() {
  try {
    const response = await fetch("./data/godisnjiPartneri.json");
    const data = await response.json();

    addAnnualPartners(data);
    annualPartnersCarouselSlide();
  } catch (error) {
    console.error(error);
  }
}

initializeAnnualPartners();
