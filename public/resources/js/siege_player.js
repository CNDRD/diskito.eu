let id = new URLSearchParams(window.location.search).get("id");

let ver = new URLSearchParams(window.location.search).get("ver");
let VERSION = ver == undefined ? 12 : ver;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  $("#lastUpdatedText").text(diff_minutes(new Date(snapshot.val() * 1000), new Date()));
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  operatorsPage(d);
  weaponsPage(d);
  trendsPage(d);
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

    if ((s.wins + s.losses + s.abandons) === 0) {
      continue;
    }

    seasonsHTML += `
    <div class="seasonal-card card card-shadow-around no-hover width-1-1 margin-1-bottom"
         style="border-right: 1.7rem; border-style: none solid none none; border-color: ${getSeasonColorRGB(s.season)};">

      <div class="flex-row-wrap-cent-evenly">

        <div class="uk-text-left margin-1-y width-1-4 width-full-mobile text-center-mobile">
          <div class="text-large-2 siege-font-medium text-nowrap" style="color:${getSeasonColorRGB(s.season)}; font-style: italic;">${s.season_name}</div>
          <i>${getSeasonStartDate(s.season)} ${s.season_code}</i>
        </div>

        <div class="flex-row-wrap-cent-evenly width-3-4 width-full-mobile child-width-1-2-mobile child-width-1-5">
          <div class="flex-col-cen-mid siege-font-normal">
            <div>Rank</div>
            <img style="height: 4rem; margin: .5rem 0 .5rem 0;" src="${getRankImageFromRankName(rank)}"/>
            <div>${mmr} MMR</div>
          </div>
          <div class="flex-col-cen-mid siege-font-normal">
            <div>Max Rank</div>
            <img style="height: 4rem; margin: .5rem 0 .5rem 0;" src="${getRankImageFromRankName(maxRank)}" />
            <div>${maxMmr} MMR</div>
          </div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.deaths != 0 ? roundTwo(s.kills / s.deaths) : 0}</span> K/D</div>
            <div><span class="siege-font-normal">${s.kills}</span> Kills</div>
            <div><span class="siege-font-normal">${s.deaths}</span> Deaths</div>
          </div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.losses != 0 ? roundTwo(s.wins / s.losses) : 0}</span> WL</div>
            <div><span class="siege-font-normal">${s.wins}</span> Wins</div>
            <div><span class="siege-font-normal">${s.losses}</span> Losses</div>
          </div>
          <div style="height: 100%" class="flex-col-cen-mid">
            <div><span class="siege-font-normal">${s.abandons}</span> Abandon${s.abandons == 1 ? "" : "s"}</div>
            <div><span class="siege-font-normal">${s.wins + s.losses}</span> Match${s.wins + s.losses == 1 ? "" : "es"}</div>
          </div>
        </div>
        
      </div>
    </div>`;
  };

  if (seasonsHTML === "") {
    $("#seasons").hide();
  } else {
    $("#seasons-page").append(`<div class="flex-col-reverse">${seasonsHTML}</div>`);
  }
};


