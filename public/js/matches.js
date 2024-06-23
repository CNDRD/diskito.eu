import { c, supabase, spinner, message, userAuth, roundTwo, addSpaces } from './main.js';
import { _getRankImageFromRankName } from './siege.js';

const urlParams = new URLSearchParams(window.location.search);
let matchId = urlParams.get('matchId') || undefined;
let newOrExisting = urlParams.get('newOrExisting') || undefined;
let diskitoPlayersCache = undefined;
let matchDetailsCache = {};
let matchOffset = 20;
let matchOffsetCnt = 10;

let maps = {
    bank:          { name: 'Bank',           src: '/images/maps/bank.png'           },
    border:        { name: 'Border',         src: '/images/maps/border.png'         },
    chalet:        { name: 'Chalet',         src: '/images/maps/chalet.png'         },
    clubhouse:     { name: 'Club House',     src: '/images/maps/clubhouse.png'      },
    coastline:     { name: 'Coastline',      src: '/images/maps/coastline.png'      },
    consulate:     { name: 'Consulate',      src: '/images/maps/consulate.png'      },
    emeraldplains: { name: 'Emerald Plains', src: '/images/maps/emeraldplains.png'  },
    kafe:          { name: 'Kafe',           src: '/images/maps/kafe.png'           },
    kanal:         { name: 'Kanal',          src: '/images/maps/kanal.png'          },
    lair:          { name: 'Lair',           src: '/images/maps/lair.png'           },
    nhvnlabs:      { name: 'NHVN Labs',      src: '/images/maps/nighthavenlabs.png' },
    oregon:        { name: 'Oregon',         src: '/images/maps/oregon.png'         },
    outback:       { name: 'Outback',        src: '/images/maps/outback.png'        },
    skyscraper:    { name: 'Skyscraper',     src: '/images/maps/skyscraper.png'     },
    themepark:     { name: 'Theme Park',     src: '/images/maps/themepark.png'      },
    villa:         { name: 'Villa',          src: '/images/maps/villa.png'          },
};



if (matchId) { await loadMatchDetails(matchId); }
$('#new-or-existing-switch').fadeIn('fast');





/* ------------------------

    Show one match details

*/


