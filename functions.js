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


var sendNotif = (event, url, eventDesc = "", title = "") => {
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
            notif.title += "VIDEO";
            notif.message += `a sorti une nouvelle vidéo !\n> ${eventDesc}`;
            break;
        case "videos":
            notif.title += "VIDEOS";
            notif.message += "a sorti de nouvelles vidéos sur sa chaîne YouTube !";
            break;
        case "custom":
            notif.title = title;
            notif.message = eventDesc;
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

                if (url) {
                    browser.tabs.create({ url });
                }
            }
        });
    });
}

var StreamHandler = (stream, origin, lastStreamId) => {
    currentStream = stream;
    let streamId = origin === "youtube" ? stream.id.videoId : stream.id;
    let streamTitle = origin === "youtube" ? stream.snippet.title : stream.title;
    let streamUrl = origin === "youtube" ? `https://youtu.be/${streamId}` : `https://twitch.tv/${config.IDs.twitch}`

    console.log(streamId, lastStreamId);

    if (streamId !== lastStreamId) {
        setStatus("online");
        browser.storage.local.set({ lastStreamId: streamId });
        sendNotif("stream", streamUrl, streamTitle);
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
                sendNotif("1video", `https://youtu.be/${newVideo.snippet.resourceId.videoId}`, newVideo.snippet.title);
            } else {
                sendNotif("videos", `https://youtube.com/channel/${config.IDs.youtube}/videos`);
            }
        };
    });

}
