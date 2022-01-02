/* Overall Server Stats */

var unixTimestamp = Math.floor(Date.now() / 1000)
var currentYear = new Date().getFullYear()
var currrentTimeInVoice = 0;
var usersInVoice = 0;

var insideDataRef = firebase.database().ref(`voice/${currentYear}/in`);
insideDataRef.once('value').then(function(snapshot){
  snapshot.forEach(function(childSnapshot){
    currrentTimeInVoice += (unixTimestamp - childSnapshot.val())
    usersInVoice++;
  });

  var serverTotalsRef = firebase.database().ref('serverTotals');
  serverTotalsRef.once('value').then(function(snapshot){
    sv = snapshot.val()

    sv_levels = sv.levels
    sv_messages =  sv.messages
    sv_rp =  sv.reactionPoints
    sv_voice =  sv.voice
    sv_xp = sv.xp

    if (usersInVoice == 0){
      replaceVoice(sv_voice)
      replaceChat(sv_levels, sv_messages, sv_rp, sv_xp)
    }else{
      var iterations = 1;
      function update(){
        var newTime = sv_voice + currrentTimeInVoice + (usersInVoice * iterations)
        replaceVoice(newTime)
        replaceChat(sv_levels, sv_messages, sv_rp, (sv_xp+(newTime/7)))
        iterations++;
      }
      var jebka = setInterval(update, 1000)
    };
  });
});

function replaceChat(levels, messages, rp, xp) {
  $("#msNum").text(addSpaces(messages));
  $("#xpNum").text(addSpaces(Math.round(xp)));
  $("#rpNum").text(addSpaces(rp));
  $("#lvNum").text(addSpaces(levels));
}
function replaceVoice(tv) {
  $('#sec').text(addSpaces(tv));
  $('#min').text(addSpaces(Math.round((tv/60)*10)/10));
  $('#hrs').text(addSpaces(Math.round((tv/60/60)*10)/10));
  $('#day').text(addSpaces(Math.round((tv/60/60/24)*10)/10));
}
/* ^^^^ Overall Server Stats ^^^^ */

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/* Yearly Voice Stats */
let yr = new Date().getFullYear();

let allYearsData = {
  2020: {
    averageHours: 94,
    longestSingleSession: 16.12,
    longestSingleSessionName: "CNDRD",
    mostHoursInOneDay: 74,
    mostHoursInOneDayDate: "9.11. 2020",
    mostHoursInVoice: 697.37,
    mostHoursInVoiceName: "CNDRD",
    totalHours: 2432
  },
  2021: {
    averageHours: 110,
    longestSingleSession: 14.73,
    longestSingleSessionName: "Brebik",
    mostHoursInOneDay: 95,
    mostHoursInOneDayDate: "6.4. 2021",
    mostHoursInVoice: 1246.88,
    mostHoursInVoiceName: "CNDRD",
    totalHours: 6356
  }
};

let totalTime = 0;
let usersTime = 0;
let topTotal = 0;
let topLVS = 0;
let topVoiceName = "";
let topLVSName = "";
let topVoiceDayTime = 0;
let topVoiceDayDate = "";

