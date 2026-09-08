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

  /* Sprach-Status: von den Modulen fuer dynamische Texte genutzt,
     vom Sprachumschalter (Modul 15) gesetzt. */
  var i18n = window.i18n = {
    lang: "de",
    t: function (de, en) { return this.lang === "en" ? en : de; },
    onChange: []   /* Callbacks: fn(lang) – z. B. Rechner neu rendern */
  };

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

    var glyphFont = fontSize + 'px "IBM Plex Mono", ui-monospace, Consolas, monospace';

    var last = 0;
    function draw(now) {
      requestAnimationFrame(draw);
      if (now - last < 55) return; // ~18 fps, ruhiger + sparsam
      last = now;

      ctx.fillStyle = "rgba(7, 10, 13, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = glyphFont;
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

    // Canvas-Text nutzt Webfonts erst, wenn sie geladen sind – sonst
    // faellt er still auf Consolas zurueck (dessen 0 einen Punkt hat).
    function startRain() { requestAnimationFrame(draw); }
    if (document.fonts && document.fonts.load) {
      document.fonts.load('400 ' + fontSize + 'px "IBM Plex Mono"')
        .then(startRain, startRain);
    } else {
      startRain();
    }
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

    /* Bei Sprachwechsel hat der Umschalter den Hinweis-Text im DOM schon
       ersetzt – nur den gecachten Standardwert nachziehen. */
    i18n.onChange.push(function () {
      if (hint) hintDefault = hint.textContent;
    });

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
          hint.textContent = i18n.t("Bitte der Datenschutzerklärung zustimmen.", "Please accept the privacy policy.");
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
        var betreff = "[binaryCodes] " + (f2.betreff.value || i18n.t("Nachricht von der Webseite", "Message from the website"));
        var body =
          "Name: " + f2.name.value + "\n" +
          "E-Mail: " + f2.email.value + "\n\n" +
          f2.nachricht.value + "\n";
        window.location.href =
          "mailto:" + mail +
          "?subject=" + encodeURIComponent(betreff) +
          "&body=" + encodeURIComponent(body);
        say(i18n.t("E-Mail-Programm wurde geöffnet. Falls nicht: ", "Your email app was opened. If not: ") + mail, true);
        return;
      }

      /* --- Versand über Web3Forms --- */
      var btn = form.querySelector(".cform__send");
      var btnText = btn ? btn.textContent : "";
      if (btn) { btn.disabled = true; btn.textContent = i18n.t("sende …", "sending …"); }
      say(i18n.t("Wird gesendet …", "Sending …"));

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
            say(i18n.t("Danke! Deine Nachricht ist angekommen – ich melde mich zeitnah.",
                       "Thanks! Your message arrived – I'll get back to you soon."), true);
          } else {
            say(i18n.t("Senden hat nicht geklappt. Bitte direkt per E-Mail: ",
                       "Sending failed. Please email directly: ") + mail, false);
          }
        })
        .catch(function () {
          say(i18n.t("Keine Verbindung. Bitte direkt per E-Mail: ",
                     "No connection. Please email directly: ") + mail, false);
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
  function initCoverflow(rootId) {
    var root = document.getElementById(rootId);
    if (!root || reduceMotion) return;

    var cards = Array.prototype.slice.call(root.querySelectorAll(".cf__card"));
    var track = root.querySelector(".cf__track");
    var counter = root.querySelector(".cf__counter");
    var bar = root.querySelector(".cf__bar i");
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
  }
  initCoverflow("werdegangCarousel");
  initCoverflow("skillsCarousel");

  /* ---------------------------------------------------------
     10) Marke: jedes Zeichen + Logo drehen sich im Platz und
         klappen im 6-Sekunden-Takt zur Binärziffer um (und zurück)
     --------------------------------------------------------- */
  (function brandFlip() {
    var textEl = document.querySelector(".nav__brand-text");
    var logo = document.querySelector(".brand__solid .nav__logo");
    if (!textEl || !logo || reduceMotion) return;

    function bit() { return Math.random() < 0.5 ? "0" : "1"; }
    function makeCh(faceNode, i, accent, logoCh) {
      var s = document.createElement("span");
      s.className = "ch" + (accent ? " ch--accent" : "") + (logoCh ? " ch--logo" : "");
      s.style.setProperty("--i", i);
      var f = document.createElement("span");
      f.className = "ch__face";
      f.appendChild(faceNode);
      var b = document.createElement("span");
      b.className = "ch__bit";
      b.textContent = logoCh ? "01" : bit();
      s.appendChild(f);
      s.appendChild(b);
      return s;
    }

    /* Logo -> ch--logo (i = 0) */
    var logoCh = makeCh(logo.cloneNode(true), 0, false, true);
    logo.parentNode.replaceChild(logoCh, logo);

    /* Schriftzug in einzelne Zeichen zerlegen; "Code" behält Akzentfarbe */
    var full = (textEl.getAttribute("data-text") || textEl.textContent || "binaryCodes");
    var accentFrom = full.toLowerCase().indexOf("code");
    textEl.textContent = "";
    var textBits = [];
    for (var k = 0; k < full.length; k++) {
      var isAccent = accentFrom >= 0 && k >= accentFrom;
      var ch = makeCh(document.createTextNode(full[k]), k + 1, isAccent, false);
      textEl.appendChild(ch);
      textBits.push(ch.querySelector(".ch__bit"));
    }

    /* Ziffern zwischendurch neu würfeln */
    setInterval(function () {
      for (var j = 0; j < textBits.length; j++) {
        if (Math.random() < 0.55) textBits[j].textContent = bit();
      }
    }, 1600);
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

    i18n.onChange.push(function () {
      if (hint) DEFAULT_HINT = hint.innerHTML;
    });

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
        setHint(i18n.t("Ungültige Eingabe für dieses Zahlensystem.", "Invalid input for this number system."), true);
        return;
      }

      var v;
      try {
        v = radix === 2 ? BigInt("0b" + raw)
          : radix === 16 ? BigInt("0x" + raw)
          : BigInt(raw);
      } catch (e) {
        src.classList.add("is-bad");
        setHint(i18n.t("Zahl zu groß oder ungültig.", "Number too large or invalid."), true);
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
     11b) IPv4-Subnetzrechner
     --------------------------------------------------------- */
  (function ipCalc() {
    var addrEl = document.getElementById("ipcAddr");
    var maskEl = document.getElementById("ipcMask");
    var out = document.getElementById("ipcOut");
    var hint = document.getElementById("ipcHint");
    if (!addrEl || !maskEl || !out) return;

    var HINT_DEFAULT = hint ? hint.textContent : "";

    i18n.onChange.push(function () {
      if (hint) HINT_DEFAULT = hint.textContent;
      calc();            /* Ausgabe in neuer Sprache neu aufbauen */
    });

    function u32(n) { return n >>> 0; }
    function toDotted(n) {
      return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join(".");
    }
    function toBin(n) {
      var s = "";
      for (var i = 3; i >= 0; i--) {
        var o = (n >>> (i * 8)) & 255;
        s += ("00000000" + o.toString(2)).slice(-8);
        if (i) s += ".";
      }
      return s;
    }
    function parseOctets(str) {
      var p = str.trim().split(".");
      if (p.length !== 4) return null;
      var n = 0;
      for (var i = 0; i < 4; i++) {
        if (!/^\d{1,3}$/.test(p[i])) return null;
        var o = parseInt(p[i], 10);
        if (o > 255) return null;
        n = (n << 8) | o;
      }
      return u32(n);
    }
    function maskToPrefix(m) {
      /* Maske muss zusammenhängend sein (1en dann 0en) */
      var inv = u32(~m);
      if ((inv & (inv + 1)) !== 0) return -1;
      var p = 0, x = m;
      while (x & 0x80000000) { p++; x = u32(x << 1); }
      return p;
    }
    function prefixToMask(p) {
      return p === 0 ? 0 : u32(0xffffffff << (32 - p));
    }

    function ipClass(firstOctet) {
      if (firstOctet === 0) return i18n.t("„this network“ (0.0.0.0/8)", '"this network" (0.0.0.0/8)');
      if (firstOctet === 127) return i18n.t("A – reserviert für Loopback", "A – reserved for loopback");
      if (firstOctet <= 127) return "A";
      if (firstOctet <= 191) return "B";
      if (firstOctet <= 223) return "C";
      if (firstOctet <= 239) return i18n.t("D – Multicast", "D – multicast");
      return i18n.t("E – reserviert / experimentell", "E – reserved / experimental");
    }
    function ipType(ip) {
      function inNet(net, pfx) {
        var mm = prefixToMask(pfx);
        return u32(ip & mm) === u32(parseOctets(net) & mm);
      }
      if (inNet("10.0.0.0", 8)) return i18n.t("privat (RFC 1918)", "private (RFC 1918)");
      if (inNet("172.16.0.0", 12)) return i18n.t("privat (RFC 1918)", "private (RFC 1918)");
      if (inNet("192.168.0.0", 16)) return i18n.t("privat (RFC 1918)", "private (RFC 1918)");
      if (inNet("127.0.0.0", 8)) return i18n.t("Loopback (RFC 1122)", "loopback (RFC 1122)");
      if (inNet("169.254.0.0", 16)) return "Link-Local / APIPA (RFC 3927)";
      if (inNet("100.64.0.0", 10)) return "Carrier-Grade NAT (RFC 6598)";
      if (inNet("192.0.2.0", 24) || inNet("198.51.100.0", 24) || inNet("203.0.113.0", 24)) return i18n.t("Dokumentation (RFC 5737)", "documentation (RFC 5737)");
      if (inNet("224.0.0.0", 4)) return i18n.t("Multicast (RFC 5771)", "multicast (RFC 5771)");
      if (inNet("240.0.0.0", 4)) return i18n.t("reserviert (RFC 1112)", "reserved (RFC 1112)");
      if (inNet("0.0.0.0", 8)) return i18n.t("„this network“", '"this network"');
      return i18n.t("öffentlich (global routbar)", "public (globally routable)");
    }

    function row(k, v) {
      var pad = (k + " ".repeat(22)).slice(0, 22);
      return '<span class="k">' + pad + "</span>: <b>" + v + "</b>\n";
    }

    function setHint(msg, bad) {
      if (!hint) return;
      hint.textContent = msg || HINT_DEFAULT;
      hint.classList.toggle("is-bad", !!bad);
    }

    function calc() {
      var rawAddr = addrEl.value.trim();
      var rawMask = maskEl.value.trim();
      addrEl.classList.remove("is-bad");
      maskEl.classList.remove("is-bad");

      /* CIDR direkt im Adressfeld erlaubt: 192.168.1.10/24 */
      var slash = rawAddr.indexOf("/");
      if (slash !== -1) {
        if (!rawMask) rawMask = rawAddr.slice(slash);
        rawAddr = rawAddr.slice(0, slash);
      }

      if (!rawAddr && !rawMask) { out.innerHTML = ""; setHint(""); return; }

      var ip = parseOctets(rawAddr);
      if (ip === null) {
        addrEl.classList.add("is-bad");
        out.innerHTML = "";
        setHint(i18n.t("Ungültige IPv4-Adresse (z. B. 192.168.10.42).", "Invalid IPv4 address (e.g. 192.168.10.42)."), true);
        return;
      }

      var prefix;
      var m = rawMask.replace(/^\//, "").trim();
      if (m === "") {
        prefix = 24; /* Standardannahme */
      } else if (/^\d{1,2}$/.test(m)) {
        prefix = parseInt(m, 10);
        if (prefix > 32) { maskEl.classList.add("is-bad"); out.innerHTML = ""; setHint(i18n.t("CIDR-Präfix muss 0–32 sein.", "CIDR prefix must be 0–32."), true); return; }
      } else {
        var mi = parseOctets(m);
        if (mi === null) { maskEl.classList.add("is-bad"); out.innerHTML = ""; setHint(i18n.t("Ungültige Subnetzmaske oder CIDR.", "Invalid subnet mask or CIDR."), true); return; }
        prefix = maskToPrefix(mi);
        if (prefix < 0) { maskEl.classList.add("is-bad"); out.innerHTML = ""; setHint(i18n.t("Maske ist nicht zusammenhängend (z. B. 255.255.255.0).", "Mask is not contiguous (e.g. 255.255.255.0)."), true); return; }
      }

      var mask = prefixToMask(prefix);
      var wild = u32(~mask);
      var network = u32(ip & mask);
      var broadcast = u32(network | wild);
      var hostBits = 32 - prefix;
      var total = Math.pow(2, hostBits);
      var usable, first, last;
      if (prefix >= 31) {
        usable = prefix === 32 ? 1 : 2;
        first = network;
        last = broadcast;
      } else {
        usable = total - 2;
        first = u32(network + 1);
        last = u32(broadcast - 1);
      }
      var firstOctet = (ip >>> 24) & 255;

      var loc = i18n.lang === "en" ? "en-US" : "de-DE";
      var html = "";
      html += row(i18n.t("Adresse", "Address"), toDotted(ip));
      html += row(i18n.t("CIDR-Notation", "CIDR notation"), toDotted(network) + "/" + prefix);
      html += row(i18n.t("Subnetzmaske", "Subnet mask"), toDotted(mask) + "  (/" + prefix + ")");
      html += row(i18n.t("Wildcard-Maske", "Wildcard mask"), toDotted(wild));
      html += row(i18n.t("Netzadresse", "Network address"), toDotted(network));
      html += row(i18n.t("Broadcast-Adresse", "Broadcast address"), toDotted(broadcast));
      html += row(i18n.t("Erste Host-Adresse", "First host address"), toDotted(first));
      html += row(i18n.t("Letzte Host-Adresse", "Last host address"), toDotted(last));
      html += row(i18n.t("Gateway (üblich)", "Gateway (typical)"), toDotted(first) + i18n.t("  (Konvention)", "  (convention)"));
      html += row(i18n.t("Adressen gesamt", "Total addresses"), total.toLocaleString(loc));
      html += row(i18n.t("Nutzbare Hosts", "Usable hosts"), usable.toLocaleString(loc));
      html += row(i18n.t("IPv4-Klasse", "IPv4 class"), ipClass(firstOctet));
      html += row(i18n.t("Adresstyp", "Address type"), ipType(ip));
      html += "\n";
      html += row(i18n.t("Adresse  (binär)", "Address  (binary)"), toBin(ip));
      html += row(i18n.t("Maske    (binär)", "Mask     (binary)"), toBin(mask));
      html += row(i18n.t("Netz     (binär)", "Network  (binary)"), toBin(network));

      out.innerHTML = html;
      setHint("");
    }

    addrEl.addEventListener("input", calc);
    maskEl.addEventListener("input", calc);
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

  /* ---------------------------------------------------------
     15) Sprachumschalter DE / EN
         - tauscht Texte/Attribute aller [data-en*]-Elemente
         - Auswahl in localStorage (bc_lang)
         - benachrichtigt i18n.onChange (dynamische Rechner-Texte)
     --------------------------------------------------------- */
  (function langToggle() {
    var btn = document.getElementById("langToggle");
    var KEY = "bc_lang";
    var SEL = "[data-en],[data-en-al],[data-en-tt],[data-en-ph],[data-en-alt]";
    var nodes = Array.prototype.slice.call(document.querySelectorAll(SEL));

    /* Deutsche Originale einmalig sichern (aktueller DOM-Zustand = Deutsch) */
    nodes.forEach(function (el) {
      el.__de = {
        html: el.hasAttribute("data-en") ? el.innerHTML : null,
        al: el.getAttribute("aria-label"),
        tt: el.getAttribute("title"),
        ph: el.getAttribute("placeholder"),
        alt: el.getAttribute("alt")
      };
    });

    function swap(el, en) {
      if (el.hasAttribute("data-en")) el.innerHTML = en ? el.getAttribute("data-en") : el.__de.html;
      if (el.hasAttribute("data-en-al")) el.setAttribute("aria-label", en ? el.getAttribute("data-en-al") : el.__de.al);
      if (el.hasAttribute("data-en-tt")) el.setAttribute("title", en ? el.getAttribute("data-en-tt") : el.__de.tt);
      if (el.hasAttribute("data-en-ph")) el.setAttribute("placeholder", en ? el.getAttribute("data-en-ph") : el.__de.ph);
      if (el.hasAttribute("data-en-alt")) el.setAttribute("alt", en ? el.getAttribute("data-en-alt") : el.__de.alt);
    }

    function apply(lang, save) {
      var en = lang === "en";
      i18n.lang = en ? "en" : "de";
      document.documentElement.lang = i18n.lang;
      nodes.forEach(function (el) { swap(el, en); });
      if (btn) {
        btn.setAttribute("aria-checked", en ? "true" : "false");
        var knob = btn.querySelector(".langtog__knob");
        if (knob) knob.textContent = en ? "EN" : "DE";
      }
      var y = document.getElementById("year");
      if (y) y.textContent = new Date().getFullYear();
      i18n.onChange.forEach(function (fn) { try { fn(i18n.lang); } catch (e) {} });
      if (save) { try { localStorage.setItem(KEY, i18n.lang); } catch (e) {} }
    }

    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === "en") apply("en", false);

    if (btn) {
      btn.addEventListener("click", function () {
        apply(i18n.lang === "en" ? "de" : "en", true);
      });
    }
  })();

  /* ---------------------------------------------------------
     16) Seiten-Zoom-Regler (neben dem Hero-Terminal)
         - 5 Stufen ~90–150 %, skaliert die ganze Seite (CSS zoom)
         - Auswahl in localStorage (bc_zoom)
     --------------------------------------------------------- */
  (function pageZoom() {
    var ctl = document.getElementById("zoomCtl");
    if (!ctl) return;
    var fill = ctl.querySelector(".zoomctl__gauge i");
    var val = document.getElementById("zoomVal");
    var up = ctl.querySelector('[data-zoom="up"]');
    var down = ctl.querySelector('[data-zoom="down"]');
    var LEVELS = [0.9, 1, 1.15, 1.3, 1.5];
    var KEY = "bc_zoom";
    var idx = 1;

    try {
      var s = localStorage.getItem(KEY);
      if (s !== null) { var k = LEVELS.indexOf(parseFloat(s)); if (k >= 0) idx = k; }
    } catch (e) {}

    function apply(save) {
      var z = LEVELS[idx];
      try { document.documentElement.style.zoom = z === 1 ? "" : String(z); } catch (e) {}
      if (fill) fill.style.setProperty("--zg", ((idx + 1) / LEVELS.length * 100).toFixed(0) + "%");
      if (val) val.textContent = Math.round(z * 100) + "%";
      if (up) up.disabled = idx >= LEVELS.length - 1;
      if (down) down.disabled = idx <= 0;
      if (save) { try { localStorage.setItem(KEY, String(z)); } catch (e) {} }
    }

    ctl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-zoom]");
      if (!b) return;
      idx += b.getAttribute("data-zoom") === "up" ? 1 : -1;
      idx = Math.max(0, Math.min(LEVELS.length - 1, idx));
      apply(true);
    });

    apply(false);
  })();
})();
