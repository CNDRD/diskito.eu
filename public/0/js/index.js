function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};
function timeConverter(UNIX_timestamp) {
  // https://stackoverflow.com/a/6078873/13186339
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var time = `${year}-${month}-${date < 10 ? '0' + date: date}`;
  return time;
};
function getVoiceTime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
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

const currentYear = new Date().getFullYear();

let kokotina = 0;

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    let insideVoiceDataRef = firebase.database().ref(`voice/${currentYear}/in`);
    insideVoiceDataRef.on('value', (snapshot) => {
      // {210471447649320970: 1615139842, 210471447649320970: 1615139842, ...}

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
            }); /* usersInVoice.push() */
          }); /* usernameRef.once('value') */

        }); /* snapshot.forEach() */

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
        }; /* fn update() */
        amogus = setInterval(update, 1000);
      };

      kokotina++;
    }); /* insideVoiceDataRef.on() */
  } else {
    removeTimesCard()
  }
});

function removeTimesCard() {
  $('#inVoice').replaceWith('<div id="inVoice"></div>');
};
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
  <div class="w-400 mw-full font-weight-light" id='inVoice'>
    <div class="card shadow p-0">
      <div class="content text-center">
        <div class="font-size-24 font-weight-normal">
          ${uivc} ${uivc == 1 ? "Person" : "People"} In Voice
        </div>

        <hr class='my-20'>

        <div class='row'>${eachUserSeparately}</div>

        <hr class='my-20'>

        <div class='row'>
          <div class='col-6 text-muted d-flex flex-column flex-nowrap align-items-center justify-content-center'>
            <span class='font-size-18 border-bottom'>This Session</span>
            <span class='font-size-22 text-nowrap text-secondary'>${getVoiceTime(tv)}</span>
          </div>
          <div class='col-6 text-muted d-flex flex-column flex-nowrap align-items-center justify-content-center'>
            <span class='font-size-18 border-bottom'>Total Today</span>
            <span class='font-size-22 text-nowrap text-secondary'>${getVoiceTime(tvToday)}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
  `;
  return text
};
function geteachUserSeparately(uiv, unixTS) {
  let eachUserSeparately = ""

  uiv.forEach(function(user, i){
    let username = (user.username).split('#');
    let time = addSpaces(getVoiceTime(unixTS - user.userTimestamp));

    let colsize = getColSize(uiv.length, i);

    a = `
    <div class='col-${colsize} text-muted d-flex flex-column flex-nowrap align-items-center justify-content-center'>
      <span class='font-size-18'>${username[0]}</span>
      <span class='font-size-22 text-nowrap text-secondary border-top'>${time}</span>
    </div>
    `;
    eachUserSeparately += a;
  }); /* uiv.forEach() */
  return eachUserSeparately
};
function getColSize(uivl, i) {
  if (uivl % 3 == 1) {
    if (i == (uivl-1)) { return 12 }
    else { return 4 }
  }
  else if (uivl % 3 == 2) {
    if (i == (uivl-1) || i == (uivl-2)) { return 6 }
    else { return 4 }
  }
  else { return 4 }
};

/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/

const dURL = 'https://discord.com/api/guilds/402356550133350411/widget.json'
const botUsernames = [`Giveaways '%'`, `Hydra '-'`, `Freddie`]

$.getJSON(dURL, function(data) {
  let users = data['members']

  // '-2' because of the 2 unlisted Bots
  $('#nowOnline').text(`${parseInt(data['presence_count'])-2} Now Online`)

  users.forEach(function(chS){
    // dvojbodka koniec zátvorky
    if (!botUsernames.includes(chS.username)){

      let a = `
        <!-- ${chS.username} -->
        <div class='row justify-content-between font-weight-light'>
          <div>
            <span class='${getStatus(chS.status)} col'>${getUsername(chS.username)}</span>
          </div>
          <div>
            ${getVoiceIcons(chS)}
            <span class='text-muted col'>${shortenGameNames(chS.game)}</span>
          </div>
        </div>
      `;
      $('#widget').append(a);

    }; /* if( !botUsernames.includes(chS.username) ){} */
  }); /* users.forEach() */
}); /* $.getJSON() */

function getStatus(status) {
  if (status == "online"){
    return "text-success"
  }
  else if (status == "idle"){
    return "text-secondary"
  }
  else if (status == "dnd"){
    return "text-danger"
  }
  else {
    return "text-primary"
  }
}; /* fn getStatus() */
function getUsername(un) {
  let goodBots = [`Bruce`, `Bruce Too`, `Liquid`, `Liquid [Beta]`]
  if (un == 'CNDRD'){ return `${un} <i class="fas fa-crown text-secondary"></i>` }
  if (goodBots.includes(un)){ return `${un.replace(" ','","")} <img src='/0/resources/badgeBot.png' class='img-fluid mb-0' style='height: 1.4rem' alt='Bot Badge' />` }
  return un
}; /* fn getUsername() */
function reduceStringLength(str, len) {
  return str.substr(0,len).length > (len-1) ? `${str.substr(0,len)}..` : str.substr(0,len)
}; /* fn reduceStringLength() */
function shortenGameNames(gaem) {
  gaem = gaem ? gaem.name : "";
  gaem = gaem.replace('Counter-Strike: Global Offensive', 'CS:GO');
  return reduceStringLength(gaem, 23)
}; /* fn shortenGameNames()*/
function getVoiceIcons(user) {
  let width = 17;
  let height = 17;
  var mic = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M14.99 11C14.99 12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34
  2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14 17.3 11H19C19 14.42 16.28 17.24 13 17.72V21H11V17.72C7.72
  17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1ZM12 4C11.2 4 11 4.66667 11 5V11C11 11.3333 11.2 12 12 12C12.8 12 13 11.3333
  13 11V5C13 4.66667 12.8 4 12 4Z" class='bg-danger' fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M14.99 11C14.99
  12.66 13.66 14 12 14C10.34 14 9 12.66 9 11V5C9 3.34 10.34 2 12 2C13.66 2 15 3.34 15 5L14.99 11ZM12 16.1C14.76 16.1 17.3 14
  17.3 11H19C19 14.42 16.28 17.24 13 17.72V22H11V17.72C7.72 17.23 5 14.41 5 11H6.7C6.7 14 9.24 16.1 12 16.1Z" fill="currentColor"></path></svg>`
  var selfMuted = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" fill="currentColor"></path>
  <path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" fill="currentColor"></path>
  <path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" fill="currentColor"></path>
  <path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" class="text-danger" fill="currentColor"></path></svg>`
  var serverMuted = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.7 11H5C5 12.19 5.34 13.3 5.9 14.28L7.13 13.05C6.86 12.43 6.7 11.74 6.7 11Z" class='text-danger' fill="currentColor"></path>
  <path d="M9.01 11.085C9.015 11.1125 9.02 11.14 9.02 11.17L15 5.18V5C15 3.34 13.66 2 12 2C10.34 2 9 3.34 9 5V11C9 11.03 9.005 11.0575 9.01 11.085Z" class='text-danger' fill="currentColor"></path>
  <path d="M11.7237 16.0927L10.9632 16.8531L10.2533 17.5688C10.4978 17.633 10.747 17.6839 11 17.72V22H13V17.72C16.28 17.23 19 14.41 19 11H17.3C17.3 14 14.76 16.1 12 16.1C11.9076 16.1 11.8155 16.0975 11.7237 16.0927Z" class='text-danger' fill="currentColor"></path>
  <path d="M21 4.27L19.73 3L3 19.73L4.27 21L8.46 16.82L9.69 15.58L11.35 13.92L14.99 10.28L21 4.27Z" class='text-danger' fill="currentColor"></path></svg>`

  var earphones = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24"><svg width="24" height="24" viewBox="0 0 24 24">
  <path d="M12 2.00305C6.486 2.00305 2 6.48805 2 12.0031V20.0031C2 21.1071 2.895 22.0031 4 22.0031H6C7.104 22.0031 8 21.1071 8 20.0031V17.0031C8
  15.8991 7.104 15.0031 6 15.0031H4V12.0031C4 7.59105 7.589 4.00305 12 4.00305C16.411 4.00305 20 7.59105 20 12.0031V15.0031H18C16.896 15.0031 16
  15.8991 16 17.0031V20.0031C16 21.1071 16.896 22.0031 18 22.0031H20C21.104 22.0031 22 21.1071 22 20.0031V12.0031C22 6.48805 17.514 2.00305 12 2.00305Z" fill="currentColor"></path></svg></svg>`
  var selfDeafened = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" fill="currentColor"></path>
  <path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" fill="currentColor"></path>
  <path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" class='text-danger' fill="currentColor"></path></svg>`
  var serverDeafened = `<svg aria-hidden="false" width="${width}" height="${height}" viewBox="0 0 24 24">
  <path d="M6.16204 15.0065C6.10859 15.0022 6.05455 15 6 15H4V12C4 7.588 7.589 4 12 4C13.4809 4 14.8691 4.40439 16.0599 5.10859L17.5102 3.65835C15.9292 2.61064 14.0346 2 12 2C6.486 2 2 6.485 2 12V19.1685L6.16204 15.0065Z" class='text-danger' fill="currentColor"></path>
  <path d="M19.725 9.91686C19.9043 10.5813 20 11.2796 20 12V15H18C16.896 15 16 15.896 16 17V20C16 21.104 16.896 22 18 22H20C21.105 22 22 21.104 22 20V12C22 10.7075 21.7536 9.47149 21.3053 8.33658L19.725 9.91686Z" class='text-danger' fill="currentColor"></path>
  <path d="M3.20101 23.6243L1.7868 22.2101L21.5858 2.41113L23 3.82535L3.20101 23.6243Z" class='text-danger' fill="currentColor"></path></svg>`

  var icons = ''
  // Not in voice
  if (user.mute == undefined || user.deaf == undefined || user.self_mute == undefined || user.self_deaf == undefined) { return '' }

  // Speaking
  if (user.mute != undefined && user.mute) { icons += serverMuted }
  else if (user.self_mute != undefined && user.self_mute) { icons += selfMuted }
  else { icons += mic }

  // Listening
  if (user.deaf != undefined && user.deaf) { icons += serverDeafened }
  else if (user.self_deaf != undefined && user.self_deaf) { icons += selfDeafened }
  else { icons += earphones }

  return icons
}; /* fn getVoiceIcons() */

