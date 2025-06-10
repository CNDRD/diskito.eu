import { c, supabase, spinner, addSpaces, roundTwo, settings } from './main.js';



// Show stats
await showStats();

await settings('last_siege_update').then(data => {
    $("#lastUpdated")
        .attr("aria-label", _getTimeString(data.value))
        .text(_getUpdateTimeString(parseInt(Date.now() / 1000) - data.value));

    setInterval(() => {
        let now = parseInt(Date.now() / 1000);
        $("#lastUpdated").text(_getUpdateTimeString(now - data.value));
    }, 1000 * 60); // update every minute
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
    if (s < 60) { return `less than a minute`; }

    let hours = Math.floor(s / 3600);
    s %= 3600;
    let minutes = Math.floor(s / 60);

    let msg = "";
    
    if (parseInt(minutes) != 0) {
        msg = `${minutes} minute${minutes == 1 ? "" : "s"} ${msg}`
    }
    if (parseInt(hours) != 0) {
        msg = `${hours} hour${hours == 1 ? "" : "s"} ${msg}`
    }

    return msg
};



async function showStats() {
    $('#stats').html(spinner());
    let table = '';
    let rows = '';

    const { data: siegeData } = await supabase.from('siege_stats').select('*');

    let orderedSiegeData = siegeData.sort((a, b) => b.ranked.rank_points - a.ranked.rank_points);

    // rank_points can be all the same, in that case sort by kills
    orderedSiegeData.sort((a, b) => {
        if (a.ranked.rank_points === b.ranked.rank_points) {
            return b.ranked.kills - a.ranked.kills;
        }
        return b.ranked.rank_points - a.ranked.rank_points;
    });

    orderedSiegeData.forEach(player => {
        c(player);
        let rank = player.ranked;
        let pfpLink = `https://ubisoft-avatars.akamaized.net/${player.ubi_id}/default_256_256.png`;

        let ptRAW = _getPlaytime(player.playtime.total);
        let playtime = `${ptRAW[0]}h <span>${ptRAW[1]}m ${ptRAW[2]}s</span>`;

        let kd = rank.deaths == 0 ? rank.kills : roundTwo(rank.kills / rank.deaths);
        let wl = rank.losses == 0 ? 0 : roundTwo(rank.wins / (rank.wins + rank.losses) * 100);
        let rankCell = _getRankCell(rank, player.playtime.level);



        let df = player.dual_front;
        let df_kd = df.deaths == 0 ? df.kills : roundTwo(df.kills / df.deaths);
        let df_wl = df.losses == 0 ? 0 : roundTwo(df.wins / (df.wins + df.losses) * 100);

        rows += `
            <tr>
                <td data-what="pfp">
                    <img src="${pfpLink}" />
                </td>
                <td data-what="name" style="min-width: 5rem;">
                    <div>
                        <span class="name">${player.name}</span>
                        ${player.persona ? `<span class="persona">${player.persona}</span>` : ''}
                    </div>
                </td>

                <td data-mode="ranked" data-what="rank_images">
                    ${rankCell}
                </td>
                <td data-mode="ranked" data-what="rank_points">
                    <div>
                        <span style="font-size: 1.5rem;">${addSpaces(parseInt(rank.rank_points) % 100)}</span>
                    </div>
                    <div class="smol-dark">${addSpaces(rank.rank_points)}</div>
                </td>
                <td data-mode="ranked" data-what="ranked_kd">
                    <div>${kd}</div>
                    <div class="smol-dark">${addSpaces(rank.kills)} / ${addSpaces(rank.deaths)}</div>
                    <div class="smol-dark">${addSpaces(rank.kills + rank.deaths)}</div>
                </td>
                <td data-mode="ranked" data-what="ranked_wl">
                    <div>${wl}%</div>
                    <div class="smol-dark">${addSpaces(rank.wins)} / ${addSpaces(rank.losses)}</div>
                    <div class="smol-dark">${addSpaces(rank.wins + rank.losses)}</div>
                </td>
                <td data-mode="ranked" data-what="playtime">
                    <div>
                        <span class="level">${addSpaces(player.playtime.level, ',')} lvl</span>
                        <span class="playtime">${playtime}</span>
                    </div>
                </td>

                <td data-mode="dual_front" data-what="df_kd">
                    <div>${df_kd}</div>
                    <div class="smol-dark">${addSpaces(df.kills)} / ${addSpaces(df.deaths)}</div>
                    <div class="smol-dark">${addSpaces(df.kills + df.deaths)}</div>
                </td>
                <td data-mode="dual_front" data-what="df_wl">
                    <div>${df_wl}%</div>
                    <div class="smol-dark">${addSpaces(df.wins)} / ${addSpaces(df.losses)}</div>
                    <div class="smol-dark">${addSpaces(df.wins + df.losses)}</div>
                </td>
            </tr>
        `;
    });

    table = `
        <div id="above-table">
            <div class="left"></div>

            <div class="right">
                Last update: <span id="lastUpdated">${spinner(true)}</span> ago
            </div>
        </div>

        <table id="siege-stats" data-mode-selected="ranked">
            <thead>
                <tr>
                    <th data-what="pfp">🖼️</th>
                    <th data-what="name">Peep</th>
                    <th data-mode="ranked" data-what="rank_images">Rank<span class="hide-mobile"> (max)</span></th>
                    <th data-mode="ranked" data-what="rank_points">MMR</th>
                    <th data-mode="ranked" data-what="ranked_kd">K/D</th>
                    <th data-mode="ranked" data-what="ranked_wl">W/L</th>
                    <th data-mode="ranked" data-what="playtime">Time Played</th>
                    <th data-mode="dual_front" data-what="dual_front_kd">K/D</th>
                    <th data-mode="dual_front" data-what="dual_front_wl">W/L</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
    `;

    $('#stats').html(table);

    function toggleMode(showModeSysid) {
        $(`#siege-stats [data-mode]`).hide();
        $(`#siege-stats [data-mode="${showModeSysid}"]`).show();
    };
    $('#mode-select > label').on('click', function() { toggleMode($(this).attr('for')) });
    toggleMode('ranked');
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

    if (r.top_rank_position > 0) {
        return `
            <div class="rank-img-cell">
                <div data-rank-pos="${r.top_rank_position}">
                    <img style="height: 4rem;" src="https://i.imgur.com/Mz1tv4J.png" />
                </div>
                <img style="height: 3.5rem;" class="hide-mobile" src="${_getRankImageFromRankName(r.max_rank)}" />
            </div>
        `;
    }

    return `
      <div class="rank-img-cell">
        <img style="height: 4rem;" src="${_getRankImageFromRankName(r.rank)}" />
        <img style="height: 3.5rem;" class="hide-mobile" src="${_getRankImageFromRankName(r.max_rank)}" />
      </div>
    `;
};
export function _getRankImageFromRankName(name) {
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
    return `https://i.imgur.com/${rank_dict[name.toLowerCase()]}.png`;
};
