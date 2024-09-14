"use strict";

// Sample Sudoku puzzles for testing (EASY, MEDIUM, HARD)
var EASY_PUZZLE = "1-58-2----9--764-52--4--819-19--73-6762-83-9-----61-5---76---3-43--2-5-16--3-89--";
var MEDIUM_PUZZLE = "-3-5--8-45-42---1---8--9---79-8-61-3-----54---5------78-----7-2---7-46--61-3--5--";
var HARD_PUZZLE = "8----------36------7--9-2---5---7-------457-----1---3---1----68--85---1--9----4--";

// Set this variable to true to expose private functions for testing
var TESTABLE = true;

/**
 * SudokuSolver function.
 * Uses the recursive backtracking algorithm to solve a Sudoku puzzle.
 * @param {boolean} testable - Exposes private methods if true.
 */
var SudokuSolver = function (testable) {
  var solver;

  // PUBLIC FUNCTIONS

  /**
   * Solves the given Sudoku board represented as a string.
   * @param {string} boardString - The Sudoku board as a string of 81 characters.
   * @returns {string|false} - Solved board as a string or false if unsolvable.
   */
  function solve(boardString) {
    var boardArray = boardString.split("");  // Convert the board to an array
    if (boardIsInvalid(boardArray)) {
      return false; // Return false if the board is invalid
    }
    return recursiveSolve(boardString); // Begin recursive solving
  }

  /**
   * Solves the board and prints it to the console.
   * @param {string} boardString - The Sudoku board string.
   * @returns {string|false} - Solved board as a string or false if unsolvable.
   */
  function solveAndPrint(boardString) {
    var solvedBoard = solve(boardString); // Solve the board
    console.log(toString(solvedBoard.split(""))); // Print the board
    return solvedBoard;
  }

  // PRIVATE FUNCTIONS

  /**
   * Recursively solves the board using the backtracking algorithm.
   * @param {string} boardString - The current state of the board as a string.
   * @returns {string|false} - Solved board as a string or false if unsolvable.
   */
  function recursiveSolve(boardString) {
    var boardArray = boardString.split(""); // Convert the board to an array

    // If the board is fully solved, return the solved board
    if (boardIsSolved(boardArray)) {
      return boardArray.join("");
    }

    // Get the next empty cell and its possible values
    var cellPossibilities = getNextCellAndPossibilities(boardArray);
    var nextUnsolvedCellIndex = cellPossibilities.index;
    var possibilities = cellPossibilities.choices;

    // Try each possibility and recursively solve the board
    for (var i = 0; i < possibilities.length; i++) {
      boardArray[nextUnsolvedCellIndex] = possibilities[i];
      var solvedBoard = recursiveSolve(boardArray.join("")); // Recursively solve
      if (solvedBoard) {
        return solvedBoard; // Return the solved board if successful
      }
    }
    return false; // Return false if no solution found
  }

  /**
   * Checks if the board is invalid.
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if the board is invalid.
   */
  function boardIsInvalid(boardArray) {
    return !boardIsValid(boardArray); // Invert the validity check
  }

  /**
   * Checks if the board is valid (all rows, columns, and boxes are valid).
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if the board is valid.
   */
  function boardIsValid(boardArray) {
    return allRowsValid(boardArray) && allColumnsValid(boardArray) && allBoxesValid(boardArray);
  }

  /**
   * Checks if the board is completely solved.
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if the board is fully solved.
   */
  function boardIsSolved(boardArray) {
    // Check if all cells are filled (i.e., no "-" remaining)
    return boardArray.every(cell => cell !== "-");
  }

  /**
   * Gets the next unsolved cell and its possible values.
   * @param {Array} boardArray - The current board as an array.
   * @returns {Object} - The index and possible choices for the next unsolved cell.
   */
  function getNextCellAndPossibilities(boardArray) {
    for (var i = 0; i < boardArray.length; i++) {
      if (boardArray[i] === "-") {
        var existingValues = getAllIntersections(boardArray, i); // Get the values in the same row, column, and box
        var choices = ["1", "2", "3", "4", "5", "6", "7", "8", "9"].filter(function (num) {
          return existingValues.indexOf(num) < 0; // Filter out used numbers
        });
        return { index: i, choices: choices }; // Return the index and choices for this cell
      }
    }
  }

  /**
   * Gets all values from the same row, column, and box as the given cell.
   * @param {Array} boardArray - The current board as an array.
   * @param {number} i - The index of the cell.
   * @returns {Array} - All values from the row, column, and box of the cell.
   */
  function getAllIntersections(boardArray, i) {
    return getRow(boardArray, i).concat(getColumn(boardArray, i)).concat(getBox(boardArray, i));
  }

  /**
   * Checks if all rows are valid.
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if all rows are valid.
   */
  function allRowsValid(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].every(function (i) {
      return collectionIsValid(getRow(boardArray, i));
    });
  }

  /**
   * Gets the row of a given cell.
   * @param {Array} boardArray - The current board as an array.
   * @param {number} i - The index of the cell.
   * @returns {Array} - The row that contains the cell.
   */
  function getRow(boardArray, i) {
    var startingEl = Math.floor(i / 9) * 9; // Calculate the starting index of the row
    return boardArray.slice(startingEl, startingEl + 9); // Return the row
  }

  /**
   * Checks if all columns are valid.
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if all columns are valid.
   */
  function allColumnsValid(boardArray) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].every(function (i) {
      return collectionIsValid(getColumn(boardArray, i));
    });
  }

  /**
   * Gets the column of a given cell.
   * @param {Array} boardArray - The current board as an array.
   * @param {number} i - The index of the cell.
   * @returns {Array} - The column that contains the cell.
   */
  function getColumn(boardArray, i) {
    var startingEl = Math.floor(i % 9); // Calculate the starting index of the column
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].map(function (num) {
      return boardArray[startingEl + num * 9]; // Return the column
    });
  }

  /**
   * Checks if all 3x3 boxes are valid.
   * @param {Array} boardArray - The current board as an array.
   * @returns {boolean} - True if all boxes are valid.
   */
  function allBoxesValid(boardArray) {
    return [0, 3, 6, 27, 30, 33, 54, 57, 60].every(function (i) {
      return collectionIsValid(getBox(boardArray, i));
    });
  }

  /**
   * Gets the 3x3 box of a given cell.
   * @param {Array} boardArray - The current board as an array.
   * @param {number} i - The index of the cell.
   * @returns {Array} - The 3x3 box that contains the cell.
   */
  function getBox(boardArray, i) {
    var boxCol = Math.floor(i / 3) % 3;
    var boxRow = Math.floor(i / 27);
    var startingIndex = boxCol * 3 + boxRow * 27;
    return [0, 1, 2, 9, 10, 11, 18, 19, 20].map(function (num) {
      return boardArray[startingIndex + num];
    });
  }

  /**
   * Checks if a collection (row, column, or box) is valid (no repeated numbers).
   * @param {Array} collection - The row, column, or box to validate.
   * @returns {boolean} - True if the collection is valid.
   */
  function collectionIsValid(collection) {
    var numCounts = {}; // Track occurrences of each number
    for (var i = 0; i < collection.length; i++) {
      var num = collection[i];
      if (num !== "-") {
        if (numCounts[num]) {
          return false; // Invalid if number is repeated
        }
        numCounts[num] = 1;
      }
    }
    return true; // Valid if no repeats
  }

  /**
   * Converts the board to a human-readable string format.
   * @param {Array} boardArray - The current board as an array.
   * @returns {string} - The board formatted as a string for display.
   */
  function toString(boardArray) {
    return [0, 9, 18, 27, 36, 45, 54, 63, 72].map(function (i) {
      return getRow(boardArray, i).join(" "); // Format each row
    }).join("\n"); // Join rows with newlines
  }

  // Public or private exposure depending on the testable flag
  if (testable) {
    solver = {
      solve,
      solveAndPrint,
      recursiveSolve,
      boardIsInvalid,
      boardIsValid,
      boardIsSolved,
      getNextCellAndPossibilities,
      getAllIntersections,
      allRowsValid,
      getRow,
      allColumnsValid,
      getColumn,
      allBoxesValid,
      getBox,
      collectionIsValid,
      toString
    };
  } else {
    solver = { solve, solveAndPrint };
  }

  return solver;
}(TESTABLE);
