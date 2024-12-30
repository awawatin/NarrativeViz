// "use strict"
async function init() {
var height = 500;
var width = 500;
var margin = 100;

// =============================================== DATA SELECTION =============================================
const data = await d3.csv("https://raw.githubusercontent.com/awawatin/NarrativeViz/refs/heads/main/data/ds_salaries.csv");
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
const new_data = Array.from(d3.group(data, d => d.job_title),
    ([key, values]) => ({
        job_title: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    })).slice(0, 8);

new_data.sort((a,b) => d3.ascending(a.mean_salary, b.mean_salary));

const xs = d3.scaleBand().domain(new_data.map(d=>d.job_title)).range([0,width]).padding(0.5);
const ys = d3.scaleLinear().domain([0, d3.max(new_data, d=>d.mean_salary)]).range([height, 0]);

// const line = d3.line()
//     .x(function(d) {return xs(d.job_title);})
//     .y(function(d) {return ys(d.mean_salary);})
//     .curve(d3.curveMonotoneX);


// ================================================================================================================

console.log("here", new_data)
// ============================================ CANVAS SETTINGS ====================================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(new_data)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.job_title);})
    .attr('y', function(d) {return ys(d.mean_salary);})
    .attr('width', 33.3333)
    .attr('height', function(d) {return height - ys(d.mean_salary);})
    .attr('fill', 'steelblue');

// ================== AXES ==================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    .call(d3.axisBottom(xs))
    .selectAll('text') 
    .attr("transform", "translate(10,20)rotate(25)")
    .attr('fill', 'teal')

// ============================================


// ================================================================================================================


}

