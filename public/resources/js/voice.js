am4core.ready(function() {

// Themes
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

// Initiate the charts
var LVSamChart = am4core.create("lvsChartdiv", am4charts.XYChart);
var totalamChart = am4core.create("totalChartdiv", am4charts.XYChart);
var dailyamChart = am4core.create("dailyChartdiv", am4charts.XYChart);
var totalTotalChart = am4core.create("totalTotalChartdiv", am4charts.XYChart);

//---------------------------//
// Start of my shit-ass code //
//---------------------------//

let currentYear = new Date().getFullYear();
renameHeaders(currentYear);

var totalVoiceDataRef = firebase.database().ref(`voice/${currentYear}/total`);
totalVoiceDataRef.once('value').then(users => {
  var lvsData = [];
  var totalData = [];
  var voiceTreshold = 1800; // 30minutes

  users.forEach(user => {

    let u = user.val()
    let username = prettifyUsernameForChart(u.name);
    // If voice time is above 'voiceTreshold' minutes push it to the graph
    // And convert the time to hours
    if (u.lvs >= voiceTreshold){ lvsData.push({time:secondsToHours(u.lvs), user:username}) };
    if (u.voice >= voiceTreshold){ totalData.push({time:secondsToHours(u.voice), user:username}) };

  }); /* users.forEach() */

  // Sort the data
  lvsData = lvsData.sort(function(a, b){ return b.time - a.time });
  totalData = totalData.sort(function(a, b){ return b.time - a.time });

  // Give the data to the graphs
  LVSamChart.data = lvsData;
  totalamChart.data = totalData;

}); /* totalVoiceDataRef.once() */

var dailyDataRef = firebase.database().ref(`voice/${currentYear}/day`);
dailyDataRef.once('value').then(days => {
  var dailyData = [];

  days.forEach(day => {
    dailyData.push({time:secondsToHours(day.val()), day:day.key})
  }); /* days.forEach() */

  // Give the data to the graph
  dailyamChart.data = dailyData;

}); /* dailyDataRef.once() */

let totalTotalVoicePerUserRef = firebase.database().ref(`users`);
totalTotalVoicePerUserRef.once('value').then(users => {
  let userTimes = [];

  users.forEach(u => {

    u = u.val();

    if (u.in_server) {
      let time = u.all_time_total_voice;
      let name = u.username;

      if (time != undefined && time > 18000 ) { userTimes.push({ time:secondsToHours(time), user: prettifyUsernameForChart(name) }) }
    };

  }); /* users.forEach() */

  userTimes = userTimes.sort(function(a, b){ return b.time - a.time });

  totalTotalChart.data = userTimes;

}); /* totalTotalVoicePerUserRef.once() */


//-------------------------//
// End of my shit-ass code //
//-------------------------//

// Make the rest of the graphs
doTheBarChart(LVSamChart, 'time', 'user', 'LVS');
doTheBarChart(totalamChart, 'time', 'user', 'Total Time');
doTheBarChart(totalTotalChart, 'time', 'user', 'Total Time');
doTheLineGraph(dailyamChart, 'time', 'day');

}); /* am4core.ready() */

function doTheBarChart(chart, vY, cX, seriesName){
  // No idea what anything in here does
  // Did the ol' CTRL+C quickly followed by CTRL+V
  // And hoped for the best..

  // Create axes
  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = cX;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 30;

  categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) { if (target.dataItem && target.dataItem.index & 2 == 2) { return dy + 25; } return dy; });

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = vY; // was 'visits'
  series.dataFields.categoryX = cX; // was 'country'
  series.name = seriesName; // was 'Visits'
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}h[/]";
  series.columns.template.fillOpacity = .8;

  var columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 2;
  columnTemplate.strokeOpacity = 1;

  chart.scrollbarX = new am4core.Scrollbar();

}
function doTheLineGraph(chart, vY, dX){
  // Create axes
  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.renderer.minGridDistance = 60;

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = vY; // was 'value'
  series.dataFields.dateX = dX; // was 'date'
  series.tooltipText = `{${vY}}h`;

  series.tooltip.pointerOrientation = "vertical";

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series;
  chart.cursor.xAxis = dateAxis;

  //chart.scrollbarY = new am4core.Scrollbar();
  chart.scrollbarX = new am4core.Scrollbar();
}
function prettifyUsernameForChart(u) {
  u = u.split('#')
  return reduceNameLength(u, 20)
}
function reduceNameLength(splitname, len){
  return splitname[0].substr(0,len).length > (len-1) ? `${splitname[0].substr(0,len)}..` : splitname[0].substr(0,len)
}
function secondsToHours(s){
  return Math.round((s/60/60)*100)/100
}

function renameHeaders(yr) {
  $('#dailyChartH3').text(`Daily Voice in ${yr}`);
  $('#totalChartH3').text(`Total Time Spent per User in ${yr}`);
  $('#lvsChartH3').text(`Longest Voice Sessions in ${yr}`);
};
