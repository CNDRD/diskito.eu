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
  }); /* snapshot.forEach() */

  var serverTotalsRef = firebase.database().ref('serverTotals');
  serverTotalsRef.once('value').then(function(snapshot){
    sv = snapshot.val()

    sv_levels = sv.levels
    sv_messages =  sv.messages
    sv_rp =  sv.reactionPoints
    sv_voice =  sv.voice
    sv_xp = sv.xp

    $('#deleteMe').replaceWith();

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
    }; /* else{} */
  }); /* serverTotalsRef.once() */
}); /* insideDataRef.once() */

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
// Get Colors Function
function getColor(times, color){
  var colors = [];
  times.forEach(c => { colors.push(color) });
  return colors;
};

var yearsInDB = [];

var yr = new Date().getFullYear();

var totalTime = 0;
var usersTime = 0;
var topTotal = 0;
var topLVS = 0;
var topVoiceName = "";
var topLVSName = "";
var topVoiceDayTime = 0;
var topVoiceDayDate = "";

var currentYearTotalRef = firebase.database().ref(`voice/${yr}/total`);
currentYearTotalRef.once('value').then(function(snapshot){

  snapshot.forEach(function(childSnapshot){
    usersData = childSnapshot.val();

    var addVoice = parseInt(usersData.voice);
    totalTime += addVoice;
    usersTime++;

    var username = usersData.name;
    var posTop = parseInt(usersData.voice);
    if (posTop > topTotal){
      topTotal = posTop
      topVoiceName = username
    }

    var posLVS = parseInt(usersData.lvs);
    if (posLVS > topLVS){
      topLVS = posLVS
      topLVSName = username
    }
  }); /* snapshot.forEach() */

  var currentYearDaysRef = firebase.database().ref(`voice/${yr}/day`);
  currentYearDaysRef.once('value').then(function(snapshot){
    snapshot.forEach(function(childSnapshot){

      var posTopVoiceDayTime = parseInt(childSnapshot.val());
      var posTopVoiceDayName = childSnapshot.key;

      if (posTopVoiceDayTime > topVoiceDayTime){
        topVoiceDayTime = posTopVoiceDayTime;
        topVoiceDayDate = posTopVoiceDayName
      }
    }); /* snapshot.forEach() */

    var hours = addSpaces(Math.round(getOneTime(totalTime)))
    var average = addSpaces(Math.round(getOneTime(totalTime / usersTime)))
    var top = addSpaces(getOneTime(topTotal));
    var topName = topVoiceName.split('#')[0];
    var lvs = addSpaces(getOneTime(topLVS));
    var lvsName = topLVSName.split('#')[0];
    var topDayTime = addSpaces(Math.round(getOneTime(topVoiceDayTime)));
    var topDayName = topVoiceDayDate.split('-');

    txt = `
      <!-- ${yr} Card -->
      <div class="card shadow text-center font-size-20 font-weight-light">
        <p>
          In <span class='text-success font-size-24 font-weight-normal'>${yr}</span> we spent
          a total of <span class='text-success font-weight-normal'>${hours}</span> hours in voice, with an average of <span class='text-success font-weight-normal'>${average}</span> hours per user.
        </p>
        <p>
          The <span class="material-icons mi-30 text-success">military_tech</span> for most hours in voice takes <span class='text-success font-weight-normal'>${topName}</span>
          with <span class='text-success font-weight-normal'>${top}</span> hours spent in voice channels.
        </p>
        <p>
          <span class="material-icons mi-30 text-success ">military_tech</span> for longest single session in voice channels is for <span class='text-success font-weight-normal'>${lvsName}</span>,
          who spent <span class='text-success font-weight-normal'>${lvs}</span> hours in one sitting.
        </p>
        <p>
          On <span class='text-success font-weight-normal'>${topDayName[2].replace(/^0+/, '')}.${topDayName[1].replace(/^0+/, '')}. ${topDayName[0]}</span> there was <span class='text-success font-weight-normal'>${topDayTime}</span> total hours spent among the users.
          That's the most in a single day this year.
        </p>
      </div><!-- ${yr} Card -->
    `

    if (hours == 0){
      txt = `
      <!-- ${yr} Card -->
      <div class="card shadow text-center font-size-20 font-weight-light">
        <p>
          In <span class='text-success font-size-24 font-weight-normal'>${yr}</span> we didn't spend any time in voice yet.
        </p>
        <p>
          <span class='text-success font-size-24 font-weight-normal'>¯\\_(ツ)_/¯</span>
        </p>
      </div><!-- ${yr} Card -->
      `
    }

    $("#yearCards").append(txt)

  }); /* currentYearDayRef.once() */
}); /* currentYearTotalRef.once() */

/* ^^^^ Yearly Voice Stat ^^^^ */

/*\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\*/

/* Emoji Usage */

var emojiRef = firebase.database().ref('emojiCounts');
emojiRef.once('value').then(snapshot => {

  let arr = [];

  snapshot.forEach(childSnapshot => {

    let emote = childSnapshot.val();
    arr.push(emote);

  }); /* snapshot.forEach() */

  arr.sort(function(a,b){ return b.count - a.count });
  $('#allEmojiUses').replaceWith(getAllEmojiUses(arr));

}); /* emojiRef.once() */

function getAllEmojiUses(arr) {
  let r = ''
  arr.forEach(em => {
    if (em.count > 0) { r += getEmojiUsage(em); }
  }); /* arr.forEach */
  return r
};
function getEmojiUsage(e) {
  let a = `
  <div class="d-flex flex-column justify-content-center align-content-center m-10">
    <a href=${e.url} target="_blank">
      <img class='img-fluid h-50' src="${e.url}" />
    </a>
    <span class='text-muted font-size-20'>×${e.count}</span>
  </div>
  `
  return a
};

/* ^^^^ Emoji Usage ^^^^ */
