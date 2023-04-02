import { c, supabase } from '../jss/main.js';

let unixTimestamp = Math.floor(Date.now() / 1000);
let currrentTimeInVoice = 0;
let usersInVoiceCount = 0;
let amogus;

const { data: totalsDb } = await supabase.from('server_totals').select('*');
let totals = totalsDb[0];

const { data: currentVoice } = await supabase.from('current_voice').select('*');
currentVoice.forEach(voice_user => {
  currrentTimeInVoice += (unixTimestamp - voice_user.since);
  usersInVoiceCount++;
});

if (usersInVoiceCount === 0) {
  replaceChat(totals.messages, totals.xp, totals.levels);
  replaceVoice(totals.voice);
} else {

  let iterations = 1;
  function update() {
    let newTime = totals.voice + currrentTimeInVoice + (usersInVoiceCount * iterations);
    let newXP = totals.xp + (newTime/7);
    replaceChat(totals.messages, newXP, totals.levels);
    replaceVoice(newTime);
    iterations++;
  };

  amogus = setInterval(update, 1000);
}

function replaceChat(messages, xp, levels) {
  $("#messages").text(addSpaces(messages));
  $("#xp").text(addSpaces(Math.round(xp)));
  $("#levels").text(addSpaces(levels));
};
function replaceVoice(tv) {
  $('#seconds').text(addSpaces(tv));
  $('#minutes').text(addSpaces(Math.round((tv/60)*10)/10));
  $('#hours').text(addSpaces(Math.round((tv/60/60)*10)/10));
  $('#days').text(addSpaces(Math.round((tv/60/60/24)*10)/10));
};
