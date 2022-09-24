// ===== nav sections intersection observers =====

const navIntersectionUl = document.querySelectorAll(".nav__links > li");
let currentListItem = null;

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // console.log(entry.target);

        let currentSection = entry.target.getAttribute("id");

        // go through all nav items
        navIntersectionUl.forEach((listItem) => {
          if (
            listItem.firstChild.getAttribute("href") ===
            "#" + currentSection
          ) {
            // remove current-site attribute from last current nav item
            if (currentListItem)
              currentListItem.removeAttribute("data-current-site");

            // add current-site attribute to current nav item
            listItem.setAttribute("data-current-site", "");
            currentListItem = listItem;
          }
        });
      }
    });
  },
  { threshold: 0.75 }
);

document.querySelectorAll("section").forEach((section) => {
  sectionObserver.observe(section);
});

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

// ===== raspored json data import =====

const rasporedTrTemplate = document.querySelector("[data-raspored-template]");
const rasporedTable = document.querySelector(".raspored-sec__table");

const daniUTjednu = [
  "Nedjelja",
  "Ponedjeljak",
  "Utorak",
  "Srijeda",
  "Četvrtak",
  "Petak",
  "Subota",
];
function parseDateFormat(dateHrv) {
  // formatira datum iz DD.MM.YYYY. u YYYY, MM, DD za new Date() funkciju
  const dan = dateHrv.split(".")[0];
  const mjesec = dateHrv.split(".")[1];
  const godina = dateHrv.split(".")[2];

  return godina + ", " + mjesec + ", " + dan;
}

fetch("../data/aktivnosti.json")
  .then((res) => res.json())
  .then((data) => {
    data.map((aktivnost) => {
      const rasporedTrElement =
        rasporedTrTemplate.content.cloneNode(true).children[0];

      const rasporedDatumElement = rasporedTrElement.querySelector(
        ".raspored-sec__datum"
      );
      const rasporedVrijemeElement = rasporedTrElement.querySelector(
        ".raspored-sec__vrijeme"
      );
      const rasporedAktivnostElement = rasporedTrElement.querySelector(
        ".raspored-sec__aktivnost"
      );

      rasporedDatumElement.firstChild.textContent =
        daniUTjednu[new Date(parseDateFormat(aktivnost.datum)).getDay()] +
        " " +
        aktivnost.datum;
      rasporedVrijemeElement.firstChild.textContent = aktivnost.vrijeme;
      rasporedAktivnostElement.firstChild.textContent = aktivnost.predavac
        ? aktivnost.predavac + " - " + aktivnost.tema
        : aktivnost.tema;

      rasporedTable.append(rasporedTrElement);
    });
  })
  .then(() => {
    // if url with specified contact section (#raspored)
    if (window.location.hash.split("#")[1] === "raspored")
      document
        .querySelector('[id="' + window.location.hash.split("#")[1] + '"]')
        .scrollIntoView(true);
  })
  .catch((err) => {
    console.error(err);
  });

// ===== BDD partners json data import =====

const partnerTemplate = document.querySelector("[data-partner-template]");

const partnerImgsContainer = document.querySelector(
  ".partneri-sec__imgs-container"
);
const annualPartnersCarousel = document.querySelector(
  ".godisnji-partneri-sec__slider"
);

fetch("../data/partneri.json")
  .then((res) => res.json())
  .then((data) => {
    // add project partners
    Object.values(data.BDD).forEach((partnerLevel) => {
      const partnerRow = document.createElement("div");
      // each partner level in seperate row
      partnerLevel.forEach((partner) => {
        const partnerElement =
          partnerTemplate.content.cloneNode(true).children[0];
        partnerElement.setAttribute("href", partner.linkUrl);
        partnerElement.firstElementChild.setAttribute("src", partner.imgUrl);
        partnerElement.firstElementChild.setAttribute(
          "alt",
          partner.naziv + " partner logo"
        );
        partnerRow.append(partnerElement);
      });
      partnerImgsContainer.append(partnerRow);
    });

    // add annual partners
    const partnersSlide = document.createElement("div");
    partnersSlide.classList.add("godisnji-partneri-sec__slide");
    Object.values(
      data.godisnji.map((partner) => {
        const partnerElement =
          partnerTemplate.content.cloneNode(true).children[0];
        partnerElement.setAttribute("href", partner.linkUrl);
        partnerElement.firstElementChild.setAttribute("src", partner.imgUrl);
        partnerElement.firstElementChild.setAttribute(
          "alt",
          partner.naziv + " partner logo"
        );
        partnersSlide.append(partnerElement);
      })
    );

    // 2 puta zbog nacina na koji carousel radi
    annualPartnersCarousel.append(partnersSlide);
    annualPartnersCarousel.append(partnersSlide.cloneNode(true));
  })
  .then(() => {
    // ===== annual partners carousel =====
    const slideElement = document.querySelector(
      ".godisnji-partneri-sec__slide"
    );
    const slideImg = document.querySelectorAll(
      ".godisnji-partneri-sec__slide > a > img"
    );

    slideElement.style.transition = "all " + slideDuration + "ms" + " ease-out";

    setInterval(() => {
      slideElement.style.marginLeft =
        "-" +
        numberOfItemsToSlide *
          counter *
          slideImg[0].getBoundingClientRect().width +
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
  })
  .catch((err) => {
    console.error(err);
  });

// ===== annual partners carousel =====

let counter = 1; // for seamless infinite sliding

let numberOfItemsToSlide = 2; // must be <= number of items in carousel
let slideDuration = 1500; // in miliseconds
let pauseDuration = 3500; // must be >= slideDuration, in miliseconds

if (window.matchMedia("(max-width: 450px)").matches) {
  numberOfItemsToSlide = 1; // must be <= number of items in carousel
  slideDuration = 750; // in miliseconds
  pauseDuration = 2500; // must be >= slideDuration, in miliseconds
}

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
