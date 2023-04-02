import { c, supabase } from '../jss/main.js';


const { data: quotes } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });
c(quotes);

quotes.forEach(quote => {

  $("#main").append(`
  <!-- Quote ID: [${quote.id}] -->
  <div class="card">

    <div class="quote-parent">
      <span class="quote-text">${quote.quote}</span>
    </div>

    <span class="author-date">
      <i>— ${quote.by}</i>, ${quote.when}
    </span>

  </div>
  `);

});
