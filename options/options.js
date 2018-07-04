const { sounds } = browser.extension.getBackgroundPage();

const elements = {
    streams: document.getElementById("streams"),
    videos: document.getElementById("videos"),
    sound: document.getElementById("sound"),
    options: document.getElementById("options"),
    select: document.getElementById("soundSelect"),
    testSound: document.getElementById("testSound"),
    volume: document.getElementById("volume"),
};

function saveOptions(event) {
    let notifStreams = elements.streams.checked ? "yes" : "no";
    let notifVideos = elements.videos.checked ? "yes" : "no";
    let playSound = elements.sound.checked ? "yes" : "no";
    let selectedSound = elements.select.options[elements.select.selectedIndex].value || 0;
    let volume = elements.volume.value || 0.5;

    browser.storage.local.set({ notifStreams, notifVideos, playSound, selectedSound, volume });
    event.preventDefault();
}


document.addEventListener("DOMContentLoaded", () => {
    browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "selectedSound", "volume"]).then(result => {
        elements.streams.checked = result.notifStreams !== "no";
        elements.videos.checked = result.notifVideos !== "no";
        elements.sound.checked = result.playSound !== "no";
        elements.volume.value = result.volume;

        sounds.forEach((el, key) => {
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
            let player = sounds[selectedSound].player;

            player.volume = elements.volume.value;
            player.play();
        };
    });
});

elements.options.addEventListener("submit", event => {
    saveOptions(event);
    browser.storage.local.set({ silentReload: "yes" })
        .then(() => {
            browser.runtime.reload();
            setTimeout(window.close, 300);
        });
});
