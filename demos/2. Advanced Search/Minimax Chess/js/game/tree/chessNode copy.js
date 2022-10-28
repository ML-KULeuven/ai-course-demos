

var marginTop = 30,
marginLeft = 30,
fieldSize = 30,
boardDimension = 4,
boardSize = boardDimension*fieldSize;

var board =[];

for(var i = 0; i < boardDimension*boardDimension; i++) {
board.push({
    x: i % boardDimension,
    y: Math.floor(i / boardDimension),
    piece: 0
});
};

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
.style("font-size", "30")
.attr("text-anchor", "middle")
.attr("dy", "25px")
.attr("dx", "15px")
.text('\u2655');



