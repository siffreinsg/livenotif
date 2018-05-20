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

    browser.storage.local.set({ notifStreams, notifVideos, playSound });
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
    elements.streams.onchange = saveOptions;
    elements.videos.onchange = saveOptions;
    elements.sound.onchange = saveOptions;

    browser.storage.local.get(["notifStreams", "notifVideos", "playSound"]).then(result => {
        elements.streams.checked = result.notifStreams !== "no";
        elements.videos.checked = result.notifVideos !== "no";
        elements.sound.checked = result.playSound !== "no";
    });
});

elements.options.addEventListener("submit", event => {
    saveOptions(event);
    browser.runtime.reload();
});
