
      (function () {
        function generate_sudoku() {
          var starting_nums = [1, 4, 7, 2, 5, 8, 3, 6, 9],
              SIZE = 9, BLOCK = Math.sqrt(SIZE) | 0,
              board = [];
          for (var i = 0; i < SIZE; i++) {
            var row = [], starting = starting_nums[i];
            for (var j = 0; j < SIZE; j++) {
              row.push(starting++);
              if (starting == SIZE + 1) { starting = 1; }
            }
            board.push(row);
          }
  
          function transpose(array) {
            return array[0].map(function(_, i) {
              return array.map(function(row) {
                return row[i];
              });
            });
          }
          function swapRows(array) {
            var row1 = (Math.random() * SIZE) | 0,
                blockInd = row1 / BLOCK | 0, // Which block row1 is in.
                row2 = row1;
            while (row2 == row1) { row2 = BLOCK * blockInd + ((Math.random() * BLOCK) | 0); }
            var r1 = array[row1].slice(), r2 = array[row2].slice();
            array[row1] = r2; array[row2] = r1;
            return array;
          }
          function swapRowBlocks(array) {
            var b1 = (Math.random() * BLOCK) | 0, b2 = b1;
            while (b2 == b1) { b2 = (Math.random() * BLOCK) | 0; }
            for (var i = 0; i < BLOCK; i++) {
              var row1 = b1 * BLOCK + i, row2 = b2 * BLOCK + i,
                  r1 = array[row1].slice(), r2 = array[row2].slice();
              array[row1] = r2; array[row2] = r1;
            }
          }
  
          var ITERS = 500;
          for (var i = 0; i < ITERS; i++) {
            switch (i % 4) {
              case 0: // Row swap.
                swapRows(board);
                break;
              case 1: // Col swap.
                board = transpose(swapRows(transpose(board)));
                break;
              case 2:
                swapRowBlocks(board);
                break;
              case 3: // Transpose
                board = transpose(board);
                break;
            }
          }
  
          var selected = {}, num_selected = 30;
          for (var ind = 0; ind < num_selected; ind++) {
            var i = (Math.random() * SIZE) | 0, j = (Math.random() * SIZE) | 0;
            if (selected[[i + 1,j + 1]]) { ind--; }
            selected[[i + 1,j + 1]] = board[i][j];
          }
          return selected;
        }
        var node = $('#sudoku'), SIZE = 9, BLOCK_SIZE = Math.sqrt(SIZE) | 0, filled_in = {};
        var evil = [ [[1, 1], 6], [[1, 5], 2], [[1, 6], 5], [[1, 7], 8],
                        [[2, 5], 7], [[3, 1], 8], [[3, 3], 4], [[3, 9], 9],
                        [[4, 1], 4], [[4, 3], 7], [[4, 4], 3], [[4, 8], 2],
                        [[5, 2], 1], [[5, 8], 9], [[6, 2], 8], [[6, 6], 4],
                        [[6, 7], 5], [[6, 9], 7], [[7, 1], 3], [[7, 7], 7],
                        [[7, 9], 2], [[8, 5], 9], [[9, 3], 2], [[9, 4], 5],
                        [[9, 5], 6], [[9, 9], 1] ];
         evil.forEach(function (x) {
           filled_in[x[0]] = x[1];
         });
  
        function visualize(assigned) {
          var text = '', divider = '';
          for (var i = 0; i <= SIZE * 4 - 1; i++) { divider += '-'; }
          text += divider + '</br>';
          for (var i = 1; i <= SIZE; i++) {
            var row = '|';
            for (var j = 1; j <= SIZE; j++) {
              row += assigned[[i, j]] || '&nbsp; ';
              row += j % BLOCK_SIZE != 0 ? ' &nbsp; ' : ' | '; // block boundaries.
            }
            text += row + '</br>';
            if (i % BLOCK_SIZE == 0) { text += divider + '<br/>'; }
          }
          node.html(text);
          return text;
        }
  
        function solve_sudoku() {
           var domain = [],
               sudoku = {}, variables = {}, constraints = [];
  
           for (var i = 1; i <= SIZE; i++) { domain.push(i); }
           function neq(x, y) { return x != y; }
  
           for (var i = 1; i <= SIZE; i++) {
             for (var j = 1; j <= SIZE; j++) {
               var fi = filled_in[[i,j]];
               variables[[i, j]] = fi ? [fi] : domain.slice();
  
               // Vertical and horizontal constraints.
               for (var k = 1; k <= SIZE; k++) {
                 if (neq(i, j)) {
                   constraints.push([[i, k], [j, k], neq]);
                   constraints.push([[k, i], [k, j], neq]);
                 }
               }
               // Block constraints.
               var v = (i - 1) / BLOCK_SIZE | 0, h = (j - 1) / BLOCK_SIZE | 0;
               for (var k = v * 3; k < (v + 1) * BLOCK_SIZE; k++) {
                 for (var m = h * 3; m < (h + 1) * BLOCK_SIZE; m++) {
                   if (neq(i, k + 1) || neq(j, m + 1)) {
                     constraints.push([[k + 1, m + 1], [i, j], neq]);
                   }
                 }
               }
             }
           }
           // Braces hell. Sorry.
  
           sudoku.variables = variables;
           sudoku.constraints = constraints;
           sudoku.cb = visualize;
           sudoku.timeStep = 500;
  
           var result = csp.solve(sudoku);
         }
         
         $('#sudoku-start').html(visualize(filled_in));
         visualize({});
         $('#sudoku-button').click(solve_sudoku);
        })();
        