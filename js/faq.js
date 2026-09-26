// FAQ: data/faqs.json. Atribut name="faq" na <details> brine da je otvoreno samo jedno pitanje.

function createFAQ(faq) {
  const { el, icon } = BDD;
  return el("details", { class: "faq__item", name: "faq" }, [
    el("summary", {}, [el("span", { text: faq.question }), icon("plus")]),
    el("p", { text: faq.answer }),
  ]);
}

async function initFAQ() {
  try {
    const faqs = await BDD.loadJSON("./data/faqs.json");
    document.querySelector("#faq-lista").append(...faqs.map(createFAQ));
  } catch (error) {
    console.error(error);
  }
}

initFAQ();
