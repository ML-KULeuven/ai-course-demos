import "https://d3js.org/d3.v7.min.js";

export default class MinimaxTree {

    constructor() {
        // Set the dimensions and margins of the diagram
        let margin = {top: 40, right: 20, bottom: 40, left: 20};
        this.width = 1000 - margin.right - margin.left;
        this.height = 1000 - margin.top - margin.bottom;
        this.root;

        // Purge the svg
        this.svg = d3.select("#tree").html("");

        // Create the svg
        this.svg = d3.select("#tree").append("svg")
            .attr("preserveAspectRatio", "xMidYMin")
            .attr("viewBox", `0 0 ${this.width} ${this.height}`)
            .classed("svg-content", true);

        // Create the visualization within the svg
        this.g = this.svg.append("g")
	        .attr("transform", "translate(" + this.width/2 + "," + margin.top + ")");

        // Zoom and drag functionality on svg
        d3.zoom().translateTo(this.svg, 0, this.height/2-margin.top); 
        this.svg.call(d3.zoom()
            .scaleExtent([0.1, 8])
            .on('zoom', (event) => {
                this.g.attr('transform', event.transform);
            }));

        // declares a tree layout and assigns the size       
        let nodeWidth = 120;
        let nodeHeight = 120;
        let horizontalSeparationBetweenNodes = 0;
        let verticalSeparationBetweenNodes = 526;
        this.treeLayout = d3.tree()
            .nodeSize([nodeWidth + horizontalSeparationBetweenNodes, nodeHeight + verticalSeparationBetweenNodes])
            .separation(function(a, b) {
                return a.parent == b.parent ? 1 : 1.1;
            });
    }

    update(treeData) {
        $('#tree').css("padding-bottom","75%");

        // create a hierarchy from the root
        this.root = d3.hierarchy(treeData);
        this.treeLayout(this.root);

        // Compute the new tree layout.
        let nodes = this.root.descendants();
        let links = this.root.links();

        // Normalize for fixed-depth.
        nodes.forEach(function(d) { d.y = d.depth * 180; });

        // Declare the nodes…
        let node = this.g.selectAll("g.node")
            .data(nodes, function(d) {return d.id || (d.id = ++this.i); });

        // Enter the nodes.
        let nodeEnter = node.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")"; 
            });
    
        // Node
        nodeEnter.append("rect")
            .attr("class", "body-box")
            .attr("width", 100)
            .attr("height", 100)
            .style("stroke", function(d) {
                if (d.data.depth%2) 
                    return "green";
                else
                    if (d.data.best)
                        return "gold";
                    else
                        return "red";
            })
            .style("stroke-width", function(d) {
                if (d.data.best)
                    return "4px";
                else
                    return "1px";
            });

        // Chessboard
        let margin = 10;
        let fieldSize = 20;
        let boardDimension = 4;
        let boardSize = 20 + fieldSize * boardDimension;

        // Initiate chessboard values
        let chess_svg = nodeEnter.append("svg")
            .attr("width", boardSize + "px")
            .attr("height", boardSize + "px")
            .selectAll(".fields")
            .data(
                function(d) {
                    let board = [];
                    for(let i = 0; i < boardDimension; i++) {
                        for(let j=0; j< boardDimension; j++) {
                            board.push({
                                x: i % boardDimension,
                                y: j % boardDimension,
                                piece: d.data.board[i][j]
                            });
                        }
                    }
                    return board;
                }
            )
            .enter()
            .append("g");

        chess_svg.append("rect")
            .style("class", "chess-board")
            .attr("x", function (d) {
                return margin + d.x * fieldSize;
            })
            .attr("y", function (d) {
                return margin + d.y * fieldSize;
            })
            .attr("width", fieldSize + "px")
            .attr("height", fieldSize + "px")
            .style("fill", function (d) {
                if ( ((d.x%2 == 0) && (d.y%2 == 0)) ||
                    ((d.x%2 == 1) && (d.y%2 == 1))) 
                    return "rgb(233,236,240)";
                else
                    return "rgb(181,189,206)";
            });
        
        chess_svg.append("text")
            .attr("x", function (d) {
                return d.x*fieldSize;
            })
            .attr("y", function (d) {
                return d.y*fieldSize;
            })
            .style("font-size", "20")
            .style("font-family", "arial")
            .attr("text-anchor", "middle")
            .attr("dy", "27px")
            .attr("dx", "20px")
            .text(function (d) {
                if (d.piece != undefined) {
                    return d.piece.sprite;
                } 
            });
        
        // Declare the links.
        let link = this.g.selectAll(".link")
            .data(links, function(d) { 
                return d; 
            });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d", d3.linkVertical()
                .x(function(d) { return d.x+50; })
                .y(function(d) { return d.y; })
            );

        // Title box.
        nodeEnter.append("rect")
            .attr("class", "title-box")
            .attr("width", 46)
            .attr("height", 23)
            .attr("transform", function(d) { 
                return "translate(" + -13 +"," + -15 + ")";
            });

        // Title box text.
        nodeEnter.append("text")
            .attr("class", "title-box-text")
            .attr("text-anchor", "middle")
            .attr("transform", function(d) { 
                return "translate(" + 10 +"," + 1.5 + ")";
            })
            .text(function(d) { return d.data.minimax; });

        // Exit everything.
        node.exit().remove();
        nodeEnter.exit().remove();
        link.exit().remove();
        chess_svg.exit().remove();
    }
}