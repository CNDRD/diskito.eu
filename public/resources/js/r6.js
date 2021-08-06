$("table").stickyTableHeaders();
let id = new URLSearchParams(window.location.search).get('id');
let VERSION = 8;

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once('value').then(snapshot => {
  $("#lastUpdatedText").text( diff_minutes(new Date(snapshot.val()*1000), new Date()) );
  $("#lastUpdated").attr("uk-tooltip", `title: ${getTimeAndDateFromTimestamp(snapshot.val())}`);
});

firebase.database().ref(`GameStats/R6Sv${VERSION}/all_data/${id}`).once('value').then(snapshot => {
  let d = snapshot.val();
  overallPage(d);
  operatorsPage(d);
});

function overallPage(d) {
  updateHeader(d);
  updateSeasonalCard(d);
  updateQueueCard(d);
  updateGeneralCard(d);
  updateOperatorCard(d);
};
function operatorsPage(d) {
  let atk = orderBySubKey(d.operators.atk, 'time_played');
  let def = orderBySubKey(d.operators.def, 'time_played');
  let OPS = atk.concat(def);

  OPS.sort(function(a,b){return b.time_played-a.time_played});
  OPS.forEach(op => { $('#operator_table').append(getOperatorRow(op)); });
};



function updateHeader(d) {
  $('#profile_picture').attr('src', `https://ubisoft-avatars.akamaized.net/${d.ubisoftID}/default_256_256.png`);
  $('#TGVjGjztIQ').removeClass("uk-placeholder");
  $('#profile_picture').removeAttr("hidden");

  $('#username').text(d.ubisoftUsername);
  $('#username').attr("uk-tooltip",d.ubisoftUsername);

  document.title = `${d.ubisoftUsername}'s Rainbow Six: Siege Stats'`;
  $('#level').text(d.level);
  $('#alpha_pack').text(`${roundTwo(d.alphapackProbability/100)}%`);
  $('#total_playtime').text(`${convertSecondsToHours(d.totalPlaytime)}h`)

  $('#r6stats').attr('href',`https://r6stats.com/stats/${d.ubisoftID}`);
  $('#tab').attr('href',`https://tabstats.com/siege/player/${d.ubisoftID}`);
  $('#trn').attr('href',`https://r6.tracker.network/profile/id/${d.ubisoftID}`);
};
function updateSeasonalCard(d) {
  $('#season').text(getSeasonFromNumber(d.season));
  $('#season').css('color', getSeasonColorRGB(d.season));
  $('#season_code').text(getSeasonCodeFromNumber(d.season));

  $('#next_rank_mmr').text(addSpaces(parseInt(d.nextRankMMR)));
  $('#prev_rank_mmr').text(addSpaces(parseInt(d.prevRankMMR)));

  $('#current_rank_mmr').text(addSpaces(parseInt(d.currentMMR)));
  $('#current_rank_name').text(d.currentRank);
  $('#current_rank_img').attr('data-src', d.currentRankImage);

  $('#last_mmr_change').text(d.lastMMRchange);
  $('#last_mmr_change').addClass(d.lastMMRchange >= 0 ? ( d.lastMMRchange == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger');

  $('#seasonal_kd').text(d.sDeaths == 0 ? 0 : roundTwo(d.sKills / d.sDeaths));
  $('#seasonal_wl').text((d.sWins + d.sLosses) == 0 ? 0 : `${roundTwo(d.sWins / (d.sWins + d.sLosses) * 100)}%`);
  $('#seasonal_games').text((d.sWins + d.sLosses) == 0 ? 0 : addSpaces(d.sWins + d.sLosses));

  $('#max_mmr').text(`${addSpaces(parseInt(d.maxMMR))} MMR`);
  $('#max_mmr_name').text(d.maxRank);
  $('#max_rank_img').attr('data-src', d.maxRankImage);


  // _casual
  $('#next_rank_mmr_casual').text(addSpaces(parseInt(d.nextRankMMRcasual+1)));
  $('#prev_rank_mmr_casual').text(addSpaces(parseInt(d.prevRankMMRcasual)));

  $('#current_rank_mmr_casual').text(addSpaces(parseInt(d.currentMMRcasual)));
  $('#current_rank_name_casual').text(d.currentRankCasual);
  $('#current_rank_img_casual').attr('data-src', d.currentRankImageCasual);

  $('#last_mmr_change_casual').text(d.lastMMRchangeCasual);
  $('#last_mmr_change_casual').addClass(d.lastMMRchangeCasual >= 0 ? ( d.lastMMRchangeCasual == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger');

  $('#seasonal_kd_casual').text(roundTwo(d.sKillsCasual / d.sDeathsCasual));
  $('#seasonal_wl_casual').text(`${roundTwo(d.sWinsCasual / (d.sWinsCasual + d.sLossesCasual) * 100)}%`);
  $('#seasonal_games_casual').text(addSpaces(d.sWinsCasual + d.sLossesCasual));
};
function updateQueueCard(d) {
  /* Ranked */
  $('#ranked_playtime').text(getPlaytime(d.rankedPlaytime));
  $('#ranked_kd').text(roundTwo(d.rankedKills / d.rankedDeaths));
  $('#ranked_kills').text(addSpaces(d.rankedKills));
  $('#ranked_deaths').text(addSpaces(d.rankedDeaths));
  $('#ranked_games').text(addSpaces(d.rankedGames));

  /* Unranked */
  $('#unranked_playtime').text(getPlaytime(d.casualPlaytime));
  $('#unranked_kd').text(roundTwo(d.casualKills / d.casualDeaths));
  $('#unranked_kills').text(addSpaces(d.casualKills));
  $('#unranked_deaths').text(addSpaces(d.casualDeaths));
  $('#unranked_games').text(addSpaces(d.casualGames));

  /* Discovery */
  $('#discovery_playtime').text(getPlaytime(d.totalPlaytime - (d.rankedPlaytime + d.casualPlaytime)));
  $('#discovery_kd').text(roundTwo( (d.totalKills - (d.rankedKills + d.casualKills)) / (d.totalDeaths - (d.rankedDeaths + d.casualDeaths)) ));
  $('#discovery_kills').text(addSpaces(d.totalKills - (d.rankedKills + d.casualKills)));
  $('#discovery_deaths').text(addSpaces(d.totalDeaths - (d.rankedDeaths + d.casualDeaths)));
  $('#discovery_games').text(addSpaces(d.totalMatches - (d.rankedGames + d.casualGames)));
};
function updateGeneralCard(d) {
  $('#general_kd').text(roundTwo(d.totalKills / d.totalDeaths));
  $('#general_kills').text(addSpaces(d.totalKills));
  $('#general_deaths').text(addSpaces(d.totalDeaths));
  $('#general_assists').text(addSpaces(d.totalAssists));

  $('#general_wl').text(`${roundTwo(d.totalWins / (d.totalWins + d.totalLosses) * 100)}%`);
  $('#general_wins').text(addSpaces(d.totalWins));
  $('#general_losses').text(addSpaces(d.totalLosses));
  $('#general_matches').text(addSpaces(d.totalMatches));

  $('#general_headshots').text(addSpaces(d.totalHeadshots));
  $('#general_hs').text(`${roundTwo(d.hs)}%`);
  $('#general_dbnos').text(addSpaces(d.totalDBNOs));
  $('#general_suicides').text(addSpaces(d.totalSuicides));

  $('#general_melees').text(addSpaces(d.totalMeleeKills));
  $('#general_penetrations').text(addSpaces(d.totalPenetrationKills));
  $('#general_barricades').text(addSpaces(d.totalBarricades));
  $('#general_reinforcements').text(addSpaces(d.totalReinforcements));
};
function updateOperatorCard(d) {
  let ops = getTopTwoOperatorsFromEach(d);
  ops.forEach((op, i) => {
    $(`#operator_img_${i+1}`).attr('uk-tooltip', op.readable);
    $(`#operator_img_${i+1}`).attr('data-src', op.icon);
    $(`#operator_kd_${i+1}`).text(roundTwo(op.kills / op.deaths));
    $(`#operator_wl_${i+1}`).text(`${roundTwo(op.wins / (op.wins + op.losses) * 100)}%`);
    $(`#operator_playtime_${i+1}`).text(getOpPlaytime(op.time_played))
  });
};

function reduceNameLength(a, len=14){
  return a.length > (len) ? `${a.substr(0,len)}..` : a.substr(0,len)
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getSeasonColorRGB(s) {
  let x = {
    1: "#2e93b3",
    2: "#d0a344",
    3: "#47893b",
    4: "#bd1E2c",
    5: "#723093",
    6: "#0050b3",
    7: "#ca361c",
    8: "#006543",
    9: "#ffc113",
    10: "#949f39",
    11: "#81a0c1",
    12: "#aa854f",
    13: "#d2005a",
    14: "#304395",
    15: "#156309",
    16: "#089eb3",
    17: "#946a97",
    18: "#2b7f9b",
    19: "#6ca511",
    20: "#d14007",
    21: "#ac0000",
    22: "#009cbe",
  };
  return x[s] || "Wrong Code";
};
function getSeasonFromNumber(s) {
  let x = {
    1: "Black Ice",
    2: "Dust Line",
    3: "Skull Rain",
    4: "Red Crow",
    5: "Velvet Shell",
    6: "Operation Health",
    7: "Blood Orchid",
    8: "White Noise",
    9: "Chimera",
    10: "Para Bellum",
    11: "Grim Sky",
    12: "Wind Bastion",
    13: "Burnt Horizon",
    14: "Phantom Sight",
    15: "Ember Rise",
    16: "Shifting Tides",
    17: "Void Edge",
    18: "Steel Wave",
    19: "Shadow Legacy",
    20: "Neon Dawn",
    21: "Crimson Heist",
    22: "North Star",
  };
  return x[s] || "Wrong Code";
};
function getSeasonCodeFromNumber(s) {
  let x = {
    1: "Y1S1",
    2: "Y1S2",
    3: "Y1S3",
    4: "Y1S4",
    5: "Y2S1",
    6: "Y2S2",
    7: "Y2S3",
    8: "Y2S4",
    9: "Y3S1",
    10: "Y3S2",
    11: "Y3S3",
    12: "Y3S4",
    13: "Y4S1",
    14: "Y4S2",
    15: "Y4S3",
    16: "Y4S4",
    17: "Y5S1",
    18: "Y5S2",
    19: "Y5S3",
    20: "Y5S4",
    21: "Y6S1",
    22: "Y6S2",
    23: "Y6S3",
    24: "Y6S4",
    25: "Y7S1",
    26: "Y7S2",
    27: "Y7S3",
    28: "Y7S4",
  };
  return x[s] || "Wrong Code";
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

  let atk = orderBySubKey(o.atk, 'time_played');
  let def = orderBySubKey(o.def, 'time_played');

  return [atk[0], atk[1], def[0], def[1]]
};
function getOperatorRow(op) {
  let kd = op.deaths == 0 ? "0" : roundTwo(op.kills/op.deaths);
  let wl = (op.wins+op.losses) == 0 ? "0" : roundTwo(op.wins / (op.wins+op.losses) * 100);
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

  return `
    <tr>
      <td class="uk-text-center"> <img class="uk-preserve-width" data-src="${op.icon}" style="height: 6rem" uk-img /> </td>
      <td class="uk-text-middle uk-text-large uk-text-emphasis uk-visible@m cndrd-font-medium">${op.readable}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${kd*100}">${kdtd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${wl*100}">${wltd}</td>
      <td class="uk-text-center uk-text-middle" sorttable_customkey="${hs*100}">${hstd}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.dbnos)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@l cndrd-font-normal">${addSpaces(op.melees)}</td>
      <td class="uk-text-center uk-text-middle uk-text-large uk-text-emphasis uk-visible@m cndrd-font-normal" sorttable_customkey="op.time_played">${getOperatorPlaytime(op.time_played)}</td>
    </tr>`
};
function diff_minutes(dt2, dt1) {
  // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
function getTimeAndDateFromTimestamp(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  let year = a.getFullYear();
  let month = a.getMonth() + 1;
  let date = a.getDate();
  let hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  return `${hour}:${min}:${sec} / ${date}.${month}. ${year}`;
};


// Update button
let lastUpdateRef = firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`);
lastUpdateRef.once('value').then(snapshot => {
  let last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function() {
    let now = parseInt(Date.now()/1000);
    let diff = now - last_update;

    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`);

    if (diff >= 180) { $("#siegeManualUpdateButton").removeAttr("hidden"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on('value', snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});
function getUpdateTimeString(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;

  let msg = `${seconds} second${seconds == 1 ? '' : 's'}`;

  if (parseInt(minutes) != 0) {
    msg = `${minutes} minute${minutes == 1 ? '' : 's'} ${msg}`
  }
  if (parseInt(hours) != 0) {
    msg = `${hours} hour${hours == 1 ? '' : 's'} ${msg}`
  }

  return msg
};
