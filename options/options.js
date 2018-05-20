const elements = {
    streams: document.getElementById("streams"),
    videos: document.getElementById("videos"),
    sound: document.getElementById("sound"),
    options: document.getElementById("options"),
};

function saveOptions(event) {
    let notifStreams = elements.streams.checked ? "yes" : "no";
    let notifVideos = elements.videos.checked ? "yes" : "no";
    let playSound = elements.sound.checked ? "yes" : "no";

    if (typeof browser === "object") browser.storage.local.set({ notifStreams, notifVideos, playSound });
    else if (typeof chrome === "object") chrome.storage.local.set({ notifStreams, notifVideos, playSound });
    event.preventDefault();
}

function restoreOptions(result) {
    elements.streams.checked = result.notifStreams !== "no";
    elements.videos.checked = result.notifVideos !== "no";
    elements.sound.checked = result.playSound !== "no";
}

document.addEventListener("DOMContentLoaded", () => {
    elements.streams.onchange = saveOptions;
    elements.videos.onchange = saveOptions;
    elements.sound.onchange = saveOptions;

    if (typeof browser === "object") {
        browser.storage.local.get(["notifStreams", "notifVideos", "playSound"]).then(restoreOptions);
    } else if (typeof chrome === "object") {
        chrome.storage.local.get(["notifStreams", "notifVideos", "playSound"], restoreOptions);
    }
});

elements.options.addEventListener("submit", event => {
    saveOptions(event);
    if (typeof browser === "object") {
        browser.runtime.reload();
    } else if (typeof chrome === "object") {
        chrome.runtime.reload();
    }
});
