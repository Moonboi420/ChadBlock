// Service worker – can stay minimal
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});