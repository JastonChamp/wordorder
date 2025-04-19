```javascript
// script.js
"use strict";

// ── Beep for success ─────────────────────────────────────────────────────────
function playSuccessSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

// ── Buzz for error ──────────────────────────────────────────────────────────
function playErrorSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "square";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

(() => {
  // ── SPEECH SYNTHESIS ────────────────────────────────────────────────────────
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    const loadVoices = () => {
      const voices = speechSynthesis.getVoices();
      utter.voice =
        voices.find(v => v.lang === "en-GB" && v.name.includes("Female")) ||
        voices.find(v => v.lang === "en-US" && /Samantha|Victoria/i.test(v.name)) ||
        voices.find(v => v.lang === "en-AU" && v.name.includes("Karen")) ||
        voices[0];
      utter.rate = 0.9;
      utter.pitch = 1.1;
      speechSynthesis.speak(utter);
    };
    if (!speechSynthesis.getVoices().length) {
      speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  // ── SENTENCE POOLS ─────────────────────────────────────────────────────────
  const sentencesP1 = [
    "Doreen had a huge birthday party.",
    "We can go out to play.",
    "The boy was chased by a dog.",
    "Would you like to have lunch now?",
    "The house was empty and quiet.",
    "I have a small red ball.",
    "My cat sleeps on the warm mat.",
    "The teacher reads a fun story.",
    "The dog runs fast in the park.",
    "I love to draw colorful pictures.",
    "The sun is shining brightly.",
    "My friend is kind and gentle.",
    "We play games during recess.",
    "The bird sings a sweet song.",
    "I like to eat ice cream.",
    "The tree is tall and green.",
    "The girl wears a blue dress.",
    "The boy rides a small bicycle.",
    "My mom cooks tasty food.",
    "The puppy barks at the mailman.",
    "Ali plays soccer with his friends.",
    "Maria dances at the festival.",
    "Juan paints a bright mural.",
    "Aisha shares her books with classmates."
  ];
  const sentencesP2 = [
    "It was raining very heavily this morning.",
    "All students should obey the school rules.",
    "It was so cold that I could not stop shivering.",
    "Which of these activities do you enjoy doing?",
    "The teacher explained the lesson clearly and patiently.",
    "My friend always helps me with my homework.",
    "The cat quietly slept on the soft cushion.",
    "We often play games during our lunch break.",
    "The dog eagerly fetched the ball in the yard.",
    "The students listened carefully to the principal's announcement.",
    "My mother prepared a delicious meal for dinner.",
    "The library was quiet and full of interesting books.",
    "I carefully completed all my assignments on time.",
    "The children enjoyed a fun and educational field trip.",
    "The weather was so warm that we decided to have a picnic.",
    "The boy happily rode his bicycle to school.",
    "The girl carefully painted a beautiful picture.",
    "The teacher asked a challenging question during the lesson.",
    "Our class worked together to solve a difficult problem.",
    "I felt excited as I opened my new book.",
    "Hiro reads a story about Japan.",
    "Fatima shares dates with her class.",
    "Luka sings a song from Croatia.",
    "Priya learns a dance from India."
  ];
  const sentencesP3 = [
    "The boy eats an apple during recess.",
    "The girl plays with a shiny toy in class.",
    "The dog chases the ball across the field.",
    "The teacher reads an interesting story to the students.",
    "The cat drinks milk from a small bowl.",
    "The boy kicks the ball with great enthusiasm.",
    "The girl draws a colorful picture on the board.",
    "The dog barks at the stranger outside.",
    "The student writes a letter to his best friend.",
    "The mother cooks dinner for the family.",
    "The father drives a car on busy roads.",
    "The boy catches a slippery frog near the pond.",
    "The girl rides her bicycle along the busy street.",
    "The dog fetches a stick in the backyard.",
    "The teacher explains the lesson clearly to the class.",
    "The child opens the door to let in the sunshine.",
    "The boy climbs a tall tree in the park.",
    "The girl sings a sweet song during assembly.",
    "The cat chases a little mouse in the garden.",
    "The student solves a challenging puzzle.",
    "Kofi builds a sandcastle at the beach.",
    "Mei paints a dragon for the festival.",
    "Omar kicks a ball in the park.",
    "Sana writes a poem for her teacher."
  ];
  const sentencesP4 = [
    "The cheerful girl sings beautifully during the assembly.",
    "The boy quickly runs to school eager to learn.",
    "The teacher patiently explains the lesson to her attentive students.",
    "The children happily play together in the spacious park.",
    "The shiny red car moves fast along the busy road.",
    "The little boy smiles brightly when he sees his friend at school.",
    "The elderly man walks slowly with a calm and steady pace.",
    "The smart student solves difficult problems with ease.",
    "The busy mother prepares a delicious breakfast every single morning.",
    "The gentle wind blows softly rustling the vibrant green leaves.",
    "The excited child jumps high in joyful celebration during recess.",
    "The kind teacher helps every student after class with care.",
    "The little girl reads a colorful book under a large shady tree.",
    "The brave boy climbs the tall tree with determination and skill.",
    "The attentive class listens carefully to the teacher’s detailed instructions.",
    "The calm lake reflects the clear blue sky perfectly on a sunny day.",
    "The fast train zooms past the station with remarkable speed.",
    "The playful puppy chases its tail with endless energy.",
    "The thoughtful boy generously shares his toys with his friends.",
    "The pretty garden blooms vibrantly in early spring showcasing many colors.",
    "Nia plays a drum from her culture.",
    "Santiago flies a kite with his brother.",
    "Amina draws a picture of her family.",
    "Chen learns to cook dumplings with grandma."
  ];
  const sentencesP5 = [
    "The teacher reads a fascinating story and the children listen attentively.",
    "The boy finished his homework before dinner so he went outside to play.",
    "The little girl happily skipped to school and her friends cheered her on.",
    "The bright sun shines over the calm sea while a gentle breeze cools the air.",  
    "The busy bees buzz around the blooming flowers as the children watch in wonder.",
    "The students study in the library and take notes carefully on every detail.",
    "The father cooks dinner and the children eagerly help set the table.",
    "The dog barks loudly but the cat remains calm and sleeps peacefully.",
    "The rain poured outside yet the class continued their lesson indoors with focus.",
    "The bird sings in the morning and the flowers open gracefully to welcome the day.",
    "The boy plays soccer while his friend rides a bicycle around the field.",
    "The teacher writes on the board and the students copy the notes precisely.",
    "The car stops at the red light and the driver patiently waits for the signal.",
    "The children laugh during recess full of energy and joy.",
    "The sun sets in the west and the sky turns a beautiful shade of orange.",
    "The little girl draws a creative picture and her mother praises her artistic skills.",
    "The student answers the question correctly and the teacher smiles with pride.",
    "The dog runs in the park and the kids cheer excitedly during playtime.",
    "The wind blows gently making the leaves rustle softly in the cool breeze.",
    "The book is open on the desk and the student reads silently with concentration.",
    "Zara sings a song from her homeland.",
    "Diego helps his dad with the garden.",
    "Leila paints a picture of her cat.",
    "Ravi plays cricket with his cousins."
  ];
  const sentencesP6 = [
    "After finishing his homework the student went to the library to study more in depth.",
    "Although it was raining heavily the children played outside happily during recess.",
    "The teacher known for her kindness explained the lesson in remarkable detail.",
    "Despite the heavy traffic she arrived at school on time and greeted everyone warmly.",
    "When the bell rang the students hurried to their classrooms with eager anticipation.",
    "Since the exam was extremely challenging the teacher reviewed the material thoroughly afterward.",
    "Even though it was late the boy continued reading his favorite book with great enthusiasm.",
    "While the sun was setting the family enjoyed a delightful picnic in the park.",
    "If you study hard every day you will achieve excellent results in your exams.",
    "After the game ended the players celebrated their victory with cheers and applause.",
    "Although the movie was quite long the audience remained engaged until the very end.",
    "Because the weather was unexpectedly cool the picnic lasted longer than anticipated.",
    "Since the library was exceptionally quiet the students concentrated deeply on their research.",
    "When the storm passed the children went outside to play joyfully despite the damp ground.",
    "After receiving his award the student thanked his parents for their unwavering support.",
    "Although she was extremely tired the teacher continued to prepare engaging lessons for the class.",
    "If you practice regularly your skills will improve significantly over time with dedication.",
    "While the bell was ringing the students gathered in the hall to listen attentively to the announcement.",
    "Because the assignment was particularly difficult the students worked in groups to complete it.",
    "After the concert ended the crowd applauded enthusiastically as the performers took a bow.",
    "Anya writes a story about her travels.",
    "Mateo builds a model of a rocket.",
    "Sofia learns about her family history.",
    "Jamil shares a recipe from his culture."
  ];

  // ── UTILITIES ───────────────────────────────────────────────────────────────
  function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
  }

  // ── STATE & CAMPAIGN ────────────────────────────────────────────────────────
  const sessionLength = 10;
  let puzzles = [], currentIndex = 0;
  let score = 0, xp = 0, streak = 0, attempts = 0, correctCount = 0, hintCount = 0;
  let badges = [], timeLeft = 30, timerId = null;
  let currentLevel = localStorage.getItem("currentLevel") || "p3";

  function saveState() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("currentLevel", currentLevel);
  }

  function updateGamification() {
    document.getElementById("xp-display").textContent = `XP: ${xp}`;
    document.getElementById("streak-display").textContent = `Streak: ${streak}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    const bl = document.getElementById("badges-list");
    bl.innerHTML = badges.length
      ? badges.map(b => `<img src="images/${b.toLowerCase().replace(/ /g, "-")}.png" alt="${b}" class="badge-icon">`).join("")
      : "None";
    saveState();
  }

  function getPool(lvl) {
    return { p1: sentencesP1, p2: sentencesP2, p3: sentencesP3, p4: sentencesP4, p5: sentencesP5, p6: sentencesP6 }[lvl];
  }

  function generatePuzzles() {
    const pool = getPool(currentLevel);
    puzzles = shuffle(pool.slice()).slice(0, sessionLength).map(s => ({
      correct: s.split(" "),
      submitted: false
    }));
    currentIndex = 0;
    score = xp = streak = attempts = correctCount = hintCount = 0;
    badges = [];
    updateGamification();
    displayPuzzle();
  }

  function clearTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }
  function startTimer() {
    if (!document.getElementById("timer-mode").checked) return;
    clearTimer();
    timeLeft = 30;
    timerId = setInterval(() => {
      document.getElementById("progress").textContent =
        `Puzzle ${currentIndex+1}/${sessionLength} - Time: ${timeLeft}s`;
      if (--timeLeft <= 0) {
        clearTimer();
        submitAnswer();
        nextPuzzle();
      }
    }, 1000);
  }

  // ── RENDER ─────────────────────────────────────────────────────────────────
  function displayPuzzle() {
    clearTimer();
    const p = puzzles[currentIndex];
    const container = document.getElementById("puzzle-container");
    container.innerHTML = "";
    document.getElementById("hint").textContent = "";
    document.getElementById("success-message").textContent = "";

    // sentence card
    const card = document.createElement("div");
    card.className = "sentence-container";
    const h3 = document.createElement("h3");
    h3.textContent = `Puzzle ${currentIndex+1} of ${sessionLength}`;
    card.appendChild(h3);

    const bank = document.createElement("div");
    bank.className = "word-bank";
    const drop = document.createElement("div");
    drop.className = "drop-zone";

    [bank, drop].forEach(zone => {
      zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("active"); });
      zone.addEventListener("dragleave", e => zone.classList.remove("active"));
      zone.addEventListener("drop", e => {
        e.preventDefault();
        zone.classList.remove("active");
        if (window.draggedWord) {
          const ph = drop.querySelector(".drop-placeholder");
          if (ph) ph.remove();
          drop.appendChild(window.draggedWord);
          checkComplete();
        }
      });
    });

    if (!p.submitted) {
      shuffle(p.correct).forEach(w => {
        const d = document.createElement("div");
        d.className = "word";
        d.textContent = w;
        d.draggable = true;
        d.addEventListener("dragstart", () => window.draggedWord = d);
        bank.appendChild(d);
      });
      const ph = document.createElement("div");
      ph.className = "drop-placeholder";
      ph.textContent = "Drag words here to build your sentence!";
      drop.appendChild(ph);
    }

    card.appendChild(bank);
    card.appendChild(drop);
    container.appendChild(card);

    // reset buttons
    const submitBtn = document.getElementById("submit-btn");
    const tryAgainBtn = document.getElementById("try-again-btn");
    submitBtn.style.display = "inline-block";
    submitBtn.disabled = p.submitted;
    tryAgainBtn.style.display = "none";

    updateProgress();
    startTimer();
  }

  function checkComplete() {
    const drop = document.querySelector(".drop-zone");
    const btn = document.getElementById("submit-btn");
    btn.disabled = drop.children.length !== puzzles[currentIndex].correct.length;
  }

  function updateProgress() {
    const percent = ((currentIndex+1)/sessionLength)*100;
    document.getElementById("progress-bar").style.width = `${percent}%`;
    document.getElementById("progress-label").innerHTML =
      `<img src="images/star.png" class="progress-icon" alt="Star"> Puzzle ${currentIndex+1}/${sessionLength}`;
    document.getElementById("progress-indicator").textContent =
      `Mastery Progress: ${attempts>0?Math.round((correctCount/attempts)*100):0}% (80% to advance)`;
  }

  // ── HINT ────────────────────────────────────────────────────────────────────
  function showHint() {
    const p = puzzles[currentIndex];
    const words = Array.from(document.querySelectorAll(".word-bank .word"));
    if (hintCount === 0) {
      hintCount++;
      const sub = p.correct[0];
      document.getElementById("hint").textContent = `Subject: "${sub}"`;
      speak(`Subject: ${sub}`);
      words.filter(w => w.textContent === sub).forEach(w => {
        w.classList.add("hint-subject");
        setTimeout(() => w.classList.remove("hint-subject"), 3000);
      });
    } else {
      document.getElementById("hint").textContent = "No more hints!";
      speak("No more hints!");
    }
    xp = Math.max(0, xp - hintCount*2);
    updateGamification();
  }

  // ── SUBMIT ──────────────────────────────────────────────────────────────────
  function submitAnswer() {
    clearTimer();
    const p = puzzles[currentIndex];
    const raw = Array.from(document.querySelectorAll(".drop-zone .word")).map(d => d.textContent);

    // normalize first word + punctuation
    const normalized = raw.map((w,i) => {
      if (i === 0) {
        const lw = w.toLowerCase().replace(/[.!?]$/,"");
        return lw.charAt(0).toUpperCase() + lw.slice(1);
      }
      return w;
    });
    const last = normalized.length - 1;
    if (!/[.!?]$/.test(normalized[last])) normalized[last] += ".";

    p.submitted = true;
    attempts++;

    // strict comparison
    const isCorrect = normalized.length === p.correct.length &&
                      normalized.every((w,i) => w === p.correct[i]);

    if (isCorrect) {
      score++; correctCount++; streak++; xp += 10;
      playSuccessSound();
      document.getElementById("success-message").textContent = "✓ You got it!";
    } else {
      streak = 0; xp = Math.max(0, xp - 5);
      playErrorSound();
      document.getElementById("hint").textContent = "Oops, that order isn't quite right.";
      speak("Oops, that order isn't quite right.");
    }
    updateGamification();

    // toggle buttons
    document.getElementById("submit-btn").style.display = "none";
    document.getElementById("try-again-btn").style.display = "inline-block";
  }

  // ── RETRY ───────────────────────────────────────────────────────────────────
  function tryAgain() {
    puzzles[currentIndex].submitted = false;
    hintCount = 0;  
    displayPuzzle();
  }

  // ── NAVIGATION ──────────────────────────────────────────────────────────────
  function nextPuzzle() {
    if (currentIndex < sessionLength - 1) {
      currentIndex++; hintCount = 0; displayPuzzle();
    }
  }
  function prevPuzzle() {
    if (currentIndex > 0) {
      currentIndex--; hintCount = 0; displayPuzzle();
    }
  }
  function clearDropZone() {
    puzzles[currentIndex].submitted = false; hintCount = 0; displayPuzzle();
  }

  // ── LEARN BASICS ────────────────────────────────────────────────────────────
  function learnBasics() {
    const cont = document.getElementById("puzzle-container");
    cont.innerHTML = `
      <h3>Learn Sentence Basics</h3>
      <p>A sentence has a subject (who/what), a verb (action), and often an object (receiver).<br>
      Example: "The dog (subject) runs (verb) fast (object)."</p>`;
    speak("A sentence has a subject, a verb, and often an object.");
  }

  // ── THEME & FULLSCREEN ──────────────────────────────────────────────────────
  function toggleTheme() {
    document.body.classList.toggle("rainbow-theme");
    speak("Theme changed.");
  }
  function toggleFullScreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  // ── BIND EVENTS ─────────────────────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded – attaching handlers");
    document.getElementById("hint-btn").addEventListener("click", showHint);
    document.getElementById("submit-btn").addEventListener("click", submitAnswer);
    document.getElementById("try-again-btn").addEventListener("click", tryAgain);
    document.getElementById("next-btn").addEventListener("click", nextPuzzle);
    document.getElementById("prev-btn").addEventListener("click", prevPuzzle);
    document.getElementById("clear-btn").addEventListener("click", clearDropZone);
    document.getElementById("learn-btn").addEventListener("click", learnBasics);
    document.getElementById("listen-instructions-btn").addEventListener("click", () => {
      speak(document.querySelector("p.instructions").textContent);
    });
    document.getElementById("fullscreen-btn").addEventListener("click", toggleFullScreen);
    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    document.getElementById("level-select").addEventListener("change", (e) => {
      currentLevel = e.target.value;
      generatePuzzles();
    });
    document.getElementById("reset-btn").addEventListener("click", generatePuzzles);

    generatePuzzles();
  });

  // ── SERVICE WORKER ──────────────────────────────────────────────────────────
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {});
  }

})();
