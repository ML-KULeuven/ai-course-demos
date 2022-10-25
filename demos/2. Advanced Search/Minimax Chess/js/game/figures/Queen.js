import { COLOUR } from '../constants.js';
import Piece from './Piece.js';
export default class Queen extends Piece {
    constructor(x, y, colour, sprite) {
        super(x, y, colour, sprite);
        this.type = 'queen';
    }

    findMoves(tiles) {
        let moves = [];
        moves.push(...this.findAllMoves(1, -1, tiles));
        moves.push(...this.findAllMoves(-1, -1, tiles));
        moves.push(...this.findAllMoves(1, 1, tiles));
        moves.push(...this.findAllMoves(-1, 1, tiles));
        moves.push(...this.findAllMoves(1, 0, tiles));
        moves.push(...this.findAllMoves(0, -1, tiles));
        moves.push(...this.findAllMoves(-1, 0, tiles));
        moves.push(...this.findAllMoves(0, 1, tiles));
        return moves;
    }

    findAllMoves(xDir, yDir, tiles) {
        let moves = [];
        for (let i = 1; i < 4; i++) {
            let newX = this.x + (xDir * i);
            let newY = this.y + (yDir * i);

            if (this.isOffBoard(newX, newY)) {
                return moves;
            }

            if (tiles[newX][newY]) {
                if (tiles[newX][newY].colour !== this.colour) {
                    moves.push({x : newX, y: newY});         
                }
                return moves;
            }
            moves.push({x : newX, y: newY});
        }
        return moves;
    }
}