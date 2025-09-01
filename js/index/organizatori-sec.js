const orgsElement = document.querySelector(".organizatori");
const btnsElements = [];

// Set objects with references to the leftOrg, midOrg, and rightOrg elements
const leftOrg = {
  img: document.querySelectorAll(".org__img")[0],
  name: document.querySelectorAll(".org__name")[0],
  function: document.querySelectorAll(".org__function")[0],
};
const midOrg = {
  img: document.querySelectorAll(".org__img")[1],
  name: document.querySelectorAll(".org__name")[1],
  function1: document.querySelectorAll(".org__function")[1],
  function2: document.querySelector(".org__function2"),
};
const rightOrg = {
  img: document.querySelectorAll(".org__img")[2],
  name: document.querySelectorAll(".org__name")[2],
  function: document.querySelectorAll(".org__function")[2],
};

// Set duration of opacity transition
const transitionDuration = 0.5;
orgsElement.style.transition =
  orgsElement.style.transition + transitionDuration + "s";

let count = 0;
let orgData = null;

initializeOrgTim();

// Update elements with data
function swapOrg() {
  // Get index of current
  let id = count % orgData.length;

  // Update elements for the leftOrg
  leftOrg.img.src = orgData[id].imgUrl;
  leftOrg.img.alt = orgData[id].ime;
  leftOrg.img.title = orgData[id].ime + " - " + orgData[id].funkcija;
  leftOrg.name.textContent = orgData[id].ime;
  leftOrg.function.textContent = orgData[id].funkcija;

  // Update elements for the midOrg
  id = (count + 1) % orgData.length;
  btnsElements.forEach((btnElement) => {
    btnElement.removeAttribute("active");
  });
  btnsElements[id].setAttribute("active", "true");
  midOrg.img.src = orgData[id].imgUrl;
  midOrg.img.alt = orgData[id].ime;
  midOrg.img.title = orgData[id].ime + " - " + orgData[id].funkcija;
  midOrg.name.textContent = orgData[id].ime;
  midOrg.function1.textContent = orgData[id].funkcija;
  midOrg.function2.textContent = orgData[id].funkcija2;

  // Update elements for the rightOrg
  id = (count + 2) % orgData.length;
  rightOrg.img.src = orgData[id].imgUrl;
  rightOrg.img.alt = orgData[id].ime;
  rightOrg.img.title = orgData[id].ime + " - " + orgData[id].funkcija;
  rightOrg.name.textContent = orgData[id].ime;
  rightOrg.function.textContent = orgData[id].funkcija;
}

// Fetch data and start loop
async function initializeOrgTim() {
  const response = await fetch("data/2025/organizacijskiTim.json");
  orgData = await response.json();

  // Add the correct number of buttons
  const buttonsContainer = document.querySelector(".org-btns-container");
  orgData.forEach((org) => {
    const button = document.createElement("button");
    buttonsContainer.appendChild(button);
    btnsElements.push(button);
  });

  // Handle button click
  btnsElements.forEach((btnElement, index) => {
    btnElement.addEventListener("click", (button) => {
      const newCount = (index + (orgData.length - 1)) % orgData.length;
      if (count !== newCount) {
        count = newCount;

        // Disable all buttons because of spam
        btnsElements.forEach((btn) => {
          btn.disabled = true;
        });

        orgsElement.style.opacity = 0;
        setTimeout(() => {
          // Update elements with data and fade in
          swapOrg();
          orgsElement.style.opacity = 1;

          // Enable all buttons
          setTimeout(() => {
            btnsElements.forEach((btn) => {
              btn.disabled = false;
            });
          }, 100);
        }, 500);
      }
    });
  });

  // Update elements with data
  swapOrg();

  // Start loop that updates elements every 5 seconds
  timeoutId = setInterval(() => {
    count++;

    orgsElement.style.opacity = 0;
    setTimeout(() => {
      swapOrg();

      orgsElement.style.opacity = 1;
    }, 500);
  }, 5000);
}
