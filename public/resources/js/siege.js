$("table").stickyTableHeaders();

let VERSION = 9;
const rankMMR = [
  {name: "Copper 5",    min_mmr: 1,     max_mmr: 1199, image: "https://i.imgur.com/SNSfudP.png"},
  {name: "Copper 4",    min_mmr: 1200,  max_mmr: 1299, image: "https://i.imgur.com/7PiisA2.png"},
  {name: "Copper 3",    min_mmr: 1300,  max_mmr: 1399, image: "https://i.imgur.com/aNCvwAI.png"},
  {name: "Copper 2",    min_mmr: 1400,  max_mmr: 1499, image: "https://i.imgur.com/fUzUApd.png"},
  {name: "Copper 1",    min_mmr: 1500,  max_mmr: 1599, image: "https://i.imgur.com/eGuxE0k.png"},
  {name: "Bronze 5",    min_mmr: 1600,  max_mmr: 1699, image: "https://i.imgur.com/bbjMf4V.png"},
  {name: "Bronze 4",    min_mmr: 1700,  max_mmr: 1799, image: "https://i.imgur.com/75IEQkD.png"},
  {name: "Bronze 3",    min_mmr: 1800,  max_mmr: 1899, image: "https://i.imgur.com/GIt29R0.png"},
  {name: "Bronze 2",    min_mmr: 1900,  max_mmr: 1999, image: "https://i.imgur.com/sTIXKlh.png"},
  {name: "Bronze 1",    min_mmr: 2000,  max_mmr: 2099, image: "https://i.imgur.com/zKRDUdK.png"},
  {name: "Silver 5",    min_mmr: 2100,  max_mmr: 2199, image: "https://i.imgur.com/CbAbvOa.png"},
  {name: "Silver 4",    min_mmr: 2200,  max_mmr: 2299, image: "https://i.imgur.com/2Y8Yr11.png"},
  {name: "Silver 3",    min_mmr: 2300,  max_mmr: 2399, image: "https://i.imgur.com/zNUuJSn.png"},
  {name: "Silver 2",    min_mmr: 2400,  max_mmr: 2499, image: "https://i.imgur.com/utTa5mq.png"},
  {name: "Silver 1",    min_mmr: 2500,  max_mmr: 2599, image: "https://i.imgur.com/27ISr4q.png"},
  {name: "Gold 3",      min_mmr: 2600,  max_mmr: 2799, image: "https://i.imgur.com/JJvq35l.png"},
  {name: "Gold 2",      min_mmr: 2800,  max_mmr: 2999, image: "https://i.imgur.com/Fco8pIl.png"},
  {name: "Gold 1",      min_mmr: 3000,  max_mmr: 3199, image: "https://i.imgur.com/m8FFWGi.png"},
  {name: "Platinum 3",  min_mmr: 3200,  max_mmr: 3599, image: "https://i.imgur.com/GpEpkDs.png"},
  {name: "Platinum 2",  min_mmr: 3600,  max_mmr: 3999, image: "https://i.imgur.com/P8IO0Sn.png"},
  {name: "Platinum 1",  min_mmr: 4000,  max_mmr: 4399, image: "https://i.imgur.com/52Y4EVg.png"},
  {name: "Diamond",     min_mmr: 4400,  max_mmr: 4999, image: "https://i.imgur.com/HHPc5HQ.png"},
  {name: "Champion",   min_mmr: 5000,  max_mmr: 15000, image: "https://i.imgur.com/QHZFdUj.png"}
];

let ranked = [];
let unranked = [];
let clown = 0;
let userDataRef = firebase.database().ref(`GameStats/R6Sv${VERSION}/main_data`);
userDataRef.once("value").then(snapshot => {

  firebase.database().ref(`GameStats/R6Sv${VERSION}/mmr_watch`).once('value').then(mmrSnapshot => {
    let mmrWatch = mmrSnapshot.val();

    snapshot.forEach(childSnapshot => {
      let cd = childSnapshot.val();
      if (cd.currentRank != "Unranked"){ ranked.push(cd); } else { unranked.push(cd); }
    });

    ranked.sort(function(a,b){return b.currentMMR - a.currentMMR})
    unranked.sort(function(a,b){return b.currentMMR - a.currentMMR})

    ranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID])); $("#bnaom9s1BB").append(getPfpModal(u)); clown++; });
    unranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID], true)); $("#bnaom9s1BB").append(getPfpModal(u)); clown++; });
  });
});

