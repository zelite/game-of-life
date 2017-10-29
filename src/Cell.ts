//Represents an individual cell on the game of life
class Cell {
  aliveNow: boolean;
  aliveLater: boolean;
  constructor() {
    this.aliveNow = Math.random() < 0.5; //status of new cell is random
    this.aliveLater = false;
  }

  isAlive() {
    return this.aliveNow;
  }

  setState(alive: boolean) {
    this.aliveNow = alive;
  }

  switchState() {
    this.setState(!this.isAlive());
  }

  //Calculates the living status of the cell on the next generation
  //takes as input the number of living neighbour cells
  //saves the next generation status on this.aliveLater
  calculateNextGen(numberOfLivingNeighbours: number) {
    if (this.aliveNow) {
      if (numberOfLivingNeighbours < 2 || numberOfLivingNeighbours > 3) {
        this.aliveLater = false;
      } else {
        this.aliveLater = true;
      }
    } else if (numberOfLivingNeighbours === 3) {
      this.aliveLater = true;
    }
    else {
      this.aliveLater = false;
      //when reseting board or clicking cell, the alivelater may reflect some old state.
    }
  }

  //Performs the transition to the next generation status
  moveToNextGen() {
    this.aliveNow = this.aliveLater;
  }
}
