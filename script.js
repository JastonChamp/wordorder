// JavaScript: spinner.js

const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

let revealedWords = 0;  // Track revealed words
const totalWords = sightWords.length;  // Total number of words
let selectedVoice = null;  // This will store the selected female voice

document.addEventListener('DOMContentLoaded', () => {
    const wordDisplay = document.getElementById('wordDisplay');
    const spinButton = document.getElementById('spinButton');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const complimentBox = document.getElementById('complimentBox');

    const compliments = ['Great job!', 'Fantastic!', 'Well done!', 'You did it!', 'Awesome!'];

    // Select a female voice or fallback
    function setFemaleVoice() {
        const voices = window.speechSynthesis.getVoices();
        
        // Attempt to find a specific female voice (Google UK Female)
        selectedVoice = voices.find(voice => 
            voice.name.includes('Google UK English Female') || voice.name.includes('female')
        );

        // Fallback to first available voice if no female voice is found
        if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
        }

        // Safari-specific fallback: retry loading voices if none are found
        if (voices.length === 0) {
            console.log("No voices found, retrying...");
            setTimeout(setFemaleVoice, 500);
        }
    }

    // Load voices when the speech synthesis API changes
    if ('speechSynthesis' in window) {
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = setFemaleVoice;
        } else {
            setFemaleVoice();  // Fallback for older browsers
        }
    }

    // Function to spin and select a random word
    function spinWord() {
        wordDisplay.classList.remove('shake');
        wordDisplay.textContent = '';  // Clear previous word
        complimentBox.textContent = '';  // Clear previous compliment

        wordDisplay.classList.add('shake');
        setTimeout(() => {
            wordDisplay.classList.remove('shake');  // Remove shake effect
        }, 500);

        // Select a random word
        const randomIndex = Math.floor(Math.random() * sightWords.length);
        const selectedWord = sightWords[randomIndex];
        wordDisplay.textContent = selectedWord;

        // Remove revealed word from array
        sightWords.splice(randomIndex, 1);

        // Speak the word
        speakWord(selectedWord);

        // Update progress
        revealedWords++;
        updateProgress();

        // Show compliment
        setTimeout(giveCompliment, 1000);
    }

    // Function to speak the word using the selected female voice
    function speakWord(word) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;  // Adjust the rate for clarity
        utterance.pitch = 1.1; // Adjust the pitch for a pleasant tone
        utterance.volume = 0.9;  // Set volume

        // If a female voice is selected, use it
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);
    }

    // Function to show a random compliment
    function giveCompliment() {
        const compliment = compliments[Math.floor(Math.random() * compliments.length)];
        complimentBox.textContent = compliment;

        // Speak the compliment
        const utterance = new SpeechSynthesisUtterance(compliment);
        if (selectedVoice) {
            utterance.voice = selectedVoice;  // Use the same female voice for compliments
        }
        window.speechSynthesis.speak(utterance);
    }

    // Function to update the progress bar and text
    function updateProgress() {
        const progressPercentage = (revealedWords / totalWords) * 100;
        progressFill.style.width = progressPercentage + '%';
        progressText.textContent = `${revealedWords} / ${totalWords} Words Revealed`;
    }

    // Event listener for spin button
    spinButton.addEventListener('click', spinWord);
});
