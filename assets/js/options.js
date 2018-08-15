const bg = browser.extension.getBackgroundPage();

document.addEventListener("DOMContentLoaded", () => {
    const e = {}
    const elementsList = ["streams", "videos", "system", "other", "playSound", "sound", "volume", "blink", "save", "testSound"]

    elementsList.forEach((el) => { e[el] = document.getElementById(el); });

    browser.storage.local.get(["notifStreams", "notifVideos", "notifSystem", "otherNotif", "playSound", "blinkingIcon", "selectedSound", "volume", "devMode"])
        .then(result => {
            e.streams.checked = result.notifStreams !== "no";
            e.videos.checked = result.notifVideos !== "no";
            e.system.checked = result.notifSystem !== "no";
            e.other.checked = result.otherNotif !== "no";
            e.playSound.checked = result.playSound !== "no";
            e.blink.checked = result.blinkingIcon !== "no";
            e.volume.value = result.volume;

            bg.appConfig.sounds.forEach((el, key) => {
                const opt = document.createElement("option");
                opt.value = key;
                opt.innerHTML = el.name;

                if ((!result.selectedSound && parseInt(key) === 0) || parseInt(key) === parseInt(result.selectedSound)) {
                    opt.selected = "selected";
                }
                e.sound.appendChild(opt);
            });

            e.testSound.onclick = () => {
                const selectedSound = e.sound.options[e.sound.selectedIndex].value
                const soundPath = bg.appConfig.sounds[selectedSound].path;
                const soundPlayer = new Audio("../" + soundPath);

                soundPlayer.volume = e.volume.value;
                soundPlayer.play();
            };

            e.save.onclick = () => {
                const toSave = {
                    notifStreams: e.streams.checked ? "yes" : "no",
                    notifVideos: e.videos.checked ? "yes" : "no",
                    notifSystem: e.system.checked ? "yes" : "no",
                    otherNotif: e.other.checked ? "yes" : "no",
                    playSound: e.playSound.checked ? "yes" : "no",
                    blinkingIcon: e.blink.checked ? "yes" : "no",
                    selectedSound: e.sound.options[e.sound.selectedIndex].value || 0,
                    volume: e.volume.value || 0.5,
                    silentReload: "yes"
                }

                browser.storage.local.set(toSave)
                    .then(() => {
                        browser.runtime.reload();
                        setTimeout(window.close, 300);
                    });
            }
        });
});
