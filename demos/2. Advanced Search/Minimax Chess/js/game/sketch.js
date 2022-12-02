import Board from './board.js';

let canvas;
let board;

function setup (){
  canvas = createCanvas(400, 400);
  canvas.parent("chess_board");
  board = new Board();
  laserBar();
}

function draw(){
  background(0);
  board.draw();
}

function mouseClicked() {
  const x = mouseX;
  const y = mouseY;
  let depth = $('#show-depth').text();
  board.userClick(x, y, depth);
  laserBar();
}

function undo() {
  board.undoAction();
}

function redo() {
  board.redoAction();
}

function newGame() {
  setup();
  $('#tree').css("padding-bottom","0%");
}

function score() {
  return board.getScore();
}

function laserBar() {
  let percentage = 50;

  if ((score())>100){
    percentage = 100;
  } else if (score()<-100){
    percentage = 0;
  } else {
    percentage = percentage + score()/2;
  }

  document.getElementById("score").innerText = "Score: " + score();

  let good = document.getElementById("good");
  let evil = document.getElementById("evil");
  good.style.width = percentage+"%";
  evil.style.width = 100-percentage+"%";
}

window.setup = setup;
window.draw = draw;
window.mouseClicked = mouseClicked;

//Start or Stop the animation
document.getElementById("undoButton").addEventListener("click", undo);
document.getElementById("redoButton").addEventListener("click", redo);
document.getElementById("newGameButton").addEventListener("click", newGame);