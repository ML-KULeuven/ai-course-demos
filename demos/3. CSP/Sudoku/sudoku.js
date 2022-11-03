// Remade code from the following source: 
// https://github.com/PrajitR/jusCSP/

import { SIZE, BLOCK } from "./constants_sudoku.js";

export default class SudokuBoard {

    constructor() {
        this.domain = [];
        this.variables = {};
        this.constraints = [];
        this.filled_in = this.setup();
        console.log(this.filled_in);
    }

    getVariables() {
        return this.variables;
    }

    getConstraints() {
        return this.constraints;
    }

    getFilledIn() {
        return this.filled_in;
    }

    // Generate a random Sudoku board
    setup() {
        let starting_nums = [1, 4, 7, 2, 5, 8, 3, 6, 9];
        let board = [];

        for (let i = 0; i < SIZE; i++) {
            let row = [];
            let starting = starting_nums[i];
            for (let j = 0; j < SIZE; j++) {
                row.push(starting++);
                if (starting == SIZE + 1) { 
                    starting = 1; 
                }
            }
            board.push(row);
        }

        let ITERS = 500;
        for (let i = 0; i < ITERS; i++) {
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

        console.log(board);

        let selected = {};
        let num_selected = 30;
        for (let k = 0; k < num_selected; k++) {
            let i = (Math.random() * SIZE) | 0;
            let j = (Math.random() * SIZE) | 0;
            
            if (selected[[i + 1,j + 1]]) { 
                k--; 
            }

            selected[[i + 1,j + 1]] = board[i][j];
        }
        console.log(selected);
        return selected;

        function transpose(array) {
            return array[0].map(function(_, i) {
                return array.map(function(row) {
                    return row[i];
                });
            });
        }

        function swapRows(array) {
            let row1 = (Math.random() * SIZE) | 0;
            let blockInd = row1 / BLOCK | 0; // Which block row1 is in.
            let row2 = row1;

            while (row2 == row1) { 
                row2 = BLOCK * blockInd + ((Math.random() * BLOCK) | 0); 
            }

            let r1 = array[row1].slice();
            let r2 = array[row2].slice();
            array[row1] = r2; array[row2] = r1;

            return array;
        }

        function swapRowBlocks(array) {
            let b1 = (Math.random() * BLOCK) | 0, b2 = b1;

            while (b2 == b1) { 
                b2 = (Math.random() * BLOCK) | 0; 
            }

            for (let i = 0; i < BLOCK; i++) {
                let row1 = b1 * BLOCK + i;
                let row2 = b2 * BLOCK + i;
                let r1 = array[row1].slice();
                let r2 = array[row2].slice();
                array[row1] = r2; array[row2] = r1;
            }
        }
    }



    generate_constraints() {
        for (var i = 1; i <= SIZE; i++) { 
            this.domain.push(i); // Range from 1 to 9.
        }

        for (let i = 1; i <= SIZE; i++) {
            for (let j = 1; j <= SIZE; j++) {
                let fi = this.filled_in[[i,j]];
                this.variables[[i, j]] = fi ? [fi] : this.domain.slice();
            
                this.vertical_horizontal_constraints(i,j);
                this.block_constraints(i,j);
            }
        }
    }

    // The vertical and horizontal constraints
    vertical_horizontal_constraints(i, j) {
        for (let k = 1; k <= SIZE; k++) {
            if (this.neq(i, j)) {
              this.constraints.push([[i, k], [j, k], this.neq]);
              this.constraints.push([[k, i], [k, j], this.neq]);
            }
        }
    }

    // The constraints in the block
    block_constraints(i, j) {
        let v = (i - 1) / BLOCK | 0;
        let h = (j - 1) / BLOCK | 0;
        for (let k = v * 3; k < (v + 1) * BLOCK; k++) {
            for (let m = h * 3; m < (h + 1) * BLOCK; m++) {
                if (this.neq(i, k + 1) || this.neq(j, m + 1)) {
                    this.constraints.push([[k + 1, m + 1], [i, j], this.neq]);
                }
            }
        }
    }

    // Determine if equal or not
    neq(x, y) { 
        return x != y; 
    }
}
