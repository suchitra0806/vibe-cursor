const DEFAULT_STATE = { enabled: true, mood: "calm" };

const enabledCheckbox = document.getElementById("enabled");
const moodButtons = document.querySelectorAll(".mood-btn");

function renderMoodButtons(activeMood) {
  moodButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mood === activeMood);
  });
}

chrome.storage.local.get(DEFAULT_STATE, (state) => {
  enabledCheckbox.checked = state.enabled;
  renderMoodButtons(state.mood);
});

enabledCheckbox.addEventListener("change", () => {
  chrome.storage.local.set({ enabled: enabledCheckbox.checked });
});

moodButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const mood = btn.dataset.mood;
    renderMoodButtons(mood);
    chrome.storage.local.set({ mood });
  });
});
