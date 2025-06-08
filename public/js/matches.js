import { c, supabase, spinner, message, userAuth, roundTwo, addSpaces, UUID } from './main.js';
import { _getRankImageFromRankName } from './siege.js';



let maps = {
    bartlett:      { owId: '0000000000000000', name: 'Unknown',        src: '/images/maps/shooting_range.jpg' },
    bank:          { owId: '00000052C53F0506', name: 'Bank',           src: '/images/maps/bank.png'           },
    border:        { owId: '000000473DCA77EF', name: 'Border',         src: '/images/maps/border.png'         },
    chalet:        { owId: '0000003C7E4A5A5D', name: 'Chalet',         src: '/images/maps/chalet.png'         },
    clubhouse:     { owId: '0000000031E6DF85', name: 'Club House',     src: '/images/maps/clubhouse.png'      },
    coastline:     { owId: '00000009CCC3D997', name: 'Coastline',      src: '/images/maps/coastline.png'      },
    consulate:     { owId: '000000584B31FC7D', name: 'Consulate',      src: '/images/maps/consulate.png'      },
    emeraldplains: { owId: '000000550CA6FED4', name: 'Emerald Plains', src: '/images/maps/emeraldplains.png'  },
    kafe:          { owId: '00000000522587EA', name: 'Kafe',           src: '/images/maps/kafe.png'           },
    kanal:         { owId: '00000000570932C9', name: 'Kanal',          src: '/images/maps/kanal.png'          },
    lair:          { owId: '0000005A5AF8ECF7', name: 'Lair',           src: '/images/maps/lair.png'           },
    nhvnlabs:      { owId: '00000058260EEFB3', name: 'NHVN Labs',      src: '/images/maps/nighthavenlabs.png' },
    oregon:        { owId: '00000035F2901CF4', name: 'Oregon',         src: '/images/maps/oregon.png'         },
    outback:       { owId: '000000546CF2DD4F', name: 'Outback',        src: '/images/maps/outback.png'        },
    skyscraper:    { owId: '0000004053835E1E', name: 'Skyscraper',     src: '/images/maps/skyscraper.png'     },
    themepark:     { owId: '0000002E8679C826', name: 'Theme Park',     src: '/images/maps/themepark.png'      },
    villa:         { owId: '00000014839B2B18', name: 'Villa',          src: '/images/maps/villa.png'          },
};


let hasAccInDiskito = null;
let rosterIdToUuid = {};
let uuidToRosterId = {};
let matchId = new URLSearchParams(window.location.search).get('match');
if (matchId) {
    let { data: hasAcc } = await supabase.rpc('sm_has_game_acc');
    hasAccInDiskito = hasAcc;

    let { data: matchData } = await supabase.from('siege_matches').select('*').eq('id', matchId).single();
    await showOneMatch(matchData);

    supabase
        .channel(`match_updates_${matchId}`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'siege_matches', filter: `id=eq.${matchId}` },
            (payload) => { updateOneMatch(payload.new); }
        )
        .subscribe();

}
else {
    await listAllMatches();

    supabase
        .channel(`match_updates_all`)
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'siege_matches' },
            (payload) => { updateOneMatchInList(payload); }
        )
        .subscribe();
}



