import { c, supabase, spinner, message, userAuth, roundTwo, addSpaces, UUID } from './main.js';
import { _getRankImageFromRankName } from './siege.js';

const urlParams = new URLSearchParams(window.location.search);
let currentUserDiscordId = UUID ? userAuth.session.user.identities[0].id : undefined;
let matchId = urlParams.get('matchId') || undefined;
let stuff = urlParams.get('stuff') || undefined;
let diskitoPlayersCache = undefined;
let markedCheatersCache = undefined;
let playedWithCache = {};
let playedAgainstCache = {};
let matchDetailsCache = {};
let matchOffsetStart = 20;
let matchOffset = matchOffsetStart;
let matchOffsetCnt = 10;
let matchSelectedSeason = undefined;
let newMatchVisibleCache = currentUserDiscordId ? (await supabase.from('game_accounts').select('*', { count: 'exact', head: true }).eq('user', currentUserDiscordId)) : undefined;

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

let availableSeasons = await supabase.from('tracked_matches_available_seasons').select('*').order('season', { ascending: false });
availableSeasons.data.forEach((ssn, idx) => {
    if (idx === 0) { matchSelectedSeason = ssn.season }
    $('#tracked-matches-seasonal-switch').append(`<div ${idx===0?'class="selected"':''} data-season="${ssn.season}">${ssn.season}</div>`);
});
$('#tracked-matches-seasonal-switch > [data-season]').on('click', async function() {
    $('#tracked-matches-seasonal-switch > [data-season]').removeClass('selected');
    $(this).addClass('selected');

    matchOffset = matchOffsetStart;
    matchSelectedSeason = this.dataset.season;
    await loadTrackedMatches();
});



if (matchId) { await loadMatchDetails(matchId); }
$('#stuff-switch').fadeIn('fast');

$(window).on("popstate", function () {
    let url = new URL(window.location.href);
    let matchId = url.searchParams.get('matchId');
    let stuff = url.searchParams.get('stuff');

    if (matchId) { loadMatchDetails(matchId); }
    if (stuff) { $(`#${stuff}`).trigger('click') }
});



/* ------------------------
    Show one match details
*/


