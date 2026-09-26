// Zajednički helperi (BDD.*) + stvari koje vrijede za cijelu stranicu: navigacija, config, info kartice

const BDD = {};

BDD.loadJSON = async (path) => {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Ne mogu učitati ${path} (${response.status})`);
  return response.json();
};

// Sve sekcije čekaju config da znaju iz koje godine čitaju podatke (data/<godina>/...)
BDD.config = BDD.loadJSON("./data/config.json");
BDD.dataPath = async (file) => `./data/${(await BDD.config).godina}/${file}`;

// "12.10.2026." -> Date
BDD.parseDatum = (datum) => {
  const [dan, mjesec, godina] = datum.split(".").map(Number);
  return new Date(godina, mjesec - 1, dan);
};

// Mali helper za stvaranje elemenata: BDD.el("p", { class: "x", text: "Bok" }, [djeca])
BDD.el = (tag, props = {}, children = []) => {
  const node = document.createElement(tag);
  Object.entries(props).forEach(([key, value]) => {
    if (value === undefined || value === null || value === false || value === "") return;
    if (key === "class") node.className = value;
    else if (key === "text") node.textContent = value;
    else node.setAttribute(key, value);
  });
  node.append(...[].concat(children).filter(Boolean));
  return node;
};

// Lucide ikona iz img/icons/<ime>.svg
BDD.icon = (name, className = "") =>
  BDD.el("i", { class: `icon ${className}`, style: `mask-image: url(./img/icons/${name}.svg)`, "aria-hidden": "true" });

// Karusel = horizontalni scroll + strelice
BDD.initCarousel = (root) => {
  const track = root.querySelector(".carousel__track");
  const prev = root.querySelector(".carousel__btn--prev");
  const next = root.querySelector(".carousel__btn--next");

  const update = () => {
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

    // strelice poravnamo na sredinu fotografije, a ne cijele kartice
    const photo = track.querySelector(".person__photo");
    if (photo) root.style.setProperty("--photo-h", `${photo.getBoundingClientRect().height}px`);
  };

  prev.addEventListener("click", () => track.scrollBy({ left: -track.clientWidth, behavior: "smooth" }));
  next.addEventListener("click", () => track.scrollBy({ left: track.clientWidth, behavior: "smooth" }));
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  // data-auto="5000" => karusel se sam pomiče svakih 5 s dok je u vidokrugu
  const razmak = Number(root.dataset.auto || 0);
  if (!razmak || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let timer = null;
  let uVidokrugu = false;
  let pauza = false;

  const korak = () => {
    const kartica = track.querySelector("li");
    if (!kartica) return;
    const sirina = kartica.getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap || 0);
    const naKraju = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    track.scrollTo({ left: naKraju ? 0 : track.scrollLeft + sirina, behavior: "smooth" });
  };

  const osvjezi = () => {
    const treba = uVidokrugu && !pauza && !document.hidden;
    if (treba && !timer) timer = setInterval(korak, razmak);
    if (!treba && timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  new IntersectionObserver(
    ([entry]) => {
      uVidokrugu = entry.isIntersecting;
      osvjezi();
    },
    { threshold: 0.35 }
  ).observe(root);

  // pauza dok korisnik gleda/koristi karusel
  ["pointerenter", "focusin", "pointerdown"].forEach((dogadaj) =>
    root.addEventListener(dogadaj, () => {
      pauza = true;
      osvjezi();
    })
  );
  ["pointerleave", "focusout"].forEach((dogadaj) =>
    root.addEventListener(dogadaj, () => {
      pauza = false;
      osvjezi();
    })
  );
  document.addEventListener("visibilitychange", osvjezi);
};

// ===== Navigacija =====
const nav = document.querySelector(".nav");
const navToggle = nav.querySelector(".nav__toggle");

function setNavOpen(open) {
  nav.dataset.open = open;
  navToggle.setAttribute("aria-expanded", open);
}

navToggle.addEventListener("click", () => setNavOpen(nav.dataset.open !== "true"));
nav.querySelectorAll(".nav__links a").forEach((link) => link.addEventListener("click", () => setNavOpen(false)));
document.addEventListener("scroll", () => nav.classList.toggle("nav--scrolled", scrollY > 40), { passive: true });

// ===== Config: godina, podnaslov, gumb za prijavu, info kartice =====
const INFO_IKONE = {
  pin: ["map-pin", "var(--red)"],
  kalendar: ["calendar-days", "var(--orange)"],
  zarulja: ["lightbulb", "var(--yellow)"],
};

function createInfoCard(info) {
  const { el, icon } = BDD;

  const ikona =
    info.ikona === "upitnik"
      ? el("img", { class: "info__icon", src: "./img/upitnik.png", alt: "" })
      : icon(INFO_IKONE[info.ikona]?.[0] ?? info.ikona, "info__icon");
  if (INFO_IKONE[info.ikona]) ikona.style.color = INFO_IKONE[info.ikona][1];

  return el(info.link ? "a" : "div", { class: "info__card", href: info.link }, [
    ikona,
    el("h2", { class: "info__title", text: info.naslov }),
    el("p", { class: "info__text", text: info.tekst }),
  ]);
}

async function initConfig() {
  try {
    const config = await BDD.config;

    document.querySelectorAll("[data-godina]").forEach((node) => (node.textContent = config.godina));
    document.querySelector("[data-podnaslov]").textContent = config.podnaslov;
    document.querySelectorAll("[data-tema]").forEach((node) => (node.textContent = config.tema || ""));
    document.querySelectorAll("[data-email]").forEach((link) => {
      link.href = `mailto:${config.email}`;
      link.textContent = config.email;
    });

    const instagram = config.instagram || {};
    document.querySelectorAll("[data-insta-link]").forEach((link) => (link.href = instagram.url || "#"));
    document.querySelectorAll("[data-insta-handle]").forEach((node) => (node.textContent = instagram.handle || ""));

    const { prijava } = config;
    const prijavaBtn = document.querySelector("#prijava-btn");
    // prijave su otvorene od "otvara" do "zatvara" (uključivo); prije toga odbrojavanje
    const danas = new Date();
    danas.setHours(0, 0, 0, 0);
    const doOtvaranja = prijava.otvara ? Math.round((BDD.parseDatum(prijava.otvara) - danas) / 864e5) : 0;
    const zatvoreno = prijava.zatvara && danas > BDD.parseDatum(prijava.zatvara);
    const otvorena = prijava.otvorena && doOtvaranja <= 0 && !zatvoreno;

    let tekst = otvorena ? prijava.tekstOtvoreno : prijava.tekstZatvoreno;
    if (prijava.otvorena && doOtvaranja === 1) tekst = "Prijave počinju sutra";
    else if (prijava.otvorena && doOtvaranja > 1) {
      const dan = doOtvaranja % 10 === 1 && doOtvaranja % 100 !== 11 ? "dan" : "dana";
      tekst = `Prijave počinju za ${doOtvaranja} ${dan}`;
    }
    prijavaBtn.querySelector("span").textContent = tekst;

    if (otvorena) {
      prijavaBtn.href = prijava.url;
    } else {
      prijavaBtn.removeAttribute("href");
      prijavaBtn.setAttribute("aria-disabled", "true");
    }

    document.querySelector("#info").append(...config.info.map(createInfoCard));
  } catch (error) {
    console.error(error);
  }
}

initConfig();
