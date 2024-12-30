// "use strict"

async function init() {

  // @ Data Selection
  const data = await d3.csv("https://raw.githubusercontent.com/awawatin/NarrativeViz/refs/heads/main/data/ds_salaries.csv");
  // window.data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
  getData(data)
}

// ===============================================================================================================
// =========================================== DATA SELECTION & GROUPING =========================================
// ===============================================================================================================
function getData(data, index=0){

    const year_arr = ['2020','2021', '2022', '2023']
    const year_val = year_arr[index]
    console.log(year_val)



    // @ Selected country is omitted due to having single datapoint in the dataset, causing inaccurate representation for 
    // mean salary display for the user.
    // var data_SE = data.filter(d => d.job_title === "Data Scientist" && d.work_year === year_val && d.company_location !== "IL"); 
    var data_SE = data.filter(d => d.work_year === year_val 
        && d.company_location !=="IL" &&  d.company_location !=="IR" &&  d.company_location !=="IQ"
          && d.company_location !=="AL" &&  d.company_location !=="BO" &&  d.company_location !=="CL"
            &&  d.company_location !=="CN" &&  d.company_location !=="CR" && d.company_location !=="DZ" 
              &&  d.company_location !=="DK" &&d.company_location !=="MD" && d.company_location !=="MK"
                  && d.company_location !=="MT" && d.company_location !=="NZ" && d.company_location !=="VN"); 
    
    const projection = d3.geoNaturalEarth1();

    // @ Path generatator for the drawing
    const path = d3.geoPath()
                    .projection(projection);

    // ======= NAME MAPPING ======== 
    const codeMap = {
      "AE": "United Arab Emirates",
      "AL": "Albania",
      "AM": "Armenia",
      "AR": "Argentina",
      "AS": "American Samoa",
      "AT": "Austria",
      "AU": "Australia",

      "BA": "Bosnia and Herzegovina",
      "BE": "Belgium",
      "BO": "Bolivia",
      "BR": "Brazil",
      "BS": "Bahamas",

      
      "CA": "Canada",
      "CF": "Central African Republic",
      "CH": "Switzerland",
      "CL": "Chile",
      "CN": "China",
      "CO": "Colombia",
      "CR": "Costa Rica",
      "CZ": "Czechia",

      "DE": "Germany",
      "DK": "Denmark",
      "DZ": "Algeria",

      "EE": "Estonia",
      "EG": "Egypt",
      "ES": "Spain",


      "FI": "Finland",
      "FR": "France",

      "GB": "United Kingdom",
      "GH": "Ghana",
      "GR": "Greece",

      "HK": "Hong Kong",
      "HN": "Honduras",
      "HR": "Crotia",
      "HU": "Hungary",

      "ID": "Indonesia",
      "IE": "Ireland",
      "IL": "Israel",
      "IN": "India",
      "IQ": "Iraq",
      "IR": "Iran",
      "IT": "Italy",

      "JP": "Japan",

      "KE": "Kenya",

      "LT": "Lithuania",
      "LU": "Luxembourg",
      "LV": "Latvia",

      "MA": "Morocco",
      "MD": "Moldova",
      "MK": "Macedonia",
      "MT": "Malta",
      "MX": "Mexico",
      "MY": "Malaysia",

      "NG": "Nigeria",
      "NL": "Netherlands",
      "NZ": "New Zealand",

      "PH": "Philippines",
      "PK": "Pakistan",
      "PL": "Poland",
      "PR": "Puerto Rico",
      "PT": "Portugal",

      "RO": "Romania",
      "RU": "Russia",

      "SE": "Sweden",
      "SG": "Singapore",
      "SI": "Slovenia",
      "SK": "Slovakia",

      "TH": "Thailand",
      "TR": "Turkey",
      "UA": "Ukraine",
      "US": "United States of America",
      "VN": "Vietnam"

    };
    // =============================

    const countryFullName = data_SE.map(d => ({
      company_location: codeMap[d.company_location],
      salary: d.salary_in_usd
    }));

  const grouped_data_SE =  Array.from(d3.group(countryFullName, d => d.company_location),
        ([key, values]) => ({
            country_loc: key,
            mean_salary: d3.mean(values, d => d.salary)
          }));

// =================================================================================================================

// =================================================================================================================
// ============================================== MAP COLORING =====================================================
// =================================================================================================================
const color = d3.scaleSequential(d3.interpolateViridis)
      .domain([0, d3.max(grouped_data_SE, d => d.mean_salary)]);

const countryDataMap = new Map(grouped_data_SE.map(d => [d.country_loc, d.mean_salary]));

  if(!window.draw_flag){
    d3.select("svg").selectAll('.year-id').remove()
    d3.select("svg").append('text')
    .attr("class", "year-id")
    .attr('x', 22)
    .attr('y', 150)
    .text(`Shown Year: ${year_val}`);
    drawCanvas(countryDataMap,path,color, index)
    setTimeout(() => {getData(data, index + 1)},5000);
  }
  else{
    d3.select("svg").selectAll('.year-id').remove()
    d3.select("svg").append('text')
    .attr("class", "year-id")
    .attr('x', 22)
    .attr('y', 150)
    .text(`Shown Year: ${year_val}`);

    d3.select("svg").selectAll("path")
      .style("fill", d => {
        const salary = countryDataMap.get(d.properties.name) || 0;
        return salary>0 ? color(salary) : "#4b5563";    
      });

      d3.select('svg')
      .selectAll(".country")
        .select("title")
        .text(d => {
          const count = countryDataMap.get(d.properties.name) || 0;
          return `Mean Salary in ${d.properties.name}: $ ${count}`;
        });
      
      const countryDataMap_filtered = new Map(Array.from(countryDataMap).filter
      (([key,value]) => value > 0).sort((a,b) => d3.descending(a[1], b[1])));


      d3.select("svg").selectAll(".legend").select("rect")
        .data(countryDataMap_filtered)
        .style("fill", ([name,value]) => {
          const salary = countryDataMap_filtered.get(name);
            return salary>0 ? color(salary) : "#000"
        });
      
        names_only = Array.from(countryDataMap_filtered.keys());

        d3.select("svg").selectAll(".legend").select("text")
          .data(names_only)
          .text(d => d);
    
    setTimeout(() => {
        if (index == 3){
          index = -1;
          getData(data, index + 1);
        }
        else{ 
          getData(data, index + 1);
        }
      }, 3000)
      
    }

}

