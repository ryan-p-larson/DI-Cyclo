// Chart stuff
var width = 960,
    height = 500;

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


function loadFiles(error, world, cyclocross) {
    console.log(world);
    console.log(cyclocross);

}


// Finally load the data and make the map
d3.queue().defer(d3.json, 'data/world.json')
        .defer(d3.csv, 'data/cyclocross.csv')
        .await(loadFiles);
