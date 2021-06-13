const discordConnectID = Math.random().toString(36).substr(2, 12);

var user = false;
firebase.auth().onAuthStateChanged(userAuth => {
  if (!userAuth) { isUser(false); } else { isUser(true);

    user = userAuth;

    firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(snapshot => {
      if (snapshot.val() != undefined) {
        firebase.database().ref(`users/${snapshot.val()}/username`).once("value").then(nameSnapshot => {
          $("#discordConnectionLoader").attr("hidden", "hidden");
          $("#discordConnectionSuccess").removeAttr("hidden");
          $("#discordConnectedName").text(nameSnapshot.val());
        });
      } else {
        $("#discordConnectionLoader").attr("hidden", "hidden");
        $("#discordConnectionCode").removeAttr("hidden");
        $("#discordConnectionCodeInput").attr("value", `,connect ${discordConnectID}`)
        $("#discordConnectionCodeButton").attr("onclick", `copyThis(',connect ${discordConnectID}')`)
      }
    });
    $("#usernameInput").attr("value", user.displayName);

  }
});

function isUser(huh) {
  if (huh) {
    $("#plsLoginMessage").hide();
    $("#usernameForm").show();
    $("#discordConnectionDiv").show();
  } else {
    $("#plsLoginMessage").show();
    $("#usernameForm").hide();
    $("#discordConnectionDiv").hide();
  }
}

/* Name changer */
$("#usernameForm").submit(function(e) {
  e.preventDefault();
  let newName = $("#usernameInput").val();
  user.updateProfile({displayName: newName});
  $("#usernameButton").attr("uk-icon", "icon: check");
  UIkit.notification({message: "<span uk-icon='icon: check'></span> Username changed!", status: "success"});
  setTimeout(function(){ $("#usernameButton").attr("uk-icon", "icon: pencil"); }, 3000);
});

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
