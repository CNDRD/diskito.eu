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

export function message(msg, type="info", noSvg=false) {
    let messageSvgs = {
        warning: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"></path></svg>`,
        error: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"></path></svg>`,
        success: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path></svg>`,
        note: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"></path></svg>`,
        tip: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"></path></svg>`,
        magic: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path></svg>`,
    };
    let svg = messageSvgs[type] || messageSvgs.info;
    svg = noSvg ? '' : svg;

    return `<div class="msg" data-type="${type}">${svg}<div>${msg}</div></div>`;
};
