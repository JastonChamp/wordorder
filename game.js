"use strict";
import { elements } from './ui.js';
import { speak } from './speech.js';
import { getWordClass, getWordRole } from './wordClasses.js';

// Button Event Listeners
elements.submitBtn.addEventListener('click', checkAnswer);
elements.nextBtn.addEventListener('click', () => {
  if (currentPuzzleIndex < puzzles.length - 1) currentPuzzleIndex++;
  displayCurrentPuzzle();
});
elements.prevBtn.addEventListener('click', () => {
  if (currentPuzzleIndex > 0) currentPuzzleIndex--;
  displayCurrentPuzzle();
});
elements.hintBtn.addEventListener('click', () => {
  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  const nextIndex = dropZone ? dropZone.children.length : 0;
  if (nextIndex < puzzle.words.length) {
    const role = getWordRole(puzzle.words[nextIndex], nextIndex, puzzle.words);
    elements.hint.textContent = `Next word role: ${role}`;
  }
});
elements.tryAgainBtn.addEventListener('click', () => {
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  if (dropZone) {
    dropZone.querySelectorAll('.word').forEach(w => w.classList.remove('incorrect'));
  }
  elements.submitBtn.disabled = false;
  elements.tryAgainBtn.style.display = 'none';
  elements.successMessage.textContent = '';
});
elements.clearBtn.addEventListener('click', () => {
  const wordBank = elements.puzzleContainer.querySelector('.word-bank');
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  if (!wordBank || !dropZone) return;
  Array.from(dropZone.children).forEach(ch => wordBank.appendChild(ch));
  elements.submitBtn.disabled = true;
});
elements.resetBtn.addEventListener('click', resetQuiz);
// Hide Tooltip Helper
const hideTooltip = () => {
  const tt = document.querySelector('.word-tooltip');
  if (tt) tt.remove();
};



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

let hintUsed = false;
// Drag-and-Drop Handlers
let draggedItem = null;
export const handleDragStart = e => (draggedItem = e.target);
export const handleDragEnd = () => (draggedItem = null);
export const handleDragOver = e => { e.preventDefault(); e.currentTarget.classList.add('active'); };
export const handleDragLeave = e => e.currentTarget.classList.remove('active');
export const handleDrop = e => {
  e.preventDefault(); e.currentTarget.classList.remove('active');
  if (!draggedItem) return;
  draggedItem.classList.remove('hint');
  draggedItem.style.backgroundColor = '';
  e.currentTarget.appendChild(draggedItem);
  elements.submitBtn.disabled = false;
};
async function generatePuzzles() {
  const sentences = await loadSentencesForLevel(currentLevel);
  if (!sentences.length) {
    puzzles = [];
    return;
  }
  const shuffled = [...sentences].sort(() => Math.random() - 0.5);
  puzzles = shuffled.slice(0, sessionLength).map(sentence => {
    const words = sentence.trim().split(/\s+/);
    return {
      sentence,
      words,
      shuffled: [...words].sort(() => Math.random() - 0.5)
    };
  });
  currentPuzzleIndex = 0;
  score = 0;
}

