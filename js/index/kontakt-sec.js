const kontaktCards = document.querySelector(".kontakt-sec__cards");

initializeKontaktSection();

async function fetchOrganizacijskiTimData() {
  try {
    const response = await fetch("./data/2024/organizacijskiTim.json");
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error);
  }
}

function createKontaktCardElement(organizator) {
  const kontaktTemplate = document.querySelector("[data-kontakt-template]");

  const kontaktCardElement =
    kontaktTemplate.content.cloneNode(true).children[0];

  const kontaktImgDivElement = kontaktCardElement.querySelector(
    ".kontakt-sec__card-image"
  );
  const kontaktFunkcijaElement = kontaktCardElement.querySelector(
    ".kontakt-sec__card-function"
  );
  const kontaktImeElement = kontaktCardElement.querySelector(
    ".kontakt-sec__card-name"
  );
  const kontaktLinkElements = kontaktCardElement.querySelectorAll(
    ".kontakt-sec__card-link"
  );

  let kontaktImageGradient = null;
  if (window.matchMedia("(max-width: 960px)").matches) {
    kontaktImageGradient =
      "linear-gradient(to right, #fff0 0%, #fff0 70%, whitesmoke 100%)";
  } else {
    kontaktImageGradient =
      "linear-gradient(#fff0 0%, #fff0 70%, whitesmoke 100%)";
  }
  if (!organizator.imgUrl) {
    organizator.imgUrl = "./img/questionmark-icon.svg";
    kontaktImgDivElement.style.backgroundSize = "33%";
  }
  kontaktImgDivElement.style.backgroundImage =
    kontaktImageGradient + ", url(" + organizator.imgUrl + ")";
  kontaktImgDivElement.setAttribute(
    "title",
    organizator.ime + " - " + organizator.funkcija
  );

  kontaktFunkcijaElement.innerText = organizator.funkcija;
  kontaktImeElement.innerText = organizator.ime;

  if (organizator.email) {
    kontaktLinkElements[0].setAttribute("href", "mailto:" + organizator.email);
    kontaktLinkElements[0].innerText = organizator.email;
  }
  if (organizator.tel) {
    kontaktLinkElements[1].setAttribute(
      "href",
      "tel:" + organizator.tel.replace(/\s/g, "")
    );
    kontaktLinkElements[1].innerText = organizator.tel;
  }

  return kontaktCardElement;
}

function addVanillaTitlToKontaktCard() {
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
}

async function initializeKontaktSection() {
  try {
    const data = await fetchOrganizacijskiTimData();
    data.forEach((organizator) => {
      if (organizator.kontakt) {
        const kontaktCardElement = createKontaktCardElement(organizator);
        kontaktCards.append(kontaktCardElement);
      }
    });

    addVanillaTitlToKontaktCard();

    const sectionsIds = [];
    document
      .querySelectorAll("section")
      .forEach((section) => sectionsIds.push(section.getAttribute("id")));

    // If URL with specified section (#something)
    if (sectionsIds.includes(window.location.hash.split("#")[1])) {
      document
        .querySelector('[id="' + window.location.hash.split("#")[1] + '"]')
        .scrollIntoView(true);
    }
  } catch (error) {
    console.error(error);
  }
}
