const socket = connect();

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
        console.error("[WS] Message received but not in a valid format", data);
        return;
    }

    if (data.event) {
        console.log(`[WS] Received ${data.event} event.`);
        switch (data.event) {
            case "ADDON_CONFIG":
                if (data.channel && data.config && data.channel === config.id) {
                    config = { id: data.channel, ...data.config }
                    console.log("[WS] Config received!", config);
                }
                break;
        }
    }
}
