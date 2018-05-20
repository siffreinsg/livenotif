/**
 * Addon settings
 * 
 * name: Displayed name on notifs
 * offlineURL: URL on which users are redirected when there is no stream online
 * streamOrigin: Whether we should check the stream on 'twitch' or 'youtube'
 * IDs.youtube: YouTube channel id. If unexistant, disable YouTube checks.
 * IDs.youtube: Twitch channel id. If unexistant, disable Twitch checks.
 * notifSoundURL: URL of an audio file. If unexistant, disable sounds
 * checkInterval: Check interval in seconds
 */
const params = {
    name: "NAME",
    offlineURL: "https://google.com",
    IDs: {
        youtube: "UCA5sfitizqs1oEbB5KY4uKQ",
        twitch: "aypierre"
    },
    streamOrigin: "twitch",
    notifSoundURL: "assets/notif.mp3",
    checkInterval: 60
};

// Ignore this
tmp.redirectUrl = params.offlineURL;
if (params.notifSoundURL) {
    tmp.player = new Audio(params.notifSoundURL);
}
