import { c, supabase, addSpaces, UUID, DISCORD_ID } from './main.js';
import { CountUp } from "https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.6.0/countUp.min.js";


const moneyCountUp = new CountUp(
    'balance',
    0,
    {
        duration: 1,
        onCompleteCallback: function() {
            setTimeout(function() { $('#balance').removeClass(); }, 750);
        },
    }
);
function showCurrentBalance(bal, isGood = undefined) {
    if (isGood !== undefined) {
        $('#balance').addClass(isGood ? 'good' : 'bad');
    }
    moneyCountUp.update(bal);
};


let { data: userInfo } = await supabase.from('users').select('money').eq('id', DISCORD_ID).single();
let money = userInfo.money;
showCurrentBalance(money);



// Populate the games table
let playableGames = ['coinflip'];
['coinflip', 'dice', 'slots', 'blackjack'].forEach(game => {
    let disabled = playableGames.includes(game) ? '' : 'disabled';
    $('#game-select').append(`
        <input type="radio" name="game" ${disabled} id="${game}" value="${game}" />
        <label for="${game}" ${disabled}>${game}</label>
    `);
});



$('#game-select').on('change', function() {
    $('#game').empty();
    let game = $(this).find(':checked').val();
    
    $('#game')[0].dataset.game = game;

    let gameToFn = {
        coinflip: gameCoinflip,
    };

    if (!gameToFn[game]) { return; }
    gameToFn[game]();
});



function gameCoinflip() {
    $('#game').append(`

        <div id="coin">
            <div data-side="heads"></div>
            <div data-side="tails"></div>
        </div>

        <input type="text" id="betAmount" placeholder="Bet amount" />

        <div class="bet-buttons f_switch">
            <input type="radio" name="bet" id="heads" value="heads" />
            <label for="heads">Heads</label>
            <input type="radio" name="bet" id="tails" value="tails" />
            <label for="tails">Tails</label>
        </div>

    `);

    let betAmountMask = IMask(
        document.getElementById('betAmount'),
        {
            mask: Number,
            min: 1,
            thousandsSeparator: ',',
            scale: 0,
            autofix: true,
            normalizeZeros: true,
            min: 1,
            max: money,
        }
    );
    
    function cfAlert(msg, type) {
        console.error(type, msg);
    };

    function toggleInputs(onOrOff) {
        $('#coin')[0].dataset.disabled = onOrOff;
        $('#betAmount')[0].disabled = onOrOff;
        $('#heads, #tails').each(function() { this.disabled = onOrOff; });
    };

    $('#coin').on('click', async function() {
        if (this.dataset.disabled == 'true') { return; }
        toggleInputs(true);

        let fnData = {
            bet_amount: betAmountMask.unmaskedValue,
            bet: $('#game .bet-buttons input:checked').val(),
        };
        
        if (!fnData.bet) {
            cfAlert('Please select heads or tails', 'error');
            toggleInputs(false);
            return;
        }
        else if (!fnData.bet_amount) {
            cfAlert('Please enter a bet amount', 'error');
            toggleInputs(false);
            return;
        }
        else if (fnData.bet_amount > money) {
            cfAlert('You don\'t have enough money', 'error');
            toggleInputs(false);
            return;
        }

        // Call the supabase function
        let { data: gambaData, error: gambaError } = await supabase.rpc('gamba_coinflip', fnData);
        gambaData = gambaData ? gambaData[0] : null;

        if (gambaError) {
            cfAlert('Oh no! Something went wrong!', 'error');
            toggleInputs(false);
            return;
        }

        $('#coin')[0].dataset.side = gambaData.flip;

        setTimeout(function(){
            toggleInputs(false);
            $('#coin')[0].dataset.sideBefore = $('#coin')[0].dataset.side;
            $('#coin')[0].dataset.side = 'nutin';
            showCurrentBalance(gambaData.money, (gambaData.outcome==='W'));
        }, 3000);
    });

};

