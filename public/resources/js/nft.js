let userid = new URLSearchParams(window.location.search).get('id');

if (userid != null) {

    firebase.database().ref(`NFT/owned/${userid}`).once("value").then(snapshot => {
        let ids = snapshot.val();

        if (ids != null) {

            for (id in ids) {
                console.log("A");
                $("#nfts").append(`<img src="https://i.imgur.com/${id}.png" />`);
            };

            firebase.database().ref(`users/${userid}/username`).once("value").then(snpsht => {
                $("#h").text(`${snpsht.val().split("#")[0]}'s NFT Collection`);
            });

            $("#bottom-text").text(`This collection is worth ${Object.keys(ids).length*10}K shekels`);

        }
    });
}
