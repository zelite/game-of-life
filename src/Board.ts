/// <reference path="Cell.ts" />

//A mathematical correct modulo helper function
function modulo(x: number, n: number) {
  return ((x % n) + n) % n;
}

//Represents the game of life board
class Board {
  board: Array<Array<Cell>>;
  constructor(public width: number, public height: number) {
    this.board = new Array(height);
    for (let row = 0; row < height; row++) {
      let newRow: Array<Cell> = new Array(width);
      for (let col = 0; col < width; col++) {
        newRow[col] = new Cell();
      }
      this.board[row] = newRow;
    }
  }

  //Iterates over all the cells in the board and applies
  //the callback function to each cell
  iterateBoard(callback: (cell: Cell, row: number, col: number) => void) {
    this.board.forEach((row, row_i) => {
      row.forEach((cell, col_i) => {
        callback(cell, row_i, col_i);
      })
    });
  }

  //Returns the cell at a certain position of the board
  getCellAt(row: number, col: number) {
    return this.board[row][col];
  }

  //Sets the alive state of all the cells in the board to false
  clearBoard() {
    this.iterateBoard((cell) => {
      cell.setState(false);
    })
  }

  //Sets the alive state of all the cells in the board to a random state
  randomizeBoard() {
    this.iterateBoard((cell) => {
      cell.setState(Math.random() < 0.5);
    })
  }

  //Gets the number of living cells adjacent to the cell with the given coordinates
  getNumberOfAliveNeighbours(row: number, col: number): number {
    let rowStart: number = row - 1;
    let colStart: number = col - 1;
    let numberOfLivingNeighbours = 0
    for (let row_i = rowStart; row_i < rowStart + 3; row_i++) {
      for (let col_i = colStart; col_i < colStart + 3; col_i++) {
        if (row_i !== row || col_i !== col) {
          //using the modulo makes sure we jump to the opposite side of the board
          //if the cell is on an edge.
          let cell = this.getCellAt(modulo(row_i, this.height), modulo(col_i, this.width));
          if (cell.isAlive()) {
            numberOfLivingNeighbours++;
          }
        }
      }
    }
    return numberOfLivingNeighbours;
  }

  //Calculates and sets the next generation status for every cell in the board
  calculateAllCellsNextGen() {
    this.iterateBoard((cell, row, col) => {
      let numberOfLivingNeighbours = this.getNumberOfAliveNeighbours(row, col);
      cell.calculateNextGen(numberOfLivingNeighbours);
    })
  }

  //Sets the current state of every cell to the next generation state
  moveAllCellsToNextGen() {
    this.calculateAllCellsNextGen();
    this.iterateBoard((cell, row, col) => {
      cell.moveToNextGen();
    })
  }
}
