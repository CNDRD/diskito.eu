let ids = new URLSearchParams(window.location.search).get('ids');

if (ids === null) {
  $("#page_header").text("👀👀 🚀🚀🚀");
  $("#cost").text("No NFTs here bruh..");
};


ids = ids.split(',');

if (ids.length > 1) {
  $("#page_header").append(" collection");
  $("#cost").text(`This collection is worth ${ids.length*100}K shekels`);
} else {
  $("#page_header").text("Your new NFT");
}

ids.forEach(id => {

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

});
