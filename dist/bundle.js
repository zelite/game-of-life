"use strict";
var Cell = (function () {
    function Cell() {
        this.aliveNow = Math.random() < 0.5;
        this.aliveLater = false;
    }
    Cell.prototype.isAlive = function () {
        return this.aliveNow;
    };
    Cell.prototype.setState = function (alive) {
        this.aliveNow = alive;
    };
    Cell.prototype.switchState = function () {
        this.setState(!this.isAlive());
    };
    Cell.prototype.calculateNextGen = function (numberOfLivingNeighbours) {
        if (this.aliveNow) {
            if (numberOfLivingNeighbours < 2 || numberOfLivingNeighbours > 3) {
                this.aliveLater = false;
            }
            else {
                this.aliveLater = true;
            }
        }
        else if (numberOfLivingNeighbours === 3) {
            this.aliveLater = true;
        }
        else {
            this.aliveLater = false;
        }
    };
    Cell.prototype.moveToNextGen = function () {
        this.aliveNow = this.aliveLater;
    };
    return Cell;
}());
function modulo(x, n) {
    return ((x % n) + n) % n;
}
var Board = (function () {
    function Board(width, height) {
        this.width = width;
        this.height = height;
        this.board = new Array(height);
        for (var row = 0; row < height; row++) {
            var newRow = new Array(width);
            for (var col = 0; col < width; col++) {
                newRow[col] = new Cell();
            }
            this.board[row] = newRow;
        }
    }
    Board.prototype.iterateBoard = function (callback) {
        this.board.forEach(function (row, row_i) {
            row.forEach(function (cell, col_i) {
                callback(cell, row_i, col_i);
            });
        });
    };
    Board.prototype.getCellAt = function (row, col) {
        return this.board[row][col];
    };
    Board.prototype.clearBoard = function () {
        this.iterateBoard(function (cell) {
            cell.setState(false);
        });
    };
    Board.prototype.randomizeBoard = function () {
        this.iterateBoard(function (cell) {
            cell.setState(Math.random() < 0.5);
        });
    };
    Board.prototype.getNumberOfAliveNeighbours = function (row, col) {
        var rowStart = row - 1;
        var colStart = col - 1;
        var numberOfLivingNeighbours = 0;
        for (var row_i = rowStart; row_i < rowStart + 3; row_i++) {
            for (var col_i = colStart; col_i < colStart + 3; col_i++) {
                if (row_i !== row || col_i !== col) {
                    var cell = this.getCellAt(modulo(row_i, this.height), modulo(col_i, this.width));
                    if (cell.isAlive()) {
                        numberOfLivingNeighbours++;
                    }
                }
            }
        }
        return numberOfLivingNeighbours;
    };
    Board.prototype.calculateAllCellsNextGen = function () {
        var _this = this;
        this.iterateBoard(function (cell, row, col) {
            var numberOfLivingNeighbours = _this.getNumberOfAliveNeighbours(row, col);
            cell.calculateNextGen(numberOfLivingNeighbours);
        });
    };
    Board.prototype.moveAllCellsToNextGen = function () {
        this.calculateAllCellsNextGen();
        this.iterateBoard(function (cell, row, col) {
            cell.moveToNextGen();
        });
    };
    return Board;
}());
var CELL_SIZE = 25;
var LINE_WIDTH = 1;
var Drawing = (function () {
    function Drawing(canvasID) {
        this.canvas = document.getElementById("life");
        this.context = this.canvas.getContext("2d");
    }
    Drawing.prototype.getCanvas = function () {
        return this.canvas;
    };
    Drawing.prototype.drawCell = function (cell, x, y) {
        var ctx = this.context;
        ctx.beginPath();
        ctx.lineWidth = LINE_WIDTH;
        ctx.rect(x, y, CELL_SIZE - LINE_WIDTH, CELL_SIZE - LINE_WIDTH);
        ctx.strokeStyle = "black";
        if (cell.isAlive()) {
            ctx.fillStyle = "#2ECC71";
        }
        else {
            ctx.fillStyle = "white";
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };
    Drawing.prototype.setCanvasSize = function (numberOfCols, numberOfRows) {
        this.canvas.width = numberOfCols * CELL_SIZE;
        this.canvas.height = numberOfRows * CELL_SIZE;
    };
    Drawing.prototype.drawBoard = function (board) {
        var _this = this;
        board.iterateBoard(function (cell, row, col) {
            _this.drawCell(cell, col * CELL_SIZE, row * CELL_SIZE);
        });
    };
    return Drawing;
}());
function updateAndDrawCells(drawer, board) {
    board.moveAllCellsToNextGen();
    drawer.drawBoard(board);
}
var boardCols = 20;
var boardRows = 15;
var drawer = new Drawing("life");
function setupBoard(boardCols, boardRows) {
    drawer.setCanvasSize(boardCols, boardRows);
    var newBoard = new Board(boardCols, boardRows);
    drawer.drawBoard(newBoard);
    return newBoard;
}
var board = setupBoard(boardCols, boardRows);
updateAndDrawCells(drawer, board);
var startButton = document.getElementById("start");
startButton.addEventListener("click", function () {
    if (handle === 0) {
        handle = startAnimation();
    }
});
var handle = 0;
function startAnimation() {
    startButton.disabled = true;
    startButton.textContent = "Animation running";
    return setInterval(function () {
        updateAndDrawCells(drawer, board);
    }, 250);
}
function stopAnimation(handle) {
    startButton.disabled = false;
    startButton.textContent = "Start animation";
    clearInterval(handle);
    return 0;
}
document.getElementById("stop").addEventListener("click", function () {
    if (handle !== 0) {
        handle = stopAnimation(handle);
    }
});
document.getElementById("clear").addEventListener("click", function () {
    handle = stopAnimation(handle);
    board.clearBoard();
    updateAndDrawCells(drawer, board);
});
document.getElementById("random").addEventListener("click", function () {
    handle = stopAnimation(handle);
    board.randomizeBoard();
    updateAndDrawCells(drawer, board);
});
document.getElementById("save").addEventListener("click", function () {
    handle = stopAnimation(handle);
    boardCols = parseInt(document.getElementById("ncols").value);
    boardRows = parseInt(document.getElementById("nrows").value);
    board = setupBoard(boardCols, boardRows);
    drawer.drawBoard(board);
});
drawer.getCanvas().addEventListener("click", function (event) {
    var clickX = event.clientX;
    var clickY = event.clientY;
    var canvasRectangle = drawer.getCanvas().getBoundingClientRect();
    var x = event.clientX - canvasRectangle.left;
    var y = event.clientY - canvasRectangle.top;
    var cellX = Math.floor(x / 25);
    var cellY = Math.floor(y / 25);
    try {
        var cell = board.getCellAt(cellY, cellX);
        cell.switchState();
        drawer.drawCell(cell, cellX * CELL_SIZE, cellY * CELL_SIZE);
    }
    catch (TypeError) {
        console.log("clicking outside the board");
    }
});
//# sourceMappingURL=bundle.js.map