function displayCurrentPuzzle() {
  hintUsed = false;
  if (currentPuzzleIndex < 0) currentPuzzleIndex = 0;
  if (currentPuzzleIndex >= puzzles.length) currentPuzzleIndex = puzzles.length - 1;
  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle) return;

  elements.puzzleContainer.innerHTML = '';
  elements.successMessage.textContent = '';
  elements.hint.textContent = '';

  const wordBank = document.createElement('div');
  wordBank.className = 'word-bank';
  puzzle.shuffled.forEach(w => {
    const span = document.createElement('span');
    span.textContent = w;
    span.className = `word ${getWordClass(w)}`;
    span.draggable = true;
    span.addEventListener('dragstart', handleDragStart);
    span.addEventListener('dragend', handleDragEnd);
    wordBank.appendChild(span);
  });

  const dropZone = document.createElement('div');
  dropZone.className = 'drop-zone';
  dropZone.addEventListener('dragover', handleDragOver);
  dropZone.addEventListener('dragleave', handleDragLeave);
  dropZone.addEventListener('drop', handleDrop);

  elements.puzzleContainer.append(wordBank, dropZone);

  elements.submitBtn.disabled = true;
  elements.tryAgainBtn.style.display = 'none';
  elements.prevBtn.disabled = currentPuzzleIndex === 0;
  elements.nextBtn.disabled = true;

  elements.progressBar.style.width = `${(currentPuzzleIndex / sessionLength) * 100}%`;
  elements.progressLabel.textContent = `Puzzle ${currentPuzzleIndex + 1}/${sessionLength}`;
  elements.progressIndicator.textContent = `Mastery Progress: ${Math.round((score / sessionLength) * 100)}% (80% to advance)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
  elements.badgesList.textContent = badges.join(', ');
}

// Compare the dropped words with the correct answer
function checkAnswer() {␊
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  const attempt = Array.from(dropZone.children).map(ch => ch.textContent);
  const puzzle = puzzles[currentPuzzleIndex];

  if (attempt.length !== puzzle.words.length) return;

  const correct = puzzle.words.every((w, i) => w === attempt[i]);
  if (correct) {
    dropZone.querySelectorAll('.word').forEach(w => w.classList.add('correct'));
    elements.successMessage.textContent = 'Great job!';
    animateSuccessMessage();
    score++;
    streak++;
    xp += 10;
    elements.nextBtn.disabled = false;
    elements.submitBtn.disabled = true;
    localStorage.setItem('xp', xp.toString());
    localStorage.setItem('streak', streak.toString());
    speak(puzzle.sentence);
  } else {
    dropZone.querySelectorAll('.word').forEach(w => w.classList.add('incorrect'));
    elements.successMessage.textContent = 'Try again!';
    elements.tryAgainBtn.style.display = 'inline-block';
    streak = 0;
    localStorage.setItem('streak', '0');
  }

  elements.progressIndicator.textContent = `Mastery Progress: ${Math.round((score / sessionLength) * 100)}% (80% to advance)`;
  elements.xpDisplay.textContent = `XP: ${xp}`;
  elements.streakDisplay.textContent = `Streak: ${streak}`;
}

function showHint() {
  if (hintUsed) return;
  const puzzle = puzzles[currentPuzzleIndex];
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  const wordBank = elements.puzzleContainer.querySelector('.word-bank');
  if (!puzzle || !dropZone || !wordBank) return;
  const nextIndex = dropZone.children.length;
  if (nextIndex >= puzzle.words.length) return;
  const nextWord = puzzle.words[nextIndex];
  const wordEl = Array.from(wordBank.children).find(w => w.textContent === nextWord);
  if (wordEl) {
    const role = getWordRole(nextWord, nextIndex, puzzle.words);
    wordEl.classList.add('hint');
    wordEl.style.backgroundColor = `var(--hint-${role}-bg)`;
  }
  elements.hint.textContent = nextWord;
  hintUsed = true;
}

function clearPuzzle() {
  const dropZone = elements.puzzleContainer.querySelector('.drop-zone');
  const wordBank = elements.puzzleContainer.querySelector('.word-bank');
  if (!dropZone || !wordBank) return;
  Array.from(dropZone.children).forEach(ch => {
    ch.classList.remove('correct', 'incorrect', 'hint');
    ch.style.backgroundColor = '';
    wordBank.appendChild(ch);
  });
  elements.submitBtn.disabled = true;
  elements.successMessage.textContent = '';
}

// Reset game state and regenerate puzzles
async function resetQuiz() {
  await generatePuzzles();
  displayCurrentPuzzle();
}

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
  elements.hintBtn.addEventListener('click', showHint);
  elements.clearBtn.addEventListener('click', clearPuzzle);
});
