var forceLayout = function (nodes, links) {
        var height = 600;
        var width = 800;

        force = d3.layout.force()
            .nodes(nodes)
            .links(links)
            .size([width, height])
            .linkDistance(30)
            .charge(-500)
            .linkStrength(0.7)
            .on("tick", tick)
            .start();

        var conts = {
            "europe": "#0044FF",
            "asia": "#00A231",
            "north america": "#F7FF01",
            "south america": "#FF0000",
            "africa": "#FF8901",
            "australia": "#9D00A2"
        };
	
        // Create D3 Layout Container
        var svg = d3.select("#map").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("style", "z-index: 1")
            .attr("id", "d3Layout");

	// Create groups based on continents
        var groups = d3.nest().key(function(d) {return d.continent}).entries(node);

	// Create hull/path element corresponding to continent group
        var groupPath = function(d) {
            return "M" +
                d3.geom.hull(d.values.map(function(i) {return [i.x, i.y]; }))
                    .join("L")
                + "Z";
        };
	// Add continents
	var continentBoundary = svg.selectAll("path.group")
                .data(groups)
                    .attr("d", groupPath)
                    .attr("class", "group")
                .enter().insert("path", "circle")
                    .style("fill", function(d) {return conts[d.key];})
                    .attr("class", "group")
                    .style("stroke", function(d) {return conts[d.key];})
                    .attr("class", "group")
                    .style("stroke-width", 50)
                    .style("stroke-linejoin", "round")
                    .style("opacity", 0.4)
                    .attr("d", groupPath);

	// Add links 
        var path = svg.append("svg:g").selectAll("path.link")
            .data(force.links())
            .enter().append("svg:path")
            .attr("class", "link")
    
	// Define nodes
        var node = svg.selectAll(".node")
            .data(force.nodes())
            .enter().append("g")
            .attr("class", "node")
            .attr("value", 0)
            .attr("owner", null)
            .attr("id", function(d) {
                var id = d.name;
                return id.split(" ").join("");
            });
            //.call(force.drag); 
    
	// Add nodes
        var circle = node.append("circle")
            .attr("r", 7)
            .attr("class", "countryCircle")
            .style("stroke", "black");

        // Add text labels
        var label = node.append("text")
            .attr("x", 12)
            .classed ("label", true)
            .style("fill", "black")
            .attr("dy", ".35em")
            .text(function(d) {return d.name;});

        // Add troop count number
        var troopCount = node.append("text")
            .attr("dx", -3)
            .attr("dy", 3)
            .text(function(d) {return d.troops;});

        function tick() {

	 continentBoundary.attr("d", groupPath);

         path.attr("d", function(d) {
         	var dx = d.target.x - d.source.x,
                    dy = d.target.y - d.source.y,
                    dr = Math.sqrt(dx * dx + dy * dy);
                return "M" +
                    d.source.x + "," +
                    d.source.y + "L" +
                    d.target.x + "," +
                    d.target.y;
            });

            circle.attr("r", function(d) {
                var troops = d.troops || 1;
                var radius = 7 * (Math.sqrt(troops));
                return radius;
            });

            node.attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

            troopCount.text(function(d) {return d.troops;});

            label.attr("x", function(d) {
                var troops = d.troops || 1;
                var circleRadius = 7 * (Math.sqrt(troops));
                var offset = 2 + circleRadius;
                return offset;
            });
        }
	console.log("graph created");
};


