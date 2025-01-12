import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Fetch the dataset
const datasetUrl =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";

async function drawChart() {
  const data = await d3.json(datasetUrl);
  const dataset = data.data;

  // Set dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };

  // Create scales
  const xScale = d3
    .scaleBand()
    .domain(dataset.map((d) => d[0]))
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(dataset, (d) => d[1])])
    .nice()
    .range([height - margin.bottom, margin.top]);

  // Create SVG container
  const svg = d3.select("#chart").attr("viewBox", `0 0 ${width} ${height}`);

  // Create axes
  const xAxis = d3
    .axisBottom(xScale)
    .tickValues(
      xScale.domain().filter((d, i) => i % Math.ceil(dataset.length / 10) === 0)
    );
  const yAxis = d3.axisLeft(yScale);

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

  // Add bars
  svg
    .selectAll(".bar")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d[0]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", xScale.bandwidth())
    .attr("height", (d) => height - margin.bottom - yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (event, d) => {
      d3.select("#tooltip")
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .attr("data-date", d[0])
        .html(
          `<strong>Date:</strong> ${d[0]}<br><strong>GDP:</strong> $${d[1]} Billion`
        );
    })
    .on("mouseout", () => {
      d3.select("#tooltip").style("opacity", 0);
    });
}

drawChart();
