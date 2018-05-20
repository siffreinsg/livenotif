function loop() {
    browser.storage.local.get(["lastVideosID", "lastStreamID"]).then(result => {
        getData(result.lastVideosID, result.lastStreamID);
    });
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

    if (!streamIsEmpty > 0 && !tmp.onAir && lastStreamID !== stream.id) {
        tmp.onAir = true;
        tmp.redirectUrl = (origin === "twitch" ? `https://twitch.tv/${params.IDs.twitch}` : `https://www.youtube.com/channel/${params.IDs.youtube}/live`);
        browser.storage.local.set({ lastStreamID: stream.id });
        setStatus("online");
        sendNotif("live", stream.thumbnail, stream.game || stream.title, tmp.redirectUrl);
    } else if (streamIsEmpty && tmp.onAir) {
        tmp.onAir = false;
        tmp.redirectUrl = params.offlineURL;
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
        sendNotif("videos", "assets/icons-on/128.png", "", `https://youtube.com/channel/${params.IDs.youtube}/videos`);
    }
}

setStatus("offline");
setInterval(function x() { loop(); return x; }(), params.checkInterval * 1000);

browser.browserAction.onClicked.addListener(() => browser.tabs.create({ url: tmp.redirectUrl }));
browser.runtime.onInstalled.addListener(details => {
    let notif = {};
    switch (details.reason) {
        case "update":
            notif = {
                type: "basic",
                title: `LiveNotif (${params.name}) - Mis à jour`,
                message: "Addon mis à jour ! Découvrez les nouveautés et modifications en cliquant ici.",
                iconUrl: "assets/icons-on/128.png"
            };
            break;
        case "install":
            notif = {
                type: "basic",
                title: `LiveNotif (${params.name}) - Addon installé`,
                message: "Merci pour l'installation de notre extension.\nDécouvrez les fonctionnalités en cliquant ici !",
                iconUrl: "assets/icons-on/128.png"
            };
            break;
    }

    browser.notifications.create(notif).then(createdId => {
        browser.notifications.onClicked.addListener(clickedId => {
            notifEvent(clickedId, createdId, "https://github.com/siffreinsg/livenotif/releases/latest");
        });
    });
});
