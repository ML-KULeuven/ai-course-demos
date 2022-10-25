import Board from './board.js';

let canvas;
let board;

function setup (){
  canvas = createCanvas (400, 400);
  canvas.parent("chess_board");
  board = new Board();
}

function draw(){
  background(220);
  board.draw();
  document.getElementById("score").innerText = score();
}

function mouseClicked() {
  const x = mouseX;
  const y = mouseY;
  board.userClick(x, y);
}

function undo() {
  board.undoAction();
}

function redo() {
  board.redoAction();
}

function score() {
  return board.getScore();
}

window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;

//Start or Stop the animation
document.getElementById("undoButton").addEventListener("click", undo);
document.getElementById("redoButton").addEventListener("click", redo);