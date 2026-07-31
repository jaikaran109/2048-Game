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

function handleMove(direction) {
    const oldBoard = JSON.parse(JSON.stringify(board));

    if (direction === 'left') moveLeft();
    else if (direction === 'right') moveRight();
    else if (direction === 'up') moveUp();
    else if (direction === 'down') moveDown();
    else return;

    if (!boardsAreEqual(oldBoard, board)) {
        addRandomTile();
        render();

        if (isGameOver()) {
            setTimeout(() => alert('Game Over! Score: ' + score), 100);
        }
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') handleMove('left');
    else if (e.key === 'ArrowRight') handleMove('right');
    else if (e.key === 'ArrowUp') handleMove('up');
    else if (e.key === 'ArrowDown') handleMove('down');
});

const gridContainer = document.querySelector('.container');

let touchStartX = 0;
let touchStartY = 0;

gridContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}, { passive: false });

gridContainer.addEventListener('touchmove', (e) => {
    e.preventDefault();
}, { passive: false });

gridContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    const minSwipeDistance = 30;

    if (Math.max(Math.abs(diffX), Math.abs(diffY)) < minSwipeDistance) return;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        handleMove(diffX > 0 ? 'right' : 'left');
    } else {
        handleMove(diffY > 0 ? 'down' : 'up');
    }
}, { passive: false });

let wheelLocked = false;

window.addEventListener('wheel', (e) => {
    if (wheelLocked) return;

    const minSwipeDistance = 15;

    if (Math.max(Math.abs(e.deltaX), Math.abs(e.deltaY)) < minSwipeDistance) return;

    wheelLocked = true;
    setTimeout(() => { wheelLocked = false; }, 300);

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        handleMove(e.deltaX > 0 ? 'right' : 'left');
    } else {
        handleMove(e.deltaY > 0 ? 'down' : 'up');
    }
}, { passive: true });

newGameBtn.addEventListener('click', startNewGame);

startNewGame();