// "use strict"
async function init() {
    var height = 650;
    var width = 650;
    var margin = 100;
    // ===============================================================================================================
    // =========================================== DATA SELECTION & GROUPING =========================================
    // ===============================================================================================================

    const data = await d3.csv("https://raw.githubusercontent.com/awawatin/NarrativeViz/refs/heads/main/data/ds_salaries.csv");
    // const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
  
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
    const ys = d3.scaleLinear().domain([0, 1.8]).range([height, 0]);
    const xs = d3.scaleLinear().domain(d3.extent(grouped_data_SE, d=>d.work_year)).range([0,width]);
    
    
    const line = d3.line()
        .x(function(d) {return xs(d.work_year);})
        .y(function(d) {
            const starter_arr = grouped_data_EN.filter(d => d.work_year == '2020')
            const starter_val = starter_arr[0].mean_salary;
            return ys(d.mean_salary / starter_val);})
        .curve(d3.curveMonotoneX);

    const line_2 = d3.line()
        .x(function(d) {return xs(d.work_year);})
        .y(function(d) {
            const starter_arr = grouped_data_MI.filter(d => d.work_year == '2020')
            const starter_val = starter_arr[0].mean_salary;
            return ys(d.mean_salary / starter_val);})
        .curve(d3.curveMonotoneX);
    const line_3 = d3.line()
        .x(function(d) {return xs(d.work_year);})
        .y(function(d) {
            const starter_arr = grouped_data_SE.filter(d => d.work_year == '2020')
            const starter_val = starter_arr[0].mean_salary;
            return ys(d.mean_salary / starter_val);})
        .curve(d3.curveMonotoneX);
    
    // ===============================================================================================================

    
    // ===============================================================================================================
    // =============================================== ANNOTATIONS ===================================================
    // ===============================================================================================================
    var label_color= d3.color("gray").darker(); 
    const annotations_EN = [
        {
            note: {
                label: "Highest relative increase by 0.66",
                title: "Entry Level",
                wrap: 150
            },
            type:d3.annotationCalloutCircle,
            x: xs('2023'),
            y: ys(1.6567779664438127),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 200,
            dx: -50,
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
                label: "Highest relative decrease by 0.09",
                title: "Senior Level",
                wrap: 150
            },
            type:d3.annotationCalloutCircle,
            x: xs('2021'),
            y: ys(0.9187182804229331),
            subject:{
                radius: 3,
                raiduspadding: 5,
            },
            dy: 100,
            dx: 20,
            color: label_color
        }
    ];

    const annotations = [{
        note: {
          label: "Lowest Mean Salary Period",
          title: "For All"
        },
        //can use x, y directly instead of data
        type:d3.annotationCalloutRect,
        // data: { date: "18-Sep-09", close: 185.02 },
        x: xs('2021'),
        y: ys(1),
        dy: -137,
        dx:-50,
        subject: {
          width: 10,
          height: 100
        }
      }]
    const makeAnnotations = d3.annotation()
            .annotations(annotations);

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
        
        .append('path')
        .datum(grouped_data_EN)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-width', 3)        
        .attr('d', line);

    d3.select('svg')
    .append("g")
    .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations)
    
    d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations_EN)

        .selectAll(".dot")
        .data(grouped_data_EN)
        .enter()
        .append("circle")
        .attr("class", "dot") 
        .attr("cx", d => xs(d.work_year))
        .attr("cy", function(d){
            const starter_arr = grouped_data_EN.filter(d => d.work_year == '2020')
            const starter_val = starter_arr[0].mean_salary;
            console.log(starter_val)
            return ys(d.mean_salary / starter_val);})
        .attr("r", 2);
    // ===============================================================================================================
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")

        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)        
        .attr('d', line_2);
    
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
            const starter_arr = grouped_data_MI.filter(d => d.work_year == '2020')
            const starter_val = starter_arr[0].mean_salary;
            console.log(starter_val)
            return ys(d.mean_salary / starter_val);})
        .attr("r", 2);
    // ===============================================================================================================
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
            .attr('d', line_3);
        
        const len_3 = d3.select("svg").selectAll('path').node().getTotalLength();
        d3.select("svg").selectAll('path')
                .attr("stroke-dasharray", len_3 + " " + len_3)
                .attr("stroke-dashoffset", len_3)
                .transition() 
                .duration(2000) 
                .ease(d3.easeLinear) 
                .attr("stroke-dashoffset", 0);
        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .call(makeAnnotations_SE)

            .selectAll(".dot")
            .data(grouped_data_SE)
            .enter()
            .append("circle") 
            .attr("class", "dot")
            .attr("cx", d => xs(d.work_year))
            .attr("cy", function(d){
                const starter_arr = grouped_data_SE.filter(d => d.work_year == '2020')
                const starter_val = starter_arr[0].mean_salary;
                console.log(starter_val)
                return ys(d.mean_salary / starter_val);})
            .attr("r", 2);

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
              .text("Relative Mean Salary");
    // ===============================================================================================================
    // ===============================================================================================================
    // ===============================================================================================================
    // ===============================================================================================================
    // ===============================================================================================================
    // ===============================================================================================================
    // ===============================================================================================================
    // =============================================== SECOND PAGE ===================================================
    // ===============================================================================================================

    const button_exp2 = document.getElementById('exp2')
    var max_val_salary = d3.max([
        d3.max(grouped_data_EN, d=>d.mean_salary),
        d3.max(grouped_data_MI, d=>d.mean_salary),
        d3.max(grouped_data_SE, d=>d.mean_salary)
    ]);

    const ys_new = d3.scaleLinear().domain([0, max_val_salary]).range([height, 0]);
    const xs_new = d3.scaleLinear().domain(d3.extent(grouped_data_SE, d=>d.work_year)).range([0,width]);


    var label_color_2= d3.color("purple").darker(); 
    const annotations_EN_new = [
        {
            note: {
                label: "Absolute mean salary with $95,284 corresponding to the highest relative increase ",
                title: "Entry Level",
                wrap: 150
            },
            type:d3.annotationCalloutCircle,
            x: xs_new('2023'),
            y: ys_new(95283.96610169491),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 150,
            dx: -50,
            color: label_color_2
        }
    ];
    
    const annotations_SE_new = [
        {
            note: {
                label: "Absolute mean salary with $126,085.3 corresponding to the highest relative decrease",
                title: "Senior Level",
                wrap: 150
            },
            type:d3.annotationCalloutCircle,
            x: xs_new('2021'),
            y: ys_new(126085.35616438356),
            subject:{
                radius: 10,
                raiduspadding: 5,
            },
            dy: 30,
            dx: -10,
            color: label_color_2
        }
    ];
    
    const makeAnnotations_EN_new = d3.annotation()
    .annotations(annotations_EN_new);

    const makeAnnotations_SE_new = d3.annotation()
            .annotations(annotations_SE_new);

    const line_new = d3.line()
        .x(function(d) {return xs_new(d.work_year);})
        .y(function(d) {return ys_new(d.mean_salary);})
        .curve(d3.curveMonotoneX);

    var clicked_next = 0;
    
    button_exp2.addEventListener('click', function() {
        clicked_next = clicked_next + 1
        if(clicked_next == "1"){
            

        d3.select("svg").selectAll("g").select(".line").attr("opacity", 0.1).attr('stroke-width', 1.5);
        d3.select("svg").selectAll("text").attr("opacity", 0.1);
        d3.select("svg").selectAll(".annotations").remove();
        d3.select("svg").selectAll("circle").remove()
    
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
            .attr('d', line_new);

        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .call(makeAnnotations_EN_new)

            .selectAll(".dot")
            .data(grouped_data_EN)
            .enter()
            .append("circle")
            .attr("class", "dot") 
            .attr("cx", d => xs_new(d.work_year))
            .attr("cy", d => ys_new(d.mean_salary))
            .attr("r", 2);

    // ===============================================================================================================
        d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")

        .append('path')
        .datum(grouped_data_MI)
        .attr("class", "line") 
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-width', 3)
        .attr('d', line_new);

        d3.select('svg')
            .append("g")
            .attr("transform", "translate("+margin+","+margin+")")
            .selectAll(".dot")
            .data(grouped_data_MI)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => xs_new(d.work_year))
            .attr("cy", d => ys_new(d.mean_salary))
            .attr("r", 2);
    // ===============================================================================================================

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
        .attr('d', line_new);

        const len_3_new = d3.select("svg").selectAll('path').node().getTotalLength();
        d3.select("svg").selectAll('path')
                .attr("stroke-dasharray", len_3_new + " " + len_3_new)
                .attr("stroke-dashoffset", len_3_new)
                .transition() 
                .duration(2000) 
                .ease(d3.easeLinear) 
                .attr("stroke-dashoffset", 0);

        d3.select('svg')
        .append("g")
        .attr("transform", "translate("+margin+","+margin+")")
        .call(makeAnnotations_SE_new)

        .selectAll(".dot")
        .data(grouped_data_SE)
        .enter()
        .append("circle") 
        .attr("class", "dot")
        .attr("cx", d => xs_new(d.work_year))
        .attr("cy", d => ys_new(d.mean_salary))
        .attr("r", 2);

    // ===============================================================================================================

    // ===============================================================================================================
    // ========================================== AXES SETTING ======================================================
    // ===============================================================================================================
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+margin+")")
        .call(d3.axisLeft(ys_new))
        .call(g => g.selectAll(".tick line").clone()
            .attr("x2",width)
            .attr("stroke-opacity",0.4));
    
    d3.select("svg")
        .append("g")
        .attr("transform", "translate("+margin+", "+(height+margin)+")")
        .call(d3.axisBottom(xs_new).tickValues([2020,2021,2022,2023]).tickFormat(d3.format("d")))
        .append("text")
        .attr("text-anchor", "end")
        .attr("x", 200)
        .attr("y", height + margin*1.5)
        .attr("transform", "translate(175,30)")
        .text("Work Years");

        legend.select('text').attr('opacity',1);
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
                  .text("Absolute Mean Salary in USD ($)");
        }
        else{
            window.location.href = 'page-3.html'; 
        }
    });

    // ===============================================================================================================
    // ===============================================================================================================
    // ========================================== AXES LABELING ======================================================
    // ===============================================================================================================

    // ===============================================================================================================
     
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
        .attr("opacity", 1)
        .text(d => d.label);


    // ==================================================================================
    



}

    
    
    
   
    

    
    
    
    