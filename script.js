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
// Primary 1: P1 test–style sentences (20)
const sentencesP1 = [
  "I made mistakes in my test.",
  "Do you know the answer to this puzzle?",
  "Ann lives in that house over there.",
  "Tony had cereal for breakfast.",
  "Which animal is the largest in the world?",
  "Can you solve this puzzle?",
  "I like my new book.",
  "Do you see the red ball?",
  "My cat sleeps on the mat.",
  "Is this your favorite toy?",
  "I need help with my homework.",
  "Do you want to play with me?",
  "The dog runs in the park.",
  "She sings a pretty song.",
  "Can you come to my party?",
  "I lost my pencil today.",
  "He rides a small bicycle.",
  "Are you ready for school?",
  "My friend smiles brightly.",
  "The bird flies high."
];

// Primary 2: Revised for increased challenge (20)
const sentencesP2 = [
  "The small boy eats a crunchy apple.",
  "The girl plays with a bright, shiny toy.",
  "The dog chases the bouncing ball.",
  "The teacher reads an interesting book aloud.",
  "The cat drinks cold milk from a bowl.",
  "The boy kicks the red ball with energy.",
  "The girl draws a neat picture in class.",
  "The dog barks at a stranger on the street.",
  "The student writes a short letter.",
  "The mother cooks a tasty dinner.",
  "The father drives a blue car carefully.",
  "The boy catches a slippery frog near the pond.",
  "The girl rides her bicycle around the block.",
  "The dog fetches the stick with enthusiasm.",
  "The teacher explains the lesson clearly.",
  "The child opens the door to welcome the day.",
  "The boy climbs a tall tree in the park.",
  "The girl sings a joyful song at recess.",
  "The cat chases a tiny mouse in the garden.",
  "The student solves a simple puzzle."
];

// Primary 3: Complete subject–verb–object sentences (20)
const sentencesP3 = [
  "The boy eats an apple during recess.",
  "The girl plays with a shiny toy in class.",
  "The dog chases the ball across the field.",
  "The teacher reads an interesting story to the students.",
  "The cat drinks milk from a small bowl.",
  "The boy kicks the ball with enthusiasm.",
  "The girl draws a colorful picture on the board.",
  "The dog barks at the stranger outside.",
  "The student writes a letter to his friend.",
  "The mother cooks dinner for the family.",
  "The father drives a car on busy roads.",
  "The boy catches a slippery frog near the pond.",
  "The girl rides her bicycle along the street.",
  "The dog fetches the stick in the yard.",
  "The teacher explains the lesson clearly to the class.",
  "The child opens the door to let in the sunshine.",
  "The boy climbs a tall tree in the park.",
  "The girl sings a sweet song during assembly.",
  "The cat chases a little mouse in the garden.",
  "The student solves a challenging puzzle."
];

// Primary 4: Sentences with modifiers (20)
const sentencesP4 = [
  "The cheerful girl sings beautifully during the assembly.",
  "The boy quickly runs to school, eager to learn.",
  "The teacher patiently explains the lesson to her students.",
  "The children happily play in the spacious park.",
  "The shiny red car moves fast on the busy road.",
  "The little boy smiles brightly when he sees his friend.",
  "The elderly man walks slowly with a steady pace.",
  "The smart student solves problems with ease.",
  "The busy mother prepares a delicious breakfast every morning.",
  "The gentle wind blows softly, rustling the leaves.",
  "The excited child jumps high in joyful celebration.",
  "The kind teacher helps every student after class.",
  "The little girl reads a colorful book under a tree.",
  "The brave boy climbs the tall tree with determination.",
  "The attentive class listens carefully to the teacher.",
  "The calm lake reflects the clear blue sky perfectly.",
  "The fast train zooms past the station with speed.",
  "The playful puppy chases its tail with energy.",
  "The thoughtful boy shares his toys generously.",
  "The pretty garden blooms vibrantly in early spring."
];

// Primary 5: Compound/multi-clause sentences (20)
const sentencesP5 = [
  "The teacher reads a fascinating story, and the children listen attentively.",
  "The boy finished his homework before dinner, so he went outside to play.",
  "The little girl happily skipped to school, and her friends cheered her on.",
  "The bright sun shines over the calm sea, while a gentle breeze cools the air.",
  "The busy bees buzz around the blooming flowers, and the children watch in wonder.",
  "The students study in the library, and they take notes carefully.",
  "The father cooks dinner, and the children help set the table.",
  "The dog barks loudly, but the cat remains calm and sleeps.",
  "The rain poured outside, yet the class continued their lesson indoors.",
  "The bird sings in the morning, and the flowers open gracefully.",
  "The boy plays soccer, while his friend rides a bicycle around the field.",
  "The teacher writes on the board, and the students copy the notes precisely.",
  "The car stops at the red light, and the driver waits patiently for the signal.",
  "The children laugh during recess, and they return to class full of energy.",
  "The sun sets in the west, and the sky turns a beautiful orange.",
  "The little girl draws a picture, and her mother praises her creativity.",
  "The student answers the question correctly, and the teacher smiles proudly.",
  "The dog runs in the park, and the kids cheer excitedly.",
  "The wind blows gently, and the leaves rustle softly.",
  "The book is open on the desk, and the student reads silently."
];

