/* Automatische Weiterleitung auf die mobile-optimierte Version bei schmalem
   Bildschirm. Ausnahme: Nutzer hat in dieser Sitzung bereits bewusst über
   den Footer-Link "Desktop-Version" hierher zurückgewechselt (mobile.js
   setzt dann sessionStorage bc_view_pref=desktop). Laeuft synchron ganz
   oben im <head> (kein defer/async), damit kein Desktop-Layout kurz
   aufblitzt. Als externe Datei statt inline, damit die Content-Security-
   Policy ohne "unsafe-inline" in script-src auskommt. */
(function () {
  try {
    if (sessionStorage.getItem("bc_view_pref") === "desktop") return;
  } catch (e) {}
  if (window.matchMedia("(max-width: 680px)").matches) {
    location.replace("mobile.html" + location.hash);
  }
})();
