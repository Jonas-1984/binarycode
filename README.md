# binaryCodes

Persönliche One-Page-Website von **Jonas Shojaei – IT-Spezialist & IT-Systemadministrator** (Hamburg).
Dark-/IT-Theme, durchgängig mit Binärcode (0/1) gestaltet. Reines HTML/CSS/JavaScript –
**kein Build, kein Framework, keine externen Laufzeit-Abhängigkeiten**.
Zweisprachig **DE / EN** (Umschalter im Header) und mit **Seiten-Zoom-Regler** am Hero-Terminal.

Domain (gekauft, inkl. Webspace): `https://binarycodes.de/` — Auslieferungsweg noch offen
(eigener Webspace per FTP **oder** GitHub Pages + Custom Domain).
Remote: `https://github.com/Jonas-1984/binarycode.git`

Kanonische URL, Open-Graph-/Twitter-Tags, `robots.txt` und `sitemap.xml` sind bereits auf
`https://binarycodes.de/` gesetzt.

---

## Vorschau

`index.html` direkt im Browser öffnen genügt. Für saubere relative Pfade / `fetch`:

```bash
python -m http.server 8080   # -> http://localhost:8080
```

## Dateien

```
index.html            One-Page mit allen Sektionen
mobile.html            Mobile-optimierte Variante von index.html (gleicher Inhalt,
                       kein Zoom-Regler, zusätzliches styles-mobile.css)
impressum.html        Rechtstext
datenschutz.html      Rechtstext
logo.svg              Marken-Logo (gefüllte Flächen, fill: currentColor -> #22d3ee)
.nojekyll             GitHub Pages: kein Jekyll-Processing

assets/css/styles.css        Gesamtes Design; Farben ganz oben im :root-Block
assets/css/styles-mobile.css Nur von mobile.html geladen: Safe-Area-Insets,
                              iOS-Zoom-Fix für Formularfelder, größere Tap-Ziele
assets/js/main.js      Alle Interaktionen (nummerierte Module 1..16)
assets/js/mobile.js    Nur von mobile.html geladen: "Mehr lesen"-Toggle im
                       about.txt-Panel (#aboutToggle/#aboutMore)
assets/img/jonas.jpg   Porträtfoto (640x864, ~45 KB)
assets/fonts/          Selbst gehostete Schriften (Inter, IBM Plex Mono) + fonts.css
                       -> keine Verbindung zu Google Fonts, kein IP-Transfer
```

## Mobile Version (`mobile.html`)

Eigenständige HTML-Datei mit identischem Inhalt wie `index.html`, aber:

- zusätzliches `assets/css/styles-mobile.css` (Safe-Area-Insets für Notch-Geräte,
  `font-size: 16px` auf Formularfeldern gegen den iOS-Safari-Auto-Zoom, größere
  Tap-Ziele, flachere Karussell-Perspektive auf sehr schmalen Screens)
- kein Seiten-Zoom-Regler (`#zoomCtl`) – auf Touch-Geräten übernimmt Pinch-to-Zoom
  diese Funktion; `main.js` prüft `#zoomCtl` ohnehin auf `null` und überspringt
  das Modul dann automatisch
- `<meta name="robots" content="noindex,follow">` + `<link rel="canonical">` auf
  `https://binarycodes.de/`, damit Suchmaschinen `index.html` als Hauptversion werten
  (kein Duplicate-Content-Problem)
- `index.html` verweist per `<link rel="alternate" media="only screen and (max-width: 680px)">`
  auf `mobile.html` (nur ein Hinweis für Suchmaschinen); zusätzlich verlinken sich
  beide Seiten im Footer gegenseitig („Mobile-Version&quot; / „Desktop-Version&quot;).
- **Automatische Weiterleitung:** Ein Inline-Skript ganz oben im `<head>` von
  `index.html` leitet bei `matchMedia("(max-width: 680px)")` sofort auf
  `mobile.html` weiter (`location.replace`, kein Flackern). Tippt jemand auf
  dem Handy bewusst auf "Desktop-Version" (Link `#desktopLink` in `mobile.html`),
  setzt `mobile.js` `sessionStorage.bc_view_pref = "desktop"` – das Kopfskript
  überspringt die Weiterleitung dann für den Rest der Browser-Sitzung. Neuer
  Tab/neue Sitzung → automatische Erkennung greift wieder.

