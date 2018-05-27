function loop() {
    browser.storage.local.get(["lastVideosID", "lastStreamID"]).then(result => {
        if (tmp.announceStreams && params.streamOrigin === "twitch" && params.IDs.twitch) {
            getTWData(params.IDs.twitch, stream => StreamHandler(stream, "twitch", result.lastStreamID || ""));
        }

        if (params.IDs.youtube) {
            getYTData(params.IDs.youtube, (stream, videos) => {
                if (tmp.announceStreams && params.streamOrigin === "youtube") {
                    StreamHandler(stream, "youtube", lastStreamID);
                }
                if (tmp.announceVideos) {
                    checkNewVideos(videos, result.lastVideosID, VideosHandler);
                }
            });
        }
    });
}

function StreamHandler(stream, origin, lastStreamID) {
    let streamIsEmpty = isEmpty(stream);

    if (!streamIsEmpty > 0 && !tmp.onAir) {
        tmp.currentStream = {
            publishedAt: stream.publishedAt,
            thumbnail: stream.thumbnail,
            title: stream.game || stream.title || "UNDEFINED",
            url: (origin === "twitch" ? `https://twitch.tv/${params.IDs.twitch}` : `https://www.youtube.com/channel/${params.IDs.youtube}/live`),
        };

        browser.storage.local.set({ lastStreamID: stream.id });
        setStatus("online");
        if (lastStreamID !== stream.id) {
            sendNotif("live", tmp.currentStream.thumbnail, tmp.currentStream.title, tmp.currentStream.url);
        }
    } else if (streamIsEmpty && tmp.onAir) {
        tmp.currentStream = {};
        setStatus("offline");
    }
}

function VideosHandler(newVideos, lastVideosID, silentNotif = false) {
    browser.storage.local.set({ lastVideosID });
    if (silentNotif || newVideos.length === 0) return;

    if (newVideos.length === 1) {
        let newVideo = newVideos.shift();
        sendNotif("1video", newVideo.thumbnail, newVideo.title, `https://youtu.be/${newVideo.id}`);
    } else {
        sendNotif("videos", "assets/icons/on/128.png", "", `https://youtube.com/channel/${params.IDs.youtube}/videos`);
    }
}

setStatus("offline");
// setInterval(function x() { loop(); return x; }(), params.checkInterval * 1000);

browser.runtime.onInstalled.addListener(details => {
    let notif = { type: "basic", iconUrl: "assets/icons/on/128.png", title: `LiveNotif (${params.name}) - ` };
    switch (details.reason) {
        case "update":
            notif.title += "Mise à jour";
            switch (params.software) {
                case "firefox":
                    notif.message = "Extension mise à jour automatiquement !\nDe nouvelles fonctionnalités sont disponibles, vous pouvez découvrir leur fonctionnement en cliquant ici !";
                    break;
                case "chrome":
                    notif.message = "Extension mise à jour automatiquement !\nDécouvrez les nouveautés en cliquant ici.";
                    break;
            }
            break;
        case "install":
            notif.title += "Installé";
            switch (params.software) {
                case "firefox":
                    notif.message = "Merci pour l'installation de notre extension.\nVous pouvez découvrez les fonctionnalités ainsi que le fonctionnement de l'extension en cliquant ici !";
                    break;
                case "chrome":
                    notif.message = "Extension installée ! Découvrez les fonctionnalités en cliquant ici.";
                    break;
            }
            break;
    }

    browser.notifications.create(notif).then(createdId => {
        browser.notifications.onClicked.addListener(clickedId => {
            if (clickedId === createdId) {
                browser.notifications.clear(clickedId);
                browser.tabs.create({ url: "https://github.com/siffreinsg/livenotif/releases/latest" });
            }
        });
    });
});
