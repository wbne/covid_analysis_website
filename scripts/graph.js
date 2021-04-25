var rawText
var g = "#mainbar"
var boring = false
var varNum = 0
var selectedValue = 0
var newFile = true
var selectedData = []
var fileExtension
const graphWidth  = (window.innerWidth || document.documentElement.clientWidth ||
document.body.clientWidth) * .60;
const graphHeight = (window.innerHeight|| document.documentElement.clientHeight||
document.body.clientHeight) * .9;
var margin = {top: 30, right: 30, bottom: 40, left: 100};
var width = graphWidth - margin.left - margin.right;
var height = graphHeight - margin.top - margin.bottom;
var svg
var count
var xAxisVar
var webName
var data
var datafile
var testtestCount = 0
var filenames = []
var filenamesTemporal = ["date.agg.proportions.counts.csv","cdc.date.agg.proportions.counts.csv","cdc.date.agg.proportions.counts.csv"]
var filenamesTextual = ["c19.words.tfidf_values.csv", "cdc.words.tfidf_values.csv"]
var displayNames = ["Covid-19 Dataset", "CDC Dataset"];

window.addEventListener('load', (event) => {
  var path = window.location.pathname;
  webName = path.split("/").pop();
  preloadFile()
});

function preloadFile()
{
  if(webName == "temporal.html")
  {
    datafile = "date.agg.proportions.counts.csv";
    filenames = filenamesTemporal
  }
  else if(webName == "textual.html")
  {
    datafile = "c19.words.tfidf_values.csv";
    filenames = filenamesTextual
  }
  else
  {
    datafile = "flair.joined.tweets.csv";
  }
  document.getElementsByClassName("nextPage")[0].textContent = "CDC Dataset"
  document.getElementsByClassName("backPage")[0].style.display = 'none';
  loadFile()
}

function nextFile()
{
  testtestCount++;
  datafile = filenames[testtestCount];
  if(testtestCount == displayNames.length - 1){document.getElementsByClassName("nextPage")[0].style.display = 'none';}
  else{document.getElementsByClassName("nextPage")[0].textContent = displayNames[testtestCount - 1];}
  document.getElementsByClassName("nextPage")[0].textContent = displayNames[testtestCount + 1]
  document.getElementsByClassName("backPage")[0].textContent = displayNames[testtestCount - 1]
  document.getElementsByClassName("backPage")[0].style.display = '';
  loadFile();
}

function prevFile()
{
  testtestCount--;
  datafile = filenames[testtestCount];
  if(testtestCount == 0){document.getElementsByClassName("backPage")[0].style.display = 'none';}
  else{document.getElementsByClassName("backPage")[0].textContent = displayNames[testtestCount - 1];}
  document.getElementsByClassName("nextPage")[0].textContent = displayNames[testtestCount + 1]
  document.getElementsByClassName("nextPage")[0].style.display = '';
  loadFile();
}

function loadFile()
{
  clearGraphs()
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      rawText = this.responseText;
      var div = document.getElementById('variables')
      //while(div.firstChild){div.removeChild(div.firstChild)}
      data = d3.csvParse(rawText)
      count = data.columns.length
      //loadVariables()
    }
  };
  xhttp.open("GET", "./scripts/" + datafile, true);
  xhttp.send();
}

function checkCheckbox()
{
  varNum = 0
  selectedValue = 0
  cbCount = 0
  cbs = document.querySelectorAll('#varOption');
  if(webName == "templateGraphSite.html")
  {xAxisVar = document.getElementsByClassName("dropdown")[0].value}
  selectedData = []
 for (const cb of cbs)
 {
      if (cb.checked)
      {
        selectedValue++
        selectedData.push(cb.name)
      }
      if(cb.labels[0].textContent == xAxisVar && cb.checked)
      {
        cb.checked = false
        selectedValue--
      }
      if(cb.labels[0].textContent == xAxisVar)
      {
        document.getElementsByClassName("checkLabel")[cbCount].style.backgroundColor = "lightgrey"
        document.getElementsByClassName("checkLabel")[cbCount].style.cursor = "not-allowed"
      }
      else
      {
        document.getElementsByClassName("checkLabel")[cbCount].style.backgroundColor = "rgba(0,0,0,0)"
        document.getElementsByClassName("checkLabel")[cbCount].style.cursor = "pointer"
      }
      cbCount++
 }
}

