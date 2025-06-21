"use strict";
import { elements } from "./ui.js";
import { speak } from "./speech.js";
import { getWordClass, getWordRole } from "./wordClasses.js";

const INSTRUCTIONS =
  "Drag the words into the drop zone to form the sentence. Tap Check Answer when you are done.";

const sentenceCache = {};
const sessionLength = 10;

let puzzles = [];
let currentPuzzleIndex = 0;
let score = 0;

let currentLevel = localStorage.getItem("currentLevel") || "p3";
let xp = +localStorage.getItem("xp") || 0;
let streak = +localStorage.getItem("streak") || 0;
let badges = JSON.parse(localStorage.getItem("badges") || "[]");

let draggedItem = null;
let hintUsed = false;
let timer = null;
let timerEnabled = JSON.parse(localStorage.getItem("timerMode") || "false");

const hideTooltip = () => {
  const t = document.querySelector(".word-tooltip");
  if (t) t.remove();
};

const showTooltip = (e) => {
  hideTooltip();
  const role = e.currentTarget.dataset.role;
  if (!role) return;

  const tt = document.createElement("div");
  tt.className = "word-tooltip";
  tt.textContent = role;

  const rect = e.currentTarget.getBoundingClientRect();
  tt.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
  tt.style.top = `${rect.top + window.scrollY - 8}px`;
  tt.style.transform = "translateX(-50%)";

  document.body.appendChild(tt);
};

