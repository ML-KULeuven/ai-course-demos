import { COLOUR } from './constants.js';
export default class CheckFinder {
  
    static isCurrentPlayerInCheck(tiles, player) {
        const kingPosition = this.getCurrentPlayersKing(tiles, player);
        const moves = this.getAllMovesForEnemyPlayer(tiles, player);

        for (let move of moves) {
            if (kingPosition === undefined) {
                return true;
            }
            if (move.x == kingPosition.x && move.y == kingPosition.y) {
                return true;
            }
        }
        return false;
    }

    static getCurrentPlayersKing(tiles, player) {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) { 
                if (tiles[i][j] && tiles[i][j].type === 'king' && tiles[i][j].colour === player) { // instanceof causes circular dependency, not happy with this hack
                    return tiles[i][j];
                }
            }
        }
        return undefined;
    }

    static getAllMovesForEnemyPlayer(tiles, player) {
        let enemy = player === COLOUR.WHITE ? COLOUR.BLACK : COLOUR.WHITE;
        let moves = [];

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) { 
                if (tiles[i][j] && tiles[i][j].colour === enemy) {
                    moves.push(...tiles[i][j].findMoves(tiles));
                }
            }
        }
        return moves;
    }

    static findMovesAdvanced(tiles, player) {
        let legalMoves = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) { 
                if (tiles[i][j] && tiles[i][j].colour === player) {
                    const moves = tiles[i][j].findMoves(tiles);
                    for (let move of moves) {
                        if (!this.movePutsPlayerInCheck(i, j, move.x, move.y, tiles, player)) {
                            legalMoves.push({ old: {x: i,y: j}, new: {x: move.x,y: move.y}});
                        }
                    }
                }
            }
        }
        return legalMoves;
    }

    static findMovesForCheckedPlayer(tiles, player) {
        let legalMoves = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) { 
                if (tiles[i][j] && tiles[i][j].colour === player) {
                    const moves = tiles[i][j].findMoves(tiles);
                    for (let move of moves) {
                        if (!this.movePutsPlayerInCheck(i, j, move.x, move.y, tiles, player)) {
                            legalMoves.push(move);
                        }
                    }
                }
            }
        }
        return legalMoves;
    }

    static movePutsPlayerInCheck(fromX, fromY, toX, toY, tiles, player) {
        const clonedTiles = _.cloneDeep(tiles);
        clonedTiles[fromX][fromY].move(toX, toY, clonedTiles);
        return this.isCurrentPlayerInCheck(clonedTiles, player);
    }
}