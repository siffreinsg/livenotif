loadUserConfig()
    .then((userConfig) => {
        config = { ...appConfig, ...userConfig }
        setStatus("offline");
        socket = new WebSocket(config.socketUrl);

        socket.sendJson = function (data) {
            try {
                this.send(JSON.stringify(data));
            } catch (ex) { this.send(data); }
        }

        socket.onerror = (ex) => console.error("[WS] Error while trying to connect.", ex);
        socket.onclose = (event) => {
            connected = false;
            console.log("[WS] Disconnected from the socket. Reconnecting in 3 minutes...", event);
            setTimeout(silentReload, 180000);
        };
        socket.onopen = (event) => {
            connected = true;
            console.log(`[WS] Connected to ${config.socketUrl}.`, event);
            socket.sendJson({ request: "ADDON_CONFIG", channel: config.id });
        };

        socket.onmessage = messageEvent;
    });
