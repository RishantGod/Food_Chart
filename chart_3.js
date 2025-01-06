async function foodchart() {

    // 1. Create data object

    const data = await d3.csv("Data_with_pics.csv")

    const name = d => d["Names"];
    const colorAccessor = d => d["Category"];
    const total = d => +d["Total"];
    const image = d => d["Images"];

    const agriculture = d => +d["Agriculture"];
    const transformation = d => +d["Transformation"];
    const packaging = d => +d["Packaging"];
    const transport = d => +d["Transportation"];
    const retail = d => +d["Supermarket_and_distribution"];
    const consumption = d => +d["Consumption"];



    function findHighestCategory(d, index) {
        const categories = {
            "Agriculture": agriculture(d),
            "Transformation": transformation(d),
            "Packaging": packaging(d),
            "Transportation": transport(d),
            "Supermarket_and_distribution": retail(d),
            "Consumption": consumption(d)
        };
        const highestCategory = Object.keys(categories).reduce((a, b) => categories[a] > categories[b] ? a : b);
        return { highestCategory, index };
    }

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
 

// Define linear gradients
const defs = chart.append("defs");

const gradientBlue = defs.append("linearGradient")
    .attr("id", "gradientBlue")
    .attr("x1", "50%")
    .attr("y1", "50%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientBlue.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#2193B0");

gradientBlue.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#6DD5ED");

const gradientGreen = defs.append("linearGradient")
    .attr("id", "gradientGreen")
    .attr("x1", "50%")
    .attr("y1", "50%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientGreen.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#7DC462");

gradientGreen.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#0D95D0");


const gradientPink = defs.append("linearGradient")
    .attr("id", "gradientPink")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientPink.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#FF69B4");

gradientPink.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FFDAB9");


const gradientTeal = defs.append("linearGradient")
    .attr("id", "gradientTeal")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientTeal.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#1ABC9C"); // Purple

gradientTeal.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#A3E4D7"); 

const gradientOrange = defs.append("linearGradient")
    .attr("id", "gradientOrange")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientOrange.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#F37335"); // Purple

gradientOrange.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FDC830"); // Yellow

const gradientPurple = defs.append("linearGradient")
    .attr("id", "gradientPurple")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "110%")
    .attr("y2", "110%");

gradientPurple.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#8E44AD");  // Slightly darker green (Lime Green)

gradientPurple.append("stop")
    .attr("offset", "80%")
    .attr("stop-color", "#D2B4DE") 

const gradientRed = defs.append("linearGradient")
    .attr("id", "gradientRed")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%");

gradientRed.append("stop")
    .attr("offset", "0%")
    .attr("stop-color", "#D72638");  // Slightly darker green (Lime Green)

gradientRed.append("stop")
    .attr("offset", "100%")
    .attr("stop-color", "#FFA07A") 


// ...define more gradients as needed...

