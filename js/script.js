
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


// Плавное появление секций при скролле
const revealSections = document.querySelectorAll("section");
if ("IntersectionObserver" in window && revealSections.length) {
  revealSections.forEach((sec) => sec.classList.add("reveal-section"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  revealSections.forEach((sec) => revealObserver.observe(sec));
}

  // Кнопка «наверх»
  if (scrollTopBtn) {
    const handleScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      if (y > 400) {
        scrollTopBtn.classList.add("visible");
      } else {
        scrollTopBtn.classList.remove("visible");
      }

      if (y > 10) {
        document.body.classList.add("is-scrolled");
      } else {
        document.body.classList.remove("is-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    window.addEventListener("scroll", () => {
      const y = window.scrollY || window.pageYOffset;
      if (y > 10) {
        document.body.classList.add("is-scrolled");
      } else {
        document.body.classList.remove("is-scrolled");
      }
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

  
  // Scroll reveal для секций
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (revealElements.length && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15 }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else if (revealElements.length) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

// Анимация чисел в блоке статистики
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (statNumbers.length && "IntersectionObserver" in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
        const duration = 900;
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const value = Math.floor(target * progress);
          el.textContent = value.toString();
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toString();
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    }, { threshold: 0.6 });

    statNumbers.forEach((num) => statsObserver.observe(num));
  }

  // Герой: переключение изображений по клику на превью
  const heroMainCard = document.querySelector(".hero-main-card");
  const heroMainImg = heroMainCard ? heroMainCard.querySelector("img") : null;
  const heroMainTitle = heroMainCard ? heroMainCard.querySelector(".hero-main-title") : null;
  const heroMainSub = heroMainCard ? heroMainCard.querySelector(".hero-main-sub") : null;
  const heroThumbs = document.querySelectorAll(".hero-thumb");

  if (heroMainCard && heroMainImg && heroMainTitle && heroMainSub && heroThumbs.length) {
    const initial = {
      src: heroMainImg.getAttribute("src"),
      alt: heroMainImg.getAttribute("alt"),
      title: heroMainTitle.textContent,
      sub: heroMainSub.textContent,
    };

    let currentIndex = 0;

    const applyFromThumb = (thumb) => {
      const img = thumb.querySelector("img");
      const caption = thumb.querySelector(".hero-thumb-caption");
      if (!img) return;
      heroMainImg.src = img.src;
      heroMainImg.alt = img.alt || "";
      if (caption) {
        heroMainTitle.textContent = caption.textContent || "";
        heroMainSub.textContent = img.alt || "";
      }
      heroThumbs.forEach((t) => t.classList.remove("is-active"));
      thumb.classList.add("is-active");
      currentIndex = Array.prototype.indexOf.call(heroThumbs, thumb);
    };

    heroThumbs.forEach((thumb) => {
      thumb.addEventListener("click", () => applyFromThumb(thumb));
    });

  
  }

  // Фильтрация портфолио и модальное окно
  const filterButtons = document.querySelectorAll("[data-portfolio-filter]");
  const portfolioCards = document.querySelectorAll(".portfolio-grid .card");

  if (filterButtons.length && portfolioCards.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-portfolio-filter") || "all";
        filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));

        portfolioCards.forEach((card) => {
          const category = card.getAttribute("data-category") || "all";
          if (filter === "all" || category === filter) {
            card.classList.remove("is-hidden");
          } else {
            card.classList.add("is-hidden");
          }
        });
      });
    });
  }

  const portfolioModal = document.getElementById("portfolioModal");
  const modalImage = document.getElementById("portfolioModalImage");
  const modalTitle = document.getElementById("portfolioModalTitle");
  const modalText = document.getElementById("portfolioModalText");
  const modalTags = document.getElementById("portfolioModalTags");

  if (portfolioModal && portfolioCards.length) {
    const openModal = (card) => {
      const img = card.querySelector(".card-img-wrap img");
      const titleEl = card.querySelector("h3");
      const textEl = card.querySelector("p");
      const tagsEl = card.querySelector(".card-tags");

      if (img && modalImage) {
        modalImage.src = img.src;
        modalImage.alt = img.alt || "";
      }
      if (modalTitle) modalTitle.textContent = titleEl ? titleEl.textContent : "";
      if (modalText) modalText.textContent = textEl ? textEl.textContent : "";
      if (modalTags) modalTags.innerHTML = tagsEl ? tagsEl.innerHTML : "";

      portfolioModal.classList.add("is-open");
      document.body.classList.add("modal-open");
    };

    portfolioCards.forEach((card) => {
      card.addEventListener("click", () => openModal(card));
    });

    const closeModal = () => {
      portfolioModal.classList.remove("is-open");
      document.body.classList.remove("modal-open");
    };

    portfolioModal.addEventListener("click", (event) => {
      const target = event.target;
      if (target.matches("[data-portfolio-close]") || target === portfolioModal || target.classList.contains("portfolio-modal-backdrop")) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && portfolioModal.classList.contains("is-open")) {
        closeModal();
      }
    });
  }

  // Автовоспроизведение видео при попадании в зону видимости
  const autoplayVideos = document.querySelectorAll("video[data-autoplay]");
  if (autoplayVideos.length && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const video = entry.target;
        if (!(video instanceof HTMLVideoElement)) return;
        if (entry.isIntersecting) {
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.5 });

    autoplayVideos.forEach((video) => videoObserver.observe(video));
  }

  // FAQ: аккордеон
  const faqItems = document.querySelectorAll(".faq-item");
  if (faqItems.length) {
    faqItems.forEach((item) => {
      const questionBtn = item.querySelector(".faq-question");
      const answer = item.querySelector(".faq-answer");
      if (!questionBtn || !answer) return;

      if (item.classList.contains("is-open")) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }

      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("is-open");
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("is-open");
            const otherAnswer = other.querySelector(".faq-answer");
            if (otherAnswer) otherAnswer.style.maxHeight = "0px";
          }
        });
        if (!isOpen) {
          item.classList.add("is-open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        } else {
          item.classList.remove("is-open");
          answer.style.maxHeight = "0px";
        }
      });
    });
  }

  // Калькулятор примерной сметы
  const estimateForm = document.getElementById("estimateForm");
  const estimateResult = document.getElementById("estimateResult");

  if (estimateForm && estimateResult) {
    estimateForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(estimateForm);
      const type = formData.get("type");
      const length = parseFloat(formData.get("length") || "0");
      const complexity = formData.get("complexity") || "basic";

      if (!length || length <= 0) {
        return;
      }

      // Базовые ставки за метр (условные, для ориентира)
      const basePerMeter = {
        kitchen: 520,
        wardrobe: 430,
        hallway: 380,
        bathroom: 450,
        office: 360,
      };

      let pricePerMeter = basePerMeter[type] || 420;

      if (complexity === "smart") {
        pricePerMeter *= 1.18;
      } else if (complexity === "premium") {
        pricePerMeter *= 1.35;
      }

      const minPrice = Math.round(pricePerMeter * length * 0.9);
      const maxPrice = Math.round(pricePerMeter * length * 1.15);

      const formatCurrency = (value) =>
        value.toLocaleString("ru-RU", { maximumFractionDigits: 0 });

      estimateResult.innerHTML = `
        <div>
          <div class="estimate-output-main">Ориентировочно от ${formatCurrency(
            minPrice
          )} до ${formatCurrency(maxPrice)} BYN</div>
          <div class="estimate-output-extra">
            При расчёте учтены базовые материалы и стандартная фурнитура. 
            Точная сумма зависит от наполнения, фасадов и выбранных механизмов.
          </div>
        </div>
      `;
    });
  }

  // Lead form -> send структурированную заявку в Telegram Bot API
  if (leadForm) {
    leadForm.addEventListener("submit", () => {
      const name = document.getElementById("name").value.trim();
      const contact = document.getElementById("contact").value.trim();
      const task = document.getElementById("task").value.trim();
      const textField = document.getElementById("telegramText");

      let text = "Новая заявка с сайта\n";
      text += "Источник: сайт (форма в разделе Контакты)\n";
      text += "------------------------------\n";
      if (name) text += `Имя: ${name}\n`;
      if (contact) text += `Контакт: ${contact}\n`;

      if (task) {
        text += "\nСообщение клиента:\n" + task;
      } else {
        text += "\nСообщение клиента:\n(клиент не описал задачу, уточните в чате)";
      }

      if (textField) {
        textField.value = text;
      }

      const note = document.querySelector(".form-note");
      if (note) {
        note.textContent = "Заявка отправлена! Евгений свяжется с вами в ближайшее время.";
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