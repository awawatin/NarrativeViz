// "use strict"
async function init() {
    var height = 500;
    var width = 500;
    var margin = 100;



    // ===============================================================================================================
    // =========================================== DATA SELECTION & GROUPING =========================================
    // ===============================================================================================================

    // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
    const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
        
    // const data_SE = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "SE");
    // const data_MI = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "MI");
    // const data_EN = data.filter(d => d.job_title === "Data Scientist" && d.experience_level === "EN");
    const data_SE = data.filter(d => d.experience_level === "SE");
    const data_MI = data.filter(d => d.experience_level === "MI");
    const data_EN = data.filter(d => d.experience_level === "EN");
        
    const grouped_data_SE =  Array.from(d3.group(data_SE, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    
    const grouped_data_MI =  Array.from(d3.group(data_MI, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    
    const grouped_data_EN =  Array.from(d3.group(data_EN, d => d.work_year),
    ([key, values]) => ({
        work_year: key,
        mean_salary: d3.mean(values, d => d.salary_in_usd)
    }));
    
    grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    // ===============================================================================================================
    // ===============================================================================================================
    // ============================================= LINE CHART DEFINITION ===========================================
    // ===============================================================================================================
    var max_val_salary = d3.max([
        d3.max(grouped_data_EN, d=>d.mean_salary),
        d3.max(grouped_data_MI, d=>d.mean_salary),
        d3.max(grouped_data_SE, d=>d.mean_salary)
    ]);
    const ys = d3.scaleLinear().domain([0, max_val_salary]).range([height, 0]);

    const xs = d3.scaleLinear().domain(d3.extent(grouped_data_SE, d=>d.work_year)).range([0,width]);
    // const ys = d3.scaleLinear().domain([0, d3.max(grouped_data_SE, d=>d.mean_salary)]).range([height, 0]);
    
    
    const line = d3.line()
        .x(function(d) {return xs(d.work_year);})
        .y(function(d) {return ys(d.mean_salary);})
        .curve(d3.curveMonotoneX);
    
    // ===============================================================================================================

    
    // ===============================================================================================================
    // =============================================== ANNOTATIONS ===================================================
    // ===============================================================================================================

    var label_color= d3.color("brown").darker(); 
    const annotations_EN = [
        {
            note: {
                label: "Lowest salary with $54,905.25",
                title: "Entry Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2021'),
            y: ys(54905.25454545455),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 75,
            dx: 45,
            color: label_color
        }
    ];
    const annotations_MI = [
        {
            note: {
                label: "Lowest salary with $82,116.93",
                title: "Medium Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2021'),
            y: ys(82116.93478260869),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 75,
            dx: 150,
            color: label_color
        }
    ];
    
    const annotations_SE = [
        {
            note: {
                label: "Lowest salary with $126,085.36",
                title: "Senior Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2021'),
            y: ys(126085.3561643835),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 40,
            dx: -5,
            color: label_color
        }
    ];

    const makeAnnotations_EN = d3.annotation()
            .annotations(annotations_EN);
    
    const makeAnnotations_MI = d3.annotation()
            .annotations(annotations_MI);
    const makeAnnotations_SE = d3.annotation()
            .annotations(annotations_SE);
    // ===============================================================================================================

    
    // ===============================================================================================================
    // ======================================== CREATE && DRAW SVG ===================================================
    // ===============================================================================================================
    d3.select("svg")
    .attr("width", width + 2*margin)
    .attr("height", height + 2*margin)
    
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .call(makeAnnotations_EN)

    .append('path')
    .datum(grouped_data_EN)
    .attr("class", "line") 
    .attr('fill', 'none')
    .attr('stroke', 'red')
    .attr('stroke-width', 1.5)
    .attr('d', line);

d3.select('svg')
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
    .selectAll(".dot")
    .data(grouped_data_EN)
    .enter()
    .append("circle")
    .attr("class", "dot") 
    .attr("cx", d => xs(d.work_year))
    .attr("cy", d => ys(d.mean_salary))
    .attr("r", 2);
    // ===============================================================================================================

    // ===============================================================================================================
    // ========================================== AXES SETTING ======================================================
    // ===============================================================================================================

    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+margin+")")
        .call(d3.axisLeft(ys))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2",width)
            .attr("stroke-opacity",0.1));
    
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+(height+margin)+")")
        .call(d3.axisBottom(xs).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")))
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 200)
        .attr("y", height + margin*1.5)
        .attr("transform", "translate(175,30)")
        .text("Work Years");
    // ===============================================================================================================
    // ===============================================================================================================
    // ========================================== AXES LABELING ======================================================
    // ===============================================================================================================

    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 200)
              .attr("y", height + margin*1.2)
              .attr("transform", "translate(175,30)")
              .text("Work Years");
    
    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 160)
              .attr("y", 90)
              .text("Mean Salary in USD ($)");
    // ===============================================================================================================
    
    // ===============================================================================================================
    // =============================================== ANNOTATIONS ===================================================
    // ===============================================================================================================
    var label_color= d3.color("brown").darker(); 
    const annotations_EN_high = [
        {
            note: {
                label: "Highest salary with $95,283.97",
                title: "Entry Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2023'),
            y: ys(95283.96610169491),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 100,
            dx: -100,
            color: label_color
        }
    ];

    const annotations_MI_high = [
        {
            note: {
                label: "Highest salary with $116,297.60",
                title: "Medium Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2023'),
            y: ys(116297.596875),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 250,
            dx: -25,
            color: label_color
        }
    ];
    const annotations_SE_high = [
        {
            note: {
                label: "Highest salary with $159,568.93",
                title: "Senior Level",
                wrap: 100
            },
            type:d3.annotationCalloutCircle,
            x: xs('2023'),
            y: ys(159568.9285159285),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 70,
            dx: -70,
            color: label_color
        }
    ];
    const makeAnnotations_EN_high = d3.annotation()
    .annotations(annotations_EN_high);

    const makeAnnotations_MI_high = d3.annotation()
    .annotations(annotations_MI_high);

    const makeAnnotations_SE_high = d3.annotation()
    .annotations(annotations_SE_high);


    const button_exp2 = document.getElementById('exp2')
    var two_done = 'false'
    var clicked_next = 0;
    button_exp2.addEventListener('click', function() {
        two_done = 'true' 
        clicked_next = clicked_next + 1;
        if(clicked_next == "1"){
            d3.select("svg")
                .append("g")
                .attr("transform", "translate("+margin+","+margin+")")
                .call(makeAnnotations_MI)
            
                .append('path')
                .datum(grouped_data_MI)
                .attr("class", "line") 
                .attr('fill', 'none')
                .attr('stroke', 'green')
                .attr('stroke-width', 1.5)
                .attr('d', line);
            
            d3.select('svg')
                .append("g")
                .attr("transform", "translate("+margin+","+margin+")")
                .selectAll(".dot")
                .data(grouped_data_MI)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", d => xs(d.work_year))
                .attr("cy", d => ys(d.mean_salary))
                .attr("r", 2);
        }
        else if(clicked_next == "2"){
            d3.select("svg")
            .attr("width", width + 2*margin)
            .attr("height", height + 2*margin)
            
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .call(makeAnnotations_SE)
        
            .append('path')
            .datum(grouped_data_SE)
            .attr("class", "line") 
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);
        
            
        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .selectAll(".dot")
            .data(grouped_data_SE)
            .enter()
            .append("circle") 
            .attr("class", "dot")
            .attr("cx", d => xs(d.work_year))
            .attr("cy", d => ys(d.mean_salary))
            .attr("r", 2);
        }
        else if(clicked_next == "3"){
            d3.selectAll(".annotations").remove()

            d3.select("svg")
            .attr("width", width + 2*margin)
            .attr("height", height + 2*margin)
            
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .call(makeAnnotations_EN_high)
            setTimeout(() => {
                d3.select("svg")
                .attr("width", width + 2*margin)
                .attr("height", height + 2*margin)
                
                .append("g")
                .attr("transform", "translate("+margin+","+margin+")")
                .call(makeAnnotations_MI_high)
              }, 2000)
            setTimeout(() => {
                d3.select("svg")
                .attr("width", width + 2*margin)
                .attr("height", height + 2*margin)
                
                .append("g")
                .attr("transform", "translate("+margin+","+margin+")")
                .call(makeAnnotations_SE_high)
              }, 4000) 
        }
        else{
            window.location.href = 'page-3.html'; 
        }
    });
    

    
    // ==================================================================================
    // ============================== LEGENDS SETTINGS ==================================
    // ==================================================================================

    const legend_Dict = [
                        {color: "steelblue", label: "Senior Level Position"},
                        {color: "green", label: "Middle Level Position"},
                        {color: "red", label: "Entry Level Position"}];
    
    
    const legend = d3.select('svg').selectAll(".legend")
                    .data(legend_Dict)
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", (d, i) => "translate("+(200*i)+",0)");

    legend.append("rect")
        .attr('x', width/2 - 150)
        .attr('y', 40)
        .attr("width", 12)
        .attr("height", 12)
        .style("fill", d => d.color);


    legend.append("text")
        .attr("x", width/2 - 130)
        .attr("y", 50)
        .attr("dy", ".10em")
        .style("text-anchor", "start")
        .text(d => d.label);
    // ==================================================================================

}

    
    
    
   
    

    
    
    
    