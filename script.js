(() => {
  const display = document.getElementById('display');
  const startStopBtn = document.getElementById('startStopBtn');
  const lapBtn = document.getElementById('lapBtn');
  const resetBtn = document.getElementById('resetBtn');
  const lapsList = document.getElementById('laps');

  const heartRateEl = document.getElementById('heartRateValue');
  const spo2El = document.getElementById('spo2Value');

  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval = null;
  let running = false;
  let lapCount = 0;

  // Format milliseconds to mm:ss.mmm
  function formatTime(time) {
    const ms = time % 1000;
    const totalSeconds = Math.floor(time / 1000);
    const secs = totalSeconds % 60;
    const mins = Math.floor(totalSeconds / 60);

    return (
      String(mins).padStart(2, '0') +
      ':' +
      String(secs).padStart(2, '0') +
      '.' +
      String(ms).padStart(3, '0')
    );
  }

  function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    display.textContent = formatTime(elapsedTime);
  }

  function start() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
      updateDisplay();
    }, 31); 
    running = true;
    startStopBtn.setAttribute('aria-pressed', 'true');
    updateStartStopIcon(true);
    lapBtn.disabled = false;
    resetBtn.disabled = false;
  }

  function pause() {
    clearInterval(timerInterval);
    timerInterval = null;
    running = false;
    startStopBtn.setAttribute('aria-pressed', 'false');
    updateStartStopIcon(false);
  }

  function reset() {
    pause();
    elapsedTime = 0;
    display.textContent = '00:00.000';
    lapsList.innerHTML = '';
    lapBtn.disabled = true;
    resetBtn.disabled = true;
    lapCount = 0;
  }

  function recordLap() {
    lapCount++;
    const lapTime = formatTime(elapsedTime);
    const li = document.createElement('li');
    li.innerHTML = `<span class="lap-label">Lap ${lapCount}</span><span>${lapTime}</span>`;
    lapsList.prepend(li);
  }

  
  function updateStartStopIcon(isRunning) {
    if (!startStopBtn) return;
    startStopBtn.innerHTML = isRunning
      ? `<svg viewBox="0 0 24 24" fill="none" >
          <rect x="6" y="4" width="4" height="16" rx="1" />
          <rect x="14" y="4" width="4" height="16" rx="1" />
        </svg>`
      : `<svg viewBox="0 0 24 24" fill="none" >
          <polygon points="5 3 19 12 5 21" />
        </svg>`;
  }

  startStopBtn.addEventListener('click', () => {
    if (running) pause();
    else start();
  });

  lapBtn.addEventListener('click', () => {
    if (running) recordLap();
  });

  resetBtn.addEventListener('click', reset);

  
  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function updateHeartRate() {
    const hr = randomInt(60, 100);
    heartRateEl.textContent = hr;
  }

  function updateSpo2() {
    const spo2 = randomInt(95, 100);
    spo2El.textContent = spo2;
  }

  function startHealthUpdates() {
    updateHeartRate();
    updateSpo2();
    setInterval(() => {
      updateHeartRate();
      updateSpo2();
    }, 4000);
  }

  // Initialize
  resetBtn.disabled = true;
  lapBtn.disabled = true;
  updateStartStopIcon(false);

  startHealthUpdates();
})();
