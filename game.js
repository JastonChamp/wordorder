"use strict";
import { elements } from "./ui.js";
import { speak } from "./speech.js";
import { getWordClass, getWordRole } from "./wordClasses.js";

const INSTRUCTIONS =
  "Tap a word to pick it up, then tap the sentence area to place it. Put the words in the right order and tap Check Answer!";

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
let selectedWord = null; // For tap-to-select
let hintUsed = false;
let timer = null;
let remaining = 30;
let isPaused = false;
let timerEnabled = JSON.parse(localStorage.getItem("timerMode") || "false");

// Positive feedback messages for correct answers
const correctMessages = [
  "Great job!",
  "Well done!",
  "You got it!",
  "Amazing!",
  "Super!",
  "Brilliant!",
  "Perfect!",
  "Fantastic!",
  "Awesome work!",
  "You're a star!",
];

const encourageMessages = [
  "Almost! Try again!",
  "Not quite - try moving some words!",
  "Keep trying, you can do it!",
  "So close! Give it another go!",
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ===== Tooltip =====
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

// ===== Timer =====
const startTimer = (start = 30) => {
  clearInterval(timer);
  elements.timerDisplay.textContent = "";
  if (!timerEnabled) return;
  remaining = start;
  elements.timerDisplay.textContent = `${remaining}`;
  timer = setInterval(() => {
    if (!isPaused) {
      remaining--;
      elements.timerDisplay.textContent = `${remaining}`;
    }
    if (remaining <= 0) {
      clearInterval(timer);
      elements.timerDisplay.textContent = "";
      elements.submitBtn.disabled = true;
      elements.successMessage.textContent = "Time's up!";
      elements.successMessage.className = "incorrect-msg";
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
  elements.timerDisplay.textContent = "";
};

const togglePauseTimer = () => {
  if (!timerEnabled) return;
  if (!isPaused) {
    isPaused = true;
    elements.pauseTimerBtn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i> <span class="btn-label">Resume</span>';
  } else {
    isPaused = false;
    elements.pauseTimerBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> <span class="btn-label">Pause</span>';
  }
};

// ===== Data Loading =====
export async function loadSentencesForLevel(level) {
  if (sentenceCache[level]) return sentenceCache[level];
  try {
    const r = await fetch(`data/${level}.json`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    sentenceCache[level] = data;
    return data;
  } catch {
    elements.puzzleContainer.textContent = "Oops! Could not load sentences.";
    return [];
  }
}
export const getSentencesForLevel = (lvl) => sentenceCache[lvl] || [];

// ===== Drag & Drop Handlers =====
export const handleDragStart = (e) => {
  deselectWord();
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
  updateDropZonePlaceholder();
  updateSubmitButton();
  hideTooltip();
};

// ===== Touch Drag Handlers =====
export const handleTouchStart = (e) => {
  // Don't prevent default for tap - only for drag
  const touch = e.touches[0];
  const el = e.currentTarget;
  el._touchStartX = touch.clientX;
  el._touchStartY = touch.clientY;
  el._touchMoved = false;
};

export const handleTouchMove = (e) => {
  e.preventDefault();
  const touch = e.touches[0];
  const el = e.currentTarget;
  const dx = touch.clientX - (el._touchStartX || 0);
  const dy = touch.clientY - (el._touchStartY || 0);
  if (Math.abs(dx) > 8 || Math.abs(dy) > 8) {
    el._touchMoved = true;
    if (!draggedItem) {
      draggedItem = el;
      draggedItem.classList.add("dragging");
      hideTooltip();
    }
  }

  if (draggedItem) {
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    document
      .querySelectorAll(".drop-zone.active, .word-bank.active")
      .forEach((dz) => dz.classList.remove("active"));
    const dropZone = target && (target.closest(".drop-zone") || target.closest(".word-bank"));
    if (dropZone) {
      dropZone.classList.add("active");
    }
  }
};

export const handleTouchEnd = (e) => {
  const el = e.currentTarget;

  // If it was a tap (not a drag), use tap-to-select
  if (!el._touchMoved) {
    e.preventDefault();
    handleWordTap(el);
    return;
  }

  e.preventDefault();
  const touch = e.changedTouches[0];
  const target = document.elementFromPoint(touch.clientX, touch.clientY);
  const dropTarget = target && (target.closest(".drop-zone") || target.closest(".word-bank"));
  if (dropTarget && draggedItem) {
    dropTarget.classList.remove("active");
    draggedItem.classList.remove("hint");
    draggedItem.style.backgroundColor = "";
    dropTarget.appendChild(draggedItem);
    updateDropZonePlaceholder();
    updateSubmitButton();
    hideTooltip();
  }
  if (draggedItem) draggedItem.classList.remove("dragging");
  draggedItem = null;
};

// ===== Tap-to-Select (Primary interaction for children) =====
function deselectWord() {
  if (selectedWord) {
    selectedWord.classList.remove("selected");
    selectedWord = null;
  }
}

function handleWordTap(wordEl) {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!dropZone || !wordBank) return;

  // If this word is already selected, deselect it
  if (selectedWord === wordEl) {
    deselectWord();
    return;
  }

  // If word is in the word bank, move it to drop zone
  if (wordBank.contains(wordEl)) {
    deselectWord();
    wordEl.classList.remove("hint");
    wordEl.style.backgroundColor = "";
    dropZone.appendChild(wordEl);
    updateDropZonePlaceholder();
    updateSubmitButton();
    // Brief visual pop
    wordEl.style.animation = "none";
    wordEl.offsetHeight; // force reflow
    wordEl.style.animation = "bounce 0.3s ease";
  }
  // If word is in the drop zone, move it back to word bank
  else if (dropZone.contains(wordEl)) {
    deselectWord();
    wordBank.appendChild(wordEl);
    updateDropZonePlaceholder();
    updateSubmitButton();
  }

  hideTooltip();
}

function handleWordClick(e) {
  // Only handle click on desktop (touch is handled separately)
  if (e.target._touchMoved !== undefined) return;
  handleWordTap(e.currentTarget);
}

// ===== Drop zone tap handler (for placing selected word) =====
function handleDropZoneTap(e) {
  if (selectedWord && e.target.classList.contains("drop-zone")) {
    selectedWord.classList.remove("selected", "hint");
    selectedWord.style.backgroundColor = "";
    e.target.appendChild(selectedWord);
    deselectWord();
    updateDropZonePlaceholder();
    updateSubmitButton();
  }
}

// ===== Helper: Update placeholder & submit state =====
function updateDropZonePlaceholder() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  if (!dropZone) return;
  const placeholder = dropZone.querySelector(".drop-zone-placeholder");
  const hasWords = dropZone.querySelectorAll(".word").length > 0;
  if (placeholder) {
    placeholder.style.display = hasWords ? "none" : "block";
  }
}

function updateSubmitButton() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  if (!dropZone) return;
  const wordCount = dropZone.querySelectorAll(".word").length;
  elements.submitBtn.disabled = wordCount === 0;
}

// ===== Puzzle Generation =====
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

// ===== Display Current Puzzle =====
function displayCurrentPuzzle() {
  hintUsed = false;
  deselectWord();

  if (currentPuzzleIndex < 0) currentPuzzleIndex = 0;
  if (currentPuzzleIndex >= puzzles.length)
    currentPuzzleIndex = puzzles.length - 1;

  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;

  elements.puzzleContainer.innerHTML = "";
  elements.successMessage.textContent = "";
  elements.successMessage.className = "";
  elements.hint.textContent = "";

  // Word bank label
  const bankLabel = document.createElement("div");
  bankLabel.className = "zone-label";
  bankLabel.textContent = "Choose words:";

  // Word bank
  const wordBank = document.createElement("div");
  wordBank.className = "word-bank";
  wordBank.addEventListener("dragover", handleDragOver);
  wordBank.addEventListener("dragleave", handleDragLeave);
  wordBank.addEventListener("drop", handleDrop);

  puzzle.shuffled.forEach((w, idx) => {
    const span = document.createElement("span");
    span.textContent = w;
    span.dataset.index = idx;
    span.dataset.role = getWordRole(w, puzzle.words.indexOf(w), puzzle.words);
    span.className = `word ${getWordClass(w)}`;
    span.draggable = true;
    span.addEventListener("dragstart", handleDragStart);
    span.addEventListener("dragend", handleDragEnd);
    span.addEventListener("touchstart", handleTouchStart, { passive: true });
    span.addEventListener("touchmove", handleTouchMove, { passive: false });
    span.addEventListener("touchend", handleTouchEnd, { passive: false });
    span.addEventListener("click", handleWordClick);
    span.addEventListener("mouseenter", showTooltip);
    span.addEventListener("mouseleave", hideTooltip);
    wordBank.appendChild(span);
  });

  // Drop zone label
  const dropLabel = document.createElement("div");
  dropLabel.className = "zone-label";
  dropLabel.textContent = "Build your sentence here:";

  // Drop zone
  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";
  dropZone.addEventListener("dragover", handleDragOver);
  dropZone.addEventListener("dragleave", handleDragLeave);
  dropZone.addEventListener("drop", handleDrop);
  dropZone.addEventListener("click", handleDropZoneTap);

  // Placeholder text
  const placeholder = document.createElement("div");
  placeholder.className = "drop-zone-placeholder";
  placeholder.textContent = "Tap words above to place them here";
  dropZone.appendChild(placeholder);

  elements.puzzleContainer.append(bankLabel, wordBank, dropLabel, dropZone);

  elements.submitBtn.disabled = true;
  elements.tryAgainBtn.style.display = "none";
  elements.prevBtn.disabled = currentPuzzleIndex === 0;
  elements.nextBtn.disabled = true;

  const progressPercent = (currentPuzzleIndex / sessionLength) * 100;
  animateProgressBar(progressPercent);
  elements.progressLabel.textContent = `${currentPuzzleIndex + 1} / ${sessionLength}`;
  elements.progressIndicator.textContent = `Mastery: ${Math.round((score / sessionLength) * 100)}% (need 80%)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
  elements.badgesList.textContent = badges.join(", ");

  isPaused = false;
  elements.pauseTimerBtn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i> <span class="btn-label">Pause</span>';
  startTimer();
}

// ===== Reveal Answer =====
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
  elements.successMessage.textContent = "Here is the correct order!";
  elements.successMessage.className = "";
  speak(puzzle.sentence);
  stopTimer();
}

// ===== Check Answer =====
function checkAnswer() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const attempt = Array.from(dropZone.querySelectorAll(".word")).map((ch) => ch.textContent);
  const puzzle = puzzles[currentPuzzleIndex];

  if (attempt.length !== puzzle.words.length) return;

  const correct = puzzle.words.every((w, i) => w === attempt[i]);
  if (correct) {
    dropZone.querySelectorAll(".word").forEach((w) => w.classList.add("correct"));
    elements.successMessage.textContent = randomFrom(correctMessages);
    elements.successMessage.className = "correct-msg";
    animateSuccessMessage();
    fireConfetti();
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
    dropZone.querySelectorAll(".word").forEach((w) => {
      w.classList.add("incorrect");
      // Remove incorrect class after animation
      setTimeout(() => w.classList.remove("incorrect"), 500);
    });
    elements.successMessage.textContent = randomFrom(encourageMessages);
    elements.successMessage.className = "incorrect-msg";
    elements.tryAgainBtn.style.display = "inline-block";
    streak = 0;
    localStorage.setItem("streak", "0");
  }

  elements.progressIndicator.textContent = `Mastery: ${Math.round((score / sessionLength) * 100)}% (need 80%)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
}

// ===== Hint =====
function showHint() {
  if (hintUsed) return;
  const puzzle = puzzles[currentPuzzleIndex];
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!puzzle || !dropZone || !wordBank) return;
  const nextIndex = dropZone.querySelectorAll(".word").length;
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
  elements.hint.textContent = `Next word: "${nextWord}"`;
  hintUsed = true;
}

// ===== Clear Puzzle =====
function clearPuzzle() {
  deselectWord();
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!dropZone || !wordBank) return;
  Array.from(dropZone.querySelectorAll(".word")).forEach((ch) => {
    ch.classList.remove("correct", "incorrect", "hint");
    ch.style.backgroundColor = "";
    wordBank.appendChild(ch);
  });
  updateDropZonePlaceholder();
  elements.submitBtn.disabled = true;
  elements.successMessage.textContent = "";
  elements.successMessage.className = "";
  elements.tryAgainBtn.style.display = "none";
  hideTooltip();
}

