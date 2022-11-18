import {COLOUR, SIZE} from './constants.js';
import Pawn from './figures/Pawn.js';
import Rook from './figures/Rook.js';
import King from './figures/King.js';
import Queen from './figures/Queen.js';
import Knight from './figures/Knight.js';
import Bishop from './figures/Bishop.js';
import CheckFinder from './checkFinder.js';
import History from './history.js';
import Minimax from './ai/minimax.js';
import Evaluation from './ai/evaluation_function.js';
import MinimaxTree from './tree/minimaxTree.js';

export default class Board {

    constructor() {
        this.sizeOfSquare = SIZE / 4;
        this.tiles = this.createTiles();
        this.turn = COLOUR.WHITE;
        this.isInCheck = false;
        this.history = new History(this.tiles);
    }

    createTiles() {
        let tiles = this.createEmptyBoard();

        function getRandPos() {
            return [Math.floor(Math.random() * 4), Math.floor(Math.random() * 2)];
        }
        function isAdjacent(pos1, pos2) {

            if (pos1[0] == pos2[0] || pos1[0] == pos2[0]-1 || pos1[0] == pos2[0]+1)
            if (pos1[1] == pos2[1] || pos1[1] == pos2[1]-1 || pos1[1] == pos2[1]+1)
              return true;
            return false;
        }
        
        // Place Pieces
        for (let i = 0; i < 4; i++) { 
            for (let j = 0; j < 4; j++) {
                let randomNum = Math.floor(Math.random() * 20);
                if (randomNum < 5) {
                    if (j < 2) {
                        tiles[i][j] = new Pawn(i, j, COLOUR.BLACK, '♟');
                    } else {
                        tiles[i][j] = new Pawn(i, j, COLOUR.WHITE, '♙');
                    }
                } else if (randomNum < 7) {
                    if (j < 2) {
                        tiles[i][j] = new Knight(i, j, COLOUR.BLACK, '♞');
                    } else {
                        tiles[i][j] = new Knight(i, j, COLOUR.WHITE, '♘');
                    }
                } else if (randomNum < 9) {
                    if (j < 2) {
                        tiles[i][j] = new Bishop(i, j, COLOUR.BLACK, '♝');
                    } else {
                        tiles[i][j] = new Bishop(i, j, COLOUR.WHITE, '♗');
                    }
                } else if (randomNum < 11) {
                    if (j < 2) {
                        tiles[i][j] = new Rook(i, j, COLOUR.BLACK, '♜');
                    } else {
                        tiles[i][j] = new Rook(i, j, COLOUR.WHITE, '♖');
                    }
                } else if (randomNum < 12) {
                    if (j < 2) {
                        tiles[i][j] = new Queen(i, j, COLOUR.BLACK, '♛');
                    } else {
                        tiles[i][j] = new Queen(i, j, COLOUR.WHITE, '♕');
                    }
                }
            }
        }

        // Place Kings
        let wk, bk;
        do { wk = getRandPos(); bk = getRandPos(); wk[1]+=2;}
        while (isAdjacent(wk, bk));
        tiles[wk[0]][wk[1]] = new King(wk[0], wk[1], COLOUR.WHITE, '♔');
        tiles[bk[0]][bk[1]] = new King(bk[0], bk[1], COLOUR.BLACK, '♚');

        return tiles;
    }
    
    createEmptyBoard() {
        let board = [];
        for (let i = 0; i < 4; i++) {
            board[i] = [];
            for (let j = 0; j < 4; j++) {
                board[i][j] = undefined;
            }
        }
        return board;
    }

    draw() {
        textAlign(CENTER, CENTER);
        textSize(80);
        rectMode(CENTER);
        for (let i = 0; i < 4; i++) {
            
            for (let j = 0; j < 4; j++) {
                const currentTile = this.tiles[i][j];
                const x =  this.getPos(i);
                const y = this.getPos(j);

                if ((i + j) % 2 != 0) {
                    push();
                    strokeWeight(0);
                    fill('rgb(181,189,206)');
                    rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
                    pop();
                } else {
                    push();
                    strokeWeight(0);
                    fill('rgb(233,236,240)');
                    rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
                    pop();
                }
                if (currentTile)  {
                    currentTile.draw(x, y+5);
                }
            }
        }
        this.displaySelected();
    }

    displaySelected() {
        if (this.selected) {
            const tile = this.tiles[this.selected.x][this.selected.y];
            if (tile) {
                push();
                strokeWeight(0);
                fill(0,255,0,127);
                for (const move of this.legalMoves) {
                    rect(this.getPos(move.x), this.getPos(move.y), this.sizeOfSquare, this.sizeOfSquare);
                }
                pop();
            }
        }
    }

    getPos(index) {
        let offset = this.sizeOfSquare/2;
        return index * this.sizeOfSquare + offset;
    }

    userClick(clientX, clientY) {
        const x = Math.floor(clientX / 100);
        const y = Math.floor(clientY / 100);
        this.select(x, y);
    }

    select(x, y) {
        if (this.isOffBoard(x, y) ) {
            this.selected = undefined;
        } else if (this.tiles[x][y] && this.tiles[x][y].colour === this.turn) {
            this.selected = JSON.parse(JSON.stringify(this.tiles[x][y]));
            this.legalMoves = this.tiles[this.selected.x][this.selected.y].findLegalMoves(this.tiles);
        } else if (this.selected) {
            const potentialMove = this.legalMoves.find(e => e.x == x && e.y == y);
            if (potentialMove) {
                this.move(this.selected, potentialMove);
                this.enemyMove();
                this.history.addBoardState(this.tiles);
            } else {
                this.selected = undefined;
            }
        } 
    }

    move(from, to) {
        this.turn = this.turn === COLOUR.WHITE ? COLOUR.BLACK : COLOUR.WHITE;
        this.tiles[from.x][from.y].userMove(to.x, to.y, this.tiles);
        this.selected = undefined;

        this.isInCheck = CheckFinder.isCurrentPlayerInCheck(this.tiles, this.turn);

        if (this.isInCheck) {
            let moves = CheckFinder.findMovesForCheckedPlayer(this.tiles, this.turn);
            if (moves.length === 0) {
                if (this.turn === COLOUR.WHITE) {
                    alert("You lost!\nSkynet will take over");
                } else {
                    alert("Congratulations!\nYou beat the minimax AI.");
                }
            }
        }
    }

    enemyMove() {
        let tempTiles = _.cloneDeep(this.tiles);
        let {bestMoveFound, treeData} = Minimax.minimaxRoot(2, tempTiles, true);

        //Build new minimax tree
        let tree = new MinimaxTree();
        tree.update(treeData);

        if (bestMoveFound === undefined) {
            return;
        } else {
            this.move(bestMoveFound.old, bestMoveFound.new);
        }
    }

    undoAction() {
        this.tiles = this.history.undo();;
        this.selected = undefined;
    }

    redoAction() {
        this.tiles = this.history.redo();
        this.selected = undefined;
    }

    getScore() {
        return Evaluation.evaluateBoard(this.tiles);
    }

    isOffBoard(x, y) {
        return x > 3 || x < 0 || y > 3 || y < 0;
    }
}