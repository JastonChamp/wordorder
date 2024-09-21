const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

let currentWordIndex = 0;
let isSpinning = false;

// Elements from the DOM
const spinnerDisplay = document.getElementById('spinner-word');
const startButton = document.getElementById('start-button');
const checkButton = document.getElementById('check-button');
const inputField = document.getElementById('user-input');

// Initialize spinner game
function startSpinner() {
  if (!isSpinning) {
    isSpinning = true;
    currentWordIndex = Math.floor(Math.random() * sightWords.length); // Pick a random word
    spinnerDisplay.textContent = sightWords[currentWordIndex]; // Display the word
    inputField.value = ''; // Clear input field for new entry
    isSpinning = false;
  }
}

// Check user input against the displayed word
function checkAnswer() {
  const userAnswer = inputField.value.trim().toLowerCase();
  const correctAnswer = sightWords[currentWordIndex].toLowerCase();

  if (userAnswer === correctAnswer) {
    alert("Correct!");
    startSpinner(); // Spin for next word
  } else {
    alert("Incorrect! Try again.");
  }
}

// Event listeners for buttons
startButton.addEventListener('click', startSpinner);
checkButton.addEventListener('click', checkAnswer);

// Start the game with the first word
startSpinner();
