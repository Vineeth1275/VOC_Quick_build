// --- Interactive Recipe Card JS ---

document.addEventListener('DOMContentLoaded', function () {
  // Step highlighting
  const steps = document.querySelectorAll('.instructions-steps .steps');
  const startBtn = document.getElementById('startCooking');
  const nextBtn = document.getElementById('nextStep');
  const resetBtn = document.getElementById('resetCooking');
  const printBtn = document.querySelector('.print-btn button');
  const instructionsBox = document.querySelector('.box.instructions');
  const container = document.querySelector('.container');

  // Progress bar
  let progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressBar.innerHTML = '<div class="progress"></div>';
  // Place progress bar below the buttons in controls
  const controlsBox = document.querySelector('.controls');
  if (controlsBox) {
    const lastBtn = controlsBox.querySelector('.btn-3') || controlsBox.lastElementChild;
    lastBtn.insertAdjacentElement('afterend', progressBar);
  }

  // Timer
  let timerDiv = document.createElement('div');
  timerDiv.className = 'timer';
  timerDiv.style.textAlign = 'center';
  timerDiv.style.fontWeight = 'bold';
  timerDiv.style.margin = '10px 0';
  document.querySelector('.controls').appendChild(timerDiv);

  let currentStep = -1;
  let timer = null;
  let timeElapsed = 0;
  const totalSteps = steps.length;
  const prepTime = 60 * 60; // 60 minutes in seconds

  function highlightStep(idx) {
    steps.forEach((step, i) => {
      step.classList.remove('active-step');
      if (i === idx) {
        step.classList.add('active-step');
        step.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    updateProgressBar(idx);
  }

  function updateProgressBar(idx) {
    const percent = ((idx + 1) / totalSteps) * 100;
    progressBar.querySelector('.progress').style.width = percent + '%';
  }

  function resetProgressBar() {
    progressBar.querySelector('.progress').style.width = '0%';
  }

  function startTimer() {
    timeElapsed = 0;
    timerDiv.textContent = 'Timer: 00:00:00';
    timer = setInterval(() => {
      timeElapsed++;
      timerDiv.textContent = 'Timer: ' + formatTime(timeElapsed);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    timer = null;
  }

  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  startBtn.addEventListener('click', function () {
    if (currentStep === -1) {
      currentStep = 0;
      highlightStep(currentStep); // Always scroll
      startTimer();
      nextBtn.disabled = false;
      resetBtn.disabled = false;
      // Open instructions details
      const instructionsDetails = document.querySelector('.instructions details');
      if (instructionsDetails) instructionsDetails.open = true;
      // Move entire card up
      if (container) container.classList.add('move-up');
    }
  });

  nextBtn.addEventListener('click', function () {
    if (currentStep < totalSteps - 1) {
      currentStep++;
      highlightStep(currentStep);
      if (currentStep === totalSteps - 1) {
        nextBtn.disabled = true;
        stopTimer();
      }
    } else if (currentStep === totalSteps - 1) {
      // Show congratulatory message
      alert('🎉 Congratulations! You have completed the recipe. Enjoy your meal!');
    }
  });

  resetBtn.addEventListener('click', function () {
    steps.forEach(step => step.classList.remove('active-step'));
    currentStep = -1;
    resetProgressBar();
    stopTimer();
    timerDiv.textContent = '';
    nextBtn.disabled = false;
    resetBtn.disabled = true;
    // Remove move-up class
    if (container) container.classList.remove('move-up');
  });

  // Initial state
  nextBtn.disabled = true;
  resetBtn.disabled = true;

  // Print functionality
  printBtn.addEventListener('click', function () {
    window.print();
  });

  // CSS for progress bar and active step
  const style = document.createElement('style');
  style.textContent = `
    .progress-bar {
      width: 100%;
      height: 10px;
      background: #eee;
      border-radius: 5px;
      margin-bottom: 20px;
      overflow: hidden;
    }
    .progress-bar .progress {
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, #28a745, #764ba2);
      transition: width 0.4s cubic-bezier(.4,2,.6,1);
    }
    .active-step {
      background: #e0ffe6 !important;
      border: 2px solid #28a745;
      box-shadow: 0 0 10px #28a74533;
      transition: background 0.3s, border 0.3s;
    }
    @media print {
      body, .container, .receipe-card {
        background: white !important;
        color: black !important;
        box-shadow: none !important;
      }
      .controls, .print-btn, .progress-bar, .timer {
        display: none !important;
      }
    }
  `;
  document.head.appendChild(style);
});
