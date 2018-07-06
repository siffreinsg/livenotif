const send = (socket, data) => socket.send(JSON.stringify(data));

const blink = () => {
    browser.browserAction.setIcon({ path: icon = `assets/icons/off/48.png` });
    setTimeout(() => {
        if (Object.keys(currentStream).length < 1) return;

        browser.browserAction.setIcon({ path: icon = `assets/icons/on/48.png` });
        if (!dontBlink) setTimeout(blink, 450);
    }, 350);
};

const setStatus = (status) => {
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

const sendNotif = ({ event, url, eventStartTime, eventDesc = "", eventTitle = "", playSound = true }) => {
    let notif = {
        type: "basic",
        title: "",
        message: "",
        iconUrl: "assets/icons/on/128.png",
    };

    switch (event) {
        case "stream":
            notif.title += "Stream en cours";

            if (config.software === "firefox") notif.message += `${config.displayName} est en streaming sur ${origin === "youtube" ? "YouTube" : "Twitch"}:\n${eventDesc}\nEn live depuis ${timeago().format(eventStartTime, "fr_FR")}.`;
            else notif.message += `${config.displayName} est en stream !\n"${eventDesc}"`;
            break;
        case "1video":
            notif.title += "Nouvelle vidéo";

            if (config.software === "firefox") notif.message += `Une nouvelle vidéo est disponible sur la chaîne YouTube de ${config.displayName}:\n${eventDesc}\nEn ligne depuis ${timeago().format(eventStartTime, "fr_FR")}.`;
            else notif.message += `${config.displayName} a sorti une nouvelle vidéo !\n> ${eventDesc}`;
            break;
        case "videos":
            notif.title += "Nouvelles vidéos";

            if (config.software === "firefox") notif.message += `De nouvelles vidéos sont disponibles sur la chaîne YouTube de ${config.displayName}.\n\nCliquez ici pour visiter la chaîne.`;
            else notif.message += `${config.displayName} a sorti de nouvelles vidéos sur sa chaîne YouTube !`;
            break;
        case "custom":
            notif.title = eventTitle;
            notif.message = eventDesc;
            break;
    };

    if (playSound && config.playSound && sounds[config.selectedSound]) {
        let player = sounds[config.selectedSound].player;
        player.volume = config.volume;
        player.play();
    }

    browser.notifications.create(notif).then(createdId => {
        browser.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === createdId) {
                dontBlink = true;
                browser.notifications.clear(clickedId);
                if (url) { browser.tabs.create({ url }); }
            }
        });
    });
}

const StreamHandler = (stream, origin, lastStreamId) => {
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
            if (config.blinkingIcon) {
                dontBlink = false;
                blink();
            }
            sendNotif({ event: "stream", url: streamUrl, eventDesc: streamTitle, eventStartTime: streamStart });
        }
    };
}

const VideosHandler = (videos) => {
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