async function loadMatchDetails(matchId) {
    $('#outcome_tab_place').html('');
    $('#ranked_stats_table_place').html('');
    $('#ranked_after_table_place').html('');

    $('#match-details').fadeIn('fast');
    $('#match-start').html(spinner());

    $('#map').css({ 'view-transition-name': `map_name_${matchId}` });
    $('#stack').css({ 'view-transition-name': `stack_${matchId}` });
    $('#match-outcome').css({ 'view-transition-name': `outcome_${matchId}` });
    $('#match-score').css({ 'view-transition-name': `score_${matchId}` });
    
    $(`#match-details [data-what-h]`).each(function() {
        $(`#match-details [data-what-h="${this.dataset.whatH}"]`).each(function() {
            $(this).css({ 'view-transition-name': `thead_${this.dataset.whatH}_${matchId}` });
        });
    });

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
        $('#match-server').text(getServerName(match?.raw_data?.datacenter)).parent().show();
        $('#match-start').text(simpleDateTime(match.raw_data.start_time)).parent().show();
    }

    if (match.raw_data_archived !== null) {
        $('#match-start').text(simpleDateTime(match.raw_data_archived.start_time)).parent().show();
        $('#match-end').text(simpleDateTime(match.raw_data_archived.end_time)).parent().show();

        let duration = new Date(match.raw_data_archived.end_time) - new Date(match.raw_data_archived.start_time);
        duration = duration / 1000 / 60;
        $('#match-duration').text('~' + Math.ceil(duration) + ' minutes').parent().show();
    }

    if (!match?.ranked_stats_after) {
        $('#ranked_after_sw').remove();
    }
    else {
        if (!$('#ranked_after_sw').length) {
            $('#details-switch').append('<div id="ranked_after_sw">After</div>');
        }
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
    let markedPlayers = await _fetchMarkedPlayers(allPlayersOrdered);

    allPlayersOrdered.forEach(player => {
        let row = '';
        let pd = match.ranked_stats[player];

        let cells = getSharedCells(player);
        row += cells.pfp;
        row += cells.name;
        row += cells.ranked;

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
        let clickable_ = (with_ + against_) > 0 && !pd.diskito;

        row += `
            <td data-what="played-with-against" data-clickable="${clickable_}">
                ${clickable_ ? '<span class="eye">👁️</span>' : ''}
                <span data-cnt="${with_}">${with_}</span>
                <span> / </span>
                <span data-cnt="${against_}">${against_}</span>
                ${clickable_ ? '<span class="eye">👁️</span>' : ''}
            </td>
        `;

        row += cells.stats;
        row += cells.mark;

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
        $('#ranked_stats_table_place').append(`<tr data-player="${player}">${row}</tr>`);
    });



    /* ------------------ */
    /* Show match outcome */

    let ourOutcome = 0;
    let theirOutcome = 0;
    let playerStats = {};
    let aces = {};

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

                    if (player.kills === 5) {
                        if (!aces[player.profile_id]) { aces[player.profile_id] = 0; }
                        aces[player.profile_id]++;
                    }

                });
            });

        });



        $('#match-outcome').text((ourOutcome + theirOutcome) < 4 ? 'Cancelled' : (ourOutcome > theirOutcome ? 'W' : 'L')).parent().show();
        $('#match-score').text(`${ourOutcome} - ${theirOutcome}`).parent().show();

        let prevWasDiskito = true;
        let prevWasOurTeam = true;

        allPlayersOrdered.forEach(player => {
            let row = '';
            let ps = playerStats[player];
            let pd = match.ranked_stats[player];

            let cells = getSharedCells(player);
            row += cells.pfp;
            row += cells.name;

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

            let aces_ = aces[player] || 0;
            row += `
                <td data-what="aces">
                    <div ${aces_ ? '' : 'class="smol-dark"'}>${aces_}</div>
                </td>
            `;

            row += cells.stats;

            // Dividers
            let cols = $('#outcome_tab > table > thead > tr > th').length;
            if (prevWasDiskito && !pd.diskito) {
                $('#outcome_tab_place').append(`<tr class="separator" style="view-transition-name: ${matchId}_separator"><td colspan="${cols}"></td></tr>`);
            }
            if (prevWasOurTeam && !pd.ourTeam) {
                $('#outcome_tab_place').append(`<tr class="team-separator" style="view-transition-name: ${matchId}_team-separator"><td colspan="${cols}"></td></tr>`);
            }
            prevWasDiskito = pd.diskito;
            prevWasOurTeam = pd.ourTeam;

            // Finally add our wanted row
            $('#outcome_tab_place').append(`<tr>${row}</tr>`);
        });

    }



    /* ----------------------- */
    /* Show ranked stats after */
    if (match?.ranked_stats && match?.ranked_stats_after) {
        let prevWasDiskito = true;
        let prevWasOurTeam = true;

        allPlayersOrdered.forEach(player => {
            let row = '';
            let ps = playerStats[player];
            let pd = match.ranked_stats[player];
            let pdAfter = match.ranked_stats_after[player];

            let cells = getSharedCells(player);
            let cellsAfter = getSharedCells(player, true);
            row += cells.pfp;
            row += cells.name;

            row += cells.ranked;
            row += cellsAfter.ranked;

            let mmrDiff = pdAfter.rank_points - pd.rank_points;
            let mmrDiffStr = mmrDiff > 0 ? `+${mmrDiff}` : mmrDiff;
            row += `
                <td data-what="mmr-diff">
                    <div data-change-positive="${mmrDiff > 0}">${mmrDiffStr}</div>
                </td>
            `;

            row += cells.stats;
    
            // Dividers
            let cols = $('#ranked_after > table > thead > tr > th').length;
            if (prevWasDiskito && !pd.diskito) {
                $('#ranked_after_table_place').append(`<tr class="separator" style="view-transition-name: ${matchId}_separator"><td colspan="${cols}"></td></tr>`);
            }
            if (prevWasOurTeam && !pd.ourTeam) {
                $('#ranked_after_table_place').append(`<tr class="team-separator" style="view-transition-name: ${matchId}_team-separator"><td colspan="${cols}"></td></tr>`);
            }
            prevWasDiskito = pd.diskito;
            prevWasOurTeam = pd.ourTeam;

            // Finally add our wanted row
            $('#ranked_after_table_place').append(`<tr>${row}</tr>`);
        });
    }



    /* Functions to help with all of the shit above */

    function getSharedCells(player, afterData=false) {
        let cells = {pfp: '', name: '', stats: '', mark: '', ranked: ''};
        let pd = match.ranked_stats[player];
        if (afterData) { pd = match.ranked_stats_after[player]; }

        let pfpTransition = _viewTransition(player, matchId, 'pfp');
        let nameTransition = _viewTransition(player, matchId, 'name');
        let statsTransition = _viewTransition(player, matchId, 'stats-links');
        let markTransition = _viewTransition(player, matchId, 'mark');

        /* Profile picture cell */
        let markedPfp = [];
        if (markedPlayers[player]?.cheater) { markedPfp.push('data-marked-cheater') }
        if (markedPlayers[player]?.retard) { markedPfp.push('data-marked-retard') }
        let markedStr = markedPfp.length ? markedPfp.join(' ') : '';
        cells.pfp = `<td data-what="pfp"><div ${markedStr}><img style="${pfpTransition}" src="https://ubisoft-avatars.akamaized.net/${player}/default_256_256.png" /></div></td>`;
        
        /* Name & persona cell */
        let persona = pd.persona ? `<div class="persona">${pd.persona}</div>` : '';
        cells.name = `<td data-what="player" style="${nameTransition}"><div>${pd.name}</div>${persona}</td>`;

        /* Ranked cell */
        cells.ranked = `
            <td data-what="rank">
                <div>
                    <img src="${_getRankImageFromRankName(pd.rank)}" />
                    <div class="rank_rp">
                        <div>${pd.rank}</div>
                        <div>${addSpaces(pd.rank_points)} <div>RP</div></div>
                    </div>
                </div>
            </td>
        `;

        /* Stat pages links cell */
        cells.stats = `
            <td data-what="stats-links" style="${statsTransition}">
                <div>
                    <a class="btn smol" data-type="note" href="https://r6.tracker.network/profile/id/${player}" target="_blank">TRN</a>
                    <a class="btn smol" data-type="note" href="https://stats.cc/siege/-/${player}" target="_blank">stats.cc</a>
                </div>
            </td>
        `;

        /* Mark player cell */
        let mark = '-';
        if (!pd.diskito) {
            mark = '';
            mark += markedPlayers[player]?.cheater ? '' : '<div class="btn smol" data-type="error" data-mark-type="cheater">Cheater</div>';
            mark += markedPlayers[player]?.retard ? '' : '<div class="btn smol" data-type="warning" data-mark-type="retard">Retard</div>';
            mark = mark ? `<div data-player="${player}">${mark}</div>` : '-';
        }
        cells.mark = `<td data-what="mark" style="${markTransition}">${mark}</td>`

        return cells;
    };
    function _viewTransition(player, match, what) {
        return `view-transition-name: ${what}_${player}_${match};`;
    };
    
    async function _fetchPlayedWithAgainstCounts(playerIds) {
        let counts = {};
        let playedWith_ = await supabase.from('played_with').select('player, count').in('player', playerIds);
        let playedAgainst_ = await supabase.from('played_against').select('player, count').in('player', playerIds);

        playerIds.forEach(player => { counts[player] = { with: 0, against: 0 }; });

        playedWith_.data.forEach(pw => { counts[pw.player].with = pw.count; });
        playedAgainst_.data.forEach(pa => { counts[pa.player].against = pa.count; });

        return counts;
    };
    async function _fetchMarkedPlayers(playerIds) {
        let onlyNonDiskito = playerIds.filter(player => !diskitoPlayers.includes(player));
        let markedDb = await supabase.from('siege_marked_players').select('ubi_id, game, why').in('ubi_id', onlyNonDiskito);
        let marked = playerIds.reduce((acc, cur) => { acc[cur] = { cheater: false, retard: false }; return acc; }, {});

        markedDb.data.forEach(plr => {
            if (plr.why === 'cheater') { marked[plr.ubi_id].cheater = true; }
            if (plr.why === 'retard')  { marked[plr.ubi_id].retard = true; }
        });
        
        return marked;
    };

    $('[data-mark-type]').off().on('click', async function() {
        $(this).html(spinner());

        let player = this.parentElement.dataset.player;
        let why = this.dataset.markType;

        let marked = await supabase.from('siege_marked_players').insert({
            ubi_id: player,
            name: match.ranked_stats[player].name,
            game: matchId,
            why: why,
            by: currentUserDiscordId
        });

        if (marked.status === 201) {
            $(this).closest('tr').find('[data-what=pfp] > div').attr(`data-marked-${why}`, '');
            $(this).html('<img src="/icons/check.svg" />');
            setTimeout(() => { $(this).slideUp() }, 3_000);
        }
        else {
            $(this).html(`${why[0].toUpperCase()}${why.slice(1)}`);
        }

    });

    $('#details-switch > div').off().on('click', function() {
        let what = this.id.replace('_sw', '');
        if (this.classList.contains('selected')) { return; }
        
        $('#details-switch > div').removeClass('selected');
        $(this).addClass('selected');
        
        function switchDetails(what_) {
            $('[data-match-details-tab]').hide();
            $(`[data-match-details-tab]#${what_}`).show();

            $('#details-note > div').css('opacity', '0');
            $(`#${what_}_note`).css('opacity', '1');
        };

        if (!document.startViewTransition) { switchDetails(what) }
        else { document.startViewTransition(async () => { switchDetails(what) }) }
    });

    $('[data-what="played-with-against"][data-clickable="true"]').off().on('click', async function() {
        let playerClicked = this.parentElement.dataset.player;

        $('body').append(`<dialog id="played-with-against-popup" class="popup"><div class="match-list">${spinner(true)}</div></dialog>`);
        $('#played-with-against-popup')[0].showModal();

        if (playedWithCache[playerClicked] === undefined) {
            let playedWith = await supabase.from('played_with_matches').select('player, match_id').eq('player', playerClicked);
            playedWithCache[playerClicked] = playedWith.data.map(pw => pw.match_id);
        }

        if (playedAgainstCache[playerClicked] === undefined) {
            let playedAgainst = await supabase.from('played_against_matches').select('player, match_id').eq('player', playerClicked);
            playedAgainstCache[playerClicked] = playedAgainst.data.map(pw => pw.match_id);
        }

        let playedWith = playedWithCache[playerClicked];
        let playedAgainst = playedAgainstCache[playerClicked];
        let matchIds = [...playedWith, ...playedAgainst];

        let matchIdsUnique = [...new Set(matchIds)];
        let matchesNotInCache = matchIdsUnique.filter(matchId => !matchDetailsCache[matchId]);

        if (matchesNotInCache.length) {
            let matches = await supabase.from('tracked_matches').select('*').in('id', matchesNotInCache);
            matches.data.forEach(match => { matchDetailsCache[match.id] = match; });
        }

        let matchesToShow = matchIdsUnique.map(matchId => matchDetailsCache[matchId]);
        

        let matchesPopup = '';
        matchesToShow.forEach(match => {
            let outcome = _parseMatchOutcome(match?.outcome);

            matchesPopup += `
                <div data-match-id="${match.id}">
                    <div class="outcome" data-outcome="${outcome.sysid}" style="--_bg-map-img: url('${maps[match.map].src}');">
                        ${outcome.html}
                    </div>
                    <div class="middle">
                        <div class="info">
                            <div class="title">Map</div>
                            <div class="data">${maps[match.map].name}</div>
                        </div>
                        <div class="info">
                            <div class="title">Stack</div>
                            <div class="data">${match.stack}x</div>
                        </div>
                        <div class="info">
                            <div class="title">Created</div>
                            <div class="data">${simpleDateTime(match.created_at)}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        $('#played-with-against-popup > .match-list').html(matchesPopup);

        $('#played-with-against-popup').off().on('click', function(e) {
            if (e.target.tagName !== 'DIALOG') { return }
        
            const rect = e.target.getBoundingClientRect();
            const clickedInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
        
            if (clickedInDialog === false) {
                $('#played-with-against-popup')[0].close();
                $('#played-with-against-popup')[0].remove();
            }
        });

    });

    if ($('#outcome_tab_place > tr').length) {
        $('#outcome_tab_sw').trigger('click');
    }
    else {
        $('#ranked_stats_sw').trigger('click');
        $('#details-switch').hide();
    }
};
function getServerName(server) {
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







/* -------------------------------------------

    Find new matches OR view existing matches

*/

let stuffData = {
    new_match: {
        loaded: false,
        load_fn: loadUpMaps,
        load_fn_await: false,
        div_id: 'match-tracker',
        last_loaded: null,
        data_lifetime_minutes: 1,
        visible: newMatchVisible,
    },
    existing_matches: {
        loaded: false,
        load_fn: loadTrackedMatches,
        load_fn_await: true,
        div_id: 'match-viewer',
        last_loaded: null,
        data_lifetime_minutes: 5,
    },
    marked_players: {
        loaded: false,
        load_fn: loadMarkedPlayers,
        load_fn_await: true,
        div_id: 'marked-players',
        last_loaded: null,
        data_lifetime_minutes: 3,
        visible: newMatchVisible,
    },
    servers_stats: {
        loaded: false,
        load_fn: loadServerStats,
        load_fn_await: true,
        div_id: 'servers-stats',
        last_loaded: null,
        data_lifetime_minutes: 0,
    },
};


Object.keys(stuffData).forEach(async stuff => {
    if (!stuffData[stuff]?.visible) { return }
    if (await stuffData[stuff].visible()) { return }

    $(`#${stuff}`).hide();
    $(`#${stuff}`).remove();
    delete stuffData[stuff];
});


$('#stuff-switch > .switcharoo > .btn').on('click', async function() {
    let showStuff = this.id;

    if (!document.startViewTransition) { await toggleViews() }
    else { document.startViewTransition(async () => { await toggleViews() }) }
    
    async function toggleViews() {
        // Hide everything
        $('main').hide();

        // If we have a cache lifetime, check if we need to reload the data
        if (stuffData[showStuff].data_lifetime_minutes && stuffData[showStuff].last_loaded) {
            let now = new Date();
            let lastLoaded = new Date(stuffData[showStuff].last_loaded);
            let diff = now - lastLoaded;

            if (diff > stuffData[showStuff].data_lifetime_minutes * 60 * 1000) {
                stuffData[showStuff].loaded = false;
            }
        }

        // Load the stuff if not loaded yet
        if (!stuffData[showStuff].loaded) {
            stuffData[showStuff].loaded = true;
            stuffData[showStuff].last_loaded = new Date();
            if (stuffData[showStuff].load_fn_await) { await stuffData[showStuff].load_fn() }
            else { stuffData[showStuff].load_fn() }
        }

        // Show the wanted stuf
        $(`#${stuffData[showStuff].div_id}`).show();

        // Update the URL
        let url = new URL(window.location.href);
        url.searchParams.delete('matchId');
        url.searchParams.set('stuff', showStuff);
        window.history.pushState({}, '', url);
    };

});
if (stuff) { $(`#${stuff}`).trigger('click') }





/* -------------------------
    Existing matches viewer
*/

async function loadTrackedMatches() {
    let spnr = spinner();
    $('#tracked-matches-seasonal-switch').after(spnr);

    $('#tracked-matches').html('');

    let matchQuery = supabase
        .from('tracked_matches')
        .select('id, outcome, created_at, map, stack, our_team, enemy_team')
        .eq('season', matchSelectedSeason)
        .order('created_at', { ascending: false });

    let { data: matches } = await matchQuery.range(0, matchOffset);

    await showTrackedMatches(matches);

    if (!$('[data-load-more]').length) {
        $('#match-viewer').append(`<div data-load-more class="btn" data-type="warning">Load more</div>`);
    }
    
    $('[data-load-more]').off().on('click', async function() {
        $(this).html(spinner());

        let { data: moreMatches } = await matchQuery.range(matchOffset+1, matchOffset+matchOffsetCnt);
        matchOffset += matchOffsetCnt;

        await showTrackedMatches(moreMatches);

        if (moreMatches.length < matchOffsetCnt) {
            return $(this).remove();
        }

        $(this).html('Load more');
    });

    spnr.remove();
    $('#tracked-matches').fadeIn('fast');
};
async function showTrackedMatches(matches) {
    let markedCheaters = await _getMarkedCheaters();

    matches.forEach(match => {
        let map = maps[match.map].name;
        let created_at = simpleDateTime(match.created_at);
        let outcome = _parseMatchOutcome(match?.outcome);
        let akschuns = '';

        akschuns += `<a class="btn smol" data-show-match="${match.id}" data-type="magic">Details</a>`;
        akschuns += match.outcome ? '' : `<a data-update-archived="${match.id}" class="btn smol" data-type="note">Ended?</a>`;

        let marked_cheaters = '<div class="info"></div>';
        let marked_count = 0;
        let banned_count = 0;
        let allPlayers = match.our_team ? [...match.our_team, ...match.enemy_team] : [];
        allPlayers.forEach(player => {
            if (markedCheaters[player]) { marked_count++; }
            if (markedCheaters[player]?.ban_info) { banned_count++; }
        });

        if (marked_count) {
            marked_cheaters = `
                <div class="info">
                    <div class="title">Cheaters</div>
                    <div class="data">${marked_count}${banned_count ? `<span title="Banned"> (${banned_count})</span>` : ''}</div>
                </div>
            `;
        }

        $('#tracked-matches').append(`
            <div data-match-id="${match.id}" data-has-cheaters-marked="${marked_count!==0}" data-has-cheaters-banned="${banned_count!==0}">
                <div class="outcome" data-outcome="${outcome.sysid}" style="--_bg-map-img: url('${maps[match.map].src}'); view-transition-name: score_${match.id}">
                    ${outcome.html}
                </div>
                <div class="middle">
                    <div class="info">
                        <div class="title">Map</div>
                        <div class="data">${map}</div>
                    </div>
                    <div class="info">
                        <div class="title">Stack</div>
                        <div class="data" style="view-transition-name: stack_${match.id};">${match.stack}</div>
                    </div>
                    <div class="info">
                        <div class="title">Created</div>
                        <div class="data" style="view-transition-name: map_name_${match.id};">${created_at}</div>
                    </div>
                    ${marked_cheaters}
                </div>
                <div class="actions">${akschuns}</div>
            </div>
        `);

    });

    async function _getMarkedCheaters() {
        if (markedCheatersCache !== undefined) {
            return markedCheatersCache.data;
        }

        let cheatersDb = await supabase.from('siege_marked_players').select('ubi_id, game, ban_info').eq('why', 'cheater');
        let cheaters = cheatersDb.data.reduce((acc, cur) => { acc[cur.ubi_id] = cur; return acc; }, {});

        markedCheatersCache = { date: new Date(), data: cheaters };
        return markedCheatersCache.data;
    };

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

                let outcome = _parseMatchOutcome(data.outcome);
                $(`[data-match-id="${data.matchId}"] > .outcome`).attr('data-outcome', outcome.sysid).html(outcome.html);

                delete matchDetailsCache[matchId];
            }
            else {
                $(this).html('Ended??');
            }
        });

    });

    $('[data-show-match]').off().on('click', async function() {
        await showMatchDetails(this.dataset.showMatch);
    });

    return true;
};
function _parseMatchOutcome(data) {
    let ret = { html: '', sysid: '' };

    if (!data) { return ret; }

    if ((data.our_outcome + data.their_outcome) < 4) {
        data.our_outcome = 0;
        data.their_outcome = 0;
        ret.sysid = 'cancelled';
    }

    if (data.our_outcome > data.their_outcome) { ret.sysid = 'won' }
    if (data.our_outcome < data.their_outcome) { ret.sysid = 'lost' }
    
    ret.html = `
        <div class="our_outcome">${data.our_outcome}</div>
        <div class="separator">:</div>
        <div class="their_outcome">${data.their_outcome}</div>
    `;

    return ret;
};