// ===== Fullscreen =====
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ===== Theme =====
function toggleTheme() {
  elements.body.classList.toggle("light-theme");
  localStorage.setItem(
    "theme",
    elements.body.classList.contains("light-theme") ? "light" : "dark"
  );
}

// ===== Reset =====
async function resetQuiz() {
  await generatePuzzles();
  displayCurrentPuzzle();
}

// ===== Event Listeners =====
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
elements.pauseTimerBtn.addEventListener("click", togglePauseTimer);
elements.helpBtn.addEventListener("click", () => {
  elements.tutorialOverlay.classList.remove("hidden");
});
elements.timerMode.addEventListener("change", (e) => {
  timerEnabled = e.target.checked;
  localStorage.setItem("timerMode", timerEnabled);
  // Show/hide pause button based on timer mode
  elements.pauseTimerBtn.style.display = timerEnabled ? "" : "none";
  if (!timerEnabled) stopTimer();
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

// ===== Load Settings =====
function loadSettings() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    elements.body.classList.add("light-theme");
  }
  timerEnabled = JSON.parse(localStorage.getItem("timerMode") || "false");
  elements.timerMode.checked = timerEnabled;
  elements.pauseTimerBtn.style.display = timerEnabled ? "" : "none";
  if (!localStorage.getItem("tutorialSeen")) {
    elements.tutorialOverlay.classList.remove("hidden");
  }
  elements.levelSelect.value = currentLevel;
}

