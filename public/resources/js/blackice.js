var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
});

let all_clicked = [];

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        $("#blackice").hide();
        $("#firebaseui-auth-container").show();
    } else {
        $("#blackice").show();
        $("#firebaseui-auth-container").hide();

        firebase.database().ref(`blackice/${firebase.auth().currentUser.uid}`).once('value').then( (snapshot) => {
            all_clicked = Object.keys(snapshot.val());
            generateSkins();
        });
        
    }
});

function generateSkins() {

    let getGunDiv = (name, img, type, clicked) => {
        return `
            <div class="gun ${clicked ? "clicked" : ""}" data-gun="${name}" data-type="${type}">
                <img src="${img}" alt="${name}" data-gun="${name}" />
            </div>
        `;
    };
    let checkClicked = (gun) => {
        return all_clicked.includes(gun);
    };

    $.getJSON("/resources/json/blackice.json", (data) => {
        let skins = data.guns;
        
        for (let gun in skins) {
            let name = gun;
            let img = skins[gun].silhouette;
            let type = skins[gun].type;
            let clicked = checkClicked(name);

            $("#guns").append(getGunDiv(name, img, type, clicked));
        }

    });
};



$(document).on("click", ".gun", function() {
    $(this).toggleClass("clicked");
    let a = $(this).data("gun");
    
    if ( $(this).hasClass("clicked") ) {
        firebase.database().ref(`/blackice/${firebase.auth().currentUser.uid}/${a}`).set(true);
    } else {
        firebase.database().ref(`/blackice/${firebase.auth().currentUser.uid}/${a}`).remove();
    }

});

function searchFunction() {
    let input = document.getElementById("searchInput");
    let filter = input.value.toUpperCase();
    let guns = document.getElementsByClassName("gun");
    
    for (let gun in guns) {
        let name = guns[gun].dataset.gun;

        if (name.toUpperCase().includes(filter)) {
            guns[gun].style.display = "block";
        } else {
            guns[gun].style.display = "none";
        }
    };
};
