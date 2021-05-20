am4core.ready(function(){

  // Themes
  am4core.useTheme(am4themes_dark);
  am4core.useTheme(am4themes_animated);

  // Initiate Charts
  var last14DaysChart = am4core.create("last14DaysChart", am4charts.XYChart);
  var allTimeChart = am4core.create("allTimeChart", am4charts.XYChart);

  // URIs
  const URL_HOSPITALIZOVANI = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/hospitalizace.min.json';
  const URL_NAZAKENI_VYLECENI_UMRTI_TESTY = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakazeni-vyleceni-umrti-testy.min.json';
  const URL_TESTY = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/testy.min.json';
  const URL_ZAKLADNI_PREHLED = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/zakladni-prehled.min.json';
  const URL_NAKAZA_MIN = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/nakaza.min.json';


  $.getJSON(URL_HOSPITALIZOVANI, hospit => {
    /* Last Update */
    updateLastUpdate('URL_HOSPITALIZOVANI', getDateFromString(hospit.modified));

    latest_hospit_data = getLastTwoElements(hospit.data);
    let hospitalizations_new = latest_hospit_data[1].pocet_hosp - latest_hospit_data[0].pocet_hosp;
    updateHospitalized(hospitalizations_new, latest_hospit_data[1].pocet_hosp);
  }); /* $.getJSON(URL_HOSPITALIZOVANI) */


  $.getJSON(URL_NAZAKENI_VYLECENI_UMRTI_TESTY, data => {
    /* Last Update */
    updateLastUpdate('URL_NAZAKENI_VYLECENI_UMRTI_TESTY', getDateFromString(data.modified));

    nvut = data.data;
    let last_two_days = getLastTwoElements(nvut);
    let deaths_new = last_two_days[1].kumulativni_pocet_umrti - last_two_days[0].kumulativni_pocet_umrti;
    updateDeaths(deaths_new, last_two_days[1].kumulativni_pocet_umrti);
  });


  $.getJSON(URL_ZAKLADNI_PREHLED, data => {
    /* Last Update */
    updateLastUpdate('URL_ZAKLADNI_PREHLED', getDateFromString(data.modified));

    zak_pr = data.data[0];
    updateTests(zak_pr.provedene_testy_vcerejsi_den, zak_pr.provedene_testy_celkem);
    updateAntigenTests(zak_pr.provedene_antigenni_testy_vcerejsi_den, zak_pr.provedene_antigenni_testy_celkem);
    updateNewAndPercentageAndTotalCases(zak_pr.potvrzene_pripady_vcerejsi_den, zak_pr.potvrzene_pripady_celkem, zak_pr.provedene_testy_vcerejsi_den);
    updateVaccinated(zak_pr.vykazana_ockovani_vcerejsi_den, zak_pr.vykazana_ockovani_celkem);
  }); /* $.getJSON(URL_ZAKLADNI_PREHLED) */


  $.getJSON(URL_NAKAZA_MIN, data => {
    bdata = leaveDaysAndCases(data.data) // Better Data
    /* Last Update */
    updateLastUpdate('URL_NAKAZA_MIN', getDateFromString(data.modified));

    /* Parsing the API */
    let last_14_days = getLast14Days(bdata);
    let latest_day = getLastElement(last_14_days);
    let most_cases = getMostDailyCases(bdata);
    let this_day_past_weeks = getThisDayPastWeeksData(data.data, 12);
    let this_day_last_year = getThisDayLastYear(data.data);

    /* cololololors */
    last14DaysChart.colors.list = [ am4core.color("#A5CC1B") ];
    allTimeChart.colors.list = [ am4core.color("#F9F871") ];

    /* Charts */
    last14DaysChart.data = last_14_days;
    allTimeChart.data = leaveDaysAndCases(data.data);
    doTheBarChart(last14DaysChart, 'cases', 'day');
    doTheBarChart(allTimeChart, 'cases', 'day');

    /* Updating Data in HTML */
    updateThisDayLastYear(this_day_last_year);

    updateBestInCovid(addSpaces(most_cases.cases));

    updateThisDayPastWeeksText(this_day_past_weeks);
    updateThisDayPastWeeksData(this_day_past_weeks);

  }); /* $.getJSON(URL_NAKAZA_MIN) */
}); /* am4core.ready() */


function updateLastUpdate(url, date) {
  date = date.split(' ');
  let a = `
    <td class="h-full">
      <span class="d-flex flex-column justify-content-center align-items-center">
        <span class="font-size-22">${date[3]}</span>
        <span class="text-muted">${date[0]} ${date[1]} ${date[2]}</span>
      </span>
    </td>`;
  $(`#lastUpdate-${url}`).replaceWith(a);
};
function updateBestInCovid(cases) {
  $('#bestInCovidCases').text(cases);
};



function updateThisDayPastWeeksData(data) {

  const URL_TESTY = 'https://onemocneni-aktualne.mzcr.cz/api/v2/covid-19/testy.min.json';
  $.getJSON(URL_TESTY, tests_raw_data => {
    /* Last Update */
    updateLastUpdate('URL_TESTY', getDateFromString(data.modified));

    let this_day_past_weeks_tests = getThisDayPastWeeksData(tests_raw_data.data, 12);

    tests_data = leaveTests(this_day_past_weeks_tests);
    data = leaveDaysAndCases(data);
    for(let i = 10; i >= 0; i--){
      $(`#swc${i}`).text(addSpaces(data[i].cases));
      $(`#swt${i}`).text(addSpaces(tests_data[i].cases));
      $(`#swp${i}`).text(`${Math.round((data[i].cases / tests_data[i].cases) * 100)}%`)
      $(`#swd${i}`).text(data[i].day);
    };

  });

};



