"use strict";
import { elements } from "./ui.js";
import { speak } from "./speech.js";
import { getWordClass } from "./wordClasses.js";

  // **Hide Tooltip Helper**
  const hideTooltip = (e) => {
    const tooltip = document.querySelector(".word-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  };

  // **Sentence Pools for Each Level**
  const sentenceCache = {};

  const loadSentencesForLevel = async (level) => {
    if (sentenceCache[level]) return sentenceCache[level];
    try {
      const response = await fetch(`data/${level}.json`);
      if (!response.ok) throw new Error("Failed to load sentences");
      const data = await response.json();
      sentenceCache[level] = data;
      return data;
    } catch (err) {
      console.error(err);
      elements.puzzleContainer.textContent =
        "Error loading level data. Please run a local server.";
      return [];
    }
  };

  const getSentencesForLevel = (level) => sentenceCache[level] || [];

  // **Game State Variables**
  const sessionLength = 10;
  let puzzles = [];
  let currentPuzzleIndex = 0;
  let score = 0;
  let currentLevel = localStorage.getItem("currentLevel") || "p3";
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let badges = JSON.parse(localStorage.getItem("badges")) || [];
  let timeLeft = 30, timerId = null;
  let hintCount = 0;
  let currentDropZone = null;
  let puzzleAttempts = 0;
  let correctCount = 0;
  const today = new Date().toDateString();
  if (
    localStorage.getItem("lastPlayDate") &&
    localStorage.getItem("lastPlayDate") !== today
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (localStorage.getItem("lastPlayDate") !== yesterday.toDateString())
@@ -204,91 +157,96 @@
    wordBank.setAttribute("role", "list");

    currentDropZone = document.createElement("div");
    currentDropZone.className = "drop-zone";
    currentDropZone.setAttribute("aria-label", "Drop Zone");
    currentDropZone.setAttribute("role", "list");

    container.appendChild(wordBank);
    container.appendChild(currentDropZone);

    wordBank.style.display = "grid";
    wordBank.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
    wordBank.style.gap = "20px";
    currentDropZone.style.display = "grid";
    currentDropZone.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px,1fr))";
    currentDropZone.style.gap = "20px";

    [wordBank, currentDropZone].forEach((zone) => {
      zone.addEventListener("dragover", handleDragOver);
      zone.addEventListener("dragleave", handleDragLeave);
      zone.addEventListener("drop", handleDrop);
    });

    if (!puzzle.submitted) {
      const wordsShuffled = shuffle([...puzzle.correct]);
      wordsShuffled.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.setAttribute("role", "listitem");
        wordDiv.tabIndex = 0;
        wordDiv.textContent = word;
        wordDiv.draggable = true;
        const role = getWordRole(word, puzzle.correct.indexOf(word), puzzle.correct);
        wordDiv.dataset.role = role;
        const cls = getWordClass(word);
        wordDiv.dataset.class = cls;
        wordDiv.classList.add(cls);
        wordDiv.addEventListener("dragstart", handleDragStart);
        wordDiv.addEventListener("dragend", handleDragEnd);
        wordDiv.addEventListener("mouseover", showTooltip);
        wordDiv.addEventListener("mouseout", hideTooltip);
        wordDiv.addEventListener("touchstart", showTouchTooltip, { passive: true });
        wordDiv.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && wordDiv.parentElement.classList.contains("drop-zone"))
            removeWord(e);
        });
        wordBank.appendChild(wordDiv);
      });
      if (!currentDropZone.children.length) {
        const placeholder = document.createElement("div");
        placeholder.className = "drop-placeholder";
        placeholder.textContent = "Drag words here to build your sentence!";
        currentDropZone.appendChild(placeholder);
      }
    } else {
      puzzle.userAnswer.forEach((word, index) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.textContent = word;
        const cls = getWordClass(word);
        wordDiv.dataset.class = cls;
        wordDiv.classList.add(cls);
        const isCorrect = word === puzzle.correct[index];
        wordDiv.classList.add(isCorrect ? "correct" : "incorrect");
        wordDiv.dataset.correctWord = puzzle.correct[index];
        if (!isCorrect) {
          wordDiv.style.cursor = "pointer";
          wordDiv.addEventListener("click", correctWord);
        }
        currentDropZone.appendChild(wordDiv);
      });
      elements.submitBtn.style.display = "none";
      elements.tryAgainBtn.style.display = "inline-block";
    }

    elements.puzzleContainer.appendChild(container);
    timeLeft = 30;
    startTimer();
    checkCompletion();
    elements.progress.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${sessionLength}${
      document.getElementById("timer-mode").checked ? ` - Time: ${timeLeft}s` : ""
    }`;
    elements.score.textContent = `Score: ${score}`;
    elements.progressBar.style.width = `${((currentPuzzleIndex + 1) / sessionLength) * 100}%`;
    elements.progressIndicator.textContent = `Mastery Progress: ${
      puzzleAttempts > 0 ? Math.round((correctCount / puzzleAttempts) * 100) : 0
    }% (80% to advance)`;
    elements.progressLabel.innerHTML = `<img src="images/star.png" alt="Star" class="progress-icon"> Puzzle ${
      currentPuzzleIndex + 1
    }/${sessionLength}`;
  };

  // **Drag-and-Drop Event Handlers**
  let draggedItem = null;
  const handleDragStart = (e) => {
    draggedItem = e.target;
@@ -400,122 +358,124 @@
         "#ff6f61",
         "#ff9f1c",
         "#ffcc00",
         "#98fb98",
         "#40c4ff",
       ][Math.floor(Math.random() * 5)];
       confettiContainer.appendChild(confetti);
     }
     setTimeout(() => confettiContainer.remove(), 5000);
   }

   // **Animate Success Message with GSAP**
   function animateSuccessMessage() {
     gsap.fromTo(
       elements.successMessage,
       { scale: 0, opacity: 0 },
       { scale: 1, opacity: 1, duration: 0.6, ease: "bounce.out" }
     );
   }

   // **Show Tooltip on Hover**
   const showTooltip = (e) => {
     const word = e.target.textContent;
     const puzzle = puzzles[currentPuzzleIndex];
     const index = puzzle.correct.indexOf(word);
     const role = index !== -1 ? getWordRole(word, index, puzzle.correct) : "unknown";
     const cls = getWordClass(word);
     let tip = cls !== "other" ? `${cls.charAt(0).toUpperCase() + cls.slice(1)}. ` : "";
     switch (role) {
       case "subject":
         tip += "Subject: Who does it?";
         break;
       case "verb":
         tip += "Verb: What happens?";
         break;
       case "object":
         tip += "Object: What’s it about?";
         break;
       case "end":
         tip += "End: This ends the sentence.";
         break;
       default:
         tip += "Other: Part of the sentence.";
     }
     const tooltip = document.createElement("div");
     tooltip.textContent = tip;
     tooltip.className = "word-tooltip";
     tooltip.style.position = "absolute";
     tooltip.style.background = "rgba(0, 0, 0, 0.8)";
     tooltip.style.color = "white";
     tooltip.style.padding = "8px 12px";
     tooltip.style.borderRadius = "10px";
     tooltip.style.fontSize = "1em";
     tooltip.style.zIndex = "10";
     const rect = e.target.getBoundingClientRect();
     const scrollY = window.scrollY || document.documentElement.scrollTop;
     tooltip.style.top = `${rect.bottom + scrollY + 5}px`;
     tooltip.style.left = `${rect.left}px`;
     const tooltipRect = tooltip.getBoundingClientRect();
     if (tooltipRect.right > window.innerWidth)
       tooltip.style.left = `${window.innerWidth - tooltipRect.width - 5}px`;
     if (tooltipRect.bottom > window.innerHeight)
       tooltip.style.top = `${rect.top + scrollY - tooltipRect.height - 5}px`;
     document.body.appendChild(tooltip);
     e.target.addEventListener("mouseout", () => tooltip.remove(), { once: true });
   };

   // **Show Tooltip on Touch (Long Press)**
   const showTouchTooltip = (e) => {
     let timer;
     const touchMove = () => clearTimeout(timer);
     const touchEnd = () => {
       clearTimeout(timer);
       document.removeEventListener("touchmove", touchMove);
       document.removeEventListener("touchend", touchEnd);
     };
     timer = setTimeout(() => {
       const word = e.target.textContent;
       const puzzle = puzzles[currentPuzzleIndex];
       const index = puzzle.correct.indexOf(word);
       const role = index !== -1 ? getWordRole(word, index, puzzle.correct) : "unknown";
       const cls = getWordClass(word);
       let tip = cls !== "other" ? `${cls.charAt(0).toUpperCase() + cls.slice(1)}. ` : "";
       switch (role) {
         case "subject":
           tip += "Subject: Who does it?";
           break;
         case "verb":
           tip += "Verb: What happens?";
           break;
         case "object":
           tip += "Object: What’s it about?";
           break;
         case "end":
           tip += "End: This ends the sentence.";
           break;
         default:
           tip += "Other: Part of the sentence.";
       }
       const tooltip = document.createElement("div");
       tooltip.textContent = tip;
       tooltip.className = "word-tooltip";
       tooltip.style.position = "absolute";
       tooltip.style.background = "rgba(0, 0, 0, 0.7)";
       tooltip.style.color = "white";
       tooltip.style.padding = "5px 10px";
       tooltip.style.borderRadius = "4px";
       tooltip.style.fontSize = "0.8em";
       tooltip.style.zIndex = "10";
       const rect = e.target.getBoundingClientRect();
       const scrollY = window.scrollY || document.documentElement.scrollTop;
       tooltip.style.top = `${rect.bottom + scrollY + 5}px`;
       tooltip.style.left = `${rect.left}px`;
       const tooltipRect = tooltip.getBoundingClientRect();
       if (tooltipRect.right > window.innerWidth)
         tooltip.style.left = `${window.innerWidth - tooltipRect.width - 5}px`;
       if (tooltipRect.bottom > window.innerHeight)
         tooltip.style.top = `${rect.top + scrollY - tooltipRect.height - 5}px`;
       document.body.appendChild(tooltip);
       e.target.addEventListener("touchend", () => tooltip.remove(), { once: true });
     }, 500);
     document.addEventListener("touchmove", touchMove);
     document.addEventListener("touchend", touchEnd);
   };
@@ -846,26 +806,25 @@
   document.getElementById("level-select").addEventListener("change", async (e) => {
     currentLevel = e.target.value;
     await resetQuiz();
   });
   document.getElementById("fullscreen-btn").addEventListener("click", toggleFullScreen);
   document.getElementById("theme-toggle").addEventListener("click", () => {
     const body = document.body;
     if (body.classList.contains("pastel-theme")) {
       body.classList.remove("pastel-theme");
       body.classList.add("rainbow-theme");
       speak("Switched to Rainbow Fun theme!");
     } else if (body.classList.contains("rainbow-theme")) {
       body.classList.remove("rainbow-theme");
       speak("Switched to Bright Playful theme!");
     } else {
       body.classList.add("pastel-theme");
       speak("Switched to Pastel Calm theme!");
     }
   });

   // **Initialize Game on Page Load**
   document.addEventListener("DOMContentLoaded", async () => {
     await generatePuzzles();
     displayCurrentPuzzle();
   });
