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

// -------------------------
// Primary 1: Comparable to the reference P1 test examples (20 sentences)
// -------------------------
const sentencesP1 = [
  "I made mistakes in my test.",
  "Do you know the answer to this puzzle?",
  "Ann lives in that house over there.",
  "Tony had cereal for breakfast.",
  "Which animal is the largest in the world?",
  "The cat sleeps under the warm sun.",
  "My brother plays with his toy.",
  "I see a red ball in the park.",
  "Do you like to play games?",
  "The bird flies high in the sky.",
  "She sings a lovely song.",
  "He eats a juicy apple.",
  "We went to school on time.",
  "My dad drives a blue car.",
  "Can you solve this simple puzzle?",
  "The dog runs fast in the yard.",
  "They watch a fun cartoon.",
  "I love to read a book.",
  "Is this your favorite color?",
  "The boy rides a small bicycle."
];

// -------------------------
// Primary 2: Simple sentences with adjectives (20 sentences)
// -------------------------
const sentencesP2 = [
  "The small boy kicks a red ball.",
  "A happy girl sings a joyful song.",
  "The green apple tastes very sweet.",
  "A little dog barks at a stranger.",
  "The bright sun shines over the park.",
  "My mother cooks a delicious meal.",
  "The old man walks slowly on the road.",
  "A big cat sleeps under a warm roof.",
  "The blue car zooms down the street.",
  "Do you like the colorful playground?",
  "The cute kitten plays with a ball.",
  "A tall tree grows near our school.",
  "The small bird chirps in the garden.",
  "My sister draws a beautiful picture.",
  "The gentle breeze cools the busy street.",
  "He wears a bright hat every day.",
  "The red flower blooms in spring.",
  "A friendly dog greets its owner.",
  "The white cloud floats in the clear sky.",
  "Can you see the shining stars tonight?"
];

// -------------------------
// Primary 3: Complete subject-verb-object sentences (20 sentences)
// -------------------------
const sentencesP3 = [
  "The boy eats a crunchy apple during lunch break.",
  "The girl plays with a shiny toy in the classroom.",
  "The dog chases the ball across the green field.",
  "The teacher reads an interesting story to the students.",
  "The cat drinks fresh milk from a small bowl.",
  "The boy kicks the ball with great enthusiasm.",
  "The girl draws a colorful picture on the board.",
  "The dog barks loudly at the passing stranger.",
  "The student writes a letter to his best friend.",
  "The mother cooks a healthy dinner for the family.",
  "The father drives the car carefully on busy roads.",
  "The boy catches a slippery frog near the pond.",
  "The girl rides a bicycle along the quiet street.",
  "The dog fetches the stick thrown by its owner.",
  "The teacher explains the lesson clearly to the class.",
  "The child opens the door to let in the sunshine.",
  "The boy climbs the tall tree in the schoolyard.",
  "The girl sings a soft song during morning assembly.",
  "The cat chases a small mouse in the garden.",
  "The student solves a tricky puzzle on his desk."
];

// -------------------------
// Primary 4: Sentences with modifiers (20 sentences)
// -------------------------
const sentencesP4 = [
  "The cheerful girl sings beautifully during the school assembly.",
  "The boy quickly runs to school, eager to learn new things.",
  "The teacher patiently explains the complex lesson to her students.",
  "The children happily play in the park on a sunny afternoon.",
  "The shiny red car moves fast on the busy city road.",
  "The little boy smiles brightly as he enjoys his cartoon.",
  "The elderly man walks slowly while carrying his umbrella.",
  "The smart student diligently solves problems in class.",
  "The busy mother prepares a delicious breakfast for the family.",
  "The gentle wind blows softly, making the leaves dance.",
  "The excited child jumps high, celebrating his small victory.",
  "The kind teacher helps every student with their homework.",
  "The little girl reads a colorful book in the shade.",
  "The brave boy climbs the tall tree with determination.",
  "The cheerful class listens attentively as the teacher explains a story.",
  "The calm lake reflects the clear blue sky on a sunny day.",
  "The fast train zooms past the station with impressive speed.",
  "The playful puppy chases its tail with endless energy.",
  "The thoughtful boy shares his toys with his friends.",
  "The pretty garden blooms vibrantly in early spring."
];

// -------------------------
// Primary 5: Compound or multi-clause sentences (20 sentences)
// -------------------------
const sentencesP5 = [
  "The teacher reads a fascinating story, and the children listen with great attention.",
  "The boy finished his homework before dinner, so he went out to play.",
  "The little girl happily skipped to school, and her friends cheered her on.",
  "The bright sun shines over the calm sea, while a gentle breeze soothes everyone.",
  "The busy bees buzz around the blooming flowers, and the children watch in wonder.",
  "The students study in the library, and they take notes carefully during the lesson.",
  "The father cooks dinner, and the children help set the table for a family meal.",
  "The dog barks loudly, but the cat remains calm and watches quietly.",
  "The rain poured outside, yet the class continued their lesson indoors.",
  "The bird sings in the morning, and the flowers open up to welcome the day.",
  "The boy plays soccer, while his friend rides a bike around the playground.",
  "The teacher writes on the board, and the students copy the notes attentively.",
  "The car stops at the red light, and the driver waits patiently for the signal.",
  "The children laugh during recess, and they return to class full of energy.",
  "The sun sets in the west, and the sky turns a beautiful shade of orange.",
  "The little girl draws a picture, and her mother praises her creative work.",
  "The student answers the question correctly, and the teacher smiles proudly.",
  "The dog runs in the park, and the kids cheer as it chases a ball.",
  "The wind blows gently, and the leaves rustle softly in the evening.",
  "The book is open on the desk, and the student reads quietly while taking notes."
];

// -------------------------
// Primary 6: Complex sentences with subordinate clauses (20 sentences)
// -------------------------
const sentencesP6 = [
  "After finishing his homework, the student went to the library to search for more books.",
  "Although it was raining heavily, the children played outside happily during recess.",
  "The teacher, who was known for her kindness, explained the lesson in remarkable detail.",
  "Despite the heavy traffic, she arrived at school on time and greeted everyone warmly.",
  "When the bell rang, the students hurried to their classrooms, eager to start the day.",
  "Since the exam was extremely challenging, the teacher reviewed the material thoroughly after class.",
  "Even though it was late, the boy continued reading his favorite book with great enthusiasm.",
  "While the sun was setting, the family enjoyed a delightful picnic in the nearby park.",
  "If you study diligently every day, you will achieve excellent results in your exams.",
  "After the game ended, the players celebrated their victory by cheering and clapping loudly.",
  "Although the movie was quite long, the audience remained engaged and watched until the end.",
  "Because the weather was unexpectedly cool, the picnic lasted longer than anticipated.",
  "Since the library was exceptionally quiet, the students concentrated deeply on their research.",
  "When the storm finally passed, the children went outside to play and enjoy the fresh air.",
  "After receiving his award, the student thanked his parents and promised to work harder.",
  "Although she was extremely tired, the teacher continued to prepare lessons for the week.",
  "If you practice regularly and pay attention in class, your skills will improve significantly.",
  "While the bell was ringing, the students gathered in the hall and listened to the announcements.",
  "Because the assignment was particularly difficult, the students worked in groups to complete it.",
  "After the concert ended, the crowd applauded enthusiastically, and the performers took a bow."
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
