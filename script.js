const menuButton = document.querySelector("#menuButton");
const mobileNav = document.querySelector("#mobileNav");
const themeToggle = document.querySelector("#themeToggle");
const filterButtons = document.querySelectorAll(".filter-button");
const appCards = document.querySelectorAll(".app-card");
const quoteButtons = document.querySelectorAll("[data-product]");
const projectSelect = document.querySelector("#projectSelect");
const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const appType = document.querySelector("#appType");
const features = document.querySelector("#features");
const featureCount = document.querySelector("#featureCount");
const speed = document.querySelector("#speed");
const estimate = document.querySelector("#estimate");

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

menuButton.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuButton.setAttribute("aria-label", isOpen ? "Cerrar menu" : "Abrir menu");
});

mobileNav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileNav.classList.remove("open");
    menuButton.setAttribute("aria-label", "Abrir menu");
  }
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.querySelector("span").textContent = document.body.classList.contains("dark") ? "☾" : "☼";
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    appCards.forEach((card) => {
      const shouldShow = category === "all" || card.dataset.category === category;
      card.classList.toggle("hide", !shouldShow);
    });
  });
});

quoteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    projectSelect.value = button.dataset.product;
    document.querySelector("#contacto").scrollIntoView({ behavior: "smooth" });
  });
});

function updateEstimate() {
  const base = Number(appType.value);
  const extraCount = Number(features.value);
  const multiplier = Number(speed.value);
  const total = Math.round((base + extraCount * 90) * multiplier);

  featureCount.textContent = `${extraCount} ${extraCount === 1 ? "extra" : "extras"}`;
  estimate.textContent = currency.format(total);
}

[appType, features, speed].forEach((control) => {
  control.addEventListener("input", updateEstimate);
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name").toString().trim();
  const project = formData.get("project");

  formStatus.textContent = "Enviando solicitud...";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("No se pudo enviar el formulario");
    }

    formStatus.textContent = `Gracias, ${name}. Recibimos tu solicitud para ${project}.`;
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = "No pudimos enviar el formulario. Intentalo nuevamente.";
  }
});

updateEstimate();
