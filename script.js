// const dataUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";
const dataUrl = "data.json";

var svg = d3.select("svg"),
  margin = 300,
  width = svg.attr("width") - margin,
  height = svg.attr("height") - margin,
  barWidth = width / 275;

var g = svg.append("g").attr("transform", "translate(" + margin / 2 + "," + margin / 2 + ")");

var tooltip = d3.select("body").append("div").attr("id", "tooltip");

d3.json("data.json", function (error, data) {
  if (error) {
    throw error;
  }

  // ===========================================================================
  // X-AXIS
  // ===========================================================================
  // get dates from array
  let year = data.data.map((item) => {
    return new Date(item[0]);
  });

  let xMax = new Date(d3.max(year));
  xMax.setMonth(xMax.getMonth() + 3);
  let xScale = d3
    .scaleTime()
    .domain([d3.min(year), xMax])
    .range([0, width]);

  g.append("g")
    .call(d3.axisBottom().scale(xScale))
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")");

  // =========================================================================
  // Y-AXIS
  // =========================================================================
  // get values from array
  var values = data.data.map((item) => item[1]);

  var scaledValues = [];
  var valueMax = d3.max(values);

  var linearScale = d3.scaleLinear().domain([0, valueMax]).range([0, height]);

  scaledValues = values.map((item) => {
    return linearScale(item);
  });

  var yScale = d3.scaleLinear().domain([0, valueMax]).range([height, 0]);

  g.append("g").call(d3.axisLeft(yScale)).attr("id", "y-axis");

  // ===========================================================================
  // BARS
  // ===========================================================================
  g.selectAll(".bar")
    .data(scaledValues)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("data-date", (d, i) => data.data[i][0])
    .attr("data-gdp", (d, i) => data.data[i][1])
    .attr("x", (d, i) => xScale(year[i]))
    .attr("y", (d, i) => height - d)
    .attr("width", barWidth)
    .attr("height", (d) => d)
    // add tooltip
    .on("mousemove", (d, i) => {
      tooltip
        .style("left", d3.event.pageX - 50 + "px")
        .style("top", d3.event.pageY - 70 + "px")
        .style("display", "inline-block")
        .attr("data-date", data.data[i][0])
        .html(`Date:  ${data.data[i][0]} </br>Value:  ${data.data[i][1]}`);
    })
    .on("mouseout", function (d) {
      tooltip.style("display", "none");
    });

  // =========================================================================
  // LABELS
  // =========================================================================
  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -550)
    .attr("y", 70)
    .text("Gross Domestic Product (Billions)");

  svg
    .append("text")
    .attr("x", width / 1.7)
    .attr("y", height + 220)
    .text("Year");
});
