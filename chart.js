async function foodchart() {

    // 1. Create data object

    const data = await d3.csv("Data_with_pics.csv")

    const name = d => d["Names"];
    const colorAccessor = d => d["Category"];
    const total = d => +d["Total"];
    const image = d => d["Images"];

    console.log(image(data[0]));



    // 2. Create chart dimensions

    const dimensions = {
        width: 1200,
        height: 1200,
        margin: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 200,
        },
    }

    dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
    dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

    // 3. Draw canvas

    const chart = d3.select("#chart")
        .append("svg")
        .attr("width", dimensions.width)
        .attr("height", dimensions.height);


    // 4. Create scales

    function calculateAverageTotalPerCategory(data, categoryAccessor, totalAccessor) {
        const categoryStats = d3.rollup(
            data,
            v => {
                // Sort the values in descending order and remove the top three
                const sortedValues = v.map(totalAccessor).sort((a, b) => b - a).slice(5);
                const mean = d3.mean(sortedValues);
                const deviation = d3.deviation(sortedValues);
                return { mean, deviation };
            },
            categoryAccessor
        );
        return categoryStats;
    }

    const averageTotals = calculateAverageTotalPerCategory(data, colorAccessor, total);
    console.log(averageTotals);

    const colorScale = d3.scaleOrdinal()
        .domain(data.map(colorAccessor))
        .range(fourth);

    const radiusScale = d3.scaleLinear()
        .domain([0, d3.max(data, total)])
        .range([15, 30]);


    function calculatePosition(index, total, radius) {
        const angle = ((index / total) * 2 * Math.PI) - 1/2 * Math.PI;
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);
        return { cx, cy };
    }

    // 5. Draw data

    const bounds = chart.append("g")
        .style("transform", `translate(${dimensions.width/2}px, ${dimensions.height/2}px)`);

    const radius = 350;

    const dots = bounds.selectAll("circle.data-circle")
        .data(data)
        .join("circle")
        .attr("class", "data-circle")
        .attr("cx", (d, i) => calculatePosition(i, data.length, radius).cx)
        .attr("cy", (d, i) => calculatePosition(i, data.length, radius).cy)
        .attr("r", d => {
            const stats = averageTotals.get(colorAccessor(d));
            if (total(d) > stats.mean + stats.deviation) {
                return radiusScale(total(d)); // Scale the size for larger circles
            } else {
                return 3; // Small dot-like circle
            }
        })

        .attr("fill", d => colorScale(colorAccessor(d)))
        .attr("fill-opacity", 0.8)
        .attr("stroke", d => colorScale(colorAccessor(d)))
        .attr("stroke-width", 0.9)
        .attr('stroke-opacity', 0.7)
        .on("mouseover", function(event, d) {
            d3.select("#title")
                .text(`${name(d)}`)
                .style("opacity", 1);

            d3.select("#number")
                .text(`${total(d)} CO2e`)
                .style("opacity", 1);


            d3.selectAll("circle.data-circle")
                .filter(circle => circle !== d)
                .transition().duration(100)
                .style("opacity", 0.1);

            console.log("Image path:", image(d));

            d3.select("#image-rect")
                .attr("fill", `url(#image-pattern)`)
                .style("opacity", 1);
    
            d3.select("#image-pattern image")
                .attr("xlink:href", image(d));
            
            
        })
        .on("mouseout", function() {
            d3.select("#title")
                .style("opacity", 0);

            d3.select("#number")
                .style("opacity", 0);

            d3.selectAll("circle.data-circle")
                .transition().duration(100)
                .style("opacity", 1);

            d3.select("#image-rect")
                .style("opacity", 0);

        });
    

    chart.append('text')
        .attr('id', 'title')
        .attr('x', dimensions.width / 2)
        .attr('y', dimensions.height/2 + 30)
        .attr('text-anchor', 'middle')
        .style('font-size', '32px')
        .style('fill', 'black')
        .style('opacity', 0)



    chart.append("text")
        .attr("id", "number")
        .attr("x", dimensions.width / 2)
        .attr("y", dimensions.height / 2 + 80)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "red")
        .style("opacity", 0);




    // Define a pattern for the image
    chart.append("defs")
        .append("pattern")
        .attr("id", "image-pattern")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("width", 100)
        .attr("height", 100);

    // Append rect element for displaying food images
    chart.append("rect")
        .attr("id", "image-rect")
        .attr("x", dimensions.width / 2 - 50)
        .attr("y", dimensions.height / 2 - 150)
        .attr("width", 100)
        .attr("height", 100)
        .style("opacity", 0);
    



    // 6. Draw peripherals

    const legendOrdinal = d3.legendColor()
    .scale(colorScale)
    .shape('circle');

    chart.append("g")
        .attr("class", "legendOrdinal")
        .attr("transform", `translate(${dimensions.margin.right + 950}, ${dimensions.margin.top + 200})`);

    chart.select(".legendOrdinal")
        .call(legendOrdinal);


    // Draw peripheral circles
    bounds.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius - 140) // Smaller radius
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-opacity", 0.3);

    bounds.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius + 80) // Larger radius
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-opacity", 0.3);


}



foodchart();
