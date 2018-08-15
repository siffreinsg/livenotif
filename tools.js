function loadUserConfig(appConfig) {
    return new Promise((resolve, reject) => {
        let userConfig = {};

        browser.storage.local.get(["notifStreams", "notifVideos", "playSound", "blinkingIcon", "selectedSound", "volume"])
            .then((res) => {
                userConfig.announceStreams = res.notifStreams !== "no";
                userConfig.announceVideos = res.notifVideos !== "no";
                userConfig.blinkingIcon = res.blinkingIcon !== "no";

                if (res.playSound !== "no") {
                    const selectedSound = parseInt("" + res.selectedSound) || 0;
                    const soundPath = appConfig.sounds[selectedSound].path;
                    const soundPlayer = new Audio(soundPath);
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
    let data;
    try {
        data = JSON.parse(event.data);
    } catch (ex) {
        return undefined;
    }

    if (typeof data.event === "undefined" || (data.channel !== config.id && data.channel !== "ALL_CHANNELS")) {
        return undefined;
    }

    return data;
}

function setStatus(status) {
    let icon, title;
    switch (status) {
        case "online":
            icon = "assets/icons/on/48.png";
            title = `${config.displayName} est en live ! Cliquez pour plus d'informations.`;
            break;
        case "offline":
            icon = "assets/icons/off/48.png";
            title = `${config.displayName} est hors-ligne ! Cliquez pour plus d'informations.`;
            break;
    }

    browser.browserAction.setIcon({ path: icon });
    browser.browserAction.setTitle({ title });
}

function blink() {
    browser.browserAction.setIcon({ path: icon = `assets/icons/off/48.png` });
    setTimeout(() => {
        if (Object.keys(currentEvent).length < 1) return;

        browser.browserAction.setIcon({ path: icon = `assets/icons/on/48.png` });
        if (!dontBlink) setTimeout(blink, 450);
    }, 350);
};

function sendNotif(title, body, url, playSound = true) {
    console.log("Sending notification.");

    let notif = {
        type: "basic",
        title: title,
        message: body,
        iconUrl: "assets/icons/on/128.png"
    };

    if (playSound && config.soundPlayer) {
        console.log("Playing sound.");
        config.soundPlayer.play();
    }

    browser.notifications.create(notif)
        .then(createdId => {
            let notifTimeout = setTimeout(() => browser.notifications.clear(createdId), 10000);

            browser.notifications.onClicked.addListener((clickedId) => {
                if (clickedId === createdId) {
                    console.log("Notification clicked.");

                    dontBlink = true;
                    clearTimeout(notifTimeout);
                    browser.notifications.clear(clickedId);

                    if (url) {
                        browser.tabs.create({ url });
                    }
                }
            });
        });
}
