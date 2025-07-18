# Word Order Adventure

Word Order Adventure is a browser-based game for practicing English sentence construction.
Drag the shuffled words to form a correct sentence, check your answer and progress through six difficulty levels.
Words are colour-coded by word class (nouns, verbs, adjectives and adverbs) to aid learning.

## Opening `index.html`

1. Clone or download this repository.
2. **Run a local web server** (required for the sentence data to load):
   ```bash
   npx serve .
   ```
   Then visit `http://localhost:3000`.
   Opening `index.html` directly from the file system will prevent the
   game from fetching its JSON data.

## Offline Usage

The game is a Progressive Web App. The service worker caches assets so you can play offline once the page has loaded. Add it to your home screen for quick access.

## Contributing

Pull requests are welcome. Please keep commits focused and follow the existing code style.

## Sentence Data

The game reads its sentences from the JSON files in the `data/` directory.
Each file (`p1.json` to `p6.json`) represents a difficulty level and contains
around 24 sentences. When creating or editing level files:

- Keep sentences concise so they are easy to rearrange.
- Use clear vocabulary and correct punctuation.
- Aim for a mix of statements, questions, and the occasional exclamation.
- Try to provide roughly 24 sentences per level.

## Testing

Testing scripts will be added in future updates.
