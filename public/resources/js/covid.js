const ZAKLADNI_PREHLED = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/zakladni-prehled.min.json";
const NAKAZENI_VYLECENI_UMRTI_TESTY = "https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.min.json";

$.getJSON(ZAKLADNI_PREHLED, data => {
  let modified = data.modified;
  let d = data.data[0];

  $(`#aktivni_pripady`).text(addSpaces(d.aktivni_pripady));
  $(`#aktualne_hospitalizovani`).text(addSpaces(d.aktualne_hospitalizovani));
  $(`#provedene_testy_vcerejsi_den`).text(addSpaces(d.provedene_testy_vcerejsi_den));

});


am4core.ready(function() {
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

let pozitivni31Chart = am4core.create("pozitivni31ChartDiv", am4charts.XYChart);
let pozitivniChart = am4core.create("pozitivniChartDiv", am4charts.XYChart);
let nakazeni31Chart = am4core.create("nakazeni31ChartDiv", am4charts.XYChart);
let nakazeniChart = am4core.create("nakazeniChartDiv", am4charts.XYChart);

$.getJSON(NAKAZENI_VYLECENI_UMRTI_TESTY, data => {
  let modified = data.modified;
  let d = data.data;
  let ld = d.at(-1);  // last day
  let ya = d.at(-365);  // year ago
  let yatt = `` // year ago tool tip

  $(`#prirustkovy_pocet_nakazenych`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.prirustkovy_pocet_nakazenych)} ${getYAS(ya.prirustkovy_pocet_nakazenych)}</div>`);
  $(`#kumulativni_pocet_nakazenych`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.kumulativni_pocet_nakazenych)} ${getYAS(ya.kumulativni_pocet_nakazenych)}</div>`);
  $(`#prirustkovy_pocet_umrti`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.prirustkovy_pocet_umrti)} ${getYAS(ya.prirustkovy_pocet_umrti)}</div>`);
  $(`#kumulativni_pocet_umrti`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.kumulativni_pocet_umrti)} ${getYAS(ya.kumulativni_pocet_umrti)}</div>`);
  $(`#prirustkovy_pocet_vylecenych`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.prirustkovy_pocet_vylecenych)} ${getYAS(ya.prirustkovy_pocet_vylecenych)}</div>`);
  $(`#kumulativni_pocet_vylecenych`).replaceWith(`<div class="cndrd-font-normal">${addSpaces(ld.kumulativni_pocet_vylecenych)} ${getYAS(ya.kumulativni_pocet_vylecenych)}</div>`);

  let nakazeniData = [];
  data.data.forEach(day => {
    nakazeniData.push({ date: day.datum, new_cases: day.prirustkovy_pocet_nakazenych });
  });

  nakazeni31Chart.data = nakazeniData.slice(Math.max(nakazeniData.length - 31, 0));
  nakazeniChart.data = nakazeniData;

  let percentageData = [];
  data.data.forEach(day => {
    let nakazeni = day.prirustkovy_pocet_nakazenych;
    let testy = day.prirustkovy_pocet_provedenych_testu;
    let proc = Math.round((nakazeni/testy)*10000)/100;
    percentageData.push({ date: day.datum, percentage: proc });
  });

  pozitivni31Chart.data = percentageData.slice(Math.max(percentageData.length - 31, 0));
  pozitivniChart.data = percentageData;

});

createBarChart(pozitivni31Chart, 'percentage', 'date', 'Monke');
createBarChart(pozitivniChart, 'percentage', 'date', 'Monke');
createBarChart(nakazeni31Chart, 'new_cases', 'date', 'Monke');
createBarChart(nakazeniChart, 'new_cases', 'date', 'Monke');

}); /* am4core.ready() */

function createBarChart(chart, vY, cX, seriesName) {

  chart.colors.list = [ am4core.color("#f0506e") ];

  // Create axes
  let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = cX;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 30;

  categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) { if (target.dataItem && target.dataItem.index & 2 == 2) { return dy + 25; } return dy; });

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  let series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = vY;
  series.dataFields.categoryX = cX;
  series.name = seriesName;
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  series.columns.template.fillOpacity = .8;

  let columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 2;
  columnTemplate.strokeOpacity = 1;

  chart.scrollbarX = new am4core.Scrollbar();

};

function getYAS(what) {
  // Year Ago Span
  return `<span uk-tooltip="title:Data from a year ago;pos:right" class="uk-text-muted uk-text-small">(${addSpaces(what)})</span>`;
};