async function loadMatchDetails(matchId) {
    $('#outcome_tab_place').html('');
    $('#ranked_stats_table_place').html('');

    $('#match-details').fadeIn('fast');
    $('#match-start').html(spinner());

    $('#map').css({ 'view-transition-name': `map_name_${matchId}` });
    $('#stack').css({ 'view-transition-name': `stack_${matchId}` });
    $('#match-outcome').css({ 'view-transition-name': `outcome_${matchId}` });
    $('#match-score').css({ 'view-transition-name': `score_${matchId}` });
    
    if (!matchDetailsCache[matchId]) {
        const { data: matchDb } = await supabase.from('tracked_matches').select('*').eq('id', matchId);
        matchDetailsCache[matchId] = matchDb[0];
    }
    let match = matchDetailsCache[matchId];
    


    let diskitoPlayers = await loadUpPlayers();
    diskitoPlayers = diskitoPlayers.map(player => player.ubi_id);



    /* ---------------- */
    /* Basic match Info */

    let map = maps[match.map].name;
    let stack = match.stack;

    $('#map').text(map);
    $('#stack').text(stack + 'x');

    if (match.raw_data !== null) {
        $('#match-server').text(_getServerName(match?.raw_data?.datacenter)).parent().show();
        $('#match-start').text(simpleDateTime(match.raw_data.start_time)).parent().show();
    }

    if (match.raw_data_archived !== null) {
        $('#match-start').text(simpleDateTime(match.raw_data_archived.start_time)).parent().show();
        $('#match-end').text(simpleDateTime(match.raw_data_archived.end_time)).parent().show();

        let duration = new Date(match.raw_data_archived.end_time) - new Date(match.raw_data_archived.start_time);
        duration = duration / 1000 / 60;
        $('#match-duration').text('~' + Math.ceil(duration) + ' minutes').parent().show();
    }



    /* ---------------------------------------------------- */
    /* If we have the archived data we can figure out teams */

    let ourTeamId = undefined;
    let ourTeamPlayers = [];
    if (match?.raw_data_archived) {
        let rounds = match.raw_data_archived.rounds;
        let firstRound = rounds[0];

        let firstTeam = firstRound.teams[0];
        let secondTeam = firstRound.teams[1];

        let firstTeamPlayers = firstTeam.players.map(player => player.profile_id);
        let secondTeamPlayers = secondTeam.players.map(player => player.profile_id);

        let ourTeamIsFirst = firstTeamPlayers.some(player => diskitoPlayers.includes(player));
        ourTeamPlayers = ourTeamIsFirst ? firstTeamPlayers : secondTeamPlayers;
        ourTeamId = ourTeamIsFirst ? firstTeam.id : secondTeam.id;
    }



    /* -------------------- */
    /* Ranked players' data */

    let ourPlayers = [];
    let otherPlayers = [];
    Object.keys(match.ranked_stats).forEach(player => {
        match.ranked_stats[player].ourTeam = ourTeamPlayers.includes(player);
        match.ranked_stats[player].diskito = diskitoPlayers.includes(player);

        if (match.ranked_stats[player].diskito) {
            ourPlayers.unshift(player);
        }
        else {
            if (match.ranked_stats[player].ourTeam) {
                ourPlayers.push(player);
            }
            else {
                otherPlayers.push(player);
            }
        }
    });

    let prevWasDiskito = true;
    let prevWasOurTeam = true;
    let allPlayersOrdered = [...ourPlayers, ...otherPlayers];
    let playedWithAgainstCounts = await _fetchPlayedWithAgainstCounts(allPlayersOrdered);


    allPlayersOrdered.forEach(player => {
        let row = '';
        let pd = match.ranked_stats[player];

        row += `<td data-what="pfp"><img src="https://ubisoft-avatars.akamaized.net/${player}/default_256_256.png" /></td>`;

        let persona = pd.persona ? `<div class="persona">${pd.persona}</div>` : '';
        row += `<td data-what="player"><div>${pd.name}</div>${persona}</td>`;

        row += `
            <td data-what="rank">
                <img src="${_getRankImageFromRankName(pd.rank)}" />
                <div class="rank_rp">
                    <div>${pd.rank}</div>
                    <div>${addSpaces(pd.rank_points)} <div>RP</div></div>
                </div>
            </td>
        `;

        let kd = pd.deaths == 0 ? pd.kills : roundTwo(pd.kills / pd.deaths);
        row += `
            <td data-what="kd">
                <div>${kd}</div>
                <div class="smol-dark">${addSpaces(pd.kills)} / ${addSpaces(pd.deaths)}</div>
            </td>
        `;

        let wl = pd.losses == 0 ? 0 : roundTwo(pd.wins / (pd.wins + pd.losses) * 100);
        row += `
            <td data-what="wl">
                <div>${wl}%</div>
                <div class="smol-dark">${addSpaces(pd.wins)} / ${addSpaces(pd.losses)}</div>
            </td>
        `;

        let with_ = playedWithAgainstCounts[player].with;
        let against_ = playedWithAgainstCounts[player].against;
        row += `
            <td data-what="played-with-against">
                <span data-cnt="${with_}">${with_}</span>
                <span> / </span>
                <span data-cnt="${against_}">${against_}</span>
            </td>
        `;

        row += `
            <td data-what="stats-links">
                <div>
                    <a class="btn smol" data-type="note" href="https://r6.tracker.network/profile/id/${player}" target="_blank">TRN</a>
                    <a class="btn smol" data-type="note" href="https://stats.cc/siege/-/${player}" target="_blank">stats.cc</a>
                </div>
            </td>
        `;

        // Dividers
        let cols = $('#ranked_stats > table > thead > tr > th').length;
        if (prevWasDiskito && !pd.diskito) {
            $('#ranked_stats_table_place').append(`<tr class="separator"><td colspan="${cols}"></td></tr>`);
        }
        if (prevWasOurTeam && !pd.ourTeam) {
            $('#ranked_stats_table_place').append(`<tr class="team-separator"><td colspan="${cols}"></td></tr>`);
        }
        prevWasDiskito = pd.diskito;
        prevWasOurTeam = pd.ourTeam;

        // Finally add our wanted row
        $('#ranked_stats_table_place').append(`<tr>${row}</tr>`);
    });



    /* ----------------------------------- */
    /* Optionally show how each round went */

    let ourOutcome = 0;
    let theirOutcome = 0;
    let playerStats = {};

    if (match?.raw_data_archived) {
        match.raw_data_archived.rounds.forEach(round => {

            let winnerRole = round.winner_role;
            let ourTeamRole = round.teams.find(team => team.id === ourTeamId).role;

            let ourTeamWon = winnerRole === ourTeamRole;
            if (ourTeamWon) { ourOutcome++; }
            else { theirOutcome++; }

            round.teams.forEach(team => {
                team.players.forEach(player => {

                    if (!playerStats[player.profile_id]) {
                        playerStats[player.profile_id] = { kills: 0, deaths: 0, assists: 0, headshots: 0, teamKills: 0, forgivenTeamKills: 0 };
                    }

                    playerStats[player.profile_id].kills += player.kills;
                    playerStats[player.profile_id].deaths += player.deaths;
                    playerStats[player.profile_id].assists += player.assists;
                    playerStats[player.profile_id].headshots += player.headshots;
                    playerStats[player.profile_id].teamKills += player.team_kills;
                    playerStats[player.profile_id].forgivenTeamKills += player.forgiven_tk;

                });
            });

        });



        $('#match-outcome').text(ourOutcome > theirOutcome ? 'W' : 'L').parent().show();
        $('#match-score').text(`${ourOutcome} - ${theirOutcome}`).parent().show();

        let prevWasDiskito = true;
        let prevWasOurTeam = true;

        allPlayersOrdered.forEach(player => {
            let row = '';
            let ps = playerStats[player];
            let pd = match.ranked_stats[player];

            row += `<td data-what="pfp"><img src="https://ubisoft-avatars.akamaized.net/${player}/default_256_256.png" /></td>`;

            let persona = pd.persona ? `<div class="persona">${pd.persona}</div>` : '';
            row += `<td data-what="player"><div>${pd.name}</div>${persona}</td>`;

            let kd = ps.deaths == 0 ? ps.kills : roundTwo(ps.kills / ps.deaths);
            row += `
                <td data-what="kd">
                    <div>${kd}</div>
                    <div class="smol-dark">${addSpaces(ps.kills)} / ${addSpaces(ps.deaths)} / ${addSpaces(ps.assists)}</div>
                </td>
            `;

            let hsPercentage = ps.kills == 0 ? 0 : roundTwo(ps.headshots / ps.kills * 100);
            row += `
                <td data-what="headshots">
                    <div>${ps.headshots}</div>
                    <div class="smol-dark">${hsPercentage}%</div>
                </td>
            `;

            row += `
                <td data-what="teamkills">
                    <div>${ps.teamKills}</div>
                    <div class="smol-dark">${ps.forgivenTeamKills}</div>
                </td>
            `;

            // Dividers
            let cols = $('#outcome_tab > table > thead > tr > th').length;
            if (prevWasDiskito && !pd.diskito) {
                $('#outcome_tab_place').append(`<tr class="separator"><td colspan="${cols}"></td></tr>`);
            }
            if (prevWasOurTeam && !pd.ourTeam) {
                $('#outcome_tab_place').append(`<tr class="team-separator"><td colspan="${cols}"></td></tr>`);
            }
            prevWasDiskito = pd.diskito;
            prevWasOurTeam = pd.ourTeam;

            // Finally add our wanted row
            $('#outcome_tab_place').append(`<tr>${row}</tr>`);
        });

        $('#outcome_tab').show();
    }


    async function _fetchPlayedWithAgainstCounts(playerIds) {
        let counts = {};
        let playedWith_ = await supabase.from('played_with').select('player, count').in('player', playerIds);
        let playedAgainst_ = await supabase.from('played_against').select('player, count').in('player', playerIds);

        playerIds.forEach(player => { counts[player] = { with: 0, against: 0 }; });

        playedWith_.data.forEach(pw => { counts[pw.player].with = pw.count; });
        playedAgainst_.data.forEach(pa => { counts[pa.player].against = pa.count; });

        return counts;
    };
    function _getServerName(server) {
        if (!server) { return 'Unknown' }
        return {
            'private/private': 'Private',

            'gamelift/eu-north-1': 'AWS - Stockholm',
            'gamelift/eu-south-1': 'AWS - Milan',
            'gamelift/eu-central-1': 'AWS - Frankfurt',
            'gamelift/eu-west-1': 'AWS - Ireland',
            'gamelift/eu-west-2': 'AWS - London',
            'gamelift/eu-west-3': 'AWS - Paris',
            'gamelift/ap-northeast-3': 'AWS - Osaka',
            'gamelift/ap-east-1': 'AWS - Hong Kong',
            'gamelift/ap-northeast-1': 'AWS - Tokyo',
            'gamelift/ap-northeast-2': 'AWS - Seoul',
            'gamelift/ap-south-1': 'AWS - Mumbai',
            'gamelift/ap-southeast-1': 'AWS - Singapore',
            'gamelift/ap-southeast-2': 'AWS - Sydney',
            'gamelift/us-east-1': 'AWS - Virginia',
            'gamelift/us-east-2': 'AWS - Ohio',
            'gamelift/us-west-1': 'AWS - California',
            'gamelift/us-west-2': 'AWS - Oregon',
            'gamelift/ca-central-1': 'AWS - Montreal',
            'gamelift/me-south-1': 'AWS - Bahrain',
            'gamelift/af-south-1': 'AWS - Cape Town',
            'gamelift/cn-northwest-1': 'AWS - Ningxia',
            'gamelift/cn-north-1': 'AWS - Beijing',
            'gamelift/sa-east-1': 'AWS - Sao Paulo',

            'playfab/eastus': 'MSFT - East US',
            'playfab/westus': 'MSFT - West US',
            'playfab/centralus': 'MSFT - Central US',
            'playfab/southcentralus': 'MSFT - South Central US',
            'playfab/eastasia': 'MSFT - East Asia',
            'playfab/southeastasia': 'MSFT - Southeast Asia',
            'playfab/uaenorth': 'MSFT - UAE North',
            'playfab/japaneast': 'MSFT - Japan East',
            'playfab/westeurope': 'MSFT - West Europe',
            'playfab/northeurope': 'MSFT - North Europe',
            'playfab/brazilsouth': 'MSFT - Brazil South',
            'playfab/australiaeast': 'MSFT - Australia East',
            'playfab/southafricanorth': 'MSFT - South Africa North',

        }[server] || server;
    };

};







