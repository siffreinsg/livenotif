/**
 * Object with needed properties
 * Reset at each new instance 
 */
const tmp = {
    onAir: false,
    currentStream: {},
    announceStreams: true,
    announceVideos: true,
    playSound: true,
    selectedSound: 0,
    volume: 0.5,
};

/**
 * Retrieve user options from local storage
 */
browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "selectedSound", "volume"]).then((res) => {
    tmp.announceStreams = res.notifStreams !== "no";
    tmp.announceVideos = res.notifVideos !== "no";
    tmp.playSound = res.playSound === "yes";
    tmp.selectedSound = parseInt("" + res.selectedSound) || 0;
    tmp.volume = res.volume || "0.5";
});
