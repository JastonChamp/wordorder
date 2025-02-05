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
// Primary 1: Very simple sentences (20)
const sentencesP1 = [
  "Cat is black.",
  "Dog runs.",
  "Bird flies.",
  "Sun is hot.",
  "Mom cooks.",
  "Dad works.",
  "Milk is white.",
  "Fish swim.",
  "Ants crawl.",
  "Tree grows.",
  "Car is red.",
  "Ball is round.",
  "Egg is oval.",
  "Frog jumps.",
  "Bee buzzes.",
  "Leaf is green.",
  "Rain falls.",
  "Snow is cold.",
  "Cup is full.",
  "Book is open."
];

// Primary 2: Simple sentences with adjectives (20)
const sentencesP2 = [
  "The red ball bounces.",
  "A small dog barks.",
  "Big cat sleeps.",
  "The sun is bright.",
  "Blue bird sings.",
  "Yellow flower blooms.",
  "Green apple tastes sweet.",
  "Cute puppy plays.",
  "Little mouse squeaks.",
  "Tall tree stands.",
  "Soft pillow comforts.",
  "Hot soup warms.",
  "Fresh milk nourishes.",
  "Cold ice melts.",
  "Small fish swims.",
  "Happy kid laughs.",
  "Slow snail crawls.",
  "Bright star shines.",
  "Heavy cloud rains.",
  "Big truck moves."
];

// Primary 3: Complete subject-verb-object sentences (20)
const sentencesP3 = [
  "The boy eats an apple.",
  "The girl plays with a toy.",
  "The dog chases the ball.",
  "The teacher reads a book.",
  "The cat drinks milk.",
  "The boy kicks the ball.",
  "The girl draws a picture.",
  "The dog barks at the stranger.",
  "The student writes a letter.",
  "The mother cooks dinner.",
  "The father drives a car.",
  "The boy catches a frog.",
  "The girl rides a bike.",
  "The dog fetches the stick.",
  "The teacher explains the lesson.",
  "The child opens the door.",
  "The boy climbs a tree.",
  "The girl sings a song.",
  "The cat chases a mouse.",
  "The student solves a puzzle."
];

// Primary 4: Sentences with modifiers (20)
const sentencesP4 = [
  "The happy girl sings beautifully.",
  "The boy quickly runs to school.",
  "The teacher explains the lesson clearly.",
  "The children play in the park.",
  "The red car moves fast.",
  "The little boy smiles brightly.",
  "The old man walks slowly.",
  "The smart student solves problems.",
  "The busy mother prepares breakfast.",
  "The gentle wind blows softly.",
  "The excited child jumps high.",
  "The kind teacher helps everyone.",
  "The little girl reads a colorful book.",
  "The brave boy climbs the tall tree.",
  "The cheerful students study hard.",
  "The calm lake reflects the sky.",
  "The fast train zooms by.",
  "The playful puppy chases its tail.",
  "The thoughtful boy shares his toys.",
  "The pretty garden blooms in spring."
];

// Primary 5: Compound or multi-clause sentences (20)
const sentencesP5 = [
  "The teacher reads a story, and the children listen attentively.",
  "The boy finished his homework before dinner.",
  "The little girl happily skipped to school.",
  "The bright sun shines over the calm sea.",
  "The busy bees buzz around the blooming flowers.",
  "The students study in the library, and they take notes carefully.",
  "The father cooks dinner, and the children set the table.",
  "The dog barks loudly, but the cat remains calm.",
  "The rain poured outside, yet the class continued indoors.",
  "The bird sings in the morning, and the flowers open up.",
  "The boy plays soccer, while his friend rides a bike.",
  "The teacher writes on the board, and the students copy the notes.",
  "The car stops at the red light, and the driver waits patiently.",
  "The children laugh during recess, and they return to class happily.",
  "The sun sets in the west, and the sky turns orange.",
  "The little girl draws a picture, and her mother praises her work.",
  "The student answers the question, and the teacher smiles.",
  "The dog runs in the park, and the kids cheer.",
  "The wind blows gently, and the leaves rustle.",
  "The book is open on the desk, and the student reads silently."
];

// Primary 6: Complex sentences with subordinate clauses (20)
const sentencesP6 = [
  "After finishing his homework, the student went to the library.",
  "Although it was raining, the children played outside happily.",
  "The teacher, who was very kind, explained the lesson in detail.",
  "Despite the heavy traffic, she arrived at school on time.",
  "When the bell rang, the students hurried to their classrooms.",
  "Since the exam was challenging, the teacher reviewed the material thoroughly.",
  "Even though it was late, the boy continued reading his favorite book.",
  "While the sun was setting, the family enjoyed a picnic in the park.",
  "If you study hard, you will achieve great results.",
  "After the game ended, the players celebrated their victory.",
  "Although the movie was long, the audience remained engaged.",
  "Because the weather was cool, the picnic lasted longer than expected.",
  "Since the library was quiet, the students concentrated on their studies.",
  "When the storm passed, the children went outside to play.",
  "After receiving his award, the student thanked his parents.",
  "Although she was tired, the teacher continued to prepare lessons.",
  "If you practice regularly, your skills will improve over time.",
  "While the bell was ringing, the students gathered in the hall.",
  "Because the assignment was difficult, the students worked in groups.",
  "After the concert ended, the crowd applauded enthusiastically."
];

/* === Global Variables === */
let puzzles = [];  // Array of puzzle objects: { correct: Array, submitted: Boolean, userAnswer: Array }
let currentPuzzleIndex = 0;
let score = 0;
let currentLevel = 'p3'; // Default level is Primary 3
const sessionLength = 5;  // Only 5 puzzles per session

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
  // Randomly select 'sessionLength' sentences from the pool
  const selectedSentences = shuffle([...sentencePool]).slice(0, sessionLength);
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
  header.innerText = `Question ${currentPuzzleIndex + 1} of ${sessionLength}: Arrange the words:`;
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
  
  // Attach event listeners for drop zone and word bank
  [wordBank, dropZone].forEach(zone => {
    zone.addEventListener("dragover", handleDragOver);
    zone.addEventListener("dragleave", handleDragLeave);
    zone.addEventListener("drop", handleDrop);
  });
  
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
    // If submitted, display the student's answer in the drop zone with highlighting,
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
  document.getElementById("progress").innerText = `Question ${currentPuzzleIndex + 1} of ${sessionLength}`;
  document.getElementById("score").innerText = `Score: ${score}`;
}

/* === Drag & Drop Handlers === */
let draggedItem = null;

function handleDragStart(e) {
  draggedItem = e.target;
  e.target.style.opacity = "0.5";
  e.dataTransfer.setData("text/plain", e.target.innerText);
  console.log("Drag started for:", e.target.innerText);
}

function handleDragEnd(e) {
  e.target.style.opacity = "1";
  console.log("Drag ended for:", e.target.innerText);
}

function handleDragOver(e) {
  e.preventDefault();
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.add("active");
    console.log("Drag over drop-zone:", e.currentTarget);
  }
}

function handleDragLeave(e) {
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.remove("active");
    console.log("Drag left drop-zone:", e.currentTarget);
  }
}

function handleDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.currentTarget.classList.contains("drop-zone")) {
    e.currentTarget.classList.remove("active");
    console.log("Drop event fired on:", e.currentTarget);
    if (draggedItem) {
      console.log("Dropped item:", draggedItem.innerText);
      e.currentTarget.appendChild(draggedItem);
    } else {
      console.warn("No dragged item available on drop.");
    }
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
    alert("Session complete! You have finished 5 questions for this level.");
    // Optionally, you might prompt the user to move to the next level.
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
