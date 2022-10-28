var board =[];

for(var i = 0; i < boardDimension*boardDimension; i++) {
    board.push({
        x: i % boardDimension,
        y: Math.floor(i / boardDimension),
        piece: pieces.NONE
    });
};

board[0].piece = pieces.BLACK_ROOK
board[1].piece = pieces.BLACK_QUEEN
board[2].piece = pieces.BLACK_KING
board[3].piece = pieces.BLACK_ROOK

board[4].piece = pieces.BLACK_POWN
board[5].piece = pieces.BLACK_POWN
board[6].piece = pieces.BLACK_POWN
board[7].piece = pieces.BLACK_POWN

board[8].piece = pieces.WHITE_POWN
board[9].piece = pieces.WHITE_POWN
board[10].piece = pieces.WHITE_POWN
board[11].piece = pieces.WHITE_POWN

board[12].piece = pieces.WHITE_ROOK
board[13].piece = pieces.WHITE_QUEEN
board[14].piece = pieces.WHITE_KING
board[15].piece = pieces.WHITE_ROOK

var div = d3.select("body")
            .append("div")
            .style("position", "fixed")
            .style("top", marginTop + "px")
            .style("left", marginLeft + "px")
            .style("width", boardSize + "px")
            .style("height", boardSize + "px");

var svg = div.append("svg")
            .attr("width", boardSize + "px")
            .attr("height", boardSize + "px")
            .selectAll(".fields")
            .data(board)
            .enter()
            .append("g");

svg.append("rect")
    .style("class", "fields")
    .style("class", "rects")
    .attr("x", function (d) {
        return d.x*fieldSize;
    })
    .attr("y", function (d) {
        return d.y*fieldSize;
    })
    .attr("width", fieldSize + "px")
    .attr("height", fieldSize + "px")
    .style("fill", function (d) {
    if ( ((d.x%2 == 0) && (d.y%2 == 0)) ||
        ((d.x%2 == 1) && (d.y%2 == 1))    ) 
        return "beige";
    else
        return "tan";
    });

    svg.append("text")
    .attr("x", function (d) {
        return d.x*fieldSize;
    })
    .attr("y", function (d) {
        return d.y*fieldSize;
    })
    .style("font-size", "28")
    .attr("text-anchor", "middle")
    .attr("dy", "25px")
    .attr("dx", "16px")
    .text(function (d) {
        return d.piece.code;
     })
    .append("title")
    .text(function(d) {
        return d.piece.name;
    });
