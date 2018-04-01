const loop = function () {
    // Check stream
    channel.checkStream(isStreaming)

    // Check videos
    if (channel.uploadsPlaylist) {
        if (software === 'chrome') {
            chrome.storage.local.get(['lastVideoID'], function (result) {
                channel.checkNewVideos(channel.uploadsPlaylist, result.lastVideoID, newVideos)
            })
        } else if (software === 'firefox') {
            browser.storage.local.get(['lastVideoID']).then(function (result) {
                channel.checkNewVideos(channel.uploadsPlaylist, result.lastVideoID, newVideos)
            })
        }
    } else channel.updateUploadsPlaylist()
}


const isStreaming = function (result) {
    if (result && !tmp.onAir) {
        tmp.onAir = true
        tmp.redirectUrl = result.url

        addon.updateButton('icons/icon-on48.png', params.channel.name + ' est en live !')

        addon.sendNotif({
            icon: result.thumbnail,
            title: 'Notification - Live',
            message: params.channel.name + ' est en live !\n"' + result.title + '"' + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
            redirectUrl: result.url
        })
    } else if (!result && tmp.onAir) {
        tmp.onAir = false
        tmp.redirectUrl = tmp.offlineURL

        addon.updateButton('icons/icon-off48.png', params.channel.name + ' est hors-ligne !')
    }
}

const newVideos = function (videos, newVideosCount) {
    scope.storage.local.set({ 'lastVideoID': videos[0].id })

    if (newVideosCount === 1)
        addon.sendNotif({
            icon: videos[0].thumbnail,
            title: 'Notification - Vidéos',
            message: params.channel.name + ' a sorti une nouvelle vidéo !\n' + videos[0].title + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
            redirectUrl: videos[0].url
        })
    else if (newVideosCount > 1)
        addon.sendNotif({
            icon: 'icons/icon-on128.png',
            title: 'Notification - Vidéos',
            message: 'De nouvelles vidéos sont disponibles sur la chaîne YouTube de ' + params.channel.name + ' !' + (software === 'firefox' ? '\n\nCliquez ici pour y accéder.' : ''),
            redirectUrl: 'https://youtube.com/channel/' + channel.id + '/videos'
        })
}

addon.updateButton('icons/icon-off48.png', params.channel.name + ' est hors-ligne !')
setTimeout(loop, 1000)
setInterval(loop, 3 * 60 * 1000)

scope.browserAction.onClicked.addListener(function () {
    scope.tabs.create({ url: tmp.redirectUrl })
})
