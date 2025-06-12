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
  if (localStorage.getItem("lastPlayDate") !== yesterday.toDateString()) {
    // Reset daily counters or streak here if needed
  }
}

// **Drag-and-Drop Event Handlers**
let draggedItem = null;
const handleDragStart = (e) => {
  draggedItem = e.target;
};

// ... [Rest of the drag-and-drop handlers and game logic] ...

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
