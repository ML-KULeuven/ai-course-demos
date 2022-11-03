import CSP from '../CSP.js';
import SudokuBoard from './sudoku.js';
import {SIZE, BLOCK} from './constants_sudoku.js';

function visualize(assigned) {
  let text = '', divider = '';

  for (let i = 0; i <= SIZE * 4 - 1; i++) { 
    divider += '-'; 
  }

  text += divider + '</br>';

  for (let i = 1; i <= SIZE; i++) {
    let row = '|';

    for (let j = 1; j <= SIZE; j++) {
      row += assigned[[i, j]] || '&nbsp; ';
      row += j % BLOCK != 0 ? ' &nbsp; ' : ' | '; // block boundaries.
    }

    text += row + '</br>';

    if (i % BLOCK == 0) { 
      text += divider + '<br/>'; 
    }

  }

  node.html(text);
  return text;
}

function solveSudoku() {
  console.log('test');

  let result = csp_solver.solve(sudoku);
}

let sudokuBoard = new SudokuBoard();
let csp_solver = new CSP();
let node = $('#sudoku');
let sudoku = {};

sudokuBoard.generate_constraints();

sudoku.variables = sudokuBoard.getVariables();
sudoku.constraints = sudokuBoard.getConstraints();
sudoku.filled_in = sudokuBoard.getFilledIn();
sudoku.cb = visualize;
sudoku.timeStep = 500;

node.html(visualize(sudokuBoard.getFilledIn()));

$('#sudoku-button').click(solveSudoku);