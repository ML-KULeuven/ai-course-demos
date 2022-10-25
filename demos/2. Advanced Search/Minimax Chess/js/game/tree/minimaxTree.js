import "https://d3js.org/d3.v7.min.js";

export default class MinimaxTree {

    constructor() {

        // Set the dimensions and margins of the diagram
        let margin = {top: 40, right: 120, bottom: 20, left: 120};
        let width = 960 - margin.right - margin.left;
        let height = 500 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        // appends a 'group' element to 'svg'
        // moves the 'group' element to the top left margin
        this.svg = d3.select("#tree").append("svg")
                    .attr("width", width + margin.right + margin.left)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        this.i = 0;
        this.duration = 750;
        this.root;

        // declares a tree layout and assigns the size
        this.treemap = d3.tree().size([height, width]);
    }

    buildRoot(treeData) {
         // Assigns parent, children, height, depth
         this.root = d3.hierarchy(treeData, function(d) { return d.children; });
         this.root.x0 = height / 2;
         this.root.y0 = 0;
         this.root.descendants().forEach((d, i) => {
             d.id = i;
             d._children = d.children;
             if (d.depth && d.data.name.length !== 7) d.children = null;
         });
         
         this.update(this.root);
    }

    update(source) {

        print(source);

        // Assigns the x and y position for the nodes
        var treeData = this.treemap(this.root);
        
        // Compute the new tree layout.
        var nodes = treeData.descendants(),
            links = treeData.descendants().slice(1);
      
        // Normalize for fixed-depth.
        nodes.forEach(function(d){ d.y = d.depth * 180});
      
        // ****************** Nodes section ***************************
      
        // Update the nodes...
        var node = this.svg.selectAll('g.node')
            .data(nodes, function(d) {return d.id || (d.id = ++this.i); });
      
        // Enter any new modes at the parent's previous position.
        var nodeEnter = node.enter().append('g')
            .attr('class', 'node')
            .attr("transform", function(d) {
              return "translate(" + source.x0 + "," + source.y0 + ")";
          })
          .on('click', (event, d) => {
            d.children = d.children ? null : d._children;
            this.update(d);
          });
      
        // Add Circle for the nodes
        nodeEnter.append('circle')
            .attr('class', 'node')
            .attr('r', 1e-6)
            //.on("mouseover", function(d) {d3.select(this).transition().delay(0).style("stroke", "pink").style("stroke-width", 5);})
            .style("fill", function(d) {
                return d._children ? "lightsteelblue" : "#fff";
            });
      
        // Add labels for the nodes
        nodeEnter.append('text')
            .attr("dy", ".35em")
            .attr("x", function(d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("text-anchor", function(d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function(d) { return d.data.name; });
      
        // UPDATE
        var nodeUpdate = nodeEnter.merge(node);
      
        // Transition to the proper position for the node
        nodeUpdate.transition()
          .duration(this.duration)
          .attr("transform", function(d) { 
              return "translate(" + d.x + "," + d.y + ")";
           });
      
        // Update the node attributes and style
        nodeUpdate.select('circle.node')
          .attr('r', 10)
          .style("fill", function(d) {
              return d._children ? "lightsteelblue" : "#fff";
          })
          .attr('cursor', 'pointer');
      
      
        // Remove any exiting nodes
        var nodeExit = node.exit().transition()
            .duration(this.duration)
            .attr("transform", function(d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();
      
        // On exit reduce the node circles size to 0
        nodeExit.select('circle')
          .attr('r', 1e-6);
      
        // On exit reduce the opacity of text labels
        nodeExit.select('text')
          .style('fill-opacity', 1e-6);
      
        // ****************** links section ***************************
      
        // Update the links...
        var link = this.svg.selectAll('path.link')
            .data(links, function(d) { return d.id; });
      
        // Enter any new links at the parent's previous position.
        var linkEnter = link.enter().insert('path', "g")
            .attr("class", "link")
            .attr('d', function(d){
              var o = {x: source.x0, y: source.y0}
              return diagonal(o, o)
            });

        // Add labels to links
        // Add 
        
      
        // UPDATE
        var linkUpdate = linkEnter.merge(link);
      
        // Transition back to the parent element position
        linkUpdate.transition()
            .duration(this.duration)
            .attr('d', function(d){ return diagonal(d, d.parent) });
      
        // Remove any exiting links
        var linkExit = link.exit().transition()
            .duration(this.duration)
            .attr('d', function(d) {
              var o = {x: source.x, y: source.y}
              return diagonal(o, o)
            })
            .remove();
      
        // Store the old positions for transition.
        nodes.forEach(function(d){
          d.x0 = d.x;
          d.y0 = d.y;
        });

        // Creates a curved (diagonal) path from parent to the child nodes
        function diagonal(s, d) {
            const path =    `M ${s.x} ${s.y}
                            C ${(s.x + d.x) / 2} ${s.y},
                            ${(s.x + d.x) / 2} ${d.y},
                            ${d.x} ${d.y}`

            return path
        }
    }
}