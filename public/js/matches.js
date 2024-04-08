import { c, supabase, spinner, message, userAuth, roundTwo, addSpaces } from './main.js';
import { _getRankImageFromRankName } from './siege.js';

const urlParams = new URLSearchParams(window.location.search);
let matchId = urlParams.get('matchId') || undefined;
let newOrExisting = urlParams.get('newOrExisting') || undefined;

let maps = {
    bank:          { name: 'Bank',             src: '/images/maps/bank.png'           },
    border:        { name: 'Border',           src: '/images/maps/border.png'         },
    chalet:        { name: 'Chalet',           src: '/images/maps/chalet.png'         },
    clubhouse:     { name: 'Club House',       src: '/images/maps/clubhouse.png'      },
    coastline:     { name: 'Coastline',        src: '/images/maps/coastline.png'      },
    consulate:     { name: 'Consulate',        src: '/images/maps/consulate.png'      },
    emeraldplains: { name: 'Emerald Plains',   src: '/images/maps/emeraldplains.png'  },
    kafe:          { name: 'Kafe Dostoyevsky', src: '/images/maps/kafe.png'           },
    kanal:         { name: 'Kanal',            src: '/images/maps/kanal.png'          },
    lair:          { name: 'Lair',             src: '/images/maps/lair.png'           },
    nhvnlabs:      { name: 'Nighthaven Labs',  src: '/images/maps/nighthavenlabs.png' },
    oregon:        { name: 'Oregon',           src: '/images/maps/oregon.png'         },
    outback:       { name: 'Outback',          src: '/images/maps/outback.png'        },
    skyscraper:    { name: 'Skyscraper',       src: '/images/maps/skyscraper.png'     },
    themepark:     { name: 'Theme Park',       src: '/images/maps/themepark.png'      },
    villa:         { name: 'Villa',            src: '/images/maps/villa.png'          },
};
let matchesData = {};



if (matchId) { await loadMatchDetails(matchId); }
else { $('#new-or-existing-switch').fadeIn('fast'); }




/* ------------------------

    Show one match details

*/


async function loadMatchDetails(matchId) {
    $('#match-details').fadeIn('fast');
    $('#map').html(spinner());
    $('#stack').html(spinner());
    $('#tracked-at').html(spinner());
    $('#match-note').html(spinner());

    const { data: matchDb } = await supabase.from('tracked_matches').select('*').eq('id', matchId);
    let match = matchDb[0];

    let diskitoPlayers = await loadUpPlayers(true);
    diskitoPlayers = diskitoPlayers.map(player => player.ubi_id);



    /* ---------------- */
    /* Basic match Info */

    let map = maps[match.map].name;
    let stack = match.stack;

    $('#map').text(map);
    $('#stack').text(stack + 'x');
    $('#match-note').text(match.note).parent().toggle(match.note !== '');

    if (match.raw_data_archived === null) {
        $('#tracked-at').text(simpleDateTime(match.created_at)).parent().show();
    }
    else {
        $('#tracked-at').parent().hide();
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

        row += `
            <td data-what="trn-link">
                <a href="https://r6.tracker.network/profile/id/${player}" target="_blank">
                    <img src="/icons/data_exploration.svg" />
                </a>
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



        $('#match-outcome').text(ourOutcome > theirOutcome ? 'VI VON' : 'L').parent().show();
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

};







/* -------------------------------------------

    Find new matches OR view existing matches

*/

let findNew = undefined;
$('#new-or-existing-switch > .switcharoo > .btn').on('click', async function() {
    if (findNew !== undefined) { return; }
    findNew = this.id === 'new-match';

    $(this).siblings().attr('data-off', '');
    $(`#${findNew ? 'match-tracker' : 'match-viewer'}`).fadeIn('fast');
    if (!findNew) { await loadTrackedMatches(); }

    let url = new URL(window.location.href);
    url.searchParams.set('newOrExisting', findNew ? 'new' : 'existing');
    window.history.pushState({}, '', url);
});
if (newOrExisting) {
    if (newOrExisting == 'new') { $('#new-match').trigger('click'); }
    else if (newOrExisting == 'existing') { $('#existing-matches').trigger('click'); }
}

