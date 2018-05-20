var software, scope;

/**
 * Make the difference between firefox or chrome and define the main scope to interact with browser's API
 */
if (typeof browser === "object") {
    software = "firefox";
    scope = browser;
} else if (typeof chrome === "object") {
    software = "chrome";
    scope = chrome;
}

/**
 * Object with needed properties
 * Reset at each new instance 
 */
const tmp = {
    onAir: false,
    redirectUrl: "",
    announceStreams: true,
    announceVideos: true,
    playSound: true,
};

function loadOptions(result) {
    tmp.announceStreams = result.notifStreams !== "no";
    tmp.announceVideos = result.notifVideos !== "no";
    tmp.playSound = result.playSound !== "no";
}

if (software === "chrome") {
    chrome.storage.local.get(["notifStreams", "notifVideos", "playSound"], loadOptions);
} else if (software === "firefox") {
    browser.storage.local.get(["notifStreams", "notifVideos", "playSound"]).then(loadOptions);
}
