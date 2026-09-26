// Raspored: aktivnosti iz data/<godina>/aktivnosti.json grupirane po datumu
// + kantica boje koja mijenja boju okvira

const DANI_U_TJEDNU = ["ned", "pon", "uto", "sri", "čet", "pet", "sub"];
const BOJE_DANA = ["var(--purple)", "var(--red)", "var(--orange)", "var(--yellow)", "var(--green)", "var(--blue)"];
const BOJE_OKVIRA = ["#c663e1", "#c62537", "#c7813b", "#c8b23d", "#88a930", "#2a87b6"];

// tko drži aktivnost: "Ime & Ime (Tvrtka)"
function predavaciAktivnosti(aktivnost) {
  const imena = aktivnost.predavaci
    .map((p) => p.ime)
    .filter(Boolean)
    .join(" & ");
  if (!imena) return "";
  return aktivnost.tvrtka ? `${imena} (${aktivnost.tvrtka})` : imena;
}

function createRasporedRow(aktivnost) {
  const { el, icon } = BDD;

  const tko = predavaciAktivnosti(aktivnost);
  const naslov = aktivnost.tema || tko;

  // naslov je podebljan, ime predavača ide ispod, manje i prigušeno
  const tekstualniDio = el("span", { class: "row__text" }, [
    el("span", { class: "row__title", text: naslov }),
    tko && aktivnost.tema ? el("span", { class: "row__person", text: tko }) : null,
  ]);

  const cells = [el("span", { class: "row__time", text: aktivnost.vrijeme || "" }), tekstualniDio];

  const oznake = [aktivnost.format, aktivnost.trajanje].filter(Boolean);
  // opis može imati više odlomaka (odvojeni novim redom u JSON-u)
  const odlomci = (aktivnost.opis || "").split("\n").filter((o) => o.trim());
  const detalji = [aktivnost.lokacija && `Lokacija: ${aktivnost.lokacija}`, ...odlomci].filter(Boolean);

  // otvara se samo ako ima što pisati; same oznake ne otvaraju prazan okvir
  if (!detalji.length) {
    return el("li", {}, el("div", { class: "row" }, [...cells, el("span", { class: "row__plus-mjesto" })]));
  }

  return el(
    "li",
    {},
    el("details", { class: "row-details" }, [
      el("summary", { class: "row" }, [...cells, icon("plus", "row__plus")]),
      el("div", { class: "row__more" }, [
        oznake.length
          ? el(
              "span",
              { class: "row__tags" },
              oznake.map((t) => el("span", { class: "row__tag", text: t }))
            )
          : null,
        ...detalji.map((tekst) => el("p", { text: tekst })),
      ]),
    ])
  );
}

async function initRaspored() {
  const { el } = BDD;
  const lista = document.querySelector("#raspored-lista");

  try {
    const aktivnosti = await BDD.loadJSON(await BDD.dataPath("aktivnosti.json"));

    const dani = new Map();
    aktivnosti.forEach((aktivnost) => {
      if (!dani.has(aktivnost.datum)) dani.set(aktivnost.datum, []);
      dani.get(aktivnost.datum).push(aktivnost);
    });

    [...dani].forEach(([datum, aktivnostiDana], index) => {
      const date = BDD.parseDatum(datum);
      const naziv = aktivnostiDana[0].dan || `${index + 1}. dan`;
      const kratkiDatum = `${DANI_U_TJEDNU[date.getDay()]} ${date.getDate()}.${date.getMonth() + 1}.`;

      lista.append(
        el("div", { class: "day", style: `--day: ${BOJE_DANA[index % BOJE_DANA.length]}` }, [
          el("h3", { class: "day__label" }, [naziv, el("small", { text: kratkiDatum })]),
          el("ul", { class: "rows" }, aktivnostiDana.map(createRasporedRow)),
        ])
      );
    });
  } catch (error) {
    console.error(error);
  }
}

// --- kantica boje ---
const rasporedCard = document.querySelector(".schedule-card");
const bucket = rasporedCard.querySelector(".bucket");
let bojaOkvira = 0;

bucket.addEventListener("click", () => {
  bojaOkvira = (bojaOkvira + 1) % BOJE_OKVIRA.length;
  const boja = BOJE_OKVIRA[bojaOkvira];

  const fx = rasporedCard.querySelector(".schedule-card__fx");
  const bucketRect = bucket.getBoundingClientRect();
  const fxRect = fx.getBoundingClientRect();
  const splash = BDD.el("span", {
    class: "splash",
    style: `left: ${bucketRect.left - fxRect.left + bucketRect.width / 2}px; top: ${
      bucketRect.top - fxRect.top + bucketRect.height / 2
    }px; --c: ${boja}`,
  });
  splash.addEventListener("animationend", () => splash.remove());
  fx.append(splash);

  rasporedCard.style.setProperty("--frame", boja);
  rasporedCard.style.setProperty("--card-bg", `color-mix(in srgb, ${boja} 28%, #fff)`);
});

initRaspored();
