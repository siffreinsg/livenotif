/**
 * Get some YouTube data from the api
 * @param {string} channelID YouTube channel ID
 * @param {Function} callback Callback about a stream and videos
 */
function getYTData(channelID, callback) {
    fetch(`https://livenotif-api.glitch.me/YouTube?channelid=${channelID}`)
        .then(resp => resp.json())
        .then(resp => { if (resp.stream && resp.videos) callback(resp.stream, resp.videos) })
}

/**
 * Get some Twitch data from the api
 * @param {string} channelID YouTube channel ID
 * @param {Function} callback Callback data about a stream
 */
function getTWData(channelID, callback) {
    fetch(`https://livenotif-api.glitch.me/Twitch?channelid=${channelID}`)
        .then(resp => resp.json())
        .then(resp => { if (resp.stream) callback(resp.stream) })
}

/**
 * Compare videos and lastVideosID and returns new videos.
 * @param {Array} videos Array of videos
 * @param {Array} lastVideosID Array of videos id (should be the same length as videos or 0)
 * @param {Function} callback Callback new videos; array of ID of all videos from initial "videos"
 */
function checkNewVideos(videos, lastVideosID, callback) {
    const newlastVideosID = videos.map(video => video.id)
    if (!lastVideosID || lastVideosID.length === 0) return callback(videos, newlastVideosID, true)

    const newVideos = videos.filter(video => lastVideosID.indexOf(video.id) === -1)
    return callback(newVideos, newlastVideosID)
}

/**
 * Send a notification
 * @param {'live' | '1video' | 'videos'} eventType For what event  
 * @param {string} iconUrl URL of the image displayed with the notif
 * @param {string} eventDesc Small text about the event (such as Title of a video) 
 * @param {string} redirectUrl URL to which the user will be redirected
 */
function sendNotif(eventType, iconUrl, eventDesc, redirectUrl) {
    let notif = { type: 'basic', title: 'Notification', message: params.name + ' ', iconUrl: iconUrl.replace('i.ytimg', 'img.youtube') }
    switch (eventType) {
        case 'live':
            notif.title += ' - Live'
            notif.message += `est en live !\n> ${eventDesc}`
            break
        case '1video':
            notif.title += ' - Vidéo'
            notif.message += `a sorti une nouvelle vidéo !\n> ${eventDesc}`
            break
        case 'videos':
            notif.title += ' - Vidéos'
            notif.message += 'a sorti de nouvelles vidéos sur sa chaîne YouTube !'
            break
    }

    if (software === 'firefox') {
        notif.message += '\n\nCliquez pour ouvrir'
        browser.notifications.create(notif).then(createdId => {
            browser.notifications.onClicked.addListener(clickedId => notifEvent(clickedId, createdId, redirectUrl))
        })
    } else if (software === 'chrome') {
        notif.buttons = [{ title: 'Ouvrir dans le navigateur' }]
        chrome.notifications.create(notif, createdId => {
            chrome.notifications.onClicked.addListener(clickedId => notifEvent(clickedId, createdId, redirectUrl))
            chrome.notifications.onButtonClicked.addListener(clickedId => notifEvent(clickedId, createdId, redirectUrl))
        })
    }
}

function notifEvent(clickedId, createdId, redirectUrl) {
    if (clickedId === createdId) {
        scope.notifications.clear(clickedId)
        scope.tabs.create({ url: redirectUrl }).catch(err => { /* osef si ça ouvre pas */ })
    }
}

/**
 * Change the icon and the title of the button
 * @param {'online' | 'offline' | 'custom'} status Presets
 */
function setStatus(status = 'toggle', customIcon = '', customTitle = '') {
    let icon, title
    switch (status) {
        case 'online':
            icon = 'icons/icon-on48.png'
            title = `${params.name} est en live ! Cliquez pour y accéder.`
            break
        case 'offline':
            icon = 'icons/icon-off48.png'
            title = `${params.name} est hors-ligne ! Cliquez pour accéder à sa chaîne.`
            break
        default:
            icon = customIcon
            title = customTitle
            break
    }

    scope.browserAction.setIcon({ path: icon })
    scope.browserAction.setTitle({ title })
}
