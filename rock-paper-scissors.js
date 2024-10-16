let score = JSON.parse(localStorage.getItem("score")) || {
  Wins: 0,
  Losses: 0,
  Ties: 0,
};

let seriesScore = {
  Player: 0,
  Computer: 0,
  Total: 0,
};

let seriesLength = 0; // Number of games in the series
let playerMoves = []; // Array to store the player's previous moves
let isOpenPlay = false; // Track if in open play mode

document.getElementById('startGameButton').onclick = function() {
  const username = document.getElementById('username').value;
  const errorMessage = document.getElementById('error-message');

  const validUsernamePattern = /^[A-Za-z\s]+$/;

  errorMessage.style.display = 'none';

  if (username) {
      if (!validUsernamePattern.test(username)) {
          errorMessage.innerText = 'Please use only letters and spaces.';
          errorMessage.style.display = 'block';
      } else {
          document.querySelector('.login-container').style.display = 'none';
          document.querySelector('.series-selection').style.display = 'flex'; // Show series selection
          document.getElementById('usernameDisplay').innerText = `Welcome, ${username}!`;
          document.getElementById('usernameDisplay').style.display = 'block';
      }
  } else {
      errorMessage.innerText = 'Please enter your name.';
      errorMessage.style.display = 'block';
  }
};

function setSeries(length) {
  seriesLength = length; // Set the series length
  seriesScore = { Player: 0, Computer: 0, Total: 0 }; // Reset series score
  isOpenPlay = false; // Set to not open play
  document.querySelector('.series-selection').style.display = 'none'; // Hide series selection
  document.querySelector('.game-container').style.display = 'block'; // Show game container
  updateScoreElement();
}

function setOpenPlay() {
  isOpenPlay = true; // Set to open play mode
  seriesScore = { Player: 0, Computer: 0, Total: 0 }; // Reset series score
  document.querySelector('.series-selection').style.display = 'none'; // Hide series selection
  document.querySelector('.game-container').style.display = 'block'; // Show game container
  updateScoreElement();
}

function playGame(playerMove) {
  playerMoves.push(playerMove);
  if (playerMoves.length > 5) playerMoves.shift();

  let computerMove = pickComputerMove();

  if (playerMoves.length > 1) {
      const lastMove = playerMoves[playerMoves.length - 2];
      computerMove = counterMove(lastMove);
  }

  let result = determineResult(playerMove, computerMove);
  updateScores(result);

  // Check for series win after updating scores
  if (!isOpenPlay) {
      checkSeriesWin();
  }

  // Display results and update UI
  displayResults(result, playerMove, computerMove);
}

function determineResult(playerMove, computerMove) {
  if (playerMove === computerMove) return "Tie.";
  if (
      (playerMove === "rock" && computerMove === "scissors") ||
      (playerMove === "scissors" && computerMove === "paper") ||
      (playerMove === "paper" && computerMove === "rock")
  ) {
      return "You win.";
  }
  return "You lose.";
}

function updateScores(result) {
  if (result === "You win.") {
      score.Wins += 1;
      if (!isOpenPlay) seriesScore.Player += 1;
  } else if (result === "You lose.") {
      score.Losses += 1;
      if (!isOpenPlay) seriesScore.Computer += 1;
  } else {
      score.Ties += 1;
  }
  localStorage.setItem("score", JSON.stringify(score));
  updateScoreElement();
}

function checkSeriesWin() {
  console.log(`Player: ${seriesScore.Player}, Computer: ${seriesScore.Computer}`); // Debug line
  if (seriesScore.Player >= Math.ceil(seriesLength / 2)) {
      alert("You won the series!");
      resetSeries();
  } else if (seriesScore.Computer >= Math.ceil(seriesLength / 2)) {
      alert("Computer won the series!");
      resetSeries();
  }
}

function resetSeries() {
  seriesScore = { Player: 0, Computer: 0, Total: 0 };
  updateScoreElement();
  playerMoves = []; // Clear recent moves if needed
}

function displayResults(result, playerMove, computerMove) {
  const resultElement = document.querySelector(".js-result");
  resultElement.innerHTML = `${result}`;
  resultElement.classList.add("show-result");

  document.querySelector(".js-Moves").innerHTML = `You <img src="${playerMove}-emoji.png" class="move-image" /> <img src="${computerMove}-emoji.png" class="move-image" /> Computer`;

  setTimeout(() => {
      resultElement.classList.remove("show-result");
  }, 1500);
}

function updateScoreElement() {
  document.querySelector(".score").innerHTML = `Wins: ${score.Wins} <br> Losses: ${score.Losses} <br> Ties: ${score.Ties}`;
  document.querySelector(".series").innerHTML = `Series - Player: ${seriesScore.Player} <br> Computer: ${seriesScore.Computer}`;
}

function resetScore() {
  score.Wins = 0;
  score.Losses = 0;
  score.Ties = 0;
  localStorage.removeItem('score');
  updateScoreElement();
}

function counterMove(lastMove) {
  switch (lastMove) {
      case 'rock':
          return 'paper';    // Paper beats Rock
      case 'paper':
          return 'scissors'; // Scissors beats Paper
      case 'scissors':
          return 'rock';     // Rock beats Scissors
      default:
          return pickComputerMove(); // Default random move if no valid last move
  }
}

function pickComputerMove() {
  const randomNumber = Math.random();
  if (randomNumber < 1 / 3) return "rock";
  else if (randomNumber < 2 / 3) return "paper";
  return "scissors";
}

// Show login form on page load
window.onload = function() {
  document.querySelector('.login-container').style.display = 'flex';
};