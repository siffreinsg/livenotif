const socket = connect();
if (socket) {
    socket.onerror = (ex) => console.error("[WS] Error while trying to connect.", ex);

    socket.onopen = function () {
        console.log("[WS] Connected.");

        this.onclose = () => {
            console.log("[WS] Disconnected. Reconnecting in 2 minutes...");
            setTimeout(connect, 120000);
        };

        send(this, {
            request: "ADDON_CONFIG",
            channel: config.id
        });
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
                        config = { id: data.channel, ...data.config };
                        console.log("[WS] Config saved!", config);
                    };
                    break;
                case "YOUTUBE_STREAM_START":
                case "TWITCH_STREAM_START":
                    if (data.channel && data.channel === config.id) {
                        let origin = data.event === "YOUTUBE_STREAM_START" ? "youtube" : "twitch"
                        browser.storage.local.get("lastStreamId").then((res) => StreamHandler(data.stream, origin, res.lastStreamId));
                    };
                    break;
                case "YOUTUBE_STREAM_END":
                case "TWITCH_STREAM_END":
                    if (data.channel && data.channel === config.id) {
                        setStatus("offline");
                    };
                    break;
            }
        }
    }
}
