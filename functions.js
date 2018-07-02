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

var setStatus = (status) => {
    let icon, title;
    switch (status) {
        case "online":
            icon = "assets/icons/on/48.png";
            title = `${params.name} est en live ! Cliquez pour y accéder.`;
            break;
        case "offline":
            icon = "assets/icons/off/48.png";
            title = `${params.name} est hors-ligne ! Cliquez pour accéder à sa chaîne.`;
            break;
    }

    browser.browserAction.setIcon({ path: icon });
    browser.browserAction.setTitle({ title });
}


var sendNotif = (event, eventDesc, url) => {
    let notif = {
        type: "basic",
        title: `${config.displayName} - `,
        message: `${config.displayName} `,
        iconUrl: "assets/icons/on/128.png",
    };

    switch (event) {
        case "stream":
            notif.title += "LIVE";
            notif.message += `est en live !\n> ${eventDesc}`;
            break;
        case "1video":
            notif.title = "VIDEO";
            notif.message += `a sorti une nouvelle vidéo !\n> ${eventDesc}`;
            break;
        case "videos":
            notif.title = "VIDEOS";
            notif.message += "a sorti de nouvelles vidéos sur sa chaîne YouTube !";
            break;
    };

    browser.notifications.create(notif).then(createdId => {
        /* if (tmp.playSound && params.sounds[tmp.selectedSound]) {
            let player = params.sounds[tmp.selectedSound].player;
            player.volume = tmp.volume;
            player.play();
        } */

        browser.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === createdId) {
                browser.notifications.clear(clickedId);
                browser.tabs.create({ url });
            }
        });
    });
}

var StreamHandler = (stream, origin, lastStreamId) => {
    currentStream = stream;
    let streamId = origin === "youtube" ? stream.id.videoId : stream.id;
    let streamTitle = origin === "youtube" ? stream.snippet.title : stream.title;
    let streamUrl = origin === "youtube" ? `https://youtu.be/${streamId}` : `https://twitch.tv/${config.IDs.twitch}`

    if (lastStreamId || streamId !== lastStreamId) {
        setStatus("online");
        browser.storage.local.set({ lastStreamId: streamId });
        sendNotif("stream", streamTitle, streamUrl);
    };
}
