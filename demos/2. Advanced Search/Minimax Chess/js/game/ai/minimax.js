import {COLOUR} from '../constants.js';
import CheckFinder from '../checkFinder.js';
import Evaluation from './evaluation_function.js';
export default class Minimax {

    
    static nodeId = 0;
    static flatData = [];

    static minimaxRoot(depth, tiles, isMaximisingPlayer) {
        
        let newGameMoves = CheckFinder.findMovesAdvanced(tiles, COLOUR.BLACK);
        let bestMove = -9999;
        let bestMoveFound;

        this.flatData.push({
            "id": this.nodeId,
            "parent": null,
            "depth": depth,
            "minimax": Evaluation.evaluateBoard(tiles),
            "board": tiles,
            "children": null
        });

        for(let i = 0; i < newGameMoves.length; i++) {
            this.nodeId++;
            let newGameMove = newGameMoves[i];
            var value = this.root_move_evaluation(newGameMove, tiles, depth, isMaximisingPlayer, tree);
            if(value >= bestMove) {
                bestMove = value;
                bestMoveFound = newGameMove;
            }
        }

        this.flatData.forEach(element => {
            if(element.depth == 0) {
                if(element.minimax == -bestMove){
                    element.best = true;
                }
            }
        });

        // Make tree from flat array
        _(this.flatData).forEach(a => {
            a.children = _(this.flatData).filter(b => b.parent==a.id).value();
        });
        let treeData = _(this.flatData).filter(a=>a.parent==null).value()[0];

        // Cleanup
        this.nodeId = 0;
        this.flatData = [];

        return {bestMoveFound, treeData};
    };

    static root_move_evaluation(move, tiles, depth, isMaximisingPlayer, treeData) {
        let clonedTiles = _.cloneDeep(tiles);
        treeData.board = clonedTiles;
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        return this.minimax(depth - 1, clonedTiles, -10000, 10000, !isMaximisingPlayer, treeData, 0);
    }

    static minimax(depth, tiles, alpha, beta, isMaximisingPlayer, treeData, parentId) {
        this.flatData.push({
            "id": this.nodeId,
            "parent": parentId,
            "depth": depth,
            "minimax": Evaluation.evaluateBoard(tiles),
            "best": false,
            "board": tiles,
            "children": null
        });

        if (depth === 0) {
            return -Evaluation.evaluateBoard(tiles);
        }

        let currentNode = this.nodeId;

        if (isMaximisingPlayer) {
            let newGameMoves = CheckFinder.findMovesAdvanced(tiles, COLOUR.BLACK);
            let bestMove = -9999;
            for (let i = 0; i < newGameMoves.length; i++) {
                ++this.nodeId;
                bestMove = this.max_move_evaluation(bestMove, newGameMoves[i], tiles, depth, alpha, beta, isMaximisingPlayer, treeData, currentNode);

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
                ++this.nodeId;
                bestMove = this.min_move_evaluation(bestMove, newGameMoves[i], tiles, depth, alpha, beta, isMaximisingPlayer, treeData, currentNode);

                beta = Math.min(beta, bestMove);

                if (beta <= alpha) {
                    return bestMove;
                }
            }
            return bestMove;
        }
    }

    static max_move_evaluation(bestMove, move, tiles, depth, alpha, beta, isMaximisingPlayer, treeData, parentNode) {
        let clonedTiles = _.cloneDeep(tiles);
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        return Math.max(bestMove, this.minimax(depth - 1, clonedTiles, alpha, beta, !isMaximisingPlayer, treeData, parentNode));
    }

    static min_move_evaluation(bestMove, move, tiles, depth, alpha, beta, isMaximisingPlayer, treeData, parentNode) {
        let clonedTiles = _.cloneDeep(tiles);
        clonedTiles[move.old.x][move.old.y].userMove(move.new.x, move.new.y, clonedTiles);
        return Math.min(bestMove, this.minimax(depth - 1, clonedTiles, alpha, beta, !isMaximisingPlayer, treeData, parentNode));
    }
}