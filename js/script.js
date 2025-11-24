
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const burgerBtn = document.getElementById("burgerBtn");
  const navLinks = document.querySelectorAll(".nav-link[data-scroll]");
  const yearSpan = document.getElementById("year");
  const leadForm = document.getElementById("leadForm");

  // Year in footer
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Theme from localStorage
  const storedTheme = localStorage.getItem("zenmebel-theme");
  if (storedTheme === "dark") {
    document.body.classList.add("dark");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem(
        "zenmebel-theme",
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

  // Lead form -> copy text
  if (leadForm) {
    leadForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const task = document.getElementById("task").value.trim();

      let text = "Здравствуйте! Пишу по поводу мебели на заказ.\n\n";
      if (name) text += `Имя: ${name}\n`;
      if (contact) text += `Контакт: ${contact}\n`;
      if (task) {
        text += "\nЗадача: " + task;
      } else {
        text += "\nЗадача: кухня/шкаф/стол (опишите, что нужно).";
      }

      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert("Текст заявки скопирован. Вставьте его в Telegram или WhatsApp и отправьте Евгению.");
        })
        .catch(() => {
          alert("Не получилось автоматически скопировать текст. Выделите и скопируйте его вручную: \n\n" + text);
        });
    });
  }
});
