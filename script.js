// A larger pool of 100 sentences to train word order variety
const sentencePool = [
  "The cat sat on the mat.",
  "A big red balloon floated in the sky.",
  "I enjoy reading my favorite storybook.",
  "My friend and I play soccer after school.",
  "The sun shines brightly on a warm day.",
  "Birds chirp melodiously in the early morning.",
  "The little boy kicked the ball across the field.",
  "She sang a beautiful song at the school concert.",
  "The trees swayed gently in the cool breeze.",
  "A rainbow appeared after the heavy rain.",
  "The puppy chased its tail in the garden.",
  "Grandma baked delicious cookies for everyone.",
  "The children laughed while playing hide and seek.",
  "Stars twinkled in the clear night sky.",
  "The butterfly fluttered over the blooming flowers.",
  "The dog barked loudly at the mailman.",
  "Mom made a tasty dinner for the family.",
  "The car zoomed down the busy road.",
  "He drew a colorful picture of the ocean.",
  "The teacher read an interesting story to the class.",
  "The fish swam gracefully in the pond.",
  "She wore a bright yellow dress to the party.",
  "The garden was full of blooming roses.",
  "A little bird built a nest on the tree.",
  "He played the piano with great skill.",
  "The library was quiet and peaceful.",
  "A gentle rain fell on the playground.",
  "They enjoyed a picnic in the park.",
  "The airplane soared high above the clouds.",
  "She wrote a letter to her best friend.",
  "The snow fell softly on the ground.",
  "He rode his bicycle around the neighborhood.",
  "The river flowed calmly through the town.",
  "A curious kitten explored the house.",
  "The farmer planted vegetables in the garden.",
  "The cake was decorated with colorful sprinkles.",
  "They sang a happy song during the celebration.",
  "The clock ticked steadily on the wall.",
  "He built a sandcastle at the beach.",
  "The stars shone brightly in the night sky.",
  "She skipped joyfully on her way to school.",
  "The squirrel quickly climbed the tall tree.",
  "A gentle breeze cooled the hot afternoon.",
  "He solved the puzzle with great care.",
  "The train arrived at the station on time.",
  "The wind whispered through the leaves.",
  "A playful dolphin jumped in the sea.",
  "The farmer milked the cow in the barn.",
  "She painted a beautiful picture of a garden.",
  "The children built a fort out of cushions.",
  "The ice cream melted on the hot summer day.",
  "He caught a shiny fish from the lake.",
  "The busy bees buzzed around the flowers.",
  "She tied a ribbon around her new book.",
  "The castle stood tall on the hill.",
  "A tiny ant marched on the ground.",
  "He found a smooth pebble on the path.",
  "The moon glowed softly in the dark sky.",
  "She whispered a secret to her friend.",
  "The windmill turned slowly in the field.",
  "A brave knight rode a strong horse.",
  "The forest was filled with chirping birds.",
  "He picked a bouquet of wildflowers.",
  "The rain stopped and the sun appeared.",
  "She danced gracefully at the recital.",
  "The little ducklings followed their mother.",
  "A gentle stream flowed through the forest.",
  "The family gathered for a fun game night.",
  "He built a model airplane from scratch.",
  "The artist mixed vibrant colors on the palette.",
  "The baby giggled at the playful puppy.",
  "She read a bedtime story to her sibling.",
  "The mountain peak was covered in snow.",
  "The wind blew the leaves across the yard.",
  "A cheerful tune played on the radio.",
  "The library had many interesting books.",
  "He wore a bright red hat to the fair.",
  "The campfire crackled under the starry sky.",
  "She made a delicious sandwich for lunch.",
  "The train chugged along the tracks.",
  "A kind neighbor helped carry the groceries.",
  "The flower garden smelled wonderfully sweet.",
  "He practiced his spelling words every day.",
  "The gentle teacher explained the lesson clearly.",
  "The dog wagged its tail happily.",
  "She admired the sparkling jewels in the shop.",
  "The city lights twinkled in the distance.",
  "He built a treehouse in the backyard.",
  "The morning dew covered the grass.",
  "A soft melody filled the quiet room.",
  "She baked a chocolate cake for the party.",
  "The gentle cat purred on her lap.",
  "He collected shiny stickers for his album.",
  "The birds flew south for the winter.",
  "She skipped stones across the calm lake.",
  "The new student made many friends.",
  "A playful kitten chased a ball of yarn.",
  "The aroma of fresh bread filled the kitchen.",
  "He enjoyed a cool glass of lemonade.",
  "The joyful children ran and played in the park."
];

// Set the number of puzzles to display (adjust as needed)
const numPuzzles = 5;
let puzzles = [];

