const rasporedTable = document.querySelector(".raspored-sec__table > tbody");

initializeRasporedSection();

function parseDateFormat(dateHrv) {
  const [dan, mjesec, godina] = dateHrv.split(".");
  return `${godina}, ${mjesec}, ${dan}`;
}

function createRasporedTrElement(aktivnost) {
  const rasporedTrTemplate = document.querySelector("[data-raspored-template]");
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

  const daniUTjednu = [
    "Nedjelja",
    "Ponedjeljak",
    "Utorak",
    "Srijeda",
    "Četvrtak",
    "Petak",
    "Subota",
  ];

  const datum = new Date(parseDateFormat(aktivnost.datum));
  const danUTjednu = daniUTjednu[datum.getDay()];
  rasporedDatumElement.firstChild.innerText = `${danUTjednu} ${aktivnost.datum}`;
  rasporedVrijemeElement.firstChild.innerText = aktivnost.vrijeme;

  let aktivnostNaziv = aktivnost.tema;
  if (aktivnost.predavaci[0].ime) {
    if (aktivnost.tvrtka) {
      aktivnostNaziv = ` (${aktivnost.tvrtka}) - ${aktivnostNaziv}`;
      for (let index = 0; index < aktivnost.predavaci.length; index++) {
        if (index === 0) {
          aktivnostNaziv = `${aktivnost.predavaci[index].ime}${aktivnostNaziv}`;
        } else {
          aktivnostNaziv = `${aktivnost.predavaci[index].ime} & ${aktivnostNaziv}`;
        }
      }
    } else {
      for (let index = 0; index < aktivnost.predavaci.length; index++) {
        if (index === 0) {
          if (aktivnost.tema === "" || aktivnost.tema === null) {
            aktivnostNaziv = `${aktivnost.predavaci[index].ime}`;
          } else {
            aktivnostNaziv = `${aktivnost.predavaci[index].ime} - ${aktivnostNaziv}`;
          }
        } else {
          aktivnostNaziv = `${aktivnost.predavaci[index].ime} & ${aktivnostNaziv}`;
        }
      }
    }
  }
  rasporedAktivnostElement.firstChild.innerText = aktivnostNaziv;

  return rasporedTrElement;
}

async function initializeRasporedSection() {
  try {
    const response = await fetch("./data/2023/aktivnosti.json");
    const data = await response.json();

    data.forEach((aktivnost) => {
      const rasporedTrElement = createRasporedTrElement(aktivnost);
      rasporedTable.append(rasporedTrElement);
    });
  } catch (error) {
    console.error(error);
  }
}
