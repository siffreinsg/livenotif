var socket = new WebSocket(socketsUrl[Math.floor(Math.random() * socketsUrl.length)]);

socket.onerror = (ex) => console.error("[WS] Error while trying to connect.", ex);

socket.onclose = (event) => {
    console.log("[WS] Connection lost. Reconnecting in 3 minutes...", event);

    if (config.devMode) {
        sendNotif({ event: "custom", eventTitle: "Déconnecté du WebSocket", eventDesc: `CODE > ${event.code}\nURL > ${event.currentTarget.url}` })
    }

    setTimeout(() => {
        browser.storage.local.set({ silentReload: "yes" }).then(() => browser.runtime.reload());
    }, 180 * 1000);
};

socket.onopen = (ev) => {
    if (config.devMode) {
        sendNotif({ event: "custom", eventTitle: "Connecté au WebSocket", eventDesc: `URL: ${ev.currentTarget.url}` })
    }
    console.log("[WS] Connected.");
    send(socket, { request: "ADDON_CONFIG", channel: config.id });
};

socket.onmessage = (event) => {
    let data = event.data;
    try {
        data = JSON.parse(event.data);
    } catch (ex) {
        return console.error("[WS] Message received but not in a valid format", data);
    }

    if (data.event) {
        console.log(`[WS] Received ${data.event} event.`);

        switch (data.event) {
            case "ADDON_CONFIG":
                if (data.channel && data.config && data.channel === config.id) {
                    config = { ...config, ...data.config };
                    console.log("[WS] Config saved!", config);

                    setStatus("offline");
                    send(socket, { request: "CURRENT_ACTIVITY", channel: config.id });
                };
                break;
            case "YOUTUBE_STREAM_START":
            case "TWITCH_STREAM_START":
                if (data.channel && data.channel === config.id && data.stream) {
                    let origin = data.event === "YOUTUBE_STREAM_START" ? "youtube" : "twitch"
                    browser.storage.local.get("lastStreamId").then((res) => StreamHandler(data.stream, origin, res.lastStreamId));
                };
                break;
            case "YOUTUBE_STREAM_END":
            case "TWITCH_STREAM_END":
                if (data.channel && data.channel === config.id) {
                    currentStream = {};
                    dontBlink = true;
                    setStatus("offline");
                };
                break;
            case "YOUTUBE_NEW_VIDEOS":
                console.log("Event data:", data);
                if (config.announceVideos && data.channel && data.channel === config.id && data.videos) {
                    VideosHandler(data.videos);
                };
                break;
            case "CUSTOM_NOTIF":
                if (data.channel && data.channel !== config.channel) return;
                if (data.notif && data.notif.title && data.notif.message) {
                    sendNotif({ event: "custom", url: data.notif.url, eventDesc: data.notif.message, eventTitle: data.notif.title });
                };
                break;
        };
    } else {
        console.log("[WS] Received unknown message:", data);
    }
};
