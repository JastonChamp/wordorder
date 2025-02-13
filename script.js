/* Revised Word Order Adventure JavaScript with 50 Sentences per Level and Updated Voiceover */

'use strict';

(() => {
  /*** Speech API Utility with Updated Voice Selection ***/
  function speak(text) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      
      const setVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        let preferredVoice = voices.find(v => v.name.includes("Google US English"));
        if (!preferredVoice) {
          const nonIndianVoices = voices.filter(v => !v.name.toLowerCase().includes("indian"));
          preferredVoice = nonIndianVoices[0] || voices[0];
        }
        if (preferredVoice) {
          utterance.voice = preferredVoice;
          console.log("Selected voice:", preferredVoice.name);
        } else {
          console.warn("No preferred voice found. Using default.");
        }
      };

      if (window.speechSynthesis.getVoices().length) {
        setVoice();
      } else {
        window.speechSynthesis.addEventListener('voiceschanged', setVoice);
      }
      
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis API is not supported in this browser.");
    }
  }

  /*** Level Sentence Pools (50 sentences per level) ***/

  // Primary 1 – Very simple, basic sentences.
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
    "The car stops at the red light.",
    "I jump high on the trampoline.",
    "The book is open on the table.",
    "The rain falls softly on the roof.",
    "The school bell rings loudly.",
    "My friend smiles on a sunny day.",
    "The dog wags its tail happily.",
    "The cat purrs when it is happy.",
    "I like to read fun stories.",
    "The bird flies across the sky.",
    "We share our toys with friends.",
    "The cake tastes very sweet.",
    "The wind blows gently outside.",
    "I sing songs with my classmates.",
    "The flowers bloom in the spring.",
    "The moon shines in the dark sky.",
    "I ride my scooter to school.",
    "The baby laughs at funny faces.",
    "The ice cream melts in the sun.",
    "I play with my new puzzle.",
    "The dog fetches the ball quickly.",
    "The girl claps her hands loudly.",
    "My brother runs in the park.",
    "The water is clear and cool.",
    "I build a tower with blocks.",
    "The school is big and bright.",
    "The bird builds a nest in the tree.",
    "I draw a picture of my family.",
    "The sun sets behind the hills.",
    "I sleep early at night."
  ];

  // Primary 2 – Slightly more descriptive and compound sentences.
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
    "The movie was long, but it was very interesting.",
    "I listened attentively while the teacher explained the experiment.",
    "The garden was full of colorful and blooming flowers.",
    "My brother quickly finished his math homework.",
    "The wind was strong enough to sway the tall trees.",
    "I enjoyed reading the story because it was very exciting.",
    "The school bus arrived promptly every morning.",
    "My friend and I shared our snacks during recess.",
    "The teacher praised the class for their hard work.",
    "I carefully followed the instructions for the science project.",
    "The sun shone brightly on the warm summer day.",
    "We eagerly awaited the start of the school assembly.",
    "The classroom was neat and well-organized.",
    "I learned many new things during our history lesson.",
    "The concert was amazing and left everyone impressed.",
    "My family celebrated my birthday with a surprise party.",
    "The puzzle was challenging, but I solved it step by step.",
    "The students participated actively in the group discussion.",
    "I enjoyed the field trip because it was both fun and educational.",
    "The rain stopped suddenly, and the sky became clear.",
    "I was proud of my work after I completed the project.",
    "The teacher encouraged us to ask questions during the lesson.",
    "Our class visited the museum and learned about history.",
    "The game was exciting and filled with many surprises.",
    "I practiced my speech until I felt confident and ready.",
    "The art project allowed me to express my creativity.",
    "I reviewed my notes carefully before the big test.",
    "The library offered a quiet place for everyone to study.",
    "The teacher organized a fun quiz that everyone enjoyed.",
    "I finished my homework quickly because I understood the topic well."
  ];

  // Primary 3 – Complete sentences with more structure.
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
    "The boy wears a blue cap every day.",
    "The girl carefully draws a beautiful flower.",
    "The dog runs quickly in the green park.",
    "The teacher writes neat words on the board.",
    "The child listens carefully to the exciting story.",
    "The boy enjoys playing under the warm sun.",
    "The girl shares her lunch with a good friend.",
    "The cat purrs softly when it is happy.",
    "The dog wags its tail as it plays.",
    "The student reads a story aloud with passion.",
    "The teacher explains the homework in detail.",
    "The child jumps high during recess time.",
    "The boy builds a small tower with colorful blocks.",
    "The girl draws a picture of her loving family.",
    "The dog barks excitedly at the passing car.",
    "The teacher smiles as the students learn eagerly.",
    "The cat sleeps peacefully on the comfy mat.",
    "The boy rides his bicycle fast along the lane.",
    "The girl skips along the cheerful path.",
    "The student writes neatly in his bright notebook.",
    "The teacher claps for a job well done.",
    "The child sings a cheerful tune during art class.",
    "The dog runs across the vast green field.",
    "The girl reads an interesting book during break time.",
    "The boy plays a lively game of tag with friends.",
    "The teacher explains a tricky problem with clarity.",
    "The student solves the puzzle with careful thought.",
    "The cat jumps gracefully onto the cozy chair.",
    "The dog chases its tail happily in the yard.",
    "The child dreams of a fun and adventurous day."
  ];

  // Primary 4 – More descriptive, detailed sentences.
  const sentencesP4 = [
    "The cheerful girl sings beautifully during the assembly.",
    "The boy quickly runs to school, eager to learn.",
    "The teacher patiently explains the lesson to her attentive students.",
    "The children happily play together in the spacious park.",
    "The shiny red car moves fast along the busy road.",
    "The little boy smiles brightly when he sees his friend at school.",
    "The elderly man walks slowly with a calm and steady pace.",
    "The smart student solves difficult problems with ease.",
    "The busy mother prepares a delicious breakfast every single morning.",
    "The gentle wind blows softly, rustling the vibrant green leaves.",
    "The excited child jumps high in joyful celebration during recess.",
    "The kind teacher helps every student after class with care.",
    "The little girl reads a colorful book under a large shady tree.",
    "The brave boy climbs the tall tree with determination and skill.",
    "The attentive class listens carefully to the teacher’s detailed instructions.",
    "The calm lake reflects the clear blue sky perfectly on a sunny day.",
    "The fast train zooms past the station with remarkable speed.",
    "The playful puppy chases its tail with endless energy.",
    "The thoughtful boy generously shares his toys with his friends.",
    "The pretty garden blooms vibrantly in early spring, showcasing many colors.",
    "The girl carefully draws a detailed picture of her school.",
    "The boy eagerly practices his favorite sport every day after school.",
    "The teacher explains a complex concept in a simple and clear manner.",
    "The children work together on a creative art project with enthusiasm.",
    "The little girl writes a short poem about nature with vivid words.",
    "The boy reads a fascinating story about adventure and mystery.",
    "The teacher encourages the class to ask insightful questions during the lesson.",
    "The gentle breeze makes the leaves dance gracefully on a warm day.",
    "The child listens intently during the exciting science demonstration.",
    "The smart student completes his homework with precision and care.",
    "The class takes a quiet moment to appreciate the beautiful artwork on the wall.",
    "The girl hums a gentle tune while reading her favorite book.",
    "The boy carefully builds a model airplane for the class project.",
    "The teacher smiles as she watches her students collaborate effectively.",
    "The children cheerfully participate in the group activity with great spirit.",
    "The little girl practices her spelling words with focus and determination.",
    "The boy and his friends explore the wonders of nature during recess.",
    "The teacher explains historical events with engaging and vivid details.",
    "During the science experiment, the students observed every detail carefully.",
    "The passionate student presented his findings with clarity and confidence.",
    "After a challenging exam, the class discussed strategies to improve their study habits.",
    "The teacher introduced a new topic that sparked curiosity among the students.",
    "The art class allowed the students to experiment with different techniques.",
    "The diligent student revised his notes thoroughly before the big test.",
    "The class enjoyed a lively discussion about their favorite subjects.",
    "The creative student painted a vibrant picture of the sunset.",
    "The boy solved a challenging puzzle with creative thinking.",
    "The teacher complimented the class on their excellent teamwork.",
    "The children shared their unique ideas during a fun group discussion.",
    "The student finished his project with pride and excitement."
  ];

  // Primary 5 – Compound and multi-clause sentences.
  const sentencesP5 = [
    "The teacher reads a fascinating story, and the children listen attentively.",
    "The boy finished his homework before dinner, so he went outside to play.",
    "The little girl happily skipped to school, and her friends cheered her on.",
    "The bright sun shines over the calm sea while a gentle breeze cools the air.",
    "The busy bees buzz around the blooming flowers as the children watch in wonder.",
    "The students study in the library and take notes carefully on every detail.",
    "The father cooks dinner, and the children eagerly help set the table.",
    "The dog barks loudly, but the cat remains calm and sleeps peacefully.",
    "The rain poured outside, yet the class continued their lesson indoors with focus.",
    "The bird sings in the morning, and the flowers open gracefully to welcome the day.",
    "The boy plays soccer while his friend rides a bicycle around the field.",
    "The teacher writes on the board, and the students copy the notes precisely.",
    "The car stops at the red light, and the driver patiently waits for the signal.",
    "The children laugh during recess, full of energy and joy.",
    "The sun sets in the west, and the sky turns a beautiful shade of orange.",
    "The little girl draws a creative picture, and her mother praises her artistic skills.",
    "The student answers the question correctly, and the teacher smiles with pride.",
    "The dog runs in the park, and the kids cheer excitedly during playtime.",
    "The wind blows gently, making the leaves rustle softly in the cool breeze.",
    "The book is open on the desk, and the student reads silently with concentration.",
    "The teacher explains a challenging concept in a clear and understandable way.",
    "The boy listens carefully to the lesson and asks thoughtful questions.",
    "The little girl practices her handwriting with neat and careful strokes.",
    "The class works together on a creative project, sharing ideas openly.",
    "The student completes his assignment with diligence and accuracy.",
    "The teacher encourages everyone to participate actively in the discussion.",
    "The children explore new topics with curiosity and excitement.",
    "The boy shares his favorite story with his classmates during circle time.",
    "The little girl uses colorful markers to draw an imaginative picture.",
    "The teacher explains the importance of teamwork during a lively discussion.",
    "The students listen intently as the teacher reads a captivating tale.",
    "The class enjoys a fun science experiment that sparks their interest.",
    "The boy carefully solves a challenging math problem on the board.",
    "The teacher provides constructive feedback on every student’s work.",
    "The children take turns presenting their projects with confidence.",
    "The little girl writes a thoughtful letter to a pen pal from another school.",
    "The class debates a current event with respect and insight.",
    "The teacher organizes a creative art session that inspires everyone.",
    "The students work on group assignments and learn from each other.",
    "The boy and his friends participate in a friendly sports competition.",
    "The teacher explains historical events with engaging details.",
    "The little girl listens carefully to a story about faraway lands.",
    "The class takes a quiet moment to appreciate the beauty of nature.",
    "The student researches a topic thoroughly and shares his findings.",
    "The teacher encourages critical thinking through interactive activities.",
    "The children learn the value of cooperation during group work.",
    "The boy practices his musical instrument with dedication and passion.",
    "The teacher leads a lively discussion on interesting scientific discoveries.",
    "The class collaborates on a creative writing assignment that sparks imagination.",
    "The student reflects on his learning journey with enthusiasm and pride."
  ];

  // Primary 6 – Complex sentences with subordinate clauses.
  const sentencesP6 = [
    "After finishing his homework, the student went to the library to study more in depth.",
    "Although it was raining heavily, the children played outside happily during recess.",
    "The teacher, known for her kindness, explained the lesson in remarkable detail.",
    "Despite the heavy traffic, she arrived at school on time and greeted everyone warmly.",
    "When the bell rang, the students hurried to their classrooms with eager anticipation.",
    "Since the exam was extremely challenging, the teacher reviewed the material thoroughly afterward.",
    "Even though it was late, the boy continued reading his favorite book with great enthusiasm.",
    "While the sun was setting, the family enjoyed a delightful picnic in the park.",
    "If you study hard every day, you will achieve excellent results in your exams.",
    "After the game ended, the players celebrated their victory with cheers and applause.",
    "Although the movie was quite long, the audience remained engaged until the very end.",
    "Because the weather was unexpectedly cool, the picnic lasted longer than anticipated.",
    "Since the library was exceptionally quiet, the students concentrated deeply on their research.",
    "When the storm passed, the children went outside to play joyfully despite the damp ground.",
    "After receiving his award, the student thanked his parents for their unwavering support.",
    "Although she was extremely tired, the teacher continued to prepare engaging lessons for the class.",
    "If you practice regularly, your skills will improve significantly over time with dedication.",
    "While the bell was ringing, the students gathered in the hall to listen attentively to the announcement.",
    "Because the assignment was particularly difficult, the students worked in groups to complete it.",
    "After the concert ended, the crowd applauded enthusiastically as the performers took a bow.",
    "The student carefully analyzed the complex problem before writing down his solution.",
    "The teacher challenged the class with a thought-provoking question during the lesson.",
    "Despite the unexpected setback, the group continued working diligently on their project.",
    "The bright, clear sky inspired the students to discuss their favorite outdoor activities.",
    "In the quiet of the library, the students immersed themselves in research and learning.",
    "The teacher skillfully connected historical events to modern-day situations during the discussion.",
    "During the science experiment, the students observed and recorded every detail meticulously.",
    "The passionate student presented his findings with clarity and confidence to the class.",
    "After a challenging exam, the class discussed strategies to improve their study habits.",
    "The teacher introduced a new topic, sparking curiosity and lively debate among the students.",
    "In the art class, students experimented with different techniques to express their creativity.",
    "The diligent student revised his notes thoroughly before the upcoming test.",
    "A group of students collaborated on a project that explored the wonders of the natural world.",
    "The teacher encouraged the class to think critically about the impact of technology on society.",
    "During recess, the students engaged in a spirited game that fostered teamwork and sportsmanship.",
    "The inspiring lecture motivated the students to pursue their academic interests passionately.",
    "After a long day of learning, the students reflected on their progress and set new goals.",
    "The teacher used real-life examples to make abstract concepts more accessible.",
    "During the class discussion, every student contributed thoughtful ideas and opinions.",
    "The creative writing assignment allowed the students to express themselves through imaginative storytelling.",
    "In the music class, the students practiced their instruments with determination and precision.",
    "The teacher organized a field trip that enriched the students' understanding of history and culture.",
    "After a challenging day, the class celebrated their accomplishments with a fun educational activity.",
    "The rigorous academic schedule prepared the students for the challenges of upcoming examinations.",
    "With dedication and hard work, the students steadily improved their academic performance.",
    "The teacher provided valuable feedback that helped the students refine their skills and knowledge.",
    "During group work, the students learned the importance of communication and collaboration.",
    "The classroom buzzed with energy as the students engaged in a lively discussion about current events.",
    "By the end of the lesson, the students felt inspired to further explore the topic on their own.",
    "The dedicated student looked forward to the future with optimism and a thirst for knowledge."
  ];

  // Session and game variables
  const sessionLength = 5;
  let puzzles = [];
  let currentPuzzleIndex = 0;
  let score = 0;
  let currentLevel = 'p3';

  // Gamification variables
  let xp = 0;
  let streak = 0;
  let badges = [];

  /*** Utility Function: Shuffle (Fisher-Yates) ***/
  const shuffle = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  };

  /*** Utility Function: Get Sentence Pool ***/
  const getSentencesForLevel = (level) => {
    switch (level) {
      case 'p1': return sentencesP1;
      case 'p2': return sentencesP2;
      case 'p3': return sentencesP3;
      case 'p4': return sentencesP4;
      case 'p5': return sentencesP5;
      case 'p6': return sentencesP6;
      default: return sentencesP3;
    }
  };

  /*** Puzzle Generation ***/
  const generatePuzzles = () => {
    const sentencePool = getSentencesForLevel(currentLevel);
    const selectedSentences = shuffle([...sentencePool]).slice(0, sessionLength);
    puzzles = selectedSentences.map(sentence => ({
      correct: sentence.split(" "),
      submitted: false,
      userAnswer: []
    }));
    currentPuzzleIndex = 0;
    score = 0;
    // Reset gamification metrics for a new session
    xp = 0;
    streak = 0;
    badges = [];
    updateGamificationPanel();
  };

  /*** Display the Current Puzzle ***/
  const displayCurrentPuzzle = () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    puzzleContainer.innerHTML = "";
    document.getElementById("hint").textContent = "";
    document.getElementById("success-message").textContent = "";

    if (currentPuzzleIndex < 0 || currentPuzzleIndex >= puzzles.length) {
      puzzleContainer.innerHTML = "<p>No puzzle available.</p>";
      return;
    }

    const puzzle = puzzles[currentPuzzleIndex];
    const container = document.createElement("div");
    container.className = "sentence-container";

    const header = document.createElement("h3");
    header.textContent = `Question ${currentPuzzleIndex + 1} of ${sessionLength}: Rearrange the words to form a sentence or a question. Begin with a capital letter and end with either a full stop or question mark.`;
    container.appendChild(header);

    const wordBank = document.createElement("div");
    wordBank.className = "word-bank";
    wordBank.setAttribute("aria-label", "Word Bank");
    wordBank.setAttribute("role", "list");

    const dropZone = document.createElement("div");
    dropZone.className = "drop-zone";
    dropZone.setAttribute("aria-label", "Drop Zone");
    dropZone.setAttribute("role", "list");

    container.appendChild(wordBank);
    container.appendChild(dropZone);

    [wordBank, dropZone].forEach(zone => {
      zone.addEventListener("dragover", handleDragOver);
      zone.addEventListener("dragleave", handleDragLeave);
      zone.addEventListener("drop", handleDrop);
    });

    if (!puzzle.submitted) {
      const wordsShuffled = shuffle([...puzzle.correct]);
      wordsShuffled.forEach(word => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.setAttribute("role", "listitem");
        if (window.PointerEvent) {
          wordDiv.addEventListener("pointerdown", handlePointerDown);
          wordDiv.draggable = false;
        } else {
          wordDiv.draggable = true;
          wordDiv.addEventListener("dragstart", handleDragStart);
          wordDiv.addEventListener("dragend", handleDragEnd);
        }
        wordDiv.textContent = word;
        wordBank.appendChild(wordDiv);
      });
    } else {
      // Show user's answer with highlighting in Drop Zone
      puzzle.userAnswer.forEach((word, index) => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.textContent = word;
        wordDiv.classList.add(word === puzzle.correct[index] ? "correct" : "incorrect");
        dropZone.appendChild(wordDiv);
      });
      // Show correct answer in Word Bank for review
      puzzle.correct.forEach(word => {
        const wordDiv = document.createElement("div");
        wordDiv.className = "word";
        wordDiv.textContent = word;
        wordBank.appendChild(wordDiv);
      });
    }

    puzzleContainer.appendChild(container);
    document.getElementById("progress").textContent = `Question ${currentPuzzleIndex + 1} of ${sessionLength}`;
    document.getElementById("score").textContent = `Score: ${score}`;
    document.getElementById("progress-bar").style.width = `${((currentPuzzleIndex + 1) / sessionLength) * 100}%`;
  };

  /*** Drag-and-Drop Handlers ***/

  // HTML5 Drag Events (Fallback)
  let draggedItem = null;
  const handleDragStart = (e) => {
    draggedItem = e.target;
    e.target.style.opacity = "0.5";
    e.dataTransfer.setData("text/plain", e.target.textContent);
  };
  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.currentTarget.classList.contains("drop-zone")) {
      e.currentTarget.classList.add("active");
    }
  };
  const handleDragLeave = (e) => {
    if (e.currentTarget.classList.contains("drop-zone")) {
      e.currentTarget.classList.remove("active");
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.classList.contains("drop-zone") && draggedItem) {
      e.currentTarget.classList.remove("active");
      e.currentTarget.appendChild(draggedItem);
      // Fade in the dropped item using GSAP
      gsap.fromTo(draggedItem, { opacity: 0 }, { duration: 0.3, opacity: 1 });
    }
  };

  // Pointer-based Drag Events (Modern / Touch Devices)
  let pointerDragItem = null;
  let pointerOffsetX = 0, pointerOffsetY = 0;
  const handlePointerDown = (e) => {
    if (e.button && e.button !== 0) return;
    pointerDragItem = e.currentTarget;
    pointerDragItem.setPointerCapture(e.pointerId);
    pointerDragItem.style.opacity = "0.7";
    pointerDragItem.style.zIndex = "1000";
    const rect = pointerDragItem.getBoundingClientRect();
    pointerOffsetX = e.clientX - rect.left;
    pointerOffsetY = e.clientY - rect.top;
  };
  const handlePointerMove = (e) => {
    if (!pointerDragItem) return;
    pointerDragItem.style.position = "absolute";
    pointerDragItem.style.left = `${e.clientX - pointerOffsetX}px`;
    pointerDragItem.style.top = `${e.clientY - pointerOffsetY}px`;
    e.preventDefault();
  };
  const handlePointerUp = (e) => {
    if (!pointerDragItem) return;
    pointerDragItem.releasePointerCapture(e.pointerId);
    pointerDragItem.style.opacity = "1";
    const originalDisplay = pointerDragItem.style.display;
    pointerDragItem.style.display = "none";
    const dropTarget = document.elementFromPoint(e.clientX, e.clientY);
    pointerDragItem.style.display = originalDisplay;
    let validDropZone = dropTarget;
    while (validDropZone && !validDropZone.classList.contains("drop-zone")) {
      validDropZone = validDropZone.parentElement;
    }
    if (validDropZone) {
      validDropZone.appendChild(pointerDragItem);
      gsap.fromTo(pointerDragItem, { opacity: 0 }, { duration: 0.3, opacity: 1 });
    }
    pointerDragItem.style.position = "";
    pointerDragItem.style.left = "";
    pointerDragItem.style.top = "";
    pointerDragItem.style.zIndex = "";
    pointerDragItem = null;
  };
  const handlePointerCancel = (e) => {
    if (pointerDragItem) {
      pointerDragItem.style.opacity = "1";
      pointerDragItem.style.position = "";
      pointerDragItem.style.left = "";
      pointerDragItem.style.top = "";
      pointerDragItem.style.zIndex = "";
      pointerDragItem = null;
    }
  };
  if (window.PointerEvent) {
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("pointercancel", handlePointerCancel);
  }

  /*** Gamification Panel Update ***/
  function updateGamificationPanel() {
    document.getElementById('xp-display').textContent = `XP: ${xp}`;
    document.getElementById('streak-display').textContent = `Streak: ${streak}`;
    document.getElementById('badges-list').textContent = badges.join(', ');
  }

  /*** Confetti Animation ***/
  function displayConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.animationDelay = Math.random() * 2 + 's';
      confetti.style.backgroundColor = getRandomColor();
      confettiContainer.appendChild(confetti);
    }
    setTimeout(() => confettiContainer.remove(), 5000);
  }
  function getRandomColor() {
    const colors = ['#1abc9c', '#3498db', '#9b59b6', '#e74c3c', '#f39c12'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  /*** GSAP Animation for Success Message ***/
  function animateSuccessMessage() {
    const successElem = document.getElementById("success-message");
    gsap.set(successElem, { scale: 0, opacity: 1 });
    gsap.to(successElem, { duration: 0.6, scale: 1, ease: "bounce.out" });
  }

  /*** Hint & Answer Submission ***/
  const showHint = () => {
    const hintElem = document.getElementById("hint");
    const puzzle = puzzles[currentPuzzleIndex];
    if (!puzzle.submitted) {
      hintElem.textContent = `Hint: The sentence begins with "${puzzle.correct[0]}".`;
    } else {
      const correctCount = puzzle.userAnswer.reduce((count, word, idx) =>
        word === puzzle.correct[idx] ? count + 1 : count, 0);
      hintElem.textContent = `Partial Feedback: ${correctCount} out of ${puzzle.correct.length} words are correctly placed.`;
    }
  };

  const submitAnswer = () => {
    const puzzleContainer = document.getElementById("puzzle-container");
    const currentContainer = puzzleContainer.querySelector(".sentence-container");
    if (!currentContainer) return;
    const dropZone = currentContainer.querySelector(".drop-zone");
    const userWords = Array.from(dropZone.children).map(word => word.textContent);
    const puzzle = puzzles[currentPuzzleIndex];
    if (userWords.length !== puzzle.correct.length) {
      alert("Please arrange all words before submitting.");
      return;
    }
    puzzle.submitted = true;
    puzzle.userAnswer = userWords;
    const isCorrect = userWords.join(" ") === puzzle.correct.join(" ");

    Array.from(dropZone.children).forEach((wordElem, index) => {
      wordElem.classList.remove("correct", "incorrect");
      wordElem.classList.add(wordElem.textContent === puzzle.correct[index] ? "correct" : "incorrect");
      void wordElem.offsetWidth;
    });

    if (isCorrect) {
      score++;
      streak++;
      xp += 10;
      if (streak % 3 === 0) {
        xp += 5;
        const badge = `Streak ${streak}`;
        badges.push(badge);
      }
      speak(`Great job! The sentence is: ${puzzle.correct.join(" ")}`);
      document.getElementById("success-message").textContent = "✓ Correct!";
      animateSuccessMessage();
      displayConfetti();
      setTimeout(() => document.getElementById("success-message").textContent = "", 3000);
    } else {
      speak(`That's not quite right. The correct sentence is: ${puzzle.correct.join(" ")}`);
      streak = 0;
      const correctCount = puzzle.userAnswer.reduce((count, word, idx) =>
        word === puzzle.correct[idx] ? count + 1 : count, 0);
      document.getElementById("hint").textContent = `Partial Credit: ${correctCount} out of ${puzzle.correct.length} words are correctly placed.`;
    }
    updateGamificationPanel();
    displayCurrentPuzzle();
  };

  /*** Navigation Functions ***/
  const nextPuzzle = () => {
    if (currentPuzzleIndex < puzzles.length - 1) {
      currentPuzzleIndex++;
      displayCurrentPuzzle();
    } else {
      alert("Session complete! You have finished 5 questions for this level.");
    }
  };

  const prevPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      currentPuzzleIndex--;
      displayCurrentPuzzle();
    } else {
      alert("This is the first question.");
    }
  };

  const resetQuiz = () => {
    generatePuzzles();
    displayCurrentPuzzle();
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error enabling full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  /*** Theme Toggle (Optional) ***/
  document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light-theme");
  });

  /*** Global Event Listeners ***/
  document.getElementById("listen-instructions-btn").addEventListener("click", () => {
    const instructions = document.querySelector("p.instructions").textContent;
    speak(instructions);
  });
  document.getElementById("hint-btn").addEventListener("click", showHint);
  document.getElementById("submit-btn").addEventListener("click", submitAnswer);
  document.getElementById("next-btn").addEventListener("click", nextPuzzle);
  document.getElementById("prev-btn").addEventListener("click", prevPuzzle);
  document.getElementById("reset-btn").addEventListener("click", resetQuiz);
  document.getElementById("level-select").addEventListener("change", (e) => {
    currentLevel = e.target.value;
    resetQuiz();
  });
  document.getElementById("fullscreen-btn").addEventListener("click", toggleFullScreen);

  document.addEventListener("DOMContentLoaded", () => {
    generatePuzzles();
    displayCurrentPuzzle();
  });
})();
