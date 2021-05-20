let VERSION = 8;

let ranked = [];
let unranked = [];
let clown = 0;
let userDataRef = firebase.database().ref(`GameStats/R6Sv${VERSION}/main_data`);
userDataRef.once("value").then(snapshot => {

  snapshot.forEach(childSnapshot => {
    let cd = childSnapshot.val();
    if (cd.currentRank != "Unranked"){ ranked.push(cd); } else { unranked.push(cd); }
  });

  ranked.sort(function(a,b){return b.currentMMR - a.currentMMR})
  unranked.sort(function(a,b){return b.currentMMR - a.currentMMR})

  ranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown)); clown++; });
  unranked.forEach(u => { $("#tableDataPlace").append(getStatsRow(u, clown, true)); clown++; });
});

let lastUpdateRef = firebase.database().ref(`GameStats/lastUpdate/R6Sv${VERSION}`);
lastUpdateRef.once('value').then(snapshot => { $("#lastUpdated").text( `~${diff_minutes(new Date(snapshot.val()*1000), new Date())}` ); });


function getStatsRow(u, clown, unrank=false) {
  let pfpLink = `https://ubisoft-avatars.akamaized.net/${u.ubisoftID}/default_256_256.png`;
  let kd = unrank ? 0 : roundTwo(u.sKills / u.sDeaths);
  let wl = unrank ? 0 : roundTwo(u.sWins / (u.sWins + u.sLosses) * 100);
  let ptRAW = getPlaytime(u.totalPlaytime);
  let playtime = `${ptRAW[0]}h <span class="uk-visible@m">${ptRAW[1]}m <span class="uk-text-muted">${ptRAW[2]}s</span></span>`;
  let mmrChangeColor = u.lastMMRchange >= 0 ? ( u.lastMMRchange == 0 ? 'uk-text-muted' : 'uk-text-success' ) : 'uk-text-danger';
  let mmrChange = u.lastMMRchange == undefined ? '0' : u.lastMMRchange;
  let topOps = getTopTwoOperators(u);

  let a = `
    <tr>
      <td class="uk-visible@m uk-text-middle uk-text-center" sorttable_customkey="${clown}">
        <img style="height: 4rem;" class="uk-preserve-width" src="${pfpLink}" />
      </td>

      <td class="uk-text-middle" style="min-width: 5rem;" sorttable_customkey="${u.currentMMR}">
        ${u.ubisoftUsername}
      </td>

      <td class="uk-text-middle uk-text-center uk-padding-remove-horizontal">
        <img style="height: 4rem;" class="uk-preserve-width" src="${u.currentRankImage}" uk-tooltip="${u.currentRank}" />
        <img style="height: 3.5rem;" class="uk-preserve-width uk-visible@m uk-margin-small-left ${unrank==true?'uk-hidden':''} " src="${u.maxRankImage}" uk-tooltip="${u.maxRank}" />
      </td>

      <td uk-tooltip="Max ${addSpaces(parseInt(u.maxMMR))}">
        <div class="uk-flex uk-flex-row uk-flex-center uk-text-center">
          <span style="font-size: 0.8rem;" class='uk-text-muted'>${u.prevRankMMR}</span>
          <span uk-icon="arrow-right"></span>
          <span style="font-size: 0.8rem;" class='uk-text-muted'>${u.nextRankMMR}</span>
        </div>
        <div class="uk-flex uk-flex-row uk-flex-middle uk-flex-around">
          <span style="font-size: 1.5rem;" class='uk-text-nowrap'>${addSpaces(parseInt(u.currentMMR))}</span>
          <span class="${mmrChangeColor} uk-text-small">${mmrChange}</span>
        </div>
      </td>

      <td class="uk-text-middle uk-text-center" uk-tooltip="${u.sKills} / ${u.sDeaths}">
        ${kd}
      </td>

      <td class="uk-text-middle uk-text-center" uk-tooltip="${u.sWins} / ${u.sLosses}<br/>${u.sWins+u.sLosses} total">
        ${wl}%
      </td>

      <td class="uk-text-middle uk-text-center uk-visible@m">
        ${u.alphapackProbability == undefined ? "0" : u.alphapackProbability/100}%
      </td>

      <td class="uk-text-middle uk-text-center uk-visible@m">
        <div class="uk-flex uk-flex-row uk-flex-middle">
          <img style="height: 4rem;" src="${topOps[0].icon}" />
          <img style="height: 4rem;" src="${topOps[1].icon}" />
        </div>
      </td>

      <td class="uk-text-middle uk-text-center uk-visible@m" sorttable_customkey="${u.totalPlaytime}">
        ${playtime}
      </td>

      <td class="uk-text-middle uk-text-center uk-visible@m">
        ${roundTwo(u.hs)}%
      </td>

    </tr>`;
  return a
};