async function showMatchDetails(matchId) {
    if (!document.startViewTransition) { await matchDetailsTransition() }
    else { document.startViewTransition(async () => { await matchDetailsTransition() }) }

    async function matchDetailsTransition() {
        $('#match-viewer').hide();
        await loadMatchDetails(matchId);
    };

    let url = new URL(window.location.href);
    url.searchParams.delete('stuff');
    url.searchParams.set('matchId', matchId);
    window.history.pushState({}, '', url);
};

function simpleDateTime(date) {
    let d = new Date(date);
    let hrs = d.getHours();
    let mins = d.getMinutes();
    if (hrs < 10) { hrs = '0' + hrs; }
    if (mins < 10) { mins = '0' + mins; }
    return `${d.getDate()}. ${d.getMonth() + 1}. '${d.getFullYear().toString().substr(-2)} ${hrs}:${mins}`;
};



/* ------------------
    New match finder
*/

async function newMatchVisible() {
    if (!UUID) { return false; }
    return newMatchVisibleCache.count > 0;
};

async function loadUpPlayers() {
    if (diskitoPlayersCache) { return diskitoPlayersCache; }

    let { data: playersDb } = await supabase.from('siege_stats').select('ubi_id, name').order('name', { ascending: true });
    diskitoPlayersCache = playersDb;

    return diskitoPlayersCache;
};

