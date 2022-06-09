let activePauseButton = false; // manage start and paused states because of JS Date fun
let timerInterval; // for interval id
let controlButtons; //  managing buttons html elements
let timer; // managing timer html elements
let currentStopWatchTime = 0; // current stop watch total milliseconds
let initialStopWatchTime = null; // initial stop watch datetime
let totalPausedTime = 0; // manage Paused time
let pauseStartTime; // to track time when watch is paused
let logCounter = 0; // for serial number of logs in log table
// Object containing time units (hours, mins, secs, ms)
const currentStopWatchTimeObject = {
  milliSeconds: 0,
  seconds: 0,
  minutes: 0,
  hours: 0,
};

// get html elements once html loads
window.onload = function windowLoad() {
  // controlButtons[0] -- start button, [1] -- split button, [2] -- stop button
  controlButtons = document.getElementById("watch-controls").children;
  // timer[0] --hours [1]--minutes [2]--seconds [3] --milliseconds
  timer = document.getElementById("timer").children;
  controlButtons[1].disabled = true; // disable split button at default state
};
//Function on click of "start" button
function startClicked() {
  activePauseButton = !activePauseButton; // toggle start and paused button states
  if (activePauseButton) {
    //start was Clicked
    controlButtons[1].disabled = false;
    if (currentStopWatchTime == 0)
      // set initial stop watch time when if timer was 0
      initialStopWatchTime = new Date();
    else {
      // managing total paused time to remove time difference.
      totalPausedTime = totalPausedTime + (new Date() - pauseStartTime); // calculating total Paused Time
    }
    controlButtons[0].classList.add("start-in-action"); //start button style when active
    controlButtons[0].innerHTML = "Pause"; // changing start to pause
    controlButtons[1].classList.add("split-in-action");
    controlButtons[1].classList.remove("disable");
    controlButtons[2].disabled = true; // disable reset button when timer is running
    controlButtons[2].classList.remove("reset-in-action");
    controlButtons[2].classList.add("disable");

    timerInterval = setInterval(() => {
      //Starting watch at an interval of 1ms
      startTimer(initialStopWatchTime);
    }, 1);
  } else if (!activePauseButton) {
    // Pause was Clicked
    pauseStartTime = new Date(); // getting paused start time to manage total paused time
    clearInterval(timerInterval); // stop the timer
    controlButtons[2].disabled = false; //disable split button
    controlButtons[2].classList.add("reset-in-action");
    controlButtons[2].classList.remove("disable");
    controlButtons[0].innerHTML = "Start";
    controlButtons[0].classList.remove("start-in-action");
    controlButtons[1].classList.remove("split-in-action");
    controlButtons[1].classList.add("disable");
    controlButtons[1].disabled = true;
    document.getElementById("log").innerHTML += makeLogRow("Pause", "red");
  }
}
//Function on click of "Split" button
function splitClicked() {
  // append times to log table
  document.getElementById("log").innerHTML += makeLogRow("Split", "orange");
  document.getElementById("split-time").innerHTML =
    prefixZerosToNumber(currentStopWatchTimeObject.hours, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.minutes, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.seconds, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.milliSeconds, 3);
}
// Function to make log table row html
function makeLogRow(action = "Pause", className = "orange") {
  logCounter++;
  if (logCounter == 1) {
    document.getElementById("visibility").classList.add("display-block");
    document.getElementById("visibility").classList.remove("display-none");
  }
  return (
    "<tr> <td> #" +
    logCounter +
    '</td> <td class="' +
    className +
    '"> ' +
    prefixZerosToNumber(currentStopWatchTimeObject.hours, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.minutes, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.seconds, 2) +
    ":" +
    prefixZerosToNumber(currentStopWatchTimeObject.milliSeconds, 3) +
    " </td>  <td>" +
    action +
    " </td> </tr>"
  );
}

function startTimer(currentDate) {
  let currentTime = new Date();
  currentStopWatchTime = currentTime - currentDate - totalPausedTime; // get total time in mili seconds
  setTimeParts(currentStopWatchTime); // set units of time from milliseconds
  updateStopWatchDom(); // display the updated timer values
}
// prefix with zeroes and update respective html elements
function updateStopWatchDom() {
  timer[0].innerHTML = prefixZerosToNumber(currentStopWatchTimeObject.hours, 2);
  timer[1].innerHTML = prefixZerosToNumber(
    currentStopWatchTimeObject.minutes,
    2
  );
  timer[2].innerHTML = prefixZerosToNumber(
    currentStopWatchTimeObject.seconds,
    2
  );
  let milliString = prefixZerosToNumber(
    currentStopWatchTimeObject.milliSeconds * 1000,
    3
  );
  timer[3].innerHTML =
    milliString[0] + "<sub>" + milliString[1] + milliString[2] + "</sub>";
}
// Function to add zeros prefix to time digits
function prefixZerosToNumber(number, length) {
  let numberString = number.toString();
  for (let i = numberString.length; i < length; i++)
    numberString = "0" + numberString;
  return numberString;
}
// Setting time of watch in hours, minutes, secs and ms
function setTimeParts(totalMilliSeconds) {
  currentStopWatchTimeObject.hours = Math.floor(
    totalMilliSeconds / (60 * 60 * 1000)
  );
  let remainder =
    totalMilliSeconds - currentStopWatchTimeObject.hours * 60 * 60 * 1000;
  currentStopWatchTimeObject.minutes = Math.floor(remainder / (60 * 1000));
  remainder = remainder - currentStopWatchTimeObject.minutes * 60 * 1000;
  currentStopWatchTimeObject.seconds = Math.floor(remainder / 1000);
  currentStopWatchTimeObject.milliSeconds =
    remainder - currentStopWatchTimeObject.seconds * 1000;
}
// Function on click of "reset" button
function resetClicked() {
  clearInterval(timerInterval); // stop the timer and reset to initial state
  currentStopWatchTime = 0;
  totalPausedTime = 0;
  setTimeParts(currentStopWatchTime);
  updateStopWatchDom();
  document.getElementById("split-time").innerHTML = "SPLIT TIME";
  // disable reset and split buttons
  controlButtons[2].classList.remove("reset-in-action");
  controlButtons[2].classList.add("disable");
  controlButtons[1].classList.remove("split-in-action");
  controlButtons[1].classList.add("disable");
  controlButtons[0].innerHTML = "Start";
  controlButtons[0].classList.remove("start-in-action");
  // clear logs
  document.getElementById("log").innerHTML = "";
  // remove hr
  document.getElementById("visibility").classList.add("display-none");
  document.getElementById("visibility").classList.remove("display-block");
}
