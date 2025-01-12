import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const datasetUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";

async function drawHeatMap() {
  const data = await d3.json(datasetUrl);
  const baseTemperature = data.baseTemperature;
  const monthlyData = data.monthlyVariance;

  // Dimensions
  const width = 1000;
  const height = 500;
  const margin = { top: 50, right: 30, bottom: 100, left: 100 };
  const cellHeight = (height - margin.top - margin.bottom) / 12;

  // Parse data
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Scales
  const xScale = d3
    .scaleBand()
    .domain(monthlyData.map(d => d.year))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleBand()
    .domain(months)
    .range([margin.top, height - margin.bottom]);

  const colorScale = d3
    .scaleQuantile()
    .domain(monthlyData.map(d => baseTemperature + d.variance))
    .range(["#4575b4", "#91bfdb", "#fee090", "#fc8d59", "#d73027"]);

  // Create SVG container
  const svg = d3
    .select("#chart")
    .attr("viewBox", `0 0 ${width} ${height}`);

  // Axes
  const xAxis = d3.axisBottom(xScale).tickValues(
    xScale.domain().filter(year => year % 10 === 0)
  );

  const yAxis = d3.axisLeft(yScale).tickFormat((_, i) => months[i]);

  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(yAxis);

  // Heatmap cells
  svg
    .selectAll(".cell")
    .data(monthlyData)
    .enter()
    .append("rect")
    .attr("class", "cell")
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(months[d.month - 1]))
    .attr("width", xScale.bandwidth())
    .attr("height", cellHeight)
    .attr("fill", d => colorScale(baseTemperature + d.variance))
    .attr("data-month", d => d.month - 1)
    .attr("data-year", d => d.year)
    .attr("data-temp", d => baseTemperature + d.variance)
    .on("mouseover", (event, d) => {
      const tooltip = d3.select("#tooltip");
      tooltip
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .attr("data-year", d.year)
        .html(
          `Year: ${d.year}<br>Month: ${
            months[d.month - 1]
          }<br>Temp: ${(baseTemperature + d.variance).toFixed(2)}°C`
        );
    })
    .on("mouseout", () => {
      d3.select("#tooltip").style("opacity", 0);
    });

  // Legend
  const legendWidth = 300;
  const legendHeight = 15;
  const legendX = d3
    .scaleLinear()
    .domain(colorScale.domain())
    .range([margin.left, margin.left + legendWidth]);

  const legendAxis = d3.axisBottom(legendX).ticks(5);

  const legendGroup = svg
    .append("g")
    .attr("id", "legend")
    .attr("transform", `translate(0, ${height - margin.bottom + 40})`);

  legendGroup
    .selectAll("rect")
    .data(colorScale.range().map(d => colorScale.invertExtent(d)))
    .enter()
    .append("rect")
    .attr("x", d => legendX(d[0]))
    .attr("y", 0)
    .attr("width", d => legendX(d[1]) - legendX(d[0]))
    .attr("height", legendHeight)
    .attr("fill", d => colorScale(d[0]));

  legendGroup
    .append("g")
    .attr("transform", `translate(0, ${legendHeight})`)
    .call(legendAxis);
}

drawHeatMap();