const startTimer = () => {
  clearInterval(timer);
  elements.timerDisplay.textContent = "";
  if (!timerEnabled) return;
  let remaining = 30;
  elements.timerDisplay.textContent = `${remaining}`;
  timer = setInterval(() => {
    remaining--;
    elements.timerDisplay.textContent = `${remaining}`;
    if (remaining <= 0) {
      clearInterval(timer);
      elements.timerDisplay.textContent = "";
      elements.submitBtn.disabled = true;
      elements.successMessage.textContent = "Time up!";
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
  elements.timerDisplay.textContent = "";
};

export async function loadSentencesForLevel(level) {
  if (sentenceCache[level]) return sentenceCache[level];
  try {
    const r = await fetch(`data/${level}.json`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    sentenceCache[level] = data;
    return data;
  } catch {
    elements.puzzleContainer.textContent = "Error loading data.";
    return [];
  }
}
export const getSentencesForLevel = (lvl) => sentenceCache[lvl] || [];

export const handleDragStart = (e) => {
  draggedItem = e.target;
  draggedItem.classList.add("dragging");
  hideTooltip();
};
export const handleDragOver = (e) => {
  e.preventDefault();
  e.currentTarget.classList.add("active");
};
export const handleDragEnd = () => {
  if (draggedItem) draggedItem.classList.remove("dragging");
  draggedItem = null;
};

export const handleDragLeave = (e) => e.currentTarget.classList.remove("active");
export const handleDrop = (e) => {
  e.preventDefault();
  e.currentTarget.classList.remove("active");
  if (!draggedItem) return;
  draggedItem.classList.remove("hint");
  draggedItem.style.backgroundColor = "";
  e.currentTarget.appendChild(draggedItem);
  elements.submitBtn.disabled = false;
  hideTooltip();
};

export const handleTouchStart = (e) => {
  e.preventDefault();
  handleDragStart(e);
};

export const handleTouchMove = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  document
    .querySelectorAll(".drop-zone.active")
    .forEach((dz) => dz.classList.remove("active"));
  const dropZone = target && target.closest(".drop-zone");
  if (dropZone) {
    dropZone.classList.add("active");
  }
};

export const handleTouchEnd = (e) => {
  e.preventDefault();
  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropZone = target && target.closest(".drop-zone");
  if (dropZone && draggedItem) {
    dropZone.classList.remove("active");
    draggedItem.classList.remove("hint");
    draggedItem.style.backgroundColor = "";
    dropZone.appendChild(draggedItem);
    elements.submitBtn.disabled = false;
    hideTooltip();
  }
  handleDragEnd();
};

async function generatePuzzles() {
  const sentences = await loadSentencesForLevel(currentLevel);
  if (!sentences.length) {
    puzzles = [];
    return;
  }
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  puzzles = shuffled.slice(0, sessionLength).map((sentence) => {
    const words = sentence.trim().split(/\s+/);
    return {
      sentence,
      words,
      shuffled: [...words].sort(() => Math.random() - 0.5),
    };
  });
  currentPuzzleIndex = 0;
  score = 0;
}

function displayCurrentPuzzle() {
  hintUsed = false;
  if (currentPuzzleIndex < 0) currentPuzzleIndex = 0;
  if (currentPuzzleIndex >= puzzles.length)
    currentPuzzleIndex = puzzles.length - 1;

  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;

  elements.puzzleContainer.innerHTML = "";
  elements.successMessage.textContent = "";
  elements.hint.textContent = "";

  const wordBank = document.createElement("div");
  wordBank.className = "word-bank";
  puzzle.shuffled.forEach((w, idx) => {
    const span = document.createElement("span");
    span.textContent = w;
    span.dataset.index = idx;
    span.dataset.role = getWordRole(w, puzzle.words.indexOf(w), puzzle.words);
    span.className = `word ${getWordClass(w)}`;
    span.draggable = true;
    span.addEventListener("dragstart", handleDragStart);
    span.addEventListener("dragend", handleDragEnd);
    span.addEventListener("mouseenter", showTooltip);
    span.addEventListener("mouseleave", hideTooltip);
    wordBank.appendChild(span);
  });

  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";
  dropZone.addEventListener("dragover", handleDragOver);
  dropZone.addEventListener("dragleave", handleDragLeave);
  dropZone.addEventListener("drop", handleDrop);

  elements.puzzleContainer.append(wordBank, dropZone);

  elements.submitBtn.disabled = true;
  elements.tryAgainBtn.style.display = "none";
  elements.prevBtn.disabled = currentPuzzleIndex === 0;
  elements.nextBtn.disabled = true;

 const progressPercent = (currentPuzzleIndex / sessionLength) * 100;
  elements.progressBar.style.width = `${progressPercent}%`;
  elements.progressBar.setAttribute("aria-valuenow", progressPercent.toString());
  elements.progressLabel.textContent = `Puzzle ${currentPuzzleIndex + 1}/${sessionLength}`;
  elements.progressIndicator.textContent = `Mastery Progress: ${Math.round((score / sessionLength) * 100)}% (80% to advance)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
  elements.badgesList.textContent = badges.join(", ");

  startTimer();
}

function revealAnswer() {
  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;

  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  if (!dropZone) return;

  dropZone.innerHTML = "";
  puzzle.words.forEach((w) => {
    const span = document.createElement("span");
    span.textContent = w;
    span.className = `word ${getWordClass(w)} correct`;
    dropZone.appendChild(span);
  });

  elements.submitBtn.disabled = true;
  elements.tryAgainBtn.style.display = "none";
  elements.nextBtn.disabled = false;
  elements.successMessage.textContent = "Here is the correct order.";
  speak(puzzle.sentence);
  stopTimer();
}

function checkAnswer() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const attempt = Array.from(dropZone.children).map((ch) => ch.textContent);
  const puzzle = puzzles[currentPuzzleIndex];

  if (attempt.length !== puzzle.words.length) return;

  const correct = puzzle.words.every((w, i) => w === attempt[i]);
  if (correct) {
    dropZone.querySelectorAll(".word").forEach((w) => w.classList.add("correct"));
    elements.successMessage.textContent = "Great job!";
    animateSuccessMessage();
    score++;
    streak++;
    xp += 10;
    elements.nextBtn.disabled = false;
    elements.submitBtn.disabled = true;
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("streak", streak.toString());
    speak(puzzle.sentence);
    stopTimer();
  } else {
    dropZone.querySelectorAll(".word").forEach((w) => w.classList.add("incorrect"));
    elements.successMessage.textContent = "Try again!";
    elements.tryAgainBtn.style.display = "inline-block";
    streak = 0;
    localStorage.setItem("streak", "0");
  }

  elements.progressIndicator.textContent = `Mastery Progress: ${Math.round((score / sessionLength) * 100)}% (80% to advance)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
}

function showHint() {
  if (hintUsed) return;
  const puzzle = puzzles[currentPuzzleIndex];
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!puzzle || !dropZone || !wordBank) return;
  const nextIndex = dropZone.children.length;
  if (nextIndex >= puzzle.words.length) return;
  const nextWord = puzzle.words[nextIndex];
  const wordEl = Array.from(wordBank.children).find(
    (w) => w.textContent === nextWord && !w.classList.contains("hint")
  );
  if (wordEl) {
    const role = getWordRole(nextWord, nextIndex, puzzle.words);
    wordEl.classList.add("hint");
    wordEl.style.backgroundColor = `var(--hint-${role}-bg)`;
  }
  elements.hint.textContent = nextWord;
  hintUsed = true;
}

function clearPuzzle() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!dropZone || !wordBank) return;
  Array.from(dropZone.children).forEach((ch) => {
    ch.classList.remove("correct", "incorrect", "hint");
    ch.style.backgroundColor = "";
    wordBank.appendChild(ch);
  });
  elements.submitBtn.disabled = true;
  elements.successMessage.textContent = "";
  hideTooltip();
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleTheme() {
  elements.body.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    elements.body.classList.contains("light-theme") ? "light" : "dark"
  );
}

