$("table").stickyTableHeaders();

let VERSION = 1;

// Last Update Timer
firebase.database().ref(`GameStats/lastUpdate/ApexV${VERSION}`).once('value').then(snapshot => {
  let last_update = snapshot.val();

  let lastUpdateInterval = setInterval(function() {
    let now = parseInt(Date.now()/1000);
    let diff = now - last_update;
    $("#lastUpdated").replaceWith(`<span id="lastUpdated">${getUpdateTimeString(diff)}</span>`)
  }, 1000);

});

// Stats Place
let stats = [];
firebase.database().ref(`GameStats/ApexV${VERSION}`).once('value').then(snapshot => {

  snapshot.forEach(childSnapshot => {
    let oof = childSnapshot.val();
    oof.stats.username = childSnapshot.key;
    stats.push(oof);
  });

  stats.sort(function(a,b){return b.stats.kills - a.stats.kills});
  stats.forEach(u => { $("#tableDataPlace").append(getStatsRow(u)); });

});

function getUpdateTimeString(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;

  let msg = `${seconds} second${seconds == 1 ? '' : 's'}`;

  if (parseInt(minutes) != 0) {
    msg = `${minutes} minute${minutes == 1 ? '' : 's'} ${msg}`
  }
  if (parseInt(hours) != 0) {
    msg = `${hours} hour${hours == 1 ? '' : 's'} ${msg}`
  }

  return msg
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getLegendIconsCell(legends) {
  let a = ``;
  let LEGENDS = orderBySubKey(legends, 'Kills');

  LEGENDS.forEach(l => {
    a += `<img style="height: 4rem;" class="uk-preserve-width uk-animation-scale-up" src="${l.imageUrl}" uk-tooltip="${l.name}" />`;
  });
  return a;
};

function getStatsRow(user) {
  let u = user.stats;
  let a = `
    <tr>
      <td class="uk-text-middle">
        ${u.username}
      </td>
      <td class="uk-text-middle uk-text-center uk-text-nowrap">
        ${addSpaces(u.kills)}
      </td>
      <td class="uk-text-middle uk-text-center uk-padding-remove-horizontal">
        <img style="height: 4rem;" class="uk-preserve-width uk-animation-scale-up" src="${u.rankIcon}" uk-tooltip="${u.rank}" />
      </td>
      <td class="uk-text-middle uk-text-center uk-padding-remove-horizontal">
        <img style="height: 4rem;" class="uk-preserve-width uk-animation-scale-up" src="${u.rankArenaIcon}" uk-tooltip="${u.rankArena}" />
      </td>
      <td class="uk-text-middle uk-text-center uk-padding-remove-horizontal uk-visible@m">
        ${getLegendIconsCell(user.legends)}
      </td>
    </tr>`;
  return a;
};
