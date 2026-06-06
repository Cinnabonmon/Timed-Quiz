// script.js — Timed Quiz (Bootstrap UI) — UNSOLVED SCAFFOLD
// Instructions:
// 1) Fill in each TODO step in order.
// 2) Keep logic inside the IIFE to avoid globals.
// 3) Use console.log() liberally while building (DevTools > Console).

(function () {
  "use strict";

  // -----------------------------
  // 1) DATA (students: swap this out with your own data if you want!)
  // -----------------------------
  const questions = [
    {
      q: "What does DOM stand for?",
      choices: [
        "Data Object Map",
        "Document Object Model",
        "Document Oriented Markup",
      ],
      answer: 1,
    },
    { q: "Strict equality operator?", choices: ["==", "===", "!="], answer: 1 },
    {
      q: "Method to select one element?",
      choices: ["getElementsByClassName", "querySelectorAll", "querySelector"],
      answer: 2,
    },
    {
      q: "Add an event listener?",
      choices: ["onClick", "addEventListener", "attachEvent"],
      answer: 1,
    },
    {
      q: "LocalStorage stores…",
      choices: ["Only objects", "Only numbers", "Strings"],
      answer: 2,
    },
    {
      q: "Stop an interval?",
      choices: ["cancelInterval", "clearInterval", "stopInterval"],
      answer: 1,
    },
    {
      q: "Array last index?",
      choices: ["length", "length-1", "length+1"],
      answer: 1,
    },
    {
      q: "Prevent form default?",
      choices: ["event.preventDefault()", "event.stop()", "event.block()"],
      answer: 0,
    },
    {
      q: "Create element?",
      choices: [
        "document.makeElement",
        "document.createElement",
        "new HTMLElement()",
      ],
      answer: 1,
    },
    {
      q: "Get attribute?",
      choices: ["el.attr()", "el.getAttribute()", "el.attribute()"],
      answer: 1,
    },
  ];

  // Shuffle questions on load (Fisher-Yates algorithm)
  function shuffleArray(array) {
    for (let i = array.length - 1; i >= 1; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    console.log("Shuffled questions:", array);
    return array;
  }

  // -----------------------------
  // 2) STATE
  // -----------------------------
  let i = 0; // current question index
  let score = 0; // number of correct answers
  let highScore = localStorage.getItem("highScore") || 0; // track highest score across attempts (optional)
  const total = questions.length;
  let timeLeft = 60; // seconds remaining
  let timerId = null; // holds the setInterval id

  // -----------------------------
  // 3) ELEMENT REFERENCES
  // -----------------------------
  // These IDs must exist in your HTML
  const qText = document.getElementById("questionText");
  const qIndex = document.getElementById("qIndex");
  const qTotal = document.getElementById("qTotal");
  const choices = document.getElementById("choices");

  const timeText = document.getElementById("timeText");
  const timeBar = document.getElementById("timeBar");
  const scoreBadge = document.getElementById("scoreBadge");
  const feedback = document.getElementById("feedback");
  const skipBtn = document.getElementById("skipBtn");

  // Result modal bits (Bootstrap)
  const resultModalEl = document.getElementById("resultModal");
  // Note: bootstrap.Modal is provided by the Bootstrap bundle (ensure <script src="...bootstrap.bundle.min.js">)
  const resultModal = new bootstrap.Modal(resultModalEl);
  const finalScore = document.getElementById("finalScore");
  const finalTime = document.getElementById("finalTime");
  const highestScore = document.getElementById("highestScore");
  const restartBtn = document.getElementById("restartBtn");

  // Initialize total in UI
  qTotal.textContent = total;

  // -----------------------------
  // 4) RENDER
  // -----------------------------
  function render() {
    // Header + timer labels

    qIndex.textContent = i < total ? i + 1 : total;

    scoreBadge.textContent = `Score: ${score}/10`;

    timeText.textContent = `${timeLeft}s`;

    // Progress bar width & contextual color
    // pct should be the percentage of time remaining (0..100)

    const pct = Math.max(0, Math.round((timeLeft / 60) * 100));

    timeBar.style.width = `${pct}%`;
    timeBar.className =
      "progress-bar progress-bar-striped progress-bar-animated " +
      (pct < 20 ? "bg-danger" : pct < 50 ? "bg-warning" : "bg-success");

    // End state: out of questions OR time is up
    if (i >= total || timeLeft <= 0) {
      endQuiz();
      return;
    }

    // Render current question and choices
    const q = questions[i];

    qText.textContent = q.q;

    choices.innerHTML = "";

    // Create a button for each choice
    q.choices.forEach((label, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn-light text-dark choice-btn rounded-3";
      btn.innerHTML = `<span class="me-2 fw-semibold">${String.fromCharCode(65 + idx)}.</span> ${label}`;

      btn.addEventListener("click", () => handleChoice(idx === q.answer));

      choices.appendChild(btn);
    });

    // Accessibility: move focus to first choice
    const firstBtn = choices.querySelector("button");
    if (firstBtn) firstBtn.focus();
  }

  // -----------------------------
  // 5) HANDLERS
  // -----------------------------
  function handleChoice(isCorrect) {
    if (isCorrect) {
      score++;
      feedback.innerHTML = '<span class="badge bg-success">Correct ✓</span>';
    } else {
      feedback.innerHTML = '<span class="badge bg-danger">Incorrect ✗</span>';
    }

    // OPTIONAL: time penalty (uncomment if you add it)
    // else { timeLeft = Math.max(0, timeLeft - 5); }

    i++;

    // Show feedback briefly, then re-render
    setTimeout(() => {
      feedback.textContent = "";
      render();
    }, 1000);
  }

  // -----------------------------
  // 6) TIMER
  // -----------------------------
  function tick() {
    timeLeft = Math.max(0, timeLeft - 1);

    if (timeLeft === 0) {
      clearInterval(timerId);
    }

    // Re-render UI to reflect new time
    render();
  }

  function startTimer() {
    timerId = setInterval(tick, 1000);
  }

  // -----------------------------
  // 7) END + RESTART
  // -----------------------------
  function endQuiz() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }

    finalScore.textContent = `${score}/10`;
    finalTime.textContent = `${timeLeft}s`;
    highestScore.textContent = `${Math.max(score, highScore)}`;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", score);
    }

    // Show Bootstrap modal
    resultModal.show();
  }

  function restart() {
    i = 0;
    score = 0;
    timeLeft = 60;
    resultModal.hide();
    render();
    startTimer();
  }

  // -----------------------------
  // 8) EVENTS & INIT
  // -----------------------------
  // Skip just advances the question index; do not change score

  skipBtn.addEventListener("click", () => {
    i++;
    render();
  });

  // Restart from modal button

  restartBtn.addEventListener("click", restart);

  // Initial render + timer start

  shuffleArray(questions);
  render();
  startTimer();
})();
