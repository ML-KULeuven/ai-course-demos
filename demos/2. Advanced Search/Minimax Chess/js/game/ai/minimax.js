import {COLOUR} from '../constants.js';
import CheckFinder from '../checkFinder.js';
import Evaluation from './evaluation_function.js';
export default class Minimax {

    static minimaxRoot(depth, tiles, isMaximisingPlayer) {
        
        let newGameMoves = CheckFinder.findMovesAdvanced(tiles, COLOUR.BLACK);
        let bestMove = -9999;
        let bestMoveFound;

        let treeData = {
            "name": "Top Level",
            "children": [
                { 
                    "name": "Level 2: A",
                    "minimax": 100,
                    "children": [
                        { "name": "Son of A" },
                        { "name": "Daughter of A" }
                    ]
                },
                { 
                    "name": "Level 2: B",
                    "minimax": 100 
                }
            ]
        };

        for(let i = 0; i < newGameMoves.length; i++) {
            let newGameMove = newGameMoves[i];
            var value = this.root_move_evaluation(newGameMove, tiles, depth, isMaximisingPlayer);
            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }

        return {bestMoveFound, treeData};
    };

    static root_move_evaluation(move, tiles, depth, isMaximisingPlayer) {
        let clonedTiles = _.cloneDeep(tiles);
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        return this.minimax(depth - 1, clonedTiles, -10000, 10000, !isMaximisingPlayer);
    }

    static minimax(depth, tiles, alpha, beta, isMaximisingPlayer) {
        if (depth === 0) {
            return -Evaluation.evaluateBoard(tiles);
        }

        if (isMaximisingPlayer) {
            let newGameMoves = CheckFinder.findMovesAdvanced(tiles, COLOUR.BLACK);
            let bestMove = -9999;
            for (let i = 0; i < newGameMoves.length; i++) {
                bestMove = this.max_move_evaluation(bestMove, newGameMoves[i], tiles, depth, alpha, beta, isMaximisingPlayer);

                alpha = Math.max(alpha, bestMove);

                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        } else {
            let newGameMoves = CheckFinder.findMovesAdvanced(tiles, COLOUR.WHITE);
            let bestMove = 9999;
            for (var i = 0; i < newGameMoves.length; i++) {
                bestMove = this.min_move_evaluation(bestMove, newGameMoves[i], tiles, depth, alpha, beta, isMaximisingPlayer);

                beta = Math.min(beta, bestMove);

                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    }

    static max_move_evaluation(bestMove, move, tiles, depth, alpha, beta, isMaximisingPlayer) {
        let clonedTiles = _.cloneDeep(tiles);
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        
        return Math.max(bestMove, this.minimax(depth - 1, clonedTiles, alpha, beta, !isMaximisingPlayer));
    }

    static min_move_evaluation(bestMove, move, tiles, depth, alpha, beta, isMaximisingPlayer) {
        let clonedTiles = _.cloneDeep(tiles);
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        
        return Math.min(bestMove, this.minimax(depth - 1, clonedTiles, alpha, beta, !isMaximisingPlayer));
    }
}