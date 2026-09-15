# binaryCodes

Persönliche One-Page-Website von **Jonas Shojaei – IT-Spezialist & IT-Systemadministrator** (Hamburg).
Dark-/IT-Theme, durchgängig mit Binärcode (0/1) gestaltet. Reines HTML/CSS/JavaScript –
**kein Build, kein Framework, keine externen Laufzeit-Abhängigkeiten**.
Zweisprachig **DE / EN** (Umschalter im Header) und mit **Seiten-Zoom-Regler** am Hero-Terminal.

Domain `binarycodes.de` registriert bei **domainFactory GmbH** (`df.eu`, DNS läuft über
deren Nameserver auf GoDaddy-Infrastruktur, `ns13`/`ns14.domaincontrol.com`).
**Gehostet wird die Website über GitHub Pages** (Auslieferung per `git push`, siehe
„Veröffentlichen"), das domainFactory-Webhosting-Paket wird dafür nicht genutzt.
Postfach `info@binarycodes.de` läuft über **Zoho Mail** (`zoho.eu`, EU-Rechenzentrum).
Remote (Quellcode): `https://github.com/Jonas-1984/binarycode.git`

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
                       kein Zoom-Regler, zusätzliches styles-mobile.css) – MUSS beim
                       Veröffentlichen mit hochgeladen werden, sonst 404 beim
                       automatischen Redirect auf schmalen Bildschirmen!
impressum.html        Rechtstext
datenschutz.html      Rechtstext
logo.svg              Marken-Logo (gefüllte Flächen, fill: currentColor -> #22d3ee)
CNAME                 GitHub Pages Custom Domain (Inhalt: binarycodes.de)
robots.txt            Crawler-Regeln + Sitemap-Verweis
sitemap.xml           URL-Liste für Suchmaschinen
.nojekyll             deaktiviert Jekyll-Processing (nötig für GitHub Pages)

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
  `https://binarycodes.de/`, damit Suchmaschinen `index.html` als Hauptversion werten
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

Vorbereitet für **Web3Forms** (`api.web3forms.com`), mit `mailto:`-Fallback.

- Solange `<input name="access_key" value="DEIN_WEB3FORMS_ACCESS_KEY">` der Platzhalter
  ist → Klick auf „Senden" öffnet das E-Mail-Programm des Besuchers.
- Mit echtem Key → AJAX-Versand direkt ans Postfach, Button-Status, Erfolg-/Fehlermeldung,
  Formular wird geleert.
- Pflicht-**Neo-Toggle** (Datenschutz-Zustimmung, `#convConsent`) – ohne Aktivierung kein
  Versand. Honeypot-Feld `botcheck`.

**Aktivieren:** 1) Postfach `info@binarycodes.de` ist bereits eingerichtet (Zoho Mail) ·
2) auf `web3forms.com` mit dieser Adresse kostenlosen Access Key holen · 3) Platzhalter in
[index.html](index.html) ersetzen · 4) **§ 5 der Datenschutzerklärung um Web3Forms
ergänzen**, bevor der Key live geht.

## Sicherheit

**Hinweis:** Die Seite läuft auf **GitHub Pages** – dort lassen sich (anders als auf
einem eigenen Apache-Server) **keine eigenen HTTP-Response-Header** setzen. Eine
`.htaccess`-Datei würde ignoriert und wäre zudem öffentlich unter `/.htaccess` abrufbar,
deshalb gibt es diese Datei in diesem Repo nicht mehr. Aktiv sind nur die
Schutzmaßnahmen, die sich clientseitig (per `<meta>`/HTML) oder direkt im Code umsetzen
lassen:

- **HTTPS erzwungen**: GitHub Pages stellt automatisch ein Let's-Encrypt-Zertifikat aus
  und erzwingt HTTPS (Einstellung "Enforce HTTPS" in den Repo-Settings), inkl.
  automatischem `www` → Apex-Redirect passend zur `CNAME`-Datei.
- **Content-Security-Policy** – nur eigene Ressourcen + `api.web3forms.com` fürs
  Kontaktformular; `script-src 'self'` **ohne** `unsafe-inline`/`unsafe-eval` (alle
  Dock-Icons nutzen SVG-Präsentationsattribute statt inline `style=`, damit auch
  `style-src 'self'` ohne `unsafe-inline` reicht). Umgesetzt als `<meta
  http-equiv="Content-Security-Policy">` in jeder HTML-Datei – das ist auf GitHub
  Pages der einzig verfügbare Weg (kein `frame-ancestors` möglich, das unterstützt nur
  der HTTP-Header, nicht `<meta>`).
- **Nicht aktiv** (würden einen eigenen Server mit Header-Kontrolle voraussetzen):
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
  `Strict-Transport-Security` (HSTS). Wer das braucht, müsste vor GitHub Pages einen
  eigenen Reverse-Proxy/CDN (z.&nbsp;B. Cloudflare) schalten, der diese Header ergänzt.
- **Kontaktformular**: Honeypot-Feld `botcheck` + Zeit-Falle (Absenden < 2,5 s nach
  Laden gilt als Bot) in `assets/js/main.js`, Modul 8 – beides schlägt still fehl,
  ohne das Bots zu verraten, dass sie erkannt wurden.
- **Keine externen Laufzeit-Abhängigkeiten**: Schriften selbst gehostet, kein Google
  Fonts/Analytics/Tracking, kein npm/CDN – entsprechend kleine Angriffsfläche
  (keine Supply-Chain-Risiken durch Drittanbieter-Skripte).