function operatorsPage(d) {
  let atk = d.operators.atk;
  let def = d.operators.def;
  let OPS = atk.concat(def);

  OPS.sort(function (a, b) { return b.minutes_played - a.minutes_played });

  OPS.forEach(op => {
    if (op.name === "Unknown Operator") { return; }
    $("#operator_table_body").append(getOperatorRow(op));
  });
};
function getOperatorRow(op) {
  let kd = op.death == 0 ? "0" : roundTwo(op.kills / op.death);
  let wl = (op.matches_won + op.matches_lost) == 0 ? "0" : roundTwo(op.matches_won / (op.matches_won + op.matches_lost) * 100);
  let hs = op.kills == 0 ? "0" : roundTwo((op.headshots / op.kills) * 100);
  let ace_count = Math.round((op.rounds_with_an_ace/100)*op.rounds_played);

  let name = `
    <div class="flex-row-nowrap-cent-mid">
      <div class="text-large siege-font-medium">${op.name}</div>
      <img class="margin-1-left hidden-mobile" src="${countryCodeToFlag(op.country_code)}" onerror="this.style.display='none'" />
    </div>
    <div class="text-small hidden-mobile">${getSeasonNameFromCode(op.season_introduced)} | ${op.unit}</div>
  `;

  return `
    <tr>
      <td class="hidden-mobile"> <img src="${op.name === "Azami" ? "https://i.imgur.com/QnqklyT.png" : op.icon_url}" style="height: 4rem" /> </td>
      <td class="operator_name_cell">${name}</td>
      <td sorttable_customkey="${kd * 100}">${kd}</td>
      <td sorttable_customkey="${wl * 100}">${wl}%</td>
      <td sorttable_customkey="${hs * 100}">${hs}%</td>
      <td class="hidden-mobile" sorttable_customkey="${op.melee_kills}">${addSpaces(op.melee_kills)}</td>
      <td class="hidden-mobile" sorttable_customkey="${ace_count}">${ace_count}</td>
      <td class="hidden-mobile" sorttable_customkey="${op.time_played}">${getPlaytime(op.minutes_played)}</td>
    </tr>`
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
  $(`#BWIS_${stat}_hsAcc`).text(`${roundTwo(w.hs_accuracy * 100)}%`);
  $(`#BWIS_${stat}_image`).attr("src", w.imgur_url);
};
function getBestWeaponInStat(weapons, stat) {
  let i = 0;
  weapons = weapons.sort(function (a, b) { return b[stat] - a[stat] });
  while (weapons[i].headshots < 5 && weapons[i].kills < 5) { i++; if (i >= weapons.length) { return weapons[0]; } }

  return weapons[i];
};