function uncheckCheckbox(checkers)
{
  selectedValue = 0
  cbs = document.querySelectorAll('#varOption');
  for (const cb of cbs)
  {
      cb.checked = !checkers
      if(!checkers)
      {selectedValue++}
  }
  checkCheckbox()
}

function loadVariables()
{
  container = document.getElementById("variables")
  start = 0;
  if(webName == "temporal.html")
  {start = 2;}
  for(i = start; i < count; i++)
  {
    lab = document.createElement('label')
    lab.textContent = data.columns[i]
    lab.setAttribute("class", "checkLabel")
    spa = document.createElement('span')
    spa.setAttribute("class", "checkSpan")
    box = document.createElement('input')
    box.setAttribute('type', 'checkbox')
    box.setAttribute('id', 'varOption')
    box.setAttribute('name', i)
    box.onclick = checkCheckbox
    lab.append(box)
    lab.append(spa)
    container.append(lab)
    container.append(document.createElement('br'))
  }
  showDropdown()
  checkCheckbox()
}

function showDropdown() {
  var dropdowns = document.getElementsByClassName("dropdown")
  var dropdownLength = dropdowns[0].options.length
  start = 0;
  if(webName == "temporal.html")
  {start = 2;}
  for(var i = dropdownLength - 1; i >= start; i--)
    {dropdowns[0].options[i] = null}
  for (var i = start; i < count; i++)
  {
    lab = document.createElement('option')
    lab.textContent = data.columns[i]
    dropdowns[0].append(lab)
    dropdowns[0].append(document.createElement('br'))
  }
}

var tempStrings
function percentages()
{
  selectedData = [];
  tempStrings = [count - 6, count - 5, count - 4];
  testythetester()
}

function numbers()
{
  selectedData = []
  tempStrings = [count - 3, count - 2, count - 1]
  testythetester()
}

function testythetester()
{
  for(var i = 0; i < tempStrings.length; i++)
  {selectedData.push(tempStrings[i]);}
  linegraph();
}

var stage;
function wordStage(stagePicked)
{
  stage = stagePicked
  wordcloud()
}

function clearGraphs()
{
  if(webName == "templateGraphSite.html")
  {xAxisVar = document.getElementsByClassName("dropdown")[0].selectedIndex}

  d3.select(g).html("")
  d3.select("#legend").html("")
  //console.log(selectedData)
  svg = d3.select(g)
  .append("svg")
    .classed("graph", true)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
}

function boxplot()
{
  clearGraphs()
  //var data = d3.csvParse(rawText)

  var max = d3.max(data, function(d) {return +d[data.columns[selectedData]]})
  var min = d3.min(data, function(d) {return +d[data.columns[selectedData]]})
  var median = (max + min) / 2
  var q1 = min + (median/2)
  var q3 = max - (median/2)
  var interQuantileRange = q3 - q1


  var y = d3.scaleLinear()
    .domain([min,max])
    .range([height, 0]);

  var center = (width/2)

  svg
  .append("line")
    .attr("x1", center)
    .attr("x2", center)
    .attr("y1", y(min) )
    .attr("y2", y(max) )
    .attr("stroke", "black")

  svg.append("g")
    .call(d3.axisLeft(y));
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", -10)
      .text(""+data.columns[selectedData])

  svg
  .append("rect")
    .attr("x", center - center/8)
    .attr("y", y(q3) )
    .attr("height", (y(q1)-y(q3)) )
    .attr("width", center/4)
    .attr("stroke", "black")
    .style("fill", "#69b3a2")

  svg
  .selectAll("toto")
  .data([min, median, max])
  .enter()
  .append("line")
    .attr("x1", center-width/8)
    .attr("x2", center+width/8)
    .attr("y1", function(d){ return(y(d))} )
    .attr("y2", function(d){ return(y(d))} )
    .attr("stroke", "black")
}

function barplot()
{
  clearGraphs()

//data = d3.csvParse(rawText)
var x = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d[data.columns[xAxisVar]]; }))
  .padding(0.2);
svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+40 )
      .text(""+data.columns[xAxisVar])

var y = d3.scaleLinear()
  .domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[0]]]})])
  .range([ height, 0]);
svg.append("g")
  .call(d3.axisLeft(y));
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 50)
    .attr("y", -10)
    .text(""+data.columns[selectedData[0]])

svg.selectAll("mybar")
  .data(data)
  .enter()
  .append("rect")
    .attr("x", function(d) { return x(d[data.columns[xAxisVar]]); })
    .attr("y", function(d) { return y(d[data.columns[selectedData[0]]]); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d[data.columns[selectedData[0]]]); })
    .attr("fill", "#69b3a2")
}

function dotplot()
{
  clearGraphs()

    //data = d3.csvParse(rawText)
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[xAxisVar]]} )])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+30 )
        .text(""+data.columns[xAxisVar])

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) {return +d[data.columns[selectedData[0]]]} )])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d[data.columns[xAxisVar]]); } )
        .attr("cy", function (d) { return y(d[data.columns[selectedData[0]]]); } )
        .attr("r", 4)
        .style("fill", "#69b3a2")
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 10)
      .attr("y", -10)
      .text(""+data.columns[selectedData[0]])
}

function wordcloud()
{
  clearGraphs()

  // List of words
data = d3.csvParse(rawText)

joinedText = ""
for(i = 0; i < data.length; i++)
{
  if(stage == "all" || data[i].stage == stage)
  {joinedText += (data[i].word + ' ')}
}

var myWords = joinedText
  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\']/g,"")
  .replace(/\s\s+/g, ' ')
  .split(" ")
var freqMap = {}
var wordCount = 0
  myWords.forEach(function(w) {
    if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += data[wordCount].tfidf;
        wordCount++
        //console.log(data[wordCount].tfidf)
  })

myWords = Object.keys(freqMap)

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d, size: (freqMap[d] * 5), color: [0, 0, 0]}; }))
  .padding(3)
  .fontSize(function(d) {return d.size})
  .font("Comic Sans MS")
  .on("end", draw);
layout.start();

// This function takes the output of 'layout' above and draw the words
// Better not to touch it. To change parameters, play with the 'layout' variable above
function draw(words) {
  svg
    .append("g")
      .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) {return d.size + "px"})
        .style("font-family", "Comic Sans MS")
        .style("fill", function(d) {return "rgb("+d.color[0]+","+d.color[1]+","+d.color[2]+")"})
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}
}

var xAxis, x, area, areaGenerator, brush, idleTimeout, tempColors;

