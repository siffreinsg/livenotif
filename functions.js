var send = (socket, data) => socket.send(JSON.stringify(data));

var setStatus = (status) => {
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


var sendNotif = ({ event, url, eventStartTime, eventDesc = "", title = "" }) => {
    let notif = {
        type: "basic",
        title: `${config.displayName} - `,
        message: "",
        iconUrl: "assets/icons/on/128.png",
    };

    switch (event) {
        case "stream":
            notif.title += "Stream";

            if (config.software === "firefox") notif.message += `${config.displayName} est en streaming sur ${origin === "youtube" ? "YouTube" : "Twitch"}:\n${eventDesc}\n\nEn live depuis ${timeago().format(eventStartTime, "fr_FR")}.`;
            else notif.message += `est en stream !\n> ${eventDesc}`;
            break;
        case "1video":
            notif.title += "Vidéo";

            if (config.software === "firefox") notif.message += `Nouvelle vidéo disponible sur la chaîne YouTube de ${config.displayName}:\n${eventDesc}\n\nEn ligne depuis ${timeago().format(eventStartTime, "fr_FR")}.`;
            else notif.message += `a sorti une nouvelle vidéo !\n> ${eventDesc}`;
            break;
        case "videos":
            notif.title += "Vidéos";

            if (config.software === "firefox") notif.message += `De nouvelles vidéos sont disponibles sur la chaîne YouTube de ${config.displayName}.\n\nCliquez ici pour visiter la chaîne.`;
            else notif.message += "a sorti de nouvelles vidéos sur sa chaîne YouTube !";
            break;
        case "custom":
            notif.title = title;
            notif.message = eventDesc;
            break;
    };

    browser.notifications.create(notif).then(createdId => {
        if (config.playSound && sounds[config.selectedSound]) {
            let player = sounds[config.selectedSound].player;
            player.volume = config.volume;
            player.play();
        }

        browser.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === createdId) {
                browser.notifications.clear(clickedId);
                if (url) { browser.tabs.create({ url }); }
            }
        });
    });
}

var StreamHandler = (stream, origin, lastStreamId) => {
    currentStream = stream;
    currentStream.origin = origin;
    setStatus("online");

    let streamId = origin === "youtube" ? stream.id.videoId : stream.id;
    let streamTitle = origin === "youtube" ? stream.snippet.title : stream.title;
    let streamUrl = origin === "youtube" ? `https://youtu.be/${streamId}` : `https://twitch.tv/${config.IDs.twitch}`
    let streamStart = new Date(stream.origin === "youtube" ? stream.snippet.publishedAt : stream.started_at);

    if (streamId !== lastStreamId) {
        browser.storage.local.set({ lastStreamId: streamId });

        if (config.announceStreams) {
            sendNotif({ event: "stream", url: streamUrl, eventDesc: streamTitle, eventStartTime: streamStart });
        }
    };
}

var VideosHandler = (videos) => {
    browser.storage.local.get("lastVideosId").then((res) => {
        browser.storage.local.set({ lastVideosId: videos.map(video => video.snippet.resourceId.videoId) });

        if (res.lastVideosId instanceof Array) {
            let newVideos = videos.filter(video => res.lastVideosId.indexOf(video.snippet.resourceId.videoId) === -1);

            if (newVideos.length >= 10 || newVideos.length <= 0) {
                return;
            } else if (newVideos.length === 1) {
                let newVideo = newVideos.shift();
                sendNotif({ event: "1video", url: `https://youtu.be/${newVideo.snippet.resourceId.videoId}`, eventDesc: newVideo.snippet.title, eventStartTime: newVideo.snippet.publishedAt });
            } else {
                sendNotif({ event: "videos", url: `https://youtube.com/channel/${config.IDs.youtube}/videos` });
            }
        };
    });

}
