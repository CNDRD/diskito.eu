import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabase = createClient('https://leyoegxpprcdstxvtecg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxleW9lZ3hwcHJjZHN0eHZ0ZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Nzk5NDA1NDIsImV4cCI6MTk5NTUxNjU0Mn0.yNr2o0psosNcfQX52uoOZc7pvn0YzysqpgdCE-f2kFM')

const { data: authData } = await supabase.auth.getSession();
export const UUID = authData.session ? authData.session.user.id : null;
export const userAuth = authData;

export const c = console.log.bind(console);

export function addSpaces(x, char=" ") { return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, char); };

export function roundTwo(x) { return Math.round(x * 100) / 100; };

export async function settings(sysid=undefined) {
    const { data: settings, error: settingsError } = await supabase.from('settings').select('*');
    if (settingsError) { c(settingsError); return false; }
    if (sysid) { return settings.find(x => x.sysid === sysid); }
    return settings;
};

export function spinner(onlyHtml=false) {
    let spinnerHtml = `
        <svg xmlns="http://www.w3.org/2000/svg" class="spinner" width="24" height="24" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">

            <line x1="12" x2="12" y1="2" y2="6"></line>
            <line x1="12" x2="12" y1="18" y2="22"></line>
            <line x1="4.93" x2="7.76" y1="4.93" y2="7.76"></line>
            <line x1="16.24" x2="19.07" y1="16.24" y2="19.07"></line>
            <line x1="2" x2="6" y1="12" y2="12"></line>
            <line x1="18" x2="22" y1="12" y2="12"></line>
            <line x1="4.93" x2="7.76" y1="19.07" y2="16.24"></line>
            <line x1="16.24" x2="19.07" y1="7.76" y2="4.93"></line>
        </svg>
    `;

    if (onlyHtml) { return spinnerHtml; }
    return new DOMParser().parseFromString(spinnerHtml, "text/html").body.firstChild;
};
