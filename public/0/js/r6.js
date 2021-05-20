let id = new URLSearchParams(window.location.search).get('id');

let userRef = firebase.database().ref(`GameStats/R6Sv8/all_data/${id}`);
userRef.once('value').then(snapshot => {
  let d = snapshot.val();

  updateHeader(d);

  overallPage(d);
  operatorsPage(d);

  removeLoader();

});

function overallPage(d) {
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
function mapsPage(d) {

  let all = d.maps.all.all;
  let cas = d.maps.casual.all;
  let ran = d.maps.ranked.all;
  let unr = d.maps.unranked.all;

  all.sort(function(a,b){return b.winLossRatio-a.winLossRatio });
  cas.sort(function(a,b){return b.winLossRatio-a.winLossRatio });
  ran.sort(function(a,b){return b.winLossRatio-a.winLossRatio });
  unr.sort(function(a,b){return b.winLossRatio-a.winLossRatio });

  all.forEach(map => { $('#all-maps').append(getMapRow(map)); });
  cas.forEach(map => { $('#casual-maps').append(getMapRow(map)); });
  ran.forEach(map => { $('#ranked-maps').append(getMapRow(map)); });
  unr.forEach(map => { $('#unranked-maps').append(getMapRow(map)); });

};




function removeLoader() {
  $('.loader').fadeOut('slow','swing');
};

function playtimeFromMinutes(m) {
  hours = Math.floor(m / 60);
  minutes = m % 60;
  return `${hours}h <span class="text-muted font-size-18">${minutes}m</span>`
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
function getOperatorPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  return `${hours}h <span class="font-size-15 text-muted">${minutes}m</span>`
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getTopTwoOperatorsFromEach(d) {
  let o = d.operators;

  let atk = orderBySubKey(o.atk, 'time_played');
  let def = orderBySubKey(o.def, 'time_played');

  return [atk[0], atk[1], def[0], def[1]]
};

/* overallPage */
function updateHeader(d) {
  $('#profile_picture').attr('src', `https://ubisoft-avatars.akamaized.net/${d.ubisoftID}/default_256_256.png`);
  $('#username').text(d.ubisoftUsername);
  document.title = `${d.ubisoftUsername}'s Rainbow Six: Siege Stats'`;
  $('#level').text(d.level);
  $('#alpha_pack').text(`${roundTwo(d.alphapackProbability/100)}%`);

  $('#r6stats').attr('href',`https://r6stats.com/stats/${d.ubisoftID}`);
  $('#tab').attr('href',`https://tabstats.com/siege/player/${d.ubisoftID}`);
  $('#trn').attr('href',`https://r6.tracker.network/profile/id/${d.ubisoftID}`);
};
function updateSeasonalCard(d) {

  $('#season_name').text(d.seasonName);

  $('#next_rank_mmr').text(addSpaces(parseInt(d.nextRankMMR)));
  $('#prev_rank_mmr').text(addSpaces(parseInt(d.prevRankMMR)));

  $('#current_rank_mmr').text(addSpaces(parseInt(d.currentMMR)));
  $('#current_rank_name').text(d.currentRank);
  $('#current_rank_img').attr('src', d.currentRankImage);

  $('#last_mmr_change').text(d.lastMMRchange);
  $('#last_mmr_change').addClass(d.lastMMRchange > 0 ? 'text-success' : 'text-danger');

  $('#seasonal_kd').text(roundTwo(d.sKills / d.sDeaths));
  $('#seasonal_wl').text(`${roundTwo(d.sWins / (d.sWins + d.sLosses) * 100)}%`);
  $('#seasonal_games').text(addSpaces(d.sWins + d.sLosses));

  $('#max_mmr').text(`${addSpaces(parseInt(d.maxMMR))} MMR`);
  $('#max_mmr_name').text(d.maxRank);
  $('#max_rank_img').attr('src', d.maxRankImage);


  // _casual
  $('#next_rank_mmr_casual').text(addSpaces(parseInt(d.nextRankMMRcasual+1)));
  $('#prev_rank_mmr_casual').text(addSpaces(parseInt(d.prevRankMMRcasual)));

  $('#current_rank_mmr_casual').text(addSpaces(parseInt(d.currentMMRcasual)));
  $('#current_rank_name_casual').text(d.currentRankCasual);
  $('#current_rank_img_casual').attr('src', d.currentRankImageCasual);

  $('#last_mmr_change_casual').text(d.lastMMRchangeCasual);
  $('#last_mmr_change_casual').addClass(d.lastMMRchangeCasual > 0 ? 'text-success' : 'text-danger');

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
    $(`#operator_name_${i+1}`).attr('data-title', op.readable);
    $(`#operator_img_${i+1}`).attr('src', op.icon);
    $(`#operator_kd_${i+1}`).text(roundTwo(op.kills / op.deaths));
    $(`#operator_wl_${i+1}`).text(`${roundTwo(op.wins / (op.wins + op.losses) * 100)}%`);
    $(`#operator_playtime_${i+1}`).text(getOpPlaytime(op.time_played))
  });
};

