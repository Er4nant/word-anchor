// popup.js: extension popup UI logic

let settings = {
  enabled: false,
  letterCount: 2,
  boldWeight: 800,
  darkMode: false,
};

const weightLabels = { 600: "Light", 700: "Medium", 800: "Bold", 900: "Heavy" };

// Mirrors content.js WEIGHT_STYLES so the popup preview matches what
// actually renders on real pages (most fonts only have 400/700 files,
// so extra thickness beyond 700 is faked with a text-shadow stroke).
const WEIGHT_STYLES = {
  600: { fontWeight: 700, textShadow: "none" },
  700: { fontWeight: 700, textShadow: "0 0 0.3px currentColor" },
  800: { fontWeight: 700, textShadow: "0 0 0.3px currentColor, 0 0 0.3px currentColor" },
  900: { fontWeight: 700, textShadow: "0 0 0.5px currentColor, 0 0 0.5px currentColor, 0 0 0.5px currentColor" },
};

const masterToggle = document.getElementById("masterToggle");
const darkBtn = document.getElementById("darkBtn");
const previewText = document.getElementById("previewText");
const letterVal = document.getElementById("letterVal");
const weightLabel = document.getElementById("weightLabel");

chrome.storage.sync.get(["enabled", "letterCount", "boldWeight", "darkMode"], (stored) => {
  settings.enabled = stored.enabled ?? false;
  settings.letterCount = stored.letterCount ?? 2;
  settings.boldWeight = stored.boldWeight ?? 800;
  settings.darkMode = stored.darkMode ?? false;
  renderUI();
});

function renderUI() {
  document.body.classList.toggle("dark", settings.darkMode);
  darkBtn.textContent = settings.darkMode ? "☀️ Light" : "🌙 Dark";

  masterToggle.classList.toggle("on", settings.enabled);

  document.querySelectorAll("#letterBtns .seg-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.val) === settings.letterCount);
  });
  letterVal.textContent = settings.letterCount;

  document.querySelectorAll("#weightBtns .seg-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.val) === settings.boldWeight);
  });
  weightLabel.textContent = weightLabels[settings.boldWeight];

  renderPreview();
}

function renderPreview() {
  const sample = "Your settings applied to real text like this sentence.";
  if (!settings.enabled) {
    previewText.textContent = sample;
    return;
  }
  previewText.innerHTML = "";
  const words = sample.split(" ");
  words.forEach((word, i) => {
    const count = Math.min(settings.letterCount, word.length);
    const bold = word.slice(0, count);
    const rest = word.slice(count);

    const boldSpan = document.createElement("span");
    const style = WEIGHT_STYLES[settings.boldWeight] || WEIGHT_STYLES[800];
    boldSpan.style.fontWeight = style.fontWeight;
    boldSpan.style.textShadow = style.textShadow;
    boldSpan.textContent = bold;

    const restSpan = document.createElement("span");
    restSpan.style.fontWeight = "400";
    restSpan.textContent = rest;

    previewText.appendChild(boldSpan);
    previewText.appendChild(restSpan);
    if (i < words.length - 1) previewText.appendChild(document.createTextNode(" "));
  });
}

function applySettings() {
  chrome.storage.sync.set(settings);
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, { type: "UPDATE_SETTINGS", settings });
    }
  });
  renderUI();
}

masterToggle.addEventListener("click", () => {
  settings.enabled = !settings.enabled;
  applySettings();
});

darkBtn.addEventListener("click", () => {
  settings.darkMode = !settings.darkMode;
  chrome.storage.sync.set({ darkMode: settings.darkMode });
  renderUI();
});

document.getElementById("letterBtns").addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  settings.letterCount = Number(btn.dataset.val);
  applySettings();
});

document.getElementById("weightBtns").addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  settings.boldWeight = Number(btn.dataset.val);
  applySettings();
});
