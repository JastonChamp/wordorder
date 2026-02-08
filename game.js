"use strict";
import { elements } from "./ui.js";
import { speak } from "./speech.js";
import { getWordClass, getWordRole } from "./wordClasses.js";
import { playTap, playPlace, playCorrect, playWrong, playComplete, playHint, resumeAudio, setSoundEnabled, isSoundEnabled } from "./sounds.js";

const INSTRUCTIONS =
  "Tap a word to pick it up, then tap the sentence area to place it. Put the words in the right order and tap Check Answer!";

const sentenceCache = {};
const sessionLength = 10;

let puzzles = [];
let currentPuzzleIndex = 0;
let score = 0;
let sessionXpEarned = 0;
let bestStreakThisSession = 0;
let currentStreak = 0;
let attempts = 0;

let currentLevel = localStorage.getItem("currentLevel") || "p3";
let xp = +localStorage.getItem("xp") || 0;
let streak = +localStorage.getItem("streak") || 0;
let badges = JSON.parse(localStorage.getItem("badges") || "[]");
let gameMode = localStorage.getItem("gameMode") || "practice";

let draggedItem = null;
let selectedWord = null;
let hintUsed = false;
let timer = null;
let remaining = 30;
let isPaused = false;
let timerEnabled = false;

// Tutorial state
let tutorialStep = 0;
const totalTutorialSteps = 4;

// Positive feedback messages
const correctMessages = [
  "Great job! ⭐",
  "Well done! 🌟",
  "You got it! 🎉",
  "Amazing! ✨",
  "Super! 🚀",
  "Brilliant! 💫",
  "Perfect! 🏆",
  "Fantastic! 🎊",
  "Awesome work! 💪",
  "You're a star! ⭐",
];

const encourageMessages = [
  "Almost! Try again!",
  "Not quite - check the colored words!",
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
  elements.timerDisplay.textContent = `${remaining}s`;
  timer = setInterval(() => {
    if (!isPaused) {
      remaining--;
      elements.timerDisplay.textContent = `${remaining}s`;
    }
    if (remaining <= 0) {
      clearInterval(timer);
      elements.timerDisplay.textContent = "";
      elements.submitBtn.disabled = true;
      elements.successMessage.textContent = "Time's up!";
      elements.successMessage.className = "incorrect-msg";
      playWrong();
    }
  }, 1000);
};

const stopTimer = () => {
  clearInterval(timer);
  elements.timerDisplay.textContent = "";
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
  playPlace();
  updateDropZonePlaceholder();
  updateSubmitButton();
  hideTooltip();
};

// ===== Touch Drag Handlers =====
export const handleTouchStart = (e) => {
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
    document.querySelectorAll(".drop-zone.active, .word-bank.active")
      .forEach((dz) => dz.classList.remove("active"));
    const dropZone = target && (target.closest(".drop-zone") || target.closest(".word-bank"));
    if (dropZone) dropZone.classList.add("active");
  }
};

export const handleTouchEnd = (e) => {
  const el = e.currentTarget;
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
    playPlace();
    updateDropZonePlaceholder();
    updateSubmitButton();
    hideTooltip();
  }
  if (draggedItem) draggedItem.classList.remove("dragging");
  draggedItem = null;
};

// ===== Tap-to-Select =====
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

  if (selectedWord === wordEl) {
    deselectWord();
    return;
  }

  if (wordBank.contains(wordEl)) {
    deselectWord();
    wordEl.classList.remove("hint");
    wordEl.style.backgroundColor = "";
    dropZone.appendChild(wordEl);
    playPlace();
    updateDropZonePlaceholder();
    updateSubmitButton();
    wordEl.style.animation = "none";
    wordEl.offsetHeight;
    wordEl.style.animation = "correctPop 0.3s ease";
  } else if (dropZone.contains(wordEl)) {
    deselectWord();
    wordBank.appendChild(wordEl);
    playTap();
    updateDropZonePlaceholder();
    updateSubmitButton();
  }
  hideTooltip();
}

function handleWordClick(e) {
  if (e.target._touchMoved !== undefined) return;
  handleWordTap(e.currentTarget);
}

function handleDropZoneTap(e) {
  if (selectedWord && e.target.classList.contains("drop-zone")) {
    selectedWord.classList.remove("selected", "hint");
    selectedWord.style.backgroundColor = "";
    e.target.appendChild(selectedWord);
    playPlace();
    deselectWord();
    updateDropZonePlaceholder();
    updateSubmitButton();
  }
}

// ===== Helpers =====
function updateDropZonePlaceholder() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  if (!dropZone) return;
  const placeholder = dropZone.querySelector(".drop-zone-placeholder");
  const hasWords = dropZone.querySelectorAll(".word").length > 0;
  if (placeholder) placeholder.style.display = hasWords ? "none" : "block";
}