// Use the gradients in the color scale
const colorScale = d3.scaleOrdinal()
    .domain(data.map(colorAccessor))
    .range(["url(#gradientBlue)", 
        "url(#gradientOrange)",
        "url(#gradientGreen)",  
        "url(#gradientTeal)",  
        "url(#gradientPurple)", 
        "url(#gradientRed)", 
        "url(#gradientPink)",]); // Add more gradient references as needed

    const radiusScale = d3.scalePow()
        .domain([0, 1])
        .range([3, 10])
        .exponent(2);

    const radiusMedScale = d3.scalePow()
        .domain([1, 6.09])
        .range([10, 18])
        .exponent(2);

    function filterGreaterThan609(data) {
        return data.filter(d => total(d) > 6.09);
    }
        
        // Example usage:
    const filteredData = filterGreaterThan609(data);


    const radiusScaleBig = d3.scalePow()
        .domain([0, d3.max(filteredData, total)])   
        .range([20,30])
        .exponent(2);

    console.log("Filtered data:", filteredData);

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
        .attr("r", d => total(d) > 6.09 ? radiusScaleBig(total(d)) : total(d) > 1.24 ? radiusMedScale(total(d)) : radiusScale(total(d)))
        .attr("fill", d => colorScale(colorAccessor(d)))
        .attr("fill-opacity", 0.6)
        .attr("stroke", d => colorScale(colorAccessor(d)))
        .attr("stroke-width", 2)
        .attr('stroke-opacity', 0.4)
        .on("mouseover", function(event, d) {

            d3.selectAll("circle.data-circle")
                .filter(circle => circle !== d)
                .transition().duration(100)
                .style("opacity", 0.1);


            d3.select('.Plate_title')
                .transition().duration(100)
                .style('opacity', 0);

            d3.selectAll('.Subtitle')
                .transition().duration(100)
                .style('opacity', 0);

            d3.select("#image-rect")
                .attr("fill", `url(#image-pattern)`)
                .style("opacity", 1);
    
            d3.select("#image-pattern image")
                .attr("xlink:href", image(d));

            d3.selectAll('path.data-symbol')
                .attr('fill-opacity', 0)

            chart.append("text")
                .attr("class", "hover-title")
                .attr("x", dimensions.width / 2)
                .attr("y", dimensions.height / 2 + 130)
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .text(name(d));


            chart.append("text")
                .attr("class", "hover-total")
                .attr("x", dimensions.width / 2)
                .attr("y", dimensions.height / 2 + 170)
                .attr("text-anchor", "middle")
                .style("font-size", "22px")
                .style("fill", total(d) > 2 ? "red" : total(d) > 1 ? "orange": "green")
                .html(total(d)+ " kgCO<tspan baseline-shift='sub' font-size='12px'>2</tspan>e");
            
        })
        .on("mouseout", function() {
        

            d3.selectAll(".hover-title").remove();
            d3.selectAll(".hover-total").remove();

            d3.selectAll("circle.data-circle")
                .transition().duration(100)
                .style("opacity", 1);
                
            
            d3.select('.Plate_title')
                .transition().duration(300)
                .style('opacity', 1);

            d3.selectAll('.Subtitle')
                .transition().duration(300)
                .style('opacity', 1);



            d3.select("#image-rect")
                .style("opacity", 0);
            
            d3.selectAll('path.data-symbol')
                .attr('fill-opacity', 0.4)
            

        });
    const symbolGenerator = d3.symbol()
        .type(d3.symbolSquare) // Set the type to diamond
        .size(30);

    const symbols = bounds.selectAll("path.data-symbol")
        .data(data.map((d, i) => ({ ...findHighestCategory(d, i), data: d })).filter(d => total(d.data) > 1))
        .join("path")
        .attr("class", "data-symbol")
        .attr("d", symbolGenerator) // Use diamond symbol for Packaging
        .attr("transform", d => {
            const { cx, cy } = calculatePosition(d.index, data.length, radius - 75, total(d.data));
            return `translate(${cx}, ${cy}) rotate(45)`; // Position symbols below the circles
        })
        .attr("fill", 'grey')
        .attr('fill-opacity', 0.4 );


    chart.append('text')
        .attr('class','Food_Name')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 - 50)
        .attr('text-anchor', 'middle')
        .style('font-size', '24px')



    chart.append('text')
        .attr('class', 'Plate_title')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 - 60)
        .attr('text-anchor', 'middle')
        .style('font-size', '34px')
        .html('Food Chart');
    
    chart.append('text')
        .attr('class', 'Subtitle')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 +10)
        .attr('text-anchor', 'middle')
        .html('<tspan font-weight="bold">102</tspan> Food Items')

    chart.append('text')
        .attr('class', 'Subtitle')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 + 50)
        .attr('text-anchor', 'middle')
        .html('<tspan font-weight="bold">7</tspan> Categories')

        
    chart.append('text')
        .attr('class', 'Subtitle')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 + 90)
        .attr('text-anchor', 'middle')
        .html('<tspan font-weight="bold">6</tspan> Stages')





    // Define a pattern for the image
    chart.append("defs")
        .append("pattern")
        .attr("id", "image-pattern")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("width", 300)
        .attr("height", 300);

    // Append rect element for displaying food images
    chart.append("rect")
        .attr("id", "image-rect")
        .attr("x", dimensions.width/2 - 150 )
        .attr("y", dimensions.height / 2 - 190)
        .attr("width", 300)
        .attr("height", 300)
        .style("opacity", 0);
    



    // 6. Draw peripherals


    bounds.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius - 100) // Smaller radius
        .attr("fill", "white")
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
