// JavaScript: spinner.js

const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

let revealedWords = 0;
const totalWords = sightWords.length;

document.addEventListener('DOMContentLoaded', () => {
  const wordDisplay = document.getElementById('wordDisplay');
  const spinButton = document.getElementById('spinButton');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const complimentBox = document.getElementById('complimentBox');

  const compliments = ['Great job!', 'Fantastic!', 'Well done!', 'You did it!', 'Awesome!'];
  
  // Function to spin and select a random word
  function spinWord() {
    // Reset UI
    wordDisplay.classList.remove('shake');
    wordDisplay.textContent = '';
    complimentBox.textContent = '';

    // Add shake effect
    wordDisplay.classList.add('shake');
    setTimeout(() => {
        wordDisplay.classList.remove('shake'); // Remove shake effect after animation
    }, 500);

    // Select a random word
    const randomIndex = Math.floor(Math.random() * sightWords.length);
    const selectedWord = sightWords[randomIndex];
    wordDisplay.textContent = selectedWord;

    // Remove the revealed word from the array to avoid repetition
    sightWords.splice(randomIndex, 1);

    // Speak the word aloud
    speakWord(selectedWord);

    // Update progress
    revealedWords++;
    updateProgress();

    // Show compliment after speaking
    setTimeout(giveCompliment, 1000);
  }

  // Function to speak the word using Web Speech API
  function speakWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    window.speechSynthesis.speak(utterance);
  }

  // Function to show a random compliment
  function giveCompliment() {
    const compliment = compliments[Math.floor(Math.random() * compliments.length)];
    complimentBox.textContent = compliment;

    // Speak the compliment
    const utterance = new SpeechSynthesisUtterance(compliment);
    window.speechSynthesis.speak(utterance);
  }

  // Function to update the progress bar and text
  function updateProgress() {
    const progressPercentage = (revealedWords / totalWords) * 100;
    progressFill.style.width = progressPercentage + '%';
    progressText.textContent = `${revealedWords} / ${totalWords} Words Revealed`;
  }

  // Add event listener to the spin button
  spinButton.addEventListener('click', spinWord);
});
