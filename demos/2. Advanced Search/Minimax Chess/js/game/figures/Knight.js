import Piece from './Piece.js';
export default class Knight extends Piece {
    constructor(x, y, colour, sprite) {
        super(x, y, colour, sprite);
        this.type = 'knight';
    }


    findMoves(tiles) {
        let moves = [];

        moves.push(this.getMove(2, -1, tiles));
        moves.push(this.getMove(1, -2, tiles));
        moves.push(this.getMove(-1, -2, tiles));
        moves.push(this.getMove(-2, -1, tiles));
        moves.push(this.getMove(-2, 1, tiles));
        moves.push(this.getMove(-1, 2, tiles));
        moves.push(this.getMove(1, 2, tiles));
        moves.push(this.getMove(2, 1, tiles));

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
                return {x : newX, y: newY};         
            }
        } else {
            return  {x : newX, y: newY};
        }
    }
}