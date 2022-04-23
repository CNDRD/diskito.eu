const arr = []
firebase.database().ref("users").orderByKey().once("value").then(function(snapshot){

    let unixTimestamp = Math.floor(Date.now() / 1000)
    let year = new Date(unixTimestamp * 1000).getFullYear();

    $('#yr').text(`${year} Voice`);

    snapshot.forEach(function(childSnapshot){
        let uid = childSnapshot.key;
        let cD = childSnapshot.val();

        if (cD.username === undefined || cD.in_server == false || cD.joined_server === undefined){return}

        cD['currentYearVoice'] = cD[`voice_year_${year}`] ? cD[`voice_year_${year}`] : 0;
        cD['discordID'] = uid;
        cD.cicina_longest = cD.cicina_longest ? cD.cicina_longest : 0;
        arr.push(cD);

    }); /* snapshot.forEach() */

    arr.sort(function(a, b){return b.xp - a.xp})

    arr.forEach((user, i) => {
        if (user.xp != 0 || user.level != 0) {
            $("#tableDataPlace").append(getStatsDataRow(user, i));
        };
    });
});

function getStatsDataRow(u, i) {
    let a = `
      <!-- ${u.discordID} | ${u.username} -->
      <tr>
        <td class="hidden-mobile">
          ${i+1}
        </td>
        <td class="hidden-mobile">
            <img style="height: 3rem;" src="${u.avatar_url}" />
        </td>
        <td class="name">
            <a href="/user?id=${u.discordID}">
                ${reduceNameLength(u.username.split("#")[0])}
            </a>
        </td>
        <td sorttable_customkey="${u.xp}" class="hidden-mobile">
            <span class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.xp)} XP">
                ${u.level}
            </span>
        </td>
        <td sorttable_customkey="${u.messages_count}">
            ${addSpaces(u.messages_count)}
        </td>
        <td sorttable_customkey="${u.currentYearVoice}">
            <span class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.currentYearVoice)} seconds">
                ${getOneTime(u.currentYearVoice)}h
            </span>
        </td>
        <td sorttable_customkey="${u.money}" class="hidden-mobile">
            <span class="hint--top hint--rounded hint--no-arrow" aria-label="${addSpaces(u.money)} shekels">
                ${abbreviateNumber(u.money)}
            </span>
        </td>
        <td sorttable_customkey="${u.reacc_points}" class="hidden-mobile">
            ${addSpaces(u.reacc_points)}
        </td>
        <td class="hidden-mobile">
            ${addSpaces(u.cicina_longest)} cm
        </td>
      </tr>`;
    return a
};
function reduceNameLength(a){
    return a.substr(0,15).length > 14 ? `${a.substr(0,15)}..` : a.substr(0,15);
};
function abbreviateNumber(value) {
    // https://stackoverflow.com/a/10601315/13186339
    let newValue = value;
    if (value >= 1000) {
        let suffixes = ["", "k", "mil", "bil","tril"];
        let suffixNum = Math.floor( (""+value).length/3 );
        let shortValue = '';
        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat( (suffixNum != 0 ? (value / Math.pow(1000,suffixNum) ) : value).toPrecision(precision));
            let dotLessShortValue = (shortValue + '').replace(/[^a-zA-Z 0-9]+/g,'');
            if (dotLessShortValue.length <= 2) { break; }
        }
        if (shortValue % 1 != 0) {
            shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue+suffixes[suffixNum];
    }
    return newValue;
};
