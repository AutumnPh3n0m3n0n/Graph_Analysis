// @TODO: YOUR CODE HERE!
// Import Data
const svgWidth = 960;
const svgHeight = 500;

const margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

const width = svgWidth - margin.left - margin.right;
const height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
const svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

const chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

d3.csv("assets/data/state_data.csv").then(stateData => {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    stateData.forEach(data => {
      data.state = +data.state;
      data.abbr = +data.abbr;
      data.poverty = +data.poverty;
      data.povertyMoe = +data.povertyMoe;
      data.age = +data.age;
      data.ageMoe = +data.ageMoe;
      data.income = +data.income;
      data.incomeMoe = +data.incomeMoe;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });

    console.log(stateData);

    const xLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.poverty)])
      .range([0, width]);

    const yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(stateData, d => d.healthcare)])
      .range([height, 0]);

    const bottomAxis = d3.axisBottom(xLinearScale);
    const leftAxis = d3.axisLeft(yLinearScale);


    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);


    const circlesGroup = chartGroup.selectAll("circle")
    .data(stateData)
    .join("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .attr("fill", "blue")
    .attr("opacity", 0.3)
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  var text = chartGroup.selectAll(null)
    .data(stateData)
    .enter()
    .append("text");

    var textLabels = text
      .attr("x", d => xLinearScale(d.poverty))
      .attr("text-anchor", "middle")
      .attr("y", d => yLinearScale(d.healthcare))
      .text(function(d) { return d.abbr; })
      .attr("font-family", "sans-serif")
      .attr("font-size", "10px")
      .attr("fill", "red");


    const toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(d => `${d.abbr}<br>Poverty Rate: ${d.poverty}<br>Lack of Healthcare: ${d.healthcare}`);


    chartGroup.call(toolTip);
    circlesGroup.on("click", function(data) {
      toolTip.show(data, this);
    })

      .on("mouseout", function(data) {
        toolTip.hide(data);
      });


    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lack of Healthcare Rate (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("Poverty Rate (%) of US States");

    
  }).catch(error => console.log(error));

