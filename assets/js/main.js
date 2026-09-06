/* =============================================================
   main.js  ·  Effekte für die IT-Dark-Webseite
   - Binär-Regen im Hintergrund (Canvas)
   - Tipp-Animation im Hero-Terminal
   - Scroll-Reveal, Scroll-Fortschritt, aktive Navi
   - Mobile-Menü, "Nach oben"-Button, dekorativer Binärcode
   ============================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1) Binär-Regen (Matrix-Stil, in Cyan)
     --------------------------------------------------------- */
  (function matrixRain() {
    var canvas = document.getElementById("matrix");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var fontSize = 14;
    var columns, drops;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = [];
      for (var i = 0; i < columns; i++) {
        drops[i] = Math.random() * -50;
      }
    }
    resize();
    window.addEventListener("resize", resize);

    var last = 0;
    function draw(now) {
      requestAnimationFrame(draw);
      if (now - last < 55) return; // ~18 fps, ruhiger + sparsam
      last = now;

      ctx.fillStyle = "rgba(7, 10, 13, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var char = Math.random() > 0.5 ? "1" : "0";
        var x = i * fontSize;
        var y = drops[i] * fontSize;

        // Kopf der Spalte etwas heller
        ctx.fillStyle = Math.random() > 0.975 ? "#a8f0fb" : "#22d3ee";
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    requestAnimationFrame(draw);
  })();

  /* ---------------------------------------------------------
     2) Dekorativen Binärcode in Streifen/Flächen füllen
     --------------------------------------------------------- */
  (function fillBinaryDecor() {
    function randomBits(len) {
      var s = "";
      for (var i = 0; i < len; i++) {
        s += Math.random() > 0.5 ? "1" : "0";
        if ((i + 1) % 8 === 0) s += " ";
      }
      return s;
    }
    var strip = document.querySelector(".binary-strip");
    if (strip) strip.textContent = randomBits(2200);

    var foot = document.querySelector(".footer__binary");
    if (foot) foot.textContent = randomBits(240);
  })();

  /* ---------------------------------------------------------
     3) Hero-Terminal: Befehl tippen, dann Ausgabe einblenden
     --------------------------------------------------------- */
  (function typeTerminal() {
    var cmdEl = document.querySelector("[data-type]");
    var outputs = Array.prototype.slice.call(document.querySelectorAll(".terminal__body .out[data-reveal]"));
    if (!cmdEl) return;

    var text = cmdEl.getAttribute("data-type");

    function revealOutputs() {
      outputs.forEach(function (el, i) {
        setTimeout(function () { el.classList.add("show"); }, i * 180);
      });
    }

    if (reduceMotion) {
      cmdEl.textContent = text;
      outputs.forEach(function (el) { el.classList.add("show"); });
      return;
    }

    var idx = 0;
    (function tick() {
      cmdEl.textContent = text.slice(0, idx);
      idx++;
      if (idx <= text.length) {
        setTimeout(tick, 55 + Math.random() * 40);
      } else {
        setTimeout(revealOutputs, 300);
      }
    })();
  })();

  /* ---------------------------------------------------------
     4) Scroll-Reveal per IntersectionObserver
     --------------------------------------------------------- */
  (function scrollReveal() {
    var items = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window) || reduceMotion) {
      items.forEach(function (el) { el.classList.add("revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  })();

  /* ---------------------------------------------------------
     5) Scroll-Fortschritt + "Nach oben"-Button
     --------------------------------------------------------- */
  (function scrollProgress() {
    var bar = document.getElementById("progressBar");
    var readout = document.getElementById("progressReadout");
    var toTop = document.getElementById("toTop");

    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct + "%";
      if (readout) readout.textContent = String(Math.round(pct)).padStart(2, "0") + "%";
      if (toTop) toTop.classList.toggle("show", h.scrollTop > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  })();

  /* ---------------------------------------------------------
     6) Aktiver Navigationslink je nach Sichtbereich
     --------------------------------------------------------- */
  (function activeNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__links a[href^="#"]'));
    var map = {};
    var sections = links.map(function (a) {
      var id = a.getAttribute("href").slice(1);
      map[id] = a;
      return document.getElementById(id);
    }).filter(Boolean);

    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-active"); });
          var active = map[entry.target.id];
          if (active) active.classList.add("is-active");
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { io.observe(s); });
  })();

  /* ---------------------------------------------------------
     7) Mobiles Menü
     --------------------------------------------------------- */
  (function mobileMenu() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  })();

  /* ---------------------------------------------------------
     8) Jahr im Footer
     --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
