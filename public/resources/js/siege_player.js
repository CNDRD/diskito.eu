let id = new URLSearchParams(window.location.search).get("id");
let VERSION = 11;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  $("#lastUpdatedText").text(diff_minutes(new Date(snapshot.val() * 1000), new Date()));
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  operatorsPage(d);
  weaponsPage(d);
  //trendsPage(d);
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/seasonal_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  seasonsPage(d);
});
function seasonsPage(d) {
  let seasonsHTML = "";

  for (let what in d) {
    let s = d[what];

    let rank = s.rank;
    let mmr = s.mmr;
    let maxRank = s.max_rank;
    let maxMmr = s.max_mmr;

    if (maxMmr === -1) {
      rank = maxRank = "undefined";
      mmr = maxMmr = 0;
    }

    seasonsHTML += `
    <div class="card card-shadow-around no-hover width-1-1 margin-1-bottom"
         style="border-right: 1.7rem; border-style: none solid none none; border-color: ${getSeasonColorRGB(s.season)};">

      <div class="flex-row-nowrap-cent-evenly">
        <div class="uk-text-left width-1-4-mobile">
          <div class="text-large-2 siege-font-medium" style="color:${getSeasonColorRGB(s.season)}; font-style: italic;">${s.season_name}</div>
          <i>${getSeasonStartDate(s.season)}</i>
          <i>${s.season_code}</i>
        </div>

        <div>
          <div class="flex-col-cen-mid siege-font-normal">
            <div>Rank</div>
            <img class="padding-05-y" style="height: 4rem" src="${getRankImageFromRankName(rank)}"/>
            <div>${mmr} MMR</div>
          </div>
        </div>

        <div>
          <div class="flex-col-cen-mid siege-font-normal">
            <div>Max Rank</div>
            <img class="padding-05-y" style="height: 4rem" src="${getRankImageFromRankName(maxRank)}" />
            <div>${maxMmr} MMR</div>
          </div>
        </div>

        <div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.deaths != 0 ? roundTwo(s.kills / s.deaths) : 0}</span> K/D</div>
            <div><span class="siege-font-normal">${s.kills}</span> Kills</div>
            <div><span class="siege-font-normal">${s.deaths}</span> Deaths</div>
          </div>
        </div>

        <div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.losses != 0 ? roundTwo(s.wins / s.losses) : 0}</span> WL</div>
            <div><span class="siege-font-normal">${s.wins}</span> Wins</div>
            <div><span class="siege-font-normal">${s.losses}</span> Losses</div>
          </div>
        </div>

        <div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.abandons}</span> Abandon${s.abandons == 1 ? "" : "s"}</div>
            <div><span class="siege-font-normal">${s.wins + s.losses}</span> Match${s.wins + s.losses == 1 ? "" : "es"}</div>
          </div>
        </div>
        
      </div>
    </div>`;
  };

  $("#seasons-page").append(`<div class="flex-col-reverse">${seasonsHTML}</div>`);
};


function overallPage(d) {
  updateHeader(d);
  updateSeasonalCard(d);
  updateSeasonalQueueCard(d);
  updateGamemodesCard(d);
};
function operatorsPage(d) {
  let atk = d.operators.atk;
  let def = d.operators.def;
  let OPS = atk.concat(def);

  OPS.sort(function (a, b) { return b.minutes_played - a.minutes_played });

  OPS.forEach(op => {
    $("#operator_table_body").append(getOperatorRow(op));
  });
};


