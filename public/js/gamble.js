import { c, supabase, addSpaces, UUID, DISCORD_ID, roundTwo } from './main.js';
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



$('#game-select > label').on('click', function() {
    $('#game').empty();
    let game = $(this).attr('for');
    
    if (game == $('main')[0].dataset.game) {
        $('#currentBalance').hide();
        $('main')[0].dataset.game = 'none';
        $('#game')[0].dataset.game = 'nothing';
        setTimeout(function() { $('#game-select > input').prop('checked', false); }, 1);
        return;
    }

    $('#currentBalance').show();
    $('main')[0].dataset.game = game;
    $('#game')[0].dataset.game = game;

    let gameToFn = {
        coinflip: gameCoinflip,
        mines: gameMines,
    };

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



function gameMines() {
    // https://www.youtube.com/watch?v=94ylCzrVY90

    let gameUUID = '';

    let mineDivs = '';
    for (let i = 1; i <= 25; i++) { mineDivs += `<div class="mine" data-type="none" data-tile-index="${i}"></div>`; }

    $('#game').append(`
    
        <div id="err"></div>

        <div class="setup">
            <input type="text" id="betAmount" placeholder="Bet amount" />
            <div id="minesAmountParent">
                <div>
                    <div id="minesAmountShow">1</div>
                    <img src="/icons/bomb.svg" />
                </div>
                <input type="range" id="minesAmount" min="1" max="24" steps="1" value="1" />
            </div>
            <div id="playMines">Start game</div>
            <div id="cashOut" style="display: none;">Cash out</div>
            <div id="playMinesAgane" style="display: none;">Play again</div>
        </div>

        <div id="mines-place" data-playable="false">${mineDivs}</div>

    `);

    $('#minesAmount').on('input', function() { $('#minesAmountShow').text(this.value); });



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

    function toggleInputs(onOrOff) {
        $('#mines-place')[0].dataset.disabled = onOrOff;
        $('#betAmount')[0].disabled = onOrOff;
        $('#minesAmount').prop('disabled', onOrOff);
        $('#playMines').prop('disabled', onOrOff);
    };
    function minesAlert(msg) {
        $('#err').text(msg);
        $('#err').addClass('show');
        setTimeout(function() { $('#err').removeClass('show'); }, 2000);
    };



    $('#playMines').on('click', async function() {
        if (this.dataset.disabled == 'true') { return; }
        toggleInputs(true);

        let fnData = {
            bet_amount: betAmountMask.unmaskedValue,
            mines_amount: parseInt($('#minesAmount').val()),
        };

        if (!fnData.bet_amount) {
            minesAlert('Please enter a bet amount');
            toggleInputs(false);
            return;
        }
        else if (fnData.bet_amount > money) {
            minesAlert('You don\'t have enough money');
            toggleInputs(false);
            return;
        }

        // Call the supabase function to get the game UUID
        let { data: gambaData, error: gambaError } = await supabase.rpc('gamba_mines_start', fnData);

        if (gambaError) {
            minesAlert('Oh no! Something went wrong!');
            toggleInputs(false);
            return;
        }

        gameUUID = gambaData.game_id;

        money -= fnData.bet_amount;
        showCurrentBalance(money, false);

        $('#playMines')[0].dataset.disabled = true;
        $('#playMines').hide();
        $('#cashOut').show();
        $('#cashOut')[0].dataset.cashingOut = 'false';
        $('#mines-place')[0].dataset.playable = 'true';
    });
    $('#cashOut').on('click', async function() {
        if (this.dataset.cashingOut == 'true') { return; }
        this.dataset.cashingOut = 'true';

        let { data: gambaData, error: gambaError } = await supabase.rpc('gamba_mines_cashout', { game_id: gameUUID });

        if (gambaError) {
            minesAlert('Oh no! Something went wrong!');
            toggleInputs(false);
            return;
        }

        if (gambaData.err == 'unauthorized') {
            location.reload();
        }

        if (gambaData?.mine_locations) {
            gambaData.mine_locations.forEach(mineIndex => {
                $(`.mine[data-tile-index="${mineIndex}"]`)[0].dataset.type = 'mine';
            });
            $('#mines-place > .mine').each(function() {
                if (this.dataset.type != 'mine') { this.dataset.type = 'safe'; }
            });
        }

        money = gambaData.user_money;
        showCurrentBalance(money, true);
        toggleInputs(false);
        $('#cashOut').hide();
        $('#playMinesAgane').show();
        $('#mines-place')[0].dataset.playable = 'false';
    });
    $('#playMinesAgane').on('click', async function() {
        $('#cashOut').hide();
        $('#cashOut')[0].dataset.cashingOut = 'false';
        $('#cashOut').text('Cash out');
        $('#playMines')[0].dataset.disabled = false;
        $('#playMines').show();
        $('#playMinesAgane').hide();
        $('#mines-place > .mine').each(function() {
            this.dataset.type = 'none';
            this.dataset.disabled = false;
            delete this.dataset.multiplier;
        });
        $('#mines-place')[0].dataset.playable = 'false';
        gameUUID = '';
        toggleInputs(false);
    });

    $('#mines-place > .mine').on('click', async function() {
        if (!gameUUID) { return; }
        if (this.dataset.disabled == 'true') { return; }
        if (this.dataset.type != 'none') { return; }
        if ($('#mines-place')[0].dataset.playable == 'false') { return; }
        
        let tileIndex = this.dataset.tileIndex;
        this.dataset.type = 'loading';
        
        let fnData = {
            game_id: gameUUID,
            tile_index: parseInt(tileIndex),
        };
        
        let { data: gambaData, error: gambaError } = await supabase.rpc('gamba_mines_play', fnData);

        if (gambaError) {
            minesAlert('Oh no! Something went wrong!');
            toggleInputs(false);
            return;
        }
        if (gambaData.err == 'unauthorized') {
            location.reload();
        }

        // mine_locations means the game is over
        if (gambaData?.mine_locations && !gambaData?.done) {
            JSON.parse(gambaData.mine_locations).forEach(mineIndex => {
                $(`.mine[data-tile-index="${mineIndex}"]`)[0].dataset.type = 'mine';
            });
            $('#mines-place > .mine').each(function() {
                if (this.dataset.type != 'mine') { this.dataset.type = 'safe'; }
            });
            $('#cashOut').hide();
            $('#playMinesAgane').show();
        }
        else if (gambaData?.mine == false) {
            this.dataset.type = 'safe';
            this.dataset.disabled = true;
            this.dataset.multiplier = roundTwo(gambaData.multiplier);

            $('#cashOut').show();
            $('#playMines').hide();
            $('#cashOut').text(`Cash out ★ ${addSpaces(roundTwo(gambaData.cashout),',')}`);
        }

        if (gambaData?.done) {
            gambaData.mine_locations.forEach(mineIndex => {
                $(`.mine[data-tile-index="${mineIndex}"]`)[0].dataset.type = 'mine';
            });
            $('#mines-place > .mine[data-type="none"]').each(function() {
                this.dataset.type = 'safe';
            });

            $('#cashOut').trigger('click');
        }

    });

};

