// Web Audio API sound effects - no external files needed
let audioCtx = null;
let soundEnabled = true;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

export function setSoundEnabled(enabled) {
  soundEnabled = enabled;
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone(freq, duration, type = 'sine', volume = 0.15) {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch { /* ignore audio errors */ }
}

export function playTap() {
  playTone(600, 0.08, 'sine', 0.1);
}

export function playPlace() {
  playTone(800, 0.1, 'sine', 0.1);
  setTimeout(() => playTone(1000, 0.08, 'sine', 0.08), 50);
}

export function playCorrect() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [523, 659, 784, 1047].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.12, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.3);
    });
  } catch { /* ignore */ }
}

export function playWrong() {
  playTone(200, 0.3, 'sawtooth', 0.08);
  setTimeout(() => playTone(150, 0.3, 'sawtooth', 0.06), 150);
}

export function playComplete() {
  if (!soundEnabled) return;
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;
    [523, 659, 784, 880, 1047, 1319].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0.1, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.4);
    });
  } catch { /* ignore */ }
}

export function playHint() {
  playTone(440, 0.15, 'triangle', 0.1);
  setTimeout(() => playTone(550, 0.15, 'triangle', 0.08), 100);
}

// Resume audio context on first user interaction (required by browsers)
export function resumeAudio() {
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}
