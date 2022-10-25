import { COLOUR, PAWN_EVAL_WHITE, PAWN_EVAL_BLACK, ROOK_EVAL_WHITE, ROOK_EVAL_BLACK, QUEEN_EVAL, KING_EVAL_WHITE, KING_EVAL_BLACK} from "../constants.js";

export default class EvaluationFunction {

    /* 
    * Evaluates the board at this point in time, 
    * using the material weights and piece square tables.
    */
    static evaluateBoard(tiles) {
        var totalEvaluation = 0;
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                totalEvaluation = totalEvaluation + this.getPieceValue(tiles[i][j], i ,j);
            }
        }
        return totalEvaluation;
    }

    static getPieceValue(piece, x, y) {
        let absoluteValue;

        if (piece === undefined) {
            return 0;
        } else {
            if (piece.type === 'pawn') {
                absoluteValue = 10 + ( piece.isWhite() ? PAWN_EVAL_WHITE[y][x] : PAWN_EVAL_BLACK[y][x] );
            } else if (piece.type === 'rook') {
                absoluteValue = 50 + ( piece.isWhite() ? ROOK_EVAL_WHITE[y][x] : ROOK_EVAL_BLACK[y][x]);
            } else if (piece.type === 'queen') {
                absoluteValue = 90 + QUEEN_EVAL[y][x];
            } else if (piece.type === 'king') {
                absoluteValue = 900 + ( piece.isWhite() ? KING_EVAL_WHITE[y][x] : KING_EVAL_BLACK[y][x] );
            }
        }

        return piece.colour === COLOUR.WHITE ? absoluteValue : -absoluteValue;
    }
}