/**
 * Addon settings
 * 
 * name: Displayed name on notifs
 * offlineURL: URL on which users are redirected when there is no stream online
 * streamOrigin: Whether we should check the stream on 'twitch' or 'youtube'
 * IDs.youtube: YouTube channel id. If unexistant, disable YouTube checks.
 * IDs.youtube: Twitch channel id. If unexistant, disable Twitch checks.
 * notifSound: URL of an audio file. If unexistant, disable sounds.
 * checkInterval: Check interval in seconds.
 * software: "firefox" or "chrome"
 */
const params = {
    name: "NAME",
    offlineURL: "https://google.com",
    IDs: {
        youtube: "YOUTUBE ID",
        twitch: "TWITCH ID"
    },
    streamOrigin: "twitch",
    notifSound: new Audio("assets/notif.mp3"),
    checkInterval: 60,
    software: "firefox",
};
