// Galerija: data/galerija.json + lightbox (strelice, tipkovnica, swipe)

const lightbox = document.querySelector(".lightbox");
const lightboxImg = lightbox.querySelector(".lightbox__img");
const lightboxCaption = lightbox.querySelector(".lightbox__caption");

let slike = [];
let trenutnaSlika = 0;

function prikaziSliku(index) {
  trenutnaSlika = (index + slike.length) % slike.length;
  const slika = slike[trenutnaSlika];
  lightboxImg.src = slika.src;
  lightboxImg.alt = slika.alt;
  lightboxCaption.textContent = `${slika.alt} (${trenutnaSlika + 1}/${slike.length})`;
}

lightbox.querySelector(".lightbox__close").addEventListener("click", () => lightbox.close());
lightbox.querySelector(".lightbox__prev").addEventListener("click", () => prikaziSliku(trenutnaSlika - 1));
lightbox.querySelector(".lightbox__next").addEventListener("click", () => prikaziSliku(trenutnaSlika + 1));

// klik na tamnu pozadinu zatvara
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") prikaziSliku(trenutnaSlika - 1);
  if (e.key === "ArrowRight") prikaziSliku(trenutnaSlika + 1);
});

let swipeStartX = null;
lightboxImg.addEventListener("pointerdown", (e) => (swipeStartX = e.clientX));
lightboxImg.addEventListener("pointerup", (e) => {
  if (swipeStartX === null) return;
  const dx = e.clientX - swipeStartX;
  if (Math.abs(dx) > 50) prikaziSliku(trenutnaSlika + (dx < 0 ? 1 : -1));
  swipeStartX = null;
});

async function initGalerija() {
  const { el } = BDD;
  const grid = document.querySelector("#galerija-lista");

  try {
    slike = await BDD.loadJSON("./data/galerija.json");

    slike.forEach((slika, index) => {
      const item = el("button", { class: "gallery__item", type: "button", "aria-label": `Otvori sliku: ${slika.alt}` }, [
        el("img", { src: slika.src, alt: slika.alt, loading: "lazy" }),
      ]);
      item.addEventListener("click", () => {
        prikaziSliku(index);
        lightbox.showModal();
      });
      grid.append(item);
    });
  } catch (error) {
    console.error(error);
  }
}

initGalerija();
