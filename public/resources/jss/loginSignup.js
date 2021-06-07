const emailREGEX = /([A-Z0-9a-z_-][^@])+?@[^$#<>?]+?\.[\w]{2,4}/;
const passwREGEX = /^^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*_])[a-zA-Z0-9 !@#$%^&*_]{8,25}$/;

const loginEmailTxt = "#loginEmail";
const loginPasswTxt = "#loginPassw";
const signupEmailTxt = "#signupEmail";
const signupPasswTxt = "#signupPassw";

const loginButton = ".loginButton";
const logoutButton = ".logoutButton";
const userButton = ".userButton";


/* REGEX Checks */
let emCheck = email => { return emailREGEX.test(email) }
let pwCheck = passw => { return passwREGEX.test(passw) }

/* Dynamically append all the buttons and embed */
$("#userButtonNormal").load("/resources/html/userButtonNormal.html");
$("#userButtonMobile").load("/resources/html/userButtonMobile.html");

/* Login & Sign Up form handlers */
$("#loginForm").submit(function(e) {
  e.preventDefault();

  let EMAIL = $(loginEmailTxt).val();
  let PASSW = $(loginPasswTxt).val();

  if(emCheck(EMAIL) && pwCheck(PASSW)){
    const loginPromise = firebase.auth().signInWithEmailAndPassword(EMAIL, PASSW);
    loginPromise.catch(e => {
      switch(e.code){
        case "auth/user-not-found":
          UIkit.notification({message: 'There is no user matching these credentials', status: 'danger'});
          break;
        case "auth/wrong-password":
          UIkit.notification({message: 'Wrong password', status: 'danger'});
          break;
        default:
          UIkit.notification({message: 'Some unforseen error occured. Please try again', status: 'danger'})
          break;
      }
    });

  /* Email or Password fuckup */
  } else {
    if(!emCheck( $(loginEmailTxt).val() )) {
      $(loginEmailTxt).addClass("cndrd-form-danger");
      $(loginEmailTxt).removeClass("cndrd-form-success");
      $("#loginEmailFuckup").removeAttr("hidden");
    } else {
      $(loginEmailTxt).addClass("cndrd-form-success");
      $(loginEmailTxt).removeClass("cndrd-form-danger");
      $("#loginEmailFuckup").attr("hidden","hidden");
    }
    if(!pwCheck( $(loginPasswTxt).val() )) {
      $(loginPasswTxt).addClass("cndrd-form-danger");
      $(loginPasswTxt).removeClass("cndrd-form-success");
      $("#loginPasswFuckup").removeAttr("hidden");
    } else {
      $(loginPasswTxt).addClass("cndrd-form-success");
      $(loginPasswTxt).removeClass("cndrd-form-danger");
      $("#loginPasswFuckup").attr("hidden","hidden");
    }
  }

});
$("#signupForm").submit(function(e) {
  e.preventDefault();

  let EMAIL = $(signupEmailTxt).val();
  let PASSW = $(signupPasswTxt).val();

  if(emCheck(EMAIL) && pwCheck(PASSW)){
    const loginPromise = firebase.auth().createUserWithEmailAndPassword(EMAIL, PASSW);
    loginPromise.catch(e => {
      switch(e.code){
        case "auth/invalid-email":
          UIkit.notification({message: 'Please enter a valid email', status: 'danger'});
          break;
        case "auth/email-already-in-use":
          UIkit.notification({message: 'This email is already being used', status: 'danger'});
          break;
        default:
          UIkit.notification({message: 'Some unforseen error occured. Please try again', status: 'danger'})
          break;
      }
    });

  /* Email or Password fuckup */
  } else {
    if(!emCheck( $(signupEmailTxt).val() )) {
      $(signupEmailTxt).addClass("cndrd-form-danger");
      $(signupEmailTxt).removeClass("cndrd-form-success");
      $("#signupEmailFuckup").removeAttr("hidden");
    } else {
      $(signupEmailTxt).addClass("cndrd-form-success");
      $(signupEmailTxt).removeClass("cndrd-form-danger");
      $("#signupEmailFuckup").attr("hidden","hidden");
    }
    if(!pwCheck( $(signupPasswTxt).val() )) {
      $(signupPasswTxt).addClass("cndrd-form-danger");
      $(signupPasswTxt).removeClass("cndrd-form-success");
      $("#signupPasswFuckup").removeAttr("hidden");
    } else {
      $(signupPasswTxt).addClass("cndrd-form-success");
      $(signupPasswTxt).removeClass("cndrd-form-danger");
      $("#signupPasswFuckup").attr("hidden","hidden");
    }
  }

});

/* Loggin out.. */
$(logoutButton).click(function() {
  firebase.auth().signOut();
});


/* Show and hide login and user buttons depending on logged in status */
firebase.auth().onAuthStateChanged(user => {
  window.user = user;

  if (user != undefined) {
    //console.log("Logged In!");
    $(loginButton).attr("hidden","hidden");
    $(userButton).removeAttr("hidden");
    UIkit.modal($("#user-modal")).hide();
  } else {
    //console.log("Logged Out!");
    $(loginButton).removeAttr("hidden");
    $(userButton).attr("hidden","hidden");
  }
});
