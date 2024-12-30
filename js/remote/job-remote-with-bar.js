// "use strict"
async function init() {
    // =============================================== DATA SELECTION =============================================
    // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
    const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
    // ============================================================================================================

    var annotation = CreateAnnotation()
    var EN,MI,SE = filterData(data)
    var line = createLineChart(data)
    displayData(EN, MI, SE, annotation, year, line)

}

// =============================================== ANNOTATIONS ================================================
function CreateAnnotation(){
    const annotations = [    
    {
        note: { 
          title: "Equalization Period", 
          lineType: "none", 
          align: "middle",
          wrap: 150
        },
        subject: {
          height: height - margin.top - margin.bottom,
          width: 100
        },
        type: d3.annotationCalloutRect,
        y: margin.top,
        x: xs(2021),
        disable: ["connector"]
      }
];
    const makeAnnotations = d3.annotation()
                .annotations(annotations);

    return makeAnnotations;
}
// ==============================================================================================================
function createLineChart(data){

    const EN_line =  Array.from(d3.group(data_EN, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    
    const MI_line =  Array.from(d3.group(data_MI, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    const SE_line =  Array.from(d3.group(data_SE, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    
    
    EN_line.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    MI_line.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    SE_line.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    
    const x_line = d3.scaleLinear().domain(d3.extent(EN_line, d=>d.work_year)).range([0,width]);
    const y_line = d3.scaleLinear().domain([0, d3.max(EN_line, d=>d.mean_salary)]).range([height, 0]);
        
    const line = d3.line()
        .x(function(d) {return x_line(d.work_year);})
        .y(function(d) {return y_line(d.mean_salary);})
        .curve(d3.curveMonotoneX);

    return line;    
}

function filterData(data){
    var height = 500;
    var width = 500;
    var margin = 100;

    
    const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE");
    const data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI");
    const data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN");
        
    const grouped_data_SE =  Array.from(d3.group(data_SE, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        remote: d3.mean(values, d => d.remote_ratio)
    }));
    const grouped_data_MI =  Array.from(d3.group(data_MI, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        remote: d3.mean(values, d => d.remote_ratio)
    }));

    const grouped_data_EN =  Array.from(d3.group(data_EN, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        remote: d3.mean(values, d => d.remote_ratio)
    }));
    grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));

    return grouped_data_SE, grouped_data_MI, grouped_data_EN;
}



const xs = d3.scaleBand().domain(grouped_data_EN.map(d=>d.work_year)).range([0,width]).padding(0.5);
const ys = d3.scaleLinear().domain([0, d3.max(grouped_data_EN, d=>d.remote)]).range([height, 0]);


// ================================================================================================================

console.log("EN", grouped_data_EN)
console.log("MI", grouped_data_MI)
console.log("SE", grouped_data_SE)
// ============================================ CANVAS SETTINGS ====================================================
// ================================= ENTRY_LEVEL EXP =================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnota    tions)

    .selectAll('rect')
    .data(grouped_data_EN)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr('fill', 'red');

    // ======================== LINE CHART ========================
    d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .append('path')
    .datum(EN_line)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 1.5)
    .attr('d', line);
    // =============================================================
// ==================================================================================

// ================================= MID_LEVEL EXP ==================================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(grouped_data_MI)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr("transform", "translate("+20+", 0)")
    .attr('fill', 'green');
    // ======================== LINE CHART ========================
    // d3.select("svg")
    // .attr("width", width + 2*margin)
    // .attr("height", height + 2*margin)
    // .append("g")
    // .attr("transform", "translate("+margin+","+margin+")")
    // .append('path')
    // .datum(MI_line)
    // .attr("class", "line") 
    // .attr('fill', 'none')
    // .attr('stroke', 'red')
    // .attr('stroke-width', 1.5)
    // .attr('d', line);
    // =============================================================
// ==================================================================================
// ================================= SENIOR_LEVEL EXP ===============================
d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+",0)")
    //  .call(makeAnnotations)

    .selectAll('rect')
    .data(grouped_data_SE)
    .enter()
    .append('rect')
    .attr('x', function(d) {return xs(d.work_year);})
    .attr('y', function(d) {return ys(d.remote);})
    .attr('width', 20)
    .attr('height', function(d) {return height - ys(d.remote);})
    .attr("transform", "translate("+40+", "+100+")")
    .attr('fill', 'steelblue');
    
    // ======================== LINE CHART ========================
    // d3.select("svg")
    // .attr("width", width + 2*margin)
    // .attr("height", height + 2*margin)
    // .append("g")
    // .attr("transform", "translate("+margin+","+margin+")")
    // .append('path')
    // .datum(SE_line)
    // .attr("class", "line") 
    // .attr('fill', 'none')
    // .attr('stroke', 'red')
    // .attr('stroke-width', 1.5)
    // .attr('d', line);
    // =============================================================
// ==================================================================================

// ============================== LEGENDS SETTINGS ==================================
const legend_Dict = [
    {color: "steelblue", label: "Senior Level Position"},
    {color: "green", label: "Middle Level Position"},
    {color: "red", label: "Entry Level Position"}];


const legend = d3.select('svg').selectAll(".legend")
.data(legend_Dict)
.enter().append("g")
.attr("class", "legend")
.attr("transform", (d, i) => "translate(15,"+(25*i)+")");

legend.append("rect")
.attr('x', width)
.attr('y', height-460)
.attr("width", 15)
.attr("height", 15)
.style("fill", d => d.color);


legend.append("text")
.attr("x", width + 30)
.attr("y", height-452)
.attr("dy", ".30em")
.style("text-anchor", "start")
.text(d => d.label);
// ==================================================================================
// ========================================== AXES SETTING ======================================================
d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+margin+")")
    .call(d3.axisLeft(ys));

d3.select("svg")
    .append("g")
    .attr("transform", "translate("+margin+", "+(height+margin)+")")
    .call(d3.axisBottom(xs))
    .selectAll('text') 
    .attr("transform", "translate(10,20)rotate(25)");
// ================================================================================================================
// ========================================== AXES LABELING ======================================================
d3.select('svg').append("text")
          .attr("text-anchor", "end")
          .attr("x", 200)
          .attr("y", height + margin*1.5)
          .attr("transform", "translate(175,30)")
          .text("Work Years");

d3.select('svg').append("text")
          .attr("text-anchor", "end")
          .attr("x", 160)
          .attr("y", 75)
          .text("Mean Salary in USD ($)");  
// ================================================================================================================


}