function loadUpMaps() {

    if ($('#maps > .map').length) {
        $('#maps > .map').removeClass('selected');
        $('#find-match-parent').html('<div id="find-match-errors" style="display: none;"></div><div id="find-match">Find match</div>');
        $('#find-match').on('click', async function() { findMatch(this) });
        return;
    }

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

$('#find-match').on('click', async function() { findMatch(this) });
function findMatch(that) {
    let errors = false;
    $('#find-match-errors').hide();
    
    that.innerHTML = spinner(true);

    let map = $('#maps > .map.selected').attr('data-sysid');
    let matchId = undefined;
    let requestedBy = currentUserDiscordId;

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
        .then(async data => {
            
            if (data?.matchId) {
                $('#find-match').replaceWith(`<button class="btn big" data-type="success" onclick="location.href='/matches?matchId=${data.matchId}'">Match details</button>`);
                $('#find-match-parent').append(message(`Took ${roundTwo(data.time)}s 😅`, 'note'));
            }
            else if (data?.requestedBy) {
                that.innerHTML = '🫡🫡';
                let byWho = await supabase.from('users').select('username').eq('id', data.requestedBy);
                $('#find-match-parent').prepend(message(`A match on <b><i>${maps[data.map].name}</i></b> is currently being searched by <b><i>${byWho.data[0].username}</i></b>`, 'warning'));
            }
            else {
                $('#find-match').replaceWith(`<button class="btn big" onclick="location.reload();" data-type="error">Try again..</button>`);
                $('#find-match-parent').prepend(message('No match found..', 'error'));
            }

        });

    }
    else {
        that.innerHTML = 'Try again..';
    }
};



