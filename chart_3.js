
async function foodchart() {

    // 1. Create data object

    const data = await d3.csv("Data_with_pics.csv")

    const name = d => d["Names"];
    const colorAccessor = d => d["Category"];
    const total = d => +d["Total"];
    const image = d => d["Images"];

    const preloadedImages = [];
    data.forEach(d => {
        const img = new Image();
        img.src = image(d);
        preloadedImages.push(img);
    });


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

// 4. Create scales
// Use the gradients in the color scale
const colorScale = d3.scaleOrdinal()
    .domain(["Vegetables", "Fruits", "Meat","Legumes", "Nuts", "Dairy", "Fish", "Nothing"]) // Add more categories as needed
    .range(["url(#gradientBlue)", 
        "url(#gradientOrange)",
        "url(#gradientGreen)",  
        "url(#gradientTeal)",  
        "url(#gradientPurple)", 
        "url(#gradientRed)", 
        "url(#gradientPink)",
        "grey"]); // Add more gradient references as needed

    const radiusScale = d3.scalePow()
        .domain([d3.min(data,d => total(d)), 1])
        .range([3, 10])
        .exponent(2);

    const radiusMedScale = d3.scalePow()
        .domain([1, 7])
        .range([10, 18])
        .exponent(2);

    function filterGreaterThan609(data) {
        return data.filter(d => total(d) > 6.09);
    }

        // Example usage:
    const filteredData = filterGreaterThan609(data);

    const radiusScaleBig = d3.scalePow()
        .domain([0, d3.max(filteredData, total)])   
        .range([20,24])
        .exponent(2);


    function calculatePosition(index, total, radius) {
        const angle = ((index / total) * 2 * Math.PI) - 1/2 * Math.PI;
        const cx = radius * Math.cos(angle);
        const cy = radius * Math.sin(angle);
        return { cx, cy };
    }

    function trafficColour(Total){
        if (Total > 2){
            return "red"
        }
        else if (Total > 1){
            return "orange"
        }
        else {
            return "green"
        }
    }

    // 5. Draw data
    const paddingAngle = 0.07; // Adjust this value as needed

    // 5. Draw data
    
    const bounds = chart.append("g")
        .style("transform", `translate(${dimensions.width/2}px, ${dimensions.height/2}px)`);
    
    const radius = 350;
    
    // Calculate the start and end angles for each category
    const categoryCounts = d3.rollup(data, v => v.length, colorAccessor);
    const totalDataPoints = data.length;
    let currentAngle = 0;

    const categoryAngles = Array.from(categoryCounts).map(([category, count]) => {
        const startAngle = currentAngle;
        const endAngle = currentAngle + (count / totalDataPoints) * 2 * Math.PI - paddingAngle;
        currentAngle = endAngle + paddingAngle;
        return { category, startAngle, endAngle };
    });
    // Create an arc for each category
    const arcGenerator = d3.arc()
        .innerRadius(radius - 40)
        .outerRadius(radius - 41);

    const PathGenerator = d3.arc()
        .innerRadius(radius - 80) // Reduced radius for text path
        .outerRadius(radius - 81);

    categoryAngles.forEach(({ category, startAngle, endAngle }) => {
        bounds.append("path")
            .attr("class", `${category}Arc`)
            .attr("d", arcGenerator.startAngle(startAngle).endAngle(endAngle))
            .attr("fill", "none")
            .attr("stroke", "#E8EAF4")
            .attr("stroke-opacity", 1)
            .attr("stroke-width", 1);
    });
    // Add text paths for each category
    categoryAngles.forEach(({ category, startAngle, endAngle }) => {
        const pathId = `${category}TextPath`;
        bounds.append("path")
            .attr("id", pathId)
            .attr("d", PathGenerator.startAngle(startAngle).endAngle(endAngle))
            .attr("fill", "none")
            .attr("stroke", "none");

        const textPath = bounds.append("text")
            .attr("id", `${category}Text`)
            .append("textPath")
            .attr("xlink:href", `#${pathId}`)
            .attr("startOffset", "24%")
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .style("fill", "#aaaaaa")
            .style("font-family", "Zapfino")
            .style("font-size", "14px")
            .text(category);

    });

    const dots = bounds.selectAll("circle.data-circle")
        .data(data)
        .join("circle")
        .attr("class", "data-circle")
        .attr("cx", (d, i) => calculatePosition(i, data.length, radius).cx)
        .attr("cy", (d, i) => calculatePosition(i, data.length, radius).cy)
        .attr("r", d => name(d) == "Nothing" ? 0 : total(d) > 6.09 ? radiusScaleBig(total(d)) : total(d) > 1.24 ? radiusMedScale(total(d)) : radiusScale(total(d)))
        .attr("fill", d => colorScale(colorAccessor(d)))
        .attr("fill-opacity", 0.6)
        .attr("stroke", d => colorAccessor(d) == "Nothing" ? "white" : colorScale(colorAccessor(d)))
        .attr("stroke-width", 2)
        .attr('stroke-opacity', 0.4)
        .on("mouseover", function(event, d) {

            d3.selectAll("circle.data-circle")
                .filter(circle => circle !== d)
                .transition().duration(100)
                .style("opacity", 0.1);

            d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .LegumesArc, .NutsArc, .DairyArc, .FishArc")
                    .transition().duration(100)
                    .attr("stroke", trafficColour(total(d)))
                    .attr("stroke-width", 4)
                    .attr("stroke-opacity", 0.4);



            if (colorAccessor(d) == "Vegetable") {
                d3.selectAll(".FruitArc, .MeatArc, .LegumesArc, .NutsArc, .DairyArc, .FishArc, #FruitText, #MeatText, #LegumesText, #NutsText, #DairyText, #FishText")
                    .transition().duration(100)
                    .attr('fill-opacity', 0)
                    .attr("stroke-opacity", 0)
            }
            else if (colorAccessor(d) == "Fruit") {
                d3.selectAll(".VegetableArc, .MeatArc, .LegumesArc, .NutsArc, .DairyArc, .FishArc,  #VegetableText, #MeatText, #LegumesText, #NutsText, #DairyText, #FishText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
            else if (colorAccessor(d) == "Meat") {
                d3.selectAll(".VegetableArc, .FruitArc, .LegumesArc, .NutsArc, .DairyArc, .FishArc,  #FruitText, #VegetableText, #LegumesText, #NutsText, #DairyText, #FishText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
            else if (colorAccessor(d) == "Legumes") {
                d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .NutsArc, .DairyArc, .FishArc, #FruitText, #VegetableText, #MeatText, #NutsText, #DairyText, #FishText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
            else if (colorAccessor(d) == "Nuts") {
                d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .LegumesArc, .DairyArc, .FishArc,  #FruitText, #VegetableText, #MeatText, #LegumesText, #DairyText, #FishText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
            else if (colorAccessor(d) == "Dairy") {
                d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .LegumesArc, .NutsArc, .FishArc, #FruitText, #VegetableText, #MeatText, #LegumesText, #NutsText, #FishText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
            else if (colorAccessor(d) == "Fish") {
                d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .LegumesArc, .NutsArc, .DairyArc,  #FruitText, #VegetableText, #MeatText, #LegumesText, #NutsText, #DairyText")
                .transition().duration(100)
                .attr('fill-opacity', 0)
                .attr("stroke-opacity", 0);
            }
                
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
                

            d3.select('#inner-circle')
                .transition().duration(100)
                .attr("fill", trafficColour(total(d)))
                .attr("fill-opacity", 0.05)
                .attr("stroke", trafficColour(total(d)))
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0.4);


            chart.append("text")
                .attr("class", "hover-title")
                .attr("x", dimensions.width / 2)
                .attr("y", dimensions.height / 2 + 112)
                .attr("text-anchor", "middle")
                .style("fill", "black")
                .text(name(d));


            chart.append("text")
                .attr("class", "hover-total")
                .attr("x", dimensions.width / 2)
                .attr("y", dimensions.height / 2 + 155)
                .attr("text-anchor", "middle")
                .style("fill", trafficColour(total(d)))
                .attr("fill-opacity", 0.7)
                .html(total(d)+ " kgCO<tspan baseline-shift='sub' font-size='12px'>2</tspan>e");

            d3.selectAll('.Sub_Lines')
                .transition().duration(100)
                .style('opacity', 0);

        })
        .on("mouseout", function() {

            d3.select('#inner-circle')
                .transition().duration(100)
                .attr("fill", "white")
                .attr("stroke-opacity", 0)

            d3.selectAll(".VegetableArc, .FruitArc, .MeatArc, .LegumesArc, .NutsArc, .DairyArc, .FishArc, #VegetableText, #FruitText, #MeatText, #LegumesText, #NutsText, #DairyText, #FishText")
                .transition().duration(100)
                .attr("stroke", "#E8EAF4")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 1)
                .attr("fill-opacity", 1);

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

            d3.selectAll('.Sub_Lines')
                .transition().duration(300)
                .style('opacity', 1);

        });

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
        .style('font-size', '64px')
        .html('<tspan x="' + (dimensions.width / 2) + '" dy="0">Food</tspan><tspan x="' + (dimensions.width / 2) + '" dy="1.2em">Chart</tspan>');

    chart.append('line')
        .attr('class', 'Sub_Lines')
        .attr('x1', dimensions.width/2 - 150)
        .attr('x2', dimensions.width/2 + 150)
        .attr('y1', dimensions.height/2 + 40)
        .attr('y2', dimensions.height/2 + 40)
        .attr('stroke', '#BABBD0')

        chart.append('line')
        .attr('class', 'Sub_Lines')
        .attr('x1', dimensions.width/2 )
        .attr('x2', dimensions.width/2 )
        .attr('y1', dimensions.height/2 + 50)
        .attr('y2', dimensions.height/2 + 130)
        .attr('stroke', '#BABBD0')


    chart.append('text')
        .attr('class', 'Subtitle')
        .attr('x', dimensions.width/2 - 50)
        .attr('y', dimensions.height/2 + 10)
        .attr('text-anchor', 'middle')
        .html('<tspan x="' + (dimensions.width / 2 - 70) + '" dy="80px" font-weight="bold">102</tspan><tspan x="' + (dimensions.width / 2 - 70) + '" dy="1.7em">Food Items</tspan>')

    chart.append('text')
        .attr('class', 'Subtitle')
        .attr('x', dimensions.width/2)
        .attr('y', dimensions.height/2 + 10)
        .attr('text-anchor', 'middle')
        .html('<tspan x="' + (dimensions.width / 2 + 70) + '" dy="80px" font-weight="bold">7</tspan><tspan x="' + (dimensions.width / 2 + 70) + '" dy="1.7em">Categories</tspan>')



    // Define a pattern for the image
    chart.append("defs")
        .append("pattern")
        .attr("id", "image-pattern")
        .attr("width", 1)
        .attr("height", 1)
        .append("image")
        .attr("width", 250)
        .attr("height", 250);

    // Append rect element for displaying food images
    chart.append("rect")
        .attr("id", "image-rect")
        .attr("x", dimensions.width/2 - 130 )
        .attr("y", dimensions.height / 2 - 170)
        .attr("width", 250)
        .attr("height", 250)
        .style("opacity", 0);

    // 6. Draw peripherals

    bounds.append("circle")
        .attr('id', 'inner-circle')
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", radius - 150) // Smaller radius
        .attr("fill", "white")
        .attr('fill-opacity', 0)
        .attr("stroke-opacity", 0);

}

foodchart();
