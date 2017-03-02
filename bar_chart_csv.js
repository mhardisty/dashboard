var svg = d3.select("#barChart").append("svg").attr("width", 960).attr("height", 400),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(d3.schemeCategory20);

var BarChartKeys = [];

d3.csv("BarChartData.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);
  BarChartKeys = keys;

  x0.domain(data.map(function(d) { console.log(d.Salesman); return d.Salesman; }));
  console.log(data);
  console.log(data.Salesman);
  console.log(keys);
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  g.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Salesman) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
		.attr("class", function(d) { return d.key; } )
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return z(d.key); });

  g.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
    .append("text")
      .attr("x", 2)
      .attr("y", y(y.ticks().pop()) + 0.5)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Sales");


});

function updateBarChart(){
	active_keys = [];
	for(i = 0; i < BarChartKeys.length; i++){
		if(isActive(BarChartKeys[i])){
			active_keys.push(BarChartKeys[i]);
		}
	}
	
	x1.domain(active_keys);
	
	
	g.selectAll("rect")
		.transition()
		.attr("x", function(d) { 
			if(isActive(d3.select(this).attr("class"))){
				return x1(d.key); 
			}
			else{
				return d3.select(this).attr("x");
		}})
		.attr("width", function(d) {
			  if(isActive(d3.select(this).attr("class"))){
				return x1.bandwidth();
			  }
			  else{
				  return 0;
			  }
			  
			  
			  }
		)
		.attr("opacity", function(d) {
			  if(isActive(d3.select(this).attr("class"))){
				return 1;
			  }
			  else{
				  return 0;
			  }
			  
			  
			  });
	
}