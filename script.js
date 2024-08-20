const X_CLASS = 'x';
const CIRCLE_CLASS = 'circle';
const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const cellElements = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
let circleTurn = false;  // Human starts first as 'X'

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  circleTurn = false;  // Human starts first
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(CIRCLE_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  placeMark(cell, X_CLASS);
  if (checkWin(X_CLASS)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();  // Swap to computer's turn
    setTimeout(computerMove, 500);  // Delay computer's move for a better UX
  }
}

function computerMove() {
  const bestMove = getBestMove();
  if (bestMove !== -1) {
    cellElements[bestMove].classList.add(CIRCLE_CLASS);
    if (checkWin(CIRCLE_CLASS)) {
      endGame(false);
    } else if (isDraw()) {
      endGame(true);
    } else {
      swapTurns();  // Swap back to human's turn
      setBoardHoverClass();
    }
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!';
  } else {
    winningMessageTextElement.innerText = `${circleTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  circleTurn = !circleTurn;
}

function setBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(CIRCLE_CLASS);
  if (circleTurn) {
    board.classList.add(CIRCLE_CLASS);
  } else {
    board.classList.add(X_CLASS);
  }
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}

function getBestMove() {
  let bestVal = -Infinity;
  let bestMove = -1;

  cellElements.forEach((cell, index) => {
    if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
      cell.classList.add(CIRCLE_CLASS);
      let moveVal = minimax(false);
      cell.classList.remove(CIRCLE_CLASS);

      if (moveVal > bestVal) {
        bestMove = index;
        bestVal = moveVal;
      }
    }
  });

  return bestMove;
}

function minimax(isMaximizing) {
  if (checkWin(CIRCLE_CLASS)) {
    return 1;
  }
  if (checkWin(X_CLASS)) {
    return -1;
  }
  if (isDraw()) {
    return 0;
  }

  if (isMaximizing) {
    let best = -Infinity;
    cellElements.forEach(cell => {
      if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
        cell.classList.add(CIRCLE_CLASS);
        best = Math.max(best, minimax(false));
        cell.classList.remove(CIRCLE_CLASS);
      }
    });
    return best;
  } else {
    let best = Infinity;
    cellElements.forEach(cell => {
      if (!cell.classList.contains(X_CLASS) && !cell.classList.contains(CIRCLE_CLASS)) {
        cell.classList.add(X_CLASS);
        best = Math.min(best, minimax(true));
        cell.classList.remove(X_CLASS);
      }
    });
    return best;
  }
}
