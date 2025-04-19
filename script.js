// script.js
"use strict";

(() => {
  //
  // ==== Tutorial Overlay Logic ====
  //
  const tutorialOverlay = document.getElementById("tutorial-overlay");
  const tutorialNext    = document.getElementById("tutorial-next");
  if (!localStorage.getItem("wod_tutorial_shown")) {
    tutorialOverlay.classList.remove("hidden");
  }
  tutorialNext.addEventListener("click", () => {
    tutorialOverlay.classList.add("hidden");
    localStorage.setItem("wod_tutorial_shown", "1");
  });

  //
  // ==== DOM ELEMENTS ====
  //
  const elements = {
    puzzleContainer:  document.getElementById("puzzle-container"),
    hint:             document.getElementById("hint"),           // <— added
    hintBtn:          document.getElementById("hint-btn"),
    successMessage:   document.getElementById("success-message"),
    progress:         document.getElementById("progress"),
    score:            document.getElementById("score"),
    progressBar:      document.getElementById("progress-bar"),
    progressLabel:    document.getElementById("progress-label"),
    progressIndicator: document.getElementById("progress-indicator"),
    xpDisplay:        document.getElementById("xp-display"),
    streakDisplay:    document.getElementById("streak-display"),
    badgesList:       document.getElementById("badges-list"),
    submitBtn:        document.getElementById("submit-btn"),
    tryAgainBtn:      document.getElementById("try-again-btn"),
    prevBtn:          document.getElementById("prev-btn"),
    nextBtn:          document.getElementById("next-btn"),
    clearBtn:         document.getElementById("clear-btn"),
    learnBtn:         document.getElementById("learn-btn"),
    levelSelect:      document.getElementById("level-select"),
    timerMode:        document.getElementById("timer-mode"),
  };

  //
  // ==== Speech Synthesis ====
  //
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

  //
  // ==== Sentence Pools (P1–P6) ====
  //
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

  //
  // ==== Helpers & State ====
  //
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  function getWordRole(word, idx, arr) {
    if (idx === 0 && /^[A-Z]/.test(word)) return "subject";
    if (/^(is|was|were|are|runs|eats|sings|sleeps|reads|writes|explained|listened|chased|had|play|draws|decided|enjoyed|prepared|helped|finished|stopped|jumps|builds|climbs|solves|shares|flies|falls|barks|purrs|rides|skips|claps|fetch|wags|does|do|did|will|shall|can|might|should|would)/i.test(word))
      return "verb";
    if (idx > 1 && idx < arr.length - 1 && !/[.!?]$/.test(word) && /^[A-Za-z]+$/.test(word))
      return "object";
    if (/[.!?]$/.test(word)) return "end";
    return "other";
  }

  const sessionLength = 10;
  let puzzles = [], currentPuzzleIndex = 0;
  let score = 0, xp = parseInt(localStorage.getItem("xp")) || 0, streak = parseInt(localStorage.getItem("streak")) || 0;
  let badges = JSON.parse(localStorage.getItem("badges")) || [];
  let hintCount = 0, timeLeft = 30, timerId = null, puzzleAttempts = 0, correctCount = 0;
  const today = new Date().toDateString();
  let currentLevel = localStorage.getItem("currentLevel") || "p3";

  // Reset streak if needed
  if (localStorage.getItem("lastPlayDate") !== today) {
    const y = new Date(); y.setDate(y.getDate() - 1);
    if (localStorage.getItem("lastPlayDate") !== y.toDateString()) streak = 0;
  }

  function updateGamificationPanel() {
    elements.xpDisplay.textContent     = `XP: ${xp}`;
    elements.streakDisplay.textContent = `Streak: ${streak}`;
    elements.badgesList.innerHTML      = badges.length
      ? badges.map(b => `<img src="images/${b.toLowerCase().replace(/ /g, "-")}.png" alt="${b}" class="badge-icon">`).join("")
      : "None";
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("lastPlayDate", today);
    localStorage.setItem("currentLevel", currentLevel);
  }

  function getSentencesForLevel(l) {
    return { p1: sentencesP1, p2: sentencesP2, p3: sentencesP3, p4: sentencesP4, p5: sentencesP5, p6: sentencesP6 }[l];
  }

  function generatePuzzles() {
    const pool = getSentencesForLevel(currentLevel);
    const chosen = shuffle(pool.slice()).slice(0, sessionLength);
    puzzles = chosen.map(s => ({ correct: s.split(" "), submitted: false, userAnswer: [], attempts: 0 }));
    currentPuzzleIndex = 0; score = 0; puzzleAttempts = 0; correctCount = 0; hintCount = 0;
    updateGamificationPanel();
  }

  function checkCompletion() {
    const dz = document.querySelector(".drop-zone");
    if (!dz) return;
    const needed = puzzles[currentPuzzleIndex].correct.length;
    elements.submitBtn.disabled = dz.children.length !== needed;
    elements.submitBtn.style.backgroundColor = elements.submitBtn.disabled ? "#ccc" : "#4CAF50";
  }

  let dragged = null;
  function handleDragStart(e) { dragged = e.target; e.dataTransfer.setData("text/plain", e.target.textContent); e.target.style.opacity="0.5"; }
  function handleDragEnd(e)   { e.target.style.opacity="1"; dragged=null; }
  function handleDragOver(e)  { e.preventDefault(); e.currentTarget.classList.add("active"); }
  function handleDragLeave(e) { e.currentTarget.classList.remove("active"); }
  function handleDrop(e) {
    e.preventDefault(); e.currentTarget.classList.remove("active");
    if (!dragged) return;
    const ph = e.currentTarget.querySelector(".drop-placeholder"); if (ph) ph.remove();
    e.currentTarget.appendChild(dragged);
    gsap.fromTo(dragged,{scale:0.8,opacity:0},{scale:1,opacity:1,duration:0.3});
    checkCompletion();
  }

  function showTooltip(e) {
    const w = e.target.textContent;
    const idx = puzzles[currentPuzzleIndex].correct.indexOf(w);
    const role = getWordRole(w, idx, puzzles[currentPuzzleIndex].correct);
    const tipText = ({ subject:"Subject: Who?", verb:"Verb: What?", object:"Object: About what?", end:"End." }[role] || "Other.");
    const tip = document.createElement("div");
    tip.textContent = tipText;
    tip.className = "word-tooltip";
    document.body.appendChild(tip);
    const r = e.target.getBoundingClientRect();
    tip.style.top  = `${r.bottom + window.scrollY + 5}px`;
    tip.style.left = `${r.left}px`;
    e.target.addEventListener("mouseout", () => tip.remove(), { once: true });
  }
  function showTouchTooltip(e) {
    let t = setTimeout(() => showTooltip(e), 500);
    e.target.addEventListener("touchend", () => clearTimeout(t), { once: true });
  }

  function removeWord(e) {
    const w = e.target;
    if (!w.classList.contains("word")) return;
    const bank = document.querySelector(".word-bank");
    const c = w.cloneNode(true);
    c.draggable = true;
    c.addEventListener("dragstart", handleDragStart);
    c.addEventListener("dragend", handleDragEnd);
    c.addEventListener("mouseover", showTooltip);
    bank.appendChild(c);
    w.remove();
    checkCompletion();
  }

  function correctWord(e) {
    const el = e.target;
    if (!el.classList.contains("incorrect")) return;
    const correctText = el.dataset.correctWord;
    el.textContent = correctText;
    el.classList.replace("incorrect","correct");
    el.style.cursor = "default";
    el.removeEventListener("click", correctWord);
    // Award partial credit
    score++; correctCount++; streak++; xp += 5;
    elements.successMessage.textContent = "✓ Fixed!";
    speak(`Now correct: ${puzzles[currentPuzzleIndex].correct.join(" ")}`);
    gsap.fromTo(el,{scale:0},{scale:1,duration:0.6,ease:"bounce.out"});
    setTimeout(() => elements.successMessage.textContent = "", 3000);
    updateGamificationPanel();
  }

  function startTimer() {
    if (!elements.timerMode.checked) return;
    clearInterval(timerId);
    timeLeft = 30;
    timerId = setInterval(() => {
      timeLeft--;
      elements.progress.textContent = `Puzzle ${currentPuzzleIndex+1}/${sessionLength} - Time: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        submitAnswer();
        nextPuzzle();
      }
    }, 1000);
  }
  function stopTimer() {
    clearInterval(timerId);
  }

  function showHint() {
    const p = puzzles[currentPuzzleIndex];
    const bank = Array.from(document.querySelectorAll(".word-bank .word"));

    if (hintCount === 0) {
      hintCount++;
      const s = p.correct[0];
      elements.hint.textContent = `Subject is "${s}".`;
      speak(`Subject is ${s}.`);
      bank.filter(w => w.textContent === s).forEach(w => {
        w.classList.add("hint-subject");
        setTimeout(() => w.classList.remove("hint-subject"), 3000);
      });
    }
    else if (hintCount === 1) {
      hintCount++;
      const vi = p.correct.findIndex((w,i) => getWordRole(w,i,p.correct)==="verb");
      const v = p.correct[vi];
      elements.hint.textContent = `Verb is "${v}".`;
      speak(`Verb is ${v}.`);
      bank.filter(w => w.textContent === v).forEach(w => {
        w.classList.add("hint-verb");
        setTimeout(() => w.classList.remove("hint-verb"), 3000);
      });
    }
    else if (hintCount === 2) {
      hintCount++;
      const oi = p.correct.findIndex((w,i) => getWordRole(w,i,p.correct)==="object");
      const o = p.correct[oi];
      elements.hint.textContent = `Object is "${o}".`;
      speak(`Object is ${o}.`);
      bank.filter(w => w.textContent === o).forEach(w => {
        w.classList.add("hint-object");
        setTimeout(() => w.classList.remove("hint-object"), 3000);
      });
    }
    else {
      elements.hint.textContent = "No more hints!";
      speak("No more hints!");
    }

    // Only deduct XP on 2nd+ hints
    if (hintCount > 1) xp -= 2 * (hintCount - 1);
    updateGamificationPanel();
  }

  function submitAnswer() {
    const p = puzzles[currentPuzzleIndex];
    p.attempts++; puzzleAttempts++;
    const dz = document.querySelector(".drop-zone");
    const user = Array.from(dz.children).map(w => w.textContent);

    p.submitted = true;
    p.userAnswer = user.map((w,i) =>
      i === 0
        ? w.charAt(0).toUpperCase() + w.slice(1)
        : w
    );

    const hasPunct = /[.!?]$/.test(p.userAnswer.at(-1));
    const isCorrect = p.userAnswer.join(" ") === p.correct.join(" ");

    // Mark each tile
    Array.from(dz.children).forEach((we,i) => {
      const cw = p.correct[i];
      const ok = we.textContent === cw;
      we.classList.toggle("correct", ok);
      we.classList.toggle("incorrect", !ok);
      if (!ok) {
        we.dataset.correctWord = cw;
        we.style.cursor = "pointer";
        we.addEventListener("click", correctWord);
      }
    });

    elements.submitBtn.style.display    = "none";
    elements.tryAgainBtn.style.display  = "inline-block";

    if (isCorrect && hasPunct) {
      score++; correctCount++; streak++;
      xp += 10 + (elements.timerMode.checked ? Math.floor(timeLeft / 5) : 0);

      if (!badges.includes("First Win")) badges.push("First Win");
      if (streak === 5 && !badges.includes("Perfect Streak 5")) badges.push("Perfect Streak 5");
      if (score === sessionLength && !badges.includes("Level Master")) badges.push("Level Master");

      document.getElementById("success-sound").play();
      speak(`Correct: ${p.correct.join(" ")}`);
      elements.successMessage.textContent = "✓ You got it!";
      gsap.fromTo(elements.successMessage, { scale: 0 }, { scale: 1, duration: 0.6, ease: "bounce.out" });

      // Confetti
      const cc = document.createElement("div"); cc.className = "confetti-container";
      document.body.appendChild(cc);
      for (let i = 0; i < 20; i++) {
        const c = document.createElement("div"); c.className = "confetti";
        c.style.left = Math.random() * 100 + "vw";
        cc.appendChild(c);
      }
      setTimeout(() => cc.remove(), 5000);
      setTimeout(() => elements.successMessage.textContent = "", 3000);
    }
    else {
      document.getElementById("error-sound").play();
      streak = 0;
      let fb = "Oops! ";
      if (!isCorrect) fb += "Check word order. ";
      if (!hasPunct)  fb += "Add . or ?. ";
      speak(fb);
      elements.hint.textContent = fb;
    }

    updateGamificationPanel();
    displayCurrentPuzzle();
  }

  function tryAgain() {
    puzzles[currentPuzzleIndex].submitted = false;
    puzzles[currentPuzzleIndex].userAnswer = [];
    hintCount = 0;
    displayCurrentPuzzle();
  }

  function nextPuzzle() {
    if (currentPuzzleIndex < puzzles.length - 1) {
      currentPuzzleIndex++;
      hintCount = 0;
      displayCurrentPuzzle();
    }
    else if (puzzleAttempts >= sessionLength && correctCount / puzzleAttempts >= 0.8) {
      const levels = ["p1","p2","p3","p4","p5","p6"];
      const idx = levels.indexOf(currentLevel);
      if (idx < levels.length - 1) {
        currentLevel = levels[idx + 1];
        elements.levelSelect.value = currentLevel;
        speak(`Moving up to ${currentLevel.toUpperCase()}!`);
        generatePuzzles();
        displayCurrentPuzzle();
      } else {
        speak("You've mastered all levels!");
      }
    }
    else {
      speak("Keep practicing to master this level!");
      generatePuzzles();
      displayCurrentPuzzle();
    }
  }

  function prevPuzzle() {
    if (currentPuzzleIndex > 0) {
      currentPuzzleIndex--;
      hintCount = 0;
      displayCurrentPuzzle();
    } else {
      alert("This is the first puzzle.");
      speak("This is the first puzzle.");
    }
  }

  function startReviewSession() {
    const prevLevel = currentLevel === "p1"
      ? "p1"
      : "p" + (parseInt(currentLevel.slice(1)) - 1);
    const prevSent = getSentencesForLevel(prevLevel).slice(0, 3);
    const curSent  = getSentencesForLevel(currentLevel).slice(0, 7);
    const mix      = shuffle(prevSent.concat(curSent));
    puzzles = mix.map(s => ({ correct: s.split(" "), submitted: false, userAnswer: [], attempts: 0 }));
    currentPuzzleIndex = 0;
    score = 0; puzzleAttempts = 0; correctCount = 0;
    displayCurrentPuzzle();
    speak("Time for a review session!");
  }

  function resetQuiz() {
    generatePuzzles();
    const colors = {
      p1: "#ff6f61", p2: "#ff9f1c", p3: "#ffcc00",
      p4: "#98fb98", p5: "#40c4ff", p6: "#ff69b4"
    };
    document.documentElement.style
      .setProperty("--primary-color", colors[currentLevel]);
    displayCurrentPuzzle();
  }

  function clearDropZone() {
    const dz = document.querySelector(".drop-zone"),
          wb = document.querySelector(".word-bank");
    if (!dz || !wb) return;
    Array.from(dz.children).forEach(w => {
      if (w.classList.contains("word")) {
        const c = w.cloneNode(true);
        c.draggable = true;
        c.addEventListener("dragstart", handleDragStart);
        c.addEventListener("dragend",   handleDragEnd);
        c.addEventListener("mouseover", showTooltip);
        wb.appendChild(c);
        w.remove();
      }
    });
    const ph = document.createElement("div");
    ph.className = "drop-placeholder";
    ph.textContent = "Drag words here to build your sentence!";
    dz.appendChild(ph);
    checkCompletion();
    speak("Drop zone cleared.");
  }

  function displayCurrentPuzzle() {
    elements.puzzleContainer.innerHTML = "";
    elements.hint.textContent           = "";
    elements.successMessage.textContent = "";
    elements.submitBtn.style.display    = "inline-block";
    elements.tryAgainBtn.style.display  = "none";
    elements.prevBtn.style.display      = "inline-block";
    elements.nextBtn.style.display      = "inline-block";
    elements.clearBtn.style.display     = "inline-block";
    elements.learnBtn.style.display     = "inline-block";
    stopTimer();

    if (currentPuzzleIndex >= puzzles.length) {
      displayEndOfSession();
      return;
    }

    const p      = puzzles[currentPuzzleIndex];
    const cont   = document.createElement("div");
    cont.className = "sentence-container";

    const heading = document.createElement("h3");
    heading.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${sessionLength}`;
    cont.appendChild(heading);

    const wb = document.createElement("div");
    wb.className = "word-bank";
    wb.setAttribute("role", "list");

    const dz = document.createElement("div");
    dz.className = "drop-zone";
    dz.setAttribute("role", "list");

    [wb, dz].forEach(zone => {
      zone.addEventListener("dragover", handleDragOver);
      zone.addEventListener("dragleave", handleDragLeave);
      zone.addEventListener("drop", handleDrop);
    });

    if (!p.submitted) {
      shuffle(p.correct).forEach(w => {
        const wd = document.createElement("div");
        wd.className    = "word";
        wd.textContent  = w;
        wd.draggable    = true;
        wd.addEventListener("dragstart", handleDragStart);
        wd.addEventListener("dragend",   handleDragEnd);
        wd.addEventListener("mouseover", showTooltip);
        wd.addEventListener("touchstart", showTouchTooltip, { passive: true });
        wb.appendChild(wd);
      });
      const ph = document.createElement("div");
      ph.className   = "drop-placeholder";
      ph.textContent = "Drag words here to build your sentence!";
      dz.appendChild(ph);
    } else {
      p.userAnswer.forEach((w, i) => {
        const wd = document.createElement("div");
        wd.className   = "word";
        wd.textContent = w;
        if (w === p.correct[i]) {
          wd.classList.add("correct");
        } else {
          wd.classList.add("incorrect");
          wd.dataset.correctWord = p.correct[i];
          wd.style.cursor        = "pointer";
          wd.addEventListener("click", correctWord);
        }
        dz.appendChild(wd);
      });
      elements.submitBtn.style.display   = "none";
      elements.tryAgainBtn.style.display = "inline-block";
    }

    cont.appendChild(wb);
    cont.appendChild(dz);
    elements.puzzleContainer.appendChild(cont);

    elements.submitBtn.disabled = true;
    checkCompletion();

    elements.progress.textContent =
      `Puzzle ${currentPuzzleIndex+1}/${sessionLength}`
      + (elements.timerMode.checked
          ? ` - Time: ${timeLeft}s`
          : "");

    elements.score.textContent = `Score: ${score}`;

    elements.progressBar.style.width =
      `${((currentPuzzleIndex + 1)/sessionLength)*100}%`;

    const percent = puzzleAttempts>0
      ? Math.round((correctCount/puzzleAttempts)*100)
      : 0;
    elements.progressIndicator.textContent =
      `Mastery Progress: ${percent}% (80% to advance)`;

    // <<-- use relative path here so it loads:
    elements.progressLabel.innerHTML =
      `<img src="images/star.png" alt="Star" class="progress-icon"> `
      + `Puzzle ${currentPuzzleIndex+1}/${sessionLength}`;

    startTimer();
  }

  function displayEndOfSession() {
    const ratio = correctCount / puzzleAttempts;
    if (puzzleAttempts >= sessionLength && ratio >= 0.8) {
      elements.puzzleContainer.innerHTML =
        "<p>Well done! You’ve mastered this level! Ready for a review?</p>";
      speak("Well done! You’ve mastered this level!");
      startReviewSession();
    } else {
      elements.puzzleContainer.innerHTML =
        "<p>Keep practicing! You need more tries to master this level.</p>";
      speak("Keep practicing! You need more tries!");
      generatePuzzles();
      displayCurrentPuzzle();
    }
  }

  //
  // ==== Event Hooks ====
  //
  elements.hintBtn.addEventListener("click", showHint);
  elements.submitBtn.addEventListener("click", submitAnswer);
  elements.tryAgainBtn.addEventListener("click", tryAgain);
  elements.nextBtn.addEventListener("click", nextPuzzle);
  elements.prevBtn.addEventListener("click", prevPuzzle);
  elements.clearBtn.addEventListener("click", clearDropZone);
  elements.learnBtn.addEventListener("click", () => {
    elements.puzzleContainer.innerHTML =
      "<h3>Learn Basics</h3>"
      + "<p>A sentence has a subject, a verb, and often an object.</p>";
    speak("Learn basics.");
  });
  document.getElementById("listen-instructions-btn")
    .addEventListener("click", () =>
      speak(document.querySelector(".instructions").textContent)
    );
  document.getElementById("fullscreen-btn")
    .addEventListener("click", () => {
      if (!document.fullscreenElement)
        document.documentElement.requestFullscreen();
      else
        document.exitFullscreen();
    });
  document.getElementById("theme-toggle")
    .addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      speak("Theme changed.");
    });
  elements.levelSelect.addEventListener("change", e => {
    currentLevel = e.target.value;
    resetQuiz();
  });
  document.getElementById("reset-btn")
    .addEventListener("click", resetQuiz);

  //
  // ==== Initialize ====
  //
  document.addEventListener("DOMContentLoaded", () => {
    generatePuzzles();
    displayCurrentPuzzle();
    // load GSAP for animations
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    document.body.appendChild(s);
  });

  //
  // ==== Service‑Worker (silence 404s) ====
  //
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch(() => { /* ignore SW failures */ });
  }

})();
```