function updateSubmitButton() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  if (!dropZone) return;
  const wordCount = dropZone.querySelectorAll(".word").length;
  const puzzle = puzzles[currentPuzzleIndex];
  elements.submitBtn.disabled = !puzzle || wordCount !== puzzle.words.length;
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
  sessionXpEarned = 0;
  bestStreakThisSession = 0;
  currentStreak = 0;
  attempts = 0;
}

// ===== Display Current Puzzle =====
function displayCurrentPuzzle() {
  hintUsed = false;
  deselectWord();

  if (currentPuzzleIndex < 0) currentPuzzleIndex = 0;
  if (currentPuzzleIndex >= puzzles.length) currentPuzzleIndex = puzzles.length - 1;

  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;

  elements.puzzleContainer.innerHTML = "";
  elements.successMessage.textContent = "";
  elements.successMessage.className = "";
  elements.hint.textContent = "";

  // Hide instruction banner after first puzzle
  if (currentPuzzleIndex > 0 && elements.instructionBanner) {
    elements.instructionBanner.style.display = "none";
  }

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
  if (elements.navCounter) {
    elements.navCounter.textContent = `${currentPuzzleIndex + 1} / ${sessionLength}`;
  }
  updateStatsDisplay();

  isPaused = false;
  if (gameMode === "challenge") {
    timerEnabled = true;
    startTimer(30);
  } else {
    timerEnabled = false;
    stopTimer();
  }
}

function updateStatsDisplay() {
  if (elements.xpDisplay) {
    elements.xpDisplay.innerHTML = `<i class="fa-solid fa-star"></i> <span>${xp} XP</span>`;
  }
  if (elements.streakDisplay) {
    elements.streakDisplay.innerHTML = `<i class="fa-solid fa-fire"></i> <span>${streak}</span>`;
  }
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

// ===== Check Answer (with word-by-word feedback) =====
function checkAnswer() {
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordEls = Array.from(dropZone.querySelectorAll(".word"));
  const attempt = wordEls.map((ch) => ch.textContent);
  const puzzle = puzzles[currentPuzzleIndex];

  if (attempt.length !== puzzle.words.length) return;

  attempts++;
  const correct = puzzle.words.every((w, i) => w === attempt[i]);

  // Word-by-word highlighting
  wordEls.forEach((el, i) => {
    el.classList.remove("word-correct", "word-incorrect", "correct", "incorrect");
    if (attempt[i] === puzzle.words[i]) {
      el.classList.add("word-correct");
    } else {
      el.classList.add("word-incorrect");
    }
  });

  if (correct) {
    wordEls.forEach((w) => {
      w.classList.remove("word-correct", "word-incorrect");
      w.classList.add("correct");
    });
    elements.successMessage.textContent = randomFrom(correctMessages);
    elements.successMessage.className = "correct-msg";
    animateSuccessMessage();
    fireConfetti();
    playCorrect();

    score++;
    currentStreak++;
    if (currentStreak > bestStreakThisSession) bestStreakThisSession = currentStreak;
    streak++;

    const earnedXp = hintUsed ? 5 : 10;
    xp += earnedXp;
    sessionXpEarned += earnedXp;

    elements.nextBtn.disabled = false;
    elements.submitBtn.disabled = true;
    localStorage.setItem("xp", xp.toString());
    localStorage.setItem("streak", streak.toString());
    speak(puzzle.sentence);
    stopTimer();

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(50);

    // Auto-advance or show session complete
    if (currentPuzzleIndex === puzzles.length - 1) {
      setTimeout(showSessionComplete, 1500);
    }
  } else {
    playWrong();
    elements.successMessage.textContent = randomFrom(encourageMessages);
    elements.successMessage.className = "incorrect-msg";
    elements.tryAgainBtn.style.display = "inline-flex";
    currentStreak = 0;
    streak = 0;
    localStorage.setItem("streak", "0");

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);

    // Remove word-level highlighting after a delay so child can study it
    setTimeout(() => {
      wordEls.forEach((el) => el.classList.remove("word-correct", "word-incorrect"));
    }, 2000);
  }

  updateStatsDisplay();
}

