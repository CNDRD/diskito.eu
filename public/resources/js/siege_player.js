let id = new URLSearchParams(window.location.search).get("id");
let VERSION = 10;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  $("#lastUpdatedText").text(diff_minutes(new Date(snapshot.val() * 1000), new Date()));
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  operatorsPage(d);
  trendsPage(d);
  weaponsPage(d);
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/seasonal_data/${id}`).once("value").then(snapshot => {
  let d = snapshot.val();
  seasonsPage(d);
});

function overallPage(d) {
  updateHeader(d);
  updateSeasonalCard(d);
  updateQueueCard(d);
  updateGeneralCard(d);
  updateOperatorCard(d);
  updateWeaponTypeCard(d);
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

  document.title = `${d.ubisoftUsername}"s Siege Stats`;
  $("#level").replaceWith(`<div id="level" class="siege-font-normal">${d.level} <div class="text-small">level</div></div>`);
  $("#total_playtime").replaceWith(`<div id="total_playtime" class="siege-font-normal">${convertSecondsToHours(d.totalPlaytime)} <div class="text-small">h</div></div>`)

  $("#r6stats").attr("href", `https://r6stats.com/stats/${d.ubisoftID}`);
  $("#tab").attr("href", `https://tabstats.com/siege/player/${d.ubisoftID}`);
  $("#trn").attr("href", `https://r6.tracker.network/profile/id/${d.ubisoftID}`);
  $("#r6db").attr("href", `https://r6db.net/player/${d.ubisoftUsername}/${d.ubisoftID}`);
  $("#dragon6").attr("href", `https://dragon6.dragonfruit.network/stats/PC/${d.ubisoftID}`);
};
function updateSeasonalCard(d) {
  $("#season").text(getSeasonNameFromNumber(d.season));
  $("#season").css("color", getSeasonColorRGB(d.season));
  $("#season_code").text(getSeasonCodeFromNumber(d.season));

  $("#next_rank_mmr").text(addSpaces(parseInt(d.nextRankMMR)));
  $("#prev_rank_mmr").text(addSpaces(parseInt(d.prevRankMMR)));

  $("#current_rank_mmr").text(addSpaces(parseInt(d.currentMMR)));
  $("#current_rank_name").text(d.currentRank);
  $("#current_rank_img").attr("src", d.currentRankImage);

  $("#last_mmr_change").text(d.lastMMRchange);
  $("#last_mmr_change").addClass(d.lastMMRchange >= 0 ? (d.lastMMRchange == 0 ? "" : "text-success") : "text-danger");

  $("#seasonal_kd").text(d.sDeaths == 0 ? 0 : roundTwo(d.sKills / d.sDeaths));
  $("#seasonal_wl").text((d.sWins + d.sLosses) == 0 ? 0 : `${roundTwo(d.sWins / (d.sWins + d.sLosses) * 100)}%`);
  $("#seasonal_games").text((d.sWins + d.sLosses) == 0 ? 0 : addSpaces(d.sWins + d.sLosses));

  $("#max_mmr").text(`${addSpaces(parseInt(d.maxMMR))} MMR`);
  $("#max_mmr_name").text(d.maxRank);
  $("#max_rank_img").attr("src", d.maxRankImage);


  // _casual
  $("#next_rank_mmr_casual").text(addSpaces(parseInt(d.nextRankMMRcasual + 1)));
  $("#prev_rank_mmr_casual").text(addSpaces(parseInt(d.prevRankMMRcasual)));

  $("#current_rank_mmr_casual").text(addSpaces(parseInt(d.currentMMRcasual)));
  $("#current_rank_name_casual").text(d.currentRankCasual);
  $("#current_rank_img_casual").attr("src", d.currentRankImageCasual);

  $("#last_mmr_change_casual").text(d.lastMMRchangeCasual);
  $("#last_mmr_change_casual").addClass(d.lastMMRchangeCasual >= 0 ? (d.lastMMRchangeCasual == 0 ? "uk-text-muted" : "uk-text-success") : "uk-text-danger");

  $("#seasonal_kd_casual").text(roundTwo(d.sKillsCasual / d.sDeathsCasual));
  $("#seasonal_wl_casual").text(`${roundTwo(d.sWinsCasual / (d.sWinsCasual + d.sLossesCasual) * 100)}%`);
  $("#seasonal_games_casual").text(addSpaces(d.sWinsCasual + d.sLossesCasual));
};
function updateQueueCard(d) {
  /* Ranked */
  $("#ranked_playtime").text(getPlaytime(d.rankedPlaytime));
  $("#ranked_kd").text(roundTwo(d.rankedKills / d.rankedDeaths));
  $("#ranked_kills").text(addSpaces(d.rankedKills));
  $("#ranked_deaths").text(addSpaces(d.rankedDeaths));
  $("#ranked_games").text(addSpaces(d.rankedGames));

  /* Unranked */
  $("#unranked_playtime").text(getPlaytime(d.casualPlaytime));
  $("#unranked_kd").text(roundTwo(d.casualKills / d.casualDeaths));
  $("#unranked_kills").text(addSpaces(d.casualKills));
  $("#unranked_deaths").text(addSpaces(d.casualDeaths));
  $("#unranked_games").text(addSpaces(d.casualGames));

  /* Discovery */
  $("#discovery_playtime").text(getPlaytime(d.totalPlaytime - (d.rankedPlaytime + d.casualPlaytime)));
  $("#discovery_kd").text(roundTwo((d.totalKills - (d.rankedKills + d.casualKills)) / (d.totalDeaths - (d.rankedDeaths + d.casualDeaths))));
  $("#discovery_kills").text(addSpaces(d.totalKills - (d.rankedKills + d.casualKills)));
  $("#discovery_deaths").text(addSpaces(d.totalDeaths - (d.rankedDeaths + d.casualDeaths)));
  $("#discovery_games").text(addSpaces(d.totalMatches - (d.rankedGames + d.casualGames)));
};
function updateGeneralCard(d) {
  $("#general_kd").text(roundTwo(d.totalKills / d.totalDeaths));
  $("#general_kills").text(addSpaces(d.totalKills));
  $("#general_deaths").text(addSpaces(d.totalDeaths));
  $("#general_assists").text(addSpaces(d.totalAssists));

  $("#general_wl").text(`${roundTwo(d.totalWins / (d.totalWins + d.totalLosses) * 100)}%`);
  $("#general_wins").text(addSpaces(d.totalWins));
  $("#general_losses").text(addSpaces(d.totalLosses));
  $("#general_matches").text(addSpaces(d.totalMatches));

  $("#general_headshots").text(addSpaces(d.totalHeadshots));
  $("#general_hs").text(`${roundTwo(d.hs)}%`);
  $("#general_dbnos").text(addSpaces(d.totalDBNOs));
  $("#general_suicides").text(addSpaces(d.totalSuicides));

  $("#general_melees").text(addSpaces(d.totalMeleeKills));
  $("#general_penetrations").text(addSpaces(d.totalPenetrationKills));
  $("#general_barricades").text(addSpaces(d.totalBarricades));
  $("#general_reinforcements").text(addSpaces(d.totalReinforcements));
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
function updateWeaponTypeCard(d) {
  let wt_name_dict = { "Assault Rifle": "ARs", "Submachine Gun": "SMGs", "Light Machine Gun": "LMGs", "Marksman Rifle": "DMRs", "Handgun": "Handg..", "Shotgun": "Shotg.." };

  d.weapon_types.forEach((w, i) => {
    let wt_name = `
      <div class="uk-visible@s">${addSpaces(w.name)}s</div>
      <div class="uk-hidden@s">${wt_name_dict[addSpaces(w.name)] || w.name}</div>`;
    let wt_kills = `
      <div class="uk-visible@s">${addSpaces(w.kills)}</div>
      <div class="uk-hidden@s">${abbreviateNumber(w.kills)}</div>`;
    let wt_hits = `
      <div class="uk-visible@s">${addSpaces(w.hits)}</div>
      <div class="uk-hidden@s">${abbreviateNumber(w.hits)}</div>`;
    let wt_hsp = `
      <div class="uk-visible@s">${roundTwo((w.headshots / w.kills) * 100)}%</div>
      <div class="uk-hidden@s">${Math.round((w.headshots / w.kills) * 100)}%</div>`;
    let wt_hs = `
      <div class="uk-visible@s">${addSpaces(w.headshots)}</div>
      <div class="uk-hidden@s">${abbreviateNumber(w.headshots)}</div>`;

    $(`#wt_name_${i + 1}`).replaceWith(wt_name);
    $(`#wt_kills_${i + 1}`).replaceWith(wt_kills);
    $(`#wt_hits_${i + 1}`).replaceWith(wt_hits);
    $(`#wt_hsp_${i + 1}`).replaceWith(wt_hsp);
    $(`#wt_hs_${i + 1}`).replaceWith(wt_hs);
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
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return `${hours}h ${minutes}m ${seconds}s`
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
