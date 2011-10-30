var year = 1999;
var w = 400,
    h = 330;

function oc(a)
{
  var o = {};
  for(var i=0;i<a.length;i++)
  {
    o[a[i]]='';
  }
  return o;
}

function applyAgeFilter() {
  var min = ageGroup.length - $("#ageSlider").slider("values", 1) - 1;
  var max = ageGroup.length - $("#ageSlider").slider("values", 0);
  var ages = ageGroup.slice(min, max);
  $("#agegroup").html("from " + ageGroup[min] + " to " + ageGroup[max-1]);
  return filteredData.filter(function(d) { return d.age in oc(ages); });
}

var display = function(data) {
  if (data == undefined)
    data = filteredData;

  data.forEach(function(d) {
    d.people = +d.people;
    d.year = +d.year;
  });

  dataYear = data.filter(function(d) { return d.year == year; });

  // gender: 1 male 2 female
  var mdata = dataYear.filter(function(d) { return d.gender == 1; });
  var fdata = dataYear.filter(function(d) { return d.gender == 2; });

  causeData = d3.nest().key(function(d) { return d.cause; }).map(dataYear);
  var ageData = d3.nest().key(function(d) { return d.age; }).map(dataYear);

  // Calculate max # of people for scale
  var maxp = 0;
  for (var age in ageData) {
    var genderByAgeData = d3.nest().key(function(d) { return d.gender}).map(ageData[age]);
    for (var gender in genderByAgeData) {
      maxp = Math.max(maxp, genderByAgeData[gender].reduce(function(a,b) { return a + b.people }, 0));
    }
  }

  var mageLength = Array();
  var fageLength = Array();
  for (var age in ageData)
  {
      mageLength[age] = 0;
      fageLength[age] = 0;
  }

  var causeGroup = Array();
  var causeColor = Array();
  var causeColorIndex = Array();
  var numCauses = 0;
  for (var cause in causeData)
  {
      causeGroup.push(cause);
      causeColorIndex[cause] = numCauses++;
      causeColor[cause] = "rgb(" + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + "," + parseInt(Math.random() * 255) + ")";
  }

  var xRight = d3.scale.linear().domain([0, maxp]).range([0, w]),
      xLeft = d3.scale.linear().domain([0, maxp]).range([w, 0]),
      y = d3.scale.ordinal().domain(ageGroup).rangeBands([0, h], .2);

  var barWidth = function(d) { return xRight(d.people); }



  d3.select("svg").remove();
  var vis = d3.select("body #content")
      .insert("svg:svg", "#yearAxis")
      .attr("width", 2*w + 40)
      .attr("height", h + 40)
      .append("svg:g")
      .attr("transform", "translate(20,15)");

  var bars = vis.selectAll("g.bar")
      .data(ageGroup)
      .enter().append("svg:g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(0, " + y(i) + ")"; });

  bars.filter(function(d,i) { return i%2 == 0;})
      .append("svg:text")
      .attr("x", w+15)
      .attr("y", y.rangeBand() - 2)
      .attr("fill", "#888")
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .text(function(d) { return d; });

  bars.each(function(d, i) {
      var causes = mdata.filter(function (d) { return d.age == ageGroup[i]; })

      d3.select(this).selectAll("g.bar")
      .data(causes)
      .enter()
      .append("svg:rect")
      .attr("gender", "male")
      //.transition().duration(500)
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
        return "translate("+ (xLeft(pos - d.people) - 20) +",0)";
       })
      //.transition().duration(500)
      .attr("transform", function(d,i) {
        //var pos = fageLength[d.age] + d.people; fageLength[d.age] += d.people;
        var currentTransform = $(this).attr("transform");
        var xPos = parseFloat(/translate\((.*),0\)/.exec(currentTransform)[1]);
        return "translate("+ (xPos - xRight(d.people)) +",0)";
       })
       .attr("fill", function(d, i) { return (i % 2 == 0) ? "#f39393" : "#f28282"; })
      .attr("width", barWidth)
      .attr("height", y.rangeBand());
  });

  var mbars = d3.selectAll("rect[gender='male']");
  var fbars = d3.selectAll("rect[gender='female']");
  var allbars = d3.selectAll("rect").attr("opacity", 1);

  allbars
    .on("mouseover", function(d) {
      allbars
      .filter(function(d2) { return d.cause != d2.cause })
      .transition()
      .attr("opacity", 0.3);
      $("#popover #cause").html(d.cause);
      $("#popover #people").html(d.people);
      $("#popover").css("left", d3.event.x)
                   .css("top", d3.event.y + 10)
                   .show();
     })
    .on("mouseout", function() { allbars.transition().attr("opacity", 1); $("#popover").hide(); })
    .on("click", function(d) {
      // Transition out current bars
      mbars.transition().duration(500).attr("width", 0);
      fbars.transition().duration(500).attr("transform", function(d,i){
        var currentTransform = $(this).attr("transform");
        var xPos = parseFloat(/translate\((.*),0\)/.exec(currentTransform)[1]);
        var width = parseFloat($(this).attr("width"));
        return "translate("+ (xPos + width) +",0)";
       }).attr("width", 0);

       $("#match").html(d.cause);
       filteredData = data.filter(function(e) { return d.cause == e.cause; });
       display(filteredData);
    });

// gridlines and labels for right pyramid

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
  .text(function(d) {
    if (d >= 1000)
      return (d/1000).toFixed(0)+"T";
    else
      return d;
  });

// gridlines and labels for left pyramid

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
  .text(function(d) {
    if (d >= 1000)
      return (d/1000).toFixed(0)+(d==0?"":"T");
    else
      return d;
  });
}

$(document).ready(function() {
  $("#year").html(year);

  d3.csv("data/all.ranksorted.csv", function(data) {
      allData = filteredData = data;
      ageGroup = [];
      for (var age in d3.nest().key(function(d) { return d.age; }).map(allData))
        ageGroup.push(age);

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
         $("#year").html(year);
         display();
        }
      });
      display(data);
  });

  var autoPlayTimer = null;

  function startAutoPlay()
  {
      $("#btnPlay").html("Stop Auto Play");
      year = 1999;
      if (!autoPlayTimer)
      {
        function showNextYearData() {
          $("#year").html(year);
          display(applyAgeFilter());

          if (year == 2005) {
            stopAutoPlay();
          }
          else {
            year ++;
          }
        }
        // Execute for the first time when clicked
        showNextYearData();
        // Set the timer to make it execute automatically
        autoPlayTimer = setInterval(showNextYearData, 500);
      }
  }
  function stopAutoPlay() {
      if (autoPlayTimer) {
        $("#btnPlay").html("Auto Play");
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
      }
  }

  $("#btnPlay").click(function() {
      if (autoPlayTimer) {
        stopAutoPlay();
      }
      else {
        startAutoPlay();
      }
  });

  function filterCause(prefix) {
    filteredData = allData.filter(function(d) {
      var regExp = new RegExp(prefix, "ig");
      return regExp.exec(d.cause);
    });
    if (prefix.length)
      $("#match").html(prefix);
    else
      $("#match").html("All causes");

    display(applyAgeFilter());
  }
  $("#filter input").keyup(function() {
    var prefix = $(this).val();
    filterCause(prefix);
  });
  $("#filter a").click(function() {
    $("#filter input").val("");
    filterCause("");
  });
});
