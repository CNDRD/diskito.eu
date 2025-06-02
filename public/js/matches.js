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
                        <div class="started-at">
                            <img src="/icons/matches_clock.svg" />
                            <span>${new Date(match.created_at).toLocaleString()}</span>
                        </div>
                        <div class="datacenter">
                            <img src="/icons/matches_globe.svg" />
                            <span>${getServerName(match.info.datacenter)}</span>
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

await listAllMatches();
