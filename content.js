async function getEnabled() {
  return new Promise(resolve => {
    chrome.storage.local.get('enabled', data => {
      resolve(data.enabled !== false);
    });
  });
}

async function getAutoReloaded() {
  return new Promise(resolve => {
    chrome.storage.local.get('autoReloaded', data => {
      resolve(data.autoReloaded == true);
    });
  });
}

function isAdPlaying() {
  const player = document.querySelector('#movie_player');
  if (!player) return false;
  return player.classList.contains('ad-showing');
}

function saveProgress() {
  const video = document.querySelector('video')
  if (!video || video.paused || video.readyState < 2) return;
  const time = video.currentTime;
  chrome.storage.local.set({ lastProgress: time});
}

function restoreProgress(video) {
  chrome.storage.local.get('lastProgress', data => {
    const progress = data.lastProgress;
    video.currentTime = progress;
    video.play().catch(e => console.log('Play failed:', e));
  })
}

function reload() {
  chrome.storage.local.set({ autoReloaded: true });
  location.reload();
}

function reloadLoop(loop) {
  if (isAdPlaying()) reload();
  const video = document.querySelector('video');
  if(!video || video.readyState < 2) return;
  restoreProgress(video);
  clearInterval(loop[0]);
  adLoop(loop)
}

function adLoop(loop) {
  function run() {
    if (isAdPlaying()) reload();
    else saveProgress();
  }

  let lastUrl = location.href;

  loop[0] = setInterval( () => {
    if (lastUrl != location.href) chrome.storage.local.set({ lastProgress: 0 });
    lastUrl = location.href;
    run()
  }, 1000);

}
  
async function main() {
  let loop = [];
  if (await getEnabled()) {
    if (await getAutoReloaded()) {
      chrome.storage.local.set({ autoReloaded: false });
      loop.push(setInterval(() => reloadLoop(loop), 2000));
    }
    else {
      chrome.storage.local.set({ lastProgress: 0 })
      adLoop(loop)
    }
  };
  window.addEventListener('beforeunload', () => {
    if (loop) clearInterval(loop[0]);
  });
}

main()