let last_update;
let lastUpdateRef = firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`);
lastUpdateRef.once('value').then(snapshot => {
  last_update = snapshot.val();

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


function getPfpModal(u) {
  return `
  <div id="${createPfpModalRef(u.ubisoftID)}" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
      <button class="uk-modal-close-outside" type="button" uk-close></button>
      <img src="https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png" />
    </div>
  </div>`;
};
function getStatsRow(u, clown, mmrWatch, unrank=false) {
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let kd = u.sDeaths == 0 ? 0 : roundTwo(u.sKills / u.sDeaths);
  let wl = u.sDeaths == 0 ? 0 : roundTwo(u.sWins / (u.sWins + u.sLosses) * 100);
  let ptRAW = getPlaytime(u.totalPlaytime);
  let playtime = `${ptRAW[0]}h <span class="uk-visible@m">${ptRAW[1]}m <span class="uk-text-muted">${ptRAW[2]}s</span></span>`;
  let mmrChangeColor = u.lastMMRchange >= 0 ? ( u.lastMMRchange == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger';
  let mmrChange = u.lastMMRchange == undefined ? '0' : u.lastMMRchange;
  let prevMMR = u.prevRankMMR == 0 ? getPrevRankMMR(u.currentMMR) : u.prevRankMMR;
  let nextMMR = u.nextRankMMR == 0 ? getNextRankMMR(u.currentMMR) : u.nextRankMMR;
  let topOps = getTopTwoOperators(u);
  let rankCell = getRankCell(u, unrank);
  let mmrWatchChangeColor = "";

  if (mmrWatch.adjustment) {
    mmrWatchChangeColor = `color: #faa05a !important`;
    mmrChangeColor = mmrWatch.adjustment_value >= 0 ? ( mmrWatch.adjustment_value == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger';
    mmrChange = mmrWatch.adjustment_value == undefined ? '0' : mmrWatch.adjustment_value;
  };


  let a = `
    <tr>
      <td class="uk-visible@m uk-text-middle uk-text-center" sorttable_customkey="${clown}">
        <a href="#${createPfpModalRef(u.ubisoftID)}" uk-toggle>
          <img style="height: 4rem;" class="uk-preserve-width" src="${pfpLink}" />
        </a>
      </td>

      <td class="uk-text-middle" style="min-width: 5rem;" sorttable_customkey="${u.currentMMR}">
        <a href="/r6?id=${u.ubisoftID}">
          ${u.ubisoftUsername}<span class="uk-visible@m" uk-icon="link"></span>
        </a>
      </td>

      <td class="uk-text-middle uk-text-center uk-padding-remove-horizontal">
        ${rankCell}
      </td>

      <td uk-tooltip="Max ${addSpaces(parseInt(u.maxMMR))}">
        <div class="uk-flex uk-flex-row uk-flex-center uk-text-center">
          <span style="font-size: 0.8rem;" class='uk-text-muted'>${prevMMR}</span>
          <span uk-icon="arrow-right"></span>
          <span style="font-size: 0.8rem;" class='uk-text-muted'>${nextMMR}</span>
        </div>
        <div class="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
          <span class="uk-text-nowrap uk-text-emphasis" style="font-size: 1.5rem; ${mmrWatchChangeColor}">${addSpaces(parseInt(u.currentMMR))}</span>
          <span class="${mmrChangeColor} uk-text-small">${mmrChange}</span>
        </div>
      </td>

      <td class="uk-text-middle uk-text-center uk-text-emphasis" uk-tooltip="${u.sKills} / ${u.sDeaths}">
        ${kd}
      </td>

      <td class="uk-text-middle uk-text-center uk-text-emphasis" uk-tooltip="${u.sWins} / ${u.sLosses}<br/>${u.sWins+u.sLosses} total">
        ${wl}%
      </td>

      <td class="uk-text-middle uk-text-center uk-text-emphasis uk-visible@m">
        ${u.alphapackProbability == undefined ? "0" : u.alphapackProbability/100}%
      </td>

      <td class="uk-text-middle uk-text-center uk-visible@m">
        <div class="uk-flex uk-flex-row uk-flex-middle">
          <img style="height: 4rem;" src="${topOps[0].icon}" />
          <img style="height: 4rem;" src="${topOps[1].icon}" />
        </div>
      </td>

      <td class="uk-text-middle uk-text-center uk-text-emphasis uk-visible@m" sorttable_customkey="${u.totalPlaytime}">
        ${playtime}
      </td>

      <td class="uk-text-middle uk-text-center uk-text-emphasis uk-visible@m">
        ${roundTwo(u.hs)}%
      </td>

    </tr>`;
  return a
};

function createPfpModalRef(uID) {
  return `bnaom9s1BB_${uID}`.replaceAll("-","_");
};
function getRankCell(u, unrank=false) {
  let rankedCell = `
    <img style="height: 4rem;" class="uk-preserve-width" src="${u.currentRankImage}" uk-tooltip="${u.currentRank}" />
    <img style="height: 3.5rem;" class="uk-preserve-width uk-visible@m uk-margin-small-left" src="${u.maxRankImage}" uk-tooltip="${u.maxRank}" />
  `;
  let unrankedCell = `
    <div class="uk-inline">
      <img style="height: 3.5rem;" class="uk-preserve-width uk-margin-small-left"
      src="${getRankImageFromMMR(u.currentMMR)}" uk-tooltip="${getRankFromMMR(u.currentMMR)}" />
      <div class="uk-overlay uk-position-right">
        <span class="uk-badge">U</span>
      </div>
    </div>
  `;
  if (unrank) { return unrankedCell }
  else { return rankedCell }
};

function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getTopTwoOperators(d) {
  let o = d.operators;
  //let atk = orderBySubKey(o.atk, "time_played");
  //let def = orderBySubKey(o.def, "time_played");
  return [o.atk1, o.def1]
};
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};
function getRankFromMMR(mmr) {
  let x = "Wrong MMR";
  rankMMR.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.name;
    }
  });
  return x
};
function getRankImageFromMMR(mmr) {
  let x = "https://i.imgur.com/RpPdtbU.png";
  rankMMR.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) {
      x = r.image;
    }
  });
  return x
};
function getPrevRankMMR(mmr) {
  let x = 0;
  rankMMR.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) { x = r.min_mmr; }
  });
  return x
};
function getNextRankMMR(mmr) {
  let x = 0;
  rankMMR.forEach(r => {
    if (r.min_mmr <= mmr && mmr <= r.max_mmr) { x = r.max_mmr+1; }
  });
  return x
};


$('#siegeManualUpdateButton').click(function () {
  firebase.database().ref("GameStats/updateRequests/R6S").set(parseInt(Date.now()/1000));
  UIkit.notification({
    message: `Request to update the stats has been sent! The page will reload once the stats are ready.`,
    pos: 'top-right', timeout: 7500
  });
});