/* -------------------------------------------

    Find new matches OR view existing matches

*/

let newOrExistingLoaded = { new: false, existing: false };
$('#new-or-existing-switch > .switcharoo > .btn').on('click', async function() {
    let findNew = this.id === 'new-match';

    function toggleViews() {
        $('#match-details').hide();
        $(`#${findNew ? 'match-viewer' : 'match-tracker'}`).hide();
        $(`#${findNew ? 'match-tracker' : 'match-viewer'}`).show();
    };
    
    if (!document.startViewTransition) {
        toggleViews();
    }
    else {
        document.startViewTransition(() => { toggleViews() });
    }
    
    if (findNew && !newOrExistingLoaded.new) {
        loadUpMaps();
        newOrExistingLoaded.new = true;
    }
    else if (!findNew && !newOrExistingLoaded.existing){
        await loadTrackedMatches();
        newOrExistingLoaded.existing = true;
    }

    let url = new URL(window.location.href);
    url.searchParams.delete('newOrExisting');
    url.searchParams.delete('matchId');
    url.searchParams.set('newOrExisting', findNew ? 'new' : 'existing');
    window.history.pushState({}, (findNew ? 'New match' : 'Existing matches'), url);
});

if (newOrExisting) {
    if (newOrExisting == 'new') { $('#new-match').trigger('click'); }
    else if (newOrExisting == 'existing') { $('#existing-matches').trigger('click'); }
}

