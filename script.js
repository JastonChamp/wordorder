/* === Speech API Utility === */
function speak(text) {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;   // Normal speed for clarity
    utterance.pitch = 1;  // Normal pitch
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn("Speech Synthesis API is not supported in this browser.");
  }
}

/* === Level Sentence Pools === */
// Sample sentences for each level (P1–P6)
const sentencesP1 = [
  "Cat is black.",
  "Dog runs.",
  "Bird flies.",
  "Sun is hot.",
  "Mom cooks."
];
const sentencesP2 = [
  "The red ball bounces.",
  "A small dog barks.",
  "Big cat sleeps.",
  "The sun is bright.",
  "Blue bird sings."
];
const sentencesP3 = [
  "The boy eats an apple.",
  "The girl plays with a toy.",
  "The dog chases the ball.",
  "The teacher reads a book.",
  "The cat drinks milk."
];
const sentencesP4 = [
  "The happy girl sings beautifully.",
  "The boy quickly runs to school.",
  "The teacher explains the lesson clearly.",
  "The children play in the park.",
  "The red car moves fast."
];
const sentencesP5 = [
  "The teacher reads a story, and the children listen attentively.",
  "The boy finished his homework before dinner.",
  "The little girl happily skipped to school.",
  "The bright sun shines over the calm sea.",
  "The busy bees buzz around the blooming flowers."
];
const sentencesP6 = [
  "After finishing his homework, the student went to the library.",
  "Although it was raining, the children played outside happily.",
  "The teacher, who was very kind, explained the lesson in detail.",
  "Despite the heavy traffic, she arrived at school on time.",
  "When the bell rang, the students hurried to their classrooms."
];

/* === Global Variables === */
let puzzles = [];  // Array of puzzle objects: { correct: Array, submitted: Boolean, userAnswer: Array }
let currentPuzzleIndex = 0;
let score = 0;
let currentLevel = 'p3'; // Default level is Primary 3

/* === Get Sentences for the Selected Level === */
function getSentencesForLevel(level) {
  switch (level) {
    case 'p1': return sentencesP1;
    case 'p2': return sentencesP2;
    case 'p3': return sentencesP3;
    case 'p4': return sentencesP4;
    case 'p5': return sentencesP5;
    case 'p6': return sentencesP6;
    default: return sentencesP3;
  }
}

/* === Shuffle Function (Fisher-Yates) === */
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

/* === Generate Puzzles === */
function generatePuzzles() {
  const sentencePool = getSentencesForLevel(currentLevel);
  // For this version, we use all sentences from the pool (shuffled order)
  const selectedSentences = shuffle([...sentencePool]);
  puzzles = selectedSentences.map(sentence => ({
    correct: sentence.split(" "),
    submitted: false,
    userAnswer: null
  }));
  currentPuzzleIndex = 0;
  score = 0;
}

/* === Display the Current Puzzle === */
function displayCurrentPuzzle() {
  const puzzleContainer = document.getElementById("puzzle-container");
  puzzleContainer.innerHTML = "";
  
  if (currentPuzzleIndex < 0 || currentPuzzleIndex >= puzzles.length) {
    puzzleContainer.innerHTML = "<p>No puzzle available.</p>";
    return;
  }
  
  const puzzle = puzzles[currentPuzzleIndex];
  const container = document.createElement("div");
  container.className = "sentence-container";
  
  // Puzzle header
  const header = document.createElement("h3");
  header.innerText = `Question ${currentPuzzleIndex + 1}: Arrange the words:`;
  container.appendChild(header);
  
  // Create Word Bank and Drop Zone
  const wordBank = document.createElement("div");
  wordBank.className = "word-bank";
  wordBank.setAttribute("aria-label", "Word Bank");
  wordBank.setAttribute("role", "list");
  
  const dropZone = document.createElement("div");
  dropZone.className = "drop-zone";
  dropZone.setAttribute("aria-label", "Drop Zone");
  dropZone.setAttribute("role", "list");
  
  container.appendChild(wordBank);
  container.appendChild(dropZone);
  
  // If not submitted, add shuffled words to the word bank
  if (!puzzle.submitted) {
    const wordsShuffled = shuffle([...puzzle.correct]);
    wordsShuffled.forEach(word => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "word";
      wordDiv.setAttribute("role", "listitem");
      wordDiv.draggable = true;
      wordDiv.innerText = word;
      wordDiv.addEventListener("dragstart", handleDragStart);
      wordDiv.addEventListener("dragend", handleDragEnd);
      wordBank.appendChild(wordDiv);
    });
  } else {
    // If already submitted, display the student's answer in the drop zone with highlighting,
    // and show the correct order in the word bank for review.
    puzzle.userAnswer.forEach((word, index) => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "word";
      wordDiv.innerText = word;
      if (word === puzzle.correct[index]) {
        wordDiv.classList.add("correct");
      } else {
        wordDiv.classList.add("incorrect");
      }
      dropZone.appendChild(wordDiv);
    });
    puzzle.correct.forEach(word => {
      const wordDiv = document.createElement("div");
      wordDiv.className = "word";
      wordDiv.innerText = word;
      wordBank.appendChild(wordDiv);
    });
  }
  
  puzzleContainer.appendChild(container);
  
  // Update progress and score display
  document.getElementById("progress").innerText = `Question ${currentPuzzleIndex + 1} of ${puzzles.length}`;
  document.getElementById("score").innerText = `Score: ${score}`;
}

