import { c, supabase, spinner, addSpaces } from './main.js';



let currentYear = new Date().getFullYear();
let yearTwoDigits = currentYear.toString().slice(-2);

$('[data-switcharoo="voice_yr"]').append(`<span data-detail>'${yearTwoDigits}</span>`);



async function makeLeaderboard(what) {

    let w = {
        'xp': {
            nAfter: 'XP',
            col: 'xp',
        },
        'balance': {
            nBefore: '★',
            col: 'money',
        },
        'messages': {
            nAfter: 'msgs',
            col: 'messages',
        },
        'voice': {
            col: 'total_voice',
        },
        'voice_yr': {
            col: 'yearly_total_voice',
        },
    };

    let { data: ldrbrd } = await supabase.from('leaderboards').select('*').gt(w[what].col, 0).order(w[what].col, { ascending: false });



    // do the top 3 thing
    ldrbrd.slice(0, 3).forEach((user, index) => {
        let top3 = $(`#top3 > [data-top3="${index + 1}"]`);
    
        let pfpStack = `<img data-main src="${user.avatar}" alt="Profile Picture">`;
        if (user.decorations?.deco) { pfpStack += `<img data-deco src="${user.decorations.deco}" alt="Decoration">`; }
    
        top3.find('[data-rank]').html(`<div data-pfp-imgs>${pfpStack}</div>`);
        top3.find('[data-name]').text(user.username);

        let statValue = user[w[what].col];
        if (what === 'voice' || what === 'voice_yr') {
            statValue = parseVoiceTime(statValue);
        }
        else {
            statValue = addSpaces(statValue, ',');
        }

        top3.find('[data-stat-value]')
            .text(statValue)
            .attr('data-stat-value-before', w[what]?.nBefore || '')
            .attr('data-stat-value-after', w[what]?.nAfter || '')
        ;
    });



    // now do the full table
    $('#full').empty();

    ldrbrd.forEach((user, index) => {

        let pfpStack = `<img data-main src="${user.avatar}" alt="Profile Picture">`;
        if (user.decorations?.deco) { pfpStack += `<img data-deco src="${user.decorations.deco}" alt="Decoration">`; }

        $('#full').append(`
            <div data-entry data-r="${index + 1}">
                <div data-h="rank">
                    <span data-before="#">${index + 1}</span>
                </div>
                <div data-h="pfp">
                    ${pfpStack}
                </div>
                <div data-h="name">
                    ${user.username}
                </div>
                <div data-h="xp">
                    <span data-before="level">${addSpaces(user.level, ',')}</span>
                    <span data-before="xp">${addSpaces(user.xp, ',')}</span>
                </div>
                <div data-h="messages">
                    <span data-before="msgs">${addSpaces(user.messages, ',')}</span>
                </div>
                <div data-h="money">
                    <span data-before="★">${addSpaces(user.money, ',')}</span>
                </div>
                <div data-h="voice">
                    <span data-before="${currentYear}">${parseVoiceTime(user.yearly_total_voice)}</span>
                    <span data-before="total">${parseVoiceTime(user.total_voice)}</span>
                </div>
                <div data-h="more" style="display:none;">
                    <div data-open-modal data-user-id="${user.id}">
                        <img src="icons/l/file-user.svg" />
                    </div>
                <div>
            </div>
        `);

        if (index < ldrbrd.length - 1) {
            $('#full').append(`<div data-separator></div>`);
        }

    });

};
function parseVoiceTime(seconds, fixedWidth=false) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    let str = `${h}h ${m}m ${s}s`;

    if (h == 0) { str = `${m}m ${s}s`; }
    if (h == 0 && m == 0) { str = `${s}s`; }
    if (h == 0 && m == 0 && s == 0) { str = `-`; }

    if (fixedWidth) {
        str = str.replace(/(\d+)/g, match => {
            return match.length == 1 ? `\xa0\xa0\xa0${match}` : match;
        });
    }

    return str;
};



$('#switcharoo > [data-switcharoo]').on('click', async function() {
    if (this.dataset.active === 'true') return;

    $('#switcharoo > [data-bg-slider]').attr('data-pos', this.dataset.p);
    $('#switcharoo > [data-switcharoo]').attr('data-active', 'false');
    this.dataset.active = 'true';

    await makeLeaderboard(this.dataset.switcharoo);
});

await makeLeaderboard('xp');

