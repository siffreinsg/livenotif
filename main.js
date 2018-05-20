function loop() {
    if (software === "chrome") {
        scope.storage.local.get(["lastVideosID", "lastStreamID"], result => getData(result.lastVideosID, result.lastStreamID));
    } else if (software === "firefox") {
        scope.storage.local.get(["lastVideosID", "lastStreamID"]).then(result => getData(result.lastVideosID, result.lastStreamID));
    }
}

function getData(lastVideosID, lastStreamID) {
    if (tmp.announceStreams && params.streamOrigin === "twitch" && params.IDs.twitch) {
        getTWData(params.IDs.twitch, stream => StreamHandler(stream, "twitch", lastStreamID || ""));
    }

    if (params.IDs.youtube) {
        getYTData(params.IDs.youtube, (stream, videos) => {
            if (tmp.announceStreams && params.streamOrigin === "youtube") {
                StreamHandler(stream, "youtube", lastStreamID);
            }
            if (tmp.announceVideos) {
                checkNewVideos(videos, lastVideosID, VideosHandler);
            }
        });
    }
}

function StreamHandler(stream, origin, lastStreamID) {
    let streamIsEmpty = isEmpty(stream);

    if (!streamIsEmpty && !tmp.onAir && lastStreamID !== stream.id) {
        tmp.onAir = true;
        tmp.redirectUrl = (origin === "twitch" ? `https://twitch.tv/${params.IDs.twitch}` : `https://www.youtube.com/channel/${params.IDs.youtube}/live`);
        scope.storage.local.set({ lastStreamID: stream.id });
        setStatus("online");
        sendNotif("live", stream.thumbnail, stream.game || stream.title, tmp.redirectUrl);
    } else if (streamIsEmpty && tmp.onAir) {
        tmp.onAir = false;
        tmp.redirectUrl = params.offlineURL;
        setStatus("offline");
    }
}

function VideosHandler(newVideos, lastVideosID, silentNotif = false) {
    scope.storage.local.set({ lastVideosID });
    if (silentNotif || newVideos.length === 0) return;

    if (newVideos.length === 1) {
        let newVideo = newVideos.shift();
        sendNotif("1video", newVideo.thumbnail, newVideo.title, `https://youtu.be/${newVideo.id}`);
    } else {
        sendNotif("videos", "assets/icon-on128.png", "", `https://youtube.com/channel/${params.IDs.youtube}/videos`);
    }
}

setStatus("offline");
setInterval(function x() { loop(); return x; }(), 60000);

scope.browserAction.onClicked.addListener(() => scope.tabs.create({ url: tmp.redirectUrl }));
scope.runtime.onInstalled.addListener(details => {
    let notif = {};
    switch (details.reason) {
        case "update":
            notif = {
                type: "basic",
                title: `LiveNotif (${params.name}) - Mis à jour`,
                message: "L'extension a été mis à jour !\nDes changements on eu lieu et peuvent changer le comportement de l'addon.\nDécouvrez les nouveautés en cliquant ici.",
                iconUrl: "assets/icon-on128.png"
            };
            break;
        case "install":
            notif = {
                type: "basic",
                title: `LiveNotif (${params.name}) - Addon installé`,
                message: "Merci pour l'installation de notre extension.\nVous pouvez en découvrir les fonctionnalités en cliquant ici !",
                iconUrl: "assets/icon-on128.png"
            };
            break;
    }

    if (software === "firefox") {
        browser.notifications.create(notif).then(createdId => {
            browser.notifications.onClicked.addListener(clickedId => notifEvent(clickedId, createdId, "https://github.com/siffreinsg/livenotif/releases/latest"));
        });
    } else if (software === "chrome") {
        chrome.notifications.create(notif, createdId => {
            browser.notifications.onClicked.addListener(clickedId => notifEvent(clickedId, createdId, "https://github.com/siffreinsg/livenotif/releases/latest"));
        });
    }
});
