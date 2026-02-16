const toggle = document.getElementById('toggle');
const status = document.getElementById('status');
const body = document.body;

function updateUI(enabled) {
  if (enabled) {
    body.classList.add('on');
    body.classList.remove('off');
    status.textContent = 'ON much block';
  } else {
    body.classList.add('off');
    body.classList.remove('on');
    status.textContent = 'OFF such ads';
  }
}

chrome.storage.local.get('enabled', data => {
  const isEnabled = data.enabled !== false;
  updateUI(isEnabled);
});

toggle.addEventListener('click', () => {
  chrome.storage.local.get('enabled', data => {
    const newState = data.enabled !== false ? false : true;
    chrome.storage.local.set({ enabled: newState });
    updateUI(newState);
  });
});