function saveOptions(event) {
    let notifStreams = document.getElementById("streams").checked ? "yes" : "no",
        notifVideos = document.getElementById("videos").checked ? "yes" : "no";

    if (typeof browser === "object") browser.storage.local.set({ notifStreams, notifVideos });
    else if (typeof chrome === "object") chrome.storage.local.set({ notifStreams, notifVideos });
    event.preventDefault();
}

function restoreOptions(result) {
    document.getElementById("streams").checked = result.notifStreams !== "no";
    document.getElementById("videos").checked = result.notifVideos !== "no";
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("streams").onchange = saveOptions;
    document.getElementById("videos").onchange = saveOptions;

    if (typeof browser === "object")
        browser.storage.local.get(["notifStreams", "notifVideos"]).then(restoreOptions);
    else if (typeof chrome === "object")
        chrome.storage.local.get(["notifStreams", "notifVideos"], restoreOptions);
});

document.getElementById("options").addEventListener("submit", event => {
    saveOptions(event);
    if (typeof browser === "object") browser.runtime.reload();
    else if (typeof chrome === "object") chrome.runtime.reload();
});
