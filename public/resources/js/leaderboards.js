import { c, supabase } from '../jss/main.js';

const { data: leaderboardDb } = await supabase.from('leaderboards').select('*');
c(leaderboardDb);

$('#yr').text(`${new Date(Math.floor(Date.now() / 1000) * 1000).getFullYear()} Voice`);

leaderboardDb.forEach((user, i) => { $("#tableDataPlace").append(getStatsDataRow(user, i)); });

function getStatsDataRow(u, i) {
    return `
      <!-- ${u.id} | ${u.username} -->
      <tr>
        <td class="hidden-mobile">
          ${i+1}
        </td>
        <td class="hidden-mobile">
            <img style="height: 3rem;" src="${u.avatar}" />
        </td>
        <td class="name">
            ${reduceNameLength(u.username.split("#")[0])}
            <a href="/user?id=${u.id}" style="display: none;">
                ${reduceNameLength(u.username.split("#")[0])}
            </a>
        </td>
        <td sorttable_customkey="${u.xp}" class="hidden-mobile">
            <span class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.xp)} XP">
                ${u.level}
            </span>
        </td>
        <td sorttable_customkey="${u.messages}">
            ${addSpaces(u.messages)}
        </td>
        <td sorttable_customkey="${u.total_voice}">
            <span class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.total_voice)} seconds">
                ${getOneTime(u.total_voice)}h
            </span>
        </td>
        <td class="hidden-mobile">
            ${addSpaces(u.longest_cicina)} cm
        </td>
      </tr>
    `;
};

function reduceNameLength(a){
    return a.substr(0,15).length > 14 ? `${a.substr(0,15)}..` : a.substr(0,15);
};