function getMapByOwId(owId) {
    if (owId === '0000000000000000') return maps.bartlett; // Default to Bartlett if no map is specified
    return Object.values(maps).find(map => map.owId === owId) || maps.bartlett;
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
function _getRankImageFromRankId(id) {
    let rank_dict = {
      0: "0OFVqkI",
      0: "0OFVqkI",
  
      1: "Ux1rDjw",
      2: "7YWtMtV",
      3: "LrHvwNs",
      4: "IIBimaN",
      5: "oLZwkBa",
  
      6: "aQNXHQR",
      7: "UgKcPME",
      8: "DgVk34E",
      9: "xsJGsmE",
      10: "ktm9OM0",
  
      11: "tinDJ0V",
      12: "DTfqnBz",
      13: "V6V5iyx",
      14: "Xfrp58b",
      15: "6HpERmx",
  
      16: "GtTe4bu",
      17: "4kpPsMS",
      18: "tnX9jpW",
      19: "uVjR5kD",
      20: "tJ3tVr2",
  
      21: "WO3pfUp",
      22: "6Mev2HS",
      23: "wV52ySL",
      24: "qd71ZiS",
      25: "WU6vjNa",
  
      26: "KXtH98u",
      27: "YSaeYN6",
      28: "itcnov9",
      29: "eEYH4bl",
      30: "8FQRvNX",
  
      31: "ioGplDE",
      32: "arhoFpA",
      33: "RXAvoqX",
      34: "3BuBrb1",
      35: "miyZ9Yr",
  
      36: "fTA4VtR",
      36: "fTA4VtR",
    }
    return rank_dict[id] ? `https://i.imgur.com/${rank_dict[id]}.png` : rank_dict[0];
};

function om_getRosterOrder(team, score) {
    return `${team}${50_000 - score}`;
};
function om_drawRounds(roundsData) {
    $('#matchRounds').empty().show();

    let roundCounter = 0; // to keep track of the round number
    roundsData.forEach((round, idx) => {
        // only process round_end events unless the round_start is the last event
        // that means the round is in progress
        if (round.type !== 'round_end' && idx !== roundsData.length - 1) {
            return;
        }
        roundCounter++;

        let winnerRole = round.win_role;
        let loserRole = winnerRole == 'Defender' ? 'Attacker' : 'Defender';

        let imgDef = '/images/siege_def.png';
        let imgAtk = '/images/siege_atk.png';

        let viVon = round.round_won;
        let ourRole = viVon ? winnerRole : loserRole;
        let ourRoleImg = ourRole == 'Defender' ? imgDef : imgAtk;
        ourRoleImg = ourRoleImg.replace('.png', '_shadow.png');

        let roundTimeMinutes = 0;
        let roundTimeSeconds = 0;

        if (round.type === 'round_start') {
            viVon = 'in_progress';

            let currentTime = Math.floor((new Date() - new Date(round.time)) / 1000);
            roundTimeMinutes = Math.floor(currentTime / 60);
            roundTimeSeconds = currentTime % 60;
        }
        else {
            let roundStart = new Date(roundsData[idx-1].time);
            let roundEnd = new Date(round.time);
            let roundDuration = Math.floor((roundEnd - roundStart) / 1000); // in seconds
            roundTimeMinutes = Math.floor(roundDuration / 60);
            roundTimeSeconds = roundDuration % 60;
        }

        // after 3rd, 6th, 7th and 8th rounds add a divider
        if ([4, 7, 8, 9].includes(roundCounter) && round.type === 'round_end') {
            $('#matchRounds').append(`<div class="round-divider"><img src="/icons/matches_swap.svg" /></div>`);
        }

        let bottomPart = '';
        if (round.type === 'round_end') {
            bottomPart = `
                <div class="survivors" title="Survivors">
                    <span class="attack">
                        <img src="${imgAtk}" />
                        <span class="atk">${round.surv_attack}</span>
                    </span>
                    <span class="defend">
                        <img src="${imgDef}" />
                        <span class="def">${round.surv_def}</span>
                    </span>
                </div>
            `;
        }

        $('#matchRounds').append(`
            <div class="round" data-vi-von="${viVon}" data-round="${idx + 1}">
                <img src="${ourRoleImg}" class="role-icon" />
                <div class="info">
                    <div class="time" title="Round playtime">
                        ${roundTimeMinutes}m ${roundTimeSeconds}s
                    </div>
                    ${bottomPart}
                </div>
            </div>
        `);

        if (round.type === 'round_start') {
            // every second update the round time
            let roundElement = $(`.round[data-round="${idx + 1}"]`);
            let roundInterval = setInterval(() => {
                if (roundElement.length === 0) {
                    clearInterval(roundInterval);
                    return;
                }

                let currentTime = Math.floor((new Date() - new Date(round.time)) / 1000);
                let minutes = Math.floor(currentTime / 60);
                let seconds = currentTime % 60;

                roundElement.find('.time').text(`${minutes}m ${seconds}s`);
            }, 1000);
        }

    });

};
function om_drawMatchInfo(matchData) {
    let matchInfoDiv = $('#matchInfo');
    let mapInfo = getMapByOwId(matchData.info?.map);

    matchInfoDiv.find('.map-name').text(mapInfo.name);
    matchInfoDiv.find('.map-image').attr('src', mapInfo.src);

    // score
    matchInfoDiv.find('.score > .num.us').text(matchData.score.us);
    matchInfoDiv.find('.score > .num.them').text(matchData.score.them);

    // playtime
    let lastRound = matchData.round_start_end[matchData.round_start_end.length - 1];
    let matchStart = new Date(matchData.created_at);
    let matchEnd = matchData.finished ? new Date(lastRound.time) : new Date();

    let matchDuration = Math.floor((matchEnd - matchStart) / 1000); // in seconds
    let matchDurationMinutes = Math.floor(matchDuration / 60);
    let matchDurationSeconds = matchDuration % 60;

    matchInfoDiv.find('.playtime').text(`${matchDurationMinutes}m ${matchDurationSeconds}s`);

    let timerInterval = null;
    if (!matchData.finished) {
        // update the timer every second
        timerInterval = setInterval(() => {
            let currentTime = Math.floor((new Date() - matchStart) / 1000);
            let minutes = Math.floor(currentTime / 60);
            let seconds = currentTime % 60;
            matchInfoDiv.find('.playtime').text(`${minutes}m ${seconds}s`);
        }, 1000);
    }
    else {
        clearInterval(timerInterval);
    }

};


async function listAllMatches() {

    $('#matchesList').empty().show().append(spinner());

    let { data: matchesData } = await supabase
        .from('siege_matches')
        .select('id, score, info, finished, created_at')
        .order('created_at', { ascending: false });

    let matchesHtml = '';
    matchesData.forEach(match => {
        let viVon = match.score.us > match.score.them;

        let matchTags = [];
        if (match.finished) {
            matchTags.push(`<span class="tag ${viVon ? 'match-won' : 'match-lost'}">${viVon ? 'Won' : 'Lost'}</span>`);
        }
        else {
            matchTags.push(`<span class="tag match-in-progress">In Progress</span>`);
        }
        matchTags.push(`<span class="tag match-score">${match.score.us} - ${match.score.them}</span>`);

        let mapInfo = getMapByOwId(match.info.map);

        matchesHtml += `
            <div class="match" data-match-id="${match.id}">
                <img class="map-image" src="${mapInfo.src}" />
                <div class="match-info">
                    <div class="tags">${matchTags.join('')}</div>
                    <div class="match-details">
                        <div class="deet">
                            <img src="/icons/matches_globe.svg" />
                            <span class="map-name">${mapInfo.name}</span>
                        </div>
                        <div class="deet">
                            <img src="/icons/matches_clock.svg" />
                            <span>${new Date(match.created_at).toLocaleString()}</span>
                        </div>
                    </div>
                    <a href="/matches?match=${match.id}" class="view-match">
                        <span>View Match</span>
                        <img src="/icons/matches_chevron_right.svg" />
                    </a>
                </div>
            </div>
        `;
    });
    $('#matchesList').empty().append(matchesHtml);

}
function updateOneMatchInList(payload) {

    if (payload.eventType === 'INSERT') {
        // am lazy, just reload the page
        window.location.reload();
    }
    if (payload.eventType === 'DELETE') {
        // we dont care about deletes
        return;
    }

    let matchData = payload.new;
    if (!matchData.id) { return; }

    let matchElement = $(`.match[data-match-id="${matchData.id}"]`);

    matchElement.find('.match-info > .tags > .match-score').text(`${matchData.score.us} - ${matchData.score.them}`);
    matchElement.find('.map-image').attr('src', getMapByOwId(matchData.info.map).src);
    matchElement.find('.map-name').text(getMapByOwId(matchData.info.map).name);

    let inProgressTagExists = matchElement.find('.match-info > .tags > .match-in-progress').length > 0;

    if (matchData.finished && inProgressTagExists) {
        // match has just finished
        let viVon = matchData.score.us > matchData.score.them;
        matchElement.find('.match-info > .tags > .match-in-progress').remove();
        matchElement.find('.match-info > .tags').append(`<span class="tag ${viVon ? 'match-won' : 'match-lost'}">${viVon ? 'Won' : 'Lost'}</span>`);
    }

};

async function showOneMatch(matchData) {
    $('#matchDetails').show();

    let bothTeamUuids = [...matchData.team_uuids_enemy, ...matchData.team_uuids_us];
    let { data: markedPlayersDb } = await supabase.from('siege_marked_players').select('id, player, type').in('player', bothTeamUuids).select('*')
    let markedPlayers = {};
    bothTeamUuids.forEach(uuid => { markedPlayers[uuid] = {}; }); // initialize all players with empty array
    markedPlayersDb.forEach(markedPlayer => { markedPlayers[markedPlayer.player][markedPlayer.type] = markedPlayer.id; });

    om_drawMatchInfo(matchData);

    // Rounds info
    if (matchData.round_start_end.length > 0) {
        om_drawRounds(matchData.round_start_end);
    }

    // figure out who from the roster is who in the match
    let allUuidsRoster = [...matchData.team_uuids_enemy, ...matchData.team_uuids_us];
    Object.entries(matchData.roster).forEach(([rosterId, rosterData]) => {
        let rosterNameParsedParsed = rosterData.name_parsed.replace(/(\[.*\])/, '').trim();
        allUuidsRoster.forEach(uuid => {
            let profileData = matchData.stats[uuid];

            if (profileData.name === rosterData.name) {
                rosterIdToUuid[rosterId] = uuid;
            }
            else if (profileData.persona && profileData.persona === rosterNameParsedParsed) {
                rosterIdToUuid[rosterId] = uuid;
            }

            if (rosterIdToUuid[rosterId]) {
                // remove the rosterId from allUuidsRoster if it has been assigned
                allUuidsRoster = allUuidsRoster.filter(u => u !== rosterIdToUuid[rosterId]);
            }
        });
    });

    // theoretically one rogue uuid could remain in allUuidsRoster
    // if it did, we know that it is the last player in the roster
    if (allUuidsRoster.length === 1) {
        let lastUuid = allUuidsRoster[0];
        let missingRosterId = Object.keys(matchData.roster).find(rosterId => !rosterIdToUuid[rosterId]);
        rosterIdToUuid[missingRosterId] = lastUuid;
        allUuidsRoster = allUuidsRoster.filter(u => u !== lastUuid);
    }

    // Create a reverse mapping from UUID to roster ID
    Object.entries(rosterIdToUuid).forEach(([rosterId, uuid]) => { uuidToRosterId[uuid] = rosterId; });


    // Player Stats
    if (hasAccInDiskito) {
        $('#playerStats').addClass('auth');
        $('#playerStats > .header').append('<span></span><span>Mark</span>');
    }
    [...matchData.team_uuids_enemy, ...matchData.team_uuids_us].forEach((uuid, idx) => {
        let stats = matchData.stats[uuid];
        let rosterData = matchData.roster[uuidToRosterId[uuid]];

        if (idx === 5) { $('#playerStats').append('<div class="team-divider" style="order:60000;"></div>'); }

        let kdRanked = stats.ranked.deaths == 0 ? stats.ranked.kills : roundTwo(stats.ranked.kills / stats.ranked.deaths);
        let wlRanked = stats.ranked.losses == 0 ? 0 : roundTwo(stats.ranked.wins / (stats.ranked.wins + stats.ranked.losses) * 100);

        let styleOrder = 'order: 9999999;';
        let kdGame = 0;
        let kdaGame = '0 / 0 / 0';
        let scoreGame = 0;
        if (rosterData) {
            kdGame = rosterData.kills == 0 ? 0 : roundTwo(rosterData.kills / rosterData.deaths);
            kdaGame = `${rosterData.kills} / ${rosterData.deaths} / ${rosterData.assists}`;
            scoreGame = rosterData.score || 0;
            styleOrder = `order: ${om_getRosterOrder(rosterData.team, rosterData.score)};`;

            if (kdGame === Infinity) {
                kdGame = rosterData.kills;
            }
        }

        let markHtml = '';
        if (hasAccInDiskito) {
            markHtml = `
                <div class="divider"></div>
                <div class="mark" data-mark-uuid="${uuid}">
                    <img data-mark-type="cheater" data-marked="${'cheater' in markedPlayers[uuid]}" data-marked-id="${markedPlayers[uuid]?.cheater || 0}" src="/icons/matches_flag.svg" />
                    <img data-mark-type="stoopid" data-marked="${'stoopid' in markedPlayers[uuid]}" data-marked-id="${markedPlayers[uuid]?.stoopid || 0}" src="/icons/matches_intelligence.svg" />
                    <img data-mark-type="good"    data-marked="${'good' in markedPlayers[uuid]}"    data-marked-id="${markedPlayers[uuid]?.good || 0}"    src="/icons/matches_heart.svg" />
                </div>
            `;
        }

        $('#playerStats').append(`
            <div class="player" data-player-stats="${uuid}" style="${styleOrder}">

                <img src="https://ubisoft-avatars.akamaized.net/${uuid}/default_256_256.png" class="avatar" />

                <div class="name">
                    <span>${stats.name}</span>
                    ${stats.persona ? `<span class="persona">${stats.persona}</span>` : ''}
                </div>

                <div class="rank">
                    <img src="${_getRankImageFromRankId(stats.ranked.rank)}" class="rank-image" />
                    <span class="rank-points">${addSpaces(stats.ranked.rank_points)}</span>
                </div>

                <div class="ranked-kd">
                    <span class="main">${kdRanked}</span>
                    <span class="smol-dark">${addSpaces(stats.ranked.kills)} / ${addSpaces(stats.ranked.deaths)}</span>
                </div>

                <div class="ranked-wl">
                    <span class="main">${wlRanked}%</span>
                    <span class="smol-dark">${addSpaces(stats.ranked.wins)} / ${addSpaces(stats.ranked.losses)}</span>
                </div>

                <div class="links">
                    <a target="_blank" href="https://r6.tracker.network/r6siege/profile/ubi/${uuid}">TRN</a>
                    <a target="_blank" href="https://stats.cc/siege/-/${uuid}">s.cc</a>
                </div>

                <div class="divider"></div>

                <div class="game-kda">
                    <span class="main">${kdGame}</span>
                    <span class="smol-dark">${kdaGame}</span>
                </div>

                <div class="score">
                    ${addSpaces(scoreGame, ',')}
                </div>

                ${markHtml}

            </div>
        `)

    });

    if (hasAccInDiskito) {
        $('[data-mark-type]').on('click', async function() {
            if (this.dataset.marked == 'loading') return;
            
            let datasetBefore = this.dataset.marked == 'true';
            this.dataset.marked = 'loading';
            
            let { data: changeMarkData } = await supabase.rpc('sm_mark_player', { prm_player: this.parentElement.dataset.markUuid, prm_type: this.dataset.markType });
            
            // only handle the error, the rest is handled by the realtime listener
            if (!changeMarkData.ok) { this.dataset.marked = datasetBefore; }
        });

        // also create a realtime listener for marked players and update the UI accordingly
        supabase
            .channel(`marked_players_match_${matchData.id}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'siege_marked_players' },
                (payload) => {
                    if (payload.eventType === 'DELETE') {
                        $(`[data-mark-type][data-marked-id="${payload.old.id}"]`)[0].dataset.marked = 'false';
                    }
                    else if (payload.eventType === 'INSERT') {
                        let markImg = $(`[data-mark-uuid="${payload.new.player}"] > [data-mark-type="${payload.new.type}"]`)[0];
                        markImg.dataset.marked = 'true';
                        markImg.dataset.markedId = payload.new.id || 0;
                    }
                }
            )
            .subscribe();
    }

};
function updateOneMatch(matchData) {

    om_drawMatchInfo(matchData);

    if (matchData.round_start_end) {
        om_drawRounds(matchData.round_start_end);
    }

    if (matchData.roster) {
        [...matchData.team_uuids_enemy, ...matchData.team_uuids_us].forEach(uuid => {
            let playerRow = $(`.player[data-player-stats="${uuid}"]`);
            if (playerRow.length === 0) return; // Player row not found, skip

            let rosterStats = matchData.roster[uuidToRosterId[uuid]];

            let kdGame = rosterStats.kills == 0 ? 0 : roundTwo(rosterStats.kills / rosterStats.deaths);
            if (kdGame === Infinity) { kdGame = '∞'; }

            let kdaGame = `${rosterStats.kills || 0} / ${rosterStats.deaths || 0} / ${rosterStats.assists || 0}`;



            playerRow.find('.game-kda > .main').text(kdGame);
            playerRow.find('.game-kda > .smol-dark').text(kdaGame);

            playerRow.find('.score').text(addSpaces(rosterStats.score || 0, ','));

            playerRow.css('order', om_getRosterOrder(rosterStats.team, rosterStats.score));
        });
    }

};
