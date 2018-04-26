/**
 * Addon settings
 * 
 * name: Displayed name on notifs
 * offlineURL: URL on which users are redirected when there is no stream online
 * streamOrigin: Whether we should check the stream on 'twitch' or 'youtube'
 * IDs.youtube: YouTube channel id. If unexistant (delete it), disable YouTube checks.
 * IDs.youtube: Twitch channel id. If unexistant (delete it), disable Twitch checks.
 */
const params = {
    name: "Quelqu'un",
    offlineURL: "https://glitch.com",
    streamOrigin: "twitch",
    IDs: {
        youtube: "UCUwluPSnFtB0Jfxg0GXaKyA",
        twitch: "rocketbeanstv"
    }
};

// Ignore this
tmp.redirectUrl = params.offlineURL;
