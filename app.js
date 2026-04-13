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
  var successEl = document.getElementById("form-success");

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    var data = new FormData(form);
    var payload = {
      fullName: String(data.get("full-name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      caseSummary: String(data.get("case-summary") || "").trim(),
      submittedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(
        "landing_case_leads",
        JSON.stringify(
          JSON.parse(localStorage.getItem("landing_case_leads") || "[]").concat(
            payload
          )
        )
      );
    } catch (err) {
      /* storage full or disabled — still show confirmation */
    }

    form.reset();
    if (successEl) {
      successEl.hidden = false;
      successEl.focus();
    }
  });
})();
