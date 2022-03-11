
firebase.database().ref("widget").on("value", snapshot => {
  let nowOnline = 0;
  $("#widget").replaceWith(`<div id="widget" class="users"></div>`);

  snapshot.forEach(childSnapshot => {
    let user = childSnapshot.val();
    if (user.status == "offline") { return }

    let a = `
      <!-- ${user.username} -->
      <div class="user">
        <div class="us">
          <div class="status status-${user.status}"></div>
          <div class="username">
            ${user.username}
          </div>
        </div>
        <div class="activity">
          ${getWidgetActivity(user.activities)}
        </div>
      </div>`;
    $("#widget").append(a);

    nowOnline++;
  });
  $('#nowOnline').text(`${nowOnline} Online`)
});

function getWidgetActivity(activities) {
  if (!activities || activities.other == undefined) { return ""; }

  let gaem = activities.other[activities.other.length - 1];
  activities.other.pop();

  gaem = gaem.replace("PLAYERUNKNOWN'S BATTLEGROUNDS", "PUBG");
  gaem = gaem.replace("Counter-Strike: Global Offensive", "CS:GO");
  gaem = gaem.replace("Tom Clancy's Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("Rainbow Six Siege", "Rainbow Six: Siege");
  gaem = gaem.replace("The Elder Scrolls", "TES");
  gaem = gaem.replace("Call of Duty®:", "COD:")

  gaem = reduceStringLength(gaem , 23);

  return gaem;
};
