// Organizatori: data/<godina>/organizacijskiTim.json

function createOrganizatorCard(org) {
  const { el } = BDD;

  const kontakt = [
    org.email && el("a", { href: `mailto:${org.email}`, text: org.email }),
    org.tel && el("a", { href: `tel:${org.tel.replace(/\s/g, "")}`, text: org.tel }),
  ];

  return el("li", { class: "person org" }, [
    el("img", {
      class: "person__photo",
      src: org.imgUrl || "./img/placeholder.svg",
      alt: org.ime,
      loading: "lazy",
    }),
    el("h3", { class: "person__name", text: org.ime }),
    el("p", { class: "org__fn", text: org.funkcija }),
    el("p", { class: "org__contact" }, kontakt),
  ]);
}

async function initOrganizatori() {
  const lista = document.querySelector("#organizatori-lista");

  try {
    const tim = await BDD.loadJSON(await BDD.dataPath("organizacijskiTim.json"));
    lista.append(...tim.map(createOrganizatorCard));
    BDD.initCarousel(lista.closest(".carousel"));
  } catch (error) {
    console.error(error);
  }
}

initOrganizatori();