function weaponsPage(d) {
  let weapons = d.weapons;

  updateBestWeaponInStat(getBestWeaponInStat(weapons, "kills"), "mostKills");
  updateBestWeaponInStat(getBestWeaponInStat(weapons, "hs_accuracy"), "bestHsRatio");
  updateBestWeaponInStat(getBestWeaponInStat(weapons, "rounds_played"), "mostPlayed");

  weapons.sort(function (a, b) { return b.kills - a.kills }).forEach(w => {
    let wl = (w.rounds_played) != 0 ? roundTwo((w.rounds_won / (w.rounds_won + w.rounds_lost)) * 100) : 0;
    let hs = (w.hs_accuracy) != 0 ? roundTwo(w.hs_accuracy * 100) : 0;

    $("#all-weapons").append(`
      <div class="flex-col-cen-mid card-shadow-around no-hover">
        <div class="text-large siege-font-normal">${w.name}</div>
        <div><span class="siege-font-normal">${addSpaces(w.kills)}</span> Kills</div>
        <div><span class="siege-font-normal">${addSpaces(w.rounds_played)}</span> Rounds Played</div>
        <div><span class="siege-font-normal">${hs}%</span> HS Acc</div>
        <div><span class="siege-font-normal">${wl}%</span> W/L</div>
      </div>
    `);

  });

};
function updateBestWeaponInStat(w, stat) {
  $(`#BWIS_${stat}_name`).text(w.name);
  $(`#BWIS_${stat}_kills`).text(w.kills);
  $(`#BWIS_${stat}_roundsPlayed`).text(w.rounds_played);
  $(`#BWIS_${stat}_hsAcc`).text(roundTwo(w.hs_accuracy * 100));
  $(`#BWIS_${stat}_image`).attr("src", w.imgur_url);
};
function getBestWeaponInStat(weapons, stat) {
  let i = 0;
  weapons = weapons.sort(function (a, b) { return b[stat] - a[stat] });
  while (weapons[i].headshots < 5 && weapons[i].kills < 5) { i++; }

  return weapons[i];
};


let trendsDatasets = {};
let theChart;
let chartConfig;
function trendsPage(d) {
  let allTrends = d.trends;
  let labels = [];

  function getDefaultDataset(_label) {
    const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;
    return {
      label: _label,
      backgroundColor: "rgba(0, 255, 229, 0.9)",
      borderColor: "rgba(0, 255, 229, 0.4)",

      pointStyle: "circle",
      pointRadius: 7,
      pointHoverRadius: 14,

      tension: 0.6,

      spanGaps: true,
      segment: {
        borderColor: ctx => skipped(ctx, "rgb(0,0,0,0.2)"),
        borderDash: ctx => skipped(ctx, [6, 6]),
      },

      data: [],
    };
  };

  trendsDatasets["KD"] = getDefaultDataset("K / D");
  trendsDatasets["WL"] = getDefaultDataset("W / L");
  trendsDatasets["HS"] = getDefaultDataset("HS%");
  trendsDatasets["MinutesPlayed"] = getDefaultDataset("Minutes Played");
  trendsDatasets["MatchesPlayed"] = getDefaultDataset("Matches Played");
  trendsDatasets["Aces"] = getDefaultDataset("Aces");
  trendsDatasets["Revives"] = getDefaultDataset("Revives");
  trendsDatasets["Assists"] = getDefaultDataset("Assists");
  trendsDatasets["TeamKills"] = getDefaultDataset("Team Kills");
  trendsDatasets["Trades"] = getDefaultDataset("Trades");
  trendsDatasets["RoundsWithKOST"] = getDefaultDataset("Rounds With KOST");

  for (trend in allTrends) {
    let trendData = allTrends[trend];
    labels.push(trend.replace(":", " 👉 "));

    // When the value is null Chart.js can then show dashed lines in the graph
    trendsDatasets["KD"]["data"].push(
      trendData["kill_death_ratio"] != 0 ? trendData["kill_death_ratio"] : null
    );
    trendsDatasets["WL"]["data"].push(
      trendData["win_loss_ratio"] != 0 ? trendData["win_loss_ratio"] : null
    );
    trendsDatasets["HS"]["data"].push(
      trendData["headshot_accuracy"] != 0 ? roundTwo(trendData["headshot_accuracy"] * 100) : null
    );
    trendsDatasets["MinutesPlayed"]["data"].push(
      trendData["minutes_played"] != 0 ? addSpaces(trendData["minutes_played"]) : null
    );
    trendsDatasets["MatchesPlayed"]["data"].push(
      trendData["matches_played"] != 0 ? addSpaces(trendData["matches_played"]) : null
    );
    trendsDatasets["Aces"]["data"].push(
      trendData["rounds_with_ace"] != 0 ? Math.ceil(trendData["rounds_with_ace"] * trendData["rounds_played"]) : null
    );
    trendsDatasets["Revives"]["data"].push(
      trendData["revives"] != 0 ? addSpaces(trendData["revives"]) : null
    );
    trendsDatasets["Assists"]["data"].push(
      trendData["assists"] != 0 ? addSpaces(trendData["assists"]) : null
    );
    trendsDatasets["TeamKills"]["data"].push(
      trendData["team_kills"] != 0 ? addSpaces(trendData["team_kills"]) : null
    );
    trendsDatasets["Trades"]["data"].push(
      trendData["trades"] != 0 ? addSpaces(trendData["trades"]) : null
    );
    trendsDatasets["RoundsWithKOST"]["data"].push(
      trendData["rounds_with_kost"] != 0 ? Math.ceil(trendData["rounds_with_kost"] * trendData["rounds_played"]) : null
    );
  };

  for (dataset in trendsDatasets) {
    $("#chartSelector").append(
      $("<option>", {
        value: dataset,
        text: trendsDatasets[dataset].label,
      })
    );
  }

  chartConfig = {
    type: "line",
    data: { labels: labels, datasets: [trendsDatasets["KD"]] },
    options: {
      plugins: {
        legend: {
          display: false,
        },
        labels: {
          display: false,
        }
      }
    }
  };
  theChart = new Chart(document.getElementById("chartCanvas"), chartConfig);
};
/*
document.getElementById("chartSelector").onchange = function(){
  // Replace the dataset
  chartConfig.data.datasets = [trendsDatasets[document.getElementById("chartSelector").value]];
  // Update the chart
  theChart.update();
};
document.getElementById("chartBezierRange").onchange = function(){
  let val = document.getElementById("chartBezierRange").value;
  // Update the shown value
  $("#chartBezierRangeLabel").text(`Curve Tension (${val})`);
  // Update the tension in config
  chartConfig.data.datasets[0].tension = val;
  // Update the chart
  theChart.update();
};
*/


