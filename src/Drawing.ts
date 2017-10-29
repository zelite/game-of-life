/// <reference path="Board.ts" />
const CELL_SIZE = 25;
const LINE_WIDTH = 1;

//Draws the board in the canvas
class Drawing {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  constructor(canvasID: string) {
    this.canvas = <HTMLCanvasElement>document.getElementById("life");
    this.context = this.canvas.getContext("2d");
  }

  //returns the canvas element
  getCanvas() {
    return this.canvas;
  }

  //Draws the given cell at x, y position
  drawCell(cell: Cell, x: number, y: number) {
    const ctx = this.context;
    //Draw Rectangle
    ctx.beginPath();
    ctx.lineWidth = LINE_WIDTH;
    ctx.rect(x, y, CELL_SIZE - LINE_WIDTH, CELL_SIZE - LINE_WIDTH);
    ctx.strokeStyle = "black";

    //Fill rectangle based on alive status
    if (cell.isAlive()) {
      ctx.fillStyle = "#2ECC71"
    } else {
      ctx.fillStyle = "white";
    }
    ctx.closePath();
    //Finish the drawing by actually sending it to the canvas
    ctx.stroke()
    ctx.fill();
  }

  //Changes the size of the canvas
  setCanvasSize(numberOfCols: number, numberOfRows: number) {
    this.canvas.width = numberOfCols * CELL_SIZE;
    this.canvas.height = numberOfRows * CELL_SIZE;
  }

  //Draws the given board in the canvas
  drawBoard(board: Board) {
    board.iterateBoard((cell: Cell, row: number, col: number) => {
      this.drawCell(cell, col * CELL_SIZE, row * CELL_SIZE)
    })
  }
}

//Updates all the cells in board and draws the board
function updateAndDrawCells(drawer: Drawing, board: Board) {
  board.moveAllCellsToNextGen();
  drawer.drawBoard(board);
}


let boardCols = 20;
let boardRows = 15;
let drawer = new Drawing("life");

//Sets up canvas and board sizes to match together
function setupBoard(boardCols: number, boardRows: number): Board {
  drawer.setCanvasSize(boardCols, boardRows);
  const newBoard = new Board(boardCols, boardRows);
  drawer.drawBoard(newBoard);
  return newBoard;
}

let board = setupBoard(boardCols, boardRows);

//first draw of the board
updateAndDrawCells(drawer, board);

//Event Listeners

//Start animation on button click
const startButton = <HTMLInputElement>document.getElementById("start");
startButton.addEventListener("click", () => {
  if (handle === 0) {
    handle = startAnimation();
  }
})

//Functions to handle the start stop of the animation
let handle = 0;
function startAnimation() {
  startButton.disabled = true;
  startButton.textContent = "Animation running";
  return setInterval(() => {
    updateAndDrawCells(drawer, board)
  }, 250)
}
function stopAnimation(handle: number) {
  startButton.disabled = false;
  startButton.textContent = "Start animation";
  clearInterval(handle);
  return 0;
}

//Stop animation on button click
document.getElementById("stop").addEventListener("click", () => {
  if (handle !== 0) {
    handle = stopAnimation(handle);
  }
})

//Clear the board on button click
document.getElementById("clear").addEventListener("click", () => {
  handle = stopAnimation(handle);
  board.clearBoard();
  updateAndDrawCells(drawer, board)
})

//Randomize the board state on button click
document.getElementById("random").addEventListener("click", () => {
  handle = stopAnimation(handle);
  board.randomizeBoard();
  updateAndDrawCells(drawer, board);
})

//Save the new board dimensions on button click
document.getElementById("save").addEventListener("click", () => {
  handle = stopAnimation(handle);
  boardCols = parseInt((<HTMLInputElement>document.getElementById("ncols")).value);
  boardRows = parseInt((<HTMLInputElement>document.getElementById("nrows")).value);
  board = setupBoard(boardCols, boardRows);
  drawer.drawBoard(board);
})

//Change cell state by clicking on it
drawer.getCanvas().addEventListener("click", (event) => {
  const clickX = event.clientX;
  const clickY = event.clientY;
  const canvasRectangle = drawer.getCanvas().getBoundingClientRect();
  const x = event.clientX - canvasRectangle.left;
  const y = event.clientY - canvasRectangle.top;
  const cellX = Math.floor(x / 25);
  const cellY = Math.floor(y / 25);
  try {
    let cell = board.getCellAt(cellY, cellX);
    cell.switchState();
    drawer.drawCell(cell, cellX * CELL_SIZE, cellY * CELL_SIZE)
  } catch (TypeError) {
    console.log("clicking outside the board")
  }
})

