const channel = {
    /*
    Get data on a channel from the api hosted on heroku
    */
    getData: (channelID, callback) => {
        let callURL = 'https://livenotif.glitch.me/yt/' + channelID

        fetch(new Request(callURL))
            .then((resp) => { return resp.json() })
            .then((resp) => {
                if (resp.streaming && resp.videos) callback(resp.streaming.stream, resp.videos.videos)
            })
    },

    /**
     * Check if there is any new videos in a list of videos based on an array of ids
     */
    checkNewVideos: (videos, lastVideosID, callback) => {
        const newlastVideosID = videos.map((video) => { return video.id })
        if (!lastVideosID || lastVideosID.length === 0) return callback(videos, newlastVideosID, true)

        const newVideos = videos.filter((video) => lastVideosID.indexOf(video.id) === -1)
        return callback(newVideos, newlastVideosID)
    },
}


const addon = {
    /**
     * Send a basic notif based on a object with 3 properties : icon, title, message
     */
    sendNotif: (content) => {
        let notif = {
            "type": "basic",
            "iconUrl": content.icon
                .replace('i.ytimg', 'img.youtube'),
            "title": content.title,
            "message": content.message
        }

        // On firefox: API return promises
        // On chrome: API use a callback
        if (software === 'firefox') browser.notifications.create(notif).then((createdId) => addon.notifEvent(createdId, content))
        else if (software === 'chrome') chrome.notifications.create(notif, (createdId) => addon.notifEvent(createdId, content))
    },

    /**
     * Handle notif events
     */
    notifEvent: (createdId, content) => {
        scope.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === createdId) {
                scope.notifications.clear(clickedId)
                scope.tabs.create({ url: content.redirectUrl }, (tab) => { })
            }
        })
    },

    /**
     * Update the button based on an icon and a title
     */
    updateButton: (icon, title) => {
        scope.browserAction.setIcon({ path: icon })
        scope.browserAction.setTitle({ title })
    }
}
