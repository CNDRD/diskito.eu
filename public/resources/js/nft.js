let userid = new URLSearchParams(window.location.search).get('id');

function wrongOrMissingIdPage() {

  $("#page_header").text("👀👀 🚀🚀🚀");
  $("#cost").text("No NFTs here bruh..");

};

if (userid === null) {

  wrongOrMissingIdPage();

} else {

  firebase.database().ref(`NFT/owned/${userid}`).once("value").then(snapshot => {
    let ids = snapshot.val();

    if (ids === null) {

      wrongOrMissingIdPage();

    } else {
      let count = 0;
      
      for (id in ids) {
        count++;

        let url = `https://i.imgur.com/${id}.png`;
        $("#nfts").append(`
          <div id="nft">
            <a href="#nft${id}" uk-toggle>
              <img src="${url}" uk-img />
            </a>
          </div>`
        );
        $("#nftmodals").append(`
          <div id="nft${id}" class="uk-flex-top" uk-modal>
            <div class="uk-modal-dialog uk-width-auto uk-margin-auto-vertical">
              <button class="uk-modal-close-outside" type="button" uk-close></button>
              <img src="${url}" class="uk-height-1-2" />
            </div>
          </div>`
        );
      };

      
      firebase.database().ref(`users/${userid}/username`).once("value").then(snpsht => {

        $("#page_header").text(`${snpsht.val().split("#")[0]}'s NFT Collection`);
        
      });

      $("#cost").text(`This collection is worth ${count*10}K shekels`);

    }

  });

}
