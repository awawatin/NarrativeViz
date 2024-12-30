// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 100;

// =============================================== DATA SELECTION =============================================
// const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
// ============================================================================================================

// =============================================== ANNOTATIONS ================================================
// Features of the annotation
// var annotations = data.map(d => ({
//     note: { label: `(${d.AverageCityMPG}, ${d.AverageHighwayMPG})` },
//     x: xs(d.AverageCityMPG),
//     y: ys(d.AverageHighwayMPG),
//     dx: 0.5,
//     dy: 0.5
// }));

// var makeAnnotations = d3.annotation().annotations(annotations);
// ==============================================================================================================




// ========================================== LINE CHART DEFINITION ==============================================
const new_data = Array.from(d3.group(data, d => d.work_year),
    ([key, values]) => ({
        work_year: +key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));

new_data.sort((a,b) => d3.ascending(a.work_year, b.work_year));

const xs = d3.scaleLinear().domain(d3.extent(new_data, d=>d.work_year)).range([0,width]);
const ys = d3.scaleLinear().domain([0, d3.max(new_data, d=>d.mean_salary)]).range([height, 0]);

const line = d3.line()
    .x(function(d) {return xs(d.work_year);})
    .y(function(d) {return ys(d.mean_salary);})
    .curve(d3.curveMonotoneX);


// ================================================================================================================

console.log("here", new_data)
// ============================================ CANVAS SETTINGS ====================================================
// function update(data){

    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        //  .call(makeAnnotations)

        .append('path')
        .datum(new_data)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'blue')
        .attr('stroke-width', 1.5)
        .attr('d', line);

    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)

        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")

        .selectAll('dot')
        .data(new_data)
        .enter()
        .append('circle')
        .attr("cx", function (d) { return xs(d.work_year); } )
        .attr("cy", function (d) { return ys(d.mean_salary); } )
        .attr("r", 3)
        .attr('fill', 'red');
    // ================== AXES ==================
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+margin+")")
        .call(d3.axisLeft(ys));

    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+(height+margin)+")")
        .call(d3.axisBottom(xs).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")));
// ============================================
// }

// update(data)
// ================================================================================================================


}

