// script.js
"use strict";

// ── Sanity check ─────────────────────────────────────────────────────────────
console.log("✅ script.js loaded");

// ── WebAudio “beep” for success ─────────────────────────────────────────────
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

// ── WebAudio “buzz” for error ────────────────────────────────────────────────
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

// ── Main game logic wrapped in an IIFE ─────────────────────────────────────
(() => {
  // ==== Speech Synthesis ====
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      u.voice =
        v.find(x => x.lang==="en-GB" && x.name.includes("Female")) ||
        v.find(x => x.lang==="en-US" && (x.name.includes("Samantha")||x.name.includes("Victoria"))) ||
        v.find(x => x.lang==="en-AU" && x.name.includes("Karen")) ||
        v[0];
      u.rate = 0.9;
      u.pitch = 1.1;
      u.volume = 1.0;
      window.speechSynthesis.speak(u);
    };
    if (!window.speechSynthesis.getVoices().length) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      loadVoices();
    }
  }

  // ==== Sentence Pools ====
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

  // ==== Utilities ====
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  function getWordRole(word, idx, arr) {
    if (idx === 0 && /^[A-Z]/.test(word)) return "subject";
    if (/^(is|was|were|are|runs|eats|sings|sleeps|reads|writes|explained|listened|chased|had|play|draws|decided|enjoyed|prepared|helped|finished|stopped|jumps|builds|climbs|solves|shares|flies|falls|barks|purrs|rides|skips|claps|fetch|wags|does|do|did|will|shall|can|might|should|would)/i.test(word)) return "verb";
    if (idx > 1 && idx < arr.length - 1 && !/[.!?]$/.test(word) && /^[A-Za-z]+$/.test(word)) return "object";
    if (/[.!?]$/.test(word)) return "end";
    return "other";
  }

  // ==== State ====
  const sessionLength = 10;
  let puzzles = [], currentIndex = 0;
  let score = 0, xp = parseInt(localStorage.getItem("xp")) || 0;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let badges = JSON.parse(localStorage.getItem("badges")) || [];
  let hintCount = 0, timeLeft = 30, timerId = null;
  let attempts = 0, correctCount = 0;
  const today = new Date().toDateString();
  let currentLevel = localStorage.getItem("currentLevel") || "p3";

  if (localStorage.getItem("lastPlayDate") !== today) {
    const y = new Date(); y.setDate(y.getDate()-1);
    if (localStorage.getItem("lastPlayDate") !== y.toDateString()) streak = 0;
  }

  function updateGamification() {
    document.getElementById("xp-display").textContent     = `XP: ${xp}`;
    document.getElementById("streak-display").textContent = `Streak: ${streak}`;
    const bl = document.getElementById("badges-list");
    bl.innerHTML = badges.length
      ? badges.map(b=>`<img src="images/${b.toLowerCase().replace(/ /g,"-")}.png" alt="${b}" class="badge-icon">`).join("")
      : "None";
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("lastPlayDate", today);
    localStorage.setItem("currentLevel", currentLevel);
  }

  function getSentences(level) {
    return {p1:sentencesP1,p2:sentencesP2,p3:sentencesP3,p4:sentencesP4,p5:sentencesP5,p6:sentencesP6}[level];
  }

  function generatePuzzles() {
    const pool = getSentences(currentLevel);
    puzzles = shuffle(pool.slice()).slice(0, sessionLength).map(s => ({
      correct: s.split(" "),
      submitted: false,
      user: [],
      tries: 0
    }));
    currentIndex = 0; score = 0; attempts = 0; correctCount = 0; hintCount = 0;
    updateGamification();
  }

  function clearTimer() { if (timerId) clearInterval(timerId); timerId = null; }
  function startTimer() {
    if (!document.getElementById("timer-mode").checked) return;
    clearTimer(); timeLeft = 30;
    timerId = setInterval(() => {
      document.getElementById("progress").textContent =
        `Puzzle ${currentIndex+1}/${sessionLength} - Time: ${timeLeft}s`;
      if (--timeLeft <= 0) {
        clearTimer();
        submitAnswer();
        nextPuzzle();
      }
    },1000);
  }

  // ==== Rendering & Interaction ====
  function displayPuzzle() {
    const container = document.getElementById("puzzle-container");
    container.innerHTML = "";
    clearTimer();

    if (currentIndex >= puzzles.length) {
      const rate = correctCount/attempts;
      if (attempts>=sessionLength && rate>=0.8) {
        container.innerHTML = "<p>Well done! You've mastered this level! Review?</p>";
        startReview();
      } else {
        container.innerHTML = "<p>Keep practicing to master this level!</p>";
        generatePuzzles(); displayPuzzle();
      }
      return;
    }

    const p = puzzles[currentIndex];
    const wrapper = document.createElement("div"); wrapper.className="sentence-container";
    const header = document.createElement("h3");
    header.textContent = `Puzzle ${currentIndex+1} of ${sessionLength}`;
    wrapper.appendChild(header);

    const bank = document.createElement("div"); bank.className="word-bank";
    const drop = document.createElement("div"); drop.className="drop-zone";

    [bank,drop].forEach(z => {
      z.addEventListener("dragover",e=>{e.preventDefault();z.classList.add("active");});
      z.addEventListener("dragleave",e=>z.classList.remove("active"));
      z.addEventListener("drop",e=>{
        e.preventDefault(); z.classList.remove("active");
        if (!window.dragged) return;
        const ph = drop.querySelector(".drop-placeholder"); if (ph) ph.remove();
        drop.appendChild(window.dragged);
        checkCompletion();
      });
    });

    if (!p.submitted) {
      shuffle(p.correct).forEach(w => {
        const d = document.createElement("div"); d.className="word"; d.textContent=w;
        d.draggable = true;
        d.addEventListener("dragstart",e=>{window.dragged=e.target;});
        d.addEventListener("dragend",e=>{window.dragged=null;});
        bank.appendChild(d);
      });
      const ph = document.createElement("div"); ph.className="drop-placeholder";
      ph.textContent = "Drag words here to build your sentence!";
      drop.appendChild(ph);
    } else {
      p.user.forEach((w,i) => {
        const d = document.createElement("div"); d.className="word";
        d.textContent = w;
        if (w===p.correct[i]) d.classList.add("correct");
        else {
          d.classList.add("incorrect");
          d.dataset.correct = p.correct[i];
          d.addEventListener("click",fixWord);
        }
        drop.appendChild(d);
      });
    }

    wrapper.appendChild(bank);
    wrapper.appendChild(drop);
    container.appendChild(wrapper);

    document.getElementById("submit-btn").disabled = !drop.children.length || p.submitted;
    startTimer();
    updateProgress();
  }

  function updateProgress() {
    document.getElementById("progress-bar").style.width =
      `${((currentIndex+1)/sessionLength)*100}%`;
    document.getElementById("progress-label").innerHTML =
      `<img src="images/star.png" class="progress-icon" alt="Star"> Puzzle ${currentIndex+1}/${sessionLength}`;
    document.getElementById("progress-indicator").textContent =
      `Mastery Progress: ${attempts>0?Math.round((correctCount/attempts)*100):0}% (80% to advance)`;
    document.getElementById("score").textContent = `Score: ${score}`;
  }

  function showHint() {
    const p = puzzles[currentIndex];
    const words = Array.from(document.querySelectorAll(".word-bank .word"));
    if (hintCount===0) {
      hintCount++; const sub=p.correct[0];
      document.getElementById("hint").textContent = `Subject: ${sub}`;
      words.filter(w=>w.textContent===sub).forEach(w=>w.classList.add("hint"));
    } else if (hintCount===1) {
      hintCount++; const vi=p.correct.findIndex((w,i)=>getWordRole(w,i,p.correct)==="verb");
      const v=p.correct[vi];
      document.getElementById("hint").textContent = `Verb: ${v}`;
      words.filter(w=>w.textContent===v).forEach(w=>w.classList.add("hint"));
    } else {
      document.getElementById("hint").textContent = "No more hints!";
    }
    xp -= hintCount*2; updateGamification();
  }

  function submitAnswer() {
    const p = puzzles[currentIndex], drop=document.querySelector(".drop-zone");
    const userAns = Array.from(drop.children).map(w=>w.textContent);
    p.submitted=true; p.user = userAns;
    attempts++;
    const punct = /[.!?]$/.test(userAns.at(-1));
    const correct = userAns.join(" ")===p.correct.join(" ");
    if (correct && punct) {
      score++; correctCount++; streak++; xp+=10;
      playSuccessSound();
      document.getElementById("success-message").textContent="✓ Correct!";
    } else {
      streak=0; xp-=5;
      playErrorSound();
      document.getElementById("hint").textContent="Try again!";
    }
    updateGamification();
    setTimeout(displayPuzzle,500);
  }

  function fixWord(e) {
    const el=e.target;
    el.textContent=el.dataset.correct;
    el.classList.replace("incorrect","correct");
  }

  function nextPuzzle() {
    currentIndex++; hintCount=0; displayPuzzle();
  }
  function prevPuzzle() {
    if(currentIndex>0) currentIndex--; displayPuzzle();
  }
  function clearZone() {
    document.querySelector(".drop-zone").innerHTML="";
    displayPuzzle();
  }

  function resetQuiz() {
    generatePuzzles(); displayPuzzle();
  }

  function startReview() {
    // mix previous and current level
    displayPuzzle();
  }

  function toggleTheme() {
    document.body.classList.toggle("dark-theme");
  }
  function toggleFullScreen() {
    if(!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  }

  // ── Wire up once DOM is ready ──────────────────────────────────────────────
  window.addEventListener("DOMContentLoaded", () => {
    console.log("✅ DOMContentLoaded – attaching handlers");
    document.getElementById("hint-btn")        .addEventListener("click", showHint);
    document.getElementById("submit-btn")      .addEventListener("click", submitAnswer);
    document.getElementById("next-btn")        .addEventListener("click", nextPuzzle);
    document.getElementById("prev-btn")        .addEventListener("click", prevPuzzle);
    document.getElementById("clear-btn")       .addEventListener("click", clearZone);
    document.getElementById("reset-btn")       .addEventListener("click", resetQuiz);
    document.getElementById("theme-toggle")    .addEventListener("click", toggleTheme);
    document.getElementById("fullscreen-btn")  .addEventListener("click", toggleFullScreen);
    document.getElementById("level-select")    .addEventListener("change", resetQuiz);
    generatePuzzles();
    displayPuzzle();
  });

  // ── Register Service Worker ───────────────────────────────────────────────
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(()=>{});
  }

})();  // end IIFE
