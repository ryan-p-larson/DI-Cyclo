// Chart stuff
var width = 960,
    height = 500;

var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);

// Title and citation
var mapTitle = svg.append('g')
    .attr('class', 'title')
    .attr('transform', 'translate(20, 20)');
mapTitle.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 250)
    .attr('height', 50)
    .style('fill', '#777');

// Manually set the color threshold because there's a mismatch
var color = d3.scaleThreshold()
    .domain([1, 4, 16, 20])
    .range(['#b3cde3','#8c96c6','#8856a7','#810f7c']);

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


// Bar chart vars
var barWidth = 200,
    barHeight = 200;
var x = d3.scaleLinear()
        .domain([0, 35])
        .rangeRound([0, barWidth]),
    y = d3.scaleBand()
        .range([0, barHeight])
        .padding(0.1)
        .align(0.1),
    xAxis = d3.axisTop(x).tickValues([0, 10, 20, 30, 35]),
    yAxis = d3.axisLeft(y).tickSize(0);


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

    // assign the domain to the ordered nations
    y.domain(cycloNations.map(function(d) { return d.id; }));

    // Add the map
    var map = svg.append('g').attr('class', 'map')
        .selectAll('path')
            .data(nations)
        .enter().append('path')
        // Give each country an ID (3 char abbreviation)
        .attr('id', function(d) { return d.id; })
        .attr('d', path)
        // conditional color/opacity
        .style('fill', function(d) { return d.properties.Total ? color(d.properties.Total) : '#ddd'; })
        .style('fill-opacity', function(d) { return d.properties.Total ? 1 : 0.5; });

    // add the bar Chart
    var barChart = svg.append('g')
        .attr('class', 'bars')
        .attr('transform', 'translate(300, 275)');

    // bars
    var bars = barChart.selectAll('g')
          .data(cycloNations)
        .enter().append('g');

    bars.append('rect')
        .attr('x', 0)
        .attr('y', function(d) { return y(d.id); })
        .attr('width', function(d) { return x(d.properties.Total); })
        .attr('height', y.bandwidth())
        .style('fill', function(d) { return color(d.properties.Total); });

    // add bar values
    bars.append('text')
        .attr('class', 'barLabel')
        .attr('x', function(d) { return x(d.properties.Total) + 5; })
        .attr('y', function(d) { return y(d.id) + (y.bandwidth()); })
        //.style('text-anchor', 'end')
        .text(function(d) { return d.properties.Total; });

    barChart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', 'translate(0, -5)')
        .call(xAxis);
    barChart.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);


}

// Finally load the data and make the map
d3.queue()
    .defer(d3.json, 'data/merged.json')
        .await(loadFiles);
