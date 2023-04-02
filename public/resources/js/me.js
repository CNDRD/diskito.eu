import { c, supabase, UUID, userAuth } from '../jss/main.js';
if (!UUID) { window.location = "/"; }

$('#username').text(userAuth.session.user.user_metadata.full_name);
$('#avatar').attr('src', userAuth.session.user.user_metadata.avatar_url);

//! Querying the data like this, because the IDs are apparently too long or some shit...
const { data: userDataDb } = await supabase.from('users').select('*').like('avatar', `%/${userAuth.session.user.user_metadata.sub}/%`);
let userData = userDataDb[0];
c(userData);

let showStat = (id, value) => { $(`#${id}.stat > .stat_value`).text(value); };
showStat('level', addSpaces(userData.level));
showStat('xp', addSpaces(userData.xp));
showStat('messages', addSpaces(userData.messages));
showStat('voice', addSpaces(roundTwo(userData.total_voice / 60 / 60)));

showStat('cicina_average', roundTwo(userData.cicina.average));
showStat('cicina_tries', addSpaces(userData.cicina.count));
showStat('cicina_longest', userData.cicina.longest);
showStat('cicina_last', new Intl.DateTimeFormat("cs-CS").format(new Date(userData.cicina.last)));

userData.roles.forEach(role => {
    // $('#roles').append(role);
});
