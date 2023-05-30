class SudokuSolver {

  validate(puzzleString) {
    let valid = true;
    puzzleString.split("").forEach(el => {
      valid &= (el === "." || (el <= 9 && el >= 1));
    });
    return (valid && puzzleString.length == 81);
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    let chosenRow = rows[row].split("");
    if (chosenRow.indexOf(String(value)) >= 0) return false;
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    for (let r = 0; r < 9; r++) {
      if (Number(rows[r][column]) === Number(value)) return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    let windowRow = parseInt(row / 3);
    let windowCol = parseInt(column / 3);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (Number(rows[i + windowRow * 3][j + windowCol * 3]) === Number(value)) return false;
      }
    }
    return true;
  }

  checkValid(puzzleString, row, col, value) {
    return this.checkRowPlacement(puzzleString, row, col, value) &&
      this.checkColPlacement(puzzleString, row, col, value) &&
      this.checkRegionPlacement(puzzleString, row, col, value);
  }

  findPositionToFill(puzzleString) {
    return puzzleString.indexOf(".");
  }

  findPossibleSolutions(puzzleString, position) {
    let rows = puzzleString.match(/.{9}/g);
    let row = parseInt(position / 9);
    let col = (position % 9);
    let solutions = [];
    for (let n = 1; n <= 9; n++) {
      if (rows[row][col] === "." && this.checkValid(puzzleString, row, col, n)) {
        solutions.push(Number(n));
      }
    }
    return solutions;
  }

  findMapOfSolutions(puzzleString) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    const possibleSolutionsMap = new Map();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const possibleSolutions = [];
        for (let n = 1; n <= 9; n++) {
          if (rows[i][j] === "." && this.checkValid(puzzleString, i, j, n)) {
            possibleSolutions.push(Number(n));
          }
        }
        if (rows[i][j] === "." && possibleSolutions.length == 0) {
          possibleSolutionsMap.set(i * 9 + j, null);
        } else {
          possibleSolutionsMap.set(i * 9 + j, possibleSolutions);
        }
      }
    }
    return possibleSolutionsMap;
  }

  solve(puzzleString) {
    const matrix = puzzleString.match(/.{9}/g); //array with 9 rows
    const rows = matrix.map(row => row.split(""));
    if (this.solveHandler(puzzleString,rows)){
      return rows.map(l => l.join("")).join("");
    } else {
      return false;
    }
  }

  solveHandler(puzzleString,rows) {
    let nextPosition = this.findPositionToFill(puzzleString);
    if (nextPosition < 0) return true;
    let solutions = this.findPossibleSolutions(puzzleString,nextPosition);
    let row = parseInt(nextPosition / 9);
    let col = (nextPosition % 9);
    for (let solution of solutions){
      rows[row][col] = String(solution);
      let temp = rows.map(l => l.join("")).join("");
      if (this.solveHandler(temp,rows)){
        return true;
      }
    }
    rows[row][col] = ".";
    return false
  }
}

module.exports = SudokuSolver;