// ===== Session Complete Screen =====
function showSessionComplete() {
  playComplete();

  const accuracy = Math.round((score / sessionLength) * 100);
  const starCount = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

  // Set star display
  elements.sessionStars.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const star = document.createElement("span");
    star.textContent = i < starCount ? "⭐" : "☆";
    star.style.animation = i < starCount ? `starAppear 0.5s ease ${i * 0.2}s both` : "none";
    star.style.opacity = i < starCount ? "1" : "0.3";
    elements.sessionStars.appendChild(star);
  }

  // Title based on performance
  if (accuracy === 100) {
    elements.sessionTitle.textContent = "Perfect Score! 🏆";
  } else if (accuracy >= 80) {
    elements.sessionTitle.textContent = "Great Job! 🌟";
  } else if (accuracy >= 50) {
    elements.sessionTitle.textContent = "Good Effort! 💪";
  } else {
    elements.sessionTitle.textContent = "Keep Practicing! 📚";
  }

  elements.statScore.textContent = `${score}/${sessionLength}`;
  elements.statAccuracy.textContent = `${accuracy}%`;
  elements.statXpEarned.textContent = `+${sessionXpEarned}`;
  elements.statStreak.textContent = `${bestStreakThisSession}`;

  elements.sessionCompleteOverlay.classList.remove("hidden");
  fireConfetti();

  // Check for level-up suggestion
  const levels = ["p1", "p2", "p3", "p4", "p5", "p6"];
  const currentIdx = levels.indexOf(currentLevel);
  if (accuracy >= 80 && currentIdx < levels.length - 1) {
    elements.sessionNextLevel.style.display = "inline-flex";
  } else {
    elements.sessionNextLevel.style.display = "none";
  }
}

// ===== Hint =====
function showHint() {
  if (hintUsed && gameMode !== "practice") return;
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
  }
  elements.hint.textContent = `Next word: "${nextWord}"`;
  hintUsed = true;
  playHint();
}

