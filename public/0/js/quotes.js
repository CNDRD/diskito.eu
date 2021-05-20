const quotes = [];
var quotesRef = firebase.database().ref('quotes');
quotesRef.once('value').then(function(snapshot){
  snapshot.forEach(function(childSnapshot){
    var cD = childSnapshot.val()

    var id = childSnapshot.key
    var quote = cD.quote
    var by = cD.by == 'unknown' ? '' : `— ${cD.by}`
    var when = cD.when == 'unknown' ? '' : `, ${cD.when}`

    quotes.push({
      id:id,
      quote:quote,
      by:by,
      when:when,
      timestamp:cD.timestamp
    });

  }); // snapshot.forEach

  quotes.sort(function(a, b){return b.timestamp - a.timestamp })

  quotes.forEach(q => {

    var a = `
    <div class="card shadow text-center px-15 py-20">
      <div class="d-flex flex-row flex-nowrap justify-content-between align-items-end">
        <span class="material-icons mi-48 text-muted align-self-start">format_quote</span>
        <span class='font-size-20 font-weight-light text-white'>${q.quote}</span>
        <span class="material-icons mi-48 text-muted align-self-start">format_quote</span>
      </div>

      <br>

      <div class='position-absolute left-0 bottom-0 text-monospace quoteID is-gone'>
        <div class='input-group input-group-sm'>
          <div class='input-group-prepend'>
            <span class='input-group-text'>${q.id}</span>
          </div>
          <div class="input-group-append">
            <button class="btn btn-primary" type="button" onClick='copyTextToClipboard("${q.id}")' id='${q.id}'>Copy</button>
          </div>
        </div>
      </div>

      <span class='float-right quoteAuthorDate'><i>${q.by}</i>${q.when}</span>
    </div>
    `

    $('#quotesContainer').append(a);

  }); // quotes.forEach()

}); // quotesRef.once

function idSwitch(){
  if($("#idSwitch").is(':checked')){
    $('#idSwitchLabel').text('Hide ID\'s');
    $('.quoteID').addClass('is-gone');
    $('.quoteID').removeClass('is-gone');
  }else{
    $('#idSwitchLabel').text('Show ID\'s');
    $('.quoteID').removeClass('is-gone');
    $('.quoteID').addClass('is-gone');
  }
}

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

  $(`#${text}`).text(`Copied!`);

  document.body.removeChild(textArea);
}
