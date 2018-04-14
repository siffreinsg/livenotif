addon.updateButton('icons/icon-off48.png', params.name + ' est hors-ligne !')
scope.browserAction.onClicked.addListener(() => scope.tabs.create({ url: tmp.redirectUrl }))

setInterval(loop, 1 * 60 * 1000)
setTimeout(loop, 1000)

function loop() {
    channel.getData(params.id, (stream, videos) => {
        // Handle stream data
        StreamHandle(stream)

        // Handle videos data
        if (software === 'chrome') {
            chrome.storage.local.get(['lastVideosID'], (result) => {
                channel.checkNewVideos(videos, result.lastVideosID, VideosHandle)
            })
        } else if (software === 'firefox') {
            browser.storage.local.get(['lastVideosID']).then((result) => {
                channel.checkNewVideos(videos, result.lastVideosID, VideosHandle)
            })
        }
    })
}

/**
 * Send a notif if a channel is on live
 * @param {Object} stream Data about the stream (Keys: id, title, thumbnail)
 */
function StreamHandle(stream) {
    if (Object.keys(stream).length > 0 && !tmp.onAir) {
        tmp.onAir = true
        tmp.redirectUrl = 'https://youtu.be/' + stream.id

        addon.updateButton('icons/icon-on48.png', params.name + ' est en live !')

        addon.sendNotif({
            icon: stream.thumbnail,
            title: 'Notification - Live',
            message: params.name + ' est en live !\n"' + stream.title + '"' + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
            redirectUrl: tmp.redirectUrl
        })
    } else if (Object.keys(stream).length === 0 && tmp.onAir) {
        tmp.onAir = false
        tmp.redirectUrl = tmp.offlineURL
        addon.updateButton('icons/icon-off48.png', params.name + ' est hors-ligne !')
    }
}

/**
 * Send a notif if there are any new videos
 * @param {Array} newVideos Contains objects of all videos
 * @param {Array} lastVideosID Array of ids of the 10th last videos of a channel
 * @param {Boolean} silentNotif If true, block any notif 
 */
function VideosHandle(newVideos, lastVideosID, silentNotif) {
    let newVideosLength = newVideos.length
    scope.storage.local.set({ lastVideosID })

    if (!silentNotif) {
        if (newVideosLength === 1) {
            let newVideo = newVideos.shift()
            addon.sendNotif({
                icon: newVideo.thumbnail,
                title: 'Notification - Vidéos',
                message: params.name + ' a sorti une nouvelle vidéo !\n' + newVideo.title + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
                redirectUrl: 'https://youtu.be/' + newVideo.id
            })
        } else if (newVideosLength > 1) {
            addon.sendNotif({
                icon: 'icons/icon-on128.png',
                title: 'Notification - Vidéos',
                message: 'De nouvelles vidéos sont disponibles sur la chaîne YouTube de ' + params.name + ' !' + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
                redirectUrl: 'https://youtube.com/channel/' + channel.id + '/videos'
            })
        }
    }
}
