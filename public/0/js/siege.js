
let VERSION = 8;


var ranked = [];
var unranked = [];
var clown = 0;
var userDataRef = firebase.database().ref(`GameStats/R6Sv${VERSION}/main_data`);
userDataRef.once('value').then(snapshot => {

  snapshot.forEach(childSnapshot => {

    let cd = childSnapshot.val();

    if (cd.currentRank != 'Unranked'){ ranked.push(cd); }
    else { unranked.push(cd); }

  }); // snapshot.forEach()

  ranked.sort(function(a,b){return b.currentMMR - a.currentMMR})
  unranked.sort(function(a,b){return b.currentMMR - a.currentMMR})

  ranked.forEach(u => {
    $('#stats').append(getStatsRow(u, clown));
    $('#modals').append(getModalPfp(u));
    clown++;
  });
  unranked.forEach(u => {
    $('#stats').append(getStatsRow(u, clown, true));
    $('#modals').append(getModalPfp(u));
    clown++;
  });
}); // userDataRef.once()

let lastUpdateRef = firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`);
lastUpdateRef.once('value').then(snapshot => {

  let lu = new Date(snapshot.val()*1000);
  let now = new Date();

  $("#lastUpdated").text(diff_minutes(lu, now));

});

function diff_minutes(dt2, dt1) {
  // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getTopTwoOperators(d) {
  let o = d.operators;
  let atk = orderBySubKey(o.atk, 'time_played');
  let def = orderBySubKey(o.def, 'time_played');
  return [atk[0], def[0]]
};
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};
function getStatsRow(u, clown, unrank=false) {
  let tooltip = `data-toggle='tooltip' data-placement='top'`;
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let kd = unrank ? 0 : roundTwo(u.sKills / u.sDeaths);
  let wl = unrank ? 0 : roundTwo(u.sWins / (u.sWins + u.sLosses) * 100);
  let ptRAW = getPlaytime(u.totalPlaytime);
  let playtime = `${ptRAW[0]}h <span class='hidden-sm-and-down'>${ptRAW[1]}m <span class='font-size-12 text-muted'>${ptRAW[2]}s</span></span>`;
  let mmrChangeColor = u.lastMMRchange >= 0 ? ( u.lastMMRchange == 0 ? '--dm-muted-text-color' : '--success-color' ) : '--danger-color';
  let MMRchange = u.lastMMRchange == undefined ? '0' : u.lastMMRchange;
  let topOps = getTopTwoOperators(u);

  let a = `
  <tr class="font-weight-light">

    <style>
      #mmr${u.ubisoftID}::after {
        color: var(${mmrChangeColor}) !important;
        content: "${MMRchange}";
        display: flex;
        align-items: center;
        font-size: 1.0rem;
        margin-left: 0.5rem;
      }
      @media (max-width: 640px) { #mmr${u.ubisoftID}::after{content:none;} }
    </style>

    <td class='hidden-sm-and-down' sorttable_customkey='${clown}'>
      <a href="#${u.ubisoftID}-pfp">
        <img class='p' src="${pfpLink}">
      </a>
    </td>

    <td class='font-size-16'>
      <div class='d-flex flex-row justify-content-start align-items-center'>
        <a href='/r6?id=${u.ubisoftID}' class='text-secondary text-decoration-none d-block font-size-25 r6' role='button'>
          ${u.ubisoftUsername}
        </a>
        <span class="material-icons mi-18 text-muted ml-3 hidden-sm-and-down">open_in_new</span>
      </div>
    </td>

    <td class='text-center' ${tooltip} data-title='${u.currentRank}' sorttable_customkey='${u.currentMMR}'>
      <div class='d-flex justify-content-center align-items-center'>
        <img class='rank' src='${u.currentRankImage}' alt='${u.currentRank}' />
        <img class='maxRank ml-5 hidden-sm-and-down' src='${u.maxRankImage}' alt='${u.maxRank}' />
      </div>
    </td>

    <td class='text-center' ${tooltip} data-title='Max ${addSpaces(parseInt(u.maxMMR))}'>
      <div class='d-flex justify-content-center' id='mmr${u.ubisoftID}'>
        <div class='d-flex flex-column justify-content-center'>
          <span class='text-muted font-size-8'>${addSpaces(u.nextRankMMR)}</span>
          <span class='text-nowrap'>${addSpaces(parseInt(u.currentMMR))}</span>
          <span class='text-muted font-size-8'>${addSpaces(u.prevRankMMR)}</span>
        </div>
        <!--<div class='${mmrChangeColor} font-size-10 d-flex align-items-center ml-5'>${u.lastMMRchange}</div>-->
      </div>
    </td>

    <td class='text-center' ${tooltip} data-title='${u.sKills}/${u.sDeaths}'>
      ${kd}
    </td>

    <td class='text-center' ${tooltip} data-title='${u.sWins}/${u.sLosses}'>
      <div class='d-flex flex-column justify-content-center'>
        <span>${wl}%</span>
        <span class='text-muted font-size-10'>(${u.sWins+u.sLosses})</span>
      </div>
    </td>

    <td class='text-center hidden-sm-and-down'>
      ${u.alphapackProbability == undefined ? '0' : u.alphapackProbability/100}%
    </td>

    <td class='text-center hidden-sm-and-down'>
      ${u.sAbandons}
    </td>

    <td class='text-center hidden-sm-and-down'>
      <div class='d-flex flex-row justify-content-center align-items-center'>
        <img class='rank-icon' src='${topOps[0].icon}' />
        <img class='rank-icon' src='${topOps[1].icon}' />
      </div>
    </td>

    <td class='text-center hidden-sm-and-down' sorttable_customkey='${u.totalPlaytime}' ${tooltip} data-title='Ranked: ${getPlaytime(u.rankedPlaytime)[0]}h\nCasual: ${getPlaytime(u.casualPlaytime)[0]}h'>
      ${playtime}
    </td>

    <td class='text-center hidden-sm-and-down'>
      ${roundTwo(u.hs)}%
    </td>

  </tr>
  `
  return a
};

function getModalStats(u) {
  var mfs = 12; // Muted Font Size

  var ptRAW = getPlaytime(u.totalPlaytime)
  var playtime = `${ptRAW[0]}h <span class='hidden-sm-and-down'>${ptRAW[1]}m <span class='font-size-12 text-muted'>${ptRAW[2]}s</span></span>`
  var ptRankedRAW = getPlaytime(u.rankedPlaytime)
  var playtimeRanked = `${ptRankedRAW[0]}h <span class='hidden-sm-and-down'>${ptRankedRAW[1]}m <span class='font-size-12 text-muted'>${ptRankedRAW[2]}s</span></span>`
  var ptCasualRAW = getPlaytime(u.casualPlaytime)
  var playtimeCasual = `${ptCasualRAW[0]}h <span class='hidden-sm-and-down'>${ptCasualRAW[1]}m <span class='font-size-12 text-muted'>${ptCasualRAW[2]}s</span></span>`

  modal = `
    <!-- ${u.ubisoftID} / ${u.ubisoftUsername} Modals -->
    <div class="modal" id='${u.ubisoftID}' tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content w-three-quarter">
          <h4 class='modal-title m-0 p-0'><span class='text-success font-size-28'>${u.ubisoftUsername}</span>'s Siege stats</h4>

          <!-- Tables Flexbox start -->
          <div class='d-flex justify-content-center'>

            <!-- Total Stats Table start -->
            <div class='m-5'>
              <h5 class='m-5 text-center'>Total Stats</h5>
              <table class='table table-hover table-outer-bordered table-striped'>
                <thead>
                  <tr> <td class='text-right'>Stat</td><td>Value</td> </tr>
                </thead>
                <tbody class='font-weight-light'>
                  <tr> <td class='text-right'>Level</td> <td>${u.level}</td> </tr>
                  <tr> <td class='text-right'>Playtime</td> <td>${playtime}</td> </tr>
                  <tr> <td class='text-right'>K/D</td> <td>${roundTwo(u.totalKills / u.totalDeaths)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.totalKills)}/${addSpaces(u.totalDeaths)}</span></td> </tr>
                  <tr> <td class='text-right'>Headshot %</td> <td>${roundTwo(u.hs)}% <span class='text-muted font-size-${mfs}'>${addSpaces(u.totalHeadshots)}</span></td> </tr>
                  <tr> <td class='text-right'>Assists</td> <td>${addSpaces(u.totalAssists)}</td> </tr>
                  <tr> <td class='text-right'>Melees</td> <td>${addSpaces(u.totalMeleeKills)}</td> </tr>
                  <tr> <td class='text-right' data-toggle='tooltip' data-placement='top' data-title='Down But Not Out'>DBNOs</td> <td>${addSpaces(u.totalDBNOs)}</td> </tr>
                  <tr> <td class='text-right'>Reinforcements</td> <td>${addSpaces(u.totalReinforcements)}</td> </tr>
                  <tr> <td class='text-right'>Gadgets Destroyed</td> <td>${addSpaces(u.totalGadgetsDestroyed)}</td> </tr>
                  <tr> <td class='text-right'>Penetration Kills</td> <td>${addSpaces(u.totalPenetrationKills)}</td> </tr>
                  <tr> <td class='text-right'>Suicides</td> <td>${addSpaces(u.totalSuicides)}</td> </tr>
                </tbody>
              </table>
            </div><!-- Total Stats Table end -->

            <!-- Seasonal Stats Table start -->
            <div class='m-5'>
              <h5 class='m-5 text-center'>${u.seasonName} Stats</h5>
              <table class='table table-hover table-outer-bordered table-striped'>
                <thead>
                  <tr> <td class='text-right'>Stat</td><td>Value</td> </tr>
                </thead>
                <tbody class='font-weight-light'>
                  <tr> <td class='text-right'>Rank</td> <td>${u.currentRank}</td> </tr>
                  <tr> <td class='text-right'>MMR</td> <td><span class='text-muted font-size-8'>${addSpaces(u.prevRankMMR)}</span> <span class='my-5'>${addSpaces(u.currentMMR)}</span> <span class='text-muted font-size-8'>${addSpaces(u.nextRankMMR)}</span></td> </tr>
                  <tr> <td class='text-right'>K/D</td> <td>${roundTwo(u.sKills / u.sDeaths)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.sKills)}/${addSpaces(u.sDeaths)}</span></td> </tr>
                  <tr> <td class='text-right'>W/L</td> <td>${roundTwo(u.sWins / (u.sWins + u.sLosses) * 100)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.sWins)}/${addSpaces(u.sLosses)}</span></td> </tr>
                  <tr> <td class='text-right'>Abandons</td> <td>${addSpaces(u.sAbandons)}</td> </tr>
                </tbody>
              </table>
            </div><!-- Current Season Stats Table end -->

            <!-- Ranked Stats Table start -->
            <div class='m-5'>
              <h5 class='m-5 text-center'>Ranked Stats</h5>
              <table class='table table-hover table-outer-bordered table-striped'>
                <thead>
                  <tr> <td class='text-right'>Stat</td><td>Value</td> </tr>
                </thead>
                <tbody class='font-weight-light'>
                  <tr> <td class='text-right'>K/D</td> <td>${roundTwo(u.rankedKills / u.rankedDeaths)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.rankedKills)}/${addSpaces(u.rankedDeaths)}</span></td> </tr>
                  <tr> <td class='text-right'>W/L</td> <td>${roundTwo(u.rankedWins / (u.rankedWins + u.rankedLosses) * 100)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.rankedWins)}/${addSpaces(u.rankedLosses)}</span></td> </tr>
                  <tr> <td class='text-right'>Playtime</td> <td>${playtimeRanked}</td> </tr>
                </tbody>
              </table>
            </div><!-- Ranked Stats Table end -->

            <!-- Casual Stats Table start -->
            <div class='m-5'>
              <h5 class='m-5 text-center'>Casual Stats</h5>
              <table class='table table-hover table-outer-bordered table-striped'>
                <thead>
                  <tr> <td class='text-right'>Stat</td><td>Value</td> </tr>
                </thead>
                <tbody class='font-weight-light'>
                  <tr> <td class='text-right'>K/D</td> <td>${roundTwo(u.casualKills / u.casualDeaths)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.casualKills)}/${addSpaces(u.casualDeaths)}</span></td> </tr>
                  <tr> <td class='text-right'>W/L</td> <td>${roundTwo(u.casualWins / (u.casualWins + u.casualLosses) * 100)} <span class='text-muted font-size-${mfs}'>${addSpaces(u.casualWins)}/${addSpaces(u.casualLosses)}</span></td> </tr>
                  <tr> <td class='text-right'>Playtime</td> <td>${playtimeCasual}</td> </tr>
                </tbody>
              </table>
            </div><!-- Casual Stats Table end -->

          </div> <!-- Tables Flexbox end -->

        </div> <!-- modal-content end -->
      </div> <!-- modal-dialog end -->
    </div>
  `

  return modal
};
function getModalPfp(u) {
  let a = `
  <div class="modal" id="${u.ubisoftID}-pfp" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-content-media w-auto">
        <a href="#" class="close" role="button" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </a>
        <img src="https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png" class="img-fluid" alt="modal-img">
      </div>
    </div>
  </div>
  `
  return a
};

const operatorsJson = {
  "recruitfbi": {
    "name": "recruitfbi",
    "readable": "Recruit FBI SWAT",
    "atkdef": "recruit",
    "badgeLink": "https://i.imgur.com/Pd7krMT.png",
  },
  "smoke": {
    "name": "smoke",
    "readable": "Smoke",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/tkxDFWg.png",
  },
  "mute": {
    "name": "mute",
    "readable": "Mute",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/xJ6iqr1.png",
  },
  "sledge": {
    "name": "sledge",
    "readable": "Sledge",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/AKn1ULn.png",
  },
  "thatcher": {
    "name": "thatcher",
    "readable": "Thatcher",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/MYl1Gl2.png",
  },
  "castle": {
    "name": "castle",
    "readable": "Castle",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/Dr5x7e7.png",
  },
  "pulse": {
    "name": "pulse",
    "readable": "Pulse",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/y6hSeej.png",
  },
  "ash": {
    "name": "ash",
    "readable": "Ash",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/gXkH9Cl.png",
  },
  "thermite": {
    "name": "thermite",
    "readable": "Thermite",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/9uVh301.png",
  },
  "doc": {
    "name": "doc",
    "readable": "Doc",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/MzJAlf9.png",
  },
  "rook": {
    "name": "rook",
    "readable": "Rook",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/AZ2o09d.png",
  },
  "twitch": {
    "name": "twitch",
    "readable": "Twitch",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/OHZykQL.png",
  },
  "montagne": {
    "name": "montagne",
    "readable": "Montagne",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/p2gGMAo.png",
  },
  "kapkan": {
    "name": "kapkan",
    "readable": "Kapkan",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/LPhga5G.png",
  },
  "tachanka": {
    "name": "tachanka",
    "readable": "Tachanka",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/bRdSEI2.png",
  },
  "glaz": {
    "name": "glaz",
    "readable": "Glaz",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/Fdr50yV.png",
  },
  "fuze": {
    "name": "fuze",
    "readable": "Fuze",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/WpxoTw2.png",
  },
  "jager": {
    "name": "jager",
    "readable": "J\u00e4ger",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/ykglXiD.png",
  },
  "bandit": {
    "name": "bandit",
    "readable": "Bandit",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/iBdRyRn.png",
  },
  "blitz": {
    "name": "blitz",
    "readable": "Blitz",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/IhkK497.png",
  },
  "iq": {
    "name": "iq",
    "readable": "IQ",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/UtDoLtT.png",
  },
  "frost": {
    "name": "frost",
    "readable": "Frost",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/prGz6E6.png",
  },
  "buck": {
    "name": "buck",
    "readable": "Buck",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/nRSxJd2.png",
  },
  "valkyrie": {
    "name": "valkyrie",
    "readable": "Valkyrie",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/cG55PvJ.png",
  },
  "blackbeard": {
    "name": "blackbeard",
    "readable": "Blackbeard",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/h12akm4.png",
  },
  "caveira": {
    "name": "caveira",
    "readable": "Caveira",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/X8Wn7uP.png",
  },
  "capitao": {
    "name": "capitao",
    "readable": "Capit\u00e3o",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/Qvkut3P.png",
  },
  "echo": {
    "name": "echo",
    "readable": "Echo",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/JLXXREk.png",
  },
  "hibana": {
    "name": "hibana",
    "readable": "Hibana",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/ChqyReH.png",
  },
  "mira": {
    "name": "mira",
    "readable": "Mira",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/BXnayiP.png",
  },
  "jackal": {
    "name": "jackal",
    "readable": "Jackal",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/hvLklzC.png",
  },
  "lesion": {
    "name": "lesion",
    "readable": "Lesion",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/w3PjcvZ.png",
  },
  "ying": {
    "name": "ying",
    "readable": "Ying",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/wyJwvWZ.png",
  },
  "ela": {
    "name": "ela",
    "readable": "Ela",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/IRWSllb.png",
  },
  "zofia": {
    "name": "zofia",
    "readable": "Zofia",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/HRg8qXs.png",
  },
  "vigil": {
    "name": "vigil",
    "readable": "Vigil",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/vGg39cP.png",
  },
  "dokkaebi": {
    "name": "dokkaebi",
    "readable": "Dokkaebi",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/qYfoWsk.png",
  },
  "lion": {
    "name": "lion",
    "readable": "Lion",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/EgMlCaV.png",
  },
  "finka": {
    "name": "finka",
    "readable": "Finka",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/dhemeuU.png",
  },
  "maestro": {
    "name": "maestro",
    "readable": "Maestro",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/d0Zy3i4.png",
  },
  "alibi": {
    "name": "alibi",
    "readable": "Alibi",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/NXEI1ZN.png",
  },
  "clash": {
    "name": "clash",
    "readable": "Clash",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/EYGBED9.png",
  },
  "maverick": {
    "name": "maverick",
    "readable": "Maverick",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/hF2gJuY.png",
  },
  "kaid": {
    "name": "kaid",
    "readable": "Kaid",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/l6UPyA8.png",
  },
  "nomad": {
    "name": "nomad",
    "readable": "Nomad",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/U8sOErk.png",
  },
  "mozzie": {
    "name": "mozzie",
    "readable": "Mozzie",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/RHwnp7d.png",
  },
  "gridlock": {
    "name": "gridlock",
    "readable": "Gridlock",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/A95h9XN.png",
  },
  "warden": {
    "name": "warden",
    "readable": "Warden",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/OUhPdNj.png",
  },
  "nokk": {
    "name": "nokk",
    "readable": "N\u00f8kk",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/P0tYlx7.png",
  },
  "goyo": {
    "name": "goyo",
    "readable": "Goyo",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/s2AjbNb.png",
  },
  "amaru": {
    "name": "amaru",
    "readable": "Amaru",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/BL4ue5Y.png",
  },
  "wamai": {
    "name": "wamai",
    "readable": "Wamai",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/497uSOq.png",
  },
  "kali": {
    "name": "kali",
    "readable": "Kali",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/UH389qh.png",
  },
  "oryx": {
    "name": "oryx",
    "readable": "Oryx",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/vcUGkSs.png",
  },
  "iana": {
    "name": "iana",
    "readable": "Iana",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/fZbmkVz.png",
  },
  "melusi": {
    "name": "melusi",
    "readable": "Melusi",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/tlAhOmb.png",
  },
  "ace": {
    "name": "ace",
    "readable": "Ace",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/9C0j8iz.png",
  },
  "zero": {
    "name": "zero",
    "readable": "Zero",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/xWtzdxN.png",
  },
  "aruni": {
    "name": "aruni",
    "readable": "Aruni",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/uXBsnOg.png",
  },
  "flores": {
    "name": "flores",
    "readable": "Flores",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/EVJZq5H.png",
  }
}
