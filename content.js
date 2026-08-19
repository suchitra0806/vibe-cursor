const MOODS = ["calm", "hype", "cozy", "chaotic"];

const COMPLIMENTS = {
  calm: ["breathe easy 🌿", "you're doing great", "nice and steady", "take your time ✨"],
  hype: ["let's go!! 🔥", "you're unstoppable", "crushing it 💪", "big energy today"],
  cozy: ["so cozy right now ☕", "you're a comfort person", "soft & warm vibes", "blanket-level nice"],
  chaotic: ["certified chaos gremlin 🤪", "unhinged in the best way", "who let you cook 🔥", "10/10 vibes, 0/10 sleep schedule"],
};

const DEFAULT_STATE = { enabled: true, mood: "calm" };
let lastComplimentAt = 0;
const COMPLIMENT_COOLDOWN_MS = 650;

function applyMood(state) {
  const root = document.documentElement;
  root.classList.toggle("vibe-cursor-active", state.enabled);
  MOODS.forEach((m) => root.classList.remove(`vibe-mood-${m}`));
  if (state.enabled) {
    root.classList.add(`vibe-mood-${state.mood}`);
  }
}

function spawnCompliment(x, y, mood) {
  const now = Date.now();
  if (now - lastComplimentAt < COMPLIMENT_COOLDOWN_MS) return;
  lastComplimentAt = now;

  const pool = COMPLIMENTS[mood] || COMPLIMENTS.calm;
  const text = pool[Math.floor(Math.random() * pool.length)];

  const el = document.createElement("div");
  el.className = "vibe-cursor-compliment";
  el.textContent = text;
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  document.body.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

let currentState = DEFAULT_STATE;

function handleMouseMove(e) {
  if (!currentState.enabled) return;
  spawnCompliment(e.clientX, e.clientY, currentState.mood);
}

function init() {
  chrome.storage.local.get(DEFAULT_STATE, (state) => {
    currentState = state;
    applyMood(currentState);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.enabled) currentState.enabled = changes.enabled.newValue;
    if (changes.mood) currentState.mood = changes.mood.newValue;
    applyMood(currentState);
  });

  document.addEventListener("mousemove", handleMouseMove, { passive: true });
}

init();
