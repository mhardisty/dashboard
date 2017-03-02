var LineChartSVG = d3.select("#lineChart").append("svg")
	.attr("width", 600).attr("height", 300),
	margin = {top: 20, right: 80, bottom: 30, left: 50},
    LineChartwidth = LineChartSVG.attr("width") - margin.left - margin.right,
    LineChartheight = LineChartSVG.attr("height") - margin.top - margin.bottom,
    LineChart_g = LineChartSVG.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	
var parseTime = d3.timeParse("%Y%m");

var xScale = d3.scaleTime().range([0, LineChartwidth]),
    yScale = d3.scaleLinear().range([LineChartheight, 0]),
    zScale = d3.scaleOrdinal(d3.schemeCategory20);
	
var line = d3.line()
    .x(function(d) { return xScale(d.date); })
    .y(function(d) { return yScale(d.temperature); });
	
d3.csv("LineChartData.csv", type, function(error, data) {
  if (error) throw error;
    
  var cities = data.columns.slice(1).map(function(id) {
    return {
      id: id,
      values: data.map(function(d) {
        return {date: d.date, temperature: d[id]};
      })
    };
  });
  

  xScale.domain(d3.extent(data, function(d) { return d.date; }));

  yScale.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
  ]);

  zScale.domain(cities.map(function(c) { return c.id; }));

  LineChart_g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + LineChartheight + ")")
      .call(d3.axisBottom(xScale).ticks(d3.timeMonth)
			.tickFormat(d3.timeFormat("%B %y")));

  LineChart_g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(yScale));

  var city = LineChart_g.selectAll(".city")
    .data(cities)
    .enter().append("g")
     .attr("class", "city");
	  
  
  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return zScale(d.id); });
	  
  city.append("text")
      .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + xScale(d.value.date) + "," + yScale(d.value.temperature) + ")"; })
      .attr("x", 3)
      .attr("dy", "0.35em")
      .style("font", "10px sans-serif")
      .text(function(d) { return d.id; });
});

function type(d, _, columns) {
	d.date = parseTime(d.date);
	for (var i = 1, n = columns.length, c; i < n; ++i) d[c = columns[i]] = +d[c];
	return d;
}

function updateLineChart(){
	var LineChartSVG = d3.select("#lineChart svg");
	var LineChart_g = LineChartSVG.select("g");
	
	d3.csv("LineChartData.csv", type, function(error, data) {
	  if (error) throw error;
		
	  var cities = data.columns.slice(1).map(function(id) {
		return {
		  id: id,
		  values: data.map(function(d) {
			return {date: d.date, temperature: d[id]};
		  })
		};
	  });
	  

	  xScale.domain(d3.extent(data, function(d) { return d.date; }));

	  yScale.domain([
		d3.min(cities, function(c) { return d3.min(c.values, function(d) { return d.temperature; }); }),
		d3.max(cities, function(c) { return d3.max(c.values, function(d) { return d.temperature; }); })
	  ]);

	  zScale.domain(cities.map(function(c) { return c.id; }));


	  var city = LineChart_g.selectAll(".city");
		  
	  
	  city.selectAll("path")
		  .attr("d", function(d) { return line(d.values); })
		  .style("stroke", function(d) { return zScale(d.id); })
		  .transition()
		  .attr("opacity", function(d) {
			  if(isActive(d.id)){
				return 1;
			  }
			  else{
				  return 0;
			  }
			  
			  
			  });
		  
	  city.selectAll("text")
		.transition()
		.style("opacity", function(d) {
			  if(isActive(d.id)){
				return 1;
			  }
			  else{
				  return 0;
			  }
		  }
		  );
});
	
	
	
}


