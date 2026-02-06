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


$('#game-select > [data-item]').on('click', async function() {
    $('#game-select > [data-item]').attr('data-selected', 'false');
    $('#game').empty();
    let game = this.dataset.item;

    if (game == $('main')[0].dataset.game) {
        $('main')[0].dataset.game = 'none';
        $('#game')[0].dataset.game = 'nothing';
        return;
    }

    $(this).attr('data-selected', 'true');

    let itemFunctions = {
        coinflip: gameCoinflip,
        mines: gameMines,
        slots: gameSlots,
        stats: doStats,
    };

    $('main')[0].dataset.game = game;
    $('#game')[0].dataset.game = game;

    if (!itemFunctions[game]) { return; }
    
    let ret = itemFunctions[game]();
    if (ret instanceof Promise) { await ret; }
});



let gambledCountUps = {
    tsTotal:  new CountUp( 'tsTotal',  0, { duration: 1 } ),
    tsWon:    new CountUp( 'tsWon',    0, { duration: 1 } ),
    tsLost:   new CountUp( 'tsLost',   0, { duration: 1 } ),
    tsProfit: new CountUp( 'tsProfit', 0, { duration: 1 } ),
};

function placedBet(amount) {
    let currentGambled = parseInt($('#tsTotal')[0].dataset.value) || 0;
    currentGambled += amount;
    $('#tsTotal')[0].dataset.value = currentGambled;
    gambledCountUps.tsTotal.update(currentGambled);
};
function betOutcome(amount, isWin) {
    let currentWon = parseInt($('#tsWon')[0].dataset.value) || 0;
    let currentLost = parseInt($('#tsLost')[0].dataset.value) || 0;
    let currentProfit = parseInt($('#tsProfit')[0].dataset.value) || 0;

    if (isWin) {
        currentWon += amount;
        currentProfit += amount;
    }
    else {
        currentLost += amount;
        currentProfit -= amount;
    }

    $('#tsWon')[0].dataset.value = currentWon;
    $('#tsLost')[0].dataset.value = currentLost;
    $('#tsProfit')[0].dataset.value = currentProfit;

    gambledCountUps.tsWon.update(currentWon);
    gambledCountUps.tsLost.update(currentLost);
    gambledCountUps.tsProfit.update(currentProfit);

    if (currentProfit === 0) {
        $('#tsProfit').removeClass('positive negative');
    }
    else if (currentProfit > 0) {
        $('#tsProfit').removeClass('negative').addClass('positive');
    }
    else {
        $('#tsProfit').removeClass('positive').addClass('negative');
    }

    figureOutMaxPresetBets();
};

let betAmountMask = null;
function getBetAmountInput(gameName) {
    return `
        <div data-bet-amount-parent="${gameName}">
            <input type="text" data-bet-amount-input placeholder="Bet amount" />
            <div data-bet-amount-presets id="presets"></div>
        </div>

    `;
};
function figureOutMaxPresetBets() {
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

    betAmountMask = IMask(
        document.querySelector('[data-bet-amount-parent] [data-bet-amount-input]'),
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

    $('[data-bet-amount-parent] [data-bet-amount-presets]').html(presetBetsHtmlList.reverse().join(''));
    $('[data-bet-amount-parent] [data-bet-amount-presets] > .preset').off('click').on('click', function() {
        betAmountMask.unmaskedValue = this.dataset.value;
        betAmountMask.updateValue();
    });
};





function gameCoinflip() {
    $('#game').append(`

        <div id="err"></div>

        <div id="coin">
            <div data-side="heads"></div>
            <div data-side="tails"></div>
        </div>

        ${getBetAmountInput('coinflip')}

        <div class="bet-buttons f_switch">
            <input type="radio" name="bet" id="heads" value="heads" />
            <label for="heads">Heads</label>
            <input type="radio" name="bet" id="tails" value="tails" />
            <label for="tails">Tails</label>
        </div>

    `);
    figureOutMaxPresetBets();

    function cfAlert(msg) {
        $('#err').text(msg);
        $('#err').addClass('show');
        setTimeout(function() { $('#err').removeClass('show'); }, 2000);
    };

    function toggleInputs(onOrOff) {
        $('#coin')[0].dataset.disabled = onOrOff;
        $('[data-bet-amount-input]')[0].disabled = onOrOff;
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

        placedBet(parseInt(fnData.bet_amount));

        if (gambaError) {
            cfAlert('Oh no! Something went wrong!');
            toggleInputs(false);
            return;
        }

        $('#coin')[0].dataset.side = gambaData.flip;

        setTimeout(function(){
            let isWin = (gambaData.outcome === 'W');
            betOutcome(parseInt(fnData.bet_amount), isWin);
            money = gambaData.money;
            toggleInputs(false);
            $('#coin')[0].dataset.sideBefore = $('#coin')[0].dataset.side;
            $('#coin')[0].dataset.side = 'nutin';
            showCurrentBalance(money, isWin);
            betAmountMask.updateOptions({ mask: Number, min: 1, max: money });
        }, 3000);
    });

};



