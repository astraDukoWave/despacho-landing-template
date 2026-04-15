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

  var waOrigin = "";
  try {
    waOrigin = String(
      (document.body && document.body.getAttribute("data-wa-origin")) || ""
    ).trim();
  } catch (e2) {
    waOrigin = "";
  }

  function appendOriginBlock(message) {
    if (!waOrigin) return message;
    return message + "%0A%0A*Origen:* " + waOrigin;
  }

  var linkHref = waHref;
  if (waOrigin) {
    var linkIntro =
      "Hola, necesito apoyo legal. Me gustaría que canalicen mi caso.%0A%0A*Origen:* " + waOrigin;
    var linkEncoded = encodeURIComponent(
      linkIntro.split("%0A").join("\n")
    );
    linkHref = waHref + "?text=" + linkEncoded;
  }

  document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
    el.setAttribute("href", linkHref);
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
      "Hola, envié mi caso por el formulario de Apoyo Legal MX. Necesito ayuda.%0A%0A*Nombre:* " +
      name +
      "%0A*Teléfono:* " +
      phone +
      "%0A*Mi caso:* " +
      caseSummary;
    message = appendOriginBlock(message);
    var encodedString = encodeURIComponent(
      message.split("%0A").join("\n")
    );

    var url = "https://wa.me/" + digits + "?text=" + encodedString;

    var waWindow = window.open("about:blank", "_blank");

    var submitBtn = form.querySelector('[type="submit"]');
    var originalText = submitBtn.textContent;
    submitBtn.textContent = "Procesando caso de forma segura\u2026";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.6";
    submitBtn.style.cursor = "wait";

    setTimeout(function () {
      if (waWindow && !waWindow.closed) {
        waWindow.location.href = url;
      }

      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.style.opacity = "";
      submitBtn.style.cursor = "";

      var successEl = document.getElementById("form-success");
      if (successEl) {
        successEl.hidden = false;
        successEl.focus();
      }
    }, 800);
  });
})();
