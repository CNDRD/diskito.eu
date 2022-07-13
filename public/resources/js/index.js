firebase.database().ref("widget").on("value", snapshot => {
  let nowOnline = 0;
  $("#widget").replaceWith(`<div id="widget" class="users"></div>`);

  snapshot.forEach(childSnapshot => {
    let user = childSnapshot.val();
    if (user.status == "offline") { return }

    let on_mobile = user.is_on_mobile ? "📱" : "";
    let status = user.streaming ? "streaming" : user.status;

    $("#widget").append(`
      <!-- ${user.username} -->
      <div class="user">
        <div class="us">
          <div class="status status-${status}"></div>
          <a href="/user?id=${childSnapshot.key}" class="username">
            ${user.username}
          </a>
        </div>
        <div class="activity">
          ${widgetVoiceIcons(user.voice)}
          ${widgetSpotify(user.activities)}
          ${getWidgetActivity(user.activities)}
          ${on_mobile}
        </div>
      </div>
    `);

    nowOnline++;
  });
  $('#nowOnline').text(`${nowOnline} Online`)
});
function getWidgetActivity(activities) {
  if (!activities || activities.other == undefined) { return ""; }

  let gaem = activities.other[activities.other.length - 1];
  activities.other.pop();

  gaem = gaem.replace("PLAYERUNKNOWN'S BATTLEGROUNDS", "PUBG");
  gaem = gaem.replace("Counter-Strike: Global Offensive", "CS:GO");
  gaem = gaem.replace("Tom Clancy's Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("The Elder Scrolls", "TES");
  gaem = gaem.replace("Call of Duty®:", "COD:")

  gaem = reduceStringLength(gaem , 23);

  return `<div style="margin-left: 5px;">${gaem}</div>`;
};
function widgetSpotify(activities) {
  if (!activities || activities.spotify == false || activities.spotify == "none" || activities.spotify == undefined) { return ""; }

  let spotify = `
    <div style="margin-left: 7px;">
      <a target="_blank" rel="noreferrer" href="${activities.spotify.url}"
         class="hint--left hint--rounded hint--no-arrow" aria-label="${activities.spotify.artist} - ${activities.spotify.title}">
        <img src="/resources/svg/spotify.svg" width=17 height=17 alt="Spotify" />
      </a>
    </div>`;
  return spotify
};
function widgetVoiceIcons(voice) {

  let mic = "🎙️";
  let selfMuted = `${mic}❕`;
  let serverMuted = `${mic}❗`;

  let earphones = "🎧";
  let selfDeafened = `${earphones}❕`;
  let serverDeafened = `${earphones}❗`;

  let screenshare = "🖥️";
  let videoshare = "🤳";


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

  return `
    <div class="hint--left hint--rounded hint--no-arrow voice-icons pls-no-click" aria-label="${icons}">
      ${icons != "" ? "🔊" : ""}
    </div>
  `;
};


const currentYear = new Date().getFullYear();
firebase.database().ref(`voice/${currentYear}/in`).on('value', (snapshot) => {

  /* 👇👇👇 The Magic Sauce 👇👇👇 */
  try { clearInterval(amogus); } catch (e) { let qwertz; }

  /* If voice channels suddenly empty */
  if (snapshot.val() == null) { $("#voice").hide(); }

  /* If voice channels not empty */
  if (snapshot.val() != null) {
    $("#voice").show();
    
    let usersInVoice = [];
    let currentSession = 0;
    let uTS = Math.floor(Date.now() / 1000);

    /* Connect usernames with timestamps */
    snapshot.forEach(childSnapshot => {
      currentSession += (uTS - childSnapshot.val());

      firebase.database().ref(`users/${childSnapshot.key}/username`).once("value").then(usernameSnapshot => {

        usersInVoice.push({
          username: usernameSnapshot.val(),
          userTimestamp: childSnapshot.val(),
        });

      });
    });

    /* Sort to start from the longest */
    usersInVoice.sort(function(a,b){return b.userTimestamp - a.userTimestamp})

    /* Get time in voice today so far */
    firebase.database().ref(`voice/${currentYear}/day/${getTodayFirebaseString()}`).once("value").then(daySnapshot => {
      todayFromDB = daySnapshot.val() || 0;
    });

    /* Create an update function */
    let iterations = 1;
    function update() {
      let totalSessionSeconds = currentSession + (usersInVoice.length * iterations);
      let rtData = {
        currentlyInVoice: usersInVoice,
        currentUnixTS: Math.floor(Date.now() / 1000),
        totalSessionSeconds: totalSessionSeconds,
        totalVoiceSecondsToday: totalSessionSeconds + todayFromDB,
      };

      replaceTimes(rtData);
      iterations++;
    };

    /* Initiate the update function */
    amogus = setInterval(update, 1000);

  };
  
});

function replaceTimes(rtData) {
  let ppl = rtData.currentlyInVoice.length == 1 ? "User" : "Users";
  let seshAndTodaySame = rtData.totalSessionSeconds == rtData.totalVoiceSecondsToday;

  $("#voice-stats").replaceWith(`
  <div id="voice-stats">

    <div class="header">
      ${rtData.currentlyInVoice.length} ${ppl} in Voice
    </div>

    <div class="voice-lines">
      ${getVoiceUserLines(rtData)}
    </div>

    <div class="voice-total">
      <div class="user" ${seshAndTodaySame ? 'style="display:none;"' : ""}">
        <div class="username">Session</div>
        <div class="time">${getVoiceTime(rtData.totalSessionSeconds)}</div>
      </div>
      <div class="user">
        <div class="username">Today</div>
        <div class="time">${getVoiceTime(rtData.totalVoiceSecondsToday)}</div>
      </div>
    </div>

  </div>
  `);
};
function getVoiceUserLines(rtData) {
  let xd = "";
  rtData.currentlyInVoice.forEach(u => {

    xd += `
    <div class="user">
      <div class="username">${u.username.split("#")[0]}</div>
      <div class="time">${getVoiceTime(rtData.currentUnixTS - u.userTimestamp)}</div>
    </div>
    `;

  });
  return xd;
};

function getVoiceTime(s) {
  if (s < 0) { s = 0 }
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${hours}:${minutes}:${seconds}`;
};
function getTodayFirebaseString() {
  return new Date().toLocaleString("cs-CZ", { year:"numeric", month:"2-digit", day:"2-digit" }).replace(". ", "-").replace(". ", "-");
};
