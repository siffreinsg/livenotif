/**
 * Addon settings
 * 
 * name: Displayed name on notifs
 * streamOrigin: Whether we should check the stream on 'twitch' or 'youtube'
 * IDs.youtube: YouTube channel id. If unexistant, disable YouTube checks.
 * IDs.youtube: Twitch channel id. If unexistant, disable Twitch checks.
 * notifSound: URL of an audio file. If unexistant, disable sounds.
 * checkInterval: Check interval in seconds.
 * software: "firefox" or "chrome"
 */

const IDs = {
    youtube: "UCA5sfitizqs1oEbB5KY4uKQ",
    twitch: "rocketbeanstv"
};

const socials = {
    youtube: "https://youtube.com",
    twitch: "https://twitch.com",
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
};

const sounds = [
    { name: "Par défaut", player: new Audio("assets/sounds/notif.mp3") }
];

const params = {
    IDs, socials, sounds,
    name: "NAME",
    streamOrigin: "twitch",
    checkInterval: 60,
    software: "firefox",
};
