var user = false;
var monies = 0;
var discordUID = false;

firebase.auth().onAuthStateChanged(userAuth => {
  if (!userAuth) { isUser(false); } else { isUser(true);
    user = userAuth;
    firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(discordIDsnapshot => {
      firebase.database().ref(`users/${discordIDsnapshot.val()}/money`).on("value", snapshot => {
        monies = snapshot.val();
        discordUID = discordIDsnapshot.val();
        updateMoney(monies);
      });
    });
  }
});

function isUser(huh) {
  if (huh) {
    $("#plsLoginMessage").hide();
    $("#gamesParent").show();
    $("#moniesParent").show();
  } else {
    $("#plsLoginMessage").show();
    $("#gamesParent").hide();
    $("#moniesParent").hide();
  }
}

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

function getCurrentMoney() {
  return firebase.database().ref(`websiteProfiles/${firebase.auth().currentUser.uid}/discordUID`)
  .once("value").then(discordIDsnapshot => {
    return firebase.database().ref(`users/${discordIDsnapshot.val()}/money`)
    .once("value").then(snapshot => { return snapshot.val() });
  });
};







/*

  1 - 10 Game

*/

function gameOneToTen() {
  let betAmount = $("#oneToTenMoneyAmount").val();
  let betOnNumber = $("#oneToTenValueInput").val();
  let randomNumberLmao = getRandomInt(11);
  let gameTimeoutTime = 500;
  let outcomeMoney, notificationMessage, notificationStatus;


  getCurrentMoney().then(monies => {

    $("#oneToTenButtonText").replaceWith(`<div id="oneToTenButtonText" uk-spinner></div>`);

    if (betAmount > monies) {

      UIkit.notification({
        message: "You aren't allowed to do that chump.. And don't fuck with the code, it bites", status: "danger",
        timeout: 5000, pos: "bottom-center"
      });
      setTimeout(() => { location.reload() }, 6000);
      firebase.database().ref(`users/${discordUID}`).update({fuckedWithWebsite: true});

    } else {
      setTimeout(() => {
        if (betOnNumber == randomNumberLmao) {
          outcomeMoney = monies + (betAmount * 10);
          notificationMessage = `You won ${addCommas(betAmount * 10)} monies!`;
          notificationStatus = "success";
        } else {
          outcomeMoney = monies - betAmount;
          notificationMessage = `You lost ${addCommas(betAmount)} monies!`;
          notificationStatus = "danger";
        }

        /* Set money in DB, update money, set money */
        firebase.database().ref(`users/${discordUID}`).update({money: outcomeMoney});
        updateMoney(outcomeMoney);

        $("#oneToTenButtonText").replaceWith(`<span id="oneToTenButtonText">Place bet</span>`);
        UIkit.notification({
          message: notificationMessage, status: notificationStatus,
          timeout: 1000, pos: "bottom-center"
        });
      }, gameTimeoutTime);
    }

  }); /* getCurrentMoney().then() */

};

function oneToTenInputValueChange(to) {
  let og = $("#oneToTenMoneyAmount").val() == "" ? 0 : parseInt($("#oneToTenMoneyAmount").val());
  if (to == "max") { $("#oneToTenMoneyAmount").attr("value", monies); }
  else { $("#oneToTenMoneyAmount").attr("value", og + to )}
};
$("#oneToTenEasyBet1").click(() => { oneToTenInputValueChange(1000); });
$("#oneToTenEasyBet10").click(() => { oneToTenInputValueChange(10000); });
$("#oneToTenEasyBet100").click(() => { oneToTenInputValueChange(100000); });
$("#oneToTenEasyBetMax").click(() => { oneToTenInputValueChange("max"); });

/* Prevent submit */
$("#oneToTenEasyBetForm").submit(function(e) { e.preventDefault(); });

/* Clear Inputs */
$("#oneToTenMoneyAmountClear").click(() => { $("#oneToTenMoneyAmount").val("") });
$("#oneToTenValueClear").click(() => { $("#oneToTenValueInput").val("") });







/*

  Coinflip Game

*/

function gameCoinflip() {
  let gameTimeoutTime = 500;
  let betAmount = $("#coinflipMoneyAmount").val();
  let outcomeMoney, notificationMessage, notificationStatus;


  getCurrentMoney().then(monies => {

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

        $("#coinflipButtonText").replaceWith(`<span id="coinflipButtonText">Place bet</span>`);
        UIkit.notification({
          message: notificationMessage, status: notificationStatus,
          timeout: 1000, pos: "bottom-center"
        });
      }, gameTimeoutTime);
    }

  }); /* getCurrentMoney().then() */

};

function coinflipInputValueChange(to) {
  let og = $("#coinflipMoneyAmount").val() == "" ? 0 : parseInt($("#coinflipMoneyAmount").val());
  if (to == "max") { $("#coinflipMoneyAmount").attr("value", monies); }
  else { $("#coinflipMoneyAmount").attr("value", og + to )}
};
$("#coinflipEasyBet1").click(() => { coinflipInputValueChange(1000); });
$("#coinflipEasyBet10").click(() => { coinflipInputValueChange(10000); });
$("#coinflipEasyBet100").click(() => { coinflipInputValueChange(100000); });
$("#coinflipEasyBetMax").click(() => { coinflipInputValueChange("max"); });

/* Prevent submit */
$("#coinflipEasyBetForm").submit(function(e) { e.preventDefault(); });

/* Clear Inputs */
$("#coinflipMoneyAmountClear").click(() => { $("#coinflipMoneyAmount").val("") });
