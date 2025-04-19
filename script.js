```javascript
// script.js
"use strict";

(() => {
  //
  // ==== Tutorial Overlay Logic ====
  //
  const tutorialOverlay = document.getElementById('tutorial-overlay');
  const tutorialNext    = document.getElementById('tutorial-next');
  if (!localStorage.getItem('wod_tutorial_shown')) {
    tutorialOverlay.classList.remove('hidden');
  }
  tutorialNext.addEventListener('click', () => {
    tutorialOverlay.classList.add('hidden');
    localStorage.setItem('wod_tutorial_shown','1');
  });

  //
  // ==== DOM ELEMENTS ====
  //
  const elements = {
    puzzleContainer: document.getElementById("puzzle-container"),
    hintBtn:         document.getElementById("hint-btn"),
    successMessage:  document.getElementById("success-message"),
    progress:        document.getElementById("progress"),
    score:           document.getElementById("score"),
    progressBar:     document.getElementById("progress-bar"),
    progressLabel:   document.getElementById("progress-label"),
    progressIndicator: document.getElementById("progress-indicator"),
    xpDisplay:       document.getElementById("xp-display"),
    streakDisplay:   document.getElementById("streak-display"),
    badgesList:      document.getElementById("badges-list"),
    submitBtn:       document.getElementById("submit-btn"),
    tryAgainBtn:     document.getElementById("try-again-btn"),
    prevBtn:         document.getElementById("prev-btn"),
    nextBtn:         document.getElementById("next-btn"),
    clearBtn:        document.getElementById("clear-btn"),
    learnBtn:        document.getElementById("learn-btn"),
    levelSelect:     document.getElementById("level-select"),
    timerMode:       document.getElementById("timer-mode"),
  };

  //
  // ==== Speech Synthesis ====
  //
  function speak(text) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      utterance.voice =
        voices.find(v => v.lang === "en-GB" && v.name.includes("Female")) ||
        voices.find(v => v.lang === "en-US" && (v.name.includes("Samantha") || v.name.includes("Victoria"))) ||
        voices.find(v => v.lang === "en-AU" && v.name.includes("Karen")) ||
        voices[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    };
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        loadVoices();
        window.speechSynthesis.onvoiceschanged = null;
      };
    } else {
      loadVoices();
    }
  }

  //
  // ==== Sentence Pools ====
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
  // ==== Utility Functions ====
  //
  const shuffle = arr => arr.sort(() => Math.random() - 0.5);

  function getWordRole(word, idx, sentenceArr) {
    if (idx === 0 && /^[A-Z]/.test(word)) return "subject";
    if (/^(is|was|were|are|runs|eats|sings|sleeps|reads|writes|explained|listened|chased|had|play|draws|decided|enjoyed|prepared|helped|finished|stopped|jumps|builds|climbs|solves|shares|flies|falls|barks|purrs|rides|skips|claps|fetch|wags|does|do|did|will|shall|can|might|should|would)/i.test(word))
      return "verb";
    if (idx > 1 && idx < sentenceArr.length - 1 && !/[.!?]$/.test(word) && /^[A-Za-z]+$/.test(word))
      return "object";
    if (/[.!?]$/.test(word)) return "end";
    return "other";
  }

  //
  // ==== Game State ====
  //
  const sessionLength = 10;
  let puzzles = [];
  let currentPuzzleIndex = 0;
  let score = 0;
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let badges = JSON.parse(localStorage.getItem("badges")) || [];
  let hintCount = 0;
  let timeLeft = 30, timerId = null;
  let puzzleAttempts = 0, correctCount = 0;
  const today = new Date().toDateString();
  let currentLevel = localStorage.getItem("currentLevel") || "p3";

  // Reset streak if last play was not yesterday
  if (localStorage.getItem("lastPlayDate") && localStorage.getItem("lastPlayDate") !== today) {
    const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
    if (localStorage.getItem("lastPlayDate") !== yesterday.toDateString())
      streak = 0;
  }

  //
  // ==== Persistence ====
  //
  function updateGamificationPanel() {
    elements.xpDisplay.textContent = `XP: ${xp}`;
    elements.streakDisplay.textContent = `Streak: ${streak}`;
    elements.badgesList.innerHTML =
      badges.length
        ? badges.map(b => `<img src="/images/${b.toLowerCase().replace(/ /g,"-")}.png" alt="${b}" class="badge-icon">`).join("")
        : "None";
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("lastPlayDate", today);
    localStorage.setItem("currentLevel", currentLevel);
  }

  function updateLocalStorage() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("currentLevel", currentLevel);
  }

  //
  // ==== Puzzle Generation ====
  //
  function getSentencesForLevel(level) {
    return {
      p1: sentencesP1,
      p2: sentencesP2,
      p3: sentencesP3,
      p4: sentencesP4,
      p5: sentencesP5,
      p6: sentencesP6
    }[level] || sentencesP3;
  }

  function generatePuzzles() {
    const pool = getSentencesForLevel(currentLevel);
    const chosen = shuffle([...pool]).slice(0, sessionLength);
    puzzles = chosen.map(sentence => ({
      correct: sentence.split(" "),
      submitted: false,
      userAnswer: [],
      attempts: 0
    }));
    currentPuzzleIndex = 0;
    score = 0; puzzleAttempts = 0; correctCount = 0; hintCount = 0;
    updateGamificationPanel();
  }

  //
  // ==== Display & Interaction ====
  //
  function checkCompletion() {
    const dz = document.querySelector(".drop-zone");
    if (!dz) return;
    const totalWords = puzzles[currentPuzzleIndex].correct.length;
    elements.submitBtn.disabled = dz.children.length !== totalWords;
    elements.submitBtn.style.backgroundColor = elements.submitBtn.disabled ? "#cccccc" : "#4CAF50";
  }

  let draggedItem = null;
  function handleDragStart(e) {
    draggedItem = e.target;
    e.dataTransfer.setData("text/plain", e.target.textContent);
    e.target.style.opacity = "0.5";
  }
  function handleDragEnd(e) {
    e.target.style.opacity = "1";
    draggedItem = null;
  }
  function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add("active");
  }
  function handleDragLeave(e) {
    e.currentTarget.classList.remove("active");
  }
  function handleDrop(e) {
    e.preventDefault();
    if (!draggedItem) return;
    e.currentTarget.classList.remove("active");
    const placeholder = e.currentTarget.querySelector(".drop-placeholder");
    if (placeholder) placeholder.remove();
    e.currentTarget.appendChild(draggedItem);
    gsap.fromTo(draggedItem, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    checkCompletion();
  }

  function showTooltip(e) {
    const word = e.target.textContent;
    const puzzle = puzzles[currentPuzzleIndex];
    const idx = puzzle.correct.indexOf(word);
    const role = getWordRole(word, idx, puzzle.correct);
    let tip = {
      subject: "Subject: Who does it?",
      verb:    "Verb: What happens?",
      object:  "Object: What’s it about?",
      end:     "End: This ends the sentence."
    }[role] || "Other: Part of the sentence.";
    const tt = document.createElement("div");
    tt.textContent = tip;
    tt.className = "word-tooltip";
    document.body.appendChild(tt);
    const rect = e.target.getBoundingClientRect();
    tt.style.top = `${rect.bottom + window.scrollY + 5}px`;
    tt.style.left = `${rect.left}px`;
    e.target.addEventListener("mouseout", () => tt.remove(), { once: true });
  }

  function showTouchTooltip(e) {
    let timer;
    const touchEnd = () => clearTimeout(timer);
    timer = setTimeout(() => {
      showTooltip({ target: e.target });
    }, 500);
    e.target.addEventListener("touchend", touchEnd, { once: true });
  }

  function removeWord(e) {
    const wordEl = e.target;
    if (!wordEl.classList.contains("word")) return;
    const bank = document.querySelector(".word-bank");
    const clone = wordEl.cloneNode(true);
    clone.draggable = true;
    clone.addEventListener("dragstart", handleDragStart);
    clone.addEventListener("dragend", handleDragEnd);
    clone.addEventListener("mouseover", showTooltip);
    clone.addEventListener("mouseout", showTooltip);
    bank.appendChild(clone);
    wordEl.remove();
    checkCompletion();
  }

  function correctWord(e) {
    const el = e.target;
    if (!el.classList.contains("incorrect")) return;
    const correctText = el.dataset.correctWord;
    el.textContent = correctText;
    el.classList.remove("incorrect");
    el.classList.add("correct");
    el.style.cursor = "default";
    el.removeEventListener("click", correctWord);
    // award partial credit
    score++; correctCount++; streak++; xp += 5;
    elements.successMessage.textContent = "✓ You fixed it!";
    speak(`Great job! The sentence is now correct: ${puzzles[currentPuzzleIndex].correct.join(" ")}`);
    gsap.fromTo(el, { scale: 0 }, { scale: 1, duration: 0.6, ease: "bounce.out" });
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

  //
  // ==== showHint already defined above ====
  //

  function submitAnswer() {
    const puzzle = puzzles[currentPuzzleIndex];
    puzzle.attempts++; puzzleAttempts++;
    const dz = document.querySelector(".drop-zone");
    const userWords = Array.from(dz.children).map(w => w.textContent);
    puzzle.submitted = true;
    puzzle.userAnswer = userWords.map((w,i) => i===0 ? w.charAt(0).toUpperCase()+w.slice(1) : w);
    const hasPunct = /[.!?]$/.test(puzzle.userAnswer[puzzle.userAnswer.length-1]);
    const isCorrect = puzzle.userAnswer.join(" ") === puzzle.correct.join(" ");
    // mark each word
    Array.from(dz.children).forEach((we, i) => {
      const correctW = puzzle.correct[i];
      we.classList.toggle("correct", we.textContent===correctW);
      we.classList.toggle("incorrect", we.textContent!==correctW);
      if (we.classList.contains("incorrect")) {
        we.dataset.correctWord = correctW;
        we.style.cursor = "pointer";
        we.addEventListener("click", correctWord);
      }
    });
    elements.submitBtn.style.display = "none";
    elements.tryAgainBtn.style.display = "inline-block";

    if (isCorrect && hasPunct) {
      score++; correctCount++; streak++;
      xp += 10 + (elements.timerMode.checked ? Math.floor(timeLeft/5) : 0);
      if (!badges.includes("First Win")) badges.push("First Win");
      if (streak===5 && !badges.includes("Perfect Streak 5")) badges.push("Perfect Streak 5");
      if (score===sessionLength && !badges.includes("Level Master")) badges.push("Level Master");
      document.getElementById("success-sound").play();
      speak(`Great job! The sentence is: ${puzzle.correct.join(" ")}`);
      elements.successMessage.textContent = "✓ Yay! You got it!";
      gsap.fromTo(elements.successMessage, { scale:0 }, { scale:1, duration:0.6, ease:"bounce.out" });
      // confetti
      const confettiContainer = document.createElement("div"); confettiContainer.className="confetti-container";
      document.body.appendChild(confettiContainer);
      for(let i=0;i<20;i++){
        const c = document.createElement("div"); c.className="confetti";
        c.style.left = Math.random()*100+"vw";
        c.style.animationDelay = Math.random()*2+"s";
        confettiContainer.appendChild(c);
      }
      setTimeout(()=>confettiContainer.remove(),5000);
      setTimeout(()=>elements.successMessage.textContent="",3000);
    } else {
      document.getElementById("error-sound").play();
      streak = 0;
      let feedback = "Oops, not quite! ";
      if (!isCorrect) feedback += "Check your word order. ";
      if (!hasPunct) feedback += "Add a period or question mark. ";
      speak(feedback);
      elements.hint.textContent = feedback;
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
      currentPuzzleIndex++; hintCount=0;
      displayCurrentPuzzle();
    } else if (puzzleAttempts >= sessionLength && correctCount/puzzleAttempts >= 0.8) {
      // advance level
      const levels = ["p1","p2","p3","p4","p5","p6"];
      const idx = levels.indexOf(currentLevel);
      if (idx < levels.length-1) {
        currentLevel = levels[idx+1];
        elements.levelSelect.value = currentLevel;
        speak(`Moving up to ${currentLevel.toUpperCase()}!`);
        generatePuzzles();
        displayCurrentPuzzle();
      } else {
        speak("You've mastered all levels!");
      }
    } else {
      speak("Keep practicing to master this level!");
      generatePuzzles();
      displayCurrentPuzzle();
    }
  }

  function prevPuzzle() {
    if (currentPuzzleIndex > 0) {
      currentPuzzleIndex--; hintCount=0;
      displayCurrentPuzzle();
    } else {
      alert("This is the first puzzle.");
      speak("This is the first puzzle!");
    }
  }

  function startReviewSession() {
    const prevLevel = currentLevel==="p1"?"p1":"p"+(parseInt(currentLevel[1])-1);
    const mix = shuffle([...getSentencesForLevel(prevLevel).slice(0,3),...getSentencesForLevel(currentLevel).slice(0,7)]);
    puzzles = mix.map(s=>({ correct:s.split(" "), submitted:false, userAnswer:[], attempts:0 }));
    currentPuzzleIndex=0; score=0; puzzleAttempts=0; correctCount=0;
    displayCurrentPuzzle();
    speak("Time for review with mixed puzzles!");
  }

  function resetQuiz() {
    generatePuzzles();
    const colors = { p1:"#ff6f61", p2:"#ff9f1c", p3:"#ffcc00", p4:"#98fb98", p5:"#40c4ff", p6:"#ff69b4" };
    document.documentElement.style.setProperty("--primary-color", colors[currentLevel]);
    displayCurrentPuzzle();
  }

  function clearDropZone() {
    const dz = document.querySelector(".drop-zone");
    const wb = document.querySelector(".word-bank");
    if (!dz||!wb) return;
    Array.from(dz.children).forEach(w=>{
      if (w.classList.contains("word")) {
        const clone = w.cloneNode(true);
        clone.draggable = true;
        clone.addEventListener("dragstart", handleDragStart);
        clone.addEventListener("dragend", handleDragEnd);
        clone.addEventListener("mouseover", showTooltip);
        wb.appendChild(clone);
        w.remove();
      }
    });
    const ph = document.createElement("div");
    ph.className="drop-placeholder";
    ph.textContent="Drag words here to build your sentence!";
    dz.appendChild(ph);
    checkCompletion();
    speak("Drop zone cleared.");
  }

  function displayCurrentPuzzle() {
    elements.puzzleContainer.innerHTML = "";
    elements.hint.textContent = "";
    elements.successMessage.textContent = "";
    elements.submitBtn.style.display = "inline-block";
    elements.tryAgainBtn.style.display = "none";
    elements.prevBtn.style.display = "inline-block";
    elements.nextBtn.style.display = "inline-block";
    elements.clearBtn.style.display = "inline-block";
    elements.learnBtn.style.display = "inline-block";
    stopTimer();

    if (currentPuzzleIndex >= puzzles.length) {
      displayEndOfSession();
      return;
    }

    const puzzle = puzzles[currentPuzzleIndex];
    const container = document.createElement("div");
    container.className="sentence-container";
    const header = document.createElement("h3");
    header.textContent = `Puzzle ${currentPuzzleIndex+1} of ${sessionLength}`;
    container.appendChild(header);

    const wordBank = document.createElement("div");
    wordBank.className="word-bank";
    wordBank.setAttribute("role","list");

    const dropZone = document.createElement("div");
    dropZone.className="drop-zone";
    dropZone.setAttribute("role","list");

    [wordBank, dropZone].forEach(z=>{
      z.addEventListener("dragover", handleDragOver);
      z.addEventListener("dragleave", handleDragLeave);
      z.addEventListener("drop", handleDrop);
    });

    if (!puzzle.submitted) {
      const shuffled = shuffle([...puzzle.correct]);
      shuffled.forEach(word=>{
        const wd = document.createElement("div");
        wd.className="word";
        wd.tabIndex=0;
        wd.textContent=word;
        wd.draggable=true;
        wd.dataset.role = getWordRole(word, puzzle.correct.indexOf(word), puzzle.correct);
        wd.addEventListener("dragstart", handleDragStart);
        wd.addEventListener("dragend", handleDragEnd);
        wd.addEventListener("mouseover", showTooltip);
        wd.addEventListener("touchstart", showTouchTooltip, { passive:true });
        wordBank.appendChild(wd);
      });
      const ph = document.createElement("div");
      ph.className="drop-placeholder";
      ph.textContent="Drag words here to build your sentence!";
      dropZone.appendChild(ph);
    } else {
      puzzle.userAnswer.forEach((word,i)=>{
        const wd = document.createElement("div");
        wd.className="word";
        wd.textContent=word;
        const correctW = puzzle.correct[i];
        const isC = word===correctW;
        wd.classList.add(isC?"correct":"incorrect");
        if (!isC) {
          wd.dataset.correctWord = correctW;
          wd.style.cursor="pointer";
          wd.addEventListener("click", correctWord);
        }
        dropZone.appendChild(wd);
      });
      elements.submitBtn.style.display="none";
      elements.tryAgainBtn.style.display="inline-block";
    }

    container.appendChild(wordBank);
    container.appendChild(dropZone);
    elements.puzzleContainer.appendChild(container);

    elements.submitBtn.disabled = true;
    checkCompletion();

    elements.progress.textContent = `Puzzle ${currentPuzzleIndex+1} of ${sessionLength}${elements.timerMode.checked ? ` - Time: ${timeLeft}s` : ""}`;
    elements.score.textContent = `Score: ${score}`;
    elements.progressBar.style.width = `${((currentPuzzleIndex+1)/sessionLength)*100}%`;
    const percent = puzzleAttempts>0 ? Math.round((correctCount/puzzleAttempts)*100) : 0;
    elements.progressIndicator.textContent = `Mastery Progress: ${percent}% (80% to advance)`;
    elements.progressLabel.innerHTML = `<img src="/images/star.png" alt="Star" class="progress-icon"> Puzzle ${currentPuzzleIndex+1}/${sessionLength}`;

    startTimer();
  }

  function displayEndOfSession() {
    const ratio = correctCount/puzzleAttempts;
    if (puzzleAttempts >= sessionLength && ratio >= 0.8) {
      elements.puzzleContainer.innerHTML = "<p>Well done! You’ve mastered this level! Ready for a review?</p>";
      speak("Well done! You’ve mastered this level! Ready for a review?");
      startReviewSession();
    } else {
      elements.puzzleContainer.innerHTML = "<p>Keep practicing! You need more tries to master this level.</p>";
      speak("Keep practicing! You need more tries to master this level.");
      generatePuzzles();
      displayCurrentPuzzle();
    }
    updateLocalStorage();
  }

  //
  // ==== Event Listeners ====
  //
  elements.hintBtn.addEventListener("click", showHint);
  elements.submitBtn.addEventListener("click", submitAnswer);
  elements.tryAgainBtn.addEventListener("click", tryAgain);
  elements.nextBtn.addEventListener("click", nextPuzzle);
  elements.prevBtn.addEventListener("click", prevPuzzle);
  elements.clearBtn.addEventListener("click", clearDropZone);
  elements.learnBtn.addEventListener("click", () => {
    elements.puzzleContainer.innerHTML =
      "<h3>Learn Sentence Basics</h3><p>A sentence has a subject (who), a verb (what happens), and often an object (what’s affected). Example: 'The dog (subject) runs (verb) fast (object).'</p>";
    speak("Learn Sentence Basics: A sentence has a subject, a verb, and often an object.");
  });
  document.getElementById("listen-instructions-btn")
    .addEventListener("click", () => speak(document.querySelector(".instructions").textContent));
  document.getElementById("fullscreen-btn")
    .addEventListener("click", () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen();
      else document.exitFullscreen();
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
    // load GSAP for drag animations
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    document.body.appendChild(script);
  });

  //
  // ==== Service Worker Registration ====
  //
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
      .then(() => console.log("SW registered"))
      .catch(err => console.error("SW failed:", err));
  }
  
})();
```