/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    convertLoginToButton();
    generateEntries(true);
  } else {
    convertLoginToButton(false);
    generateEntries(false);
  }
});

function formSubmitted() {
  firebase.auth().signInWithEmailAndPassword("NGXnYvqnEq9CK7C6@diskito.eu", document.powice["pw"].value)
  .then((userCredential) => { convertLoginToButton(); generateEntries(true); })
  .catch((error) => { console.log(error.code, error.message); });

  return false;
};

function convertLoginToButton(huh=true) {
  if (huh) {
    $('#loginOrButton').replaceWith(`
      <div class="btn-group" role="group" id="loginOrButton">
        <a href="#NGXnYvqnEq9CK7C6" class="btn btn-success" role="button">Click!</a>
        <button class="btn" type="button" onClick="firebase.auth().signOut()">👋</button>
      </div>
      `);
  } else {
    $('#loginOrButton').replaceWith(`
      <form class="input-group input-group-sm" name="powice" action="javascript:formSubmitted()" onsubmit="" id="loginOrButton">
        <input type="password" name="pw" class="form-control" required />
        <div class="input-group-append">
          <input class="btn" type="submit" value="👮‍♂️" />
        </div>
      </form>
      `);
  }
};
function generateEntries(hah) {
  if (hah==false) { $('#kontysh').replaceWith(`<div class="container" id="kontysh"></div>`) }
  else {
    let zmrdusRef = firebase.database().ref('zmrdus');
    zmrdusRef.once('value').then(snapshot => {
      let i = 0;
      addRow("IP", "Last visit (UTC)", "ISP", "Country", "City", "No. of Visits", i); i++;

      snapshot.forEach(childSnapshot => {
        let c = childSnapshot.val();
        addRow(c.ip, tc(c.ts), c.isp, c.country, c.city, c.count, i); i++;
      });

    });
  }
};
function tc(UNIX_timestamp) {
  // https://stackoverflow.com/a/6078873/13186339
  var a = new Date(UNIX_timestamp*1000);
  var months = ['1','2','3','4','5','6','7','8','9','10','11','12'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours() < 10 ? '0' + a.getHours() : a.getHours();
  var min = a.getMinutes() < 10 ? '0' + a.getMinutes() : a.getMinutes();
  var sec = a.getSeconds() < 10 ? '0' + a.getSeconds() : a.getSeconds();
  return `${hour}:${min}:${sec} on ${date}.${month}. ${year}`;
};
function addRow(peepee, tiem, isp, country, city, cunt, i) {
  return $('#kontysh').append(`
  <div class="row p-5 font-weight-light ${i%2==0 ? 'bg-dark': 'bg-dark-light'} ${i==0 ? 'font-size-20' : ''}">
    <div class="col">${peepee}</div>
    <div class="col">${tiem}</div>
    <div class="col">${isp}</div>
    <div class="col">${country} (${city})</div>
    <div class="col">${cunt}</div>
  </div>
  `)
};


/**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**//**/
