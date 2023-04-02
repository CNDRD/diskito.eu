
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
