var user = false;
var monies = 0;
var discordUID = false;

firebase.auth().onAuthStateChanged(userAuth => {
  user = userAuth;
  firebase.database().ref(`websiteProfiles/${user.uid}/discordUID`).once("value").then(discordIDsnapshot => {
    firebase.database().ref(`users/${discordIDsnapshot.val()}/money`).once("value").then(snapshot => {
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
  let gameTimeoutTime = 1500;
  let backToNormalTime = 4000;
  let betAmount = $("#coinflipMoneyAmount").val();
  let outcomeMoney;

  $("#coinflipButtonText").replaceWith(`<div id="coinflipButtonText" uk-spinner></div>`);

  setTimeout(() => {
    switch (getRandomInt(2)) {
      case 0:
        // Win
        outcomeMoney = monies + (betAmount * 2);
        $("#coinflipButton").removeClass("uk-button-default");
        $("#coinflipButton").addClass("cndrd-button-success");
        $("#coinflipButtonText").text(`You won ${addCommas(betAmount * 2)} monies!`);
        break;
      case 1:
        // Lose
        outcomeMoney = monies - betAmount;
        $("#coinflipButton").removeClass("uk-button-default");
        $("#coinflipButton").addClass("uk-button-danger");
        $("#coinflipButtonText").text(`You lost ${addCommas(betAmount)} monies!`);
        break;
    }

    /* Set money in DB, update money, set money */
    firebase.database().ref(`users/${discordUID}`).update({money: outcomeMoney});
    updateMoney(outcomeMoney);
    monies = outcomeMoney;

    setTimeout(() => {
      $("#coinflipButtonText").replaceWith(`<span id="coinflipButtonText">Place bet</span>`);
      $("#coinflipButton").removeClass("uk-button-danger");
      $("#coinflipButton").removeClass("cndrd-button-success");
      $("#coinflipButton").addClass("uk-button-default");
    }, backToNormalTime);
  }, gameTimeoutTime);
};

/* Prevent submit */
$("#coinflipEasyBetForm").submit(function(e) { e.preventDefault(); });
