const board = document.getElementById('board');
const status = document.getElementById('status');
const restartButton = document.getElementById('restart');
const state = Array(9).fill('');
let currentPlayer = 'X';

function checkWinner() {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of lines) {
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }

  return null;
}

function render() {
  board.innerHTML = '';
  state.forEach((cell, index) => {
    const button = document.createElement('button');
    button.className = 'cell';
    button.textContent = cell;
    button.addEventListener('click', () => handleMove(index));
    board.appendChild(button);
  });
}

function handleMove(index) {
  if (state[index] || checkWinner()) return;
  state[index] = currentPlayer;
  const winner = checkWinner();

  if (winner) {
    status.textContent = 'Player ' + winner + ' wins!';
    render();
    return;
  }

  if (state.every(Boolean)) {
    status.textContent = 'Draw!';
    render();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = 'Player ' + currentPlayer + "'s turn";
  render();
}

restartButton.addEventListener('click', () => {
  state.fill('');
  currentPlayer = 'X';
  status.textContent = 'Player X's turn';
  render();
});

render();