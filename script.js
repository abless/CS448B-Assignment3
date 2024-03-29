/*
 * Copyright (C) Alexander Blessing, Yu-Ta Lu
 */

var year = 1999;
var w = 400,
    h = 330;

/* Small helper function */
function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

function applyAgeFilter(data) {
  if (data == undefined)
    data = filteredData;

  var min = ageGroup.length - $("#ageSlider").slider("values", 1) - 1;
  var max = ageGroup.length - $("#ageSlider").slider("values", 0);
  ageGroupSlice = ageGroup.slice(min, max);

  var startAge, endAge;
  if (ageGroup[min] == "95+") {
      stargAge = "95+";
  }
  else {
      stargAge = ageGroup[min].split(/-/)[0];
  }
  if (ageGroup[max - 1] == "95+") {
      endAge = "95+";
  }
  else {
      endAge = ageGroup[max - 1].split(/-/)[1];
  }
  $("#agegroup").html("from " + stargAge + " to " + endAge);
  return data.filter(function(d) { return d.age in oc(ageGroupSlice); });
}

/* Display current data */
var display = function() {
  var data = filteredData;

  // Convert to integer type
  data.forEach(function(d) {
    d.people = +d.people;
    d.year = +d.year;
  });

  dataYear = applyAgeFilter(data.filter(function(d) { return d.year == year; }));

  var mdataAllYear = data.filter(function(d) { return d.gender == 1; });
  var fdataAllYear = data.filter(function(d) { return d.gender == 2; });

  // gender: 1 male, 2 female
   var mdata = dataYear.filter(function(d) { return d.gender == 1; });
   var fdata = dataYear.filter(function(d) { return d.gender == 2; });

  causeData = d3.nest().key(function(d) { return d.cause; }).map(dataYear);
  var ageData = d3.nest().key(function(d) { return d.age; }).map(dataYear);

  // Calculate max # of people for scale
  var maxp = 0;
  for (var currentYear = 1999; currentYear <= 2005; currentYear ++) {
      for (var age in ageData) {
        for (var gender = 1; gender <= 2; gender ++) {
            var allData = data.filter(function(d) { return d.year == currentYear; })
                          .filter(function(d) { return d.gender == gender;})
                          .filter(function(d) { return d.age == age; });
            maxp = Math.max(maxp, allData.reduce(function(a,b) { return a + b.people }, 0));
        }
      }
  }

  // Helper variables used to encode position of stacked bars
  var mageLength = Array();
  var fageLength = Array();
  for (var age in ageData)
  {
      mageLength[age] = 0;
      fageLength[age] = 0;
  }

  var xRight = d3.scale.linear().domain([0, maxp]).range([0, w]),
      xLeft = d3.scale.linear().domain([0, maxp]).range([w, 0]),
      y = d3.scale.ordinal().domain(ageGroup).rangeBands([0, h], .2);

  var barWidth = function(d) { return xRight(d.people); }

  d3.select("svg").remove();
  var vis = d3.select("body #content")
      .insert("svg:svg", "#yearAxis")
      .attr("width", 2*w + 80)
      .attr("height", h + 40)
      .append("svg:g")
      .attr("transform", "translate(20,15)");

  var bars = vis.selectAll("g.bar")
      .data(ageGroup)
      .enter().append("svg:g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(0, " + y(i) + ")"; });

  bars.filter(function(d,i) { return i % 2 == 0; })
      .append("svg:text")
      .attr("x", w+15)
      .attr("y", y.rangeBand() - 2)
      .attr("fill", "#888")
      .attr("opacity", function(d) { return d in oc(ageGroupSlice) ? "1" : "0.3"})
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(function(d) { return d.split(/-/)[0]; });

  bars.each(function(d, i) {
      var causes = mdata.filter(function (d) { return d.age == ageGroup[i]; })

      d3.select(this).selectAll("g.bar")
      .data(causes)
      .enter()
      .append("svg:rect")
      .attr("gender", "male")
      .attr("transform", function(d,i) {
        var pos = mageLength[d.age]; mageLength[d.age] += d.people;
        return "translate("+ (w + xRight(pos) + 50) +",0)";
       })
      .attr("fill", function(d, i) {return (i % 2 == 0) ? "#82aff2" : "#93bff3"; })
      .attr("width", barWidth)
      .attr("height", y.rangeBand());

  });

  bars.each(function(d, i) {
      var causes = fdata.filter(function (d) { return d.age == ageGroup[i]; });

      d3.select(this).selectAll("g.bar")
      .data(causes)
      .enter()
      .append("svg:rect")
      .attr("gender", "female")
      .attr("transform", function(d,i) {
        var pos = fageLength[d.age] + d.people; fageLength[d.age] += d.people;
        return "translate("+ (xLeft(pos) - 20) +",0)";
       })
       .attr("fill", function(d, i) { return (i % 2 == 0) ? "#f28282" : "#f39393"; })
      .attr("width", barWidth)
      .attr("height", y.rangeBand());
  });

  var allbars = d3.selectAll("rect").attr("opacity", 1);

  allbars
    .on("mouseover", function(d) {
      allbars
      .filter(function(d2) { return d.cause != d2.cause })
      .attr("opacity", 0.3);
      $("#popover #cause").html(d.cause);
      $("#popover #people").html(d.people);
      $("#popover #age").html(d.age);
      $("#popover #gender").html((d.gender == "1") ? "male" : "female");
      $("#popover").css("left", d3.event.x)
                   .css("top", d3.event.y + 10)
                   .show();
     })
    .on("mouseout", function() { allbars.attr("opacity", 1); $("#popover").hide(); })
    .on("click", function(d) {
       $("#match").html(d.cause);
       $("#filter input").val(d.cause);
       filteredData = data.filter(function(e) { return d.cause == e.cause; });
       display(filteredData);
    });