// Shuffle function using the Fisher-Yates algorithm
function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

// Dynamically generate puzzle containers from the sentence pool
function generatePuzzles() {
  // Shuffle the sentence pool and pick the desired number of puzzles
  const shuffledSentences = shuffle([...sentencePool]);
  const selectedSentences = shuffledSentences.slice(0, numPuzzles);

  puzzles = selectedSentences.map(sentence => {
    return {
      correct: sentence.split(" "),
      container: null
    };
  });

  // Create HTML elements for each puzzle
  const puzzlesContainer = document.getElementById("puzzles");
  puzzlesContainer.innerHTML = ""; // Clear previous puzzles

  puzzles.forEach((puzzle, index) => {
    const puzzleDiv = document.createElement("div");
    puzzleDiv.className = "sentence-container";
    puzzleDiv.setAttribute("data-answer", puzzle.correct.join(" "));

    // Create a header for the puzzle
    const header = document.createElement("h3");
    header.innerText = `${index + 1}) Arrange the words:`;
    puzzleDiv.appendChild(header);

    // Create Word Bank and Drop Zone divs
    const wordBank = document.createElement("div");
    wordBank.className = "word-bank";
    wordBank.setAttribute("aria-label", "Word Bank");
    puzzleDiv.appendChild(wordBank);

    const dropZone = document.createElement("div");
    dropZone.className = "drop-zone";
    dropZone.setAttribute("aria-label", "Drop Zone");
    puzzleDiv.appendChild(dropZone);

    // Attach this puzzle container to the puzzle object
    puzzle.container = puzzleDiv;

    // Append the puzzle container to the main puzzles div
    puzzlesContainer.appendChild(puzzleDiv);
  });
}

// Drag & Drop functionality
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
}

function handleDrop(e) {
  e.preventDefault();
  // Only allow drop on valid zones: word-bank or drop-zone
  if (e.target.classList.contains("word-bank") || e.target.classList.contains("drop-zone")) {
    e.target.appendChild(draggedItem);
  }
}

// Initialize the game: populate each word bank with shuffled words
function initializeGame() {
  // Clear any previous score
  document.getElementById("score").innerText = "";
  generatePuzzles();

  puzzles.forEach(puzzle => {
    const container = puzzle.container;
    const wordBank = container.querySelector(".word-bank");
    const dropZone = container.querySelector(".drop-zone");

    // Clear previous content (in case of a reset)
    wordBank.innerHTML = "";
    dropZone.innerHTML = "";

    // Shuffle the words for this puzzle and create draggable word elements
    let wordsShuffled = shuffle([...puzzle.correct]);
    wordsShuffled.forEach(word => {
      // Debug: console.log("Creating word:", word);
      let wordDiv = document.createElement("div");
      wordDiv.className = "word";
      wordDiv.draggable = true;
      wordDiv.innerText = word;
      wordDiv.addEventListener("dragstart", handleDragStart);
      wordDiv.addEventListener("dragend", handleDragEnd);
      wordBank.appendChild(wordDiv);
    });

    // Set up drop zones with event listeners
    [wordBank, dropZone].forEach(zone => {
      zone.addEventListener("dragover", handleDragOver);
      zone.addEventListener("drop", handleDrop);
    });
  });
}

// Check the student's answers and provide visual feedback
function checkAnswers() {
  let totalCorrect = 0;
  puzzles.forEach(puzzle => {
    const container = puzzle.container;
    const dropZone = container.querySelector(".drop-zone");
    const userWords = Array.from(dropZone.children).map(word => word.innerText);
    const correctWords = puzzle.correct;
    let isCorrect = (userWords.join(" ") === correctWords.join(" "));

    // Remove previous highlighting using only element children
    Array.from(dropZone.children).forEach(word => {
      word.classList.remove("correct", "incorrect");
    });

    // Highlight correct and incorrect words
    Array.from(dropZone.children).forEach((word, index) => {
      if (word.innerText === correctWords[index]) {
        word.classList.add("correct");
      } else {
        word.classList.add("incorrect");
      }
    });

    if (isCorrect) totalCorrect++;
  });
  document.getElementById("score").innerText = `You got ${totalCorrect} out of ${puzzles.length} sentences correct!`;
}

// Reset the game so that students can try a new set of puzzles
function resetGame() {
  document.querySelectorAll(".word").forEach(word => {
    word.classList.remove("correct", "incorrect");
  });
  initializeGame();
}

// Button event listeners
document.getElementById("check-btn").addEventListener("click", checkAnswers);
document.getElementById("reset-btn").addEventListener("click", resetGame);

// Initialize the game when the DOM is ready
document.addEventListener("DOMContentLoaded", initializeGame);
