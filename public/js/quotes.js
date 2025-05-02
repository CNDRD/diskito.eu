import { c, supabase, spinner } from './main.js';

const { data: quotes } = await supabase.from('quotes').select('*').order('created_at', { ascending: false });

let uniqueAuthors = {};

quotes.forEach(quote => {
    uniqueAuthors[quote.by] = uniqueAuthors[quote.by]+1 || 1;

    let authorName = quote.by;
    authorName = authorName.replace('-', '_');

    $('#quotes').append(`
    
        <!-- Quote ID: [${quote.id}] -->
        <div class="quote" data-author="${authorName}">
            <div class="text">${quote.quote}</div>
            <div class="author-date">
                <div class="author">${quote.by}</div>
                <div class="date">${quote.when}</div>
            </div>
        </div>
    
    `);

});

// order the authors by their count
Object.entries(uniqueAuthors).sort((a, b) => b[1] - a[1]).forEach(authorSet => {
    let author, count;
    [author, count] = authorSet;

    let authorId = author.replace('-', '_');

    $('#peeps_switch').append(`
        <input type="radio" name="quote_peep" id="${authorId}" />
        <label for="${authorId}" class="peep">
            ${author}
            <span class="count">${count}</span>
        </label>
    `);
});

$('#peeps_switch > input').on('change', function() {
    let author = $(this).attr('id');
    $('#quotes > .quote').each(function() {
        let quoteAuthor = $(this).data('author');
        if (quoteAuthor == author) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});
