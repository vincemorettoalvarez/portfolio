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

  /* Scroll reveal: text first, media slightly after via CSS delay */
  var revealTargets = document.querySelectorAll(".timeline-stop[data-reveal], .reveal-block");
  if (revealTargets.length) {
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
        { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }
      );
      revealTargets.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealTargets.forEach(function (el) {
        el.classList.add("is-visible");
      });
    }
  }

  /* Methodology walkthrough: path progress, step spotlight, rail sync */
  var methodSteps = document.querySelectorAll(".method-step[data-step]");
  var progressFill = document.getElementById("method-progress-fill");
  var railLinks = document.querySelectorAll("[data-step-link]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setActiveStep(stepNum) {
    methodSteps.forEach(function (step) {
      var active = String(step.getAttribute("data-step")) === String(stepNum);
      step.classList.toggle("is-active", active);
      step.classList.toggle("is-seen", Number(step.getAttribute("data-step")) <= Number(stepNum));
    });
    railLinks.forEach(function (link) {
      var active = String(link.getAttribute("data-step-link")) === String(stepNum);
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "step");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (methodSteps.length) {
    if ("IntersectionObserver" in window) {
      var stepObserver = new IntersectionObserver(
        function (entries) {
          var visible = entries
            .filter(function (e) { return e.isIntersecting; })
            .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
          if (visible.length) {
            setActiveStep(visible[0].target.getAttribute("data-step"));
          }
        },
        { threshold: [0.35, 0.55, 0.75], rootMargin: "-18% 0px -35% 0px" }
      );
      methodSteps.forEach(function (step) {
        stepObserver.observe(step);
        if (!reduceMotion) {
          step.classList.add("method-step--animate");
        } else {
          step.classList.add("is-seen", "is-active");
        }
      });
    } else {
      setActiveStep(1);
      methodSteps.forEach(function (step) {
        step.classList.add("is-seen");
      });
    }

    if (!reduceMotion && progressFill) {
      var walk = document.getElementById("method-walk");
      function updatePathProgress() {
        if (!walk) return;
        var rect = walk.getBoundingClientRect();
        var viewH = window.innerHeight || 1;
        var start = viewH * 0.55;
        var end = rect.height + viewH * 0.2;
        var traveled = start - rect.top;
        var pct = Math.max(0, Math.min(1, traveled / end)) * 100;
        progressFill.style.width = pct + "%";
      }
      window.addEventListener("scroll", updatePathProgress, { passive: true });
      window.addEventListener("resize", updatePathProgress);
      updatePathProgress();
    } else if (progressFill) {
      progressFill.style.width = "100%";
    }
  }
})();
