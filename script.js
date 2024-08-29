const bells = new Audio("./sounds/bell.wav");
const startBtn = document.querySelector(".btn-start");
const session = document.querySelector(".minutes");
let myInterval;
let state = true;

// current year
const currentYearElement = document.getElementById("current-year");
currentYearElement.textContent = `${new Date().getFullYear()}`;

// timer function
const appTimer = () => {
  const sessionAmount = Number.parseInt(session.textContent);

  if (state) {
    state = false;
    startBtn.disabled = true; // Disable the start button
    let totalSeconds = sessionAmount * 60;

    // Save the start time and session duration in localStorage
    const startTime = Date.now();
    localStorage.setItem("pomodoroStartTime", startTime);
    localStorage.setItem("pomodoroDuration", totalSeconds);

    // Update the timer every second
    const updateSeconds = () => {
      const minuteDiv = document.querySelector(".minutes");
      const secondDiv = document.querySelector(".seconds");

      const now = Date.now();
      const elapsedTime = Math.floor((now - startTime) / 1000);
      totalSeconds = sessionAmount * 60 - elapsedTime;

      if (totalSeconds <= 0) {
        bells.play();
        clearInterval(myInterval);
        localStorage.removeItem("pomodoroStartTime");
        localStorage.removeItem("pomodoroDuration");
        startBtn.disabled = false; // Re-enable the start button for a new session
        return;
      }

      let minutesLeft = Math.floor(totalSeconds / 60);
      let secondsLeft = totalSeconds % 60;

      secondDiv.textContent =
        secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
      minuteDiv.textContent = `${minutesLeft}`;
    };

    myInterval = setInterval(updateSeconds, 1000);
  }
};

// Restore timer state on page load
// using localStorage
window.addEventListener("load", () => {
  const storedStartTime = localStorage.getItem("pomodoroStartTime");
  const storedDuration = localStorage.getItem("pomodoroDuration");

  if (storedStartTime && storedDuration) {
    const elapsedTime = Math.floor((Date.now() - storedStartTime) / 1000);
    let remainingTime = storedDuration - elapsedTime;

    if (remainingTime > 0) {
      state = false; // Disable start button since the session is running
      startBtn.disabled = true; // Disable the start button

      const minuteDiv = document.querySelector(".minutes");
      const secondDiv = document.querySelector(".seconds");

      myInterval = setInterval(() => {
        if (remainingTime <= 0) {
          bells.play();
          clearInterval(myInterval);
          localStorage.removeItem("pomodoroStartTime");
          localStorage.removeItem("pomodoroDuration");
          startBtn.disabled = false; // Re-enable the start button for a new session
          return;
        }

        let minutesLeft = Math.floor(remainingTime / 60);
        let secondsLeft = remainingTime % 60;

        secondDiv.textContent =
          secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;
        minuteDiv.textContent = `${minutesLeft}`;
        remainingTime--;
      }, 1000);
    } else {
      localStorage.removeItem("pomodoroStartTime");
      localStorage.removeItem("pomodoroDuration");
    }
  }
});

startBtn.addEventListener("click", appTimer);
