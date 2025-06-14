import { c, supabase, addSpaces, roundTwo } from './main.js';
import { CountUp } from "https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.6.0/countUp.min.js";

let { data: stats } = await supabase.from('server_totals').select('current_users_count, users_count, messages, voice').single();

let daysSince20March2020 = Math.floor((new Date() - new Date('2020-03-20')) / (1000 * 60 * 60 * 24));

let countUps = {
    current_users: stats.current_users_count,
    total_users: stats.users_count,
    total_messages: stats.messages,
    total_voice: roundTwo(Math.floor(stats.voice / 3600)),
    tv_years: Math.floor(stats.voice / (3600 * 24 * 365)),
    tv_days: Math.floor((stats.voice % (3600 * 24 * 365)) / (3600 * 24)),
    tv_hours: Math.floor((stats.voice % (3600 * 24)) / 3600),
    tv_minutes: Math.floor((stats.voice % 3600) / 60),
    messages_per_day: Math.floor(stats.messages / daysSince20March2020),
};

Object.keys(countUps).forEach(key => {
    let cntUp = new CountUp(key, countUps[key], { duration: .5 });
    cntUp.start()
});

