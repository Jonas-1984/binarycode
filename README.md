# binaryCodes

Persönliche One-Page-Website von **Jonas Shojaei – IT-Spezialist & IT-Systemadministrator** (Hamburg).
Dark-/IT-Theme, durchgängig mit Binärcode (0/1) gestaltet. Reines HTML/CSS/JavaScript –
**kein Build, kein Framework, keine externen Laufzeit-Abhängigkeiten**.
Zweisprachig **DE / EN** (Umschalter im Header) und mit **Seiten-Zoom-Regler** am Hero-Terminal.

Domain `bitbins.de`, Webhosting **und** Postfach `info@bitbins.de` liegen komplett bei
**Hetzner Online GmbH** (Webhosting-Paket, Serverstandort Deutschland). Auslieferung per
FTP/SFTP-Upload auf den Webspace (siehe „Veröffentlichen"). Remote (Quellcode):
`https://github.com/Jonas-1984/binarycode.git` (nur Versionsverwaltung, kein Hosting).

Kanonische URL, Open-Graph-/Twitter-Tags, `robots.txt` und `sitemap.xml` sind bereits auf
`https://bitbins.de/` gesetzt.

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
                       kein Zoom-Regler, zusätzliches styles-mobile.css) – MUSS beim
                       Veröffentlichen mit hochgeladen werden, sonst 404 beim
                       automatischen Redirect auf schmalen Bildschirmen!
