"use strict";

(() => {
  // **DOM Elements for the Game**
  const elements = {
    puzzleContainer: document.getElementById("puzzle-container"),
    hint: document.getElementById("hint"),
    successMessage: document.getElementById("success-message"),
    progress: document.getElementById("progress"),
    score: document.getElementById("score"),
    progressBar: document.getElementById("progress-bar"),
    progressLabel: document.getElementById("progress-label"),
    progressIndicator: document.getElementById("progress-indicator"),
    xpDisplay: document.getElementById("xp-display"),
    streakDisplay: document.getElementById("streak-display"),
    badgesList: document.getElementById("badges-list"),
    submitBtn: document.getElementById("submit-btn"),
    tryAgainBtn: document.getElementById("try-again-btn"),
    prevBtn: document.getElementById("prev-btn"),
    nextBtn: document.getElementById("next-btn"),
    hintBtn: document.getElementById("hint-btn"),
    clearBtn: document.getElementById("clear-btn"),
    learnBtn: document.getElementById("learn-btn"),
  };

  // **Speech Synthesis with UK Female Voice (Fallback to US/AU Female Voice)**
  function speak(text) {
    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis not supported on this device.");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      let preferredVoice =
        voices.find((v) => v.lang === "en-GB" && v.name.includes("Female")) ||
        voices.find(
          (v) =>
            v.lang === "en-US" &&
            (v.name.includes("Samantha") || v.name.includes("Victoria"))
        ) ||
        voices.find((v) => v.lang === "en-AU" && v.name.includes("Karen")) ||
        voices.find((v) => v.lang.includes("en"));
      utterance.voice = preferredVoice || voices[0];
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

  // **Hide Tooltip Helper**
  const hideTooltip = (e) => {
    const tooltip = document.querySelector(".word-tooltip");
    if (tooltip) {
      tooltip.remove();
    }
  };

  // **Sentence Pools for Each Level**
  const sentenceCache = {};

  const loadSentencesForLevel = async (level) => {
    if (sentenceCache[level]) return sentenceCache[level];
    const response = await fetch(`data/${level}.json`);
    if (!response.ok) throw new Error("Failed to load sentences");
    const data = await response.json();
    sentenceCache[level] = data;
    return data;
  };

  const getSentencesForLevel = (level) => sentenceCache[level] || [];

  // **Game State Variables**
  const sessionLength = 10;
  let puzzles = [];
  let currentPuzzleIndex = 0;
  let score = 0;
  let currentLevel = localStorage.getItem("currentLevel") || "p3";
  let xp = parseInt(localStorage.getItem("xp")) || 0;
  let streak = parseInt(localStorage.getItem("streak")) || 0;
  let badges = JSON.parse(localStorage.getItem("badges")) || [];
  let timeLeft = 30, timerId = null;
  let hintCount = 0;
  let currentDropZone = null;
  let puzzleAttempts = 0;
  let correctCount = 0;
  const today = new Date().toDateString();
  if (
    localStorage.getItem("lastPlayDate") &&
    localStorage.getItem("lastPlayDate") !== today
  ) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (localStorage.getItem("lastPlayDate") !== yesterday.toDateString())
      streak = 0;
  }

  // **Utility Function to Shuffle an Array**
  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  // **Generate Puzzles for the Current Session**
  const generatePuzzles = async () => {
    const sentencePool = await loadSentencesForLevel(currentLevel);
    const selectedSentences = shuffle([...sentencePool]).slice(0, sessionLength);
    puzzles = selectedSentences.map((sentence) => ({
      correct: sentence.split(" "),
      submitted: false,
      userAnswer: [],
      attempts: 0,
    }));
    currentPuzzleIndex = 0;
    score = 0;
    puzzleAttempts = 0;
    correctCount = 0;
    hintCount = 0;
    updateGamificationPanel();
  };

  // **Check if Drop Zone is Complete to Enable Submission**
  const checkCompletion = () => {
    if (!currentDropZone) return;
    const totalWords = puzzles[currentPuzzleIndex].correct.length;
    const droppedWords = currentDropZone.querySelectorAll(".word").length;
    elements.submitBtn.disabled = droppedWords !== totalWords;
    elements.submitBtn.style.backgroundColor = elements.submitBtn.disabled
      ? "#cccccc"
      : "#4CAF50";
  };

  // **Determine the Role of a Word in a Sentence**
  const getWordRole = (word, index, correctSentence) => {
    if (index === 0 && /^[A-Z]/.test(word)) return "subject";
    if (
      word.match(
        /^(is|was|were|are|runs|eats|sings|sleeps|reads|writes|explained|listened|chased|had|play|draws|decided|enjoyed|prepared|helped|finished|stopped|jumps|builds|climbs|solves|shares|flies|falls|barks|purrs|rides|skips|claps|fetch|wags|does|do|did|will|shall|can|might|should|would)/i
      )
    )
      return "verb";
    if (
      index > 1 &&
      index < correctSentence.length - 1 &&
      !word.match(/[.!?]$/) &&
      !word.match(
        /^(is|was|were|are|runs|eats|sings|sleeps|reads|writes|explained|listened|chased|had|play|draws|decided|enjoyed|prepared|helped|finished|stopped|jumps|builds|climbs|solves|shares|flies|falls|barks|purrs|rides|skips|claps|fetch|wags|does|do|did|will|shall|can|might|should|would)/i
      ) &&
      word.match(/^[a-zA-Z\s]+$/)
    )
      return "object";
    if (word.match(/[.!?]$/)) return "end";
    return "other";
  };

  // **Display the Current Puzzle**
  const displayCurrentPuzzle = () => {
    if (!elements.puzzleContainer) return;
    elements.puzzleContainer.innerHTML = "";
    elements.hint.textContent = "";
    elements.successMessage.textContent = "";
    stopTimer();
    elements.submitBtn.style.display = "inline-block";
    elements.tryAgainBtn.style.display = "none";
    elements.prevBtn.style.display = "inline-block";
    elements.nextBtn.style.display = "inline-block";
    elements.hintBtn.style.display = "inline-block";
    elements.clearBtn.style.display = "inline-block";
    elements.learnBtn.style.display = "inline-block";

    if (currentPuzzleIndex >= puzzles.length) {
      if (puzzleAttempts >= sessionLength && correctCount / puzzleAttempts >= 0.8) {
        elements.puzzleContainer.innerHTML =
          "<p>Well done! You’ve mastered this level! Ready for a review?</p>";
        speak("Well done! You’ve mastered this level! Ready for a review?");
        startReviewSession();
      } else {
        elements.puzzleContainer.innerHTML =
          "<p>Keep practicing! You need more tries to master this level.</p>";
        speak("Keep practicing! You need more tries to master this level.");
        generatePuzzles().then(() => displayCurrentPuzzle());
      }
      updateLocalStorage();
      return;
    }

    const puzzle = puzzles[currentPuzzleIndex];
    const container = document.createElement("div");
    container.className = "sentence-container";

    const header = document.createElement("h3");
    header.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${sessionLength}`;
    container.appendChild(header);

    const wordBank = document.createElement("div");
    wordBank.className = "word-bank";
    wordBank.setAttribute("aria-label", "Word Bank");
    wordBank.setAttribute("role", "list");

    currentDropZone = document.createElement("div");
    currentDropZone.className = "drop-zone";
    currentDropZone.setAttribute("aria-label", "Drop Zone");
    currentDropZone.setAttribute("role", "list");

    container.appendChild(wordBank);
    container.appendChild(currentDropZone);

    wordBank.style.display = "grid";
    wordBank.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px, 1fr))";
    wordBank.style.gap = "20px";
    currentDropZone.style.display = "grid";
    currentDropZone.style.gridTemplateColumns = "repeat(auto-fit, minmax(120px,1fr))";
    currentDropZone.style.gap = "20px";

    [wordBank, currentDropZone].forEach((zone) => {
      zone.addEventListener("dragover", handleDragOver);
      zone.addEventListener("dragleave", handleDragLeave);
      zone.addEventListener("drop", handleDrop);
    });

    if (!puzzle.submitted) {
      const wordsShuffled = shuffle([...puzzle.correct]);
      wordsShuffled.forEach((word) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.setAttribute("role", "listitem");
        wordDiv.tabIndex = 0;
        wordDiv.textContent = word;
        wordDiv.draggable = true;
        const role = getWordRole(word, puzzle.correct.indexOf(word), puzzle.correct);
        wordDiv.dataset.role = role;
        wordDiv.classList.add(role);
        wordDiv.addEventListener("dragstart", handleDragStart);
        wordDiv.addEventListener("dragend", handleDragEnd);
        wordDiv.addEventListener("mouseover", showTooltip);
        wordDiv.addEventListener("mouseout", hideTooltip);
        wordDiv.addEventListener("touchstart", showTouchTooltip, { passive: true });
        wordDiv.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && wordDiv.parentElement.classList.contains("drop-zone"))
            removeWord(e);
        });
        wordBank.appendChild(wordDiv);
      });
      if (!currentDropZone.children.length) {
        const placeholder = document.createElement("div");
        placeholder.className = "drop-placeholder";
        placeholder.textContent = "Drag words here to build your sentence!";
        currentDropZone.appendChild(placeholder);
      }
    } else {
      puzzle.userAnswer.forEach((word, index) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.textContent = word;
        const isCorrect = word === puzzle.correct[index];
        wordDiv.classList.add(isCorrect ? "correct" : "incorrect");
        wordDiv.dataset.correctWord = puzzle.correct[index];
        if (!isCorrect) {
          wordDiv.style.cursor = "pointer";
          wordDiv.addEventListener("click", correctWord);
        }
        currentDropZone.appendChild(wordDiv);
      });
      elements.submitBtn.style.display = "none";
      elements.tryAgainBtn.style.display = "inline-block";
    }

    elements.puzzleContainer.appendChild(container);
    timeLeft = 30;
    startTimer();
    checkCompletion();
    elements.progress.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${sessionLength}${
      document.getElementById("timer-mode").checked ? ` - Time: ${timeLeft}s` : ""
    }`;
    elements.score.textContent = `Score: ${score}`;
    elements.progressBar.style.width = `${((currentPuzzleIndex + 1) / sessionLength) * 100}%`;
    elements.progressIndicator.textContent = `Mastery Progress: ${
      puzzleAttempts > 0 ? Math.round((correctCount / puzzleAttempts) * 100) : 0
    }% (80% to advance)`;
    elements.progressLabel.innerHTML = `<img src="images/star.png" alt="Star" class="progress-icon"> Puzzle ${
      currentPuzzleIndex + 1
    }/${sessionLength}`;
  };

  // **Drag-and-Drop Event Handlers**
  let draggedItem = null;
  const handleDragStart = (e) => {
    draggedItem = e.target;
    e.target.style.opacity = "0.5";
    e.dataTransfer.setData("text/plain", e.target.textContent);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    draggedItem = null;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("active");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("active");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (
      (e.currentTarget.classList.contains("drop-zone") ||
        e.currentTarget.classList.contains("word-bank")) &&
      draggedItem
    ) {
      e.currentTarget.classList.remove("active");
      const placeholder = e.currentTarget.querySelector(".drop-placeholder");
      if (placeholder && e.currentTarget.classList.contains("drop-zone"))
        placeholder.remove();
      e.currentTarget.appendChild(draggedItem);
      gsap.fromTo(
        draggedItem,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3 }
      );
      checkCompletion();
      if (
        e.currentTarget.classList.contains("drop-zone") &&
        e.currentTarget.querySelectorAll(".word").length === 0
      ) {
        const newPlaceholder = document.createElement("div");
        newPlaceholder.className = "drop-placeholder";
        newPlaceholder.textContent = "Drag words here to build your sentence!";
        e.currentTarget.appendChild(newPlaceholder);
      }
    }
  };

  // **Timer for Timed Mode**
  const startTimer = () => {
    if (!document.getElementById("timer-mode").checked) return;
    stopTimer();
    timerId = setInterval(() => {
      timeLeft--;
      elements.progress.textContent = `Puzzle ${currentPuzzleIndex + 1} of ${sessionLength} - Time: ${timeLeft}s`;
      if (timeLeft <= 0) {
        stopTimer();
        submitAnswer();
        nextPuzzle();
      }
    }, 1000);
  };

  const stopTimer = () => {
    if (timerId) clearInterval(timerId);
    timerId = null;
  };

  // **Update Gamification Panel and Save State**
  function updateGamificationPanel() {
    elements.xpDisplay.textContent = `XP: ${xp}`;
    elements.streakDisplay.textContent = `Streak: ${streak}`;
    elements.badgesList.innerHTML =
      badges
        .map(
          (badge) =>
            `<img src="images/${badge.toLowerCase().replace(" ", "-")}.png" alt="${badge}" class="badge-icon">`
        )
        .join(" ") || "None";
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("lastPlayDate", today);
    localStorage.setItem("currentLevel", currentLevel);
  }

  // **Save Game State to LocalStorage**
  function updateLocalStorage() {
    localStorage.setItem("xp", xp);
    localStorage.setItem("streak", streak);
    localStorage.setItem("badges", JSON.stringify(badges));
    localStorage.setItem("currentLevel", currentLevel);
  }

  // **Display Confetti Animation**
  function displayConfetti(count = 20) {
    const confettiContainer = document.createElement("div");
    confettiContainer.className = "confetti-container";
    document.body.appendChild(confettiContainer);
    for (let i = 0; i < count; i++) {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "vw";
      confetti.style.animationDelay = Math.random() * 2 + "s";
      confetti.style.backgroundColor = [
        "#ff6f61",
        "#ff9f1c",
        "#ffcc00",
        "#98fb98",
        "#40c4ff",
      ][Math.floor(Math.random() * 5)];
      confettiContainer.appendChild(confetti);
    }
    setTimeout(() => confettiContainer.remove(), 5000);
  }

  // **Animate Success Message with GSAP**
  function animateSuccessMessage() {
    gsap.fromTo(
      elements.successMessage,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, ease: "bounce.out" }
    );
  }

  // **Show Tooltip on Hover**
  const showTooltip = (e) => {
    const word = e.target.textContent;
    const puzzle = puzzles[currentPuzzleIndex];
    const index = puzzle.correct.indexOf(word);
    const role = index !== -1 ? getWordRole(word, index, puzzle.correct) : "unknown";
    let tip = "";
    switch (role) {
      case "subject":
        tip = "Subject: Who does it?";
        break;
      case "verb":
        tip = "Verb: What happens?";
        break;
      case "object":
        tip = "Object: What’s it about?";
        break;
      case "end":
        tip = "End: This ends the sentence.";
        break;
      default:
        tip = "Other: Part of the sentence.";
    }
    const tooltip = document.createElement("div");
    tooltip.textContent = tip;
    tooltip.className = "word-tooltip";
    tooltip.style.position = "absolute";
    tooltip.style.background = "rgba(0, 0, 0, 0.8)";
    tooltip.style.color = "white";
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "10px";
    tooltip.style.fontSize = "1em";
    tooltip.style.zIndex = "10";
    const rect = e.target.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    tooltip.style.top = `${rect.bottom + scrollY + 5}px`;
    tooltip.style.left = `${rect.left}px`;
    const tooltipRect = tooltip.getBoundingClientRect();
    if (tooltipRect.right > window.innerWidth)
      tooltip.style.left = `${window.innerWidth - tooltipRect.width - 5}px`;
    if (tooltipRect.bottom > window.innerHeight)
      tooltip.style.top = `${rect.top + scrollY - tooltipRect.height - 5}px`;
    document.body.appendChild(tooltip);
    e.target.addEventListener("mouseout", () => tooltip.remove(), { once: true });
  };

  // **Show Tooltip on Touch (Long Press)**
  const showTouchTooltip = (e) => {
    let timer;
    const touchMove = () => clearTimeout(timer);
    const touchEnd = () => {
      clearTimeout(timer);
      document.removeEventListener("touchmove", touchMove);
      document.removeEventListener("touchend", touchEnd);
    };
    timer = setTimeout(() => {
      const word = e.target.textContent;
      const puzzle = puzzles[currentPuzzleIndex];
      const index = puzzle.correct.indexOf(word);
      const role = index !== -1 ? getWordRole(word, index, puzzle.correct) : "unknown";
      let tip = "";
      switch (role) {
        case "subject":
          tip = "Subject: Who does it?";
          break;
        case "verb":
          tip = "Verb: What happens?";
          break;
        case "object":
          tip = "Object: What’s it about?";
          break;
        case "end":
          tip = "End: This ends the sentence.";
          break;
        default:
          tip = "Other: Part of the sentence.";
      }
      const tooltip = document.createElement("div");
      tooltip.textContent = tip;
      tooltip.className = "word-tooltip";
      tooltip.style.position = "absolute";
      tooltip.style.background = "rgba(0, 0, 0, 0.7)";
      tooltip.style.color = "white";
      tooltip.style.padding = "5px 10px";
      tooltip.style.borderRadius = "4px";
      tooltip.style.fontSize = "0.8em";
      tooltip.style.zIndex = "10";
      const rect = e.target.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      tooltip.style.top = `${rect.bottom + scrollY + 5}px`;
      tooltip.style.left = `${rect.left}px`;
      const tooltipRect = tooltip.getBoundingClientRect();
      if (tooltipRect.right > window.innerWidth)
        tooltip.style.left = `${window.innerWidth - tooltipRect.width - 5}px`;
      if (tooltipRect.bottom > window.innerHeight)
        tooltip.style.top = `${rect.top + scrollY - tooltipRect.height - 5}px`;
      document.body.appendChild(tooltip);
      e.target.addEventListener("touchend", () => tooltip.remove(), { once: true });
    }, 500);
    document.addEventListener("touchmove", touchMove);
    document.addEventListener("touchend", touchEnd);
  };

  // **Remove a Word from Drop Zone**
  const removeWord = (e) => {
    const word = e.target;
    const wordBank = document.querySelector(".word-bank");
    if (!wordBank || !word.classList.contains("word")) return;
    if (word.parentElement.classList.contains("drop-zone")) {
      const newWord = word.cloneNode(true);
      newWord.draggable = true;
      newWord.addEventListener("dragstart", handleDragStart);
      newWord.addEventListener("dragend", handleDragEnd);
      newWord.addEventListener("mouseover", showTooltip);
      newWord.addEventListener("mouseout", hideTooltip);
      newWord.addEventListener("touchstart", showTouchTooltip, { passive: true });
      newWord.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && newWord.parentElement.classList.contains("drop-zone"))
          removeWord(e);
      });
      wordBank.appendChild(newWord);
      word.classList.add("removing");
      setTimeout(() => word.remove(), 300);
      speak("Word removed and returned to the word bank.");
    }
    checkCompletion();
    if (currentDropZone && currentDropZone.querySelectorAll(".word").length === 0) {
      const placeholder = document.createElement("div");
      placeholder.className = "drop-placeholder";
      placeholder.textContent = "Drag words here to build your sentence!";
      currentDropZone.appendChild(placeholder);
    }
  };

  // **Correct a Wrong Word on Click**
  const correctWord = (e) => {
    const wordDiv = e.target;
    if (!wordDiv.classList.contains("incorrect")) return;
    const correctWordText = wordDiv.dataset.correctWord;
    wordDiv.textContent = correctWordText;
    wordDiv.classList.remove("incorrect");
    wordDiv.classList.add("correct");
    wordDiv.style.cursor = "default";
    wordDiv.removeEventListener("click", correctWord);
    const puzzle = puzzles[currentPuzzleIndex];
    puzzle.userAnswer = Array.from(currentDropZone.querySelectorAll(".word")).map(
      (word) => word.textContent
    );
    const isNowCorrect = puzzle.userAnswer.join(" ") === puzzle.correct.join(" ");
    if (isNowCorrect) {
      score++;
      correctCount++;
      streak++;
      xp += 5;
      document.getElementById("success-sound").play();
      speak(`Great job! The sentence is now correct: ${puzzle.correct.join(" ")}`);
      elements.successMessage.textContent = "✓ Yay! You fixed it!";
      animateSuccessMessage();
      displayConfetti();
      setTimeout(() => (elements.successMessage.textContent = ""), 3000);
      updateGamificationPanel();
    }
  };

  // **Provide Hints**
  const showHint = () => {
    const puzzle = puzzles[currentPuzzleIndex];
    if (!puzzle.submitted) {
      const wordBankWords = Array.from(document.querySelectorAll(".word-bank .word"));
      if (hintCount === 0) {
        hintCount++;
        const subjectWord = puzzle.correct[0];
        if (subjectWord) {
          elements.hint.textContent = `Who does it? The subject is "${subjectWord}".`;
          speak(`Who does it? The subject is ${subjectWord}.`);
          wordBankWords.forEach((word) => {
            if (word.textContent === subjectWord) {
              word.classList.add("hint-subject");
              setTimeout(() => word.classList.remove("hint-subject"), 3000);
            }
          });
        }
      } else if (hintCount === 1) {
        hintCount++;
        const verbIndex = puzzle.correct.findIndex(
          (word) => getWordRole(word, puzzle.correct.indexOf(word), puzzle.correct) === "verb"
        );
        const verbWord = verbIndex !== -1 ? puzzle.correct[verbIndex] : null;
        if (verbWord) {
          elements.hint.textContent = `What happens? The action word is "${verbWord}".`;
          speak(`What happens? The action word is ${verbWord}.`);
          wordBankWords.forEach((word) => {
            if (word.textContent === verbWord) {
              word.classList.add("hint-verb");
              setTimeout(() => word.classList.remove("hint-verb"), 3000);
            }
          });
        }
      } else if (hintCount === 2) {
        hintCount++;
        const objectIndex = puzzle.correct.findIndex(
          (word, idx) => getWordRole(word, idx, puzzle.correct) === "object"
        );
        const objectWord = objectIndex !== -1 ? puzzle.correct[objectIndex] : null;
        if (objectWord) {
          elements.hint.textContent = `What’s it about? The object is "${objectWord}".`;
          speak(`What’s it about? The object is ${objectWord}.`);
          wordBankWords.forEach((word) => {
            if (word.textContent === objectWord) {
              word.classList.add("hint-object");
              setTimeout(() => word.classList.remove("hint-object"), 3000);
            }
          });
        }
      } else {
        elements.hint.textContent = "No more hints! You can do it!";
        speak("No more hints! You can do it!");
      }
      xp -= hintCount * 2;
      updateGamificationPanel();
    }
  };

  // **Submit and Evaluate Answer**
  const submitAnswer = () => {
    const puzzle = puzzles[currentPuzzleIndex];
    puzzle.attempts++;
    puzzleAttempts++;
    // Only consider elements with "word" class
    const userWords = Array.from(currentDropZone.querySelectorAll(".word")).map(
      (word) => word.textContent
    );
    puzzle.submitted = true;
    const userWordsAdjusted = userWords.map((word, idx) =>
      idx === 0 ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : word
    );
    const needsPunctuation = !/[.!?]$/.test(userWordsAdjusted[userWordsAdjusted.length - 1]);
    puzzle.userAnswer = userWordsAdjusted;
    const isCorrect = userWordsAdjusted.join(" ") === puzzle.correct.join(" ");

    Array.from(currentDropZone.querySelectorAll(".word")).forEach((wordElem, index) => {
      wordElem.classList.remove("correct", "incorrect");
      const isWordCorrect = wordElem.textContent === puzzle.correct[index];
      wordElem.classList.add(isWordCorrect ? "correct" : "incorrect");
      if (!isWordCorrect) {
        wordElem.dataset.correctWord = puzzle.correct[index];
        wordElem.style.cursor = "pointer";
        wordElem.addEventListener("click", correctWord);
      }
    });

    if (isCorrect && !needsPunctuation) {
      score++;
      correctCount++;
      streak++;
      xp += 10 + (document.getElementById("timer-mode").checked ? Math.floor(timeLeft / 5) : 0);
      if (!badges.includes("First Win")) badges.push("First Win");
      if (streak === 5 && !badges.includes("Perfect Streak 5"))
        badges.push("Perfect Streak 5");
      if (score === sessionLength && !badges.includes("Level Master"))
        badges.push("Level Master");
      document.getElementById("success-sound").play();
      speak(`Great job! The sentence is: ${puzzle.correct.join(" ")}`);
      elements.successMessage.textContent = "✓ Yay! You got it!";
      animateSuccessMessage();
      displayConfetti();
      setTimeout(() => (elements.successMessage.textContent = ""), 3000);
    } else {
      document.getElementById("error-sound").play();
      streak = 0;
      let feedback = "Oops, not quite! Click incorrect words to fix them. ";
      if (!isCorrect) feedback += "Check your word order. ";
      if (needsPunctuation) feedback += "Add a period or question mark. ";
      if (!isCorrect && userWordsAdjusted[0] !== puzzle.correct[0])
        feedback += "Start with the subject! ";
      if (
        !isCorrect &&
        userWordsAdjusted.findIndex(
          (w) => getWordRole(w, userWordsAdjusted.indexOf(w), userWordsAdjusted) === "verb"
        ) !==
          puzzle.correct.findIndex(
            (w) => getWordRole(w, puzzle.correct.indexOf(w), puzzle.correct) === "verb"
          )
      )
        feedback += "The verb might be misplaced! ";
      speak(feedback);
      elements.hint.textContent = feedback;
    }
    updateGamificationPanel();
    displayCurrentPuzzle();
  };

  // **Retry Current Puzzle**
  const tryAgain = () => {
    const puzzle = puzzles[currentPuzzleIndex];
    puzzle.submitted = false;
    puzzle.userAnswer = [];
    hintCount = 0;
    displayCurrentPuzzle();
  };

  // **Move to Next Puzzle**
  const nextPuzzle = async () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      currentPuzzleIndex++;
      hintCount = 0;
      displayCurrentPuzzle();
    } else if (puzzleAttempts >= sessionLength && correctCount / puzzleAttempts >= 0.8) {
      const levels = ["p1", "p2", "p3", "p4", "p5", "p6"];
      const nextLevelIndex = levels.indexOf(currentLevel) + 1;
      if (nextLevelIndex < levels.length) {
        currentLevel = levels[nextLevelIndex];
        document.getElementById("level-select").value = currentLevel;
        speak(`Wow! Moving up to ${currentLevel.toUpperCase()}!`);
        alert(`Great job! Moving up to ${currentLevel.toUpperCase()}!`);
        await generatePuzzles();
      } else {
        speak("Amazing! You’ve mastered all levels!");
        alert("Congratulations! You've mastered all levels!");
      }
    } else {
      await generatePuzzles();
      speak("Keep practicing to master this level!");
    }
  };

  // **Move to Previous Puzzle**
  const prevPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      currentPuzzleIndex--;
      hintCount = 0;
      displayCurrentPuzzle();
    } else {
      speak("This is the first puzzle!");
      alert("This is the first puzzle.");
    }
  };

  // **Start Review Session**
  const startReviewSession = async () => {
    const prevLevel = currentLevel === "p1" ? "p1" : "p" + (parseInt(currentLevel.slice(1)) - 1);
    const [prevSentences, currentSentences] = await Promise.all([
      loadSentencesForLevel(prevLevel),
      loadSentencesForLevel(currentLevel),
    ]);
    const reviewSentences = shuffle([...prevSentences.slice(0, 3), ...currentSentences.slice(0, 7)]);
    puzzles = reviewSentences.map((sentence) => ({
      correct: sentence.split(" "),
      submitted: false,
      userAnswer: [],
      attempts: 0,
    }));
    currentPuzzleIndex = 0;
    score = 0;
    puzzleAttempts = 0;
    correctCount = 0;
    displayCurrentPuzzle();
    speak("Time for a review session with mixed puzzles!");
  };

  // **Reset Quiz**
  const resetQuiz = async () => {
    await generatePuzzles();
    const levelColors = {
      p1: "#ff6f61",
      p2: "#ff9f1c",
      p3: "#ffcc00",
      p4: "#98fb98",
      p5: "#40c4ff",
      p6: "#ff69b4",
    };
    document.documentElement.style.setProperty("--primary-color", levelColors[currentLevel]);
    displayCurrentPuzzle();
  };

  // **Clear Drop Zone**
  const clearDropZone = () => {
    if (!currentDropZone) return;
    const wordBank = document.querySelector(".word-bank");
    if (!wordBank) return;
    Array.from(currentDropZone.querySelectorAll(".word")).forEach((word) => {
      const newWord = word.cloneNode(true);
      newWord.draggable = true;
      newWord.addEventListener("dragstart", handleDragStart);
      newWord.addEventListener("dragend", handleDragEnd);
      newWord.addEventListener("mouseover", showTooltip);
      newWord.addEventListener("mouseout", hideTooltip);
      newWord.addEventListener("touchstart", showTouchTooltip, { passive: true });
      newWord.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && newWord.parentElement.classList.contains("drop-zone"))
          removeWord(e);
      });
      wordBank.appendChild(newWord);
      word.classList.add("removing");
      setTimeout(() => word.remove(), 300);
    });
    const placeholder = document.createElement("div");
    placeholder.className = "drop-placeholder";
    placeholder.textContent = "Drag words here to build your sentence!";
    currentDropZone.appendChild(placeholder);
    checkCompletion();
    speak("Drop zone cleared. Words returned to the word bank.");
  };

  // **Toggle Fullscreen Mode**
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  // **Event Listeners**
  document.getElementById("listen-instructions-btn").addEventListener("click", () =>
    speak(document.querySelector("p.instructions").textContent)
  );
  elements.hintBtn.addEventListener("click", showHint);
  elements.submitBtn.addEventListener("click", submitAnswer);
  elements.tryAgainBtn.addEventListener("click", tryAgain);
  elements.prevBtn.addEventListener("click", prevPuzzle);
  elements.nextBtn.addEventListener("click", nextPuzzle);
  elements.clearBtn.addEventListener("click", clearDropZone);
  elements.learnBtn.addEventListener("click", () => {
    elements.puzzleContainer.innerHTML =
      "<h3>Learn Sentence Basics</h3><p>A sentence has a subject (who), a verb (what happens), and often an object (what’s affected). Example: 'The dog (subject) runs (verb) fast (object).'</p>";
    speak("Learn Sentence Basics: A sentence has a subject, a verb, and often an object.");
  });
  document.getElementById("reset-btn").addEventListener("click", resetQuiz);
  document.getElementById("level-select").addEventListener("change", async (e) => {
    currentLevel = e.target.value;
    await resetQuiz();
  });
  document.getElementById("fullscreen-btn").addEventListener("click", toggleFullScreen);
  document.getElementById("theme-toggle").addEventListener("click", () => {
    const body = document.body;
    if (body.classList.contains("pastel-theme")) {
      body.classList.remove("pastel-theme");
      body.classList.add("rainbow-theme");
      speak("Switched to Rainbow Fun theme!");
    } else if (body.classList.contains("rainbow-theme")) {
      body.classList.remove("rainbow-theme");
      speak("Switched to Bright Playful theme!");
    } else {
      body.classList.add("pastel-theme");
      speak("Switched to Pastel Calm theme!");
    }
  });

  // **Initialize Game on Page Load**
  document.addEventListener("DOMContentLoaded", async () => {
    await generatePuzzles();
    displayCurrentPuzzle();
  });
})();