function gameMines() {
    // https://www.youtube.com/watch?v=94ylCzrVY90

    let gameUUID = '';
    let lastBetAmount = 0;

    let mineDivs = '';
    for (let i = 1; i <= 25; i++) { mineDivs += `<div class="mine" data-type="none" data-tile-index="${i}"></div>`; }

    $('#game').append(`
    
        <div id="err"></div>

        <div class="setup">
            ${getBetAmountInput('mines')}
            <div id="minesAmountParent">
                <div>
                    <div id="minesAmountShow">1</div>
                    <img src="/icons/bomb.svg" />
                </div>
                <input type="range" id="minesAmount" min="1" max="24" steps="1" value="1" />
            </div>
            <div class="button" id="playMines">Start game</div>
            <div class="button" id="cashOut" style="display: none;">Cash out</div>
            <div class="button" id="playMinesAgane" style="display: none;">Play again</div>
        </div>

        <div id="mines-place" data-playable="false">${mineDivs}</div>

    `);
    figureOutMaxPresetBets();

    $('#minesAmount').on('input', function() { $('#minesAmountShow').text(this.value); });



    function toggleInputs(onOrOff) {
        $('#mines-place')[0].dataset.disabled = onOrOff;
        $('[data-bet-amount-input]')[0].disabled = onOrOff;
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

        lastBetAmount = parseInt(fnData.bet_amount);
        placedBet(lastBetAmount);

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

        let wonAmount = parseInt(gambaData.user_money) - money;
        betOutcome(wonAmount, true);

        money = gambaData.user_money;
        showCurrentBalance(money, true);
        toggleInputs(false);
        $('#cashOut').hide();
        $('#playMinesAgane').show();
        $('#mines-place')[0].dataset.playable = 'false';
        betAmountMask.updateOptions({ mask: Number, min: 1, max: money });
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

        // mine_locations means the game is over - hit a mine
        if (gambaData?.mine_locations && !gambaData?.done) {
            JSON.parse(gambaData.mine_locations).forEach(mineIndex => {
                $(`.mine[data-tile-index="${mineIndex}"]`)[0].dataset.type = 'mine';
            });
            $('#mines-place > .mine').each(function() {
                if (this.dataset.type != 'mine') { this.dataset.type = 'safe'; }
            });
            $('#cashOut').hide();
            $('#playMinesAgane').show();
            
            betOutcome(lastBetAmount, false);
        }
        else if (gambaData?.mine == false) {
            this.dataset.type = 'safe';
            this.dataset.disabled = true;
            this.dataset.multiplier = roundTwo(gambaData.multiplier);

            $('#cashOut').show();
            $('#playMines').hide();
            $('#cashOut').text(`Cash out ★ ${addSpaces(roundTwo(gambaData.cashout),',')}`);
        }

        // cleared all safe tiles - auto cashout
        if (gambaData?.done) {
            gambaData.mine_locations.forEach(mineIndex => {
                $(`.mine[data-tile-index="${mineIndex}"]`)[0].dataset.type = 'mine';
            });
            $('#mines-place > .mine[data-type="none"]').each(function() {
                this.dataset.type = 'safe';
            });

            betOutcome(roundTwo(gambaData.cashout), true);

            $('#cashOut').trigger('click');
        }

    });

};



