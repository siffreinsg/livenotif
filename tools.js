function loadUserConfig() {
    return new Promise((resolve, reject) => {
        let userConfig = {};

        browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "blinkingIcon", "selectedSound", "volume"])
            .then((res) => {
                userConfig.announceStreams = res.notifStreams !== "no";
                userConfig.announceVideos = res.notifVideos !== "no";
                userConfig.blinkingIcon = res.blinkingIcon !== "no";

                if (res.playSound !== "no") {
                    const selectedSound = parseInt("" + res.selectedSound) || 0;
                    const soundPlayer = (new Audio(config.sounds[selectedSound])).player;
                    soundPlayer.volume = parseInt("" + res.volume) || 0.5;
                    userConfig.soundPlayer = soundPlayer;
                }

                resolve(userConfig);
            });
    });
}

function silentReload() {
    browser.storage.local.set({ silentReload: "yes" })
        .then(() => browser.runtime.reload());
}

function extractMessageFromEvent(event) {
    return new Promise((resolve, reject) => {
        let data;
        try {
            data = JSON.parse(event.data);
        } catch (ex) {
            return reject();
        }

        if (typeof data.event === "undefined" || typeof data.channel === "undefined") return reject();
        if (data.channel === config.id || data.channel === "ALL_CHANNELS") return resolve(data);
    })
}

function setStatus(status) {
    let icon, title;
    switch (status) {
        case "online":
            icon = manifest.icons[48];
            title = `${config.displayName} est en live ! Cliquez pour plus d'informations.`;
            break;
        case "offline":
            icon = manifest.browser_action.default_icon[48];
            title = `${config.displayName} est hors-ligne ! Cliquez pour plus d'informations.`;
            break;
    }

    browser.browserAction.setIcon({ path: icon });
    browser.browserAction.setTitle({ title });
}

function sendNotif(title, body, url, playSound = true) {
    let notif = {
        type: "basic",
        title: title,
        message: body,
        iconUrl: manifest.icons[128]
    };

    if (playSound && config.soundPlayer) {
        config.soundPlayer.play();
    }

    browser.notifications.create(notif)
        .then(createdId => {
            setTimeout(() => browser.notifications.clear(clickedId), 10000);

            browser.notifications.onClicked.addListener((clickedId) => {
                if (clickedId === createdId) {
                    dontBlink = true;
                    browser.notifications.clear(clickedId);

                    if (url) {
                        browser.tabs.create({ url });
                    }
                }
            });
        });
}
