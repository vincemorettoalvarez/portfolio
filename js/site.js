(function () {
  "use strict";

  function revealCaseFromHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var target = document.getElementById(id);
    if (target && target.tagName === "DETAILS") {
      target.open = true;
    }
  }

  document.querySelectorAll(".case-link").forEach(function (link) {
    link.addEventListener("click", function () {
      var target = document.querySelector(link.getAttribute("href"));
      if (target) target.open = true;
    });
  });

  window.addEventListener("hashchange", revealCaseFromHash);
  revealCaseFromHash();

  var details = document.getElementById("learning-details");
  if (details && !location.hash) details.open = false;

  /* About page timeline */
  var stops = document.querySelectorAll(".timeline-stop");
  if (stops.length) {
    stops.forEach(function (stop) {
      stop.addEventListener("click", function () {
        var expanded = stop.getAttribute("aria-expanded") === "true";
        stops.forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
        });
        stop.setAttribute("aria-expanded", expanded ? "false" : "true");
      });

      stop.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          stop.click();
        }
      });
    });

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2, rootMargin: "0px 0px -8% 0px" }
      );
      stops.forEach(function (stop) {
        observer.observe(stop);
      });
    } else {
      stops.forEach(function (stop) {
        stop.classList.add("is-visible");
      });
    }
  }
})();