function streamline()
{
  clearGraphs()

  // create a tooltip
    var Tooltip = d3.select(g)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px")

    // Three function that change the tooltip when user hover / move / leave a cell
    var mouseover = function(d) {
      Tooltip
        .style("opacity", 1)
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    var mousemove = function(d) {
      Tooltip
        .html(d.key)
        .style("left", (event.clientX + 20) + "px")
        .style("top", (event.clientY - 10) + "px")
    }
    var mouseleave = function(d) {
      Tooltip
        .style("opacity", 0)
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 1)
    }

// Parse the Data
//data = d3.csvParse(rawText)

  // List of groups = header of the csv files
  var keys = []
  for(i = 0; i < selectedData.length; i++)
  {keys.push(data.columns[selectedData[i]])}

  total_max = 0
  for(i = 0; i < selectedData.length; i++)
  {total_max += d3.max(data, function(d) {return +d[data.columns[selectedData[i]]]})}
  max_time = d3.max(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.date);})
  min_time = d3.min(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.date);})

  // Add X axis
  x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.date); }))
    .range([ 0, width ]);
  xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+30 )
      .text("Time",height+40 )
  // Add Y axis
  var y = d3.scaleLinear()
    .domain([-.5*total_max, .5*total_max])
    .range([ height, 0 ]);
  if(boring)
  {
    y = d3.scaleLinear()
      .domain([0, total_max])
      .range([ height, 0 ]);
  }
  svg.append("g")
    .call(d3.axisLeft(y));

  // colors
  tempColors = []
  for(i = 0; i < keys.length; i++)
  {
    tempColors.push("rgba("+ Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+",.9)")
  }
  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(tempColors)

  var stackedData = d3.stack()
    .offset(d3.stackOffsetSilhouette)
    .keys(keys)
    (data)
  if(boring)
  {
    stackedData = d3.stack()
      .keys(keys)
      (data)
    boring = false
  }

  divlegend = document.getElementById("legend")
  for(i = 0; i < keys.length; i++)
  {
    legend = document.createElement("p")
    legend.textContent = keys[i]
    legend.style.backgroundColor = color(keys[i])
    legend.style.width = "200px"
    legend.style.padding = "10px"

    divlegend.append(legend)
  }

  // Show the areas
  /*
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)*/

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs").append("svg:clipPath")
        .attr("id", "clip")
        .append("svg:rect")
        .attr("width", width )
        .attr("height", height )
        .attr("x", 0)
        .attr("y", 0);

    // Add brushing
    brush = d3.brushX()                   // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

    // Create the area variable: where both the area and the brush take place
    area = svg.append('g')
      .attr("clip-path", "url(#clip)")

    // Create an area generator
    areaGenerator = []
    for(i = 0; i < keys.length; i++)
    {
    // Create an area generator
    testCount = 0
    testIndex = 0
    areaGenerator.push(d3.area()
      .x(function(d) { if(testCount == stackedData[i].length){testIndex = (testIndex+1)%stackedData.length} testCount = testCount % stackedData[i].length;  return x(d3.timeParse("%Y-%m-%d")(d.date)) })
      .y0(function(d) { testCount++; return y(stackedData[testIndex][testCount - 1][0]) })
      .y1(function(d) { return y(stackedData[testIndex][testCount - 1][1]) })
      )
    }

    for(i = 0; i < keys.length; i++)
    {// Add the area
      area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("stroke", function(d){ return tempColors[i] })
      .attr("fill", function(d){return tempColors[i] })
      .attr("stroke-width", 1)
      .attr("d", areaGenerator[i] )
    }
    // Add the brushing
    svg
      .append("g")
        .attr("class", "brush")
        .call(brush);

    // If user double click, reinitialize the chart
    svg.on("dblclick",function(){
      x.domain(d3.extent(data, function(d) { return (d3.timeParse("%Y-%m-%d")(d.date)) }))
      xAxis.transition().call(d3.axisBottom(x).ticks(5));
      area.selectAll(".myArea").remove()
      for(i = 0; i < areaGenerator.length; i++){
        area.append("path")
        .datum(data)
        .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
        .attr("stroke", function(d){ return tempColors[i] })
        .attr("fill", function(d){return tempColors[i] })
        .attr("stroke-width", 1)
        .attr("d", areaGenerator[i] )}
    });

}

function idled() { idleTimeout = null; }

// A function that update the chart for given boundaries
function updateChart() {

  // What are the selected boundaries?
  extent = d3.event.selection

  // If no selection, back to initial coordinate. Otherwise, update X axis domain
  if(!extent){
    if (!idleTimeout) return idleTimeout = setTimeout(idled, 350); // This allows to wait a little bit
    x.domain([ 4,8])
  }else{
    x.domain([ x.invert(extent[0]), x.invert(extent[1]) ])
    svg.select(".brush").call(brush.move, null) // This remove the grey brush area as soon as the selection has been done
  }

xAxis.call(d3.axisBottom(x))
area.selectAll(".myArea").remove()
  for(i = 0; i < areaGenerator.length; i++)
  {// Update axis and area position
      area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("stroke", function(d){ return tempColors[i] })
      .attr("fill", function(d){return tempColors[i] })
      .attr("stroke-width", 1)
      .attr("d", areaGenerator[i] )
  }

}

function stacked()
{
  boring = true
  streamline(true)
}

