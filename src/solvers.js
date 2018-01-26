/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = [];
  var board = new Board({n: n});
  board.set('nQueens', false);
  var solution = board.nRooksIterator(board.nRooksSolutionWorker, 0);
  
  /*(value, i, j, function() {
    solution.push(this);
  }))
  */
  if (solution.length > 0) {
    console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution[0]));
    return solution[0];
  } else {
    console.log('No solution found for ' + n);
    return null;
  }
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  //We realize that this function uses a general formula rather than counting our solutions. We found this pattern,
  //and made the solution more efficient. The countNQueensSolutions function is more complex.
  
  var factorial = function(value) {
    if (value === 0) { return 1; }
    if (value === 1) { return 1; }
    return value * factorial(value - 1);
  };
  
  var solutionCount = factorial(n);

  console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = [];
  var board = new Board({n: n});
  board.set('nQueens', true);
  var solution = board.nRooksIterator(board.nRooksSolutionWorker, 0);

  if (solution.length > 0) {
    console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution[0]));
    return solution[0];
  } else {
    console.log('No solution found for ' + n);
    return board.rows();
  }
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  if (n === 0) {
    return 1;
  }
  var solution = [];
  var board = new Board({n: n});
  board.set('nQueens', true);
  var solution = board.nRooksIterator(board.nRooksSolutionWorker, 0);

  return solution.length;
};
