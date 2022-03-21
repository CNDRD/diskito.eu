const quotes = [];
var quotesRef = firebase.database().ref("quotes");
quotesRef.once("value").then(function(snapshot){
  snapshot.forEach(function(childSnapshot){
    let cD = childSnapshot.val();

    let id = childSnapshot.key;
    let quote = cD.quote;
    let by = cD.by;
    let when = cD.when == "unknown" ? "" : cD.when;
    let carka = by != "" ? (when != "" ? "," : "") : "";

    quotes.push({
      id: id,
      quote: quote,
      by: by,
      when: when,
      timestamp: cD.timestamp,
      carka: carka,
    });

  });

  quotes.sort(function(a, b){return b.timestamp - a.timestamp })

  quotes.forEach(q => {
    let a = `
    <!-- Quote ID: [${q.id}] -->
    <div class="card">

      <div class="quote-parent">
        <span class="quote-text">${q.quote}</span>
      </div>

      <span class="author-date">
        <i>— ${q.by}</i>${q.carka} ${q.when}
      </span>

    </div>
    `;

    $("#main").append(a);

  });
});