- Alle externen Links (Tool-Dock, Social-Icons, Rechtstexte) mit
  `rel="noopener noreferrer"`.
- **E-Mail-Authentifizierung**: SPF, DKIM (Selektor `zoho`) und DMARC (`p=none`,
  Monitoring-Modus) sind für `binarycodes.de` bei Zoho Mail eingerichtet.

## Rechtstexte

`impressum.html` und `datenschutz.html` teilen sich `styles.css`.

**Keine Anschrift, keine Telefonnummer** – auf ausdrücklichen Wunsch des Betreibers
stehen weder Straßenanschrift noch Telefonnummer irgendwo im Projekt. Impressum und
Datenschutz nennen nur Name, „Hamburg" und die E-Mail-Adresse `info@binarycodes.de`.
Ein `<!-- BEARBEITEN -->`-Kommentar im Impressum weist auf das rechtliche Risiko hin:
für geschäftsmäßige / nicht rein private Angebote ist eine ladungsfähige Anschrift
Pflicht (§ 5 DDG, § 18 MStV).

`datenschutz.html` Abschnitt 2 („Hosting") beschreibt **GitHub, Inc.** (GitHub Pages)
als Website-Hoster – da GitHub, Inc. in den USA sitzt, ist das eine
Drittlandübermittlung, gestützt auf den Angemessenheitsbeschluss zum EU-US Data
Privacy Framework (Art. 45 DSGVO). Abschnitt 3 („E-Mail-Postfach") beschreibt
**Zoho Mail** (`zoho.eu`, EU-Rechenzentrum, kein Drittlandtransfer) für
`info@binarycodes.de`. Beide Abschnitte tragen `<!-- BEARBEITEN -->`-Kommentare, die
darum bitten, die aktuelle DPF-Zertifizierung von GitHub/Microsoft bzw. die
Auftragsverarbeitungsvereinbarung (AVV) mit Zoho im jeweiligen Kundenportal
gegenzuprüfen. Consent-Hinweis setzt nur den technisch notwendigen
`localStorage`-Schlüssel `bc_consent`. Texte sind Standardvorlagen – für volle
Rechtssicherheit anwaltlich prüfen.

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

- GitHubs aktuelle Data-Privacy-Framework-Zertifizierung bzw. Standardvertragsklauseln
  in `datenschutz.html` Abschnitt 2 gegenprüfen (Link zur GitHub-Datenschutzerklärung
  dort im `<!-- BEARBEITEN -->`-Kommentar).
- Auftragsverarbeitungsvereinbarung (DPA) mit Zoho im Zoho-Admin-Bereich abschließen/
  prüfen (`datenschutz.html` Abschnitt 3).
- WhatsApp-`href` auf `https://wa.me/49…` und YouTube-`href` auf die Kanal-URL umstellen (aktuell Startseiten).
- Web3Forms-Access-Key mit `info@binarycodes.de` holen (+ § 5 Datenschutz ergänzen) für echten Formularversand.
- Verwaiste DNS-Einträge für die alten, nicht mehr genutzten Mail-Subdomains
  (`email`/`imap`/`mail`/`mobilemail`/`pda`/`pop`/`smtp`/`webmail.binarycodes.de`,
  noch mit Ziel "DomainFactory") im df.eu-Kundencenter aufräumen – nicht mehr aktiv
  genutzt, aber toter Ballast in der DNS-Zone.

## Veröffentlichen (`binarycodes.de` über GitHub Pages)

Domain-Registrierung und DNS-Zone bleiben bei **domainFactory** (`df.eu`), Hosting und
Auslieferung laufen komplett über **GitHub Pages**. Es gibt keinen manuellen
Upload-Schritt mehr – ein `git push` genügt.

1. **DNS bei domainFactory** (Auftrag mit der Domain → „Nameserver-Einstellungen"):
   - 4× **A-Record** für `binarycodes.de` (Hostname leer lassen) auf die GitHub-Pages-IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **CNAME** für `www.binarycodes.de` → `jonas-1984.github.io`
   - Diese Einträge sind bereits gesetzt und per DNS-Check bestätigt.
2. **GitHub Pages konfigurieren**: Unter
   [Settings → Pages](https://github.com/Jonas-1984/binarycode/settings/pages) ist
   `binarycodes.de` als Custom Domain eingetragen (liegt zusätzlich in der `CNAME`-Datei
   im Repo-Root) und „Enforce HTTPS" aktiviert – GitHub stellt automatisch ein
   Let's-Encrypt-Zertifikat aus und erneuert es selbstständig.
3. **Deployment**: Jeder `git push` auf `main` wird von GitHub Pages automatisch
   ausgeliefert (der GitHub-Pages-Workflow baut/deployed direkt aus dem Repo, kein
   manueller Upload, kein FTP/SFTP mehr nötig).
4. **Prüfen**: `https://binarycodes.de/` aufrufen, Zertifikat im Browser kontrollieren,
   `www.binarycodes.de` sollte automatisch weiterleiten. Mit den
   Browser-Entwicklertools (Netzwerk-Tab → Antwort-Header) lässt sich der aktuelle
   Header-Umfang von GitHub Pages einsehen (siehe Abschnitt „Sicherheit" – eigene
   Security-Header wie HSTS sind dort **nicht** möglich).
5. **Bei jeder Änderung**: lokal weiterentwickeln, `git push` nach GitHub – fertig,
   kein zusätzlicher Upload-Schritt mehr nötig.

## Git

```bash
git add -A
git commit -m "Update Inhalte"
git push
```
