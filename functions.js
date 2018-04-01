const channel = {
    id: '',
    uploadsPlaylist: '',

    /**
     * YouTube store all the videos uploaded by an user in a playlist called "uploads"
     * To access those videos, we have to interact with this playlist
     */
    updateUploadsPlaylist() {
        let cthis = this,
            callURL = 'https://www.googleapis.com/youtube/v3/channels?id='
                + this.id + '&key='
                + tmp.YTKey + '&part=contentDetails'

        fetch(new Request(callURL))
            .then(function (resp) {
                // Convert the body of the request to a JSON object
                return resp.json()
            })
            .then(function (resp) {
                console.log(resp)
                if (resp.error || !resp.items[0] || !resp.items[0].contentDetails || !resp.items[0].contentDetails.relatedPlaylists)
                    return false
                cthis.uploadsPlaylist = resp.items[0].contentDetails.relatedPlaylists.uploads
            })
    },

    /**
     * Get all the videos of a playlist
     * Use this with this.updateUploadsPlaylist() to get all the user's uploaded videos 
     */
    getVideos: function (playlistid, callback) {
        let callURL = 'https://www.googleapis.com/youtube/v3/playlistItems?playlistId='
            + playlistid + '&key='
            + tmp.YTKey + '&part=snippet&maxResults=25'

        fetch(new Request(callURL))
            .then(function (resp) {
                // Convert the body of the request to a JSON object 
                return resp.json()
            })
            .then(function (resp) {
                if (resp.error || resp.pageInfo.totalResults > 0) return false

                let toReturn = []
                resp.items.forEach(function (item) {
                    if (item.snippet.resourceId.kind === 'youtube#video') {
                        toReturn.push({
                            id: item.snippet.resourceId.videoId,
                            title: item.snippet.title,
                            desc: item.snippet.description,
                            thumbnail: item.snippet.thumbnails.high.url,
                            url: 'https://youtu.be/' + item.snippet.resourceId.videoId
                        })
                    }
                })
                callback(toReturn)
            })
    },

    /**
     * Check if new videos are available in a playlist based on the id of the last video
     */
    checkNewVideos: function (playlistid, lastVideoID, callback) {
        this.getVideos(playlistid, function (videos) {
            let newVideosCount = 0
            if (!lastVideoID) return callback(videos, newVideosCount)

            for (let key in videos) {
                if (videos[key].id === lastVideoID) break;
                else newVideosCount++
            }
            return callback(videos, newVideosCount)
        })
    },

    /*
    Check if the channel is streaming
    */
    checkStream: function (callback) {
        let callURL = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId='
            + this.id + '&type=video&eventType=live&key='
            + tmp.YTKey + '&maxResults=1&safeSearch=none'

        fetch(new Request(callURL))
            .then(function (resp) {
                // Convert the body of the request to a JSON object 
                return resp.json()
            })
            .then(function (resp) {
                if (!resp.error && resp.pageInfo && resp.pageInfo.totalResults && resp.pageInfo.totalResults > 0 && resp.items[0]) {
                    return callback({
                        id: resp.items[0].id.videoId,
                        title: resp.items[0].snippet.title,
                        desc: resp.items[0].snippet.description,
                        url: 'https://youtu.be/' + resp.items[0].id.videoId,
                        thumbnail: resp.items[0].snippet.thumbnails.high.url
                    })
                }
            })
    }
}


const addon = {
    /**
     * Send a basic notif based on a object with 3 properties : icon, title, message
     */
    sendNotif: function (content) {
        let notif = {
            "type": "basic",
            "iconUrl": content.icon
                .replace('i.ytimg', 'img.youtube'),
            "title": content.title,
            "message": content.message
        }

        // On firefox: API return promises
        // On chrome: API use a callback
        if (software === 'firefox') browser.notifications.create(notif).then(events)
        else if (software === 'chrome') chrome.notifications.create(notif, events)

        function events(createdId) {
            scope.notifications.onClicked.addListener(function (clickedId) {
                if (clickedId === createdId) {
                    scope.notifications.clear(clickedId)
                    scope.tabs.create({ url: content.redirectUrl }, function (tab) { })
                }
            })
        }
    },

    /**
     * Update the button based on an icon and a title
     */
    updateButton: function (icon, title) {
        scope.browserAction.setIcon({ path: icon })
        scope.browserAction.setTitle({ title })
    }
}
