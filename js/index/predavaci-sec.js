const predavaciCarousel = document.querySelector(".predavaci-sec__cards");

let predavacSlideCounter = 0;

initializePredavaciSection();

function createPredavacCardElement(aktivnost, predavac) {
  const predavacCardTemplate = document.querySelector(
    "[data-predavac-template]"
  );

  const predavacCardElement =
    predavacCardTemplate.content.cloneNode(true).children[0];

  const predavacImgElement = predavacCardElement.querySelector(
    ".predavaci-sec__img-container > img"
  );
  const predavacImeElement = predavacCardElement.querySelector(
    ".predavaci-sec__text-container > h4"
  );
  const predavacAktivnostElement = predavacCardElement.querySelector(
    ".predavaci-sec__text-container > h5"
  );

  if (predavac.imgUrl) {
    predavacImgElement.setAttribute("src", predavac.imgUrl);
  }
  predavacImgElement.setAttribute("alt", `Predavač ${predavac.ime}`);
  predavacImgElement.setAttribute("title", predavac.ime);
  predavacImeElement.innerText = aktivnost.tvrtka
    ? `${predavac.ime} (${aktivnost.tvrtka})`
    : predavac.ime;
  predavacAktivnostElement.innerText = aktivnost.tema;

  return predavacCardElement;
}

function movePredavaciCarousel() {
  const predavaciCards = document.querySelectorAll(".predavaci-sec__card");
  const predavaciCarouselBtnLeft = document.querySelector(
    ".predavaci-sec__btn-left"
  );
  const predavaciCarouselBtnRight = document.querySelector(
    ".predavaci-sec__btn-right"
  );

  predavaciCarouselBtnLeft.removeAttribute("disabled");
  predavaciCarouselBtnRight.removeAttribute("disabled");

  predavaciCarousel.style.marginLeft =
    predavacSlideCounter * predavaciCards[0].getBoundingClientRect().width +
    "px";

  if (predavacSlideCounter === 0) {
    predavaciCarouselBtnLeft.setAttribute("disabled", "");
  }
  if (
    predavaciCards.length + predavacSlideCounter <=
    Math.floor(
      predavaciCarousel.getBoundingClientRect().width /
        predavaciCards[0].getBoundingClientRect().width
    )
  ) {
    predavaciCarouselBtnRight.setAttribute("disabled", "");
  }
}

async function initializePredavaciSection() {
  try {
    const response = await fetch("./data/2025/aktivnosti.json");
    const data = await response.json();

    data.forEach((aktivnost) => {
      if (aktivnost.predavaci[0].ime) {
        aktivnost.predavaci.forEach((predavac) => {
          // sljedecu liniju maknuti ako za predavace bez slike
          // se zeli prikazati samo icon avatar
          //if (!predavac.imgUrl) return null;
          const predavacCardElement = createPredavacCardElement(
            aktivnost,
            predavac
          );
          predavaciCarousel.append(predavacCardElement);
        });
      }
    });

    const predavaciCarouselBtnLeft = document.querySelector(
      ".predavaci-sec__btn-left"
    );
    const predavaciCarouselBtnRight = document.querySelector(
      ".predavaci-sec__btn-right"
    );

    predavaciCarouselBtnLeft.setAttribute("disabled", "");

    predavaciCarouselBtnLeft.addEventListener("click", () => {
      predavacSlideCounter++;
      movePredavaciCarousel();
    });

    predavaciCarouselBtnRight.addEventListener("click", () => {
      predavacSlideCounter--;
      movePredavaciCarousel();
    });
  } catch (error) {
    console.error(error);
  }
}
