// Stay in Dream – small gallery slider, hero zoom, fade-ins. No libraries, no tracking.
(() => {
  // Set the special reservation code here once Paul confirms it, e.g. "DREAM50".
  const RESERVATION_CODE = "";

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Booking code
  if (RESERVATION_CODE) {
    const text = document.querySelector("#code-text");
    text.textContent = "";
    text.append("Use code ");
    const strong = document.createElement("strong");
    strong.textContent = RESERVATION_CODE;
    text.append(strong, " when you book.");
  }

  // Hero: the photo settles as you start scrolling.
  const hero = document.querySelector(".hero-img");
  if (hero && !reduce) {
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight);
      hero.style.setProperty("--p", p.toFixed(3));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Small gallery slider
  const slider = document.querySelector("#slider");
  const prev = document.querySelector("#prev");
  const next = document.querySelector("#next");
  const dotsBox = document.querySelector("#dots");
  if (slider) {
    const slides = [...slider.querySelectorAll(".slide")];
    const dots = slides.map(() => dotsBox.appendChild(document.createElement("span")));
    const step = () => slides[0].getBoundingClientRect().width + 16;
    const update = () => {
      const i = Math.round(slider.scrollLeft / step());
      dots.forEach((d, k) => d.classList.toggle("on", k === i));
      prev.disabled = slider.scrollLeft < 4;
      next.disabled = slider.scrollLeft + slider.clientWidth > slider.scrollWidth - 4;
    };
    const go = (dir) => slider.scrollBy({ left: dir * step(), behavior: reduce ? "auto" : "smooth" });
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));
    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
    });
    slider.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  // Fade-ins
  const fades = document.querySelectorAll(".fade");
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -10% 0px" });
    fades.forEach((el) => io.observe(el));
  } else {
    fades.forEach((el) => el.classList.add("in"));
  }
})();