async function loadTrackedMatches() {
    let spnr = spinner();
    $('#match-viewer').prepend(spnr);

    let matchQuery = supabase
        .from('tracked_matches')
        .select('id, outcome, created_at, map, stack')
        .order('created_at', { ascending: false });

    let { data: matches } = await matchQuery.range(0, matchOffset);

    showTrackedMatches(matches);

    $('#match-viewer').append(`<div data-load-more class="btn" data-type="warning">Load more</div>`);

    $('[data-load-more]').on('click', async function() {
        $(this).html(spinner());

        let { data: moreMatches } = await matchQuery.range(matchOffset, matchOffset+matchOffsetCnt);
        matchOffset += matchOffsetCnt;

        showTrackedMatches(moreMatches);

        if (moreMatches.length < matchOffsetCnt) {
            return $(this).remove();
        }

        $(this).html('Load more');
    });

    spnr.remove();
    $('#tracked-matches').fadeIn('fast');
};
function showTrackedMatches(matches) {

    matches.forEach(match => {
        let akschuns = '';
        let outcome = _parseOutcome(match.outcome, match.id);
        let map = maps[match.map].name;
        let created_at = simpleDateTime(match.created_at);

        akschuns += `<div data-show-match="${match.id}" class="btn smol" data-type="magic">Details</div>`;
        if (match.outcome == null) {
            akschuns += `<div data-update-archived="${match.id}" class="btn smol" data-type="warning">Ended?</div>`;
        }

        $('#tracked-matches > tbody').append(`
            <tr data-match-id="${match.id}">
                <td data-what="created_at">${created_at}</td>
                <td data-what="map" style="view-transition-name: map_name_${match.id}">${map}</td>
                <td data-what="player-stack" style="view-transition-name: stack_${match.id}">${match.stack}<span>x</span></td>
                <td data-what="outcome"><div>${outcome}</div></td>
                <td data-what="akschuns"><div>${akschuns}</div></td>
            </tr>
        `);

    });

    $('[data-update-archived]').off().on('click', async function() {
        $(this).html(spinner());
        let matchId = this.dataset.updateArchived;
        
        fetch(
            'https://api.cndrd.xyz/diskito/match_over',
            { method: 'POST', body: JSON.stringify({ matchId: matchId }) }
        )
        .then(response => response.json())
        .then(data => {
            if (data?.matchId) {
                $(this).html('<img src="/icons/check.svg" class="match_over_success" />')
                setTimeout(() => { $(this).slideUp() }, 3_000);
                $(`[data-match-id="${data.matchId}"] > [data-what="outcome"] > div`).html(_parseOutcome(data.outcome));
            }
            else {
                $(this).html('Ended??');
            }
        });

    });

    function _parseOutcome(data, matchId) {
        if (!data) { return ''; }

        let vi_von = data.vi_von ? 'W' : 'L';
        let vi_von_type = data.vi_von ? 'success' : 'error';
        
        if ((data.our_outcome + data.their_outcome) < 4) {
            vi_von = 'C';
            vi_von_type = 'warning';
        }

        return `
            <div class="btn smol" data-type="${vi_von_type}" style="view-transition-name: outcome_${matchId};">${vi_von}</div>
            <div class="btn smol" data-type="note" style="text-wrap: nowrap; view-transition-name: score_${matchId}"">${data.our_outcome} : ${data.their_outcome}</div>
        `;
    };

    $('[data-show-match]').off().on('click', async function() {
        let matchId = this.dataset.showMatch;
        
        if (!document.startViewTransition) {
            $('#match-viewer').hide();
            await loadMatchDetails(matchId);
        }
        else {
            document.startViewTransition(async () => {
                $('#match-viewer').hide();
                await loadMatchDetails(matchId);
            });
        }

        let url = new URL(window.location.href);
        url.searchParams.delete('newOrExisting');
        url.searchParams.delete('matchId');
        url.searchParams.set('matchId', matchId);
        window.history.pushState({}, '', url);
    });
};

