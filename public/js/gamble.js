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



$('#game-select').on('change', function() {
    $('#game').empty();
    let game = $(this).find(':checked').val();
    
    $('#game')[0].dataset.game = game;

    let gameToFn = {
        coinflip: gameCoinflip,
    };

    $('#currentBalance').show();

    $('main')[0].dataset.game = game;

    if (!gameToFn[game]) { return; }
    gameToFn[game]();
});



function gameCoinflip() {
    let presetBets = [
        { show: '1',     value:                  1, },
        { show: '10',    value:                 10, },
        { show: '25',    value:                 25, },
        { show: '50',    value:                 50, },
        { show: '100',  value:                 100, },
        { show: '1K',   value:               1_000, },
        { show: '10K',  value:              10_000, },
        { show: '100K', value:             100_000, },
        { show: '1M',   value:           1_000_000, },
        { show: '10M',  value:          10_000_000, },
        { show: '100M', value:         100_000_000, },
        { show: '1B',   value:       1_000_000_000, },
        { show: '10B',  value:      10_000_000_000, },
        { show: '100B', value:     100_000_000_000, },
        { show: '1T',   value:   1_000_000_000_000, },
        { show: '10T',  value:  10_000_000_000_000, },
        { show: '100T', value: 100_000_000_000_000, },
    ];
    // figure out what the max possible bet for the user is
    // like if they have 1.5M, then the max bet from presetBets is 1M
    

    $('#game').append(`

        <div id="err"></div>

        <div id="coin">
            <div data-side="heads"></div>
            <div data-side="tails"></div>
        </div>

        <div id="betAmountParent">
            <input type="text" id="betAmount" placeholder="Bet amount" />
            <div id="presets"></div>
        </div>

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
    
    function figureOutMaxPresetBets() {
        let maxBetIndex = 0;
        for (let i = 0; i < presetBets.length; i++) {
            if (presetBets[i].value > money) { break; }
            maxBetIndex = i;
        }

        // now we get the max bet and three presets before it
        let presetBetsHtmlList = [];
        for (let i = maxBetIndex; i >= (maxBetIndex-3); i--) {
            if (presetBets[i].value > money) { continue; }
            presetBetsHtmlList.push(`<div class="preset" data-value="${presetBets[i].value}">${presetBets[i].show}</div>`);
        }

        $('#presets').html(presetBetsHtmlList.reverse().join(''));

        $('#presets > .preset').on('click', function() {
            betAmountMask.unmaskedValue = this.dataset.value;
            betAmountMask.updateValue();
        });
    };
    figureOutMaxPresetBets();

    function cfAlert(msg) {
        $('#err').text(msg);
        $('#err').addClass('show');
        setTimeout(function() { $('#err').removeClass('show'); }, 2000);
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
        
        if (!fnData.bet_amount) {
            cfAlert('Please enter a bet amount');
            toggleInputs(false);
            return;
        }
        else if (fnData.bet_amount > money) {
            cfAlert('You don\'t have enough money');
            toggleInputs(false);
            return;
        }
        else if (!fnData.bet) {
            cfAlert('Please select heads or tails');
            toggleInputs(false);
            return;
        }

        // Call the supabase function
        let { data: gambaData, error: gambaError } = await supabase.rpc('gamba_coinflip', fnData);
        gambaData = gambaData ? gambaData[0] : null;

        if (gambaError) {
            cfAlert('Oh no! Something went wrong!');
            toggleInputs(false);
            return;
        }

        $('#coin')[0].dataset.side = gambaData.flip;

        setTimeout(function(){
            money = gambaData.money;
            toggleInputs(false);
            $('#coin')[0].dataset.sideBefore = $('#coin')[0].dataset.side;
            $('#coin')[0].dataset.side = 'nutin';
            showCurrentBalance(money, (gambaData.outcome==='W'));
            figureOutMaxPresetBets();
            betAmountMask.updateOptions({ mask: Number, min: 1, max: money });
        }, 3000);
    });

};

