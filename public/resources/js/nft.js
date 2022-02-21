let id = new URLSearchParams(window.location.search).get('id');

function wrongOrMissingIdPage() {

  $("#page_header").text("👀👀 🚀🚀🚀");
  $("#cost").text("No NFTs here bruh..");

};

if (id === null) {

  wrongOrMissingIdPage();

} else {

  firebase.database().ref(`NFT/owned/${id}`).once("value").then(snapshot => {
    let ids = snapshot.val();
    console.log(ids.length);

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

      $("#page_header").append(" collection");
      $("#cost").text(`This collection is worth ${count*10}K shekels`);

    }

  });

}