function simpleDateTime(date) {
    let d = new Date(date);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    if (hrs < 10) { hrs = '0' + hrs; }
    if (mins < 10) { mins = '0' + mins; }
    return `${d.getDate()}. ${d.getMonth() + 1}. '${d.getFullYear().toString().substr(-2)} ${hrs}:${mins}`;
};



async function loadUpPlayers() {
    if (diskitoPlayersCache) { return diskitoPlayersCache; }

    let { data: playersDb } = await supabase.from('siege_stats').select('ubi_id, name').order('name', { ascending: true });
    diskitoPlayersCache = playersDb;

    return diskitoPlayersCache;
};

function loadUpMaps() {
    $('#maps').html(spinner());

    /* ----------------------------------- */
    /* Set up maps to pick what we playing */
    /* ----------------------------------- */

    let mapsHtml = '';
    Object.keys(maps).forEach(map => {
        mapsHtml += `
            <div class="map" data-sysid="${map}">
                <img src="${maps[map].src}" />
                <div>${maps[map].name}</div>
            </div>        
        `;
    });
    $('#maps').html(mapsHtml);

    $('#maps > .map').on('click', function() {
        $('#maps > .map').removeClass('selected');
        $(this).toggleClass('selected');
    });

};

$('#find-match').on('click', async function() {
    let errors = false;
    $('#find-match-errors').hide();
    this.innerHTML = spinner(true);

    let map = $('#maps > .map.selected').attr('data-sysid');
    let matchId = undefined;
    let requestedBy = userAuth.session.user.identities[0].id;

    if (map === undefined) {
        $('#find-match-errors').append(message('A map has to be selected..', 'error')).show();
        errors = true;
    }
    
    if (!errors) {

        fetch(
            'https://api.cndrd.xyz/diskito/find_match',
            {
                method: 'POST',
                body: JSON.stringify({ mapSysid: map, matchId: matchId, requestedBy: requestedBy }),
            }
        )
        .then(response => response.json())
        .then(data => {
            
            if (data?.matchId) {
                $('#find-match').replaceWith(`<button class="btn big" data-type="success" onclick="location.href='/matches?matchId=${data.matchId}'">Match details</button>`);
                $('#find-match-parent').append(message(`Took ${roundTwo(data.time)}s 😅`, 'note'));
            }
            else {
                $('#find-match').replaceWith(`<button class="btn big" onclick="location.reload();" data-type="error">Try again..</button>`);
                $('#find-match-parent').prepend(message('No match found..', 'error'));
            }

        });

    }
    else {
        this.innerHTML = 'Try again..';
    }

});