async function loadTrackedMatches() {
    let spnr = spinner();
    spnr.id = 'tracked-matches-spinner';
    $('#match-viewer').prepend(spnr);

    const { data: matches } = await supabase.from('tracked_matches').select('*').order('created_at', { ascending: false });
    let players = await loadUpPlayers(true);
    
    let playerIdToName = {};
    players.forEach(player => playerIdToName[player.ubi_id] = player.name);

    matches.forEach(match => {
        matchesData[match.id] = match;

        let akschuns = ``;
        let haveFullData = match.raw_data_archived !== null;
        let map = maps[match.map].name;
        let created_at = simpleDateTime(match.created_at);

        akschuns += `<a href="/matches?matchId=${match.id}" class="btn smol" data-type="magic">Details</a>`;
        if (!haveFullData) { akschuns += `<div data-update-archived="${match.id}" class="btn smol" data-type="warning">Ended?</div>`; }

        $('#tracked-matches > tbody').append(`
            <tr data-match-id="${match.id}">
                <td data-what="created_at">${created_at}</td>
                <td data-what="map">${map}</td>
                <td data-what="player-stack">${match.stack}-stack</td>
                <td data-what="akschuns">${akschuns}</td>
            </tr>
        `);

    });

    $('[data-update-archived]').on('click', async function() {
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

            }
            else {
                $(this).html('Ended??');
            }
        });

    });

    spnr.remove();
    $('#tracked-matches').fadeIn('fast');
};

function simpleDateTime(date) {
    let d = new Date(date);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    if (hrs < 10) { hrs = '0' + hrs; }
    if (mins < 10) { mins = '0' + mins; }
    return `${d.getDate()}. ${d.getMonth() + 1}. ${d.getFullYear()} ${hrs}:${mins}`;
};



let doWe = undefined;
$('#match_id_fork > .btn').on('click', async function() {
    if (doWe !== undefined) { return; }
    doWe = this.id.replace('match_id_fork-', '') === 'yes';

    $(this).siblings().attr('data-off', ''); // 'Turn off' the other button

    if (doWe) {
        $('#match-id').attr('placeholder', 'e.g. ' + crypto.randomUUID());
        $('#match-id-picker').fadeIn('fast');
    }
    else {
        $('#player-picker').fadeIn('fast');
        $('<div>'+message('This is a complex operation scanning thousands of matches that could take minutes to complete..', 'warning')+'</div>').insertBefore('#find-match-parent');
        await loadUpPlayers();
    }
    loadUpMaps();
    $('#additional-note').fadeIn('fast');
    $('#find-match-parent').fadeIn('fast');
    $('#map-picker').fadeIn('fast');

});

async function loadUpPlayers(justGetPlayers=false) {
    /* Init spinners */    
    $('#player-picker > #players').html(spinner());
    
    /* ------------------------ */
    /* Set up available players */
    /* ------------------------ */

    let { data: playersDb } = await supabase.from('siege_stats').select('ubi_id, name').order('name', { ascending: true });
    if (justGetPlayers) { return playersDb; }

    let playersHtml = '';
    playersDb.forEach(player => {
        playersHtml += `
            <div class="player" data-uuid="${player.ubi_id}">
                <img src="https://ubisoft-avatars.akamaized.net/${player.ubi_id}/default_256_256.png" />
                <div>${player.name}</div>
            </div>
        `;
    });
    $('#player-picker > #players').html(playersHtml);

    $('#player-picker > #players > .player').on('click', function() {
        if (!this.classList.contains('selected')) {
            let selectedPlayers = $('#player-picker > #players > .player.selected').length;
            if (selectedPlayers === 5) { return; }
        }
        $(this).toggleClass('selected');
    });

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

function isUUID(stringCheck) {
    let uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;
    return uuidRegex.test(stringCheck);
};

$('#find-match').on('click', async function() {
    let errors = false;
    $('#find-match-errors').hide();
    this.innerHTML = spinner(true);

    let note = $('#note').val() || '';
    let map = $('#maps > .map.selected').attr('data-sysid');
    let players = undefined;
    let matchId = undefined;
    let requestedBy = userAuth.session.user.identities[0].id;

    if (doWe) {
        
        matchId = $('#match-id').val();

        if (!matchId) {
            $('#find-match-errors').append(message('Match ID is required!', 'error')).show();
            errors = true;
        }
        else if (!isUUID(matchId)) {
            $('#find-match-errors').append(message('Match ID is not a valid UUID!', 'error')).show();
            errors = true;
        }
        
    }
    else {

        players = Array.from($('#players > .player.selected')).map(player => player.dataset.uuid);
        
        if (players.length === 0) {
            $('#find-match-errors').append(message('You need to select at least one profile!', 'error')).show();
            errors = true;
        }
        else if (players.length > 5) {
            $('#find-match-errors').append(message('How the fuck did you select more than 5 profiles bro?!', 'error')).show();
            errors = true;
        }

    }

    if (map === undefined) {
        $('#find-match-errors').append(message('A map has to be selected..', 'error')).show();
        errors = true;
    }
    
    if (!errors) {

        fetch(
            'https://api.cndrd.xyz/diskito/find_match',
            {
                method: 'POST',
                body: JSON.stringify({ playersIds: players, mapSysid: map, note: note, matchId: matchId, requestedBy: requestedBy }),
            }
        )
        .then(response => response.json())
        .then(data => {
            
            let matchId = data?.matchId;

            if (matchId) {
                $('#find-match').replaceWith(`<button class="btn big" data-type="success" onclick="location.href='/matches?matchId=${matchId}'">Match details</button>`);
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
