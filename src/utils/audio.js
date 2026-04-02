let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, type, duration, gain = 0.25, startOffset = 0) {
  const ac = getCtx();
  const t = ac.currentTime + startOffset;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.connect(g);
  g.connect(ac.destination);
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + duration);
  osc.start(t);
  osc.stop(t + duration);
}

// Ascending chime arpeggio: C5 E5 G5 C6
export function playCorrect() {
  [523, 659, 784, 1047].forEach((freq, i) =>
    tone(freq, "sine", 0.18, 0.28, i * 0.1),
  );
}

// Descending buzzer sweep
export function playWrong() {
  const ac = getCtx();
  const t = ac.currentTime;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.connect(g);
  g.connect(ac.destination);
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(320, t);
  osc.frequency.exponentialRampToValueAtTime(80, t + 0.6);
  g.gain.setValueAtTime(0.28, t);
  g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
  osc.start(t);
  osc.stop(t + 0.6);
}

// Short tick — higher pitch when urgent
export function playTick(urgent = false) {
  tone(urgent ? 900 : 480, "square", 0.04, 0.08);
}
