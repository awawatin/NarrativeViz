// "use strict"
async function init() {
    var height = 650;
    var width = 650;
    var margin = 100;
    
    // =============================================== DATA SELECTION =============================================
    const data = await d3.csv("https://raw.githubusercontent.com/awawatin/NarrativeViz/refs/heads/main/data/ds_salaries.csv");
    // const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
    // ============================================================================================================
    var small_flag = document.querySelector('.small').checked;
    var mid_flag = document.querySelector('.mid').checked;
    var large_flag = document.querySelector('.large').checked;
    var all_flag = document.querySelector('.all').checked;

    var fifty_flag = document.querySelector('.fifty').checked;
    var hundred_flag = document.querySelector('.hundred').checked;
    var zero_flag = document.querySelector('.zero').checked;
    var all_remote = document.querySelector('.all_remo').checked;
    
    var absolute_flag = document.querySelector('.abs').checked;
    var relative_flag = document.querySelector('.rel').checked;
    
    document.querySelector('.fifty').disabled = false;
    document.querySelector('.mid').disabled = false;
    document.querySelector('.zero').disabled = false;
    document.querySelector('.small').disabled = false;

    if(relative_flag && mid_flag){
        let output = document.querySelector('.fifty')
        // @ Checked false
        output.checked = false;
        // @ Look gray
        output.disabled = true

        fifty_flag = false;
    }
    else if(relative_flag && fifty_flag){
        let output = document.querySelector('.mid')
        // @ Checked false
        output.checked = false;
        // @ Look gray
        output.disabled = true

        mid_flag = false;
    }
    
    if(relative_flag && small_flag){
        let output = document.querySelector('.zero')
        // @ Checked false
        output.checked = false;
        // @ Look gray
        output.disabled = true

        zero_flag = false;
    }
    else if(relative_flag && zero_flag){
        let output = document.querySelector('.small')
        // @ Checked false
        output.checked = false;
        // @ Look gray
        output.disabled = true

        small_flag = false;
    }

 

    // ================================================= GROUPING ===================================================
    var data_SE = data.filter(d => d.experience_level === "SE");
    var data_MI = data.filter(d => d.experience_level === "MI");
    var data_EN = data.filter(d => d.experience_level === "EN");
    // ================================================= GROUPING ===================================================
    var svg = d3.select("svg");

    if(!all_flag){
        if(small_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "S");
            data_MI = data_MI.filter(d=>d.company_size == "S");
            data_EN = data_EN.filter(d=>d.company_size == "S");
        }
        else if(mid_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "M");
            data_MI = data_MI.filter(d=>d.company_size == "M");
            data_EN = data_EN.filter(d=>d.company_size == "M");
        }
        else if(large_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.company_size == "L");
            data_MI = data_MI.filter(d=>d.company_size == "L");
            data_EN = data_EN.filter(d=>d.company_size == "L");
        }
    }

    if(!all_remote){
        if(zero_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "0");
            data_MI = data_MI.filter(d=>d.remote_ratio == "0");
            data_EN = data_EN.filter(d=>d.remote_ratio == "0");
        }
        else if(fifty_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "50");
            data_MI = data_MI.filter(d=>d.remote_ratio == "50");
            data_EN = data_EN.filter(d=>d.remote_ratio == "50");
        }
        else if(hundred_flag){
            svg.selectAll("*").remove();
            data_SE = data_SE.filter(d=>d.remote_ratio == "100");
            data_MI = data_MI.filter(d=>d.remote_ratio == "100");
            data_EN = data_EN.filter(d=>d.remote_ratio == "100");
        }
    }


    if(all_remote){
        svg.selectAll("*").remove();
    }
        
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
    

    // console.log(MATH.max())
    grouped_data_SE.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_MI.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    grouped_data_EN.sort((a,b) => d3.ascending(a.work_year, b.work_year));
    // ===============================================================================================================
    // ============================================= LINE CHART DEFINITION============================================

        const xs = d3.scaleLinear().domain(['2020','2023']).range([0,width]);
        var max_val_salary = d3.max([
                            d3.max(grouped_data_EN, d=>d.mean_salary),
                            d3.max(grouped_data_MI, d=>d.mean_salary),
                            d3.max(grouped_data_SE, d=>d.mean_salary)
        ]);
        const ys = d3.scaleLinear().domain([0, max_val_salary]).range([height, 0]);
            
    
    
        const line = d3.line()
            .x(function(d) {return xs(d.work_year);})
            .y(function(d) {return ys(d.mean_salary);})
            .curve(d3.curveMonotoneX);



    if(relative_flag){
        const ys_new = d3.scaleLinear().domain([0, 4.5]).range([height, 0]);

        const line_1 = (() => {
            const starter_arr = grouped_data_EN.filter(d => d.work_year == '2020');
        
            if (starter_arr.length === 0) {
                return null; 
            } else {
                return d3.line()
                    .x(function(d) { return xs(d.work_year); })
                    .y(function(d) {
                        const starter_val = starter_arr[0].mean_salary;        
                        return ys_new(d.mean_salary / starter_val);
                    })
                    .curve(d3.curveMonotoneX);
            }
        })();

        const line_2 = (() => {
            const starter_arr = grouped_data_MI.filter(d => d.work_year == '2020');
        
            if (starter_arr.length === 0) {
                return null; 
            } else {
                return d3.line()
                    .x(function(d) { return xs(d.work_year); })
                    .y(function(d) {
                        const starter_val = starter_arr[0].mean_salary;
                        console.log("hello", d.mean_salary / starter_val);
        
                        return ys_new(d.mean_salary / starter_val);
                    })
                    .curve(d3.curveMonotoneX);
            }
        })();
        

        // var deneme = grouped_data_SE.filter(d => d.work_year == '2020')
        const line_3 = (() => {
            const starter_arr = grouped_data_SE.filter(d => d.work_year == '2020');
        
            if (starter_arr.length === 0) {
                return null; 
            } else {
                return d3.line()
                    .x(function(d) { return xs(d.work_year); })
                    .y(function(d) {
                        const starter_val = starter_arr[0].mean_salary;        
                        return ys_new(d.mean_salary / starter_val);
                    })
                    .curve(d3.curveMonotoneX);
            }
        })();

        

        displayData_rel(grouped_data_EN, grouped_data_MI, grouped_data_SE, 
            width, height, margin, line_1, line_2, line_3,xs,ys_new)
        
    }

    if(absolute_flag){
        displayData(grouped_data_EN, grouped_data_MI, grouped_data_SE, 
                       width, height, margin, line,xs,ys)
    }

    }
    
    // ==============================================================================================================
    // ============================================ CANVAS SETTINGS ====================================================
    // ================================= ENTRY_LEVEL EXP =================================
    function displayData(grouped_data_EN, grouped_data_MI, grouped_data_SE, width, height, margin, line,xs,ys)
    {
        d3.select("#ax").attr("opacity", 0.5);

    var tooltip2 = d3.select("#canvas_id")
        .append("div")
        .attr("id", "tooltip_id")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#bae6fd")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "50px")
        .style("border-style", "dotted")
        .style("width", "fit-content")
        .style("font-size", "0.9em")
        .style("padding", "10px")
        .style("opacity", "0.8")
        .html("<p>I'm a tooltip written in HTML</p>");

    d3.select("#tooltip_id")
        .style("visibility", "hidden")

    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")

        .append('path')
        .datum(grouped_data_EN)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .attr('d', line)
        
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });
               
    d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .selectAll(".dot")
        .data(grouped_data_EN)
        .enter()
        .append("circle") 
        .attr("class", "dot_class") 
        .attr("cx", d => xs(d.work_year))
        .attr("cy", d => ys(d.mean_salary))
        .attr("r", 4)
        .on("mouseover", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            d3.select("#tooltip_id")
            .style("left", (evt.pageX + 30) + "px") 
            .style("top", (evt.pageY) + "px")
            .style("visibility", "visible")
            .html(`<p align="center"> <b> Mean Salary in Year ${d.work_year} <br></br>is $${d.mean_salary.toFixed(2)}</b></p>`);
          })
        .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});


    // ==================================================================================
    
    // ================================= MID_LEVEL EXP ==================================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
    
        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('d', line)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });
    
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
        .attr("r", 4)
        .on("mouseover", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            d3.select("#tooltip_id")
            .style("left", (evt.pageX + 30) + "px") 
            .style("top", (evt.pageY) + "px")
            .style("visibility", "visible")
            .html(`<p align="center"> <b> Mean Salary in Year ${d.work_year} <br></br>is $${d.mean_salary.toFixed(2)}</b></p>`);
          })
        .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});

    // ==================================================================================
    // ================================= SENIOR_LEVEL EXP ===============================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
    
        .append('path')
        .datum(grouped_data_SE)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('d', line)
        
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });;
            
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
        .attr("r", 4)
        .on("mouseover", (evt, d) => {
            const [mx, my] = d3.pointer(evt);
            d3.select("#tooltip_id")
            .style("left", (evt.pageX + 30) + "px") 
            .style("top", (evt.pageY) + "px")
            .style("visibility", "visible")
            .html(`<p align="center"> <b> Mean Salary in Year ${d.work_year} <br></br>is $${d.mean_salary.toFixed(2)}</b></p>`);
          })
        .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});

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
    
    // ========================================== AXES SETTING ======================================================
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+margin+")")
        .call(d3.axisLeft(ys))
        .call(g => g.selectAll(".tick line").clone()
        .attr("x2",width)
        .attr("stroke-opacity",0.1)
);
    
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
    
    // ========================================== AXES LABELING ======================================================
    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 200)
              .attr("y", height + margin*1.2)
              .attr("transform", "translate(175,30)")
              .text("Work Years");
    
    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 250)
              .attr("y", 90)
              .attr("id","ax")
              .text("Absolute Mean Salary in USD ($)");

    // ===============================================================================================================
    
    }
    

    // ==============================================================================================================
    // ==============================================================================================================
    function displayData_rel(grouped_data_EN, grouped_data_MI, grouped_data_SE, width, height, margin, line, line_2, line_3,xs,ys)
    {
    d3.select("svg").selectAll("g").select(".line").attr("opacity", 0.1).attr('stroke-width', 1.5);
    d3.select("svg").selectAll("text").attr("opacity", 0.1);
    d3.select("svg").selectAll(".annotations").remove();
    d3.select("svg").selectAll("circle").remove()

    var tooltip2 = d3.select("#canvas_id")
        .append("div")
        .attr("id", "tooltip_id")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "#bae6fd")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "50px")
        .style("border-style", "dotted")
        .style("width", "fit-content")
        .style("font-size", "0.9em")
        .style("padding", "10px")
        .style("opacity", "0.8")
        .html("<p>I'm a tooltip written in HTML</p>");

    d3.select("#tooltip_id")
        .style("visibility", "hidden")

    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")

        .append('path')
        .datum(grouped_data_EN)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 3)
        .attr('d', line)
        
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });
                  
          if (line) {
                const starter_arr_EN = grouped_data_EN.filter(d => d.work_year == '2020')
                const starter_val_EN = starter_arr_EN[0].mean_salary;
                d3.select('svg')
                .append("g")
                .attr("transform", "translate("+margin+","+margin+")")
                .selectAll(".dot")
                .data(grouped_data_EN)
                .enter()
                .append("circle") 
                .attr("class", "dot_class") 
                .attr("cx", d => xs(d.work_year))
                .attr("cy", function(d){
                    return ys(d.mean_salary / starter_val_EN);})
                .attr("r", 4)
                .on("mouseover", (evt, d) => {
                    const [mx, my] = d3.pointer(evt);
                    d3.select("#tooltip_id")
                    .style("left", (evt.pageX + 30) + "px") 
                    .style("top", (evt.pageY) + "px")
                    .style("visibility", "visible")
                    .html(`<p align="center"> <b> Relative Mean Salary in ${d.work_year} <br></br>is ${(d.mean_salary/starter_val_EN).toFixed(4)}</b></p>`);
                })
                .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});
            }



    // ==================================================================================
    
    // ================================= MID_LEVEL EXP ==================================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
    
        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('d', line_2)
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });

          
          if (line_2) {
            const starter_arr_MI = grouped_data_MI.filter(d => d.work_year == '2020')
            const starter_val_MI = starter_arr_MI[0].mean_salary;    
        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .selectAll(".dot")
            .data(grouped_data_MI)
            .enter()
            .append("circle") 
            .attr("class", "dot")
            .attr("cx", d => xs(d.work_year))
            .attr("cy", function(d){
                return ys(d.mean_salary/starter_val_MI);})
            .attr("r", 4)
            .on("mouseover", (evt, d) => {
                const [mx, my] = d3.pointer(evt);
                d3.select("#tooltip_id")
                .style("left", (evt.pageX + 30) + "px") 
                .style("top", (evt.pageY) + "px")
                .style("visibility", "visible")
                .html(`<p align="center"> <b>  Relative Mean Salary in ${d.work_year} <br></br>is ${(d.mean_salary/starter_val_MI).toFixed(4)}</b></p>`);
            })
            .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});
        }
    // ==================================================================================
    // ================================= SENIOR_LEVEL EXP ===============================
    d3.select("svg")
        .attr("width", width + 2*margin)
        .attr("height", height + 2*margin)
        
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
    
        .append('path')
        .datum(grouped_data_SE)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 3)
        .attr('d', line_3)
        
        .on('mouseover', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '.3');
          })
          .on('mouseout', function (d, i) {
            d3.select(this).transition()
                 .duration('50')
                 .attr('opacity', '1');
          });;
                
        if (line_3) {
            const starter_arr_SE = grouped_data_SE.filter(d => d.work_year == '2020');
            const starter_val_SE = starter_arr_SE[0].mean_salary;
        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .selectAll(".dot")
            .data(grouped_data_SE)
            .enter()
            .append("circle")
            .attr("class", "dot") 
            .attr("cx", d => xs(d.work_year))
            .attr("cy", function(d){
                return ys(d.mean_salary / starter_val_SE);})
            .attr("r", 4)
            .on("mouseover", (evt, d) => {
                const [mx, my] = d3.pointer(evt);
                d3.select("#tooltip_id")
                .style("left", (evt.pageX + 30) + "px") 
                .style("top", (evt.pageY) + "px")
                .style("visibility", "visible")
                .html(`<p align="center"> <b> Relative Mean Salary in ${d.work_year} <br></br>is ${(d.mean_salary/starter_val_SE).toFixed(4)}</b></p>`);
            })
            .on("mouseout", function(){return tooltip2.style("visibility", "hidden");});
        }
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
    
    // ========================================== AXES SETTING ======================================================
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+margin+")")
        .call(d3.axisLeft(ys))
        .call(g => g.selectAll(".tick line").clone()
        .attr("x2",width)
        .attr("stroke-opacity",0.1)
);
    
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
    
    // ========================================== AXES LABELING ======================================================

    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 200)
              .attr("y", height + margin*1.2)
              .attr("transform", "translate(175,30)")
              .text("Work Years");
    
    d3.select('svg').append("text")
              .attr("text-anchor", "end")
              .attr("x", 200)
              .attr("y", 90)
              .attr("opacity",1)
              .text("Relative Mean Salary");
    

    // ===============================================================================================================
    }