async function resetQuiz() {
  await generatePuzzles();
  displayCurrentPuzzle();
}

elements.submitBtn.addEventListener("click", checkAnswer);
elements.nextBtn.addEventListener("click", () => {
  if (currentPuzzleIndex < puzzles.length - 1) currentPuzzleIndex++;
  displayCurrentPuzzle();
});
elements.prevBtn.addEventListener("click", () => {
  if (currentPuzzleIndex > 0) currentPuzzleIndex--;
  displayCurrentPuzzle();
});
elements.hintBtn.addEventListener("click", showHint);
elements.tryAgainBtn.addEventListener("click", revealAnswer);
elements.clearBtn.addEventListener("click", clearPuzzle);
elements.resetBtn.addEventListener("click", resetQuiz);
elements.listenBtn.addEventListener("click", () => speak(INSTRUCTIONS));
elements.fullscreenBtn.addEventListener("click", toggleFullscreen);
elements.themeToggle.addEventListener("click", toggleTheme);
elements.helpBtn.addEventListener("click", () => {
  elements.tutorialOverlay.classList.remove("hidden");
});
elements.timerMode.addEventListener("change", (e) => {
  timerEnabled = e.target.checked;
  localStorage.setItem("timerMode", timerEnabled);
});
elements.levelSelect.addEventListener("change", async (e) => {
  currentLevel = e.target.value;
  localStorage.setItem("currentLevel", currentLevel);
  await resetQuiz();
});
elements.tutorialNext.addEventListener("click", () => {
  elements.tutorialOverlay.classList.add("hidden");
  localStorage.setItem("tutorialSeen", "yes");
});

function loadSettings() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    elements.body.classList.add("light-theme");
  }
  timerEnabled = JSON.parse(localStorage.getItem("timerMode") || "false");
  elements.timerMode.checked = timerEnabled;
  if (!localStorage.getItem("tutorialSeen")) {
    elements.tutorialOverlay.classList.remove("hidden");
  }
  elements.levelSelect.value = currentLevel;
}

function animateSuccessMessage() {
  if (window.gsap) {
    gsap.fromTo(
      elements.successMessage,
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.5 }
    );
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
  loadSettings();
  await generatePuzzles();
  displayCurrentPuzzle();
});
