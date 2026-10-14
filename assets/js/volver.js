// Botón flotante para volver al portafolio desde cualquier proyecto.
(function () {
  var a = document.createElement("a");
  a.href = new URL("../../index.html#proyectos", document.currentScript.src).href;
  a.textContent = "← Portafolio";
  a.setAttribute("aria-label", "Volver al portafolio");
  a.style.cssText = "position:fixed;left:16px;bottom:16px;z-index:2147483647;padding:10px 16px;border-radius:999px;" +
    "background:#0b1120;color:#fff;font:600 14px/1 system-ui,sans-serif;text-decoration:none;" +
    "box-shadow:0 8px 24px rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.15)";
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(a); });
})();
