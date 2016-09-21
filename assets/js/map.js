var width = 960,
    height = 500;

var projection = d3.geoMercator()
    //.center([	-91.530167, 	41.661129]) //Iowa City long, lat
    .center([-20, 20])
    .scale(175)
    .rotate([0, 0]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var path = d3.geoPath()
    .projection(projection);

var g = svg.append("g");

// load and display the World
d3.json("data/world-110m.json", function(error, topology) {

    g.selectAll("path")
      .data(topojson.feature(topology, topology.objects.countries).features)
      .enter()
      .append("path")
      .attr("d", path);
});
