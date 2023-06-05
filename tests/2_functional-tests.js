const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');
const { puzzlesAndSolutions } = require('../controllers/puzzle-strings.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('POST request to /api/solve', function () {

        test('Solve a puzzle with valid puzzle string', function (done) {
          chai.request(server)
            .post("/api/solve")
            .send({
              puzzle: puzzlesAndSolutions[0][0]
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.solution, puzzlesAndSolutions[0][1])
              done();
            })
        });
        test('Solve a puzzle with incorrect length', function (done) {
            chai.request(server)
              .post("/api/solve")
              .send({
                puzzle: puzzlesAndSolutions[0][0].slice(1)
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
                done();
              })
          });
          test('Solve a puzzle with missing puzzle string', function (done) {
            chai.request(server)
              .post("/api/solve")
              .send({
                //puzzle: ""
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Required field missing")
                done();
              })
          });
          test('Solve a puzzle with invalid characters', function (done) {
            chai.request(server)
              .post("/api/solve")
              .send({
                puzzle: puzzlesAndSolutions[0][0].slice(1)+"o"
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Invalid characters in puzzle")
                done();
              })
          });
          test('Solve a puzzle that cannot be solved', function (done) {
            // not solvable puzzle
            chai.request(server)
              .post("/api/solve")
              .send({
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....21945....4.37.4.3..6.."
              })
              .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.equal(res.body.error, "Puzzle cannot be solved")
                done();
              })
          });
      });
      
      suite('POST request to /api/check', function () {
        test('Check a puzzle placement with missing required fields', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9.....21945....4.37.4.3..6.."
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Required field(s) missing")
              done();
            })
        });
        test('Solve a puzzle with invalid characters', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: puzzlesAndSolutions[0][0].slice(1)+"o",
              coordinate:"I8",
              value:"2"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid characters in puzzle")
              done();
            })
        });
        test('Check a puzzle placement with incorrect length', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: puzzlesAndSolutions[0][0].slice(1),
              coordinate:"I8",
              value:"2"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Expected puzzle to be 81 characters long")
              done();
            })
        });
        test('Check a puzzle placement with invalid placement coordinate', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: puzzlesAndSolutions[0][0],
              coordinate:"K8",
              value:"2"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid coordinate")
              done();
            })
        });
        test('Check a puzzle placement with invalid placement value', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: puzzlesAndSolutions[0][0],
              coordinate:"I8",
              value:"0"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, "Invalid value")
              done();
            })
        });
        test('Check a puzzle placement with all fields', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate:"G1",
              value:"7"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, true)
              done();
            })
        });
        test('Check a puzzle placement with single placement conflict', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate:"G1",
              value:"9"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["row"]);
              done();
            })
        });
        test('Check a puzzle placement with multiple placement conflicts', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate:"I1",
              value:"6"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["row","column"]);
              done();
            })
        });
        test('Check a puzzle placement with all placement conflicts', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate:"G1",
              value:"4"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, false);
              assert.deepEqual(res.body.conflict, ["row","column","region"]);
              done();
            });
        });
        test('value submitted to /api/check is already placed in puzzle', function (done) {
          chai.request(server)
            .post("/api/check")
            .send({
              puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..",
              coordinate:"H1",
              value:"2"
            })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.equal(res.body.valid, true);
              //assert.deepEqual(res.body.conflict, ["row","column","region"]);
              done();
            })
        });
      })
});

/*
   > Solve a puzzle with valid puzzle string: POST request to /api/solve
   > Solve a puzzle with missing puzzle string: POST request to /api/solve
   > Solve a puzzle with invalid characters: POST request to /api/solve
   > Solve a puzzle with incorrect length: POST request to /api/solve
   > Solve a puzzle that cannot be solved: POST request to /api/solve
   > Check a puzzle placement with all fields: POST request to /api/check
   > Check a puzzle placement with single placement conflict: POST request to /api/check
   > Check a puzzle placement with multiple placement conflicts: POST request to /api/check
   > Check a puzzle placement with all placement conflicts: POST request to /api/check
   > Check a puzzle placement with missing required fields: POST request to /api/check
   > Check a puzzle placement with invalid characters: POST request to /api/check
   > Check a puzzle placement with incorrect length: POST request to /api/check
   > Check a puzzle placement with invalid placement coordinate: POST request to /api/check
   > Check a puzzle placement with invalid placement value: POST request to /api/check
*/