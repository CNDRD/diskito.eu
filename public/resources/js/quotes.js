const quotes = [];
var quotesRef = firebase.database().ref('quotes');
quotesRef.once('value').then(function(snapshot){
  snapshot.forEach(function(childSnapshot){
    let cD = childSnapshot.val()

    let id = childSnapshot.key
    let quote = cD.quote
    let by = cD.by == 'unknown' ? '' : `— ${cD.by}`
    let when = cD.when == 'unknown' ? '' : `, ${cD.when}`

    quotes.push({
      id:id,
      quote:quote,
      by:by,
      when:when,
      timestamp:cD.timestamp
    });

  });

  quotes.sort(function(a, b){return b.timestamp - a.timestamp })

  quotes.forEach(q => {
    let a = `
    <div>
      <div class="uk-card uk-card-secondary uk-card-hover uk-card-body">

        <div class="uk-flex uk-flex-column">
          <span class="uk-text-primary">
            <span class="uk-margin-small-right" uk-icon="quote-right"></span>
            <span class="uk-text-medium">${q.quote}</span>
            <span class="uk-margin-small-left" uk-icon="quote-right"></span>
          </span>
          <br/>

        </div>

        <span class="uk-position-absolute uk-position-bottom-right uk-position-medium">
          <i>${q.by}</i>${q.when}
        </span>

        <span class="uk-position-absolute uk-position-bottom-left uk-margin-remove uk-margin-small-left uk-margin-small-bottom quoteID uk-hidden"
                onclick='copyTextToClipboard("${q.id}")'
                uk-icon="icon: copy">
        </span>

      </div>
    </div>`;

    $('#quotesContainer').append(a);

  });
});

function idSwitch() {
  let bgonecls = "uk-hidden";
  if($("#idSwitch").is(":checked")){
    $("#idSwitchLabel").text("Hide ID's");
    $(".quoteID").addClass(bgonecls);
    $(".quoteID").removeClass(bgonecls);
  } else {
    $("#idSwitchLabel").text("Show ID's");
    $(".quoteID").removeClass(bgonecls);
    $(".quoteID").addClass(bgonecls);
  }
};

function copyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
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

  UIkit.notification({ message: 'Quote ID Succesfully Copied!', pos: 'top-center', timeout: 4500 });
};
