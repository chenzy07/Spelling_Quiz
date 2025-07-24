const wordList = [
  { word: "MATUTULOG", video: "matutulog.mp4" },
  { word: "SALAMIN", video: "salamin.mp4" },
  { word: "SIGN", video: "sign.mp4" }
];

let currentWord = {};
let currentGuess = "";
let randomMode = false;

const wordDisplay = document.getElementById("word-display");
const keyboard = document.getElementById("keyboard");
const videoContainer = document.getElementById("video-container");
const video = document.getElementById("reward-video");
const videoSource = document.getElementById("video-source");
const resetBtn = document.getElementById("reset-btn");
const wordSelect = document.getElementById("word-select");
const randomToggle = document.getElementById("random-toggle");

const soundClick = document.getElementById("sound-click");
const soundCorrect = document.getElementById("sound-correct");
const soundWrong = document.getElementById("sound-wrong");

function loadWordList() {
  wordList.forEach((entry, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = entry.word;
    wordSelect.appendChild(opt);
  });
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function updateDisplay() {
  const target = currentWord.word;
  wordDisplay.textContent = currentGuess + "_".repeat(target.length - currentGuess.length);
}

function clearKeys() {
  document.querySelectorAll(".key").forEach(k => k.classList.remove("correct", "wrong"));
}

function resetGame() {
  const index = randomMode
    ? Math.floor(Math.random() * wordList.length)
    : parseInt(wordSelect.value);

  currentWord = wordList[index];
  currentGuess = "";
  updateDisplay();
  clearKeys();
  resetBtn.classList.add("hidden");
  videoContainer.classList.add("hidden");
  keyboard.classList.remove("hidden");
  generateKeyboard();
}

function generateKeyboard() {
  keyboard.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let char of letters) {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = char;
    btn.onclick = () => handleGuess(char, btn);
    keyboard.appendChild(btn);
  }
}

function handleGuess(letter, button) {
  if (currentGuess.length >= currentWord.word.length) return;

  playSound(soundClick);

  const correctLetter = currentWord.word[currentGuess.length];
  if (letter === correctLetter) {
    currentGuess += letter;
    button.classList.add("correct");
    playSound(soundCorrect);
  } else {
    button.classList.add("wrong");
    playSound(soundWrong);
  }

  updateDisplay();

  if (currentGuess === currentWord.word) {
    showVideo(currentWord.video);
  }
}

function showVideo(videoPath) {
  keyboard.classList.add("hidden");
  videoSource.src = videoPath;
  video.load();
  video.loop = false;
  videoContainer.classList.remove("hidden");
  video.play();
  resetBtn.classList.remove("hidden");
}

randomToggle.onclick = () => {
  randomMode = !randomMode;
  randomToggle.textContent = randomMode ? "🔀 Random: On" : "🔀 Random: Off";
  resetGame();
};

wordSelect.onchange = resetGame;
resetBtn.onclick = resetGame;

loadWordList();
resetGame();
