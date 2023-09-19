// script.js
const wheel = document.querySelector('.wheel');
const sightWords = [
  // Add your list of 50 sight words here
  'a', 'about', 'above', 'again', 'all', 'also', 'are', 'be', 'came', 'day', 'do', 'does', 'for', 'go', 'he', 'her', 'his', 'how', 'I', 'in', 'into', 'is', 'it' , 'know', 'many', 'name', 'not', 'now', 'of', 'on', 'one', 'over', 'said', 'she', 'so', 'some', 'story', 'the', 'their', 'then', 'there', 'this', 'to', 'too', 'want', 'was', 'were', 'what', 'when' , 'white'  
];

sightWords.forEach((word, index) => {
  const slot = document.createElement('div');
  slot.className = 'slot';
  slot.textContent = word;
  slot.style.display = 'none';
  wheel.appendChild(slot);
});

const slots = document.querySelectorAll('.slot');
slots[0].style.display = 'flex';

let currentSlot = 0;

document.getElementById('spinButton').addEventListener('click', () => {
  let shuffleCount = 0;
  let lastRandom = 0;

  const shuffleEffect = setInterval(() => {
    slots[lastRandom].style.display = 'none';
    const randomSlot = Math.floor(Math.random() * sightWords.length);
    slots[randomSlot].style.display = 'flex';
    lastRandom = randomSlot;
    shuffleCount++;
    if (shuffleCount > 20) {
      clearInterval(shuffleEffect);
      slots[lastRandom].style.display = 'none';
      slots[currentSlot].style.display = 'flex';
    }
  }, 100);

  setTimeout(() => {
    const randomSlot = Math.floor(Math.random() * sightWords.length);
    slots[currentSlot].style.display = 'none';
    slots[randomSlot].style.display = 'flex';
    currentSlot = randomSlot;
  }, 2500);
});