- `#skills` ist auf Mobile kein Grid, sondern dasselbe 3D-Coverflow-Karussell wie
  `#timeline` (`#skillsCarousel`, Klassen `.cf`/`.cf__card`/`.tl__card`). Dafür wurde
  `main.js` Modul 9 von einer festen `werdegangCarousel()`-IIFE zu einer
  parametrisierten `initCoverflow(rootId)`-Funktion verallgemeinert, die für
  `#werdegangCarousel` **und** `#skillsCarousel` aufgerufen wird (Zähler/Bar werden
  jetzt pro Karussell über `.cf__counter`/`.cf__bar i` statt über feste IDs
  gesucht). Auf `index.html` bleibt `#skillsCarousel` nicht vorhanden – der zweite
  `initCoverflow()`-Aufruf bricht dort einfach früh ab, Desktop-Verhalten
  unverändert.
- Beide Karussells: `mobile.html` hat keine Pfeil-Tasten (`.cf__nav`) mehr im
  Markup (bewusst gelöscht, nicht nur versteckt). Stattdessen wechselt ein
  einzelnes Tippen auf die aktuelle Karte direkt zur nächsten. Umgesetzt in
  `initCoverflow()` über `document.documentElement.classList.contains("is-mobile-page")`
  – auf `index.html` (Pfeile weiterhin vorhanden) bleibt Tippen auf die
  aktuelle Karte wirkungslos, exakt wie zuvor.
- Tool-Dock: Icons sind in `mobile.html` `<span class="dock__item">` statt
  `<a href>` (Desktop bleibt `<a>`) – nicht klickbar, keine Navigation. Per Finger
  ziehen scrubbt die Endlos-Animation direkt (`assets/js/mobile.js`, Web
  Animations API `currentTime`), da die Maus-Hover-Geschwindigkeitssteuerung aus
  `main.js` für Touch nicht zuverlässig ist. Berührung vergrößert ein Icon kurz
  (`.dock__item:active` in `styles-mobile.css`, dieselben Werte wie der
  Desktop-`:hover`).
- Header-Logo: `mobile.html` zeigt den Schriftzug „binaryCodes“ inkl. Flip-zu-
  Binärziffer-Effekt neben dem Logo, genau wie am Desktop – auf `index.html`
  bleiben Schriftzug und Animation unter 620px weiterhin ausgeblendet
  (Platzgrund im schmalen Browserfenster). Umgesetzt in `styles.css` über
  `html:not(.is-mobile-page) .nav__brand-text`/`.ch`/`.ch__bit` – die Klasse
  `is-mobile-page` sitzt am `<html>` nur in `mobile.html`, Desktop-Verhalten
  bei schmalem Fenster bleibt dadurch unangetastet.

**Wichtig beim Pflegen:** Inhaltliche Änderungen (Texte, Sektionen, Werdegang) in
`index.html` **und** `mobile.html` parallel nachziehen, da beide Dateien den Inhalt
duplizieren. Bei Skills zusätzlich beachten: Desktop pflegt `.skill-card`-Artikel
in `.skills-grid`, Mobile pflegt `.tl__card`-Artikel in `#skillsCarousel` – gleicher
Inhalt, zwei unterschiedliche Markup-Strukturen.

## Sektionen (index.html)

| Anker | Inhalt |
|-------|--------|
| `#home` | Hero: Binär-Regen (Canvas), kleines rundes Porträt **vor** dem Namen, `whoami`-Terminal mit Tipp-Animation, CTA-Buttons, **Tool-Dock** |
| `#about` | Freitext-Panel + **Zahlensystem-Umrechner** BIN ⇄ DEC ⇄ HEX |
| `#skills` | 6 Skill-Karten |
| `#timeline` | Werdegang + Bildungsweg als **3D-Coverflow-Karussell** (`#werdegangCarousel`) |
| `#profil` | Sprachen & Eckdaten (`cat ~/profil.txt`) |
| `#contact` | Kontaktformular mit Neo-Toggle-Zustimmung |
| `<footer>` | Social-Icons, Logo, Copyright, Rechts-Links, „Cookie-Einstellungen" |