function linegraph()
{
  clearGraphs()
//Read the data
//data = d3.csvParse(rawText)

// List of groups = header of the csv files
var keys = []
for(i = 0; i < selectedData.length; i++)
{keys.push(data.columns[selectedData[i]])}

total_max = 0
for(i = 0; i < selectedData.length; i++)
{
  tmep = d3.max(data, function(d) {return +d[data.columns[selectedData[i]]]})
  if(total_max < tmep)
  {total_max = tmep}
}

// colors
tempColors = []
for(i = 0; i < keys.length; i++)
{
  tempColors.push("rgba("+ Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+",.9)")
}
  // Add X axis
  x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {return d3.timeParse("%Y-%m-%d")(d.date); }))
    .range([ 0, width ]);
  xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+30 )
      .text("Time")

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, total_max])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", 0)
    .attr("y", 0 )
    .text("Percentage")

  divlegend = document.getElementById("legend")
  for(i = 0; i < selectedData.length; i++)
  {
    legend = document.createElement("p")
    legend.textContent = data.columns[selectedData[i]]
    legend.style.backgroundColor = tempColors[i]
    legend.style.width = "200px"
    legend.style.padding = "10px"

    divlegend.append(legend)
  }

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = svg.append("defs").append("svg:clipPath")
      .attr("id", "clip")
      .append("svg:rect")
      .attr("width", width )
      .attr("height", height )
      .attr("x", 0)
      .attr("y", 0);

  // Add brushing
  brush = d3.brushX()                   // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] )  // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("end", updateChart)               // Each time the brush selection changes, trigger the 'updateChart' function

  // Create the area variable: where both the area and the brush take place
  area = svg.append('g')
    .attr("clip-path", "url(#clip)")
areaGenerator = []
  for(i = 0; i < keys.length; i++)
  {
  // Create an area generator
  areaGenerator.push(d3.area()
    .x(function(d) { return x(d3.timeParse("%Y-%m-%d")(d.date)) })
    .y0(function(d) { return y(d[data.columns[selectedData[i]]]) })
    .y1(function(d) { return y(d[data.columns[selectedData[i]]]) })
    )
  }

  for(i = 0; i < keys.length; i++)
  {// Add the area
    area.append("path")
    .datum(data)
    .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
    .attr("stroke", function(d){ return tempColors[i] })
    .attr("stroke-width", 1)
    .attr("d", areaGenerator[i] )
  }
  // Add the brushing
  area
    .append("g")
      .attr("class", "brush")
      .call(brush);

  // If user double click, reinitialize the chart
  svg.on("dblclick",function(){
    x.domain(d3.extent(data, function(d) { return (d3.timeParse("%Y-%m-%d")(d.date)) }))
    xAxis.transition().call(d3.axisBottom(x).ticks(5));
    area.selectAll(".myArea").remove()
    for(i = 0; i < areaGenerator.length; i++){
      area.append("path")
      .datum(data)
      .attr("class", "myArea")  // I add the class myArea to be able to modify it later on.
      .attr("stroke", function(d){ return tempColors[i] })
      .attr("stroke-width", 1)
      .attr("d", areaGenerator[i] )}
  });

}

var link, node, edgepaths;
function network()
{
  clearGraphs()

var colors = d3.scaleOrdinal(d3.schemeCategory10)

var simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(100).strength(1))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2));

var json = JSON.parse(rawText)
console.log(json)
  link = svg.selectAll(".link")
          .data(json.links)
          .enter()
          .append("line")
          .attr("class", "link")

      edgepaths = svg.selectAll(".edgepath")
          .data(json.links)
          .enter()
          .append('path')
          .style("pointer-events", "none")
          .attr('class', 'edgepath')
          .attr('fill-opacity', 0)
          .attr('stroke-opacity', 0);

      node = svg.selectAll(".node")
          .data(json.nodes)
          .enter()
          .append("g")
          .attr("class", "node")
      node.append("circle")
          .attr("r", 5)
          .style("fill", function (d, i) {return colors(i);})
      node.append("text")
          .attr("dy", -3)
          .text(function (d) {return d.name;});
      simulation
          .nodes(json.nodes)
          .on("tick", ticked)
      simulation.force("link")
          .links(json.links);
}

function ticked() {
        link
            .attr("x1", function (d) {return d.source.x;})
            .attr("y1", function (d) {return d.source.y;})
            .attr("x2", function (d) {return d.target.x;})
            .attr("y2", function (d) {return d.target.y;});

        node
            .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

        edgepaths.attr('d', function (d) {
            return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
        });
    }