let currentYearTotalRef = firebase.database().ref(`voice/${yr}/total`);
currentYearTotalRef.once('value').then(snapshot => {

  snapshot.forEach(childSnapshot => {
    usersData = childSnapshot.val();

    let addVoice = parseInt(usersData.voice);
    totalTime += addVoice;
    usersTime++;

    let username = usersData.name;
    let posTop = parseInt(usersData.voice);
    if (posTop > topTotal){
      topTotal = posTop;
      topVoiceName = username;
    }

    let posLVS = parseInt(usersData.lvs);
    if (posLVS > topLVS){
      topLVS = posLVS;
      topLVSName = username;
    }
  });

  let currentYearDaysRef = firebase.database().ref(`voice/${yr}/day`);
  currentYearDaysRef.once('value').then(function(snapshot){
    snapshot.forEach(childSnapshot => {

      let posTopVoiceDayTime = parseInt(childSnapshot.val());
      let posTopVoiceDayName = childSnapshot.key;

      if (posTopVoiceDayTime > topVoiceDayTime){
        topVoiceDayTime = posTopVoiceDayTime;
        topVoiceDayDate = posTopVoiceDayName
      }
    });

    let hours = Math.round(getOneTime(totalTime))
    let average = Math.round(getOneTime(totalTime / usersTime));
    let top = getOneTime(topTotal);
    let topName = topVoiceName.split('#')[0];
    let lvs = getOneTime(topLVS);
    let lvsName = topLVSName.split('#')[0];
    let topDayTime = Math.round(getOneTime(topVoiceDayTime));
    let topDayName = topVoiceDayDate.split('-');

    allYearsData[yr] = {
      totalHours: hours,
      averageHours: average,
      mostHoursInVoice: top,
      mostHoursInVoiceName: topName,
      longestSingleSession: lvs,
      longestSingleSessionName: lvsName,
      mostHoursInOneDay: topDayTime,
      mostHoursInOneDayDate: `${topDayName[2].replace(/^0+/, '')}.${topDayName[1].replace(/^0+/, '')}. ${topDayName[0]}`
    };

    $("#yearsGrid").replaceWith(getYearCards(allYearsData));

  });

});

function getYearCards(yearsData, xd = []) {
  for(let yr in yearsData){xd.push(getYearCard(yearsData[yr], yr));}; return xd
};
function getYearCard(year, yr) {
  let a = `
    <!-- ${yr} -->
    <div class="uk-card uk-card-secondary uk-card-hover uk-card-body uk-light uk-flex uk-flex-column uk-flex-center">
      <h1 class="uk-card-title uk-text-lead uk-text-primary uk-margin-remove-bottom">${yr}</h1>
      <ul class="uk-list">
        <li class="uk-text-large uk-text-light"> <span class="uk-text-success">${addSpaces(year.totalHours)}</span> total hours. Average of <span class="uk-text-success">${year.averageHours}</span> hours per user </li>
        <li class="uk-text-large uk-text-light"> <span class="uk-text-success">${year.mostHoursInVoiceName}</span> with <span class="uk-text-success">${addSpaces(year.mostHoursInVoice)}</span> total hours in ${yr} </li>
        <li class="uk-text-large uk-text-light"> <span class="uk-text-success">${year.longestSingleSessionName}</span> with <span class="uk-text-success">${addSpaces(year.longestSingleSession)}</span> hours in a single session </li>
        <li class="uk-text-large uk-text-light"> <span class="uk-text-success">${year.mostHoursInOneDayDate}</span> with <span class="uk-text-success">${year.mostHoursInOneDay}</span> hours in one day </li>
      </ul>
    </div>`;
  return a
};

/* ^^^^ Yearly Voice Stat ^^^^ */

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/* Emoji Usage */

var emojiRef = firebase.database().ref('emojiCounts');
emojiRef.once('value').then(snapshot => {

  let arr = [];

  snapshot.forEach(childSnapshot => {
    let emote = childSnapshot.val();
    arr.push(emote);
  });

  arr.sort(function(a,b){ return b.count - a.count });
  $('#emojiUsageCount').replaceWith(getAllEmojiUses(arr));

});

function getAllEmojiUses(arr) {
  let r = ''
  arr.forEach((em, i) => {
    if (em.count > 0) { r += getEmojiUsage(em, i); }
  });
  return r
};
function getEmojiUsage(e, lol) {
  let a = `
  <div class="uk-inline uk-dark uk-margin-small-right uk-margin-small-left uk-margin-large-top ${lol > 8 ? 'uk-visible@s' : ''}">
    <img style="height: 4rem;" src="${e.url}" />
    <span class="uk-position-absolute uk-transform-center uk-badge" style="right: -40%; top: 0">×${e.count}</span>
  </div>
  `
  return a
};

/* ^^^^ Emoji Usage ^^^^ */
