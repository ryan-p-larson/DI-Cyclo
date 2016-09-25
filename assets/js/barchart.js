// Chart basic vars
var margin = {left: 20, top: 20, right: 20, bottom: 20},
    width = 250,
    height = 250;

// scales -> axes
var x = d3.scaleLinear()
        .domain([0, 35])
        .rangeRound([margin.left, width-margin.right*2]),
    y = d3.scaleBand()
        .range([margin.top, height - margin.bottom*2])
        .padding(0.1)
        .align(0.1),
    color = d3.scaleThreshold()
        .domain([1, 4, 16, 20])
        .range(['#b3cde3','#8c96c6','#8856a7','#810f7c']);
var xAxis = d3.axisTop(x);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

function loadFiles(error, merged) {
    if (error) { console.log(error); }

    // Save the nations in a var, Dont Repeat Yourself
    var nations = topojson.feature(merged, merged.objects.countries).features;

    // Filter to only entered nations, and sort the values in descending total
    var cycloNations = nations
            .filter(function(d) { return d.properties.Total; })
            .sort(function(a, b) { return b.properties.Total - a.properties.Total; });

    // assign the domain to the ordered nations
    y.domain(cycloNations.map(function(d) { return d.id; }));

    //bars
    svg.selectAll('.rect')
            .data(cycloNations)
        .enter().append('rect')
        .attr('x', margin.left)
        .attr('y', function(d) { return y(d.id) + 5; })
        .attr('width', function(d) { return x(d.properties.Total); })
        .attr('height', y.bandwidth())
        .style('fill', function(d) { return color(d.properties.Total); });

    // axes
    svg.append('g')
        .attr('class', 'axis')
        .attr('transform', function() { return 'translate(0,' + margin.top + ')'; })
        .call(xAxis);
}

// Finally load the data and make the map
d3.queue()
    .defer(d3.json, 'data/merged.json')
        .await(loadFiles);
