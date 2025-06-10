diff --git a/script.js b/game.js
index b10c95e13e60544b838921c4bf45b44e43aeb05f..9a93167af6c238ac8f1db346cdf39440dcb745ef 100644
--- a/script.js
+++ b/game.js
@@ -1,83 +1,28 @@
-"use strict";
-
-(() => {
-  // **DOM Elements for the Game**
-  const elements = {
-    puzzleContainer: document.getElementById("puzzle-container"),
-    hint: document.getElementById("hint"),
-    successMessage: document.getElementById("success-message"),
-    progress: document.getElementById("progress"),
-    score: document.getElementById("score"),
-    progressBar: document.getElementById("progress-bar"),
-    progressLabel: document.getElementById("progress-label"),
-    progressIndicator: document.getElementById("progress-indicator"),
-    xpDisplay: document.getElementById("xp-display"),
-    streakDisplay: document.getElementById("streak-display"),
-    badgesList: document.getElementById("badges-list"),
-    submitBtn: document.getElementById("submit-btn"),
-    tryAgainBtn: document.getElementById("try-again-btn"),
-    prevBtn: document.getElementById("prev-btn"),
-    nextBtn: document.getElementById("next-btn"),
-    hintBtn: document.getElementById("hint-btn"),
-    clearBtn: document.getElementById("clear-btn"),
-    learnBtn: document.getElementById("learn-btn"),
-  };
-
-  // **Speech Synthesis with UK Female Voice (Fallback to US/AU Female Voice)**
-  function speak(text) {
-    if (!("speechSynthesis" in window)) {
-      console.warn("Speech synthesis not supported on this device.");
-      return;
-    }
-    const utterance = new SpeechSynthesisUtterance(text);
-    const loadVoices = () => {
-      const voices = window.speechSynthesis.getVoices();
-      let preferredVoice =
-        voices.find((v) => v.lang === "en-GB" && v.name.includes("Female")) ||
-        voices.find(
-          (v) =>
-            v.lang === "en-US" &&
-            (v.name.includes("Samantha") || v.name.includes("Victoria"))
-        ) ||
-        voices.find((v) => v.lang === "en-AU" && v.name.includes("Karen")) ||
-        voices.find((v) => v.lang.includes("en"));
-      utterance.voice = preferredVoice || voices[0];
-      utterance.rate = 0.9;
-      utterance.pitch = 1.1;
-      utterance.volume = 1.0;
-      window.speechSynthesis.speak(utterance);
-    };
-    if (window.speechSynthesis.getVoices().length === 0) {
-      window.speechSynthesis.onvoiceschanged = () => {
-        loadVoices();
-        window.speechSynthesis.onvoiceschanged = null;
-      };
-    } else {
-      loadVoices();
-    }
-  }
+"use strict";
+import { elements } from "./ui.js";
+import { speak } from "./speech.js";
 
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
diff --git a/script.js b/game.js
index b10c95e13e60544b838921c4bf45b44e43aeb05f..9a93167af6c238ac8f1db346cdf39440dcb745ef 100644
--- a/script.js
+++ b/game.js
@@ -846,26 +791,25 @@
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
-})();