// Primary 6: Complex sentences with subordinate clauses (20)
const sentencesP6 = [
  "After finishing his homework, the student went to the library to study more.",
  "Although it was raining heavily, the children played outside happily during recess.",
  "The teacher, who was known for her kindness, explained the lesson in remarkable detail.",
  "Despite the heavy traffic, she arrived at school on time and greeted everyone warmly.",
  "When the bell rang, the students hurried to their classrooms with excitement.",
  "Since the exam was extremely challenging, the teacher reviewed the material thoroughly afterward.",
  "Even though it was late, the boy continued reading his favorite book with great enthusiasm.",
  "While the sun was setting, the family enjoyed a delightful picnic in the park.",
  "If you study hard every day, you will achieve excellent results in your exams.",
  "After the game ended, the players celebrated their victory with cheers and applause.",
  "Although the movie was quite long, the audience remained engaged until the very end.",
  "Because the weather was unexpectedly cool, the picnic lasted longer than anticipated.",
  "Since the library was exceptionally quiet, the students concentrated deeply on their research.",
  "When the storm passed, the children went outside to play joyfully.",
  "After receiving his award, the student thanked his parents for their unwavering support.",
  "Although she was extremely tired, the teacher continued to prepare engaging lessons.",
  "If you practice regularly, your skills will improve significantly over time.",
  "While the bell was ringing, the students gathered in the hall to listen attentively.",
  "Because the assignment was particularly difficult, the students worked in groups to complete it.",
  "After the concert ended, the crowd applauded enthusiastically as the performers took a bow."
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
  
  // Clear any previous hint or success message
  document.getElementById("hint").innerText = "";
  document.getElementById("success-message").innerText = "";
  
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
      wordDiv.tabIndex = 0;  // Enable keyboard focus
      wordDiv.innerText = word;
      wordDiv.addEventListener("dragstart", handleDragStart);
      wordDiv.addEventListener("dragend", handleDragEnd);
      // Add touch event listeners for better mobile support:
      wordDiv.addEventListener("touchstart", handleTouchStart, {passive: false});
      wordDiv.addEventListener("touchmove", handleTouchMove, {passive: false});
      wordDiv.addEventListener("touchend", handleTouchEnd, {passive: false});
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
  
  // Update progress bar
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${((currentPuzzleIndex + 1) / sessionLength) * 100}%`;
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

/* === Touch Event Handlers for Mobile Devices === */
let touchDragItem = null;

function handleTouchStart(e) {
  e.preventDefault();
  touchDragItem = e.target;
  touchDragItem.classList.add("dragging");
  // Simulate dragstart by storing touch coordinates
}

function handleTouchMove(e) {
  e.preventDefault();
  const touch = e.touches[0];
  // Move the element under the touch
  touchDragItem.style.position = "absolute";
  touchDragItem.style.left = touch.pageX - touchDragItem.offsetWidth / 2 + "px";
  touchDragItem.style.top = touch.pageY - touchDragItem.offsetHeight / 2 + "px";
}

function handleTouchEnd(e) {
  e.preventDefault();
  // Determine the drop target
  const touch = e.changedTouches[0];
  const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
  if (dropTarget && dropTarget.classList.contains("drop-zone")) {
    dropTarget.appendChild(touchDragItem);
  }
  // Reset style and class
  touchDragItem.style.position = "";
  touchDragItem.style.left = "";
  touchDragItem.style.top = "";
  touchDragItem.classList.remove("dragging");
  touchDragItem = null;
}

/* === Show Hint Function === */
function showHint() {
  const hintElem = document.getElementById("hint");
  const puzzle = puzzles[currentPuzzleIndex];
  if (!puzzle.submitted) {
    hintElem.innerText = `Hint: The sentence begins with "${puzzle.correct[0]}".`;
  } else {
    let correctCount = 0;
    puzzle.userAnswer.forEach((word, index) => {
      if (word === puzzle.correct[index]) correctCount++;
    });
    if (correctCount < puzzle.correct.length) {
      hintElem.innerText = `Partial Credit: ${correctCount} out of ${puzzle.correct.length} words are in the correct position.`;
    } else {
      hintElem.innerText = "";
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
  
  // Highlight each word in the drop zone.
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
    const successElem = document.getElementById("success-message");
    successElem.innerText = "✓ Correct!";
    setTimeout(() => { successElem.innerText = ""; }, 3000);
  } else {
    speak("That's not quite right. The correct sentence is: " + puzzle.correct.join(" "));
    let correctCount = 0;
    puzzle.userAnswer.forEach((word, index) => {
      if (word === puzzle.correct[index]) correctCount++;
    });
    document.getElementById("hint").innerText = `Partial Credit: ${correctCount} out of ${puzzle.correct.length} words are in the correct position.`;
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

/* === Fullscreen Toggle Function === */
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.warn(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
  }
}

/* === Global Event Listeners === */
document.getElementById("listen-instructions-btn").addEventListener("click", () => {
  const instructions = document.querySelector("p.instructions").innerText;
  speak(instructions);
});
document.getElementById("hint-btn").addEventListener("click", showHint);
document.getElementById("submit-btn").addEventListener("click", submitAnswer);
document.getElementById("next-btn").addEventListener("click", nextPuzzle);
document.getElementById("prev-btn").addEventListener("click", prevPuzzle);
document.getElementById("reset-btn").addEventListener("click", resetQuiz);
document.getElementById("level-select").addEventListener("change", (e) => {
  currentLevel = e.target.value;
  resetQuiz();
});
document.getElementById("fullscreen-btn").addEventListener("click", toggleFullScreen);

/* === Initialize Quiz on DOM Ready === */
document.addEventListener("DOMContentLoaded", () => {
  generatePuzzles();
  displayCurrentPuzzle();
});