function updateHeader(d) {
  $("#profile_picture").attr("src", `https://ubisoft-avatars.akamaized.net/${d.ubisoftID}/default_256_256.png`);

  $("#username").text(d.ubisoftUsername);

  document.title = `${d.ubisoftUsername}'s Siege Stats`;
  $("#level").replaceWith(`<div id="level" class="siege-font-normal">${d.progress.level} <div class="text-small">level</div></div>`);
  $("#total_playtime").replaceWith(`<div id="total_playtime" class="siege-font-normal">${convertSecondsToHours(d.playtimes.total)} <div class="text-small">h</div></div>`)

  $("#r6stats").attr("href", `https://r6stats.com/stats/${d.ubisoftID}`);
  $("#tab").attr("href", `https://tabstats.com/siege/player/${d.ubisoftID}`);
  $("#trn").attr("href", `https://r6.tracker.network/profile/id/${d.ubisoftID}`);
  $("#r6db").attr("href", `https://r6db.net/player/${d.ubisoftUsername}/${d.ubisoftID}`);
  $("#dragon6").attr("href", `https://dragon6.dragonfruit.network/stats/PC/${d.ubisoftID}`);
};
function updateSeasonalCard(d) {
  let r = d.seasonal.ranked;
  let c = d.seasonal.casual;
  let e = d.seasonal.events;

  $("#season").text(getSeasonNameFromNumber(r.season));
  $("#season").css("color", getSeasonColorRGB(r.season));
  $("#season_code").text(getSeasonCodeFromNumber(r.season));

  $("#next_rank_mmr").text(addSpaces(getNextRankMMR(r.mmr)));
  $("#prev_rank_mmr").text(addSpaces(getPrevRankMMR(r.mmr)));

  $("#current_rank_mmr").text(addSpaces(r.mmr));
  $("#current_rank_name").text(r.rank);
  $("#current_rank_img").attr("src", getRankImageFromMMR(r.mmr));

  $("#last_mmr_change").text(r.last_mmr_change);
  $("#last_mmr_change").addClass(r.last_mmr_change >= 0 ? (r.last_mmr_change == 0 ? "" : "text-success") : "text-danger");

  $("#seasonal_kd").text(r.deaths == 0 ? 0 : roundTwo(r.kills / r.deaths));
  $("#seasonal_wl").text((r.wins + r.losses) == 0 ? 0 : `${roundTwo(r.wins / (r.wins + r.losses) * 100)}%`);
  $("#seasonal_games").text((r.wins + r.losses) == 0 ? 0 : addSpaces(r.wins + r.losses));

  $("#max_mmr").text(`${addSpaces(parseInt(r.max_mmr))} MMR`);
  $("#max_mmr_name").text(r.max_rank);
  $("#max_rank_img").attr("src", getRankImageFromMMR(r.max_mmr));

  // _casual
  $("#next_rank_mmr_casual").text(addSpaces(getNextRankMMR(c.mmr)));
  $("#prev_rank_mmr_casual").text(addSpaces(getPrevRankMMR(c.mmr)));
  $("#current_rank_mmr_casual").text(addSpaces(c.mmr));
  $("#current_rank_name_casual").text(c.rank);
  $("#current_rank_img_casual").attr("src", getRankImageFromMMR(c.mmr));
  $("#last_mmr_change_casual").text(c.last_mmr_change);
  $("#last_mmr_change_casual").addClass(c.last_mmr_change >= 0 ? (c.last_mmr_change == 0 ? "" : "text-success") : "text-danger");
  $("#seasonal_kd_casual").text(c.deaths == 0 ? 0 : roundTwo(c.kills / c.deaths));
  $("#seasonal_wl_casual").text((c.wins + c.losses) == 0 ? 0 : `${roundTwo(c.wins / (c.wins + c.losses) * 100)}%`);
  $("#seasonal_games_casual").text((c.wins + c.losses) == 0 ? 0 : addSpaces(c.wins + c.losses));

  // _event
  $("#next_rank_mmr_event").text(addSpaces(getNextRankMMR(e.mmr)));
  $("#prev_rank_mmr_event").text(addSpaces(getPrevRankMMR(e.mmr)));
  $("#current_rank_mmr_event").text(addSpaces(e.mmr));
  $("#current_rank_name_event").text(e.rank);
  $("#current_rank_img_event").attr("src", getRankImageFromMMR(e.mmr));
  $("#last_mmr_change_event").text(e.last_mmr_change);
  $("#last_mmr_change_event").addClass(e.last_mmr_change >= 0 ? (e.last_mmr_change == 0 ? "" : "text-success") : "text-danger");
  $("#seasonal_kd_event").text(e.deaths == 0 ? 0 : roundTwo(e.kills / e.deaths));
  $("#seasonal_wl_event").text((e.wins + e.losses) == 0 ? 0 : `${roundTwo(e.wins / (e.wins + e.losses) * 100)}%`);
  $("#seasonal_games_event").text((e.wins + e.losses) == 0 ? 0 : addSpaces(e.wins + e.losses));
};
function updateSeasonalQueueCard(d) {

  for (let name in d.seasonal) {
    let data = d.seasonal[name];

    let kd = data.deaths == 0 ? 0 : roundTwo(data.kills / data.deaths);
    let wl = (data.wins + data.losses) == 0 ? 0 : roundTwo(data.wins / (data.wins + data.losses) * 100)

    $(`#${name}_kd`).text(kd);
    $(`#${name}_kills_deaths`).text(`${data.kills}/${data.deaths}`);
    $(`#${name}_wl`).text(`${wl}%`);
    $(`#${name}_win_lose`).text(`${data.wins}/${data.losses}`);
  };

};
function updateGamemodesCard(d) {

  for (let gamemode in d.gamemodes) {
    let data = d.gamemodes[gamemode];

    if (data.matches_played <= 0) {

      $(`#${gamemode}_g_header`).hide();
      $(`#${gamemode}_g_hr`).hide();
      $(`#${gamemode}_g_body`).hide();

    } else {
      let win_loss_ratio = (data.rounds_won + data.rounds_lost) == 0 ? 0 : roundTwo(data.rounds_won / (data.rounds_won + data.rounds_lost) * 100);

      $(`#${gamemode}_g_playtime`).text(getPlaytime(data.minutes_played))

      $(`#${gamemode}_g_kd`).text(roundTwo(data.kill_death_ratio / 100));
      $(`#${gamemode}_g_kills_deaths`).text(`${addSpaces(data.kills, ",")}/${addSpaces(data.death, ",")}`);
      $(`#${gamemode}_g_wl`).text(`${roundTwo(win_loss_ratio)}%`);
      $(`#${gamemode}_g_win_lose`).text(`${addSpaces(data.matches_won, ",")}/${addSpaces(data.matches_lost, ",")}`);

      $(`#${gamemode}_g_hs`).text(`${data.headshot_accuracy}%`);
      $(`#${gamemode}_g_melee`).text(addSpaces(data.melee_kills, ","));
      $(`#${gamemode}_g_teamkills`).text(data.team_kills);
      $(`#${gamemode}_g_trades`).text(addSpaces(data.trades));

      $(`#${gamemode}_g_rounds`).text(addSpaces(data.rounds_played));
      $(`#${gamemode}_g_kill_percentage`).text(`${data.rounds_with_a_kill}%`);
      $(`#${gamemode}_g_kost_percentage`).text(`${data.rounds_with_kost}%`);
      $(`#${gamemode}_g_ace_percentage`).text(`${data.rounds_with_an_ace}%`);

    }

  };
};

