// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        // console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        // console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        // console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
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
      let rows = this.get(rowIndex);
      let counter = 0;

      for (let i = 0; i < rows.length; i++) {
        if (rows[i]) {
          counter++;

          if (counter > 1) {
            return true;
          }
        }
      }

      return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      let size = this.get('n');

      for (let i = 0; i < size; i++) {
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
      let cols = [];
      let counter = 0;
      let board = this.rows();


      for (let i = 0; i < board.length; i++) {
        if (board[i][colIndex]) {
          if (!cols[colIndex]) {
            cols[colIndex] = 1;
          } else {
            return true;
          }
        } 
      }

      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      let size = this.rows();

      for (let i = 0; i < size.length; i++) {
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
      // initialize variables board to rows call, 
      let board = this.rows();
      //colIndex to input, 
      let colIndex = majorDiagonalColumnIndexAtFirstRow;
      //rowIndex to zero and 
      let rowIndex = 0;
      //queenSeen to false
      let queenSeen = false;

      // while we are still in b0unds
      while (this._isInBounds(rowIndex, colIndex)) {
        // if there is a queen at the current index
        if (board[rowIndex][colIndex]) {
          //if the queen has been seen,
          if (queenSeen) {
            //return true;
            return true;
          //otherwise
          } else {
            //set queenSeen to true
            queenSeen = true;
          }
        }
        //increment the column
        colIndex++;
        //increment the row index
        rowIndex++;
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      let board = this.rows();
      // let colIndex = 0;
      // let rowIndex = 0;

      // check if board has any major diagonal conflicts from row 0
      // debugger;
      for (let i = board.length - 1; i >= 0; i--) {
        for (let j = 0; j < board.length; j++) {
          if (this.hasMajorDiagonalConflictAt(i)) {
            return true;
          }
        }
      }

      return false; 
    },

    // _getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)


    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      return false; // fixme
    }

    // _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex)

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
