import {COLOUR, SIZE} from './constants.js';
import Pawn from './figures/Pawn.js';
import Rook from './figures/Rook.js';
import King from './figures/King.js';
import Queen from './figures/Queen.js';
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
        this.tree = new MinimaxTree();
    }

    createTiles() {
        let tiles = this.createEmptyBoard();

        for (let i = 0; i < 4; i++) { 
            tiles[i][1] = new Pawn(i, 1, COLOUR.BLACK, '♟');
            tiles[i][2] = new Pawn(i, 2, COLOUR.WHITE, '♙');
        }

        tiles[0][0] = new Rook(0, 0, COLOUR.BLACK, '♜');
        tiles[3][0] = new Rook(3, 0, COLOUR.BLACK, '♜');
        tiles[0][3] = new Rook(0, 3, COLOUR.WHITE, '♖');
        tiles[3][3] = new Rook(3, 3, COLOUR.WHITE, '♖');

        tiles[2][0] = new King(2, 0, COLOUR.BLACK, '♚');
        tiles[2][3] = new King(2, 3, COLOUR.WHITE, '♔');

        tiles[1][0] = new Queen(1, 0, COLOUR.BLACK, '♛');
        tiles[1][3] = new Queen(1, 3, COLOUR.WHITE, '♕');

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
                    fill(255,212,128);
                    rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
                    pop();
                } else {
                    push();
                    fill(204,136,0);
                    rect(x, y, this.sizeOfSquare, this.sizeOfSquare);
                    pop();
                }
                if (currentTile)  {
                    currentTile.draw(x, y);
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
                    alert("Black won!");
                } else {
                    alert("White won!");
                }
            }
        }
    }

    enemyMove() {
        let {bestMoveFound, treeData} = Minimax.minimaxRoot(5, this.tiles, true);

        //Build minimax tree
        this.tree.buildRoot(treeData);

        if (bestMoveFound === undefined) {
            alert("White won!");
        } else {
            this.move(bestMoveFound.old, bestMoveFound.new);
        }
    }

    undoAction() {
        this.history.undo();
        this.tiles = this.history.getCurrentBoardState();
        this.selected = undefined;
    }

    redoAction() {
        this.history.redo();
        this.tiles = this.history.getCurrentBoardState();
        this.selected = undefined;
    }

    getScore() {
        return Evaluation.evaluateBoard(this.tiles);
    }

    isOffBoard(x, y) {
        return x > 3 || x < 0 || y > 3 || y < 0;
    }
}