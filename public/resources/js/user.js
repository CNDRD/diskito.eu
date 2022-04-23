let userid = new URLSearchParams(window.location.search).get('id');

const actuallyCurrentYear = new Date().getFullYear();
const possibleVoiceYears = range(actuallyCurrentYear-2019, 2020);

if (userid != null) {
    
    firebase.database().ref(`users/${userid}`).on("value", snapshot => {
        let user = snapshot.val();

        checkAndHideMissing(user);

        $("#pfp").attr("src", user.avatar_url);
        $("#username").text(user.username.split("#")[0]);
        $("#level").text(user.level);
        $("#xp").text(addSpaces(user.xp));
        $("#shekels").text(addSpaces(user.money));
        $("#messages").text(addSpaces(user.messages_count));
        $("#rp").text(addSpaces(user.reacc_points));
        $("#joined-diskito").text(stringDateFromTimestamp(user.joined_server*1000));
        $("#joined-discord").text(stringDateFromTimestamp(user.joined_discord*1000));

        if (!user.cicina_avg) { $("#avg-cicina-card").hide(); }
        else { $("#avg-cicina").text(roundTwo(user.cicina_avg)); }

        if (!user.cicina_count) { $("#cicina-tries-card").hide(); }
        else { $("#cicina-tries").text(addSpaces(user.cicina_count)); }

        if (!user.cicina_longest) { $("#longest-cicina-card").hide(); }
        else { $("#longest-cicina").text(user.cicina_longest); }
        
        if (!user.all_time_total_voice) { $("#total-voice-card").hide(); }
        else { $("#total-voice").text(`${addSpaces(secondsToHours(user.all_time_total_voice))}h`); }
        
        possibleVoiceYears.forEach(voiceYear => {
            let time = user[`voice_year_${voiceYear}`];

            if (time) {
                $("#cards").append(`
                    <div class="card">
                        <div class="statname">${voiceYear} Voice</div>
                        <div class="statvalue">${addSpaces(secondsToHours(time))}h</div>
                    </div>
                `);
            }
            
        });

    });

    firebase.database().ref(`widget/${userid}`).on("value", snapshot => {
        let w = snapshot.val();
        let activities = "";

        if (w.activities.spotify != "none" && w.activities.spotify != undefined) {
            $("#artist").text(w.activities.spotify.artist);
            $("#title").text(w.activities.spotify.title);
            $("#spotify-link").attr("href", w.activities.spotify.url);
            $("#spotify").show();
        } else {
            $("#spotify").hide();
        }


        if (w.activities.other) {
            w.activities.other.forEach(activity => {
                if (activities === "") { activities += activity; }
                else { activities += `, ${activity}`; }
            });
            $("#activities").text(activities);
        }

        if (w.house != "none" && w.house != undefined) {
            $("#hypesquad").text(`House ${capitalize(w.house)}`);
        }

    });

}

let secondsToHours = s => Math.round((s/60/60)*10)/10;

function stringDateFromTimestamp(ts) {
    return new Date(ts).toLocaleString("cs-CZ", { 
        year: "numeric", 
        month: "2-digit", 
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
};

function capitalize([first, ...rest]) {
    return first.toUpperCase() + rest.join('').toLowerCase();
};

function range(size, startAt = 0) {
    return [...Array(size).keys()].map(i => i + startAt);
};

function checkAndHideMissing(user) {

    console.log(user);

    

};
