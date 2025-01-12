import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const datasetUrl = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

async function drawChart() {
  const data = await d3.json(datasetUrl);

  // Set dimensions
  const width = 800;
  const height = 500;
  const margin = { top: 40, right: 120, bottom: 60, left: 60 };

  // Parse time for y-axis
  const parseTime = d3.timeParse("%M:%S");
  const timeFormat = d3.timeFormat("%M:%S");

  // Set scales
  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.Year))
    .range([margin.left, width - margin.right]);

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(data, d => parseTime(d.Time)))
    .range([margin.top, height - margin.bottom]);

  // Create SVG container
  const svg = d3.select("#chart").attr("viewBox", `0 0 ${width} ${height}`);

  // Create axes
  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

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

  // Add dots
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(d.Year))
    .attr("cy", d => yScale(parseTime(d.Time)))
    .attr("r", 5)
    .attr("data-xvalue", d => d.Year)
    .attr("data-yvalue", d => parseTime(d.Time))
    .on("mouseover", (event, d) => {
      d3.select("#tooltip")
        .style("opacity", 1)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 30}px`)
        .attr("data-year", d.Year)
        .html(
          `<strong>${d.Name} (${d.Nationality})</strong><br>
          Year: ${d.Year}<br>
          Time: ${d.Time}`
        );
    })
    .on("mouseout", () => {
      d3.select("#tooltip").style("opacity", 0);
    });

  // Add legend
  const legendGroup = svg.append("g").attr("id", "legend");

  legendGroup
    .append("rect")
    .attr("x", width - margin.right - 60)
    .attr("y", height / 2 - 10)
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", "steelblue");

  legendGroup
    .append("text")
    .attr("x", width - margin.right - 30)
    .attr("y", height / 2 + 5)
    .text("Cyclist Data")
    .style("font-size", "12px")
    .attr("alignment-baseline", "middle");
}

drawChart();