## Interaktive Bausteine

**Kopfleiste (Liquid Glass)** – frosted-glass Bar; Logo + „binaryCodes" ohne Kasten.
Alle 6 s dreht sich jedes Zeichen (und das Logo) im 3D-Flip um die eigene Achse,
klappt zur Binärziffer (0/1) und wieder zurück (CSS-Keyframes `brandFlip`, `.ch`-Spans
per JS erzeugt – Modul 10). Navi = 6 quadratische Glas-Icon-Buttons (`.nav__ico`) +
**Sprachumschalter** `#langToggle` (DE/EN als Toggle mit Kreis-Knopf).

**Mehrsprachigkeit (DE / EN)** – `#langToggle` im Header. Alle übersetzbaren Texte tragen
`data-en` (Inhalt) bzw. `data-en-al` / `data-en-tt` / `data-en-ph` (aria-label / title /
placeholder). Modul 15 sichert die deutschen Originale, tauscht bei Klick, setzt
`<html lang>` und speichert die Wahl in `localStorage` (`bc_lang`). Dynamische Rechner-
Texte laufen über `window.i18n.t(de, en)` + `window.i18n.onChange`. Impressum/Datenschutz
bleiben aus rechtlichen Gründen deutsch.

**Seiten-Zoom-Regler** (`#zoomCtl`, Modul 16) – vertikale Leiste rechts neben dem Hero-
Terminal (Lupe-Icon, `+` / `−`, Füllstands-Anzeige). 5 Stufen ~90–150 %, skaliert die
ganze Seite via CSS `zoom` auf `<html>`; Wahl in `localStorage` (`bc_zoom`).

**Tool-Dock** (`#dock`) – Endlos-Band verlinkter Tech-Icons, läuft rechts → links.
Bei Hover steuert die **Maus-X-Position** Richtung und Tempo (Mitte = still, rechts =
vorwärts, links = rückwärts; WAAPI `playbackRate`). Icons werden per JS für die
nahtlose Schleife verdoppelt.
Neues Icon: `<a class="dock__item" href="…" target="_blank" rel="noopener" title="…">`
mit Inline-`<svg>` in `#dockTrack` einfügen. SVGs mit eigenen `<defs>` brauchen
**eindeutige `id`-Präfixe** (sonst Verlaufs-/Mask-Kollisionen).

**Werdegang-Karussell** – Mittelkarte scharf, Nachbarn 3D-gekippt/geblurrt, obere/untere
„Liquid"-Fade-Ebenen. Pfeiltasten, Tastatur (↑/↓), Wischen, Mausrad. Im Leerlauf
automatischer Wechsel alle 6 s (pausiert bei Interaktion/Hover, läuft nur bei sichtbarer
Sektion). Ohne JS / `prefers-reduced-motion`: einfache Liste als Fallback.
Neue Station: ein `<li class="cf__card"><article class="tl__card"> … </article></li>`
in `#werdegangCarousel > .cf__track > .cf__track`-Liste; Reihenfolge neu → alt.

**Zahlensystem-Umrechner** – Eingabe in einem Feld (BIN/DEC/HEX) berechnet die anderen
zwei sofort in beide Richtungen (BigInt, Fehleranzeige bei ungültiger Eingabe).

**Trennlinien** – dünne, weiche Verlaufslinien (`.section::after`, wie `.footer__rule`).

## Kontaktformular (`#contact`)

Vorbereitet für **Web3Forms** (`api.web3forms.com`), mit `mailto:`-Fallback.

- Solange `<input name="access_key" value="DEIN_WEB3FORMS_ACCESS_KEY">` der Platzhalter
  ist → Klick auf „Senden" öffnet das E-Mail-Programm des Besuchers.
- Mit echtem Key → AJAX-Versand direkt ans Postfach, Button-Status, Erfolg-/Fehlermeldung,
  Formular wird geleert.
- Pflicht-**Neo-Toggle** (Datenschutz-Zustimmung, `#convConsent`) – ohne Aktivierung kein
  Versand. Honeypot-Feld `botcheck`.

