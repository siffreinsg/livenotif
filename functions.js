/**
 * Get some YouTube data from the api
 * @param {string} channelID YouTube channel ID
 * @param {Function} callback Callback about a stream and videos
 */
function getYTData(channelID, callback) {
    fetch(`https://livenotif-api.glitch.me/YouTube?channelid=${channelID}`)
        .then(resp => resp.json())
        .then(resp => {
            if (resp.stream && resp.videos) callback(resp.stream, resp.videos);
        });
}

/**
 * Get some Twitch data from the api
 * @param {string} channelID YouTube channel ID
 * @param {Function} callback Callback data about a stream
 */
function getTWData(channelID, callback) {
    fetch(`https://livenotif-api.glitch.me/Twitch?channelid=${channelID}`)
        .then(resp => resp.json())
        .then(resp => {
            if (resp.stream) callback(resp.stream);
        });
}

/**
 * Compare videos and lastVideosID and returns new videos.
 * @param {Array} videos Array of videos
 * @param {Array} lastVideosID Array of videos id (should be the same length as videos or 0)
 * @param {Function} callback Callback new videos; array of ID of all videos from initial "videos"
 */
function checkNewVideos(videos, lastVideosID, callback) {
    const newlastVideosID = videos.map(video => video.id);
    if (!lastVideosID || lastVideosID.length === 0) return callback(videos, newlastVideosID, true);

    const newVideos = videos.filter(video => lastVideosID.indexOf(video.id) === -1);
    return callback(newVideos, newlastVideosID);
}

/**
 * Send a notification
 * @param {"live" | "1video" | "videos"} eventType For what event  
 * @param {string} iconUrl URL of the image displayed with the notif
 * @param {string} eventDesc Small text about the event (such as Title of a video) 
 * @param {string} redirectUrl URL to which the user will be redirected
 * @param {boolean} playSound Should the notification play a sound
 */
function sendNotif(eventType, iconUrl, eventDesc, url) {
    let notif = {
        type: "basic",
        message: params.name + " ",
        iconUrl,
    };

    switch (eventType) {
        case "live":
            notif.title = `${params.name} - LIVE`;
            notif.message += `est en live !\n>> ${eventDesc}`;
            break;
        case "1video":
            notif.title = `${params.name} - VIDEO`;
            notif.message += `a sorti une nouvelle vidéo !\n>> ${eventDesc}`;
            break;
        case "videos":
            notif.title = `${params.name} - VIDEOS`;
            notif.message += "a sorti de nouvelles vidéos sur sa chaîne YouTube !";
            break;
    }

    if (params.software === "firefox") {
        notif.message += "\nCliquez sur la notification pour regarder.";
    }

    browser.notifications.create(notif).then(createdId => {
        if (tmp.playSound && params.notifSound) {
            params.notifSound.play();
        }

        browser.notifications.onClicked.addListener((clickedId) => {
            if (clickedId === createdId) {
                browser.notifications.clear(clickedId);
                browser.tabs.create({ url });
            }
        });
    });
}

/**
 * Change the icon and the title of the button
 * @param {"online" | "offline" | "custom"} status Presets
 */
function setStatus(status = "offline", customIcon = "", customTitle = "") {
    let icon, title;
    switch (status) {
        case "online":
            tmp.onAir = true;
            icon = "assets/icons-on/48.png";
            title = `${params.name} est en live ! Cliquez pour y accéder.`;
            break;
        case "offline":
            tmp.onAir = false;
            icon = "assets/icons-off/48.png";
            title = `${params.name} est hors-ligne ! Cliquez pour accéder à sa chaîne.`;
            break;
        default:
            icon = customIcon;
            title = customTitle;
            break;
    }

    browser.browserAction.setIcon({ path: icon });
    browser.browserAction.setTitle({ title });
}

/**
 * Test if an object is empty 
 * @param {object} obj The object to test
 */
function isEmpty(obj) {
    for (let x in obj) { return false; }
    return true;
}

/**
 * Returns useful vars from background page
 * Use this in options or popup
 */
function getUsefulVars() {
    return { tmp, params };
}

function capsFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