function getOperatorRow(op) {
  let kd = op.death == 0 ? "0" : roundTwo(op.kills / op.death);
  let wl = (op.matches_won + op.matches_lost) == 0 ? "0" : roundTwo(op.matches_won / (op.matches_won + op.matches_lost) * 100);
  let hs = op.kills == 0 ? "0" : roundTwo((op.headshots / op.kills) * 100);
  let ace_count = Math.round((op.rounds_with_an_ace/100)*op.rounds_played);

  let name = `
    <div class="flex-row-nowrap-cent-mid">
      <div class="text-large siege-font-medium">${op.name}</div>
      <img class="margin-1-left" src="${countryCodeToFlag(op.country_code)}" onerror="this.style.display='none'" />
    </div>
    <div class="text-small">${getSeasonNameFromCode(op.year_introduced)} | ${op.unit}</div>
  `;

  return `
    <tr>
      <td> <img src="${op.name === "Azami" ? "https://i.imgur.com/QnqklyT.png" : op.icon_url}" style="height: 4rem" /> </td>
      <td class="operator_name_cell">${name}</td>
      <td sorttable_customkey="${kd * 100}">${kd}</td>
      <td sorttable_customkey="${wl * 100}">${wl}%</td>
      <td sorttable_customkey="${hs * 100}">${hs}%</td>
      <td sorttable_customkey="${op.melee_kills}">${addSpaces(op.melee_kills)}</td>
      <td sorttable_customkey="${ace_count}">${ace_count}</td>
      <td sorttable_customkey="${op.time_played}">${getPlaytime(op.minutes_played)}</td>
    </tr>`
};

