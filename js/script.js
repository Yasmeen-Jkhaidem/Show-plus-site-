document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     FAQ Accordion
  ========================= */
  const faqItems = document.querySelectorAll(".faq-item");

  if (faqItems.length) {
    faqItems.forEach((item) => {
      const btn = item.querySelector(".faq-question");

      if (!btn) return;

      btn.addEventListener("click", function () {
        const isActive = item.classList.contains("active");

        faqItems.forEach((el) => {
          el.classList.remove("active");

          const answer = el.querySelector(".faq-answer");
          const question = el.querySelector(".faq-question");

          if (answer) answer.style.display = "none";
          if (question) question.setAttribute("aria-expanded", "false");
        });

        if (!isActive) {
          item.classList.add("active");

          const answer = item.querySelector(".faq-answer");
          if (answer) answer.style.display = "block";

          btn.setAttribute("aria-expanded", "true");
        }
      });
    });
  }

  /* =========================
     Scroll To Top Button
  ========================= */
  const scrollBtn = document.getElementById("scrollTopBtn");

  if (scrollBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        scrollBtn.style.opacity = "1";
        scrollBtn.style.pointerEvents = "auto";
      } else {
        scrollBtn.style.opacity = "0";
        scrollBtn.style.pointerEvents = "none";
      }
    });

    scrollBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     Footer Scroll Button
  ========================= */
  const footerScrollBtn = document.querySelector(".footer-scrolltop");

  if (footerScrollBtn) {
    footerScrollBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* =========================
     Mobile Menu Toggle
  ========================= */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const overlay = document.getElementById("overlay");

  if (menuToggle && navMenu && overlay) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      overlay.classList.toggle("active");
    });

    overlay.addEventListener("click", () => {
      navMenu.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  /* =========================
   Testimonials Slider — True Infinite Loop
  ========================= */
  const slider = document.querySelector(".testimonials-slider");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  if (slider && prevBtn && nextBtn) {
    const gap = 24;
    const isRTL = () => !document.body.classList.contains("ltr");
    const AUTO_SCROLL_DELAY = 3000;

    const originalCards = Array.from(
      slider.querySelectorAll(".testimonial-card"),
    );

    // --- Clone a full set BEFORE and AFTER the originals ---
    originalCards.forEach((card) => {
      const cloneAfter = card.cloneNode(true);
      cloneAfter.setAttribute("aria-hidden", "true");
      slider.appendChild(cloneAfter);
    });

    [...originalCards].reverse().forEach((card) => {
      const cloneBefore = card.cloneNode(true);
      cloneBefore.setAttribute("aria-hidden", "true");
      slider.prepend(cloneBefore);
    });

    const getCardWidth = () => {
      const card = slider.querySelector(".testimonial-card");
      return card ? card.offsetWidth + gap : 0;
    };

    // --- Jump to the middle set silently on init ---
    const jumpToMiddle = (animate = false) => {
      const setWidth = originalCards.length * getCardWidth();
      slider.style.scrollBehavior = "auto";

      if (isRTL()) {
        slider.scrollLeft = -setWidth;
      } else {
        slider.scrollLeft = setWidth;
      }

      if (animate) {
        requestAnimationFrame(() => {
          slider.style.scrollBehavior = "";
        });
      }
    };

    // --- Seamless loop: when entering clone zone, silently jump to real equivalent ---
    let isSyncing = false;

    const syncLoop = () => {
      if (isSyncing) return;

      const setWidth = originalCards.length * getCardWidth();
      const scroll = slider.scrollLeft;

      let jumped = false;

      if (isRTL()) {
        // RTL scrollLeft: 0 = far right, negative = scrolled left
        // Clones before: scrollLeft > 0 (right of origin)
        // Clones after:  scrollLeft < -setWidth * 2 (too far left)
        if (scroll > 0) {
          // Entered right clones (before-set) → jump to real equivalent in middle
          isSyncing = true;
          slider.style.scrollBehavior = "auto";
          slider.scrollLeft = scroll - setWidth;
          jumped = true;
        } else if (scroll < -(setWidth * 2 - getCardWidth())) {
          // Entered left clones (after-set) → jump to real equivalent in middle
          isSyncing = true;
          slider.style.scrollBehavior = "auto";
          slider.scrollLeft = scroll + setWidth;
          jumped = true;
        }
      } else {
        // LTR: 0 = far left, positive = scrolled right
        // Clones before: scrollLeft < 0
        // Clones after:  scrollLeft > setWidth * 2
        if (scroll < getCardWidth() * 0.5) {
          // Entered left clones (before-set) → jump to real equivalent in middle
          isSyncing = true;
          slider.style.scrollBehavior = "auto";
          slider.scrollLeft = scroll + setWidth;
          jumped = true;
        } else if (scroll > setWidth * 2 - getCardWidth() * 0.5) {
          // Entered right clones (after-set) → jump to real equivalent in middle
          isSyncing = true;
          slider.style.scrollBehavior = "auto";
          slider.scrollLeft = scroll - setWidth;
          jumped = true;
        }
      }

      if (jumped) {
        requestAnimationFrame(() => {
          slider.style.scrollBehavior = "";
          isSyncing = false;
        });
      }
    };

    // --- Scroll forward (next) ---
    const scrollNext = () => {
      const dir = isRTL() ? -1 : 1;
      slider.scrollBy({ left: getCardWidth() * dir, behavior: "smooth" });
    };

    // --- Scroll backward (prev) ---
    const scrollPrev = () => {
      const dir = isRTL() ? 1 : -1;
      slider.scrollBy({ left: getCardWidth() * dir, behavior: "smooth" });
    };

    // --- Auto-scroll ---
    let autoScrollTimer = null;

    const startAutoScroll = () => {
      stopAutoScroll();
      autoScrollTimer = setInterval(scrollNext, AUTO_SCROLL_DELAY);
    };

    const stopAutoScroll = () => {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    };

    // --- Buttons ---
    prevBtn.disabled = false;
    nextBtn.disabled = false;

    prevBtn.addEventListener("click", () => {
      scrollPrev();
      startAutoScroll();
    });

    nextBtn.addEventListener("click", () => {
      scrollNext();
      startAutoScroll();
    });

    // --- Drag (Desktop) ---
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      startScrollLeft = slider.scrollLeft;
      stopAutoScroll();
    });

    ["mouseleave", "mouseup"].forEach((event) => {
      slider.addEventListener(event, () => {
        if (isDragging) {
          isDragging = false;
          slider.classList.remove("dragging");
          startAutoScroll();
        }
      });
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      slider.scrollLeft = startScrollLeft - (x - startX) * 1.5;
    });

    // --- Touch (Mobile) ---
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      startScrollLeft = slider.scrollLeft;
      stopAutoScroll();
    });

    slider.addEventListener("touchend", () => startAutoScroll());

    slider.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      slider.scrollLeft = startScrollLeft - (x - startX) * 1.5;
    });

    // --- Pause on hover ---
    slider.addEventListener("mouseenter", stopAutoScroll);
    slider.addEventListener("mouseleave", () => {
      if (!isDragging) startAutoScroll();
    });

    // --- Sync on scroll ---
    slider.addEventListener("scroll", syncLoop);

    // --- Init: start at the middle set ---
    setTimeout(() => {
      jumpToMiddle();
      startAutoScroll();
    }, 100);
  }

  /* =========================
     Pricing Toggle
  ========================= */
  const billingButtons = document.querySelectorAll(
    ".pricing-billing-toggle .billing-btn",
  );
  const pricingCards = document.querySelectorAll(".pricing-card");

  if (billingButtons.length && pricingCards.length) {
    const pricingValues = {
      monthly: {
        starter: "مجانًا",
        pro: 299,
        enterprise: "مخصص",
      },
      yearly: {
        starter: "مجانًا",
        pro: 2990,
        enterprise: "مخصص",
      },
    };

    function createCurrencySVG() {
      const svgNS = "http://www.w3.org/2000/svg";

      const svg = document.createElementNS(svgNS, "svg");
      svg.setAttribute("viewBox", "0 0 21 24");
      svg.classList.add("currency-icon");

      const path1 = document.createElementNS(svgNS, "path");
      path1.setAttribute(
        "d",
        "M13.0694 21.2613C12.6947 22.1109 12.4469 23.033 12.3521 24L20.2823 22.2762C20.657 21.4267 20.9046 20.5044 20.9996 19.5375L13.0694 21.2613Z",
      );

      const path2 = document.createElementNS(svgNS, "path");
      path2.setAttribute(
        "d",
        "M20.2822 17.1119C20.6569 16.2624 20.9046 15.3401 20.9995 14.3732L14.8221 15.7167V13.134L20.282 11.9476C20.6567 11.0981 20.9044 10.1758 20.9993 9.20886L14.8219 10.5512V1.26324C13.8753 1.8067 13.0347 2.53011 12.3514 3.38341V11.0883L9.8808 11.6253V0C8.93424 0.543271 8.09359 1.26687 7.41024 2.12017V12.1621L1.88236 13.3632C1.50762 14.2127 1.25973 15.135 1.16464 16.1019L7.41024 14.7447V17.9971L0.71686 19.4515C0.34212 20.301 0.0944109 21.2233 -0.000488281 22.1903L7.00561 20.6678C7.57594 20.5465 8.06613 20.2017 8.38483 19.7272L9.6697 17.7793C9.80309 17.5774 9.8808 17.3344 9.8808 17.0727V14.2078L12.3514 13.6708V18.8361L20.282 17.1115Z",
      );

      svg.appendChild(path1);
      svg.appendChild(path2);

      return svg;
    }

    const formatter = new Intl.NumberFormat("en-US");

    const updatePrices = (billing) => {
      pricingCards.forEach((card) => {
        const plan = card.dataset.plan;
        const amount = card.querySelector(".pricing-amount");
        const unit = card.querySelector(".pricing-unit");

        if (!amount) return;

        const value = pricingValues[billing][plan];
        amount.innerHTML = "";

        if (typeof value === "number") {
          const text = document.createElement("span");
          text.textContent = formatter.format(value);

          amount.appendChild(text);
          amount.appendChild(createCurrencySVG());
        } else {
          amount.textContent = value;
        }

        if (plan === "pro" && unit) {
          unit.textContent = billing === "monthly" ? "/ شهرياً" : "/ سنوياً";
        }
      });
    };

    billingButtons.forEach((button) => {
      button.addEventListener("click", () => {
        billingButtons.forEach((btn) => btn.classList.remove("active"));

        button.classList.add("active");
        updatePrices(button.dataset.billing);
      });
    });

    updatePrices("monthly");
  }

  const sections = document.querySelectorAll(`
  .main-home,
  .triggers-container,
  .how-it-works.primary-section,
  .features.primary-section,
  .comparison-section.primary-section,
  .testimonials.primary-section,
  .partners,
  .target-audience.primary-section,
  .users-trigger.primary-section,
  .trigger-section.primary-section,
  footer.site-footer
`);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("section-in-view");

          // stop observing after reveal
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  /* =========================
     Screenshots Column Cards
  ========================= */
  
  // ─── Card data ───────────────────────────────────────────
  // Replace `emoji` + `bg` with a real image src in production.
  const cards = [
    {
      bg: "#1e3a5f",
      emoji: "🛒",
      name: "متجر الأناقة",
      sub: "عرض مباشر",
      viewers: "1,204",
    },
    {
      bg: "#3a1e1e",
      emoji: "💎",
      name: "جواهر رويال",
      sub: "تخفيضات حصرية",
      viewers: "987",
    },
    {
      bg: "#1e3a2a",
      emoji: "🤖",
      name: "تقنية وروبوت",
      sub: "أحدث المنتجات",
      viewers: "643",
    },
    {
      bg: "#3a2d1e",
      emoji: "🎮",
      name: "عالم الألعاب",
      sub: "إطلاق جديد",
      viewers: "2,115",
    },
    {
      bg: "#2d1e3a",
      emoji: "👗",
      name: "أزياء 2025",
      sub: "أسبوع الموضة",
      viewers: "1,560",
    },
    {
      bg: "#1e2a3a",
      emoji: "📱",
      name: "إلكترونيات برو",
      sub: "عروض حية",
      viewers: "834",
    },
    {
      bg: "#3a1e2d",
      emoji: "🌸",
      name: "عطور فاخرة",
      sub: "كولكشن جديد",
      viewers: "421",
    },
    {
      bg: "#2a3a1e",
      emoji: "🏋️",
      name: "فتنس لايف",
      sub: "تدريب مباشر",
      viewers: "1,078",
    },
    {
      bg: "#3a3a1e",
      emoji: "🎨",
      name: "فن وإبداع",
      sub: "ورشة مباشرة",
      viewers: "356",
    },
  ];

  // Which cards go in each column
  const columnData = [
    [cards[0], cards[1], cards[2], cards[3]],
    [cards[4], cards[5], cards[6], cards[7]],
    [cards[8], cards[0], cards[3], cards[5]],
  ];

  // ─── Build a single card's HTML ──────────────────────────
  function buildCard(card) {
    return `
        <div class="ss-card">
          <div class="ss-card-img" style="background: ${card.bg};">${card.emoji}</div>
          <div class="ss-card-overlay"></div>
          <div class="ss-card-info">
            <div class="live-badge">
              <span class="live-dot"></span>
              مباشر
            </div>
            <p class="card-name">${card.name}</p>
            <p class="card-sub">${card.sub}</p>
            <p class="card-viewers">${card.viewers} مشاهد</p>
          </div>
        </div>
      `;
  }

  // ─── Render columns ──────────────────────────────────────
  const container = document.getElementById("screenshots-column");

  columnData.forEach((colCards) => {
    const col = document.createElement("div");
    col.className = "ss-col";

    // Duplicate cards so the loop is seamless
    const doubled = [...colCards, ...colCards];
    col.innerHTML = doubled.map(buildCard).join("");

    container.appendChild(col);
  });
});
