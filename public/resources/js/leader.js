$("table").stickyTableHeaders();


/*

currentYearVoice:cD[`voice_year_${year}`] ? cD[`voice_year_${year}`] : 0,
discordID:uid,

*/

const arr = []
let userDataRef = firebase.database().ref("users").orderByKey();
userDataRef.once("value").then(function(snapshot){

  let unixTimestamp = Math.floor(Date.now() / 1000)
  let date = new Date(unixTimestamp * 1000);
  let year = new Date(unixTimestamp * 1000).getFullYear();

  $('#yr').text(`${year} Voice`);

  snapshot.forEach(function(childSnapshot){
    let uid = childSnapshot.key;
    let cD = childSnapshot.val();

    if (cD.username === undefined || cD.in_server == false || cD.joined_server === undefined){return}

    cD['currentYearVoice'] = cD[`voice_year_${year}`] ? cD[`voice_year_${year}`] : 0;
    cD['discordID'] = uid;
    cD.cicina_longest = cD.cicina_longest ? cD.cicina_longest : 0;
    //console.table(cD);
    arr.push(cD);

  }); /* snapshot.forEach() */

  arr.sort(function(a, b){return b.xp - a.xp})

  let i = 1;
  arr.forEach(user => {
    if (user.xp != 0 || user.level != 0) {
      $("#tableDataPlace").append(getStatsDataRow(i, user));
      $("#modalsColony").append(getModal(user));
      $("#AnsW6MRxRo").append(getPfpModal(user));
      i++;
    };
  });
});