function updateThisDayPastWeeksText(day) {
  $('#thisDayPastWeeksText').replaceWith(`past
    <span class="uk-visible@s">10</span>
    <span class="uk-hidden@s">9</span>
    ${getDayName(day)}s`);
};
function updateHospitalized(currently_hospitalized, total_hospitalized) {
  $('#newHospitalized').text(`${plusOrMinus(currently_hospitalized)}${addSpaces(currently_hospitalized)}`);
  $('#totalHospitalized').text(addSpaces(total_hospitalized));
};
function updateVaccinated(newly_vaccinated, total_vaccinated) {
  $('#newlyVaccinated').text(`+${addSpaces(newly_vaccinated)}`);
  $('#totalVaccinated').text(addSpaces(total_vaccinated));
};
function updateNewAndPercentageAndTotalCases(latest_day_cases,total_cases,latest_day_tests) {
  $('#latestDayCases').text(addSpaces(latest_day_cases));
  $('#latestDayCasesPercentage').text(addSpaces(`${Math.round((latest_day_cases / latest_day_tests) * 100)}%`));
  $('#totalCases').text(addSpaces(total_cases));
};
function updateDeaths(last_day_deaths, total_deaths) {
  $('#newDeaths').text(`+${addSpaces(last_day_deaths)}`);
  $('#totalDeaths').text(addSpaces(total_deaths));
};
function updateTests(last_day_tests, total_tests) {
  $('#newTests').text(`+${addSpaces(last_day_tests)}`);
  $('#totalTests').text(addSpaces(total_tests));
};
function updateAntigenTests(last_day_antigen_tests, total_antigen_tests) {
  $('#newAntigenTests').text(`+${addSpaces(last_day_antigen_tests)}`);
  $('#totalAntigenTests').text(addSpaces(total_antigen_tests));
};
function updateThisDayLastYear(this_day_last_year) {
  $('#thisDayLastYear').text(addSpaces(this_day_last_year));
};

function getThisDayPastWeeksData(data, numberOfWeeks) {
  let a = [];
  for(var i = 1; i < (numberOfWeeks)*7; i+=7){
    a.push(data[data.length - i]);
  };
  return a;
};
function getLast14Days(data) {
  return data.slice(-14);
};
function getMostDailyCases(data) {
  data = data.sort(function(a, b){ return b.cases - a.cases });
  return data[0]
};
function getLastElement(a) {
  return a.slice(-1)[0];
};
function getLastTwoElements(a) {
  return a.slice(-2);
};
function getDateFromString(ds) {
  const options = { hour: "numeric", minute: "numeric", second: "numeric" };
  return new Date(ds).toLocaleDateString('cs-CZ', options)
};
function getDayName(data) {
  data = prettifyDate(data[0]['datum']).replace(' ','').split('.')

  // https://stackoverflow.com/a/45464959/13186339
  var date = new Date(data[2], data[1]-1, data[0]);
  return date.toLocaleDateString('en-EN', { weekday: 'long' });
};
function getThisDayLastYear(data) {
  let a = new Date();
  let y = a.getFullYear() - 1;
  let m = (a.getMonth() + 1) < 10 ? '0' + (a.getMonth() + 1) : (a.getMonth() + 1);
  let d = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  return data.find(kkt => kkt.datum == `${y}-${m}-${d}`)['prirustkovy_pocet_nakazenych']
};

function prettifyDate(date) {
  let a = date.split('-');
  a = `${parseInt(a[2])}.${parseInt(a[1])}. ${a[0]}`;
  return a
};
function leaveDaysAndCases(data) {
  let b = [];
  data.forEach(day => {
    b.push({cases:day.prirustkovy_pocet_nakazenych, day:prettifyDate(day.datum)});
  });
  return b;
};
function leaveTests(data) {
  let b = [];
  data.forEach(day => {
    b.push({cases:day.prirustkovy_pocet_testu})
  });
  return b;
};
function plusOrMinus(n) {
  if (n > 0) { return '+' }
  return ''
};

function doTheBarChart(chart, vY, cX, seriesName) {
  // No idea what anything in here does
  // Did the ol' CTRL+C quickly followed by CTRL+V
  // And hoped for the best..

  // Create axes
  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.dataFields.category = cX;
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.minGridDistance = 30;
  categoryAxis.renderer.labels.template.horizontalCenter = "right"; // Rotate & Center labels
  categoryAxis.renderer.labels.template.verticalCenter = "middle"; // Rotate & Center labels
  categoryAxis.renderer.labels.template.rotation = 270; // Rotate & Center labels

  categoryAxis.renderer.labels.template.adapter.add("dy", function(dy, target) { if (target.dataItem && target.dataItem.index & 2 == 2) { return dy + 25; } return dy; });

  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  // Create series
  var series = chart.series.push(new am4charts.ColumnSeries());
  series.dataFields.valueY = vY; // was 'visits'
  series.dataFields.categoryX = cX; // was 'country'
  series.name = seriesName; // was 'Visits'
  series.columns.template.tooltipText = "{categoryX}: [bold]{valueY}[/]";
  series.columns.template.fillOpacity = .8;
  series.showOnInit = false; // Disable animations

  var columnTemplate = series.columns.template;
  columnTemplate.strokeWidth = 2;
  columnTemplate.strokeOpacity = 1;

  chart.scrollbarX = new am4core.Scrollbar();
};
