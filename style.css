const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

const cardContainer = document.querySelector('.card-row');
const startButton = document.getElementById('start-button');
let flippedCards = [];
let matchedCards = [];
let shuffledSets = [];
let currentSet = 0;

// Shuffle the sets of 5 words with 2 cards each
function shuffleSets() {
  const sets = [];
  const wordsCopy = sightWords.slice();

  while (wordsCopy.length > 0) {
    const set = [];
    for (let i = 0; i < 5; i++) {
      const word = wordsCopy.pop();
      set.push(word, word); // Add 2 cards with the same word
    }
    sets.push(set);
  }

  return sets;
}

// Shuffle array helper
function shuffleArray(array) {
  const shuffled = array.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Create and append cards to the DOM
function createCards() {
  cardContainer.innerHTML = '';
  const set = shuffleArray(shuffledSets[currentSet]);
  set.forEach(word => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.word = word;
    card.addEventListener('click', () => flipCard(card));
    cardContainer.appendChild(card);
  });
}

// Handle card click event
function flipCard(card) {
  if (flippedCards.length < 2 && !flippedCards.includes(card)) {
    card.textContent = card.dataset.word;
    flippedCards.push(card);

    if (flippedCards.length === 2) {
      const [card1, card2] = flippedCards;
      if (card1.dataset.word === card2.dataset.word) {
        matchedCards.push(card1, card2);
        flippedCards = [];
        card1.classList.add('matched');
        card2.classList.add('matched');
      } else {
        setTimeout(() => {
          card1.textContent = '';
          card2.textContent = '';
          flippedCards = [];
        }, 1000);
      }
    }

    if (matchedCards.length === shuffledSets[currentSet].length) {
      matchedCards = [];
      currentSet++;
      if (currentSet < shuffledSets.length) {
        startButton.textContent = 'Next Set of Words';
        startButton.disabled = false;
      } else {
        startButton.textContent = 'Game Over';
        startButton.disabled = true;
      }
    }
  }
}

// Handle start button click event
startButton.addEventListener('click', () => {
  startButton.disabled = true;
  shuffledSets = shuffleSets();
  currentSet = 0;
  createCards();
});

// Initialize the game
createCards();
