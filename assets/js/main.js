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
     8) Kontaktformular -> E-Mail-Programm mit vorausgefüllter Nachricht
     --------------------------------------------------------- */
  (function contactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var hint = document.getElementById("cformHint");
    var hintDefault = hint ? hint.textContent : "";
    var mail = "shojaei.de@gmail.com";

    var consent = form.elements.datenschutz;
    if (consent) {
      consent.addEventListener("change", function () {
        if (consent.checked) {
          var c = form.querySelector(".neo-toggle-container");
          if (c) c.classList.remove("is-required");
          if (hint && hint.classList.contains("is-bad")) {
            hint.classList.remove("is-bad");
            hint.textContent = hintDefault;
          }
        }
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var f = form.elements;

      /* Datenschutz-Zustimmung (Neo-Toggle) muss aktiv sein */
      if (f.datenschutz && !f.datenschutz.checked) {
        var cont = form.querySelector(".neo-toggle-container");
        if (cont) {
          cont.classList.add("is-required");
          cont.scrollIntoView({ block: "center", behavior: "smooth" });
        }
        if (hint) {
          hint.textContent = "Bitte der Datenschutzerklärung zustimmen.";
          hint.classList.remove("is-ok");
          hint.classList.add("is-bad");
        }
        return;
      }
      if (!form.reportValidity()) return;

      var f2 = form.elements;
      var keyEl = f2.access_key;
      var key = keyEl ? keyEl.value.trim() : "";
      var keySet = key && !/^DEIN_|ACCESS_KEY$/i.test(key) && key.length > 20;

      function say(msg, ok) {
        if (!hint) return;
        hint.textContent = msg;
        hint.classList.toggle("is-ok", !!ok);
        hint.classList.toggle("is-bad", ok === false);
      }

      /* --- Fallback: kein Web3Forms-Key gesetzt -> Mail-Programm öffnen --- */
      if (!keySet) {
        var betreff = "[binaryCode] " + (f2.betreff.value || "Nachricht von der Webseite");
        var body =
          "Name: " + f2.name.value + "\n" +
          "E-Mail: " + f2.email.value + "\n\n" +
          f2.nachricht.value + "\n";
        window.location.href =
          "mailto:" + mail +
          "?subject=" + encodeURIComponent(betreff) +
          "&body=" + encodeURIComponent(body);
        say("E-Mail-Programm wurde geöffnet. Falls nicht: " + mail, true);
        return;
      }

      /* --- Versand über Web3Forms --- */
      var btn = form.querySelector(".cform__send");
      var btnText = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = "sende …"; }
      say("Wird gesendet …");

      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().catch(function () { return { success: r.ok }; }); })
        .then(function (data) {
          if (data && data.success) {
            form.reset();
            var c = form.querySelector(".neo-toggle-container");
            if (c) c.classList.remove("is-required");
            say("Danke! Deine Nachricht ist angekommen – ich melde mich zeitnah.", true);
          } else {
            say("Senden hat nicht geklappt. Bitte direkt per E-Mail: " + mail, false);
          }
        })
        .catch(function () {
          say("Keine Verbindung. Bitte direkt per E-Mail: " + mail, false);
        })
        .then(function () {
          if (btn) { btn.disabled = false; btn.textContent = btnText; }
        });
    });
  })();

  /* ---------------------------------------------------------
     9) Werdegang · 3D-Coverflow-Karussell
        - Pfeiltasten / Tastatur / Wischen zum Blättern
        - im Leerlauf automatischer Wechsel alle 6 Sekunden
     --------------------------------------------------------- */
  (function werdegangCarousel() {
    var root = document.getElementById("werdegangCarousel");
    if (!root || reduceMotion) return;

    var cards = Array.prototype.slice.call(root.querySelectorAll(".cf__card"));
    var track = root.querySelector(".cf__track");
    var counter = document.getElementById("cfCounter");
    var bar = document.getElementById("cfBar");
    var navs = root.querySelectorAll(".cf__nav");
    var n = cards.length;
    if (n < 2) return;

    var active = 0;
    var AUTO_MS = 6000;
    var autoTimer = null;
    var idleTimer = null;
    var STEP = 116;

    root.classList.add("cf--ready");

    function layout() {
      for (var i = 0; i < n; i++) {
        var o = i - active;
        if (o > n / 2) o -= n;
        if (o < -n / 2) o += n;
        var abs = Math.abs(o);
        var card = cards[i];

        if (abs > 2) {
          card.style.opacity = "0";
          card.style.visibility = "hidden";
          card.style.pointerEvents = "none";
          card.classList.remove("is-current");
          card.setAttribute("aria-hidden", "true");
          continue;
        }
        card.style.visibility = "visible";
        card.style.pointerEvents = abs === 0 ? "auto" : "none";
        card.style.transform =
          "translate(-50%, -50%) " +
          "translateY(" + (o * STEP) + "px) " +
          "translateZ(" + (-abs * 140) + "px) " +
          "rotateX(" + (o * -7) + "deg) " +
          "scale(" + (1 - abs * 0.13) + ")";
        card.style.opacity = abs === 0 ? "1" : abs === 1 ? "0.55" : "0.2";
        card.style.filter = abs === 0 ? "none" : "blur(" + (abs * 2.4) + "px)";
        card.style.zIndex = abs === 0 ? "30" : String(10 - abs);
        card.classList.toggle("is-current", abs === 0);
        card.setAttribute("aria-hidden", abs === 0 ? "false" : "true");
      }
      if (counter) counter.textContent = (active + 1) + " / " + n;
    }

    function go(dir) {
      active = (active + dir + n) % n;
      layout();
    }
    function goTo(i) {
      active = ((i % n) + n) % n;
      layout();
    }

    /* --- Autoplay + Leerlauf-Steuerung --- */
    function restartBar() {
      if (!bar) return;
      bar.classList.remove("run");
      bar.style.width = "0%";
      /* reflow, dann Animation starten */
      void bar.offsetWidth;
      bar.classList.add("run");
      bar.style.width = "100%";
    }
    function stopBar() {
      if (!bar) return;
      bar.classList.remove("run");
      var w = getComputedStyle(bar).width;
      bar.style.width = w;
    }
    function startAuto() {
      stopAuto();
      restartBar();
      autoTimer = setInterval(function () {
        go(1);
        restartBar();
      }, AUTO_MS);
    }
    function stopAuto() {
      if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
      stopBar();
    }
    function nudgeIdle() {
      /* Nutzer war aktiv -> Autoplay pausieren, nach 6 s Leerlauf fortsetzen */
      stopAuto();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(startAuto, AUTO_MS);
    }

    /* --- Interaktionen --- */
    Array.prototype.forEach.call(navs, function (b) {
      b.addEventListener("click", function () {
        go(parseInt(b.getAttribute("data-dir"), 10) || 1);
        nudgeIdle();
      });
    });

    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") { go(-1); nudgeIdle(); e.preventDefault(); }
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") { go(1); nudgeIdle(); e.preventDefault(); }
    });
    root.setAttribute("tabindex", "0");

    var wheelLock = false;
    root.querySelector(".cf__stage").addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) < 8 || wheelLock) return;
      e.preventDefault();
      wheelLock = true;
      go(e.deltaY > 0 ? 1 : -1);
      nudgeIdle();
      setTimeout(function () { wheelLock = false; }, 420);
    }, { passive: false });

    var ty = null;
    root.addEventListener("touchstart", function (e) { ty = e.touches[0].clientY; }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (ty == null) return;
      var dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dy) > 40) { go(dy < 0 ? 1 : -1); nudgeIdle(); }
      ty = null;
    }, { passive: true });

    cards.forEach(function (card, i) {
      card.addEventListener("click", function () {
        if (i !== active) { goTo(i); nudgeIdle(); }
      });
    });

    root.addEventListener("pointerenter", stopAuto);
    root.addEventListener("pointerleave", nudgeIdle);
    root.addEventListener("focusin", stopAuto);
    root.addEventListener("focusout", nudgeIdle);

    /* Autoplay nur laufen lassen, wenn die Sektion sichtbar ist */
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) startAuto();
          else stopAuto();
        });
      }, { threshold: 0.35 }).observe(root);
    } else {
      startAuto();
    }

    layout();
  })();

  /* ---------------------------------------------------------
     10) Marken-Logo: alle 6 s in Binärzahlen zerfallen und
         wieder zum Logo + "binaryCode" zusammensetzen
     --------------------------------------------------------- */
  (function brandBinaryFx() {
    var host = document.getElementById("brandBits");
    if (!host || reduceMotion) return;

    var COUNT = 30;
    var bits = [];

    function rnd(a, b) { return a + Math.random() * (b - a); }

    for (var i = 0; i < COUNT; i++) {
      var b = document.createElement("i");
      b.textContent = Math.random() < 0.5 ? "0" : "1";
      /* Startposition quer über Logo + Schriftzug */
      b.style.left = rnd(4, 96).toFixed(1) + "%";
      b.style.top = rnd(10, 82).toFixed(1) + "%";
      /* Streu-Vektor nach außen */
      b.style.setProperty("--tx", rnd(-52, 52).toFixed(0) + "px");
      b.style.setProperty("--ty", rnd(-17, 17).toFixed(0) + "px");
      /* leichte Staffelung, Periode bleibt 6 s */
      b.style.animationDelay = (-rnd(0, 0.22)).toFixed(2) + "s";
      b.style.fontSize = rnd(9, 13).toFixed(0) + "px";
      host.appendChild(b);
      bits.push(b);
    }

    /* Ziffern gelegentlich neu würfeln, während sie zerstäubt sind */
    setInterval(function () {
      for (var k = 0; k < bits.length; k++) {
        if (Math.random() < 0.5) bits[k].textContent = Math.random() < 0.5 ? "0" : "1";
      }
    }, 900);
  })();

  /* ---------------------------------------------------------
     11) Zahlensystem-Umrechner  BIN <-> DEC <-> HEX
     --------------------------------------------------------- */
  (function numberConverter() {
    var bin = document.getElementById("convBin");
    var dec = document.getElementById("convDec");
    var hex = document.getElementById("convHex");
    var hint = document.getElementById("convHint");
    if (!bin || !dec || !hex) return;

    var DEFAULT_HINT = hint ? hint.innerHTML : "";
    var fields = [bin, dec, hex];

    function setHint(msg, bad) {
      if (!hint) return;
      if (msg) hint.textContent = msg;
      else hint.innerHTML = DEFAULT_HINT;
      hint.classList.toggle("is-bad", !!bad);
    }

    function update(src, radix, re) {
      var raw = src.value.trim();
      src.classList.remove("is-bad");

      if (raw === "") {
        fields.forEach(function (f) { if (f !== src) { f.value = ""; f.classList.remove("is-bad"); } });
        setHint("");
        return;
      }
      if (!re.test(raw)) {
        src.classList.add("is-bad");
        fields.forEach(function (f) { if (f !== src) f.value = ""; });
        setHint("Ungültige Eingabe für dieses Zahlensystem.", true);
        return;
      }

      var v;
      try {
        v = radix === 2 ? BigInt("0b" + raw)
          : radix === 16 ? BigInt("0x" + raw)
          : BigInt(raw);
      } catch (e) {
        src.classList.add("is-bad");
        setHint("Zahl zu groß oder ungültig.", true);
        return;
      }

      if (src !== bin) bin.value = v.toString(2);
      if (src !== dec) dec.value = v.toString(10);
      if (src !== hex) hex.value = v.toString(16).toUpperCase();
      setHint("");
    }

    bin.addEventListener("input", function () { update(bin, 2, /^[01]+$/); });
    dec.addEventListener("input", function () { update(dec, 10, /^[0-9]+$/); });
    hex.addEventListener("input", function () { update(hex, 16, /^[0-9a-fA-F]+$/); });
  })();

  /* ---------------------------------------------------------
     12) Tool-Dock: Endlos-Lauf; bei Hover sanft ausbremsen
     --------------------------------------------------------- */
  (function toolDock() {
    var dock = document.getElementById("dock");
    var track = document.getElementById("dockTrack");
    if (!dock || !track) return;

    track.insertAdjacentHTML("beforeend", track.innerHTML); /* zweite Kopie für nahtlose Schleife */
    if (reduceMotion) return;
    dock.classList.add("dock--ready");

    /* laufende CSS-Animation greifen und die Geschwindigkeit weich regeln */
    var anim = track.getAnimations ? track.getAnimations()[0] : null;
    if (!anim || typeof anim.updatePlaybackRate !== "function") {
      /* Fallback: hartes Pausieren */
      dock.addEventListener("pointerenter", function () { track.style.animationPlayState = "paused"; });
      dock.addEventListener("pointerleave", function () { track.style.animationPlayState = "running"; });
      return;
    }

    var current = 1;
    var target = 1;
    var hovering = false;
    var raf = null;

    function tick() {
      current += (target - current) * 0.09;          /* exponentielle Annäherung -> dynamisch */
      if (Math.abs(target - current) < 0.004) current = target;
      anim.updatePlaybackRate(current);
      if (current !== target || hovering) raf = requestAnimationFrame(tick);
      else raf = null;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }
    function setTarget(v) { target = v; kick(); }

    /* Maus in der Leiste: Position steuert Richtung + Tempo
       Mitte = fast still, rechts = vorwärts (nach links), links = rückwärts */
    function fromPointer(e) {
      var r = dock.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;          /* 0..1 */
      var t = (x - 0.5) * 2;                            /* -1..1 */
      if (Math.abs(t) < 0.14) t = 0;                    /* Totzone in der Mitte */
      var sign = t < 0 ? -1 : 1;
      var mag = (Math.abs(t) - 0.14) / 0.86;            /* 0..1 nach Totzone */
      target = sign * mag * mag * 2.6;                  /* sanfter Anlauf, max ~2.6x */
      kick();
    }

    dock.addEventListener("pointerenter", function () { hovering = true; kick(); });
    dock.addEventListener("pointermove", function (e) { if (hovering) fromPointer(e); });
    dock.addEventListener("pointerleave", function () { hovering = false; setTarget(1); });
    dock.addEventListener("focusin", function () { hovering = true; setTarget(0.1); });
    dock.addEventListener("focusout", function () { hovering = false; setTarget(1); });
  })();

  /* ---------------------------------------------------------
     13) Datenschutz-/Consent-Hinweis
     --------------------------------------------------------- */
  (function consentNotice() {
    var box = document.getElementById("consent");
    var openBtn = document.getElementById("cookieSettings");
    if (!box && !openBtn) return;

    var KEY = "bc_consent";
    function store(val) { try { localStorage.setItem(KEY, val); } catch (e) {} }
    function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }

    function hide() { if (box) box.hidden = true; }
    function show() { if (box) box.hidden = false; }

    if (box && !read()) show();

    var acc = document.getElementById("consentAccept");
    var dec = document.getElementById("consentDecline");
    if (acc) acc.addEventListener("click", function () { store("accepted"); hide(); });
    if (dec) dec.addEventListener("click", function () { store("essential"); hide(); });
    if (openBtn) openBtn.addEventListener("click", function (e) { e.preventDefault(); show(); });
  })();

  /* ---------------------------------------------------------
     14) Jahr im Footer
     --------------------------------------------------------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