impressum.html        Rechtstext
datenschutz.html      Rechtstext
logo.svg              Marken-Logo (gefüllte Flächen, fill: currentColor -> #22d3ee)
.htaccess             Sicherheits-Header, HTTPS-/www-Redirect, Caching (Apache/Hetzner)
robots.txt            Crawler-Regeln + Sitemap-Verweis
sitemap.xml           URL-Liste für Suchmaschinen
.nojekyll             nur falls zusätzlich per GitHub Pages gespiegelt wird

assets/css/styles.css        Gesamtes Design; Farben ganz oben im :root-Block
assets/css/styles-mobile.css Nur von mobile.html geladen: Safe-Area-Insets,
                              iOS-Zoom-Fix für Formularfelder, größere Tap-Ziele
assets/js/main.js      Alle Interaktionen (nummerierte Module 1..16)
assets/js/mobile.js    Nur von mobile.html geladen: "Mehr lesen"-Toggle im
                       about.txt-Panel (#aboutToggle/#aboutMore)
assets/js/redirect-check.js  Nur von index.html geladen (nicht defer): prüft
                       matchMedia(max-width:680px) und leitet ggf. auf
                       mobile.html um; ausgelagert statt inline, damit die
                       Content-Security-Policy ohne unsafe-inline auskommt
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
  `https://bitbins.de/`, damit Suchmaschinen `index.html` als Hauptversion werten
  (kein Duplicate-Content-Problem)
- `index.html` verweist per `<link rel="alternate" media="only screen and (max-width: 680px)">`
  auf `mobile.html` (nur ein Hinweis für Suchmaschinen); zusätzlich verlinken sich
  beide Seiten im Footer gegenseitig („Mobile-Version&quot; / „Desktop-Version&quot;).
- **Automatische Weiterleitung:** `assets/js/redirect-check.js`, ganz oben im `<head>`
  von `index.html` eingebunden (kein `defer`, damit es vor dem ersten Paint läuft),
  leitet bei `matchMedia("(max-width: 680px)")` sofort auf `mobile.html` weiter
  (`location.replace`, kein Flackern). Tippt jemand auf
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
Neues Icon: `<a class="dock__item" href="…" target="_blank" rel="noopener noreferrer" title="…">`
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

Läuft über **Web3Forms** (`api.web3forms.com`), Formular "Kontakt" im Web3Forms-Account
von `shojaei.de@gmail.com`; Empfänger-E-Mail im Web3Forms-Dashboard (Form → Email
Configuration) auf das verifizierte `info@bitbins.de` gesetzt. `mailto:`-Fallback
bleibt im Code für den Fall, dass der Access Key mal ungültig wird.

- AJAX-Versand direkt ans Postfach, Button-Status, Erfolg-/Fehlermeldung, Formular wird
  geleert.
- Pflicht-**Neo-Toggle** (Datenschutz-Zustimmung, `#convConsent`) – ohne Aktivierung kein
  Versand. Honeypot-Feld `botcheck` + Zeit-Falle (Modul 8 in `main.js`).
- Access Key (`a66ce56d-01fa-424f-8d13-54e78b364d3b`) liegt als `value` im versteckten
  `access_key`-Feld in **beiden** `index.html` **und** `mobile.html` – ist laut Web3Forms
  ein "public key", darf also im Client-Code stehen.
- `datenschutz.html` Abschnitt 6 ("Kontaktaufnahme") beschreibt Web3Forms als Auftrags-
  verarbeiter entsprechend.

## Sicherheit

- **HTTPS erzwungen** + `www` → Apex-Domain-Redirect (`.htaccess`, `mod_rewrite`).
- **Content-Security-Policy** – nur eigene Ressourcen + `api.web3forms.com` fürs
  Kontaktformular; `script-src 'self'` **ohne** `unsafe-inline`/`unsafe-eval` (alle
  Dock-Icons nutzen SVG-Präsentationsattribute statt inline `style=`, damit auch
  `style-src 'self'` ohne `unsafe-inline` reicht). Doppelt abgesichert: `<meta
  http-equiv="Content-Security-Policy">` in jeder HTML-Datei **und** vollständiger
  HTTP-Header (inkl. `frame-ancestors`, was `<meta>` nicht unterstützt) in `.htaccess`.
- **Weitere Header** (`.htaccess`): `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
  `Permissions-Policy` (Kamera/Mikro/Standort/Payment/USB aus), `Strict-Transport-
  Security` (HSTS – siehe Kommentar in `.htaccess`, erst nach HTTPS-Test hochsetzen).
- **Kein Verzeichnis-Listing**, kein Zugriff auf versteckte/`.env`/`.log`/`.md`-Dateien
  (`.htaccess`).
- **Kontaktformular**: Honeypot-Feld `botcheck` + Zeit-Falle (Absenden < 2,5 s nach
  Laden gilt als Bot) in `assets/js/main.js`, Modul 8 – beides schlägt still fehl,
  ohne das Bots zu verraten, dass sie erkannt wurden.
- **Keine externen Laufzeit-Abhängigkeiten**: Schriften selbst gehostet, kein Google
  Fonts/Analytics/Tracking, kein npm/CDN – entsprechend kleine Angriffsfläche
  (keine Supply-Chain-Risiken durch Drittanbieter-Skripte).
- Alle externen Links (Tool-Dock, Social-Icons, Rechtstexte) mit
  `rel="noopener noreferrer"`.
- **E-Mail-Authentifizierung**: SPF, DKIM und DMARC für `bitbins.de` im Hetzner-
  Kundenportal einrichten (siehe „Noch offen").

## Rechtstexte

`impressum.html` und `datenschutz.html` teilen sich `styles.css`.

**Keine Anschrift, keine Telefonnummer** – auf ausdrücklichen Wunsch des Betreibers
stehen weder Straßenanschrift noch Telefonnummer irgendwo im Projekt. Impressum und
Datenschutz nennen nur Name, „Hamburg" und die E-Mail-Adresse `info@bitbins.de`.
Ein `<!-- BEARBEITEN -->`-Kommentar im Impressum weist auf das rechtliche Risiko hin:
für geschäftsmäßige / nicht rein private Angebote ist eine ladungsfähige Anschrift
Pflicht (§ 5 DDG, § 18 MStV).

`datenschutz.html` Abschnitt 2 („Hosting") und Abschnitt 3 („E-Mail-Postfach")
beschreiben jetzt **Hetzner Online GmbH** mit Serverstandort Deutschland (kein
Drittlandtransfer, dadurch entfällt jeglicher USA-/SCC-Absatz). Die
`<!-- BEARBEITEN -->`-Kommentare dort bitten darum, die genaue Firmierung/Anschrift
sowie den Auftragsverarbeitungsvertrag (AVV) im Hetzner-Kundenportal gegenzuprüfen.
Consent-Hinweis setzt nur den technisch notwendigen `localStorage`-Schlüssel
`bc_consent`. Texte sind Standardvorlagen – für volle Rechtssicherheit anwaltlich
prüfen.

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

- ~~Erst-Upload auf den Hetzner-Webspace + SSL-Zertifikat aktivieren~~ ✅ erledigt
  (2026-09-23, `https://bitbins.de/` live, Zertifikat aktiv, alle Sicherheits-Header
  von außen verifiziert).
- ~~`info@bitbins.de`-Postfach anlegen~~ ✅ erledigt, per Outlook eingerichtet.
- ~~Kontaktformular umstellen (Web3Forms-Empfänger auf `info@bitbins.de`)~~ ✅ erledigt
  und live getestet – Testnachricht kam in `info@bitbins.de` an.
- SPF/DKIM/DMARC-Einträge für `info@bitbins.de` in der Hetzner-DNS-Zone setzen (verbessert
  Zustellbarkeit/Spam-Schutz, aber nicht blockierend – E-Mail funktioniert bereits ohne).
- HSTS-`max-age` in `.htaccess` jetzt, wo HTTPS ein paar Tage stabil läuft, in den
  nächsten Wochen schrittweise erhöhen (Kommentar dort).
- Hetzner-Firmierung/AVV in `datenschutz.html` Abschnitte 2+3 mit dem echten Vertrag
  im Hetzner-Kundenportal gegenprüfen.
- WhatsApp-`href` auf `https://wa.me/49…` und YouTube-`href` auf die Kanal-URL umstellen (aktuell Startseiten).
- Altes GitHub-Pages-Setup abbauen: unter
  [Settings → Pages](https://github.com/Jonas-1984/binarycode/settings/pages) die
  Custom Domain `binarycodes.de` entfernen/Pages deaktivieren, da nicht mehr genutzt.
- Alte Domain `binarycodes.de` (falls noch nicht gekündigt) und den dortigen
  Zoho-Mail-Account (`info@binarycodes.de`) auslaufen lassen bzw. kündigen.

## Veröffentlichen (`bitbins.de` bei Hetzner)

1. **DNS**: Da Domain und Webhosting beide bei Hetzner liegen, ist die Domain dem
   Hosting-Paket im Hetzner-Kundenportal (Robot/Konsole) meist schon automatisch
   zugeordnet – kurz gegenprüfen (DNS-Zone unter der Domain → A-Record zeigt auf die
   zugewiesene Server-IP).
2. **SSL-Zertifikat aktivieren**: im Hetzner-Kundenportal unter dem Hosting-Paket ein
   (kostenloses) Let's-Encrypt-Zertifikat für `bitbins.de` **und** `www.bitbins.de`
   aktivieren. Ohne aktives Zertifikat greift der HTTPS-Redirect in `.htaccess` nicht
   und die Seite ist nicht sicher erreichbar.
3. **Dateien hochladen** – per FTP/SFTP (Zugangsdaten aus dem Hetzner-Kundenportal)
   alle Dateien aus dem Repo-Root **inklusive** `.htaccess` in das Web-Wurzelverzeichnis
   hochladen: `index.html`, **`mobile.html`** (nicht vergessen – sonst 404 beim
   automatischen Redirect auf dem Handy!), `impressum.html`, `datenschutz.html`,
   `favicon.svg`, `logo.svg`, `robots.txt`, `sitemap.xml`, `.htaccess`, Ordner `assets/`
   (komplett, inkl. `styles-mobile.css`, `mobile.js`, `redirect-check.js`).
   **SFTP statt einfachem FTP verwenden**, wenn Hetzner es anbietet – die Zugangsdaten
   werden dann verschlüsselt übertragen. `.htaccess`-Dateien sind "versteckt" (Punkt-
   Datei): im FTP-Programm die Anzeige versteckter Dateien einschalten, sonst wird sie
   nicht mit hochgeladen.
4. **Prüfen**: `https://bitbins.de/` aufrufen (nicht `http://`), Zertifikat im Browser
   kontrollieren, `www.bitbins.de` sollte automatisch auf die Version ohne `www`
   umleiten. Mit den Browser-Entwicklertools (Netzwerk-Tab → Antwort-Header) prüfen,
   ob `Content-Security-Policy`, `Strict-Transport-Security` usw. gesetzt sind.
5. **Bei jeder Änderung**: lokal weiterentwickeln, per `git push` nach GitHub sichern
   (siehe „Git" unten) und die geänderten Dateien erneut per FTP/SFTP hochladen –
   GitHub ist hier nur der Quellcode-Speicher, es gibt kein automatisches Deployment
   von GitHub zu Hetzner.

## Git

```bash
git add -A
git commit -m "Update Inhalte"
git push
```
