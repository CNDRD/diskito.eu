import { c, supabase, spinner, message, userAuth, roundTwo, addSpaces, UUID } from './main.js';
import { _getRankImageFromRankName } from './siege.js';



let maps = {
    bartlett:      { owId: '0000000000000000', name: 'Unknown',        src: '/images/maps/shooting_range.jpg' },
    bank:          { owId: '0000000000000000', name: 'Bank',           src: '/images/maps/bank.png'           },
    border:        { owId: '0000000000000000', name: 'Border',         src: '/images/maps/border.png'         },
    chalet:        { owId: '0000003C7E4A5A5D', name: 'Chalet',         src: '/images/maps/chalet.png'         },
    clubhouse:     { owId: '0000000000000000', name: 'Club House',     src: '/images/maps/clubhouse.png'      },
    coastline:     { owId: '0000000000000000', name: 'Coastline',      src: '/images/maps/coastline.png'      },
    consulate:     { owId: '0000000000000000', name: 'Consulate',      src: '/images/maps/consulate.png'      },
    emeraldplains: { owId: '0000000000000000', name: 'Emerald Plains', src: '/images/maps/emeraldplains.png'  },
    kafe:          { owId: '0000000000000000', name: 'Kafe',           src: '/images/maps/kafe.png'           },
    kanal:         { owId: '0000000000000000', name: 'Kanal',          src: '/images/maps/kanal.png'          },
    lair:          { owId: '0000000000000000', name: 'Lair',           src: '/images/maps/lair.png'           },
    nhvnlabs:      { owId: '0000000000000000', name: 'NHVN Labs',      src: '/images/maps/nighthavenlabs.png' },
    oregon:        { owId: '0000000000000000', name: 'Oregon',         src: '/images/maps/oregon.png'         },
    outback:       { owId: '0000000000000000', name: 'Outback',        src: '/images/maps/outback.png'        },
    skyscraper:    { owId: '0000000000000000', name: 'Skyscraper',     src: '/images/maps/skyscraper.png'     },
    themepark:     { owId: '0000000000000000', name: 'Theme Park',     src: '/images/maps/themepark.png'      },
    villa:         { owId: '0000000000000000', name: 'Villa',          src: '/images/maps/villa.png'          },
};



let matchId = new URLSearchParams(window.location.search).get('match');
if (matchId) {
    await showOneMatch(matchId);
}
else {
    await listAllMatches();
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
        if (mapInfo.name === 'Unknown') {
            matchTags.push(`<span class="tag unknown-map">Unknown Map</span>`);
        }

        matchesHtml += `
            <div class="match">
                <img src="${mapInfo.src}" />
                <div class="match-info">
                    <div class="tags">${matchTags.join('')}</div>
                    <div class="match-details">
                        <div class="deet">
                            <img src="/icons/matches_globe.svg" />
                            <span>${mapInfo.name}</span>
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

};
async function showOneMatch(mid) {
    let { data: matchData } = await supabase.from('siege_matches').select('*').eq('id', mid).single();
    $('#matchDetails').show();



    // Rounds info
    if (matchData.round_start_end.length > 0) {
        let roundTimes = {};  // round_id: seconds

        let lastRoundStart = null;
        matchData.round_start_end.forEach(round => {
            if (round.type === 'round_start') {
                lastRoundStart = round.time;
            }
            if (round.type === 'round_end' && lastRoundStart) {
                roundTimes[Object.keys(roundTimes).length + 1] = Math.floor((new Date(round.time) - new Date(lastRoundStart)) / 1000);
                lastRoundStart = null;
            }
        });

        let roundEnds = matchData.round_start_end.filter(round => round.type === 'round_end');
        roundEnds.forEach((round, idx) => {
            let winnerRole = round.win_role;
            let loserRole = winnerRole == 'Defender' ? 'Attacker' : 'Defender';

            let imgDef = '/images/siege_def.png';
            let imgAtk = '/images/siege_atk.png';

            let viVon = round.round_won;
            let ourRole = viVon ? winnerRole : loserRole;
            let ourRoleImg = ourRole == 'Defender' ? imgDef : imgAtk;
            ourRoleImg = ourRoleImg.replace('.png', '_shadow.png');

            let roundTimeMinutes = Math.floor(roundTimes[idx + 1] / 60);
            let roundTimeSeconds = roundTimes[idx + 1] % 60;

            // after 3rd, 6th, 7th and 8th rounds add a divider
            if ([3, 6, 7, 8].includes(idx)) {
                $('#matchRounds').append(`<div class="round-divider"><img src="/icons/matches_swap.svg" /></div>`);
            }

            $('#matchRounds').append(`
                <div class="round" data-vi-von="${viVon}" data-round="${idx + 1}">
                    <img src="${ourRoleImg}" class="role-icon" />
                    <div class="info">
                        <div class="time" title="Round playtime">
                            ${roundTimeMinutes}m ${roundTimeSeconds}s
                        </div>
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
                    </div>
                </div>
            `);

        });

    }





    let rosterIdToUuid = {};
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
    let uuidToRosterId = {};
    Object.entries(rosterIdToUuid).forEach(([rosterId, uuid]) => { uuidToRosterId[uuid] = rosterId; });


    // Player Stats
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
            styleOrder = `order: ${rosterData.team}${50_000 - rosterData.score};`;

            if (kdGame === Infinity) {
                kdGame = '∞';
            }
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

                <div class="divider"></div>

                <div class="game-kda">
                    <span class="main">${kdGame}</span>
                    <span class="smol-dark">${kdaGame}</span>
                </div>

                <div class="score">
                    ${addSpaces(scoreGame, ',')}
                </div>

            </div>
        `)

    });

};

