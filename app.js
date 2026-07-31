const cellElements = document.querySelectorAll('.cell');
const scoreDisplay = document.querySelector('.score-box .score');
const bestDisplay = document.querySelector('.best-score .score');
const newGameBtn = document.querySelector('.new-game');

let board = [];
let score = 0;
let best = Number(localStorage.getItem('best2048')) || 0;  // dekho yha local storage me store kr rhe h isiliye vo page refresh hone pe bhi change nhi ho rha h

function startNewGame() {  // jb new game start kroge tb
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];
    score = 0; // new game pe score 0 ho jayega
    addRandomTile();  // random 2 cell me 2 ya 4 dalne ke liye starting me 
    addRandomTile();
    render();
}

function addRandomTile() {
    const emptyCells = [];  // sare cells expty honge starting me 
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length === 0) return;  // agr koi empty cell nhi bchega tb return kr do

    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;  // jb random value 0.9 se km hogi to 2 vrna 4
}

function render() {
    let index = 0;
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const value = board[r][c];  // data nikal rha 
            const cell = cellElements[index];  
            cell.textContent = value === 0 ? '' : value;

            if (value === 0) {
                cell.removeAttribute('data-value');
            } else {
                cell.setAttribute('data-value', value);
            }
            index++;
        }
    }
    scoreDisplay.textContent = score;
    if (score > best) {
        best = score;
        localStorage.setItem('best2048', best);
    }
    bestDisplay.textContent = best;
}

function slideRowLeft(row) {
    let filtered = row.filter(num => num !== 0);

    for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
            filtered[i] = filtered[i] * 2;
            score += filtered[i];
            filtered[i + 1] = 0;
        }
    }

    filtered = filtered.filter(num => num !== 0);

    while (filtered.length < 4) {
        filtered.push(0);
    }

    return filtered;
}

function transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

function reverseRows(matrix) {
    return matrix.map(row => [...row].reverse());
}

function moveLeft() {
    board = board.map(row => slideRowLeft(row));
}

function moveRight() {
    board = reverseRows(board);
    board = board.map(row => slideRowLeft(row));
    board = reverseRows(board);
}

function moveUp() {
    board = transpose(board);
    board = board.map(row => slideRowLeft(row));
    board = transpose(board);
}

function moveDown() {
    board = transpose(board);
    board = reverseRows(board);
    board = board.map(row => slideRowLeft(row));
    board = reverseRows(board);
    board = transpose(board);
}

function boardsAreEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

function isGameOver() {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (board[r][c] === 0) return false;
        }
    }
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            const current = board[r][c];
            if (c < 3 && board[r][c + 1] === current) return false;
            if (r < 3 && board[r + 1][c] === current) return false;
        }
    }
    return true;
}

document.addEventListener('keydown', (e) => {
    const oldBoard = JSON.parse(JSON.stringify(board));

    if (e.key === 'ArrowLeft') moveLeft();
    else if (e.key === 'ArrowRight') moveRight();
    else if (e.key === 'ArrowUp') moveUp();
    else if (e.key === 'ArrowDown') moveDown();
    else return;

    if (!boardsAreEqual(oldBoard, board)) {
        addRandomTile();
        render();

        if (isGameOver()) {
            setTimeout(() => alert('Game Over! Score: ' + score), 100);
        }
    }
});

newGameBtn.addEventListener('click', startNewGame);

startNewGame();