// JavaScript: spinner.js

const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

// Keep track of how many words have been revealed
let wordsRevealed = 0;
const totalWords = sightWords.length;

// Get references to the HTML elements
const wordDisplay = document.getElementById('wordDisplay');
const spinButton = document.getElementById('spinButton');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// Function to randomly pick a word and display it
function spinWord() {
  const randomIndex = Math.floor(Math.random() * sightWords.length);
  const selectedWord = sightWords[randomIndex];
  wordDisplay.textContent = selectedWord;
  sightWords.splice(randomIndex, 1); // Remove revealed word from the array
  
  // Update progress
  wordsRevealed++;
  updateProgress();
  speakWord(selectedWord);
}

// Function to use Web Speech API to read the word
function speakWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  speechSynthesis.speak(utterance);
}

// Function to update the progress bar and text
function updateProgress() {
  const progressPercentage = (wordsRevealed / totalWords) * 100;
  progressFill.style.width = progressPercentage + '%';
  progressText.textContent = `${wordsRevealed} / ${totalWords} Words Revealed`;
}

// Add event listener to the spin button
spinButton.addEventListener('click', spinWord);
