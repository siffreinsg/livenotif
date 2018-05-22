/**
 * Object with needed properties
 * Reset at each new instance 
 */
const tmp = {
    onAir: false,
    currentStream: {},
    redirectUrl: "",
    announceStreams: true,
    announceVideos: true,
    playSound: true,
};

/**
 * Retrieve user options from local storage
 */
browser.storage.local.get(["notifStreams", "notifVideos", "playSound"]).then((res) => {
    tmp.announceStreams = res.notifStreams !== "no";
    tmp.announceVideos = res.notifVideos !== "no";
    tmp.playSound = res.playSound !== "no";
});
