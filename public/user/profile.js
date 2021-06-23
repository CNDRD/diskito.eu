const discordConnectID = Math.random().toString(36).substr(2, 12);

var user = false;
firebase.auth().onAuthStateChanged(userAuth => {
  if (!userAuth) { isUser(false); } else { isUser(true);

    user = userAuth;

    firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(snapshot => {
      if (snapshot.val() != undefined) {
        firebase.database().ref(`users/${snapshot.val()}/username`).once("value").then(nameSnapshot => {
          isDiscordConnected(true);
          $("#discordConnectedName").text(nameSnapshot.val());
        });
      } else {
        isDiscordConnected(false);
        $("#discordConnectionCodeInput").attr("value", `,connect ${discordConnectID}`)
        $("#discordConnectionCodeButton").attr("onclick", `copyThis(',connect ${discordConnectID}')`)
      }
    });

  }
});


function doDiscordStats() {
  let discordStatsDiv = "#personalDiscordStatsPlace";
  const goodStatKeys = ["all_time_total_voice", "voice_year_2020", "voice_year_2021", "voice_year_2022",
                        "cicna_avg", "cicina_count", "cicina_last", "cicina_longest", "joined_discord", "joined_server",
                        "last_xp_get", "level", "messages_count", "money", "reacc_points", "xp"];

  $(discordStatsDiv).replaceWith('<div id="personalDiscordStatsPlace"></div>');

  firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(snapshot => {
    firebase.database().ref(`users/${snapshot.val()}`).once("value").then(ns => {
      let zmrd = ns.val();

      for (const key in zmrd) {
        if (goodStatKeys.includes(key)) {
          let fancyKey = getFancyKey(key);
          let fancyValue = getFancyValue(key, zmrd[key])
          let msgLmao = `
            <div class="uk-flex uk-flex-between">
              <span>${fancyKey}</span>
              <span>${fancyValue}</span>
            </div>`;
          $(discordStatsDiv).append(msgLmao);
        }
      }

    });
  });
};
function getFancyKey(key) {
  let xd = {
    all_time_total_voice: "All Time Total Voice",
    voice_year_2020: "2020 Total Voice",
    voice_year_2021: "2021 Total Voice",
    voice_year_2022: "2022 Total Voice",
    cicna_avg: "Average Cicina",
    cicina_count: "Total Cicina Tries",
    cicina_last: "Last Cicina Try",
    cicina_longest: "Longest Cicina",
    joined_discord: "Joined Discord",
    joined_server: "Joined Diskíto",
    last_xp_get: "Last Time You Got XP",
    level: "Level",
    xp: "XP",
    messages_count: "Number of Messages",
    money: "Money",
    reacc_points: "Reaction Points",
  }
  return xd[key]
};
function getFancyValue(key, value) {

  let fuckWithDate = (date) => { return new Date(date).toLocaleString() }

  switch (key) {
    case "joined_discord": return fuckWithDate(value*1000);
    case "joined_server": return fuckWithDate(value*1000);
    case "last_xp_get": return fuckWithDate(value*1000);
    case "cicina_last": return `${fuckWithDate(value).split(" ")[0]} ${fuckWithDate(value).split(" ")[1]} ${fuckWithDate(value).split(" ")[2]}`;
    case "cicna_avg": return (Math.round((value + Number.EPSILON) * 100) / 100);
    case "all_time_total_voice": return `${getOneTime(value)} hr`;
    case "voice_year_2020": return `${getOneTime(value)} hr`;
    case "voice_year_2021": return `${getOneTime(value)} hr`;
    case "voice_year_2022": return `${getOneTime(value)} hr`;
  }

  return addSpaces(value)
};

function isDiscordConnected(lolz) {
  let icon = "#discordConnectionIcon";
  let loader = "#discordConnectionLoader";
  let success = "#discordSuccessfullyConnected";
  let fucked = "#discordNotConnected";
  let connectDiscord = "#discordConnectionCode";
  let discordStats = "#personalDiscordStats";

  if (lolz) {
    /* Yes */
    $(loader).hide();
    $(icon).show();
    $(success).show();
    $(fucked).hide();
    $(connectDiscord).hide();
    doDiscordStats();
    $(discordStats).show();
  } else {
    /* No */
    $(loader).hide();
    $(icon).show();
    $(success).hide();
    $(fucked).show();
    $(connectDiscord).show();
    $(discordStats).hide();
  }
};

function isUser(huh) {
  if (huh) {
    $("#plsLoginMessage").hide();
    $("#discordConnection").show();
    $("#personalDiscordStats").show();
  } else {
    $("#plsLoginMessage").show();
    $("#discordConnection").hide();
    $("#personalDiscordStats").hide();
  }
}

let discordConnectionRef = firebase.database().ref('discordConnection');
discordConnectionRef.on('value', snapshot => {
  snapshot.forEach(childSnapshot => {
    if (childSnapshot.val() == discordConnectID) {
      firebase.database().ref(`websiteProfiles/${user.uid}`).set({discordUID: childSnapshot.key});
      firebase.database().ref(`users/${childSnapshot.key}`).update({firebaseUID: user.uid});
      firebase.database().ref(`discordConnection/${childSnapshot.key}`).remove();
      location.reload();
    }
  });
});

function copyThis(text) {
  let textArea = document.createElement("textarea");
  textArea.style.position = 'fixed';
  textArea.style.top = 0;
  textArea.style.left = 0;
  textArea.style.width = '2em';
  textArea.style.height = '2em';
  textArea.style.padding = 0;
  textArea.style.border = 'none';
  textArea.style.outline = 'none';
  textArea.style.boxShadow = 'none';
  textArea.style.background = 'transparent';
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  $("#discordConnectionCodeButton").attr("uk-icon", "icon: check");
  UIkit.notification({
    message: "<span uk-icon='icon: check'></span> Command succesfully copied!",
    status: "success", timeout: 2700});
  setTimeout(function(){ $("#discordConnectionCodeButton").attr("uk-icon", "icon: copy"); }, 3000);
}