/* === Drag & Drop Handlers === */
let draggedItem = null;

function handleDragStart(e) {
  draggedItem = e.target;
  e.target.style.opacity = "0.5";
  e.dataTransfer.setData("text/plain", e.target.innerText);
}

function handleDragEnd(e) {
  e.target.style.opacity = "1";
}

function handleDragOver(e) {
  e.preventDefault();
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.add("active");
  }
}

function handleDragLeave(e) {
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.remove("active");
  }
}

function handleDrop(e) {
  e.preventDefault();
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.remove("active");
  }
  if (e.target.classList.contains("word-bank") || e.target.classList.contains("drop-zone")) {
    e.target.appendChild(draggedItem);
  }
}

/* === Submit Answer for Current Puzzle === */
function submitAnswer() {
  const puzzleContainer = document.getElementById("puzzle-container");
  const currentPuzzleElem = puzzleContainer.querySelector(".sentence-container");
  if (!currentPuzzleElem) return;
  
  const dropZone = currentPuzzleElem.querySelector(".drop-zone");
  const userWords = Array.from(dropZone.children).map(word => word.innerText);
  const puzzle = puzzles[currentPuzzleIndex];
  
  if (userWords.length !== puzzle.correct.length) {
    alert("Please arrange all words before submitting.");
    return;
  }
  
  puzzle.submitted = true;
  puzzle.userAnswer = userWords;
  
  const isCorrect = (userWords.join(" ") === puzzle.correct.join(" "));
  
  // Highlight each word in the drop zone
  Array.from(dropZone.children).forEach((wordElem, index) => {
    wordElem.classList.remove("correct", "incorrect");
    if (wordElem.innerText === puzzle.correct[index]) {
      wordElem.classList.add("correct");
    } else {
      wordElem.classList.add("incorrect");
    }
  });
  
  if (isCorrect) {
    score++;
    speak("Great job! The sentence is: " + puzzle.correct.join(" "));
  } else {
    speak("That's not quite right. The correct sentence is: " + puzzle.correct.join(" "));
  }
  
  displayCurrentPuzzle();
}

/* === Navigation Functions === */
function nextPuzzle() {
  if (currentPuzzleIndex < puzzles.length - 1) {
    currentPuzzleIndex++;
    displayCurrentPuzzle();
  } else {
    alert("This is the last question.");
  }
}

function prevPuzzle() {
  if (currentPuzzleIndex > 0) {
    currentPuzzleIndex--;
    displayCurrentPuzzle();
  } else {
    alert("This is the first question.");
  }
}

/* === Reset Quiz === */
function resetQuiz() {
  generatePuzzles();
  displayCurrentPuzzle();
}

/* === Global Event Listeners === */
document.getElementById("listen-instructions-btn").addEventListener("click", () => {
  const instructions = document.querySelector("p.instructions").innerText;
  speak(instructions);
});
document.getElementById("submit-btn").addEventListener("click", submitAnswer);
document.getElementById("next-btn").addEventListener("click", nextPuzzle);
document.getElementById("prev-btn").addEventListener("click", prevPuzzle);
document.getElementById("reset-btn").addEventListener("click", resetQuiz);
document.getElementById("level-select").addEventListener("change", (e) => {
  currentLevel = e.target.value;
  resetQuiz();
});

/* === Initialize Quiz on DOM Ready === */
document.addEventListener("DOMContentLoaded", () => {
  generatePuzzles();
  displayCurrentPuzzle();
});
