let id = new URLSearchParams(window.location.search).get("id");
let VERSION = 11;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  $("#lastUpdatedText").text(diff_minutes(new Date(snapshot.val() * 1000), new Date()));
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  //operatorsPage(d);
  //trendsPage(d);
  //weaponsPage(d);
});

/*
firebase.database().ref(`GameStats/R6Sv${VERSION}/seasonal_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  seasonsPage(d);
});
*/

function overallPage(d) {
  updateHeader(d); // Done
  updateSeasonalCard(d); // Done
  updateSeasonalQueueCard(d);
  updateGamemodesCard(d);
  //updateOperatorCard(d);
};
function operatorsPage(d) {
  let atk = orderBySubKey(d.operators.atk, "time_played");
  let def = orderBySubKey(d.operators.def, "time_played");
  let OPS = atk.concat(def);

  OPS.sort(function (a, b) { return b.time_played - a.time_played });
  OPS.forEach(op => {

    // Temporary, until she is released :D
    // AAHAHAHAHAHAHAHHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAAAA
    if (op.readable === "Azami") { return };

    $("#operator_table").append(getOperatorRow(op));
  });
};
function seasonsPage(d) {
  let seasonsHTML = "";

  d.forEach(s => {

    let rank = s.rank;
    let mmr = s.mmr;
    let maxRank = s.max_rank;
    let maxMmr = s.max_mmr;

    if (maxMmr === -1) {
      rank = maxRank = "undefined";
      mmr = maxMmr = 0;
    }

    seasonsHTML += `
    <div class="uk-card uk-card-secondary uk-card-hover uk-light uk-width-1-1 uk-margin-small-bottom">
      <div class="uk-card-body" style="border-right: 1.7rem; border-style: none solid none none; border-color: ${getSeasonColorRGB(s.season)};">
        <div class="uk-flex uk-flex-middle" uk-grid>
          <div class="uk-text-left cndrd-font-normal uk-width-1-4@m">
            <div style="color:${getSeasonColorRGB(s.season)}; font-size: 2rem; line-height: 1.5;">${s.season_name}</div>
            <div class="uk-text-meta uk-text-italic">${getSeasonStartDate(s.season)}</div>
            <div class="uk-text-meta uk-text-italic">${s.season_code}</div>
          </div>
          <div class="uk-width-3-4@m uk-child-width-1-5@m uk-width-1-1 uk-child-width-1-2" uk-grid>
            <div>
              <div class="uk-flex uk-flex-column uk-flex-middle cndrd-font-normal">
                <div>Rank</div>
                <img class="uk-preserve-width uk-margin-small-bottom uk-margin-small-top"
                    style="height: 4rem" uk-hover="${rank}" data-src="${getRankImageFromRankName(rank)}" uk-img />
                <div>${mmr} MMR</div>
              </div>
            </div>
            <div>
              <div class="uk-flex uk-flex-column uk-flex-middle cndrd-font-normal">
                <div>Max Rank</div>
                <img class="uk-preserve-width uk-margin-small-bottom uk-margin-small-top"
                    style="height: 4rem" uk-hover="${maxRank}" data-src="${getRankImageFromRankName(maxRank)}" uk-img />
                <div>${maxMmr} MMR</div>
              </div>
            </div>
            <div>
              <div style="height: 100%" class="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <div><span class="cndrd-font-normal">${s.deaths != 0 ? roundTwo(s.kills / s.deaths) : 0}</span> K/D</div>
                <div><span class="cndrd-font-normal">${s.kills}</span> Kills</div>
                <div><span class="cndrd-font-normal">${s.deaths}</span> Deaths</div>
              </div>
            </div>
            <div>
              <div style="height: 100%" class="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <div><span class="cndrd-font-normal">${s.losses != 0 ? roundTwo(s.wins / s.losses) : 0}</span> WL</div>
                <div><span class="cndrd-font-normal">${s.wins}</span> Wins</div>
                <div><span class="cndrd-font-normal">${s.losses}</span> Losses</div>
              </div>
            </div>
            <div>
              <div style="height: 100%" class="uk-flex uk-flex-column uk-flex-middle uk-flex-center">
                <div><span class="cndrd-font-normal">${s.abandons}</span> Abandon${s.abandons == 1 ? "" : "s"}</div>
                <div><span class="cndrd-font-normal">${s.wins + s.losses}</span> Match${s.wins + s.losses == 1 ? "" : "es"}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  });

  seasonsHTML = `
  <li>
    <div class="uk-flex uk-flex-column-reverse">
      ${seasonsHTML}
    </div>
  </li>`;

  //$("#seasons-page").replaceWith(seasonsHTML);
};


function weaponsPage(d) {
  let weapons = d.weapons;

  let mostKills = getBestWeaponInStat(weapons, "kills");
  let bestHsRatio = getBestWeaponInStat(weapons, "hs_accuracy");
  let mostPlayed = getBestWeaponInStat(weapons, "rounds_played");
  updateBestWeaponInStat(mostKills, "mostKills");
  updateBestWeaponInStat(bestHsRatio, "bestHsRatio");
  updateBestWeaponInStat(mostPlayed, "mostPlayed");

  weapons.sort(function (a, b) { return b.kills - a.kills }).forEach(w => {
    let wl = (w.rounds_played) != 0 ? roundTwo((w.rounds_won / (w.rounds_won + w.rounds_lost)) * 100) : 0;
    let hs = (w.hs_accuracy) != 0 ? roundTwo(w.hs_accuracy * 100) : 0;

    $("#weaponsGrid").append(`
    
      <div>
        <div class="uk-card uk-card-secondary uk-card-body uk-grid-collapse uk-light">
          <h3 class="cndrd-font-normal uk-text-emphasis">
            ${w.name}
          </h3>
          
          <div class="uk-flex uk-flex-column uk-text-center uk-text-large">
            <div>
              <span class="uk-text-emphasis cndrd-font-normal">${addSpaces(w.kills)}</span> Kills
            </div>
            
            <div>
              <span class="uk-text-emphasis cndrd-font-normal">${addSpaces(w.rounds_played)}</span> Rounds Played
            </div>
            <div>
              <span class="uk-text-emphasis cndrd-font-normal">${hs}%</span> HS Acc
            </div>
            <div>
              <span class="uk-text-emphasis cndrd-font-normal">${wl}%</span> W/L
            </div>
              
          </div>
        </div>
      </div>
    
    `);
  });

};

function updateBestWeaponInStat(w, stat) {
  $(`#BWIS_${stat}_name`).text(w.name);
  $(`#BWIS_${stat}_kills`).text(`${w.kills} Kills`);
  $(`#BWIS_${stat}_roundsPlayed`).text(`${w.rounds_played} Rounds Played`);
  $(`#BWIS_${stat}_hsAcc`).text(`${roundTwo(w.hs_accuracy * 100)}% HS Acc`);
  $(`#BWIS_${stat}_image`).attr("data-src", w.image_url);
};
function getBestWeaponInStat(weapons, stat) {
  let i = 0;
  weapons = weapons.sort(function (a, b) { return b[stat] - a[stat] });

  while (weapons[i].headshots < 5 && weapons[i].kills < 5) {
    i++;
  }

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
  console.log(d);

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


function updateOperatorCard(d) {
  let ops = getTopTwoOperatorsFromEach(d);
  ops.forEach((op, i) => {
    let operator_wl = `
      <div class="uk-visible@s">${roundTwo(op.wins / (op.wins + op.losses) * 100)}%</div>
      <div class="uk-hidden@s">${Math.round(op.wins / (op.wins + op.losses) * 100)}%</div>`;

    let op_playtime_rawxd = getOpPlaytime(op.time_played);
    let op_playtime = `
      <div class="uk-visible@s">${op_playtime_rawxd}</div>
      <div class="uk-hidden@s">${op_playtime_rawxd.split(" ")[0]}</div>`;

    $(`#operator_img_${i + 1}`).attr("uk-tooltip", op.readable);
    $(`#operator_img_${i + 1}`).attr("data-src", op.icon);
    $(`#operator_kd_${i + 1}`).text(roundTwo(op.kills / op.deaths));
    $(`#operator_wl_${i + 1}`).replaceWith(operator_wl);
    $(`#operator_playtime_${i + 1}`).replaceWith(op_playtime);
  });
};

function getOperatorRow(op) {
  let kd = op.deaths == 0 ? "0" : roundTwo(op.kills / op.deaths);
  let wl = (op.wins + op.losses) == 0 ? "0" : roundTwo(op.wins / (op.wins + op.losses) * 100);
  let hs = op.kills == 0 ? "0" : roundTwo((op.headshots / op.kills) * 100);

  let kdtd = `
    <div class="uk-flex uk-flex-row uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-margin-small-right uk-text-emphasis cndrd-font-normal">
        ${kd}
      </div>
      <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
        <span class="uk-text-nowrap">${addSpaces(op.kills)} K</span>
        <span class="uk-text-nowrap">${addSpaces(op.deaths)} D</span>
      </div>
    </div>`;
  let wltd = `
    <div class="uk-flex uk-flex-row uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-margin-small-right uk-text-emphasis cndrd-font-normal">
        ${wl}
      </div>
      <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
        <span class="uk-text-nowrap">${addSpaces(op.wins)} W</span>
        <span class="uk-text-nowrap">${addSpaces(op.losses)} L</span>
      </div>
    </div>`;
  let hstd = `
    <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-middle">
      <div class="uk-text-large uk-text-emphasis cndrd-font-normal">${hs}%</div>
      <div class="uk-text-muted uk-text-nowrap">${addSpaces(op.headshots)}</div>
    </div>`;

  let name = `
    <div class="uk-flex uk-flex-column uk-flex-nowrap uk-flex-center uk-flex-left">
      <div class="uk-flex uk-flex-row uk-flex-middle">
        <div class="uk-text-emphasis cndrd-font-medium">${op.readable}</div>
        <img class="uk-preserve-width uk-margin-small-left" src="${countryCodeToFlag(getOperatorData(op.name, "countryCode"))}" />
      </div>
      <div class="uk-text-muted uk-text-small">${getSeasonNameFromCode(getOperatorData(op.name, "year"))} | ${getOperatorData(op.name, "unit")}</div>
    </div>
  `;

  let abilities = "";
  orderBySubKey(op.unique_stats, "value").forEach(ua => {
    abilities += `<li>${ua.name} - ${addSpaces(ua.value)}</li>`;
  });

  let ability = `
    <div class="uk-inline">
      <img class="uk-preserve-width" data-src="${getUniqueAbilityImage(op.name)}" style="height: 4rem" uk-img />
      <div uk-drop="mode: click; pos:left-center">
        <div class="uk-card uk-card-body uk-card-secondary">
          <ul class="uk-list uk-list-divider">
            ${abilities}
          </ul>
        </div>
      </div>
    </div>
  `;

  return `
    <tr ${getDATA(op)}>
      <td class="uk-text-center"> <img class="uk-preserve-width" data-src="${op.icon}" style="height: 6rem" uk-img /> </td>
      <td class="uk-text-middle uk-text-large uk-visible@m">${name}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${kd * 100}">${kdtd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${wl * 100}">${wltd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${hs * 100}">${hstd}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.dbnos)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.melees)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@m cndrd-font-normal uk-text-nowrap" sorttable_customkey="${op.time_played}">${getOperatorPlaytime(op.time_played)}</td>
      <td class="uk-text-center uk-text-middle uk-visible@l"> ${ability} </td>
    </tr>`
};

function getDATA(op) {
  let kd = (op.deaths == 0 ? 0 : roundTwo(op.kills / op.deaths)) >= 1 ? "more" : "less";
  let wl = ((op.wins + op.losses) == 0 ? 0 : roundTwo(op.wins / (op.wins + op.losses) * 100)) >= 50 ? "more" : "less";
  let hs = (op.kills == 0 ? 0 : roundTwo((op.headshots / op.kills) * 100)) >= 50 ? "more" : "less";
  let opData = getOperatorData(op.name);
  let r = opData.roles;

  return `
    data-atkdef="${op.atkdef}"
    data-kd="${kd}"
    data-wl="${wl}"
    data-hs="${hs}"
    data-year="${opData.year.charAt(1)}"
    data-role-anchor=${r.includes("Anchor")}
    data-role-anti-roam=${r.includes("Anti Roam")}
    data-role-roam=${r.includes("Roam")}
    data-role-anti-hard-breach=${r.includes("Anti Hard Breach")}
    data-role-hard-breach=${r.includes("Hard Breach")}
    data-role-soft-breach=${r.includes("Soft Breach")}
    data-role-back-line=${r.includes("Back Line")}
    data-role-front-line=${r.includes("Front Line")}
    data-role-intel-gatherer=${r.includes("Intel Gatherer")}
    data-role-intel-denier=${r.includes("Intel Denier")}
    data-role-disable=${r.includes("Disable")}
    data-role-covering-fire=${r.includes("Covering Fire")}
    data-role-area-denial=${r.includes("Area Denial")}
    data-role-crowd-control=${r.includes("Crowd Control")}
    data-role-flank=${r.includes("Flank")}
    data-role-buff=${r.includes("Buff")}
    data-role-secure=${r.includes("Secure")}
    data-role-shield=${r.includes("Shield")}
    data-role-trap=${r.includes("Trap")}
  `;
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
function getOpPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  return `${hours}h ${minutes}m`
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
