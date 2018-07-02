var connect = () => {
    let socket = null;
    try {
        socket = new WebSocket("ws://localhost");
    } catch (ex) {
        console.error("[WS] Error while connecting to the websocket.", ex);
    }
    return socket;
}

var send = (socket, data) => socket.send(JSON.stringify(data));
