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
   Testimonials Slider
========================= */
  const slider = document.querySelector(".testimonials-slider");
  const prevBtn = document.querySelector(".slider-prev");
  const nextBtn = document.querySelector(".slider-next");

  if (slider && prevBtn && nextBtn) {
    const card = slider.querySelector(".testimonial-card");
    if (!card) return;

    const gap = 24;
    const getScrollAmount = () => card.offsetWidth + gap;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // RTL-aware button logic:
    // In RTL, "prev" (right arrow) scrolls LEFT (negative), "next" (left arrow) scrolls RIGHT (positive)
    prevBtn.addEventListener("click", () => {
      slider.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    nextBtn.addEventListener("click", () => {
      slider.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    // Drag (Desktop)
    slider.addEventListener("mousedown", (e) => {
      isDragging = true;
      slider.classList.add("dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    ["mouseleave", "mouseup"].forEach((event) => {
      slider.addEventListener(event, () => {
        isDragging = false;
        slider.classList.remove("dragging");
      });
    });

    slider.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // Touch (Mobile)
    slider.addEventListener("touchstart", (e) => {
      startX = e.touches[0].pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener("touchmove", (e) => {
      const x = e.touches[0].pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    });

    // RTL-aware disabled state
    // In RTL, scrollLeft is 0 when scrolled fully to the RIGHT (start), and negative when scrolled left
    const updateButtons = () => {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const currentScroll = Math.abs(slider.scrollLeft); // normalize negative RTL values

      prevBtn.disabled = currentScroll <= 0; // at start (rightmost) → prev disabled
      nextBtn.disabled = currentScroll >= maxScroll - 1; // at end (leftmost) → next disabled
    };

    slider.addEventListener("scroll", updateButtons);

    // Small delay so the DOM is fully rendered before calculating
    setTimeout(updateButtons, 100);
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
});
