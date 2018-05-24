const { params } = browser.extension.getBackgroundPage().getUsefulVars();

const elements = {
    streams: document.getElementById("streams"),
    videos: document.getElementById("videos"),
    sound: document.getElementById("sound"),
    options: document.getElementById("options"),
    select: document.getElementById("soundSelect"),
    testSound: document.getElementById("testSound"),
};

function saveOptions(event) {
    let notifStreams = elements.streams.checked ? "yes" : "no";
    let notifVideos = elements.videos.checked ? "yes" : "no";
    let playSound = elements.sound.checked ? "yes" : "no";
    let selectedSound = elements.select.options[elements.select.selectedIndex].value;

    browser.storage.local.set({ notifStreams, notifVideos, playSound, selectedSound });
    event.preventDefault();
}

document.addEventListener("DOMContentLoaded", () => {
    elements.streams.onchange = saveOptions;
    elements.videos.onchange = saveOptions;
    elements.sound.onchange = saveOptions;
    elements.select.onchange = saveOptions;

    browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "selectedSound"]).then(result => {
        elements.streams.checked = result.notifStreams !== "no";
        elements.videos.checked = result.notifVideos !== "no";
        elements.sound.checked = result.playSound !== "no";

        params.sounds.forEach((el, key) => {
            let opt = document.createElement("option");
            opt.value = key;
            opt.innerHTML = el.name;

            if ((!result.selectedSound && parseInt(key) === 0) || parseInt(key) === parseInt(result.selectedSound)) {
                opt.selected = "selected";
            }
            elements.select.appendChild(opt);
        });

        elements.testSound.onclick = () => {
            let selectedSound = elements.select.options[elements.select.selectedIndex].value;
            params.sounds[selectedSound].player.play();
        };
    });
});

elements.options.addEventListener("submit", event => {
    saveOptions(event);
    browser.runtime.reload();
});
