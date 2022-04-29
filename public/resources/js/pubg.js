
firebase.database().ref(`GameStats/PUBG`).once("value").then(snapshot => {

    snapshot.forEach(child => {
        childVal = child.val();

        ["solo","solo-fpp","duo","duo-fpp","squad","squad-fpp"]
        .forEach(gamemode => {

            if (childVal[gamemode] != "None") {
                $(`#${gamemode}_data`).append(
                    getUserRow(childVal[gamemode], childVal.discordUsername)
                );
            }

        });

    });

});

function getUserRow(g, name) {
    //console.log(name, g);

    let totalDistance = g.walkDistance + g.swimDistance + g.rideDistance

    return `
    <tr>
        <td class="name">${name}</td>
        <td>${g.roundsPlayed == 0 ? "-" : g.roundsPlayed}</td>
        <td>${g.kills == 0 ? "-" : g.kills}</td>
        <td>${g.wins == 0 ? "-" : g.wins}</td>
        <td>${g.losses == 0 ? "-" : g.losses}</td>
        <td>${g.assists == 0 ? "-" : g.assists}</td>
        <td>${g.dBNOs == 0 ? "-" : g.dBNOs}</td>
        <td>${g.longestKill == 0 ? "-" : roundTwo(g.longestKill)}m</td>
        <td>${g.damageDealt == 0 ? "-" : addSpaces(roundTwo(g.damageDealt))}</td>
        <td>${g.headshotKills == 0 ? "-" : g.headshotKills}</td>
        <td>${totalDistance == 0 ? "-" : addSpaces(Math.ceil(totalDistance))}m</td>
        <td>${g.boosts == 0 ? "-" : g.boosts}</td>
        <td>${g.heals == 0 ? "-" : g.heals}</td>
    </tr>`;
};
