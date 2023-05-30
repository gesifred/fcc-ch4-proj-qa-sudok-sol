const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

suite('Unit Tests', () => {
    test("Logic handles a valid puzzle string of 81 characters", function () {
		assert.equal(true , solver.validate("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."));
	});
    test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
		assert.equal(false , solver.validate("._.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."));
	});
	
    test("Logic handles a puzzle string that is not 81 characters in length", function () {
		assert.equal(false , solver.validate("1..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."));
	});
	
    test("Logic handles a valid row placement", function () {
		assert.equal(true , solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,2,1));
	});
	
    test("Logic handles an invalid row placement", function () {
		assert.equal(false , solver.checkRowPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",1,2,4));
	});
	
    test("Logic handles a valid column placement", function () {
		assert.equal(true , solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",2,5,2));
	});
    test("Logic handles an invalid column placement", function () {
		assert.equal(false , solver.checkColPlacement("..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",2,5,9));
	});
	
    test("Logic handles a valid region (3x3 grid) placement", function () {
		assert.equal(true , solver.checkRegionPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",0,2,1));
	});
    test("Logic handles an invalid region (3x3 grid) placement", function () {
		assert.equal(false , solver.checkRegionPlacement(".7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6",0,2,2));
	});
		
    test("Valid puzzle strings pass the solver", function () {
		assert.equal(solver.solve(puzzlesAndSolutions[0][0]),puzzlesAndSolutions[0][1]);
	});
	
	test("Invalid puzzle strings fail the solver", function () {
		//changing pulzze to unsolvable 
		assert.equal(solver.solve("11.9...47739.......8.13...5....9..5..5...........84...8..45..3...4.7..91..6...58."),false);
	});
	
    test("Solver returns the expected solution for an incomplete puzzle", function () {
		assert.equal(solver.solve(puzzlesAndSolutions[1][0]),puzzlesAndSolutions[1][1]);
	});
});
