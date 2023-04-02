import { c, supabase, UUID, userAuth } from '../jss/main.js';
if (!UUID) { window.location = "/"; }

$('#username').text(userAuth.session.user.user_metadata.full_name);
$('#avatar').attr('src', userAuth.session.user.user_metadata.avatar_url);

//* Querying the data like this, because the IDs are apparently too long or some shit...
const { data: userDataDb } = await supabase.from('users').select('*').like('avatar', `%/${userAuth.session.user.user_metadata.sub}/%`);
let userData = userDataDb[0];

let showStat = (id, value) => { $(`#${id}.stat > .stat_value`).text(value); };
showStat('level', addSpaces(userData.level));
showStat('xp', addSpaces(userData.xp));
showStat('messages', addSpaces(userData.messages));
showStat('voice', addSpaces(roundTwo(userData.total_voice / 60 / 60)));

if (userData.cicina.count === 0) { $('#cicina_stats').hide(); }
showStat('cicina_average', roundTwo(userData.cicina.average));
showStat('cicina_tries', addSpaces(userData.cicina.count));
showStat('cicina_longest', userData.cicina.longest);
showStat('cicina_last', new Intl.DateTimeFormat("cs-CS").format(new Date(userData.cicina.last)));

const { data: userRoles } = await supabase.from('roles').select('name, position, color').in('id', userData.roles).order('position', {ascending: false});

userRoles.forEach(role => {

    $('#roles').append(`
    
        <div class="role" style="background-color: #${role.color}70; border-color: #${role.color};">
            ${role.name}
        </div>

    `);

});
