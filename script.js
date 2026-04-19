// ==========================================
// GAME STATE & VARIABLES
// ==========================================
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let gameMode = 'pvp'; // 'pvp' or 'pvc' (player vs computer)
let scores = {
    X: 0,
    O: 0,
    draw: 0
};

// Winning combinations
const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal top-left to bottom-right
    [2, 4, 6]  // Diagonal top-right to bottom-left
];

// ==========================================
// DOM ELEMENTS
// ==========================================
const cells = document.querySelectorAll('.cell');
const currentPlayerDisplay = document.getElementById('currentPlayer');
const scoreXDisplay = document.getElementById('scoreX');
const scoreODisplay = document.getElementById('scoreO');
const scoreDrawDisplay = document.getElementById('scoreDraw');
const resetBtn = document.getElementById('resetBtn');
const resetScoreBtn = document.getElementById('resetScoreBtn');
const gameMessage = document.getElementById('gameMessage');
const messageText = document.getElementById('messageText');
const messageIcon = document.getElementById('messageIcon');
const playAgainBtn = document.getElementById('playAgainBtn');
const modeToggle = document.getElementById('modeToggle');
const themeButtons = document.querySelectorAll('.theme-btn');
const modeButtons = document.querySelectorAll('.mode-btn');

// ==========================================
// INITIALIZATION
// ==========================================
function init() {
    // Load saved theme and mode
    loadTheme();
    loadScores();
    
    // Add event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetBtn.addEventListener('click', resetGame);
    resetScoreBtn.addEventListener('click', resetScores);
    playAgainBtn.addEventListener('click', () => {
        hideMessage();
        resetGame();
    });
    
    modeToggle.addEventListener('click', toggleDarkMode);
    
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => changeTheme(btn.dataset.theme));
    });
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', () => changeGameMode(btn.dataset.mode));
    });
}

// ==========================================
// THEME MANAGEMENT
// ==========================================
function changeTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update active button
    themeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === theme);
    });
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    
    // Toggle icons
    document.querySelector('.sun-icon').classList.toggle('hidden', isDark);
    document.querySelector('.moon-icon').classList.toggle('hidden', !isDark);
}

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'neon';
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    
    changeTheme(savedTheme);
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.sun-icon').classList.add('hidden');
        document.querySelector('.moon-icon').classList.remove('hidden');
    }
}

// ==========================================
// GAME MODE MANAGEMENT
// ==========================================
function changeGameMode(mode) {
    gameMode = mode;
    
    // Update active button
    modeButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mode === mode);
    });
    
    // Reset game when mode changes
    resetGame();
}

// ==========================================
// CELL CLICK HANDLER
// ==========================================
function handleCellClick(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-cell'));
    
    // Check if cell is already filled or game is over
    if (gameBoard[cellIndex] !== '' || !gameActive) {
        return;
    }
    
    // Make the move
    makeMove(cellIndex, currentPlayer);
    
    // Check for winner or draw
    if (checkWinner()) {
        endGame(currentPlayer);
        return;
    }
    
    if (checkDraw()) {
        endGame('draw');
        return;
    }
    
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateCurrentPlayerDisplay();
    
    // If it's computer's turn in PvC mode
    if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
        // Delay computer move for better UX
        setTimeout(computerMove, 500);
    }
}

// ==========================================
// MAKE MOVE
// ==========================================
function makeMove(index, player) {
    gameBoard[index] = player;
    const cell = cells[index];
    cell.textContent = player;
    cell.classList.add(player.toLowerCase());
    
    // Add animation
    cell.style.animation = 'none';
    setTimeout(() => {
        cell.style.animation = '';
    }, 10);
}

