function messageEvent(event) {
    extractMessageFromEvent(event)
        .then((message) => {
            console.log(`[WS] Received ${message.event} event.`);

            switch (message.event) {
                case "ADDON_CONFIG":
                    config = { ...config, ...message.config };
                    console.log("[WS] Config saved!", config);
                    socket.sendJson({ request: "CURRENT_ACTIVITY", channel: config.id });
                    break;
                case "EVENT_START":
                    browser.storage.local.get("lastEventId")
                        .then((res) => EventStartHandler(message.stream, message.origin, res.lastEventId));
                    break;
                case "EVENT_END":
                    currentStream = {};
                    dontBlink = true;
                    setStatus("offline");
                    break;
            }
        })
        .catch(() => {
            console.log("[WS] Message received from the socket but is not well formated.", event.data);
        })
}

function EventStartHandler(event, lastEventId) {
    setStatus("online");

    currentEvent = event;
    const { id, url, notif } = event;

    if (id !== lastEventId) {
        if (config.blinkingIcon) {
            dontBlink = false;
            blink();
        }

        browser.storage.local.set({ lastEventId: id });
        sendNotif(notif.title, notif[config.software + "Body"], url);
    }
}
