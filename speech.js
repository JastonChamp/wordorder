export function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const u = new SpeechSynthesisUtterance(text);

  const loadVoices = () => {
    const v = window.speechSynthesis.getVoices();
    u.voice =
      v.find((x) => x.lang === 'en-GB' && x.name.includes('Female')) ||
      v.find((x) => x.lang === 'en-US' && /Samantha|Victoria/.test(x.name)) ||
      v.find((x) => x.lang.includes('en'));
    u.rate = 0.9;
    u.pitch = 1.1;
    u.volume = 1.0;
    window.speechSynthesis.speak(u);
  };

  // Register the event listener before checking available voices
  window.speechSynthesis.addEventListener('voiceschanged', loadVoices, {
    once: true,
  });

  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    loadVoices();
  }
}