/* operatorsPage */
function getOperatorRow(op) {
  let kd = op.deaths == 0 ? "0" : roundTwo(op.kills/op.deaths);
  let wl = (op.wins+op.losses) == 0 ? "0" : roundTwo(op.wins / (op.wins+op.losses) * 100);
  let hs = op.kills == 0 ? "0" : roundTwo((op.headshots / op.kills) * 100);

  let kdtd = `
    <div class="d-flex flex-row flex-nowrap justify-content-center align-items-center">
      <div class="font-size-25">${kd}</div>
      <div class="d-flex flex-column flex-nowrap hidden-sm-and-down text-muted font-size-15 font-weight-light ml-10">
        <span class="border-bottom text-nowrap">${addSpaces(op.kills)} K</span>
        <span class="text-nowrap">${addSpaces(op.deaths)} D</span>
      </div>
    </div>`;
  let wltd = `
    <div class="d-flex flex-row flex-nowrap justify-content-center align-items-center">
      <div class="font-size-25">${wl}%</div>
      <div class="d-flex flex-column flex-nowrap hidden-sm-and-down text-muted font-size-15 font-weight-light ml-10">
        <span class="border-bottom text-nowrap">${addSpaces(op.wins)} W</span>
        <span class="text-nowrap">${addSpaces(op.losses)} L</span>
      </div>
    </div>`;
  let hstd = `
    <div class="d-flex flex-column flex-nowrap justify-content-center align-items-center">
      <div class="border-bottom">${hs}%</div>
      <div class="text-muted font-weight-light font-size-19 text-nowrap">${addSpaces(op.headshots)}</div>
    </div>`;

  return `
    <tr>
      <td class="text-center p-0 m-0"> <img src="${op.icon}" style="width:6rem; padding:0;" /> </td>
      <td class="font-size-25 hidden-sm-and-down">${op.readable}</td>
      <td class="font-size-20 text-center" sorttable_customkey="${kd*100}">${kdtd}</td>
      <td class="font-size-20 text-center" sorttable_customkey="${wl*100}">${wltd}</td>
      <td class="font-size-20 text-center" sorttable_customkey="${hs*100}">${hstd}</td>
      <td class="font-size-20 text-center hidden-lg-and-down">${addSpaces(op.dbnos)}</td>
      <td class="font-size-20 text-center hidden-lg-and-down">${addSpaces(op.melees)}</td>
      <td class="font-size-20 text-center hidden-sm-and-down">${getOperatorPlaytime(op.time_played)}</td>
    </tr>`
};
function orderBySubKey(dict, key) {
  return Object.values(dict).map(value => value).sort((a,b) => b[key] - a[key]);
};

/* mapsPage */
function getMapRow(m) {

  return `
  <div class="card w-full mx-0 my-5 p-0 d-flex flex-column flex-md-row">
    <img class="m-0 p-0 h-full w-375 object-cover" src="${m.mapImage}" alt="${m.mapName}" />

    <div class="m-0 w-full row font-size-30">
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">KD</span>
        <span>${roundTwo(m.killDeathRatio)}</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">WL</span>
        <span>${roundTwo(m.winLossRatio)}%</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">HS%</span>
        <span>${roundTwo(m.headshotAccuracy)}%</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">Playtime</span>
        <span>${playtimeFromMinutes(m.minutesPlayed)}</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center" data-toggle='tooltip' data-title='Kills Per Round'>
        <span class="border-bottom text-muted font-size-22">KPR</span>
        <span>${roundTwo(m.killsPerRound)}</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">Team Kills</span>
        <span>${addSpaces(m.teamKills)}</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center" data-toggle='tooltip' data-title='${m.matchesPlayed} matches'>
        <span class="border-bottom text-muted font-size-22">Rounds Played</span>
        <span>${addSpaces(m.roundsPlayed)}</span>
      </div>
      <div class="col-3 d-flex flex-column justify-content-center align-items-center">
        <span class="border-bottom text-muted font-size-22">Trades</span>
        <span>${addSpaces(m.trades)}</span>
      </div>
    </div>

  </div>
  `

};


/* Selectors */
function omegakokot(a) {
  function makeVisible(c) {
    $(`#${c}`).addClass('btn-primary');
    $(`#${c}Card`).removeClass('d-none');
  };
  function makeInvisible(c) {
    $(`#${c}`).removeClass('btn-primary');
    $(`#${c}Card`).addClass('d-none');
  };

  switch (a) {
    case 'casual':
      makeVisible('casual');
      makeInvisible('ranked');
      break;
    case 'ranked':
      makeVisible('ranked');
      makeInvisible('casual');
      break;
  }
};
function bigSelect(a) {
  let show = xd => { $(`#${xd}`).addClass('r6-active'); $(`#${xd}-div`).removeClass('d-none'); };
  let hide = xd => { $(`#${xd}`).removeClass('r6-active'); $(`#${xd}-div`).addClass('d-none'); };

  let mapH = () => { $(`#maps-switcher`).addClass('d-none').removeClass('d-flex'); }
  let mapS = () => { $(`#maps-switcher`).removeClass('d-none').addClass('d-flex'); }

  switch (a) {
    case 'overall':
      show(a);
      hide('operators');
      hide('maps');
      mapH();
      break;
    case 'operators':
      show(a);
      hide('overall');
      hide('maps');
      mapH();
      break;
    case 'maps':
      show(a);
      hide('overall');
      hide('operators');
      mapS();
      break;
  };
};
function mapSelect(a) {
  let show = xd => { $(`#${xd}-map`).addClass('r6-active'); $(`#${xd}-maps`).removeClass('d-none').addClass('d-flex'); };
  let hide = xd => { $(`#${xd}-map`).removeClass('r6-active'); $(`#${xd}-maps`).addClass('d-none').removeClass('d-flex'); };

  switch (a) {
    case 'all':
      show(a);
      hide('ranked');
      hide('unranked');
      hide('casual');
      break;
    case 'ranked':
      show(a);
      hide('all');
      hide('unranked');
      hide('casual');
      break;
    case 'unranked':
      show(a);
      hide('all');
      hide('ranked');
      hide('casual');
      break;
    case 'casual':
      show(a);
      hide('all');
      hide('ranked');
      hide('unranked');
      break;
  };

};