**Aktivieren:** 1) Domain + Postfach `info@binarycodes.de` einrichten · 2) auf
`web3forms.com` mit dieser Adresse kostenlosen Access Key holen · 3) Platzhalter in
[index.html](index.html) ersetzen · 4) **§ 5 der Datenschutzerklärung um Web3Forms
ergänzen**, bevor der Key live geht.

## Rechtstexte

`impressum.html` und `datenschutz.html` teilen sich `styles.css`.

**Keine Anschrift, keine Telefonnummer** – auf ausdrücklichen Wunsch des Betreibers
stehen weder Straßenanschrift noch Telefonnummer irgendwo im Projekt. Impressum und
Datenschutz nennen nur Name, „Hamburg" und die E-Mail-Adresse. Ein `<!-- BEARBEITEN -->`-
Kommentar im Impressum weist auf das rechtliche Risiko hin: für geschäftsmäßige / nicht
rein private Angebote ist eine ladungsfähige Anschrift Pflicht (§ 5 DDG, § 18 MStV).

`datenschutz.html` Abschnitt 2 („Hosting") ist als `<!-- BEARBEITEN -->` markiert und
muss angepasst werden, sobald der Auslieferungsweg (eigener Webspace vs. GitHub Pages)
feststeht. Consent-Hinweis setzt nur den technisch notwendigen `localStorage`-Schlüssel
`bc_consent`. Texte sind Standardvorlagen – für volle Rechtssicherheit anwaltlich prüfen.

## Anpassen

| Was | Wo |
|-----|-----|
| Akzent-/Hintergrundfarbe | `:root` in `assets/css/styles.css` (`--accent`, `--bg`, …) |
| Neo-Toggle-Farbe | `.neo-toggle-container { --toggle-on-color: … }` |
| Logo-Farbe | `logo.svg` Attribut `color="…"` |
| Logo-Größe | `.nav__logo` / `.footer__logo` in `styles.css` |
| Texte | direkt in `index.html`, Kommentare `<!-- ===== BEARBEITEN: … ===== -->` |
| Social-Links | `#SocailIcons` im Footer – Instagram + LinkedIn = echte Profile; WhatsApp/YouTube zeigen vorerst auf `whatsapp.com` / `youtube.com` (später `wa.me/49…` bzw. Kanal-URL) |

## Noch offen

- **Auslieferungsweg für `binarycodes.de` festlegen** (siehe „Veröffentlichen").
- `datenschutz.html` Abschnitt 2 auf den tatsächlichen Hoster anpassen.
- WhatsApp-`href` auf `https://wa.me/49…` und YouTube-`href` auf die Kanal-URL umstellen (aktuell Startseiten).
- Web3Forms-Access-Key (+ Datenschutz-Ergänzung) für echten Formularversand.

## Veröffentlichen (`binarycodes.de`)

Domain + Webspace sind gekauft. Zwei Wege:

**a) Eigener Webspace (FTP/SFTP)** – alle Dateien aus dem Repo-Root in das
Web-Wurzelverzeichnis hochladen (`index.html`, `impressum.html`, `datenschutz.html`,
`favicon.svg`, `logo.svg`, `robots.txt`, `sitemap.xml`, Ordner `assets/`).
`.nojekyll` kann mit hoch, stört nicht. Domain-DNS (A-Record) zeigt bereits auf den
Hoster. Danach `datenschutz.html` Abschnitt 2 auf den Hoster + AV-Vertrag umschreiben.

**b) GitHub Pages + Custom Domain** – Repo → **Settings → Pages → Deploy from a branch**,
Branch `main`, Ordner `/ (root)`; unter „Custom domain" `binarycodes.de` eintragen,
„Enforce HTTPS" anhaken. Beim Domain-Anbieter: `CNAME www → jonas-1984.github.io` plus
die vier A-Records der GitHub-Pages-Apex-IPs. GitHub legt dann automatisch eine
`CNAME`-Datei im Repo an (oder vorab selbst anlegen: Datei `CNAME` mit Inhalt
`binarycodes.de`). `.nojekyll` ist bereits vorhanden. Nach ~1 Minute live.

## Git

```bash
git add -A
git commit -m "Update Inhalte"
git push
```