// Display age label
vis.append("svg:text")
    .attr("x", w+15)
    .attr("y", 0 - 15)
    .attr("dy", ".71em")
    .attr("fill", "#888")
    .attr("text-anchor", "middle")
    .attr("font-size", "15px")
    .attr("font-variant", "small-caps")
    .attr("letter-spacing", 1)
    .text("age");

// Show gridlines for right graph

var rules1 = vis.selectAll("g.rule1")
  .data(xRight.ticks(5))
.enter()
.append("svg:g")
  .filter(function(d) { return d > 0; })
  .attr("class", "rule1")
  .attr("transform", function(d) { return "translate("+(w+50+xRight(d))+",0)";});


rules1.append("svg:line")
  .attr("y1", h - 2)
  .attr("y2", h + 4)
  .attr("stroke", "#bbb");

rules1.append("svg:line")
  .attr("y1", 0)
  .attr("y2", h)
  .attr("stroke", "#ddd")
  .attr("stroke-opacity", .3);

rules1.append("svg:text")
  .attr("y", h + 9)
  .attr("dy", ".71em")
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "#bbb")
  .text(function(d) { return d; });

// Show gridlines for left graph

var rules2 = vis.selectAll("g.rule2")
  .data(xLeft.ticks(5))
.enter()
.append("svg:g")
  .filter(function(d) { return d > 0; })
  .attr("class", "rule2")
  .attr("transform", function(d) { return "translate("+(xLeft(d)-20)+",0)";});

rules2.append("svg:line")
  .attr("y1", h - 2)
  .attr("y2", h + 4)
  .attr("stroke", "#bbb");

rules2.append("svg:line")
  .attr("y1", 0)
  .attr("y2", h)
  .attr("stroke", "#ddd")
  .attr("stroke-opacity", .3);

rules2.append("svg:text")
  .attr("y", h + 9)
  .attr("dy", ".71em")
  .attr("text-anchor", "middle")
  .attr("font-size", "12px")
  .attr("fill", "#bbb")
  .text(function(d) { return d; });
}

var autoPlayTimer = null;
function startAutoPlay()
{
    $("#btnPlay").html("Stop Auto Play");
    year = 1999;
    if (!autoPlayTimer)
    {
      function showNextYearData() {
        $("#year").html(year);
        $("#yearSlider").slider("value", year);
        display(applyAgeFilter());

        if (year == 2005) {
          stopAutoPlay();
        }
        else {
          year ++;
        }
      }
      showNextYearData();  // Execute for the first time when clicked
      autoPlayTimer = setInterval(showNextYearData, 500);  // Set the timer to make it execute automatically
    }
}
function stopAutoPlay() {
    if (autoPlayTimer) {
      $("#btnPlay").html("Auto Play");
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
}

function filterCause(prefix) {
  filteredData = allData.filter(function(d) {
    var regExp = new RegExp(prefix, "ig");
    return regExp.exec(d.cause);
  });
  if (prefix.length)
    $("#match").html(prefix);
  else
    $("#match").html("All causes");

  display();
}

$(document).ready(function() {
  $("#year").html(year);

  $("#btnPlay").click(function() {
      if (autoPlayTimer) {
        stopAutoPlay();
      }
      else {
        startAutoPlay();
      }
  });

  $("#filter input").keyup(function() {
    var prefix = $(this).val();
    filterCause(prefix);
  });

  $("#filter a").click(function() {
    $("#filter input").val("");
    filterCause("");
  });

  // Load the data, do some initial data transformation, and display the visualization
  d3.csv("all.ranksorted.csv", function(data) {
      allData = filteredData = data;
      ageGroup = [];
      for (var age in d3.nest().key(function(d) { return d.age; }).map(allData))
        ageGroup.push(age);

      ageGroupSlice = ageGroup;
      $("#ageSlider").slider({
        orientation: "vertical",
        min: 0,
        max: ageGroup.length-1,
        values: [0, ageGroup.length-1],
        range: true,
        change: function(event, ui) {
         display(applyAgeFilter());
        }
      });

      $("#yearSlider").slider({
        min: 1999,
        max: 2005,
        value: 1999,
        slide: function(event, ui) {
         year = ui.value;
         if ($("#year").html != ("" + year)) {
           $("#year").html(year);
           display();
         }
        }
      });
      display();
  });
});
