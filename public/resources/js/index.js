firebase.database().ref("widget").on("value", snapshot => {
  let nowOnline = 0;
  $("#widget").replaceWith(`<div id="widget" class="users"></div>`);

  snapshot.forEach(childSnapshot => {
    let user = childSnapshot.val();
    if (user.status == "offline") { return }

    let a = `
      <!-- ${user.username} -->
      <div class="user">
        <div class="us">
          <div class="status status-${user.status}"></div>
          <div class="username">
            ${user.username}
          </div>
        </div>
        <div class="activity">
          ${getWidgetActivity(user.activities)}
        </div>
      </div>`;
    $("#widget").append(a);

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

  return gaem;
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
    
    let inVoice = [];
    console.log(snapshot.val());

    /* Connect usernames with timestamps */
    snapshot.forEach(childSnapshot => {
      firebase.database().ref(`users/${childSnapshot.key}/username`).once("value").then(usernameSnapshot => {

        inVoice.push({
          username: usernameSnapshot.val(),
          userTimestamp: childSnapshot.val()
        });

      });
    });

    /* Sort to start from the longest */
    inVoice.sort(function(a,b){return b.userTimestamp - a.userTimestamp})

    /* Create an update function */
    let iterations = 1;
    function update() {
      let unixTS = Math.floor(Date.now() / 1000);
      replaceTimes(inVoice, unixTS);
      iterations++;
    };

    /* Initiate the update function */
    amogus = setInterval(update, 1000);

  };
  
});

function replaceTimes(inVoice, unixTS) {
  let xd = `
  <div id="voice-stats">
    <div class="header">
      ${inVoice.length} People in Voice
    </div>
    <div class="voice-lines">
      ${getVoiceUserLines(inVoice, unixTS)}
    </div>
  </div>
  `;
  $("#voice-stats").replaceWith(xd);
};
function getVoiceUserLines(inVoice, unixTS) {
  let xd = "";
  inVoice.forEach(u => {

    xd += `
    <div class="user">
      <div class="username">${u.username.split("#")[0]}</div>
      <div class="time">${addSpaces(getVoiceTime(unixTS - u.userTimestamp))}</div>
    </div>
    `;

  });
  return xd;
};
function getVoiceTime(s) {
  let hours = Math.floor(s / 3600);
  s %= 3600;
  let minutes = Math.floor(s / 60);
  let seconds = s % 60;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return `${hours}:${minutes}:${seconds}`;
};

/*
function getTodayFirebaseString() {
  let dateObj = (new Date()).toLocaleString('cs-CZ', { year:'numeric',month:'numeric',day:'numeric' }).split('.');
  let year = dateObj[2];
  let month = dateObj[1];
  let day = dateObj[0];
  return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`.replaceAll(' ','')
};
*/
