const board = document.getElementById("gameBoard");
const icons = ['🍎','🍌','🍇','🍓','🍉','🍍','🥝','🍒'];
let cards = [...icons, ...icons];
let firstCard = null;
let lockBoard = false;
let moves = 0;
let matchedCount = 0;
let timer = 0;
let timerInterval = null;

const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const highScoreEl = document.getElementById("highScore");
const winMessage = document.getElementById("winMessage");
const finalMoves = document.getElementById("finalMoves");
const finalTime = document.getElementById("finalTime");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function updateMoves() {
  moves++;
  movesEl.textContent = moves;
}

function checkHighScore() {
  const best = localStorage.getItem("memoryHighScore");
  if (!best || moves < best) {
    localStorage.setItem("memoryHighScore", moves);
  }
  highScoreEl.textContent = localStorage.getItem("memoryHighScore") || '--';
}

function createBoard() {
  shuffle(cards);
  cards.forEach(icon => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.innerHTML = "?";
    card.addEventListener("click", flipCard);
    board.appendChild(card);
  });
  checkHighScore();
}

function flipCard() {
  if (!timerInterval) startTimer();
  if (lockBoard || this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");
  this.innerHTML = this.dataset.icon;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  updateMoves();

  if (this.dataset.icon === firstCard.dataset.icon) {
    this.classList.add("matched");
    firstCard.classList.add("matched");
    firstCard = null;
    matchedCount++;

    if (matchedCount === icons.length) {
      stopTimer();
      showWin();
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      this.classList.remove("flipped");
      firstCard.classList.remove("flipped");
      this.innerHTML = "?";
      firstCard.innerHTML = "?";
      firstCard = null;
      lockBoard = false;
    }, 1000);
  }
}

function showWin() {
  finalMoves.textContent = moves;
  finalTime.textContent = timer;
  winMessage.style.display = "block";
  checkHighScore();
}

createBoard();