// ===== Animations =====
function animateSuccessMessage() {
  if (window.gsap) {
    gsap.fromTo(
      elements.successMessage,
      { opacity: 0, y: -10, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(1.7)" }
    );
  }
}

function animateProgressBar(percent) {
  if (window.gsap) {
    gsap.to(elements.progressBar, { width: `${percent}%`, duration: 0.5 });
  } else {
    elements.progressBar.style.width = `${percent}%`;
  }
  elements.progressBar.setAttribute("aria-valuenow", percent.toString());
}

function fireConfetti() {
  if (!window.gsap) return;
  const colors = ["#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff", "#ff922b", "#cc5de8"];
  for (let i = 0; i < 30; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti-piece";
    conf.style.left = Math.random() * 100 + "%";
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.width = (6 + Math.random() * 8) + "px";
    conf.style.height = (6 + Math.random() * 8) + "px";
    conf.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    document.body.appendChild(conf);
    gsap.to(conf, {
      y: "100vh",
      x: (Math.random() - 0.5) * 200,
      rotation: Math.random() * 720,
      duration: 1.2 + Math.random() * 0.8,
      ease: "power1.out",
      onComplete: () => conf.remove(),
    });
  }
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", async () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.getVoices();
  }
  loadSettings();
  await generatePuzzles();
  displayCurrentPuzzle();
});
