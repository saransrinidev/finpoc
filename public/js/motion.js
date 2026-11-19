/*
  Motion layer: smooth transitions using Motion (motion.dev), the vanilla-JS
  build of Framer Motion. Loaded from js/vendor/motion.js.

  Rules this file follows:
  - Optional. If Motion fails to load, the app works exactly as before.
  - Skipped when the user prefers reduced motion.
  - Never leaves styles behind: after each animation the element goes back to
    its normal CSS, with a timer as a safety net so nothing can stay hidden.
  - Only runs on page or role changes, not on every in-page update, so ticking a
    checkbox or typing hours doesn't replay animations.
*/
(function () {
  "use strict";

  const M = window.Motion;
  if (!M || typeof M.animate !== "function") return;

  const { animate, stagger } = M;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const EASE = [0.2, 0, 0, 1];
  const SPRING = { type: "spring", stiffness: 420, damping: 32 };
  const CLEAR = ["opacity", "transform", "will-change"];

  // Tells the CSS to drop its own versions of the animations Motion now handles.
  document.documentElement.classList.add("motion-ready");

  const enabled = () => !reduce.matches;

  /*
    Run an animation on a list of elements, then hand them back to CSS.
    Motion writes its final values inline just as the animation ends, so the
    cleanup runs a moment later. Each element carries a run number, so an older
    animation can never strip styles from a newer one on the same element.
  */
  let runId = 0;
  function run(list, keyframes, options) {
    if (!list.length) return;
    const id = ++runId;
    list.forEach((el) => { el.__motionRun = id; });
    const release = () => list.forEach((el) => {
      if (el.__motionRun !== id) return;
      CLEAR.forEach((p) => el.style.removeProperty(p));
    });
    const releaseSoon = () => { release(); setTimeout(release, 60); };
    try {
      const controls = animate(list, keyframes, options);
      Promise.resolve(controls.finished || controls).then(releaseSoon, releaseSoon);
    } catch (e) {
      release();
    }
    setTimeout(release, 3000);   // safety net: nothing can stay hidden
  }

  /* ---------- Page enter: cards rise in one after another ---------- */

  function animateBars(view) {
    view.querySelectorAll(".fill, .progress-fill").forEach((el) => {
      const width = el.style.width;
      if (!width) return;
      const restore = () => { el.style.width = width; };
      el.style.width = "0%";
      try {
        const c = animate(el, { width: ["0%", width] }, { duration: 0.8, delay: 0.25, ease: EASE });
        Promise.resolve(c.finished || c).then(restore, restore);
      } catch (e) {
        restore();
      }
      setTimeout(restore, 3000);
    });
  }

  // "$1,234.50", "80.5%", "23.5h" and "7" count up. Anything else ("Draft") is left alone.
  function countUp(view) {
    view.querySelectorAll(".kpi-value").forEach((el) => {
      const original = el.textContent.trim();
      const m = original.match(/^(\$?)(\d[\d,]*(?:\.(\d+))?)(%|h)?$/);
      if (!m) return;
      const target = parseFloat(m[2].replace(/,/g, ""));
      if (!isFinite(target) || target === 0) return;
      const decimals = m[3] ? m[3].length : 0;
      const format = (n) => m[1] + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + (m[4] || "");
      const restore = () => { el.textContent = original; };
      try {
        const c = animate(0, target, { duration: 0.9, delay: 0.15, ease: EASE, onUpdate: (v) => { el.textContent = format(v); } });
        Promise.resolve(c.finished || c).then(restore, restore);
      } catch (e) {
        restore();
      }
      setTimeout(restore, 3000);
    });
  }

  function pageEnter() {
    const view = document.getElementById("view");
    if (!view || !enabled()) return;

    // Top-level blocks, with each KPI row split into its cards so they stagger too.
    const blocks = [];
    [...view.children].forEach((c) => (c.classList.contains("kpis") ? blocks.push(...c.children) : blocks.push(c)));
    const list = blocks.slice(0, 14);

    list.forEach((el) => { el.style.opacity = "0"; });
    run(list, { opacity: [0, 1], y: [14, 0] }, { duration: 0.45, ease: EASE, delay: stagger(0.05) });

    animateBars(view);
    countUp(view);
  }

  document.addEventListener("digian:pagechange", pageEnter);

  /* ---------- Toasts: spring in from the right ---------- */

  const toasts = document.getElementById("toasts");
  if (toasts) {
    new MutationObserver((records) => {
      if (!enabled()) return;
      records.forEach((r) => r.addedNodes.forEach((n) => {
        if (n.nodeType !== 1) return;
        n.style.opacity = "0";
        run([n], { opacity: [0, 1], x: [40, 0], scale: [0.96, 1] }, SPRING);
      }));
    }).observe(toasts, { childList: true });
  }

  /* ---------- Modal: backdrop fades, dialog springs up ---------- */

  const modal = document.getElementById("modal");
  if (modal) {
    new MutationObserver(() => {
      const dialog = modal.querySelector(".modal");
      if (modal.hidden || !dialog || !enabled()) return;
      modal.style.opacity = "0";
      dialog.style.opacity = "0";
      run([modal], { opacity: [0, 1] }, { duration: 0.2, ease: "easeOut" });
      run([dialog], { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, SPRING);
    }).observe(modal, { childList: true });
  }

  /* ---------- Role menu: pops open from the avatar ---------- */

  const menu = document.getElementById("roleMenu");
  if (menu) {
    new MutationObserver(() => {
      if (menu.hidden || !enabled()) return;
      menu.style.transformOrigin = "top right";
      menu.style.opacity = "0";
      run([menu], { opacity: [0, 1], y: [-8, 0], scale: [0.97, 1] }, { type: "spring", stiffness: 520, damping: 36 });
    }).observe(menu, { attributes: true, attributeFilter: ["hidden"] });
  }
})();