// ===== Clear =====
function clearPuzzle() {
  deselectWord();
  const dropZone = elements.puzzleContainer.querySelector(".drop-zone");
  const wordBank = elements.puzzleContainer.querySelector(".word-bank");
  if (!dropZone || !wordBank) return;
  Array.from(dropZone.querySelectorAll(".word")).forEach((ch) => {
    ch.classList.remove("correct", "incorrect", "hint", "word-correct", "word-incorrect");
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
  const isDark = elements.body.classList.toggle("dark-theme");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  // Update icon
  const icon = elements.themeToggle.querySelector("i");
  if (icon) {
    icon.className = isDark ? "fa-solid fa-sun" : "fa-solid fa-moon";
  }
}

// ===== Sound Toggle =====
function toggleSound() {
  const enabled = !isSoundEnabled();
  setSoundEnabled(enabled);
  localStorage.setItem("soundEnabled", enabled.toString());
  const icon = elements.soundToggle.querySelector("i");
  if (icon) {
    icon.className = enabled ? "fa-solid fa-volume-high" : "fa-solid fa-volume-xmark";
  }
}

// ===== Game Modes =====
function setGameMode(mode) {
  gameMode = mode;
  localStorage.setItem("gameMode", mode);
  const labels = { practice: "Practice", challenge: "Challenge", streak: "Streak" };
  if (elements.currentModeLabel) {
    elements.currentModeLabel.textContent = labels[mode] || "Practice";
  }
  timerEnabled = mode === "challenge";
}

function showModeSelector() {
  elements.modeSelectorOverlay.classList.remove("hidden");
}

function hideModeSelector() {
  elements.modeSelectorOverlay.classList.add("hidden");
}

// ===== Reset =====
async function resetQuiz() {
  await generatePuzzles();
  displayCurrentPuzzle();
}

// ===== Tutorial =====
function advanceTutorial() {
  tutorialStep++;
  if (tutorialStep >= totalTutorialSteps) {
    closeTutorial();
    return;
  }
  updateTutorialDisplay();
}

function closeTutorial() {
  elements.tutorialOverlay.classList.add("hidden");
  localStorage.setItem("tutorialSeen", "yes");
  tutorialStep = 0;
}

function updateTutorialDisplay() {
  document.querySelectorAll(".tutorial-step").forEach((s) => s.classList.remove("active"));
  document.querySelectorAll(".dot").forEach((d) => d.classList.remove("active"));

  const step = document.querySelector(`.tutorial-step[data-step="${tutorialStep}"]`);
  const dot = document.querySelector(`.dot[data-dot="${tutorialStep}"]`);
  if (step) step.classList.add("active");
  if (dot) dot.classList.add("active");

  // Update button text on last step
  const nextBtn = document.getElementById("tutorial-next");
  if (nextBtn) {
    if (tutorialStep === totalTutorialSteps - 1) {
      nextBtn.innerHTML = 'Let\'s Go! <i class="fa-solid fa-rocket"></i>';
    } else {
      nextBtn.innerHTML = 'Next <i class="fa-solid fa-arrow-right"></i>';
    }
  }
}

// ===== Share =====
function shareScore() {
  const accuracy = Math.round((score / sessionLength) * 100);
  const text = `I scored ${score}/${sessionLength} (${accuracy}%) on Word Order Adventure! Can you beat my score?`;
  if (navigator.share) {
    navigator.share({ title: "Word Order Adventure", text }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      elements.successMessage.textContent = "Score copied to clipboard!";
      elements.successMessage.className = "correct-msg";
    }).catch(() => {});
  }
}

// ===== Event Listeners =====
elements.submitBtn.addEventListener("click", checkAnswer);
elements.nextBtn.addEventListener("click", () => {
  if (currentPuzzleIndex < puzzles.length - 1) {
    currentPuzzleIndex++;
    displayCurrentPuzzle();
  }
});
elements.prevBtn.addEventListener("click", () => {
  if (currentPuzzleIndex > 0) {
    currentPuzzleIndex--;
    displayCurrentPuzzle();
  }
});
elements.hintBtn.addEventListener("click", showHint);
elements.tryAgainBtn.addEventListener("click", revealAnswer);
elements.clearBtn.addEventListener("click", clearPuzzle);
elements.resetBtn.addEventListener("click", resetQuiz);
elements.listenBtn.addEventListener("click", () => speak(INSTRUCTIONS));
elements.fullscreenBtn.addEventListener("click", toggleFullscreen);
elements.themeToggle.addEventListener("click", toggleTheme);
elements.helpBtn.addEventListener("click", () => {
  tutorialStep = 0;
  updateTutorialDisplay();
  elements.tutorialOverlay.classList.remove("hidden");
});

// Sound toggle
if (elements.soundToggle) {
  elements.soundToggle.addEventListener("click", toggleSound);
}

// Tutorial buttons
elements.tutorialNext.addEventListener("click", advanceTutorial);
if (elements.tutorialSkip) {
  elements.tutorialSkip.addEventListener("click", closeTutorial);
}

// Level select
elements.levelSelect.addEventListener("change", async (e) => {
  currentLevel = e.target.value;
  localStorage.setItem("currentLevel", currentLevel);
  await resetQuiz();
});

// Game mode
if (elements.modeBtn) {
  elements.modeBtn.addEventListener("click", showModeSelector);
}

// Mode card selection
document.querySelectorAll(".mode-card").forEach((card) => {
  card.addEventListener("click", () => {
    const mode = card.dataset.mode;
    setGameMode(mode);
    hideModeSelector();
    resetQuiz();
  });
});

// Close mode selector on overlay click
if (elements.modeSelectorOverlay) {
  elements.modeSelectorOverlay.addEventListener("click", (e) => {
    if (e.target === elements.modeSelectorOverlay) hideModeSelector();
  });
}

// Session complete buttons
if (elements.sessionPlayAgain) {
  elements.sessionPlayAgain.addEventListener("click", () => {
    elements.sessionCompleteOverlay.classList.add("hidden");
    resetQuiz();
  });
}
if (elements.sessionNextLevel) {
  elements.sessionNextLevel.addEventListener("click", () => {
    elements.sessionCompleteOverlay.classList.add("hidden");
    const levels = ["p1", "p2", "p3", "p4", "p5", "p6"];
    const nextIdx = levels.indexOf(currentLevel) + 1;
    if (nextIdx < levels.length) {
      currentLevel = levels[nextIdx];
      localStorage.setItem("currentLevel", currentLevel);
      elements.levelSelect.value = currentLevel;
    }
    resetQuiz();
  });
}

// Share button
if (elements.shareBtn) {
  elements.shareBtn.addEventListener("click", shareScore);
}

// Resume audio on first interaction
document.addEventListener("click", resumeAudio, { once: true });
document.addEventListener("touchstart", resumeAudio, { once: true });

// ===== Load Settings =====
function loadSettings() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "dark") {
    elements.body.classList.add("dark-theme");
    const icon = elements.themeToggle.querySelector("i");
    if (icon) icon.className = "fa-solid fa-sun";
  }

  // Sound
  const storedSound = localStorage.getItem("soundEnabled");
  if (storedSound === "false") {
    setSoundEnabled(false);
    const icon = elements.soundToggle?.querySelector("i");
    if (icon) icon.className = "fa-solid fa-volume-xmark";
  }

  // Game mode
  const storedMode = localStorage.getItem("gameMode") || "practice";
  setGameMode(storedMode);

  // Tutorial
  if (!localStorage.getItem("tutorialSeen")) {
    tutorialStep = 0;
    updateTutorialDisplay();
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
  const colors = ["#6C63FF", "#00C853", "#FFB300", "#FF5252", "#26C6DA", "#AB47BC"];
  for (let i = 0; i < 40; i++) {
    const conf = document.createElement("div");
    conf.className = "confetti-piece";
    conf.style.left = Math.random() * 100 + "%";
    conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    conf.style.width = (6 + Math.random() * 10) + "px";
    conf.style.height = (6 + Math.random() * 10) + "px";
    conf.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    document.body.appendChild(conf);
    gsap.to(conf, {
      y: "100vh",
      x: (Math.random() - 0.5) * 300,
      rotation: Math.random() * 720,
      duration: 1.5 + Math.random() * 1,
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
