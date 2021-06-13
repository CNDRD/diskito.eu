var user = false;
var monies = 0;
var discordUID = false;

firebase.auth().onAuthStateChanged(userAuth => {
  user = userAuth;
  firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(discordIDsnapshot => {
    firebase.database().ref(`users/${discordIDsnapshot.val()}/money`).on("value", snapshot => {
      monies = snapshot.val();
      discordUID = discordIDsnapshot.val();
      updateMoney(monies);
    });
  });
});

let addCommas = x => { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); };
let getRandomInt = max => { return Math.floor(Math.random() * max); };

let updateMoney = mony => {
  updateVisibleMoney(mony);
  setMaxMoneyInput(mony);
};
let updateVisibleMoney = mony => {
  $("#mony").text(addCommas(mony));
};
let setMaxMoneyInput = mony => {
  $(".moniesInput").attr("max",mony);
  $(".moniesInput").attr("placeholder", `1 - ${addCommas(mony)}`);
};


/*
  Games
*/
let coinflipInputValueChange = to => { $("#coinflipMoneyAmount").attr("value", to); };
$("#coinflipEasyBet1").click(() => { coinflipInputValueChange(1000); });
$("#coinflipEasyBet10").click(() => { coinflipInputValueChange(10000); });
$("#coinflipEasyBet100").click(() => { coinflipInputValueChange(100000); });
$("#coinflipEasyBetMax").click(() => { coinflipInputValueChange(monies); });

function gameCoinflip() {
  let gameTimeoutTime = 500;
  let backToNormalTime = 1000;
  let betAmount = $("#coinflipMoneyAmount").val();
  let outcomeMoney;
  let notificationMessage, notificationStatus;
  let notificationTimeout = 1000;


  $("#coinflipButtonText").replaceWith(`<div id="coinflipButtonText" uk-spinner></div>`);

  if (betAmount > monies) {

    UIkit.notification({
      message: "You aren't allowed to do that chump.. And don't fuck with the code, it bites", status: "danger",
      timeout: 5000, pos: "bottom-center"
    });
    setTimeout(() => { location.reload() }, 6000);
    firebase.database().ref(`users/${discordUID}`).update({fuckedWithWebsite: true});

  } else {

    setTimeout(() => {
      switch (getRandomInt(2)) {
        case 0:
          // Win
          outcomeMoney = monies + (betAmount * 2);
          notificationMessage = `You won ${addCommas(betAmount * 2)} monies!`;
          notificationStatus = "success";
          break;
        case 1:
          // Lose
          outcomeMoney = monies - betAmount;
          notificationMessage = `You lost ${addCommas(betAmount)} monies!`;
          notificationStatus = "danger";
          break;
      }

      /* Set money in DB, update money, set money */
      firebase.database().ref(`users/${discordUID}`).update({money: outcomeMoney});
      updateMoney(outcomeMoney);
      monies = outcomeMoney;

      setTimeout(() => {
        $("#coinflipButtonText").replaceWith(`<span id="coinflipButtonText">Place bet</span>`);
        UIkit.notification({
          message: notificationMessage, status: notificationStatus,
          timeout: notificationTimeout, pos: "bottom-center"
        });
      }, backToNormalTime);
    }, gameTimeoutTime);

  }
};

/* Prevent submit */
$("#coinflipEasyBetForm").submit(function(e) { e.preventDefault(); });
