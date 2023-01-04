let ver = new URLSearchParams(window.location.search).get("ver");
let VERSION = ver == undefined ? 13 : ver;

let RANKED_LEVEL_TRESHOLD = 50;


let ranked = [];
let unranked = [];

firebase.database().ref(`GameStats/R6Sv${VERSION}`).once("value").then(snapshot => {
  console.log(snapshot.val());

  // order by ranked.rank_points
  snapshot.forEach(child => {
    let cd = child.val();
    cd.ubisoftID = child.key;

    if (cd.playtime.level < RANKED_LEVEL_TRESHOLD) {
      unranked.push(cd);
    } else {
      ranked.push(cd);
    }

  });

  ranked.sort(function(a,b){return b.ranked.rank_points - a.ranked.rank_points});
  unranked.sort(function(a,b){return b.playtime.level - a.playtime.level});

  ranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u)); });
  unranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, true)); });

});


firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).once("value").then(snapshot => {
  last_update = snapshot.val();
  
  $("#lastUpdated").attr("aria-label", getTimeString(last_update));

  firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`).on("value", snapshot => {
    if (snapshot.val() != last_update) { location.reload(); }
  });

});

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

function getStatsRow(u, unrank=false) {
  let rank = u.ranked;
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let ptRAW = getPlaytime(u.playtime.total);
  let playtime = `${ptRAW[0]}h <span class="hidden-mobile">${ptRAW[1]}m ${ptRAW[2]}s</span>`;

  let kd = rank.deaths == 0 ? rank.kills : roundTwo(rank.kills / rank.deaths);
  let wl = rank.losses == 0 ? 0 : roundTwo(rank.wins / (rank.wins + rank.losses) * 100);
  let rankCell = getRankCell(rank, unrank, u.playtime.level);

  return `
    <tr>
      <td class="hidden-mobile">
        <img style="height: 4rem;" src="${pfpLink}" />
      </td>
      <td class="name" style="min-width: 5rem;" sorttable_customkey="${u.mmr}">
        <!--
        <a href="/siege_player?id=${u.ubisoftID}">
          ${u.name}
        </a>
        -->
        ${u.name}
      </td>
      <td>
        ${rankCell}
      </td>
      <td class="hidden-mobile">
        <div>
          <span style="font-size: 1.5rem;">${addSpaces(parseInt(rank.rank_points) % 100)}</span>
        </div>
        <div>
          <span style="font-size: 0.8rem; color: #888;">${rank.rank_points === 1000 ? '' : addSpaces(rank.rank_points)}</span>
        </div>
      </td>
      <td>
        <span style="cursor: pointer;" class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(rank.kills)} / ${addSpaces(rank.deaths)}">
          ${kd}
        </span>
      </td>
      <td>
        <span style="cursor: pointer;" class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(rank.wins)} / ${addSpaces(rank.losses)}">
          ${wl}%
        </span>
      </td>
      <td class="hidden-mobile" sorttable_customkey="${u.playtime.total}">
        <span style="cursor: pointer;" class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.playtime.total)} seconds">
          ${playtime}
        </span>
      </td>
    </tr>
  `;
};

function getRankCell(r, unrank=false, level) {
  if (level < RANKED_LEVEL_TRESHOLD) {
    return `<div class="rank-img-cell"> <span>level ${level}</span> </div>`;
  }
  if (unrank) {
    return `
      <div class="rank-img-cell">
        <img class="hidden-mobile" style="height: 3.5rem;" src="${getRankImageFromMMR(r.rank_points, r.season_id)}" />
        <span>${r.wins+r.losses} / 10</span>
      </div>
    `;
  }
  return `
    <div class="rank-img-cell">
      <img style="height: 4rem;" src="${getRankImageFromMMR(r.rank_points, r.season_id)}" />
      <img style="height: 3.5rem;" class="hidden-mobile" src="${getRankImageFromMMR(r.max_rank_points, r.season_id)}" />
    </div>
  `;
};

function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};

function getTimeString(ts) {
  let options = {
    year: "numeric", month: "long", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  };
  return new Date(ts*1000).toLocaleDateString("en-US", options);
};

$(document).ready(function(){

  $.getJSON("https://game-status-api.ubisoft.com/v1/instances", data => {
    $.each(data, (key, val) => {
      if (val["AppID "] === "e3d5ea9e-50bd-43b7-88bf-39794f4e3d40") {

        let hoverText = "";

        if (val.ImpactedFeatures.length > 0) {
          hoverText = val.ImpactedFeatures.join(", ");
          hoverText = `class='hint--top hint--rounded hint--no-arrow' aria-label='Impacted: ${hoverText}'`;
        }

        if (val.Maintenance != null && val.Maintenance) {
          return $("#siegePcStatus").replaceWith(`<span style="color: var(--w-away); ${hoverText ? 'cursor: help;' : ''}" ${hoverText}>Maintenance</span>`);
        }

        let color = val.Status == "Online" ? "--w-online" : "--w-dnd";
        return $("#siegePcStatus").replaceWith(`<span style="color: var(${color}); ${hoverText ? 'cursor: help;' : ''}" ${hoverText}>${val.Status}</span>`);

      }
    });
  });

});
