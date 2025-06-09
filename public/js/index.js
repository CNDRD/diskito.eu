import { c, supabase, addSpaces, roundTwo } from './main.js';
import { CountUp } from "https://cdnjs.cloudflare.com/ajax/libs/countup.js/2.6.0/countUp.min.js";

let { data: stats } = await supabase.from('server_totals').select('current_users_count, users_count, messages, voice').single();

let daysSince20March2020 = Math.floor((new Date() - new Date('2020-03-20')) / (1000 * 60 * 60 * 24));

let countUps = {
    current_users: stats.current_users_count,
    total_users: stats.users_count,
    total_messages: stats.messages,
    total_voice: roundTwo(Math.floor(stats.voice / 3600)),
    total_voice_minutes: Math.floor(stats.voice / 60),
    total_voice_seconds: stats.voice,
    messages_per_day: Math.floor(stats.messages / daysSince20March2020),
};

Object.keys(countUps).forEach(key => {
    let cntUp = new CountUp(key, countUps[key], { duration: .5 });
    cntUp.start()
});

