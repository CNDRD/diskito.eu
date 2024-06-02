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
        </tr>
    `);

});

function parseVoiceTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = Math.floor((seconds % 3600) / 60);
    let s = Math.floor(seconds % 60);

    let str = `${h}h ${m}m ${s}s`;

    if (h == 0) { str = `${m}m ${s}s`; }
    if (h == 0 && m == 0) { str = `${s}s`; }
    if (h == 0 && m == 0 && s == 0) { str = `-`; }

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
