export const SIZE = 400;
export const COLOUR = {
    BLACK: 'black',
    WHITE: 'white'
};
export const PAWN_EVAL_WHITE = 
[
    [0.0,  0.0,  0.0,  0.0],
    [5.0,  5.0,  5.0,  5.0],
    [1.0, -2.0, -2.0,  1.0],
    [0.0,  0.0,  0.0,  0.0]
];
export const ROOK_EVAL_WHITE = 
[  
    [  0.0,  0.0,  0.0,  0.0],
    [  0.5,  1.0,  1.0,  0.5],
    [ -0.5,  0.0,  0.0, -0.5],
    [  0.0,  0.5,  0.5,  0.0]
];
export const QUEEN_EVAL = 
[   
    [ -2.0, -1.0, -1.0, -2.0],
    [ -1.0,  0.5,  0.5, -1.0],
    [ -1.0,  0.5,  0.5, -1.0],
    [ -2.0, -1.0, -0.5, -2.0]
];
export const KING_EVAL_WHITE = 
[
    [ -3.0, -4.0, -4.0, -3.0],
    [ -2.0, -3.0, -3.0, -2.0],
    [ -1.0, -2.0, -2.0, -1.0],
    [  2.0,  1.0,  1.0,  2.0]
];
export const PAWN_EVAL_BLACK = PAWN_EVAL_WHITE.slice().reverse();
export const ROOK_EVAL_BLACK = ROOK_EVAL_WHITE.slice().reverse();
export const KING_EVAL_BLACK = KING_EVAL_WHITE.slice().reverse();