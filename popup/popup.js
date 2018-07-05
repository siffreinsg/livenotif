const bg = browser.extension.getBackgroundPage();
const onAir = Object.keys(bg.currentStream).length > 0;
bg.dontBlink = true;

timeago.register("fr_FR", (number, index) => {
    return [
        ["À l'instant", "dans un instant"],
        ["Depuis %s secondes", "dans %s secondes"],
        ["Depuis 1 minute", "dans 1 minute"],
        ["Depuis %s minutes", "dans %s minutes"],
        ["Depuis 1 heure", "dans 1 heure"],
        ["Depuis %s heures", "dans %s heures"],
        ["Depuis 1 jour", "dans 1 jour"],
        ["Depuis %s jours", "dans %s jours"],
        ["Depuis 1 semaine", "dans 1 semaine"],
        ["Depuis %s semaines", "dans %s semaines"],
        ["Depuis 1 mois", "dans 1 mois"],
        ["Depuis %s mois", "dans %s mois"],
        ["Depuis 1 an", "dans 1 an"],
        ["Depuis %s ans", "dans %s ans"]
    ][index];
});

if (onAir) {
    let popupTitle = document.createTextNode(bg.config.displayName + " est en live!");
    let streamId = bg.currentStream.origin === "youtube" ? bg.currentStream.id.videoId : bg.currentStream.id;
    let streamTitle = bg.currentStream.origin === "youtube" ? bg.currentStream.snippet.title : bg.currentStream.title;
    let streamUrl = bg.currentStream.origin === "youtube" ? `https://youtu.be/${streamId}` : `https://twitch.tv/${bg.config.IDs.twitch}`;
    let streamStart = new Date(bg.currentStream.origin === "youtube" ? bg.currentStream.snippet.publishedAt : bg.currentStream.started_at);

    document.getElementById("title").appendChild(popupTitle);
    document.getElementById("game").appendChild(document.createTextNode(streamTitle));
    document.getElementById("since").appendChild(document.createTextNode(timeago().format(streamStart, "fr_FR")));
    document.getElementById("url").href = streamUrl;
}

let todelete = document.getElementById(onAir ? "is-offline" : "is-online");
todelete.parentNode.removeChild(todelete);

const socials = bg.config.socials;
Object.keys(socials).forEach((key) => {
    let link = socials[key];

    if (link.length < 1) {
        let todelete = document.getElementById(key);
        todelete.parentNode.removeChild(todelete);
    } else {
        document.getElementById("a-" + key).href = link;
    }
});

let footerChilds = document.getElementById("footer").children;
for (var i = 0; i < footerChilds.length; i++) {
    footerChilds[i].style.width = (width = 100.0 / footerChilds.length) + "%";
}
