export function speak(text) {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);

  const handleVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    utterance.voice =
      voices.find((v) => v.lang === 'en-GB' && v.name.includes('Female')) ||
      voices.find((v) => v.lang === 'en-US' && /Samantha|Victoria/.test(v.name)) ||
      voices.find((v) => v.lang.includes('en'));
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const voices = window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', handleVoices, {
    once: true,
  });

  if (voices.length) {
    handleVoices();
  }
}
