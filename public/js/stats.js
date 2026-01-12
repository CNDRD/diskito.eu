import { c, supabase, spinner, addSpaces } from './main.js';



// daily voice per year

async function statsDailyUniqueVoice() {
    let { data: uniqueYears } = await supabase.from('s_daily_avail_years').select('*').order('year', { ascending: true });
    let latestYear = uniqueYears[uniqueYears.length - 1].year;

    // add 'all-time' option to uniqueYears
    uniqueYears.push({ year: 'All' });

    uniqueYears.forEach((obj, index) => {
        $('[data-stat="daily-voice-per-year"] > .switcharoo').append(`
            <div data-p="${index}" data-switcharoo="${obj.year}" data-active="false">${obj.year}</div>
        `);
    });

    $('[data-stat="daily-voice-per-year"] > .switcharoo')
        .attr('data-cols', Math.min(8, uniqueYears.length))
        .attr('data-rows', Math.ceil(uniqueYears.length / 8))
        .attr('data-cols-m', 4)
        .attr('data-rows-m', Math.ceil(uniqueYears.length / 4))
        .css('--col_width', '4rem')
    ;
    $('[data-stat="daily-voice-per-year"] > .switcharoo > [data-bg-slider]').attr('data-pos', uniqueYears.length-2);

    $('[data-stat="daily-voice-per-year"] > .switcharoo > [data-switcharoo]').on('click', async function() {
        if (this.dataset.active === 'true') return;
        $('[data-stat="daily-voice-per-year"] > .switcharoo > [data-bg-slider]').attr('data-pos', this.dataset.p);
        $('[data-stat="daily-voice-per-year"] > .switcharoo > [data-switcharoo]').attr('data-active', 'false');
        this.dataset.active = 'true';
        await doChartForYear($(this).attr('data-switcharoo'));
    });
    
    let dataCache = {}; // year: data
    let dailyVoicePerYearChart = null;

    async function getDataForYear(year) {
        if (dataCache[year]) { return dataCache[year]; }

        let { data: dailyVoiceDb } = await supabase.from('daily_voice').select('*').gte('date', `${year}-01-01`).lte('date', `${year}-12-31`).order('date', { ascending: true });

        // fill missing dates with NaN values for proper chart display (gaps)
        // if the dataset ends in the middle of the year (e.g. current year), adjust the endDate
        // same for startDate if it starts later
        let filledData = [];
        let startDate = new Date(`${year}-01-01`);
        let endDate = new Date(`${year}-12-31`);

        if (new Date(dailyVoiceDb[0].date) > startDate) {
            startDate = new Date(dailyVoiceDb[0].date);
        }
        if (new Date(dailyVoiceDb[dailyVoiceDb.length - 1].date) < endDate) {
            endDate = new Date(dailyVoiceDb[dailyVoiceDb.length - 1].date);
        }

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            let dateStr = d.toISOString().slice(0, 10);
            let existingEntry = dailyVoiceDb.find(entry => entry.date === dateStr);
            
            if (existingEntry) {
                existingEntry.time = existingEntry.seconds / 60; // convert to minutes
                delete existingEntry.seconds;

                existingEntry.time = existingEntry.time === 0 ? NaN : existingEntry.time; // set 0 to NaN for better chart display
            }

            if (existingEntry) {
                filledData.push(existingEntry);
            } else {
                filledData.push({ date: dateStr, time: NaN });
            }
        }

        dataCache[year] = filledData;
    };

    async function doChartForYear(year) {

        let yearsToFetch = [];
        if (year === 'All') {
            yearsToFetch = uniqueYears.filter(y => y.year !== 'All').map(y => y.year);
        }
        else {
            yearsToFetch = [year];
        }

        // fetch data for all required years
        for (let y of yearsToFetch) {
            await getDataForYear(y);
        }
        // combine data for all years
        let yearlyData = yearsToFetch.flatMap(y => dataCache[y]);



        // create the chart if it doesn't exist yet, but without data
        if (!dailyVoicePerYearChart) {
            const skipped = (ctx, value) => ctx.p0.skip || ctx.p1.skip ? value : undefined;

            dailyVoicePerYearChart = new Chart(
                document.getElementById('dailyVoicePerYearChart'),
                {
                    type: 'line',
                    data: {
                        labels: yearlyData.map(d => d.date),
                        datasets: [{
                            data: yearlyData.map(d => d.time),
                            fill: true,
                            borderColor: 'rgb(255, 255, 255)',
                            tension: .3,
                            pointRadius: 1,
                            borderWidth: 1,
                            spanGaps: true,
                            segment: {
                                borderDash: ctx => skipped(ctx, [6, 6]),
                            },
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: { legend: { display: false } },
                        scales: { y: { beginAtZero: true } },
                    }
                }
            );
    
        }

        // update the chart with new data
        dailyVoicePerYearChart.data.labels = yearlyData.map(d => d.date.slice(5));
        dailyVoicePerYearChart.data.datasets[0].data = yearlyData.map(d => d.time);
        dailyVoicePerYearChart.update();

    };
    
    await doChartForYear(latestYear);
};



Promise.all([
    statsDailyUniqueVoice(),
]).then(() => {
    c('Stats module loaded');
});

