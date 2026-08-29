// background.js: sets default settings on install

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    enabled: false,
    letterCount: 2,
    boldWeight: 800,
    darkMode: false,
  });
});
