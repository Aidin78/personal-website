let audioContext: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;

  if (!audioContext) audioContext = new AudioContextClass();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
}

type BeepOptions = {
  frequency: number;
  duration: number;
  type?: OscillatorType;
  volume?: number;
  delay?: number;
};

function beep({ frequency, duration, type = "square", volume = 0.15, delay = 0 }: BeepOptions) {
  const ctx = getContext();
  if (!ctx) return;

  const startTime = ctx.currentTime + delay;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(startTime);
  oscillator.stop(startTime + duration + 0.02);
}

const ORB_FREQUENCIES = {
  green: 660,
  cyan: 880,
  pink: 1046,
} as const;

export function playOrbCollect(tone: keyof typeof ORB_FREQUENCIES) {
  const base = ORB_FREQUENCIES[tone];
  beep({ frequency: base, duration: 0.12, volume: 0.14 });
  beep({ frequency: base * 1.5, duration: 0.08, volume: 0.08, delay: 0.05 });
}

export function playLevelUp() {
  [523, 659, 784, 1046].forEach((frequency, i) =>
    beep({ frequency, duration: 0.12, volume: 0.16, delay: i * 0.09 }),
  );
}

export function playBurn() {
  beep({ frequency: 220, duration: 0.25, type: "sawtooth", volume: 0.18 });
  beep({ frequency: 110, duration: 0.3, type: "sawtooth", volume: 0.14, delay: 0.08 });
}

let musicTimer: number | null = null;
let musicStep = 0;

const MUSIC_STEP_MS = 180;
// 0 = rest. A short minor-pentatonic loop, low in the mix so it sits under sfx.
const MUSIC_PATTERN = [220, 0, 262, 220, 330, 0, 262, 196];

/** Starts the looping background arpeggio; no-op if already running. */
export function startBackgroundMusic() {
  if (musicTimer !== null) return;
  if (!getContext()) return;

  const playStep = () => {
    const frequency = MUSIC_PATTERN[musicStep % MUSIC_PATTERN.length];
    musicStep += 1;
    if (frequency) {
      beep({ frequency, duration: (MUSIC_STEP_MS / 1000) * 0.85, type: "triangle", volume: 0.05 });
    }
    musicTimer = window.setTimeout(playStep, MUSIC_STEP_MS);
  };

  playStep();
}

export function stopBackgroundMusic() {
  if (musicTimer !== null) {
    window.clearTimeout(musicTimer);
    musicTimer = null;
  }
  musicStep = 0;
}

export function playGameStart() {
  const ctx = getContext();
  if (!ctx) return;

  [392, 523, 659].forEach((frequency, i) =>
    beep({ frequency, duration: 0.1, type: "square", volume: 0.14, delay: i * 0.07 }),
  );

  const startTime = ctx.currentTime + 0.24;
  const duration = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(0.1, startTime + 0.08);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
  gain.connect(ctx.destination);

  [659, 663].forEach((frequency) => {
    const oscillator = ctx.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(frequency, startTime);
    oscillator.connect(gain);
    oscillator.start(startTime);
    oscillator.stop(startTime + duration + 0.05);
  });
}
