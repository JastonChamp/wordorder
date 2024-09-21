// JavaScript: spinner.js

const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

let revealedWords = 0;  // Track how many words have been revealed
const totalWords = sightWords.length;  // Total number of words

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');  // Debugging log to confirm DOM is loaded

    const wordDisplay = document.getElementById('wordDisplay');
    const spinButton = document.getElementById('spinButton');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const complimentBox = document.getElementById('complimentBox');

    const compliments = ['Great job!', 'Fantastic!', 'Well done!', 'You did it!', 'Awesome!'];
  
    // Function to spin and select a random word
    function spinWord() {
        console.log('Spin button clicked');  // Debugging log to check button click

        // Reset UI for each new spin
        wordDisplay.classList.remove('shake');
        wordDisplay.textContent = '';  // Clear the word display
        complimentBox.textContent = '';  // Clear the compliment box

        // Add shake effect for a little animation
        wordDisplay.classList.add('shake');
        setTimeout(() => {
            wordDisplay.classList.remove('shake');  // Remove shake after a short delay
        }, 500);

        // Select a random word from the array
        const randomIndex = Math.floor(Math.random() * sightWords.length);
        const selectedWord = sightWords[randomIndex];
        console.log('Selected Word:', selectedWord);  // Debugging log to show selected word
        wordDisplay.textContent = selectedWord;

        // Remove the revealed word from the array so it isn't repeated
        sightWords.splice(randomIndex, 1);

        // Speak the word using the Web Speech API
        speakWord(selectedWord);

        // Update the progress bar and text
        revealedWords++;
        updateProgress();

        // Show a compliment after speaking the word
        setTimeout(giveCompliment, 1000);  // Delay before showing compliment
    }

    // Function to speak the word using the Web Speech API
    function speakWord(word) {
        const utterance = new SpeechSynthesisUtterance(word);
        console.log('Speaking Word:', word);  // Debugging log to confirm speaking
        window.speechSynthesis.speak(utterance);  // Speak the word aloud
    }

    // Function to show a random compliment after revealing a word
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
        console.log('Progress Updated:', `${revealedWords} / ${totalWords} Words Revealed`);  // Log progress
        progressFill.style.width = progressPercentage + '%';  // Update progress bar width
        progressText.textContent = `${revealedWords} / ${totalWords} Words Revealed`;  // Update progress text
    }

    // Add event listener to the spin button
    spinButton.addEventListener('click', spinWord);

    console.log('Event listener added to spinButton');  // Log to confirm event listener is added
});
