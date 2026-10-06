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

  /* Scroll reveal for About now / strengths */
  var revealTargets = document.querySelectorAll(".reveal-block");
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

  /* About career flight: click through eras with fly animation */
  var flightPanels = document.querySelectorAll(".flight-panel");
  var flightTicks = document.querySelectorAll("[data-flight-index]");
  var flightYear = document.getElementById("flight-year");
  var flightCount = document.getElementById("flight-count");
  var flightRail = document.getElementById("flight-rail-fill");
  var flightPrev = document.getElementById("flight-prev");
  var flightNext = document.getElementById("flight-next");
  var flightIndex = 0;
  var flightBusy = false;
  var flightReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function setFlight(index, direction) {
    if (!flightPanels.length) return;
    index = Math.max(0, Math.min(flightPanels.length - 1, index));
    if (index === flightIndex && flightPanels[index].classList.contains("is-active")) {
      return;
    }
    if (flightBusy && !flightReduce) return;
    var prev = flightIndex;
    var dir = direction || (index >= prev ? 1 : -1);
    flightIndex = index;
    flightBusy = true;

    flightPanels.forEach(function (panel, i) {
      var active = i === index;
      panel.classList.toggle("is-active", active);
      panel.classList.toggle("dir-back", active && dir < 0);
      if (active) {
        panel.removeAttribute("hidden");
      } else {
        panel.setAttribute("hidden", "");
      }
    });

    flightTicks.forEach(function (tick, i) {
      var active = i === index;
      tick.classList.toggle("is-active", active);
      tick.setAttribute("aria-selected", active ? "true" : "false");
      tick.tabIndex = active ? 0 : -1;
    });

    if (flightCount) {
      flightCount.textContent = index + 1 + " / " + flightPanels.length;
    }
    if (flightRail) {
      flightRail.style.width = ((index + 1) / flightPanels.length) * 100 + "%";
    }
    if (flightPrev) flightPrev.disabled = index === 0;
    if (flightNext) flightNext.disabled = index === flightPanels.length - 1;

    var yearText = flightPanels[index].getAttribute("data-year") || "";
    if (flightYear) {
      if (flightReduce) {
        flightYear.textContent = yearText;
        flightYear.classList.remove("is-fly-out", "is-fly-in");
      } else {
        flightYear.classList.remove("is-fly-in");
        flightYear.classList.add("is-fly-out");
        window.setTimeout(function () {
          flightYear.textContent = yearText;
          flightYear.classList.remove("is-fly-out");
          flightYear.classList.add("is-fly-in");
        }, 180);
      }
    }

    window.setTimeout(function () {
      flightBusy = false;
    }, flightReduce ? 0 : 480);
  }

  if (flightPanels.length) {
    flightTicks.forEach(function (tick) {
      tick.addEventListener("click", function () {
        setFlight(Number(tick.getAttribute("data-flight-index")));
      });
      tick.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          setFlight(flightIndex + 1, 1);
          if (flightTicks[flightIndex]) flightTicks[flightIndex].focus();
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          setFlight(flightIndex - 1, -1);
          if (flightTicks[flightIndex]) flightTicks[flightIndex].focus();
        }
      });
    });
    if (flightPrev) {
      flightPrev.addEventListener("click", function () {
        setFlight(flightIndex - 1, -1);
      });
    }
    if (flightNext) {
      flightNext.addEventListener("click", function () {
        setFlight(flightIndex + 1, 1);
      });
    }
    flightIndex = -1;
    setFlight(0, 1);
  }

  /* Methodology explorer: hover preview + click to pin, no scroll-spy */
  var methodBoard = document.querySelector("[data-method-board]");
  if (methodBoard) {
    var methodReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var methodChips = methodBoard.querySelectorAll("[data-method-step]");
    var methodStage = methodBoard.querySelector(".method-stage");
    var methodIndexEl = methodBoard.querySelector("[data-method-index]");
    var methodTitleEl = methodBoard.querySelector("[data-method-title]");
    var methodJobEl = methodBoard.querySelector("[data-method-job]");
    var methodCopyEl = methodBoard.querySelector("[data-method-copy]");
    var methodCountEl = methodBoard.querySelector("[data-method-count]");
    var methodProgressEl = methodBoard.querySelector("[data-method-progress]");
    var methodPrev = methodBoard.querySelector("[data-method-prev]");
    var methodNext = methodBoard.querySelector("[data-method-next]");
    var methodLink = document.createElement("a");
    methodLink.className = "method-stage-link";
    methodLink.href = "work.html#learning";
    methodLink.textContent = "See this in the Allstate course";
    methodLink.hidden = true;
    if (methodCopyEl && methodCopyEl.parentNode) {
      methodCopyEl.parentNode.appendChild(methodLink);
    }

    var methodSteps = [
      {
        num: "01",
        title: "Intake",
        job: "Start with the real job, not the slide deck.",
        copy: "Who needs to do what differently, and what gets in the way? I get the audience, the business need, and the constraints straight before anything gets built."
      },
      {
        num: "02",
        title: "Stakeholders and SMEs",
        job: "Get the experts in the room early.",
        copy: "I work closely with subject-matter experts and stakeholders so the content is true and they can stand behind it. I would rather ship what people can use than everything an expert could say."
      },
      {
        num: "03",
        title: "Recommend",
        job: "Pick the format that fits the time they have.",
        copy: "Sometimes the answer is a course. Sometimes it is a video, or a one-page resource. I pick based on the need, the time people have, and how they will use it on the job."
      },
      {
        num: "04",
        title: "ADDIE in the work",
        job: "Use the model as a loop, not a ritual.",
        copy: "Analyze, design, build, launch, and check. Scope and polish flex with the problem. I don’t drag a small need through a giant process."
      },
      {
        num: "05",
        title: "Practice along the way",
        job: "Let people try it before the quiz.",
        copy: "People should try the decision before they get graded on it. I build practice into the course so they can stumble in a safe place.",
        link: true
      },
      {
        num: "06",
        title: "Assessment",
        job: "See what they can do when they leave.",
        copy: "I measure the skill, then explain the rule in the feedback. A score without a reason does not help anyone the next day."
      },
      {
        num: "07",
        title: "Analytics and follow-through",
        job: "Launch is not the finish line.",
        copy: "After it ships I look at the data and the feedback, then I iterate. If they can close the window, the work is not over."
      }
    ];

    var methodPinned = 0;
    var methodShown = 0;
    var methodTimer = null;

    function paintMethod(index, animate) {
      var step = methodSteps[index];
      if (!step) return;
      methodShown = index;

      function apply() {
        if (methodIndexEl) methodIndexEl.textContent = step.num;
        if (methodTitleEl) methodTitleEl.textContent = step.title;
        if (methodJobEl) methodJobEl.textContent = step.job;
        if (methodCopyEl) methodCopyEl.textContent = step.copy;
        methodLink.hidden = !step.link;
        if (methodCountEl) methodCountEl.textContent = index + 1 + " / " + methodSteps.length;
        if (methodProgressEl) {
          methodProgressEl.style.width = ((index + 1) / methodSteps.length) * 100 + "%";
        }
        if (methodStage) {
          methodStage.setAttribute("aria-labelledby", "chip-" + (index + 1));
          methodStage.classList.remove("is-switching");
        }
        if (methodPrev) methodPrev.disabled = index === 0;
        if (methodNext) methodNext.disabled = index === methodSteps.length - 1;
      }

      if (animate && !methodReduce && methodStage) {
        methodStage.classList.add("is-switching");
        window.clearTimeout(methodTimer);
        methodTimer = window.setTimeout(apply, 160);
      } else {
        apply();
      }

      methodChips.forEach(function (chip, i) {
        var active = i === methodPinned;
        var hot = i === index;
        chip.classList.toggle("is-active", active);
        chip.classList.toggle("is-hot", hot && !active);
        chip.setAttribute("aria-selected", active ? "true" : "false");
        chip.tabIndex = active ? 0 : -1;
      });
    }

    function pinMethod(index) {
      methodPinned = Math.max(0, Math.min(methodSteps.length - 1, index));
      paintMethod(methodPinned, true);
    }

    function previewMethod(index) {
      paintMethod(index, true);
    }

    methodChips.forEach(function (chip, i) {
      chip.addEventListener("mouseenter", function () {
        previewMethod(i);
      });
      chip.addEventListener("focus", function () {
        previewMethod(i);
      });
      chip.addEventListener("click", function () {
        pinMethod(i);
      });
      chip.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown" || e.key === "ArrowRight") {
          e.preventDefault();
          pinMethod(methodPinned + 1);
          if (methodChips[methodPinned]) methodChips[methodPinned].focus();
        } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
          e.preventDefault();
          pinMethod(methodPinned - 1);
          if (methodChips[methodPinned]) methodChips[methodPinned].focus();
        }
      });
    });

    methodBoard.addEventListener("mouseleave", function () {
      paintMethod(methodPinned, true);
    });

    if (methodPrev) {
      methodPrev.addEventListener("click", function () {
        pinMethod(methodPinned - 1);
      });
    }
    if (methodNext) {
      methodNext.addEventListener("click", function () {
        pinMethod(methodPinned + 1);
      });
    }

    paintMethod(0, false);
  }
})();
