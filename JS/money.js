const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const cellSize = 30;
const cols = 15;
const rows = 15;

const canvasWidth = cellSize * cols;
const canvasHeight = cellSize * rows;

canvas.width = canvasWidth;
canvas.height = canvasHeight;

let grid = [];
let current;
let stack = [];
let playerImg = new Image();
playerImg.src = "../Imagenes/bicho.png";
let goalImg = new Image();
goalImg.src = "../Imagenes/durum.jpg";
let player = { x: 0, y: 0, size: cellSize, img: playerImg };
let goal = { x: cols - 1, y: rows - 1, size: cellSize, img: goalImg };

const directions = [
    { x: 0, y: -1 }, // up
    { x: 1, y: 0 },  // right
    { x: 0, y: 1 },  // down
    { x: -1, y: 0 }  // left
];

function index(i, j) {
    if (i < 0 || j < 0 || i >= cols || j >= rows) return -1;
    return i + j * cols;
}

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.walls = [true, true, true, true]; // top, right, bottom, left
    this.visited = false;

    this.show = function () {
        let x = this.i * cellSize;
        let y = this.j * cellSize;
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        if (this.walls[0]) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + cellSize, y);
            ctx.stroke();
        }
        if (this.walls[1]) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        if (this.walls[2]) {
            ctx.beginPath();
            ctx.moveTo(x + cellSize, y + cellSize);
            ctx.lineTo(x, y + cellSize);
            ctx.stroke();
        }
        if (this.walls[3]) {
            ctx.beginPath();
            ctx.moveTo(x, y + cellSize);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
    };

    this.checkNeighbors = function () {
        let neighbors = [];

        const top = grid[index(i, j - 1)];
        const right = grid[index(i + 1, j)];
        const bottom = grid[index(i, j + 1)];
        const left = grid[index(i - 1, j)];

        if (top && !top.visited) neighbors.push(top);
        if (right && !right.visited) neighbors.push(right);
        if (bottom && !bottom.visited) neighbors.push(bottom);
        if (left && !left.visited) neighbors.push(left);

        if (neighbors.length > 0) {
            const r = Math.floor(Math.random() * neighbors.length);
            return neighbors[r];
        } else {
            return undefined;
        }
    };
}

function removeWalls(a, b) {
    const x = a.i - b.i;
    if (x === 1) {
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    const y = a.j - b.j;
    if (y === 1) {
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }
}

function initializeGrid() {
    grid = [];
    for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            const cell = new Cell(i, j);
            grid.push(cell);
        }
    }
    current = grid[0];
}

function generateMazeInstantly() {
    while (true) {
        current.visited = true;
        const next = current.checkNeighbors();
        if (next) {
            next.visited = true;
            stack.push(current);
            removeWalls(current, next);
            current = next;
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            break;
        }
    }
}

function drawGrid() {
    for (let i = 0; i < grid.length; i++) {
        grid[i].show();
    }
}

function drawPlayer() {
    ctx.drawImage(player.img, player.x * cellSize, player.y * cellSize, player.size, player.size);
}

function drawGoal() {
    ctx.drawImage(goal.img, goal.x * cellSize, goal.y * cellSize, goal.size, goal.size);
}

function draw() {
    clear();
    drawGrid();
    drawPlayer();
    drawGoal();
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        const currentCell = grid[index(player.x, player.y)];
        const direction = directions.findIndex(dir => dir.x === dx && dir.y === dy);
        const wallPresent = currentCell.walls[direction];

        if (!wallPresent) {
            player.x = newX;
            player.y = newY;
        }
    }

    if (player.x === goal.x && player.y === goal.y) {
        setTimeout(() => {
            if (confirm("¡Has ganado! ¿Quieres jugar de nuevo?")) {
                restartGame();
            }
        }, 100);
    }

    draw();
}

function handleTouchStart(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}

function handleTouchMove(e) {
    e.preventDefault();
    touchEndX = e.touches[0].clientX;
    touchEndY = e.touches[0].clientY;

    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;

    if (Math.abs(dx) > Math.abs(dy)) {
        // Movimiento horizontal
        if (dx > 0) {
            movePlayer(1, 0); // Derecha
        } else {
            movePlayer(-1, 0); // Izquierda
        }
    } else {
        // Movimiento vertical
        if (dy > 0) {
            movePlayer(0, 1); // Abajo
        } else {
            movePlayer(0, -1); // Arriba
        }
    }

    touchStartX = touchEndX;
    touchStartY = touchEndY;
}

canvas.addEventListener("touchstart", handleTouchStart, false);
canvas.addEventListener("touchmove", handleTouchMove, false);

function keyDown(e) {
    switch (e.key) {
        case "ArrowUp":
            movePlayer(0, -1);
            break;
        case "ArrowRight":
            movePlayer(1, 0);
            break;
        case "ArrowDown":
            movePlayer(0, 1);
            break;
        case "ArrowLeft":
            movePlayer(-1, 0);
            break;
    }
}

document.addEventListener("keydown", keyDown);

function restartGame() {
    player.x = 0;
    player.y = 0;
    goal = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
        size: cellSize,
        img: goalImg
    };
    initializeGrid();
    generateMazeInstantly();
    draw();
}

document.getElementById("restartButton").addEventListener("click", restartGame);
document.getElementById("surpriseButton").addEventListener("click", () => {
    window.location.href = "Sorpresa.html";
});

// Initial game setup
restartGame();
