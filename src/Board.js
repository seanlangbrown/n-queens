// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
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
      console.log('called hasRowConflictAt');
      //return false; // fixme
      //get row
      var row = this.rows()[rowIndex];
      //sum contents
      var pieces = _.reduce(row, function(tot, piece) {
        return tot + piece;
      }, 0);
      //if sum > 1: return true
      return pieces > 1;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      //for each row, check conflits (sum queens)
      //if any row sum > 1; return true
      var rows = this.rows();
      var rowCounts = _.map(rows, function(row) {
        return _.reduce(row, function(tot, piece) {
          return tot + piece;
        }, 0);
      });
      //console.log(rowCounts);

      return _.some(rowCounts, function(count) {
        return count > 1;
      });
      
    },



    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //get a single column
      var rows = this.rows();
      var col = _.map(rows, function(row) {
        return row[colIndex];
      });
      //if sum of pieces in column is > 1, return true
      return _.reduce(col, function(tot, piece) {
        return tot + piece;
      }, 0) > 1;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      var rows = this.rows();
      var columnsWithPieces = [];

      for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[i][j] === 1) {
            if (columnsWithPieces[j] === 1) { //the first time we find more than one piece in a row, return true
              return true;
            }
            columnsWithPieces[j] = 1;
          }
        }
      }

      return false;

    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      console.log('called hasMajorDiagonalConflictAt');
      var rows = this.rows();
      var piecesOnDiagonal = 0;

      for (var i = 0; i < rows.length && j < rows.length; i ++) {
        var j = majorDiagonalColumnIndexAtFirstRow + i;
        if (this._getFirstRowColumnIndexForMajorDiagonalOn(i, j) === majorDiagonalColumnIndexAtFirstRow && rows[i][j] === 1) {
          if (piecesOnDiagonal === 1) {
            return true;
          }
          piecesOnDiagonal = 1;
        }
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      var rows = this.rows();
      var diagonalsWithPieces = [];

      for (var i = 0; i < rows.length; i ++) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[i][j] === 1) {
            if (diagonalsWithPieces[this._getFirstRowColumnIndexForMajorDiagonalOn(i, j)] === 1) {
              //console.log(i + j);
              return true;
            }
            diagonalsWithPieces[this._getFirstRowColumnIndexForMajorDiagonalOn(i, j)] = 1;
          }
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
      var diagonalsWithPieces = [];

      for (var i = 0; i < rows.length; i ++) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[i][j] === 1) {
            if (this._getFirstRowColumnIndexForMinorDiagonalOn(i, j) === minorDiagonalColumnIndexAtFirstRow && diagonalsWithPieces[this._getFirstRowColumnIndexForMinorDiagonalOn(i, j)] === 1) {
              console.log(i + j);
              return true;
            }
            diagonalsWithPieces[this._getFirstRowColumnIndexForMinorDiagonalOn(i, j)] = 1;
          }
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var rows = this.rows();
      var diagonalsWithPieces = [];

      for (var i = 0; i < rows.length; i ++) {
        for (var j = 0; j < rows.length; j++) {
          if (rows[i][j] === 1) {
            if (diagonalsWithPieces[this._getFirstRowColumnIndexForMinorDiagonalOn(i, j)] === 1) {
              console.log(i + j);
              return true;
            }
            diagonalsWithPieces[this._getFirstRowColumnIndexForMinorDiagonalOn(i, j)] = 1;
          }
        }
      }
      return false;
    },

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
