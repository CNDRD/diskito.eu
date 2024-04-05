import { c, supabase, spinner, message, userAuth } from './main.js';

let maps = {
    bank:          { name: 'Bank',             src: '/images/maps/bank.png'           },
    border:        { name: 'Border',           src: '/images/maps/border.png'         },
    chalet:        { name: 'Chalet',           src: '/images/maps/chalet.png'         },
    clubhouse:     { name: 'Clubhouse',        src: '/images/maps/clubhouse.png'      },
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




$('#new-or-existing-switch').fadeIn('fast');

let findNew = undefined;
$('#new-or-existing-switch > .switcharoo > .btn').on('click', async function() {
    if (findNew !== undefined) { return; }
    findNew = this.id === 'new-match';

    $(this).siblings().attr('data-off', '');
    $(`#${findNew ? 'match-tracker' : 'match-viewer'}`).fadeIn('fast');
    if (!findNew) { await loadTrackedMatches(); }
});





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

        c(match);

        let akschuns = ``;
        let haveFullData = match.raw_data_archived !== null;
        let playerStack = 0;

        let rawData = match.raw_data || {};
        let rawDataArchived = match.raw_data_archived || {};
        let map = maps[match.map].name;
        let note = match.note || '--';
        let created_at = simpleDateTime(match.created_at);

        rawData.connected_profile_ids.forEach(playerId => {
            if (!playerIdToName[playerId]) { return; }
            playerStack++;
        });

        if (haveFullData) { akschuns += `<div class="btn smol" data-type="magic">Rounds</div>`; }
        else { akschuns += `<div class="btn smol" data-type="warning">Ended?</div>`; }

        akschuns += `<div data-btn-details" class="btn smol" data-type="note">Details</div>`;



        $('#tracked-matches > tbody').append(`
            <tr data-match-id="${match.id}">
                <td data-what="created_at">${created_at}</td>
                <td data-what="map">${map}</td>
                <td data-what="player-stack">${playerStack}-stack</td>
                <td data-what="akschuns">${akschuns}</td>
            </tr>
        `);

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
        $(message('This will take a while. Depending on luck and how many matches are being currently played..', 'warning')).insertAfter('#do_we_know_the_match_id');
        await loadUpPlayers();
    }
    loadUpMaps();
    $('#additional-note').fadeIn('fast');
    $('#find-match-parent').fadeIn('fast');
    $('#map-picker').fadeIn('fast');

    

    /* -------------- */
    /* Find the match */
    /* -------------- */

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
            .then(data => {
                
                c(data);
                
                // TODO: Properly parse the data and display a meaningful output..

            })

        }
        else {
            this.innerHTML = 'Try again..';
        }

    });

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
