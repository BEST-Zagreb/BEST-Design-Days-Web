const partnerImgsContainer = document.querySelector(
  ".partneri-sec__imgs-container"
);

function addProjectPartners(data) {
  const partnerTemplate = document.querySelector("[data-partner-template]");

  Object.values(data).forEach((partnerLevel) => {
    const partnerRow = document.createElement("div");
    partnerLevel.forEach((partner) => {
      const partnerElement =
        partnerTemplate.content.cloneNode(true).children[0];
      if (partner.linkUrl) partnerElement.setAttribute("href", partner.linkUrl);
      else partnerElement.removeAttribute("href");
      partnerElement.firstElementChild.setAttribute("src", partner.imgUrl);
      partnerElement.firstElementChild.setAttribute(
        "alt",
        partner.naziv + " partner logo"
      );
      partnerElement.firstElementChild.setAttribute(
        "title",
        partner.naziv + ""
      );
      if (partner.scale) {
        partnerElement.firstElementChild.style.transform = "scale(" + partner.scale + ")";
      }
      partnerRow.append(partnerElement);
    });
    partnerImgsContainer.append(partnerRow);
  });
}

async function initializeProjectPartners() {
  try {
    const response = await fetch("./data/2024/partneri.json");
    const data = await response.json();

    addProjectPartners(data);
  } catch (error) {
    console.error(error);
  }
}

initializeProjectPartners();
