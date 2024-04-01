import { c, supabase, spinner } from './main.js';

const { data: quotes } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });

quotes.forEach(quote => {

    $('main').append(`
    
        <!-- Quote ID: [${quote.id}] -->
        <div class="quote">
            <div class="text">${quote.quote}</div>
            <div class="author-date">
                <div class="author">${quote.by}</div>
                <div class="date">${quote.when}</div>
            </div>
        </div>
    
    `);

});
