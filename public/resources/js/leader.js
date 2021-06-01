$("table").stickyTableHeaders();

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

    arr.push({
      user_name:cD.username,
      xp:cD.xp,
      lvl:cD.level,
      reacc_points:cD.reacc_points,
      mess_cnt:cD.messages_count,
      avatarURL:cD.avatar_url,
      joinedDiscord:cD.joined_discord,
      joinedServer:cD.joined_server,
      allTimeVoice:cD.all_time_total_voice ? cD.all_time_total_voice : 0,
      currentYearVoice:cD[`voice_year_${year}`] ? cD[`voice_year_${year}`] : 0,
      cicinaLongest:cD.cicina_longest ? cD.cicina_longest : 0,
      cicinaAverage:cD.cicina_avg ? cD.cicina_avg : 0,
      cicinaCount:cD.cicina_count ? cD.cicina_count: 0,
      discordID:uid,
    }); /* arr.push() */
  }); /* snapshot.forEach() */

  arr.sort(function(a, b){return b.xp - a.xp})

  let i = 1;
  arr.forEach(user => {
    if (user.xp != 0 || user.lvl != 0) {
      $("#tableDataPlace").append(getStatsDataRow(i, user));
      $("#modalsColony").append(getModal(user));
      i++;
    };
  });
});


function getStatsDataRow(i, u) {
  let splitname = (u.user_name).split("#");
  let levelPercentage = getLevelBarPercentage(u.lvl, u.xp);

  let a = `
    <!-- ${u.user_name} -->
    <tr>
      <td class="uk-visible@m uk-text-middle">
        ${i}
      </td>
      <td class="uk-visible@m">
        <img class="uk-preserve-width uk-align-center" src="${u.avatarURL}" width="40" />
      </td>
      <td class="uk-text-middle">
        <a href="#xd${u.discordID}" class="uk-text-warning" uk-toggle>
          ${reduceNameLength(splitname[0])}
        </a>
      </td>
      <td sorttable_customkey="${u.xp}" class="uk-text-center uk-text-middle" uk-tooltip="${addSpaces(u.xp)} XP">
        <span class="uk-text-primary">${u.lvl}</span>
        <span class="uk-text-muted uk-visible@m"> ${levelPercentage}%</span>
      </td>
      <td sorttable_customkey="${u.mess_cnt}" class="uk-text-center uk-text-middle uk-text-light">
        ${addSpaces(u.mess_cnt)}
      </td>
      <td sorttable_customkey="${u.currentYearVoice}" class="uk-text-center uk-text-middle uk-text-light">
        ${getOneTime(u.currentYearVoice)}
      </td>
      <td sorttable_customkey="${u.reacc_points}" class="uk-text-center uk-text-middle uk-text-light">
        ${addSpaces(u.reacc_points)}
      </td>
      <td class="uk-text-center uk-text-middle uk-text-light uk-visible@m">
        <span>${addSpaces(u.cicinaLongest)}</span>
        <span class="uk-text-muted"> cm</span>
      </td>
    </tr>`;
  return a
};
function getModal(u) {
  let splitname = u.user_name.split("#");
  let unixTimestamp = Math.floor(Date.now() / 1000);
  let daysInDiskito = Math.round(((unixTimestamp - u.joinedServer) / 60 / 60 / 24) * 100) / 100;
  let joinedDiskitoDate = getDateAndTimeInTooltipFromTimestamp(u.joinedServer);

  let cicina = "";
  let magic = "";

  if (u.cicinaCount > 0) {
    cicina = `
    <p class="uk-text-light">
      Tvoja najdlhšia cicina bola <span class="uk-text-success">${addSpaces(u.cicinaLongest)}</span> cm.<br>
      Po <span class="uk-text-success">${u.cicinaCount}</span> ${u.cicinaCount == 1 ? "pokusu" : "pokusoch"}
      je celkový priemer <span class="uk-text-success">${Math.round(u.cicinaAverage*10)/10}</span> cm.
    </p>`
  }

  let messagesText = u.mess_cnt > 0 ? `<br>sending a total of <span class="uk-text-success">${addSpaces(u.mess_cnt)}</span> ${u.mess_cnt == 1 ? "message" : "messages"}` : "";
  let timeInVoiceText = u.allTimeVoice > 0 ? `${messagesText == "" ? "" : 'and '}<br> spending <span class='uk-text-success'>${Math.round((u.allTimeVoice/60/60)*1)/1}</span> total hours in voice` : "";
  let rpText = u.reacc_points != 0 ? `<p class="uk-text-light">For all of those messages other users have awarded <span class='uk-text-success'>${addSpaces(u.reacc_points)}</span> reaction point${u.reacc_points != 1 ? "s" : ""}.</p>` : "";

  if (messagesText == '' && timeInVoiceText == ''){
    magic = `<span class="uk-text-success">magic</span>.<br>There is no data of this user ever being in voice or sending any messages`;
    timeInVoiceText = messagesText = rpText = cicina = '';
  };

  let a = `
  <!-- ${u.user_name} -->
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
          Level <span class="uk-text-success">${addSpaces(u.lvl)}</span> with <span class="uk-text-success">${addSpaces(u.xp)}</span> total XP.
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
