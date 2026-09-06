# binaryCode

Persönliche One-Page-Website von **Jonas Shojaei – IT-Spezialist & IT-Systemadministrator** (Hamburg).
Dark-/IT-Theme, durchgängig mit Binärcode (0/1) gestaltet. Reines HTML/CSS/JavaScript –
**kein Build, kein Framework, keine externen Laufzeit-Abhängigkeiten**.

Live (nach Aktivierung von GitHub Pages): `https://jonas-1984.github.io/binarycode/`
Remote: `https://github.com/Jonas-1984/binarycode.git`

---

## Vorschau

`index.html` direkt im Browser öffnen genügt. Für saubere relative Pfade / `fetch`:

```bash
python -m http.server 8080   # -> http://localhost:8080
```

## Dateien

```
index.html            One-Page mit allen Sektionen
impressum.html        Rechtstext
datenschutz.html      Rechtstext
logo.svg              Marken-Logo (gefüllte Flächen, fill: currentColor -> #22d3ee)
.nojekyll             GitHub Pages: kein Jekyll-Processing

assets/css/styles.css Gesamtes Design; Farben ganz oben im :root-Block
assets/js/main.js      Alle Interaktionen (nummerierte Module 1..14)
assets/img/jonas.jpg   Porträtfoto (640x864, ~45 KB)
assets/fonts/          Selbst gehostete Schriften (Inter, JetBrains Mono) + fonts.css
                       -> keine Verbindung zu Google Fonts, kein IP-Transfer
```

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

**Kopfleiste (Liquid Glass)** – frosted-glass Bar; Logo + „binaryCode" ohne Kasten.
Alle 6 s zerfällt die Marke in fliegende 0/1-Ziffern und setzt sich wieder zusammen
(CSS-Keyframes `brandCycle` / `brandBits`, Ziffern per JS erzeugt). Navi = 6 quadratische
Glas-Icon-Buttons (`.nav__ico`), 10 px Abstand.

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

**Aktivieren:** 1) Domain + Postfach `info@binarycode.de` einrichten · 2) auf
`web3forms.com` mit dieser Adresse kostenlosen Access Key holen · 3) Platzhalter in
[index.html](index.html) ersetzen · 4) **§ 5 der Datenschutzerklärung um Web3Forms
ergänzen**, bevor der Key live geht.

## Rechtstexte

`impressum.html` und `datenschutz.html` teilen sich `styles.css`. Adresse ist als
`<!-- BEARBEITEN -->`-Platzhalter markiert (für ein vollständiges Impressum rechtlich
erforderlich). Consent-Hinweis unten setzt nur den technisch notwendigen
`localStorage`-Schlüssel `bc_consent`. Texte sind Standardvorlagen – für volle
Rechtssicherheit anwaltlich prüfen lassen.

## Anpassen

| Was | Wo |
|-----|-----|
| Akzent-/Hintergrundfarbe | `:root` in `assets/css/styles.css` (`--accent`, `--bg`, …) |
| Neo-Toggle-Farbe | `.neo-toggle-container { --toggle-on-color: … }` |
| Logo-Farbe | `logo.svg` Attribut `color="…"` |
| Logo-Größe | `.nav__logo` / `.footer__logo` in `styles.css` |
| Texte | direkt in `index.html`, Kommentare `<!-- ===== BEARBEITEN: … ===== -->` |
| Social-URLs | `<ul class="footer__social">` (aktuell `href="#"`-Platzhalter) |
| LinkedIn im Formular-Bereich | – (Direkt-Links wurden entfernt) |

## Noch offen

- Echte Profil-URLs für die 4 Social-Buttons im Footer.
- Web3Forms-Access-Key (+ Datenschutz-Ergänzung) für echten Formularversand.
- Optional: Domain `binarycode.de` + Hosting; Impressum/Datenschutz auf finale Daten setzen.

## GitHub Pages veröffentlichen

**Settings → Pages → Source: „Deploy from a branch"**, Branch `main`, Ordner `/ (root)`.
`.nojekyll` ist bereits vorhanden. Nach ~1 Minute live.

## Git

```bash
git add -A
git commit -m "Update Inhalte"
git push
```