async function gameSlots() {
    $('#game').append(`

        <div id="err"></div>
        <div id="win"></div>

        <div id="slots" data-state="idle">
            <div data-reel="1"></div>
            <div data-reel="2"></div>
            <div data-reel="3"></div>
        </div>

        ${getBetAmountInput('slots')}

        <div class="button" id="playSlots">Spin</div>

    `);
    figureOutMaxPresetBets();

    let { data: slotsPayoutsDb } = await supabase.from('g_slots_payouts').select('*');
    let reelOrders = [];

    // Populate reels with symbols randomly but each reel has its own symbol once
    function populateReels() {
        let symbols = slotsPayoutsDb.map(x => x.what);
        for (let i = 1; i <=3; i++) {
            let reelSymbols = [...symbols];
            reelSymbols.sort(() => Math.random() - .5);
            reelOrders[i-1] = [...reelSymbols];
            let reelHtml = '';
            reelSymbols.forEach(sym => {
                let symData = slotsPayoutsDb.find(x => x.what == sym);
                reelHtml += `<div data-id="${symData.id}" data-symbol="${sym}" data-emoji="${symData.emoji}">${symData.emoji}</div>`;
            });
            // Duplicate for infinite scroll
            reelSymbols.forEach(sym => {
                let symData = slotsPayoutsDb.find(x => x.what == sym);
                reelHtml += `<div data-id="${symData.id}" data-symbol="${sym}" data-emoji="${symData.emoji}">${symData.emoji}</div>`;
            });
            $(`#slots > [data-reel="${i}"]`).html(`<div class="reel-container">${reelHtml}</div>`);
        }
    };
    populateReels();

    function slotsAlert(msg) {
        $('#err').text(msg);
        $('#err').addClass('show');
        setTimeout(function() { $('#err').removeClass('show'); }, 2000);
    };
    function slotsWin(msg) {
        $('#win').html(msg);
        $('#win').addClass('show');
        setTimeout(function() { $('#win').removeClass('show'); }, 2000);
    };

    $('#playSlots').on('click', async function() {
        let betAmount = betAmountMask.unmaskedValue;
        if (!betAmount) {
            slotsAlert('Please enter a bet amount');
            return;
        }
        if (betAmount > money) {
            slotsAlert('You don\'t have enough money');
            return;
        }
        if ($('#slots')[0].dataset.state == 'spinning') {
            return;
        }

        // Call the supabase function
        let { data: spinData, error: spinError } = await supabase.rpc('gamba_slots', { bet_amount: betAmount });
        
        if (spinError) {
            slotsAlert('Oh no! Something went wrong!');
            return;
        }

        placedBet(parseInt(betAmount));
        showCurrentBalance((money - betAmount), false);

        // Start spinning
        $('#slots')[0].dataset.state = 'spinning';
        $('.reel-container').addClass('spinning');

        setTimeout(() => {
            // Map reel IDs to symbol names
            let outcomeSymbols = spinData.reels.map(id => slotsPayoutsDb.find(x => x.id == id).what);

            // Calculate final positions
            let finalYs = outcomeSymbols.map((sym, i) => {
                let p = reelOrders[i].indexOf(sym);
                let index = p <= 2 ? p + 6 : p; // Choose position to ensure symbols above and below
                return 3 - (index * 4); // Adjust to center the symbol
            });

            // Stop reels staggered
            $(`#slots > [data-reel="1"] > .reel-container`).removeClass('spinning').css('transform', `translateY(${finalYs[0]}rem)`);

            setTimeout(() => {
                $(`#slots > [data-reel="2"] > .reel-container`).removeClass('spinning').css('transform', `translateY(${finalYs[1]}rem)`);

                setTimeout(() => {
                    $(`#slots > [data-reel="3"] > .reel-container`).removeClass('spinning').css('transform', `translateY(${finalYs[2]}rem)`);

                    // All stopped, update state and balance
                    $('#slots')[0].dataset.state = 'completed';

                    if (spinData.did_win) {
                        slotsWin(`
                            <div class="big-text">${spinData.multiplier}x</div>
                            <div>You won ★ ${addSpaces(spinData.payout_amount,',')}</div>
                        `);
                    }

                    // now the betOutcome only accepts either a win or a loss
                    // but here we want to reflect the actual payout which can be less than the bet amount
                    // so we need to do two calls possibly
                    // if the spinData.multiplier > 1, it's just a plain win
                    if (spinData.multiplier > 1) {
                        betOutcome(parseInt(spinData.payout_amount), true);
                    }
                    // if the spinData.multiplier is .5 its a partial loss (lose half the bet)
                    // so we do two calls: one for the loss of half the bet, one for the win of half the bet
                    else if (spinData.multiplier < 1) {
                        let lostAmount = parseInt(betAmount) - parseInt(spinData.payout_amount);
                        betOutcome(lostAmount, false);
                        betOutcome(parseInt(spinData.payout_amount), true);
                    }
                    // and i know this is a lot of comments but its late, im tired and i want to make sure i remember this logic later
                    // because i have already spent too much time on this shit already

                    money = spinData.user_money;
                    showCurrentBalance(money, spinData.did_win);
                    betAmountMask.updateOptions({ mask: Number, min: 1, max: money });
                }, 500);
            }, 500);
        }, 2000);
    });

};



