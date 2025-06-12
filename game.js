"use strict";
import { elements } from './ui.js';
import { speak } from './speech.js';
import { getWordClass, getWordRole } from './wordClasses.js';

// Hide Tooltip Helper
const hideTooltip = () => {
  const tt = document.querySelector('.word-tooltip');
  if (tt) tt.remove();
};

declare let gsap: any;

// Sentence Cache
const sentenceCache = {};
export async function loadSentencesForLevel(level) {
  if (sentenceCache[level]) return sentenceCache[level];
  try {
    const r = await fetch(`data/${level}.json`);
    if (!r.ok) throw new Error();
    const data = await r.json();
    sentenceCache[level] = data;
    return data;
  } catch {
    elements.puzzleContainer.textContent = 'Error loading data.';
    return [];
  }
}
export const getSentencesForLevel = lvl => sentenceCache[lvl] || [];

// Game State
const sessionLength = 10;
let puzzles = [], currentPuzzleIndex = 0, score = 0;
let currentLevel = localStorage.getItem('currentLevel') || 'p3';
let xp = +localStorage.getItem('xp') || 0;
let streak = +localStorage.getItem('streak') || 0;
let badges = JSON.parse(localStorage.getItem('badges') || '[]');
if (localStorage.getItem('lastPlayDate') !== new Date().toDateString()) {
  localStorage.setItem('lastPlayDate', new Date().toDateString());
}

// Drag-and-Drop Handlers
let draggedItem = null;
export const handleDragStart = e => (draggedItem = e.target);
export const handleDragEnd = () => (draggedItem = null);
export const handleDragOver = e => { e.preventDefault(); e.currentTarget.classList.add('active'); };
export const handleDragLeave = e => e.currentTarget.classList.remove('active');
export const handleDrop = e => {
  e.preventDefault(); e.currentTarget.classList.remove('active');
  if (!draggedItem) return;
  e.currentTarget.appendChild(draggedItem);
  elements.submitBtn.disabled = false;
};

// Placeholder functions
async function generatePuzzles() { /* ... */ }
function displayCurrentPuzzle() { /* ... */ }
function checkAnswer() { /* ... */ }
async function resetQuiz() { /* ... */ }

// Level selector
document.getElementById('level-select').addEventListener('change', async e => {
  currentLevel = e.target.value;
  await resetQuiz();
});

// Animate success
function animateSuccessMessage() {
  if (window.gsap) {
    gsap.fromTo(
      elements.successMessage,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: 'bounce.out' }
    );
  }
}

// Init on load
document.addEventListener('DOMContentLoaded', async () => {
  await generatePuzzles();
  displayCurrentPuzzle();
});
