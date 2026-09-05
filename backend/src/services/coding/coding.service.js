const fs = require('fs');
const path = require('path');

function buildProjectFiles() {
  const rootDir = path.resolve(__dirname, '../../../generated/tic-tac-toe');
  fs.mkdirSync(rootDir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Tic-Tac-Toe</title>
    <link rel="stylesheet" href="./style.css" />
  </head>
  <body>
    <main class="app">
      <h1>Tic-Tac-Toe</h1>
      <div class="status" id="status">Player X's turn</div>
      <div class="board" id="board" aria-label="Board"></div>
      <button id="restart" class="restart">Restart</button>
    </main>
    <script src="./script.js"></script>
  </body>
</html>`;

  const css = `:root {
  color-scheme: dark;
  --bg: #07111f;
  --panel: #0d1d31;
  --accent: #38bdf8;
  --text: #ebf6ff;
  --muted: #9db6ca;
}

* { box-sizing: border-box; }
body {
  margin: 0;
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at top, rgba(56, 189, 248, 0.15), transparent 30%), var(--bg);
  color: var(--text);
  font-family: Arial, sans-serif;
}
.app {
  width: min(90vw, 360px);
  background: rgba(13, 29, 49, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 24px;
  padding: 28px 18px 18px;
  box-shadow: 0 20px 50px rgba(2, 8, 23, 0.45);
}
h1 {
  margin: 0 0 10px;
  text-align: center;
}
.status {
  margin-bottom: 16px;
  text-align: center;
  color: var(--muted);
}
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.cell {
  width: 100%;
  aspect-ratio: 1;
  border: 1px solid rgba(148, 163, 184, 0.25);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.9);
  color: var(--text);
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
}
.restart {
  width: 100%;
  margin-top: 18px;
  border: none;
  border-radius: 12px;
  background: var(--accent);
  color: #04131d;
  font-weight: 700;
  padding: 12px 16px;
}`;

  const script = `const board = document.getElementById('board');
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
  status.textContent = 'Player X\'s turn';
  render();
});

render();`;

  fs.writeFileSync(path.join(rootDir, 'index.html'), html, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'style.css'), css, 'utf8');
  fs.writeFileSync(path.join(rootDir, 'script.js'), script, 'utf8');

  return rootDir;
}

async function buildProject(request = '') {
  const normalizedRequest = String(request || '').toLowerCase();

  if (!normalizedRequest.includes('tic') && !normalizedRequest.includes('game')) {
    return {
      status: 'not_supported',
      summary: 'This MVP builder currently supports simple game prototypes such as Tic-Tac-Toe.',
      filesChanged: [],
    };
  }

  const folder = buildProjectFiles();
  return {
    status: 'success',
    summary: 'Created a simple Tic-Tac-Toe MVP under /generated/tic-tac-toe.',
    filesChanged: [`${folder}/index.html`, `${folder}/style.css`, `${folder}/script.js`],
  };
}

module.exports = { buildProject };
