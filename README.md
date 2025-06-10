diff --git a//dev/null b/README.md
index 0000000000000000000000000000000000000000..846d82231045efa5eb80056929dac1ecd7f9c457 100644
--- a//dev/null
+++ b/README.md
@@ -0,0 +1,30 @@
+# Word Order Adventure
+
+Word Order Adventure is a browser-based game that helps players practice sentence construction.
+Arrange the shuffled words into the correct order, check your answer and level up as you master new puzzles.
+
+## Opening `index.html`
+
+1. Clone or download this repository.
+2. Open `index.html` directly in your browser or serve the folder with a local web server:
+   ```bash
+   npx serve .
+   ```
+   Then navigate to `http://localhost:3000`.
+
+## Offline Usage (PWA)
+
+This project is a Progressive Web App. When you load the game, the service worker caches the assets so it can run without a network connection. Add the game to your home screen for a native-like offline experience.
+
+## Contributing
+
+Pull requests are welcome! Fork the repo and create a feature branch. Keep commits focused and follow the existing code style.
+
+## Testing (Coming Soon)
+
+Future updates will include automated tests. Once added, run them with:
+
+```bash
+npm test
+```
+
