'use strict';

const Solver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new Solver();

  app.route('/api/check')
    .post((req, res) => {
      // {"puzzle":"..37.4.3..6..", "coordinate":"I8", "value":"2"}
      let { puzzle, coordinate, value } = req.body;
      if (!coordinate || !value || !puzzle) {
        return res.send({
          error: "Required field(s) missing"
        })
      } else if (!solver.validate(puzzle)) {
        if (puzzle.length != 81) {
          return res.send({
            error: "Expected puzzle to be 81 characters long"
          })
        } else if (puzzle.match(/[^1-9\.]/g)) {
          return res.send({
            error: "Invalid characters in puzzle"
          })
        }
      } else { //puzzle is valid
        if (!coordinate.match(/^[a-iA-I][1-9]$/)) {
          return res.send({
            error: "Invalid coordinate"
          })
        } else if (value < 1 || value > 9 || isNaN(value)) {
          return res.send({
            error: "Invalid value"
          })
        } else {
          //normalize coordinate
          let row = coordinate[0].toUpperCase().charCodeAt() - 65;
          let col = coordinate[1] - 1;
          let rows = puzzle.match(/.{9}/g);
          if (Number(rows[row][col]) === Number(value)) {
            return res.send({
              valid: true
            })
          }
          if (!solver.checkValid(puzzle, row, col, value)) {
            let finalConflict = [];
            if (!solver.checkRowPlacement(puzzle, row, col, value)) {
              finalConflict.push("row");
            }
            if (!solver.checkColPlacement(puzzle, row, col, value)) {
              finalConflict.push("column");
            }
            if (!solver.checkRegionPlacement(puzzle, row, col, value)) {
              finalConflict.push("region");
            }
            return res.send({
              valid: false,
              conflict: finalConflict
            })
          } else {
            return res.send({
              valid: true
            })
          }
        }
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle;
      if (!puzzle) {
        return res.send({
          error: "Required field missing"
        })
      }
      if (solver.validate(puzzle)) {
        let solutionsMap = solver.findMapOfSolutions(puzzle);
        for (const [key, value] of solutionsMap.entries()) {
          if (value === null) {
            return res.send({
              error: "Puzzle cannot be solved"
            })
          }
        }
        let solution = solver.solve(puzzle);
        if (solution) {
          return res.send({
            solution: solution
          })
        }
        return res.send({
          error: "Puzzle cannot be solved"
        })
      } else { //not valid puzzle
        if (puzzle.length != 81) {
          return res.send({
            error: "Expected puzzle to be 81 characters long"
          })
        } else if (puzzle.match(/[^1-9\.]/g)) {
          return res.send({
            error: "Invalid characters in puzzle"
          })
        }
      }
    });
};
