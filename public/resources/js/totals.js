let unixTimestamp = Math.floor(Date.now() / 1000)
let currentYear = new Date().getFullYear()
let currrentTimeInVoice = 0;
let usersInVoiceCount = 0;

firebase.database().ref(`voice/${currentYear}/in`).once("value").then(snapshot => {

  snapshot.forEach(childSnapshot => {
    console.log();
    currrentTimeInVoice += (unixTimestamp - childSnapshot.val());
    usersInVoiceCount++;
  });

  firebase.database().ref("serverTotals").once("value").then(totalsSnapshot => {

    let messages = totalsSnapshot.val().messages;
    let rps = totalsSnapshot.val().reactionPoints;
    let xp = totalsSnapshot.val().xp;
    let levels = totalsSnapshot.val().levels;
    let voice = totalsSnapshot.val().voice;

    if (usersInVoiceCount === 0) {
      replaceChat(messages, rps, xp, levels);
      replaceVoice(voice);
    } else {

      let iterations = 1;
      function update() {
        let newTime = voice + currrentTimeInVoice + (usersInVoiceCount * iterations);
        let newXP = xp + (newTime/7);
        replaceChat(messages, rps, newXP, levels);
        replaceVoice(newTime);
        iterations++;
      };

      amogus = setInterval(update, 1000);

    }

  });

});

function replaceChat(messages, rps, xp, levels) {
  $("#messages").text(addSpaces(messages));
  $("#rps").text(addSpaces(rps));
  $("#xp").text(addSpaces(Math.round(xp)));
  $("#levels").text(addSpaces(levels));
};
function replaceVoice(tv) {
  $('#seconds').text(addSpaces(tv));
  $('#minutes').text(addSpaces(Math.round((tv/60)*10)/10));
  $('#hours').text(addSpaces(Math.round((tv/60/60)*10)/10));
  $('#days').text(addSpaces(Math.round((tv/60/60/24)*10)/10));
};



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
