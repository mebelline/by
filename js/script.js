// ===== LUXURY SMOOTH SCROLL ENGINE =====
(function () {
  let current = window.scrollY;
  let target = window.scrollY;
  let ease = 0.08; // чем меньше — тем плавнее
  let rafId = null;
  let isEnabled = true;

  function animate() {
    current += (target - current) * ease;
    if (Math.abs(target - current) < 0.1) current = target;

    window.scrollTo(0, current);

    rafId = requestAnimationFrame(animate);
  }

  window.addEventListener("wheel", (e) => {
    if (!isEnabled) return;

    e.preventDefault();
    target += e.deltaY;
    target = Math.max(0, Math.min(target, document.body.scrollHeight - window.innerHeight));

    if (!rafId) animate();
  }, { passive: false });

  window.addEventListener("touchmove", () => {
    target = window.scrollY;
    current = window.scrollY;
  });

  window.luxuryScroll = {
    enable() {
      isEnabled = true;
    },
    disable() {
      isEnabled = false;
      cancelAnimationFrame(rafId);
      rafId = null;
    },
    scrollTo(y) {
      target = y;
      if (!rafId) animate();
    }
  };
})();


document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  const burgerBtn = document.getElementById("burgerBtn");
  const navLinks = document.querySelectorAll(".nav-link[data-scroll]");
  const scrollButtons = document.querySelectorAll("[data-scroll]");
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

  // Smooth scroll (для всех элементов с data-scroll)
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-scroll");
      if (target) {
        const el = document.querySelector(target);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 70;
          window.luxuryScroll.scrollTo(top);
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
      window.luxuryScroll.scrollTo(0);
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

  
  // Projects: data-driven viewer (hero + portfolio)
  const projects = Array.isArray(window.ML_PROJECTS) ? window.ML_PROJECTS : [];
  const projectMap = new Map(projects.map((p) => [p.id, p]));

  const projectModal = document.getElementById("projectModal");
  const pmImage = document.getElementById("projectModalImage");
  const pmVideo = document.getElementById("projectModalVideo");
  const pmTitle = document.getElementById("projectModalTitle");
  const pmSub = document.getElementById("projectModalSub");
  const pmKicker = document.getElementById("projectModalKicker");
  const pmDesc = document.getElementById("projectModalDesc");
  const pmTags = document.getElementById("projectModalTags");
  const pmSpecs = document.getElementById("projectModalSpecs");
  const pmThumbs = document.getElementById("projectModalThumbs");
  const pmPrev = projectModal ? projectModal.querySelector(".project-nav-prev") : null;
  const pmNext = projectModal ? projectModal.querySelector(".project-nav-next") : null;

  let activeProject = null;
  let activeMedia = [];
  let activeIndex = 0;
  let lastHash = "";

  const safeText = (value) => (typeof value === "string" ? value : "");

  const buildFallbackProjectFromCard = (card) => {
    const img = card.querySelector(".card-img-wrap img");
    const titleEl = card.querySelector("h3");
    const textEl = card.querySelector("p");
    const tagsEl = card.querySelector(".card-tags");

    const tags = tagsEl
      ? Array.from(tagsEl.querySelectorAll("span"))
          .map((s) => s.textContent.trim())
          .filter(Boolean)
      : [];

    return {
      id: "card-" + Math.random().toString(16).slice(2),
      category: card.getAttribute("data-category") || "project",
      kicker: "Проект",
      title: titleEl ? titleEl.textContent.trim() : "Проект",
      subtitle: "",
      description: textEl ? textEl.textContent.trim() : "",
      tags,
      specs: [],
      media: img
        ? [{ type: "image", src: img.getAttribute("src"), alt: img.getAttribute("alt") || "" }]
        : [],
    };
  };

  const setStage = (index) => {
    if (!projectModal || !activeMedia.length) return;
    const item = activeMedia[index];
    if (!item) return;

    activeIndex = index;

    if (pmVideo) {
      pmVideo.pause();
      pmVideo.removeAttribute("src");
      pmVideo.load();
      pmVideo.style.display = "none";
    }
    if (pmImage) {
      pmImage.style.display = "none";
    }

    if (item.type === "video" && pmVideo) {
      pmVideo.style.display = "block";
      pmVideo.src = item.src;
      pmVideo.load();
    } else if (pmImage) {
      pmImage.style.display = "block";
      pmImage.src = item.src;
      pmImage.alt = item.alt || safeText(activeProject && activeProject.title) || "Проект";
    }

    if (pmThumbs) {
      const btns = pmThumbs.querySelectorAll(".project-thumb");
      btns.forEach((b) => b.classList.toggle("is-active", parseInt(b.dataset.index || "0", 10) === index));
    }
  };

  const renderThumbs = () => {
    if (!pmThumbs) return;
    pmThumbs.innerHTML = "";

    activeMedia.forEach((item, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "project-thumb";
      btn.dataset.index = String(idx);

      if (item.type === "video") {
        btn.classList.add("is-video");
        btn.innerHTML = '<span class="project-thumb-play" aria-hidden="true"></span><span class="sr-only">Видео</span>';
      } else {
        const img = document.createElement("img");
        img.src = item.src;
        img.alt = item.alt || "";
        img.loading = "lazy";
        btn.appendChild(img);
      }

      btn.addEventListener("click", () => setStage(idx));
      pmThumbs.appendChild(btn);
    });
  };

  const setMeta = (project) => {
    if (!project) return;
    if (pmKicker) pmKicker.textContent = safeText(project.kicker);
    if (pmTitle) pmTitle.textContent = safeText(project.title);
    if (pmSub) pmSub.textContent = safeText(project.subtitle);

    if (pmDesc) pmDesc.textContent = safeText(project.description);

    if (pmTags) {
      const tags = Array.isArray(project.tags) ? project.tags : [];
      pmTags.innerHTML = tags.map((t) => `<span>${t}</span>`).join("");
    }

    if (pmSpecs) {
      const specs = Array.isArray(project.specs) ? project.specs : [];
      pmSpecs.innerHTML = specs.map((s) => `<li>${s}</li>`).join("");
    }
  };

  const openProject = (projectOrId, startAt = 0, pushHash = true) => {
    if (!projectModal) return;
window.luxuryScroll.disable();

    const project =
      typeof projectOrId === "string"
        ? projectMap.get(projectOrId)
        : projectOrId;

    if (!project) return;

    activeProject = project;
    activeMedia = Array.isArray(project.media) ? project.media.filter((m) => m && m.src) : [];
    if (!activeMedia.length && project.heroCover) {
      activeMedia = [{ type: "image", src: project.heroCover, alt: project.heroAlt || "" }];
    }

    setMeta(project);
    renderThumbs();

    projectModal.classList.add("is-open");
    document.body.classList.add("modal-open");

    setStage(Math.max(0, Math.min(startAt, activeMedia.length - 1)));

    if (pushHash) {
      lastHash = window.location.hash;
      window.location.hash = "project=" + encodeURIComponent(project.id);
    }
  };

  const closeProject = (restoreHash = true) => {
    if (!projectModal) return;
    window.luxuryScroll.enable();


    projectModal.classList.remove("is-open");
    document.body.classList.remove("modal-open");

    if (pmVideo) {
      pmVideo.pause();
      pmVideo.removeAttribute("src");
      pmVideo.load();
    }

    activeProject = null;
    activeMedia = [];
    activeIndex = 0;

    if (restoreHash) {
      // если мы открывали проект — почистим hash, чтобы не мешал навигации
      if (window.location.hash.startsWith("#project=")) {
        window.location.hash = lastHash && lastHash !== "#project=" ? lastHash : "";
      }
    }
  };

  const step = (dir) => {
    if (!activeMedia.length) return;
    const next = (activeIndex + dir + activeMedia.length) % activeMedia.length;
    setStage(next);
  };

  if (projectModal) {
    projectModal.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      if (target.matches("[data-project-close]") || target.classList.contains("project-modal-backdrop")) {
        closeProject(true);
        return;
      }
    });

    if (pmPrev) pmPrev.addEventListener("click", () => step(-1));
    if (pmNext) pmNext.addEventListener("click", () => step(1));

    document.addEventListener("keydown", (event) => {
      if (!projectModal.classList.contains("is-open")) return;
      if (event.key === "Escape") closeProject(true);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    });

    // Deep-link: #project=...
    const openFromHash = () => {
      const hash = window.location.hash || "";
      const m = hash.match(/#project=([^&]+)/);
      if (m && m[1]) {
        const id = decodeURIComponent(m[1]);
        if (projectMap.has(id)) openProject(id, 0, false);
      }
    };
    window.addEventListener("hashchange", () => {
      const hash = window.location.hash || "";
      if (!hash.startsWith("#project=") && projectModal.classList.contains("is-open")) {
        closeProject(false);
      } else if (hash.startsWith("#project=") && !projectModal.classList.contains("is-open")) {
        openFromHash();
      }
    });
    openFromHash();
  }

  // Hero projects (правый блок): выбор проекта + открытие подробного просмотра
  const heroMainBtn = document.querySelector(".hero-main-card.project-open");
  const heroMainImg = heroMainBtn ? heroMainBtn.querySelector("img") : null;
  const heroMainTitle = heroMainBtn ? heroMainBtn.querySelector(".hero-main-title") : null;
  const heroMainSub = heroMainBtn ? heroMainBtn.querySelector(".hero-main-sub") : null;
  const heroThumbBtns = document.querySelectorAll(".hero-thumb.project-select[data-project-id]");

  const setHeroProject = (projectId) => {
    const project = projectMap.get(projectId);
    if (!project || !heroMainBtn || !heroMainImg || !heroMainTitle || !heroMainSub) return;

    heroMainBtn.dataset.projectId = project.id;
    heroMainImg.src = project.heroCover || project.media?.[0]?.src || heroMainImg.src;
    heroMainImg.alt = project.heroAlt || safeText(project.title);
    heroMainTitle.textContent = safeText(project.title);
    heroMainSub.textContent = safeText(project.subtitle);

    heroThumbBtns.forEach((b) => b.classList.toggle("is-active", b.dataset.projectId === project.id));
  };

  if (heroMainBtn && heroThumbBtns.length) {
    // initial
    const initialId = heroMainBtn.dataset.projectId || heroThumbBtns[0].dataset.projectId;
    if (initialId) setHeroProject(initialId);

    heroThumbBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.projectId;
        if (id) setHeroProject(id);
      });
    });

    heroMainBtn.addEventListener("click", () => {
      const id = heroMainBtn.dataset.projectId;
      if (id) openProject(id, 0, true);
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

  // Портфолио: клик по карточке → подробный просмотр (галерея/видео)
  if (portfolioCards.length && projectModal) {
    portfolioCards.forEach((card) => {
      card.addEventListener("click", () => {
        const pid = card.getAttribute("data-project-id");
        if (pid && projectMap.has(pid)) {
          openProject(pid, 0, true);
        } else {
          openProject(buildFallbackProjectFromCard(card), 0, false);
        }
      });
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