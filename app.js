(function () {
  "use strict";

  var WA_PLACEHOLDER = "REPLACE_PHONE_E164";
  var waNumber = "";

  try {
    waNumber = (window.__WA_NUMBER__ || "").replace(/\D/g, "");
  } catch (e) {
    waNumber = "";
  }

  var waHref =
    waNumber.length >= 8
      ? "https://wa.me/" + waNumber
      : "https://wa.me/" + WA_PLACEHOLDER;

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", waHref);
  });

  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var form = document.getElementById("case-form");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var name = String(data.get("full-name") || "").trim();
    var phone = String(data.get("phone") || "").trim();
    var caseSummary = String(data.get("case-summary") || "").trim();

    var digits = waNumber.length >= 8 ? waNumber : WA_PLACEHOLDER.replace(/\D/g, "");
    if (!digits) {
      digits = waNumber;
    }

    var message =
      "Hola, necesito ayuda legal urgente.%0A%0A*Nombre:* " +
      name +
      "%0A*Teléfono:* " +
      phone +
      "%0A*Mi caso:* " +
      caseSummary;
    var encodedString = encodeURIComponent(
      message.split("%0A").join("\n")
    );

    var url = "https://wa.me/" + digits + "?text=" + encodedString;
    window.open(url, "_blank", "noopener,noreferrer");
  });
})();
