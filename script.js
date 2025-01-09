const board = document.querySelector('.board');
const currentPlayerColorElement = document.getElementById('currentPlayerColor');
const cells = [];

const numRows = 6;
const numCols = 7;
const playerColors = ['#ff0000', '#ffff00']; // Colores de los jugadores
const playerNames = ['Rojo', 'Amarillo']; // Nombres de los jugadores
const restartButton = document.getElementById('restartButton');

const dialog = document.createElement('div');
dialog.classList.add('dialog');
dialog.innerHTML = `
    <div class="message">¡Felicidades! Ganó el jugador <span id="winningPlayerName"></span>.</div>
    <button id="playAgainButton">Volver a Jugar</button>
`;

document.body.appendChild(dialog);
const winningPlayerNameElement = document.getElementById('winningPlayerName');

document.getElementById('playAgainButton').addEventListener('click', function() {
    dialog.style.display = 'none';
    restartGame();
});

let currentPlayer = 0; // 0 para el primer jugador, 1 para el segundo jugador
let gameOver = false; // Variable para rastrear si el juego ha terminado

// Crear celdas en el tablero
for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;
        board.appendChild(cell);
        cells.push(cell);
    }
}

// Agregar evento de clic a las celdas
cells.forEach(cell => {
    cell.addEventListener('click', () => {
        if (!gameOver) {
            handleCellClick(cell);
        }
    });
});

// Función para actualizar el turno del jugador en la interfaz
function updatePlayerTurn() {
    currentPlayerColorElement.textContent = playerNames[currentPlayer];
    currentPlayerColorElement.style.color = playerColors[currentPlayer];
}


function handleCellClick(cell) {
    const col = parseInt(cell.dataset.col);
    const row = getLowestEmptyRow(col);

    if (row !== -1) {
        const chip = document.createElement('div');
        chip.classList.add('chip');
        chip.style.backgroundColor = playerColors[currentPlayer];

        const cellInColumn = cells.filter(c => parseInt(c.dataset.col) === col);
        const targetCell = cellInColumn.find(c => parseInt(c.dataset.row) === row);

        targetCell.appendChild(chip);

        const currentPlayerName = playerNames[currentPlayer];

        currentPlayer = (currentPlayer + 1) % 2;
        updatePlayerTurn();

        // Verificar si hay un ganador después de un breve retraso
        setTimeout(() => checkForWinner(currentPlayerName), 100);
    }
}


// Función para encontrar la fila más baja vacía en una columna
function getLowestEmptyRow(col) {
    const cellInColumn = cells.filter(c => parseInt(c.dataset.col) === col);

    for (let row = numRows - 1; row >= 0; row--) {
        const cell = cellInColumn.find(c => parseInt(c.dataset.row) === row);
        if (!cell.querySelector('.chip')) {
            return row;
        }
    }
    return -1;
}

function checkForWinner(winningPlayerName) {
    // Definimos las direcciones en las que puede haber una combinación ganadora
    const directions = [
        { row: 1, col: 0 },  // Vertical
        { row: 0, col: 1 },  // Horizontal
        { row: 1, col: 1 },  // Diagonal hacia la derecha
        { row: 1, col: -1 }  // Diagonal hacia la izquierda
    ];

    for (const cell of cells) {
        const currentColor = cell.querySelector('.chip')?.style.backgroundColor;
        if (currentColor) {
            for (const dir of directions) {
                let count = 1;
                for (let i = 1; i <= 3; i++) {
                    const newRow = parseInt(cell.dataset.row) + dir.row * i;
                    const newCol = parseInt(cell.dataset.col) + dir.col * i;
                    const neighborCell = cells.find(c =>
                        parseInt(c.dataset.row) === newRow && parseInt(c.dataset.col) === newCol
                    );

                    if (neighborCell && neighborCell.querySelector('.chip')?.style.backgroundColor === currentColor) {
                        count++;
                    } else {
                        break;
                    }
                }
                if (count === 4) {
                    // Ganador encontrado
                    winningPlayerNameElement.textContent = winningPlayerName;
                    dialog.style.display = 'block';
                    gameOver = true; // Marcamos el juego como terminado
                    return true;
                }
            }
        }
    }

    return false;
}

// Agregar eventos de mouseenter y mouseleave a las celdas para iluminar la celda donde caerá la ficha
cells.forEach(cell => {
    cell.addEventListener('mouseenter', () => {
        if (!gameOver) {
            const col = parseInt(cell.dataset.col);
            const row = getLowestEmptyRow(col);
            if (row !== -1) {
                highlightCell(col, row, true);
            }
        }
    });

    cell.addEventListener('mouseleave', () => {
        if (!gameOver) {
            const col = parseInt(cell.dataset.col);
            const row = getLowestEmptyRow(col);
            if (row !== -1) {
                highlightCell(col, row, false);
            }
        }
    });
});


/*----------------------------------------*/
// Función para resaltar o desresaltar una celda con un color un poco más oscuro
function highlightCell(col, row, highlight) {
    const targetCell = cells.find(cell => parseInt(cell.dataset.col) === col && parseInt(cell.dataset.row) === row);

    if (highlight) {
        // Obtener el color actual de la celda
        const currentColor = window.getComputedStyle(targetCell).backgroundColor;
        // Calcular un color más oscuro
        const darkerColor = calculateDarkerColor(currentColor);
        // Establecer el color de fondo
        targetCell.style.backgroundColor = darkerColor;
    } else {
        // Restaurar el color original de la celda
        targetCell.style.backgroundColor = '';
    }
}

// Función para calcular un color más oscuro
function calculateDarkerColor(color) {
    const rgb = color.match(/\d+/g);
    const darkerRgb = rgb.map(value => Math.max(0, value - 50)); // Puedes ajustar el valor "50" según tus preferencias
    return `rgb(${darkerRgb[0]}, ${darkerRgb[1]}, ${darkerRgb[2]})`;
}
/*----------------------------------------*/


// Agregar evento de clic al botón de reinicio
    restartButton.addEventListener('click', restartGame);

// Función para reiniciar la partida
function restartGame() {
    // Restablecer el color de fondo de todas las celdas
    cells.forEach(cell => {
        cell.style.backgroundColor = '';//Borra la casilla oscura
        while (cell.firstChild) {
            cell.removeChild(cell.firstChild);
        }
    });
    // Restablecer el turno al jugador 0 (Rojo)
    currentPlayer = 0;
    updatePlayerTurn();
    gameOver = false;
}
// Actualizar el turno del jugador inicial
updatePlayerTurn();