// ==========================================
// COMPUTER AI (Simple Strategy)
// ==========================================
function computerMove() {
    if (!gameActive) return;
    
    // Strategy:
    // 1. Check if computer can win
    // 2. Check if need to block player
    // 3. Take center if available
    // 4. Take random available cell
    
    let move = findWinningMove('O');
    if (move === -1) move = findWinningMove('X'); // Block player
    if (move === -1 && gameBoard[4] === '') move = 4; // Take center
    if (move === -1) move = getRandomMove(); // Random move
    
    if (move !== -1) {
        makeMove(move, 'O');
        
        // Check for winner or draw
        if (checkWinner()) {
            endGame('O');
            return;
        }
        
        if (checkDraw()) {
            endGame('draw');
            return;
        }
        
        // Switch back to player
        currentPlayer = 'X';
        updateCurrentPlayerDisplay();
    }
}

// Find winning move for given player
function findWinningMove(player) {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        const values = [gameBoard[a], gameBoard[b], gameBoard[c]];
        
        // Check if two cells have the player and one is empty
        if (values.filter(v => v === player).length === 2 && values.includes('')) {
            if (gameBoard[a] === '') return a;
            if (gameBoard[b] === '') return b;
            if (gameBoard[c] === '') return c;
        }
    }
    return -1;
}

// Get random available move
function getRandomMove() {
    const availableMoves = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    
    if (availableMoves.length === 0) return -1;
    
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

// ==========================================
// CHECK WINNER
// ==========================================
function checkWinner() {
    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        
        if (gameBoard[a] && 
            gameBoard[a] === gameBoard[b] && 
            gameBoard[a] === gameBoard[c]) {
            
            // Highlight winning cells
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            
            return true;
        }
    }
    return false;
}

// ==========================================
// CHECK DRAW
// ==========================================
function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

// ==========================================
// END GAME
// ==========================================
function endGame(winner) {
    gameActive = false;
    
    if (winner === 'draw') {
        scores.draw++;
        scoreDrawDisplay.textContent = scores.draw;
        showMessage('🤝', "It's a Draw!");
    } else {
        scores[winner]++;
        if (winner === 'X') {
            scoreXDisplay.textContent = scores.X;
            showMessage('❌', 'Player X Wins!');
        } else {
            scoreODisplay.textContent = scores.O;
            const winnerText = gameMode === 'pvc' ? 'Computer Wins!' : 'Player O Wins!';
            showMessage('⭕', winnerText);
        }
    }
    
    saveScores();
}

// ==========================================
// SHOW/HIDE MESSAGE
// ==========================================
function showMessage(icon, text) {
    messageIcon.textContent = icon;
    messageText.textContent = text;
    gameMessage.classList.remove('hidden');
}

function hideMessage() {
    gameMessage.classList.add('hidden');
}

// ==========================================
// RESET GAME
// ==========================================
function resetGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
    });
    
    updateCurrentPlayerDisplay();
}

// ==========================================
// RESET SCORES
// ==========================================
function resetScores() {
    scores = { X: 0, O: 0, draw: 0 };
    scoreXDisplay.textContent = '0';
    scoreODisplay.textContent = '0';
    scoreDrawDisplay.textContent = '0';
    saveScores();
}

// ==========================================
// UPDATE CURRENT PLAYER DISPLAY
// ==========================================
function updateCurrentPlayerDisplay() {
    currentPlayerDisplay.textContent = currentPlayer;
    currentPlayerDisplay.style.color = currentPlayer === 'X' 
        ? 'var(--accent-x)' 
        : 'var(--accent-o)';
}

// ==========================================
// SAVE/LOAD SCORES
// ==========================================
function saveScores() {
    localStorage.setItem('scores', JSON.stringify(scores));
}

function loadScores() {
    const savedScores = localStorage.getItem('scores');
    if (savedScores) {
        scores = JSON.parse(savedScores);
        scoreXDisplay.textContent = scores.X;
        scoreODisplay.textContent = scores.O;
        scoreDrawDisplay.textContent = scores.draw;
    }
}

// ==========================================
// START THE GAME
// ==========================================
init();