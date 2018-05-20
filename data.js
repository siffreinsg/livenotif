/**
 * Addon settings
 * 
 * name: Displayed name on notifs
 * offlineURL: URL on which users are redirected when there is no stream online
 * streamOrigin: Whether we should check the stream on 'twitch' or 'youtube'
 * IDs.youtube: YouTube channel id. If unexistant (delete it), disable YouTube checks.
 * IDs.youtube: Twitch channel id. If unexistant (delete it), disable Twitch checks.
 * notifSoundURL: URL of an audio file. If unexistant (delete it), disable sounds 
 */
const params = {
    name: "NAME",
    offlineURL: "https://google.com",
    streamOrigin: "twitch",
    IDs: {
        youtube: "YOUTUBE ID",
        twitch: "TWITCH USER"
    },
    notifSoundURL: "assets/notif.mp3",
};

// Ignore this
tmp.redirectUrl = params.offlineURL;
if (params.notifSoundURL) {
    tmp.player = new Audio(params.notifSoundURL);
}
