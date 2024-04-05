import { c, supabase, spinner, addSpaces, roundTwo, settings } from './main.js';



// Show stats
await showStats();

await settings('last_siege_update').then(data => {
    $("#lastUpdated").attr("aria-label", _getTimeString(data.value));
  
    setInterval(() => {
        let now = parseInt(Date.now() / 1000);
        $("#lastUpdated").text(_getUpdateTimeString(now - data.value));
    }, 1000);
});
function _getTimeString(ts) {
    let options = {
        year: "numeric", month: "long", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit",
        hour12: false,
    };
    return new Date(ts*1000).toLocaleDateString("en-US", options);
};
function _getUpdateTimeString(s) {
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



$(document).ready(function(){

    $.getJSON("https://game-status-api.ubisoft.com/v1/instances", data => {
        $.each(data, (key, val) => {
            if (val["AppID "] === "e3d5ea9e-50bd-43b7-88bf-39794f4e3d40") {
    
                if (val.Maintenance != null && val.Maintenance) {
                    return $("#siegePcStatus").replaceWith(`<span style="color: #faa05a;">Maintenance</span>`);
                }
        
                let color = val.Status == "Online" ? "#32d296" : "#f0506e";
                return $("#siegePcStatus").replaceWith(`<span style="color: ${color};">${val.Status}</span>`);
            }
        });
    });
  
});

async function showStats() {
    $('#stats').html(spinner());
    let table = '';
    let rows = '';

    const { data: siegeData } = await supabase.from('siege_stats').select('ubi_id, name, playtime, ranked');

    let orderedSiegeData = siegeData.sort((a, b) => b.ranked.rank_points - a.ranked.rank_points);

    orderedSiegeData.forEach(player => {
        let rank = player.ranked;
        let pfpLink = `https://ubisoft-avatars.akamaized.net/${player.ubi_id}/default_256_256.png`;

        let ptRAW = _getPlaytime(player.playtime.total);
        let playtime = `${ptRAW[0]}h <span>${ptRAW[1]}m ${ptRAW[2]}s</span>`;

        let kd = rank.deaths == 0 ? rank.kills : roundTwo(rank.kills / rank.deaths);
        let wl = rank.losses == 0 ? 0 : roundTwo(rank.wins / (rank.wins + rank.losses) * 100);
        let rankCell = _getRankCell(rank, player.playtime.level);

        rows += `
            <tr>
                <td class="hide-mobile">
                    <img style="height: 4rem;" src="${pfpLink}" />
                </td>
                <td class="name" style="min-width: 5rem;">
                    ${player.name}
                </td>
                <td>
                    ${rankCell}
                </td>
                <td class="hide-mobile">
                    <div>
                        <span style="font-size: 1.5rem;">${addSpaces(parseInt(rank.rank_points) % 100)}</span>
                    </div>
                    <div class="smol-dark">${addSpaces(rank.rank_points)}</div>
                </td>
                <td>
                    <div>${kd}</div>
                    <div class="smol-dark">${addSpaces(rank.kills)} / ${addSpaces(rank.deaths)}</div>
                </td>
                <td>
                    <div>${wl}%</div>
                    <div class="smol-dark">${addSpaces(rank.wins)} / ${addSpaces(rank.losses)}</div>
                </td>
                <td class="hide-mobile">
                    ${playtime}
                </td>
            </tr>
        `;
    });

    table = `
        <div id="above-table">
            <div class="left">
                <span>PC Server Status:</span>
                <span id="siegePcStatus">${spinner(true)}</span>
            </div>

            <div class="right">
                <div>
                    Last update: <span id="lastUpdated">${spinner(true)}</span> ago
                </div>
            </div>
        </div>

        <table id="siege-stats" class="sortable">
            <thead>
                <tr>
                    <th class="hide-mobile">🖼️</th>
                    <th>Peep</th>
                    <th>Rank (max)</th>
                    <th class="hide-mobile">MMR</th>
                    <th>K/D</th>
                    <th>W/L</th>
                    <th class="hide-mobile">Time Played</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    $('#stats').html(table);
};

function _getPlaytime(s) {
    let hours = Math.floor(s / 3600);
    s %= 3600;
    let minutes = Math.floor(s / 60);
    let seconds = s % 60;
    return [hours, minutes, seconds];
};
function _getRankCell(r, level) {
    if (level < 50) {
      return `<div class="rank-img-cell"> <span>level ${level}</span> </div>`;
    }
    return `
      <div class="rank-img-cell">
        <img style="height: 4rem;" src="${_getRankImageFromRankName(r.rank)}" />
        <img style="height: 3.5rem;" class="hide-mobile" src="${_getRankImageFromRankName(r.max_rank)}" />
      </div>
    `;
};
function _getRankImageFromRankName(name) {
    let rank_dict = {
      "unranked": "0OFVqkI",
      "undefined": "0OFVqkI",
  
      "copper 5": "Ux1rDjw",
      "copper 4": "7YWtMtV",
      "copper 3": "LrHvwNs",
      "copper 2": "IIBimaN",
      "copper 1": "oLZwkBa",
  
      "bronze 5": "aQNXHQR",
      "bronze 4": "UgKcPME",
      "bronze 3": "DgVk34E",
      "bronze 2": "xsJGsmE",
      "bronze 1": "ktm9OM0",
  
      "silver 5": "tinDJ0V",
      "silver 4": "DTfqnBz",
      "silver 3": "V6V5iyx",
      "silver 2": "Xfrp58b",
      "silver 1": "6HpERmx",
  
      "gold 5": "GtTe4bu",
      "gold 4": "4kpPsMS",
      "gold 3": "tnX9jpW",
      "gold 2": "uVjR5kD",
      "gold 1": "tJ3tVr2",
  
      "platinum 5": "WO3pfUp",
      "platinum 4": "6Mev2HS",
      "platinum 3": "wV52ySL",
      "platinum 2": "qd71ZiS",
      "platinum 1": "WU6vjNa",
  
      "emerald 5": "KXtH98u",
      "emerald 4": "YSaeYN6",
      "emerald 3": "itcnov9",
      "emerald 2": "eEYH4bl",
      "emerald 1": "8FQRvNX",
  
      "diamond 5": "ioGplDE",
      "diamond 4": "arhoFpA",
      "diamond 3": "RXAvoqX",
      "diamond 2": "3BuBrb1",
      "diamond 1": "miyZ9Yr",
  
      "champion": "fTA4VtR",
      "champions": "fTA4VtR",
    }
    return `https://i.imgur.com/${rank_dict[name.toLowerCase()]}.png`
};
