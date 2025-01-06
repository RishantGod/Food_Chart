async function foodchart() {

    // 1. Create data object

    const data = await d3.csv("data_updated_img.csv")

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

    const one_gradient = ['#f5e6ad', '#f4caa4', '#f4ad9b', '#f39192', '#f27589', '#f25880', '#f13c77']
    const two_gradient = ['#ffa8bd', '#db93c0', '#b67ec3', '#9269c6', '#6d54c9','#493fcc','#242acf']
    const three_gradient = ['#84e3c8', '#a8e6cf', '#dcedc1', '#ffd3b6', '#ffaaa5', '#ff8b94', '#ff7480']
    const fourth = ['#797d62', '#9b9b7a', '#d9ae94', '#f1dca7', '#ffcb69', '#d08c60', '#B58463']
    //const fourth = [rgb(209,96,62), rgb(227,168,87), rgb(124,169,130), rgb(74,117,156), rgb(139,94,131),r(), rgb(226,125,96)]


    const colorScale = d3.scaleOrdinal()
        .domain(data.map(colorAccessor))
        .range(fourth);

    const radiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, total)])
        .range([5, 30]);


    // Exclude the top 10 values for calculating the graphRadiusScale
    const filteredData = data.slice().sort((a, b) => total(b) - total(a)).slice(10);

    const graphRadiusScale = d3.scaleSqrt()
        .domain([0, d3.max(data, total)])
        .range([80, 250])


    function calculatePosition(index, total, baseRadius, totalValue) {
        const angle = ((index / total) * 2 * Math.PI) - 1/2 * Math.PI;
        const radius = baseRadius + graphRadiusScale(totalValue); // Adjust radius based on total value
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);
        return { cx, cy };
        }




    // 5. Draw data

    const bounds = chart.append("g")
        .style("transform", `translate(${dimensions.width/2}px, ${dimensions.height/2}px)`);

    const baseRadius = 200; // Base radius for positioning

    const lines = bounds.selectAll("line.data-line")
        .data(data)
        .join("line")
        .attr("class", "data-line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => calculatePosition(i, data.length, baseRadius, total(d)).cx)
        .attr("y2", (d, i) => calculatePosition(i, data.length, baseRadius, total(d)).cy)
        .attr("stroke",  d => colorScale(colorAccessor(d)))
        .attr("stroke-width", 0.6);


    

    const dots = bounds.selectAll("circle.data-circle")
        .data(data)
        .join("circle")
        .attr("class", "data-circle")
        .attr("cx", (d, i) => calculatePosition(i, data.length, baseRadius, total(d)).cx)
        .attr("cy", (d, i) => calculatePosition(i, data.length, baseRadius, total(d)).cy)
        .attr("r", d => radiusScale(total(d)))
        .attr("fill", d => colorScale(colorAccessor(d)))
        .attr("fill-opacity", 0.8)
        .attr("stroke", d => colorScale(colorAccessor(d)))
        .attr("stroke-width", 0.3)
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
            
            d3.select(this)
                .transition().duration(100)
                .attr('fill-opacity', 1)
                .attr("stroke-width", 4);

            console.log("Image path:", image(d));

            d3.select("#image-rect")
                .attr("fill", `url(#image-pattern)`)
                .style("opacity", 1);
    
            d3.select("#image-pattern image")
                .attr("xlink:href", image(d));

            d3.selectAll("line.data-line")
                .filter(line => line !== d3.select(this).datum())
                .transition().duration(100)
                .style("opacity", 0.1);
    
            d3.selectAll("line.data-line")
                .filter(line => line === d3.select(this).datum())
                .transition().duration(100)
                .attr("stroke-width", 1);
            
            
        })
        .on("mouseout", function() {
            d3.select("#title")
                .style("opacity", 0);

            d3.select("#number")
                .style("opacity", 0);

            d3.selectAll("circle.data-circle")
                .transition().duration(100)
                .style("opacity", 1)
                .attr("fill-opacity", 0.8)
                .attr("stroke-width", 0.9);

            d3.select("#image-rect")
                .style("opacity", 0);

            d3.selectAll("line.data-line")
                .transition().duration(100)
                .style("opacity", 1)
                .attr("stroke-width", 0.3);

        });
    

    chart.append('text')
        .attr('id', 'title')
        .attr('x', dimensions.width / 2)
        .attr('y', dimensions.height/2 + 100)
        .attr('text-anchor', 'middle')
        .style('font-size', '26px')
        .style('fill', 'black')
        .style('opacity', 0)



    chart.append("text")
        .attr("id", "number")
        .attr("x", dimensions.width / 2)
        .attr("y", dimensions.height / 2 + 140)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("fill", "red")
        .style("opacity", 0);




    // Define a pattern for the image
    chart.append("defs")
        .append("pattern")
        .attr("id", "image-pattern")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("width", 180)
        .attr("height", 180);

    // Append rect element for displaying food images
    chart.append("rect")
        .attr("id", "image-rect")
        .attr("x", dimensions.width / 2 - 81)
        .attr("y", dimensions.height / 2 - 100)
        .attr("width", 180)
        .attr("height", 180)
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

    const radius = 200;

    bounds.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius) // Smaller radius
        .attr("fill", "white")
        .attr("stroke", "grey")
        .attr("stroke-opacity", 0.3);


}



foodchart();
