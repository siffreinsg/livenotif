function messageEvent(event) {
    const message = extractMessageFromEvent(event);
    if (!message) {
        return console.log("[WS] Message received but has been ignored (irrelevant).", event.data);
    }

    console.log(`[WS] Received ${message.event} event.`);

    switch (message.event) {
        case "ADDON_CONFIG":
            config = { ...config, ...message.config };
            console.log("[WS] Config saved!", config);
            socket.sendJson({ request: "CURRENT_ACTIVITY", channel: config.id });
            break;
        case "EVENT_START":
            browser.storage.local.get("lastEventId")
                .then((res) => EventStartHandler(message, res.lastEventId));
            break;
        case "EVENT_END":
            currentStream = {};
            dontBlink = true;
            setStatus("offline");
            break;
    }
}

function EventStartHandler(event, lastEventId) {
    setStatus("online");

    currentEvent = event;
    const { id, url, notif } = event;

    if (id !== lastEventId) {
        console.log(`A new event started (ID: ${id}).`);

        if (config.blinkingIcon) {
            dontBlink = false;
            blink();
        }

        browser.storage.local.set({ lastEventId: id });
        sendNotif(notif.title, notif[config.software + "Body"], url);
    }
}

browser.runtime.onInstalled.addListener(details => {
    const name = config.id[0].toUpperCase() + config.id.substring(1);
    const eventTitle = `${name} - LiveNotif`;
    const message = "";

    switch (details.reason) {
        case "update":
            if (config.software === "firefox") {
                message = "Addon mis à jour ! Profitez-en bien :)\n\nDécouvrez les nouveautés et fonctionnalités en cliquant sur la notification.";
                break;
            }
            message = "Addon à jour: découvrez les nouveautés en cliquant sur la notification.";
            break;
        case "install":
            if (config.software === "firefox") {
                message = `Installation de l'addon terminée avec succès!\nVous recevrez désormais des notifications lors que ${name} sera en stream ou sort une vidéo.`;
                break;
            }
            message = "Addon installé: découvrez les fonctionnalités en cliquant sur la notification.";
            break;
    }

    browser.storage.local.get("silentReload")
        .then((res) => {
            if (res.silentReload !== "yes") {
                sendNotif({ event: "custom", url: "https://github.com/siffreinsg/livenotif/releases/latest", eventTitle, eventDesc: message });
            } else {
                browser.storage.local.set({ silentReload: "no" });
            }
        });
});
