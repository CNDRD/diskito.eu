import { c, supabase, spinner, addSpaces } from './main.js';

let uniqueYears = [];
let latestYear = null;

async function loadUniqueYears() {
    let { data: yearsData } = await supabase.from('s_daily_avail_years').select('*').order('year', { ascending: true });
    uniqueYears = yearsData;
    latestYear = uniqueYears[uniqueYears.length - 1].year;
};

// daily voice per year
async function statsDailyUniqueVoice() {

    // add 'all-time' option to uniqueYears
    let uniqYearsCopy = JSON.parse(JSON.stringify(uniqueYears));
    uniqYearsCopy.push({ year: 'All' });

    uniqYearsCopy.forEach((obj, index) => {
        $('[data-stat="daily-voice-per-year"] > .switcharoo').append(`
            <div data-p="${index}" data-switcharoo="${obj.year}" data-active="false">${obj.year}</div>
        `);
    });

    $('[data-stat="daily-voice-per-year"] > .switcharoo')
        .attr('data-cols', Math.min(8, uniqYearsCopy.length))
        .attr('data-rows', Math.ceil(uniqYearsCopy.length / 8))
        .attr('data-cols-m', 4)
        .attr('data-rows-m', Math.ceil(uniqYearsCopy.length / 4))
        .css('--col_width', '4rem')
    ;
    $('[data-stat="daily-voice-per-year"] > .switcharoo > [data-bg-slider]').attr('data-pos', uniqYearsCopy.length-2);

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
                        labels: [],
                        datasets: [{
                            data: [],
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
                        maintainAspectRatio: false,
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



async function statsYearlyVoicePerUser() {

    let uniqYearsCopy = JSON.parse(JSON.stringify(uniqueYears));
    uniqYearsCopy.push({ year: 'All' });

    uniqYearsCopy.forEach((obj, index) => {
        $('[data-stat="yearly-voice-per-user"] > .switcharoo').append(`
            <div data-p="${index}" data-switcharoo="${obj.year}" data-active="false">${obj.year}</div>
        `);
    });

    $('[data-stat="yearly-voice-per-user"] > .switcharoo')
        .attr('data-cols', Math.min(8, uniqYearsCopy.length))
        .attr('data-rows', Math.ceil(uniqYearsCopy.length / 8))
        .attr('data-cols-m', 4)
        .attr('data-rows-m', Math.ceil(uniqYearsCopy.length / 4))
        .css('--col_width', '4rem')
    ;
    $('[data-stat="yearly-voice-per-user"] > .switcharoo > [data-bg-slider]').attr('data-pos', uniqYearsCopy.length-2);

    $('[data-stat="yearly-voice-per-user"] > .switcharoo > [data-switcharoo]').on('click', async function() {
        if (this.dataset.active === 'true') return;
        $('[data-stat="yearly-voice-per-user"] > .switcharoo > [data-bg-slider]').attr('data-pos', this.dataset.p);
        $('[data-stat="yearly-voice-per-user"] > .switcharoo > [data-switcharoo]').attr('data-active', 'false');
        this.dataset.active = 'true';
        await doChartForYear($(this).attr('data-switcharoo'));
    });
    
    let dataCache = {}; // year: data
    let yearlyVoicePerUserChart = null;

    async function getDataForYear(year) {
        if (dataCache[year]) { return dataCache[year]; }

        let { data: yearlyVoiceDb } = await supabase.from('yearly_voice').select('id(id,username), total').eq('year', year);

        let formattedData = yearlyVoiceDb.map(entry => ({
            id: entry.id.id,
            username: entry.id.username,
            total: entry.total / 60, // convert to minutes
        }));

        dataCache[year] = formattedData;
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

        // now group by id and sum totals
        let groupedData = {};
        yearlyData.forEach(entry => {
            if (!groupedData[entry.id]) { groupedData[entry.id] = { username: entry.username, total: 0 }; }
            groupedData[entry.id].total += entry.total;
        });

        // sort by total descending
        let sortedData = Object.entries(groupedData)
            .map(([id, data]) => ({ id, username: data.username, total: data.total }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 15); // top 100
        
        // based on sortedData.length get appropriate colors
        let colorCount = sortedData.length;
        let colors = [];
        for (let i = 0; i < colorCount; i++) {
            let hue = Math.floor((i / colorCount) * 360);
            colors.push(`hsl(${hue}, 40%, 50%)`);
        };

        // create the chart if it doesn't exist yet, but without data
        if (!yearlyVoicePerUserChart) {
            // doughnut chart
            yearlyVoicePerUserChart = new Chart(
                document.getElementById('yearlyVoicePerUserChart'),
                {
                    type: 'doughnut',
                    data: {
                        labels: [],
                        datasets: [{
                            data: [],
                            backgroundColor: colors,
                            borderWidth: 0,
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right',
                                labels: {
                                    boxWidth: 12,
                                    padding: 8,
                                }
                            },
                        },
                    }
                }
            );
        }

        // update the chart with new data
        yearlyVoicePerUserChart.data.labels = sortedData.map(d => d.username);
        yearlyVoicePerUserChart.data.datasets[0].data = sortedData.map(d => d.total.toFixed(1));
        yearlyVoicePerUserChart.update();

    };

    await doChartForYear(latestYear);

};



await loadUniqueYears()
    .then(() => {
        Promise.all([
            statsDailyUniqueVoice(),
            statsYearlyVoicePerUser(),
        ])
    });
