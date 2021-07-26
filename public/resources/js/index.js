
firebase.database().ref("widget").on("value", snapshot => {
  let nowOnline = 0;
  $("#widget").replaceWith(`<div class="uk-height-large uk-overflow-auto" id="widget"></div>`);

  snapshot.forEach(childSnapshot => {
    let user = childSnapshot.val();
    if (user.status == "offline") { return }

    let a = `
      <!-- ${user.username} -->
      <div class="uk-flex uk-flex-between">
        <div class="uk-flex uk-flex-row uk-flex-nowrap">
          <span class="${widgetStatus(user.status)}">${user.username}</span>
          ${widgetFlags(user)}
        </div>
        <div class="uk-flex uk-flex-row uk-flex-nowrap">
          ${widgetVoiceIcons(user.voice)}
          ${widgetSpotify(user.activities)}
          ${widgetActivities(user.activities)}
        </div>
      </div>`;
    $("#widget").append(a);
    nowOnline++;
  });
  $('#nowOnline').text(`${nowOnline} Online`)
});

function widgetStatus(status) {
  if (status == "online") { return "uk-text-success" };
  if (status == "idle")   { return "uk-text-warning" };
  if (status == "dnd")    { return "uk-text-danger" };
  return "uk-text-primary"
};
function widgetFlags(user) {
  if (user.house == "none" && user.premium_since == "none") { return "" }

  let house = house_name = "";
  let booster = booster_since = "";
  let on_mobile = "";
  let wh = 17;
  let bwh = 10;

  switch (user.house) {
    case "brilliance":
      house = `<img class="uk-preserve" style="margin-left: 5px;" src="/resources/svg/widget/hs_brilliance.svg" width=${wh} height=${wh} uk-svg />`;
      house_name = "Brilliance";
      break;
    case "balance":
      house = `<img class="uk-preserve" style="margin-left: 5px;" src="/resources/svg/widget/hs_balance.svg" width=${wh} height=${wh} uk-svg />`;
      house_name = "Balance";
      break;
    case "bravery":
      house = `<img class="uk-preserve" style="margin-left: 5px;" src="/resources/svg/widget/hs_bravery.svg" width=${wh} height=${wh} uk-svg />`;
      house_name = "Bravery";
      break;
  }

  if (user.premium_since != "none") {
    booster = `<img class="uk-preserve" style="margin-left: 5px;" src="/resources/svg/widget/${getBoostingBadge(user.premium_since)}.svg" width=${wh} height=${wh} uk-svg />`;
    booster_since = getReadableBoostingSinceTime(user.premium_since);
  }

  if (user.is_on_mobile) {
    on_mobile = `<img class="uk-preserve" style="margin-left: 5px;" src="/resources/svg/widget/on_mobile.svg" width=${bwh} height=${bwh} uk-svg />`;
  }

  let flags = `
    <div class="uk-flex uk-flex-row" uk-tooltip="${house_name}">${house}</div>
    <div class="uk-flex uk-flex-row">${on_mobile}</div>
    <div class="uk-flex uk-flex-row" uk-tooltip="since ${booster_since}">${booster}</div>
  `;

  return flags
};
function widgetActivities(activities) {
  if (!activities || activities.other == undefined) { return ""; }

  let gaem = activities.other[activities.other.length - 1];
  activities.other.pop();

  gaem = gaem.replace("PLAYERUNKNOWN'S BATTLEGROUNDS", "PUBG");
  gaem = gaem.replace("Counter-Strike: Global Offensive", "CS:GO");
  gaem = gaem.replace("Tom Clancy's Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("The Elder Scrolls", "TES");

  let moreActivities = "";
  if (activities.other.length > 0) {
    activities.other.forEach(act => { moreActivities += `& ${act}`; });
  }

  gaem = `<div>${reduceStringLength(gaem , 23)}</div>`;

  if (moreActivities != "") {
    let wh = 16;
    gaem += `
    <div class="uk-text-muted" style="margin-left: 5px;" uk-tooltip="title:${moreActivities};pos:right">
      <img class="uk-preserve" src="/resources/svg/widget/rich_presence.svg" width=${wh} height=${wh} uk-svg />
    </div>`;
  }

  return `<div class="uk-flex uk-flex-row" style="margin-left: 5px;">${gaem}</div>`;
};
function widgetVoiceIcons(voice) {
  let width = 17;
  let height = 17;

  let mic = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34
  2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72
  17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333
  13 11V5C13 4.66667 12.8 4 12 4Z" class='uk-background-danger' fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14.99 11C14.99
  12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14
  17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z" fill="currentColor"></path></svg>`
  let selfMuted = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" fill="currentColor"></path>
  <path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" fill="currentColor"></path>
  <path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" fill="currentColor"></path>
  <path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" class="uk-text-danger" fill="currentColor"></path></svg>`
  let serverMuted = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" class='uk-text-danger' fill="currentColor"></path>
  <path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" class='uk-text-danger' fill="currentColor"></path>
  <path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" class='uk-text-danger' fill="currentColor"></path>
  <path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" class='uk-text-danger' fill="currentColor"></path></svg>`

  let earphones = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24"><svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8
  15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16
  15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z" fill="currentColor"></path></svg></svg>`
  let selfDeafened = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" fill="currentColor"></path>
  <path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" fill="currentColor"></path>
  <path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" class='uk-text-danger' fill="currentColor"></path></svg>`
  let serverDeafened = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" class='uk-text-danger' fill="currentColor"></path>
  <path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" class='uk-text-danger' fill="currentColor"></path>
  <path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" class='uk-text-danger' fill="currentColor"></path></svg>`

  let screenshare = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M2 4.5C2 3.397 2.897 2.5 4 2.5H20C21.103 2.5 22 3.397 22 4.5V15.5C22 16.604 21.103 17.5 20
  17.5H13V19.5H17V21.5H7V19.5H11V17.5H4C2.897 17.5 2 16.604 2 15.5V4.5ZM13.2 14.3375V11.6C9.864 11.6 7.668 12.6625 6 15C6.672 11.6625 8.532 8.3375 13.2 7.6625V5L18 9.6625L13.2 14.3375Z"></path></svg>`
  let videoshare = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
    <path fill="currentColor" d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L18 9.382V7C18 5.897 17.103 5 16 5H4C2.897 5 2 5.897 2 7V17C2 18.104 2.897 19 4 19H16C17.103 19
     18 18.104 18 17V14.618L20.553 15.894C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z"></path></svg>`


  let icons = ''
  // Not in voice
  if (voice.mute == undefined || voice.deaf == undefined || voice.self_mute == undefined || voice.self_deaf == undefined) { return '' }

  // Screen sharing
  if (voice.self_stream != undefined && voice.self_stream) { icons += screenshare }
  // Video
  if (voice.self_video != undefined && voice.self_video) { icons += videoshare }

  // Speaking
  if (voice.mute != undefined && voice.mute) { icons += serverMuted }
  else if (voice.self_mute != undefined && voice.self_mute) { icons += selfMuted }
  else { icons += mic }

  // Listening
  if (voice.deaf != undefined && voice.deaf) { icons += serverDeafened }
  else if (voice.self_deaf != undefined && voice.self_deaf) { icons += selfDeafened }
  else { icons += earphones }

  return icons
};
function widgetSpotify(activities) {
  if (!activities || activities.spotify == false || activities.spotify == "none" || activities.spotify == undefined) { return ""; }

  let wh = 17;
  let spotify = `
    <div class="uk-flex uk-flex-row" style="margin-left: 7px;" uk-tooltip="${activities.spotify.artist} - ${activities.spotify.title}">
      <img class="uk-preserve" src="/resources/svg/widget/spotify.svg" width=${wh} height=${wh} uk-svg />
    </div>`;
  return spotify
};
function getReadableBoostingSinceTime(UNIX_timestamp){
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  return `${month} ${date}, ${year}`;
};
function getBoostingBadge(UNIX_timestamp) {
  let now = Math.floor(Date.now() / 1000)
  let diff = now - UNIX_timestamp;
  let month = 2629743.83; // 2,629,743.83 seconds, according to Google

  if (diff <= month) { return "booster_levels/booster_1" }
  if (diff <= month * 2) { return "booster_levels/booster_2" }
  if (diff <= month * 3) { return "booster_levels/booster_3" }
  if (diff <= month * 6) { return "booster_levels/booster_6" }
  if (diff <= month * 9) { return "booster_levels/booster_9" }
  if (diff <= month * 12) { return "booster_levels/booster_12" }
  if (diff <= month * 15) { return "booster_levels/booster_15" }
  if (diff <= month * 18) { return "booster_levels/booster_18" }
  if (diff <= month * 24) { return "booster_levels/booster_24" }
  return "booster"
};


const currentYear = new Date().getFullYear();
let kokotina = 0;
let insideVoiceDataRef = firebase.database().ref(`voice/${currentYear}/in`);
insideVoiceDataRef.on('value', (snapshot) => {

  /* 👇👇👇 The Magic Sauce 👇👇👇 */
  try { clearInterval(amogus); } catch (e) { let qwertz; }

  if (snapshot.val() == null) { removeTimesCard() }

  if (snapshot.val() != null) {

    let usersInVoice = [];
    let secondsFromDB = 0;
    let usersInVoiceCount = 0;
    let unixTimestamp = Math.floor(Date.now() / 1000);
    let totalTimeToday = 0;

    snapshot.forEach(childSnapshot => {
      let userTimestamp = childSnapshot.val();
      secondsFromDB += (unixTimestamp - userTimestamp);
      usersInVoiceCount++;

      let usernameRef = firebase.database().ref(`users/${childSnapshot.key}/username`);
      usernameRef.once('value').then(usernameSnapshot => {
        let username = usernameSnapshot.val();
        usersInVoice.push({
          username:username,
          userTimestamp:userTimestamp
        });
      });
    });

    let totalTimeTodayRef = firebase.database().ref(`voice/${currentYear}/day/${getTodayFirebaseString()}`);
    totalTimeTodayRef.once('value').then(snapshot => {
      totalTimeToday = snapshot.val();
    });

    let iterations = 1;

    function update(){
      let uts = Math.floor(Date.now() / 1000);
      let totalTime = secondsFromDB + (usersInVoiceCount * iterations);
      let tvToday = totalTime + totalTimeToday;
      replaceTimes(totalTime, usersInVoiceCount, usersInVoice, uts, tvToday);
      iterations++;
    };
    amogus = setInterval(update, 1000);
  };
  kokotina++;
});
function replaceTimes(tv, uivc, uiv, unixTS, tvToday) {
  /*
  tv - Total Voice
  uivc - Users In Voice Count
  uiv - Users In Voice
  unixTS - unix TimeStamp
  tvToday - Total Voice Today
  */
  eus = geteachUserSeparately(uiv, unixTS);
  cardData = getCardData(uivc, eus, tv, tvToday);

  $('#inVoice').replaceWith(cardData);
};
function getCardData(uivc, eachUserSeparately, tv, tvToday) {
  let text = `
  <div class="uk-width-1-3@m" id="inVoice">
    <article class="uk-article">
      <h1 class="uk-article-title">
        ${uivc} ${uivc == 1 ? "Person" : "People"} In Voice
      </h1>
      <hr class="uk-divider-small" />
      <div class="uk-flex-center" uk-grid>
        ${eachUserSeparately}
      </div>
      <hr class="uk-divider-icon" />
      <div class="uk-flex-center uk-child-width-1-2 uk-grid-divider" uk-grid>
        <div>
          <div class="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-text-large">
            <span>This Session</span>
            <span class="uk-text-warning">${getVoiceTime(tv)}</span>
          </div>
        </div>
        <div>
          <div class="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-text-large">
            <span>Total Today</span>
            <span class="uk-text-warning">${getVoiceTime(tvToday)}</span>
          </div>
        </div>
      </div>
    </article>
  </div>`;
  return text
};
function geteachUserSeparately(uiv, unixTS, eachUserSeparately = "") {
  uiv.forEach(function(user, i){
    let username = (user.username).split('#');
    let time = addSpaces(getVoiceTime(unixTS - user.userTimestamp));

    eachUserSeparately += `
    <div>
      <div class="uk-card uk-flex uk-flex-column uk-flex-center uk-flex-middle uk-text-large">
        <span>${username[0]}</span>
        <span class="uk-text-warning">${time}</span>
      </div>
    </div>`;
  });
  return eachUserSeparately
};

function removeTimesCard() {
  $('#inVoice').replaceWith('<div id="inVoice" hidden></div>');
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
function timeConverter(UNIX_timestamp) {
  // https://stackoverflow.com/a/6078873/13186339
  let a = new Date(UNIX_timestamp * 1000);
  let months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  let year = a.getFullYear();
  let month = months[a.getMonth()];
  let date = a.getDate();
  return `${year}-${month}-${date < 10 ? '0' + date: date}`;
};
function getVoiceTime(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${hours}:${minutes}:${seconds}`
};
function getTodayFirebaseString() {
  let dateObj = (new Date()).toLocaleString('cs-CZ', { year:'numeric',month:'numeric',day:'numeric' }).split('.');
  let year = dateObj[2];
  let month = dateObj[1];
  let day = dateObj[0];
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`.replaceAll(' ','')
};



firebase.database().ref('serverTotals').on('value', snapshot => {
  $("#userCount").text(snapshot.val().users);
  //$("#rpDownloads").text(snapshot.val().rpDownloads);
});





window.onload = function (){
  let cookieAlert = 'IMo9Dd8nuF';
  if(!localStorage.getItem(cookieAlert)) {
    UIkit.notification({
      message: `<img src="../resources/img/wantacookie.jpg" class="uk-width-1-1 uk-align-left uk-margin-remove uk-margin-small-bottom" />
                <span class="uk-text-large">Cookies are used here, but it's only so alerts don't bother you everytime you show your face around here</span>`,
      pos: 'top-right', timeout: 7500
    });
    localStorage.setItem(cookieAlert, 'true');
  };

  $.getJSON("https://api.cfwidget.com/381945", function(data) {
    $("#rpDownloads").text(abbreviateNumber(data.downloads.total + 1000) + '+');
  });
};

function abbreviateNumber(value) {
  let newValue = value;
  if (value >= 1000) {
    let suffixes = ["", "K", "M", "B","T"];
    let suffixNum = Math.floor( (""+value).length/3 );
    let shortValue = '';
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
      let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
      if (dotLessShortValue.length <= 2) { break; }
    }
    if (shortValue % 1 != 0)  shortValue = shortValue.toFixed(1);
    newValue = shortValue+suffixes[suffixNum];
  }
  return newValue;
}
