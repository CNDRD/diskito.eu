import { c, supabase, spinner, addSpaces } from './main.js';



let { data: ldrbrd } = await supabase.from('leaderboards').select('*').order('xp', { ascending: false });

$('[data-current-year]').prepend(new Date().getFullYear());

ldrbrd.forEach(user => {
    let username = user.username;
    if (username.slice(-2) == '#0') { username = username.slice(0, -2); }

    $('main > table > tbody').append(`
        <tr>
            <td data-what="pfp">
                <img src="${user.avatar}" />
            </td>

            <td data-what="name" data-sort="${username}">
                ${username}
            </td>

            <td data-what="lvl" data-sort="${user.level}">
                ${user.level}
            </td>

            <td data-what="messages" data-sort="${user.messages}">
                ${addSpaces(user.messages, ',')}
            </td>

            <td data-what="yearly-voice" data-sort="${user.yearly_total_voice}">
                ${parseVoiceTime(user.yearly_total_voice)}
            </td>

            <td data-what="total-voice" data-sort="${user.total_voice}">
                ${parseVoiceTime(user.total_voice)}
            </td>

            <td data-what="more-info" data-id="${user.id}">
                <img src="icons/data_exploration.svg" />
            </td>
        </tr>
    `);

});

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

$('[data-srt]').on('click', function() {

    let what = $(this).attr('data-srt');
    let dir = $(this).attr('data-dir');
    if (!dir) { dir = 'asc' }

    let rows = $('main > table > tbody > tr').get();

    rows.sort((a, b) => {

        let A = $(a).children(`[data-what="${what}"]`).attr('data-sort');
        let B = $(b).children(`[data-what="${what}"]`).attr('data-sort');

        A = isNaN(A) ? 0 : parseInt(A);
        B = isNaN(B) ? 0 : parseInt(B);

        if (A < B) { return dir == 'asc' ? -1 : 1; }
        if (A > B) { return dir == 'asc' ? 1 : -1; }

        return 0;
    });

    rows.forEach(row => {
        $('main > table > tbody').append(row);
    });

    $('[data-srt]').attr('data-dir', 'asc');
    $(this).attr('data-dir', dir == 'asc' ? 'desc' : 'asc');

});



$('[data-what="more-info"]').on('click', async function() { await showIndividualInfo(this); });

async function showIndividualInfo(that) {
    $(`[data-spec-row="${that.dataset.id}"]`).toggle($(`[data-spec-row="${that.dataset.id}"]`).css('display') == 'none');

    $(that).find('img').remove();
    $(that).append(spinner());

    if (!$(`[data-spec-row="${that.dataset.id}"]`).length) {
        let yearlyVoice = await supabase.from('yearly_voice').select('year, total, longest').eq('id', that.dataset.id).order('year', { ascending: false });
        let yvData = `
            <tr data-spec-row="${that.dataset.id}">
                <td class="header" colspan="4">Year</td>
                <td class="header">Total</td>
                <td class="header">Longest</td>
            </tr>
        `;

        yearlyVoice.data.forEach(yv => {
            yvData += `
                <tr data-spec-row="${that.dataset.id}">
                    <td colspan="4">${yv.year}</td>
                    <td>${parseVoiceTime(yv.total, true)}</td>
                    <td>${parseVoiceTime(yv.longest, true)}</td>
                </tr>
            `;
        });
        
        $(that).parent().after(yvData);
    }

    $(that).find('svg').remove();
    $(that).append(`<img src="icons/data_exploration.svg" />`);

    $(`[data-spec-row]:not([data-spec-row="${that.dataset.id}"])`).hide();
};
