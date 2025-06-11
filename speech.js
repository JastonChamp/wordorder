export function speak(text) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported on this device.');
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  const loadVoices = () => {
    const voices = window.speechSynthesis.getVoices();
    let preferredVoice =
      voices.find((v) => v.lang === 'en-GB' && v.name.includes('Female')) ||
      voices.find(
        (v) =>
          v.lang === 'en-US' &&
          (v.name.includes('Samantha') || v.name.includes('Victoria'))
      ) ||
      voices.find((v) => v.lang === 'en-AU' && v.name.includes('Karen')) ||
      voices.find((v) => v.lang.includes('en'));
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
