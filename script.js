const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const primaryNav = document.getElementById("primaryNav");
const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 20);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

function closeMenu() {
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
  primaryNav?.classList.remove("open");
  document.body.classList.remove("menu-open");
}

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealItems.forEach(item => item.classList.add("visible"));
} else {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach(item => revealObserver.observe(item));
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        navLinks.forEach(link => {
          const target = link.getAttribute("href");
          link.classList.toggle("active", target === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );

  sections.forEach(section => sectionObserver.observe(section));
}
