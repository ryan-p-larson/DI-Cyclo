// Chart stuff
var width = 960,
    height = 500;

var color = d3.scaleLinear()
    .range(['#fed976','#feb24c','#fd8d3c','#f03b20','#bd0026']);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// Geo graphic stuff
//[-91.530167, 41.661129] Iowa City
var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2]);
var path = d3.geoPath()
    .pointRadius(2)
    .projection(projection);
var iowaCity = projection([-91.530167, 41.661129]);

// Path creation function (all roads lead to iowa city)
function 

// Drawing function
function loadFiles(error, world, cyclocross) {


    // set the color domain based on the cyclocross entrants
    color.domain([0, d3.max(cyclocross, function(d) { return d.Total; })]);


    // Add the map
    svg.append('g').attr('class', 'map')
        .selectAll('path')
            .data(topojson.feature(world, world.objects.countries).features)
        .enter().append('path')
        // Give each country an ID (3 char abbreviation)
        .attr('id', function(d) { return d.id; })
        .attr('d', path);

    // Add the countries
    svg.append('g').attr('class', 'cyclocross')
        .selectAll('.circle')
            .data(cyclocross)
        .enter().append('circle')
        .attr('id', function(d) { return d.Nation; })
        .attr('transform', function(d) {
                var center = projection([+d.Lon, +d.Lat]),
                    x = center[0],
                    y = center[1];
                return 'translate(' + x + ', ' + y +')';
        })
        .attr('r', 5);
        

}


// Finally load the data and make the map
d3.queue()
    .defer(d3.json, 'data/world.json')
    .defer(d3.csv, 'data/cyclocross.csv')
        .await(loadFiles);