async function doStats() {
    let stats = {
        mines: {
            played: 0,
            won: 0,
            lost: 0,
            wonMoney: 0,
            lostMoney: 0,
            net: 0,
        },
        coinflip: {
            played: 0,
            won: 0,
            lost: 0,
            wonMoney: 0,
            lostMoney: 0,
            net: 0,
        },
        // slots: {
        //     played: 0,
        //     won: 0,
        //     lost: 0,
        //     wonMoney: 0,
        //     lostMoney: 0,
        //     net: 0,
        // },
    };
    let totals = {
        played: 0,
        won: 0,
        lost: 0,
        wonMoney: 0,
        lostMoney: 0,
        net: 0,
    };

    let { data: minesStats } = await supabase.from('g_stats_mines').select('*').eq('player', DISCORD_ID);
    let minesWonRow = minesStats.find(x => x.did_win === true);
    let minesLostRow = minesStats.find(x => x.did_win === false);
    if (minesWonRow) {
        stats.mines.played += minesWonRow.cnt;
        stats.mines.won += minesWonRow.cnt;
        stats.mines.wonMoney += minesWonRow.sum;
        stats.mines.net += minesWonRow.sum;
    }
    if (minesLostRow) {
        stats.mines.played += minesLostRow.cnt;
        stats.mines.lost += minesLostRow.cnt;
        stats.mines.lostMoney += minesLostRow.sum;
        stats.mines.net -= minesLostRow.sum;
    }

    let { data: coinflipStats } = await supabase.from('g_stats_coinflip').select('*').eq('player', DISCORD_ID);
    let cfWonRow = coinflipStats.find(x => x.win_loss === 'W');
    let cfLostRow = coinflipStats.find(x => x.win_loss === 'L');
    if (cfWonRow) {
        stats.coinflip.played += cfWonRow.cnt;
        stats.coinflip.won += cfWonRow.cnt;
        stats.coinflip.wonMoney += cfWonRow.sum;
        stats.coinflip.net += cfWonRow.sum;
    }
    if (cfLostRow) {
        stats.coinflip.played += cfLostRow.cnt;
        stats.coinflip.lost += cfLostRow.cnt;
        stats.coinflip.lostMoney += cfLostRow.sum;
        stats.coinflip.net -= cfLostRow.sum;
    }

    //? this is wrong because if you lose half your bet it counts as a win, but it should count as a loss too.. halfsies..
    // let { data: slotsStats } = await supabase.from('g_stats_slots').select('*').eq('player', DISCORD_ID);
    // let slotsWonRow = slotsStats.find(x => x.did_win === true);
    // let slotsLostRow = slotsStats.find(x => x.did_win === false);
    // if (slotsWonRow) {
    //     stats.slots.played += slotsWonRow.cnt;
    //     stats.slots.won += slotsWonRow.cnt;
    //     stats.slots.wonMoney += slotsWonRow.sum;
    //     stats.slots.net += slotsWonRow.sum;
    // }
    // if (slotsLostRow) {
    //     stats.slots.played += slotsLostRow.cnt;
    //     stats.slots.lost += slotsLostRow.cnt;
    //     stats.slots.lostMoney += slotsLostRow.sum;
    //     stats.slots.net -= slotsLostRow.sum;
    // }
    
    $('#game').html(`
        <div data-header data-w="game">Game</div>
        <div data-header data-w="plays">Plays</div>
        <div data-header data-w="wins">Wins</div>
        <div data-header data-w="losses">Losses</div>
        <div data-header data-w="won-money">Won Money</div>
        <div data-header data-w="lost-money">Lost Money</div>
        <div data-header data-w="net">Net</div>
        <div data-divider></div>
    `);

    Object.keys(stats).forEach(gameKey => {
        let gameStats = stats[gameKey];

        totals.played += gameStats.played;
        totals.won += gameStats.won;
        totals.lost += gameStats.lost;
        totals.wonMoney += gameStats.wonMoney;
        totals.lostMoney += gameStats.lostMoney;
        totals.net += gameStats.net;

        $('#game').append(`
            <div data-g="${gameKey}" data-w="game">${gameKey.charAt(0).toUpperCase() + gameKey.slice(1)}</div>
            <div data-g="${gameKey}" data-w="plays">${addSpaces(gameStats.played,',')}</div>
            <div data-g="${gameKey}" data-w="wins">${addSpaces(gameStats.won,',')}</div>
            <div data-g="${gameKey}" data-w="losses">${addSpaces(gameStats.lost,',')}</div>
            <div data-g="${gameKey}" data-w="won-money">${addSpaces(gameStats.wonMoney,',')}</div>
            <div data-g="${gameKey}" data-w="lost-money">${addSpaces(gameStats.lostMoney,',')}</div>
            <div data-g="${gameKey}" data-w="net" data-positive=${totals.net > 0}>${addSpaces(gameStats.net,',')}</div>
        `);
    });

    $('#game').append(`
        <div data-divider></div>
        <div data-total data-w="game">Total</div>
        <div data-total data-w="plays">${addSpaces(totals.played,',')}</div>
        <div data-total data-w="wins">${addSpaces(totals.won,',')}</div>
        <div data-total data-w="losses">${addSpaces(totals.lost,',')}</div>
        <div data-total data-w="won-money">${addSpaces(totals.wonMoney,',')}</div>
        <div data-total data-w="lost-money">${addSpaces(totals.lostMoney,',')}</div>
        <div data-total data-w="net" data-positive=${totals.net > 0}>${addSpaces(totals.net,',')}</div>
    `);

};
