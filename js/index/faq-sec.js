const faqsContainer = document.querySelector(".faq-sec__accordions-container");

initializeFAQs();

function createFAQElement(faq) {
  const faqTemplate = document.querySelector("[data-faq-template]");
  const faqElement = faqTemplate.content.cloneNode(true).children[0];

  const faqQuestionElement = faqElement.querySelector(".faq-sec__question > p");
  const faqAnswerElement = faqElement.querySelector(".faq-sec__answer");

  faqQuestionElement.innerText = faq.question;
  faqAnswerElement.innerText = faq.answer;

  return faqElement;
}

function addFAQsToContainer(data) {
  data.forEach((faq) => {
    const faqElement = createFAQElement(faq);
    faqsContainer.append(faqElement);
  });
}

function initializeAccordions() {
  const accordions = document.querySelectorAll(".faq-sec__accordion");

  accordions.forEach((accordion) => {
    accordion.addEventListener("click", (event) => {
      accordions.forEach((accordionOther) => {
        if (
          accordion != accordionOther &&
          accordionOther.hasAttribute("open")
        ) {
          accordionOther.removeAttribute("open");

          if (event.target === accordion) {
            accordion.setAttribute("open", "");
          }
        }
      });
    });
  });
}

async function initializeFAQs() {
  try {
    const response = await fetch("./data/faqs.json");
    const data = await response.json();

    addFAQsToContainer(data);
    initializeAccordions();
  } catch (error) {
    console.error(error);
  }
}
