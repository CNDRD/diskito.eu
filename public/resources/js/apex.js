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
function getLegendStats(legend) {
  let a = "";
  const fuckTheseOnes = ["imageUrl", "tallImageUrl", "name"];

  for(var key in legend) {
    if (!fuckTheseOnes.includes(key)) { a += `<li>${key.replaceAll(':','')}: ${addSpaces(legend[key])}</li>`; };
  };
  if (a === "") { return "<li>There are no stats being tracked for this legend</li>" };
  return a;
};
function getLegendIconsCell(legends) {
  let a = ``;
  let LEGENDS = orderBySubKey(legends, 'Kills');

  LEGENDS.forEach(l => {
    console.log(l);
    a += `
      <div class="uk-inline">
        <!--<button class="uk-button uk-button-default" type="button">Click</button>-->
        <img style="height: 4rem;" class="uk-preserve-width uk-animation-scale-up" src="${l.imageUrl}" />
        <div uk-drop="mode: click; pos:bottom-center">

          <div style="padding: 5px" class="uk-card uk-card-secondary uk-child-width-1-2" uk-grid>
            <div class="uk-card-media-left uk-cover-container">
              <img src="${l.tallImageUrl}" alt="" />
            </div>
            <div class="uk-card-body">
              <h3 class="uk-card-title">${l.name}</h3>
              <ul class="uk-list uk-list-divider uk-list-collapse">
                ${getLegendStats(l)}
              </ul>
            </div>
          </div>

        </div>
      </div>
    `;
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
        ${addSpaces(u.level)}
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
