// "use strict"

async function init() {
  // @ Data Selection
  // const data = await d3.csv("https://raw.githubusercontent.com/alaratin/cs416-atin4.github.io/main/data/ds_salaries.csv");
  const data = await d3.csv("https://raw.githubusercontent.com/JorgeMiGo/Data-Science-Salaries-2023/main/Dataset/ds_salaries.csv");
  displayData(data)
}

// ====================================== MAP STYLING DEFINITION ================================================
  function displayData(data, index=0){
    console.log("here")
    const year_arr = ['2020','2021', '2022', '2023']
    const year_val = year_arr[index]
    console.log(year_val)

    var data_SE = data.filter(d => d.job_title === "Data Scientist" && d.work_year === year_val); 
    
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

    // console.log(countryFullName)
// ===============================================================================================================

// =========================================== GROUPING FOR DATA ===================================================
  const grouped_data_SE =  Array.from(d3.group(countryFullName, d => d.company_location),
        ([key, values]) => ({
            country_loc: key,
            mean_salary: d3.mean(values, d => d.salary)
          }));

  console.log(grouped_data_SE)
// =================================================================================================================

// ============================================== MAP COLORING =====================================================
const color = d3.scaleSequential(d3.interpolateWarm)
      .domain([0, d3.max(grouped_data_SE, d => d.mean_salary)]);

const countryDataMap = new Map(grouped_data_SE.map(d => [d.country_loc, d.mean_salary]));

// ===========================================
// @ Legend definition for salary allocations
var legend = d3.legendColor()
    .scale(color);
// ===========================================

d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json").then(topology => {
  const geojson = topojson.feature(topology, topology.objects.countries).features;
// =================================================================================================================
// ============================================ CANVAS SETTINGS ====================================================
  d3.select("svg")
      .selectAll("path")
          .data(geojson)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("class", "country")
          .style("fill", d => {
            const salary = countryDataMap.get(d.properties.name) || 0;
            return salary>0 ? color(salary) : "#000";
          });

  d3.select('svg')
    .selectAll(".country")
      .append("title")
      .text(d => {
        const count = countryDataMap.get(d.properties.name) || 0;
        return `Mean Salary for Data Scientist Job in ${d.properties.name}: $ ${count}`;
      });


// d3.select('svg')
//     .append("g")
//     .attr("transform", "translate(10,10)")
//     .call(legend);
});

// ===================================================================================================================
// ===================================================================================================================
// @ Clear svg for updading parameter
var svg = d3.select("svg");
svg.selectAll("*").remove();
// ===================================================================================================================


d3.select('svg').selectAll('.country')
.transition()
.ease(d3.easeLinear)
.on("end",setTimeout(() => {
  if (index == 3){
    index = -1;
    displayData(data, index + 1);
  }
  else{ displayData(data, index + 1);}
    }, 5000));
}