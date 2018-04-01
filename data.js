const params = {
    channel: {
        "name": "[Displayed Name]",
        "id": "[YouTube Channel ID]",
        "offlineURL": "[Custom URL or {YouTube} for the channel URL]"
    },
    api: {
        "YTKeys": [
            // YouTube API Keys
        ]
    }
}

refreshYTKey()
setInterval(refreshYTKey, 10 * 60 * 1000)

channel.id = params.channel.id
channel.updateUploadsPlaylist()

tmp.redirectUrl = tmp.offlineURL = params.channel.offlineURL
    .replace('{YouTube}', "https://youtube.com/channel/{channelID}")
    .replace('{channelID}', channel.id)
    .replace('{name}', params.channel.name)

function refreshYTKey() {
    tmp.YTKey = params.api.YTKeys[Math.floor(Math.random() * params.api.YTKeys.length)]
}
