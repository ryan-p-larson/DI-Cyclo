// Chart stuff
var width = 960,
    height = 500;

// Manually set the color threshold because there's a mismatch
var color = d3.scaleThreshold()
    .domain([1, 4, 16, 20])
    .range(['#b3cde3','#8c96c6','#8856a7','#810f7c']);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Geographic stuff
var projection = d3.geoMercator()
    .scale(175)
    // Make IC the middle
    .rotate([110, 0])
    .center([0, 15])
    .translate([width / 2, height / 2]);
var path = d3.geoPath()
    .pointRadius(2)
    .projection(projection);
var iowaCity = [-91.530167, 41.661129];


// Interaction functions
// mouseIn
// mouseOut

// Drawing function
function loadFiles(error, merged) {

    // Save the nations in a var, Dont Repeat Yourself
    var nations = topojson.feature(merged, merged.objects.countries).features;

    // Filter to only entered nations, and sort the values in descending total
    var cycloNations = nations
            .filter(function(d) { return d.properties.Total; })
            .sort(function(a, b) { return b.properties.Total - a.properties.Total; });

    // Add the map
    var map = svg.append('g').attr('class', 'map')
        .selectAll('path')
            .data(nations)
        .enter().append('path')
        // Give each country an ID (3 char abbreviation)
        .attr('id', function(d) { return d.id; })
        .attr('d', path)
        .style('fill', function(d) { return d.properties.Total ? color(d.properties.Total) : '#ddd'; });
}

// Finally load the data and make the map
d3.queue()
    .defer(d3.json, 'data/merged.json')
        .await(loadFiles);
