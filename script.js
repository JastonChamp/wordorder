// JavaScript: spinner.js

const sightWords = [
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day',
  'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is',
  'it', 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said',
  'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to',
  'too', 'want', 'was', 'were', 'what', 'when', 'white'
];

let revealedWords = 0;  // Track how many words have been revealed
let points = 0;  // Add a points counter
const totalWords = sightWords.length;  // Total number of words
let selectedVoice = null;  // This will store the selected female voice

document.addEventListener('DOMContentLoaded', () => {
    // Get references to HTML elements
    const wordDisplay = document.getElementById('wordDisplay');
    const spinButton = document.getElementById('spinButton');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const complimentBox = document.getElementById('complimentBox');
    const pointsBox = document.getElementById('points'); // Points box

    // Debugging: Log each element to see which one is missing
    console.log('wordDisplay:', wordDisplay);
    console.log('spinButton:', spinButton);
    console.log('progressFill:', progressFill);
    console.log('progressText:', progressText);
    console.log('complimentBox:', complimentBox);
    console.log('pointsBox:', pointsBox);

    // Ensure all elements exist before proceeding
    if (!wordDisplay || !spinButton || !progressFill || !progressText || !complimentBox || !pointsBox) {
        console.error('One or more DOM elements not found');
        return;
    }

    const compliments = ['Great job!', 'Fantastic!', 'Well done!', 'You did it!', 'Awesome!'];
    const spinSound = new Audio('spin-sound.mp3');  // Add spin sound
    const rewardSound = new Audio('reward-sound.mp3');  // Add reward sound

    // Select a female voice or fallback
    function setFemaleVoice() {
        const voices = window.speechSynthesis.getVoices();
        
        // Attempt to find a specific female voice (Google UK Female or similar)
        selectedVoice = voices.find(voice => 
            voice.name.includes('Google UK English Female') || voice.name.includes('female')
        );

        // Fallback to the first available voice if no female voice is found
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

    // Load progress and points from localStorage if available
    revealedWords = parseInt(localStorage.getItem('revealedWords')) || 0;
    points = parseInt(localStorage.getItem('points')) || 0;
    updateProgress();  // Update progress on load
    pointsBox.textContent = points;  // Display points on load

    // Function to spin and select a random word
    function spinWord() {
        spinSound.play();  // Play spin sound
        wordDisplay.classList.remove('shake');  // Remove any previous shake effect
        wordDisplay.textContent = '';  // Clear the display for the new word
        complimentBox.textContent = '';  // Clear any previous compliment

        wordDisplay.classList.add('shake');  // Add a shake effect
        setTimeout(() => {
            wordDisplay.classList.remove('shake');  // Remove shake after the animation
        }, 500);

        // Select a random word
        const randomIndex = Math.floor(Math.random() * sightWords.length);
        const selectedWord = sightWords[randomIndex];
        wordDisplay.textContent = selectedWord;

        // Remove the revealed word from the array to avoid repetition
        sightWords.splice(randomIndex, 1);

        // Speak the word using the Web Speech API
        speakWord(selectedWord);

        // Add points (e.g., 10 points per word)
        points += 10;
        pointsBox.textContent = points;

        // Update the progress
        revealedWords++;
        updateProgress();

        // Save progress and points to localStorage
        localStorage.setItem('revealedWords', revealedWords);
        localStorage.setItem('points', points);

        // Play reward sound after word is revealed
        rewardSound.play();

        // Show a compliment
        setTimeout(giveCompliment, 1000);  // Delay the compliment after word is spoken

        // Trigger level-up animation if user reaches milestones
        if (revealedWords === 10 || revealedWords === 20) {
            triggerLevelUp();
        }
    }

    // Function to speak the word using the selected female voice
    function speakWord(word) {
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = 0.8;  // Slow down the speech rate for clarity
        utterance.pitch = 1.1;  // Slightly increase the pitch for a pleasant tone
        utterance.volume = 0.9;  // Lower the volume slightly

        // Use the selected female voice, if available
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        window.speechSynthesis.speak(utterance);  // Speak the word aloud
    }

    // Function to show a random compliment after revealing a word
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
        progressFill.style.width = progressPercentage + '%';  // Update the progress bar width
        progressText.textContent = `${revealedWords} / ${totalWords} Words Revealed`;  // Update progress text
    }

    // Function to trigger a level-up animation
    function triggerLevelUp() {
        const levelUpMessage = document.createElement('div');
        levelUpMessage.classList.add('level-up');
        levelUpMessage.textContent = 'Level Up!';
        document.body.appendChild(levelUpMessage);

        setTimeout(() => {
            levelUpMessage.remove();  // Remove after showing
        }, 2000);  // Show for 2 seconds
    }

    // Add event listener for the spin button
    spinButton.addEventListener('click', spinWord);
});