function diff_minutes(dt2, dt1) {
  // https://www.w3resource.com/javascript-exercises/javascript-date-exercise-44.php
  var diff =(dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
};
function orderBySubKey(dict, key) {
  return Object.values( dict ).map( value => value ).sort( (a,b) => b[key] - a[key] );
};
function getTopTwoOperators(d) {
  let o = d.operators;
  let atk = orderBySubKey(o.atk, "time_played");
  let def = orderBySubKey(o.def, "time_played");
  return [atk[0], def[0]]
};
function getPlaytime(s) {
  hours = Math.floor(s / 3600);
  s %= 3600;
  minutes = Math.floor(s / 60);
  seconds = s % 60;
  return [hours, minutes, seconds]
};



const operatorsJson = {
  "recruitfbi": {
    "name": "recruitfbi",
    "readable": "Recruit FBI SWAT",
    "atkdef": "recruit",
    "badgeLink": "https://i.imgur.com/Pd7krMT.png",
  },
  "smoke": {
    "name": "smoke",
    "readable": "Smoke",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/tkxDFWg.png",
  },
  "mute": {
    "name": "mute",
    "readable": "Mute",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/xJ6iqr1.png",
  },
  "sledge": {
    "name": "sledge",
    "readable": "Sledge",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/AKn1ULn.png",
  },
  "thatcher": {
    "name": "thatcher",
    "readable": "Thatcher",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/MYl1Gl2.png",
  },
  "castle": {
    "name": "castle",
    "readable": "Castle",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/Dr5x7e7.png",
  },
  "pulse": {
    "name": "pulse",
    "readable": "Pulse",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/y6hSeej.png",
  },
  "ash": {
    "name": "ash",
    "readable": "Ash",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/gXkH9Cl.png",
  },
  "thermite": {
    "name": "thermite",
    "readable": "Thermite",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/9uVh301.png",
  },
  "doc": {
    "name": "doc",
    "readable": "Doc",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/MzJAlf9.png",
  },
  "rook": {
    "name": "rook",
    "readable": "Rook",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/AZ2o09d.png",
  },
  "twitch": {
    "name": "twitch",
    "readable": "Twitch",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/OHZykQL.png",
  },
  "montagne": {
    "name": "montagne",
    "readable": "Montagne",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/p2gGMAo.png",
  },
  "kapkan": {
    "name": "kapkan",
    "readable": "Kapkan",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/LPhga5G.png",
  },
  "tachanka": {
    "name": "tachanka",
    "readable": "Tachanka",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/bRdSEI2.png",
  },
  "glaz": {
    "name": "glaz",
    "readable": "Glaz",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/Fdr50yV.png",
  },
  "fuze": {
    "name": "fuze",
    "readable": "Fuze",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/WpxoTw2.png",
  },
  "jager": {
    "name": "jager",
    "readable": "J\u00e4ger",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/ykglXiD.png",
  },
  "bandit": {
    "name": "bandit",
    "readable": "Bandit",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/iBdRyRn.png",
  },
  "blitz": {
    "name": "blitz",
    "readable": "Blitz",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/IhkK497.png",
  },
  "iq": {
    "name": "iq",
    "readable": "IQ",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/UtDoLtT.png",
  },
  "frost": {
    "name": "frost",
    "readable": "Frost",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/prGz6E6.png",
  },
  "buck": {
    "name": "buck",
    "readable": "Buck",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/nRSxJd2.png",
  },
  "valkyrie": {
    "name": "valkyrie",
    "readable": "Valkyrie",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/cG55PvJ.png",
  },
  "blackbeard": {
    "name": "blackbeard",
    "readable": "Blackbeard",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/h12akm4.png",
  },
  "caveira": {
    "name": "caveira",
    "readable": "Caveira",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/X8Wn7uP.png",
  },
  "capitao": {
    "name": "capitao",
    "readable": "Capit\u00e3o",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/Qvkut3P.png",
  },
  "echo": {
    "name": "echo",
    "readable": "Echo",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/JLXXREk.png",
  },
  "hibana": {
    "name": "hibana",
    "readable": "Hibana",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/ChqyReH.png",
  },
  "mira": {
    "name": "mira",
    "readable": "Mira",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/BXnayiP.png",
  },
  "jackal": {
    "name": "jackal",
    "readable": "Jackal",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/hvLklzC.png",
  },
  "lesion": {
    "name": "lesion",
    "readable": "Lesion",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/w3PjcvZ.png",
  },
  "ying": {
    "name": "ying",
    "readable": "Ying",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/wyJwvWZ.png",
  },
  "ela": {
    "name": "ela",
    "readable": "Ela",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/IRWSllb.png",
  },
  "zofia": {
    "name": "zofia",
    "readable": "Zofia",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/HRg8qXs.png",
  },
  "vigil": {
    "name": "vigil",
    "readable": "Vigil",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/vGg39cP.png",
  },
  "dokkaebi": {
    "name": "dokkaebi",
    "readable": "Dokkaebi",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/qYfoWsk.png",
  },
  "lion": {
    "name": "lion",
    "readable": "Lion",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/EgMlCaV.png",
  },
  "finka": {
    "name": "finka",
    "readable": "Finka",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/dhemeuU.png",
  },
  "maestro": {
    "name": "maestro",
    "readable": "Maestro",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/d0Zy3i4.png",
  },
  "alibi": {
    "name": "alibi",
    "readable": "Alibi",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/NXEI1ZN.png",
  },
  "clash": {
    "name": "clash",
    "readable": "Clash",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/EYGBED9.png",
  },
  "maverick": {
    "name": "maverick",
    "readable": "Maverick",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/hF2gJuY.png",
  },
  "kaid": {
    "name": "kaid",
    "readable": "Kaid",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/l6UPyA8.png",
  },
  "nomad": {
    "name": "nomad",
    "readable": "Nomad",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/U8sOErk.png",
  },
  "mozzie": {
    "name": "mozzie",
    "readable": "Mozzie",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/RHwnp7d.png",
  },
  "gridlock": {
    "name": "gridlock",
    "readable": "Gridlock",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/A95h9XN.png",
  },
  "warden": {
    "name": "warden",
    "readable": "Warden",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/OUhPdNj.png",
  },
  "nokk": {
    "name": "nokk",
    "readable": "N\u00f8kk",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/P0tYlx7.png",
  },
  "goyo": {
    "name": "goyo",
    "readable": "Goyo",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/s2AjbNb.png",
  },
  "amaru": {
    "name": "amaru",
    "readable": "Amaru",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/BL4ue5Y.png",
  },
  "wamai": {
    "name": "wamai",
    "readable": "Wamai",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/497uSOq.png",
  },
  "kali": {
    "name": "kali",
    "readable": "Kali",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/UH389qh.png",
  },
  "oryx": {
    "name": "oryx",
    "readable": "Oryx",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/vcUGkSs.png",
  },
  "iana": {
    "name": "iana",
    "readable": "Iana",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/fZbmkVz.png",
  },
  "melusi": {
    "name": "melusi",
    "readable": "Melusi",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/tlAhOmb.png",
  },
  "ace": {
    "name": "ace",
    "readable": "Ace",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/9C0j8iz.png",
  },
  "zero": {
    "name": "zero",
    "readable": "Zero",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/xWtzdxN.png",
  },
  "aruni": {
    "name": "aruni",
    "readable": "Aruni",
    "atkdef": "defender",
    "badgeLink": "https://i.imgur.com/uXBsnOg.png",
  },
  "flores": {
    "name": "flores",
    "readable": "Flores",
    "atkdef": "attacker",
    "badgeLink": "https://i.imgur.com/EVJZq5H.png",
  }
}
