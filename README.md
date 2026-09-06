# binarycode

Persönliche One-Page-Webseite für einen **IT-Spezialisten & Systemadministrator**.
Dark-/IT-Theme, durchgängig mit Binärcode (0/1) gestaltet, Lebenslauf als Timeline.
Reines HTML/CSS/JavaScript – kein Build, kein Framework.

## Vorschau

Einfach `index.html` im Browser öffnen. Für ein realistisches Setup (relative Pfade):

```bash
# Python 3
python -m http.server 8080
# dann http://localhost:8080 aufrufen
```

## Struktur

```
index.html            # gesamte Seite (alle Sektionen)
assets/css/styles.css # Design – Farben oben als CSS-Variablen
assets/js/main.js     # Binär-Regen, Tipp-Animation, Scroll-Effekte
.nojekyll             # nötig für GitHub Pages (kein Jekyll-Processing)
```

## Inhalte bearbeiten

Alle Texte stehen direkt in [`index.html`](index.html). Suche nach den Kommentaren:

- `<!-- ===== BEARBEITEN: ... ===== -->`

Wichtigste Stellen:

| Was | Wo |
|-----|-----|
| Name | `<h1 class="hero__name">` |
| Titel / Rolle | `<h2 class="hero__role">` und Terminal-Ausgabe darunter |
| Über mich | Sektion `#about` |
| Skills | Sektion `#skills` – `<article class="skill-card">` kopieren/anpassen |
| **Werdegang / Timeline** | Sektion `#timeline` – je Station ein `<li class="tl__item">` |
| Zertifikate | Sektion `#certs` (oder Sektion + Nav-Link entfernen) |
| Kontakt (E-Mail, GitHub, LinkedIn) | Sektion `#contact` |
| Footer-Name / Jahr | `<footer>` (Jahr wird automatisch gesetzt) |

### Neue Timeline-Station hinzufügen

```html
<li class="tl__item" data-reveal>
  <div class="tl__node" aria-hidden="true"></div>
  <div class="tl__card">
    <span class="tl__date">2014 &ndash; 2016</span>
    <h3 class="tl__title">Positionsbezeichnung</h3>
    <p class="tl__org">Firma &middot; Ort</p>
    <ul class="tl__desc">
      <li>Aufgabe / Erfolg 1</li>
      <li>Aufgabe / Erfolg 2</li>
    </ul>
    <ul class="tl__tags"><li>Tag</li><li>Tag</li></ul>
  </div>
</li>
```

Stationen stehen von **neu nach alt**.

## Farben ändern

In [`assets/css/styles.css`](assets/css/styles.css) ganz oben im `:root`-Block, z. B.:

```css
--accent:   #22d3ee;  /* Akzentfarbe (Cyan) */
--bg:       #070a0d;   /* Hintergrund */
```

## Veröffentlichen mit GitHub Pages

1. Repo pushen (siehe unten).
2. Auf GitHub: **Settings → Pages → Build and deployment → Source: „Deploy from a branch“**, Branch `main`, Ordner `/ (root)`.
3. Nach ~1 Minute erreichbar unter `https://jonas-1984.github.io/binarycode/`.

## Git

```bash
git add -A
git commit -m "Update Inhalte"
git push
```

Remote: `https://github.com/Jonas-1984/binarycode.git`