/* -----------------------
    Marked players viewer
*/

async function loadMarkedPlayers() {
    $('#marked_players_list > tbody').html('');

    let { data: markedPlayers } = await supabase
        .from('marked_players')
        .select('ubi_id, name, game_id, why, username, ban_info')
        .order('created_at', { ascending: false });
    
    markedPlayers.forEach(player => {
        let why = `<div class="btn smol" data-type="${player.why === 'cheater' ? 'error' : 'warning'}">${player.why[0].toUpperCase() + player.why.slice(1)}</div>`;
        let outcome = `<div class="btn smol" data-show-match="${player.game_id}" data-type="magic">Details</div>`;
        let actions = '';

        if (!player.ban_info) {
            actions += `<div data-unmark="${player.ubi_id}" class="btn smol" data-type="note">Unmark</div>`;
        }

        let banned = 'Not yet..';
        if (player.why === 'retard') { banned = '-' }
        if (player.ban_info) {
            banned = `
                <div class="reason">${player.ban_info.reason}</div>
                <div class="date">${simpleDateTime(player.ban_info.posted)}</div>
            `;
        }

        $('#marked_players_list > tbody').append(`
            <tr class="marked_player" data-ubi-id="${player.ubi_id}">
                <td data-what="name">${player.name}</td>
                <td data-what="why">${why}</td>
                <td data-what="outcome"><div>${outcome}</div></td>
                <td data-what="by">${player.username}</td>
                <td data-what="banned" data-banned="${!!(player.ban_info)}">${banned}</td>
                <td data-what="akschuns"><div>${actions}</div></td>
            </tr>
        `);
    });

    $('[data-show-match]').off().on('click', async function() {
        $('#marked-players').hide();
        await showMatchDetails(this.dataset.showMatch);
    });

    $('[data-unmark]').off().on('click', async function() {
        $(this).html(spinner());
        let unmarked = await supabase.from('siege_marked_players').delete().eq('ubi_id', this.dataset.unmark);

        if (unmarked.status === 204) {
            $(`[data-ubi-id="${this.dataset.unmark}"]`).slideUp();
        }
        else {
            $(this).html('Unmark');
        }

    });
};



