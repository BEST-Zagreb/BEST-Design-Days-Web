// Predavači: izvlače se iz data/<godina>/aktivnosti.json (isti predavač se prikaže samo jednom)

function createPredavacCard(predavac, aktivnost) {
  const { el } = BDD;
  return el("li", { class: "person" }, [
    el("img", {
      class: "person__photo",
      src: predavac.imgUrl || "./img/placeholder.svg",
      alt: `Predavač ${predavac.ime}`,
      loading: "lazy",
    }),
    el("h3", { class: "person__name", text: predavac.ime }),
    el("p", { class: "person__meta", text: aktivnost.tema || aktivnost.tvrtka }),
  ]);
}

async function initPredavaci() {
  const lista = document.querySelector("#predavaci-lista");

  try {
    const aktivnosti = await BDD.loadJSON(await BDD.dataPath("aktivnosti.json"));
    const vidjeni = new Set();

    aktivnosti.forEach((aktivnost) => {
      aktivnost.predavaci.forEach((predavac) => {
        if (!predavac.ime || vidjeni.has(predavac.ime)) return;
        vidjeni.add(predavac.ime);
        lista.append(createPredavacCard(predavac, aktivnost));
      });
    });

    BDD.initCarousel(lista.closest(".carousel"));
  } catch (error) {
    console.error(error);
  }
}

initPredavaci();