// ===============================================================================================================
// ================================================ DRAW & PLOT ==================================================
// ===============================================================================================================
function drawCanvas(countryDataMap, path, color, index){

  // d3.select("svg").append('text')
  // .attr('x', 22)
  // .attr('y', 150)
  // .text(`Shown Year: 2020`);

  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(topology => {
    const geojson = topojson.feature(topology, topology.objects.countries).features;
    d3.select("svg")
        .selectAll("path")
            .data(geojson)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("class", "country")
            .style("fill", d => {
              const salary = countryDataMap.get(d.properties.name) || 0;
              // return salary>0 ? color(salary) : "#818589";
              return salary>0 ? color(salary) : "#4b5563";
            })
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
      .selectAll(".country")
        .append("title")
        .text(d => {
          const count = countryDataMap.get(d.properties.name) || 0;
          return `Mean Salary in ${d.properties.name}: $ ${count}`;
        });
     
  const countryDataMap_filtered = new Map(Array.from(countryDataMap).filter
  (([key,value]) => value > 0).sort((a,b) => d3.descending(a[1], b[1])));


  const legend = d3.select('svg').selectAll(".legend")
    .data(countryDataMap_filtered)
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => "translate(20,"+(15*i)+")");

  legend.append("rect")
    // .attr('x', width/2 - 150)
    .attr('x', 0)
    .attr('y', 200)
    .attr("width", 12)
    .attr("height", 12)
    .style("fill", ([name,value]) => {
      const salary = countryDataMap_filtered.get(name);
        return salary>0 ? color(salary) : "#000"   
    });

    names_only = Array.from(countryDataMap_filtered.keys());
    legend.append("text")
      .attr("x",30)
      .attr("y", 210)
      .attr("dy", ".10em")
      .style("text-anchor", "start")
      .data(names_only)
      .text(d => d)
    

  });

 
  // ===================================================================================================================
  // @ Clear svg for updating parameter
  // var svg = d3.select("svg");
  // svg.selectAll("*").remove();
  // ===================================================================================================================

  window.draw_flag = 'true';
}

