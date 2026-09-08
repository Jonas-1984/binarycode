/* =============================================================
   Nur mobile.html: "Mehr lesen"/"Weniger anzeigen"-Toggle im
   about.txt-Panel. Übersetzung übernimmt main.js (Modul 15) ganz
   normal über [data-en], da die Labels immer im DOM stehen (nur
   per CSS ein-/ausgeblendet) und nie entfernt werden.
   ============================================================= */
(function () {
  "use strict";

  var btn = document.getElementById("aboutToggle");
  var more = document.getElementById("aboutMore");
  if (!btn || !more) return;

  btn.addEventListener("click", function () {
    var open = !btn.classList.contains("is-open");
    btn.classList.toggle("is-open", open);
    more.hidden = !open;
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
})();

/* ---------------------------------------------------------
   Social-Icons im Footer: klein & mittig, wachsen erst zu
   Touch-tauglicher Größe, sobald der Nutzer bis dorthin
   gescrollt hat (Klasse .is-visible per IntersectionObserver).
   --------------------------------------------------------- */
(function () {
  "use strict";

  var icons = document.getElementById("SocailIcons");
  if (!icons) return;

  if (!("IntersectionObserver" in window)) {
    icons.classList.add("is-visible");
    return;
  }

  new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        icons.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.4 }
  ).observe(icons);
})();

/* ---------------------------------------------------------
   Tool-Dock: per Finger nach rechts/links ziehen scrubbt die
   Endlos-Animation direkt (Web Animations API currentTime) statt
   sich auf die Maus-Hover-Logik von main.js zu verlassen, die für
   Touch nicht zuverlässig ist. Die Icons sind in mobile.html
   <span> statt <a> (kein href) und damit nicht klickbar/verlinkt;
   sie wachsen bei Berührung kurz (siehe .dock__item:active in
   styles-mobile.css).
   --------------------------------------------------------- */
(function () {
  "use strict";

  var dock = document.getElementById("dock");
  var track = document.getElementById("dockTrack");
  if (!dock || !track) return;

  var anim = track.getAnimations ? track.getAnimations()[0] : null;
  if (!anim) return; /* z.B. bei prefers-reduced-motion: keine Animation zum Scrubben */

  var dragging = false;
  var lastX = 0;
  var wasRunning = true;
  var DRAG_SCALE = 4; /* Fingerbewegung fühlt sich direkter an als 1:1 */

  dock.addEventListener("touchstart", function (e) {
    dragging = true;
    lastX = e.touches[0].clientX;
    wasRunning = anim.playState === "running";
    anim.pause();
  }, { passive: true });

  dock.addEventListener("touchmove", function (e) {
    if (!dragging) return;
    var x = e.touches[0].clientX;
    var dx = x - lastX;
    lastX = x;
    var current = anim.currentTime || 0;
    anim.currentTime = Math.max(0, current - dx * DRAG_SCALE);
  }, { passive: true });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    if (wasRunning) anim.play();
  }
  dock.addEventListener("touchend", endDrag, { passive: true });
  dock.addEventListener("touchcancel", endDrag, { passive: true });
})();
