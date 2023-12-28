// ===== back to top button =====
const backToTopBtn = document.querySelector(".backToTopBtn");

backToTopBtn.addEventListener("click", () => {
  document.body.scrollIntoView();
});

// ===== nav =====
const nav = document.querySelector("nav");
const navToggle = document.querySelector(".nav__mobile-menu-btn");
const menuHamburgerSvg = document.querySelector(".nav__hamburger-svg");
const menuCloseSvg = document.querySelector(".nav__close-svg");

const navLinks = document.querySelectorAll(".nav__links > li > a");

function toggleNav() {
  const navExpanded = nav.getAttribute("data-expanded");
  if (navExpanded === "false") {
    nav.setAttribute("data-expanded", "true");

    menuHamburgerSvg.classList.add("hidden");
    menuCloseSvg.classList.remove("hidden");
  } else {
    nav.setAttribute("data-expanded", "false");

    menuCloseSvg.classList.add("hidden");
    menuHamburgerSvg.classList.remove("hidden");
  }
}

// close nav when clicked on close (X)
navToggle.addEventListener("click", () => {
  toggleNav();
});

// close nav when clicked on link (for links that go to sections)
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    toggleNav();
  });
});

// close nav when clicked outside nav
window.addEventListener("click", function (e) {
  const navExpanded = nav.getAttribute("data-expanded");

  if (
    navExpanded === "true" &&
    !nav.contains(e.target) &&
    !navToggle.contains(e.target)
  ) {
    toggleNav();
  }
});

// sections intersection observers
const navIntersectionListItems = document.querySelectorAll(".nav__links > li");
let currentListItem = null;

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // console.log(entry.target);

        let currentSection = entry.target.getAttribute("id");

        // go through all nav items
        navIntersectionListItems.forEach((listItem) => {
          if (
            listItem.firstChild.getAttribute("href") ===
            "#" + currentSection
          ) {
            // remove current-site attribute from last current nav item
            if (currentListItem)
              currentListItem.removeAttribute("data-current-site");

            // add current-site attribute to current nav item
            listItem.setAttribute("data-current-site", "");
            currentListItem = listItem;
          }
        });
      }
    });
  },
  { threshold: 0.75 }
);

document.querySelectorAll("section").forEach((section) => {
  sectionObserver.observe(section);
});

// ===== footer copyright year =====
const footerYearEl = document.querySelector(".footer__year");
footerYearEl.textContent = new Date().getFullYear();

// ===== scroll based interactions =====
document.addEventListener("scroll", () => {
  const scrollContainer = document.documentElement || document.body;

  const scrolledPercentage =
    (scrollContainer.scrollTop /
      (scrollContainer.scrollHeight - scrollContainer.clientHeight)) *
    100;

  // progress bar
  const progressBarElement = document.querySelector(".progress-bar");
  const progressBarShowOnPx = 10; // amount of pixels before progress bar is shown

  progressBarElement.style.width = scrolledPercentage + "%";

  if (scrollContainer.scrollTop > progressBarShowOnPx)
    progressBarElement.classList.remove("hidden");
  else progressBarElement.classList.add("hidden");

  // back to top button
  const bttBtnShowOnPx = 100; // amount of pixels before button is shown

  if (scrollContainer.scrollTop > bttBtnShowOnPx)
    backToTopBtn.classList.remove("hidden");
  else backToTopBtn.classList.add("hidden");

  // background paralax
  const backgroundElement = document.querySelector(".background");
  backgroundElement.style.top = -scrolledPercentage / 4 + "%";
  backgroundElement.style.left = -scrolledPercentage / 2 + "%";

  // nav
  nav.setAttribute("data-scrolled", "true");
});
