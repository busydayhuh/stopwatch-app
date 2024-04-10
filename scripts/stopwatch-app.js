const timer = JSON.parse(localStorage.getItem("timer")) || {
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const lapsList = JSON.parse(localStorage.getItem("laps")) || [];

updateTimerDisplay();
renderLapsList();

function updateTimerDisplay() {
  const timerDisplay = document.getElementById("timer-display");
  let stringSeconds, stringMinutes, stringHours;

  if (timer.seconds < 10) {
    stringSeconds = `0${timer.seconds}`;
  } else {
    stringSeconds = `${timer.seconds}`;
  }

  if (timer.minutes < 10) {
    stringMinutes = `0${timer.minutes}`;
  } else {
    stringMinutes = `${timer.minutes}`;
  }

  if (timer.hours < 10) {
    stringHours = `0${timer.hours}`;
  } else {
    stringHours = `${timer.hours}`;
  }

  timerDisplay.innerHTML = `${stringHours} : ${stringMinutes} : ${stringSeconds}`;

  return timerDisplay.innerHTML;
}

function renderLapsList() {
  let lapNumber = 1;
  let lapHtml = "";

  lapsList.forEach((lap) => {
    const html = `
        <div class="log-item" id="log-item">
            <div id="log-number">${lapNumber}</div>
            <div class="log-body" id="log-body">${lap}</div>
            <button class="delete-button" id="delete-button">X</button>
        </div>
        `;
    lapHtml += html;
    lapNumber++;
  });

  document.getElementById("log-area").innerHTML = lapHtml;

  document.querySelectorAll("#delete-button").forEach((deleteButton, index) => {
    deleteButton.addEventListener("click", () => {
      lapsList.splice(index, 1);
      saveLapsToStorage();
      renderLapsList();
    });
  });

  if (lapsList.length === 0) {
    document.getElementById(
      "log-area"
    ).innerHTML = `<p class="info">no saved laps</p>`;
    document.getElementById("clear-data").classList.add("hidden");
  }
}

const buttonActivate = document.getElementById("activate-button");
buttonActivate.addEventListener("click", activateTimer);

let isTimerOn = false;
let intervalId;

function activateTimer() {
  if (!isTimerOn) {
    intervalId = setInterval(() => {
      ++timer.seconds;

      if (timer.seconds > 0 && timer.seconds % 60 === 0) {
        timer.seconds = 0;
        ++timer.minutes;
      }

      if (timer.minutes > 0 && timer.minutes % 60 === 0) {
        timer.minutes = 0;
        ++timer.hours;
      }

      updateTimerDisplay();
      saveTimerToStorage();
    }, 1000);

    isTimerOn = true;
    buttonActivate.innerText = "pause";
    document.body.style.backgroundColor = "#4a6741";
  } else {
    clearInterval(intervalId);
    isTimerOn = false;
    buttonActivate.innerText = "start";
    document.body.style.backgroundColor = "rgb(30, 29, 29)";
  }
}

const buttonSave = document.getElementById("save-button");
buttonSave.addEventListener("click", lapTimer);

function lapTimer() {
  let currentTimeDisplayed = updateTimerDisplay();
  lapsList.push(currentTimeDisplayed);
  renderLapsList();
  saveLapsToStorage();
  document.getElementById("clear-data").classList.remove("hidden");
}

const buttonReset = document.getElementById("reset-button");
buttonReset.addEventListener("click", resetTimer);

function resetTimer() {
  timer.hours = 0;
  timer.minutes = 0;
  timer.seconds = 0;

  updateTimerDisplay();
  saveTimerToStorage();
}

document.getElementById("clear-data").addEventListener("click", () => {
  lapsList.length = 0;
  document.getElementById(
    "log-area"
  ).innerHTML = `<p class="info">no saved laps</p>`;
  document.getElementById("clear-data").classList.add("hidden");
  saveLapsToStorage();
  renderLapsList();
});

function saveTimerToStorage() {
  localStorage.setItem("timer", JSON.stringify(timer));
}

function saveLapsToStorage() {
  localStorage.setItem("laps", JSON.stringify(lapsList));
}
