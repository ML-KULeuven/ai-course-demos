import CheckFinder from '../checkFinder.js';
import Piece from './Piece.js';
export default class King extends Piece {
    constructor(x, y, colour, sprite) {
        super(x, y, colour, sprite);
        this.type = 'king';
    }

    findMoves(tiles) {
        let moves = [];

        moves.push(this.getMove(1, 0, tiles));
        moves.push(this.getMove(-1, 0, tiles));
        moves.push(this.getMove(0, 1, tiles));
        moves.push(this.getMove(0, -1, tiles));
        moves.push(this.getMove(1, -1, tiles));
        moves.push(this.getMove(-1, -1, tiles));
        moves.push(this.getMove(-1, 1, tiles));
        moves.push(this.getMove(1, 1, tiles));

        return moves.filter(n => n);
    }

    getMove(xDir, yDir, tiles) {
        let newX = this.x + xDir;
        let newY = this.y + yDir;
        if (this.isOffBoard(newX, newY)) {
            return;
        }

        if (tiles[newX][newY]) {
            if (tiles[newX][newY].colour !== this.colour) {
                //print({ old: [this.x,this.y], new: [newX,newY]});
                return { x: newX, y: newY };
            }
        } else {

            return { x: newX, y: newY };
        }
    }

    move(toX, toY, tiles) {
        super.move(toX, toY, tiles);
    }

}