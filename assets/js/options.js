const { sounds } = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", () => {
    var e = {
        streamsNotif: document.getElementById("streamsNotif"),
        videosNotif: document.getElementById("videosNotif"),
        playSound: document.getElementById("playSound"),
        blinkingIcon: document.getElementById("blinkingIcon"),
        devMode: document.getElementById("devMode"),
        soundSelect: document.getElementById("soundSelect"),
        soundVolume: document.getElementById("soundVolume"),
        testSound: document.getElementById("testSound")
    };

    browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "blinkingIcon", "selectedSound", "volume", "devMode"]).then(result => {
        e.streamsNotif.checked = result.notifStreams !== "no";
        e.videosNotif.checked = result.notifVideos !== "no";
        e.playSound.checked = result.playSound !== "no";
        e.blinkingIcon.checked = result.blinkingIcon !== "no";
        e.devMode.checked = result.devMode === "yes";
        e.soundVolume.value = result.volume;

        sounds.forEach((el, key) => {
            let opt = document.createElement("option");
            opt.value = key;
            opt.innerHTML = el.name;

            if ((!result.selectedSound && parseInt(key) === 0) || parseInt(key) === parseInt(result.selectedSound)) {
                opt.selected = "selected";
            }
            e.soundSelect.appendChild(opt);
        });

        e.testSound.onclick = () => {
            let selectedSound = e.soundSelect.options[e.soundSelect.selectedIndex].value;
            let player = sounds[selectedSound].player;

            player.volume = e.soundVolume.value;
            player.play();
        };

        document.getElementById("save").onclick = () => {
            let notifStreams = e.streamsNotif.checked ? "yes" : "no";
            let notifVideos = e.videosNotif.checked ? "yes" : "no";
            let playSound = e.playSound.checked ? "yes" : "no";
            let devMode = e.devMode.checked ? "yes" : "no";
            let blinkingIcon = e.blinkingIcon.checked ? "yes" : "no";
            let selectedSound = e.soundSelect.options[e.soundSelect.selectedIndex].value || 0;
            let volume = e.soundVolume.value || 0.5;

            browser.storage.local.set({ notifStreams, notifVideos, playSound, blinkingIcon, selectedSound, volume, devMode, silentReload: "yes" })
                .then(() => {
                    browser.runtime.reload();
                    setTimeout(window.close, 300);
                });
        }
    });
});
