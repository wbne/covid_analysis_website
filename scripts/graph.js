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

window.addEventListener('load', (event) => {
  var path = window.location.pathname;
  webName = path.split("/").pop();
  loadFile()
});

function loadFile()
{
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //console.log(this.responseText);
      rawText = this.responseText;
      var div = document.getElementById('variables')
      while(div.firstChild){div.removeChild(div.firstChild)}
      loadVariables()
    }
  };
  xhttp.open("GET", "./scripts/flair.joined.tweets.csv", true);
  xhttp.send();
}

function checkCheckbox()
{
  varNum = 0
  selectedValue = 0
  cbCount = 0
  cbs = document.querySelectorAll('#varOption');
  xAxisVar = document.getElementsByClassName("dropdown")[0].value
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
  data = d3.csvParse(rawText)
  count = data.columns.length
  container = document.getElementById("variables")
  indices = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
  if(webName == "temporal.html")
  {
    indices = [0,1,2,3,4,5,15];
  }
  for(i = 0; i < indices.length; i++)
  {
    lab = document.createElement('label')
    lab.textContent = data.columns[indices[i]]
    lab.setAttribute("class", "checkLabel")
    spa = document.createElement('span')
    spa.setAttribute("class", "checkSpan")
    box = document.createElement('input')
    box.setAttribute('type', 'checkbox')
    box.setAttribute('id', 'varOption')
    box.setAttribute('name', indices[i])
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
  for(var i = dropdownLength - 1; i >= 0; i--)
    {dropdowns[0].options[i] = null}
  for (var i = 0; i < count; i++)
  {
    lab = document.createElement('option')
    lab.textContent = data.columns[i]
    dropdowns[0].append(lab)
    dropdowns[0].append(document.createElement('br'))
  }
}

function clearGraphs()
{
  xAxisVar = document.getElementsByClassName("dropdown")[0].selectedIndex
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

function pleasestoplagging()
{
  data = ""
}

function boxplot()
{
  clearGraphs()
  var data = d3.csvParse(rawText)

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

data = d3.csvParse(rawText)
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

    data = d3.csvParse(rawText)
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
for(i = 0; i < 1000; i++)
{
  joinedText += (data[i][data.columns[selectedData[0]]] + ' ')
}
var myWords = joinedText
  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()\[\]\']/g,"")
  .replace(/\s\s+/g, ' ')
  .split(" ")
var freqMap = {}
  myWords.forEach(function(w) {
    if (!freqMap[w]) {
            freqMap[w] = 0;
        }
        freqMap[w] += 1;
  })

var orig = {}
myWords.forEach(function(w){
  if(!orig[w]) {
    orig[w] = 1
  }
})
myWords = Object.keys(orig)

// set the dimensions and margins of the graph
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = graphWidth - margin.left - margin.right,
    height = graphHeight - margin.top - margin.bottom;

// Constructs a new cloud layout instance. It run an algorithm to find the position of words that suits your requirements
var layout = d3.layout.cloud()
  .size([width, height])
  .words(myWords.map(function(d) { return {text: d, size: (freqMap[d] * 5), color: [Math.random()*128+64, Math.random()*128+64, Math.random()*128+64]}; }))
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

function streamline()
{
  clearGraphs()

  // create a tooltip
    var Tooltip = d3.select("#graphArea")
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
data = d3.csvParse(rawText)

  // List of groups = header of the csv files
  var keys = []
  for(i = 0; i < selectedData.length; i++)
  {keys.push(data.columns[selectedData[i]])}

  total_max = 0
  for(i = 0; i < selectedData.length; i++)
  {total_max += d3.max(data, function(d) {return +d[data.columns[selectedData[i]]]})}
  max_time = d3.max(data, function(d) {return +d[data.columns[xAxisVar]]})
  min_time = d3.min(data, function(d) {return +d[data.columns[xAxisVar]]})
  avg_time = (max_time + min_time) / 2
  q1 = (min_time+avg_time)/2
  q3 = (max_time+avg_time)/2
  o1 = (min_time+q1)/2
  o2 = (q1+avg_time)/2
  o3 = (q3+avg_time)/2
  o4 = (max_time+q3)/2

  // Add X axis
  var x = d3.scaleLinear()
    .domain([min_time, max_time])
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(-height).tickValues([min_time, o1, q1, o2, avg_time, o3, q3, o4, max_time]))
    .select(".domain").remove()
  svg.selectAll(".tick line").attr("stroke", "#b8b8b8")
  svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height+30 )
    .text(""+data.columns[xAxisVar])
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
  svg
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
      .style("fill", function(d) { return color(d.key); })
      .attr("d", d3.area()
        .x(function(d, i) { return x(d.data[data.columns[xAxisVar]]); })
        .y0(function(d) { return y(d[0]); })
        .y1(function(d) { return y(d[1]); })
    )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

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
data = d3.csvParse(rawText)

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
max_time = d3.max(data, function(d) {return +d[data.columns[xAxisVar]]})
min_time = d3.min(data, function(d) {return +d[data.columns[xAxisVar]]})

// colors
tempColors = []
for(i = 0; i < keys.length; i++)
{
  tempColors.push("rgba("+ Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+","+Math.round(Math.random()*128+128)+",.9)")
}
  // Add X axis
  var x = d3.scaleLinear()
    .domain(d3.extent(data, function(d) {return +d[data.columns[xAxisVar]]; }))
    .range([ 0, width ]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));
    svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", width)
      .attr("y", height+30 )
      .text(""+data.columns[xAxisVar])

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, total_max])
    .range([ height, 0 ]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // Draw the line
  for(i = 0; i < keys.length; i++)
  {
  svg.selectAll(".line")
      .data([data])
      .enter()
      .append("path")
        .attr("d", d3.line()
          .x(function(d){return x(+d[data.columns[xAxisVar]]) })
          .y(function(d){return y(+d[data.columns[selectedData[i]]]) })
      )
        .attr("fill", "none")
        .attr("stroke", function(d){ return tempColors[i] })
        .attr("stroke-width", 3)
  }

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
