// Partneri projekta: data/<godina>/partneri.json (razine se prikazuju redom kojim su navedene)

function createPartnerCard(partner, razina) {
  const { el } = BDD;

  const logo = el("img", { src: partner.imgUrl, alt: partner.naziv, title: partner.naziv, loading: "lazy" });
  if (partner.scale) logo.style.transform = `scale(${partner.scale})`;

  const klase = `partner partner--${razina}`;
  const card = partner.linkUrl
    ? el("a", { class: klase, href: partner.linkUrl, target: "_blank", rel: "noopener" }, logo)
    : el("div", { class: klase }, logo);
  if (partner.bg) card.style.background = partner.bg; // za bijele logotipe
  if (partner.omjer) card.style.aspectRatio = partner.omjer; // npr. "12 / 5" za široke logotipe

  return el("li", { class: `partneri__stavka partneri__stavka--${razina}` }, card);
}

async function initPartneri() {
  const lista = document.querySelector("#partneri-lista");

  try {
    const razine = await BDD.loadJSON(await BDD.dataPath("partneri.json"));

    Object.entries(razine).forEach(([razina, partneri]) => {
      if (razina.startsWith("_") || !Array.isArray(partneri)) return; // preskoči bilješke
      partneri.forEach((partner) => lista.append(createPartnerCard(partner, razina)));
    });
  } catch (error) {
    console.error(error);
  }
}

// valovi u pozadini se animiraju (SVG), osim ako korisnik ne želi animacije
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelector(".partners__wave").pauseAnimations();
}

initPartneri();