function getStatsDataRow(i, u) {
  let splitname = (u.username).split("#");
  let levelPercentage = getLevelBarPercentage(u.level, u.xp);

  let a = `
    <!-- ${u.username} -->
    <tr>
      <td class="uk-visible@m uk-text-middle">
        ${i}
      </td>
      <td class="uk-visible@m uk-flex uk-flex-middle uk-flex-center">
        <a href="#${createPfpModalRef(u.discordID)}" uk-toggle>
          <img style="height: 3rem;" class="uk-preserve-width" src="${u.avatar_url}" />
        </a>
      </td>
      <td class="uk-text-middle">
        <a href="#xd${u.discordID}" class="uk-text-warning" uk-toggle>
          ${reduceNameLength(splitname[0])}
        </a>
      </td>
      <td sorttable_customkey="${u.xp}" class="uk-text-center uk-text-middle" uk-tooltip="${addSpaces(u.xp)} XP">
        <span class="uk-text-primary">${u.level}</span>
        <span class="uk-text-muted uk-visible@m"> ${levelPercentage}%</span>
      </td>
      <td sorttable_customkey="${u.messages_count}" class="uk-text-center uk-text-middle uk-text-light">
        ${addSpaces(u.messages_count)}
      </td>
      <td sorttable_customkey="${u.currentYearVoice}" class="uk-text-center uk-text-middle uk-text-light">
        ${getOneTime(u.currentYearVoice)}
      </td>
      <td sorttable_customkey="${u.money}" class="uk-text-center uk-text-middle uk-text-light uk-visible@m">
        ${abbreviateNumber(u.money)}
      </td>
      <td sorttable_customkey="${u.reacc_points}" class="uk-text-center uk-text-middle uk-text-light">
        ${addSpaces(u.reacc_points)}
      </td>
      <td class="uk-text-center uk-text-middle uk-text-light uk-visible@m">
        <span>${addSpaces(u.cicina_longest)}</span>
        <span class="uk-text-muted"> cm</span>
      </td>
    </tr>`;
  return a
};
function getModal(u) {
  let splitname = u.username.split("#");
  let unixTimestamp = Math.floor(Date.now() / 1000);
  let daysInDiskito = Math.round(((unixTimestamp - u.joined_server) / 60 / 60 / 24) * 100) / 100;
  let joinedDiskitoDate = getDateAndTimeInTooltipFromTimestamp(u.joined_server);

  let cicina = "";
  let magic = "";

  if (u.cicina_count > 0) {
    cicina = `
    <p class="uk-text-light">
      Tvoja najdlhšia cicina bola <span class="uk-text-success">${addSpaces(u.cicina_longest)}</span> cm.<br>
      Po <span class="uk-text-success">${addSpaces(u.cicina_count)}</span> ${u.cicina_count == 1 ? "pokusu" : "pokusoch"}
      je celkový priemer <span class="uk-text-success">${Math.round(u.cicina_avg*10)/10}</span> cm.
    </p>`
  }

  let messagesText = u.messages_count > 0 ? `<br>sending a total of <span class="uk-text-success">${addSpaces(u.messages_count)}</span> ${u.messages_count == 1 ? "message" : "messages"}` : "";
  let timeInVoiceText = u.all_time_total_voice > 0 ? `${messagesText == "" ? "" : 'and '}<br> spending <span class='uk-text-success'>${addSpaces(Math.round((u.all_time_total_voice/60/60)*1)/1)}</span> total hours in voice` : "";
  let rpText = u.reacc_points != 0 ? `<p class="uk-text-light">For all of those messages other users have awarded <span class='uk-text-success'>${addSpaces(u.reacc_points)}</span> reaction point${u.reacc_points != 1 ? "s" : ""}.</p>` : "";

  if (messagesText == '' && timeInVoiceText == ''){
    magic = `<span class="uk-text-success">magic</span>.<br>There is no data of this user ever being in voice or sending any messages`;
    timeInVoiceText = messagesText = rpText = cicina = '';
  };

  let a = `
  <!-- ${u.username} -->
  <div id="xd${u.discordID}" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical" style="background: rgb(34, 34, 34);">

      <button class="uk-modal-close-default" type="button" uk-close></button>

      <div class="uk-modal-header" style="background: rgb(34, 34, 34);">
        <h2 class="uk-modal-title" style="background: rgb(34, 34, 34);">
          <span class='uk-text-success'>${splitname[0]}</span>
          <span class='uk-text-muted uk-text-small'> #${splitname[1]}</span>
          <span class='uk-text-small'>'s card</span>
        </h2>
      </div>

      <div class="uk-modal-body uk-text-large">
        <p class="uk-text-light">
          Level <span class="uk-text-success">${addSpaces(u.level)}</span> with <span class="uk-text-success">${addSpaces(u.xp)}</span> total XP.
        </p>
        <p class="uk-text-light">
          That XP was gained through ${messagesText} ${timeInVoiceText} ${magic} since joining <b>Diskíto</b> about <span class="uk-text-success">${addSpaces(Math.round(daysInDiskito))}</span> days ago.
          ${joinedDiskitoDate}
        </p>
        ${rpText}
        ${cicina}
      </div>

    </div>
  </div>
  `;
  return a;
};
function createPfpModalRef(id) {
  return `AnsW6MRxRo_${id}`;
};
function getPfpModal(u) {
  return `
  <div id="${createPfpModalRef(u.discordID)}" class="uk-flex-top" uk-modal>
    <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
      <button class="uk-modal-close-outside" type="button" uk-close></button>
      <img src="${u.avatar_url}" />
    </div>
  </div>`;
};

function reduceNameLength(a){
  return a.substr(0,15).length > 14 ? `${a.substr(0,15)}..` : a.substr(0,15)
};
function getLevelBarPercentage(lvl, xp){
  // Level Percentage Calculations
  xp_bottom = nextLevelXP(lvl);
  curr_xp = xp - xp_bottom;
  next_xp = nextLevelXP(lvl+1) - xp_bottom;
  return parseInt((curr_xp/next_xp)*100)
};
function getDateAndTimeInTooltipFromTimestamp(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ["1","2","3","4","5","6","7","8","9","10","11","12"];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  let hour = a.getHours() < 10 ? "0" + a.getHours() : a.getHours();
  let min = a.getMinutes() < 10 ? "0" + a.getMinutes() : a.getMinutes();
  let sec = a.getSeconds() < 10 ? "0" + a.getSeconds() : a.getSeconds();
  return `<span class="uk-text-default uk-text-muted" uk-tooltip="${hour}:${min}:${sec}">(${date}.${month}. ${year})</span>`;
};
function abbreviateNumber(value) {
  // https://stackoverflow.com/a/10601315/13186339
  var newValue = value;
  if (value >= 1000) {
    var suffixes = ["", "k", "mil", "bil","tril"];
    var suffixNum = Math.floor( (""+value).length/3 );
    var shortValue = '';
    for (var precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
      var dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
    newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}