function reduceNameLength(a, len = 14) {
  return a.length > (len) ? `${a.substr(0, len)}..` : a.substr(0, len)
};
function orderBySubKey(dict, key) {
  return Object.values(dict).map(value => value).sort((a, b) => b[key] - a[key]);
};
function getPlaytime(m) {
  let hours = Math.floor(m / 60);
  let minutes = m % 60;
  return `${hours}h ${minutes}m`;
};
function convertSecondsToHours(s) {
  return Math.floor(s / 3600);
};
function getOperatorPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  return `${hours}h <span class="uk-text-small uk-text-muted">${minutes}m</span>`
};
function getTopTwoOperatorsFromEach(d) {
  let o = d.operators;

  let atk = orderBySubKey(o.atk, "time_played");
  let def = orderBySubKey(o.def, "time_played");

  return [atk[0], atk[1], def[0], def[1]]
};
function diff_minutes(dt2, dt1) {
  // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
function getTimeAndDateFromTimestamp(UNIX_timestamp) {
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];
  let year = a.getFullYear();
  let month = a.getMonth() + 1;
  let date = a.getDate();
  let hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  return `${hour}:${min}:${sec} / ${date}.${month}. ${year}`;
};
function abbreviateNumber(value) {
  // https://stackoverflow.com/a/10601315/13186339
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "m", "b", "t"];
    var suffixNum = Math.floor(("" + value).length / 3);
    var shortValue = "";
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat((suffixNum != 0 ? (value / Math.pow(1000, suffixNum)) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + "").replace(/[^a-zA-Z 0-9]+/g, "");
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    newValue = shortValue + suffixes[suffixNum];
  }
  return newValue;
}
function getUpdateTimeString(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;

  let msg = `${seconds} second${seconds == 1 ? "" : "s"}`;

  if (parseInt(minutes) != 0) {
    msg = `${minutes} minute${minutes == 1 ? "" : "s"} ${msg}`
  }
  if (parseInt(hours) != 0) {
    msg = `${hours} hour${hours == 1 ? "" : "s"} ${msg}`
  }

  return msg
};


