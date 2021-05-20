/*
Private Profile:
CSGO
└ SteamID32 (9-long)
  ├─ discordUsername -> STRING
  ├─ private -> BOOL
  └─ steamUsername -> STRING
*/

let clowns = [];
let private = [];

let csgoRef = firebase.database().ref('GameStats/CSGO');
csgoRef.once('value').then(snapshot => {

  snapshot.forEach(childSnapshot => {
    let cd = childSnapshot.val();
    if (cd.private){ private.push(cd); }
    else { clowns.push(cd); }
  }); /* snapshot.forEach() */

  clowns.sort(function(a,b){ return b.timePlayed - a.timePlayed })

  clowns.forEach(u => {
    $('#stats').append(clownRow(u));
  }); /* clowns.forEach() */
  private.forEach((u, i) => {
    if (i == 0) { $('#private').append(`<span class='mr-5 font-weight-light'>Clowns with private accounts:</span>`); }
    if (i > 0 && i < private.length) { $('#private').append("<span class='mx-5'>/</span>"); }
    $('#private').append(privateRow(u));
  }); /* private.forEach() */

}); /* csgoRef.once() */

function clownRow(u){
  var ptRAW = getPlaytime(u.timePlayed);
  let playtime = `${addSpaces(ptRAW[0])}h <span class='hidden-sm-and-down'>${ptRAW[1]}m <span class='font-size-12 text-muted'>${ptRAW[2]}s</span></span>`;
  let tooltip = `data-toggle='tooltip' data-placement='left'`;
  let a = `
  <tr class="font-weight-light">

    <td class='hidden-sm-and-down'>
      <a target='_blank' href="${u.pfpLink}">
        <img class='p' src="${u.pfpLink}">
      </a>
    </td>

    <td class='font-size-16 text-secondary'>
      ${u.steamUsername}
    </td>

    <td class='text-center' ${tooltip} data-title='${u.kills}/${u.deaths}'>
      ${roundTwo(u.kd)}
    </td>

    <td class='text-center' ${tooltip} data-title='${u.wins}/${u.losses}'>
      ${roundTwo(u.wlPercentage)}<span class='text-muted'>%</span>
    </td>

    <td class='text-center' ${tooltip} data-title='${u.headshots} Headshots'>
      ${roundTwo(u.headshotPct)}<span class='text-muted'>%</span>
    </td>

    <td class='text-center' ${tooltip} data-title='${addSpaces(u.shotsFired)} Fired ${addSpaces(u.shotsHit)} Hit'>
      ${roundTwo(u.shotsAccuracy)}<span class='text-muted'>%</span>
    </td>

    <td class='text-center'>
      ${addSpaces(u.bombsPlanted)}
    </td>

    <td class='text-center'>
      ${addSpaces(u.bombsDefused)}
    </td>

    <td class='text-center'>
      ${addSpaces(u.damage)}
    </td>

    <td class='text-center'>
      ${addSpaces(u.moneyEarned)}$
    </td>

    <td class='text-center'>
      ${addSpaces(u.mvp)}
    </td>

    <td class='text-center'>
      ${playtime}
    </td>

  </tr>
  `;
  return a
};
function privateRow(u){
  let a = `
    <span class='font-weight-light'>
      ${u.steamUsername}
    </span>
  `;
  return a
};
function getPlaytime(s){
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
}