let trendsDatasets = {};
let theChart;
let chartConfig;
function trendsPage(d) {
  let allTrends = d.trends;
  let labels = {};

  const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

  let getDefaultScatterDataset = label_ => {
    return {
      label: label_,
      backgroundColor: "rgba(194, 180, 122, 0.9)",
      borderColor: "rgba(194, 180, 122, 0.4)",

      pointStyle: "circle",
      pointRadius: 4,
      pointHoverRadius: 6,

      showLine: false,

      data: [],
    };
  };

  let getDefaultLineDataset = label_ => {
    return {
      label: label_,
      borderColor: "rgba(0, 180, 122, 0.6)",

      pointStyle: "line",
      pointRadius: 0,
      pointHoverRadius: 0.1,

      tension: 1,
      cubicInterpolationMode: 'monotone',

      spanGaps: true,
      segment: {
        borderColor: ctx => skipped(ctx, "rgb(0,0,0,0.2)"),
        borderDash: ctx => skipped(ctx, [6, 6]),
      },

      data: [],
    };
  };

  let trendNames = {
    "kill_death_ratio": "K / D",
    "win_loss_ratio": "W / L",
    "headshot_accuracy": "Headshot Accuracy",
    "kills_per_round": "Kills per Round",
    "distance_per_round": "Distance per Round",
    "rounds_survived": "Rounds Survived",
    "rounds_with_a_kill": "Rounds with a Kill",
    "rounds_with_kost": "Rounds with KOST",
    "rounds_with_multi_kill": "Rounds with Multi-Kill",
    "rounds_with_opening_death": "Rounds with Opening Death",
    "rounds_with_opening_kill": "Rounds with Opening Kill",
  };

  for (let trendName in trendNames) {
    trendsDatasets[trendName] = {};
    trendsDatasets[trendName]['line'] = getDefaultLineDataset(trendNames[trendName]);
    trendsDatasets[trendName]['scatter'] = getDefaultScatterDataset(trendNames[trendName]);
    $("#chartSelector").append( $("<option>", { value: trendName, text: trendNames[trendName] }) );

    allTrends[trendName].actuals.map((v, i) => { labels[`Match #${i}`] = true; });
    trendsDatasets[trendName].line.data = Array.from(allTrends[trendName].trend.values());
    trendsDatasets[trendName].scatter.data = Array.from(allTrends[trendName].actuals.values());
  };

  chartConfig = {
    type: "line",
    data: {
      labels: Object.keys(labels),
      datasets: [
        trendsDatasets["kill_death_ratio"].line,
        trendsDatasets["kill_death_ratio"].scatter,
      ]
    },
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


function overallPage(d) {
  updateHeader(d);
  updateSeasonalCard(d);
  updateSeasonalQueueCard(d);
};
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
  let w = d.seasonal.deathmatch;
  let e = d.seasonal.events;

  $("#season").text(getSeasonNameFromNumber(r.season));
  $("#season").css("color", getSeasonColorRGB(r.season));
  $("#season_code").text(getSeasonCodeFromNumber(r.season));

  $("#next_rank_mmr").text(addSpaces(getNextRankMMR(r.mmr, r.season)));
  $("#prev_rank_mmr").text(addSpaces(getPrevRankMMR(r.mmr, r.season)));

  $("#current_rank_mmr").text(addSpaces(r.mmr));
  $("#current_rank_name").text(r.rank);
  $("#current_rank_img").attr("src", getRankImageFromMMR(r.mmr, r.season));

  $("#last_mmr_change").text(r.last_mmr_change);
  $("#last_mmr_change").addClass(r.last_mmr_change >= 0 ? (r.last_mmr_change == 0 ? "" : "text-success") : "text-danger");

  $("#seasonal_kd").text(r.deaths == 0 ? 0 : roundTwo(r.kills / r.deaths));
  $("#seasonal_wl").text((r.wins + r.losses) == 0 ? 0 : `${roundTwo(r.wins / (r.wins + r.losses) * 100)}%`);
  $("#seasonal_games").text((r.wins + r.losses) == 0 ? 0 : addSpaces(r.wins + r.losses));

  $("#max_mmr").text(`${addSpaces(parseInt(r.max_mmr === -1 ? 0 : r.max_mmr))} MMR`);
  $("#max_mmr_name").text(r.max_rank);
  $("#max_rank_img").attr("src", getRankImageFromMMR(r.max_mmr, r.season));

  // _casual
  $("#next_rank_mmr_casual").text(addSpaces(getNextRankMMR(c.mmr, c.season)));
  $("#prev_rank_mmr_casual").text(addSpaces(getPrevRankMMR(c.mmr, c.season)));
  $("#current_rank_mmr_casual").text(addSpaces(c.mmr));
  $("#current_rank_name_casual").text(c.rank);
  $("#current_rank_img_casual").attr("src", getRankImageFromMMR(c.mmr, c.season));
  $("#last_mmr_change_casual").text(c.last_mmr_change);
  $("#last_mmr_change_casual").addClass(c.last_mmr_change >= 0 ? (c.last_mmr_change == 0 ? "" : "text-success") : "text-danger");
  $("#seasonal_kd_casual").text(c.deaths == 0 ? 0 : roundTwo(c.kills / c.deaths));
  $("#seasonal_wl_casual").text((c.wins + c.losses) == 0 ? 0 : `${roundTwo(c.wins / (c.wins + c.losses) * 100)}%`);
  $("#seasonal_games_casual").text((c.wins + c.losses) == 0 ? 0 : addSpaces(c.wins + c.losses));

  // _casual
  $("#next_rank_mmr_deathmatch").text(addSpaces(getNextRankMMR(w.mmr, w.season)));
  $("#prev_rank_mmr_deathmatch").text(addSpaces(getPrevRankMMR(w.mmr, w.season)));
  $("#current_rank_mmr_deathmatch").text(addSpaces(w.mmr));
  $("#current_rank_name_deathmatch").text(w.rank);
  $("#current_rank_img_deathmatch").attr("src", getRankImageFromMMR(w.mmr, w.season));
  $("#last_mmr_change_deathmatch").text(w.last_mmr_change);
  $("#last_mmr_change_deathmatch").addClass(w.last_mmr_change >= 0 ? (w.last_mmr_change == 0 ? "" : "text-success") : "text-danger");
  $("#seasonal_kd_deathmatch").text(w.deaths == 0 ? 0 : roundTwo(w.kills / w.deaths));
  $("#seasonal_wl_deathmatch").text((w.wins + w.losses) == 0 ? 0 : `${roundTwo(w.wins / (w.wins + w.losses) * 100)}%`);
  $("#seasonal_games_deathmatch").text((w.wins + w.losses) == 0 ? 0 : addSpaces(w.wins + w.losses));

  // _event
  $("#next_rank_mmr_event").text(addSpaces(getNextRankMMR(e.mmr, e.season)));
  $("#prev_rank_mmr_event").text(addSpaces(getPrevRankMMR(e.mmr, e.season)));
  $("#current_rank_mmr_event").text(addSpaces(e.mmr));
  $("#current_rank_name_event").text(e.rank);
  $("#current_rank_img_event").attr("src", getRankImageFromMMR(e.mmr, e.season));
  $("#last_mmr_change_event").text(e.last_mmr_change);
  $("#last_mmr_change_event").addClass(e.last_mmr_change >= 0 ? (e.last_mmr_change == 0 ? "" : "text-success") : "text-danger");
  $("#seasonal_kd_event").text(e.deaths == 0 ? 0 : roundTwo(e.kills / e.deaths));
  $("#seasonal_wl_event").text((e.wins + e.losses) == 0 ? 0 : `${roundTwo(e.wins / (e.wins + e.losses) * 100)}%`);
  $("#seasonal_games_event").text((e.wins + e.losses) == 0 ? 0 : addSpaces(e.wins + e.losses));
};
function updateSeasonalQueueCard(d) {

  for (let name in d.seasonal) {
    let data = d.seasonal[name];

    if (data.wins === 0 && data.losses === 0 && name != "ranked") {
      $(`#sqs-${name}`).hide();
      $(`#sqs-${name}-page`).hide();
      $(`#seasonal-${name}-parent`).hide();
    }

    let kd = data.deaths == 0 ? 0 : roundTwo(data.kills / data.deaths);
    let wl = (data.wins + data.losses) == 0 ? 0 : roundTwo(data.wins / (data.wins + data.losses) * 100)

    $(`#${name}_kd`).text(kd);
    $(`#${name}_kills_deaths`).text(`${data.kills}/${data.deaths}`);
    $(`#${name}_wl`).text(`${wl}%`);
    $(`#${name}_win_lose`).text(`${data.wins}/${data.losses}`);
  };

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

  let msg = hours == 0 ? `${seconds} second${seconds == 1 ? "" : "s"}` : "";

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

    $("#lastUpdated").text(getUpdateTimeString(diff));

    if (diff >= 180) { $("#siegeManualUpdateButton").css("visibility", "visible"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on("value", snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});

$(document).ready(function () {

  /* Trends switcher */
  document.getElementById("chartSelector").onchange = function(){
    // Replace the dataset
    chartConfig.data.datasets = [
      trendsDatasets[document.getElementById("chartSelector").value].line,
      trendsDatasets[document.getElementById("chartSelector").value].scatter
    ];
    // Update the chart
    theChart.update();
  };

  /* Siege manual update request button */
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

  /* Siege Server Status */
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

  /* Automatically show the wanted page */
  $(".switcher-page").each((i, obj) => {
    if (i == $("#switcher").attr("data-active-page")) {
      $(`#${obj.id}`).show();
    }
  });

  /* Seasonal ranked / casual / event switcher */
  $(".sqs-button").click(function () {

    $(".sqs-page").each((i, obj) => {
      $(`#${obj.id}`).hide();
    });

    $(`#${this.id}-page`).show();
  });

});
