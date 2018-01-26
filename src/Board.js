// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      this.set('nQueens', true);
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },
    
    rowCopys: function() {
      var copy = [];
      for (var i = 0; i < this.get('n'); i++) {
        copy.push(this.rows()[i].slice());
      }
      return copy;
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      var thisRow = this.attributes[rowIndex];
      var first = false;
      for (var i = 0; i < thisRow.length; i++) {
        if (thisRow[i] === 1) {
          if (first === false) {
            first = true;
          } else {
            return true;
          }//end if first = false
        }//end if square = 1
      }//end for loop
      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var first = false;
      for (var i = 0; i < rows.length; i++) {
        if (rows[i][colIndex] === 1) {
          if (first === false) {
            first = true;
          } else {
            return true;
          }//end if first = false
        }//end if square = 1
      }//end for loop
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      for (var i = 0; i < this.attributes.n; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      if (majorDiagonalColumnIndexAtFirstRow > 0) {
        var rows = this.rows();
        var i = 0;
        var first = false;
        for (var j = majorDiagonalColumnIndexAtFirstRow; j < rows.length; j++) {
          //if j is negative, ignore this loop
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true; 
            }
          }
          i++;
        }
        return false;
      } else {
        var start = -1 * majorDiagonalColumnIndexAtFirstRow;
        var rows = this.rows();
        var n = this.get('n');
        //loop through remaining diagonals
        var j = 0;
        var first = false;
        for (var i = start; i < n; i++) {
          //iterate over elements in diagonal
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true;
            }
          }
          j++;
        }
        
        return false;
      }
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {
          return true;
        }
      }
      //check remaining diagonals (where first element is not in row i = 0)
      var rows = this.rows();
      var n = this.get('n');

      for (var start = 1; start < n; start++) {
        //loop through remaining diagonals
        var j = 0;
        var first = false;
        for (var i = start; i < n; i++) {
          //iterate over elements in diagonal
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true;
            }
          }
          j++;
        }
      }
      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      var rows = this.rows();
      if (minorDiagonalColumnIndexAtFirstRow < rows.length) {
        var i = 0;
        var first = false;
        for (var j = minorDiagonalColumnIndexAtFirstRow; j > -1; j--) {
          //if j is negative, ignore this loop
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true; 
            }
          }
          i++;
        }
        return false;
      } else {
        var rows = this.rows();
        var n = this.get('n');
        var start = minorDiagonalColumnIndexAtFirstRow - n;
        
        //loop through remaining diagnonals
        var j = n - 1;
        var first = false;
        for (var i = start; i < rows.length; i++) {
          //loop through elements in diagonal
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true;
            }
          }
          j--;
        }
        
        return false;
      }
      
      
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      for (var i = 0; i < this.get('n'); i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      //check remaining diagonals (where first element is not in row i = 0)
      var rows = this.rows();
      var n = this.get('n');

      for (var start = 1; start < n; start++) {
        //loop through remaining diagnonals
        var j = n - 1;
        var first = false;
        for (var i = start; i < rows.length; i++) {
          //loop through elements in diagonal
          if (rows[i][j] === 1) {
            if (first) {
              return true;
            } else {
              first = true;
            }
          }
          j--;
        }
      }
      return false;
    },
    
    hasPieceAtLoc: function(i, j) {
      var rows = this.rows();
      if (rows[i][j] === 1) {
        return true;
      } else {
        return false;
      }
    },
    
    countPieces: function() {
      var sum = 0;
      for (var i = 0; i < this.attributes.n; i++) {
        for (var j = 0; j < this.attributes.n; j++) {
          sum = sum + this.attributes[i][j];
        }
      }
      return sum;
    },
    
    nRooksIterator: function(callback, iStart) {
      var n = this.attributes.n;
      var rows = this.rows();
      var results = [];
      for (var j = 0; j < n; j++) {
        //if(iStart === 1) {debugger;}
        results = results.concat(callback.call(this, rows[iStart][j], iStart, j));
      }
      //console.log('Iterator results: ' + JSON.stringify(results));
      return results;
      //callback needs to return an array
      //it takes in value, i, j
      //it should not have any side effects
      //it is bound to the 'this' in nRooksIterator. 'this' is a board object
    },
    
    nRooksSolutionWorker: function(value, i, j) {
      var ans = [];
      
      if (value === 1) {
        return [];
      } 
      var newRows = this.rowCopys();
      
      var board = new Board(newRows);
      board.togglePiece(i, j);
      board.set('nQueens', this.get('nQueens'));
      //console.log('this board: ' + JSON.stringify(this.rows()) + '\nNew board w piece: ' + JSON.stringify(board.rows()));
      if ((board.get('nQueens') && !(board.hasAnyQueensConflicts())) || (!(board.get('nQueens')) && !(board.hasAnyRooksConflicts()))) {
        if (board.countPieces() >= board.attributes.n) {
          console.log('found a solution for ' + board.get('n') + 'pieces, queens = ' + this.get('nQueens'));
          console.log('About to return: ' + JSON.stringify(board.rows()));
          ans.push(board.rows());
        //might want to push on to ans
        } else {
          
          ans = ans.concat(board.nRooksIterator(board.nRooksSolutionWorker, i + 1));
        }
        /*var temp = board.nRooksIterator(board.nRooksSolutionWorker);
        ans = ans.concat(temp);
        */
        
      }
      return ans;
    }
    
    //IMPORTANT:
    //need mother function to call nRooksIterator and nRooksSolutionWorker.
    //also to create solution array, and add to it in even to solution.

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
