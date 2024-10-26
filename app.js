const board = document.getElementById('game-board');
const cells = Array.from(document.getElementsByClassName('cell'));
const message = document.getElementById('message');
const resetButton = document.getElementById('reset');
let winningLineElement = null;

let currentPlayer = 'X';
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]  
];

function handleClick(event) {
    const index = event.target.getAttribute('data-index');
    
    if (boardState[index] !== '' || !gameActive) return;

    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;

    
    event.target.classList.add('glow');

    setTimeout(() => {
        event.target.classList.remove('glow');
    }, 500);

    if (checkWin()) {
        message.textContent = `${currentPlayer} wins!`;
        gameActive = false;
        drawWinningLine();
    } else if (boardState.every(cell => cell !== '')) {
        message.textContent = 'It\'s a tie!';
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkWin() {
    return winningPatterns.some(pattern => {
        const [a, b, c] = pattern;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            winningLineElement = pattern; 
            return true;
        }
        return false;
    });
}

function drawWinningLine() {
    if (!winningLineElement) return;
    
    const [a, b, c] = winningLineElement;
    const cellA = cells[a].getBoundingClientRect();
    const cellC = cells[c].getBoundingClientRect();

    const line = document.createElement('div');
    line.classList.add('winning-line');
    
    const x1 = cellA.left + cellA.width / 2;
    const y1 = cellA.top + cellA.height / 2;
    const x2 = cellC.left + cellC.width / 2;
    const y2 = cellC.top + cellC.height / 2;
    
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    line.style.width = `${distance}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.left = `${x1}px`;
    line.style.top = `${y1}px`;

    document.body.appendChild(line);
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('glow'); 
    });
    message.textContent = '';

    const existingLine = document.querySelector('.winning-line');
    if (existingLine) {
        existingLine.remove();
    }

    currentPlayer = 'X';
    gameActive = true;
    winningLineElement = null;
}

board.addEventListener('click', handleClick);
resetButton.addEventListener('click', resetGame);
