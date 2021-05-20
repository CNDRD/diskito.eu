// https://stackoverflow.com/a/16637170
function addSpaces(x) {return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");}
// https://stackoverflow.com/a/41452260/13186339
let average = (array) => array.reduce((a, b) => a + b) / array.length;
function timeConverter(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = date + '. ' + month + '. ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}; /* fn timeConverter() */
function sortTableTimeCustomKey(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  // YYYYMMDDHHMMSS format
  var a = new Date(UNIX_timestamp * 1000);
  var year = a.getFullYear();
  var month = a.getMonth() < 10 ? '0' + a.getMonth() : a.getMonth();
  var date = a.getDate() < 10 ? '0' + a.getDate() : a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  var time = `${year}${month}${date}${hour}${min}${sec}`;
  return time;
}; /* fn sortTableTimeCustomKey() */

// My Functions
function nextLevel(level){
  return parseInt(5 / 6 * level * (2 * level * level + 27 * level + 91))
}; /* fn nextLevel() */
function getTime(s){
  var t = [];
  s.forEach(u => { t.push(Math.round((u/60/60)*100)/100) });
  return t;
}; /* fn getTime() */
function reduceNameLength(splitname){
  return splitname[0].substr(0,15).length > 14 ? `${splitname[0].substr(0,15)}..` : splitname[0].substr(0,15)
}; /* fn reduceNameLength() */
function getProgressBarPercentage(lvl, xp){
  // Percentage Calculations for Progress Bar
  xp_bottom = nextLevel(lvl);
  curr_xp = xp - xp_bottom;
  next_xp = nextLevel(lvl+1) - xp_bottom;
  return parseInt((curr_xp/next_xp)*100)
}; /* fn getProgressBarPercentage() */
function getProgressBar(lvl, xp){
  var p = getProgressBarPercentage(lvl, xp)
  a = `
  <div class="progress-group">
    <div class="progress">
      <div class="progress-bar bg-secondary progress-bar-animated highlight-dark" role="progressbar" style="width: ${p}%"></div>
    </div>
    <span class="progress-group-label text-muted font-weight-light">
      ${p}%
    </span>
  </div>
  `
  return a
}; /* fn getProgressBar() */
function getModalData(user, splitname, daysInDiskito){

  if (user.cicinaCount > 0) {
    var cicina = `
    <p class='font-size-16 font-weight-light'>
      Tvoja najdlhšia cicina bola <span class='text-success'>${addSpaces(user.cicinaLongest)}</span> cm.<br>
      Po <span class='text-success'>${user.cicinaCount}</span> ${user.cicinaCount == 1 ? "pokusu" : "pokusoch"}
      je celkový priemer <span class='text-success'>${Math.round(user.cicinaAverage*10)/10}</span> cm.
    </p>`
  } else { var cicina = ''}

  var messagesText = user.mess_cnt > 0 ? `<br>sending a total of <span class='text-success'>${addSpaces(user.mess_cnt)}</span> ${user.mess_cnt == 1 ? 'message' : 'messages'}` : ''
  var timeInVoiceText = user.allTimeVoice > 0 ? `${messagesText == '' ? '' : 'and '}<br> spending <span class='text-success'>${Math.round((user.allTimeVoice/60/60)*1)/1}</span> total hours in voice` : ''
  var rpText = user.reacc_points != 0 ? `<p class='font-size-16 font-weight-light'>For all of those messages other users have awarded <span class='text-success'>${addSpaces(user.reacc_points)}</span> reaction point${user.reacc_points != 1 ? 's' : ''}.</p>` : ''

  var magic = ''
  if (messagesText == '' && timeInVoiceText == ''){
    magic = `<span class='text-success'>magic</span>.<br>There is no data of this user ever being in voice or any messages being sent`
    timeInVoiceText = messagesText = rpText = cicina = ''
  }

  var a = `
    <!-- ${user.user_name} Modals -->
    <div class="modal" id='${user.discordID}' tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <h4 class='modal-title'><span class='text-success'>${splitname[0]}</span><span class='text-muted font-size-12'>#${splitname[1]}</span>'s card</h4>
          <p class='font-size-16 font-weight-light'>
            Level <span class='text-success'>${addSpaces(user.lvl)}</span> with <span class='text-success'>${addSpaces(user.xp)}</span> total XP.
          </p>
          <p class='font-size-16 font-weight-light'>
            That XP was gained through ${messagesText} ${timeInVoiceText} ${magic} since joining <b>Diskíto</b> about <span class='text-success'>${addSpaces(Math.round(daysInDiskito))}</span> days ago.
          </p>
          ${rpText}
          ${cicina}
        </div> <!-- modal-content -->
      </div> <!-- modal-dialog -->
    </div>
  `
  return a
}; /* fn getModalData() */
function getImageModalData(user){
  let mdl = `
  <div class="modal" id="${getPfpModalID(user.discordID)}" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content modal-content-media w-auto">
        <a href="#" class="close" role="button" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </a>
        <img src="${user.avatarURL}" class="img-fluid" alt="modal-img">
      </div>
    </div>
  </div>`;
  return mdl
};
function getStatsRowData(i, user, splitname, stJoinedDiscord, joinedDiscord, progress_bar){
  var a = `
    <tr>
      <td class='text-center'>
        ${addSpaces(i)}
      </td>
      <td class='text-center'>
        <a href="#${getPfpModalID(user.discordID)}"><img class='p' src="${user.avatarURL}" /></a>
      </td>
      <td>
        <a href='#${user.discordID}' class='text-secondary text-decoration-none' role='button'>
          <span class='font-weight-semi-bold text-secondary font-size-14'>${reduceNameLength(splitname)}</span>
          <span class='font-weight-medium text-muted font-size-12'>#${splitname[1]}</span>
        </a>
      </td>
      <td sorttable_customkey='${user.xp}' class='font-weight-light text-white text-center'>
        ${user.lvl} ${progress_bar}
      </td>
      <td sorttable_customkey='${user.mess_cnt}' class='text-center font-weight-light'>
        ${addSpaces(user.mess_cnt)}
      </td>
      <td sorttable_customkey='${user.currentYearVoice}' class='text-center font-weight-light'>
        ${getOneTime(user.currentYearVoice)}
      </td>
      <td sorttable_customkey='${user.reacc_points}' class='text-center font-weight-light'>
        ${addSpaces(user.reacc_points)}
      </td>
      <td sorttable_customkey='${user.cicinaLongest}' class='text-center font-weight-light'>
        ${user.cicinaLongest}
      </td>
      <td sorttable_customkey='${stJoinedDiscord}' class='text-center font-size-12'>
        ${joinedDiscord}
      </td>
    </tr>`
  return a
}; /* fn getStatsRowData() */
function getSmallRowData(i, discordID, xp, lvl, mess_cnt, currentYearVoice, reacc_points, splitname){
  var a = `
  <tr>
    <td>
      <a href='#${discordID}' class='text-secondary text-decoration-none text-truncate' role='button'>
        <span class='text-muted font-size-12'>${addSpaces(i)}</span>
        <span class='font-weight-semi-bold text-secondary font-size-14'>${reduceNameLength(splitname)}</span>
      </a>
    </td>
    <td sorttable_customkey='${xp}' class='font-weight-light text-white text-center'>
      ${lvl}
    </td>
    <td sorttable_customkey='${mess_cnt}' class='text-center font-weight-light'>
      ${addSpaces(mess_cnt)}
    </td>
    <td sorttable_customkey='${currentYearVoice}' class='text-center font-weight-light'>
      ${getOneTime(currentYearVoice)}
    </td>
    <td sorttable_customkey='${reacc_points}' class='text-truncate text-center font-weight-light'>
      ${addSpaces(reacc_points)}
    </td>
  </tr>
  `
  return a
}; /* fn getSmallRowData() */
function getPfpModalID(uid){
  return `${uid}-pfp`
};

const arr = []
var userDataRef = firebase.database().ref("users").orderByKey();
userDataRef.once('value').then(function(snapshot){

  var unixTimestamp = Math.floor(Date.now() / 1000)
  var date = new Date(unixTimestamp * 1000);
  var year = new Date(unixTimestamp * 1000).getFullYear();

  $('#yr').text(`${year} Voice`);
  $('#yrs').text(`${year} Voice`);

  snapshot.forEach(function(childSnapshot){
    var uid = childSnapshot.key;
    var cD = childSnapshot.val();

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
      u_name = user.user_name;
      let splitname = (user.user_name).split('#');

      // Get joined Diskito timestamp and in Diskito days
      let joinedDiskito = timeConverter(parseInt(user.joinedServer));
      let daysInDiskito = Math.round(((unixTimestamp-user.joinedServer)/60/60/24)*100)/100;

      // Get joined Discord timestamp and in Discord days
      let joinedDiscord = timeConverter(parseInt(user.joinedDiscord));
      let daysOnDiscord = Math.round(((unixTimestamp-user.joinedDiscord)/60/60/24)*100)/100;

      let stJoinedDiskito = sortTableTimeCustomKey(parseInt(user.joinedServer));
      let stJoinedDiscord = sortTableTimeCustomKey(parseInt(user.joinedDiscord));

      let modalData = getModalData(user, splitname, daysInDiskito);
      let dataData = getStatsRowData(i, user, splitname, stJoinedDiscord, joinedDiscord, getProgressBar(user.lvl, user.xp));
      let smallData = getSmallRowData(i, user.discordID, user.xp, user.lvl, user.mess_cnt, user.currentYearVoice, user.reacc_points, splitname);
      let imageData = getImageModalData(user);

      // Stats Modal
      $('#modals').append(modalData);
      // Pfp Modal
      $('#modals').append(imageData);
      // Stats Data Row
      $('#data').append(dataData);
      // Small Stats Data Row
      $('#smallData').append(smallData);

      i++;
    }; /* if (user.xp != 0 || user.lvl != 0) */
  }); /* arr.forEach() */
}); /* userDataRef.once() */
