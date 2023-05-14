class SudokuSolver {

  validate(puzzleString) {
    let valid = true;
    puzzleString.split("").forEach(el => {
      valid &= (el == "." || el <= 9 || el >= 1) ? true : false;
    });
    return valid && puzzleString.length == 81;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    let chosenRow = rows[row].split("");
    let total = 0;
    if (chosenRow.indexOf(String(value)) >= 0) return false;
    chosenRow[column] = value;
    for (let c = 0; c < 9; c++) {
      total += chosenRow[c] === "." ? 0 : Number(chosenRow[c]);
    }
    return total <= 45;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    let total = 0;
    let chosenCol = [];
    for (let r = 0; r < 9; r++) {
      if (Number(rows[r][column]) === Number(value)) return false;
      chosenCol.push(Number(rows[r][column]));
      total += rows[r][column] === "." ? 0 : Number(rows[r][column]);
    }
    //if(chosenCol.indexOf(Number(value))!==chosenCol.lastIndexOf(Number(value))) {
    if (chosenCol.includes(Number(value))) {
      return false;
    } else {
      total += value;
      return total <= 45;
    }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    let chosenRegion = [];
    let windowRow = parseInt(row / 3);
    let windowCol = parseInt(column / 3);
    let total = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (Number(rows[i + windowRow * 3][j + windowCol * 3]) === Number(value)) return false;
        chosenRegion.push(Number(rows[i + windowRow * 3][j + windowCol * 3]));
        total += rows[i][j] === "." ? 0 : Number(rows[i][j]);
      }
    }
    if (chosenRegion.includes(Number(value))) {
      return false;
    } else {
      total += value;
      return total <= 45;
    }
  }
  calculateRowColReg(puzzleString, row, col, value) {
    return this.checkRowPlacement(puzzleString, row, col, value) &&
      this.checkColPlacement(puzzleString, row, col, value) &&
      this.checkRegionPlacement(puzzleString, row, col, value);
  }

  createMapOfSolutions(puzzleString) {
    let rows = puzzleString.match(/.{9}/g); //array with 9 rows
    const possibleSolutionsMap = new Map();
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const possibleSolutions = [];
        for (let n = 1; n <= 9; n++) {
          if (rows[i][j] === "." && calculateRowColReg(puzzleString, i, j, n)) {
            possibleSolutions.push(Number(n));
          }
        }
        possibleSolutionsMap.set(i * 9 + j, possibleSolutions);
      }
    }
    return possibleSolutionsMap;
  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;

