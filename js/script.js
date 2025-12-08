
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const burgerBtn = document.getElementById("burgerBtn");
  const navLinks = document.querySelectorAll(".nav-link[data-scroll]");
  const yearSpan = document.getElementById("year");
  const leadForm = document.getElementById("leadForm");
  const scrollTopBtn = document.getElementById("scrollTopBtn");
  const arPills = document.querySelectorAll(".ar-project-pill");
  const mainArViewer = document.getElementById("mainArViewer");
  const arTitleEl = document.getElementById("arProjectTitle");
  const arDescEl = document.getElementById("arProjectDesc");
  const arHintEl = document.getElementById("arProjectHint");

  // Year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Theme from localStorage
  const storedTheme = localStorage.getItem("mebelline-theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "mebelline-theme",
        document.body.classList.contains("dark") ? "dark" : "light"
      );
    });
  }

  // Burger
  if (burgerBtn) {
    burgerBtn.addEventListener("click", () => {
      document.body.classList.toggle("nav-open");
    });
  }

  // Smooth scroll
  navLinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      if (target) {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
      document.body.classList.remove("nav-open");
    });
  });

  
  // Подсветка активного раздела в навигации
  if ("IntersectionObserver" in window && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navLinks.forEach((btn) => {
              const target = btn.getAttribute("data-scroll");
              btn.classList.toggle("nav-link-active", target === id);
            });
          }
        });
      },
      { threshold: 0.4 }
    );

    navLinks.forEach((btn) => {
      const target = btn.getAttribute("data-scroll");
      if (target) {
        const el = document.querySelector(target);
        if (el) observer.observe(el);
      }
    });
  }

  // Кнопка «наверх»
  if (scrollTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }
    });

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Переключение 3D/AR-проектов
  if (arPills.length && mainArViewer && arTitleEl && arDescEl && arHintEl) {
    arPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        arPills.forEach((p) => p.classList.remove("is-active"));
        pill.classList.add("is-active");

        const src = pill.getAttribute("data-src");
        const title = pill.getAttribute("data-title");
        const desc = pill.getAttribute("data-desc");
        const hint = pill.getAttribute("data-hint");

        if (src) mainArViewer.setAttribute("src", src);
        if (title) arTitleEl.textContent = title;
        if (desc) arDescEl.textContent = desc;
        if (hint) arHintEl.textContent = hint;
      });
    });
  }
// Lead form -> send text to hidden field for Telegram Bot API
  if (leadForm) {
    leadForm.addEventListener("submit", () => {
      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const task = document.getElementById("task").value.trim();
      const textField = document.getElementById("telegramText");

      let text = "Здравствуйте! Пишу по поводу мебели.\n\n";
      if (name) text += `Имя: ${name}\n`;
      if (contact) text += `Контакт: ${contact}\n`;
      if (task) {
        text += "\nЗадача: " + task;
      } else {
        text += "\nЗадача: кухня/шкаф/стол (опишите, что нужно).";
      }

      if (textField) {
        textField.value = text;
      }

      const note = document.querySelector(".form-note");
      if (note) {
        note.textContent = "Заявка отправлена! Евгений свяжется с вами в Telegram или по телефону.";
      }
      // Форма отправится на Telegram Bot API через стандартный submit
    });
  }
});


/**
 * Вызов AR-режима для <model-viewer>.
 * Используется в кнопке "Посмотреть в AR на смартфоне".
 */
function enterAR(button) {
  var card = button.parentElement;
  if (!card) return;
  var viewer = card.querySelector("model-viewer");
  if (viewer && viewer.canActivateAR) {
    viewer.activateAR();
  } else {
    alert("Откройте этот раздел на современном смартфоне, чтобы использовать AR.");
  }
}