// Update button
firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function () {
    let now = parseInt(Date.now() / 1000);
    let diff = now - last_update;

    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`);

    if (diff >= 180) { $("#siegeManualUpdateButton").removeAttr("hidden"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on("value", snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});
$(document).ready(function () {

  let requested = 0;
  let updateText = "⏰ Please wait, updating..";
  $("#siegeManualUpdateButton").click(() => {

    $.each($("#siegeManualUpdateButton").attr("class").split(/\s+/), (index, item) => {
      if (item === "requested") { requested += 1; }
    });

    switch (requested) {
      case 0:
        $("#siegeManualUpdateButton").addClass("requested");
        firebase.database().ref("GameStats/updateRequests/R6S").set(parseInt(Date.now() / 1000));
        break;
      case 1:
        updateText = "What are you doing?";
        break;
      case 2:
        updateText = "More clicks != faster load times";
        break;
      case 10:
        updateText = "This ain't GTA 5";
        break;
      case 50:
        updateText = "🎵 Woah, we're half way there 🎵";
        break;
      case 100:
        updateText = "Are you done?";
        break;
      case 1000:
        updateText = "Seems not..";
        break;
      case 10000:
        updateText = "I'm calling the cops on you";
        break;
      case 10000:
        updateText = "Serisously, stop";
        break;
      case 100000:
        updateText = "Aight, whatever dude, I give up";
        break;
    }
    $("#siegeManualUpdateButton").text(updateText)
  });

  $.getJSON("https://game-status-api.ubisoft.com/v1/instances", data => {
    $.each(data, (key, val) => {
      if (val["AppID "] === "e3d5ea9e-50bd-43b7-88bf-39794f4e3d40") {
        if (val.Maintenance != null) { return $("#siegePcStatus").replaceWith(`<span style="color: var(--w-away);">Maintenance</span>`); }
        let color = val.Status == "Online" ? "--w-online" : "--w-dnd";
        return $("#siegePcStatus").replaceWith(`<span style="color: var(${color})">${val.Status}</span>`);
      }
    });
  });

  /* Page switcher */
  $(".switcher-button").click(function () {

    $(".switcher-page").each((i, obj) => {
      $(`#${obj.id}`).hide();
    });

    $(`#${this.id}-page`).show();
  });

  /* Seasonal ranked / casual switcher */
  $(".sqs-button").click(function () {

    $(".sqs-page").each((i, obj) => {
      $(`#${obj.id}`).hide();
    });

    $(`#${this.id}-page`).show();
  });

});
