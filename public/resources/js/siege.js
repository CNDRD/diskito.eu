
let VERSION = 11;


let ranked = [];
let unranked = [];
let clown = 0;
firebase.database().ref(`GameStats/R6Sv${VERSION}/main_data`).once("value").then(snapshot => {
  firebase.database().ref(`GameStats/R6Sv${VERSION}/mmr_watch`).once("value").then(mmrSnapshot => {
    let mmrWatch = mmrSnapshot.val();

    snapshot.forEach(childSnapshot => {
      let cd = childSnapshot.val();
      if (cd.ranked.max_mmr !== -1){ ranked.push(cd); } else { unranked.push(cd); }
    });

    ranked.sort(function(a,b){return b.currentMMR - a.currentMMR})
    unranked.sort(function(a,b){return b.currentMMR - a.currentMMR})

    ranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID])); });
    unranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, mmrWatch[u.ubisoftID], true)); });
  });
});

firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function() {
    let now = parseInt(Date.now()/1000);
    let diff = now - last_update;

    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`);

    if (diff >= 180) { $("#siegeManualUpdateButton").removeAttr("hidden"); }
  }, 1000);

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on("value", snapshot => {
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


function getStatsRow(u, clown, mmrWatch, unrank=false) {
  let rank = u.ranked;
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let ptRAW = getPlaytime(u.totalPlaytime);
  let playtime = `${ptRAW[0]}h <span class="hidden-mobile">${ptRAW[1]}m ${ptRAW[2]}s</span>`;

  let kd = rank.deaths == 0 ? rank.kills : roundTwo(rank.kills / rank.deaths);
  let wl = rank.losses == 0 ? 0 : roundTwo(rank.wins / (rank.wins + rank.losses) * 100);
  let mmrChangeColor = rank.last_mmr_change >= 0 ? ( rank.last_mmr_change == 0 ? "" : "color: var(--w-online)" ) : "color: var(--w-dnd)";
  let mmrChange = rank.last_mmr_change == undefined ? '0' : rank.last_mmr_change;
  let prevMMR = getPrevRankMMR(rank.mmr);
  let nextMMR = getNextRankMMR(rank.mmr);
  let rankCell = getRankCell(rank, unrank);
  let mmrWatchChangeColor = "";

  if (mmrWatch.adjustment) {
    mmrWatchChangeColor = `color: #faa05a !important`;
    mmrChangeColor = mmrWatch.adjustment_value >= 0 ? ( mmrWatch.adjustment_value == 0 ? "" : "color: var(--w-online)" ) : "color: var(--w-dnd)";
    mmrChange = mmrWatch.adjustment_value == undefined ? '0' : mmrWatch.adjustment_value;
  };


  let a = `
    <tr>
      <td class="hidden-mobile" sorttable_customkey="${clown}">
        <img style="height: 4rem;" src="${pfpLink}" />
      </td>
      <td class="name" style="min-width: 5rem;" sorttable_customkey="${u.mmr}">
        <a href="/siege_player?id=${u.ubisoftID}">
          ${u.ubisoftUsername}
        </a>
      </td>
      <td>
        ${rankCell}
      </td>
      <td class="hidden-mobile">
        <div>
          <span style="font-size: 0.8rem;">${prevMMR}</span>
          <span>👉</span>
          <span style="font-size: 0.8rem;">${nextMMR}</span>
        </div>
        <div>
          <span style="font-size: 1.5rem; ${mmrWatchChangeColor}">${addSpaces(parseInt(rank.mmr))}</span>
          <span style="${mmrChangeColor}">${mmrChange}</span>
        </div>
      </td>
      <td>
        ${kd}
      </td>
      <td>
        ${wl}%
      </td>
      <td class="hidden-mobile">
        <div class="uk-flex uk-flex-row uk-flex-middle">
          <img style="height: 4rem;" src="${u.operators.atk.icon_url}" />
          <img style="height: 4rem;" src="${u.operators.def.icon_url}" />
        </div>
      </td>
      <td class="hidden-mobile" sorttable_customkey="${u.totalPlaytime}">
        ${playtime}
      </td>
    </tr>`;
  return a
};

function getRankCell(r, unrank=false) {
  let rankedCell = `
    <div class="rank-img-cell">
      <img style="height: 4rem;" src="${getRankImageFromMMR(r.mmr)}" />
      <img style="height: 3.5rem;" class="hidden-mobile" src="${getRankImageFromMMR(r.max_mmr)}" />
    </div>
  `;
  let unrankedCell = `
    <div class="rank-img-cell">
      <img class="hidden-mobile" style="height: 3.5rem;" src="${getRankImageFromMMR(r.currentMMR)}" />
      <span>${r.wins+r.losses} / 10</span>
    </div>
  `;
  if (unrank) { return unrankedCell }
  else { return rankedCell }
};

function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};

$(document).ready(function(){
  let requested = 0;
  let updateText = "⏰ Please wait, updating..";

  $("#siegeManualUpdateButton").click(() => {

    $.each( $("#siegeManualUpdateButton").attr("class").split(/\s+/) , (index, item) => {
      if (item === "requested") { requested += 1; }
    });

    switch (requested) {
      case 0:
        $("#siegeManualUpdateButton").addClass("requested");
        firebase.database().ref("GameStats/updateRequests/R6S").set(parseInt(Date.now()/1000));
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

});