/* ---------------------
    Server stats viewer
*/

async function loadServerStats() {
    let spinnerDivs = ['ss-created_at', 'ss-total_players_games', 'players_per_mode > .data', 'players_per_datacenter > .data', 'games_per_mode > .data', 'games_per_datacenter > .data'];
    spinnerDivs.forEach(spinnerDiv => { $(`#${spinnerDiv}`).html(spinner()) });

    let statsDB = await supabase.from('siege_player_stats').select('*').order('created_at', { ascending: false }).limit(1);
    let stats = statsDB.data[0];

    $('#ss-created_at').html(`Created at <b>${simpleDateTime(stats.created_at)}</b>`);
    $('#ss-total_players_games').html(`Total of <b>${addSpaces(stats.total_players, ',')}</b> players in <b>${addSpaces(stats.games, ',')}</b> games.`);

    let wtf = ['players_per_mode', 'players_per_datacenter', 'games_per_mode', 'games_per_datacenter'];
    wtf.forEach(wtf_ => {
        let hmlt = '';
        Object.entries(stats[wtf_]).sort((a, b) => b[1] - a[1]).forEach(([thing, count]) => {
            let key = '💀';
            key = (getServerName(thing) == thing) ? key : getServerName(thing);
            key = (getGamemodeName(thing) == thing) ? key : getGamemodeName(thing);

            hmlt += `
                <div class="val">${addSpaces(count, ',')}</div>
                <div class="key">${key}</div>
            `;
        });
        $(`#${wtf_} > .data`).html(hmlt);
    });

};
function getGamemodeName(gamemode) {
    if (!gamemode) { return 'Unknown' }

    return {

        "PVE_Bots_Game": 'PVE - Bots',
        "PVE_Maprun_Game": 'PVE - Maprun',
        "PVP_Casual_Game": 'Casual',
        "PVP_Ranked_Game": 'Ranked',
        "PVP_Warmup_Game": 'Warmup',
        "MatchReplay_Game": 'Match Replay',
        "PVP_Unranked_Game": 'Unranked',
        "PVE_Tutorials_Game": 'Tutorial',
        "PVE_MapRun_Party_Game": 'PVE - Maprun Party',
        "PVE_shootingrange_Game": 'Shooting Range',
        "PVE_COOP_Party_Bots_Game": 'PVE - Bots Party',
        "PVE_COOP_Matchmaking_Bots_Game": 'PVE - Bots MM',

    }[gamemode] || gamemode;
};
