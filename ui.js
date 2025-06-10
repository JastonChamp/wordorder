diff --git a//dev/null b/ui.js
index 0000000000000000000000000000000000000000..0c5e9e1aa8299072cff1e73099d4bc9f3efcded3 100644
--- a//dev/null
+++ b/ui.js
@@ -0,0 +1,20 @@
+export const elements = {
+  puzzleContainer: document.getElementById('puzzle-container'),
+  hint: document.getElementById('hint'),
+  successMessage: document.getElementById('success-message'),
+  progress: document.getElementById('progress'),
+  score: document.getElementById('score'),
+  progressBar: document.getElementById('progress-bar'),
+  progressLabel: document.getElementById('progress-label'),
+  progressIndicator: document.getElementById('progress-indicator'),
+  xpDisplay: document.getElementById('xp-display'),
+  streakDisplay: document.getElementById('streak-display'),
+  badgesList: document.getElementById('badges-list'),
+  submitBtn: document.getElementById('submit-btn'),
+  tryAgainBtn: document.getElementById('try-again-btn'),
+  prevBtn: document.getElementById('prev-btn'),
+  nextBtn: document.getElementById('next-btn'),
+  hintBtn: document.getElementById('hint-btn'),
+  clearBtn: document.getElementById('clear-btn'),
+  learnBtn: document.getElementById('learn-btn'),
+};
